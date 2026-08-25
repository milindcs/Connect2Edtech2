import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, ImageOff, AlertCircle, BookOpen } from 'lucide-react'
import {
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  setCourseStatus,
} from '../../services/courses.js'
import { DEPARTMENTS } from '../../constants/departments.js'
import { toAbsoluteUrl } from '../../utils/toAbsoluteUrl.js'
import TableControls from '../components/TableControls.jsx'
import { useToast } from '../components/ToastContext.jsx'
import AdminPageHeader from '../components/AdminPageHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

const departmentCategory = (department) => (department === 'Non-Technical' ? 'non-technical' : 'technical')

const CATEGORY_TABS = [
  { key: 'all', label: 'All Courses' },
  { key: 'technical', label: 'Technical' },
  { key: 'non-technical', label: 'Non-Technical' },
]

const emptyForm = {
  title: '',
  department: DEPARTMENTS[0].value,
  category: departmentCategory(DEPARTMENTS[0].value),
  description: '',
  status: 'Active',
}

function AdminCourses() {
  const { toast } = useToast()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [categoryCounts, setCategoryCounts] = useState({ all: 0, technical: 0, 'non-technical': 0 })

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchTerm])

  const loadCourses = () => {
    setLoading(true)
    const params = { search: debouncedSearch, page, limit: pageSize }
    if (activeCategory !== 'all') {
      params.category = activeCategory
    }
    getAllCoursesAdmin(params)
      .then((res) => {
        setCourses(res.data || [])
        setTotalPages(res.pages || 1)
        setError('')
      })
      .catch(() => setError('Could not load courses.'))
      .finally(() => setLoading(false))
  }

  const loadCategoryCounts = () => {
    Promise.all([
      getAllCoursesAdmin({ limit: 1 }),
      getAllCoursesAdmin({ category: 'technical', limit: 1 }),
      getAllCoursesAdmin({ category: 'non-technical', limit: 1 }),
    ]).then(([all, tech, nonTech]) => {
      setCategoryCounts({
        all: all.total || 0,
        technical: tech.total || 0,
        'non-technical': nonTech.total || 0,
      })
    }).catch(() => {})
  }

  useEffect(() => {
    loadCourses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, page, pageSize, activeCategory])

  useEffect(() => {
    loadCategoryCounts()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
    setError('')
    setModalOpen(true)
  }

  const openEdit = (course) => {
    setEditingId(course._id)
    setForm({
      title: course.title,
      department: course.department,
      category: course.category,
      description: course.description,
      status: course.status,
    })
    setImageFile(null)
    setError('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = new FormData()
      Object.entries(form).forEach(([k, v]) => data.append(k, v))
      if (imageFile) data.append('image', imageFile)

      if (editingId) {
        await updateCourse(editingId, data)
        toast('Course updated successfully.', { type: 'success', title: 'Updated' })
      } else {
        await createCourse(data)
        toast('Course created successfully.', { type: 'success', title: 'Created' })
      }

      setModalOpen(false)
      loadCourses()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save course.')
      toast(err?.response?.data?.message || 'Failed to save course.', { type: 'error', title: 'Error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course? This cannot be undone.')) return
    try {
      await deleteCourse(id)
      setCourses((prev) => prev.filter((c) => c._id !== id))
      toast('Course deleted.', { type: 'success', title: 'Deleted' })
    } catch {
      toast('Failed to delete course.', { type: 'error', title: 'Error' })
    }
  }

  const handleToggleStatus = async (course) => {
    const next = course.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await setCourseStatus(course._id, next)
      setCourses((prev) => prev.map((c) => (c._id === course._id ? { ...c, status: next } : c)))
      toast(`Course marked as ${next}.`, { type: 'success', title: 'Status updated' })
    } catch {
      toast('Failed to update status.', { type: 'error', title: 'Error' })
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <AdminPageHeader
        title="Courses"
        subtitle="Manage the courses shown on the website."
        icon={BookOpen}
        action={
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-1.5 bg-accent text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 sm:px-4 py-2 sm:py-2.5 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Add Course
          </button>
        }
      />

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveCategory(tab.key)
              setPage(1)
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-all ${
              activeCategory === tab.key
                ? 'bg-accent text-white'
                : 'bg-black/5 text-gray-600 hover:bg-black/10'
            }`}
          >
            {tab.label}
            <span className="ml-1.5 opacity-70">({categoryCounts[tab.key] || 0})</span>
          </button>
        ))}
      </div>

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
        exportData={courses.map((c) => ({
          title: c.title,
          department: c.department,
          category: c.category,
          status: c.status,
        }))}
        exportFilename="courses"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden">
        {loading ? (
          <div className="p-6 sm:p-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-6 sm:p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-muted" />
            <p className="text-xs sm:text-sm text-gray-muted">No courses match your search.</p>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="sm:hidden flex flex-col gap-2.5 sm:gap-3">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl border border-black/5 p-3 sm:p-4 flex flex-col gap-2.5 sm:gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      {course.image ? (
                        <img
                          src={toAbsoluteUrl(course.image)}
                          alt={course.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-black/5 flex items-center justify-center text-gray-muted flex-shrink-0">
                          <ImageOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-black text-xs sm:text-sm truncate">{course.title}</p>
                        <p className="text-[10px] sm:text-xs text-gray-muted">{course.department}</p>
                      </div>
                    </div>
                      <StatusBadge
                        status={course.status}
                        variant={course.status === 'Active' ? 'active' : 'inactive'}
                        onClick={() => handleToggleStatus(course)}
                      />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(course)}
                      className="flex items-center justify-center gap-1 text-[11px] font-medium py-1.5 sm:py-2 rounded-lg bg-black/5 hover:bg-black/10 text-black transition-colors flex-1"
                    >
                      <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="flex items-center justify-center gap-1 text-[11px] font-medium py-1.5 sm:py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors flex-1"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden sm:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] sm:text-xs uppercase tracking-wider text-gray-muted border-b border-black/5">
                    <th className="p-2.5 sm:p-3">Image</th>
                    <th className="p-2.5 sm:p-3">Title</th>
                    <th className="p-2.5 sm:p-3">Department</th>
                    <th className="p-2.5 sm:p-3">Status</th>
                    <th className="p-2.5 sm:p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id} className="border-b border-black/5 last:border-0 hover:bg-black/[0.02] transition-colors">
                      <td className="p-2.5 sm:p-3">
                        {course.image ? (
                          <img
                            src={toAbsoluteUrl(course.image)}
                            alt={course.title}
                            className="w-12 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-black/5 flex items-center justify-center text-gray-muted">
                            <ImageOff className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      <td className="p-2.5 sm:p-3 font-medium text-black max-w-xs truncate">{course.title}</td>
                      <td className="p-2.5 sm:p-3 text-gray-muted">{course.department}</td>
                      <td className="p-2.5 sm:p-3">
                        <StatusBadge
                          status={course.status}
                          variant={course.status === 'Active' ? 'active' : 'inactive'}
                          onClick={() => handleToggleStatus(course)}
                        />
                      </td>
                      <td className="p-2.5 sm:p-3">
                        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                          <button
                            onClick={() => openEdit(course)}
                            className="p-1.5 sm:p-2 rounded-lg hover:bg-black/5 text-gray-muted hover:text-black transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-black">
                {editingId ? 'Edit Course' : 'Add Course'}
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-muted" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3">
              <input
                required
                placeholder="Course Name"
                value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />

              <select
                value={form.department}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    department: e.target.value,
                    category: departmentCategory(e.target.value),
                  }))
                }
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value}>
                    {dept.label}
                  </option>
                ))}
              </select>

              <textarea
                required
                placeholder="Short Description"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />

              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div>
                <label className="text-[10px] sm:text-xs text-gray-muted mb-1 block">Course Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="text-xs"
                />
              </div>

              {error && <p className="text-[11px] sm:text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="mt-1 bg-accent text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest py-2 sm:py-2.5 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : editingId ? 'Save Changes' : 'Add Course'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCourses


