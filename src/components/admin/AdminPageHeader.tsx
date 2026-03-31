import type { ReactNode } from 'react'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
}

export function AdminPageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pt-1">
          {actions}
        </div>
      ) : null}
    </div>
  )
}
