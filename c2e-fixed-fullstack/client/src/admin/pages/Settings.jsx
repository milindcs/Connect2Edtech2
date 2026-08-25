import { useEffect, useState } from 'react';
import { Save, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { getSettings, updateSettings } from '../../services/admin.js';
import { useToast } from '../components/ToastContext.jsx';
import AdminPageHeader from '../components/AdminPageHeader.jsx';

function Settings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    siteName: '', siteDescription: '', contactEmail: '', contactPhone: '', address: '',
    socialFacebook: '', socialTwitter: '', socialInstagram: '', socialLinkedin: '', socialGithub: '', socialYoutube: '',
    enrollmentOpen: true, maintenanceMode: false, footerText: '',
  });

  useEffect(() => {
    let cancelled = false;
    getSettings()
      .then((res) => {
        if (cancelled) return;
        setForm({ ...form, ...res.data });
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        toast('Failed to load settings', { type: 'error' });
        setLoading(false);
      });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      toast('Settings saved', { type: 'success' });
    } catch {
      toast('Failed to save settings', { type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-6 h-6 animate-spin text-accent" /></div>;

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Settings"
        subtitle="Configure your site-wide settings."
        icon={SettingsIcon}
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 sm:p-6">
          <h3 className="text-sm font-bold text-black mb-4">General</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-muted mb-1 block">Site Name</label>
              <input name="siteName" value={form.siteName} onChange={handleChange} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-muted mb-1 block">Site Description</label>
              <textarea name="siteDescription" rows={2} value={form.siteDescription} onChange={handleChange} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent resize-none" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-gray-muted mb-1 block">Contact Email</label>
              <input name="contactEmail" type="email" value={form.contactEmail} onChange={handleChange} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-gray-muted mb-1 block">Contact Phone</label>
              <input name="contactPhone" value={form.contactPhone} onChange={handleChange} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[11px] uppercase tracking-widest text-gray-muted mb-1 block">Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 sm:p-6">
          <h3 className="text-sm font-bold text-black mb-4">Social Links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'socialFacebook', label: 'Facebook' },
              { name: 'socialTwitter', label: 'Twitter / X' },
              { name: 'socialInstagram', label: 'Instagram' },
              { name: 'socialLinkedin', label: 'LinkedIn' },
              { name: 'socialGithub', label: 'GitHub' },
              { name: 'socialYoutube', label: 'YouTube' },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-[11px] uppercase tracking-widest text-gray-muted mb-1 block">{field.label}</label>
                <input name={field.name} value={form[field.name]} onChange={handleChange} placeholder="https://" className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-black/5 shadow-sm p-4 sm:p-6">
          <h3 className="text-sm font-bold text-black mb-4">Preferences</h3>
          <div className="flex flex-col gap-3">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-black">Enrollment Open</p>
                <p className="text-[11px] text-gray-muted">Allow new enrollment submissions.</p>
              </div>
              <input type="checkbox" name="enrollmentOpen" checked={form.enrollmentOpen} onChange={handleChange} className="w-4 h-4 accent-accent" />
            </label>
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-black">Maintenance Mode</p>
                <p className="text-[11px] text-gray-muted">Temporarily disable public site access.</p>
              </div>
              <input type="checkbox" name="maintenanceMode" checked={form.maintenanceMode} onChange={handleChange} className="w-4 h-4 accent-accent" />
            </label>
            <div>
              <label className="text-[11px] uppercase tracking-widest text-gray-muted mb-1 block">Footer Text</label>
              <input name="footerText" value={form.footerText} onChange={handleChange} className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={saving} className="self-start inline-flex items-center gap-2 rounded-full bg-pink px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-white hover:bg-pink/90 transition-colors disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

export default Settings;


