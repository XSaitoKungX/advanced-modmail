# Domain

Framework-independent business rules and models (ARCHITECTURE.md → "3. Domain").

Planned contents include entities and policies such as `Guild/Tenant`,
`ModmailThread`, `Participant`, `MessageRelay`, `ThreadState`, `StaffAction`,
`Transcript`, `GuildConfiguration`, `PermissionPolicy`, `RoutingPolicy`, and
`LocalePolicy`.

## Dependency rules

- May only import within this layer and Node.js builtins.
- Must not depend on other layers, npm packages, discord.js, database clients,
  HTTP frameworks, environment variables, or Discord component builders.
- Is imported by `application`, `infrastructure`, `transport`, and
  `presentation`, but imports nothing back.
