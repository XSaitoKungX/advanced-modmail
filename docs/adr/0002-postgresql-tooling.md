# ADR-0002: PostgreSQL tooling (Drizzle ORM + drizzle-kit)

## Status

Accepted

## Context

Phase 2 needs a query layer and a migration workflow for PostgreSQL. The
project values explicitness, reviewable schema changes, tenant isolation,
and minimal runtime magic. Candidates considered:

- **Drizzle ORM** - schema defined in TypeScript, `drizzle-kit` generates
  plain SQL migrations, thin runtime without generated client code.
- **Kysely** - type-safe query builder without ORM features; maximal
  control but weaker migration tooling and more repository infrastructure
  to build.
- **Prisma** - schema DSL plus generated client and migrate engine; most
  batteries included but heavy codegen, larger runtime, and more
  indirection than this codebase wants.

## Decision

- Query layer: **Drizzle ORM** (`drizzle-orm`) with the **postgres.js**
  driver (`postgres`).
- Migrations: **`drizzle-kit`** generates SQL migration files under
  `src/database/migrations/`; `pnpm db:migrate` applies them.
- Schema definition: `pgTable` declarations in `src/database/schema/`,
  the single source for both the typed client and generated migrations.
- Integration tests: a dedicated `docker-compose.yml` Postgres service;
  tests run only when `DATABASE_TEST_URL` is set, otherwise they skip.

## Consequences

- Migration files are generated SQL reviewed in Git and never edited after
  merge; rollbacks are new forward migrations.
- The application does not auto-migrate at startup; schema changes are an
  explicit operator action (`pnpm db:migrate`).
- Stored guild-config documents are re-validated through
  `parseGuildConfig()` on every read, so document-level version upgrades
  happen at the repository boundary rather than in SQL.
- Drizzle's repository-facing API keeps raw SQL available via
  `db.execute()` where typed queries are insufficient.
