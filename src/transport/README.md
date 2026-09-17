# Transport

Adapters that receive or send external data (ARCHITECTURE.md → "1. Transport").

Planned contents include adapters for Discord direct messages, guild messages,
text channels, private/public threads, forum-style destinations, Discord
interactions, and REST/webhook endpoints. Transport code converts external
payloads into validated application commands/events and must not contain core
modmail policy. Surface-specific behavior lives behind normalized adapter
capabilities.

## Dependency rules

- May import `application` and `domain` (commands, events, models).
- Must not import `infrastructure` or `presentation` — concrete adapters and
  renderers are provided through ports wired at the composition root.
