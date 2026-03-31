import type { SitePage } from '@/types/sitePage'
import { seedStandardPages } from '@/data/defaultSitePages'

const STORAGE_KEY = 'abu-talal:site-pages:v1'
const THEME_KEY = 'abu-talal:store-theme:v2'

/** Paths removed from the storefront (e.g. retired features). */
const REMOVED_SITE_PATHS = new Set(['/track'])

function stripRemovedPaths(pages: SitePage[]): SitePage[] {
  return pages.filter((p) => !REMOVED_SITE_PATHS.has(p.path.trim()))
}

function normalizeSitePage(raw: unknown): SitePage {
  const p = raw as Partial<SitePage>
  return {
    id: String(p.id ?? ''),
    title: typeof p.title === 'string' ? p.title : '',
    path: typeof p.path === 'string' ? p.path : '/',
    showInNav: Boolean(p.showInNav),
    showInFooter: Boolean(p.showInFooter),
    sortOrder: typeof p.sortOrder === 'number' ? p.sortOrder : 0,
    body: p.body ?? null,
  }
}

function migrateFromLegacyThemeNavLinks(): SitePage[] {
  try {
    const raw = localStorage.getItem(THEME_KEY)
    if (!raw) return []
    const theme = JSON.parse(raw) as {
      header?: { navLinks?: { id: string; label: string; to: string }[] }
    }
    const links = theme?.header?.navLinks
    if (!Array.isArray(links) || links.length === 0) return []
    return links
      .filter((l) => !REMOVED_SITE_PATHS.has(String(l.to).trim()))
      .map((l, i) => ({
        id: l.id,
        title: l.label,
        path: l.to,
        showInNav: true,
        showInFooter: false,
        sortOrder: i,
        body: null,
      }))
  } catch {
    return []
  }
}

export function loadSitePages(): SitePage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw) as unknown
      if (Array.isArray(parsed)) {
        const normalized = (parsed as unknown[])
          .map(normalizeSitePage)
          .filter((p) => p.id)
        const stripped = stripRemovedPaths(normalized)
        if (stripped.length !== normalized.length) {
          saveSitePages(stripped)
        }
        if (stripped.length === 0) {
          if (parsed.length === 0) {
            const seeded = seedStandardPages()
            saveSitePages(seeded)
            return seeded
          }
          return []
        }
        return stripped
      }
    }
  } catch {
    /* ignore */
  }
  const migrated = migrateFromLegacyThemeNavLinks()
  if (migrated.length > 0) {
    saveSitePages(migrated)
    return migrated
  }
  const seeded = seedStandardPages()
  saveSitePages(seeded)
  return seeded
}

export function saveSitePages(pages: SitePage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages))
  } catch {
    /* ignore quota */
  }
}
