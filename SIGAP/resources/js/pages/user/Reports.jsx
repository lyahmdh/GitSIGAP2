import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const statuses = [
    ['semua', 'Semua Status'], ['masuk', 'Masuk'], ['diverifikasi', 'Diverifikasi'],
    ['ditindaklanjuti', 'Ditindaklanjuti'], ['selesai', 'Selesai'], ['ditolak', 'Ditolak'],
];
const formatDate = (value) => value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

export default function Reports() {
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('semua');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deleting, setDeleting] = useState(null);

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.get('/api/spa/profile');
            setReports(data.reports || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Riwayat laporan gagal dimuat. Pastikan Anda sudah login.');
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadReports(); }, [loadReports]);

    const filteredReports = useMemo(() => reports.filter((report) =>
        (filter === 'semua' || report.status === filter) &&
        (report.title || '').toLowerCase().includes(search.toLowerCase()),
    ), [reports, filter, search]);

    async function deleteReport(report) {
        if (!window.confirm(`Hapus laporan "${report.title}"? Laporan hanya dapat dihapus saat status masih Masuk.`)) return;
        setDeleting(report.id);
        try {
            await api.delete(`/api/spa/reports/${report.id}`);
            setReports((current) => current.filter((item) => item.id !== report.id));
        } catch (err) {
            window.alert(err.response?.data?.message || 'Laporan gagal dihapus. Pastikan status laporan masih Masuk.');
        } finally { setDeleting(null); }
    }

    return (
        <div>
            <PageHeader title="Riwayat Laporan" description="Pantau status dan perkembangan seluruh laporan yang pernah kamu sampaikan."
                action={<Link to="/reports/create" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">+ Buat Laporan</Link>} />
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row">
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul laporan…" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600" />
                    <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm">
                        {statuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </div>
                {error && <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
                {loading ? <p className="py-12 text-center text-sm text-slate-500">Memuat riwayat laporan…</p> : filteredReports.length ? (
                    <div className="mt-5 overflow-x-auto">
                        <table className="w-full min-w-[650px] border-collapse text-left text-sm">
                            <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500"><th className="px-3 py-3">No.</th><th className="px-3 py-3">Nama Laporan</th><th className="px-3 py-3">Tanggal Laporan</th><th className="px-3 py-3">Status</th><th className="px-3 py-3 text-center">Detail</th></tr></thead>
                            <tbody>{filteredReports.map((report, index) => <tr key={report.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70">
                                <td className="px-3 py-4 text-slate-400">{index + 1}</td>
                                <td className="px-3 py-4"><p className="font-semibold text-slate-800">{report.title}</p><p className="mt-1 text-xs text-slate-400">{report.category?.name || report.category_name || 'Kategori'}{report.district ? ` · ${report.district}` : ''}</p></td>
                                <td className="whitespace-nowrap px-3 py-4 text-slate-500">{formatDate(report.created_at)}</td>
                                <td className="px-3 py-4"><StatusBadge status={report.status} /></td>
                                <td className="px-3 py-4"><div className="flex items-center justify-center gap-3"><Link to={`/reports/${report.id}`} className="font-semibold text-emerald-700 hover:underline">Detail</Link>{report.status === 'masuk' && <button type="button" disabled={deleting === report.id} onClick={() => deleteReport(report)} className="font-semibold text-red-600 hover:underline disabled:opacity-50">{deleting === report.id ? 'Menghapus…' : 'Hapus'}</button>}</div></td>
                            </tr>)}</tbody>
                        </table>
                        <p className="mt-4 text-xs text-slate-400">Menampilkan {filteredReports.length} dari {reports.length} laporan.</p>
                    </div>
                ) : <div className="py-14 text-center"><div className="text-4xl">📋</div><h3 className="mt-3 font-bold text-slate-800">{reports.length ? 'Tidak Ada Laporan yang Sesuai' : 'Belum Ada Laporan'}</h3><p className="mt-1 text-sm text-slate-500">{reports.length ? 'Coba ubah kata kunci atau filter status.' : 'Laporan yang kamu buat akan muncul di sini.'}</p>{!reports.length && <Link to="/reports/create" className="mt-4 inline-flex rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">Buat Laporan</Link>}</div>}
            </div>
        </div>
    );
}
