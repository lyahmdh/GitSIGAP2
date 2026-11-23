
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function AdminReportDetail() {
    const { id } = useParams();

    const [status, setStatus] = useState('Masuk');
    const [notes, setNotes] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdate = (e) => {
        e.preventDefault();
        setMessage(`Status laporan berhasil diperbarui menjadi "${status}" (simulasi).`);
    };

    return (
        <div className="space-y-6">
            <div>
                <Link
                    to="/admin/reports"
                    className="text-sm text-blue-600 hover:underline"
                >
                    ← Kembali ke manajemen laporan
                </Link>
                <h1 className="mt-4 text-2xl font-bold text-gray-800">
                    Detail Laporan #{id}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                    Periksa informasi laporan dan perbarui status penanganannya.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        Informasi Laporan
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-500">Judul</p>
                            <p className="font-semibold text-gray-800">
                                Jalan Rusak di Area Perumahan
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Kategori</p>
                            <p className="text-gray-800">Jalan & Transportasi</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pelapor</p>
                            <p className="text-gray-800">Budi Santoso</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Deskripsi</p>
                            <p className="leading-relaxed text-gray-700">
                                Terdapat lubang cukup besar pada jalan yang
                                berpotensi membahayakan pengendara.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Lokasi</p>
                            <p className="text-gray-800">
                                Jl. Melati, Kecamatan Lowokwaru
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tingkat Keparahan</p>
                            <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                                Tinggi
                            </span>
                        </div>
                    </div>
                </section>

                <section className="h-fit rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        Perbarui Status
                    </h2>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Status Laporan
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                            >
                                <option>Masuk</option>
                                <option>Diverifikasi</option>
                                <option>Ditindaklanjuti</option>
                                <option>Selesai</option>
                                <option>Ditolak</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Catatan Admin
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows="4"
                                placeholder="Tambahkan catatan penanganan..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                            />
                        </div>

                        {message && (
                            <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                {message}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                        >
                            Simpan Perubahan
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}
