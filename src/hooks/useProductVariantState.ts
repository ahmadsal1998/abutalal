import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Product, ProductVariant } from '@/types'
import {
  getVariants,
  pickVariantForSelection,
  resolveVariantOptionKeys,
} from '@/lib/productVariant'

export function useProductVariantState(product: Product) {
  const variants = useMemo(() => getVariants(product), [product])
  const optionKeys = useMemo(
    () => resolveVariantOptionKeys(product, variants),
    [product, variants],
  )

  const [selection, setSelection] = useState<Record<string, string>>(() => ({
    ...variants[0]?.attributes,
  }))

  useEffect(() => {
    const v = getVariants(product)[0]
    setSelection({ ...v.attributes })
  }, [product.id])

  const setOption = useCallback(
    (key: string, value: string) => {
      setSelection((prev) => {
        const next = pickVariantForSelection(
          variants,
          optionKeys,
          prev,
          key,
          value,
        )
        return { ...next.attributes }
      })
    },
    [variants, optionKeys],
  )

  const selectVariant = useCallback((v: ProductVariant) => {
    setSelection({ ...v.attributes })
  }, [])

  const activeVariant: ProductVariant = useMemo(() => {
    const exact = variants.find((v) =>
      optionKeys.every(
        (k) => (v.attributes[k] ?? '') === (selection[k] ?? ''),
      ),
    )
    if (exact) return exact
    return variants[0]
  }, [variants, optionKeys, selection])

  return {
    variants,
    optionKeys,
    selection,
    setOption,
    selectVariant,
    activeVariant,
    hasOptions: optionKeys.length > 0,
  }
}
