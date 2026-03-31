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

export function ModernMinimalTemplate({
  products,
  settings,
}: StorefrontTemplateProps) {
  const slices = useMemo(() => getProductSlices(products), [products])
  const { sections, content, hero } = settings
  const v = settings.templateId
  const bannerUrls = resolveHeroBannerImageUrls(hero, products[0]?.imageUrl)

  return (
    <div className="space-y-16 sm:space-y-20">
      {sections.hero && (
        <StoreUnifiedHero
          bannerImageUrls={bannerUrls}
          storeName={settings.header.logoText}
        />
      )}

      {sections.products && (
        <section>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-bold text-[var(--store-text)]">
                منتجات مختارة
              </h2>
              <p className="mt-1 text-sm text-[var(--store-muted)]">
                تخطيط شبكي هادئ — نفس البيانات، عرض مختلف حسب القالب.
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium text-[var(--store-text)] underline-offset-4 hover:underline"
            >
              الكل
            </Link>
          </div>
          <div
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
            style={{ gap: 'var(--store-grid-gap)' }}
          >
            {slices.showcase.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group flex flex-col border border-slate-200/80 bg-[var(--store-surface)] transition hover:shadow-md"
                style={{ borderRadius: 'var(--store-radius-card)' }}
              >
                <div className="aspect-[4/5] overflow-hidden bg-slate-100">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm font-medium text-[var(--store-text)]">
                    {p.name}
                  </p>
                  <p className="mt-2 font-display text-base font-bold text-[var(--store-text)]">
                    {formatMoney(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sections.sliders && (
        <div className="space-y-12 border-y border-slate-200/80 py-12">
          <SliderRow title="الأكثر مبيعاً" subtitle="اختيارات الزوار">
            {slices.bestSellers.map((p) => (
              <ProductThumb key={p.id} product={p} />
            ))}
          </SliderRow>
          <SliderRow title="وصل حديثاً" subtitle="أحدث الإضافات للكتالوج">
            {slices.newArrivals.map((p) => (
              <ProductThumb key={p.id} product={p} />
            ))}
          </SliderRow>
          <SliderRow title="مميز" subtitle="منتجات نوصي بها">
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
