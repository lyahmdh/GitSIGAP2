
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const initialReports = [
    { id: 1, title: 'Jalan berlubang di Lowokwaru', category: 'Jalan & Transportasi', reporter: 'Budi Santoso', date: '20 Nov 2026', status: 'Masuk' },
    { id: 2, title: 'Lampu jalan tidak menyala', category: 'Penerangan Umum', reporter: 'Siti Aminah', date: '19 Nov 2026', status: 'Diverifikasi' },
    { id: 3, title: 'Saluran air tersumbat', category: 'Air & Drainase', reporter: 'Andi Pratama', date: '18 Nov 2026', status: 'Ditindaklanjuti' },
    { id: 4, title: 'Kerusakan fasilitas taman', category: 'Ruang Publik', reporter: 'Dewi Lestari', date: '17 Nov 2026', status: 'Selesai' },
    { id: 5, title: 'Jalan rusak dekat sekolah', category: 'Jalan & Transportasi', reporter: 'Rizky', date: '16 Nov 2026', status: 'Ditolak' },
];

const statusColors = {
    Masuk: 'bg-blue-100 text-blue-700',
    Diverifikasi: 'bg-yellow-100 text-yellow-700',
    Ditindaklanjuti: 'bg-purple-100 text-purple-700',
    Selesai: 'bg-green-100 text-green-700',
    Ditolak: 'bg-red-100 text-red-700',
};

export default function AdminReports() {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('Semua');

    const filteredReports = useMemo(() => {
        return initialReports.filter((report) => {
            const matchesSearch =
                report.title.toLowerCase().includes(search.toLowerCase()) ||
                report.reporter.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                status === 'Semua' || report.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [search, status]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Manajemen Laporan
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Kelola dan pantau seluruh laporan masyarakat.
                </p>
            </div>

            <section className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-5 flex flex-col gap-3 md:flex-row">
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari judul atau nama pelapor..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                    />

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-blue-500"
                    >
                        <option>Semua</option>
                        <option>Masuk</option>
                        <option>Diverifikasi</option>
                        <option>Ditindaklanjuti</option>
                        <option>Selesai</option>
                        <option>Ditolak</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="border-b bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Laporan</th>
                                <th className="px-4 py-3">Pelapor</th>
                                <th className="px-4 py-3">Tanggal</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.map((report) => (
                                <tr key={report.id} className="border-b last:border-0">
                                    <td className="px-4 py-4">
                                        <p className="font-medium text-gray-800">{report.title}</p>
                                        <p className="mt-1 text-xs text-gray-500">{report.category}</p>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{report.reporter}</td>
                                    <td className="px-4 py-4 text-gray-600">{report.date}</td>
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
                                            Kelola
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredReports.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">
                                        Tidak ada laporan yang sesuai.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                    Menampilkan {filteredReports.length} laporan.
                </p>
            </section>
        </div>
    );
}
