
import { Link, useParams } from 'react-router-dom';

const report = {
    id: 1,
    title: 'Jalan Rusak di Area Perumahan',
    category: 'Jalan & Transportasi',
    description:
        'Terdapat kerusakan jalan berupa lubang yang cukup besar di area perumahan. Kondisi ini berpotensi membahayakan pengendara, terutama saat malam hari.',
    location: 'Jl. Melati, Kecamatan Lowokwaru',
    district: 'Lowokwaru',
    severity: 'Tinggi',
    status: 'Ditindaklanjuti',
    createdAt: '18 November 2026',
    updatedAt: '19 November 2026',
    history: [
        {
            status: 'Masuk',
            date: '18 November 2026, 09.15',
            description: 'Laporan berhasil dikirim dan diterima oleh sistem.',
        },
        {
            status: 'Diverifikasi',
            date: '18 November 2026, 13.20',
            description: 'Laporan telah diperiksa oleh petugas.',
        },
        {
            status: 'Ditindaklanjuti',
            date: '19 November 2026, 10.00',
            description: 'Laporan telah diteruskan kepada instansi terkait.',
        },
    ],
};

const statusColors = {
    Masuk: 'bg-blue-100 text-blue-700',
    Diverifikasi: 'bg-yellow-100 text-yellow-700',
    Ditindaklanjuti: 'bg-purple-100 text-purple-700',
    Selesai: 'bg-green-100 text-green-700',
    Ditolak: 'bg-red-100 text-red-700',
};

export default function ReportDetail() {
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to="/reports"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Kembali ke daftar laporan
                </Link>
                <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm text-gray-500">Laporan #{id}</p>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {report.title}
                        </h1>
                    </div>
                    <span
                        className={`w-fit rounded-full px-4 py-2 text-sm font-medium ${statusColors[report.status]}`}
                    >
                        {report.status}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            Informasi Laporan
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Kategori</p>
                                <p className="font-medium text-gray-800">
                                    {report.category}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Deskripsi</p>
                                <p className="leading-relaxed text-gray-700">
                                    {report.description}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lokasi</p>
                                <p className="font-medium text-gray-800">
                                    {report.location}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tingkat Keparahan</p>
                                <p className="font-medium text-red-600">
                                    {report.severity}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-xl border border-gray-200 bg-white p-6">
                        <h2 className="mb-5 text-lg font-semibold text-gray-800">
                            Riwayat Status
                        </h2>

                        <div className="space-y-6">
                            {report.history.map((item, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="h-3 w-3 rounded-full bg-blue-600" />
                                        {index !== report.history.length - 1 && (
                                            <div className="mt-2 h-full min-h-12 w-0.5 bg-gray-200" />
                                        )}
                                    </div>
                                    <div className="pb-2">
                                        <p className="font-semibold text-gray-800">
                                            {item.status}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.date}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="h-fit rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-4 font-semibold text-gray-800">
                        Ringkasan
                    </h2>
                    <div className="space-y-4 text-sm">
                        <div>
                            <p className="text-gray-500">Tanggal dibuat</p>
                            <p className="font-medium text-gray-800">
                                {report.createdAt}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Terakhir diperbarui</p>
                            <p className="font-medium text-gray-800">
                                {report.updatedAt}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Kecamatan</p>
                            <p className="font-medium text-gray-800">
                                {report.district}
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
