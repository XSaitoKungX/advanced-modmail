# Architecture

## Purpose

Advanced Modmail is designed as a modular Discord support platform rather than a collection of command handlers. The architecture must preserve clear boundaries between Discord transport, business rules, persistence, integrations, and operational concerns.

## Architectural goals

- Multi-guild support without cross-guild data leakage.
- Horizontal scalability without redesigning domain logic.
- Reliable delivery and idempotent processing of external events.
- Auditable moderation and configuration changes.
- Replaceable infrastructure adapters.
- Testable domain behavior without requiring a live Discord connection.
- Safe self-hosting with explicit migrations and configuration validation.

## Initial runtime baseline

- Runtime: Node.js 24 LTS
- Language: TypeScript 7 in strict mode
- Package manager: pnpm 12
- Discord library: discord.js 14
- Primary database: PostgreSQL

Redis is not a mandatory dependency at project start. It should be introduced only when queues, distributed locks, rate-limit coordination, caching, or multi-process coordination require it.

## Logical layers

### 1. Transport

Adapters that receive or send external data:

- Discord gateway events
- Discord interactions
- REST/webhook endpoints where applicable
- future dashboard/API transport

Transport code converts external payloads into validated application commands/events. It must not contain core modmail policy.

### 2. Application

Coordinates use cases such as:

- opening a modmail thread,
- routing a user message,
- sending a staff reply,
- closing/reopening a thread,
- generating a transcript,
- applying guild configuration,
- recording moderation actions.

Application services orchestrate domain rules and infrastructure ports.

### 3. Domain

Contains framework-independent rules and models. Planned concepts include:

- Guild/Tenant
- ModmailThread
- Participant
- MessageRelay
- ThreadState
- StaffAction
- Transcript
- GuildConfiguration
- PermissionPolicy

Domain objects must not depend on discord.js, database clients, HTTP frameworks, or environment variables.

### 4. Infrastructure

Implements external concerns:

- PostgreSQL repositories
- Discord adapters
- object/file storage for transcript assets if required
- queue/cache implementations
- logging and telemetry exporters

Infrastructure implementations must satisfy interfaces owned by application/domain layers rather than the reverse.

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

1. User initiates contact through an approved Discord entry point.
2. System resolves guild routing and configuration.
3. Application checks limits, block state, existing open thread, and permissions.
4. Thread is created transactionally.
5. A staff-side Discord representation is provisioned.
6. User and staff messages are relayed and persisted according to configured privacy policy.
7. Staff actions are auditable.
8. Closing a thread finalizes metadata and transcript state.
9. Retention policies determine later deletion/anonymization.

Exact UX is defined in implementation issues.

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

## Configuration

Configuration has two categories:

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

A dashboard is an intended extension, but it must use the same application/domain services rather than duplicating business rules. Authentication and guild authorization must be enforced server-side.

No dashboard framework is selected in this architecture phase.

## Scaling path

The system should begin as a deployable single application where practical, while keeping boundaries that allow later extraction.

Potential scaling stages:

1. Single process + PostgreSQL.
2. Multiple bot processes/shards with shared PostgreSQL.
3. Redis/queue coordination when justified.
4. Separately deployed web/API workers if operational scale requires it.

Avoid distributed-system complexity before it solves a measured problem.

## Architectural decision records

Material architecture changes should eventually be documented under `docs/adr/` using numbered ADRs. The directory should be introduced with the first decision that needs a durable trade-off record.
