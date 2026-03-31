import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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

export function BoldColorfulTemplate({
  products,
  settings,
}: StorefrontTemplateProps) {
  const slices = useMemo(() => getProductSlices(products), [products])
  const { sections, content, hero } = settings
  const v = settings.templateId
  const bannerUrls = resolveHeroBannerImageUrls(hero, products[0]?.imageUrl)

  return (
    <div className="space-y-14 sm:space-y-20">
      {sections.hero && (
        <StoreUnifiedHero
          bannerImageUrls={bannerUrls}
          storeName={settings.header.logoText}
        />
      )}

      {sections.products && (
        <section>
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-3xl font-extrabold text-[var(--store-text)]">
              تسوق المنتجات
            </h2>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-bold text-[var(--store-primary)]"
            >
              عرض الكل
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {slices.showcase.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.slug}`}
                className="group overflow-hidden rounded-3xl border-2 border-transparent bg-[var(--store-surface)] shadow-lg transition hover:border-[var(--store-primary)]/40 hover:shadow-2xl"
              >
                <div className="aspect-[3/4] overflow-hidden bg-slate-100">
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <p className="line-clamp-2 text-sm font-bold text-[var(--store-text)]">
                    {p.name}
                  </p>
                  <p className="mt-2 font-display text-lg font-extrabold text-[var(--store-primary)]">
                    {formatMoney(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {sections.sliders && (
        <div className="space-y-10 rounded-[2rem] bg-gradient-to-b from-[var(--store-primary)]/5 to-transparent px-2 py-10 sm:px-6">
          <SliderRow
            title="الأكثر مبيعاً"
            subtitle="الأكثر طلباً هذا الأسبوع"
            headerClass="text-center sm:text-start"
          >
            {slices.bestSellers.map((p) => (
              <ProductThumb key={p.id} product={p} className="border-2" />
            ))}
          </SliderRow>
          <SliderRow title="وصل حديثاً" subtitle="جديد الكتالوج">
            {slices.newArrivals.map((p) => (
              <ProductThumb key={p.id} product={p} className="border-2" />
            ))}
          </SliderRow>
          <SliderRow title="مميز لك" subtitle="اختيارات المحرر">
            {slices.featured.map((p) => (
              <ProductThumb key={p.id} product={p} className="border-2" />
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
