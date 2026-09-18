import { pino, type DestinationStream, type Logger } from "pino";
import type { LogLevel } from "../config/env/index.js";

export type { Logger } from "pino";

const CENSOR = "[redacted]";

// Keys whose values must never reach log output (SECURITY.md). Matching is
// case-insensitive so forms like the HTTP `Authorization` header are covered.
const SENSITIVE_KEYS = new Set([
  "token",
  "authorization",
  "password",
  "secret",
  "apikey",
  "accesstoken",
  "refreshtoken",
  "privatekey",
  "discord_token",
  "database_url",
]);

function redactValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item));
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = SENSITIVE_KEYS.has(key.toLowerCase())
        ? CENSOR
        : redactValue(child);
    }
    return out;
  }
  return value;
}

// Child bindings bypass formatters.log, so a bounded path-based redaction
// stays as a second layer for them. Common case variants are included
// because pino redact paths are case-sensitive.
const REDACT_KEYS = [
  "token",
  "authorization",
  "Authorization",
  "password",
  "secret",
  "apiKey",
  "apikey",
  "accessToken",
  "refreshToken",
  "privateKey",
  "DISCORD_TOKEN",
  "DATABASE_URL",
];

const REDACT_PATHS = REDACT_KEYS.flatMap((key) =>
  Array.from({ length: 7 }, (_, depth) => `${"*.".repeat(depth)}${key}`),
);

export interface CreateLoggerOptions {
  level?: LogLevel;
  destination?: DestinationStream;
  base?: Record<string, unknown>;
}

export function createLogger(options: CreateLoggerOptions = {}): Logger {
  const { level = "info", destination, base } = options;
  return pino(
    {
      level,
      ...(base === undefined ? {} : { base }),
      messageKey: "msg",
      formatters: {
        level: (label) => ({ level: label }),
        log: (object) => redactValue(object) as Record<string, unknown>,
      },
      redact: {
        paths: REDACT_PATHS,
        censor: CENSOR,
      },
    },
    destination,
  );
}
