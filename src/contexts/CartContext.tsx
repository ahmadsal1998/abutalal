import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { CartLine, Product } from '@/types'

interface CartContextValue {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  addProduct: (product: Product, qty?: number, variantId?: string) => void
  setQuantity: (
    productId: string,
    quantity: number,
    variantId?: string,
  ) => void
  removeLine: (productId: string, variantId?: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])

  const addProduct = useCallback(
    (product: Product, qty = 1, variantId?: string) => {
      setLines((prev) => {
        const i = prev.findIndex(
          (l) =>
            l.product.id === product.id && l.variantId === variantId,
        )
        if (i === -1) return [...prev, { product, quantity: qty, variantId }]
        const next = [...prev]
        next[i] = {
          ...next[i],
          quantity: next[i].quantity + qty,
        }
        return next
      })
    },
    [],
  )

  const setQuantity = useCallback(
    (productId: string, quantity: number, variantId?: string) => {
      if (quantity < 1) {
        setLines((prev) =>
          prev.filter(
            (l) =>
              !(
                l.product.id === productId && l.variantId === variantId
              ),
          ),
        )
        return
      }
      setLines((prev) =>
        prev.map((l) =>
          l.product.id === productId && l.variantId === variantId
            ? { ...l, quantity }
            : l,
        ),
      )
    },
    [],
  )

  const removeLine = useCallback((productId: string, variantId?: string) => {
    setLines((prev) =>
      prev.filter(
        (l) =>
          !(l.product.id === productId && l.variantId === variantId),
      ),
    )
  }, [])

  const clear = useCallback(() => setLines([]), [])

  const subtotal = useMemo(
    () =>
      lines.reduce((s, l) => s + l.product.price * l.quantity, 0),
    [lines],
  )

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  )

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotal,
      addProduct,
      setQuantity,
      removeLine,
      clear,
    }),
    [lines, itemCount, subtotal, addProduct, setQuantity, removeLine, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('يجب استخدام useCart داخل CartProvider')
  return ctx
}
