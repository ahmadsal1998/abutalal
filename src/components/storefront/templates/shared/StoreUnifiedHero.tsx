import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ImageIcon } from 'lucide-react'
import { HERO_BANNER_MAX_IMAGES } from '@/lib/storefrontHeroBanner'

/** Matches “All products” / storefront catalog route */
const BANNER_ALL_PRODUCTS_HREF = '/products'
const BANNER_ALL_PRODUCTS_LABEL = 'كل المنتجات'

const BANNER_AUTOPLAY_INTERVAL_MS = 5000

const DEFAULT_TITLE = 'اكتشف مجموعتنا'
const DEFAULT_SUBTITLE =
  'تصفح عروضنا واختر ما يناسبك — جودة موثوقة وتجربة شراء واضحة وسهلة.'

export type StoreUnifiedHeroProps = {
  /** Resolved carousel URLs (max {@link HERO_BANNER_MAX_IMAGES}) */
  bannerImageUrls: string[]
  /** Optional storefront name (e.g. header logo text) for the eyebrow line */
  storeName?: string
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function BannerAllProductsLink({ className }: { className?: string }) {
  return (
    <Link
      to={BANNER_ALL_PRODUCTS_HREF}
      className={
        'group/cta inline-flex min-h-[44px] w-full min-w-0 touch-manipulation items-center justify-center gap-2 rounded-2xl bg-[var(--store-primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10 transition hover:brightness-[1.05] active:scale-[0.98] sm:w-auto sm:min-w-[12rem] sm:py-3.5 sm:text-[0.9375rem] ' +
        (className ?? '')
      }
    >
      {BANNER_ALL_PRODUCTS_LABEL}
      <ArrowLeft
        className="h-4 w-4 shrink-0 opacity-90 transition group-hover/cta:-translate-x-0.5"
        aria-hidden
      />
    </Link>
  )
}

export function StoreUnifiedHero({
  bannerImageUrls,
  storeName,
}: StoreUnifiedHeroProps) {
  const slides = bannerImageUrls.slice(0, HERO_BANNER_MAX_IMAGES)
  const count = slides.length
  const [index, setIndex] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const touchStartX = useRef<number | null>(null)
  const headingId = useId()
  const liveId = useId()

  useEffect(() => {
    setIndex((i) => (count === 0 ? 0 : Math.min(i, count - 1)))
  }, [count])

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return
      setIndex((i) => (i + delta + count) % count)
    },
    [count],
  )

  useEffect(() => {
    if (count <= 1 || reducedMotion) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, BANNER_AUTOPLAY_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [count, reducedMotion])

  const transitionClass = reducedMotion
    ? ''
    : 'transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]'

  const eyebrow =
    storeName && storeName.trim().length > 0
      ? `مرحباً في ${storeName.trim()}`
      : 'تجربة تسوق سلسة'

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-slate-200/50 bg-[var(--store-surface)] shadow-sm ring-1 ring-black/[0.03] lg:rounded-3xl lg:shadow-[0_24px_48px_-28px_rgba(15,23,42,0.12)]"
      aria-labelledby={headingId}
    >
      {/* Single page heading: visible copy only on lg+; always exposed to assistive tech */}
      <h1 id={headingId} className="sr-only">
        {DEFAULT_TITLE}
      </h1>

      <div
        className="pointer-events-none absolute inset-0 hidden opacity-[0.65] lg:block"
        aria-hidden
      >
        <div className="absolute -start-[20%] -top-[40%] h-[min(420px,55vw)] w-[min(420px,55vw)] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--store-primary),transparent_78%),transparent_68%)] blur-2xl" />
        <div className="absolute -end-[15%] bottom-0 h-[min(320px,45vw)] w-[min(320px,45vw)] rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--store-secondary),transparent_82%),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative grid lg:grid-cols-12">
        <div className="hidden flex-col justify-center px-6 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:col-span-5 lg:flex lg:px-10 lg:py-12 xl:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--store-primary)]">
            {eyebrow}
          </p>
          <p
            aria-hidden="true"
            className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-[var(--store-text)] sm:text-4xl lg:text-[2.35rem] xl:text-[2.5rem]"
          >
            {DEFAULT_TITLE}
          </p>
          <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-[var(--store-muted)] sm:text-base">
            {DEFAULT_SUBTITLE}
          </p>
          <div className="mt-7">
            <BannerAllProductsLink />
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--store-muted)]">
              <span>أسعار واضحة</span>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <span>دعم بالعربية</span>
              <span className="text-slate-300" aria-hidden>
                ·
              </span>
              <span>تجربة شراء بسيطة</span>
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 lg:flex lg:items-end lg:px-0 lg:pb-0 lg:pt-0 lg:pe-8 lg:ps-4 xl:pe-10">
          <div className="relative w-full p-3 sm:p-4 lg:px-0 lg:pb-10 lg:pt-0">
            <div
              dir="ltr"
              className="relative aspect-[16/9] w-full min-h-0 overflow-hidden bg-slate-100/90 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.06] lg:max-h-[min(420px,52vh)] lg:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.22)] lg:ring-slate-900/10"
              style={{ borderRadius: 'var(--store-radius-card)' }}
              onTouchStart={(e) => {
                touchStartX.current = e.changedTouches[0]?.clientX ?? null
              }}
              onTouchEnd={(e) => {
                const start = touchStartX.current
                touchStartX.current = null
                if (start == null || count <= 1) return
                const end = e.changedTouches[0]?.clientX
                if (end == null) return
                const dx = end - start
                if (Math.abs(dx) < 48) return
                go(dx < 0 ? 1 : -1)
              }}
            >
              <span id={liveId} className="sr-only" aria-live="polite">
                {count > 0 ? `الشريحة ${index + 1} من ${count}` : ''}
              </span>

              {count > 0 ? (
                <>
                  <div
                    className={`flex h-full min-h-0 ${transitionClass} ${!reducedMotion ? 'will-change-transform' : ''}`}
                    style={{
                      width: `${count * 100}%`,
                      transform: `translateX(-${(index / count) * 100}%)`,
                    }}
                  >
                    {slides.map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="relative h-full min-h-0 shrink-0 overflow-hidden"
                        style={{
                          width: `${100 / count}%`,
                          flex: `0 0 ${100 / count}%`,
                        }}
                      >
                        <img
                          src={src}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover object-center"
                          loading={i === 0 ? 'eager' : 'lazy'}
                          decoding="async"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, min(900px, 55vw)"
                        />
                      </div>
                    ))}
                  </div>

                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-10 sm:px-4 sm:pb-4 sm:pt-12"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.12) 50%, transparent 100%)',
                    }}
                  >
                    {count > 1 ? (
                      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 pb-0.5">
                        {slides.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              i === index
                                ? 'w-7 bg-white shadow-sm'
                                : 'w-1.5 bg-white/45 hover:bg-white/80'
                            }`}
                            aria-label={`الشريحة ${i + 1} من ${count}`}
                            aria-pressed={i === index}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {count > 1 ? (
                    <div className="pointer-events-none absolute end-3 top-3 z-20 hidden rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-medium tabular-nums text-white backdrop-blur sm:block">
                      {index + 1} / {count}
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 px-4 py-8 text-[var(--store-muted)] sm:min-h-[200px] sm:gap-5 sm:py-10">
                  <ImageIcon
                    className="h-10 w-10 opacity-[0.25] sm:h-14 sm:w-14"
                    aria-hidden
                  />
                  <p className="hidden max-w-[24ch] text-center text-sm leading-relaxed sm:block">
                    أضف صوراً للبانر من إعدادات التصميم لعرضها هنا.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
