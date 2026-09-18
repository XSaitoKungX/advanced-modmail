// Token kinds of the Discord message-format pipeline (see ARCHITECTURE.md,
// Markdown and Discord formatting). The parser implementation lands with
// the Discord runtime phase.
export type FormatTokenType =
  | "text"
  | "user"
  | "role"
  | "channel"
  | "command"
  | "emoji"
  | "animatedEmoji"
  | "timestamp"
  | "guildNavigation";

export interface FormatToken {
  readonly type: FormatTokenType;
  readonly raw: string;
}

export interface FormattingPipeline {
  parse(content: string): readonly FormatToken[];
}
