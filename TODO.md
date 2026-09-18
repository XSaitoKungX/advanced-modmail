# Roadmap / TODO

This roadmap is intentionally ordered. New implementation work should normally follow the earliest unfinished phase unless an issue explicitly justifies otherwise.

## Phase 0 - Repository foundation

- [x] Initialize repository.
- [x] Configure issues, pull requests, labels, squash merges, and branch cleanup.
- [x] Add issue forms, pull request template, and CODEOWNERS.
- [x] Establish architecture, security, contribution, governance, and design documentation.
- [x] Document Components V2 as the default Discord UI system.
- [x] Document configuration-first, i18n, routing, Markdown, and Discord-formatting requirements.
- [ ] Enable GitHub branch protection/rulesets when the repository plan or visibility supports them.
- [ ] Enable full secret scanning/push protection when available for the repository.

## Phase 1 - Toolchain and application skeleton

- [x] Create strict TypeScript project scaffold.
- [x] Add pnpm lockfile.
- [x] Configure formatter and linter.
- [x] Configure unit/integration test framework.
- [x] Add environment schema validation.
- [x] Add structured logger abstraction with redaction.
- [x] Add CI for format, lint, typecheck, tests, and build.
- [x] Add dependency review/security checks where available.
- [x] Establish the Discord-native `src/` module structure and repository-root entry point (supersedes the preliminary five-layer skeleton from PR #8).
- [x] Establish configuration schema/versioning infrastructure.
- [x] Establish locale catalog and deterministic fallback abstractions.
- [x] Establish centralized Discord rendering/formatting abstractions.

## Phase 2 - Persistence foundation

- [ ] Select PostgreSQL query/ORM/migration tooling through a dedicated issue.
- [ ] Define initial schema and migration policy.
- [ ] Implement database connection lifecycle.
- [ ] Add tenant-scoped repository abstractions.
- [ ] Add database integration-test environment.
- [ ] Document backup/restore expectations.
- [ ] Add versioned guild-configuration persistence.

## Phase 3 - Discord runtime foundation

- [ ] Initialize discord.js client lifecycle under `src/discord/client/`.
- [ ] Document required intents and permissions.
- [ ] Implement graceful startup/shutdown.
- [ ] Implement interaction/event routing.
- [ ] Add application health/readiness state.
- [ ] Add safe command registration workflow.
- [ ] Implement centralized Components V2 rendering under `src/components/` and `src/discord/rendering/`.
- [ ] Make `Container` the default root for structured bot messages where supported.
- [ ] Add legacy rendering fallback only for unsupported/compatibility surfaces.
- [ ] Implement explicit safe `allowed_mentions` policy.
- [ ] Implement Discord Markdown/message-format parsing and normalization.
- [ ] Add tests for user, role, channel, command, emoji, timestamp, and supported guild-navigation markup.

## Phase 4 - Modmail domain MVP

- [ ] Define thread state machine.
- [ ] Implement create/open-thread use case.
- [ ] Prevent duplicate/conflicting open threads according to policy.
- [ ] Implement user-to-staff message relay.
- [ ] Implement staff-to-user reply flow.
- [ ] Preserve supported Discord Markdown and formatting through relays.
- [ ] Implement close/reopen workflow.
- [ ] Implement authorization and staff permission policy.
- [ ] Add idempotency and failure-handling tests.

## Phase 5 - Routing and transport modes

- [ ] Define normalized transport capabilities/interfaces.
- [ ] Support direct-message entry points.
- [ ] Support guild-message/channel entry points where configured.
- [ ] Support staff destinations backed by text channels.
- [ ] Support public/private thread destinations.
- [ ] Support forum/thread-style destinations where Discord APIs and product rules allow it.
- [ ] Support interaction-triggered entry points.
- [ ] Add DM-to-thread routing.
- [ ] Add DM-to-channel routing.
- [ ] Add guild-message-to-thread/channel routing as configured.
- [ ] Ensure routing is configuration-driven rather than feature-hardcoded.
- [ ] Add permission/capability validation for each transport mode.
- [ ] Add routing tests covering tenant isolation and failure recovery.

## Phase 6 - Guild configuration

- [ ] Define validated guild configuration model.
- [ ] Add setup/configuration commands.
- [ ] Configure staff destinations/roles.
- [ ] Configure limits and routing behavior.
- [ ] Configure entry points and supported transport modes.
- [ ] Configure Components V2 text/layout/presentation options where safe.
- [ ] Configure labels, naming schemes, colors/accent presentation, buttons, cooldowns, and notifications.
- [ ] Configure transcript/privacy/retention/export behavior.
- [ ] Configure logging/audit behavior.
- [ ] Configure per-guild locale defaults.
- [ ] Add feature toggles.
- [ ] Add safe configuration defaults.
- [ ] Audit privileged configuration changes.
- [ ] Ensure normal customization does not require source-code changes.

## Phase 7 - Internationalization

- [ ] Implement translation catalog abstraction.
- [ ] Add `de-DE` baseline translations.
- [ ] Add `en-US` baseline translations.
- [ ] Implement deterministic locale fallback.
- [ ] Support guild default locale.
- [ ] Support user/interaction locale where appropriate.
- [ ] Make configurable message templates localization-aware.
- [ ] Add missing-key and fallback tests.
- [ ] Document how contributors add new locales.

## Phase 8 - Transcripts and privacy

- [ ] Define transcript data model and rendering format.
- [ ] Preserve relevant Markdown/message-formatting semantics in transcripts safely.
- [ ] Implement access-control rules.
- [ ] Define retention/deletion policy.
- [ ] Implement export/download flow safely.
- [ ] Add privacy/redaction tests.
- [ ] Document operator responsibilities for stored content.

## Phase 9 - Moderation and staff tooling

- [ ] Internal staff notes that cannot leak into user replies.
- [ ] Thread assignment/ownership.
- [ ] User block/unblock controls.
- [ ] Thread tags/categories.
- [ ] Staff audit timeline.
- [ ] Search/filtering primitives.
- [ ] Use Components V2 consistently for staff-facing workflow UI.

## Phase 10 - Reliability and scale

- [ ] Measure rate-limit and retry behavior.
- [ ] Introduce persistent jobs/queue only when justified.
- [ ] Add Redis only for concrete distributed-system requirements.
- [ ] Implement shard/process coordination if required.
- [ ] Add operational metrics and alerting guidance.
- [ ] Add disaster-recovery documentation.

## Phase 11 - Dashboard/API

- [ ] Define dashboard requirements and threat model.
- [ ] Select web stack through an ADR/issue.
- [ ] Implement Discord OAuth2 safely.
- [ ] Enforce server-side guild/permission checks.
- [ ] Reuse feature modules and services rather than duplicating business logic.
- [ ] Expose configuration capabilities without bypassing validation/security invariants.
- [ ] Add configuration, thread, transcript, and audit views incrementally.
- [ ] Make dashboard localization consistent with bot locale architecture where practical.

## Phase 12 - UX polish and compatibility

- [ ] Validate accessible Components V2 interaction design.
- [ ] Verify consistent Container-based UI patterns.
- [ ] Improve setup diagnostics and operator guidance.
- [ ] Verify Markdown fidelity across relay/transcript/rendering flows.
- [ ] Verify all supported Discord message-formatting classes.
- [ ] Verify deprecated input forms are compatibility-only and not generated by default.
- [ ] Validate safe mention behavior across configurable/user-controlled content.
- [ ] Perform configuration-coverage review for hard-coded behavior that should be configurable.

## Phase 13 - Deployment and release readiness

- [ ] Create Docker image and documented container deployment.
- [ ] Document generic Node.js/Pelican/Pterodactyl-style deployment.
- [ ] Add health/readiness probes.
- [ ] Add migration-before-start deployment procedure.
- [ ] Define backup requirements.
- [ ] Automate release notes and versioning.
- [ ] Produce first pre-release.

## Phase 14 - Public open-source launch

- [ ] Final documentation review.
- [ ] Enable public-repository security features.
- [ ] Enable branch/tag rulesets.
- [ ] Configure Private Vulnerability Reporting.
- [ ] Publish contributor onboarding.
- [ ] Publish stable roadmap and compatibility policy.
- [ ] Prepare `v1.0.0` criteria after sufficient pre-release validation.
