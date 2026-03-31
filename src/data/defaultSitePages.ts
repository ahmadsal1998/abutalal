import type { SitePage } from '@/types/sitePage'

/** Default informational pages — seeded when site-pages storage is empty. */
export const STANDARD_SITE_PAGE_TEMPLATES: Omit<SitePage, 'id'>[] = [
  {
    title: 'من نحن',
    path: '/page/about-us',
    showInNav: true,
    showInFooter: true,
    sortOrder: 0,
    body:
      'نرحب بك في متجرنا. نقدّم هواتف وإكسسوارات مختارة بعناية، مع التزام بالجودة والشفافية.\n\n' +
      'يمكنك تعديل هذا النص من لوحة التحكم → صفحات المتجر.',
  },
  {
    title: 'اتصل بنا',
    path: '/page/contact',
    showInNav: true,
    showInFooter: true,
    sortOrder: 1,
    body:
      'نحن هنا للمساعدة.\n\n' +
      '• البريد: support@example.com\n' +
      '• الهاتف: +20 …\n' +
      '• ساعات العمل: …\n\n' +
      'حدّث بيانات الاتصال من لوحة التحكم.',
  },
  {
    title: 'سياسة الخصوصية',
    path: '/page/privacy',
    showInNav: false,
    showInFooter: true,
    sortOrder: 2,
    body:
      'نلتزم بحماية بياناتك. يصف هذا القسم كيفية جمع واستخدام المعلومات عند استخدام المتجر.\n\n' +
      'هذا نص تجريبي — استبدله بسياسة خصوصية كاملة تناسب نشاطك القانوني.',
  },
  {
    title: 'الشروط والأحكام',
    path: '/page/terms',
    showInNav: false,
    showInFooter: true,
    sortOrder: 3,
    body:
      'باستخدامك لهذا المتجر فإنك توافق على الشروط التالية.\n\n' +
      '• الطلبات والدفع والتوصيل\n' +
      '• الإرجاع والاستبدال\n' +
      '• المسؤولية القانونية\n\n' +
      'عدّل هذا النص ليتوافق مع سياساتك الفعلية.',
  },
]

export function seedStandardPages(): SitePage[] {
  return STANDARD_SITE_PAGE_TEMPLATES.map((t, i) => ({
    ...t,
    id: crypto.randomUUID(),
    sortOrder: i,
  }))
}
