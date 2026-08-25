import { useState, useEffect } from 'react'
import { Search, Plus, Filter, Eye, Edit2, Trash2, Loader2, AlertCircle, UserPlus, Phone, Mail, Calendar, MapPin } from 'lucide-react'
import { getMentorApplications, updateMentorApplication } from '../../services/mentor.js'
import AdminPageHeader from '../components/AdminPageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

const STATUS_OPTIONS = ['New', 'Contacted', 'Interested', 'Follow-up', 'Converted', 'Not Interested']

function Leads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedLead, setSelectedLead] = useState(null)

  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = () => {
    setLoading(true)
    getMentorApplications()
      .then((res) => {
        setLeads(res.data || [])
        setLoading(false)
      })
      .catch(() => {
        setError('Failed to load leads')
        setLoading(false)
      })
  }

  const handleStatusChange = (id, newStatus) => {
    updateMentorApplication(id, { status: newStatus })
      .then(() => {
        setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status: newStatus } : l)))
        setSelectedLead(null)
      })
      .catch(() => {})
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = !search || 
      lead.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone?.includes(search)
    const matchesStatus = !statusFilter || lead.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusCounts = STATUS_OPTIONS.reduce((acc, status) => {
    acc[status] = leads.filter((l) => l.status === status).length
    return acc
  }, {})

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-accent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <AlertCircle className="w-8 h-8 text-gray-muted" />
        <p className="text-sm text-gray-muted">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <AdminPageHeader
        title="Lead Management"
        subtitle={`${leads.length} total leads`}
        icon={UserPlus}
        action={
          <button className="flex items-center gap-2 bg-accent text-white text-xs font-semibold uppercase tracking-widest px-4 py-2.5 rounded-full hover:bg-accent/90 transition-colors w-full sm:w-auto">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
            className={`p-3 rounded-xl border text-center transition-all ${
              statusFilter === status ? 'border-accent bg-accent/5' : 'border-black/5 bg-white hover:border-black/10'
            }`}
          >
            <p className="text-lg font-bold text-black">{statusCounts[status] || 0}</p>
            <p className="text-[10px] text-gray-muted truncate">{status}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-muted" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 bg-white text-sm focus:outline-none focus:border-accent"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/5">
              <tr>
                <th className="px-4 py-3 font-semibold text-black">Name</th>
                <th className="px-4 py-3 font-semibold text-black hidden sm:table-cell">Contact</th>
                <th className="px-4 py-3 font-semibold text-black hidden md:table-cell">Department</th>
                <th className="px-4 py-3 font-semibold text-black">Status</th>
                <th className="px-4 py-3 font-semibold text-black hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredLeads.map((lead) => (
                <tr key={lead._id} className="hover:bg-black/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {(lead.fullName || '?').charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-black truncate">{lead.fullName}</p>
                        <p className="text-[10px] text-gray-muted truncate sm:hidden">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-black flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                      <span className="text-xs text-gray-muted flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-xs text-gray-muted">{lead.department}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={lead.status || 'New'} variant={(lead.status || 'New').toLowerCase()} />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-muted">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedLead(lead)}
                        className="p-1.5 rounded-lg text-gray-muted hover:text-accent hover:bg-accent/10 transition-colors"
                        aria-label="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-muted hover:text-accent hover:bg-accent/10 transition-colors" aria-label="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-muted">
                    No leads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-black mb-4">Lead Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center text-lg font-bold">
                  {(selectedLead.fullName || '?').charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-black">{selectedLead.fullName}</p>
                  <p className="text-xs text-gray-muted">{selectedLead.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-muted"><Phone className="w-4 h-4" /> {selectedLead.phone}</div>
                <div className="flex items-center gap-2 text-gray-muted"><MapPin className="w-4 h-4" /> {selectedLead.department}</div>
                <div className="flex items-center gap-2 text-gray-muted"><Calendar className="w-4 h-4" /> {new Date(selectedLead.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-black mb-2 block">Update Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedLead._id, status)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        selectedLead.status === status
                          ? 'bg-accent text-white'
                          : 'bg-black/5 text-gray-600 hover:bg-black/10'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedLead(null)}
              className="mt-6 w-full py-2.5 rounded-xl bg-black/5 text-sm font-semibold text-black hover:bg-black/10 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leads
