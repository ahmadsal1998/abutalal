import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { ProductDetailBuyCluster } from '@/components/product-detail/ProductDetailBuyCluster'
import { VariantOptionGroups } from '@/components/product-detail/VariantOptionGroups'
import type { ProductDetailTemplateProps } from '@/components/product-detail/detailTypes'
import { categoryLabelAr } from '@/lib/displayLabels'

export function ProductDetailMinimalTemplate({
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
    <article className="mx-auto max-w-xl space-y-10 pb-8">
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200/70">
        <img
          src={imageUrl}
          alt=""
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="space-y-8 px-1">
        <header className="space-y-4 border-b border-slate-100 pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
            {product.brand}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={product.category === 'phone' ? 'info' : 'default'}>
              {categoryLabelAr(product.category)}
            </Badge>
          </div>
          <h1 className="text-3xl font-light leading-[1.15] tracking-tight text-slate-900 sm:text-[2.15rem]">
            {product.name}
          </h1>
          <p className="text-base leading-relaxed text-slate-600">
            {product.description}
          </p>
        </header>

        {hasOptions ? (
          <VariantOptionGroups
            variants={variants}
            optionKeys={optionKeys}
            selection={selection}
            onOptionChange={setOption}
            dense
          />
        ) : null}

        <ProductDetailBuyCluster
          price={activeVariant.price}
          compareAtPrice={activeVariant.compareAtPrice}
          qty={qty}
          setQty={setQty}
          maxQty={activeVariant.stock}
          canAdd={canAdd}
          onAddToCart={onAddToCart}
          compact
        />

        <p className="text-sm text-slate-500">
          {activeVariant.stock > 0
            ? `${activeVariant.stock} متوفر لهذا الخيار`
            : 'غير متوفر لهذا الخيار'}
        </p>

        <ul className="space-y-4 border-t border-slate-100 pt-8 text-sm leading-relaxed text-slate-600">
          {product.specs.map((s, i) => (
            <li key={`${i}-${s}`} className="flex gap-3">
              <span className="mt-2 h-px w-6 shrink-0 bg-slate-300" aria-hidden />
              <span>{s}</span>
            </li>
          ))}
        </ul>

        <Link
          to="/products"
          className="inline-block text-sm font-medium text-[color:var(--store-primary)] hover:underline"
        >
          متابعة التسوق
        </Link>
      </div>
    </article>
  )
}
