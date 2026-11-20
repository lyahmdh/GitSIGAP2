import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const initialReport = {
    title: 'Jalan berlubang di Lowokwaru',
    category: 'Jalan & Transportasi',
    reporter: 'Budi Santoso',
    location: 'Jl. Melati, Kecamatan Lowokwaru, Kota Malang',
    district: 'Lowokwaru',
    date: '20 November 2026',
    description: 'Terdapat lubang cukup besar pada jalan yang berpotensi membahayakan pengendara. Mohon dilakukan pemeriksaan dan perbaikan agar tidak menyebabkan kecelakaan.',
    status: 'ditindaklanjuti',
    priority: 86,
    severity: 'Tinggi',
};

const statusOrder = ['masuk', 'diverifikasi', 'ditindaklanjuti', 'selesai'];
const statusLabels = { masuk: 'Masuk', diverifikasi: 'Diverifikasi', ditindaklanjuti: 'Ditindaklanjuti', selesai: 'Selesai', ditolak: 'Ditolak' };
const statusStyles = { masuk: 'bg-amber-100 text-amber-800', diverifikasi: 'bg-violet-100 text-violet-800', ditindaklanjuti: 'bg-blue-100 text-blue-800', selesai: 'bg-green-100 text-green-800', ditolak: 'bg-red-100 text-red-800' };
const transitions = { masuk: ['diverifikasi', 'ditolak'], diverifikasi: ['ditindaklanjuti', 'ditolak'], ditindaklanjuti: ['selesai'], selesai: [], ditolak: [] };
const steps = [
    { key: 'masuk', label: 'Laporan Masuk', icon: '▣' },
    { key: 'diverifikasi', label: 'Proses Verifikasi', icon: '▤' },
    { key: 'ditindaklanjuti', label: 'Proses Tindak Lanjut', icon: '⚒' },
    { key: 'selesai', label: 'Selesai', icon: '✓' },
];

