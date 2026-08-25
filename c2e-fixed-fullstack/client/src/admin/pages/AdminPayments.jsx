import { useState } from 'react'
import { Search, DollarSign, TrendingUp, CreditCard, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react'
import AdminPageHeader from '../components/AdminPageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

const MOCK_PAYMENTS = [
  { _id: '1', studentName: 'Rahul Sharma', courseTitle: 'Full Stack Development', amount: 4999, method: 'UPI', date: '2026-08-20', status: 'Paid' },
  { _id: '2', studentName: 'Priya Patel', courseTitle: 'Data Science', amount: 5999, method: 'Card', date: '2026-08-19', status: 'Pending' },
  { _id: '3', studentName: 'Amit Kumar', courseTitle: 'Cloud Computing', amount: 3999, method: 'UPI', date: '2026-08-18', status: 'Paid' },
  { _id: '4', studentName: 'Sneha Reddy', courseTitle: 'Machine Learning', amount: 6999, method: 'Net Banking', date: '2026-08-17', status: 'Failed' },
  { _id: '5', studentName: 'Vikram Singh', courseTitle: 'Cyber Security', amount: 4499, method: 'UPI', date: '2026-08-16', status: 'Refunded' },
  { _id: '6', studentName: 'Anita Desai', courseTitle: 'DevOps', amount: 5499, method: 'Card', date: '2026-08-15', status: 'Paid' },
]

function Payments() {
  const [payments] = useState(MOCK_PAYMENTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filteredPayments = payments.filter((p) => {
    const matchesSearch = !search ||
      p.studentName?.toLowerCase().includes(search.toLowerCase()) ||
      p.courseTitle?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = payments.filter((p) => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter((p) => p.status === 'Pending').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <AdminPageHeader
        title="Payment Management"
        subtitle={`${payments.length} transactions`}
        icon={CreditCard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-muted uppercase tracking-wide">Total Revenue</p>
              <p className="text-xl font-bold text-black">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-muted uppercase tracking-wide">Pending</p>
              <p className="text-xl font-bold text-black">₹{pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-black/5 p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-muted uppercase tracking-wide">Transactions</p>
              <p className="text-xl font-bold text-black">{payments.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-muted" />
          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:border-accent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:border-accent"
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">Student</th>
                <th className="px-4 py-3 font-semibold text-black hidden sm:table-cell">Course</th>
                <th className="px-4 py-3 font-semibold text-black">Amount</th>
                <th className="px-4 py-3 font-semibold text-black hidden md:table-cell">Method</th>
                <th className="px-4 py-3 font-semibold text-black hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 font-semibold text-black">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(payment.studentName || '?').charAt(0)}
                      </div>
                      <span className="font-medium text-black">{payment.studentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-xs text-gray-muted">{payment.courseTitle}</td>
                  <td className="px-4 py-3 font-semibold text-black">₹{payment.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-muted">{payment.method}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-muted">{payment.date}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={payment.status} variant={payment.status.toLowerCase()} />
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-muted">No payments found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments
