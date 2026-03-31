import { Button } from '@/components/ui/Button'
import { formatMoney } from '@/lib/format'
import { Minus, Plus, ShoppingBag } from 'lucide-react'

export function ProductDetailBuyCluster({
  price,
  compareAtPrice,
  qty,
  setQty,
  maxQty,
  canAdd,
  onAddToCart,
  compact,
  variant = 'default',
}: {
  price: number
  compareAtPrice?: number
  qty: number
  setQty: (n: number) => void
  maxQty: number
  canAdd: boolean
  onAddToCart: () => void
  compact?: boolean
  /** `inverse`: light text / controls on dark panels */
  variant?: 'default' | 'inverse'
}) {
  const hasSale = compareAtPrice != null && compareAtPrice > price
  const inverse = variant === 'inverse'

  return (
    <div className={compact ? 'space-y-3' : 'space-y-4'}>
      <div className="flex flex-wrap items-baseline gap-3">
        <span
          className={`font-display font-bold tabular-nums ${compact ? 'text-2xl' : 'text-3xl'} ${
            inverse ? 'text-white' : 'text-[color:var(--store-primary)]'
          }`}
        >
          {formatMoney(price)}
        </span>
        {hasSale ? (
          <span
            className={`text-lg line-through ${inverse ? 'text-slate-500' : 'text-slate-400'}`}
          >
            {formatMoney(compareAtPrice)}
          </span>
        ) : null}
      </div>

      <div
        className={`flex flex-wrap items-center gap-3 ${compact ? '' : 'gap-4'}`}
      >
        <div
          className={`flex items-center rounded-xl border ${
            inverse
              ? 'border-white/20 bg-white/10'
              : 'border-slate-200 bg-white'
          }`}
        >
          <button
            type="button"
            className={`p-3 disabled:opacity-40 ${
              inverse
                ? 'text-white hover:bg-white/10'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            disabled={!canAdd || qty <= 1}
            onClick={() => setQty(Math.max(1, qty - 1))}
            aria-label="تقليل الكمية"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span
            className={`min-w-8 text-center text-sm font-semibold ${inverse ? 'text-white' : ''}`}
          >
            {qty}
          </span>
          <button
            type="button"
            className={`p-3 disabled:opacity-40 ${
              inverse
                ? 'text-white hover:bg-white/10'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
            disabled={!canAdd || qty >= maxQty}
            onClick={() => setQty(Math.min(maxQty, qty + 1))}
            aria-label="زيادة الكمية"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button
          className={`min-w-[180px] flex-1 sm:flex-none ${compact ? 'min-h-[48px]' : ''} ${
            inverse
              ? '!bg-white !text-slate-900 hover:!bg-slate-100 border-0'
              : ''
          }`}
          disabled={!canAdd}
          onClick={onAddToCart}
        >
          <ShoppingBag className="h-4 w-4" />
          أضف إلى السلة
        </Button>
      </div>
    </div>
  )
}
