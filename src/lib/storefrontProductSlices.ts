import type { Product } from '@/types'

export type ProductSlices = {
  /** Main products grid */
  showcase: Product[]
  bestSellers: Product[]
  newArrivals: Product[]
  featured: Product[]
}

/**
 * Derives carousel/grid slices from the catalog (demo logic — replace with API flags later).
 */
export function getProductSlices(products: Product[]): ProductSlices {
  if (products.length === 0) {
    return {
      showcase: [],
      bestSellers: [],
      newArrivals: [],
      featured: [],
    }
  }
  const n = products.length
  const bestSellers = products.slice(0, Math.min(8, n))
  const start = Math.min(8, n)
  const newArrivals = products.slice(start, Math.min(start + 8, n))
  const newArrivalsFinal =
    newArrivals.length > 0
      ? newArrivals
      : products.slice(0, Math.min(4, n))
  const featured = products.slice(0, Math.min(6, n))
  const showcase = products.slice(0, Math.min(8, n))
  return { showcase, bestSellers, newArrivals: newArrivalsFinal, featured }
}
