import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'
import { formatMoney } from '@/lib/format'
import { Minus, Plus, Trash2 } from 'lucide-react'

export function CartPage() {
  const { lines, subtotal, setQuantity, removeLine } = useCart()
  const tax = Math.round(subtotal * 0.14 * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <h1 className="font-display text-2xl font-semibold text-slate-900">
          السلة فارغة
        </h1>
        <p className="mt-2 text-slate-600">
          أضف منتجات من المتجر للمتابعة.
        </p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>تصفح المنتجات</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="font-display text-3xl font-bold text-slate-900">
          سلة التسوق
        </h1>
        {lines.map(({ product, quantity, variantId }) => (
          <div
            key={`${product.id}::${variantId ?? 'default'}`}
            className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
              <img
                src={product.imageUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                to={`/products/${product.slug}`}
                className="font-semibold text-slate-900 hover:text-sky-700"
              >
                {product.name}
              </Link>
              <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
              <p className="mt-2 font-medium text-sky-700">
                {formatMoney(product.price)} للقطعة
              </p>
            </div>
            <div className="flex flex-col items-end justify-between">
              <button
                type="button"
                className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                onClick={() => removeLine(product.id, variantId)}
                aria-label="إزالة"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="flex items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  className="p-2 hover:bg-slate-50"
                  onClick={() =>
                    setQuantity(product.id, quantity - 1, variantId)
                  }
                  aria-label="تقليل"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-8 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  type="button"
                  className="p-2 hover:bg-slate-50"
                  onClick={() =>
                    setQuantity(product.id, quantity + 1, variantId)
                  }
                  aria-label="زيادة"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-slate-900">
            الملخص
          </h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">المجموع الفرعي</dt>
              <dd className="font-medium">{formatMoney(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">ضريبة القيمة المضافة (١٤٪)</dt>
              <dd className="font-medium">{formatMoney(tax)}</dd>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-3 text-base font-semibold">
              <dt>الإجمالي</dt>
              <dd className="text-sky-700">{formatMoney(total)}</dd>
            </div>
          </dl>
          <Link to="/checkout" className="mt-6 block">
            <Button className="w-full">إتمام الطلب</Button>
          </Link>
          <Link
            to="/products"
            className="mt-3 block text-center text-sm text-sky-600 hover:underline"
          >
            إضافة منتجات أخرى
          </Link>
        </div>
      </div>
    </div>
  )
}
