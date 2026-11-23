
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';

const sampleReports = [
    { id: 1, title: 'Kerusakan Jalan di Area Permukiman', category: 'Jalan & Transportasi', status: 'diverifikasi', date: '20 Nov 2026' },
    { id: 2, title: 'Lampu Penerangan Tidak Berfungsi', category: 'Penerangan Umum', status: 'ditindaklanjuti', date: '18 Nov 2026' },
    { id: 3, title: 'Saluran Drainase Tersumbat', category: 'Air & Drainase', status: 'selesai', date: '15 Nov 2026' },
    { id: 4, title: 'Fasilitas Taman Rusak', category: 'Ruang Publik', status: 'ditolak', date: '12 Nov 2026' },
];

export default function Reports() {
    const [filter, setFilter] = useState('semua');
    const [search, setSearch] = useState('');

    const filteredReports = sampleReports.filter((report) => {
        const matchesStatus = filter === 'semua' || report.status === filter;
        const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    return (
        <div>
            <PageHeader
                title="Laporan Saya"
                description="Kelola dan pantau seluruh pengaduan yang pernah kamu sampaikan."
                action={
                    <Link
                        to="/reports/create"
                        className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white"
                    >
                        + Buat Laporan
                    </Link>
                }
            />

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="flex flex-col gap-4 md:flex-row">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari judul laporan..."
                        className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-600"
                    />

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="rounded-lg border border-slate-300 px-4 py-3 text-sm"
                    >
                        <option value="semua">Semua Status</option>
                        <option value="masuk">Masuk</option>
                        <option value="diverifikasi">Diverifikasi</option>
                        <option value="ditindaklanjuti">Ditindaklanjuti</option>
                        <option value="selesai">Selesai</option>
                        <option value="ditolak">Ditolak</option>
                    </select>
                </div>

                <div className="mt-6 space-y-3">
                    {filteredReports.length > 0 ? (
                        filteredReports.map((report) => (
                            <article
                                key={report.id}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-slate-100 p-5 md:flex-row md:items-center"
                            >
                                <div>
                                    <p className="text-xs text-slate-400">
                                        {report.category} · {report.date}
                                    </p>
                                    <h3 className="mt-2 font-bold text-slate-800">
                                        {report.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-4">
                                    <StatusBadge status={report.status} />
                                    <Link
                                        to={`/reports/${report.id}`}
                                        className="text-sm font-semibold text-emerald-700"
                                    >
                                        Detail →
                                    </Link>
                                </div>
                            </article>
                        ))
                    ) : (
                        <div className="py-12 text-center text-sm text-slate-500">
                            Tidak ada laporan yang sesuai dengan pencarian.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
