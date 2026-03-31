import { Link } from 'react-router-dom'
import { formatMoney } from '@/lib/format'
import type { Product } from '@/types'

type Props = {
  product: Product
  className?: string
  imageClass?: string
}

export function ProductThumb({ product, className = '', imageClass = '' }: Props) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className={`group flex w-[160px] shrink-0 snap-start flex-col overflow-hidden border border-slate-200/80 bg-[var(--store-surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[180px] ${className}`}
      style={{ borderRadius: 'var(--store-radius-card)' }}
    >
      <div
        className={`relative aspect-square overflow-hidden bg-slate-100 ${imageClass}`}
      >
        <img
          src={product.imageUrl}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-3 text-start">
        <p className="line-clamp-2 text-xs font-semibold leading-snug text-[var(--store-text)]">
          {product.name}
        </p>
        <p className="mt-2 font-display text-sm font-bold text-[var(--store-text)]">
          {formatMoney(product.price)}
        </p>
      </div>
    </Link>
  )
}
