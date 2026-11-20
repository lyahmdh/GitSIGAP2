import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const reportsData = [
    { id: 1, title: 'Jalan berlubang di Lowokwaru', date: '2026-11-20', category: 'Jalan & Transportasi', district: 'Lowokwaru', priority: 86, status: 'masuk' },
    { id: 2, title: 'Lampu jalan tidak menyala', date: '2026-11-19', category: 'Penerangan Umum', district: 'Klojen', priority: 65, status: 'diverifikasi' },
    { id: 3, title: 'Saluran air tersumbat', date: '2026-11-18', category: 'Air & Drainase', district: 'Blimbing', priority: 48, status: 'ditindaklanjuti' },
    { id: 4, title: 'Kerusakan fasilitas taman', date: '2026-11-17', category: 'Ruang Publik', district: 'Sukun', priority: 32, status: 'selesai' },
    { id: 5, title: 'Jalan rusak dekat sekolah', date: '2026-11-16', category: 'Jalan & Transportasi', district: 'Lowokwaru', priority: 72, status: 'ditolak' },
    { id: 6, title: 'Drainase lingkungan perlu dibersihkan', date: '2026-11-15', category: 'Air & Drainase', district: 'Kedungkandang', priority: 57, status: 'masuk' },
];

const statusLabels = { masuk: 'Masuk', diverifikasi: 'Diverifikasi', ditindaklanjuti: 'Ditindaklanjuti', selesai: 'Selesai', ditolak: 'Ditolak' };
const statusStyles = { masuk: 'bg-amber-100 text-amber-800', diverifikasi: 'bg-violet-100 text-violet-800', ditindaklanjuti: 'bg-blue-100 text-blue-800', selesai: 'bg-green-100 text-green-800', ditolak: 'bg-red-100 text-red-800' };
const transitions = { masuk: ['diverifikasi', 'ditolak'], diverifikasi: ['ditindaklanjuti', 'ditolak'], ditindaklanjuti: ['selesai'], selesai: [], ditolak: [] };
const districts = ['Lowokwaru', 'Klojen', 'Blimbing', 'Sukun', 'Kedungkandang'];
const categories = ['Jalan & Transportasi', 'Penerangan Umum', 'Air & Drainase', 'Ruang Publik'];
const dateLabel = (date) => new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });

function Priority({ value }) {
    const color = value >= 70 ? 'bg-red-50 text-red-700' : value >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700';
    return <span className={`inline-flex min-w-10 justify-center rounded-md px-2 py-1 text-xs font-bold ${color}`}>{value}</span>;
}

