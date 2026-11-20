
import { Link } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';

const recentReports = [
    {
        id: 1,
        title: 'Kerusakan Jalan di Area Permukiman',
        category: 'Jalan & Transportasi',
        status: 'diverifikasi',
        date: '20 November 2026',
    },
    {
        id: 2,
        title: 'Lampu Penerangan Jalan Tidak Berfungsi',
        category: 'Penerangan Umum',
        status: 'ditindaklanjuti',
        date: '18 November 2026',
    },
    {
        id: 3,
        title: 'Saluran Drainase Tersumbat',
        category: 'Air & Drainase',
        status: 'selesai',
        date: '15 November 2026',
    },
];

export default function Dashboard() {
    return (
        <div>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-emerald-700">
                        AREA PENGGUNA
                    </p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900">
                        Dashboard Saya
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Pantau laporan dan perkembangan penanganan pengaduanmu.
                    </p>
                </div>

                <Link
                    to="/reports/create"
                    className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
                >
                    + Buat Laporan
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Laporan" value="12" description="Seluruh laporan yang dibuat" />
                <StatCard title="Menunggu Verifikasi" value="3" description="Laporan baru masuk" />
                <StatCard title="Dalam Penanganan" value="5" description="Sedang ditindaklanjuti" />
                <StatCard title="Selesai" value="4" description="Laporan telah diselesaikan" />
            </div>

            <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Aktivitas Laporan Terbaru
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Ringkasan laporan yang terakhir kamu buat.
                        </p>
                    </div>

                    <Link to="/reports" className="text-sm font-semibold text-emerald-700">
                        Lihat semua →
                    </Link>
                </div>

                <div className="mt-6 divide-y divide-slate-100">
                    {recentReports.map((report) => (
                        <div
                            key={report.id}
                            className="flex flex-wrap items-center justify-between gap-4 py-5"
                        >
                            <div className="min-w-0">
                                <p className="text-xs text-slate-400">
                                    {report.category} · {report.date}
                                </p>
                                <h3 className="mt-2 font-semibold text-slate-800">
                                    {report.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <StatusBadge status={report.status} />
                                <Link
                                    to={`/reports/${report.id}`}
                                    className="text-sm font-semibold text-emerald-700"
                                >
                                    Detail
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
