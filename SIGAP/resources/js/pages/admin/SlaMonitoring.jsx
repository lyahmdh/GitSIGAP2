import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const initialReports = [
    { id: 1, title: 'Jalan berlubang di Lowokwaru', district: 'Lowokwaru', status: 'diverifikasi', elapsed: 4, limit: 5 },
    { id: 2, title: 'Lampu jalan tidak menyala', district: 'Klojen', status: 'masuk', elapsed: 7, limit: 5 },
    { id: 3, title: 'Saluran drainase tersumbat', district: 'Blimbing', status: 'ditindaklanjuti', elapsed: 2, limit: 5 },
    { id: 4, title: 'Kerusakan fasilitas taman', district: 'Sukun', status: 'ditindaklanjuti', elapsed: 3, limit: 5 },
    { id: 5, title: 'Jalan rusak dekat sekolah', district: 'Lowokwaru', status: 'masuk', elapsed: 6, limit: 5 },
];
const labels = { masuk: 'Masuk', diverifikasi: 'Diverifikasi', ditindaklanjuti: 'Ditindaklanjuti', selesai: 'Selesai', ditolak: 'Ditolak' };
const statusStyles = { masuk: 'bg-amber-100 text-amber-800', diverifikasi: 'bg-violet-100 text-violet-800', ditindaklanjuti: 'bg-blue-100 text-blue-800', selesai: 'bg-green-100 text-green-800', ditolak: 'bg-red-100 text-red-800' };
const conditionOf = (report) => report.elapsed > report.limit ? 'late' : report.elapsed >= report.limit - 1 ? 'near' : 'safe';
const conditions = {
    safe: { label: 'Dalam batas SLA', description: (remaining) => `Sisa ${remaining} hari`, style: 'bg-green-50 text-green-800', dot: 'bg-green-600' },
    near: { label: 'Mendekati SLA', description: (remaining) => `Sisa ${remaining} hari`, style: 'bg-amber-50 text-amber-800', dot: 'bg-amber-500' },
    late: { label: 'Melewati SLA', description: (remaining) => `Terlambat ${Math.abs(remaining)} hari`, style: 'bg-red-50 text-red-800', dot: 'bg-red-600' },
};

export default function SlaMonitoring() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [reports] = useState(initialReports);
    const monitored = useMemo(() => reports.map((report) => ({ ...report, condition: conditionOf(report), remaining: report.limit - report.elapsed })), [reports]);
    const counts = { safe: monitored.filter((item) => item.condition === 'safe').length, near: monitored.filter((item) => item.condition === 'near').length, late: monitored.filter((item) => item.condition === 'late').length };
    const visible = monitored.filter((item) => (filter === 'all' || item.condition === filter) && item.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6 text-green-dark">
            <header>
                <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Administrator</p>
                <h1 className="mt-1 font-display text-3xl font-semibold">Monitoring SLA</h1>
                <p className="mt-1 text-sm text-muted">Pantau ketepatan waktu penanganan laporan masyarakat.</p>
            </header>

            <section className="grid gap-4 md:grid-cols-3">
                {[
                    { key: 'safe', title: 'Dalam Batas SLA', value: counts.safe, icon: '✓', description: 'Penanganan masih sesuai target' },
                    { key: 'near', title: 'Mendekati SLA', value: counts.near, icon: '◷', description: 'Perlu segera ditindaklanjuti' },
                    { key: 'late', title: 'Melewati SLA', value: counts.late, icon: '!', description: 'Sudah melewati batas waktu' },
                ].map((item) => <article key={item.key} className="rounded-xl border border-cream-dark bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-wider text-muted">{item.title}</p><span className={`flex h-9 w-9 items-center justify-center rounded-lg text-lg font-bold ${conditions[item.key].style}`}>{item.icon}</span></div>
                    <p className="mt-3 font-display text-4xl font-semibold">{item.value}</p><p className="mt-1 text-xs text-muted">{item.description}</p>
                </article>)}
            </section>

            <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
                    <div><h2 className="font-display text-xl font-semibold">Daftar Pemantauan Laporan</h2><p className="mt-1 text-sm text-muted">Batas SLA contoh pada tampilan ini adalah 5 hari.</p></div>
                    <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama laporan..." className="w-full rounded-lg border border-cream-dark px-3 py-2.5 text-sm outline-none focus:border-green-mid md:max-w-xs" />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                    {[['all', 'Semua'], ['safe', 'Dalam batas SLA'], ['near', 'Mendekati SLA'], ['late', 'Melewati SLA']].map(([key, label]) => <button key={key} type="button" onClick={() => setFilter(key)} className={`rounded-full px-3 py-2 text-xs font-semibold transition ${filter === key ? 'bg-green-dark text-white' : 'bg-cream text-muted hover:bg-green-pale hover:text-green-dark'}`}>{label}</button>)}
                </div>
                <div className="mt-5 overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                        <thead className="bg-green-dark text-xs uppercase tracking-wider text-white"><tr>{['Laporan', 'Status', 'Waktu Berjalan', 'Batas SLA', 'Kondisi', 'Aksi'].map((label) => <th key={label} className="px-4 py-3">{label}</th>)}</tr></thead>
                        <tbody>{visible.map((report) => {
                            const condition = conditions[report.condition];
                            return <tr key={report.id} className="border-b border-cream-dark last:border-0 hover:bg-cream/70">
                                <td className="px-4 py-4"><p className="font-semibold">{report.title}</p><p className="mt-1 text-xs text-muted">Kecamatan {report.district}</p></td>
                                <td className="px-4 py-4"><span className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[report.status]}`}>{labels[report.status]}</span></td>
                                <td className="px-4 py-4 text-muted">{report.elapsed} hari</td>
                                <td className="px-4 py-4 text-muted">{report.limit} hari</td>
                                <td className="px-4 py-4"><span className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${condition.style}`}><span className={`h-1.5 w-1.5 rounded-full ${condition.dot}`} />{condition.label}</span><p className="mt-1 text-xs text-muted">{condition.description(report.remaining)}</p></td>
                                <td className="px-4 py-4"><Link to={`/admin/reports/${report.id}`} className="font-bold text-green-mid hover:underline">Detail →</Link></td>
                            </tr>;
                        })}</tbody>
                    </table>
                    {!visible.length && <p className="py-10 text-center text-sm text-muted">Tidak ada laporan yang sesuai.</p>}
                </div>
            </section>
        </div>
    );
}
