import type { MentionsPolicy } from "../mentions/policy.js";

// A message ready to send through a Discord adapter. allowedMentions is
// always explicit: renderers must never omit the notification policy.
export interface RenderedMessage {
  readonly components: readonly unknown[];
  readonly allowedMentions: MentionsPolicy;
  readonly ephemeral?: boolean;
}

// Produces a RenderedMessage from a structured view description. Concrete
// Components V2 renderers land with the Discord runtime phase.
export interface ViewRenderer<V> {
  render(view: V): RenderedMessage;
}
