import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { Loader2, Plus, Pencil, Trash2, X, MapPin, Briefcase, Star, UserCircle } from 'lucide-react';
import { getTrainers, createTrainer, updateTrainer, deleteTrainer } from '../../services/admin.js';
import TableControls from '../components/TableControls.jsx';
import { useToast } from '../components/ToastContext.jsx';
import { fadeUp } from '../../utils/animationVariants';
import AdminPageHeader from '../components/AdminPageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

const emptyForm = {
  fullName: '', email: '', phone: '', city: '', state: '',
  currentCompany: '', currentDesignation: '', yearsOfExperience: 0,
  expertise: '', bio: '', linkedin: '', github: '', website: '', status: 'Active',
};

function AdminTrainers() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState('loading');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setStatus('loading');
    try {
      const res = await getTrainers({ search, page, limit: pageSize });
      setRows(res.data);
      setPages(res.pages);
    } catch {
      toast('Failed to load trainers', { type: 'error' });
    } finally {
      setStatus(false);
    }
  }, [search, page, pageSize, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (t) => {
    setEditing(t);
    setForm({
      fullName: t.fullName || '', email: t.email || '', phone: t.phone || '',
      city: t.city || '', state: t.state || '', currentCompany: t.currentCompany || '',
      currentDesignation: t.currentDesignation || '', yearsOfExperience: t.yearsOfExperience || 0,
      expertise: (t.expertise || []).join(', '), bio: t.bio || '',
      linkedin: t.linkedin || '', github: t.github || '', website: t.website || '',
      status: t.status || 'Active',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      yearsOfExperience: Number(form.yearsOfExperience) || 0,
      expertise: form.expertise.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await updateTrainer(editing._id, payload);
        toast('Trainer updated', { type: 'success' });
      } else {
        await createTrainer(payload);
        toast('Trainer added', { type: 'success' });
      }
      setModalOpen(false);
      fetchData();
    } catch {
      toast(editing ? 'Failed to update trainer' : 'Failed to add trainer', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm(`Delete trainer "${t.fullName}"?`)) return;
    try {
      await deleteTrainer(t._id);
      toast('Trainer deleted', { type: 'success' });
      fetchData();
    } catch {
      toast('Failed to delete trainer', { type: 'error' });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader
        title="Trainer / Mentor Management"
        subtitle="Add, edit and manage your trainers and mentors."
        icon={UserCircle}
        action={
          <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-pink px-4 py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white hover:bg-pink/90 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Trainer
          </button>
        }
      />

      <div className="bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-black/5">
          <TableControls
            searchValue={search}
            onSearchChange={(v) => { setSearch(v); setPage(1); }}
            page={page}
            pages={pages}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(v) => { setPageSize(v); setPage(1); }}
            loading={status === 'loading'}
          />
        </div>

        {status === 'loading' && <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>}

        {status === 'success' && rows.length === 0 && <p className="text-center py-16 text-sm text-gray-muted">No trainers found.</p>}

        {status === 'success' && rows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
            {rows.map((t, i) => (
              <motion.div
                key={t._id}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                animate="visible"
                viewport={{ once: true }}
                className="rounded-xl border border-black/5 p-4 flex flex-col gap-3 hover:shadow-md hover:border-black/10 transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-accent/10 text-accent flex items-center justify-center text-base font-bold flex-shrink-0">
                    {(t.fullName || '?').charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-black truncate">{t.fullName}</p>
                    <p className="text-[11px] text-gray-muted truncate">{t.currentDesignation}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 text-[11px] text-gray-muted">
                  {t.currentCompany && <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {t.currentCompany}</span>}
                  {t.city && <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {t.city}</span>}
                  {t.yearsOfExperience > 0 && <span className="flex items-center gap-1.5"><Star className="w-3 h-3" /> {t.yearsOfExperience} yrs exp</span>}
                </div>
                <div className="flex flex-wrap gap-1">
                  {(t.expertise || []).slice(0, 3).map((s) => (
                    <span key={s} className="rounded-full bg-black/5 px-2 py-0.5 text-[9px] font-semibold text-gray-muted uppercase tracking-wide">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
                  <StatusBadge status={t.status} variant={t.status === 'Active' ? 'active' : 'inactive'} />
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(t)} className="rounded-lg border border-black/10 p-1.5 text-gray-muted hover:text-accent hover:border-accent/30 transition-colors" aria-label="Edit trainer"><Pencil className="w-3 h-3" /></button>
                    <button onClick={() => handleDelete(t)} className="rounded-lg border border-black/10 p-1.5 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors" aria-label="Delete trainer"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-black">{editing ? 'Edit Trainer' : 'Add Trainer'}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-muted hover:text-black"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input placeholder="Designation" value={form.currentDesignation} onChange={(e) => setForm({ ...form, currentDesignation: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input placeholder="Company" value={form.currentCompany} onChange={(e) => setForm({ ...form, currentCompany: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input type="number" min="0" placeholder="Years of Experience" value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <input placeholder="Expertise (comma separated)" value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
              <textarea placeholder="Bio" rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input placeholder="LinkedIn" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input placeholder="GitHub" value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
                <input placeholder="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
              </div>
              <button type="submit" disabled={saving} className="w-full rounded-full bg-pink text-white text-xs font-semibold uppercase tracking-widest py-2.5 hover:bg-pink/90 transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Trainer' : 'Add Trainer'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AdminTrainers;


