import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import reportService from '../../services/reportService';

const statusLabels = {
    masuk: 'Masuk',
    diverifikasi: 'Diverifikasi',
    ditindaklanjuti: 'Ditindaklanjuti',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
};
const statusStyles = {
    masuk: 'bg-amber-100 text-amber-800',
    diverifikasi: 'bg-violet-100 text-violet-800',
    ditindaklanjuti: 'bg-blue-100 text-blue-800',
    selesai: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800',
};
const transitions = {
    masuk: ['diverifikasi', 'ditolak'],
    diverifikasi: ['ditindaklanjuti', 'ditolak'],
    ditindaklanjuti: ['selesai'],
    selesai: [],
    ditolak: [],
};
const dateLabel = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleDateString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric',
    });
};

function Priority({ value }) {
    const score = Number(value) || 0;
    const color = score >= 70
        ? 'bg-red-50 text-red-700'
        : score >= 40
            ? 'bg-amber-50 text-amber-700'
            : 'bg-green-50 text-green-700';
    return <span className={`inline-flex min-w-10 justify-center rounded-md px-2 py-1 text-xs font-bold ${color}`}>{score.toFixed(0)}</span>;
}

function errorMessage(error, fallback) {
    const validationErrors = error.response?.data?.errors;
    if (validationErrors) {
        const first = Object.values(validationErrors).flat()[0];
        if (first) return first;
    }
    return error.response?.data?.message || fallback;
}

