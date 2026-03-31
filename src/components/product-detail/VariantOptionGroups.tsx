import { attributeKeyLabelAr } from '@/lib/productFacets'
import { uniqueValuesForKey } from '@/lib/productVariant'
import type { ProductVariant } from '@/types'

export function VariantOptionGroups({
  variants,
  optionKeys,
  selection,
  onOptionChange,
  dense,
  tone = 'light',
}: {
  variants: ProductVariant[]
  optionKeys: string[]
  selection: Record<string, string>
  onOptionChange: (key: string, value: string) => void
  dense?: boolean
  /** `dark`: for use on slate/hero panels */
  tone?: 'light' | 'dark'
}) {
  if (optionKeys.length === 0) return null

  const labelCls =
    tone === 'dark'
      ? 'text-slate-300'
      : 'text-slate-800'
  const inactiveCls =
    tone === 'dark'
      ? 'border-white/25 bg-white/5 text-slate-100 hover:border-white/40 hover:bg-white/10'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
  const activeCls =
    tone === 'dark'
      ? 'border-white bg-white text-slate-900 ring-2 ring-white/30'
      : 'border-[color:var(--store-primary)] bg-[color-mix(in_srgb,var(--store-primary),transparent_90%)] text-slate-900 ring-1 ring-[color:var(--store-primary)]/30'

  return (
    <div className={dense ? 'space-y-3' : 'space-y-5'}>
      {optionKeys.map((key) => {
        const values = uniqueValuesForKey(variants, key)
        return (
          <div key={key}>
            <p
              className={`mb-2 font-semibold ${labelCls} ${dense ? 'text-xs sm:text-sm' : 'text-sm'}`}
            >
              {attributeKeyLabelAr(key)}
            </p>
            <div className="flex flex-wrap gap-2">
              {values.map((val) => {
                const active = selection[key] === val
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onOptionChange(key, val)}
                    className={`min-h-[40px] rounded-xl border px-3 py-2 text-start text-xs font-medium transition sm:min-h-[44px] sm:px-4 sm:text-sm ${
                      active ? activeCls : inactiveCls
                    }`}
                  >
                    {val}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
