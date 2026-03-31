import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { formatMoney } from '@/lib/format'
import { categoryLabelAr } from '@/lib/displayLabels'
import { listPriceForProduct } from '@/lib/productVariant'

function discountPercent(price: number, compareAt: number): number {
  if (compareAt <= price) return 0
  return Math.round(((compareAt - price) / compareAt) * 100)
}

export function ProductCard({ product: p }: { product: Product }) {
  const listPrice = listPriceForProduct(p)
  const showFrom = Boolean(p.variants && p.variants.length > 1)
  const cheapest =
    p.variants && p.variants.length > 0
      ? p.variants.reduce((a, b) => (a.price <= b.price ? a : b))
      : null
  const hasSale = Boolean(
    cheapest &&
      cheapest.compareAtPrice != null &&
      cheapest.compareAtPrice > cheapest.price &&
      cheapest.price === listPrice,
  )
  const offPct =
    hasSale && cheapest?.compareAtPrice != null
      ? discountPercent(cheapest.price, cheapest.compareAtPrice)
      : 0
  const accentColor =
    p.category === 'phone'
      ? 'text-sky-800 ring-sky-200/80 bg-sky-50/95'
      : 'text-slate-800 ring-slate-200/80 bg-slate-50/95'

  return (
    <Link
      to={`/products/${p.slug}`}
      aria-label={`${p.name} — ${formatMoney(listPrice)}`}
      className="group/card relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.06)] ring-1 ring-transparent transition-[box-shadow,transform,border-color] duration-300 ease-out hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-[0_16px_48px_-16px_rgba(15,23,42,0.14)] hover:ring-slate-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--store-primary) focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
        <img
          src={p.imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-center transition duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover/card:scale-[1.045]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/[0.12] via-transparent to-slate-900/[0.04]"
          aria-hidden
        />

        <div className="absolute start-2.5 top-2.5 flex max-w-[calc(100%-1.25rem)] flex-col gap-1.5 sm:start-3 sm:top-3">
          <span
            className={`inline-flex w-fit max-w-full items-center rounded-lg px-2 py-0.5 text-[10px] font-semibold leading-none shadow-sm ring-1 backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[11px] ${accentColor}`}
          >
            {categoryLabelAr(p.category)}
          </span>
          {hasSale && offPct > 0 ? (
            <span className="inline-flex w-fit items-center rounded-lg bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm sm:text-[11px]">
              خصم {offPct}%
            </span>
          ) : null}
        </div>

        {p.stock === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 backdrop-blur-[2px]">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-lg sm:px-4 sm:text-sm">
              غير متوفر
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500 sm:text-xs">
          {p.brand}
        </p>
        <h2 className="mt-1 line-clamp-2 min-h-[2.65em] text-[13px] font-semibold leading-snug tracking-tight text-slate-900 sm:mt-1.5 sm:min-h-[2.75em] sm:text-[15px] sm:leading-[1.4]">
          {p.name}
        </h2>

        {p.attributes?.color ? (
          <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-600 sm:text-xs">
            <span
              className="size-2 shrink-0 rounded-full border border-slate-200 bg-gradient-to-br from-slate-200 to-slate-300 shadow-inner"
              aria-hidden
            />
            <span className="min-w-0 truncate">{p.attributes.color}</span>
          </p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 border-t border-slate-100/90 pt-3 sm:pt-3.5">
          <div className="min-w-0 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            {showFrom ? (
              <span className="text-[11px] font-medium text-slate-500 sm:text-xs">
                من
              </span>
            ) : null}
            <span
              className="font-display text-[1.0625rem] font-bold tabular-nums tracking-tight sm:text-xl"
              style={{ color: 'var(--store-primary, #0369a1)' }}
            >
              {formatMoney(listPrice)}
            </span>
            {hasSale && cheapest?.compareAtPrice != null ? (
              <span className="text-[11px] font-medium text-slate-400 line-through decoration-slate-300 sm:text-sm">
                {formatMoney(cheapest.compareAtPrice)}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
