import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { ProductDetailBuyCluster } from '@/components/product-detail/ProductDetailBuyCluster'
import { VariantOptionGroups } from '@/components/product-detail/VariantOptionGroups'
import type { ProductDetailTemplateProps } from '@/components/product-detail/detailTypes'
import { categoryLabelAr } from '@/lib/displayLabels'

export function ProductDetailShowcaseTemplate({
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
    <div className="space-y-12">
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-950 shadow-2xl ring-1 ring-slate-900/20">
        <div className="grid min-h-[min(100vw,520px)] lg:min-h-[560px] lg:grid-cols-2">
          <div className="relative min-h-[300px] lg:min-h-0">
            <img
              src={imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-slate-950/70 to-transparent lg:hidden"
              aria-hidden
            />
          </div>

          <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-14">
            <Badge tone={product.category === 'phone' ? 'info' : 'default'}>
              {categoryLabelAr(product.category)}
            </Badge>
            <p className="mt-3 text-sm font-medium text-slate-400">{product.brand}</p>
            <h1 className="mt-2 font-display text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
              {product.description}
            </p>

            {hasOptions ? (
              <div className="mt-8">
                <VariantOptionGroups
                  variants={variants}
                  optionKeys={optionKeys}
                  selection={selection}
                  onOptionChange={setOption}
                  tone="dark"
                  dense
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
                compact
                variant="inverse"
              />
            </div>
            <p className="mt-4 text-xs text-slate-500">
              {activeVariant.stock > 0
                ? `${activeVariant.stock} متوفر لهذا الخيار`
                : 'غير متوفر لهذا الخيار'}
            </p>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-4xl">
        <h2 className="font-display text-lg font-semibold text-slate-900">
          المواصفات
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {product.specs.map((s, i) => (
            <div
              key={`${i}-${s}`}
              className="rounded-2xl border border-slate-200/90 bg-slate-50/90 px-4 py-3 text-sm text-slate-800"
            >
              {s}
            </div>
          ))}
        </div>
        <Link
          to="/products"
          className="mt-8 inline-flex text-sm font-medium text-[color:var(--store-primary)] hover:underline"
        >
          العودة إلى المتجر
        </Link>
      </section>
    </div>
  )
}
