import { useEffect, useState } from 'react'
import { Trash2, Loader2, Mail, Phone, AlertCircle, MessageSquare } from 'lucide-react'
import { getContacts, deleteContact } from '../../services/contact.js'
import TableControls from '../components/TableControls.jsx'
import { useToast } from '../components/ToastContext.jsx'
import AdminPageHeader from '../components/AdminPageHeader.jsx'

function AdminContacts() {
  const { toast } = useToast()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  const loadContacts = () => {
    setLoading(true)
    getContacts({ search: debouncedSearch, page, limit: pageSize })
      .then((res) => {
        setContacts(res.data || [])
        setTotalPages(res.pages || 1)
        setError('')
      })
      .catch(() => setError('Could not load contact requests.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadContacts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, pageSize])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact request?')) return
    try {
      await deleteContact(id)
      setContacts((prev) => prev.filter((c) => c._id !== id))
      toast('Contact request deleted.', { type: 'success', title: 'Deleted' })
    } catch {
      toast('Failed to delete contact request.', { type: 'error', title: 'Error' })
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <AdminPageHeader
        title="Contact Requests"
        subtitle="Messages submitted through the Contact Us form."
        icon={MessageSquare}
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
        exportData={contacts.map((c) => ({
          name: c.name,
          email: c.email,
          phone: c.phone,
          interestedCourse: c.interestedCourse || '',
          message: c.message,
        }))}
        exportFilename="contacts"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        {loading ? (
          <div className="p-6 sm:p-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-6 sm:p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-muted" />
            <p className="text-xs sm:text-sm text-gray-muted">No contact requests match your search.</p>
          </div>
        ) : (
          <>
            <div className="sm:hidden flex flex-col gap-2.5 sm:gap-3 p-2.5 sm:p-3">
              {contacts.map((c) => (
                <div key={c._id} className="bg-white rounded-xl border border-black/5 p-3 flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <p className="font-semibold text-black text-xs truncate">{c.name}</p>
                        {c.interestedCourse && (
                          <span className="text-[10px] font-semibold text-accent bg-pink/10 px-1.5 py-0.5 rounded-full truncate">
                            {c.interestedCourse}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-gray-muted flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5" /> {c.email}
                        </span>
                        <span className="text-[10px] text-gray-muted flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" /> {c.phone}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-muted hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-600 line-clamp-2">{c.message}</p>
                  <p className="text-[10px] text-gray-muted pt-1 border-t border-black/5">
                    {new Date(c.createdDate).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] sm:text-xs uppercase tracking-wider text-gray-muted border-b border-black/5">
                    <th className="p-2.5 sm:p-3">Name</th>
                    <th className="p-2.5 sm:p-3">Contact</th>
                    <th className="p-2.5 sm:p-3">Course Interest</th>
                    <th className="p-2.5 sm:p-3">Message</th>
                    <th className="p-2.5 sm:p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                      <td className="p-2.5 sm:p-3">
                        <p className="font-medium text-black text-xs sm:text-sm">{c.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-muted">{new Date(c.createdDate).toLocaleDateString()}</p>
                      </td>
                      <td className="p-2.5 sm:p-3 text-gray-muted text-xs">
                        <p className="truncate max-w-[180px]">{c.email}</p>
                        <p className="truncate max-w-[120px]">{c.phone}</p>
                      </td>
                      <td className="p-2.5 sm:p-3">
                        {c.interestedCourse ? (
                          <span className="text-[10px] sm:text-xs font-medium text-accent">{c.interestedCourse}</span>
                        ) : (
                          <span className="text-[10px] sm:text-xs text-gray-muted">—</span>
                        )}
                      </td>
                      <td className="p-2.5 sm:p-3 text-gray-600 text-xs max-w-xs truncate">{c.message}</td>
                      <td className="p-2.5 sm:p-3">
                        <div className="flex items-center justify-end">
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 text-gray-muted hover:text-red-500 transition-colors"
                            aria-label="Delete"
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

export default AdminContacts


