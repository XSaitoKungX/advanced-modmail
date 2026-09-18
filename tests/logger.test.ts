import { Writable } from "node:stream";
import { describe, expect, it } from "vitest";
import type { DestinationStream } from "pino";
import { createLogger } from "../src/logger/index.js";

function capture(): {
  stream: DestinationStream;
  lines: () => Record<string, unknown>[];
  raw: () => string;
} {
  const chunks: string[] = [];
  const stream = new Writable({
    write(chunk, _encoding, callback) {
      chunks.push(String(chunk));
      callback();
    },
  }) as DestinationStream;
  return {
    stream,
    lines: () =>
      chunks.map((line) => JSON.parse(line) as Record<string, unknown>),
    raw: () => chunks.join(""),
  };
}

describe("createLogger", () => {
  it("emits structured JSON with string level and message key", () => {
    const { stream, lines } = capture();
    createLogger({ destination: stream }).info("hello");
    const [entry] = lines();
    expect(entry?.level).toBe("info");
    expect(entry?.msg).toBe("hello");
    expect(entry?.time).toBeTypeOf("number");
  });

  it("respects the configured log level", () => {
    const { stream, lines } = capture();
    const logger = createLogger({ level: "warn", destination: stream });
    logger.debug("hidden");
    logger.info("also hidden");
    logger.warn("shown");
    expect(lines()).toHaveLength(1);
    expect(lines()[0]?.msg).toBe("shown");
  });

  it("redacts sensitive keys at root level", () => {
    const { stream, raw, lines } = capture();
    createLogger({ destination: stream }).info({
      token: "leak-me-token",
      password: "leak-me-password",
    });
    expect(raw()).not.toContain("leak-me-token");
    expect(raw()).not.toContain("leak-me-password");
    const [entry] = lines();
    expect(entry?.token).toBe("[redacted]");
    expect(entry?.password).toBe("[redacted]");
  });

  it("redacts sensitive keys in nested objects", () => {
    const { stream, raw } = capture();
    createLogger({ destination: stream }).info({
      discord: { credentials: { token: "nested-secret", id: "1" } },
      headers: { authorization: "Bearer abc" },
    });
    expect(raw()).not.toContain("nested-secret");
    expect(raw()).not.toContain("Bearer abc");
  });

  it("redacts environment credential names", () => {
    const { stream, raw } = capture();
    createLogger({ destination: stream }).info({
      DISCORD_TOKEN: "token-value",
      DATABASE_URL: "postgresql://u:p@h/db",
    });
    expect(raw()).not.toContain("token-value");
    expect(raw()).not.toContain("postgresql://u:p@h/db");
  });

  it("redacts keys at arbitrary nesting depth", () => {
    const { stream, raw } = capture();
    createLogger({ destination: stream }).info({
      request: {
        context: {
          integration: {
            credentials: { accessToken: "deep-secret", ok: true },
          },
        },
      },
    });
    expect(raw()).not.toContain("deep-secret");
  });

  it("redacts keys regardless of casing", () => {
    const { stream, raw } = capture();
    createLogger({ destination: stream }).info({
      headers: { Authorization: "Bearer abc", "X-Other": "1" },
      credentials: { AccessToken: "case-secret" },
    });
    expect(raw()).not.toContain("Bearer abc");
    expect(raw()).not.toContain("case-secret");
  });

  it("redacts sensitive values in child bindings", () => {
    const { stream, raw } = capture();
    const logger = createLogger({ destination: stream });
    logger.child({ token: "binding-secret", module: "x" }).info("hi");
    expect(raw()).not.toContain("binding-secret");
  });

  it("includes base fields and child context", () => {
    const { stream, lines } = capture();
    const logger = createLogger({
      destination: stream,
      base: { service: "relaya" },
    });
    logger.child({ module: "config" }).info("loaded");
    const [entry] = lines();
    expect(entry?.service).toBe("relaya");
    expect(entry?.module).toBe("config");
  });
});