export default function AdminReports() {
    const [search, setSearch] = useState('');
    const [district, setDistrict] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [rows, setRows] = useState(reportsData);
    const pageSize = 5;

    const filtered = useMemo(() => {
        const result = rows.filter((report) =>
            (!district || report.district === district) &&
            (!category || report.category === category) &&
            (!status || report.status === status) &&
            (!search || report.title.toLowerCase().includes(search.toLowerCase()))
        );
        return result.sort((a, b) => sort === 'oldest' ? a.date.localeCompare(b.date) : sort === 'priority' ? b.priority - a.priority : b.date.localeCompare(a.date));
    }, [rows, district, category, status, search, sort]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, pageCount);
    const visibleRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const resetFilters = () => { setDistrict(''); setCategory(''); setStatus(''); setSearch(''); setSort('newest'); setPage(1); };
    const updateStatus = (id, nextStatus) => setRows((current) => current.map((report) => report.id === id ? { ...report, status: nextStatus } : report));

    return (
        <div className="space-y-6 text-green-dark">
            <header>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Administrator</p>
                <h1 className="mt-1 font-display text-3xl font-semibold">Kelola Laporan</h1>
                <p className="mt-1 text-sm text-muted">Kelola dan pantau seluruh laporan masyarakat.</p>
            </header>

            <section className="rounded-xl border border-cream-dark bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <label className="text-xs font-bold text-muted">Kecamatan
                        <select value={district} onChange={(e) => { setDistrict(e.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="">Semua Kecamatan</option>{districts.map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Kategori
                        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="">Semua Kategori</option>{categories.map((item) => <option key={item}>{item}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Status
                        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="">Semua Status</option>{Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Urutkan
                        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="newest">Tanggal terbaru</option><option value="oldest">Tanggal terlama</option><option value="priority">Priority tertinggi</option>
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Cari laporan
                        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari judul laporan..." className="mt-1.5 w-full rounded-lg border border-cream-dark px-3 py-2.5 text-sm font-normal text-green-dark outline-none placeholder:text-muted/70 focus:border-green-mid" />
                    </label>
                </div>
                {(district || category || status || search || sort !== 'newest') && <button type="button" onClick={resetFilters} className="mt-4 text-xs font-semibold text-accent hover:underline">✕ Reset filter</button>}
            </section>

            <section className="overflow-hidden rounded-xl border border-cream-dark bg-white">
                <div className="border-b border-cream-dark px-5 py-4"><h2 className="font-display text-xl font-semibold">Daftar Laporan Warga</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-green-dark text-xs uppercase tracking-wider text-white"><tr>
                            {['ID', 'Judul', 'Tanggal Laporan', 'Kategori', 'Priority Score', 'Status', 'Aksi'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}
                        </tr></thead>
                        <tbody>{visibleRows.map((report) => <tr key={report.id} className="border-b border-cream-dark last:border-0 hover:bg-cream/70">
                            <td className="px-4 py-4 font-semibold text-muted">#{String(report.id).padStart(3, '0')}</td>
                            <td className="max-w-xs px-4 py-4 font-semibold">{report.title}</td>
                            <td className="px-4 py-4 text-muted">{dateLabel(report.date)}</td>
                            <td className="px-4 py-4 text-muted">{report.category}</td>
                            <td className="px-4 py-4"><Priority value={report.priority} /></td>
                            <td className="px-4 py-4">{transitions[report.status].length ? <select aria-label={`Ubah status laporan ${report.title}`} value={report.status} onChange={(e) => updateStatus(report.id, e.target.value)} className={`rounded-full border-0 px-3 py-2 text-xs font-semibold outline-none ${statusStyles[report.status]}`}>
                                <option value={report.status}>{statusLabels[report.status]}</option>{transitions[report.status].map((next) => <option key={next} value={next}>{statusLabels[next]}</option>)}
                            </select> : <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.status]}`}>{statusLabels[report.status]}</span>}</td>
                            <td className="px-4 py-4"><Link to={`/admin/reports/${report.id}`} className="whitespace-nowrap font-bold text-green-mid hover:underline">◉ Detail</Link></td>
                        </tr>)}</tbody>
                    </table>
                    {!visibleRows.length && <p className="px-5 py-10 text-center text-sm text-muted">Tidak ada laporan yang sesuai dengan filter.</p>}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-dark px-5 py-4 text-xs text-muted">
                    <span>Menampilkan <strong>{filtered.length ? (currentPage - 1) * pageSize + 1 : 0}</strong>–<strong>{Math.min(currentPage * pageSize, filtered.length)}</strong> dari <strong>{filtered.length}</strong> laporan</span>
                    <div className="flex items-center gap-1">
                        <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)} className="rounded-md border border-cream-dark px-3 py-1.5 font-semibold disabled:opacity-40">Sebelumnya</button>
                        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <button key={number} type="button" onClick={() => setPage(number)} className={`rounded-md px-3 py-1.5 font-semibold ${number === currentPage ? 'bg-green-dark text-white' : 'border border-cream-dark hover:bg-cream'}`}>{number}</button>)}
                        <button type="button" disabled={currentPage === pageCount} onClick={() => setPage((value) => value + 1)} className="rounded-md border border-cream-dark px-3 py-1.5 font-semibold disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
