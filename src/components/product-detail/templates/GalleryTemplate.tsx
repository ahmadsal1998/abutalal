import { useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/Badge'
import { ProductDetailBuyCluster } from '@/components/product-detail/ProductDetailBuyCluster'
import { ProductDetailSpecs } from '@/components/product-detail/ProductDetailSpecs'
import { VariantOptionGroups } from '@/components/product-detail/VariantOptionGroups'
import type { ProductDetailTemplateProps } from '@/components/product-detail/detailTypes'
import { categoryLabelAr } from '@/lib/displayLabels'

const THUMB_MAX = 16
const SWIPE_PX = 48

export function ProductDetailGalleryTemplate({
  product,
  activeVariant,
  imageUrl,
  variants,
  optionKeys,
  hasOptions,
  selection,
  setOption,
  selectVariant,
  qty,
  setQty,
  canAdd,
  onAddToCart,
}: ProductDetailTemplateProps) {
  const thumbs = variants.slice(0, THUMB_MAX)
  const activeThumbRef = useRef<HTMLButtonElement | null>(null)
  const touchStartX = useRef<number | null>(null)

  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }, [activeVariant.id])

  const activeIndex = Math.max(
    0,
    thumbs.findIndex((v) => v.id === activeVariant.id),
  )

  const goRelative = useCallback(
    (delta: number) => {
      const next = activeIndex + delta
      if (next < 0 || next >= thumbs.length) return
      selectVariant(thumbs[next])
    },
    [activeIndex, thumbs, selectVariant],
  )

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const endX = e.changedTouches[0].clientX
    const dx = endX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < SWIPE_PX) return
    if (dx > 0) goRelative(-1)
    else goRelative(1)
  }

  const thumbBtnClass = (active: boolean) =>
    `relative shrink-0 overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--store-primary)] focus-visible:ring-offset-2 ${
      active
        ? 'z-[1] scale-[1.02] border-[color:var(--store-primary)] shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--store-primary),transparent_55%)] ring-2 ring-[color:var(--store-primary)]/30 lg:scale-100 lg:shadow-[0_6px_20px_-6px_color-mix(in_srgb,var(--store-primary),transparent_50%)] lg:ring-2 lg:ring-[color:var(--store-primary)]/25'
        : 'border-slate-200/90 opacity-90 hover:scale-[1.02] hover:border-slate-300 hover:opacity-100 active:scale-[0.98] lg:hover:scale-100 lg:hover:shadow-md lg:active:scale-[0.97]'
    }`

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      {/* Gallery: thumbnails + main — two columns on lg; mobile: main then thumb strip */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:gap-5">
        <div className="order-2 flex w-full flex-col gap-2 lg:order-1 lg:w-19 lg:shrink-0 xl:w-21">
          <p className="hidden text-[10px] font-semibold uppercase tracking-wider text-slate-400 lg:block">
            الصور
          </p>
          <div
            className="flex flex-row gap-2.5 overflow-x-auto overscroll-x-contain pb-1 pt-0.5 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.55)_transparent] snap-x snap-mandatory lg:max-h-[min(720px,78vh)] lg:w-full lg:flex-col lg:gap-2.5 lg:overflow-y-auto lg:overflow-x-hidden lg:overscroll-y-contain lg:pb-0 lg:pt-0 lg:snap-none"
            style={{ WebkitOverflowScrolling: 'touch' }}
            role="listbox"
            aria-label="معاينات الصور"
          >
            {thumbs.map((v, i) => {
              const src = v.imageUrl ?? product.imageUrl
              const active = v.id === activeVariant.id
              return (
                <button
                  key={v.id}
                  type="button"
                  ref={active ? activeThumbRef : undefined}
                  role="option"
                  aria-selected={active}
                  onClick={() => selectVariant(v)}
                  className={`${thumbBtnClass(active)} h-17 w-17 snap-start sm:h-18 sm:w-18 lg:h-auto lg:w-full lg:shrink-0 lg:aspect-square`}
                >
                  <img
                    src={src}
                    alt=""
                    width={72}
                    height={72}
                    loading={i < 6 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="order-1 min-w-0 flex-1 lg:order-2">
          <div
            className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-linear-to-b from-slate-50 to-slate-100/90 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.15)] ring-1 ring-black/4"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative aspect-4/5 w-full sm:aspect-3/4 lg:aspect-4/5 lg:max-h-[min(88vh,920px)]">
              <img
                src={imageUrl}
                alt=""
                fetchPriority="high"
                decoding="async"
                sizes="(max-width: 1023px) 100vw, min(50vw, 42rem)"
                className="h-full w-full object-cover object-center transition duration-300 ease-out group-hover:scale-[1.01]"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/6 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              />
            </div>
            {thumbs.length > 1 ? (
              <p className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-sm lg:hidden">
                اسحب للتنقل بين الصور
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="min-w-0 flex-1 lg:max-w-xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={product.category === 'phone' ? 'info' : 'default'}>
            {categoryLabelAr(product.category)}
          </Badge>
          <span className="text-sm text-slate-500">{product.brand}</span>
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          {product.name}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
          {product.description}
        </p>

        {hasOptions ? (
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
              اختر المواصفات
            </p>
            <VariantOptionGroups
              variants={variants}
              optionKeys={optionKeys}
              selection={selection}
              onOptionChange={setOption}
              dense
            />
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
          <ProductDetailBuyCluster
            price={activeVariant.price}
            compareAtPrice={activeVariant.compareAtPrice}
            qty={qty}
            setQty={setQty}
            maxQty={activeVariant.stock}
            canAdd={canAdd}
            onAddToCart={onAddToCart}
            compact
          />
          <p className="mt-3 text-xs text-slate-500">
            {activeVariant.stock > 0
              ? `${activeVariant.stock} متوفر لهذا الخيار`
              : 'غير متوفر لهذا الخيار'}
          </p>
        </div>

        <ProductDetailSpecs specs={product.specs} />

        <Link
          to="/products"
          className="mt-6 inline-block text-sm font-medium text-[color:var(--store-primary)] hover:underline"
        >
          العودة إلى المتجر
        </Link>
      </div>
    </div>
  )
}
