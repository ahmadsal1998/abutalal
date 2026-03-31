import { useMemo, useState } from 'react'
import { useAppData } from '@/contexts/AppDataContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import {
  adminTableWrapClass,
  adminTableClass,
  adminTheadClass,
  adminThClass,
  adminTdClass,
} from '@/components/admin/adminUi'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { formatMoney } from '@/lib/format'
import { categoryLabelAr } from '@/lib/displayLabels'
import { Search } from 'lucide-react'

export function AdminProductsPage() {
  const { products } = useAppData()
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.sku.toLowerCase().includes(s) ||
        p.brand.toLowerCase().includes(s),
    )
  }, [products, q])

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="المنتجات"
        description="قالب صفحة تفاصيل المنتج يُضبط مرة واحدة من تصميم المتجر → صفحة المنتج ويطبّق على كل المنتجات. تعديل المخزون من صفحة المخزون."
      />

      <div className="relative max-w-md">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="بحث في المنتجات…"
          className="ps-9"
        />
      </div>

      <div className="grid gap-3 md:hidden">
        {rows.map((p) => (
          <div
            key={p.id}
            className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm"
          >
            <img
              src={p.imageUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900">{p.name}</p>
              <p className="text-xs text-slate-500">{p.brand}</p>
              <p className="mt-1 font-mono text-xs text-slate-500">{p.sku}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone={p.category === 'phone' ? 'info' : 'default'}>
                  {categoryLabelAr(p.category)}
                </Badge>
                <span className="text-sm font-medium tabular-nums text-slate-900">
                  {formatMoney(p.price)}
                </span>
                <span
                  className={`text-sm tabular-nums ${
                    p.stock === 0
                      ? 'text-red-600'
                      : p.stock < 10
                        ? 'text-amber-700'
                        : 'text-slate-700'
                  }`}
                >
                  مخزون: {p.stock}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={`${adminTableWrapClass} hidden md:block`}>
        <div className="overflow-x-auto">
          <table className={`${adminTableClass} min-w-[640px]`}>
            <thead className={adminTheadClass}>
              <tr>
                <th className={adminThClass}>المنتج</th>
                <th className={adminThClass}>الرمز</th>
                <th className={adminThClass}>التصنيف</th>
                <th className={`${adminThClass} text-end`}>السعر</th>
                <th className={`${adminThClass} text-end`}>المخزون</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-slate-50/90">
                  <td className={adminTdClass}>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.imageUrl}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{p.name}</p>
                        <p className="text-xs text-slate-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`${adminTdClass} font-mono text-xs text-slate-600`}>
                    {p.sku}
                  </td>
                  <td className={adminTdClass}>
                    <Badge tone={p.category === 'phone' ? 'info' : 'default'}>
                      {categoryLabelAr(p.category)}
                    </Badge>
                  </td>
                  <td className={`${adminTdClass} text-end font-medium tabular-nums`}>
                    {formatMoney(p.price)}
                  </td>
                  <td className={`${adminTdClass} text-end tabular-nums`}>
                    <span
                      className={
                        p.stock === 0
                          ? 'text-red-600'
                          : p.stock < 10
                            ? 'text-amber-700'
                            : 'text-slate-900'
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
