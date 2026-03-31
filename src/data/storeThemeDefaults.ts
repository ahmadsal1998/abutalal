import {
  FOOTER_CHROME_TEMPLATES,
  HEADER_CHROME_TEMPLATES,
} from '@/data/storeChromeTemplates'
import type { StoreChromeColors, StoreThemeHero, StoreThemeSettings } from '@/types/storeTheme'
import { DEFAULT_HERO_BANNER_IMAGE_URLS } from '@/lib/storefrontHeroBanner'

const defaultHeaderChromeDef = HEADER_CHROME_TEMPLATES[0]
const defaultFooterChromeDef = FOOTER_CHROME_TEMPLATES[0]

const defaultHeaderChromeColors: StoreChromeColors = {
  background: '#ffffff',
  text: '#0f172a',
  link: '#64748b',
  button: '#0284c7',
}

const defaultFooterChromeColors: StoreChromeColors = {
  background: '#0f172a',
  text: '#e2e8f0',
  link: '#94a3b8',
  button: '#0284c7',
}

/** Drops legacy persisted hero copy fields; keeps only image settings. */
export function mergeHero(
  base: StoreThemeHero,
  patch: Partial<StoreThemeHero> | undefined,
): StoreThemeHero {
  const merged = { ...base, ...patch }
  const url = merged.heroImageUrl
  return {
    heroImageUrl:
      typeof url === 'string' && url.trim() !== '' ? url.trim() : null,
    heroBannerImageUrls: Array.isArray(merged.heroBannerImageUrls)
      ? merged.heroBannerImageUrls
      : [],
  }
}

export const DEFAULT_STORE_THEME_ID = 'default'

export const defaultStoreThemeContent: StoreThemeSettings['content'] = {
  aboutTitle: 'لماذا أبو طلال؟',
  aboutBody:
    'نختار لك الأجهزة والإكسسوارات بعناية، ونوفر تجربة شراء واضحة ودعماً يستجيب لاحتياجك. نعمل على توسيع الخدمات وربط الدفع والشحن مع واجهتك الخلفية عند الجاهزية.',
  aboutHighlight: 'جودة · شفافية · سرعة',
  faq: [
    {
      question: 'كم مدة التوصيل؟',
      answer:
        'يختلف حسب المدينة — التوصيل السريع متاح في مناطق مختارة (وضع تجريبي).',
    },
    {
      question: 'هل يمكن الإرجاع؟',
      answer:
        'سياسة الإرجاع تُعرض في صفحة الشروط؛ الوضع الحالي للعرض التجريبي فقط.',
    },
    {
      question: 'هل الأجهزة أصلية؟',
      answer: 'نعتمد على موردين معتمدين ونذكر حالة الجهاز بوضوح في التفاصيل.',
    },
  ],
  testimonials: [
    {
      name: 'سارة م.',
      role: 'القاهرة',
      text: 'طلب سلس وتغليف ممتاز، وصل في الموعد المتوقع.',
      rating: 5,
    },
    {
      name: 'يوسف ك.',
      role: 'الإسكندرية',
      text: 'واجهة واضحة والدفع بدون تعقيد.',
      rating: 5,
    },
    {
      name: 'نورا ح.',
      role: 'الجيزة',
      text: 'دعم سريع على الواتساب، أنصح بالتجربة.',
      rating: 4.5,
    },
  ],
  quickLinks: [
    { label: 'كل المنتجات', to: '/products' },
    { label: 'الهواتف', to: '/products?category=phone' },
    { label: 'الإكسسوارات', to: '/products?category=accessory' },
    { label: 'السلة', to: '/cart' },
    { label: 'الدفع', to: '/checkout' },
  ],
}

export const defaultStoreThemeSettings: StoreThemeSettings = {
  id: DEFAULT_STORE_THEME_ID,
  version: 3,
  storeId: null,
  presetId: null,
  templateId: 'modern-minimal',
  productDetailTemplate: 'split',
  colors: {
    primary: '#0284c7',
    secondary: '#6366f1',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    muted: '#64748b',
  },
  typography: {
    fontFamily: 'tajawal',
    baseScale: 1,
  },
  layout: {
    gridDensity: 'comfortable',
    cardRadius: '2xl',
    sectionSpacing: 'normal',
  },
  header: {
    logoText: 'أبو طلال',
    logoImageUrl: null,
    showLogoImage: false,
    chromeTemplateId: defaultHeaderChromeDef.id,
    chromeColors: { ...defaultHeaderChromeColors },
    chromeContent: { ...defaultHeaderChromeDef.defaultContent },
    chromeVisibility: { ...defaultHeaderChromeDef.defaultVisibility },
  },
  footer: {
    templateId: defaultFooterChromeDef.id,
    colors: { ...defaultFooterChromeColors },
    content: { ...defaultFooterChromeDef.defaultContent },
    visibility: { ...defaultFooterChromeDef.defaultVisibility },
  },
  hero: {
    heroImageUrl: null,
    heroBannerImageUrls: [...DEFAULT_HERO_BANNER_IMAGE_URLS],
  },
  banner: {
    midBannerTitle: 'وفّر مع حزمة ترقيتك القادمة',
    midBannerSubtitle:
      'أضف غطاءً أو شاحناً مع أي هاتف — عرض تجريبي لعرض الواجهة.',
  },
  content: defaultStoreThemeContent,
  sections: {
    hero: true,
    products: true,
    sliders: true,
    about: true,
    quickLinks: true,
    faq: true,
    testimonials: true,
  },
}

export function mergeStoreTheme(
  base: StoreThemeSettings,
  patch: Partial<StoreThemeSettings>,
): StoreThemeSettings {
  const merged: StoreThemeSettings = {
    ...base,
    ...patch,
    colors: { ...base.colors, ...patch.colors },
    typography: { ...base.typography, ...patch.typography },
    layout: { ...base.layout, ...patch.layout },
    header: {
      ...base.header,
      ...patch.header,
      chromeColors: {
        ...base.header.chromeColors,
        ...patch.header?.chromeColors,
      },
      chromeContent: {
        ...base.header.chromeContent,
        ...patch.header?.chromeContent,
      },
      chromeVisibility: {
        ...base.header.chromeVisibility,
        ...patch.header?.chromeVisibility,
      },
    },
    footer: {
      ...base.footer,
      ...patch.footer,
      colors: {
        ...base.footer.colors,
        ...patch.footer?.colors,
      },
      content: {
        ...base.footer.content,
        ...patch.footer?.content,
      },
      visibility: {
        ...base.footer.visibility,
        ...patch.footer?.visibility,
      },
    },
    hero: mergeHero(base.hero, patch.hero),
    banner: { ...base.banner, ...patch.banner },
    content: {
      ...base.content,
      ...(patch.content ?? {}),
      faq: patch.content?.faq ?? base.content.faq,
      testimonials: patch.content?.testimonials ?? base.content.testimonials,
      quickLinks: (patch.content?.quickLinks ?? base.content.quickLinks).filter(
        (l) => l.to.trim() !== '/track',
      ),
    },
    sections: { ...base.sections, ...patch.sections },
    templateId: patch.templateId ?? base.templateId ?? 'modern-minimal',
    productDetailTemplate:
      patch.productDetailTemplate ??
      base.productDetailTemplate ??
      'split',
  }
  return merged
}
