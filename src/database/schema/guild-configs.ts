import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// Tenant-scoped guild configuration. `version` mirrors the version inside
// the jsonb document so migration scans can filter without unpacking it.
export const guildConfigs = pgTable("guild_configs", {
  guildId: text("guild_id").primaryKey(),
  version: integer("version").notNull(),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
