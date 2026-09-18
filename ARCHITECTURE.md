# Architecture

## Purpose

Relaya is designed as a modular Discord support platform rather than a collection of command handlers. The architecture must preserve clear boundaries between Discord transport, business rules, persistence, rendering, configuration, integrations, and operational concerns.

## Architectural goals

- Multi-guild support without cross-guild data leakage.
- Horizontal scalability without redesigning business logic.
- Reliable delivery and idempotent processing of external events.
- Auditable moderation and configuration changes.
- Replaceable infrastructure adapters.
- Testable business behavior without requiring a live Discord connection.
- Safe self-hosting with explicit migrations and configuration validation.
- Configuration-first operation without source edits for normal customization.
- First-class internationalization.
- Transport-independent modmail flows across supported Discord surfaces.

## Initial runtime baseline

- Runtime: Node.js 24 LTS
- Language: TypeScript 7 in strict mode
- Package manager: pnpm 12
- Discord library: discord.js 14
- Primary database: PostgreSQL

Redis is not a mandatory dependency at project start. It should be introduced only when queues, distributed locks, rate-limit coordination, caching, or multi-process coordination require it.

## Source layout

Relaya is a single application: one repository, one root `package.json`, one build. It is intentionally not a monorepo - no `apps/`, no `packages/`, no nested package manifests.

The project uses a Discord-native modular structure rather than Clean Architecture folder names. The same separation-of-concerns principles apply, but they are expressed through module responsibilities and boundaries instead of physical layer directories. Directories are created when their first implementation lands; `src/README.md` is the canonical reference for the planned tree.

### Entry point and bootstrap

- `index.ts` at the repository root is the single application entry point and stays minimal - startup/composition only - and compiles to `dist/index.js`.
- `src/bootstrap.ts` owns startup wiring: validated configuration, persistence, the Discord client, optional web/API, and graceful shutdown.

### Module responsibilities

- `src/commands/` - Discord command definitions (`slash/`, `message/`). Commands parse interaction context and delegate; they must not contain business logic.
- `src/events/` - Discord event listeners grouped by event area (`client/`, `guild/`, `interaction/`, `message/`). Listeners delegate to handlers and services.
- `src/handlers/` - dispatch/orchestration infrastructure: command, event, component, and error handlers.
- `src/components/` - reusable Discord interaction/UI building blocks using Discord terminology: `buttons/`, `modals/`, `selects/`, `containers/`, `sections/`, `shared/`, and `views/` for composed screens.
- `src/modmail/` - the modmail feature domain organized by concrete responsibility: `threads/`, `routing/`, `messages/`, `transcripts/`, `permissions/`, `moderation/`.
- `src/discord/` - Discord-specific infrastructure: `client/` (client lifecycle), `rendering/` (central Components V2 factories), `formatting/` (Markdown/message-format pipeline), `mentions/` (safe `allowed_mentions` handling).
- `src/config/` - all validated configuration (`env/`, `guild/`, `defaults/`). `process.env` is read only inside `config/` (lint-enforced); feature code consumes validated configuration objects.
- `src/database/` - persistence only: `schema/` (Drizzle table definitions), `migrations/` (generated SQL), `repositories/`, `client.ts` (connection lifecycle), `migrate.ts`. No other module talks to the database driver.
- `src/locales/` - localization resources (`de-DE/`, `en-US/` baseline).
- `src/logger/` - structured logging abstraction (pino) with mandatory secret redaction; consumed via injected logger instances, never a global singleton.
- `src/services/` - cross-feature services, only when no feature module is a better home.
- `src/helpers/` - Discord/project-aware helpers.
- `src/utils/` - genuinely generic utilities only.
- `src/types/` - shared types that cannot live next to their feature.
- `src/constants/` - true implementation constants only; operator-configurable values never live here.
- `web/` - (planned) optional dashboard/API inside the same package.
- `tests/` - Vitest test suite.

### Module boundaries

The discipline normally associated with layered architecture still applies, without the folder ceremony:

