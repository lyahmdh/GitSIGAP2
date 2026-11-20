
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const reports = [
    {
        id: 1,
        title: 'Jalan Rusak di Area Perumahan',
        category: 'Jalan & Transportasi',
        description:
            'Terdapat beberapa lubang pada jalan yang membahayakan pengendara.',
        location: 'Lowokwaru, Kota Malang',
        date: '20 November 2026',
        status: 'Ditindaklanjuti',
    },
    {
        id: 2,
        title: 'Lampu Penerangan Jalan Tidak Menyala',
        category: 'Penerangan Umum',
        description:
            'Lampu penerangan jalan sudah beberapa hari tidak berfungsi.',
        location: 'Klojen, Kota Malang',
        date: '19 November 2026',
        status: 'Diverifikasi',
    },
    {
        id: 3,
        title: 'Saluran Drainase Tersumbat',
        category: 'Air & Drainase',
        description:
            'Saluran air tersumbat oleh sampah sehingga air tidak mengalir dengan baik.',
        location: 'Sukun, Kota Malang',
        date: '18 November 2026',
        status: 'Selesai',
    },
    {
        id: 4,
        title: 'Kerusakan Fasilitas Taman Kota',
        category: 'Ruang Publik',
        description:
            'Beberapa fasilitas tempat duduk di taman mengalami kerusakan.',
        location: 'Kedungkandang, Kota Malang',
        date: '17 November 2026',
        status: 'Masuk',
    },
    {
        id: 5,
        title: 'Jalan Berlubang Dekat Sekolah',
        category: 'Jalan & Transportasi',
        description:
            'Kondisi jalan berlubang mengganggu akses menuju lingkungan sekolah.',
        location: 'Blimbing, Kota Malang',
        date: '16 November 2026',
        status: 'Ditindaklanjuti',
    },
    {
        id: 6,
        title: 'Kebocoran Saluran Air',
        category: 'Air & Drainase',
        description:
            'Terdapat kebocoran pada saluran air yang menyebabkan genangan.',
        location: 'Lowokwaru, Kota Malang',
        date: '15 November 2026',
        status: 'Selesai',
    },
];

const categories = [
    'Semua Kategori',
    'Jalan & Transportasi',
    'Air & Drainase',
    'Ruang Publik',
    'Penerangan Umum',
];

const statusColors = {
    Masuk: 'bg-blue-100 text-blue-700',
    Diverifikasi: 'bg-yellow-100 text-yellow-700',
    Ditindaklanjuti: 'bg-purple-100 text-purple-700',
    Selesai: 'bg-green-100 text-green-700',
};

function ReportCard({ report }) {
    return (
        <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex items-start justify-between gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    {report.category}
                </span>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                        statusColors[report.status] ??
                        'bg-gray-100 text-gray-600'
                    }`}
                >
                    {report.status}
                </span>
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
                {report.title}
            </h2>

            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                {report.description}
            </p>

            <div className="mt-4 space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                    <span>📍</span>
                    {report.location}
                </p>
                <p className="flex items-center gap-2">
                    <span>📅</span>
                    {report.date}
                </p>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-4">
                <Link
                    to={`/laporan/${report.id}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
                >
                    Lihat Detail
                    <span>→</span>
                </Link>
            </div>
        </article>
    );
}

export default function PublicReports() {
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('Semua Kategori');
    const [status, setStatus] = useState('Semua Status');

    const filteredReports = useMemo(() => {
        return reports.filter((report) => {
            const keyword = search.toLowerCase();

            const matchesSearch =
                report.title.toLowerCase().includes(keyword) ||
                report.description.toLowerCase().includes(keyword) ||
                report.location.toLowerCase().includes(keyword);

            const matchesCategory =
                category === 'Semua Kategori' ||
                report.category === category;

            const matchesStatus =
                status === 'Semua Status' || report.status === status;

            // Laporan yang ditolak tidak ditampilkan ke publik.
            return (
                matchesSearch &&
                matchesCategory &&
                matchesStatus &&
                report.status !== 'Ditolak'
            );
        });
    }, [search, category, status]);

    return (
        <div className="bg-gray-50">
            <section className="bg-blue-700 px-4 py-14 text-white">
                <div className="mx-auto max-w-7xl">
                    <p className="text-sm font-medium text-blue-100">
                        Transparansi Penanganan Pengaduan
                    </p>

                    <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                        Laporan Masyarakat
                    </h1>

                    <p className="mt-4 max-w-2xl leading-relaxed text-blue-100">
                        Pantau berbagai laporan kerusakan fasilitas dan
                        permasalahan infrastruktur publik yang disampaikan
                        masyarakat.
                    </p>

                    <div className="mt-6">
                        <span className="rounded-lg bg-white/15 px-4 py-2 text-sm">
                            {filteredReports.length} laporan ditemukan
                        </span>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 py-10">
                <section className="mb-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h2 className="mb-4 font-semibold text-gray-800">
                        Cari dan Filter Laporan
                    </h2>

                    <div className="grid gap-4 md:grid-cols-3">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari judul, deskripsi, atau lokasi..."
                            className="rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >
                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >
                            <option>Semua Status</option>
                            <option>Masuk</option>
                            <option>Diverifikasi</option>
                            <option>Ditindaklanjuti</option>
                            <option>Selesai</option>
                        </select>
                    </div>

                    {(search || category !== 'Semua Kategori' || status !== 'Semua Status') && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearch('');
                                setCategory('Semua Kategori');
                                setStatus('Semua Status');
                            }}
                            className="mt-4 text-sm font-medium text-blue-600 hover:underline"
                        >
                            Reset filter
                        </button>
                    )}
                </section>

                {filteredReports.length > 0 ? (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredReports.map((report) => (
                            <ReportCard key={report.id} report={report} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                        <div className="text-4xl">🔍</div>
                        <h2 className="mt-4 text-lg font-semibold text-gray-800">
                            Laporan Tidak Ditemukan
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Coba gunakan kata kunci atau filter yang berbeda.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
