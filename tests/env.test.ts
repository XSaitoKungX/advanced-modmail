import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { EnvValidationError, loadEnv } from "../src/config/env/index.js";

const VALID_ENV = {
  DISCORD_TOKEN: "test-token",
  DISCORD_CLIENT_ID: "123456789012345678",
};

describe("loadEnv", () => {
  it("parses a valid environment and applies defaults", () => {
    const config = loadEnv(VALID_ENV);
    expect(config.DISCORD_TOKEN).toBe("test-token");
    expect(config.DISCORD_CLIENT_ID).toBe("123456789012345678");
    expect(config.LOG_LEVEL).toBe("info");
    expect(config.DATABASE_URL).toBeUndefined();
  });

  it("rejects a missing DISCORD_TOKEN", () => {
    expect(() => loadEnv({ DISCORD_CLIENT_ID: "123456789012345678" })).toThrow(
      EnvValidationError,
    );
  });

  it("rejects a malformed DISCORD_CLIENT_ID", () => {
    expect(() =>
      loadEnv({ ...VALID_ENV, DISCORD_CLIENT_ID: "not-a-snowflake" }),
    ).toThrow(EnvValidationError);
  });

  it("accepts a valid DATABASE_URL and rejects an invalid one", () => {
    const config = loadEnv({
      ...VALID_ENV,
      DATABASE_URL: "postgresql://user:pass@localhost:5432/relaya",
    });
    expect(config.DATABASE_URL).toBe(
      "postgresql://user:pass@localhost:5432/relaya",
    );
    expect(() => loadEnv({ ...VALID_ENV, DATABASE_URL: "not a url" })).toThrow(
      EnvValidationError,
    );
  });

  it("rejects an unknown LOG_LEVEL", () => {
    expect(() => loadEnv({ ...VALID_ENV, LOG_LEVEL: "verbose" })).toThrow(
      EnvValidationError,
    );
  });

  it("never echoes secret values in error output", () => {
    try {
      loadEnv({ ...VALID_ENV, DATABASE_URL: "marker-SECRET-leak" });
      expect.unreachable("loadEnv should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(EnvValidationError);
      const message = (error as EnvValidationError).message;
      expect(message).not.toContain("marker-SECRET-leak");
      expect(message).toContain("DATABASE_URL");
    }
  });

  it("reports issues for non-secret variables", () => {
    try {
      loadEnv({ ...VALID_ENV, LOG_LEVEL: "verbose" });
      expect.unreachable("loadEnv should have thrown");
    } catch (error) {
      const issues = (error as EnvValidationError).issues;
      expect(issues.some((issue) => issue.name === "LOG_LEVEL")).toBe(true);
    }
  });

  it("ignores unrelated variables", () => {
    const config = loadEnv({ ...VALID_ENV, PATH: "/usr/bin" });
    expect(config.DISCORD_TOKEN).toBe("test-token");
  });

  it("returns a frozen configuration object", () => {
    const config = loadEnv(VALID_ENV);
    expect(Object.isFrozen(config)).toBe(true);
  });
});

describe("loadEnv real-environment branch", () => {
  let dir: string;
  let originalCwd: string;
  let envSnapshot: NodeJS.ProcessEnv;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "relaya-env-"));
    originalCwd = process.cwd();
    envSnapshot = { ...process.env };
    process.chdir(dir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    process.env = envSnapshot;
    rmSync(dir, { recursive: true, force: true });
  });

  it("loads .env through dotenvx when no source is injected", () => {
    writeFileSync(
      join(dir, ".env"),
      "DISCORD_TOKEN=from-dotenv-file\nDISCORD_CLIENT_ID=123456789012345678\n",
    );
    delete process.env.DISCORD_TOKEN;
    delete process.env.DISCORD_CLIENT_ID;
    const config = loadEnv();
    expect(config.DISCORD_TOKEN).toBe("from-dotenv-file");
    expect(config.DISCORD_CLIENT_ID).toBe("123456789012345678");
  });

  it("injected sources bypass .env file loading", () => {
    writeFileSync(
      join(dir, ".env"),
      "DISCORD_TOKEN=must-not-be-used\nDISCORD_CLIENT_ID=000000000000000000\n",
    );
    const config = loadEnv(VALID_ENV);
    expect(config.DISCORD_TOKEN).toBe("test-token");
    expect(config.DISCORD_CLIENT_ID).toBe("123456789012345678");
  });
});
