import { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const STYLES = {
  success: {
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-100',
    bg: 'bg-white',
  },
  error: {
    icon: AlertCircle,
    iconColor: 'text-red-500',
    borderColor: 'border-red-100',
    bg: 'bg-white',
  },
  info: {
    icon: Info,
    iconColor: 'text-accent',
    borderColor: 'border-black/5',
    bg: 'bg-white',
  },
}

function ToastItem({ toast, onClose }) {
  const style = STYLES[toast.type] || STYLES.info
  const Icon = style.icon

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-2xl border ${style.borderColor} ${style.bg} shadow-lg px-4 py-3 animate-[slideIn_0.25s_ease]`}
      role="status"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.iconColor}`} />
      <div className="flex-1 min-w-0">
        {toast.title && <p className="text-sm font-semibold text-black">{toast.title}</p>}
        <p className="text-xs text-gray-muted">{toast.message}</p>
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="text-gray-muted hover:text-black transition-colors flex-shrink-0"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (type, message, title = '', duration = 3500) => {
      const id = Date.now() + Math.random().toString(36).slice(2, 7)
      setToasts((prev) => [...prev, { id, type, message, title }])
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss]
  )

  const toast = useCallback(
    (message, opts = {}) => {
      const { type = 'info', title = '', duration } = opts
      return push(type, message, title, duration)
    },
    [push]
  )

  const value = { toast }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider


