/**
 * Storefront navigable pages — data-driven; header nav is derived from
 * `showInNav` + `sortOrder` only (no hardcoded nav in the storefront).
 */

export interface SitePage {
  id: string
  title: string
  /**
   * In-app path (e.g. `/products`), custom content (`/page/about`),
   * or an external `https://…` URL.
   */
  path: string
  /** Shown in the storefront header nav when true */
  showInNav: boolean
  /** Shown in the storefront footer (info column + legal row where applicable) */
  showInFooter: boolean
  sortOrder: number
  /** Shown for routes under `/page/*` */
  body?: string | null
}

/** Preset storefront routes — for admin picker only; nothing is shown until a page is added. */
export const STORE_SYSTEM_PATH_OPTIONS: readonly { path: string; label: string }[] = [
  { path: '/', label: 'الرئيسية' },
  { path: '/products', label: 'المتجر' },
  { path: '/cart', label: 'السلة' },
  { path: '/checkout', label: 'الدفع' },
] as const
