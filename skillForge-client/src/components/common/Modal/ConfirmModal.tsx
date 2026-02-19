import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info' | 'primary'
  children?: React.ReactNode
}


export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
  children
}: ConfirmModalProps) {
  if (!isOpen) return null

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    } else if (e.key === 'Enter') {
      // Don't auto-confirm on Enter if there are children (like inputs)
      if (!children) onConfirm()
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'bg-destructive/10',
          iconColor: 'text-destructive',
          confirmBg: 'bg-destructive hover:bg-destructive/90',
          confirmText: 'text-destructive-foreground'
        }
      case 'warning':
        return {
          iconBg: 'bg-yellow-500/10',
          iconColor: 'text-yellow-500',
          confirmBg: 'bg-yellow-500 hover:bg-yellow-600',
          confirmText: 'text-white'
        }
      case 'info':
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          confirmBg: 'bg-primary hover:bg-primary/90',
          confirmText: 'text-primary-foreground'
        }
      case 'primary':
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          confirmBg: 'bg-primary hover:bg-primary/90',
          confirmText: 'text-primary-foreground'
        }
      default:
        return {
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
          confirmBg: 'bg-primary hover:bg-primary/90',
          confirmText: 'text-primary-foreground'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-description"
    >
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in border border-border">
        {/* Close Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className={`${styles.iconBg} rounded-full p-3`}>
            <AlertTriangle className={`w-12 h-12 ${styles.iconColor}`} strokeWidth={2} />
          </div>
        </div>

        {/* Title */}
        <h2
          id="confirm-modal-title"
          className="text-xl font-bold text-foreground text-center mb-3"
        >
          {title}
        </h2>

        {/* Message */}
        <p
          id="confirm-modal-description"
          className="text-muted-foreground text-center mb-6"
        >
          {message}
        </p>

        {/* Custom Content */}
        {children && <div className="mb-6">{children}</div>}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-input bg-background text-foreground font-medium rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 ${styles.confirmBg} ${styles.confirmText} font-medium rounded-lg transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  )
}
