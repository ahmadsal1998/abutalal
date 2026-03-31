import type { ButtonHTMLAttributes, ReactNode } from 'react'

const variants = {
  primary:
    'bg-sky-600 text-white hover:bg-sky-700 shadow-sm disabled:opacity-50',
  secondary:
    'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  pos: 'bg-emerald-500 text-pos-900 font-semibold hover:bg-emerald-400',
} as const

type Variant = keyof typeof variants

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  className?: string
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 touch-manipulation items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
