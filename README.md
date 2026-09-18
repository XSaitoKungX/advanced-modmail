<p align="center">
  <img src="web/public/relaya.webp" alt="Relaya mascot" width="160">
</p>

<h1 align="center">Relaya</h1>

<p align="center"><strong>Advanced, configurable and open-source Modmail for Discord.</strong></p>

Relaya is an open-source Discord modmail platform focused on reliable private support workflows, strong moderation tooling, extensibility, security, deep configurability, and a maintainable self-hosted deployment model.

> Status: pre-alpha / architecture phase. The project foundation is being established before implementation begins.

## Goals

- Reliable user-to-staff modmail conversations through Discord.
- Multi-guild capable architecture with strict tenant isolation.
- Secure transcript handling and auditable moderation actions.
- Configuration-first behavior with no hard-coded guild assumptions.
- Modern Discord-native UX built around Components V2.
- First-class localization and multi-language support.
- Flexible routing across DMs, guild messages, channels, threads, and supported Discord surfaces.
- Native Discord Markdown and message-formatting support.
- Clear extension points for integrations and future modules.
- Production-ready observability, testing, migrations, and deployment guidance.
- A contributor-friendly open-source project with predictable governance.

## Core product requirements

### Components V2 by default

Bot-generated interactive and informational messages should use Discord Components V2 by default. `Container` is the preferred root layout component for structured messages, with `Text Display`, `Section`, `Separator`, `Media Gallery`, `File`, `Action Row`, and other supported components composed as needed.

Legacy embeds or legacy message-component layouts are compatibility fallbacks, not the default design language for new features.

### Configuration-first

The project targets effectively complete configuration of operator-facing behavior. The "99.99% configurable" goal means that deployers should not need to edit source code for normal customization.

Configurable behavior is expected to include, where relevant:

- channels, categories, threads, forums, roles, permissions, and destinations,
- routing modes and modmail entry points,
- user-facing and staff-facing messages,
- Components V2 layouts and presentation options,
- colors/accent colors, labels, buttons, limits, cooldowns, naming, and workflow behavior,
- transcript, retention, notification, logging, moderation, and privacy settings,
- feature toggles and per-guild defaults,
- locale/language behavior.

Security invariants, protocol requirements, schema constraints, and implementation constants that must not be operator-configurable are explicit exceptions.

### Multiple languages

Internationalization is a first-class requirement, not a later retrofit. The initial product baseline targets German (`de-DE`) and English (`en-US`) with a locale system that can be extended without changing business logic.

Locale resolution should support guild defaults, user/interaction locale where applicable, deterministic fallback behavior, and localized configurable templates.

### Flexible Discord routing

The transport architecture must support more than a single DM-to-channel flow. Planned routing capabilities include:

- direct messages,
- guild messages,
- text channels,
- private/public threads,
- forum/thread-style destinations where supported,
- interaction-triggered entry points,
- future Discord surfaces through adapters without rewriting business logic.

Exact supported combinations are introduced through scoped implementation issues and must respect Discord permissions and API limitations.

### Markdown and Discord formatting

Relayed and generated content must preserve supported Discord Markdown where safe and appropriate. The formatting pipeline under `src/discord/formatting/` must understand current Discord message-formatting forms including user, role, channel, command, emoji, timestamp, and guild-navigation markup.

Examples include:

```text
<@USER_ID>
<@&ROLE_ID>
<#CHANNEL_ID>
</COMMAND:COMMAND_ID>
<:EMOJI_NAME:EMOJI_ID>
<a:EMOJI_NAME:EMOJI_ID>
<t:TIMESTAMP>
<t:TIMESTAMP:STYLE>
<id:TYPE>
```

Deprecated input forms may be parsed for compatibility but must not be emitted as the preferred format. Ping behavior must always be controlled explicitly through Discord `allowed_mentions`; rendering markup must never imply permission to notify users or roles.

## Planned technical baseline

- Node.js 24 LTS
- TypeScript 7
- pnpm 12
- discord.js 14
- PostgreSQL as the primary persistent database
- Redis only where distributed coordination, queues, or caching justify it

Exact application dependencies are introduced only through implementation issues and pull requests.

## Development

### Prerequisites

- Node.js 24 LTS (see `.nvmrc`).
- pnpm 12. The `packageManager` field pins the exact version; `corepack enable` makes Corepack supply it automatically.

### Setup

```bash
corepack enable
pnpm install
```

### Local database (optional until the runtime consumes it)

PostgreSQL is the primary store. A local dev instance runs via Docker:

```bash
pnpm db:up        # start postgres on 127.0.0.1:5433
pnpm db:migrate   # apply migrations (uses DATABASE_URL or the dev default)
pnpm db:down      # stop and remove the container
```

Set `DATABASE_URL` in `.env` for real deployments; `docker-compose.yml` also
creates a `relaya_test` database. Database integration tests run only when
`DATABASE_TEST_URL` is set and skip cleanly otherwise:

```bash
DATABASE_TEST_URL=postgres://relaya:relaya-dev@localhost:5433/relaya_test pnpm test
```

### Common commands

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `pnpm build`         | Compile `src/` to `dist/` with `tsc`.            |
| `pnpm check`         | Run format check, lint, typecheck, tests, build. |
| `pnpm clean`         | Remove build output.                             |
| `pnpm db:generate`   | Generate a SQL migration from schema changes.    |
| `pnpm db:migrate`    | Apply pending migrations via drizzle-kit.        |
| `pnpm db:up`         | Start the local Postgres container.              |
| `pnpm db:down`       | Stop the local Postgres container.               |
| `pnpm format`        | Format the repository with Prettier.             |
| `pnpm format:check`  | Verify formatting without writing.               |
| `pnpm lint`          | Run ESLint.                                      |
| `pnpm lint:fix`      | Run ESLint and apply auto-fixes.                 |
| `pnpm test`          | Run unit tests once with Vitest.                 |
| `pnpm test:watch`    | Run Vitest in watch mode.                        |
| `pnpm test:coverage` | Run tests with V8 coverage reporting.            |
| `pnpm typecheck`     | Type-check without emitting.                     |

TypeScript 7 (`tsc`) drives builds and type-checking. Because TypeScript 7 is a native compiler without the classic JavaScript API, `typescript-eslint` runs against the TypeScript 6 compatibility API (`@typescript/typescript6`) via the side-by-side install recommended upstream. This split can be removed once typescript-eslint supports the TypeScript 7 API.

### Project structure

The application entry point is `index.ts` at the repository root (compiled to `dist/index.js`); startup wiring lives in `src/bootstrap.ts`. The Discord-native module layout under `src/` is documented in `src/README.md` and `ARCHITECTURE.md`.

## Repository workflow

All meaningful changes follow this lifecycle:

1. Open or reference a GitHub issue.
2. Create a scoped branch such as `feat/42-transcript-export`.
3. Implement and test only the agreed scope.
4. Open a pull request linked to the issue.
5. Resolve review feedback and required checks.
6. Squash merge into `main`.
7. Delete the merged branch.

Direct development on `main` is not part of the project workflow.

## Documentation

- `AGENTS.md` - rules for AI agents and automated contributors.
- `ARCHITECTURE.md` - technical architecture and system boundaries.
- `DESIGN.md` - product and engineering design principles.
- `SECURITY.md` - vulnerability reporting and security expectations.
- `CONTRIBUTING.md` - contributor workflow and standards.
- `GOVERNANCE.md` - project decision-making and maintenance model.
- `SUPPORT.md` - where to ask for help.
- `TODO.md` - ordered implementation roadmap.
- `CHANGELOG.md` - release history once releases begin.

## Current phase

The repository is intentionally being designed before implementation. No production-ready release exists yet.

## License

Licensed under the Apache License 2.0. See `LICENSE` for details.
