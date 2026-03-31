import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Warehouse,
  LineChart,
  Receipt,
  Wallet,
  Users,
  Store,
  LogOut,
  ScanLine,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Palette,
  X,
  Link2,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'

type NavItem = {
  to: string
  end?: boolean
  label: string
  icon: LucideIcon
}

const links: NavItem[] = [
  { to: '/admin', end: true, label: 'لوحة التحكم', icon: LayoutDashboard },
  { to: '/admin/products', label: 'المنتجات', icon: Package },
  { to: '/admin/inventory', label: 'المخزون', icon: Warehouse },
  { to: '/admin/reports', label: 'التقارير', icon: LineChart },
  { to: '/admin/sales', label: 'المبيعات', icon: Receipt },
  { to: '/admin/expenses', label: 'المصروفات', icon: Wallet },
  { to: '/admin/customers', label: 'العملاء', icon: Users },
  { to: '/admin/store-design', label: 'تصميم المتجر', icon: Palette },
  { to: '/admin/site-pages', label: 'صفحات المتجر', icon: Link2 },
  { to: '/admin/pos', end: true, label: 'نقطة البيع', icon: ScanLine },
]

function titleForPath(pathname: string): string {
  if (pathname === '/admin' || pathname === '/admin/') return 'لوحة التحكم'
  if (pathname === '/admin/site-pages') return 'صفحات المتجر'
  const match = links.find(
    (l) =>
      l.to !== '/admin' &&
      (pathname === l.to || pathname.startsWith(`${l.to}/`)),
  )
  if (match) return match.label
  if (pathname.startsWith('/admin')) return 'الإدارة'
  return 'الإدارة'
}

const navLinkBase =
  'flex items-center rounded-lg py-2.5 text-sm font-medium transition-[padding,gap,background-color,color] duration-200 outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white'

function navLinkClass(compact: boolean): string {
  return compact
    ? `${navLinkBase} justify-center gap-0 px-2`
    : `${navLinkBase} gap-3 px-3`
}

function initialNavCompact(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(max-width: 1023px)').matches
}

