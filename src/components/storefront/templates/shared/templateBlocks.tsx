import { Link } from 'react-router-dom'
import { ChevronDown, Star } from 'lucide-react'
import type { StoreTemplateId, StoreThemeSettings } from '@/types/storeTheme'

function Stars({ value }: { value: number }) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < full
              ? 'fill-amber-400 text-amber-400'
              : i === full && half
                ? 'fill-amber-400/60 text-amber-400'
                : 'fill-slate-200 text-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

export function AboutSectionBlock({
  variant,
  content,
}: {
  variant: StoreTemplateId
  content: StoreThemeSettings['content']
}) {
  if (variant === 'luxury') {
    return (
      <section className="rounded-3xl border border-amber-500/20 bg-[var(--store-surface)] p-8 sm:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--store-primary)]">
            {content.aboutHighlight}
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-[var(--store-text)] sm:text-3xl">
            {content.aboutTitle}
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[var(--store-muted)] sm:text-base">
            {content.aboutBody}
          </p>
        </div>
      </section>
    )
  }
  if (variant === 'bold-colorful') {
    return (
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--store-primary)]/15 via-[var(--store-surface)] to-[var(--store-secondary)]/10 p-8 sm:p-10">
        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-block rounded-full bg-[var(--store-primary)]/15 px-3 py-1 text-xs font-bold text-[var(--store-primary)]">
              {content.aboutHighlight}
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-[var(--store-text)] sm:text-3xl">
              {content.aboutTitle}
            </h2>
            <p className="mt-4 text-[var(--store-muted)]">{content.aboutBody}</p>
          </div>
          <div className="flex min-h-[180px] items-center justify-center rounded-2xl border-2 border-dashed border-[var(--store-primary)]/30 bg-white/50 p-8 text-center text-sm text-[var(--store-muted)]">
            مساحة صورة أو فيديو للعلامة
          </div>
        </div>
      </section>
    )
  }
  if (variant === 'grid-clean') {
    return (
      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-[var(--store-surface)] p-6 sm:grid-cols-12 sm:p-8">
        <div className="sm:col-span-4">
          <h2 className="font-display text-xl font-bold text-[var(--store-text)]">
            {content.aboutTitle}
          </h2>
          <p className="mt-2 text-xs font-medium text-[var(--store-primary)]">
            {content.aboutHighlight}
          </p>
        </div>
        <div className="sm:col-span-8">
          <p className="text-sm leading-relaxed text-[var(--store-muted)]">
            {content.aboutBody}
          </p>
        </div>
      </section>
    )
  }
  if (variant === 'dynamic-interactive') {
    return (
      <section className="relative -rotate-1 rounded-3xl border border-slate-200/80 bg-[var(--store-surface)] p-8 shadow-xl transition hover:rotate-0 sm:p-10">
        <div className="absolute -end-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-[var(--store-primary)]/30 to-[var(--store-secondary)]/20 blur-2xl" />
        <div className="relative max-w-2xl">
          <h2 className="font-display text-2xl font-bold text-[var(--store-text)]">
            {content.aboutTitle}
          </h2>
          <p className="mt-2 text-sm font-medium text-[var(--store-secondary)]">
            {content.aboutHighlight}
          </p>
          <p className="mt-4 text-[var(--store-muted)]">{content.aboutBody}</p>
        </div>
      </section>
    )
  }
  /* modern-minimal */
  return (
    <section className="border-y border-slate-200/80 bg-[var(--store-surface)] py-14 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--store-muted)]">
          {content.aboutHighlight}
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold text-[var(--store-text)] sm:text-3xl">
          {content.aboutTitle}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-[var(--store-muted)] sm:text-base">
          {content.aboutBody}
        </p>
      </div>
    </section>
  )
}

