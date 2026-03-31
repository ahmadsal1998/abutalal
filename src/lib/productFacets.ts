import type { Product, ProductCategory } from '@/types'
import { categoryLabelAr } from '@/lib/displayLabels'

/** Reserved attribute key stored as dedicated URL param `color`, not `attr_color`. */
export const COLOR_ATTR_KEY = 'color'

export type FacetState = {
  categories: Set<ProductCategory>
  brands: Set<string>
  colors: Set<string>
  priceMin: number | null
  priceMax: number | null
  /** Non-color attribute keys → selected values (OR within key; AND across keys) */
  attributeFilters: Record<string, Set<string>>
}

export function emptyFacetState(): FacetState {
  return {
    categories: new Set(),
    brands: new Set(),
    colors: new Set(),
    priceMin: null,
    priceMax: null,
    attributeFilters: {},
  }
}

export type FacetOptions = {
  categoryOptions: { value: ProductCategory; label: string }[]
  brands: string[]
  colors: string[]
  priceBounds: { min: number; max: number }
  /** Dynamic facets from `attributes` (excluding color) */
  attributeGroups: { key: string; label: string; values: string[] }[]
}

export function attributeKeyLabelAr(key: string): string {
  const m: Record<string, string> = {
    storage: 'سعة التخزين',
    ram: 'الذاكرة العشوائية',
    material: 'المادة',
  }
  return m[key] ?? key
}

export function computeFacetOptions(products: Product[]): FacetOptions {
  const categories = new Set<ProductCategory>()
  const brands = new Set<string>()
  const colors = new Set<string>()
  const attrValues: Record<string, Set<string>> = {}
  let priceMin = Infinity
  let priceMax = -Infinity

  for (const p of products) {
    categories.add(p.category)
    brands.add(p.brand)
    priceMin = Math.min(priceMin, p.price)
    priceMax = Math.max(priceMax, p.price)
    const attrs = p.attributes ?? {}
    for (const [k, v] of Object.entries(attrs)) {
      if (!v) continue
      if (k === COLOR_ATTR_KEY) {
        colors.add(v)
      } else {
        if (!attrValues[k]) attrValues[k] = new Set()
        attrValues[k].add(v)
      }
    }
  }

  const categoryOptions: { value: ProductCategory; label: string }[] = []
  for (const c of ['phone', 'accessory'] as const) {
    if (categories.has(c)) {
      categoryOptions.push({ value: c, label: categoryLabelAr(c) })
    }
  }

  return {
    categoryOptions,
    brands: [...brands].sort((a, b) => a.localeCompare(b, 'ar')),
    colors: [...colors].sort((a, b) => a.localeCompare(b, 'ar')),
    priceBounds: {
      min: Number.isFinite(priceMin) ? Math.floor(priceMin) : 0,
      max: Number.isFinite(priceMax) ? Math.ceil(priceMax) : 0,
    },
    attributeGroups: Object.entries(attrValues)
      .map(([key, set]) => ({
        key,
        label: attributeKeyLabelAr(key),
        values: [...set].sort((a, b) => a.localeCompare(b, 'ar')),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'ar')),
  }
}

function matchesAttributeFilters(
  attrs: Record<string, string>,
  attributeFilters: Record<string, Set<string>>,
): boolean {
  for (const [key, selected] of Object.entries(attributeFilters)) {
    if (selected.size === 0) continue
    const v = attrs[key]
    if (!v || !selected.has(v)) return false
  }
  return true
}

export function filterProductsByFacets(
  products: Product[],
  state: FacetState,
  searchQuery: string,
): Product[] {
  const q = searchQuery.trim().toLowerCase()
  return products.filter((p) => {
    if (q) {
      const hay = `${p.name} ${p.brand} ${p.sku} ${p.description}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (state.categories.size > 0 && !state.categories.has(p.category)) {
      return false
    }
    if (state.brands.size > 0 && !state.brands.has(p.brand)) return false
    const attrs = p.attributes ?? {}
    const color = attrs[COLOR_ATTR_KEY]
    if (state.colors.size > 0) {
      if (!color || !state.colors.has(color)) return false
    }
    if (state.priceMin != null && p.price < state.priceMin) return false
    if (state.priceMax != null && p.price > state.priceMax) return false
    return matchesAttributeFilters(attrs, state.attributeFilters)
  })
}

export function countActiveFilters(state: FacetState, searchQuery: string): number {
  let n = 0
  if (searchQuery.trim()) n += 1
  n += state.categories.size
  n += state.brands.size
  n += state.colors.size
  if (state.priceMin != null) n += 1
  if (state.priceMax != null) n += 1
  for (const set of Object.values(state.attributeFilters)) {
    n += set.size
  }
  return n
}
