import { NavLink, useLocation } from 'react-router-dom'
import { Home, LayoutGrid, ShoppingBag, Receipt, UserRound } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

type NavItem = {
  to: string
  end?: boolean
  label: string
  icon: typeof Home
}

const items: NavItem[] = [
  { to: '/', end: true, label: 'الرئيسية', icon: Home },
  { to: '/products', label: 'المنتجات', icon: LayoutGrid },
  { to: '/cart', label: 'السلة', icon: ShoppingBag },
  { to: '/orders', label: 'الطلبات', icon: Receipt },
  { to: '/account', label: 'الحساب', icon: UserRound },
]

export function StoreBottomNav() {
  const { itemCount } = useCart()
  const location = useLocation()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-[var(--store-surface)]/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-4px_24px_-8px_rgba(15,23,42,0.12)] backdrop-blur-xl supports-backdrop-filter:bg-[var(--store-surface)]/90 lg:hidden"
      aria-label="التنقل السفلي"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around gap-0 px-1 pt-1">
        {items.map(({ to, end, label, icon: Icon }) => {
          const active =
            end
              ? location.pathname === '/'
              : location.pathname === to ||
                location.pathname.startsWith(`${to}/`)
          const isCart = to === '/cart'
          return (
            <li key={to} className="min-w-0 flex-1">
              <NavLink
                to={to}
                end={end}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-semibold transition active:scale-[0.98] sm:min-h-[56px] sm:text-xs ${
                  active
                    ? 'text-[var(--store-primary)]'
                    : 'text-[var(--store-muted)] hover:text-[var(--store-text)]'
                } `}
              >
                <span className="relative inline-flex">
                  <Icon
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${active ? 'stroke-[2.5px]' : ''}`}
                    strokeWidth={active ? 2.5 : 2}
                    aria-hidden
                  />
                  {isCart && itemCount > 0 ? (
                    <span className="absolute -end-1.5 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-amber-400 px-0.5 text-[10px] font-bold text-slate-900 ring-2 ring-white">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  ) : null}
                </span>
                <span className="max-w-full truncate">{label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
