import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getProductSlices } from '@/lib/storefrontProductSlices'
import { formatMoney } from '@/lib/format'
import type { StorefrontTemplateProps } from './types'
import { StoreUnifiedHero } from './shared/StoreUnifiedHero'
import { resolveHeroBannerImageUrls } from '@/lib/storefrontHeroBanner'
import { SliderRow } from './shared/SliderRow'
import { ProductThumb } from './shared/ProductThumb'
import {
  AboutSectionBlock,
  QuickLinksBlock,
  FaqBlock,
  TestimonialsBlock,
} from './shared/templateBlocks'

export function GridCleanTemplate({
  products,
  settings,
}: StorefrontTemplateProps) {
  const slices = useMemo(() => getProductSlices(products), [products])
  const { sections, content, hero } = settings
  const v = settings.templateId
  const bannerUrls = resolveHeroBannerImageUrls(hero, products[0]?.imageUrl)

  return (
    <div className="space-y-12 sm:space-y-16">
      {sections.hero && (
        <StoreUnifiedHero
          bannerImageUrls={bannerUrls}
          storeName={settings.header.logoText}
        />
      )}

      {sections.products && (
        <section>
          <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="font-display text-xl font-bold text-[var(--store-text)]">
              المنتجات
            </h2>
            <Link
              to="/products"
              className="text-xs font-semibold uppercase tracking-wide text-[var(--store-primary)]"
            >
              عرض الكل ←
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {slices.showcase.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="flex flex-col border border-slate-200 bg-[var(--store-surface)]"
              >
                <div className="aspect-square bg-slate-100">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3">
                  <p className="line-clamp-2 min-h-[2.5rem] text-xs font-medium text-[var(--store-text)]">
                    {p.name}
                  </p>
                  <p className="mt-auto pt-2 text-sm font-bold text-[var(--store-text)]">
                    {formatMoney(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sections.sliders && (
        <div className="space-y-8 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6">
          <SliderRow title="الأكثر مبيعاً" subtitle="ترتيب حسب الطلب">
            {slices.bestSellers.map((p) => (
              <ProductThumb key={p.id} product={p} className="rounded-lg" />
            ))}
          </SliderRow>
          <SliderRow title="وصل حديثاً">
            {slices.newArrivals.map((p) => (
              <ProductThumb key={p.id} product={p} className="rounded-lg" />
            ))}
          </SliderRow>
          <SliderRow title="مميز">
            {slices.featured.map((p) => (
              <ProductThumb key={p.id} product={p} className="rounded-lg" />
            ))}
          </SliderRow>
        </div>
      )}

      {sections.about && <AboutSectionBlock variant={v} content={content} />}
      {sections.quickLinks && (
        <QuickLinksBlock variant={v} links={content.quickLinks} />
      )}
      {sections.faq && <FaqBlock variant={v} items={content.faq} />}
      {sections.testimonials && (
        <TestimonialsBlock variant={v} items={content.testimonials} />
      )}
    </div>
  )
}
