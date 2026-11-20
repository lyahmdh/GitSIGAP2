import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../../services/api';

const markerDefault = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});
const DEFAULT_CENTER = [-7.9666, 112.6326];
const inputClass = 'mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100';

function getDistrict(lat, lng) {
    if (lat < -7.98 && lng > 112.65) return 'Kedungkandang';
    if (lat < -7.93 && lng < 112.62) return 'Lowokwaru';
    if (lat >= -7.97 && lat <= -7.95 && lng >= 112.60 && lng <= 112.65) return 'Klojen';
    if (lat >= -7.93 && lng > 112.62) return 'Blimbing';
    return 'Sukun';
}

export default function CreateReport() {
    const mapElement = useRef(null);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const fileInput = useRef(null);
    const [categories, setCategories] = useState([]);
    const [categoryError, setCategoryError] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [imageError, setImageError] = useState('');
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        const urls = images.map((file) => URL.createObjectURL(file));
        setPreviewUrls(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [images]);

    useEffect(() => {
        let active = true;
        api.get('/api/categories')
            .then(({ data }) => { if (active) setCategories(Array.isArray(data) ? data : data.data || []); })
            .catch(() => { if (active) setCategoryError('Kategori gagal dimuat. Muat ulang halaman atau coba lagi.'); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!mapElement.current || mapRef.current) return undefined;
        const map = L.map(mapElement.current, { scrollWheelZoom: false }).setView(DEFAULT_CENTER, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);
        const marker = L.marker(DEFAULT_CENTER, { draggable: true, icon: markerDefault }).addTo(map);
        map.on('click', (event) => setLocation(event.latlng.lat, event.latlng.lng));
        marker.on('dragend', () => {
            const point = marker.getLatLng();
            setLocation(point.lat, point.lng);
        });
        mapRef.current = map;
        markerRef.current = marker;
        const timer = window.setTimeout(() => map.invalidateSize(), 100);
        return () => {
            window.clearTimeout(timer);
            map.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []);

    function setLocation(lat, lng) {
        const district = getDistrict(lat, lng);
        setCoordinates({ latitude: lat.toFixed(8), longitude: lng.toFixed(8), district });
        markerRef.current?.setLatLng([lat, lng]);
    }

    function useCurrentLocation() {
        if (!navigator.geolocation) {
            window.alert('Geolokasi tidak didukung browser Anda.');
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            ({ coords: point }) => {
                setLocation(point.latitude, point.longitude);
                mapRef.current?.setView([point.latitude, point.longitude], 17);
                setLocating(false);
            },
            () => {
                window.alert('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    }

    function addImages(fileList) {
        const incoming = Array.from(fileList || []);
        const next = [...images];
        let message = '';
        incoming.forEach((file) => {
            if (!['image/jpeg', 'image/png'].includes(file.type)) message = 'Format foto harus JPG atau PNG.';
            else if (file.size > 2 * 1024 * 1024) message = 'Ukuran setiap foto maksimal 2 MB.';
            else if (next.length >= 5) message = 'Maksimal 5 foto yang dapat diunggah.';
            else if (!next.some((item) => item.name === file.name && item.size === file.size)) next.push(file);
        });
        setImages(next);
        setImageError(message);
        const transfer = new DataTransfer();
        next.forEach((file) => transfer.items.add(file));
        if (fileInput.current) fileInput.current.files = transfer.files;
    }

    function removeImage(index) {
        const next = images.filter((_, itemIndex) => itemIndex !== index);
        setImages(next);
        const transfer = new DataTransfer();
        next.forEach((file) => transfer.items.add(file));
        if (fileInput.current) fileInput.current.files = transfer.files;
    }

    function handleSubmit(event) {
        if (!coordinates) {
            event.preventDefault();
            window.alert('Harap pilih lokasi pada peta terlebih dahulu.');
            return;
        }
        if (images.length < 1) {
            event.preventDefault();
            setImageError('Harap unggah minimal 1 foto bukti.');
            return;
        }
        const button = event.currentTarget.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.textContent = 'Mengirim laporan…';
        }
    }

    return (
        <div className="mx-auto max-w-4xl pb-10">
            <div className="mb-7 text-center">
                <Link to="/dashboard" className="text-sm font-semibold text-emerald-700 hover:underline">← Kembali ke Dashboard</Link>
                <h1 className="mt-4 text-3xl font-bold text-slate-900">Buat Laporan</h1>
                <p className="mt-2 text-sm text-slate-500">Sampaikan permasalahan fasilitas publik agar dapat segera ditindaklanjuti.</p>
            </div>

            <form action="/lapor" method="POST" encType="multipart/form-data" onSubmit={handleSubmit} className="space-y-6">
                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.content || ''} />
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="bg-gradient-to-r from-amber-950 to-amber-800 px-6 py-4 text-white">
                        <h2 className="font-bold">Sampaikan Laporan Anda</h2>
                    </div>
                    <div className="space-y-5 p-6">
                        <div>
                            <label htmlFor="category_id" className="text-sm font-semibold text-slate-700">Kategori Laporan <span className="text-red-500">*</span></label>
                            <select id="category_id" name="category_id" required className={inputClass} defaultValue="">
                                <option value="" disabled>Pilih kategori…</option>
                                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                            </select>
                            {categoryError && <p className="mt-2 text-xs text-red-600">{categoryError}</p>}
                        </div>
                        <div>
                            <label htmlFor="title" className="text-sm font-semibold text-slate-700">Judul Laporan <span className="text-red-500">*</span></label>
                            <input id="title" name="title" required maxLength={80} placeholder="Contoh: Jalan Berlubang di Jl. Veteran" className={inputClass} />
                            <p className="mt-1 text-right text-xs text-slate-400">Maksimal 80 karakter</p>
                        </div>
                        <div>
                            <label htmlFor="description" className="text-sm font-semibold text-slate-700">Deskripsi Laporan <span className="text-red-500">*</span></label>
                            <textarea id="description" name="description" required rows={4} placeholder="Jelaskan kondisi kerusakan secara detail, termasuk dampaknya bagi warga…" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700">Lokasi Kejadian <span className="text-red-500">*</span></label>
                            <p className="mb-2 mt-1 text-xs text-slate-500">Klik peta atau geser pin untuk menentukan titik lokasi laporan.</p>
                            <div className="relative isolate overflow-hidden rounded-xl border border-slate-200">
                                <div ref={mapElement} className="z-0 h-[300px] w-full [&_.leaflet-tile]:max-w-none" />
                                <button type="button" onClick={useCurrentLocation} disabled={locating} className="absolute bottom-3 right-3 z-[500] rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-emerald-800 shadow hover:bg-emerald-50 disabled:opacity-60">
                                    {locating ? 'Mencari lokasi…' : '◎ Gunakan Lokasi Saat Ini'}
                                </button>
                            </div>
                            {coordinates && <p className="mt-2 text-xs text-slate-500">📍 {coordinates.latitude}, {coordinates.longitude} — Kecamatan {coordinates.district}</p>}
                            <input type="hidden" name="latitude" value={coordinates?.latitude || ''} />
                            <input type="hidden" name="longitude" value={coordinates?.longitude || ''} />
                            <input type="hidden" name="district" value={coordinates?.district || ''} />
                        </div>
                        <div>
                            <label htmlFor="location_detail" className="text-sm font-semibold text-slate-700">Detail Lokasi <span className="text-red-500">*</span></label>
                            <textarea id="location_detail" name="location_detail" required maxLength={70} rows={2} placeholder="Contoh: Depan SDN 01, sebelah minimarket, dekat lampu merah…" className={inputClass} />
                            <p className="mt-1 text-xs text-slate-400">Maksimal 70 karakter. Jelaskan patokan agar petugas mudah menemukan lokasi.</p>
                        </div>
                        <div>
                            <label className="mb-3 block text-sm font-semibold text-slate-700">Tingkat Urgensi <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-3 gap-3">
                                {[{ value: '1', title: 'Rendah', sub: 'Informasi umum', style: 'has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50' }, { value: '2', title: 'Sedang', sub: 'Perlu perhatian', style: 'has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50' }, { value: '3', title: 'Mendesak', sub: 'Butuh penanganan', style: 'has-[:checked]:border-red-500 has-[:checked]:bg-red-50' }].map((item) => (
                                    <label key={item.value} className={`cursor-pointer rounded-xl border p-3 text-center transition ${item.style}`}>
                                        <input className="sr-only" type="radio" name="severity" value={item.value} defaultChecked={item.value === '1'} />
                                        <span className="block text-sm font-bold text-slate-800">{item.title}</span>
                                        <span className="mt-1 block text-[11px] text-slate-500">{item.sub}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="font-bold text-slate-900">Bukti Pendukung</h2>
                    <p className="mt-1 text-sm text-slate-500">Unggah 1–5 foto bukti dengan format JPG atau PNG. Ukuran maksimal 2 MB per foto.</p>
                    <label className="mt-4 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/40 p-5 text-center hover:bg-emerald-50">
                        <span className="text-3xl text-emerald-700">＋</span>
                        <span className="mt-2 text-sm font-semibold text-emerald-800">Pilih foto atau klik untuk mengunggah</span>
                        <span className="mt-1 text-xs text-slate-500">JPG / PNG · Maksimal 5 foto</span>
                        <input ref={fileInput} type="file" name="images[]" accept="image/jpeg,image/png" multiple required className="sr-only" onChange={(event) => addImages(event.target.files)} />
                    </label>
                    <p className="mt-2 text-xs text-slate-500">{images.length} dari 5 foto dipilih.</p>
                    {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
                    {images.length > 0 && <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                        {images.map((file, index) => <div key={`${file.name}-${file.size}`} className="relative">
                            <img src={previewUrls[index]} alt={`Pratinjau ${file.name}`} className="h-24 w-full rounded-lg border border-slate-200 object-cover" />
                            <button type="button" onClick={() => removeImage(index)} aria-label={`Hapus ${file.name}`} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white shadow">×</button>
                            <p className="mt-1 truncate text-[10px] text-slate-500">{file.name}</p>
                        </div>)}
                    </div>}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <label className="flex cursor-pointer items-start gap-3">
                        <input type="checkbox" name="is_anonymous" value="1" className="mt-1 h-4 w-4 accent-emerald-700" />
                        <span><span className="block text-sm font-semibold text-slate-800">Kirim sebagai laporan anonim</span><span className="mt-1 block text-xs leading-relaxed text-slate-500">Nama dan foto profil Anda tidak akan ditampilkan kepada publik pada laporan ini.</span></span>
                    </label>
                </section>

                <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <Link to="/dashboard" className="rounded-xl border border-slate-300 px-6 py-3 text-center text-sm font-semibold text-slate-600 hover:bg-slate-50">Batal</Link>
                    <button type="submit" className="rounded-xl bg-emerald-700 px-7 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-800">Kirim Laporan</button>
                </div>
            </form>
        </div>
    );
}
