import { useMemo, useState } from 'react'
import { useAppData } from '@/contexts/AppDataContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { adminCardClass } from '@/components/admin/adminUi'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Product } from '@/types'
import { Save } from 'lucide-react'

export function AdminInventoryPage() {
  const { products, updateProduct } = useAppData()
  const [drafts, setDrafts] = useState<
    Record<string, { stock: string; price: string }>
  >({})

  const rows = useMemo(() => [...products], [products])

  const getDraft = (p: Product) =>
    drafts[p.id] ?? { stock: String(p.stock), price: String(p.price) }

  const patchDraft = (
    p: Product,
    field: 'stock' | 'price',
    value: string,
  ) => {
    setDrafts((prev) => ({
      ...prev,
      [p.id]: {
        stock: prev[p.id]?.stock ?? String(p.stock),
        price: prev[p.id]?.price ?? String(p.price),
        [field]: value,
      },
    }))
  }

  const save = (p: Product) => {
    const d = getDraft(p)
    const stock = Math.max(0, Math.floor(Number.parseInt(d.stock, 10) || 0))
    const price = Math.max(0, Number.parseFloat(d.price) || 0)
    updateProduct(p.id, { stock, price })
    setDrafts((prev) => {
      const next = { ...prev }
      delete next[p.id]
      return next
    })
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="المخزون"
        description="تحديث الكمية والسعر في الذاكرة — يبقى حتى تحديث الصفحة (جاهز لاستبداله بطلبات الخادم)."
      />

      <div className="space-y-3 sm:space-y-4">
        {rows.map((p) => {
          const d = getDraft(p)
          const dirty =
            d.stock !== String(p.stock) || d.price !== String(p.price)
          return (
            <div
              key={p.id}
              className={`flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:p-5 ${adminCardClass}`}
            >
              <img
                src={p.imageUrl}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{p.name}</p>
                <p className="font-mono text-xs text-slate-500">{p.sku}</p>
              </div>
              <div className="flex flex-wrap items-end gap-3 sm:justify-end">
                <div className="w-24">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    الكمية
                  </label>
                  <Input
                    inputMode="numeric"
                    value={d.stock}
                    onChange={(e) => patchDraft(p, 'stock', e.target.value)}
                  />
                </div>
                <div className="w-28">
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    السعر (ج.م)
                  </label>
                  <Input
                    inputMode="decimal"
                    value={d.price}
                    onChange={(e) => patchDraft(p, 'price', e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  disabled={!dirty}
                  onClick={() => save(p)}
                  className="shrink-0"
                >
                  <Save className="h-4 w-4" />
                  حفظ
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