- Commands and events stay thin: they parse context and delegate to `handlers/`, `modmail/`, or `services/`.
- Business rules live in feature modules (`src/modmail/`) and services - not in event/command dispatch code, not in Discord payload shapes, and not in persistence code. Business modules must not depend on discord.js transport details, database drivers, HTTP frameworks, environment variables, or Discord component builders.
- Persistence is isolated in `src/database/`; feature modules consume repositories, never the driver.
- Rendering and text formatting are centralized in `src/components/` + `src/discord/rendering/` and `src/discord/formatting/`; feature code does not assemble one-off layouts.
- Environment access is centralized in `src/config/` (lint-enforced).
- Modules avoid circular dependencies and cross-feature coupling; shared contracts live with their owning module or in `src/types/`.
- Where loose coupling matters - for example between the Discord client and feature workflows - a module exposes a narrow interface and receives its dependencies at bootstrap instead of importing deep internals. This is practical dependency injection, not ceremony: do not force every concept into an abstract interface.

## Discord rendering architecture

Bot-generated structured Discord UI uses Components V2 by default where supported.

`Container` is the preferred root layout for structured responses. Rendering must be centralized in `src/components/` and `src/discord/rendering/` so features do not construct unrelated one-off layouts throughout business code.

The renderer should support official Components V2 elements as applicable, including `Text Display`, `Section`, `Separator`, `Media Gallery`, `File`, and action components.

Legacy embeds/components remain adapter-level fallbacks for unsupported surfaces or compatibility cases.

## Text and formatting pipeline

Discord text must pass through a dedicated formatting/rendering boundary rather than being manipulated ad hoc in feature handlers.

Responsibilities include:

- preserve supported Markdown when relaying content,
- preserve/normalize supported Discord message-formatting tokens,
- understand user/role/channel mentions,
- understand command mentions,
- understand static and animated custom emoji markup,
- understand Discord timestamp markup,
- understand supported guild-navigation markup,
- recognize deprecated forms for input compatibility when useful,
- never assume that markup implies notification permission.

Outgoing notification behavior must be controlled explicitly with `allowed_mentions`. User-generated or configurable content must not be allowed to trigger unintended mass mentions or role/user notifications.

## Internationalization architecture

User-facing strings must be obtained from locale resources under `src/locales/` rather than embedded in feature or business logic.

Initial baseline locales:

- `de-DE`
- `en-US`

Locale resolution order must be deterministic. Exact precedence may vary by surface, but should support:

1. explicit user/interaction locale when the feature allows personalized output,
2. guild-configured default locale,
3. application fallback locale.

Configuration-defined templates must be localization-aware. Adding a new locale should require catalog/resource changes, not feature rewrites.

## Configuration architecture

The project targets effectively complete configuration of operator-facing behavior. The practical "99.99% configurable" goal means source edits are not part of normal setup/customization.

Configuration domains may include:

- routing and entry-point modes,
- channels/categories/threads/forums and staff destinations,
- roles and permission policies,
- Components V2 presentation settings and message templates,
- labels, buttons, limits, cooldowns, naming, notifications, and feature toggles,
- transcript/privacy/retention/export behavior,
- logging/audit behavior,
- locales and language defaults.

Configuration must be schema-validated, versioned/migratable, tenant-scoped where appropriate, and safe by default.

Guild configuration documents carry an explicit `version` field. `src/config/guild/` exposes `parseGuildConfig()`, which upgrades stored documents through a registered migration chain to `GUILD_CONFIG_VERSION` and then validates them against the current strict schema. Configs newer than the supported version, or older versions without a registered migration, fail closed with `ConfigValidationError`.

Security invariants, API/protocol constraints, database invariants, and internal implementation constants are not required to be configurable.

## Persistence architecture

PostgreSQL is the primary store. The query layer is Drizzle ORM over the postgres.js driver (see `docs/adr/0002-postgresql-tooling.md`).

