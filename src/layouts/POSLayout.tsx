import { Link, Outlet } from 'react-router-dom'
import { ArrowRight, ScanLine, Store } from 'lucide-react'

export function POSLayout() {
  return (
    <div className="min-h-svh bg-pos-900 text-slate-100">
      <header className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 bg-pos-800/95 px-4 py-3 backdrop-blur">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Link
            to="/admin"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">لوحة التحكم</span>
          </Link>
          <div className="hidden h-6 w-px shrink-0 bg-slate-600 sm:block" />
          <div className="flex min-w-0 items-center gap-2">
            <ScanLine className="h-5 w-5 shrink-0 text-emerald-400" />
            <span className="font-display truncate text-base font-semibold tracking-tight sm:text-lg">
              بيع سريع
            </span>
          </div>
        </div>
        <Link
          to="/"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-400 hover:bg-slate-700 hover:text-white"
        >
          <Store className="h-4 w-4" />
          المتجر
        </Link>
      </header>
      <Outlet />
    </div>
  )
}
