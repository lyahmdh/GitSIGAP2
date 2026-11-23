import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import api from '../../services/api';

const formatDate = (value) => value ? new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-';

export default function Dashboard() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadReports = useCallback(async () => {
        try {
            const { data } = await api.get('/api/spa/profile');
            setReports(data.reports || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Data dashboard gagal dimuat. Pastikan Anda sudah login.');
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { loadReports(); }, [loadReports]);

    const summary = useMemo(() => ({
        total: reports.length,
        masuk: reports.filter((item) => item.status === 'masuk').length,
        diproses: reports.filter((item) => ['diverifikasi', 'ditindaklanjuti'].includes(item.status)).length,
        selesai: reports.filter((item) => item.status === 'selesai').length,
    }), [reports]);
    const recentReports = useMemo(() => [...reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5), [reports]);

    return (
        <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div><p className="text-sm font-semibold text-emerald-700">AREA PENGGUNA</p><h1 className="mt-2 text-2xl font-bold text-slate-900">Dashboard Saya</h1><p className="mt-2 text-sm text-slate-500">Pantau laporan dan perkembangan penanganan pengaduanmu.</p></div>
                <Link to="/reports/create" className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800">+ Buat Laporan</Link>
            </div>
            {error && <div className="mb-5 rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Laporan" value={loading ? '…' : String(summary.total)} description="Seluruh laporan yang dibuat" />
                <StatCard title="Menunggu Verifikasi" value={loading ? '…' : String(summary.masuk)} description="Laporan baru masuk" />
                <StatCard title="Dalam Penanganan" value={loading ? '…' : String(summary.diproses)} description="Sedang diverifikasi atau ditindaklanjuti" />
                <StatCard title="Selesai" value={loading ? '…' : String(summary.selesai)} description="Laporan telah diselesaikan" />
            </div>
            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-bold text-slate-900">Aktivitas Laporan Terbaru</h2><p className="mt-1 text-sm text-slate-500">Ringkasan laporan yang terakhir kamu buat.</p></div><Link to="/reports" className="text-sm font-semibold text-emerald-700 hover:underline">Lihat semua →</Link></div>
                {loading ? <p className="py-10 text-center text-sm text-slate-500">Memuat aktivitas…</p> : recentReports.length ? <div className="mt-5 divide-y divide-slate-100">{recentReports.map((report) => <div key={report.id} className="flex flex-wrap items-center justify-between gap-4 py-5"><div className="min-w-0"><p className="text-xs text-slate-400">{report.category?.name || report.category_name || 'Kategori'} · {formatDate(report.created_at)}</p><h3 className="mt-2 font-semibold text-slate-800">{report.title}</h3></div><div className="flex items-center gap-4"><StatusBadge status={report.status} /><Link to={`/reports/${report.id}`} className="text-sm font-semibold text-emerald-700">Detail</Link></div></div>)}</div> : <div className="py-12 text-center"><p className="text-sm text-slate-500">Belum ada laporan yang dibuat.</p><Link to="/reports/create" className="mt-3 inline-block text-sm font-semibold text-emerald-700">Buat laporan pertama →</Link></div>}
            </section>
        </div>
    );
}
