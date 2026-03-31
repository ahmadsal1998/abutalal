import { useEffect, useState, type ComponentType } from 'react'
import { Link } from 'react-router-dom'
import { fetchReportStats } from '@/data/mockApi'
import { useAppData } from '@/contexts/AppDataContext'
import { formatMoney } from '@/lib/format'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { adminCardClass } from '@/components/admin/adminUi'
import { Package, Users, TrendingUp } from 'lucide-react'

export function AdminOverviewPage() {
  const { products, customers } = useAppData()
  const [stats, setStats] = useState<{
    revenue30d: number
    orders30d: number
    avgOrder: number
    topSku: string
  } | null>(null)

  useEffect(() => {
    void fetchReportStats().then(setStats)
  }, [])

  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length

  return (
    <div className="space-y-8 sm:space-y-10">
      <AdminPageHeader
        title="لوحة التحكم"
        description="مؤشرات تجريبية — جاهزة لاستبدال واجهة برمجة التطبيقات لاحقاً."
      />

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        <StatCard
          icon={TrendingUp}
          label="الإيرادات (٣٠ يوماً)"
          value={stats ? formatMoney(stats.revenue30d) : '…'}
          hint="من الطلبات المدمجة"
        />
        <StatCard
          icon={Package}
          label="الطلبات (٣٠ يوماً)"
          value={stats ? String(stats.orders30d) : '…'}
          hint="متجر + نقطة بيع"
        />
        <StatCard
          icon={Users}
          label="العملاء"
          value={String(customers.length)}
          hint="قائمة أولية"
        />
        <StatCard
          icon={Package}
          label="مخزون منخفض"
          value={String(lowStock)}
          hint="أقل من ١٠ وحدات"
        />
      </div>

      <div className={`${adminCardClass} p-6 sm:p-7`}>
        <h2 className="text-base font-semibold text-slate-900">إجراءات سريعة</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/admin/inventory"
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
          >
            إدارة المخزون
          </Link>
          <Link
            to="/admin/reports"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            التقارير
          </Link>
          <Link
            to="/admin/pos"
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            فتح نقطة البيع
          </Link>
        </div>
        {stats && (
          <p className="mt-4 text-sm text-slate-500">
            أعلى صنف (نافذة حديثة): <strong>{stats.topSku}</strong> · متوسط الطلب{' '}
            {formatMoney(stats.avgOrder)}
          </p>
        )}
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
  hint: string
}) {
  return (
    <div className={`${adminCardClass} p-5 sm:p-6`}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {label}
          </p>
          <p className="font-display text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-500">{hint}</p>
    </div>
  )
}
