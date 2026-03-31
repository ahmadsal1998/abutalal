import { useAppData } from '@/contexts/AppDataContext'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { adminCardClass } from '@/components/admin/adminUi'
import { Input } from '@/components/ui/Input'
import { formatDate } from '@/lib/format'
import { Mail, MapPin, Phone, Search } from 'lucide-react'
import { useState } from 'react'

export function AdminCustomersPage() {
  const { customers, customerNotes, updateCustomerNote } = useAppData()
  const [q, setQ] = useState('')

  const filtered = customers.filter(
    (c) =>
      !q.trim() ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase()) ||
      c.city.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="العملاء"
        description="جهات اتصال أولية مع ملاحظات محلية — جاهز للاستبدال بواجهة CRM."
      />

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="تصفية بالاسم أو البريد أو المدينة…"
          className="ps-9"
        />
      </div>

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
        {filtered.map((c) => (
          <div key={c.id} className={`${adminCardClass} p-5 sm:p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-semibold text-slate-900">
                  {c.name}
                </p>
                <p className="mt-1 font-mono text-xs text-slate-500">{c.id}</p>
              </div>
              <span className="text-xs text-slate-500">
                منذ {formatDate(c.createdAt)}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                {c.email}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                {c.phone}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                {c.city}
              </li>
            </ul>
            <div className="mt-4">
              <label className="mb-1 block text-xs font-medium uppercase text-slate-500">
                ملاحظة داخلية
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                rows={2}
                placeholder="تفضيلات الضمان، آخر زيارة…"
                value={customerNotes[c.id] ?? ''}
                onChange={(e) => updateCustomerNote(c.id, e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
