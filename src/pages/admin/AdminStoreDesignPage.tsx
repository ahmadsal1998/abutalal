import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  defaultStoreThemeSettings,
  mergeStoreTheme,
} from '@/data/storeThemeDefaults'
import { storeTemplates } from '@/data/storeTemplates'
import type { StoreTemplateId } from '@/types/storeTheme'
import { useStoreTheme } from '@/contexts/StoreThemeContext'
import { useAppData } from '@/contexts/AppDataContext'
import { storeThemeToCssVars } from '@/lib/storeThemeCssVars'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { StorefrontHomePageView } from '@/components/storefront/StorefrontHomePageView'
import { ProductDetailView } from '@/pages/storefront/ProductDetailPage'
import type { ProductDetailTemplateId } from '@/types'
import type { StoreThemeSettings } from '@/types/storeTheme'
import { HERO_BANNER_MAX_IMAGES } from '@/lib/storefrontHeroBanner'
import {
  PRODUCT_DETAIL_TEMPLATE_IDS,
  PRODUCT_DETAIL_TEMPLATE_META,
} from '@/data/productDetailTemplates'
import {
  LayoutTemplate,
  Palette,
  Rows3,
  Sparkles,
  Type,
  Eye,
  Save,
  RotateCcw,
  Layers,
  Package,
  PanelTop,
} from 'lucide-react'
import {
  FOOTER_CHROME_TEMPLATES,
  HEADER_CHROME_TEMPLATES,
  mergeChromeStateForTemplate,
  getFooterChromeTemplate,
  getHeaderChromeTemplate,
} from '@/data/storeChromeTemplates'
import { StoreHeader } from '@/components/storefront/StoreHeader'
import { StoreFooter } from '@/components/storefront/StoreFooter'

type TabId =
  | 'colors'
  | 'typography'
  | 'layout'
  | 'chrome'
  | 'hero'
  | 'sections'
  | 'templates'
  | 'product-detail'

const tabs: { id: TabId; label: string; icon: typeof Palette }[] = [
  { id: 'colors', label: 'الألوان', icon: Palette },
  { id: 'typography', label: 'الخطوط', icon: Type },
  { id: 'layout', label: 'التخطيط', icon: LayoutTemplate },
  { id: 'chrome', label: 'الرأس والتذييل', icon: PanelTop },
  { id: 'hero', label: 'البانر والهيرو', icon: Rows3 },
  { id: 'sections', label: 'الأقسام', icon: Layers },
  { id: 'templates', label: 'قوالب التصميم', icon: Sparkles },
  { id: 'product-detail', label: 'صفحة المنتج', icon: Package },
]

function SectionCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  const id = `color-${label.replace(/\s/g, '-')}`
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="flex gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-slate-200 bg-white p-1"
        />
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  )
}

