export function formatMoney(amount: number, currency = 'EGP') {
  return new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat('ar-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso))
}
