import { useStoreTheme } from '@/contexts/StoreThemeContext'
import { getStorefrontTemplate } from '@/components/storefront/templates/registry'
import type { Product } from '@/types'
import type { StoreThemeSettings } from '@/types/storeTheme'

type Props = {
  products: Product[]
  settingsOverride?: StoreThemeSettings
}

/**
 * يوجّه إلى مكوّن القالب النشط — كل قالب يعيد بناء نفس الأقسام بتخطيط مختلف.
 */
export function StorefrontHomePageView({ products, settingsOverride }: Props) {
  const { settings: global } = useStoreTheme()
  const settings = settingsOverride ?? global
  const Template = getStorefrontTemplate(settings.templateId)
  return <Template products={products} settings={settings} />
}
