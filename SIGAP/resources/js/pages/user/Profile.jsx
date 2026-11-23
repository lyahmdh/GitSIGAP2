import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const filters = [['semua', 'Semua'], ['masuk', 'Masuk'], ['diverifikasi', 'Diverifikasi'], ['ditindaklanjuti', 'Ditindaklanjuti'], ['selesai', 'Selesai'], ['ditolak', 'Ditolak']];
const dateLabel = (value) => value ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value)) : '-';
function initials(name = '') {
    const words = name.trim().split(/\s+/).filter(Boolean);
    return words.length ? (words[0][0] + (words.length > 1 ? words.at(-1)[0] : '')).toUpperCase() : '?';
}
function photoUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path) || path.startsWith('/')) return path;
    return `/storage/${path}`;
}

export default function Profile() {
    const { user, refreshUser } = useAuth();
    const fileRef = useRef(null);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [filter, setFilter] = useState('semua');
    const [name, setName] = useState(user?.name || '');
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        let alive = true;
        api.get('/api/spa/profile')
            .then(({ data }) => { if (alive) setReports(data.reports || []); })
            .catch((e) => { if (alive) setError(e.response?.data?.message || 'Riwayat laporan gagal dimuat.'); })
            .finally(() => { if (alive) setLoading(false); });
        return () => { alive = false; };
    }, []);

    useEffect(() => {
        if (!photo) { setPreview(null); return; }
        const url = URL.createObjectURL(photo);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [photo]);

    const summary = useMemo(() => ({
        total: reports.length,
        masuk: reports.filter((r) => r.status === 'masuk').length,
        diverifikasi: reports.filter((r) => r.status === 'diverifikasi').length,
        ditindaklanjuti: reports.filter((r) => r.status === 'ditindaklanjuti').length,
        selesai: reports.filter((r) => r.status === 'selesai').length,
        ditolak: reports.filter((r) => r.status === 'ditolak').length,
    }), [reports]);
    const visibleReports = reports.filter((r) => filter === 'semua' || r.status === filter);

    function startEditing() {
        setName(user?.name || ''); setPhoto(null); setMessage(''); setError(''); setEditing(true);
    }
    async function saveProfile(event) {
        event.preventDefault(); setSaving(true); setError(''); setMessage('');
        try {
            const payload = new FormData();
            payload.append('name', name);
            if (photo) payload.append('photo', photo);
            payload.append('_method', 'PUT');
            await api.post('/api/spa/profile', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
            await refreshUser();
            setEditing(false); setMessage('Profil berhasil diperbarui.');
        } catch (e) {
            setError(e.response?.data?.message || 'Profil gagal diperbarui.');
        } finally { setSaving(false); }
    }
    async function removePhoto() {
        setSaving(true); setError('');
        try {
            await api.delete('/api/spa/profile/photo');
            await refreshUser(); setPhoto(null); setPreview(null); setMessage('Foto profil dihapus. Avatar kembali ke inisial nama.');
        } catch (e) { setError(e.response?.data?.message || 'Foto profil gagal dihapus.'); }
        finally { setSaving(false); }
    }

    const currentPhoto = preview || photoUrl(user?.profile_photo);
    return <div className="space-y-5">
        {message && <div role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}
        {error && <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        <div className="grid items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
            <aside className="rounded-[22px] bg-gradient-to-b from-green-light to-green-dark p-6 text-white shadow-deep">
                <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white/40 bg-accent font-display text-3xl font-semibold">
                    {currentPhoto ? <img src={currentPhoto} alt="Foto profil" className="h-full w-full object-cover" /> : initials(user?.name)}
                </div>
                {editing ? <form onSubmit={saveProfile} className="mt-5 space-y-4">
                    <div><label htmlFor="profile-name" className="mb-1 block text-xs font-semibold text-white/80">Nama Lengkap</label><input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} className="w-full rounded-lg border border-white/30 bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/50" /></div>
                    <div><span className="mb-1 block text-xs font-semibold text-white/80">Email</span><p className="break-all rounded-lg bg-white/10 px-3 py-2.5 text-sm">{user?.email}</p></div>
                    <div><label htmlFor="profile-photo" className="mb-1 block text-xs font-semibold text-white/80">Foto Profil (JPG/PNG, maks. 2 MB)</label><input ref={fileRef} id="profile-photo" type="file" accept="image/jpeg,image/png" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="w-full text-xs text-white file:mr-2 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-semibold file:text-green-dark" /></div>
                    {currentPhoto && <button type="button" disabled={saving} onClick={() => { if (preview) { setPhoto(null); if (fileRef.current) fileRef.current.value = ''; } else removePhoto(); }} className="w-full rounded-lg border border-white/40 px-3 py-2 text-xs font-semibold hover:bg-white/10 disabled:opacity-50">{preview ? 'Batalkan pilihan foto' : 'Hapus foto profil · Gunakan avatar default'}</button>}
                    <div className="space-y-2 pt-1"><button disabled={saving} type="submit" className="w-full rounded-full bg-accent py-2.5 text-sm font-bold text-white hover:bg-brown-warm disabled:opacity-60">{saving ? 'Menyimpan…' : 'Simpan Perubahan'}</button><button type="button" onClick={() => setEditing(false)} className="w-full rounded-full border border-white/50 py-2.5 text-sm font-bold text-white hover:bg-white/10">Batal</button></div>
                </form> : <div className="mt-5 text-center">
                    <h1 className="font-display text-xl font-semibold">{user?.name || 'Pengguna'}</h1><p className="mt-2 break-all text-sm text-white/80">{user?.email}</p>
                    <button type="button" onClick={startEditing} className="mt-5 w-full rounded-full bg-accent py-2.5 text-sm font-bold text-white hover:bg-brown-warm">Edit Profile</button>
                </div>}
                {!editing && <div className="mt-6 space-y-2">
                    {[['Total Laporan', summary.total], ['Masuk', summary.masuk], ['Diverifikasi', summary.diverifikasi], ['Ditindaklanjuti', summary.ditindaklanjuti], ['Selesai', summary.selesai], ['Ditolak', summary.ditolak]].map(([label, count]) => <div key={label} className="flex items-center justify-between rounded-full bg-white/10 px-4 py-2 text-sm"><span>{label}</span><strong className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs text-green-dark">{count}</strong></div>)}
                </div>}
            </aside>
            <section className="min-w-0">
                <div><p className="text-xs font-bold uppercase tracking-wider text-accent">Akun Pengguna</p><h2 className="mt-1 font-display text-2xl font-semibold text-green-dark md:text-3xl">Riwayat Laporan</h2><div className="mt-2 h-[3px] w-12 rounded bg-accent" /></div>
                <div className="mt-5 flex flex-wrap gap-2">{filters.map(([value, label]) => <button key={value} type="button" onClick={() => setFilter(value)} className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${filter === value ? 'border-green-dark bg-green-dark text-white' : 'border-cream-dark bg-white text-muted hover:border-green-dark'}`}>{label}</button>)}</div>
                <div className="mt-4 overflow-hidden rounded-2xl border border-cream-dark bg-white shadow-sm">
                    {loading ? <p className="p-10 text-center text-sm text-muted">Memuat riwayat laporan…</p> : visibleReports.length ? <div className="divide-y divide-cream-dark">{visibleReports.map((report) => <article key={report.id} className="flex flex-wrap items-center justify-between gap-3 p-4 md:p-5"><div className="min-w-0 flex-1"><p className="text-xs text-muted">{report.category?.name || 'Kategori'} · {dateLabel(report.created_at)}</p><h3 className="mt-1 font-semibold text-ink">{report.title}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{report.description}</p></div><div className="flex items-center gap-3"><StatusBadge status={report.status} /><Link to={`/reports/${report.id}`} className="text-sm font-bold text-green-dark hover:underline">Detail</Link></div></article>)}</div> : <div className="p-10 text-center"><p className="font-semibold text-ink">{filter === 'semua' ? 'Belum ada laporan.' : 'Tidak ada laporan dengan status ini.'}</p><p className="mt-1 text-sm text-muted">Laporan yang Anda kirim akan muncul di halaman ini.</p>{filter === 'semua' && <Link to="/reports/create" className="mt-4 inline-block rounded-full bg-accent px-5 py-2 text-sm font-bold text-white">Buat Laporan</Link>}</div>}
                    <div className="border-t border-cream-dark px-4 py-3 text-xs text-muted">Menampilkan <strong>{visibleReports.length}</strong> dari <strong>{reports.length}</strong> laporan</div>
                </div>
            </section>
        </div>
    </div>;
}
