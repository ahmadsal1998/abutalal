/**
 * JSON-driven registry for storefront header/footer chrome.
 * Add new templates here + matching renderer in StoreHeader / StoreFooter.
 */

export type ChromeFieldType = 'text' | 'textarea' | 'url'

export interface ChromeFieldDef {
  id: string
  label: string
  type: ChromeFieldType
}

export interface ChromeVisibilityDef {
  id: string
  label: string
}

export interface StoreChromeTemplateDef {
  id: string
  name: string
  description: string
  /** Keys merged into theme when switching to this template */
  defaultContent: Record<string, string>
  defaultVisibility: Record<string, boolean>
  /** Editable text fields shown in admin */
  fields: ChromeFieldDef[]
  /** Show/hide toggles */
  visibilityFields: ChromeVisibilityDef[]
}

export const HEADER_CHROME_TEMPLATES: StoreChromeTemplateDef[] = [
  {
    id: 'glass-pills',
    name: 'زجاجي — حبوب',
    description: 'شريط لزج مع تنقّل دائري وخلفية فاتحة — الأقرب للوضع الحالي.',
    defaultContent: {
      headerTagline: '',
    },
    defaultVisibility: {
      showLogo: true,
      showNav: true,
      showSearch: true,
      showCart: true,
    },
    fields: [
      {
        id: 'headerTagline',
        label: 'سطر تحت الشعار (اختياري)',
        type: 'text',
      },
    ],
    visibilityFields: [
      { id: 'showLogo', label: 'إظهار الشعار' },
      { id: 'showNav', label: 'إظهار قائمة التنقل' },
      { id: 'showSearch', label: 'إظهار أيقونة البحث' },
      { id: 'showCart', label: 'إظهار السلة' },
    ],
  },
  {
    id: 'minimal-bar',
    name: 'بسيط — شريط',
    description: 'رأس مسطّح بحد سفلي وروابط نصية بدون حاوية دائرية.',
    defaultContent: {
      headerTagline: '',
    },
    defaultVisibility: {
      showLogo: true,
      showNav: true,
      showSearch: true,
      showCart: true,
    },
    fields: [
      {
        id: 'headerTagline',
        label: 'سطر تحت الشعار (اختياري)',
        type: 'text',
      },
    ],
    visibilityFields: [
      { id: 'showLogo', label: 'إظهار الشعار' },
      { id: 'showNav', label: 'إظهار قائمة التنقل' },
      { id: 'showSearch', label: 'إظهار أيقونة البحث' },
      { id: 'showCart', label: 'إظهار السلة' },
    ],
  },
  {
    id: 'elevated-split',
    name: 'مرتفع — فصل',
    description: 'ظل أوضح، شعار بارز وروابط بمحاذاة نهاية الصفحة.',
    defaultContent: {
      headerTagline: 'تسوق بثقة',
    },
    defaultVisibility: {
      showLogo: true,
      showNav: true,
      showSearch: true,
      showCart: true,
    },
    fields: [
      {
        id: 'headerTagline',
        label: 'سطر تحت الشعار',
        type: 'text',
      },
    ],
    visibilityFields: [
      { id: 'showLogo', label: 'إظهار الشعار' },
      { id: 'showNav', label: 'إظهار قائمة التنقل' },
      { id: 'showSearch', label: 'إظهار أيقونة البحث' },
      { id: 'showCart', label: 'إظهار السلة' },
    ],
  },
]

