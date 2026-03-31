import type { ExpenseCategoryId } from '@/types'

export const EXPENSE_CATEGORY_IDS: readonly ExpenseCategoryId[] = [
  'rent',
  'bills',
  'salaries',
  'maintenance',
  'other',
] as const

const LABELS_AR: Record<ExpenseCategoryId, string> = {
  rent: 'إيجار',
  bills: 'فواتير',
  salaries: 'رواتب',
  maintenance: 'صيانة',
  other: 'أخرى',
}

export function expenseCategoryLabelAr(id: ExpenseCategoryId): string {
  return LABELS_AR[id]
}