export function QuickLinksBlock({
  variant,
  links,
}: {
  variant: StoreTemplateId
  links: StoreThemeSettings['content']['quickLinks']
}) {
  if (variant === 'luxury') {
    return (
      <section className="rounded-2xl border border-stone-700 bg-[var(--store-surface)] px-6 py-8">
        <h3 className="text-center font-display text-lg font-bold text-[var(--store-text)]">
          روابط سريعة
        </h3>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="rounded-xl border border-stone-600 px-3 py-3 text-center text-sm text-[var(--store-muted)] transition hover:border-[var(--store-primary)] hover:text-[var(--store-text)]"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    )
  }
  if (variant === 'bold-colorful') {
    return (
      <section className="rounded-3xl bg-[var(--store-text)] px-4 py-8 text-white sm:px-8">
        <h3 className="font-display text-xl font-bold">تصفّح سريع</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {links.map((l) => (
            <Link
              key={l.to + l.label}
              to={l.to}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>
    )
  }
  if (variant === 'grid-clean') {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50/80 p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--store-muted)]">
          خريطة الموقع
        </h3>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.to + l.label}>
              <Link
                to={l.to}
                className="text-sm text-[var(--store-primary)] underline-offset-4 hover:underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    )
  }
  if (variant === 'dynamic-interactive') {
    return (
      <section className="flex flex-wrap justify-center gap-2">
        {links.map((l) => (
          <Link
            key={l.to + l.label}
            to={l.to}
            className="rounded-lg border border-transparent bg-gradient-to-r from-[var(--store-primary)]/10 to-[var(--store-secondary)]/10 px-4 py-2 text-sm font-medium text-[var(--store-text)] transition hover:scale-[1.02] hover:border-[var(--store-primary)]/30"
          >
            {l.label}
          </Link>
        ))}
      </section>
    )
  }
  return (
    <section className="flex flex-wrap justify-center gap-3 border-t border-slate-200/80 pt-10">
      {links.map((l) => (
        <Link
          key={l.to + l.label}
          to={l.to}
          className="text-sm text-[var(--store-muted)] transition hover:text-[var(--store-text)]"
        >
          {l.label}
        </Link>
      ))}
    </section>
  )
}

