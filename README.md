# Advanced Modmail

Advanced Modmail is an open-source Discord modmail platform focused on reliable private support workflows, strong moderation tooling, extensibility, security, and a maintainable self-hosted deployment model.

> Status: pre-alpha / architecture phase. The project foundation is being established before implementation begins.

## Goals

- Reliable user-to-staff modmail conversations through Discord.
- Multi-guild capable architecture with strict tenant isolation.
- Secure transcript handling and auditable moderation actions.
- Highly configurable workflows without hard-coded guild assumptions.
- Clear extension points for integrations and future modules.
- Production-ready observability, testing, migrations, and deployment guidance.
- A contributor-friendly open-source project with predictable governance.

## Planned technical baseline

- Node.js 24 LTS
- TypeScript 7
- pnpm 12
- discord.js 14
- PostgreSQL as the primary persistent database
- Redis only where distributed coordination, queues, or caching justify it

Exact application dependencies are introduced only through implementation issues and pull requests.

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

- `AGENTS.md` — rules for AI agents and automated contributors.
- `ARCHITECTURE.md` — technical architecture and system boundaries.
- `DESIGN.md` — product and engineering design principles.
- `SECURITY.md` — vulnerability reporting and security expectations.
- `CONTRIBUTING.md` — contributor workflow and standards.
- `GOVERNANCE.md` — project decision-making and maintenance model.
- `SUPPORT.md` — where to ask for help.
- `TODO.md` — ordered implementation roadmap.
- `CHANGELOG.md` — release history once releases begin.

## Current phase

The repository is intentionally being designed before implementation. No production-ready release exists yet.

## License

Licensed under the Apache License 2.0. See `LICENSE` for details.
