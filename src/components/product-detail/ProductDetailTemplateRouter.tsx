import type { ProductDetailTemplateId } from '@/types'
import type { ProductDetailTemplateProps } from '@/components/product-detail/detailTypes'
import { ProductDetailSplitTemplate } from '@/components/product-detail/templates/SplitTemplate'
import { ProductDetailGalleryTemplate } from '@/components/product-detail/templates/GalleryTemplate'
import { ProductDetailEditorialTemplate } from '@/components/product-detail/templates/EditorialTemplate'
import { ProductDetailMinimalTemplate } from '@/components/product-detail/templates/MinimalTemplate'
import { ProductDetailShowcaseTemplate } from '@/components/product-detail/templates/ShowcaseTemplate'

export type ProductDetailTemplateRouterProps = ProductDetailTemplateProps & {
  /** Global template from store settings — same for every product. */
  templateId: ProductDetailTemplateId
}

export function ProductDetailTemplateRouter({
  templateId,
  ...props
}: ProductDetailTemplateRouterProps) {
  const id = templateId
  switch (id) {
    case 'gallery':
      return <ProductDetailGalleryTemplate {...props} />
    case 'editorial':
      return <ProductDetailEditorialTemplate {...props} />
    case 'minimal':
      return <ProductDetailMinimalTemplate {...props} />
    case 'showcase':
      return <ProductDetailShowcaseTemplate {...props} />
    default:
      return <ProductDetailSplitTemplate {...props} />
  }
}