export function FaqBlock({
  variant,
  items,
}: {
  variant: StoreTemplateId
  items: StoreThemeSettings['content']['faq']
}) {
  if (variant === 'luxury') {
    return (
      <section className="space-y-3">
        <h3 className="text-center font-display text-xl font-bold text-[var(--store-text)]">
          أسئلة شائعة
        </h3>
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-2xl border border-stone-700 bg-[var(--store-surface)] px-5 py-4 open:border-[var(--store-primary)]/40"
          >
            <summary className="cursor-pointer list-none font-medium text-[var(--store-text)] [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                {item.question}
                <ChevronDown className="h-4 w-4 shrink-0 transition group-open:rotate-180" />
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[var(--store-muted)]">
              {item.answer}
            </p>
          </details>
        ))}
      </section>
    )
  }
  if (variant === 'bold-colorful') {
    return (
      <section>
        <h3 className="mb-6 font-display text-2xl font-bold text-[var(--store-text)]">
          أسئلة شائعة
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gradient-to-br from-[var(--store-primary)]/10 to-[var(--store-secondary)]/5 p-5"
            >
              <p className="font-semibold text-[var(--store-text)]">
                {item.question}
              </p>
              <p className="mt-2 text-sm text-[var(--store-muted)]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  if (variant === 'grid-clean') {
    return (
      <section className="rounded-xl border border-slate-200">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
          <h3 className="text-sm font-bold text-[var(--store-text)]">
            الأسئلة المتكررة
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {items.map((item, i) => (
            <div key={i} className="grid gap-2 px-4 py-4 sm:grid-cols-3">
              <p className="text-sm font-medium text-[var(--store-text)] sm:col-span-1">
                {item.question}
              </p>
              <p className="text-sm text-[var(--store-muted)] sm:col-span-2">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  if (variant === 'dynamic-interactive') {
    return (
      <section className="space-y-4">
        <h3 className="font-display text-xl font-bold text-[var(--store-text)]">
          FAQ
        </h3>
        {items.map((item, i) => (
          <div
            key={i}
            className="border-s-4 border-[var(--store-primary)] bg-[var(--store-surface)] ps-4 shadow-sm transition hover:translate-x-1"
            style={{ borderRadius: 'var(--store-radius-card)' }}
          >
            <p className="font-semibold text-[var(--store-text)]">{item.question}</p>
            <p className="mt-2 text-sm text-[var(--store-muted)]">{item.answer}</p>
          </div>
        ))}
      </section>
    )
  }
  return (
    <section className="mx-auto max-w-xl space-y-4">
      <h3 className="text-center font-display text-xl font-bold text-[var(--store-text)]">
        أسئلة شائعة
      </h3>
      {items.map((item, i) => (
        <details key={i} className="group border-b border-slate-200 pb-4">
          <summary className="cursor-pointer list-none text-start font-medium text-[var(--store-text)] [&::-webkit-details-marker]:hidden">
            {item.question}
          </summary>
          <p className="mt-2 text-sm text-[var(--store-muted)]">{item.answer}</p>
        </details>
      ))}
    </section>
  )
}

export function TestimonialsBlock({
  variant,
  items,
}: {
  variant: StoreTemplateId
  items: StoreThemeSettings['content']['testimonials']
}) {
  if (variant === 'luxury') {
    return (
      <section>
        <h3 className="mb-8 text-center font-display text-xl font-bold text-[var(--store-text)]">
          آراء العملاء
        </h3>
        <div className="grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <blockquote
              key={i}
              className="rounded-2xl border border-amber-500/20 bg-[var(--store-surface)] p-6"
            >
              <Stars value={t.rating} />
              <p className="mt-4 text-sm leading-relaxed text-[var(--store-muted)]">
                &ldquo;{t.text}&rdquo;
              </p>
              <footer className="mt-4 text-sm font-semibold text-[var(--store-text)]">
                {t.name}
                {t.role ? (
                  <span className="ms-2 font-normal text-[var(--store-muted)]">
                    · {t.role}
                  </span>
                ) : null}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>
    )
  }
  if (variant === 'bold-colorful') {
    return (
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 p-1">
        <div className="rounded-[1.4rem] bg-white p-6 sm:p-8">
          <h3 className="text-center font-display text-xl font-bold text-[var(--store-text)]">
            ماذا يقول عملاؤنا
          </h3>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
            {items.map((t, i) => (
              <div
                key={i}
                className="w-[260px] shrink-0 rounded-2xl bg-slate-50 p-4 shadow-inner"
              >
                <Stars value={t.rating} />
                <p className="mt-3 text-sm text-[var(--store-muted)]">{t.text}</p>
                <p className="mt-3 text-sm font-bold text-[var(--store-text)]">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  if (variant === 'grid-clean') {
    return (
      <section className="rounded-xl border border-slate-200 bg-[var(--store-surface)] p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--store-muted)]">
          تقييمات
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {items.map((t, i) => (
            <div key={i} className="flex flex-col border border-slate-100 p-4">
              <Stars value={t.rating} />
              <p className="mt-3 flex-1 text-sm text-[var(--store-muted)]">{t.text}</p>
              <p className="mt-3 text-xs font-semibold text-[var(--store-text)]">
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  if (variant === 'dynamic-interactive') {
    return (
      <section>
        <h3 className="mb-6 font-display text-xl font-bold text-[var(--store-text)]">
          شهادات
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {items.map((t, i) => (
            <div
              key={i}
              className="rotate-1 transform rounded-2xl border border-slate-200 bg-white p-4 shadow-md transition hover:-rotate-1 hover:shadow-xl"
            >
              <Stars value={t.rating} />
              <p className="mt-3 text-sm text-[var(--store-muted)]">{t.text}</p>
              <p className="mt-2 text-sm font-bold text-[var(--store-text)]">{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    )
  }
  return (
    <section>
      <h3 className="mb-8 text-center font-display text-xl font-bold text-[var(--store-text)]">
        آراء العملاء
      </h3>
      <div className="grid gap-6 sm:grid-cols-3">
        {items.map((t, i) => (
          <div key={i} className="text-center">
            <Stars value={t.rating} />
            <p className="mt-4 text-sm leading-relaxed text-[var(--store-muted)]">
              {t.text}
            </p>
            <p className="mt-3 text-sm font-semibold text-[var(--store-text)]">
              {t.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
