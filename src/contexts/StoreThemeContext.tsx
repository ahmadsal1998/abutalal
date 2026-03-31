import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { defaultStoreThemeSettings, mergeStoreTheme } from '@/data/storeThemeDefaults'
import { storeTemplates } from '@/data/storeTemplates'
import type { StoreTemplateId, StoreThemeSettings } from '@/types/storeTheme'
import {
  loadStoreThemeFromStorage,
  saveStoreThemeToStorage,
} from '@/lib/storeThemeStorage'

type StoreThemeContextValue = {
  settings: StoreThemeSettings
  setSettings: (next: StoreThemeSettings) => void
  patchSettings: (patch: Partial<StoreThemeSettings>) => void
  applyTemplate: (templateId: StoreTemplateId) => void
  resetToDefaults: () => void
}

const StoreThemeContext = createContext<StoreThemeContextValue | null>(null)

export function StoreThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<StoreThemeSettings>(() =>
    loadStoreThemeFromStorage(),
  )

  useEffect(() => {
    saveStoreThemeToStorage(settings)
  }, [settings])

  const setSettings = useCallback((next: StoreThemeSettings) => {
    setSettingsState(next)
  }, [])

  const patchSettings = useCallback((patch: Partial<StoreThemeSettings>) => {
    setSettingsState((prev) => mergeStoreTheme(prev, patch))
  }, [])

  const applyTemplate = useCallback((templateId: StoreTemplateId) => {
    const t = storeTemplates.find((x) => x.id === templateId)
    if (!t) return
    setSettingsState((prev) =>
      mergeStoreTheme(mergeStoreTheme(defaultStoreThemeSettings, t.settings), {
        templateId: t.id,
        content: prev.content,
        productDetailTemplate: prev.productDetailTemplate,
        header: prev.header,
        footer: prev.footer,
      }),
    )
  }, [])

  const resetToDefaults = useCallback(() => {
    setSettingsState(defaultStoreThemeSettings)
  }, [])

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      patchSettings,
      applyTemplate,
      resetToDefaults,
    }),
    [settings, setSettings, patchSettings, applyTemplate, resetToDefaults],
  )

  return (
    <StoreThemeContext.Provider value={value}>
      {children}
    </StoreThemeContext.Provider>
  )
}

export function useStoreTheme(): StoreThemeContextValue {
  const ctx = useContext(StoreThemeContext)
  if (!ctx) {
    throw new Error('useStoreTheme must be used within StoreThemeProvider')
  }
  return ctx
}
