import { Button } from '@/components/ui/button'

type ConfirmModalProps = {
  open: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={onClose} type="button">
              {cancelText}
            </Button>
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Booking…' : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
