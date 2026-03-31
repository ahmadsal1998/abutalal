import { useMemo } from 'react'
import { AdminPageHeader } from '@/components/admin/AdminPageHeader'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { useSitePages } from '@/contexts/SitePagesContext'
import type { SitePage } from '@/types/sitePage'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

function sortPages(list: SitePage[]): SitePage[] {
  return [...list].sort((a, b) => a.sortOrder - b.sortOrder)
}

export function AdminSitePagesPage() {
  const {
    pages,
    updatePage,
    removePage,
    movePage,
    addMissingStandardPages,
  } = useSitePages()

  const sortedPages = useMemo(() => sortPages(pages), [pages])

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="صفحات المتجر والتنقل"
        description="أضف صفحات معلومات (من نحن، اتصل بنا، الخصوصية، الشروط…) وعدّل المحتوى هنا. حدّد الظهور في رأس الصفحة و/أو التذييل. عند أول تشغيل أو عند عدم وجود صفحات، تُفعّل صفحات قياسية جاهزة يمكن تعديلها أو إخفاؤها."
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={() => addMissingStandardPages()}
          >
            إضافة الصفحات القياسية المفقودة
          </Button>
        }
      />

      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900">الصفحات الحالية</h2>
        {sortedPages.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">
            لا توجد صفحات بعد. استخدم «إضافة الصفحات القياسية المفقودة» أعلاه لتعبئة صفحات
            من نحن والاتصال والخصوصية والشروط، ثم عدّلها هنا.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {sortedPages.map((p, i) => (
              <li
                key={p.id}
                className="rounded-xl border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor={`title-${p.id}`}>العنوان</Label>
                      <Input
                        id={`title-${p.id}`}
                        value={p.title}
                        onChange={(e) =>
                          updatePage(p.id, { title: e.target.value })
                        }
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      المسار:{' '}
                      <span dir="ltr" className="font-mono text-slate-700">
                        {p.path}
                      </span>
                    </p>
                    {p.path.startsWith('/page/') ? (
                      <div>
                        <Label htmlFor={`body-${p.id}`}>محتوى الصفحة</Label>
                        <textarea
                          id={`body-${p.id}`}
                          value={p.body ?? ''}
                          onChange={(e) =>
                            updatePage(p.id, { body: e.target.value || null })
                          }
                          rows={4}
                          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                          placeholder="نص يظهر في صفحة المحتوى…"
                        />
                      </div>
                    ) : null}
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={p.showInNav}
                        onChange={(e) =>
                          updatePage(p.id, { showInNav: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-violet-600"
                      />
                      إظهار في قائمة التنقل (الرأس)
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                      <input
                        type="checkbox"
                        checked={p.showInFooter}
                        onChange={(e) =>
                          updatePage(p.id, { showInFooter: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-slate-300 text-violet-600"
                      />
                      إظهار في تذييل الموقع
                    </label>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 sm:flex-col sm:items-end">
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => movePage(p.id, -1)}
                      disabled={i === 0}
                      aria-label="تحريك لأعلى"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
                      onClick={() => movePage(p.id, 1)}
                      disabled={i === sortedPages.length - 1}
                      aria-label="تحريك لأسفل"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 bg-white text-red-600 transition hover:bg-red-50"
                      onClick={() => removePage(p.id)}
                      aria-label="حذف الصفحة"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
