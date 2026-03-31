import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { SitePage } from '@/types/sitePage'
import { STANDARD_SITE_PAGE_TEMPLATES } from '@/data/defaultSitePages'
import { loadSitePages, saveSitePages } from '@/lib/sitePagesStorage'

function sortPages(list: SitePage[]): SitePage[] {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder)
}

type SitePagesContextValue = {
  pages: SitePage[]
  /** Subset with `showInNav`, sorted for the storefront header */
  visibleNavPages: SitePage[]
  /** Subset with `showInFooter`, sorted for the storefront footer */
  visibleFooterPages: SitePage[]
  pathExists: (path: string, excludeId?: string) => boolean
  addPage: (page: Omit<SitePage, 'id' | 'sortOrder'> & { sortOrder?: number }) => SitePage
  updatePage: (id: string, patch: Partial<Omit<SitePage, 'id'>>) => void
  removePage: (id: string) => void
  movePage: (id: string, dir: -1 | 1) => void
  /** Appends any standard informational pages whose paths are not yet present */
  addMissingStandardPages: () => void
}

const SitePagesContext = createContext<SitePagesContextValue | null>(null)

export function SitePagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<SitePage[]>(() => loadSitePages())

  useEffect(() => {
    saveSitePages(pages)
  }, [pages])

  const visibleNavPages = useMemo(
    () => sortPages(pages.filter((p) => p.showInNav)),
    [pages],
  )

  const visibleFooterPages = useMemo(
    () => sortPages(pages.filter((p) => p.showInFooter)),
    [pages],
  )

  const pathExists = useCallback(
    (path: string, excludeId?: string) => {
      const normalized = path.trim()
      return pages.some((p) => p.path === normalized && p.id !== excludeId)
    },
    [pages],
  )

  const addPage = useCallback(
    (
      input: Omit<SitePage, 'id' | 'sortOrder'> & { sortOrder?: number },
    ): SitePage => {
      const id = crypto.randomUUID()
      const nextOrder =
        input.sortOrder ??
        (pages.length === 0
          ? 0
          : Math.max(...pages.map((p) => p.sortOrder), -1) + 1)
      const page: SitePage = {
        id,
        title: input.title.trim(),
        path: input.path.trim(),
        showInNav: input.showInNav,
        showInFooter: input.showInFooter ?? false,
        sortOrder: nextOrder,
        body: input.body ?? null,
      }
      setPages((prev) => [...prev, page])
      return page
    },
    [pages],
  )

  const updatePage = useCallback((id: string, patch: Partial<Omit<SitePage, 'id'>>) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        return {
          ...p,
          ...patch,
          title: patch.title !== undefined ? patch.title.trim() : p.title,
          path: patch.path !== undefined ? patch.path.trim() : p.path,
        }
      }),
    )
  }, [])

  const removePage = useCallback((id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const movePage = useCallback((id: string, dir: -1 | 1) => {
    setPages((prev) => {
      const sorted = sortPages(prev)
      const idx = sorted.findIndex((p) => p.id === id)
      if (idx < 0) return prev
      const j = idx + dir
      if (j < 0 || j >= sorted.length) return prev
      const a = sorted[idx]
      const b = sorted[j]
      return prev.map((p) => {
        if (p.id === a.id) return { ...p, sortOrder: b.sortOrder }
        if (p.id === b.id) return { ...p, sortOrder: a.sortOrder }
        return p
      })
    })
  }, [])

  const addMissingStandardPages = useCallback(() => {
    setPages((prev) => {
      const existing = new Set(prev.map((p) => p.path))
      let order = prev.reduce((m, p) => Math.max(m, p.sortOrder), -1)
      const additions: SitePage[] = []
      for (const t of STANDARD_SITE_PAGE_TEMPLATES) {
        if (existing.has(t.path)) continue
        order += 1
        additions.push({
          ...t,
          id: crypto.randomUUID(),
          sortOrder: order,
        })
        existing.add(t.path)
      }
      return additions.length === 0 ? prev : [...prev, ...additions]
    })
  }, [])

  const value = useMemo(
    () => ({
      pages,
      visibleNavPages,
      visibleFooterPages,
      pathExists,
      addPage,
      updatePage,
      removePage,
      movePage,
      addMissingStandardPages,
    }),
    [
      pages,
      visibleNavPages,
      visibleFooterPages,
      pathExists,
      addPage,
      updatePage,
      removePage,
      movePage,
      addMissingStandardPages,
    ],
  )

  return (
    <SitePagesContext.Provider value={value}>{children}</SitePagesContext.Provider>
  )
}

export function useSitePages(): SitePagesContextValue {
  const ctx = useContext(SitePagesContext)
  if (!ctx) throw new Error('useSitePages must be used within SitePagesProvider')
  return ctx
}
