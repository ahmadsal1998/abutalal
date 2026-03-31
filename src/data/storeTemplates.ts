import type { StoreThemeSettings, StoreTemplateId } from '@/types/storeTheme'
import { DEFAULT_HERO_BANNER_IMAGE_URLS } from '@/lib/storefrontHeroBanner'

export interface StoreTemplateDefinition {
  id: StoreTemplateId
  name: string
  description: string
  /** Short label for admin cards */
  styleTag: string
  /** Merged on top of defaults — switches layout component + full visual DNA */
  settings: Partial<StoreThemeSettings>
}

export const storeTemplates: StoreTemplateDefinition[] = [
  {
    id: 'modern-minimal',
    name: 'حديث بسيط',
    styleTag: 'Modern Minimal',
    description:
      'مساحات واسعة، حدود رفيعة، شبكة منتجات هادئة — مناسب للعلامات الراقية والوضوح.',
    settings: {
      templateId: 'modern-minimal',
      colors: {
        primary: '#0f172a',
        secondary: '#64748b',
        background: '#fafafa',
        surface: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
      },
      typography: { fontFamily: 'cairo', baseScale: 1 },
      layout: {
        gridDensity: 'spacious',
        cardRadius: 'xl',
        sectionSpacing: 'relaxed',
      },
      hero: {
        heroImageUrl: null,
        heroBannerImageUrls: [...DEFAULT_HERO_BANNER_IMAGE_URLS],
      },
    },
  },
  {
    id: 'bold-colorful',
    name: 'جريء ولوني',
    styleTag: 'Bold & Colorful',
    description:
      'تدرجات قوية، بطاقات مستديرة كبيرة، طاقة عالية — مثالي للعروض والموسميات.',
    settings: {
      templateId: 'bold-colorful',
      colors: {
        primary: '#7c3aed',
        secondary: '#f97316',
        background: '#fff7ed',
        surface: '#ffffff',
        text: '#1e1b4b',
        muted: '#64748b',
      },
      typography: { fontFamily: 'tajawal', baseScale: 1.02 },
      layout: {
        gridDensity: 'comfortable',
        cardRadius: '3xl',
        sectionSpacing: 'relaxed',
      },
      hero: {
        heroImageUrl: null,
        heroBannerImageUrls: [...DEFAULT_HERO_BANNER_IMAGE_URLS],
      },
    },
  },
  {
    id: 'luxury',
    name: 'فاخر',
    styleTag: 'Luxury',
    description:
      'أسطح داكنة، لمسات ذهبية، مساحات سخية — يوحي بالتميز والثقة.',
    settings: {
      templateId: 'luxury',
      colors: {
        primary: '#d4af37',
        secondary: '#c9a227',
        background: '#0c0a09',
        surface: '#1c1917',
        text: '#fafaf9',
        muted: '#a8a29e',
      },
      typography: { fontFamily: 'almarai', baseScale: 1.03 },
      layout: {
        gridDensity: 'comfortable',
        cardRadius: '2xl',
        sectionSpacing: 'relaxed',
      },
      hero: {
        heroImageUrl: null,
        heroBannerImageUrls: [...DEFAULT_HERO_BANNER_IMAGE_URLS],
      },
    },
  },
  {
    id: 'grid-clean',
    name: 'شبكة نظيفة',
    styleTag: 'Grid-based',
    description:
      'شبكة صارمة، بطاقات متساوية الارتفاع، خطوط واضحة — مثالي للكتالوج الكثيف.',
    settings: {
      templateId: 'grid-clean',
      colors: {
        primary: '#0369a1',
        secondary: '#0d9488',
        background: '#f1f5f9',
        surface: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
      },
      typography: { fontFamily: 'cairo', baseScale: 0.98 },
      layout: {
        gridDensity: 'compact',
        cardRadius: 'xl',
        sectionSpacing: 'normal',
      },
      hero: {
        heroImageUrl: null,
        heroBannerImageUrls: [...DEFAULT_HERO_BANNER_IMAGE_URLS],
      },
    },
  },
  {
    id: 'dynamic-interactive',
    name: 'ديناميكي',
    styleTag: 'Dynamic',
    description:
      'طبقات مائلة، تفاعل عند المرور، حدود متدرجة — يشعر بالحركة والحداثة.',
    settings: {
      templateId: 'dynamic-interactive',
      colors: {
        primary: '#2563eb',
        secondary: '#db2777',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
      },
      typography: { fontFamily: 'tajawal', baseScale: 1.01 },
      layout: {
        gridDensity: 'comfortable',
        cardRadius: '2xl',
        sectionSpacing: 'normal',
      },
      hero: {
        heroImageUrl: null,
        heroBannerImageUrls: [...DEFAULT_HERO_BANNER_IMAGE_URLS],
      },
    },
  },
]

export function getStoreTemplate(
  id: StoreTemplateId,
): StoreTemplateDefinition | undefined {
  return storeTemplates.find((t) => t.id === id)
}
