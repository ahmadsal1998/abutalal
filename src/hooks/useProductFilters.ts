import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product, ProductCategory } from '@/types'
import {
  type FacetState,
  computeFacetOptions,
  emptyFacetState,
  filterProductsByFacets,
  countActiveFilters,
} from '@/lib/productFacets'

function stripFilterParams(base: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(base)
  for (const k of ['category', 'brand', 'color', 'min', 'max', 'q']) {
    next.delete(k)
  }
  for (const k of [...next.keys()]) {
    if (k.startsWith('attr_')) next.delete(k)
  }
  return next
}

function facetStateToParams(state: FacetState, q: string): URLSearchParams {
  const p = new URLSearchParams()
  for (const c of state.categories) p.append('category', c)
  for (const b of state.brands) p.append('brand', b)
  for (const col of state.colors) p.append('color', col)
  if (state.priceMin != null) p.set('min', String(state.priceMin))
  if (state.priceMax != null) p.set('max', String(state.priceMax))
  for (const [key, set] of Object.entries(state.attributeFilters)) {
    for (const v of set) p.append(`attr_${key}`, v)
  }
  if (q.trim()) p.set('q', q.trim())
  return p
}

function mergeFilterIntoSearchParams(
  prev: URLSearchParams,
  state: FacetState,
  q: string,
): URLSearchParams {
  const stripped = stripFilterParams(prev)
  const facet = facetStateToParams(state, q)
  for (const [k, v] of facet.entries()) {
    stripped.append(k, v)
  }
  return stripped
}

function parseFacetState(searchParams: URLSearchParams): FacetState & { q: string } {
  const categories = new Set<ProductCategory>()
  for (const c of searchParams.getAll('category')) {
    if (c === 'phone' || c === 'accessory') categories.add(c)
  }
  const brands = new Set(searchParams.getAll('brand'))
  const colors = new Set(searchParams.getAll('color'))
  const minRaw = searchParams.get('min')
  const maxRaw = searchParams.get('max')
  const priceMin =
    minRaw != null && minRaw !== ''
      ? (() => {
          const n = Number(minRaw)
          return Number.isFinite(n) ? n : null
        })()
      : null
  const priceMax =
    maxRaw != null && maxRaw !== ''
      ? (() => {
          const n = Number(maxRaw)
          return Number.isFinite(n) ? n : null
        })()
      : null
  const attributeFilters: Record<string, Set<string>> = {}
  for (const [key, value] of searchParams.entries()) {
    if (!key.startsWith('attr_')) continue
    const attrKey = key.slice(5)
    if (!attrKey) continue
    if (!attributeFilters[attrKey]) attributeFilters[attrKey] = new Set()
    attributeFilters[attrKey].add(value)
  }
  return {
    categories,
    brands,
    colors,
    priceMin,
    priceMax,
    attributeFilters,
    q: searchParams.get('q') ?? '',
  }
}

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set)
  if (next.has(value)) next.delete(value)
  else next.add(value)
  return next
}

export function useProductFilters(products: Product[]) {
  const [searchParams, setSearchParams] = useSearchParams()

  const facets = useMemo(() => computeFacetOptions(products), [products])

  const parsed = useMemo(
    () => parseFacetState(searchParams),
    [searchParams],
  )

  const facetState: FacetState = useMemo(
    () => ({
      categories: parsed.categories,
      brands: parsed.brands,
      colors: parsed.colors,
      priceMin: parsed.priceMin,
      priceMax: parsed.priceMax,
      attributeFilters: parsed.attributeFilters,
    }),
    [parsed],
  )

  const searchQuery = parsed.q

  const filteredProducts = useMemo(
    () => filterProductsByFacets(products, facetState, searchQuery),
    [products, facetState, searchQuery],
  )

  const activeCount = useMemo(
    () => countActiveFilters(facetState, searchQuery),
    [facetState, searchQuery],
  )

  const commit = useCallback(
    (next: FacetState, q: string) => {
      setSearchParams(
        (prev) => mergeFilterIntoSearchParams(prev, next, q),
        { replace: true },
      )
    },
    [setSearchParams],
  )

  const setSearchQuery = useCallback(
    (q: string) => {
      commit(facetState, q)
    },
    [commit, facetState],
  )

  const toggleCategory = useCallback(
    (value: ProductCategory) => {
      const categories = toggleInSet(facetState.categories, value)
      commit({ ...facetState, categories }, searchQuery)
    },
    [commit, facetState, searchQuery],
  )

  const toggleBrand = useCallback(
    (value: string) => {
      const brands = toggleInSet(facetState.brands, value)
      commit({ ...facetState, brands }, searchQuery)
    },
    [commit, facetState, searchQuery],
  )

  const toggleColor = useCallback(
    (value: string) => {
      const colors = toggleInSet(facetState.colors, value)
      commit({ ...facetState, colors }, searchQuery)
    },
    [commit, facetState, searchQuery],
  )

  const toggleAttribute = useCallback(
    (key: string, value: string) => {
      const prevSet = facetState.attributeFilters[key] ?? new Set<string>()
      const nextSet = toggleInSet(prevSet, value)
      const attributeFilters = { ...facetState.attributeFilters }
      if (nextSet.size === 0) delete attributeFilters[key]
      else attributeFilters[key] = nextSet
      commit({ ...facetState, attributeFilters }, searchQuery)
    },
    [commit, facetState, searchQuery],
  )

  const setPriceMin = useCallback(
    (value: number | null) => {
      commit({ ...facetState, priceMin: value }, searchQuery)
    },
    [commit, facetState, searchQuery],
  )

  const setPriceMax = useCallback(
    (value: number | null) => {
      commit({ ...facetState, priceMax: value }, searchQuery)
    },
    [commit, facetState, searchQuery],
  )

  const clearAll = useCallback(() => {
    commit(emptyFacetState(), '')
  }, [commit])

  return {
    facets,
    facetState,
    searchQuery,
    filteredProducts,
    activeCount,
    setSearchQuery,
    toggleCategory,
    toggleBrand,
    toggleColor,
    toggleAttribute,
    setPriceMin,
    setPriceMax,
    clearAll,
  }
}
