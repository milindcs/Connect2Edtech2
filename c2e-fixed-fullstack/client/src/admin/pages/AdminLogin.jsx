import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { Loader2, AlertCircle, LockKeyhole } from 'lucide-react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'

function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/admin/dashboard'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-rich-black flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-[#141414] rounded-3xl p-8 flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <LockKeyhole className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-white text-lg font-bold uppercase tracking-widest">Admin Login</h1>
          <p className="text-white/50 text-xs">Connect2Edtech Administrator Access</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/60 mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@connect2edtech.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-white/60 mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent"
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-pink text-white text-xs font-semibold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-pink/90 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <Link to="/" className="text-center text-[11px] text-white/40 hover:text-white/70 transition-colors">
          ← Back to website
        </Link>
      </div>
    </div>
  )
}

export default AdminLogin

