# Source layout

Relaya uses a Discord-native modular structure. Architectural
separation is expressed through module responsibilities, not Clean
Architecture folder names - see `ARCHITECTURE.md` for the rationale and rules.

Directories are created when their first implementation lands. The planned
layout is:

```text
index.ts            application entry point (startup/composition only)
src/
  bootstrap.ts      startup wiring: config, database, Discord client, web/API

  commands/         Discord command definitions (parse context, delegate work)
    slash/          application/slash commands
    message/        message/prefix-style commands where enabled

  events/           Discord event listeners grouped by event area
    client/ guild/ interaction/ message/

  handlers/         dispatch/orchestration infrastructure
                    (command, event, component, error handlers, ...)

  components/       reusable Discord interaction/UI building blocks
    buttons/ modals/ selects/ containers/ sections/ views/ shared/
                    views/ = composed screens (e.g. modmail open/closed,
                    configuration, error views)

  modmail/          the modmail feature domain by concrete responsibility
    threads/ routing/ messages/ transcripts/ permissions/ moderation/

  discord/          Discord-specific infrastructure and shared abstractions
    client/         Discord client lifecycle
    rendering/      central Components V2 rendering/factories
    formatting/     Discord Markdown/message-format parsing and rendering
    mentions/       safe mention handling and allowed_mentions

  config/           validated configuration only
    env/ guild/ defaults/
                    process.env is read here, nowhere else

  database/         persistence: migrations, repositories, models
    migrations/ repositories/ models/

  locales/          localization resources
    de-DE/ en-US/

  services/         cross-feature services (only when no feature module fits)
  helpers/          Discord/project-aware helpers
  utils/            genuinely generic utilities only
  types/            shared types that cannot live next to their feature
  constants/        true implementation constants - never operator config

  web/              (planned) optional dashboard/API, same package, no
                    separate package.json

tests/              test suite (Vitest)
dist/               build output (generated)
```

## Rules

- Commands and events stay thin: they parse context and delegate to
  `handlers/`, `modmail/`, or `services/`.
- Persistence lives in `database/`; feature modules never talk to the driver
  directly.
- Environment variables are read only in `config/env/` (enforced by lint).
- User-facing strings come from `locales/`; Discord UI structure comes from
  `components/` and `discord/rendering/` - not ad hoc inside commands.
- `utils/` is not a dumping ground: no `misc.ts`, `stuff.ts`, `everything.ts`.
- `constants/` holds implementation constants only; anything an operator may
  reasonably tune belongs in `config/`.
