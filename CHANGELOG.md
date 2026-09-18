# Changelog

All notable changes to this project will be documented in this file.

The format follows the principles of Keep a Changelog and the project intends to use Semantic Versioning once releases begin.

## [Unreleased]

### Added

- Initial repository governance and project-foundation documentation.
- TypeScript application toolchain: strict TypeScript 7 build, ESLint flat config, Prettier, Vitest, pnpm lockfile, and CI workflow.
- Application architecture skeleton: `domain`, `application`, `infrastructure`, `transport`, and `presentation` layers under `src/` with lint-enforced dependency boundaries.
- Environment variable schema validation under `src/config/env/` (zod): `loadEnv()` validates `process.env` and throws `EnvValidationError` listing invalid variables without echoing secret values.
- `.env` file loading via `@dotenvx/dotenvx` inside `loadEnv()` when reading the real environment (injected sources bypass file loading).
- Structured logger abstraction under `src/logger/` (pino): `createLogger()` factory with level filtering from `LogLevel`, JSON output, and mandatory recursive case-insensitive redaction of credential keys.
- CI audit job running `pnpm audit --prod --audit-level=high` against production dependencies.
- Versioned guild-configuration infrastructure under `src/config/guild/`: strict zod schema v1 (Discord snowflake validation, locale enum, feature defaults) and `parseGuildConfig()` with an explicit migration chain and `ConfigValidationError` for unsupported or unmigratable versions.
- Locale catalogs and deterministic fallback under `src/locales/`: typed `en-US` reference catalog, partial `de-DE` catalog, `resolveLocale()` priority resolution, and `translate()` with per-key en-US fallback and `{param}` interpolation.
- Centralized Discord contracts under `src/discord/`: opt-in `MentionsPolicy` (`resolveMentions`, no representable `@everyone`/`@here`), `RenderedMessage`/`ViewRenderer` rendering contracts, and `FormattingPipeline` token contracts for the Discord message-format pipeline.
- PostgreSQL persistence layer under `src/database/` (Drizzle ORM + postgres.js, ADR-0002): `createDatabase()` lifecycle with health check and graceful close, `drizzle-kit` generated SQL migrations (forward-only, applied via `pnpm db:migrate`), tenant-scoped `GuildConfigRepository` with versioned jsonb documents re-validated on read, and `docker-compose.yml` Postgres for local dev plus `DATABASE_TEST_URL`-gated integration tests.

### Changed

- Replaced the preliminary five-layer `src/` skeleton (`domain`, `application`, `infrastructure`, `transport`, `presentation`) with a Discord-native modular project structure; separation-of-concerns requirements are retained through module responsibilities instead of layer folders (see `docs/adr/0001-discord-native-project-structure.md`).
- Moved the planned application entry point to repository-root `index.ts` (`dist/index.js`).
- Replaced the layer-specific ESLint boundary rules with a lint rule centralizing `process.env` access under `src/config/`.

No versioned release has been published yet.
