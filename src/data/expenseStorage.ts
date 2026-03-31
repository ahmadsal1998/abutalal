import type { Expense } from '@/types'
import { seedExpenses } from '@/data/expensesSeed'

const KEY = 'abu-talal:expenses-user'
const KEY_DELETED = 'abu-talal:expenses-deleted-seed'

function readUser(): Expense[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Expense[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeUser(list: Expense[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

function readDeletedSeedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY_DELETED)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw) as string[]
    return Array.isArray(parsed) ? new Set(parsed) : new Set()
  } catch {
    return new Set()
  }
}

function writeDeletedSeedIds(ids: Set<string>) {
  localStorage.setItem(KEY_DELETED, JSON.stringify([...ids]))
}

/** Merged list: seed (minus deleted) overlaid by user rows (same id = update). */
export function getAllExpensesMerged(): Expense[] {
  const deleted = readDeletedSeedIds()
  const user = readUser()
  const byId = new Map<string, Expense>()
  for (const e of seedExpenses) {
    if (!deleted.has(e.id)) byId.set(e.id, e)
  }
  for (const e of user) {
    byId.set(e.id, e)
  }
  return [...byId.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

function makeId() {
  return `exp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`
}

export function addExpense(
  payload: Omit<Expense, 'id'>,
): Expense {
  const expense: Expense = { ...payload, id: makeId() }
  const user = readUser()
  user.unshift(expense)
  writeUser(user)
  return expense
}

export function updateExpense(id: string, patch: Partial<Omit<Expense, 'id'>>) {
  const merged = getAllExpensesMerged()
  const current = merged.find((e) => e.id === id)
  if (!current) return
  const next: Expense = { ...current, ...patch, id }
  const user = readUser().filter((e) => e.id !== id)
  user.unshift(next)
  writeUser(user)
}

export function deleteExpense(id: string) {
  const isSeed = seedExpenses.some((e) => e.id === id)
  if (isSeed) {
    const deleted = readDeletedSeedIds()
    deleted.add(id)
    writeDeletedSeedIds(deleted)
    const user = readUser().filter((e) => e.id !== id)
    writeUser(user)
    return
  }
  writeUser(readUser().filter((e) => e.id !== id))
}
