import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Search, Menu } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useStoreTheme } from '@/contexts/StoreThemeContext'
import { useSitePages } from '@/contexts/SitePagesContext'
import type { StoreThemeSettings } from '@/types/storeTheme'
import { isExternalNavHref, navPathnameOnly } from '@/lib/storeHeaderNav'

function HeaderNavItem({
  item,
  mobile,
  onNavigate,
  variant,
}: {
  item: { id: string; title: string; path: string }
  mobile?: boolean
  onNavigate?: () => void
  variant: 'glass' | 'minimal' | 'elevated'
}) {
  const pill =
    'rounded-full px-3.5 py-2 text-sm font-medium transition lg:px-4'
  const pillInactive =
    'text-[var(--store-header-link)] hover:bg-black/[0.04] hover:text-[var(--store-header-text)]'
  const pillActive =
    'bg-[var(--store-surface)] text-[var(--store-header-text)] shadow-sm ring-1 ring-slate-200/80'

  const minimalLink =
    'rounded-lg px-2 py-1.5 text-sm font-medium transition'
  const minimalInactive =
    'text-[var(--store-header-link)] hover:text-[var(--store-header-text)]'
  const minimalActive =
    'text-[var(--store-header-text)] underline decoration-[var(--store-header-button)] decoration-2 underline-offset-4'

  const elevatedInactive =
    'text-[var(--store-header-link)] hover:text-[var(--store-header-text)]'
  const elevatedActive =
    'text-[var(--store-header-text)] font-semibold'

  const mobileRow =
    'min-h-[48px] rounded-2xl px-4 py-3 text-base font-medium transition'
  const mobileInactive = 'text-[var(--store-header-link)] hover:bg-black/[0.04]'
  const mobileActive =
    'bg-[color-mix(in_srgb,var(--store-header-button),transparent_88%)] text-[var(--store-header-text)]'

  const target = item.path.trim()
  const label = item.title.trim() || target

  const navClass = ({ isActive }: { isActive: boolean }) => {
    if (mobile) {
      return `${mobileRow} ${isActive ? mobileActive : mobileInactive}`
    }
    if (variant === 'minimal') {
      return `${minimalLink} ${isActive ? minimalActive : minimalInactive}`
    }
    if (variant === 'elevated') {
      return `${minimalLink} ${isActive ? elevatedActive : elevatedInactive}`
    }
    return `${pill} ${isActive ? pillActive : pillInactive}`
  }

  if (isExternalNavHref(target)) {
    const cls = mobile
      ? `${mobileRow} ${mobileInactive}`
      : variant === 'minimal' || variant === 'elevated'
        ? `${minimalLink} ${minimalInactive}`
        : `${pill} ${pillInactive}`
    return (
      <a
        href={target}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onClick={onNavigate}
      >
        {label}
      </a>
    )
  }

  return (
    <NavLink
      to={target}
      end={navPathnameOnly(target) === '/'}
      onClick={onNavigate}
      className={navClass}
    >
      {label}
    </NavLink>
  )
}

export type StoreHeaderProps = {
  /** When set (e.g. admin preview), overrides context theme */
  settings?: StoreThemeSettings
}

