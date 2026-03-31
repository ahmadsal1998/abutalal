import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { ProductDetailBuyCluster } from '@/components/product-detail/ProductDetailBuyCluster'
import { VariantOptionGroups } from '@/components/product-detail/VariantOptionGroups'
import type { ProductDetailTemplateProps } from '@/components/product-detail/detailTypes'
import { categoryLabelAr } from '@/lib/displayLabels'

export function ProductDetailEditorialTemplate({
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
    <div>
      <div className="relative -mx-4 overflow-hidden sm:mx-0 sm:rounded-[2rem]">
        <div className="aspect-[16/11] min-h-[220px] sm:aspect-[21/9] sm:min-h-[280px]">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--store-bg)]/95 via-[var(--store-bg)]/20 to-transparent"
          aria-hidden
        />
        <div className="absolute bottom-0 start-0 end-0 px-4 pb-8 pt-16 sm:px-8">
          <div className="mx-auto max-w-4xl">
            <Badge tone={product.category === 'phone' ? 'info' : 'default'}>
              {categoryLabelAr(product.category)}
            </Badge>
            <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-sm sm:text-4xl md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/90 sm:text-base">
              {product.brand} · {product.description}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-10 px-1 sm:px-4">
        {hasOptions ? (
          <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="font-display text-lg font-semibold text-slate-900">
              الخيارات
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              غيّر اللون أو التخزين أو أي خيار آخر — يتحدّث السعر والصورة فوراً.
            </p>
            <div className="mt-6">
              <VariantOptionGroups
                variants={variants}
                optionKeys={optionKeys}
                selection={selection}
                onOptionChange={setOption}
              />
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2">
          {product.specs.map((s, i) => (
            <div
              key={`${i}-${s}`}
              className="rounded-2xl border border-slate-100 bg-slate-50/90 px-4 py-3 text-sm text-slate-800"
            >
              {s}
            </div>
          ))}
        </section>

        <section className="rounded-2xl border-2 border-dashed border-slate-200/90 bg-gradient-to-br from-white to-slate-50/90 p-6 sm:p-8">
          <ProductDetailBuyCluster
            price={activeVariant.price}
            compareAtPrice={activeVariant.compareAtPrice}
            qty={qty}
            setQty={setQty}
            maxQty={activeVariant.stock}
            canAdd={canAdd}
            onAddToCart={onAddToCart}
          />
          <p className="mt-3 text-sm text-slate-500">
            {activeVariant.stock > 0
              ? `${activeVariant.stock} وحدة متوفرة لهذا التركيبة`
              : 'غير متوفر لهذا الخيار'}
          </p>
        </section>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--store-primary)] hover:underline"
        >
          ← متابعة التسوق
        </Link>
      </div>
    </div>
  )
}
