import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Customer, Product, ProductVariant } from '@/types'
import {
  customers as seedCustomers,
  products as seedProducts,
} from '@/data/seed'

interface AppDataContextValue {
  products: Product[]
  updateProduct: (
    id: string,
    patch: Partial<
      Pick<Product, 'stock' | 'price' | 'name'> & {
        variants?: ProductVariant[]
      }
    >,
  ) => void
  productBySlug: (slug: string) => Product | undefined
  productById: (id: string) => Product | undefined
  customers: Customer[]
  customerNotes: Record<string, string>
  updateCustomerNote: (id: string, note: string) => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => [...seedProducts])
  const [customers] = useState<Customer[]>(() => [...seedCustomers])
  const [customerNotes, setCustomerNotes] = useState<Record<string, string>>({})

  const updateProduct = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<Product, 'stock' | 'price' | 'name'> & {
          variants?: ProductVariant[]
        }
      >,
    ) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p)),
      )
    },
    [],
  )

  const productBySlug = useCallback(
    (slug: string) => products.find((p) => p.slug === slug),
    [products],
  )

  const productById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const updateCustomerNote = useCallback((id: string, note: string) => {
    setCustomerNotes((prev) => ({ ...prev, [id]: note }))
  }, [])

  const value = useMemo(
    () => ({
      products,
      updateProduct,
      productBySlug,
      productById,
      customers,
      customerNotes,
      updateCustomerNote,
    }),
    [
      products,
      updateProduct,
      productBySlug,
      productById,
      customers,
      customerNotes,
      updateCustomerNote,
    ],
  )

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  )
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('يجب استخدام useAppData داخل AppDataProvider')
  return ctx
}
