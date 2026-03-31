import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, Mail, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react'
import { useAuth, MOCK_ADMIN_EMAIL, MOCK_ADMIN_PASSWORD } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await login(email, password)
      if (result.ok) {
        navigate(from, { replace: true })
      } else {
        setError(result.error ?? 'فشل تسجيل الدخول.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setEmail(MOCK_ADMIN_EMAIL)
    setPassword(MOCK_ADMIN_PASSWORD)
    setError(null)
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.25),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(139,92,246,0.15),transparent)]" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
          <Link
            to="/"
            className="mb-10 inline-flex w-fit items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            العودة للمتجر
          </Link>

          <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sky-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            دخول الموظفين
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            تسجيل دخول الإدارة
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
            سجّل الدخول لإدارة المنتجات والمخزون والتقارير والعملاء. تسجيل تجريبي
            للواجهة — استبدل طبقة المصادقة عند ربط الخادم.
          </p>

          <ul className="mt-10 hidden max-w-md space-y-4 text-sm text-slate-400 sm:block">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
                <Lock className="h-4 w-4" />
              </span>
              <span>
                <strong className="font-medium text-slate-200">
                  جلسة آمنة
                </strong>
                <br />
                تُخزَّن الجلسة في الذاكرة لهذا التبويب فقط.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                <Mail className="h-4 w-4" />
              </span>
              <span>
                <strong className="font-medium text-slate-200">
                  نفس المسارات
                </strong>
                <br />
                بعد الدخول تنتقل إلى الصفحة التي حاولت فتحها.
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 pt-0 sm:px-10 lg:px-12 lg:py-16">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h2 className="font-display text-lg font-semibold text-white">
              بيانات الدخول
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              استخدم الحساب التجريبي أو حسابك بعد ربط واجهة البرمجة.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <div className="relative mt-1.5">
                  <Mail className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="!border-slate-600/80 !bg-slate-900/60 !ps-10 !text-white placeholder:!text-slate-500"
                    placeholder=""
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">كلمة المرور</Label>
                <div className="relative mt-1.5">
                  <Lock className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="!border-slate-600/80 !bg-slate-900/60 !ps-10 !text-white placeholder:!text-slate-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full !py-3 !text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    جاري الدخول…
                  </>
                ) : (
                  <>
                    دخول
                    <ArrowLeft className="h-4 w-4" />
                  </>
                )}
              </Button>

              <button
                type="button"
                onClick={fillDemo}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-sky-200 transition hover:bg-white/10"
              >
                تعبئة بيانات تجريبية
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-slate-500">
              بريد تجريبي{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-300">
                {MOCK_ADMIN_EMAIL}
              </code>
              <br />
              كلمة المرور{' '}
              <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-slate-300">
                {MOCK_ADMIN_PASSWORD}
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
