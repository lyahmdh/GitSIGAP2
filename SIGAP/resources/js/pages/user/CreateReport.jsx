
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CreateReport() {
    const [form, setForm] = useState({
        category_id: '',
        title: '',
        description: '',
        severity: '2',
        location_detail: '',
        district: '',
        latitude: '',
        longitude: '',
        anonymous: false,
        images: [],
    });

    function updateField(name, value) {
        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleImages(event) {
        const files = Array.from(event.target.files || []);

        setForm((previous) => ({
            ...previous,
            images: files.slice(0, 5),
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        // Integrasi API akan dilakukan pada batch backend.
        console.log('Data formulir laporan:', form);
    }

    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8">
                <Link to="/reports" className="text-sm font-medium text-emerald-700">
                    ← Kembali ke laporan
                </Link>

                <h1 className="mt-4 text-2xl font-bold text-slate-900">
                    Buat Laporan Baru
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Sampaikan permasalahan fasilitas publik agar dapat ditindaklanjuti.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="font-bold text-slate-900">Informasi Laporan</h2>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Kategori Laporan
                            </label>
                            <select
                                required
                                value={form.category_id}
                                onChange={(e) => updateField('category_id', e.target.value)}
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                            >
                                <option value="">Pilih kategori</option>
                                <option value="1">Jalan & Transportasi</option>
                                <option value="2">Air & Drainase</option>
                                <option value="3">Ruang Publik</option>
                                <option value="4">Penerangan Umum</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Judul Laporan
                            </label>
                            <input
                                required
                                maxLength={150}
                                value={form.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="Contoh: Jalan berlubang di sekitar..."
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Deskripsi Permasalahan
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={form.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                placeholder="Jelaskan permasalahan secara rinci..."
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Tingkat Keparahan
                            </label>
                            <select
                                value={form.severity}
                                onChange={(e) => updateField('severity', e.target.value)}
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                            >
                                <option value="1">Rendah</option>
                                <option value="2">Sedang</option>
                                <option value="3">Tinggi</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="font-bold text-slate-900">Lokasi Kejadian</h2>

                    <div className="mt-5 space-y-5">
                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Detail Lokasi
                            </label>
                            <input
                                required
                                value={form.location_detail}
                                onChange={(e) => updateField('location_detail', e.target.value)}
                                placeholder="Nama jalan, patokan, atau alamat..."
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700">
                                Kecamatan
                            </label>
                            <input
                                value={form.district}
                                onChange={(e) => updateField('district', e.target.value)}
                                placeholder="Masukkan kecamatan..."
                                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3"
                            />
                        </div>

                        <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 p-6">
                            <p className="font-semibold text-slate-800">
                                Pinpoint Lokasi
                            </p>
                            <p className="mt-2 text-sm text-slate-500">
                                Area peta interaktif akan ditambahkan pada integrasi Leaflet dan Turf.js.
                            </p>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-xs font-semibold text-slate-600">Latitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.latitude}
                                        onChange={(e) => updateField('latitude', e.target.value)}
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-600">Longitude</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={form.longitude}
                                        onChange={(e) => updateField('longitude', e.target.value)}
                                        className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="font-bold text-slate-900">Bukti Pendukung</h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Unggah maksimal 5 foto dengan format JPG atau PNG.
                    </p>

                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={handleImages}
                        className="mt-5 block w-full text-sm text-slate-600"
                    />

                    <p className="mt-2 text-xs text-slate-400">
                        {form.images.length} dari 5 foto dipilih.
                    </p>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <label className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            checked={form.anonymous}
                            onChange={(e) => updateField('anonymous', e.target.checked)}
                            className="mt-1"
                        />
                        <span>
                            <span className="block text-sm font-semibold text-slate-800">
                                Kirim sebagai laporan anonim
                            </span>
                            <span className="mt-1 block text-xs text-slate-500">
                                Identitas pelapor tidak ditampilkan pada informasi publik laporan.
                            </span>
                        </span>
                    </label>
                </section>

                <div className="flex justify-end gap-3">
                    <Link
                        to="/reports"
                        className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700"
                    >
                        Batal
                    </Link>

                    <button
                        type="submit"
                        className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white"
                    >
                        Simpan Laporan
                    </button>
                </div>
            </form>
        </div>
    );
}
