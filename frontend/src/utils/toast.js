export function showToast(message, type = 'success') {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent('campuskart:toast', {
    detail: { message: String(message || ''), type }
  }))
}
