import type { OrderStatus, ProductCategory } from '@/types'

export function categoryLabelAr(category: ProductCategory): string {
  return category === 'phone' ? 'هواتف' : 'إكسسوارات'
}

export function orderStatusLabelAr(status: OrderStatus): string {
  const m: Record<OrderStatus, string> = {
    pending: 'قيد الانتظار',
    processing: 'قيد المعالجة',
    shipped: 'تم الشحن',
    delivered: 'تم التسليم',
    cancelled: 'ملغى',
  }
  return m[status]
}

export function saleChannelLabelAr(channel: 'online' | 'pos'): string {
  return channel === 'online' ? 'متجر إلكتروني' : 'نقطة بيع'
}
