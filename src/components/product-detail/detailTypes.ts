import type { Product, ProductVariant } from '@/types'

export type ProductDetailTemplateProps = {
  product: Product
  activeVariant: ProductVariant
  imageUrl: string
  variants: ProductVariant[]
  optionKeys: string[]
  hasOptions: boolean
  selection: Record<string, string>
  setOption: (key: string, value: string) => void
  /** Jump to a variant (e.g. gallery thumbnails). */
  selectVariant: (v: ProductVariant) => void
  qty: number
  setQty: (n: number) => void
  canAdd: boolean
  onAddToCart: () => void
}
