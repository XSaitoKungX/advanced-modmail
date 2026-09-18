import { sql } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { parseGuildConfig } from "../src/config/guild/index.js";
import {
  createDatabase,
  createGuildConfigRepository,
  runMigrations,
  type DatabaseClient,
} from "../src/database/index.js";

// Integration tests run only when DATABASE_TEST_URL points at a disposable
// Postgres (see docker-compose.yml); CI without it skips this suite.
const url = process.env.DATABASE_TEST_URL;
const suite = url === undefined ? describe.skip : describe;

const GUILD_A = "111111111111111111";
const GUILD_B = "222222222222222222";

suite("database integration", () => {
  let client: DatabaseClient;
  let repo: ReturnType<typeof createGuildConfigRepository>;

  beforeAll(async () => {
    client = createDatabase(url as string);
    await runMigrations(client);
    repo = createGuildConfigRepository(client.db);
  });

  beforeEach(async () => {
    await client.db.execute(sql`delete from guild_configs`);
  });

  afterAll(async () => {
    await client.close();
  });

  it("healthCheck reports a reachable database", async () => {
    expect(await client.healthCheck()).toBe(true);
  });

  it("saves and reads back a guild config", async () => {
    const config = parseGuildConfig({ version: 1, locale: "de-DE" });
    await repo.save(GUILD_A, config);
    const loaded = await repo.findByGuildId(GUILD_A);
    expect(loaded).not.toBeNull();
    expect(loaded?.locale).toBe("de-DE");
    expect(loaded?.version).toBe(1);
  });

  it("returns null for an unknown guild", async () => {
    expect(await repo.findByGuildId(GUILD_A)).toBeNull();
  });

  it("upserts on save and keeps one row per guild", async () => {
    await repo.save(GUILD_A, parseGuildConfig({ version: 1 }));
    await repo.save(
      GUILD_A,
      parseGuildConfig({
        version: 1,
        staffRoleIds: ["123456789012345678"],
      }),
    );
    const loaded = await repo.findByGuildId(GUILD_A);
    expect(loaded?.staffRoleIds).toEqual(["123456789012345678"]);
    const count = await client.db.execute(
      sql`select count(*)::int as n from guild_configs where guild_id = ${GUILD_A}`,
    );
    expect(count[0]?.["n"]).toBe(1);
  });

  it("keeps tenant data isolated per guild", async () => {
    await repo.save(GUILD_A, parseGuildConfig({ version: 1, locale: "de-DE" }));
    expect(await repo.findByGuildId(GUILD_B)).toBeNull();
    const loaded = await repo.findByGuildId(GUILD_A);
    expect(loaded?.locale).toBe("de-DE");
  });

  it("deletes a guild config", async () => {
    await repo.save(GUILD_A, parseGuildConfig({ version: 1 }));
    expect(await repo.delete(GUILD_A)).toBe(true);
    expect(await repo.delete(GUILD_A)).toBe(false);
    expect(await repo.findByGuildId(GUILD_A)).toBeNull();
  });
});
