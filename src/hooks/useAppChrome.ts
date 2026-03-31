import { useEffect, useMemo, useState } from 'react'

function getStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const dm = window.matchMedia('(display-mode: standalone)').matches
  const ios =
    'standalone' in window.navigator &&
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  return dm || ios
}

/**
 * Mobile / installed PWA chrome: bottom nav, hide web-style footer, safe areas.
 */
export function useAppChrome() {
  const [mobile, setMobile] = useState(false)
  const [standalone, setStandalone] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const apply = () => {
      setMobile(mq.matches)
      setStandalone(getStandalone())
    }
    apply()
    mq.addEventListener('change', apply)
    const dm = window.matchMedia('(display-mode: standalone)')
    dm.addEventListener('change', apply)
    return () => {
      mq.removeEventListener('change', apply)
      dm.removeEventListener('change', apply)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (standalone) root.classList.add('pwa-standalone')
    else root.classList.remove('pwa-standalone')
  }, [standalone])

  return useMemo(
    () => ({
      /** Narrow viewport — mobile / tablet portrait layout */
      isMobileViewport: mobile,
      /** Installed PWA or iOS “Add to Home Screen” */
      isStandalone: standalone,
      /** Show app-style bottom bar; hide classic footer */
      showStoreBottomNav: mobile || standalone,
    }),
    [mobile, standalone],
  )
}
