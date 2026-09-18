import { z } from "zod";
import { SUPPORTED_LOCALES } from "../../locales/index.js";

const snowflake = z
  .string()
  .regex(/^\d{17,20}$/, "must be a Discord snowflake ID");

export const guildConfigV1Schema = z
  .object({
    version: z.literal(1),
    locale: z.enum(SUPPORTED_LOCALES).default("en-US"),
    staffRoleIds: z.array(snowflake).default([]),
    logChannelId: snowflake.optional(),
    features: z
      .object({
        transcripts: z.boolean().default(true),
      })
      .prefault({}),
  })
  .strict();

export type GuildConfigV1 = z.infer<typeof guildConfigV1Schema>;
