import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X, XCircle } from 'lucide-react'
import { ToastContext, type ToastVariant } from './toast-context'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

const ICONS = { success: CheckCircle2, error: XCircle, info: Info }
let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((atuais) => atuais.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, variant: ToastVariant = 'success') => {
      const id = ++nextId
      setToasts((atuais) => [...atuais, { id, message, variant }])
      window.setTimeout(() => dismiss(id), 4500)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ notify }), [notify])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="region" aria-live="polite" aria-label="Notificações">
        {toasts.map(({ id, message, variant }) => {
          const Icon = ICONS[variant]
          return (
            <div key={id} className={`toast toast--${variant}`} role="status">
              <Icon size={18} aria-hidden />
              <span>{message}</span>
              <button type="button" className="toast__close" onClick={() => dismiss(id)} aria-label="Fechar">
                <X size={16} />
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}
