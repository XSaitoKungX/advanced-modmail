import { guildConfigV1Schema, type GuildConfigV1 } from "./schema-v1.js";

export { guildConfigV1Schema } from "./schema-v1.js";
export type { GuildConfigV1 } from "./schema-v1.js";

export const GUILD_CONFIG_VERSION = 1;

export type GuildConfig = GuildConfigV1;

export interface ConfigIssue {
  path: string;
  message: string;
}

export class ConfigValidationError extends Error {
  readonly issues: readonly ConfigIssue[];

  constructor(issues: readonly ConfigIssue[]) {
    super(
      `Invalid guild configuration: ${issues
        .map((issue) => `${issue.path} ${issue.message}`)
        .join("; ")}`,
    );
    this.name = "ConfigValidationError";
    this.issues = issues;
  }
}

type Migration = (raw: unknown) => unknown;

// Upgrades a stored config document from version N to N+1, keyed by the
// version it upgrades FROM. Future schema versions append entries here.
const MIGRATIONS = new Map<number, Migration>();

function readVersion(raw: unknown): number {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "version" in raw &&
    typeof raw.version === "number"
  ) {
    return raw.version;
  }
  throw new ConfigValidationError([
    { path: "version", message: "is required and must be a number" },
  ]);
}

export function parseGuildConfig(raw: unknown): GuildConfig {
  const version = readVersion(raw);
  if (version > GUILD_CONFIG_VERSION) {
    throw new ConfigValidationError([
      {
        path: "version",
        message: `${String(version)} is newer than supported version ${String(GUILD_CONFIG_VERSION)}`,
      },
    ]);
  }

  let candidate = raw;
  for (let v = version; v < GUILD_CONFIG_VERSION; v++) {
    const migrate = MIGRATIONS.get(v);
    if (migrate === undefined) {
      throw new ConfigValidationError([
        {
          path: "version",
          message: `no migration registered from version ${String(v)}`,
        },
      ]);
    }
    candidate = migrate(candidate);
  }

  const result = guildConfigV1Schema.safeParse(candidate);
  if (result.success) {
    return Object.freeze(result.data);
  }
  throw new ConfigValidationError(
    result.error.issues.map((issue) => ({
      path: issue.path.join(".") || "config",
      message: issue.message,
    })),
  );
}
