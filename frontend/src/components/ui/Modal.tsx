import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md'
}

export function Modal({ open, title, description, onClose, children, footer, size = 'md' }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      dialog.showModal()
      // showModal() foca o primeiro elemento focável (o botão fechar); preferimos o primeiro campo.
      dialog.querySelector<HTMLElement>('.modal__body :is(input, select, textarea)')?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className={`modal modal--${size}`}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-labelledby="modal-title"
    >
      {open && (
        <div className="modal__content">
          <header className="modal__header">
            <div>
              <h2 id="modal-title">{title}</h2>
              {description && <p>{description}</p>}
            </div>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
              <X size={18} />
            </button>
          </header>
          <div className="modal__body">{children}</div>
          {footer && <footer className="modal__footer">{footer}</footer>}
        </div>
      )}
    </dialog>
  )
}