export default function AdminReportDetail() {
    const { id } = useParams();
    const [status, setStatus] = useState(initialReport.status);
    const [savedStatus, setSavedStatus] = useState(initialReport.status);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [updates, setUpdates] = useState([
        { id: 1, title: 'Pemeriksaan lokasi', description: 'Tim telah melakukan pemeriksaan awal pada lokasi laporan dan mendata kebutuhan perbaikan.', date: '21 November 2026', photos: [] },
    ]);
    const [notice, setNotice] = useState('');

    const currentIndex = statusOrder.indexOf(status);
    const allowedStatuses = transitions[savedStatus] || [];

    const handleStatusSubmit = (event) => {
        event.preventDefault();
        if (status === savedStatus) return;
        setSavedStatus(status);
        setNotice(`Status laporan berhasil diperbarui menjadi ${statusLabels[status]}. (Pratinjau)`);
    };

    const handleAddUpdate = (event) => {
        event.preventDefault();
        const title = updateTitle.trim();
        const description = updateDescription.trim();
        if (!title || !description) return;
        setUpdates((current) => [{ id: Date.now(), title, description, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), photos: [] }, ...current]);
        setUpdateTitle('');
        setUpdateDescription('');
        setNotice('Update proyek berhasil ditambahkan. (Pratinjau)');
    };

    return (
        <div className="space-y-6 text-green-dark">
            <header>
                <Link to="/admin/reports" className="text-sm font-semibold text-green-mid hover:underline">← Kembali ke manajemen laporan</Link>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Detail Laporan · #{String(id).padStart(3, '0')}</p>
                        <h1 className="mt-1 font-display text-3xl font-semibold">{initialReport.title}</h1>
                        <p className="mt-1 text-sm text-muted">Informasi laporan, perkembangan status, dan update proyek.</p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[savedStatus]}`}>{statusLabels[savedStatus]}</span>
                </div>
            </header>

            {notice && <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>}

            <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                <h2 className="mb-6 font-display text-xl font-semibold">Informasi Laporan</h2>
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Judul Laporan</p><p className="mt-1 font-semibold">{initialReport.title}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Kategori</p><p className="mt-1">{initialReport.category}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Pelapor</p><p className="mt-1">{initialReport.reporter}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Tanggal Laporan</p><p className="mt-1">{initialReport.date}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Lokasi</p><p className="mt-1">{initialReport.location}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Tingkat Keparahan</p><span className="mt-1 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{initialReport.severity}</span></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Priority Score</p><p className="mt-1 font-semibold">{initialReport.priority}/100</p></div>
                    <div className="sm:col-span-2"><p className="text-xs font-bold uppercase tracking-wider text-muted">Deskripsi Laporan</p><p className="mt-1 text-sm leading-7 text-muted">{initialReport.description}</p></div>
                </div>
            </section>

            <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                <h2 className="mb-6 font-display text-xl font-semibold">Status Penanganan</h2>
                <div className="relative grid grid-cols-4 gap-2">
                    <div className="absolute left-[12.5%] right-[12.5%] top-6 h-0.5 bg-cream-dark" />
                    {steps.map((step, index) => {
                        const done = currentIndex >= 0 && index < currentIndex;
                        const current = index === currentIndex;
                        return <div key={step.key} className="relative z-10 text-center">
                            <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border-[3px] text-lg font-bold ${done ? 'border-green-mid bg-green-pale text-green-mid' : current ? 'border-green-dark bg-green-dark text-white shadow-md' : 'border-cream-dark bg-cream text-muted'}`}>{step.icon}</div>
                            <p className={`mt-2 text-[11px] font-bold sm:text-sm ${done || current ? 'text-green-dark' : 'text-muted'}`}>{step.label}</p>
                            {(done || current || index === 0) && <p className="mt-1 text-[10px] text-muted">{index === 0 ? initialReport.date : 'Dalam proses'}</p>}
                        </div>;
                    })}
                </div>
                <div className="mt-6 border-t border-cream-dark pt-4 text-sm"><span className="text-muted">Status saat ini:</span> <span className={`ml-2 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[savedStatus]}`}>{statusLabels[savedStatus]}</span></div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
                <div className="space-y-6">
                    <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold"><span className="text-accent">⌖</span> Deskripsi Proyek</h2>
                        <p className="text-sm leading-7 text-muted">{initialReport.description}</p>
                        <div className="mt-5 flex min-h-36 items-center justify-center rounded-lg border border-dashed border-cream-dark bg-cream px-4 text-center text-sm text-muted">Peta lokasi laporan<br /><span className="mt-1 block text-xs">{initialReport.location}</span></div>
                        <p className="mt-3 text-xs text-muted">⌖ {initialReport.location}</p>
                    </section>

                    <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                        <h2 className="mb-5 font-display text-xl font-semibold">▦ Update Proyek</h2>
                        <form onSubmit={handleAddUpdate} className="space-y-4">
                            <label className="block text-sm font-semibold">Judul Update
                                <input required value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} placeholder="Masukkan judul update" className="mt-1.5 w-full rounded-lg border border-cream-dark px-3 py-2.5 font-normal outline-none focus:border-green-mid" />
                            </label>
                            <label className="block text-sm font-semibold">Deskripsi
                                <textarea required rows={3} value={updateDescription} onChange={(e) => setUpdateDescription(e.target.value)} placeholder="Jelaskan perkembangan proyek..." className="mt-1.5 w-full rounded-lg border border-cream-dark px-3 py-2.5 font-normal outline-none focus:border-green-mid" />
                            </label>
                            <label className="block text-sm font-semibold">Foto Progress
                                <input type="file" accept="image/*" multiple className="mt-1.5 block w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm font-normal file:mr-3 file:rounded-md file:border-0 file:bg-green-pale file:px-3 file:py-2 file:font-semibold file:text-green-dark" />
                            </label>
                            <button type="submit" className="rounded-lg bg-green-dark px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-mid">＋ Tambah Update</button>
                        </form>
                        <div className="my-6 border-t border-cream-dark" />
                        {updates.length ? <div className="relative space-y-6 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-px before:bg-cream-dark">
                            {updates.map((update) => <article key={update.id} className="relative flex gap-4">
                                <span className="relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-green-pale bg-green-mid" />
                                <div className="min-w-0 flex-1"><p className="text-xs text-muted">{update.date}</p><h3 className="mt-1 font-bold">{update.title}</h3><p className="mt-1 text-sm leading-6 text-muted">{update.description}</p></div>
                            </article>)}
                        </div> : <p className="py-6 text-center text-sm text-muted">Belum ada update terbaru dari admin.</p>}
                    </section>
                </div>

                <aside className="h-fit rounded-xl border border-cream-dark bg-white p-5 md:p-6">
                    <h2 className="mb-2 font-display text-xl font-semibold">Perbarui Status</h2>
                    <p className="mb-5 text-sm text-muted">Pilih status berikutnya sesuai perkembangan penanganan laporan.</p>
                    <form onSubmit={handleStatusSubmit} className="space-y-4">
                        <label className="block text-sm font-semibold">Status Laporan
                            <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={!allowedStatuses.length} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 font-normal outline-none focus:border-green-mid disabled:bg-cream disabled:text-muted">
                                <option value={savedStatus}>{statusLabels[savedStatus]}</option>
                                {allowedStatuses.map((next) => <option key={next} value={next}>{statusLabels[next]}</option>)}
                            </select>
                        </label>
                        {!allowedStatuses.length && <p className="rounded-lg bg-cream p-3 text-xs text-muted">Status laporan ini sudah final dan tidak memiliki perubahan status berikutnya.</p>}
                        <button type="submit" disabled={!allowedStatuses.length || status === savedStatus} className="w-full rounded-lg bg-green-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-green-mid disabled:cursor-not-allowed disabled:opacity-40">Simpan Perubahan</button>
                    </form>
                    <p className="mt-4 text-xs leading-5 text-muted">Perubahan status pada tampilan ini merupakan pratinjau antarmuka.</p>
                </aside>
            </div>
        </div>
    );
}
