import type { Order, OrderPaymentMethod } from '@/types'

const LABELS: Record<OrderPaymentMethod, string> = {
  cash: 'نقدي',
  card: 'بطاقة',
  cod: 'عند الاستلام',
  online: 'دفع إلكتروني',
}

/** When payment method is always set (e.g. expenses). */
export function orderPaymentMethodLabel(method: OrderPaymentMethod): string {
  return LABELS[method]
}

/**
 * Resolves payment method for display: explicit field, or inferred from order id / defaults.
 * Keeps older localStorage orders working without migration.
 */
export function paymentMethodLabelAr(order: Order): string {
  if (order.paymentMethod) return LABELS[order.paymentMethod]
  if (order.id.startsWith('ord_pos')) return LABELS.cash
  if (order.id.startsWith('ord_web')) return LABELS.cod
  return LABELS.card
}
