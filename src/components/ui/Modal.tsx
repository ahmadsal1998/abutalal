import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Modal({
  open,
  title,
  children,
  onClose,
  wide,
}: {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  wide?: boolean
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        aria-label="إغلاق"
        onClick={onClose}
      />
      <div
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-lg font-semibold text-slate-900">
            {title}
          </h2>
          <Button variant="ghost" className="!p-2" onClick={onClose} aria-label="إغلاق">
            <X className="h-5 w-5" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
