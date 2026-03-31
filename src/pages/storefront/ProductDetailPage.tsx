import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAppData } from '@/contexts/AppDataContext'
import { useCart } from '@/contexts/CartContext'
import { useStoreTheme } from '@/contexts/StoreThemeContext'
import { ProductDetailTemplateRouter } from '@/components/product-detail/ProductDetailTemplateRouter'
import { useProductVariantState } from '@/hooks/useProductVariantState'
import { mergeProductWithVariant } from '@/lib/productVariant'
import type { Product, ProductDetailTemplateId } from '@/types'

export function ProductDetailView({
  product,
  templateId,
  onAddToCart: onAddToCartOverride,
}: {
  product: Product
  templateId: ProductDetailTemplateId
  /** Preview: pass a no-op to avoid modifying the cart. */
  onAddToCart?: () => void
}) {
  const { addProduct } = useCart()
  const [qty, setQty] = useState(1)

  const {
    variants,
    optionKeys,
    selection,
    setOption,
    selectVariant,
    activeVariant,
    hasOptions,
  } = useProductVariantState(product)

  const imageUrl = activeVariant.imageUrl ?? product.imageUrl
  const canAdd = activeVariant.stock > 0

  const onAddToCart = () => {
    if (onAddToCartOverride) {
      onAddToCartOverride()
      return
    }
    const merged = mergeProductWithVariant(product, activeVariant)
    addProduct(merged, qty, activeVariant.id)
    setQty(1)
  }

  return (
    <ProductDetailTemplateRouter
      templateId={templateId}
      product={product}
      activeVariant={activeVariant}
      imageUrl={imageUrl}
      variants={variants}
      optionKeys={optionKeys}
      hasOptions={hasOptions}
      selection={selection}
      setOption={setOption}
      selectVariant={selectVariant}
      qty={qty}
      setQty={setQty}
      canAdd={canAdd}
      onAddToCart={onAddToCart}
    />
  )
}

function ProductDetailBody({ product }: { product: Product }) {
  const { settings } = useStoreTheme()
  const templateId = settings.productDetailTemplate ?? 'split'
  return <ProductDetailView product={product} templateId={templateId} />
}

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { productBySlug } = useAppData()

  const product = useMemo(
    () => (slug ? productBySlug(slug) : undefined),
    [slug, productBySlug],
  )

  if (!product) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-slate-600">المنتج غير موجود.</p>
        <Link
          to="/products"
          className="mt-4 inline-block text-[color:var(--store-primary)] hover:underline"
        >
          العودة للمتجر
        </Link>
      </div>
    )
  }

  return <ProductDetailBody product={product} />
}
