import React, { useEffect, useState } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const styles = {
  success: { icon: FaCheckCircle, tone: 'border-emerald-200 bg-white text-emerald-950 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-100', iconTone: 'text-emerald-500' },
  error: { icon: FaExclamationCircle, tone: 'border-rose-200 bg-white text-rose-950 dark:border-rose-800 dark:bg-slate-900 dark:text-rose-100', iconTone: 'text-rose-500' },
  info: { icon: FaInfoCircle, tone: 'border-indigo-200 bg-white text-slate-900 dark:border-indigo-800 dark:bg-slate-900 dark:text-slate-100', iconTone: 'text-indigo-500' }
}

function ToastViewport() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const onToast = (event) => {
      const toast = { id: Date.now() + Math.random(), message: event.detail?.message || '', type: styles[event.detail?.type] ? event.detail.type : 'info' }
      setToasts(previous => [...previous.slice(-2), toast])
      window.setTimeout(() => setToasts(previous => previous.filter(item => item.id !== toast.id)), 4200)
    }
    window.addEventListener('campuskart:toast', onToast)
    return () => window.removeEventListener('campuskart:toast', onToast)
  }, [])

  return (
    <div aria-live="polite" aria-atomic="false" className="pointer-events-none fixed right-3 top-3 sm:right-5 sm:top-5 z-[100] flex w-[calc(100%-1.5rem)] max-w-sm flex-col gap-3">
      {toasts.map(toast => {
        const style = styles[toast.type]
        const Icon = style.icon
        return (
          <div key={toast.id} role={toast.type === 'error' ? 'alert' : 'status'} className={`campuskart-toast pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-2xl shadow-slate-950/10 backdrop-blur-xl ${style.tone}`}>
            <Icon className={`mt-0.5 shrink-0 text-lg ${style.iconTone}`} />
            <p className="min-w-0 flex-1 text-sm font-semibold leading-relaxed">{toast.message}</p>
            <button type="button" aria-label="Dismiss notification" onClick={() => setToasts(previous => previous.filter(item => item.id !== toast.id))} className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-white">
              <FaTimes />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default ToastViewport
