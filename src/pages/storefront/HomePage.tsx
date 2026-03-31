import { useAppData } from '@/contexts/AppDataContext'
import { StorefrontHomePageView } from '@/components/storefront/StorefrontHomePageView'

export function HomePage() {
  const { products } = useAppData()
  return <StorefrontHomePageView products={products} />
}
