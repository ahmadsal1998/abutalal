import { Link } from 'react-router-dom'
import { Headphones, HelpCircle, Shield, Store } from 'lucide-react'

export function StoreAccountPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--store-text)] sm:text-3xl">
          الحساب
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--store-muted)]">
          إعدادات عامة وتجربة مستخدم — قابلة للتوسعة مع تسجيل الدخول لاحقاً.
        </p>
      </div>

      <div className="space-y-3">
        <Link
          to="/orders"
          className="flex min-h-14 items-center gap-4 rounded-2xl border border-slate-200/80 bg-[var(--store-surface)] px-4 py-3 shadow-sm transition hover:border-[var(--store-primary)]/30"
        >
          <Store className="h-5 w-5 shrink-0 text-[var(--store-primary)]" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[var(--store-text)]">طلباتي</p>
            <p className="text-xs text-[var(--store-muted)]">
              عرض سجل الطلبات
            </p>
          </div>
        </Link>
        <a
          href="mailto:support@example.com"
          className="flex min-h-14 items-center gap-4 rounded-2xl border border-slate-200/80 bg-[var(--store-surface)] px-4 py-3 shadow-sm transition hover:border-[var(--store-primary)]/30"
        >
          <Headphones className="h-5 w-5 shrink-0 text-[var(--store-primary)]" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[var(--store-text)]">الدعم</p>
            <p className="truncate text-xs text-[var(--store-muted)]" dir="ltr">
              support@example.com
            </p>
          </div>
        </a>
        <div className="flex min-h-14 items-center gap-4 rounded-2xl border border-slate-200/80 bg-[var(--store-surface)] px-4 py-3 opacity-90">
          <Shield className="h-5 w-5 shrink-0 text-[var(--store-muted)]" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-[var(--store-text)]">
              الخصوصية والأمان
            </p>
            <p className="text-xs text-[var(--store-muted)]">قريباً — سياسة واضحة</p>
          </div>
        </div>
        <div className="flex min-h-14 items-center gap-4 rounded-2xl border border-dashed border-slate-200/90 px-4 py-3">
          <HelpCircle className="h-5 w-5 shrink-0 text-[var(--store-muted)]" />
          <p className="text-sm text-[var(--store-muted)]">
            تسجيل الدخول وحساب العميل الكامل يُضاف مع ربط الخادم.
          </p>
        </div>
      </div>
    </div>
  )
}
