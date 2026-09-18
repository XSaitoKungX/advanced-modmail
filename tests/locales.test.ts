import { describe, expect, it } from "vitest";
import {
  DEFAULT_LOCALE,
  resolveLocale,
  SUPPORTED_LOCALES,
  translate,
} from "../src/locales/index.js";

describe("resolveLocale", () => {
  it("returns the first supported candidate", () => {
    expect(resolveLocale("fr-FR", "de-DE")).toBe("de-DE");
    expect(resolveLocale("de-DE", "en-US")).toBe("de-DE");
  });

  it("skips null and undefined candidates", () => {
    expect(resolveLocale(undefined, null, "en-US")).toBe("en-US");
  });

  it("falls back to the default locale", () => {
    expect(resolveLocale()).toBe(DEFAULT_LOCALE);
    expect(resolveLocale("fr-FR")).toBe(DEFAULT_LOCALE);
    expect(resolveLocale(undefined, null)).toBe(DEFAULT_LOCALE);
  });
});

describe("translate", () => {
  it("returns the translated string for a known key", () => {
    expect(translate("de-DE", "common.cancel")).toBe("Abbrechen");
    expect(translate("en-US", "common.cancel")).toBe("Cancel");
  });

  it("falls back per key to en-US when the locale lacks a translation", () => {
    expect(translate("de-DE", "dev.debugOnly")).toBe("Debug details: {detail}");
  });

  it("interpolates parameters", () => {
    expect(translate("en-US", "dev.debugOnly", { detail: "routing" })).toBe(
      "Debug details: routing",
    );
  });

  it("keeps the placeholder when a parameter is missing", () => {
    expect(translate("en-US", "dev.debugOnly")).toBe("Debug details: {detail}");
  });

  it("returns the literal key for unknown keys", () => {
    // MessageKey is typed, but catalogs evolve at runtime; guard the path.
    expect(translate("en-US", "missing.key" as never)).toBe("missing.key");
  });

  it("catalogs cover the declared locales", () => {
    expect(SUPPORTED_LOCALES).toContain("de-DE");
    expect(SUPPORTED_LOCALES).toContain("en-US");
  });
});
