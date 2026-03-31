import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { ProductDetailBuyCluster } from '@/components/product-detail/ProductDetailBuyCluster'
import { ProductDetailSpecs } from '@/components/product-detail/ProductDetailSpecs'
import { VariantOptionGroups } from '@/components/product-detail/VariantOptionGroups'
import type { ProductDetailTemplateProps } from '@/components/product-detail/detailTypes'
import { categoryLabelAr } from '@/lib/displayLabels'

export function ProductDetailSplitTemplate({
  product,
  activeVariant,
  imageUrl,
  variants,
  optionKeys,
  hasOptions,
  selection,
  setOption,
  qty,
  setQty,
  canAdd,
  onAddToCart,
}: ProductDetailTemplateProps) {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start">
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_8px_40px_-20px_rgba(15,23,42,0.12)]">
        <div className="aspect-square bg-gradient-to-b from-slate-50 to-slate-100">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>

      <div className="flex flex-col text-start">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={product.category === 'phone' ? 'info' : 'default'}>
            {categoryLabelAr(product.category)}
          </Badge>
          <span className="text-sm text-slate-500">{product.brand}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {product.name}
        </h1>
        <p className="mt-4 leading-relaxed text-slate-600">{product.description}</p>

        {hasOptions ? (
          <div className="mt-8">
            <VariantOptionGroups
              variants={variants}
              optionKeys={optionKeys}
              selection={selection}
              onOptionChange={setOption}
            />
          </div>
        ) : null}

        <div className="mt-8">
          <ProductDetailBuyCluster
            price={activeVariant.price}
            compareAtPrice={activeVariant.compareAtPrice}
            qty={qty}
            setQty={setQty}
            maxQty={activeVariant.stock}
            canAdd={canAdd}
            onAddToCart={onAddToCart}
          />
        </div>

        <p className="mt-3 text-sm text-slate-500">
          {activeVariant.stock > 0
            ? `${activeVariant.stock} متوفر لهذا الخيار`
            : 'غير متوفر حالياً لهذا الخيار'}
        </p>

        <ProductDetailSpecs specs={product.specs} />

        <Link
          to="/products"
          className="mt-8 inline-block text-sm font-medium text-[color:var(--store-primary)] hover:underline"
        >
          متابعة التسوق
        </Link>
      </div>
    </div>
  )
}
