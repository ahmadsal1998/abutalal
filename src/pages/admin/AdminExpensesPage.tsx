import { useEffect, useMemo, useState, type FormEvent } from 'react'
import type { Expense, ExpenseCategoryId, OrderPaymentMethod } from '@/types'
import {
  addExpense,
  deleteExpense,
  getAllExpensesMerged,
  updateExpense,
} from '@/data/expenseStorage'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  adminCardClass,
  adminTableWrapClass,
  adminTableClass,
  adminTheadClass,
  adminThClass,
  adminTdClass,
} from '@/components/admin/adminUi'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { formatMoney } from '@/lib/format'
import {
  EXPENSE_CATEGORY_IDS,
  expenseCategoryLabelAr,
} from '@/lib/expenseCategories'
import { computeExpenseTotals } from '@/lib/expenseTotals'
import { orderPaymentMethodLabel } from '@/lib/orderPayment'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'

type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'

const PAYMENT_METHODS: OrderPaymentMethod[] = [
  'cash',
  'card',
  'cod',
  'online',
]

function matchesDateRange(e: Expense, from: string, to: string) {
  const t = new Date(e.date).getTime()
  if (Number.isNaN(t)) return false
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

const emptyForm = (): Omit<Expense, 'id'> => ({
  title: '',
  amount: 0,
  category: 'other',
  paymentMethod: 'cash',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
})

export function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    getAllExpensesMerged(),
  )
  const [q, setQ] = useState('')
  const [category, setCategory] = useState<ExpenseCategoryId | ''>('')
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod | ''>(
    '',
  )
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sort, setSort] = useState<SortKey>('date-desc')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Omit<Expense, 'id'>>(emptyForm)

  const refresh = () => setExpenses(getAllExpensesMerged())

  useEffect(() => {
    refresh()
    const onStorage = () => refresh()
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    let list = expenses.filter((e) => {
      if (category && e.category !== category) return false
      if (paymentMethod && e.paymentMethod !== paymentMethod) return false
      if (!matchesDateRange(e, dateFrom, dateTo)) return false
      if (!s) return true
      return (
        e.title.toLowerCase().includes(s) ||
        e.id.toLowerCase().includes(s) ||
        (e.notes?.toLowerCase().includes(s) ?? false)
      )
    })

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'amount-asc':
          return a.amount - b.amount
        case 'amount-desc':
          return b.amount - a.amount
        default:
          return 0
      }
    })
    return list
  }, [expenses, q, category, paymentMethod, dateFrom, dateTo, sort])

  const totals = useMemo(
    () => computeExpenseTotals(filtered),
    [filtered],
  )

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  const openEdit = (e: Expense) => {
    setEditingId(e.id)
    setForm({
      title: e.title,
      amount: e.amount,
      category: e.category,
      paymentMethod: e.paymentMethod,
      date: e.date.slice(0, 10),
      notes: e.notes ?? '',
    })
    setModalOpen(true)
  }

  const submitForm = (e: FormEvent) => {
    e.preventDefault()
    const payload: Omit<Expense, 'id'> = {
      title: form.title.trim(),
      amount: Math.max(0, Number(form.amount) || 0),
      category: form.category,
      paymentMethod: form.paymentMethod,
      date: form.date,
      notes: form.notes?.trim() || undefined,
    }
    if (!payload.title) return
    if (editingId) {
      updateExpense(editingId, payload)
    } else {
      addExpense(payload)
    }
    setModalOpen(false)
    refresh()
  }

  const handleDelete = (id: string) => {
    if (
      !confirm(
        'حذف هذا المصروف؟ لا يمكن التراجع.',
      )
    )
      return
    deleteExpense(id)
    refresh()
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <AdminPageHeader
        title="المصروفات"
        description="تتبع مصروفات المحل — البيانات محلية للتجربة، مع هيكل جاهز لربط الخادم وتقارير الربح (مبيعات − مصروفات) لاحقاً."
        actions={
          <Button type="button" onClick={openAdd}>
            <Plus className="h-4 w-4" />
            مصروف جديد
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className={`${adminCardClass} p-5`}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            إجمالي اليوم (حسب المرشحات)
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">
            {formatMoney(totals.day)}
          </p>
        </div>
        <div className={`${adminCardClass} p-5`}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            إجمالي الشهر الحالي (حسب المرشحات)
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">
            {formatMoney(totals.month)}
          </p>
        </div>
        <div className={`${adminCardClass} p-5 sm:col-span-2 lg:col-span-1`}>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            عدد السجلات المطابقة
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">
            {filtered.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-900/5 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="relative min-w-[min(100%,260px)] flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث بالعنوان أو الملاحظات أو الرقم…"
            className="ps-9"
          />
        </div>
        <div className="flex min-w-[140px] flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">التصنيف</span>
          <select
            value={category}
            onChange={(e) =>
              setCategory((e.target.value || '') as ExpenseCategoryId | '')
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">كل التصنيفات</option>
            {EXPENSE_CATEGORY_IDS.map((c) => (
              <option key={c} value={c}>
                {expenseCategoryLabelAr(c)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[140px] flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">طريقة الدفع</span>
          <select
            value={paymentMethod}
            onChange={(e) =>
              setPaymentMethod((e.target.value || '') as OrderPaymentMethod | '')
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="">الكل</option>
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>
                {orderPaymentMethodLabel(m)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[140px] flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">من تاريخ</span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className="flex min-w-[140px] flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">إلى تاريخ</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <div className="flex min-w-[200px] flex-col gap-1">
          <span className="text-xs font-medium text-slate-500">الترتيب</span>
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
        <Button
          type="button"
          variant="secondary"
          onClick={() => refresh()}
        >
          تحديث
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div
          className={`${adminCardClass} px-4 py-14 text-center text-sm text-slate-500`}
        >
          لا توجد مصروفات مطابقة. أضف مصروفاً جديداً أو غيّر المرشحات.
        </div>
      ) : (
        <>
          <ul className="grid gap-3 md:hidden">
            {filtered.map((row) => (
              <li
                key={row.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{row.title}</p>
                    <p className="mt-1 font-mono text-xs text-slate-500">
                      {row.id}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold tabular-nums text-violet-800">
                    {formatMoney(row.amount)}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span>{expenseCategoryLabelAr(row.category)}</span>
                  <span>·</span>
                  <span>{orderPaymentMethodLabel(row.paymentMethod)}</span>
                  <span>·</span>
                  <span>{row.date}</span>
                </div>
                {row.notes ? (
                  <p className="mt-2 text-sm text-slate-600">{row.notes}</p>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-11 flex-1"
                    onClick={() => openEdit(row)}
                  >
                    <Pencil className="h-4 w-4" />
                    تعديل
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-11 flex-1 !border-red-200 text-red-700 hover:!bg-red-50"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    حذف
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className={`${adminTableWrapClass} hidden md:block`}>
          <div className="overflow-x-auto">
            <table className={`${adminTableClass} min-w-[960px]`}>
              <thead className={adminTheadClass}>
                <tr>
                  <th className={adminThClass}>الرقم</th>
                  <th className={adminThClass}>العنوان</th>
                  <th className={`${adminThClass} text-end`}>المبلغ</th>
                  <th className={adminThClass}>التصنيف</th>
                  <th className={adminThClass}>طريقة الدفع</th>
                  <th className={adminThClass}>التاريخ</th>
                  <th className={adminThClass}>ملاحظات</th>
                  <th className={`${adminThClass} w-36`}>إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-slate-50/90"
                  >
                    <td className={`${adminTdClass} font-mono text-xs`}>
                      {row.id}
                    </td>
                    <td className={`${adminTdClass} font-medium`}>
                      {row.title}
                    </td>
                    <td className={`${adminTdClass} text-end font-semibold tabular-nums`}>
                      {formatMoney(row.amount)}
                    </td>
                    <td className={adminTdClass}>
                      {expenseCategoryLabelAr(row.category)}
                    </td>
                    <td className={adminTdClass}>
                      {orderPaymentMethodLabel(row.paymentMethod)}
                    </td>
                    <td className={`${adminTdClass} text-slate-600`}>
                      {row.date}
                    </td>
                    <td className={`${adminTdClass} max-w-[200px] truncate text-slate-500`}>
                      {row.notes ?? '—'}
                    </td>
                    <td className={adminTdClass}>
                      <div className="flex flex-wrap gap-1">
                        <Button
                          type="button"
                          variant="secondary"
                          className="!px-2 !py-1.5"
                          onClick={() => openEdit(row)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="!border-red-200 !px-2 !py-1.5 text-red-700 hover:!bg-red-50"
                          onClick={() => handleDelete(row.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
        open={modalOpen}
        title={editingId ? 'تعديل مصروف' : 'مصروف جديد'}
        onClose={() => setModalOpen(false)}
        wide
      >
        <form onSubmit={submitForm} className="space-y-4">
          <div>
            <Label htmlFor="exp-title">العنوان</Label>
            <Input
              id="exp-title"
              required
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="مثال: كهرباء المحل"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="exp-amount">المبلغ (ج.م)</Label>
              <Input
                id="exp-amount"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.01}
                required
                value={form.amount === 0 ? '' : form.amount}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    amount: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="exp-date">التاريخ</Label>
              <Input
                id="exp-date"
                type="date"
                required
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="exp-cat">التصنيف</Label>
              <select
                id="exp-cat"
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    category: e.target.value as ExpenseCategoryId,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {EXPENSE_CATEGORY_IDS.map((c) => (
                  <option key={c} value={c}>
                    {expenseCategoryLabelAr(c)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="exp-pay">طريقة الدفع</Label>
              <select
                id="exp-pay"
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    paymentMethod: e.target.value as OrderPaymentMethod,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {orderPaymentMethodLabel(m)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="exp-notes">ملاحظات (اختياري)</Label>
            <textarea
              id="exp-notes"
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              placeholder=""
            />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            <Button type="submit">{editingId ? 'حفظ التعديلات' : 'إضافة'}</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              إلغاء
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
