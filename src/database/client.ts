import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

export type Database = PostgresJsDatabase<typeof schema>;

// Explicit lifecycle: the composition root creates one client, passes it to
// consumers, and closes it during graceful shutdown. No global pool.
export interface DatabaseClient {
  readonly db: Database;
  healthCheck(): Promise<boolean>;
  close(): Promise<void>;
}

export interface DatabaseOptions {
  // postgres.js pool size; keep small for a single-process bot.
  readonly maxConnections?: number;
}

export function createDatabase(
  url: string,
  options: DatabaseOptions = {},
): DatabaseClient {
  const sql = postgres(url, {
    max: options.maxConnections ?? 5,
    // DDL is handled by migrations; no need for prepared statements to be
    // disabled, but keep idle cleanup bounded.
    idle_timeout: 30,
  });
  const db = drizzle(sql, { schema });

  return {
    db,
    async healthCheck() {
      try {
        await sql`select 1`;
        return true;
      } catch {
        return false;
      }
    },
    async close() {
      await sql.end({ timeout: 5 });
    },
  };
}
