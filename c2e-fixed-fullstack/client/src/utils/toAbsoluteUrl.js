// Resolves a backend-relative upload path (e.g. "/uploads/gallery/foo.jpg")
// into an absolute URL pointing at the API's origin, so images load
// correctly regardless of which host serves the frontend.
export function toAbsoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return ''
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const apiBase = import.meta.env.DEV
    ? '/api'
    : (import.meta.env.VITE_API_URL || '/api')
  const origin = apiBase.replace(/\/api\/?$/, '')
  return `${origin}${pathOrUrl}`
}

export default toAbsoluteUrl