export function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isPOS = location.pathname.startsWith('/admin/pos')
  /** Mobile drawer: hidden by default (قائمة منسدلة) */
  const [mobileOpen, setMobileOpen] = useState(false)
  /** مضغوط = أيقونات فقط؛ موسّع = أيقونات + نصوص (الجوال يبدأ مضغوطاً افتراضياً) */
  const [navCompact, setNavCompact] = useState(initialNavCompact)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileOpen])

  if (isPOS) {
    return (
      <div className="min-h-svh">
        <Outlet />
      </div>
    )
  }

  const pageTitle = titleForPath(location.pathname)

  const NavItems = ({
    compact,
    onNavigate,
  }: {
    compact: boolean
    onNavigate?: () => void
  }) => (
    <>
      {links.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          title={compact ? label : undefined}
          onClick={onNavigate}
          className={({ isActive }) =>
            `${navLinkClass(compact)} ${
              isActive
                ? 'bg-violet-50 text-violet-900 shadow-sm shadow-violet-900/5'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <Icon className="h-[18px] w-[18px] shrink-0 opacity-90" aria-hidden />
          <span className={compact ? 'sr-only' : undefined}>{label}</span>
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="flex min-h-svh w-full bg-slate-100">
      <aside
        id="admin-desktop-sidebar"
        className={`hidden shrink-0 overflow-hidden border-e border-slate-200/90 bg-white transition-[width] duration-300 ease-in-out lg:flex lg:flex-col ${
          navCompact ? 'lg:w-[76px]' : 'lg:w-[260px]'
        }`}
      >
        <div className="flex h-full min-h-svh w-full min-w-0 flex-col">
          <div
            className={`border-b border-slate-100 pt-6 transition-[padding] duration-300 ${
              navCompact ? 'px-2 pb-4 text-center' : 'px-5 pb-5'
            }`}
          >
            {navCompact ? (
              <div
                className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 font-display text-sm font-bold text-white shadow-sm shadow-violet-900/20"
                title="أبو طلال — الإدارة"
              >
                أ
              </div>
            ) : (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                  أبو طلال
                </p>
                <p className="mt-1 font-display text-lg font-bold tracking-tight text-slate-900">
                  الإدارة
                </p>
                {user && (
                  <p
                    className="mt-2 truncate text-xs leading-relaxed text-slate-500"
                    title={user.email}
                  >
                    {user.email}
                  </p>
                )}
              </>
            )}
          </div>
          <nav
            className={`flex flex-1 flex-col gap-0.5 py-4 transition-[padding] duration-300 ${
              navCompact ? 'px-2' : 'px-3'
            }`}
          >
            <NavItems compact={navCompact} />
          </nav>
          <div
            className={`mt-auto space-y-1 border-t border-slate-100 py-4 transition-[padding] duration-300 ${
              navCompact ? 'px-2' : 'px-3'
            }`}
          >
            <Button
              type="button"
              variant="secondary"
              title="تسجيل الخروج"
              className={
                navCompact
                  ? 'w-full !justify-center !rounded-lg !px-2 !py-2.5 !text-slate-700'
                  : 'w-full !justify-start !rounded-lg !py-2.5 !text-slate-700'
              }
              onClick={() => logout()}
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span className={navCompact ? 'sr-only' : undefined}>
                تسجيل الخروج
              </span>
            </Button>
            <NavLink
              to="/"
              title={navCompact ? 'عرض المتجر' : undefined}
              className={`flex items-center rounded-lg py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800 ${
                navCompact ? 'justify-center px-2' : 'gap-3 px-3'
              }`}
            >
              <Store className="h-4 w-4 shrink-0" aria-hidden />
              <span className={navCompact ? 'sr-only' : undefined}>
                عرض المتجر
              </span>
            </NavLink>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* شريط أدوات سطح المكتب: طي/توسيع الشريط الجانبي + عنوان */}
        <div className="sticky top-0 z-20 hidden shrink-0 items-center gap-3 border-b border-slate-200/90 bg-white/95 px-4 py-2.5 backdrop-blur-md supports-backdrop-filter:bg-white/80 lg:flex">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-expanded={!navCompact}
            aria-controls="admin-desktop-sidebar"
            onClick={() => setNavCompact((v) => !v)}
          >
            {navCompact ? (
              <PanelLeftOpen className="h-5 w-5" aria-hidden />
            ) : (
              <PanelLeftClose className="h-5 w-5" aria-hidden />
            )}
            <span className="sr-only">
              {navCompact
                ? 'توسيع القائمة (أيقونات ونصوص)'
                : 'طي القائمة (أيقونات فقط)'}
            </span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold tracking-tight text-slate-900">
              {pageTitle}
            </p>
            <p className="text-xs text-slate-500">إدارة المتجر</p>
          </div>
        </div>

        {/* شريط علوي للجوال: قائمة + عنوان — القائمة مخفية افتراضياً */}
        <header className="sticky top-0 z-30 flex shrink-0 items-center gap-4 border-b border-slate-200/90 bg-white/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-md supports-backdrop-filter:bg-white/80 sm:px-5 lg:hidden">
          <button
            type="button"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-expanded={mobileOpen}
            aria-controls="admin-mobile-nav"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="sr-only">
              {mobileOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            </span>
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {pageTitle}
            </p>
            <p className="hidden text-xs text-slate-500 sm:block">إدارة المتجر</p>
          </div>
        </header>

        {mobileOpen ? (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] lg:hidden"
              aria-label="إغلاق القائمة"
              onClick={() => setMobileOpen(false)}
            />
            <div
              id="admin-mobile-nav"
              className={`fixed inset-y-0 start-0 z-50 flex flex-col border-e border-slate-200 bg-white shadow-xl transition-[width] duration-300 ease-in-out lg:hidden ${
                navCompact ? 'w-[min(100%,88px)]' : 'w-[min(100%,320px)]'
              }`}
            >
              <div
                className={`border-b border-slate-100 pt-5 transition-[padding] duration-300 ${
                  navCompact
                    ? 'flex flex-col items-center gap-3 px-2 pb-4'
                    : 'flex items-start gap-2 px-5 pb-4'
                }`}
              >
                {!navCompact && (
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                      أبو طلال
                    </p>
                    <p className="mt-1 font-display text-lg font-bold text-slate-900">
                      الإدارة
                    </p>
                    {user && (
                      <p className="mt-2 truncate text-xs text-slate-500">
                        {user.email}
                      </p>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 ${
                    navCompact ? '' : 'shrink-0'
                  }`}
                  aria-expanded={!navCompact}
                  aria-controls="admin-mobile-nav"
                  onClick={() => setNavCompact((v) => !v)}
                >
                  {navCompact ? (
                    <PanelLeftOpen className="h-4 w-4" aria-hidden />
                  ) : (
                    <PanelLeftClose className="h-4 w-4" aria-hidden />
                  )}
                  <span className="sr-only">
                    {navCompact
                      ? 'توسيع القائمة'
                      : 'طي القائمة (أيقونات فقط)'}
                  </span>
                </button>
                {navCompact && (
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 font-display text-sm font-bold text-white shadow-sm"
                    title="أبو طلال — الإدارة"
                  >
                    أ
                  </div>
                )}
              </div>
              <nav
                className={`flex flex-1 flex-col gap-0.5 overflow-y-auto py-4 transition-[padding] duration-300 ${
                  navCompact ? 'px-2' : 'px-3'
                }`}
              >
                <NavItems
                  compact={navCompact}
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>
              <div
                className={`space-y-1 border-t border-slate-100 py-4 transition-[padding] duration-300 ${
                  navCompact ? 'px-2' : 'px-3'
                }`}
              >
                <Button
                  type="button"
                  variant="secondary"
                  title="تسجيل الخروج"
                  className={
                    navCompact
                      ? 'w-full !justify-center !px-2'
                      : 'w-full !justify-start'
                  }
                  onClick={() => {
                    setMobileOpen(false)
                    logout()
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden />
                  <span className={navCompact ? 'sr-only' : undefined}>
                    تسجيل الخروج
                  </span>
                </Button>
                <NavLink
                  to="/"
                  title={navCompact ? 'عرض المتجر' : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-lg py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50 ${
                    navCompact ? 'justify-center px-2' : 'gap-3 px-3'
                  }`}
                >
                  <Store className="h-4 w-4" aria-hidden />
                  <span className={navCompact ? 'sr-only' : undefined}>
                    عرض المتجر
                  </span>
                </NavLink>
              </div>
            </div>
          </>
        ) : null}

        <main className="flex-1 px-4 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-5 sm:py-8 lg:px-8 lg:py-10">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
