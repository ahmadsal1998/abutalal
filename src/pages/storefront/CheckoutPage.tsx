import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { appendOrder } from '@/data/orderStorage'
import type { Order } from '@/types'
import { formatMoney } from '@/lib/format'

function makeWebOrderId() {
  return `ord_web_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, subtotal, clear } = useCart()
  const tax = Math.round(subtotal * 0.14 * 100) / 100
  const total = Math.round((subtotal + tax) * 100) / 100

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-slate-600">لا يوجد شيء لإتمام الطلب.</p>
        <Link to="/cart" className="mt-4 inline-block text-sky-600 hover:underline">
          العودة للسلة
        </Link>
      </div>
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const order: Order = {
      id: makeWebOrderId(),
      customerId: 'guest',
      customerName: name.trim() || 'زائر',
      lines: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        unitPrice: l.product.price,
        quantity: l.quantity,
      })),
      subtotal,
      tax,
      total,
      status: 'processing',
      createdAt: new Date().toISOString(),
      paymentMethod: 'cod',
    }
    appendOrder(order)
    clear()
    setSubmitting(false)
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-display text-3xl font-bold text-slate-900">
        إتمام الطلب
      </h1>
      <p className="mt-2 text-slate-600">
        واجهة تجريبية — لا يتم الدفع فعلياً. الإرسال ينشئ طلباً تجريبياً يظهر في
        لوحة المبيعات.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="font-semibold text-slate-900">بيانات التواصل والشحن</h2>
          <div>
            <Label htmlFor="name">الاسم الكامل</Label>
            <Input
              id="name"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اسمك"
            />
          </div>
          <div>
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          </div>
          <div>
            <Label htmlFor="phone">الهاتف</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+20 …"
            />
          </div>
          <div>
            <Label htmlFor="address">العنوان</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="الشارع، المدينة"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900">الطلب</h2>
            <ul className="mt-4 max-h-48 space-y-2 overflow-y-auto text-sm">
              {lines.map((l) => (
                <li key={l.product.id} className="flex justify-between gap-2">
                  <span className="line-clamp-1 text-slate-700">
                    {l.product.name} × {l.quantity}
                  </span>
                  <span className="shrink-0 font-medium">
                    {formatMoney(l.product.price * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">المجموع الفرعي</dt>
                <dd>{formatMoney(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600">ضريبة القيمة المضافة (١٤٪)</dt>
                <dd>{formatMoney(tax)}</dd>
              </div>
              <div className="flex justify-between pt-2 text-base font-semibold">
                <dt>الإجمالي</dt>
                <dd className="text-sky-700">{formatMoney(total)}</dd>
              </div>
            </dl>
            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={submitting}
            >
              تأكيد الطلب (تجريبي)
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500">
              لا يتم خصم أي مبلغ. بعد التأكيد ستعود للرئيسية ويُحفظ الطلب في
              النظام.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
