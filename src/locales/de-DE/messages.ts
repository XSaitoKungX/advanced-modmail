import type { MessageCatalog } from "../en-US/messages.js";

// dev.debugOnly stays untranslated on purpose: developer-facing keys may
// rely on the en-US per-key fallback.
export const messages: Partial<MessageCatalog> = {
  "common.ok": "OK",
  "common.cancel": "Abbrechen",
  "error.generic": "Ein unerwarteter Fehler ist aufgetreten.",
};
