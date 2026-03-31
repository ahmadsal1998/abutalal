import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
  headerClass?: string
  trackClass?: string
}

export function SliderRow({
  title,
  subtitle,
  children,
  className = '',
  headerClass = '',
  trackClass = 'flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
}: Props) {
  return (
    <div className={className}>
      <div className={`mb-4 ${headerClass}`}>
        <h3 className="font-display text-lg font-bold text-[var(--store-text)] sm:text-xl">
          {title}
        </h3>
        {subtitle ? (
          <p className="mt-1 text-sm text-[var(--store-muted)]">{subtitle}</p>
        ) : null}
      </div>
      <div className={trackClass}>{children}</div>
    </div>
  )
}
