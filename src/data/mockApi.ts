import type { Customer, Order, Product, SaleSummary } from '@/types'
import {
  customers,
  orders as seedOrders,
  productById,
  productBySlug,
  products,
  salesSummaries,
} from '@/data/seed'
import { getAllOrdersMerged } from '@/data/orderStorage'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function fetchProducts(): Promise<Product[]> {
  await delay(120)
  return [...products]
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  await delay(80)
  return productBySlug(slug) ?? null
}

export async function fetchProductById(id: string): Promise<Product | null> {
  await delay(50)
  return productById(id) ?? null
}

export async function fetchCustomers(): Promise<Customer[]> {
  await delay(100)
  return [...customers]
}

export async function fetchOrders(): Promise<Order[]> {
  await delay(150)
  return getAllOrdersMerged()
}

export async function fetchSalesSummaries(): Promise<SaleSummary[]> {
  await delay(100)
  return [...salesSummaries]
}

/** Simulated API for admin aggregate stats */
export async function fetchReportStats(): Promise<{
  revenue30d: number
  orders30d: number
  avgOrder: number
  topSku: string
}> {
  await delay(120)
  const merged = getAllOrdersMerged()
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
  const recent = merged.filter((o) => new Date(o.createdAt).getTime() >= thirtyDaysAgo)
  const revenue30d = recent.reduce((s, o) => s + o.total, 0)
  const orders30d = recent.length
  const avgOrder = orders30d ? Math.round((revenue30d / orders30d) * 100) / 100 : 0
  const topSku =
    recent[0]?.lines[0]?.name ??
    seedOrders[0]?.lines[0]?.name ??
    '—'
  return { revenue30d, orders30d, avgOrder, topSku }
}
