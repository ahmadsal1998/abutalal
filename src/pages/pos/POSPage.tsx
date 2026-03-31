import { useMemo, useState } from 'react'
import type { Order } from '@/types'
import { useAppData } from '@/contexts/AppDataContext'
import { usePOS } from '@/contexts/POSContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatMoney } from '@/lib/format'
import {
  Minus,
  Plus,
  Receipt,
  Search,
  Trash2,
  User,
} from 'lucide-react'

export function POSPage() {
  const { products } = useAppData()
  const {
    lines,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    subtotal,
    tax,
    total,
    addProduct,
    increment,
    decrement,
    removeLine,
    clearCart,
    completeSale,
    lastReceipt,
  } = usePOS()

  const [customerName, setCustomerName] = useState('زائر')
  const [showReceipt, setShowReceipt] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (categoryFilter !== 'all' && p.category !== categoryFilter)
        return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      )
    })
  }, [products, search, categoryFilter])

  const handlePay = () => {
    if (lines.length === 0) return
    completeSale(customerName)
    setShowReceipt(true)
  }

  return (
    <div className="flex min-h-[calc(100svh-56px)] flex-col lg:flex-row">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col border-b border-slate-700 lg:border-b-0 lg:border-e">
        <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-slate-700/80 bg-pos-800/50 p-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="بحث بالاسم أو الرمز أو الماركة…"
              className="!border-slate-600 !bg-slate-800/80 !ps-9 !text-slate-100 placeholder:!text-slate-500"
            />
          </div>
          <div className="flex gap-1">
            {(
              [
                ['all', 'الكل'],
                ['phone', 'هواتف'],
                ['accessory', 'إكسسوارات'],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setCategoryFilter(key)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  categoryFilter === key
                    ? 'bg-emerald-500 text-pos-900'
                    : 'bg-slate-700/80 text-slate-200 hover:bg-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => addProduct(p, 1)}
              disabled={p.stock === 0}
              className="group flex flex-col overflow-hidden rounded-xl border border-slate-600/80 bg-slate-800/60 text-start transition hover:border-emerald-500/60 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <div className="relative aspect-square bg-slate-900/50">
                <img
                  src={p.imageUrl}
                  alt=""
                  className="h-full w-full object-cover opacity-90 group-hover:opacity-100"
                />
                {p.stock === 0 && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                    نفد
                  </span>
                )}
              </div>
              <div className="p-2">
                <p className="line-clamp-2 text-xs font-medium leading-snug text-slate-100">
                  {p.name}
                </p>
                <p className="mt-1 font-display text-sm font-bold text-emerald-400">
                  {formatMoney(p.price)}
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">
                  {p.stock} متوفر
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <aside className="flex w-full shrink-0 flex-col border-t border-slate-700 bg-pos-800 lg:w-[380px] lg:border-t-0">
        <div className="border-b border-slate-700 p-3">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wide">
              العميل
            </span>
          </div>
          <Input
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="mt-2 !border-slate-600 !bg-slate-900/50 !text-slate-100"
            placeholder="الاسم"
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">البيع الحالي</span>
            {lines.length > 0 && (
              <button
                type="button"
                onClick={() => clearCart()}
                className="text-xs text-red-400 hover:underline"
              >
                مسح
              </button>
            )}
          </div>
          {lines.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              اضغط المنتجات لإضافة الأسطر.
            </p>
          ) : (
            <ul className="space-y-2">
              {lines.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-2 rounded-xl border border-slate-600/80 bg-slate-900/40 p-2"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-900">
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium text-slate-100">
                      {product.name}
                    </p>
                    <p className="text-xs text-emerald-400">
                      {formatMoney(product.price)} × {quantity}
                    </p>
                    <div className="mt-1 flex items-center gap-1">
                      <button
                        type="button"
                        className="rounded-md bg-slate-700 p-1 text-slate-200 hover:bg-slate-600"
                        onClick={() => decrement(product.id)}
                        aria-label="تقليل"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-6 text-center text-xs font-semibold">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        className="rounded-md bg-slate-700 p-1 text-slate-200 hover:bg-slate-600 disabled:opacity-40"
                        disabled={quantity >= product.stock}
                        onClick={() => increment(product.id)}
                        aria-label="زيادة"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="ms-auto rounded-md p-1 text-slate-500 hover:bg-red-500/20 hover:text-red-400"
                        onClick={() => removeLine(product.id)}
                        aria-label="إزالة"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-slate-700 p-4">
          <dl className="space-y-1 text-sm text-slate-300">
            <div className="flex justify-between">
              <dt>المجموع الفرعي</dt>
              <dd className="font-mono">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>ضريبة ١٤٪</dt>
              <dd className="font-mono">{formatMoney(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-600 pt-2 text-base font-semibold text-white">
              <dt>الإجمالي</dt>
              <dd className="font-mono text-emerald-400">{formatMoney(total)}</dd>
            </div>
          </dl>
          <Button
            variant="pos"
            className="mt-4 w-full py-3 text-base"
            disabled={lines.length === 0}
            onClick={handlePay}
          >
            <Receipt className="h-5 w-5" />
            إتمام وإيصال
          </Button>
        </div>
      </aside>

      <Modal
        open={showReceipt && lastReceipt != null}
        title="إيصال"
        onClose={() => setShowReceipt(false)}
        wide
      >
        {lastReceipt && (
          <ReceiptBody
            order={lastReceipt}
            onClose={() => setShowReceipt(false)}
          />
        )}
      </Modal>
    </div>
  )
}

function ReceiptBody({
  order,
  onClose,
}: {
  order: Order
  onClose: () => void
}) {
  return (
    <div className="font-mono text-sm text-slate-800">
      <div className="border-b border-dashed border-slate-200 pb-4 text-center">
        <p className="font-display text-lg font-bold">أبو طلال للموبايل</p>
        <p className="text-slate-500">بيع نقطة (تجريبي)</p>
        <p className="mt-2 text-xs text-slate-500">{order.id}</p>
      </div>
      <div className="mt-4 space-y-1">
        <p>
          <span className="text-slate-500">العميل:</span> {order.customerName}
        </p>
        <p className="text-xs text-slate-500">
          {new Date(order.createdAt).toLocaleString('ar-EG')}
        </p>
      </div>
      <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        {order.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-4">
            <span className="flex-1">
              {l.name} × {l.quantity}
            </span>
            <span>{formatMoney(l.unitPrice * l.quantity)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-4 space-y-1 border-t border-slate-100 pt-4">
        <div className="flex justify-between">
          <dt>المجموع الفرعي</dt>
          <dd>{formatMoney(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>الضريبة</dt>
          <dd>{formatMoney(order.tax)}</dd>
        </div>
        <div className="flex justify-between text-base font-bold">
          <dt>الإجمالي</dt>
          <dd className="text-emerald-700">{formatMoney(order.total)}</dd>
        </div>
      </dl>
      <p className="mt-6 text-center text-xs text-slate-500">
        شكراً — تم الحفظ محلياً لتظهر في تقارير الإدارة.
      </p>
      <Button className="mt-4 w-full" onClick={onClose}>
        إغلاق
      </Button>
    </div>
  )
}
