import axios from 'axios'

// In dev, use a relative base path so Vite proxies /api to the backend.
// In prod, fall back to VITE_API_URL (absolute URL) or the default.
const baseURL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || '/api')

const api = axios.create({ baseURL })

// Attach JWT tokens to outgoing requests based on endpoint type
api.interceptors.request.use((config) => {
  const url = config.url || ''

  // User-facing auth routes use c2e_user_token
  if (url.startsWith('/auth/user/')) {
    const token = localStorage.getItem('c2e_user_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }

  // Admin/auth routes use c2e_admin_token
  const token = localStorage.getItem('c2e_admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Centralised handling of expired/invalid tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const url = error.config?.url || ''

      if (url.startsWith('/auth/user/')) {
        localStorage.removeItem('c2e_user_token')
        localStorage.removeItem('c2e_user_info')
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
      } else if (url.startsWith('/auth/') || url.startsWith('/dashboard') || url.startsWith('/admin')) {
        localStorage.removeItem('c2e_admin_token')
        localStorage.removeItem('c2e_admin_info')
        if (!window.location.pathname.startsWith('/admin/login')) {
          window.location.href = '/admin/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

