// Reusable status pill. Pass `variant` to force a colour, otherwise the
// status string (lower-cased) is used as the key. Set `onClick` to render
// a clickable badge (e.g. a status toggle).
const STATUS_VARIANTS = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-gray-200 text-gray-600',
  pending: 'bg-amber-100 text-amber-700',
  enrolled: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-600',
  accepted: 'bg-emerald-100 text-emerald-700',
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  interested: 'bg-green-100 text-green-700',
  'follow-up': 'bg-orange-100 text-orange-700',
  converted: 'bg-emerald-100 text-emerald-700',
  'not interested': 'bg-red-100 text-red-700',
  paid: 'bg-emerald-100 text-emerald-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
  default: 'bg-gray-100 text-gray-600',
};

function StatusBadge({ status, variant, onClick, className = '' }) {
  const key = variant || String(status || '').toLowerCase();
  const cls = STATUS_VARIANTS[key] || STATUS_VARIANTS.default;
  const base = `inline-flex items-center text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide px-2 sm:px-3 py-0.5 sm:py-1 rounded-full ${cls} ${className}`;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${base} transition-colors`}>
        {status}
      </button>
    );
  }
  return <span className={base}>{status}</span>;
}

export default StatusBadge;
