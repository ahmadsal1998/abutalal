import { Outlet } from 'react-router-dom'
import { useStoreTheme } from '@/contexts/StoreThemeContext'
import { storeThemeToCssVars } from '@/lib/storeThemeCssVars'
import { StoreFooter } from '@/components/storefront/StoreFooter'
import { StoreHeader } from '@/components/storefront/StoreHeader'
import { StoreBottomNav } from '@/components/storefront/StoreBottomNav'
import { useAppChrome } from '@/hooks/useAppChrome'

export function StoreLayout() {
  const { settings } = useStoreTheme()
  const { showStoreBottomNav } = useAppChrome()

  return (
    <div
      className="flex min-h-svh min-w-0 flex-col overflow-x-hidden bg-[var(--store-bg)] bg-gradient-to-b from-[var(--store-bg)] via-[var(--store-surface)] to-[var(--store-bg)]"
      style={storeThemeToCssVars(settings)}
    >
      <StoreHeader />

      <main
        className={`mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-10 ${
          showStoreBottomNav
            ? 'pb-[calc(5.25rem+env(safe-area-inset-bottom))]'
            : ''
        }`}
      >
        <Outlet />
      </main>

      {showStoreBottomNav ? null : <StoreFooter />}
      {showStoreBottomNav ? <StoreBottomNav /> : null}
    </div>
  )
}
