import type { ReactNode } from 'react'

const styles: Record<string, string> = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-900',
  info: 'bg-sky-100 text-sky-900',
  muted: 'bg-slate-800 text-slate-200',
}

export function Badge({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode
  tone?: keyof typeof styles
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium ${styles[tone] ?? styles.default} ${className}`}
    >
      {children}
    </span>
  )
}
