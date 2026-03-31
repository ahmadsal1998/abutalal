/**
 * Storefront theme — structured for future API / multi-tenant (storeId, version).
 */

import type { ProductDetailTemplateId } from '@/types'

export type StoreFontFamily = 'cairo' | 'tajawal' | 'almarai'

export type GridDensity = 'compact' | 'comfortable' | 'spacious'

export type CardRadiusPreset = 'xl' | '2xl' | '3xl'

export type SectionSpacing = 'normal' | 'relaxed'

/** Visual layout pack — drives which React layout component renders the home page */
export type StoreTemplateId =
  | 'modern-minimal'
  | 'bold-colorful'
  | 'luxury'
  | 'grid-clean'
  | 'dynamic-interactive'

export interface StoreThemeColors {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  muted: string
}

export interface StoreThemeTypography {
  fontFamily: StoreFontFamily
  /** 0.9 – 1.15 multiplier on base rem scale */
  baseScale: number
}

export interface StoreThemeLayout {
  gridDensity: GridDensity
  cardRadius: CardRadiusPreset
  sectionSpacing: SectionSpacing
}

/** Per–header/footer chrome (separate from global theme colors). */
export interface StoreChromeColors {
  background: string
  text: string
  link: string
  button: string
}

export interface StoreThemeHeader {
  logoText: string
  logoImageUrl: string | null
  showLogoImage: boolean
  /** Registry id in `storeChromeTemplates.ts` */
  chromeTemplateId: string
  chromeColors: StoreChromeColors
  /** Template-specific copy; keys depend on template.fields */
  chromeContent: Record<string, string>
  chromeVisibility: Record<string, boolean>
}

export interface StoreThemeFooterChrome {
  templateId: string
  colors: StoreChromeColors
  content: Record<string, string>
  visibility: Record<string, boolean>
}

export interface StoreThemeHero {
  /** Fallback when `heroBannerImageUrls` is empty */
  heroImageUrl: string | null
  /** Up to 5 banner images for the storefront hero carousel (URLs) */
  heroBannerImageUrls: string[]
}

export interface StoreThemeBanner {
  midBannerTitle: string
  midBannerSubtitle: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface TestimonialItem {
  name: string
  role?: string
  text: string
  rating: number
}

export interface QuickLinkItem {
  label: string
  to: string
}

/** Editable copy for universal sections (per store; templates seed defaults) */
export interface StoreThemeContent {
  aboutTitle: string
  aboutBody: string
  aboutHighlight: string
  faq: FaqItem[]
  testimonials: TestimonialItem[]
  quickLinks: QuickLinkItem[]
}

/**
 * All home templates expose the same logical sections; visibility toggles apply to every template.
 */
export interface StoreThemeSections {
  hero: boolean
  /** Main product grid / showcase */
  products: boolean
  /** Best sellers / new arrivals / featured sliders */
  sliders: boolean
  about: boolean
  quickLinks: boolean
  faq: boolean
  testimonials: boolean
}

export interface StoreThemeSettings {
  id: string
  version: number
  storeId: string | null
  /** @deprecated use templateId — kept for localStorage migration */
  presetId: string | null
  /** Active storefront layout template */
  templateId: StoreTemplateId
  /**
   * Single PDP layout for every product — global, not per-product.
   * @default 'split'
   */
  productDetailTemplate: ProductDetailTemplateId
  colors: StoreThemeColors
  typography: StoreThemeTypography
  layout: StoreThemeLayout
  header: StoreThemeHeader
  /** Footer chrome (templates + colors + content) */
  footer: StoreThemeFooterChrome
  hero: StoreThemeHero
  banner: StoreThemeBanner
  content: StoreThemeContent
  sections: StoreThemeSections
}

