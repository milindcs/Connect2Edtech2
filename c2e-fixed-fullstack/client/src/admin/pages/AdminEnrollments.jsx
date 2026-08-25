import { useEffect, useState } from 'react'
import { Check, X as XIcon, Trash2, Loader2, ImageOff, AlertCircle, GraduationCap } from 'lucide-react'
import { getEnrollments, updateEnrollmentStatus, deleteEnrollment } from '../../services/enrollment.js'
import { toAbsoluteUrl } from '../../utils/toAbsoluteUrl.js'
import TableControls from '../components/TableControls.jsx'
import { useToast } from '../components/ToastContext.jsx'
import AdminPageHeader from '../components/AdminPageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

function AdminEnrollments() {
  const { toast } = useToast()
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const load = () => {
    setLoading(true)
    getEnrollments({
      status: filter || undefined,
      search: debouncedSearch || undefined,
      page,
      limit: pageSize,
    })
      .then((res) => {
        setEnrollments(res.data || [])
        setTotalPages(res.pages || 1)
        setError('')
      })
      .catch(() => setError('Could not load enrollments.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, pageSize, filter])

  const handleStatus = async (id, status) => {
    try {
      await updateEnrollmentStatus(id, status)
      setEnrollments((prev) => prev.map((e) => (e._id === id ? { ...e, status } : e)))
      toast(`Enrollment marked as ${status}.`, { type: 'success', title: 'Status updated' })
    } catch {
      toast('Failed to update enrollment status.', { type: 'error', title: 'Error' })
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enrollment?')) return
    try {
      await deleteEnrollment(id)
      setEnrollments((prev) => prev.filter((e) => e._id !== id))
      toast('Enrollment deleted.', { type: 'success', title: 'Deleted' })
    } catch {
      toast('Failed to delete enrollment.', { type: 'error', title: 'Error' })
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <AdminPageHeader
        title="Enrollments"
        subtitle="Course enrollment requests submitted via the website."
        icon={GraduationCap}
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
            <option value="Enrolled">Enrolled</option>
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
        exportData={enrollments.map((e) => ({
          fullName: e.fullName,
          email: e.email,
          phone: e.phone,
          course: e.courseTitle,
          status: e.status,
        }))}
        exportFilename="enrollments"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        {loading ? (
          <div className="p-6 sm:p-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-6 sm:p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-muted" />
            <p className="text-xs sm:text-sm text-gray-muted">No enrollments match your search.</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden flex flex-col gap-2.5 sm:gap-3 p-2.5 sm:p-3">
              {enrollments.map((enr) => (
                <div key={enr._id} className="bg-white rounded-xl border border-black/5 p-3 flex flex-col gap-2.5">
                  <div className="flex items-start gap-2.5">
                    {enr.courseImage ? (
                      <img
                        src={toAbsoluteUrl(enr.courseImage)}
                        alt={enr.courseTitle}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-black/5 flex items-center justify-center text-gray-muted flex-shrink-0">
                        <ImageOff className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <p className="font-semibold text-black text-xs truncate">{enr.fullName}</p>
                        <StatusBadge status={enr.status} variant={enr.status.toLowerCase()} />
                      </div>
                      <p className="text-[10px] text-gray-muted truncate">{enr.email}</p>
                      <p className="text-[10px] text-gray-700 truncate">{enr.courseTitle}</p>
                    </div>
                  </div>
                  {enr.message && (
                    <p className="text-[11px] text-gray-600 line-clamp-2">{enr.message}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1 border-t border-black/5">
                    <button
                      onClick={() => handleStatus(enr._id, 'Enrolled')}
                      className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" /> Enroll
                    </button>
                    <button
                      onClick={() => handleStatus(enr._id, 'Rejected')}
                      className="flex-1 flex items-center justify-center gap-1 text-[11px] font-medium py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    >
                      <XIcon className="w-3.5 h-3.5" /> Reject
                    </button>
                    <button
                      onClick={() => handleDelete(enr._id)}
                      className="flex items-center justify-center p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] sm:text-xs uppercase tracking-wider text-gray-muted border-b border-black/5">
                    <th className="p-2.5 sm:p-3">Course</th>
                    <th className="p-2.5 sm:p-3">Student</th>
                    <th className="p-2.5 sm:p-3">Contact</th>
                    <th className="p-2.5 sm:p-3">Status</th>
                    <th className="p-2.5 sm:p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((enr) => (
                    <tr key={enr._id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                      <td className="p-2.5 sm:p-3">
                        <div className="flex items-center gap-2.5">
                          {enr.courseImage ? (
                            <img
                              src={toAbsoluteUrl(enr.courseImage)}
                              alt={enr.courseTitle}
                              className="w-10 h-10 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-black/5 flex items-center justify-center text-gray-muted">
                              <ImageOff className="w-4 h-4" />
                            </div>
                          )}
                          <span className="font-medium text-black text-xs sm:text-sm max-w-[160px] truncate">{enr.courseTitle}</span>
                        </div>
                      </td>
                      <td className="p-2.5 sm:p-3 font-medium text-black text-xs sm:text-sm">{enr.fullName}</td>
                      <td className="p-2.5 sm:p-3 text-gray-muted text-xs">
                        <p className="truncate max-w-[180px]">{enr.email}</p>
                        <p className="truncate max-w-[120px]">{enr.phone}</p>
                      </td>
                      <td className="p-2.5 sm:p-3">
                        <StatusBadge status={enr.status} variant={enr.status.toLowerCase()} />
                      </td>
                      <td className="p-2.5 sm:p-3">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <button
                            onClick={() => handleStatus(enr._id, 'Enrolled')}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-emerald-50 text-gray-muted hover:text-emerald-600 transition-colors"
                            aria-label="Enroll"
                            title="Mark enrolled"
                          >
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleStatus(enr._id, 'Rejected')}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 text-gray-muted hover:text-red-500 transition-colors"
                            aria-label="Reject"
                            title="Reject"
                          >
                            <XIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(enr._id)}
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

export default AdminEnrollments


