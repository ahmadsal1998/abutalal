import type { Product } from '@/types'
import type { StoreThemeSettings } from '@/types/storeTheme'

export type StorefrontTemplateProps = {
  products: Product[]
  settings: StoreThemeSettings
}
