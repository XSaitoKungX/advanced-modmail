import { messages as deDE } from "./de-DE/messages.js";
import { messages as enUS, type MessageCatalog } from "./en-US/messages.js";

export type { MessageCatalog } from "./en-US/messages.js";

export const SUPPORTED_LOCALES = ["de-DE", "en-US"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en-US";

export type MessageKey = keyof MessageCatalog;

const CATALOGS: Record<Locale, Partial<MessageCatalog>> = {
  "de-DE": deDE,
  "en-US": enUS,
};

// Deterministic resolution: first supported candidate wins, otherwise the
// default locale. Callers pass candidates in priority order (for example
// user locale, guild default).
export function resolveLocale(
  ...candidates: readonly (string | null | undefined)[]
): Locale {
  for (const candidate of candidates) {
    if (
      candidate !== null &&
      candidate !== undefined &&
      (SUPPORTED_LOCALES as readonly string[]).includes(candidate)
    ) {
      return candidate as Locale;
    }
  }
  return DEFAULT_LOCALE;
}

// Deterministic fallback chain: requested locale -> en-US -> the literal
// key (keeps missing translations visible instead of silently empty).
export function translate(
  locale: Locale,
  key: MessageKey,
  params?: Record<string, string | number>,
): string {
  const template =
    CATALOGS[locale][key] ?? CATALOGS[DEFAULT_LOCALE][key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params?.[name];
    return value === undefined ? match : String(value);
  });
}
