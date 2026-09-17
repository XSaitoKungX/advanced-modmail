# Presentation

Centralized rendering boundary for bot-generated output (ARCHITECTURE.md →
"Discord rendering architecture").

Planned contents include the Components V2 renderer (`Container` as the
preferred root layout), message templates, the Discord Markdown/formatting
pipeline, and `allowed_mentions` policies. Rendering is centralized here so
features never construct one-off layouts inside business code. Legacy
embed/component fallbacks belong to adapter-level compatibility paths, not new
defaults.

## Dependency rules

- May import `application` and `domain` (rendering inputs and view models).
- Must not import `infrastructure` or `transport` — concrete implementations
  are wired at the composition root.
