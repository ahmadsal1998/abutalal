import { useEffect, useMemo, useState } from 'react'
import type { Order, OrderStatus } from '@/types'
import { getAllOrdersMerged } from '@/data/orderStorage'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  adminCardClass,
  adminTableWrapClass,
  adminTableClass,
  adminTheadClass,
  adminThClass,
  adminTdClass,
} from '@/components/admin/adminUi'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatDate, formatMoney } from '@/lib/format'
import { orderStatusLabelAr } from '@/lib/displayLabels'
import { paymentMethodLabelAr } from '@/lib/orderPayment'
import { Eye, Search } from 'lucide-react'

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

const statusTone: Record<
  OrderStatus,
  'info' | 'warning' | 'success' | 'muted'
> = {
  pending: 'warning',
  processing: 'info',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'muted',
}

type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

function matchesDateRange(order: Order, from: string, to: string) {
  const t = new Date(order.createdAt).getTime()
  if (from) {
    const start = new Date(`${from}T00:00:00`).getTime()
    if (t < start) return false
  }
  if (to) {
    const end = new Date(`${to}T23:59:59.999`).getTime()
    if (t > end) return false
  }
  return true
}

export function AdminSalesPage() {
  const [orders, setOrders] = useState<Order[]>(() => getAllOrdersMerged())
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<OrderStatus | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState<SortKey>('date-desc')
  const [detail, setDetail] = useState<Order | null>(null)

  useEffect(() => {
    const load = () => setOrders(getAllOrdersMerged())
    load()
    window.addEventListener('storage', load)
    return () => window.removeEventListener('storage', load)
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    let list = orders.filter((o) => {
      if (status && o.status !== status) return false
      if (!matchesDateRange(o, dateFrom, dateTo)) return false
      if (!s) return true
      return (
        o.id.toLowerCase().includes(s) ||
        o.customerName.toLowerCase().includes(s)
      )
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        case 'date-desc':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        case 'amount-asc':
          return a.total - b.total
        case 'amount-desc':
          return b.total - a.total
        default:
          return 0
      }
    })

    return list
  }, [orders, q, status, dateFrom, dateTo, sort])

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="المبيعات والطلبات"
        description="جميع الطلبات من المتجر ونقطة البيع — مصدر البيانات: التخزين المحلي والبيانات الأولية (جاهز لربط واجهة برمجة لاحقاً)."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOrders(getAllOrdersMerged())}
          >
            تحديث القائمة
          </Button>
        }
      />

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative min-w-[min(100%,280px)] flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث برقم الطلب أو اسم العميل…"
            className="ps-9"
            aria-label="بحث"
          />
        </div>
        <div className="flex min-w-[140px] flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">الحالة</label>
          <select
            value={status}
            onChange={(e) =>
              setStatus((e.target.value || '') as OrderStatus | '')
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">كل الحالات</option>
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {orderStatusLabelAr(st)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[140px] flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">من تاريخ</label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex min-w-[140px] flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">إلى تاريخ</label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex min-w-[200px] flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">الترتيب</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="date-desc">التاريخ — الأحدث أولاً</option>
            <option value="date-asc">التاريخ — الأقدم أولاً</option>
            <option value="amount-desc">المبلغ — الأعلى أولاً</option>
            <option value="amount-asc">المبلغ — الأقل أولاً</option>
          </select>
        </div>
      </div>

      <p className="text-sm text-slate-500">
        {filtered.length} طلباً مطابقاً
      </p>

      {filtered.length === 0 ? (
        <div
          className={`${adminCardClass} px-4 py-14 text-center text-sm text-slate-500`}
        >
          لا توجد طلبات مطابقة للمرشحات.
        </div>
      ) : (
        <>
          <ul className="grid gap-3 md:hidden">
            {filtered.map((o) => (
              <li key={o.id}>
                <button
                  type="button"
                  onClick={() => setDetail(o)}
                  className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 text-start shadow-sm transition hover:border-violet-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-slate-500">{o.id}</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {o.customerName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(o.createdAt)}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="font-semibold tabular-nums text-slate-900">
                        {formatMoney(o.total)}
                      </p>
                      <Badge tone={statusTone[o.status]} className="mt-2">
                        {orderStatusLabelAr(o.status)}
                      </Badge>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-600">
                    {paymentMethodLabelAr(o)}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <div className={`${adminTableWrapClass} hidden md:block`}>
          <div className="overflow-x-auto">
            <table className={`${adminTableClass} min-w-[900px]`}>
              <thead className={adminTheadClass}>
                <tr>
                  <th className={adminThClass}>رقم الطلب</th>
                  <th className={adminThClass}>العميل</th>
                  <th className={`${adminThClass} text-end`}>الإجمالي</th>
                  <th className={adminThClass}>طريقة الدفع</th>
                  <th className={adminThClass}>الحالة</th>
                  <th className={adminThClass}>التاريخ</th>
                  <th className={`${adminThClass} w-24`}>تفاصيل</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="cursor-pointer transition-colors hover:bg-slate-50/90"
                    onClick={() => setDetail(o)}
                  >
                    <td className={`${adminTdClass} font-mono text-xs`}>
                      {o.id}
                    </td>
                    <td className={adminTdClass}>{o.customerName}</td>
                    <td className={`${adminTdClass} text-end font-medium tabular-nums`}>
                      {formatMoney(o.total)}
                    </td>
                    <td className={`${adminTdClass} text-slate-700`}>
                      {paymentMethodLabelAr(o)}
                    </td>
                    <td className={adminTdClass}>
                      <Badge tone={statusTone[o.status]}>
                        {orderStatusLabelAr(o.status)}
                      </Badge>
                    </td>
                    <td className={`${adminTdClass} text-slate-600`}>
                      {formatDate(o.createdAt)}
                    </td>
                    <td className={adminTdClass}>
                      <Button
                        type="button"
                        variant="secondary"
                        className="!px-2 !py-1.5"
                        onClick={(e) => {
                          e.stopPropagation()
                          setDetail(o)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        عرض
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}

      <Modal
        open={detail != null}
        title={detail ? `طلب ${detail.id}` : ''}
        onClose={() => setDetail(null)}
        wide
      >
        {detail && (
          <OrderDetailBody order={detail} onClose={() => setDetail(null)} />
        )}
      </Modal>
    </div>
  )
}

function OrderDetailBody({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  return (
    <div className="space-y-4 text-sm text-slate-800">
      <dl className="grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-xs text-slate-500">العميل</dt>
          <dd className="font-medium">{order.customerName}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">الحالة</dt>
          <dd>
            <Badge tone={statusTone[order.status]}>
              {orderStatusLabelAr(order.status)}
            </Badge>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">طريقة الدفع</dt>
          <dd>{paymentMethodLabelAr(order)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-500">التاريخ</dt>
          <dd>{formatDate(order.createdAt)}</dd>
        </div>
      </dl>

      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-start text-sm">
          <thead className="bg-slate-50 text-xs font-semibold text-slate-500">
            <tr>
              <th className="px-3 py-2">الصنف</th>
              <th className="px-3 py-2 text-end">سعر الوحدة</th>
              <th className="px-3 py-2 text-end">الكمية</th>
              <th className="px-3 py-2 text-end">المجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {order.lines.map((l, i) => (
              <tr key={`${l.productId}-${i}`}>
                <td className="px-3 py-2">{l.name}</td>
                <td className="px-3 py-2 text-end tabular-nums">
                  {formatMoney(l.unitPrice)}
                </td>
                <td className="px-3 py-2 text-end tabular-nums">
                  {l.quantity}
                </td>
                <td className="px-3 py-2 text-end font-medium tabular-nums">
                  {formatMoney(l.unitPrice * l.quantity)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="space-y-1 border-t border-slate-100 pt-4">
        <div className="flex justify-between">
          <dt className="text-slate-600">المجموع الفرعي</dt>
          <dd className="tabular-nums">{formatMoney(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-600">الضريبة</dt>
          <dd className="tabular-nums">{formatMoney(order.tax)}</dd>
        </div>
        <div className="flex justify-between text-base font-semibold">
          <dt>الإجمالي</dt>
          <dd className="text-violet-800 tabular-nums">
            {formatMoney(order.total)}
          </dd>
        </div>
      </dl>

      <Button type="button" className="w-full" variant="secondary" onClick={onClose}>
        إغلاق
      </Button>
    </div>
  )
}
