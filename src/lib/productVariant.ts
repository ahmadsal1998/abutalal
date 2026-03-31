import type { Product, ProductVariant } from '@/types'

/** Price shown on listing cards when variants exist (minimum variant price). */
export function listPriceForProduct(p: Product): number {
  if (p.variants && p.variants.length > 0) {
    return Math.min(...p.variants.map((v) => v.price))
  }
  return p.price
}

export function defaultVariantFromProduct(p: Product): ProductVariant {
  return {
    id: `${p.id}__default`,
    sku: p.sku,
    label: 'الافتراضي',
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    imageUrl: p.imageUrl,
    stock: p.stock,
    attributes: { ...(p.attributes ?? {}) },
  }
}

export function getVariants(product: Product): ProductVariant[] {
  if (product.variants && product.variants.length > 0) return product.variants
  return [defaultVariantFromProduct(product)]
}

export function resolveVariantOptionKeys(
  product: Product,
  variants: ProductVariant[],
): string[] {
  const present = new Set<string>()
  for (const v of variants) {
    Object.keys(v.attributes).forEach((k) => present.add(k))
  }
  if (product.variantOptionOrder?.length) {
    const ordered = product.variantOptionOrder.filter((k) => present.has(k))
    for (const k of present) {
      if (!ordered.includes(k)) ordered.push(k)
    }
    return ordered
  }
  return [...present].sort((a, b) => a.localeCompare(b, 'ar'))
}

export function uniqueValuesForKey(
  variants: ProductVariant[],
  key: string,
): string[] {
  const set = new Set<string>()
  for (const v of variants) {
    const val = v.attributes[key]
    if (val) set.add(val)
  }
  return [...set].sort((a, b) => a.localeCompare(b, 'ar'))
}

/**
 * After changing one option, pick the best-matching variant and return its full attribute map.
 */
export function pickVariantForSelection(
  variants: ProductVariant[],
  optionKeys: string[],
  prevSelection: Record<string, string>,
  changeKey: string,
  changeValue: string,
): ProductVariant {
  const nextSel = { ...prevSelection, [changeKey]: changeValue }
  const exact = variants.find((v) =>
    optionKeys.every((k) => (v.attributes[k] ?? '') === (nextSel[k] ?? '')),
  )
  if (exact) return exact

  const withKey = variants.filter((v) => v.attributes[changeKey] === changeValue)
  if (withKey.length === 0) return variants[0]

  function score(v: ProductVariant): number {
    let s = 0
    for (const k of optionKeys) {
      if (k === changeKey) continue
      const want = nextSel[k]
      const got = v.attributes[k]
      if (want && got === want) s += 3
      else if (prevSelection[k] && got === prevSelection[k]) s += 1
    }
    return s
  }

  return [...withKey].sort((a, b) => score(b) - score(a))[0]
}

/** Merge variant pricing/media into the product for cart display (same product id). */
export function mergeProductWithVariant(
  product: Product,
  variant: ProductVariant,
): Product {
  const nameSuffix =
    variant.label && variant.label !== 'الافتراضي'
      ? ` — ${variant.label}`
      : ''
  return {
    ...product,
    sku: variant.sku,
    name: `${product.name}${nameSuffix}`,
    price: variant.price,
    compareAtPrice: variant.compareAtPrice,
    imageUrl: variant.imageUrl ?? product.imageUrl,
    stock: variant.stock,
  }
}
