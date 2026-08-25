import { useState } from 'react'
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle, UserRound } from 'lucide-react'
import { useUserAuth } from '../context/UserAuthContext.jsx'
import { fadeUp } from '../utils/animationVariants'

function UserLogin() {
  const { login, isAuthenticated } = useUserAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/'
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(location.state?.from?.pathname || '/', { replace: true })
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center px-5">
      <motion.div
        variants={fadeUp}
        className="w-full max-w-sm bg-white rounded-3xl p-8 flex flex-col gap-6 shadow-2xl border border-slate-100"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <UserRound className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-black text-lg font-bold uppercase tracking-widest">Sign In</h1>
          <p className="text-black/60 text-xs">Welcome back to Connect2EdTech</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-widest text-black/70 mb-1 block">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-black/70 mb-1 block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-sm text-black placeholder:text-black/30 focus:outline-none focus:border-accent"
            />
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full bg-[#f0247a] text-white text-xs font-semibold uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-[#c41d63] transition-colors disabled:opacity-60"
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

        <p className="text-center text-[11px] text-black/50">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-[#f0247a] font-semibold hover:underline">
            Create one
          </Link>
        </p>

        <Link to="/" className="text-center text-[11px] text-black/40 hover:text-black/70 transition-colors">
          ← Back to website
        </Link>
      </motion.div>
    </div>
  )
}

export default UserLogin

