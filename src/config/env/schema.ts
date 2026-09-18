import { z } from "zod";

export const LOG_LEVELS = [
  "fatal",
  "error",
  "warn",
  "info",
  "debug",
  "trace",
] as const;

export type LogLevel = (typeof LOG_LEVELS)[number];

export const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1),
  DISCORD_CLIENT_ID: z
    .string()
    .regex(/^\d{17,20}$/, "must be a Discord snowflake ID"),
  // Optional until the Phase 2 persistence layer consumes it.
  DATABASE_URL: z.url().optional(),
  LOG_LEVEL: z.enum(LOG_LEVELS).default("info"),
});

export type EnvConfig = z.infer<typeof envSchema>;
