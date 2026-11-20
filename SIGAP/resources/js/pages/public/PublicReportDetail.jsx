
import { Link, useParams } from 'react-router-dom';

const report = {
    id: 1,
    title: 'Jalan Rusak di Area Perumahan',
    category: 'Jalan & Transportasi',
    description:
        'Terdapat beberapa lubang pada jalan di area perumahan yang mengganggu aktivitas masyarakat. Kerusakan semakin membesar akibat hujan dan berpotensi membahayakan pengendara yang melintas, terutama pada malam hari.',
    location: 'Jl. Melati, Kecamatan Lowokwaru, Kota Malang',
    district: 'Lowokwaru',
    date: '20 November 2026',
    status: 'Ditindaklanjuti',
    history: [
        {
            status: 'Masuk',
            date: '20 November 2026, 09.15',
            description:
                'Laporan berhasil dikirim dan diterima oleh sistem SIGAP.',
        },
        {
            status: 'Diverifikasi',
            date: '20 November 2026, 11.30',
            description:
                'Laporan telah diperiksa dan dinyatakan valid oleh petugas.',
        },
        {
            status: 'Ditindaklanjuti',
            date: '20 November 2026, 14.00',
            description:
                'Laporan telah diteruskan kepada instansi terkait untuk ditangani.',
        },
    ],
};

const statusColors = {
    Masuk: 'bg-blue-100 text-blue-700',
    Diverifikasi: 'bg-yellow-100 text-yellow-700',
    Ditindaklanjuti: 'bg-purple-100 text-purple-700',
    Selesai: 'bg-green-100 text-green-700',
};

export default function PublicReportDetail() {
    const { id } = useParams();

    // Data sementara. Nantinya diambil dari API berdasarkan ID.
    const currentReport = { ...report, id };

    return (
        <div className="bg-gray-50">
            <section className="bg-blue-700 px-4 py-10 text-white">
                <div className="mx-auto max-w-7xl">
                    <Link
                        to="/laporan"
                        className="text-sm text-blue-100 hover:text-white"
                    >
                        ← Kembali ke daftar laporan
                    </Link>

                    <p className="mt-6 text-sm text-blue-100">
                        Detail Laporan #{currentReport.id}
                    </p>

                    <h1 className="mt-2 max-w-3xl text-2xl font-bold sm:text-3xl">
                        {currentReport.title}
                    </h1>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-white/15 px-3 py-1 text-sm">
                            {currentReport.category}
                        </span>

                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${
                                statusColors[currentReport.status] ??
                                'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {currentReport.status}
                        </span>
                    </div>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <section className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-5 text-lg font-semibold text-gray-800">
                                Informasi Laporan
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Deskripsi
                                    </p>
                                    <p className="mt-2 leading-relaxed text-gray-700">
                                        {currentReport.description}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm text-gray-500">
                                        Lokasi Kejadian
                                    </p>
                                    <p className="mt-2 font-medium text-gray-800">
                                        📍 {currentReport.location}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm text-gray-500">
                                        Kecamatan
                                    </p>
                                    <p className="mt-2 font-medium text-gray-800">
                                        {currentReport.district}
                                    </p>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <p className="text-sm text-gray-500">
                                        Tanggal Laporan
                                    </p>
                                    <p className="mt-2 font-medium text-gray-800">
                                        {currentReport.date}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-6 text-lg font-semibold text-gray-800">
                                Riwayat Penanganan
                            </h2>

                            <div className="space-y-6">
                                {currentReport.history.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                                {index + 1}
                                            </div>

                                            {index !== currentReport.history.length - 1 && (
                                                <div className="mt-2 h-full min-h-12 w-0.5 bg-gray-200" />
                                            )}
                                        </div>

                                        <div className="pb-2">
                                            <h3 className="font-semibold text-gray-800">
                                                {item.status}
                                            </h3>

                                            <p className="mt-1 text-xs text-gray-500">
                                                {item.date}
                                            </p>

                                            <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-4 font-semibold text-gray-800">
                                Status Penanganan
                            </h2>

                            <div className="rounded-lg bg-purple-50 p-4">
                                <p className="text-sm text-purple-600">
                                    Status Saat Ini
                                </p>
                                <p className="mt-1 text-lg font-bold text-purple-800">
                                    {currentReport.status}
                                </p>
                            </div>

                            <p className="mt-4 text-sm leading-relaxed text-gray-500">
                                Masyarakat dapat memantau perkembangan
                                penanganan laporan melalui halaman ini.
                            </p>
                        </section>

                        <section className="rounded-xl border border-gray-200 bg-white p-6">
                            <h2 className="mb-3 font-semibold text-gray-800">
                                Transparansi Publik
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-600">
                                SIGAP menyediakan informasi perkembangan
                                laporan agar masyarakat dapat mengetahui
                                proses penanganan permasalahan fasilitas
                                publik.
                            </p>
                        </section>

                        <Link
                            to="/laporan"
                            className="block rounded-lg border border-blue-600 px-4 py-3 text-center text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                        >
                            Lihat Laporan Lainnya
                        </Link>
                    </aside>
                </div>
            </main>
        </div>
    );
}
