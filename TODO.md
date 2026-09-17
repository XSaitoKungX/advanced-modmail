# Roadmap / TODO

This roadmap is intentionally ordered. New implementation work should normally follow the earliest unfinished phase unless an issue explicitly justifies otherwise.

## Phase 0 — Repository foundation

- [x] Initialize repository.
- [x] Configure issues, pull requests, labels, squash merges, and branch cleanup.
- [x] Add issue forms, pull request template, and CODEOWNERS.
- [x] Establish architecture, security, contribution, governance, and design documentation.
- [ ] Enable GitHub branch protection/rulesets when the repository plan or visibility supports them.
- [ ] Enable full secret scanning/push protection when available for the repository.

## Phase 1 — Toolchain and application skeleton

- [ ] Create strict TypeScript project scaffold.
- [ ] Add pnpm lockfile.
- [ ] Configure formatter and linter.
- [ ] Configure unit/integration test framework.
- [ ] Add environment schema validation.
- [ ] Add structured logger abstraction with redaction.
- [ ] Add CI for format, lint, typecheck, tests, and build.
- [ ] Add dependency review/security checks where available.
- [ ] Establish source directory boundaries matching `ARCHITECTURE.md`.

## Phase 2 — Persistence foundation

- [ ] Select PostgreSQL query/ORM/migration tooling through a dedicated issue.
- [ ] Define initial schema and migration policy.
- [ ] Implement database connection lifecycle.
- [ ] Add tenant-scoped repository abstractions.
- [ ] Add database integration-test environment.
- [ ] Document backup/restore expectations.

## Phase 3 — Discord runtime foundation

- [ ] Initialize discord.js client through an infrastructure adapter.
- [ ] Document required intents and permissions.
- [ ] Implement graceful startup/shutdown.
- [ ] Implement interaction/event routing.
- [ ] Add application health/readiness state.
- [ ] Add safe command registration workflow.

## Phase 4 — Modmail domain MVP

- [ ] Define thread state machine.
- [ ] Implement create/open-thread use case.
- [ ] Prevent duplicate/conflicting open threads according to policy.
- [ ] Implement user-to-staff message relay.
- [ ] Implement staff-to-user reply flow.
- [ ] Implement close/reopen workflow.
- [ ] Implement authorization and staff permission policy.
- [ ] Add idempotency and failure-handling tests.

## Phase 5 — Guild configuration

- [ ] Define validated guild configuration model.
- [ ] Add setup/configuration commands.
- [ ] Configure staff destinations/roles.
- [ ] Configure limits and routing behavior.
- [ ] Add safe configuration defaults.
- [ ] Audit privileged configuration changes.

## Phase 6 — Transcripts and privacy

- [ ] Define transcript data model and rendering format.
- [ ] Implement access-control rules.
- [ ] Define retention/deletion policy.
- [ ] Implement export/download flow safely.
- [ ] Add privacy/redaction tests.
- [ ] Document operator responsibilities for stored content.

## Phase 7 — Moderation and staff tooling

- [ ] Internal staff notes that cannot leak into user replies.
- [ ] Thread assignment/ownership.
- [ ] User block/unblock controls.
- [ ] Thread tags/categories.
- [ ] Staff audit timeline.
- [ ] Search/filtering primitives.

## Phase 8 — Reliability and scale

- [ ] Measure rate-limit and retry behavior.
- [ ] Introduce persistent jobs/queue only when justified.
- [ ] Add Redis only for concrete distributed-system requirements.
- [ ] Implement shard/process coordination if required.
- [ ] Add operational metrics and alerting guidance.
- [ ] Add disaster-recovery documentation.

## Phase 9 — Dashboard/API

- [ ] Define dashboard requirements and threat model.
- [ ] Select web stack through an ADR/issue.
- [ ] Implement Discord OAuth2 safely.
- [ ] Enforce server-side guild/permission checks.
- [ ] Reuse application/domain services rather than duplicate logic.
- [ ] Add configuration, thread, transcript, and audit views incrementally.

## Phase 10 — Internationalization and UX polish

- [ ] Introduce translation catalog abstraction.
- [ ] Provide German and English baseline translations.
- [ ] Validate accessible Discord interaction design.
- [ ] Improve setup diagnostics and operator guidance.

## Phase 11 — Deployment and release readiness

- [ ] Create Docker image and documented container deployment.
- [ ] Document generic Node.js/Pelican/Pterodactyl-style deployment.
- [ ] Add health/readiness probes.
- [ ] Add migration-before-start deployment procedure.
- [ ] Define backup requirements.
- [ ] Automate release notes and versioning.
- [ ] Produce first pre-release.

## Phase 12 — Public open-source launch

- [ ] Final documentation review.
- [ ] Enable public-repository security features.
- [ ] Enable branch/tag rulesets.
- [ ] Configure Private Vulnerability Reporting.
- [ ] Publish contributor onboarding.
- [ ] Publish stable roadmap and compatibility policy.
- [ ] Prepare `v1.0.0` criteria after sufficient pre-release validation.
