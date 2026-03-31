import { useEffect, useId, useState, type ReactNode } from 'react'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { ProductCategory } from '@/types'
import type { FacetOptions, FacetState } from '@/lib/productFacets'
import { formatMoney } from '@/lib/format'

type ProductFilterPanelProps = {
  facets: FacetOptions
  facetState: FacetState
  searchQuery: string
  resultCount: number
  totalCount: number
  activeCount: number
  onSearchChange: (q: string) => void
  onToggleCategory: (c: ProductCategory) => void
  onToggleBrand: (b: string) => void
  onToggleColor: (c: string) => void
  onToggleAttribute: (key: string, value: string) => void
  onPriceMinChange: (v: number | null) => void
  onPriceMaxChange: (v: number | null) => void
  onClearAll: () => void
}

function FacetSection({
  title,
  summary,
  defaultOpen = true,
  children,
}: {
  title: string
  summary?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-xl border border-slate-200/80 bg-slate-50/50 py-0 last:mb-0 [&[open]]:bg-white [&[open]]:shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-3 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:-rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-slate-100 px-3 pb-3 pt-0">
        {summary ? (
          <p className="mb-3 pt-2 text-xs leading-relaxed text-slate-500">{summary}</p>
        ) : null}
        <div className="space-y-2">{children}</div>
      </div>
    </details>
  )
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded border-slate-300 text-sky-600 focus:ring-sky-500/30"
      />
      <span className="min-w-0 flex-1 leading-snug">{label}</span>
    </label>
  )
}

