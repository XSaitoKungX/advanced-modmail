// Notification policy carried by every outgoing message. Mirrors the
// Discord allowed_mentions surface. @everyone/@here are intentionally not
// representable: they can never be enabled through configuration.
export interface MentionsPolicy {
  readonly users: readonly string[];
  readonly roles: readonly string[];
  readonly repliedUser: boolean;
}

export const NO_PINGS: MentionsPolicy = Object.freeze({
  users: Object.freeze([]),
  roles: Object.freeze([]),
  repliedUser: false,
});

export interface MentionsAllow {
  readonly users?: readonly string[];
  readonly roles?: readonly string[];
  readonly repliedUser?: boolean;
}

// Mentioning is opt-in per message: only explicitly allowed targets may
// resolve to notifications.
export function resolveMentions(allow: MentionsAllow = {}): MentionsPolicy {
  return Object.freeze({
    users: Object.freeze(allow.users ?? []),
    roles: Object.freeze(allow.roles ?? []),
    repliedUser: allow.repliedUser ?? false,
  });
}
