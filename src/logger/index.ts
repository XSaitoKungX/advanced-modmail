import { pino, type DestinationStream, type Logger } from "pino";
import type { LogLevel } from "../config/env/index.js";

export type { Logger } from "pino";

// Keys whose values must never reach log output (SECURITY.md). Redaction is
// applied at root and up to three levels of object nesting.
const SENSITIVE_KEYS = [
  "token",
  "authorization",
  "password",
  "secret",
  "apiKey",
  "accessToken",
  "refreshToken",
  "privateKey",
  "DISCORD_TOKEN",
  "DATABASE_URL",
] as const;

const REDACT_PATHS = SENSITIVE_KEYS.flatMap((key) => [
  key,
  `*.${key}`,
  `*.*.${key}`,
  `*.*.*.${key}`,
]);

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
      },
      redact: {
        paths: REDACT_PATHS,
        censor: "[redacted]",
      },
    },
    destination,
  );
}
