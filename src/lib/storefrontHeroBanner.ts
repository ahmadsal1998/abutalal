import type { StoreThemeHero } from '@/types/storeTheme'

export const HERO_BANNER_MAX_IMAGES = 5

/**
 * Default hero carousel — high-res smartphone photography (Unsplash).
 * Stores with custom `heroBannerImageUrls` in theme settings override these.
 */
export const DEFAULT_HERO_BANNER_IMAGE_URLS: readonly string[] = [
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1600&q=85',
] as const

/** Resolves carousel image URLs: explicit banner list, then legacy single URL, then product fallback. */
export function resolveHeroBannerImageUrls(
  hero: StoreThemeHero,
  fallbackProductUrl?: string,
): string[] {
  const fromList = (hero.heroBannerImageUrls ?? [])
    .map((u) => u.trim())
    .filter(Boolean)
    .slice(0, HERO_BANNER_MAX_IMAGES)
  if (fromList.length > 0) return fromList
  const single = hero.heroImageUrl?.trim()
  if (single) return [single]
  const fb = fallbackProductUrl?.trim()
  if (fb) return [fb]
  return []
}
