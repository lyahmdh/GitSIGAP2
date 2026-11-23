
const slaReports = [
    {
        id: 1,
        title: 'Jalan berlubang di Lowokwaru',
        status: 'Diverifikasi',
        elapsed: '4 hari',
        limit: '5 hari',
        remaining: '1 hari',
        condition: 'Mendekati SLA',
    },
    {
        id: 2,
        title: 'Lampu jalan tidak menyala',
        status: 'Masuk',
        elapsed: '7 hari',
        limit: '5 hari',
        remaining: 'Terlambat 2 hari',
        condition: 'Melewati SLA',
    },
    {
        id: 3,
        title: 'Saluran drainase tersumbat',
        status: 'Ditindaklanjuti',
        elapsed: '2 hari',
        limit: '5 hari',
        remaining: '3 hari',
        condition: 'Dalam batas SLA',
    },
];

const conditionColors = {
    'Dalam batas SLA': 'bg-green-100 text-green-700',
    'Mendekati SLA': 'bg-yellow-100 text-yellow-700',
    'Melewati SLA': 'bg-red-100 text-red-700',
};

export default function SlaMonitoring() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Monitoring SLA
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Pantau ketepatan waktu penanganan laporan masyarakat.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">Dalam Batas SLA</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">18</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">Mendekati SLA</p>
                    <p className="mt-2 text-3xl font-bold text-yellow-600">7</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5">
                    <p className="text-sm text-gray-500">Melewati SLA</p>
                    <p className="mt-2 text-3xl font-bold text-red-600">3</p>
                </div>
            </div>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-5 text-lg font-semibold text-gray-800">
                    Daftar Pemantauan Laporan
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="border-b bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-4 py-3">Laporan</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Waktu Berjalan</th>
                                <th className="px-4 py-3">Batas SLA</th>
                                <th className="px-4 py-3">Kondisi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slaReports.map((report) => (
                                <tr key={report.id} className="border-b last:border-0">
                                    <td className="px-4 py-4 font-medium text-gray-800">
                                        {report.title}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {report.status}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {report.elapsed}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {report.limit}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${conditionColors[report.condition]}`}>
                                            {report.condition}
                                        </span>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {report.remaining}
                                        </p>
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
