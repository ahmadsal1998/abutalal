import type { InputHTMLAttributes, ReactNode } from 'react'

export function Input({
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${className}`}
      {...rest}
    />
  )
}

export function Label({
  children,
  htmlFor,
}: {
  children: ReactNode
  htmlFor?: string
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-start text-xs font-medium uppercase tracking-wide text-slate-500"
    >
      {children}
    </label>
  )
}
