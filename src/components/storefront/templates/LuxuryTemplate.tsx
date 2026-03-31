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

export function LuxuryTemplate({ products, settings }: StorefrontTemplateProps) {
  const slices = useMemo(() => getProductSlices(products), [products])
  const { sections, content, hero } = settings
  const v = settings.templateId
  const bannerUrls = resolveHeroBannerImageUrls(hero, products[0]?.imageUrl)

  return (
    <div className="space-y-16">
      {sections.hero && (
        <StoreUnifiedHero
          bannerImageUrls={bannerUrls}
          storeName={settings.header.logoText}
        />
      )}

      {sections.products && (
        <section className="border-y border-stone-700 py-12">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-[var(--store-text)] sm:text-3xl">
              المجموعة
            </h2>
            <div className="mx-auto mt-3 h-px w-16 bg-[var(--store-primary)]" />
          </div>
          <div className="grid grid-cols-2 gap-px bg-stone-700 sm:grid-cols-3 lg:grid-cols-4">
            {slices.showcase.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group bg-[var(--store-surface)] p-4 transition hover:bg-stone-900/50"
              >
                <div className="aspect-[3/4] overflow-hidden bg-stone-800">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                  />
                </div>
                <p className="mt-4 line-clamp-2 text-center text-sm text-[var(--store-text)]">
                  {p.name}
                </p>
                <p className="mt-2 text-center font-display text-sm font-semibold text-[var(--store-primary)]">
                  {formatMoney(p.price)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sections.sliders && (
        <div className="space-y-14 border-t border-stone-800 pt-14">
          <SliderRow
            title="الأكثر مبيعاً"
            trackClass="flex gap-5 overflow-x-auto pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {slices.bestSellers.map((p) => (
              <ProductThumb
                key={p.id}
                product={p}
                className="border-stone-600 bg-stone-900/40"
              />
            ))}
          </SliderRow>
          <SliderRow title="وصل حديثاً">
            {slices.newArrivals.map((p) => (
              <ProductThumb
                key={p.id}
                product={p}
                className="border-stone-600 bg-stone-900/40"
              />
            ))}
          </SliderRow>
          <SliderRow title="مختارات فاخرة">
            {slices.featured.map((p) => (
              <ProductThumb
                key={p.id}
                product={p}
                className="border-stone-600 bg-stone-900/40"
              />
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