export const FOOTER_CHROME_TEMPLATES: StoreChromeTemplateDef[] = [
  {
    id: 'columns-dark',
    name: 'أعمدة — داكن',
    description: 'تذييل غني بأعمدة التسوق والمعلومات والدعم.',
    defaultContent: {
      tagline:
        'هواتف وإكسسوارات بجودة عالية وواجهة سريعة. بيانات تجريبية للعرض — جاهزة لربط الخادم لاحقاً.',
      shopColumnTitle: 'التسوق',
      infoColumnTitle: 'معلومات',
      supportColumnTitle: 'الدعم',
      supportBlurb: 'مركز المساعدة (قريباً)',
      whyTitle: 'لماذا نحن',
      feature1Title: 'توصيل سريع',
      feature1Sub: 'خيارات شحن داخل البلاد',
      feature2Title: 'دفع آمن',
      feature2Sub: 'تشفير الدفع (قريباً)',
      feature3Title: 'دعم حقيقي',
      feature3Sub: 'نرد خلال ٢٤ ساعة',
      copyrightSuffix: 'للموبايل. جميع الحقوق محفوظة.',
      socialTwitter: 'https://twitter.com',
      socialInstagram: 'https://instagram.com',
      socialFacebook: 'https://facebook.com',
    },
    defaultVisibility: {
      showLogo: true,
      showTagline: true,
      showSocial: true,
      showShopColumn: true,
      showInfoColumn: true,
      showSupportColumn: true,
      showWhyColumn: true,
      showBottomBar: true,
    },
    fields: [
      { id: 'tagline', label: 'وصف قصير', type: 'textarea' },
      { id: 'shopColumnTitle', label: 'عمود التسوق — عنوان', type: 'text' },
      { id: 'infoColumnTitle', label: 'عمود المعلومات — عنوان', type: 'text' },
      {
        id: 'supportColumnTitle',
        label: 'عمود الدعم — عنوان',
        type: 'text',
      },
      { id: 'supportBlurb', label: 'عمود الدعم — نص', type: 'text' },
      { id: 'whyTitle', label: 'قسم «لماذا نحن» — عنوان', type: 'text' },
      { id: 'feature1Title', label: 'ميزة ١ — عنوان', type: 'text' },
      { id: 'feature1Sub', label: 'ميزة ١ — وصف', type: 'text' },
      { id: 'feature2Title', label: 'ميزة ٢ — عنوان', type: 'text' },
      { id: 'feature2Sub', label: 'ميزة ٢ — وصف', type: 'text' },
      { id: 'feature3Title', label: 'ميزة ٣ — عنوان', type: 'text' },
      { id: 'feature3Sub', label: 'ميزة ٣ — وصف', type: 'text' },
      { id: 'copyrightSuffix', label: 'نص حقوق النشر (بعد اسم المتجر)', type: 'text' },
      { id: 'socialTwitter', label: 'رابط تويتر', type: 'url' },
      { id: 'socialInstagram', label: 'رابط إنستغرام', type: 'url' },
      { id: 'socialFacebook', label: 'رابط فيسبوك / موقع', type: 'url' },
    ],
    visibilityFields: [
      { id: 'showLogo', label: 'إظهار الشعار' },
      { id: 'showTagline', label: 'إظهار الوصف' },
      { id: 'showSocial', label: 'إظهار أيقونات التواصل' },
      { id: 'showShopColumn', label: 'عمود التسوق' },
      { id: 'showInfoColumn', label: 'عمود صفحات المعلومات' },
      { id: 'showSupportColumn', label: 'عمود الدعم' },
      { id: 'showWhyColumn', label: 'قسم المميزات' },
      { id: 'showBottomBar', label: 'الشريط السفلي (حقوق + روابط)' },
    ],
  },
  {
    id: 'minimal-light',
    name: 'بسيط — فاتح',
    description: 'خلفية فاتحة وحدود علوية، أعمدة مرتبة بهدوء.',
    defaultContent: {
      tagline: 'تجربة شراء واضحة ودعم يستجيب لاحتياجك.',
      shopColumnTitle: 'تسوق',
      infoColumnTitle: 'صفحات',
      supportColumnTitle: 'مساعدة',
      supportBlurb: 'تواصل معنا قريباً',
      whyTitle: 'لماذا نحن',
      feature1Title: 'شحن',
      feature1Sub: 'خيارات متعددة',
      feature2Title: 'دفع',
      feature2Sub: 'آمن',
      feature3Title: 'دعم',
      feature3Sub: 'سريع',
      copyrightSuffix: 'جميع الحقوق محفوظة.',
      socialTwitter: 'https://twitter.com',
      socialInstagram: 'https://instagram.com',
      socialFacebook: 'https://facebook.com',
    },
    defaultVisibility: {
      showLogo: true,
      showTagline: true,
      showSocial: true,
      showShopColumn: true,
      showInfoColumn: true,
      showSupportColumn: true,
      showWhyColumn: true,
      showBottomBar: true,
    },
    fields: [
      { id: 'tagline', label: 'وصف قصير', type: 'textarea' },
      { id: 'shopColumnTitle', label: 'عمود التسوق — عنوان', type: 'text' },
      { id: 'infoColumnTitle', label: 'عمود المعلومات — عنوان', type: 'text' },
      {
        id: 'supportColumnTitle',
        label: 'عمود الدعم — عنوان',
        type: 'text',
      },
      { id: 'supportBlurb', label: 'عمود الدعم — نص', type: 'text' },
      { id: 'whyTitle', label: 'قسم المميزات — عنوان', type: 'text' },
      { id: 'feature1Title', label: 'ميزة ١ — عنوان', type: 'text' },
      { id: 'feature1Sub', label: 'ميزة ١ — وصف', type: 'text' },
      { id: 'feature2Title', label: 'ميزة ٢ — عنوان', type: 'text' },
      { id: 'feature2Sub', label: 'ميزة ٢ — وصف', type: 'text' },
      { id: 'feature3Title', label: 'ميزة ٣ — عنوان', type: 'text' },
      { id: 'feature3Sub', label: 'ميزة ٣ — وصف', type: 'text' },
      { id: 'copyrightSuffix', label: 'نص حقوق النشر', type: 'text' },
      { id: 'socialTwitter', label: 'رابط تويتر', type: 'url' },
      { id: 'socialInstagram', label: 'رابط إنستغرام', type: 'url' },
      { id: 'socialFacebook', label: 'رابط فيسبوك / موقع', type: 'url' },
    ],
    visibilityFields: [
      { id: 'showLogo', label: 'إظهار الشعار' },
      { id: 'showTagline', label: 'إظهار الوصف' },
      { id: 'showSocial', label: 'إظهار أيقونات التواصل' },
      { id: 'showShopColumn', label: 'عمود التسوق' },
      { id: 'showInfoColumn', label: 'عمود صفحات المعلومات' },
      { id: 'showSupportColumn', label: 'عمود الدعم' },
      { id: 'showWhyColumn', label: 'قسم المميزات' },
      { id: 'showBottomBar', label: 'الشريط السفلي' },
    ],
  },
  {
    id: 'compact-bar',
    name: 'مضغوط — شريط',
    description: 'صف واحد: شعار، روابط مختصرة، تواصل.',
    defaultContent: {
      tagline: 'هواتف وإكسسوارات مختارة بعناية.',
      shopColumnTitle: 'روابط',
      infoColumnTitle: 'معلومات',
      supportColumnTitle: 'دعم',
      supportBlurb: '',
      whyTitle: '',
      feature1Title: '',
      feature1Sub: '',
      feature2Title: '',
      feature2Sub: '',
      feature3Title: '',
      feature3Sub: '',
      copyrightSuffix: 'جميع الحقوق محفوظة.',
      socialTwitter: 'https://twitter.com',
      socialInstagram: 'https://instagram.com',
      socialFacebook: 'https://facebook.com',
    },
    defaultVisibility: {
      showLogo: true,
      showTagline: true,
      showSocial: true,
      showShopColumn: true,
      showInfoColumn: true,
      showSupportColumn: false,
      showWhyColumn: false,
      showBottomBar: true,
    },
    fields: [
      { id: 'tagline', label: 'وصف قصير', type: 'textarea' },
      { id: 'copyrightSuffix', label: 'نص حقوق النشر', type: 'text' },
      { id: 'socialTwitter', label: 'رابط تويتر', type: 'url' },
      { id: 'socialInstagram', label: 'رابط إنستغرام', type: 'url' },
      { id: 'socialFacebook', label: 'رابط فيسبوك / موقع', type: 'url' },
    ],
    visibilityFields: [
      { id: 'showLogo', label: 'إظهار الشعار' },
      { id: 'showTagline', label: 'إظهار الوصف' },
      { id: 'showSocial', label: 'إظهار أيقونات التواصل' },
      { id: 'showShopColumn', label: 'روابط التسوق' },
      { id: 'showInfoColumn', label: 'صفحات المعلومات' },
      { id: 'showBottomBar', label: 'الشريط السفلي' },
    ],
  },
]

