import type { Order } from '@/types'
import { orders as seedOrders } from '@/data/seed'

const KEY = 'abu-talal:orders'

function read(): Order[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as Order[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function write(list: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getAllOrdersMerged(): Order[] {
  const extra = read()
  const byId = new Map<string, Order>()
  for (const o of seedOrders) byId.set(o.id, o)
  for (const o of extra) byId.set(o.id, o)
  return [...byId.values()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function appendOrder(order: Order) {
  const list = read()
  list.unshift(order)
  write(list)
}