function FilterPanelInner(props: ProductFilterPanelProps) {
  const baseId = useId()
  const { priceBounds } = props.facets
  const minBound = priceBounds.min
  const maxBound = priceBounds.max

  const parsePriceInput = (raw: string): number | null => {
    const t = raw.trim()
    if (t === '') return null
    const n = Number(t)
    return Number.isFinite(n) ? n : null
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500">
          عرض{' '}
          <span className="font-semibold text-slate-800">{props.resultCount}</span>
          {' من '}
          <span className="text-slate-700">{props.totalCount}</span>
        </p>
        {props.activeCount > 0 ? (
          <button
            type="button"
            onClick={props.onClearAll}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-sky-700 transition hover:bg-sky-50"
          >
            <X className="h-3.5 w-3.5" />
            مسح الكل
          </button>
        ) : null}
      </div>

      <FacetSection title="بحث" defaultOpen>
        <label htmlFor={`${baseId}-q`} className="sr-only">
          بحث في المنتجات
        </label>
        <Input
          id={`${baseId}-q`}
          type="search"
          value={props.searchQuery}
          onChange={(e) => props.onSearchChange(e.target.value)}
          placeholder="اسم المنتج، الماركة، الرمز…"
          className="text-sm"
        />
      </FacetSection>

      {props.facets.categoryOptions.length > 0 ? (
        <FacetSection title="التصنيف" summary="اختر تصنيفاً واحداً أو أكثر">
          {props.facets.categoryOptions.map((o) => (
            <CheckboxRow
              key={o.value}
              id={`${baseId}-cat-${o.value}`}
              label={o.label}
              checked={props.facetState.categories.has(o.value)}
              onChange={() => props.onToggleCategory(o.value)}
            />
          ))}
        </FacetSection>
      ) : null}

      {props.facets.brands.length > 0 ? (
        <FacetSection title="الماركة" summary="متعدد الاختيار">
          <div className="max-h-44 overflow-y-auto pe-1">
            {props.facets.brands.map((b) => (
              <CheckboxRow
                key={b}
                id={`${baseId}-brand-${b}`}
                label={b}
                checked={props.facetState.brands.has(b)}
                onChange={() => props.onToggleBrand(b)}
              />
            ))}
          </div>
        </FacetSection>
      ) : null}

      {props.facets.colors.length > 0 ? (
        <FacetSection title="اللون">
          <div className="flex flex-wrap gap-2">
            {props.facets.colors.map((c) => {
              const active = props.facetState.colors.has(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => props.onToggleColor(c)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
        </FacetSection>
      ) : null}

      <FacetSection title="نطاق السعر" summary={`${formatMoney(minBound)} — ${formatMoney(maxBound)}`}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor={`${baseId}-pmin`}
              className="mb-1 block text-xs text-slate-600"
            >
              من
            </label>
            <Input
              id={`${baseId}-pmin`}
              inputMode="numeric"
              dir="ltr"
              placeholder={String(minBound)}
              value={
                props.facetState.priceMin != null
                  ? String(props.facetState.priceMin)
                  : ''
              }
              onChange={(e) =>
                props.onPriceMinChange(parsePriceInput(e.target.value))
              }
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor={`${baseId}-pmax`}
              className="mb-1 block text-xs text-slate-600"
            >
              إلى
            </label>
            <Input
              id={`${baseId}-pmax`}
              inputMode="numeric"
              dir="ltr"
              placeholder={String(maxBound)}
              value={
                props.facetState.priceMax != null
                  ? String(props.facetState.priceMax)
                  : ''
              }
              onChange={(e) =>
                props.onPriceMaxChange(parsePriceInput(e.target.value))
              }
              className="mt-1 text-sm"
            />
          </div>
        </div>
      </FacetSection>

      {props.facets.attributeGroups.map((g) => (
        <FacetSection key={g.key} title={g.label}>
          <div className="max-h-40 overflow-y-auto pe-1">
            {g.values.map((v) => (
              <CheckboxRow
                key={v}
                id={`${baseId}-attr-${g.key}-${v}`}
                label={v}
                checked={Boolean(
                  props.facetState.attributeFilters[g.key]?.has(v),
                )}
                onChange={() => props.onToggleAttribute(g.key, v)}
              />
            ))}
          </div>
        </FacetSection>
      ))}
    </div>
  )
}

export function ProductFilterPanel(props: ProductFilterPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const panelProps = {
    ...props,
  }

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [mobileOpen])

  return (
    <div className="order-1 w-full shrink-0 lg:order-1 lg:w-[min(100%,18rem)] xl:w-80">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white via-white to-slate-50/90 p-4 shadow-md ring-1 ring-slate-100/90">
          <div className="mb-4 flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/5 text-slate-700">
              <SlidersHorizontal className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="font-display text-base font-semibold text-slate-900">
                تصفية النتائج
              </h2>
              <p className="text-xs text-slate-500">
                {props.resultCount} من {props.totalCount} منتج
              </p>
            </div>
          </div>
          <FilterPanelInner {...panelProps} />
        </div>
      </aside>

      <div className="lg:hidden">
        <div className="sticky top-16 z-30 -mx-4 mb-5 overflow-hidden rounded-2xl border border-slate-200/90 bg-[var(--store-surface)]/95 px-4 py-3.5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] backdrop-blur-md sm:-mx-6 sm:px-5">
          <div className="flex flex-wrap items-stretch gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex min-h-[48px] min-w-0 flex-[1.15] items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 active:scale-[0.99]"
            >
              <SlidersHorizontal className="h-5 w-5 shrink-0" aria-hidden />
              <span className="truncate">تصفية وبحث</span>
              {props.activeCount > 0 ? (
                <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-sky-500 px-1.5 text-xs font-bold text-white">
                  {props.activeCount}
                </span>
              ) : null}
            </button>
            <div className="flex min-w-0 flex-1 flex-col justify-center text-end">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                النتائج
              </span>
              <span className="text-base font-bold tabular-nums text-slate-900">
                {props.resultCount}
                <span className="ms-1 text-sm font-normal text-slate-500">
                  / {props.totalCount}
                </span>
              </span>
            </div>
          </div>
          {props.activeCount > 0 ? (
            <button
              type="button"
              onClick={props.onClearAll}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white/80 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <X className="h-4 w-4" aria-hidden />
              مسح كل التصفية
            </button>
          ) : null}
        </div>
      </div>

      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filter-drawer-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/45 backdrop-blur-[3px]"
            aria-label="إغلاق التصفية"
            onClick={() => setMobileOpen(false)}
          />
          <div className="filter-drawer-panel absolute inset-y-0 right-0 flex h-[100dvh] w-full max-w-[min(100%,22rem)] flex-col bg-white shadow-[0_0_0_1px_rgba(15,23,42,0.06)]">
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))]">
              <div className="min-w-0">
                <h2
                  id="filter-drawer-title"
                  className="font-display text-lg font-semibold text-slate-900"
                >
                  تصفية المنتجات
                </h2>
                <p className="mt-0.5 text-xs text-slate-500">
                  {props.resultCount} من {props.totalCount} منتج
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-600 transition hover:bg-slate-100"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-4 py-4">
              <FilterPanelInner {...panelProps} />
            </div>
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Button
                type="button"
                className="w-full min-h-[48px] text-base font-semibold shadow-sm"
                onClick={() => setMobileOpen(false)}
              >
                عرض النتائج ({props.resultCount})
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
