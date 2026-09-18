import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

// Load .env the same way src/config/env does at runtime, so a
// DATABASE_URL configured only in .env is honored by drizzle-kit
// commands instead of silently falling back to the local dev database.
config({ quiet: true });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema/index.ts",
  out: "./src/database/migrations",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://relaya:relaya-dev@localhost:5433/relaya",
  },
});