export function getHeaderChromeTemplate(
  id: string | undefined,
): StoreChromeTemplateDef {
  return (
    HEADER_CHROME_TEMPLATES.find((t) => t.id === id) ?? HEADER_CHROME_TEMPLATES[0]
  )
}

export function getFooterChromeTemplate(
  id: string | undefined,
): StoreChromeTemplateDef {
  return (
    FOOTER_CHROME_TEMPLATES.find((t) => t.id === id) ?? FOOTER_CHROME_TEMPLATES[0]
  )
}

/** Merge template defaults with existing content when switching templates */
export function mergeChromeStateForTemplate(
  def: StoreChromeTemplateDef,
  prevContent: Record<string, string>,
  prevVisibility: Record<string, boolean>,
): {
  content: Record<string, string>
  visibility: Record<string, boolean>
} {
  const content = { ...def.defaultContent }
  for (const key of Object.keys(def.defaultContent)) {
    if (prevContent[key] !== undefined && prevContent[key] !== '') {
      content[key] = prevContent[key]
    }
  }
  const visibility = { ...def.defaultVisibility }
  for (const key of Object.keys(def.defaultVisibility)) {
    if (prevVisibility[key] !== undefined) {
      visibility[key] = prevVisibility[key]!
    }
  }
  return { content, visibility }
}
