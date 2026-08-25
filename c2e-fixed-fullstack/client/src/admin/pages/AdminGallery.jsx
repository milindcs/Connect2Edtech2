import { useEffect, useState, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, ImageOff, AlertCircle, GripVertical, Images } from 'lucide-react'
import {
  getGalleryImages,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  reorderGalleryImages,
} from '../../services/gallery.js'
import { toAbsoluteUrl } from '../../utils/toAbsoluteUrl.js'
import { useToast } from '../components/ToastContext.jsx'
import AdminPageHeader from '../components/AdminPageHeader.jsx'

const emptyForm = { title: '', description: '' }

function AdminGallery() {
  const { toast } = useToast()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [listError, setListError] = useState('')
  const [reordering, setReordering] = useState(false)

  const dragIndex = useRef(null)

  const loadImages = () => {
    setLoading(true)
    setListError('')
    getGalleryImages()
      .then((res) => setImages(res.data || []))
      .catch(() => setListError('Could not load gallery images.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadImages()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setImageFile(null)
    setPreviewUrl('')
    setError('')
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setForm({ title: item.title, description: item.description || '' })
    setImageFile(null)
    setPreviewUrl(toAbsoluteUrl(item.image))
    setError('')
    setModalOpen(true)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) setPreviewUrl(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!editingId && !imageFile) {
      setError('Please choose an image to upload.')
      return
    }

    setSaving(true)
    setError('')
    try {
      const data = new FormData()
      data.append('title', form.title)
      data.append('description', form.description)
      if (imageFile) data.append('image', imageFile)

      if (editingId) {
        await updateGalleryImage(editingId, data)
        toast('Gallery image updated.', { type: 'success', title: 'Updated' })
      } else {
        await createGalleryImage(data)
        toast('Gallery image added.', { type: 'success', title: 'Added' })
      }

      setModalOpen(false)
      loadImages()
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save gallery image.')
      toast(err?.response?.data?.message || 'Failed to save gallery image.', { type: 'error', title: 'Error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gallery image? This cannot be undone.')) return
    try {
      await deleteGalleryImage(id)
      setImages((prev) => prev.filter((img) => img._id !== id))
      toast('Gallery image deleted.', { type: 'success', title: 'Deleted' })
    } catch {
      toast('Failed to delete gallery image.', { type: 'error', title: 'Error' })
    }
  }

  // --- Drag-and-drop reorder -------------------------------------------
  const handleDragStart = (index) => {
    dragIndex.current = index
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === index) return

    setImages((prev) => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex.current, 1)
      next.splice(index, 0, moved)
      dragIndex.current = index
      return next
    })
  }

  const handleDragEnd = async () => {
    dragIndex.current = null
    setReordering(true)
    try {
      await reorderGalleryImages(images.map((img) => img._id))
      toast('Gallery order saved.', { type: 'success', title: 'Reorder saved' })
    } catch {
      toast('Failed to save the new order. Reloading gallery.', { type: 'error', title: 'Error' })
      loadImages()
    } finally {
      setReordering(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <AdminPageHeader
        title="Gallery Management"
        subtitle="Manage the photos shown in the About page gallery. Drag cards to reorder."
        icon={Images}
        action={
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-1.5 bg-accent text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest px-3 sm:px-4 py-2 sm:py-2.5 rounded-full hover:opacity-90 transition-opacity w-full sm:w-auto"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" /> Add Image
          </button>
        }
      />

      {listError && <p className="text-[11px] sm:text-xs text-red-500">{listError}</p>}

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-2.5 sm:p-4 md:p-6">
        {loading ? (
          <div className="p-6 sm:p-8 flex justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
          </div>
        ) : images.length === 0 ? (
          <div className="p-6 sm:p-8 flex flex-col items-center gap-3 text-center">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-gray-muted" />
            <p className="text-xs sm:text-sm text-gray-muted">No gallery images yet — add your first one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4">
            {images.map((item, index) => (
              <div
                key={item._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`group relative flex flex-col rounded-2xl border border-black/5 overflow-hidden bg-white cursor-grab active:cursor-grabbing transition-opacity ${
                  reordering ? 'opacity-70' : ''
                }`}
              >
                <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/60 flex items-center justify-center text-white">
                  <GripVertical className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>

                <div className="w-full aspect-[4/3] bg-black/5">
                  {item.image ? (
                    <img
                      src={toAbsoluteUrl(item.image)}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-muted">
                      <ImageOff className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1 p-2.5 sm:p-3 md:p-4">
                  <h3 className="text-xs sm:text-sm font-semibold text-black truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-[10px] sm:text-xs text-gray-muted line-clamp-2">{item.description}</p>
                  )}
                  <p className="text-[10px] sm:text-[11px] text-gray-muted mt-0.5 sm:mt-1">
                    Uploaded {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  <div className="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium py-1.5 sm:py-2 rounded-lg bg-black/5 hover:bg-black/10 text-black transition-colors"
                    >
                      <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 flex items-center justify-center gap-1 text-[10px] sm:text-xs font-medium py-1.5 sm:py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-3 sm:p-4 md:p-6 flex flex-col gap-3 sm:gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-black">
                {editingId ? 'Edit Gallery Image' : 'Add Gallery Image'}
              </h2>
              <button onClick={() => setModalOpen(false)} aria-label="Close">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-muted" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:gap-3">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                   className="w-full aspect-[4/3] object-cover rounded-xl bg-slate-50 border border-slate-200"
                />
              )}

              <div>
                <label className="text-[10px] sm:text-xs text-gray-muted mb-1 block">
                  {editingId ? 'Replace Image (optional)' : 'Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs"
                />
              </div>

              <input
                required
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />

              <textarea
                placeholder="Description (optional)"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
              />

              {error && <p className="text-[11px] sm:text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={saving}
                className="mt-1 bg-accent text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest py-2 sm:py-2.5 rounded-full flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : editingId ? 'Save Changes' : 'Add Image'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminGallery


