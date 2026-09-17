# ADR-0001: Discord-native project structure

## Status

Accepted - supersedes the preliminary five-layer source skeleton introduced by PR #8.

## Context

An early architecture skeleton organized `src/` into Clean Architecture layers (`domain`, `application`, `infrastructure`, `transport`, `presentation`) with lint-enforced dependency rules. That structure was valid for the decision in effect at the time.

The project owner subsequently decided that Relaya should use the conventional, Discord-bot-oriented project structure that contributors to Discord bots already expect, rather than exposing Enterprise/Clean-Architecture folder names at the top level.

## Decision

- The repository stays a single application: one root `package.json`, one pnpm package, no monorepo tooling (`apps/`, `packages/`, nested manifests are prohibited).
- `index.ts` at the repository root is the single application entry point (compiled to `dist/index.js`); `src/bootstrap.ts` owns startup wiring.
- `src/` is organized by Discord-native responsibilities: `commands/`, `events/`, `handlers/`, `components/`, `modmail/`, `discord/`, `config/`, `database/`, `locales/`, `services/`, `helpers/`, `utils/`, `types/`, `constants/`, and a planned `web/` for the optional dashboard/API.
- Directories are created when their first implementation lands; `src/README.md` documents the planned layout.
- Separation-of-concerns requirements are retained as module-boundary rules (thin commands/events, isolated persistence, centralized configuration/rendering/formatting, tenant isolation) instead of physical layer enforcement. Layer-specific lint rules were removed; `process.env` access is restricted to `src/config/` by lint.
- A future dashboard/API lives in the same repository and package (`web/`). The bot needs no HTTP port; the web server may share the process on one configurable port, and a separate process remains a scaling option without splitting packages.

## Consequences

- The physical layer directories and their lint rules are removed; documentation and roadmap now describe the Discord-native structure.
- Architectural discipline is preserved through documented module boundaries and targeted lint rules rather than an exhaustive import matrix.
- Discord Concepts (Components V2 rendering, mentions, formatting, locales) map to concrete directories: `src/components/`, `src/discord/rendering/`, `src/discord/mentions/`, `src/discord/formatting/`, `src/locales/`.
