import {
  defaultStoreThemeContent,
  defaultStoreThemeSettings,
  mergeStoreTheme,
} from '@/data/storeThemeDefaults'
import type { StoreThemeSettings, StoreTemplateId } from '@/types/storeTheme'

/** Local mock; replace with GET/PATCH `/api/stores/:storeId/theme` later. */
const STORAGE_KEY_V2 = 'abu-talal:store-theme:v2'
const STORAGE_KEY_V1 = 'abu-talal:store-theme:v1'

function mapLegacyPresetToTemplate(
  presetId: string | null | undefined,
): StoreTemplateId {
  const m: Record<string, StoreTemplateId> = {
    ocean: 'bold-colorful',
    midnight: 'luxury',
    emerald: 'grid-clean',
    warm: 'bold-colorful',
    minimal: 'modern-minimal',
  }
  if (presetId && m[presetId]) return m[presetId]
  return 'modern-minimal'
}

function migrateLegacyPayload(parsed: Partial<StoreThemeSettings>): StoreThemeSettings {
  const sec = parsed.sections as
    | StoreThemeSettings['sections']
    | (Record<string, boolean> & {
        trustBadges?: boolean
        categories?: boolean
        promoBanner?: boolean
        featured?: boolean
        trending?: boolean
        newsletter?: boolean
      })
    | undefined

  const isLegacy =
    sec &&
    ('trustBadges' in sec ||
      'categories' in sec ||
      'promoBanner' in sec ||
      'featured' in sec)

  const sections: StoreThemeSettings['sections'] = isLegacy
    ? {
        hero: (sec as { hero?: boolean }).hero ?? true,
        products: (sec as { featured?: boolean }).featured ?? true,
        sliders: (sec as { trending?: boolean }).trending ?? true,
        about: true,
        quickLinks: true,
        faq: true,
        testimonials: true,
      }
    : {
        ...defaultStoreThemeSettings.sections,
        ...sec,
      }

  const templateId =
    parsed.templateId ??
    mapLegacyPresetToTemplate(parsed.presetId ?? undefined)

  return mergeStoreTheme(defaultStoreThemeSettings, {
    ...parsed,
    version: 2,
    templateId,
    sections,
    content: parsed.content ?? defaultStoreThemeContent,
  })
}

export function loadStoreThemeFromStorage(): StoreThemeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_V2)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoreThemeSettings>
      return mergeStoreTheme(defaultStoreThemeSettings, parsed)
    }
    const legacy = localStorage.getItem(STORAGE_KEY_V1)
    if (legacy) {
      const migrated = migrateLegacyPayload(JSON.parse(legacy))
      saveStoreThemeToStorage(migrated)
      localStorage.removeItem(STORAGE_KEY_V1)
      return migrated
    }
  } catch {
    /* ignore */
  }
  return defaultStoreThemeSettings
}

export function saveStoreThemeToStorage(settings: StoreThemeSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(settings))
  } catch {
    /* ignore quota */
  }
}

export function clearStoreThemeStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_V2)
    localStorage.removeItem(STORAGE_KEY_V1)
  } catch {
    /* ignore */
  }
}
