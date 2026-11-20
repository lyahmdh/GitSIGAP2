import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const stats = {
    total: 248,
    masuk: 32,
    diverifikasi: 42,
    ditindaklanjuti: 46,
    selesai: 128,
    ditolak: 0,
};

const recentReports = [
    { id: 1, title: 'Jalan berlubang di Lowokwaru', date: '20/11/2026', category: 'Jalan & Transportasi', priority: 86, status: 'masuk' },
    { id: 2, title: 'Lampu jalan tidak menyala', date: '19/11/2026', category: 'Penerangan Umum', priority: 65, status: 'diverifikasi' },
    { id: 3, title: 'Saluran air tersumbat', date: '18/11/2026', category: 'Air & Drainase', priority: 48, status: 'ditindaklanjuti' },
    { id: 4, title: 'Kerusakan fasilitas taman', date: '17/11/2026', category: 'Ruang Publik', priority: 32, status: 'selesai' },
];

const chartColors = ['#D6A15D', '#8B6B45', '#6B8F71', '#294B32', '#B85C4A'];
const chartLabels = ['Masuk', 'Diverifikasi', 'Ditindaklanjuti', 'Selesai', 'Ditolak'];
const statusKeys = ['masuk', 'diverifikasi', 'ditindaklanjuti', 'selesai', 'ditolak'];
const statusStyles = {
    masuk: 'bg-amber-100 text-amber-800',
    diverifikasi: 'bg-violet-100 text-violet-800',
    ditindaklanjuti: 'bg-blue-100 text-blue-800',
    selesai: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800',
};
const formatStatus = (status) => status === 'ditindaklanjuti' ? 'Ditindaklanjuti' : status.charAt(0).toUpperCase() + status.slice(1);

function Priority({ value }) {
    const style = value >= 70 ? 'bg-red-50 text-red-700' : value >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700';
    return <span className={`inline-flex min-w-10 justify-center rounded-md px-2 py-1 text-xs font-bold ${style}`}>{value}</span>;
}

export default function AdminDashboard() {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return undefined;
        const chart = new Chart(canvasRef.current, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{ data: statusKeys.map((key) => stats[key]), backgroundColor: chartColors, borderWidth: 2, borderColor: '#fff', hoverOffset: 5 }],
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => ` ${context.label}: ${context.raw}` } } } },
        });
        return () => chart.destroy();
    }, []);

    const activeProjects = stats.diverifikasi + stats.ditindaklanjuti;
    const cards = [
        { label: 'Total Laporan Warga', value: stats.total, detail: `${stats.masuk} belum diproses`, icon: '▤' },
        { label: 'Total Proyek Aktif', value: activeProjects, detail: `${stats.diverifikasi} diverifikasi · ${stats.ditindaklanjuti} ditindaklanjuti`, icon: '⌂' },
        { label: 'Total Laporan Selesai', value: stats.selesai, detail: `dari ${stats.total} laporan total`, icon: '✓' },
    ];

    return (
        <div className="space-y-6 text-green-dark">
            <header>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Administrator</p>
                <h1 className="mt-1 font-display text-3xl font-semibold">Dashboard Admin</h1>
                <p className="mt-1 text-sm text-muted">Ringkasan pengelolaan laporan masyarakat.</p>
            </header>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {cards.map((card, index) => (
                    <article key={card.label} className="flex gap-4 rounded-xl border border-cream-dark bg-white p-5 shadow-sm">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl font-bold ${index === 0 ? 'bg-green-pale text-green-mid' : index === 1 ? 'bg-orange-50 text-accent' : 'bg-green-50 text-green-dark'}`}>{card.icon}</div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-muted">{card.label}</p>
                            <p className="mt-1 font-display text-3xl font-semibold leading-tight">{card.value}</p>
                            <p className="mt-1 text-xs text-muted">{card.detail}</p>
                        </div>
                    </article>
                ))}
            </section>

            <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                <h2 className="mb-5 font-display text-xl font-semibold">Statistik Laporan</h2>
                <div className="flex flex-col items-center gap-7 sm:flex-row sm:items-center">
                    <div className="h-44 w-44 shrink-0"><canvas ref={canvasRef} /></div>
                    <div className="w-full space-y-3">
                        {statusKeys.map((key, index) => {
                            const count = stats[key];
                            const percentage = stats.total ? Math.round((count / stats.total) * 100) : 0;
                            return <div key={key} className="flex items-center gap-3 text-sm">
                                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: chartColors[index] }} />
                                <span className="text-muted">{chartLabels[index]}</span>
                                <span className="ml-auto font-bold">{percentage}%</span>
                                <span className="w-9 text-right text-xs text-muted">{count}</span>
                            </div>;
                        })}
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-cream-dark bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-dark px-5 py-4">
                    <h2 className="font-display text-xl font-semibold">Daftar Laporan Warga</h2>
                    <Link to="/admin/reports" className="text-sm font-bold text-green-mid hover:underline">Lihat Semua →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-green-dark text-xs uppercase tracking-wider text-white"><tr>
                            {['ID', 'Judul', 'Tanggal Laporan', 'Kategori', 'Priority Score', 'Status', 'Aksi'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}
                        </tr></thead>
                        <tbody>{recentReports.map((report) => <tr key={report.id} className="border-b border-cream-dark last:border-0 hover:bg-cream/70">
                            <td className="px-4 py-4 font-semibold text-muted">#{String(report.id).padStart(3, '0')}</td>
                            <td className="px-4 py-4 font-semibold">{report.title}</td>
                            <td className="px-4 py-4 text-muted">{report.date}</td>
                            <td className="px-4 py-4 text-muted">{report.category}</td>
                            <td className="px-4 py-4"><Priority value={report.priority} /></td>
                            <td className="px-4 py-4"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.status]}`}>{formatStatus(report.status)}</span></td>
                            <td className="px-4 py-4"><Link to={`/admin/reports/${report.id}`} className="font-bold text-green-mid hover:underline">Detail</Link></td>
                        </tr>)}</tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
