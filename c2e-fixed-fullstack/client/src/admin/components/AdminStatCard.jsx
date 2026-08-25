import { Link } from 'react-router-dom'

// Accent variants tint the icon chip and the value colour.
const ACCENT_VARIANTS = {
  accent: { chip: 'bg-accent/10 text-accent', value: 'text-accent' },
  emerald: { chip: 'bg-emerald-500/10 text-emerald-500', value: 'text-emerald-500' },
  pink: { chip: 'bg-pink/10 text-pink', value: 'text-pink' },
  amber: { chip: 'bg-amber-500/10 text-amber-500', value: 'text-amber-500' },
  blue: { chip: 'bg-blue-500/10 text-blue-500', value: 'text-blue-500' },
  violet: { chip: 'bg-violet-500/10 text-violet-500', value: 'text-violet-500' },
}

function AdminStatCard({
  label,
  value,
  icon: Icon,
  accent = 'accent',
  to = null,
  hint = '',
  trend = null,
}) {
  const variant = ACCENT_VARIANTS[accent] || ACCENT_VARIANTS.accent

  const content = (
    <div className="group bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-black/5 flex items-center gap-3 h-full transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-black/10">
      <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${variant.chip}`}>
        {Icon && <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
      </div>
      <div className="min-w-0 flex flex-col">
        <p className="text-[10px] sm:text-xs font-bold text-black leading-none truncate">{value}</p>
        <p className="text-[9px] sm:text-[10px] text-gray-muted mt-1 truncate">{label}</p>
        {hint && <p className="text-[8px] sm:text-[10px] text-black/40 mt-0.5 truncate">{hint}</p>}
        {trend != null && (
          <p className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block h-full">
        {content}
      </Link>
    )
  }

  return content
}

export default AdminStatCard