- `src/database/schema/` holds `pgTable` declarations - the single source for the typed client and for generated migrations.
- `src/database/migrations/` contains SQL generated by `drizzle-kit` (`pnpm db:generate`). Migration files are reviewed in Git and never edited after merge; rollbacks are new forward migrations.
- The application does not auto-migrate at startup. Operators apply schema changes explicitly with `pnpm db:migrate`.
- `createDatabase()` returns an explicit `DatabaseClient` lifecycle (health check, bounded pool, `close()` for graceful shutdown); there is no global pool or implicit connection.
- Feature code consumes repository interfaces only. Repositories are tenant-scoped: every operation takes an explicit `guildId` and cross-tenant reads have no API surface.
- Stored documents (for example guild configuration jsonb) are re-validated through the configuration layer on every read, so document-level version upgrades happen at the repository boundary.
- Backup and restore expectations are documented in `docs/backup-and-restore.md`.

## Multi-tenancy

Guild ID is the primary tenant boundary.

Rules:

- every tenant-owned database record must be attributable to a guild,
- repository queries must include tenant scope when accessing tenant-owned data,
- caches and locks must include tenant identity in keys,
- authorization must never rely only on a Discord channel/thread identifier,
- tests must include cross-tenant isolation cases.

## Modmail lifecycle

A typical lifecycle is expected to be:

1. User initiates contact through an approved/configured Discord entry point.
2. System resolves guild routing, transport mode, locale, and configuration.
3. The application checks limits, block state, existing open thread, and permissions.
4. Thread is created transactionally.
5. A configured staff-side Discord representation is provisioned.
6. User and staff messages are relayed and persisted according to configured privacy policy.
7. Content rendering preserves supported Markdown/Discord formatting while enforcing safe mention behavior.
8. Staff actions are auditable.
9. Closing a thread finalizes metadata and transcript state.
10. Retention policies determine later deletion/anonymization.

Exact UX and supported route combinations are defined in implementation issues.

## Reliability

External side effects can fail independently. Implementations must account for:

- Discord API rate limits,
- duplicate gateway events,
- process restarts,
- partial database/Discord success,
- stale interactions,
- unavailable external integrations.

Where a use case can be retried, it should have an idempotency strategy. Durable work that cannot safely be lost should eventually use a persistent job/queue mechanism rather than in-memory timers.

## Persistence

PostgreSQL is the system of record for durable application state.

Requirements:

- versioned migrations,
- foreign-key constraints where appropriate,
- unique constraints for invariants,
- transactional state transitions when multiple records must change together,
- timestamps stored in UTC,
- Discord snowflakes stored without numeric precision loss.

## Configuration categories

### Deployment configuration

Secrets and infrastructure values supplied through environment variables or mounted secret mechanisms.

### Guild configuration

Tenant-specific behavior stored in the database and changed through validated commands/dashboard flows.

Do not mix secrets into guild configuration.

## Observability

The runtime should eventually provide:

- structured logs,
- correlation/request IDs,
- health and readiness signals,
- metrics for thread/message/error behavior,
- audit events for privileged actions.

Logs must respect privacy and redaction requirements from `SECURITY.md`.

## Dashboard/API

A web dashboard is an intended extension, with clear constraints:

- it lives in the same repository and the same root `package.json` as a `web/` module - never a separate package, and never a reason to introduce monorepo tooling;
- it reuses the same feature modules and services rather than duplicating business rules;
- authentication and guild authorization are enforced server-side.

The Discord bot itself does not need an HTTP listening port: it talks to Discord through the Gateway/WebSocket. If the dashboard is enabled, the web/API server listens on one configurable HTTP port (e.g. `PORT`) and may run in the same Node.js process as the bot. Running bot and web responsibilities in separate processes is a possible later scaling step and must not require splitting the repository into packages.

No dashboard framework is selected in this architecture phase.

## Scaling path

The system should begin as a deployable single application where practical, while keeping boundaries that allow later extraction.

Potential scaling stages:

1. Single process + PostgreSQL.
2. Multiple bot processes/shards with shared PostgreSQL.
3. Redis/queue coordination when justified.
4. Web/API responsibilities in a separate process (same repository and package) if operational scale requires it.

Avoid distributed-system complexity before it solves a measured problem.

## Architectural decision records

Material architecture changes are documented under `docs/adr/` using numbered ADRs, starting with `0001-discord-native-project-structure.md`.
