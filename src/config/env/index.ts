import { config as loadEnvFiles } from "@dotenvx/dotenvx";
import { envSchema, type EnvConfig } from "./schema.js";

export { envSchema } from "./schema.js";
export type { EnvConfig, LogLevel } from "./schema.js";
export { LOG_LEVELS } from "./schema.js";

// Values of these variables must never appear in logs or error output.
const SECRET_VARS = new Set(["DISCORD_TOKEN", "DATABASE_URL"]);

export interface EnvIssue {
  name: string;
  message: string;
}

export class EnvValidationError extends Error {
  readonly issues: readonly EnvIssue[];

  constructor(issues: readonly EnvIssue[]) {
    super(
      `Invalid environment configuration: ${issues
        .map((issue) => `${issue.name} ${issue.message}`)
        .join("; ")}`,
    );
    this.name = "EnvValidationError";
    this.issues = issues;
  }
}

export function loadEnv(source?: NodeJS.ProcessEnv): EnvConfig {
  const env = source ?? process.env;
  if (source === undefined) {
    // quiet: library output must not bypass the logger abstraction.
    loadEnvFiles({ quiet: true });
  }
  const result = envSchema.safeParse(env);
  if (result.success) {
    return Object.freeze(result.data);
  }
  throw new EnvValidationError(
    result.error.issues.map((issue) => {
      const name = String(issue.path[0] ?? "unknown");
      return {
        name,
        message: SECRET_VARS.has(name)
          ? "is missing or invalid"
          : issue.message,
      };
    }),
  );
}
