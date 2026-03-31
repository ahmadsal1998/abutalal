import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '@/types'
import { getAllOrdersMerged } from '@/data/orderStorage'
import { formatDate, formatMoney } from '@/lib/format'
import { orderStatusLabelAr } from '@/lib/displayLabels'
import { Badge } from '@/components/ui/Badge'
import { Receipt } from 'lucide-react'

const statusTone: Record<
  Order['status'],
  'info' | 'warning' | 'success' | 'muted'
> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'muted',
}

export function StoreOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() => getAllOrdersMerged())

  useEffect(() => {
    const load = () => setOrders(getAllOrdersMerged())
    load()
    window.addEventListener('storage', load)
    return () => window.removeEventListener('storage', load)
  }, [])

  const list = useMemo(
    () =>
      [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [orders],
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--store-text)] sm:text-3xl">
          طلباتي
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--store-muted)]">
          الطلبات المحفوظة محلياً بعد إتمام الشراء — جاهزة لربط الخادم لاحقاً.
        </p>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200/90 bg-[var(--store-surface)]/80 px-6 py-14 text-center">
          <Receipt
            className="mx-auto h-12 w-12 text-[var(--store-muted)]"
            aria-hidden
          />
          <p className="mt-4 text-sm font-medium text-[var(--store-text)]">
            لا توجد طلبات بعد
          </p>
          <p className="mt-2 text-sm text-[var(--store-muted)]">
            تسوّق من المنتجات ثم أكمل الدفع ليظهر طلبك هنا.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--store-primary)] px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
          >
            تصفح المنتجات
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.map((o) => (
            <li
              key={o.id}
              className="rounded-2xl border border-slate-200/80 bg-[var(--store-surface)] p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-[var(--store-muted)]">
                    {o.id}
                  </p>
                  <p className="mt-1 font-medium text-[var(--store-text)]">
                    {o.customerName}
                  </p>
                  <p className="mt-1 text-xs text-[var(--store-muted)]">
                    {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="text-end">
                  <p className="font-semibold tabular-nums text-[var(--store-text)]">
                    {formatMoney(o.total)}
                  </p>
                  <Badge tone={statusTone[o.status]} className="mt-2">
                    {orderStatusLabelAr(o.status)}
                  </Badge>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
