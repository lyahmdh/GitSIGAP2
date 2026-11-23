
import { Link } from 'react-router-dom';

const statistics = [
    { label: 'Total Laporan', value: '248', color: 'bg-blue-50 text-blue-700' },
    { label: 'Menunggu Verifikasi', value: '32', color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Ditindaklanjuti', value: '76', color: 'bg-purple-50 text-purple-700' },
    { label: 'Selesai', value: '128', color: 'bg-green-50 text-green-700' },
];

const recentReports = [
    { id: 1, title: 'Jalan berlubang di Lowokwaru', category: 'Jalan & Transportasi', date: '20 Nov 2026', status: 'Masuk' },
    { id: 2, title: 'Lampu jalan tidak menyala', category: 'Penerangan Umum', date: '19 Nov 2026', status: 'Diverifikasi' },
    { id: 3, title: 'Saluran air tersumbat', category: 'Air & Drainase', date: '18 Nov 2026', status: 'Ditindaklanjuti' },
];

const statusColors = {
    Masuk: 'bg-blue-100 text-blue-700',
    Diverifikasi: 'bg-yellow-100 text-yellow-700',
    Ditindaklanjuti: 'bg-purple-100 text-purple-700',
};

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard Admin
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Ringkasan pengelolaan laporan masyarakat.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statistics.map((item) => (
                    <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-5">
                        <p className="text-sm text-gray-500">{item.label}</p>
                        <p className={`mt-3 text-3xl font-bold ${item.color.split(' ')[1]}`}>
                            {item.value}
                        </p>
                    </div>
                ))}
            </div>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Laporan Terbaru
                        </h2>
                        <p className="text-sm text-gray-500">
                            Laporan yang baru masuk ke sistem.
                        </p>
                    </div>
                    <Link
                        to="/admin/reports"
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Lihat semua
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left text-sm">
                        <thead className="border-b bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Judul</th>
                                <th className="px-4 py-3">Kategori</th>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentReports.map((report) => (
                                <tr key={report.id} className="border-b last:border-0">
                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {report.title}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {report.category}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {report.date}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[report.status]}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Link
                                            to={`/admin/reports/${report.id}`}
                                            className="font-medium text-blue-600 hover:underline"
                                        >
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
