import { useAppData } from '@/contexts/AppDataContext'
import { useProductFilters } from '@/hooks/useProductFilters'
import { ProductFilterPanel } from '@/components/storefront/ProductFilterPanel'
import { ProductCard } from '@/components/storefront/ProductCard'

export function ProductListPage() {
  const { products } = useAppData()

  const {
    facets,
    facetState,
    searchQuery,
    filteredProducts,
    activeCount,
    setSearchQuery,
    toggleCategory,
    toggleBrand,
    toggleColor,
    toggleAttribute,
    setPriceMin,
    setPriceMax,
    clearAll,
  } = useProductFilters(products)

  return (
    <div>
      <div className="mb-6 lg:mb-8">
        <h1 className="font-display text-3xl font-bold text-slate-900">
          المتجر
        </h1>
        <p className="mt-2 text-slate-600">
          تصفّح المنتجات وصفِّ حسب التصنيف، الماركة، اللون، السعر والمزيد — دون
          إعادة تحميل الصفحة.
        </p>
        <p className="mt-2 hidden text-sm text-slate-500 lg:block">
          <span className="font-semibold text-slate-800">
            {filteredProducts.length}
          </span>
          {' من '}
          {products.length} منتج
          {activeCount > 0 ? (
            <span className="text-sky-700"> — معاملات تصفية نشطة</span>
          ) : null}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <ProductFilterPanel
          facets={facets}
          facetState={facetState}
          searchQuery={searchQuery}
          resultCount={filteredProducts.length}
          totalCount={products.length}
          activeCount={activeCount}
          onSearchChange={setSearchQuery}
          onToggleCategory={toggleCategory}
          onToggleBrand={toggleBrand}
          onToggleColor={toggleColor}
          onToggleAttribute={toggleAttribute}
          onPriceMinChange={setPriceMin}
          onPriceMaxChange={setPriceMax}
          onClearAll={clearAll}
        />

        <div className="order-2 min-w-0 flex-1 lg:order-2">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-16 text-center">
              <p className="text-lg font-medium text-slate-800">
                لا توجد منتجات مطابقة
              </p>
              <p className="mt-2 text-sm text-slate-600">
                جرّب تعديل التصفية أو مسح المعاملات.
              </p>
              <button
                type="button"
                onClick={clearAll}
                className="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-sky-700"
              >
                مسح التصفية
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:grid-cols-3 lg:gap-6 xl:gap-7">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
