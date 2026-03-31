import { useEffect, useMemo, useState } from 'react'
import { fetchSalesSummaries, fetchReportStats } from '@/data/mockApi'
import { getAllOrdersMerged } from '@/data/orderStorage'
import type { SaleSummary } from '@/types'
import { formatMoney } from '@/lib/format'
import { saleChannelLabelAr } from '@/lib/displayLabels'
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

export function AdminReportsPage() {
  const [summaries, setSummaries] = useState<SaleSummary[]>([])
  const [stats, setStats] = useState<Awaited<
    ReturnType<typeof fetchReportStats>
  > | null>(null)

  useEffect(() => {
    void fetchSalesSummaries().then(setSummaries)
    void fetchReportStats().then(setStats)
  }, [])

  const mergedCount = useMemo(() => getAllOrdersMerged().length, [])

  const maxRev = useMemo(
    () => Math.max(...summaries.map((s) => s.total), 1),
    [summaries],
  )

  return (
    <div className="space-y-8 sm:space-y-10">
      <AdminPageHeader
        title="تقارير المبيعات"
        description={`مخططات بسيطة بالـ CSS؛ البيانات تجمع مبيعات أولية مع الطلبات المحفوظة محلياً (${mergedCount} طلباً في العرض).`}
      />

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-5">
          <div className={`${adminCardClass} p-5 sm:p-6`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              الإيرادات (٣٠ يوماً)
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">
              {formatMoney(stats.revenue30d)}
            </p>
          </div>
          <div className={`${adminCardClass} p-5 sm:p-6`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              الطلبات (٣٠ يوماً)
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">
              {stats.orders30d}
            </p>
          </div>
          <div className={`${adminCardClass} p-5 sm:p-6`}>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              متوسط الطلب
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">
              {formatMoney(stats.avgOrder)}
            </p>
          </div>
        </div>
      )}

      <div className={`${adminCardClass} p-6 sm:p-7`}>
        <h2 className="text-base font-semibold text-slate-900">
          الإيرادات حسب عملية البيع (تجريبي)
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          ارتفاع الشريط نسبي لأكبر عملية في القائمة الأولية.
        </p>
        <div className="mt-6 space-y-3">
          {summaries.slice(0, 10).map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className="w-24 shrink-0 truncate text-xs text-slate-500">
                {s.id}
              </div>
              <div className="h-8 min-w-0 flex-1 overflow-hidden rounded-lg bg-slate-100">
                <div
                  className="h-full rounded-lg bg-violet-500/90 transition-all"
                  style={{ width: `${(s.total / maxRev) * 100}%` }}
                />
              </div>
              <div className="w-28 shrink-0 text-end text-sm font-medium tabular-nums">
                {formatMoney(s.total)}
              </div>
              <Badge tone={s.channel === 'pos' ? 'muted' : 'info'}>
                {saleChannelLabelAr(s.channel)}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {summaries.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono text-xs text-slate-500">{s.id}</p>
              <Badge tone={s.channel === 'pos' ? 'muted' : 'info'}>
                {saleChannelLabelAr(s.channel)}
              </Badge>
            </div>
            <p className="mt-2 font-mono text-xs text-slate-600">{s.orderId}</p>
            <div className="mt-3 flex items-end justify-between gap-2">
              <p className="text-xs text-slate-500">
                {new Date(s.createdAt).toLocaleDateString('ar-EG')}
              </p>
              <p className="font-semibold tabular-nums text-slate-900">
                {formatMoney(s.total)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className={`${adminTableWrapClass} hidden md:block`}>
        <div className="overflow-x-auto">
          <table className={`${adminTableClass} min-w-[720px]`}>
            <thead className={adminTheadClass}>
              <tr>
                <th className={adminThClass}>البيع</th>
                <th className={adminThClass}>الطلب</th>
                <th className={adminThClass}>القناة</th>
                <th className={`${adminThClass} text-end`}>الإجمالي</th>
                <th className={adminThClass}>التاريخ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summaries.map((s) => (
                <tr key={s.id} className="transition-colors hover:bg-slate-50/90">
                  <td className={`${adminTdClass} font-mono text-xs`}>{s.id}</td>
                  <td className={`${adminTdClass} font-mono text-xs`}>
                    {s.orderId}
                  </td>
                  <td className={adminTdClass}>
                    <Badge tone={s.channel === 'pos' ? 'muted' : 'info'}>
                      {saleChannelLabelAr(s.channel)}
                    </Badge>
                  </td>
                  <td className={`${adminTdClass} text-end font-medium tabular-nums`}>
                    {formatMoney(s.total)}
                  </td>
                  <td className={`${adminTdClass} text-slate-600`}>
                    {new Date(s.createdAt).toLocaleDateString('ar-EG')}
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
