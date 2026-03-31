import { Link } from 'react-router-dom'
import {
  Globe,
  MessageCircle,
  Share2,
  Truck,
  CreditCard,
  Headphones,
} from 'lucide-react'
import { useStoreTheme } from '@/contexts/StoreThemeContext'
import { useSitePages } from '@/contexts/SitePagesContext'
import type { StoreThemeSettings } from '@/types/storeTheme'

const shopLinks = [
  { to: '/products', label: 'كل المنتجات' },
  { to: '/products?category=phone', label: 'الهواتف' },
  { to: '/products?category=accessory', label: 'الإكسسوارات' },
]

export type StoreFooterProps = {
  settings?: StoreThemeSettings
}

export function StoreFooter({ settings: settingsProp }: StoreFooterProps) {
  const { settings: ctx } = useStoreTheme()
  const settings = settingsProp ?? ctx
  const { pages, visibleFooterPages } = useSitePages()
  const f = settings.footer
  const c = f.content
  const v = f.visibility
  const accent = 'var(--store-footer-button)'
  const tpl = f.templateId ?? 'columns-dark'

  const privacyPage = pages.find((p) => p.path === '/page/privacy')
  const termsPage = pages.find((p) => p.path === '/page/terms')

  const logoBlock =
    settings.header.showLogoImage && settings.header.logoImageUrl ? (
      <Link to="/" className="inline-flex max-w-full">
        <img
          src={settings.header.logoImageUrl}
          alt=""
          className="h-10 w-auto max-w-[180px] object-contain"
        />
      </Link>
    ) : (
      <Link
        to="/"
        className="font-display text-xl font-bold tracking-tight text-[var(--store-footer-text)]"
      >
        {settings.header.logoText}
        <span style={{ color: accent }}>.</span>
      </Link>
    )

  const socialRow = (
    <div className="mt-6 flex gap-3">
      <a
        href={c.socialTwitter || 'https://twitter.com'}
        target="_blank"
        rel="noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--store-footer-text),transparent_75%)] text-[var(--store-footer-link)] transition hover:border-[var(--store-footer-button)]/50 hover:text-[var(--store-footer-text)]"
        aria-label="تويتر"
      >
        <Share2 className="h-4 w-4" />
      </a>
      <a
        href={c.socialInstagram || 'https://instagram.com'}
        target="_blank"
        rel="noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--store-footer-text),transparent_75%)] text-[var(--store-footer-link)] transition hover:border-[var(--store-footer-button)]/50 hover:text-[var(--store-footer-text)]"
        aria-label="إنستغرام"
      >
        <MessageCircle className="h-4 w-4" />
      </a>
      <a
        href={c.socialFacebook || 'https://facebook.com'}
        target="_blank"
        rel="noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--store-footer-text),transparent_75%)] text-[var(--store-footer-link)] transition hover:border-[var(--store-footer-button)]/50 hover:text-[var(--store-footer-text)]"
        aria-label="الموقع"
      >
        <Globe className="h-4 w-4" />
      </a>
    </div>
  )

  const shopColumn = v.showShopColumn !== false && (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[color-mix(in_srgb,var(--store-footer-text),transparent_35%)]">
        {c.shopColumnTitle ?? 'التسوق'}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {shopLinks.map((l) => (
          <li key={l.to + l.label}>
            <Link
              to={l.to}
              className="text-[var(--store-footer-link)] transition hover:text-[var(--store-footer-text)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  const infoColumn = v.showInfoColumn !== false && (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[color-mix(in_srgb,var(--store-footer-text),transparent_35%)]">
        {c.infoColumnTitle ?? 'معلومات'}
      </p>
      <ul className="mt-4 space-y-2.5 text-sm">
        {visibleFooterPages.length === 0 ? (
          <li className="text-[color-mix(in_srgb,var(--store-footer-text),transparent_45%)]">
            أضف صفحات من الإدارة ← صفحات المتجر.
          </li>
        ) : (
          visibleFooterPages.map((p) => (
            <li key={p.id}>
              {p.path.startsWith('http') ? (
                <a
                  href={p.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--store-footer-link)] transition hover:text-[var(--store-footer-text)]"
                >
                  {p.title}
                </a>
              ) : (
                <Link
                  to={p.path}
                  className="text-[var(--store-footer-link)] transition hover:text-[var(--store-footer-text)]"
                >
                  {p.title}
                </Link>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  )

  const supportColumn =
    v.showSupportColumn !== false ? (
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[color-mix(in_srgb,var(--store-footer-text),transparent_35%)]">
          {c.supportColumnTitle ?? 'الدعم'}
        </p>
        <ul className="mt-4 space-y-2.5 text-sm">
          <li>
            <span className="text-[color-mix(in_srgb,var(--store-footer-text),transparent_35%)]">
              {c.supportBlurb ?? '—'}
            </span>
          </li>
        </ul>
      </div>
    ) : null

  const whyColumn = v.showWhyColumn !== false ? (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[color-mix(in_srgb,var(--store-footer-text),transparent_35%)]">
        {c.whyTitle ?? 'لماذا نحن'}
      </p>
      <ul className="mt-4 space-y-4 text-sm">
        {c.feature1Title ? (
          <li className="flex gap-3">
            <Truck
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: accent }}
            />
            <span>
              <span className="font-medium text-[var(--store-footer-text)]">
                {c.feature1Title}
              </span>
              <br />
              <span className="text-[color-mix(in_srgb,var(--store-footer-text),transparent_40%)]">
                {c.feature1Sub}
              </span>
            </span>
          </li>
        ) : null}
        {c.feature2Title ? (
          <li className="flex gap-3">
            <CreditCard
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: accent }}
            />
            <span>
              <span className="font-medium text-[var(--store-footer-text)]">
                {c.feature2Title}
              </span>
              <br />
              <span className="text-[color-mix(in_srgb,var(--store-footer-text),transparent_40%)]">
                {c.feature2Sub}
              </span>
            </span>
          </li>
        ) : null}
        {c.feature3Title ? (
          <li className="flex gap-3">
            <Headphones
              className="mt-0.5 h-5 w-5 shrink-0"
              style={{ color: accent }}
            />
            <span>
              <span className="font-medium text-[var(--store-footer-text)]">
                {c.feature3Title}
              </span>
              <br />
              <span className="text-[color-mix(in_srgb,var(--store-footer-text),transparent_40%)]">
                {c.feature3Sub}
              </span>
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  ) : null

  const bottomBar = v.showBottomBar !== false ? (
    <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[color-mix(in_srgb,var(--store-footer-text),transparent_80%)] pt-8 text-center text-xs text-[color-mix(in_srgb,var(--store-footer-text),transparent_35%)] sm:flex-row sm:text-start">
      <p>
        © {new Date().getFullYear()} {settings.header.logoText}{' '}
        {c.copyrightSuffix ?? 'جميع الحقوق محفوظة.'}
      </p>
      <div className="flex flex-wrap justify-center gap-4 sm:justify-end">
        {privacyPage ? (
          <Link
            to={privacyPage.path}
            className="hover:text-[var(--store-footer-text)]"
          >
            {privacyPage.title}
          </Link>
        ) : null}
        {termsPage ? (
          <Link
            to={termsPage.path}
            className="hover:text-[var(--store-footer-text)]"
          >
            {termsPage.title}
          </Link>
        ) : null}
        <Link to="/admin/login" className="hover:text-[var(--store-footer-text)]">
          دخول الموظفين
        </Link>
      </div>
    </div>
  ) : null

  const borderClass =
    tpl === 'minimal-light'
      ? 'border-t border-slate-200'
      : 'border-t border-[color-mix(in_srgb,var(--store-footer-text),transparent_88%)]'

  if (tpl === 'compact-bar') {
    return (
      <footer className={borderClass} style={{ backgroundColor: 'var(--store-footer-bg)' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              {v.showLogo !== false ? logoBlock : null}
              {v.showTagline !== false && c.tagline ? (
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--store-footer-link)]">
                  {c.tagline}
                </p>
              ) : null}
              {v.showSocial !== false ? socialRow : null}
            </div>
            <div className="flex flex-wrap gap-8 lg:justify-end">
              {shopColumn}
              {infoColumn}
            </div>
          </div>
          {bottomBar}
        </div>
      </footer>
    )
  }

  return (
    <footer className={borderClass} style={{ backgroundColor: 'var(--store-footer-bg)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className={`grid gap-10 sm:grid-cols-2 ${
            tpl === 'minimal-light'
              ? 'lg:grid-cols-12 lg:gap-8'
              : 'lg:grid-cols-12 lg:gap-8'
          }`}
        >
          <div
            className={
              tpl === 'minimal-light' ? 'lg:col-span-4' : 'lg:col-span-4'
            }
          >
            {v.showLogo !== false ? logoBlock : null}
            {v.showTagline !== false && c.tagline ? (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--store-footer-link)]">
                {c.tagline}
              </p>
            ) : null}
            {v.showSocial !== false ? socialRow : null}
          </div>

          <div
            className={`grid grid-cols-2 gap-8 sm:col-span-2 ${
              tpl === 'minimal-light' ? 'lg:col-span-5 lg:grid-cols-3' : 'lg:col-span-5 lg:grid-cols-3'
            }`}
          >
            {shopColumn}
            {infoColumn}
            {supportColumn}
          </div>

          {whyColumn ? (
            <div className="sm:col-span-2 lg:col-span-3">{whyColumn}</div>
          ) : null}
        </div>

        {bottomBar}
      </div>
    </footer>
  )
}
