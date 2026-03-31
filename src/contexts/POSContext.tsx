import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Order, Product } from '@/types'
import { appendOrder } from '@/data/orderStorage'

const TAX_RATE = 0.14

export interface POSLine {
  product: Product
  quantity: number
}

interface POSContextValue {
  lines: POSLine[]
  search: string
  setSearch: (s: string) => void
  categoryFilter: 'all' | 'phone' | 'accessory'
  setCategoryFilter: (c: 'all' | 'phone' | 'accessory') => void
  subtotal: number
  tax: number
  total: number
  addProduct: (product: Product, qty?: number) => void
  increment: (productId: string) => void
  decrement: (productId: string) => void
  removeLine: (productId: string) => void
  clearCart: () => void
  lastReceipt: Order | null
  completeSale: (customerName: string) => Order
}

const POSContext = createContext<POSContextValue | null>(null)

function makePosOrderId() {
  return `ord_pos_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function POSProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<POSLine[]>([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<
    'all' | 'phone' | 'accessory'
  >('all')
  const [lastReceipt, setLastReceipt] = useState<Order | null>(null)

  const addProduct = useCallback((product: Product, qty = 1) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.product.id === product.id)
      if (i === -1) return [...prev, { product, quantity: qty }]
      const next = [...prev]
      next[i] = { ...next[i], quantity: next[i].quantity + qty }
      return next
    })
  }, [])

  const increment = useCallback((productId: string) => {
    setLines((prev) =>
      prev.map((l) =>
        l.product.id === productId
          ? { ...l, quantity: l.quantity + 1 }
          : l,
      ),
    )
  }, [])

  const decrement = useCallback((productId: string) => {
    setLines((prev) => {
      const next = prev
        .map((l) =>
          l.product.id === productId
            ? { ...l, quantity: l.quantity - 1 }
            : l,
        )
        .filter((l) => l.quantity > 0)
      return next
    })
  }, [])

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.product.id !== productId))
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.product.price * l.quantity, 0),
    [lines],
  )

  const tax = useMemo(
    () => Math.round(subtotal * TAX_RATE * 100) / 100,
    [subtotal],
  )

  const total = useMemo(
    () => Math.round((subtotal + tax) * 100) / 100,
    [subtotal, tax],
  )

  const completeSale = useCallback(
    (customerName: string) => {
      const order: Order = {
        id: makePosOrderId(),
        customerId: 'walk-in',
        customerName: customerName.trim() || 'عميل في المتجر',
        lines: lines.map((l) => ({
          productId: l.product.id,
          name: l.product.name,
          unitPrice: l.product.price,
          quantity: l.quantity,
        })),
        subtotal,
        tax,
        total,
        status: 'delivered',
        createdAt: new Date().toISOString(),
        paymentMethod: 'cash',
      }
      appendOrder(order)
      setLastReceipt(order)
      setLines([])
      return order
    },
    [lines, subtotal, tax, total],
  )

  const value = useMemo(
    () => ({
      lines,
      search,
      setSearch,
      categoryFilter,
      setCategoryFilter,
      subtotal,
      tax,
      total,
      addProduct,
      increment,
      decrement,
      removeLine,
      clearCart,
      lastReceipt,
      completeSale,
    }),
    [
      lines,
      search,
      categoryFilter,
      subtotal,
      tax,
      total,
      addProduct,
      increment,
      decrement,
      removeLine,
      clearCart,
      lastReceipt,
      completeSale,
    ],
  )

  return <POSContext.Provider value={value}>{children}</POSContext.Provider>
}

export function usePOS() {
  const ctx = useContext(POSContext)
  if (!ctx) throw new Error('يجب استخدام usePOS داخل POSProvider')
  return ctx
}
