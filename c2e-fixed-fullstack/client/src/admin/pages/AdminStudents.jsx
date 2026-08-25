import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { Loader2, Search, Trash2, Mail, Phone, Calendar, Users } from 'lucide-react'
import { getAdminUsers, deleteAdminUser } from '../../services/admin.js'
import TableControls from '../components/TableControls.jsx'
import { useToast } from '../components/ToastContext.jsx'
import { fadeUp } from '../../utils/animationVariants'
import AdminPageHeader from '../components/AdminPageHeader.jsx'

function AdminStudents() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const fetchUsers = useCallback(async () => {
    setStatus('loading')
    try {
      const res = await getAdminUsers({ search, page, limit: pageSize })
      setUsers(res.data)
      setPages(res.pages)
      setStatus('success')
    } catch {
      toast('Failed to load students', { type: 'error' })
      setStatus('error')
    }
  }, [search, page, pageSize, toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete student "${user.name}"? This cannot be undone.`)) return
    try {
      await deleteAdminUser(user._id)
      toast('Student deleted', { type: 'success' })
      fetchUsers()
    } catch {
      toast('Failed to delete student', { type: 'error' })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="Student Management"
        subtitle="View and manage registered students."
        icon={Users}
      />

      <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-black/5">
          <TableControls
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1) }}
            page={page}
            pages={pages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(v) => { setPageSize(v); setPage(1) }}
            loading={status === 'loading'}
          />
        </div>

        {status === 'loading' && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
          </div>
        )}

        {status === 'success' && users.length === 0 && (
          <p className="text-center py-16 text-sm text-gray-muted">No students found.</p>
        )}

        {status === 'success' && users.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.02] text-left text-gray-muted uppercase tracking-wider text-[10px]">
                    <th className="px-5 py-3 font-semibold">Student</th>
                    <th className="px-5 py-3 font-semibold">Contact</th>
                    <th className="px-5 py-3 font-semibold">Registered</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <motion.tr
                      key={user._id}
                      variants={fadeUp}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      viewport={{ once: true }}
                      className="border-b border-black/5 last:border-0 hover:bg-black/[0.015] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {(user.name || '?').charAt(0)}
                          </div>
                          <span className="font-semibold text-black truncate">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-gray-muted"><Mail className="w-3 h-3" /> {user.email}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-muted">
                        <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          onClick={() => handleDelete(user)}
                          className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-2.5 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors"
                          aria-label="Delete student"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-3 p-4">
              {users.map((user) => (
                <div key={user._id} className="rounded-xl border border-black/5 p-3 flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {(user.name || '?').charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-black truncate">{user.name}</p>
                      <p className="text-[11px] text-gray-muted truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDelete(user)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1 text-[10px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminStudents

