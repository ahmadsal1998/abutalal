export function isExternalNavHref(href: string): boolean {
  return /^https?:\/\//i.test(href.trim())
}

/** Path segment used for NavLink `end` (home = exact match only). */
export function navPathnameOnly(to: string): string {
  const t = to.trim()
  if (isExternalNavHref(t)) return t
  const q = t.indexOf('?')
  return q === -1 ? (t || '/') : t.slice(0, q) || '/'
}

/** Normalize admin input: internal paths start with /, external left as-is. */
export function normalizeNavHref(raw: string): string {
  const t = raw.trim()
  if (!t) return '/'
  if (isExternalNavHref(t)) return t
  return t.startsWith('/') ? t : `/${t}`
}
