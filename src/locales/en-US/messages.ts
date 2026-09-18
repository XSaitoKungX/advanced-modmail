// Reference catalog: every locale must cover these keys or rely on the
// deterministic per-key fallback to en-US. Values stay `string` (not
// literal types) so other locales can assign their own translations.
export const messages = {
  "common.ok": "OK",
  "common.cancel": "Cancel",
  "error.generic": "An unexpected error occurred.",
  "dev.debugOnly": "Debug details: {detail}",
};

export type MessageCatalog = Record<keyof typeof messages, string>;