export function AdminStoreDesignPage() {
  const { settings, setSettings, resetToDefaults } = useStoreTheme()
  const { products } = useAppData()
  const [draft, setDraft] = useState<StoreThemeSettings>(settings)
  const [tab, setTab] = useState<TabId>('colors')

  /** Sample product for PDP preview — prefer one with multiple variants. */
  const productDetailPreviewProduct = useMemo(() => {
    const rich = products.find((p) => (p.variants?.length ?? 0) > 1)
    return rich ?? products[0]
  }, [products])

  const dirty =
    JSON.stringify(draft) !== JSON.stringify(settings)

  useEffect(() => {
    if (!dirty) {
      setDraft(settings)
    }
  }, [settings, dirty])

  const patchDraft = (patch: Partial<StoreThemeSettings>) => {
    setDraft((d) => mergeStoreTheme(d, patch))
  }

  const save = () => {
    setSettings(mergeStoreTheme(defaultStoreThemeSettings, draft))
  }

  const discard = () => setDraft(settings)

  const applyTemplateToDraft = (templateId: StoreTemplateId) => {
    const t = storeTemplates.find((x) => x.id === templateId)
    if (!t) return
    setDraft((prev) =>
      mergeStoreTheme(mergeStoreTheme(defaultStoreThemeSettings, t.settings), {
        templateId: t.id,
        content: prev.content,
        productDetailTemplate: prev.productDetailTemplate,
        header: prev.header,
        footer: prev.footer,
      }),
    )
  }

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="تصميم المتجر"
        description="تخصيص مظهر واجهة المتجر الإلكترونية — يُحفظ محلياً ويمكن ربطه بالخادم لاحقاً (متعدد المتاجر)."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={discard}
              disabled={!dirty}
            >
              <RotateCcw className="h-4 w-4" />
              إلغاء التعديلات
            </Button>
            <Button type="button" onClick={save} disabled={!dirty}>
              <Save className="h-4 w-4" />
              حفظ التغييرات
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/90 bg-slate-50/80 p-1.5">
            {tabs.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    tab === t.id
                      ? 'bg-white text-violet-900 shadow-sm ring-1 ring-slate-200/80'
                      : 'text-slate-600 hover:bg-white/70'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" />
                  {t.label}
                </button>
              )
            })}
          </div>

          {tab === 'colors' && (
            <SectionCard title="لوحة الألوان">
              <div className="grid gap-5 sm:grid-cols-2">
                <ColorField
                  label="أساسي (Primary)"
                  value={draft.colors.primary}
                  onChange={(v) =>
                    patchDraft({ colors: { ...draft.colors, primary: v } })
                  }
                />
                <ColorField
                  label="ثانوي (Secondary)"
                  value={draft.colors.secondary}
                  onChange={(v) =>
                    patchDraft({ colors: { ...draft.colors, secondary: v } })
                  }
                />
                <ColorField
                  label="الخلفية"
                  value={draft.colors.background}
                  onChange={(v) =>
                    patchDraft({
                      colors: { ...draft.colors, background: v },
                    })
                  }
                />
                <ColorField
                  label="السطح (البطاقات)"
                  value={draft.colors.surface}
                  onChange={(v) =>
                    patchDraft({ colors: { ...draft.colors, surface: v } })
                  }
                />
                <ColorField
                  label="النص"
                  value={draft.colors.text}
                  onChange={(v) =>
                    patchDraft({ colors: { ...draft.colors, text: v } })
                  }
                />
                <ColorField
                  label="نص ثانوي"
                  value={draft.colors.muted}
                  onChange={(v) =>
                    patchDraft({ colors: { ...draft.colors, muted: v } })
                  }
                />
              </div>
            </SectionCard>
          )}

          {tab === 'typography' && (
            <SectionCard title="الخط والحجم">
              <div>
                <Label htmlFor="font">عائلة الخط</Label>
                <select
                  id="font"
                  value={draft.typography.fontFamily}
                  onChange={(e) =>
                    patchDraft({
                      typography: {
                        ...draft.typography,
                        fontFamily: e.target
                          .value as StoreThemeSettings['typography']['fontFamily'],
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                  <option value="cairo">Cairo</option>
                  <option value="tajawal">Tajawal</option>
                  <option value="almarai">Almarai</option>
                </select>
              </div>
              <div>
                <Label htmlFor="scale">حجم النص الأساسي ({draft.typography.baseScale.toFixed(2)}×)</Label>
                <input
                  id="scale"
                  type="range"
                  min={0.9}
                  max={1.15}
                  step={0.01}
                  value={draft.typography.baseScale}
                  onChange={(e) =>
                    patchDraft({
                      typography: {
                        ...draft.typography,
                        baseScale: Number(e.target.value),
                      },
                    })
                  }
                  className="w-full accent-violet-600"
                />
              </div>
            </SectionCard>
          )}

          {tab === 'layout' && (
            <SectionCard title="التخطيط والبطاقات">
              <div>
                <Label htmlFor="density">كثافة الشبكة</Label>
                <select
                  id="density"
                  value={draft.layout.gridDensity}
                  onChange={(e) =>
                    patchDraft({
                      layout: {
                        ...draft.layout,
                        gridDensity: e.target
                          .value as StoreThemeSettings['layout']['gridDensity'],
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="compact">مضغوط</option>
                  <option value="comfortable">مريح</option>
                  <option value="spacious">واسع</option>
                </select>
              </div>
              <div>
                <Label htmlFor="radius">زوايا البطاقات</Label>
                <select
                  id="radius"
                  value={draft.layout.cardRadius}
                  onChange={(e) =>
                    patchDraft({
                      layout: {
                        ...draft.layout,
                        cardRadius: e.target
                          .value as StoreThemeSettings['layout']['cardRadius'],
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="xl">XL</option>
                  <option value="2xl">2XL</option>
                  <option value="3xl">3XL</option>
                </select>
              </div>
              <div>
                <Label htmlFor="spacing">تباعد الأقسام</Label>
                <select
                  id="spacing"
                  value={draft.layout.sectionSpacing}
                  onChange={(e) =>
                    patchDraft({
                      layout: {
                        ...draft.layout,
                        sectionSpacing: e.target
                          .value as StoreThemeSettings['layout']['sectionSpacing'],
                      },
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="normal">عادي</option>
                  <option value="relaxed">مرتاح</option>
                </select>
              </div>
            </SectionCard>
          )}

          {tab === 'chrome' && (
            <div className="space-y-6">
              <SectionCard title="قالب شريط الرأس">
                <p className="text-sm text-slate-600">
                  اختر شكل التنقل والشريط العلوي — يُعرض فوراً في المعاينة دون حفظ.
                </p>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {HEADER_CHROME_TEMPLATES.map((t) => {
                    const active = draft.header.chromeTemplateId === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          const def = getHeaderChromeTemplate(t.id)
                          const merged = mergeChromeStateForTemplate(
                            def,
                            draft.header.chromeContent,
                            draft.header.chromeVisibility,
                          )
                          patchDraft({
                            header: {
                              ...draft.header,
                              chromeTemplateId: t.id,
                              chromeContent: merged.content,
                              chromeVisibility: merged.visibility,
                            },
                          })
                        }}
                        className={`flex flex-col items-start rounded-2xl border p-4 text-start shadow-sm transition ${
                          active
                            ? 'border-violet-500 bg-violet-50/50 ring-2 ring-violet-200'
                            : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md'
                        }`}
                      >
                        <span className="font-semibold text-slate-900">
                          {t.name}
                        </span>
                        <span className="mt-1 text-xs leading-relaxed text-slate-500">
                          {t.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </SectionCard>

              <SectionCard title="ألوان شريط الرأس">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ColorField
                    label="الخلفية"
                    value={draft.header.chromeColors.background}
                    onChange={(v) =>
                      patchDraft({
                        header: {
                          ...draft.header,
                          chromeColors: {
                            ...draft.header.chromeColors,
                            background: v,
                          },
                        },
                      })
                    }
                  />
                  <ColorField
                    label="النص"
                    value={draft.header.chromeColors.text}
                    onChange={(v) =>
                      patchDraft({
                        header: {
                          ...draft.header,
                          chromeColors: {
                            ...draft.header.chromeColors,
                            text: v,
                          },
                        },
                      })
                    }
                  />
                  <ColorField
                    label="الروابط"
                    value={draft.header.chromeColors.link}
                    onChange={(v) =>
                      patchDraft({
                        header: {
                          ...draft.header,
                          chromeColors: {
                            ...draft.header.chromeColors,
                            link: v,
                          },
                        },
                      })
                    }
                  />
                  <ColorField
                    label="الأزرار (السلة)"
                    value={draft.header.chromeColors.button}
                    onChange={(v) =>
                      patchDraft({
                        header: {
                          ...draft.header,
                          chromeColors: {
                            ...draft.header.chromeColors,
                            button: v,
                          },
                        },
                      })
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard title="الشعار (يظهر في الرأس والتذييل)">
                <div>
                  <Label htmlFor="logoText">نص الشعار</Label>
                  <Input
                    id="logoText"
                    value={draft.header.logoText}
                    onChange={(e) =>
                      patchDraft({
                        header: { ...draft.header, logoText: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="showLogo"
                    type="checkbox"
                    checked={draft.header.showLogoImage}
                    onChange={(e) =>
                      patchDraft({
                        header: {
                          ...draft.header,
                          showLogoImage: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-violet-600"
                  />
                  <label htmlFor="showLogo" className="text-sm text-slate-700">
                    استخدام صورة شعار (بدلاً من النص)
                  </label>
                </div>
                <div>
                  <Label htmlFor="logoUrl">رابط صورة الشعار</Label>
                  <Input
                    id="logoUrl"
                    dir="ltr"
                    placeholder="https://..."
                    value={draft.header.logoImageUrl ?? ''}
                    onChange={(e) =>
                      patchDraft({
                        header: {
                          ...draft.header,
                          logoImageUrl: e.target.value || null,
                        },
                      })
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard title="محتوى وإظهار الرأس (حسب القالب)">
                {(() => {
                  const def = getHeaderChromeTemplate(draft.header.chromeTemplateId)
                  return (
                    <>
                      {def.fields.map((field) => (
                        <div key={field.id}>
                          <Label htmlFor={`h-${field.id}`}>{field.label}</Label>
                          {field.type === 'textarea' ? (
                            <textarea
                              id={`h-${field.id}`}
                              rows={2}
                              value={draft.header.chromeContent[field.id] ?? ''}
                              onChange={(e) =>
                                patchDraft({
                                  header: {
                                    ...draft.header,
                                    chromeContent: {
                                      ...draft.header.chromeContent,
                                      [field.id]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                            />
                          ) : (
                            <Input
                              id={`h-${field.id}`}
                              dir={field.type === 'url' ? 'ltr' : undefined}
                              value={draft.header.chromeContent[field.id] ?? ''}
                              onChange={(e) =>
                                patchDraft({
                                  header: {
                                    ...draft.header,
                                    chromeContent: {
                                      ...draft.header.chromeContent,
                                      [field.id]: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          )}
                        </div>
                      ))}
                      <div className="space-y-2">
                        {def.visibilityFields.map((vf) => (
                          <label
                            key={vf.id}
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-slate-800">
                              {vf.label}
                            </span>
                            <input
                              type="checkbox"
                              checked={
                                draft.header.chromeVisibility[vf.id] !== false
                              }
                              onChange={(e) =>
                                patchDraft({
                                  header: {
                                    ...draft.header,
                                    chromeVisibility: {
                                      ...draft.header.chromeVisibility,
                                      [vf.id]: e.target.checked,
                                    },
                                  },
                                })
                              }
                              className="h-4 w-4 rounded border-slate-300 text-violet-600"
                            />
                          </label>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </SectionCard>

              <SectionCard title="قالب التذييل">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {FOOTER_CHROME_TEMPLATES.map((t) => {
                    const active = draft.footer.templateId === t.id
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => {
                          const def = getFooterChromeTemplate(t.id)
                          const merged = mergeChromeStateForTemplate(
                            def,
                            draft.footer.content,
                            draft.footer.visibility,
                          )
                          patchDraft({
                            footer: {
                              ...draft.footer,
                              templateId: t.id,
                              content: merged.content,
                              visibility: merged.visibility,
                            },
                          })
                        }}
                        className={`flex flex-col items-start rounded-2xl border p-4 text-start shadow-sm transition ${
                          active
                            ? 'border-violet-500 bg-violet-50/50 ring-2 ring-violet-200'
                            : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md'
                        }`}
                      >
                        <span className="font-semibold text-slate-900">
                          {t.name}
                        </span>
                        <span className="mt-1 text-xs leading-relaxed text-slate-500">
                          {t.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </SectionCard>

              <SectionCard title="ألوان التذييل">
                <div className="grid gap-5 sm:grid-cols-2">
                  <ColorField
                    label="الخلفية"
                    value={draft.footer.colors.background}
                    onChange={(v) =>
                      patchDraft({
                        footer: {
                          ...draft.footer,
                          colors: { ...draft.footer.colors, background: v },
                        },
                      })
                    }
                  />
                  <ColorField
                    label="النص"
                    value={draft.footer.colors.text}
                    onChange={(v) =>
                      patchDraft({
                        footer: {
                          ...draft.footer,
                          colors: { ...draft.footer.colors, text: v },
                        },
                      })
                    }
                  />
                  <ColorField
                    label="الروابط"
                    value={draft.footer.colors.link}
                    onChange={(v) =>
                      patchDraft({
                        footer: {
                          ...draft.footer,
                          colors: { ...draft.footer.colors, link: v },
                        },
                      })
                    }
                  />
                  <ColorField
                    label="التمييز (أيقونات وروابط نشطة)"
                    value={draft.footer.colors.button}
                    onChange={(v) =>
                      patchDraft({
                        footer: {
                          ...draft.footer,
                          colors: { ...draft.footer.colors, button: v },
                        },
                      })
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard title="محتوى وإظهار التذييل (حسب القالب)">
                {(() => {
                  const def = getFooterChromeTemplate(draft.footer.templateId)
                  return (
                    <>
                      {def.fields.map((field) => (
                        <div key={field.id}>
                          <Label htmlFor={`f-${field.id}`}>{field.label}</Label>
                          {field.type === 'textarea' ? (
                            <textarea
                              id={`f-${field.id}`}
                              rows={3}
                              value={draft.footer.content[field.id] ?? ''}
                              onChange={(e) =>
                                patchDraft({
                                  footer: {
                                    ...draft.footer,
                                    content: {
                                      ...draft.footer.content,
                                      [field.id]: e.target.value,
                                    },
                                  },
                                })
                              }
                              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                            />
                          ) : (
                            <Input
                              id={`f-${field.id}`}
                              dir={field.type === 'url' ? 'ltr' : undefined}
                              value={draft.footer.content[field.id] ?? ''}
                              onChange={(e) =>
                                patchDraft({
                                  footer: {
                                    ...draft.footer,
                                    content: {
                                      ...draft.footer.content,
                                      [field.id]: e.target.value,
                                    },
                                  },
                                })
                              }
                            />
                          )}
                        </div>
                      ))}
                      <div className="space-y-2">
                        {def.visibilityFields.map((vf) => (
                          <label
                            key={vf.id}
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                          >
                            <span className="text-sm font-medium text-slate-800">
                              {vf.label}
                            </span>
                            <input
                              type="checkbox"
                              checked={draft.footer.visibility[vf.id] !== false}
                              onChange={(e) =>
                                patchDraft({
                                  footer: {
                                    ...draft.footer,
                                    visibility: {
                                      ...draft.footer.visibility,
                                      [vf.id]: e.target.checked,
                                    },
                                  },
                                })
                              }
                              className="h-4 w-4 rounded border-slate-300 text-violet-600"
                            />
                          </label>
                        ))}
                      </div>
                    </>
                  )
                })()}
              </SectionCard>
            </div>
          )}

          {tab === 'hero' && (
            <div className="space-y-6">
              <SectionCard title="بانر الصفحة الرئيسية">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    بانر متحرك حتى {HERO_BANNER_MAX_IMAGES} صور — تُعرض كشرائح مع
                    انتقال سلس. اترك الحقول فارغة لاستخدام الصورة الاحتياطية أو
                    صورة من المنتجات.
                  </p>
                  {Array.from({ length: HERO_BANNER_MAX_IMAGES }, (_, i) => (
                    <div key={i}>
                      <Label htmlFor={`heroBanner-${i}`}>
                        صورة البانر {i + 1}
                      </Label>
                      <Input
                        id={`heroBanner-${i}`}
                        dir="ltr"
                        placeholder="https://…"
                        value={draft.hero.heroBannerImageUrls[i] ?? ''}
                        onChange={(e) => {
                          const next = [
                            ...(draft.hero.heroBannerImageUrls ?? []),
                          ]
                          while (next.length < HERO_BANNER_MAX_IMAGES)
                            next.push('')
                          next[i] = e.target.value
                          patchDraft({
                            hero: {
                              ...draft.hero,
                              heroBannerImageUrls: next.slice(
                                0,
                                HERO_BANNER_MAX_IMAGES,
                              ),
                            },
                          })
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <Label htmlFor="heroImg">صورة احتياطية (إن لم تُضف صوراً للبانر)</Label>
                  <Input
                    id="heroImg"
                    dir="ltr"
                    placeholder="اتركه فارغاً لاستخدام صورة من المنتجات"
                    value={draft.hero.heroImageUrl ?? ''}
                    onChange={(e) =>
                      patchDraft({
                        hero: {
                          ...draft.hero,
                          heroImageUrl: e.target.value || null,
                        },
                      })
                    }
                  />
                </div>
              </SectionCard>

              <SectionCard title="بانر وسط الصفحة">
                <div>
                  <Label htmlFor="midTitle">عنوان البانر</Label>
                  <Input
                    id="midTitle"
                    value={draft.banner.midBannerTitle}
                    onChange={(e) =>
                      patchDraft({
                        banner: {
                          ...draft.banner,
                          midBannerTitle: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="midSub">الوصف</Label>
                  <textarea
                    id="midSub"
                    rows={2}
                    value={draft.banner.midBannerSubtitle}
                    onChange={(e) =>
                      patchDraft({
                        banner: {
                          ...draft.banner,
                          midBannerSubtitle: e.target.value,
                        },
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                  />
                </div>
              </SectionCard>
            </div>
          )}

          {tab === 'sections' && (
            <SectionCard title="إظهار / إخفاء الأقسام (موحّدة لكل القوالب)">
              <p className="text-sm text-slate-600">
                كل قالب يعيد ترتيب المظهر، لكن هذه الأقسام نفسها موجودة في جميع
                القوالب.
              </p>
              {(
                [
                  ['hero', 'بانر الصفحة الرئيسية'],
                  ['products', 'قسم المنتجات'],
                  ['sliders', 'شرائح: الأكثر مبيعاً / الجديد / المميز'],
                  ['about', 'من نحن'],
                  ['quickLinks', 'روابط سريعة / خريطة الموقع'],
                  ['faq', 'أسئلة شائعة'],
                  ['testimonials', 'آراء العملاء'],
                ] as const
              ).map(([key, label]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                >
                  <span className="text-sm font-medium text-slate-800">
                    {label}
                  </span>
                  <input
                    type="checkbox"
                    checked={draft.sections[key]}
                    onChange={(e) =>
                      patchDraft({
                        sections: {
                          ...draft.sections,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="h-4 w-4 rounded border-slate-300 text-violet-600"
                  />
                </label>
              ))}
            </SectionCard>
          )}

          {tab === 'templates' && (
            <SectionCard title="قوالب التصميم الكاملة">
              <p className="text-sm text-slate-600">
                كل قالب يغيّر <strong>التخطيط والمكوّنات</strong> وليس الألوان فقط.
                يُطبَّق على المسودة — ثم احفظ. المحتوى النصي (FAQ وغيره) يُحفظ
                ما لم يتضمّنه القالب.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {storeTemplates.map((t) => {
                  const preview = mergeStoreTheme(
                    defaultStoreThemeSettings,
                    t.settings,
                  )
                  const active = draft.templateId === t.id
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => applyTemplateToDraft(t.id)}
                      className={`flex flex-col items-start rounded-2xl border p-4 text-start shadow-sm transition ${
                        active
                          ? 'border-violet-500 bg-violet-50/50 ring-2 ring-violet-200'
                          : 'border-slate-200 bg-white hover:border-violet-300 hover:shadow-md'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600">
                        {t.styleTag}
                      </span>
                      <span className="mt-1 font-semibold text-slate-900">
                        {t.name}
                      </span>
                      <span className="mt-1 text-xs leading-relaxed text-slate-500">
                        {t.description}
                      </span>
                      <span
                        className="mt-3 h-2 w-full rounded-full"
                        style={{
                          background: `linear-gradient(90deg, ${preview.colors.primary}, ${preview.colors.secondary})`,
                        }}
                      />
                    </button>
                  )
                })}
              </div>
              <div className="rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
                <button
                  type="button"
                  className="font-semibold text-amber-900 underline-offset-2 hover:underline"
                  onClick={() => {
                    resetToDefaults()
                  }}
                >
                  استعادة الافتراضي
                </button>
                <span className="text-amber-800/90">
                  {' '}
                  — يعيد القالب والإعدادات إلى الافتراضي.
                </span>
              </div>
            </SectionCard>
          )}

          {tab === 'product-detail' && (
            <SectionCard title="قالب صفحة تفاصيل المنتج (عام)">
              <p className="text-sm leading-relaxed text-slate-600">
                يوجد <strong>خمسة قوالب مستقلة</strong> لصفحة المنتج — كل منها
                هيكل وواجهة مختلفان (ليس تغيير ألوان فقط). يُختار{' '}
                <strong>قالب واحد هنا</strong> ليُطبَّق على{' '}
                <strong>كل المنتجات</strong> في المتجر. استخدم زر{' '}
                <strong>حفظ التغييرات</strong> أعلاه لحفظ الاختيار وتطبيقه في
                المتجر وبعد إعادة تحميل الصفحة؛ المعاينة على اليمين تعرض المسودة
                قبل الحفظ.
              </p>
              <div className="mt-4">
                <Label htmlFor="productDetailTemplate">
                  القالب النشط لكل صفحات المنتج
                </Label>
                <select
                  id="productDetailTemplate"
                  value={draft.productDetailTemplate ?? 'split'}
                  onChange={(e) => {
                    const tid = e.target.value as ProductDetailTemplateId
                    patchDraft({ productDetailTemplate: tid })
                  }}
                  className="mt-1.5 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                >
                  {PRODUCT_DETAIL_TEMPLATE_IDS.map((tid) => (
                    <option key={tid} value={tid}>
                      {PRODUCT_DETAIL_TEMPLATE_META[tid].label}
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                لإدارة أسماء المنتجات والمخزون، استخدم{' '}
                <Link
                  to="/admin/products"
                  className="font-medium text-violet-700 underline-offset-2 hover:underline"
                >
                  صفحة المنتجات
                </Link>
                .
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {PRODUCT_DETAIL_TEMPLATE_IDS.map((tid) => (
                  <div
                    key={tid}
                    className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 text-start shadow-sm"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {PRODUCT_DETAIL_TEMPLATE_META[tid].label}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {PRODUCT_DETAIL_TEMPLATE_META[tid].summary}
                    </p>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>

        <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-[min(100%,440px)] xl:w-[min(100%,480px)]">
          <div className="rounded-2xl border border-slate-200/90 bg-slate-100/80 p-4 shadow-inner">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Eye className="h-4 w-4 text-violet-600" />
              معاينة مباشرة
            </div>
            <p className="mb-3 text-xs text-slate-500">
              {tab === 'product-detail'
                ? 'معاينة المسودة لصفحة التفاصيل — تنعكس فوراً أثناء التعديل. اضغط «حفظ التغييرات» لتثبيت القالب والثيم في المتجر (ويُحفظ محلياً حتى بعد إغلاق اللوحة).'
                : 'تنعكس التعديلات فوراً على المعاينة. احفظ لتطبيقها على المتجر العام.'}
            </p>
            <div
              className={
                tab === 'product-detail'
                  ? 'max-h-[min(85vh,720px)] overflow-auto rounded-xl border border-slate-200 bg-[var(--store-bg)] shadow-sm'
                  : 'max-h-[min(70vh,560px)] overflow-auto rounded-xl border border-slate-200 bg-[var(--store-bg)] shadow-sm'
              }
              style={storeThemeToCssVars(draft)}
            >
              {tab === 'product-detail' ? (
                productDetailPreviewProduct ? (
                  <div className="flex min-h-0 min-w-[320px] flex-col">
                    <StoreHeader settings={draft} />
                    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                      <ProductDetailView
                        product={productDetailPreviewProduct}
                        templateId={draft.productDetailTemplate ?? 'split'}
                        onAddToCart={() => {}}
                      />
                    </div>
                    <StoreFooter settings={draft} />
                  </div>
                ) : (
                  <div className="min-w-[320px] p-6 text-center text-sm text-slate-500">
                    لا توجد منتجات في الكتالوج لعرض معاينة صفحة التفاصيل.
                  </div>
                )
              ) : (
                <div className="flex min-h-0 min-w-[320px] flex-col">
                  <StoreHeader settings={draft} />
                  <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    <StorefrontHomePageView
                      products={products}
                      settingsOverride={draft}
                    />
                  </div>
                  <StoreFooter settings={draft} />
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