export function StoreHeader({ settings: settingsProp }: StoreHeaderProps) {
  const { itemCount } = useCart()
  const [open, setOpen] = useState(false)
  const { settings: ctx } = useStoreTheme()
  const settings = settingsProp ?? ctx
  const { visibleNavPages } = useSitePages()

  const h = settings.header
  const chrome = h.chromeVisibility
  const showLogo = chrome.showLogo !== false
  const showNav =
    chrome.showNav !== false && visibleNavPages.length > 0
  const showSearch = chrome.showSearch !== false
  const showCart = chrome.showCart !== false
  const tagline = (h.chromeContent.headerTagline ?? '').trim()

  const tpl = h.chromeTemplateId ?? 'glass-pills'

  const logo = (
    <>
      {h.showLogoImage && h.logoImageUrl ? (
        <img
          src={h.logoImageUrl}
          alt=""
          className="h-9 w-auto max-w-[140px] object-contain"
        />
      ) : (
        <>
          {h.logoText}
          <span style={{ color: 'var(--store-header-button)' }}>.</span>
        </>
      )}
    </>
  )

  const wrapNav = (children: ReactNode) => {
    if (tpl === 'glass-pills') {
      return (
        <div className="flex flex-wrap items-center justify-center gap-0.5 rounded-full border border-slate-200/70 bg-slate-50/90 p-1 shadow-inner">
          {children}
        </div>
      )
    }
    return (
      <div className="flex flex-wrap items-center justify-center gap-1 md:gap-2">
        {children}
      </div>
    )
  }

  const headerShell =
    tpl === 'elevated-split'
      ? 'border-b border-slate-200/60 bg-[var(--store-header-bg)] shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-xl'
      : tpl === 'minimal-bar'
        ? 'border-b border-slate-200/60 bg-[var(--store-header-bg)]'
        : 'border-b border-slate-200/50 bg-[var(--store-header-bg)]/75 shadow-[0_4px_24px_-8px_rgba(15,23,42,0.08)] backdrop-blur-2xl backdrop-saturate-150 supports-backdrop-filter:bg-[var(--store-header-bg)]/65'

  const navVariant =
    tpl === 'minimal-bar' ? 'minimal' : tpl === 'elevated-split' ? 'elevated' : 'glass'

  return (
    <header
      className={`sticky top-0 z-40 pt-[env(safe-area-inset-top)] ${headerShell}`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:px-6 lg:px-8 ${
          tpl === 'elevated-split' ? 'flex-col' : ''
        }`}
      >
        <div
          className={`flex w-full items-center justify-between gap-3 ${
            tpl === 'elevated-split' ? 'sm:px-0' : ''
          }`}
        >
          {showLogo ? (
            <Link
              to="/"
              className="shrink-0 rounded-2xl px-2 py-1 font-display text-lg font-bold tracking-tight text-[var(--store-header-text)] transition hover:bg-black/[0.04] sm:text-xl"
            >
              {logo}
              {tagline && tpl === 'elevated-split' ? (
                <span className="mt-0.5 block text-xs font-normal text-[var(--store-header-link)]">
                  {tagline}
                </span>
              ) : null}
            </Link>
          ) : (
            <span className="inline-block w-px shrink-0" aria-hidden />
          )}

          {tpl !== 'elevated-split' && tagline ? (
            <div className="hidden max-w-[12rem] truncate text-xs text-[var(--store-header-link)] sm:block lg:max-w-xs">
              {tagline}
            </div>
          ) : null}

          {showNav && tpl !== 'elevated-split' ? (
            <nav
              className="hidden max-w-[min(100%,28rem)] flex-wrap items-center justify-center gap-0.5 md:flex xl:max-w-none"
              aria-label="التنقل الرئيسي"
            >
              {wrapNav(
                visibleNavPages.map((item) => (
                  <HeaderNavItem
                    key={item.id}
                    item={item}
                    variant={navVariant}
                  />
                )),
              )}
            </nav>
          ) : null}

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {showSearch ? (
              <Link
                to="/products"
                className="hidden rounded-full border border-transparent p-2.5 text-[var(--store-header-link)] transition hover:border-slate-200/80 hover:bg-black/[0.04] xl:inline-flex"
                aria-label="البحث في المنتجات"
              >
                <Search className="h-5 w-5" />
              </Link>
            ) : null}
            {showCart ? (
              <Link
                to="/cart"
                className="relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--store-header-button),transparent_45%)] transition hover:brightness-[1.03] active:scale-[0.98] sm:min-h-0 sm:px-5"
                style={{ backgroundColor: 'var(--store-header-button)' }}
              >
                <ShoppingBag className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">السلة</span>
                {itemCount > 0 && (
                  <span className="absolute -top-1 end-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-300 px-1 text-[10px] font-bold text-slate-900 ring-2 ring-white">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            ) : null}
            {showNav ? (
              <button
                type="button"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-slate-200/70 bg-slate-50/90 text-[var(--store-header-link)] shadow-sm transition hover:bg-white md:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label="فتح القائمة"
              >
                <Menu className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>

        {tpl === 'elevated-split' && showNav ? (
          <nav
            className="mt-3 hidden w-full justify-center md:flex"
            aria-label="التنقل الرئيسي"
          >
            {wrapNav(
              visibleNavPages.map((item) => (
                <HeaderNavItem
                  key={item.id}
                  item={item}
                  variant={navVariant}
                />
              )),
            )}
          </nav>
        ) : null}
      </div>

      {open && showNav ? (
        <div className="border-t border-slate-100/90 bg-[var(--store-header-bg)]/98 px-4 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.6)] backdrop-blur-md md:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col gap-1"
            aria-label="التنقل — الجوال"
          >
            {visibleNavPages.map((item) => (
              <HeaderNavItem
                key={item.id}
                item={item}
                mobile
                variant={navVariant}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