export default function AdminReports() {
    const [search, setSearch] = useState('');
    const [district, setDistrict] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [status, setStatus] = useState('');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    const [reports, setReports] = useState([]);
    const [categories, setCategories] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 10, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [updatingId, setUpdatingId] = useState(null);
    const pageSize = 10;

    useEffect(() => {
        let active = true;

        Promise.all([reportService.getCategories(), reportService.getDistrictStats()])
            .then(([categoryResponse, districtResponse]) => {
                if (!active) return;
                setCategories(Array.isArray(categoryResponse?.data) ? categoryResponse.data : Array.isArray(categoryResponse) ? categoryResponse : []);
                setDistricts(Array.isArray(districtResponse?.data) ? districtResponse.data : []);
            })
            .catch((requestError) => {
                if (active) setError(errorMessage(requestError, 'Filter kategori dan kecamatan gagal dimuat.'));
            });

        return () => { active = false; };
    }, []);

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await reportService.getAdminReports({
                page,
                per_page: pageSize,
                search: search.trim() || undefined,
                district: district || undefined,
                category_id: categoryId || undefined,
                status: status || undefined,
                sort,
            });

            setReports(Array.isArray(response?.data) ? response.data : []);
            setMeta(response?.meta || { current_page: page, last_page: 1, per_page: pageSize, total: 0 });
        } catch (requestError) {
            setError(errorMessage(requestError, 'Daftar laporan gagal dimuat.'));
            setReports([]);
        } finally {
            setLoading(false);
        }
    }, [page, search, district, categoryId, status, sort]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const resetFilters = () => {
        setSearch('');
        setDistrict('');
        setCategoryId('');
        setStatus('');
        setSort('newest');
        setPage(1);
        setNotice('');
    };

    const updateStatus = async (report, nextStatus) => {
        setUpdatingId(report.id);
        setNotice('');
        setError('');

        try {
            await reportService.updateAdminReportStatus(report.id, nextStatus);
            setNotice(`Status laporan #${report.id} berhasil diperbarui menjadi ${statusLabels[nextStatus]}.`);
            await loadReports();
        } catch (requestError) {
            setError(errorMessage(requestError, 'Status laporan gagal diperbarui.'));
        } finally {
            setUpdatingId(null);
        }
    };

    const currentPage = Number(meta.current_page) || page;
    const lastPage = Math.max(1, Number(meta.last_page) || 1);
    const total = Number(meta.total) || 0;
    const firstItem = total ? (currentPage - 1) * pageSize + 1 : 0;
    const lastItem = Math.min(currentPage * pageSize, total);

    return (
        <div className="space-y-6 text-green-dark">
            <header>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Administrator</p>
                <h1 className="mt-1 font-display text-3xl font-semibold">Kelola Laporan</h1>
                <p className="mt-1 text-sm text-muted">Kelola dan pantau seluruh laporan masyarakat.</p>
            </header>

            {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            {notice && <div role="status" className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">{notice}</div>}

            <section className="rounded-xl border border-cream-dark bg-white p-5">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <label className="text-xs font-bold text-muted">Kecamatan
                        <select value={district} onChange={(event) => { setDistrict(event.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="">Semua Kecamatan</option>
                            {districts.map((item) => <option key={item.id || item.name} value={item.name}>{item.name}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Kategori
                        <select value={categoryId} onChange={(event) => { setCategoryId(event.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="">Semua Kategori</option>
                            {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Status
                        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="">Semua Status</option>
                            {Object.entries(statusLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Urutkan
                        <select value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-cream-dark bg-white px-3 py-2.5 text-sm font-normal text-green-dark outline-none focus:border-green-mid">
                            <option value="newest">Tanggal terbaru</option>
                            <option value="oldest">Tanggal terlama</option>
                            <option value="priority">Priority tertinggi</option>
                        </select>
                    </label>
                    <label className="text-xs font-bold text-muted">Cari laporan
                        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Cari judul laporan..." className="mt-1.5 w-full rounded-lg border border-cream-dark px-3 py-2.5 text-sm font-normal text-green-dark outline-none placeholder:text-muted/70 focus:border-green-mid" />
                    </label>
                </div>
                {(district || categoryId || status || search || sort !== 'newest') && <button type="button" onClick={resetFilters} className="mt-4 text-xs font-semibold text-accent hover:underline">✕ Reset filter</button>}
            </section>

            <section className="overflow-hidden rounded-xl border border-cream-dark bg-white">
                <div className="border-b border-cream-dark px-5 py-4"><h2 className="font-display text-xl font-semibold">Daftar Laporan Warga</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-green-dark text-xs uppercase tracking-wider text-white"><tr>
                            {['ID', 'Judul', 'Tanggal Laporan', 'Kategori', 'Priority Score', 'Status', 'Aksi'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}
                        </tr></thead>
                        <tbody>
                            {reports.map((report) => {
                                const allowedNext = transitions[report.status] || [];
                                return (
                                    <tr key={report.id} className="border-b border-cream-dark last:border-0 hover:bg-cream/70">
                                        <td className="px-4 py-4 font-semibold text-muted">#{report.id}</td>
                                        <td className="max-w-xs px-4 py-4 font-semibold">{report.title}</td>
                                        <td className="px-4 py-4 text-muted">{dateLabel(report.created_at)}</td>
                                        <td className="px-4 py-4 text-muted">{report.category?.name || '-'}</td>
                                        <td className="px-4 py-4"><Priority value={report.priority_score} /></td>
                                        <td className="px-4 py-4">
                                            {allowedNext.length ? (
                                                <select
                                                    aria-label={`Ubah status laporan ${report.title}`}
                                                    value={report.status}
                                                    disabled={updatingId === report.id}
                                                    onChange={(event) => updateStatus(report, event.target.value)}
                                                    className={`rounded-full border-0 px-3 py-2 text-xs font-semibold outline-none disabled:opacity-60 ${statusStyles[report.status] || 'bg-gray-100 text-gray-700'}`}
                                                >
                                                    <option value={report.status}>{statusLabels[report.status] || report.status}</option>
                                                    {allowedNext.map((next) => <option key={next} value={next}>{statusLabels[next]}</option>)}
                                                </select>
                                            ) : (
                                                <span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.status] || 'bg-gray-100 text-gray-700'}`}>{statusLabels[report.status] || report.status}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4"><Link to={`/admin/reports/${report.id}`} className="whitespace-nowrap font-bold text-green-mid hover:underline">◉ Detail</Link></td>
                                    </tr>
                                );
                            })}
                            {!loading && reports.length === 0 && <tr><td colSpan="7" className="px-5 py-10 text-center text-sm text-muted">Tidak ada laporan yang sesuai dengan filter.</td></tr>}
                            {loading && <tr><td colSpan="7" className="px-5 py-10 text-center text-sm text-muted">Memuat laporan...</td></tr>}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-cream-dark px-5 py-4 text-xs text-muted">
                    <span>Menampilkan <strong>{firstItem}</strong>–<strong>{lastItem}</strong> dari <strong>{total}</strong> laporan</span>
                    <div className="flex items-center gap-2">
                        <button type="button" disabled={currentPage <= 1 || loading} onClick={() => setPage((value) => Math.max(1, value - 1))} className="rounded-lg border border-cream-dark px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40">Sebelumnya</button>
                        <span className="px-2">Halaman {currentPage} / {lastPage}</span>
                        <button type="button" disabled={currentPage >= lastPage || loading} onClick={() => setPage((value) => Math.min(lastPage, value + 1))} className="rounded-lg border border-cream-dark px-3 py-2 font-semibold disabled:cursor-not-allowed disabled:opacity-40">Berikutnya</button>
                    </div>
                </div>
            </section>
        </div>
    );
}
