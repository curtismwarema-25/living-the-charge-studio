import type { Brief, Newsletter } from "./types";

const BRIEF_KEY = "ltc.draft.brief";
const NEWSLETTER_KEY = "ltc.draft.newsletter";

function read<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — images are large; ignore silently */
  }
}

export const loadBrief = () => read<Brief>(BRIEF_KEY);
export const saveBrief = (b: Brief) => write(BRIEF_KEY, b);
export const clearBrief = () => window.localStorage.removeItem(BRIEF_KEY);

export const loadNewsletter = () => read<Newsletter>(NEWSLETTER_KEY);
export const saveNewsletter = (n: Newsletter) => write(NEWSLETTER_KEY, n);
export const clearNewsletter = () => window.localStorage.removeItem(NEWSLETTER_KEY);

export function draftSummaries() {
  return { brief: loadBrief(), newsletter: loadNewsletter() };
}
