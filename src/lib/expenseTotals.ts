import type { Expense } from '@/types'

export type ExpenseTotals = {
  /** Sum for calendar day of `ref` */
  day: number
  /** Sum for calendar month of `ref` */
  month: number
}

/** Parse YYYY-MM-DD or ISO without UTC day-shift issues. */
function parseExpenseDate(value: string): Date | null {
  const head = value.slice(0, 10)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(head)
  if (m) {
    const y = Number(m[1])
    const mo = Number(m[2])
    const d = Number(m[3])
    return new Date(y, mo - 1, d)
  }
  const t = new Date(value)
  return Number.isNaN(t.getTime()) ? null : t
}

/**
 * Aggregates expenses for the given day and month (same calendar as `ref`).
 * Useful for dashboards and future profit = sales − expenses.
 */
export function computeExpenseTotals(
  expenses: Expense[],
  ref: Date = new Date(),
): ExpenseTotals {
  const y = ref.getFullYear()
  const m = ref.getMonth()
  const d = ref.getDate()
  let day = 0
  let month = 0
  for (const e of expenses) {
    const dt = parseExpenseDate(e.date)
    if (!dt) continue
    if (dt.getFullYear() === y && dt.getMonth() === m) {
      month += e.amount
      if (dt.getDate() === d) day += e.amount
    }
  }
  return { day, month }
}
