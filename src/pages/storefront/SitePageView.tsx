import { Link, useParams } from 'react-router-dom'
import { useSitePages } from '@/contexts/SitePagesContext'

export function SitePageView() {
  const { slug } = useParams<{ slug: string }>()
  const { pages } = useSitePages()

  if (!slug) {
    return null
  }

  const path = `/page/${slug}`
  const page = pages.find((p) => p.path === path)

  if (!page) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-[var(--store-surface)] px-6 py-16 text-center">
        <p className="text-lg font-semibold text-[var(--store-text)]">الصفحة غير موجودة</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm font-medium text-[var(--store-primary)] underline-offset-4 hover:underline"
        >
          العودة للرئيسية
        </Link>
      </div>
    )
  }

  const body = page.body?.trim()

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="font-display text-2xl font-bold text-[var(--store-text)] sm:text-3xl">
        {page.title}
      </h1>
      <div className="mt-6 text-base leading-relaxed text-[var(--store-muted)]" dir="rtl">
        {body ? (
          <div className="whitespace-pre-wrap">{body}</div>
        ) : (
          <p className="text-sm italic">لا يوجد محتوى بعد.</p>
        )}
      </div>
    </article>
  )
}
