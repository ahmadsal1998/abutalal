import { faker } from '@faker-js/faker'
import type { Expense, ExpenseCategoryId, OrderPaymentMethod } from '@/types'

faker.seed(99_001)

const titles: Record<ExpenseCategoryId, string[]> = {
  rent: ['إيجار المحل — الشهر الحالي', 'إيجار مخزن'],
  bills: ['كهرباء', 'مياه', 'إنترنت واتصالات'],
  salaries: ['رواتب الموظفين', 'بدل انتقال'],
  maintenance: ['صيانة تكييف', 'قطع غيار معدات'],
  other: ['مستلزمات مكتبية', 'ضيافة', 'مصاريف متنوعة'],
}

function one(i: number): Expense {
  const category = faker.helpers.arrayElement<ExpenseCategoryId>([
    'rent',
    'bills',
    'salaries',
    'maintenance',
    'other',
  ])
  const paymentMethod = faker.helpers.arrayElement<OrderPaymentMethod>([
    'cash',
    'card',
    'online',
  ])
  const amount =
    category === 'rent'
      ? faker.number.int({ min: 8000, max: 25000 })
      : faker.number.int({ min: 200, max: 8000 })
  const date = faker.date.recent({ days: 45 }).toISOString()

  return {
    id: `exp_seed_${String(i + 1).padStart(3, '0')}`,
    title: faker.helpers.arrayElement(titles[category]),
    amount,
    category,
    paymentMethod,
    date: date.slice(0, 10),
    notes:
      faker.datatype.boolean({ probability: 0.4 })
        ? 'يتطلب إرفاق فاتورة مع الملف.'
        : undefined,
  }
}

export const seedExpenses: Expense[] = Array.from({ length: 10 }, (_, i) =>
  one(i),
)
