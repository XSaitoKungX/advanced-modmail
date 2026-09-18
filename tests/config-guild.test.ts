import { describe, expect, it } from "vitest";
import {
  ConfigValidationError,
  parseGuildConfig,
} from "../src/config/guild/index.js";

const VALID_CONFIG = {
  version: 1,
  locale: "de-DE",
  staffRoleIds: ["123456789012345678"],
  logChannelId: "234567890123456789",
};

describe("parseGuildConfig", () => {
  it("parses a valid config and applies defaults", () => {
    const config = parseGuildConfig(VALID_CONFIG);
    expect(config.version).toBe(1);
    expect(config.locale).toBe("de-DE");
    expect(config.staffRoleIds).toEqual(["123456789012345678"]);
    expect(config.logChannelId).toBe("234567890123456789");
    expect(config.features.transcripts).toBe(true);
  });

  it("defaults locale to en-US and lists to empty", () => {
    const config = parseGuildConfig({ version: 1 });
    expect(config.locale).toBe("en-US");
    expect(config.staffRoleIds).toEqual([]);
    expect(config.logChannelId).toBeUndefined();
  });

  it("rejects missing version", () => {
    expect(() => parseGuildConfig({ locale: "en-US" })).toThrow(
      ConfigValidationError,
    );
  });

  it("rejects a newer unsupported version", () => {
    expect(() => parseGuildConfig({ version: 99 })).toThrow(
      ConfigValidationError,
    );
  });

  it("rejects an older version without a registered migration", () => {
    expect(() => parseGuildConfig({ version: 0 })).toThrow(
      ConfigValidationError,
    );
  });

  it("rejects unknown keys (strict schema)", () => {
    expect(() => parseGuildConfig({ version: 1, unknownField: true })).toThrow(
      ConfigValidationError,
    );
  });

  it("rejects unknown keys inside nested objects", () => {
    expect(() =>
      parseGuildConfig({ version: 1, features: { transcipts: false } }),
    ).toThrow(ConfigValidationError);
  });

  it("rejects malformed snowflake IDs", () => {
    expect(() =>
      parseGuildConfig({ version: 1, staffRoleIds: ["not-a-snowflake"] }),
    ).toThrow(ConfigValidationError);
    expect(() => parseGuildConfig({ version: 1, logChannelId: "abc" })).toThrow(
      ConfigValidationError,
    );
  });

  it("rejects an unsupported locale", () => {
    expect(() => parseGuildConfig({ version: 1, locale: "fr-FR" })).toThrow(
      ConfigValidationError,
    );
  });

  it("returns a deeply frozen configuration object", () => {
    const config = parseGuildConfig(VALID_CONFIG);
    expect(Object.isFrozen(config)).toBe(true);
    expect(Object.isFrozen(config.features)).toBe(true);
    expect(Object.isFrozen(config.staffRoleIds)).toBe(true);
    expect(() => {
      (config.features as { transcripts: boolean }).transcripts = false;
    }).toThrow(TypeError);
  });
});
