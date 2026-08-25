import { useEffect, useState } from 'react'
import { Download, Check, X as XIcon, Trash2, Loader2, AlertCircle, ChevronDown, ChevronUp, UserPlus } from 'lucide-react'
import {
  getMentorApplications,
  updateMentorApplicationStatus,
  deleteMentorApplication,
  downloadResume,
} from '../../services/mentor.js'
import TableControls from '../components/TableControls.jsx'
import { useToast } from '../components/ToastContext.jsx'
import AdminPageHeader from '../components/AdminPageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

function AdminMentorApplications() {
  const { toast } = useToast()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const load = () => {
    setLoading(true)
    getMentorApplications({
      status: filter || undefined,
      search: debouncedSearch || undefined,
      page,
      limit: pageSize,
    })
      .then((res) => {
        setApplications(res.data || [])
        setTotalPages(res.pages || 1)
        setError('')
      })
      .catch(() => setError('Could not load mentor applications.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, pageSize, filter])

  const handleStatus = async (id, status) => {
    try {
      await updateMentorApplicationStatus(id, status)
      setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)))
      toast(`Application marked as ${status}.`, { type: 'success', title: 'Status updated' })
    } catch {
      toast('Failed to update application status.', { type: 'error', title: 'Error' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this mentor application?')) return
    try {
      await deleteMentorApplication(id)
      setApplications((prev) => prev.filter((a) => a._id !== id))
      toast('Application deleted.', { type: 'success', title: 'Deleted' })
    } catch {
      toast('Failed to delete application.', { type: 'error', title: 'Error' })
    }
  }

  const handleDownload = async (app) => {
    try {
      await downloadResume(app._id, app.resumeOriginalName || `${app.fullName}-resume`)
      toast('Resume download started.', { type: 'success', title: 'Downloading' })
    } catch {
      toast('Failed to download resume.', { type: 'error', title: 'Error' })
    }
  }

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <AdminPageHeader
        title="Mentor Applications"
        subtitle="Applications submitted via “Become a Trainer”."
        icon={UserPlus}
        action={
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value)
              setPage(1)
            }}
            className="rounded-full border border-black/10 px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-gray-muted focus:outline-none w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        }
      />

      {error && <p className="text-[11px] sm:text-xs text-red-500">{error}</p>}

      <TableControls
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        page={page}
        pages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
        loading={loading}
        exportData={applications.map((a) => ({
          fullName: a.fullName,
          email: a.email,
          phone: a.phone,
          designation: a.currentDesignation,
          company: a.currentCompany,
          yearsOfExperience: a.yearsOfExperience,
          status: a.status,
        }))}
        exportFilename="mentor-applications"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        {loading ? (
          <div className="p-6 sm:p-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          </div>
        ) : applications.length === 0 ? (
          <div className="p-6 sm:p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-muted" />
            <p className="text-xs sm:text-sm text-gray-muted">No mentor applications match your search.</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden flex flex-col gap-2.5 sm:gap-3 p-2.5 sm:p-3">
              {applications.map((app) => (
                <div key={app._id} className="bg-white rounded-xl border border-black/5 overflow-hidden">
                  <div className="p-3 flex flex-col gap-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <p className="font-semibold text-black text-xs truncate">{app.fullName}</p>
                          <StatusBadge status={app.status} variant={app.status.toLowerCase()} />
                        </div>
                        <p className="text-[10px] text-gray-muted truncate">{app.email} · {app.phone}</p>
                        <p className="text-[10px] text-gray-muted truncate">{app.currentDesignation} at {app.currentCompany} · {app.yearsOfExperience} yrs</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpand(app._id)}
                      className="flex items-center justify-center gap-1 text-[10px] font-medium text-gray-muted py-1.5 rounded-lg hover:bg-black/5 transition-colors"
                    >
                      {expandedId === app._id ? (
                        <>Less <ChevronUp className="w-3 h-3" /></>
                      ) : (
                        <>More <ChevronDown className="w-3 h-3" /></>
                      )}
                    </button>
                  </div>
                  {expandedId === app._id && (
                    <div className="px-3 pb-3 flex flex-col gap-2 border-t border-black/5 pt-2.5">
                      {app.skills?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-gray-muted uppercase tracking-wider mb-1">Skills</p>
                          <p className="text-[11px] text-gray-700">{app.skills.join(', ')}</p>
                        </div>
                      )}
                      {app.coursesInterested?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-gray-muted uppercase tracking-wider mb-1">Courses</p>
                          <p className="text-[11px] text-gray-700">{app.coursesInterested.join(', ')}</p>
                        </div>
                      )}
                      {app.availability?.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-gray-muted uppercase tracking-wider mb-1">Availability</p>
                          <p className="text-[11px] text-gray-700">{app.availability.join(', ')}</p>
                        </div>
                      )}
                      {app.motivation && (
                        <div>
                          <p className="text-[10px] font-semibold text-gray-muted uppercase tracking-wider mb-1">Motivation</p>
                          <p className="text-[11px] text-gray-700 line-clamp-3">{app.motivation}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-2 border-t border-black/5">
                        <button
                          onClick={() => handleDownload(app)}
                          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium py-2 rounded-lg bg-black/5 hover:bg-black/10 text-black transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" /> Resume
                        </button>
                        <button
                          onClick={() => handleStatus(app._id, 'Accepted')}
                          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" /> Accept
                        </button>
                        <button
                          onClick={() => handleStatus(app._id, 'Rejected')}
                          className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <XIcon className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="flex items-center justify-center p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] sm:text-xs uppercase tracking-wider text-gray-muted border-b border-black/5">
                    <th className="p-2.5 sm:p-3">Applicant</th>
                    <th className="p-2.5 sm:p-3">Contact</th>
                    <th className="p-2.5 sm:p-3">Experience</th>
                    <th className="p-2.5 sm:p-3">Status</th>
                    <th className="p-2.5 sm:p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                      <td className="p-2.5 sm:p-3">
                        <p className="font-medium text-black text-xs sm:text-sm">{app.fullName}</p>
                        <p className="text-[10px] sm:text-xs text-gray-muted">{app.currentDesignation}</p>
                      </td>
                      <td className="p-2.5 sm:p-3 text-gray-muted text-xs">
                        <p className="truncate max-w-[180px]">{app.email}</p>
                        <p className="truncate max-w-[120px]">{app.phone}</p>
                      </td>
                      <td className="p-2.5 sm:p-3 text-xs text-gray-600">
                        <p className="truncate max-w-[140px]">{app.currentCompany}</p>
                        <p className="text-gray-muted">{app.yearsOfExperience} yrs</p>
                      </td>
                      <td className="p-2.5 sm:p-3">
                        <StatusBadge status={app.status} variant={app.status.toLowerCase()} />
                      </td>
                      <td className="p-2.5 sm:p-3">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handleDownload(app)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-black/5 text-gray-muted hover:text-black transition-colors"
                            aria-label="Download resume"
                            title="Download resume"
                          >
                            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleStatus(app._id, 'Accepted')}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-emerald-50 text-gray-muted hover:text-emerald-600 transition-colors"
                            aria-label="Accept"
                            title="Accept"
                          >
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleStatus(app._id, 'Rejected')}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 text-gray-muted hover:text-red-500 transition-colors"
                            aria-label="Reject"
                            title="Reject"
                          >
                            <XIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 text-gray-muted hover:text-red-500 transition-colors"
                            aria-label="Delete"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminMentorApplications


