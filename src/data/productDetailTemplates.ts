import type { ProductDetailTemplateId } from '@/types'

/** Single source of truth for PDP layouts — add entries here when introducing new templates. */
export const PRODUCT_DETAIL_TEMPLATE_IDS = [
  'split',
  'gallery',
  'editorial',
  'minimal',
  'showcase',
] as const satisfies readonly ProductDetailTemplateId[]

export const PRODUCT_DETAIL_TEMPLATE_META: Record<
  ProductDetailTemplateId,
  { label: string; summary: string }
> = {
  split: {
    label: 'شريطان (صورة + تفاصيل)',
    summary:
      'شبكة عمودين: صورة كبيرة بجانب النص والخيارات والشراء — الأنسب لمعظم المتاجر.',
  },
  gallery: {
    label: 'معرض + مصغّرات',
    summary:
      'صورة رئيسية مع عمود مصغّرات للتبديل السريع بين الخيارات التي تغيّر الصورة.',
  },
  editorial: {
    label: 'غلاف تحريري',
    summary:
      'بانر عريض مع عنوان على الصورة، ثم خيارات ومواصفات بأسلوب مجلّي.',
  },
  minimal: {
    label: 'بسيط (تركيز على المحتوى)',
    summary:
      'عمود واحد ضيّق، مساحات بيضاء واسعة وخطوط هادئة — يشبه صفحات العلامات الفاخرة.',
  },
  showcase: {
    label: 'عرض (لوحة داكنة)',
    summary:
      'نصف صورة ونصف لوحة داكنة للسعر والخيارات — مظهر قوي يبرز المنتج.',
  },
}

export function productDetailTemplateLabel(id: ProductDetailTemplateId): string {
  return PRODUCT_DETAIL_TEMPLATE_META[id]?.label ?? id
}
