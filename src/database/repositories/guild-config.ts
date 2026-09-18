import { eq } from "drizzle-orm";
import {
  GUILD_CONFIG_VERSION,
  parseGuildConfig,
  type GuildConfig,
} from "../../config/guild/index.js";
import type { Database } from "../client.js";
import { guildConfigs } from "../schema/guild-configs.js";

// Every operation takes an explicit guildId; there is intentionally no API
// for cross-tenant reads or writes.
export interface GuildConfigRepository {
  findByGuildId(guildId: string): Promise<GuildConfig | null>;
  save(guildId: string, config: GuildConfig): Promise<void>;
  delete(guildId: string): Promise<boolean>;
}

export function createGuildConfigRepository(
  db: Database,
): GuildConfigRepository {
  return {
    async findByGuildId(guildId) {
      const rows = await db
        .select({ config: guildConfigs.config })
        .from(guildConfigs)
        .where(eq(guildConfigs.guildId, guildId))
        .limit(1);
      const row = rows[0];
      if (row === undefined) {
        return null;
      }
      // Stored documents pass through the same validation + migration chain
      // as fresh input, so older rows surface as current-version configs.
      return parseGuildConfig(row.config);
    },

    async save(guildId, config) {
      await db
        .insert(guildConfigs)
        .values({
          guildId,
          version: GUILD_CONFIG_VERSION,
          config,
        })
        .onConflictDoUpdate({
          target: guildConfigs.guildId,
          set: {
            version: GUILD_CONFIG_VERSION,
            config,
            updatedAt: new Date(),
          },
        });
    },

    async delete(guildId) {
      const deleted = await db
        .delete(guildConfigs)
        .where(eq(guildConfigs.guildId, guildId))
        .returning({ guildId: guildConfigs.guildId });
      return deleted.length > 0;
    },
  };
}
