
import { useState } from 'react';

const districts = [
    { name: 'Blimbing', count: 24 },
    { name: 'Kedungkandang', count: 18 },
    { name: 'Klojen', count: 32 },
    { name: 'Lowokwaru', count: 41 },
    { name: 'Sukun', count: 15 },
];

export default function MapReports() {
    const [selectedDistrict, setSelectedDistrict] = useState('Semua Kecamatan');

    const filteredDistricts =
        selectedDistrict === 'Semua Kecamatan'
            ? districts
            : districts.filter((item) => item.name === selectedDistrict);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                    Peta Sebaran Laporan
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Lihat persebaran laporan masyarakat berdasarkan wilayah.
                </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
                <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2.5"
                >
                    <option>Semua Kecamatan</option>
                    {districts.map((district) => (
                        <option key={district.name}>{district.name}</option>
                    ))}
                </select>
            </div>

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex h-[420px] flex-col items-center justify-center bg-gray-100 p-6 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.553 2.776A1 1 0 0022 18.882V7.618a1 1 0 00-.447-.894L15 4m0 13V4m0 0L9 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Area Peta SIGAP
                    </h2>
                    <p className="mt-2 max-w-md text-sm text-gray-500">
                        Peta interaktif akan ditampilkan di sini setelah
                        integrasi Leaflet dan data koordinat laporan selesai.
                    </p>
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                    Ringkasan Laporan per Kecamatan
                </h2>

                <div className="space-y-4">
                    {filteredDistricts.map((district) => (
                        <div key={district.name}>
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="font-medium text-gray-700">
                                    {district.name}
                                </span>
                                <span className="text-gray-500">
                                    {district.count} laporan
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{
                                        width: `${(district.count / 41) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
