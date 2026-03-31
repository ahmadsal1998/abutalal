export type ProductCategory = 'phone' | 'accessory'

/** Storefront product detail layout — each template is a distinct composition, not just theming. */
export type ProductDetailTemplateId =
  | 'split'
  | 'gallery'
  | 'editorial'
  | 'minimal'
  | 'showcase'

/** One purchasable SKU with its own price, stock, image, and attribute combination. */
export interface ProductVariant {
  id: string
  sku: string
  /** Short label shown in selectors (e.g. "256 جيجابايت — أسود") */
  label: string
  price: number
  compareAtPrice?: number
  /** Falls back to product image when omitted */
  imageUrl?: string
  stock: number
  /** e.g. { color: "أسود", storage: "256 جيجابايت", model: "Pro Max" } */
  attributes: Record<string, string>
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  category: ProductCategory
  brand: string
  price: number
  compareAtPrice?: number
  imageUrl: string
  stock: number
  description: string
  specs: string[]
  /**
   * Facet-friendly attributes (color, storage, material, …) for storefront filters.
   * Keys/values are free-form; the catalog UI derives filter options from live data.
   */
  attributes?: Record<string, string>
  /**
   * When non-empty, the PDP uses these rows for options (price/image/stock per variant).
   * When empty/omitted, a single implicit variant is derived from the base product fields.
   */
  variants?: ProductVariant[]
  /** Order of option groups in the UI (keys must appear in variants' attributes). */
  variantOptionOrder?: string[]
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  city: string
  createdAt: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface OrderLine {
  productId: string
  name: string
  unitPrice: number
  quantity: number
}

/** How the order was paid — optional for backward compatibility with stored orders. */
export type OrderPaymentMethod = 'cash' | 'card' | 'cod' | 'online'

export interface Order {
  id: string
  customerId: string
  customerName: string
  lines: OrderLine[]
  subtotal: number
  tax: number
  total: number
  status: OrderStatus
  createdAt: string
  paymentMethod?: OrderPaymentMethod
}

export interface SaleSummary {
  id: string
  orderId: string
  channel: 'online' | 'pos'
  total: number
  createdAt: string
}

export interface CartLine {
  product: Product
  quantity: number
  /** When set, `product` fields should reflect this variant (price, image, sku, name). */
  variantId?: string
}

/** Predefined expense categories — extend with `custom` + `categoryCustom` later if needed. */
export type ExpenseCategoryId =
  | 'rent'
  | 'bills'
  | 'salaries'
  | 'maintenance'
  | 'other'

export interface Expense {
  id: string
  title: string
  amount: number
  category: ExpenseCategoryId
  paymentMethod: OrderPaymentMethod
  /** ISO date (YYYY-MM-DD or full ISO string) */
  date: string
  notes?: string
}
