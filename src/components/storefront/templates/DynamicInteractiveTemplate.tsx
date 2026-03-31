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

export function DynamicInteractiveTemplate({
  products,
  settings,
}: StorefrontTemplateProps) {
  const slices = useMemo(() => getProductSlices(products), [products])
  const { sections, content, hero } = settings
  const v = settings.templateId
  const bannerUrls = resolveHeroBannerImageUrls(hero, products[0]?.imageUrl)

  return (
    <div className="space-y-14">
      {sections.hero && (
        <StoreUnifiedHero
          bannerImageUrls={bannerUrls}
          storeName={settings.header.logoText}
        />
      )}

      {sections.products && (
        <section>
          <h2 className="mb-6 inline-block border-b-4 border-[var(--store-primary)] pb-2 font-display text-2xl font-bold text-[var(--store-text)]">
            المنتجات
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {slices.showcase.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-[var(--store-surface)] shadow-md ring-1 ring-slate-200/80 transition hover:-translate-y-1 hover:ring-[var(--store-primary)]/40"
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold text-[var(--store-text)]">
                    {p.name}
                  </p>
                  <p className="mt-2 bg-gradient-to-l from-[var(--store-primary)] to-[var(--store-secondary)] bg-clip-text font-display text-base font-bold text-transparent">
                    {formatMoney(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sections.sliders && (
        <div className="space-y-10">
          <SliderRow title="🔥 الأكثر مبيعاً">
            {slices.bestSellers.map((p) => (
              <ProductThumb key={p.id} product={p} />
            ))}
          </SliderRow>
          <SliderRow title="✨ وصل حديثاً">
            {slices.newArrivals.map((p) => (
              <ProductThumb key={p.id} product={p} />
            ))}
          </SliderRow>
          <SliderRow title="⭐ مميز">
            {slices.featured.map((p) => (
              <ProductThumb key={p.id} product={p} />
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
