import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import api from '../../services/api';

const icon = L.icon({ iconUrl: markerIcon, iconRetinaUrl: markerIcon2x, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
const FALLBACK = [-7.9666, 112.6326];
const statusLabel = { masuk: 'Masuk', diverifikasi: 'Diverifikasi', ditindaklanjuti: 'Ditindaklanjuti', selesai: 'Selesai', ditolak: 'Ditolak' };

export default function MapReports() {
    const mapElement = useRef(null);
    const mapRef = useRef(null);
    const layerRef = useRef(null);
    const [reports, setReports] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('Semua Kecamatan');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let active = true;
        async function load() {
            setLoading(true);
            try {
                const [listResponse, statsResponse] = await Promise.all([
                    api.get('/api/reports'),
                    api.get('/api/reports/stats/districts'),
                ]);
                const list = listResponse.data?.data || [];
                const districtStats = statsResponse.data?.data || [];
                if (active) setDistricts(districtStats);

                // Endpoint daftar publik belum menyertakan koordinat. Ambil detail tiap laporan
                // agar pin memakai latitude/longitude yang tersimpan, bukan titik perkiraan.
                const details = await Promise.all(list.map(async (item) => {
                    try {
                        const response = await api.get(`/api/reports/${item.id}`);
                        return response.data?.data || null;
                    } catch { return null; }
                }));
                if (active) setReports(details.filter((item) => item && Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude))));
            } catch (err) {
                if (active) setError(err.response?.data?.message || 'Data peta laporan gagal dimuat.');
            } finally { if (active) setLoading(false); }
        }
        load();
        return () => { active = false; };
    }, []);

    const filteredReports = useMemo(() => selectedDistrict === 'Semua Kecamatan'
        ? reports
        : reports.filter((report) => report.district === selectedDistrict), [reports, selectedDistrict]);

    useEffect(() => {
        if (!mapElement.current || mapRef.current) return undefined;
        const map = L.map(mapElement.current, { scrollWheelZoom: false }).setView(FALLBACK, 12);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
        layerRef.current = L.featureGroup().addTo(map);
        mapRef.current = map;
        const timer = window.setTimeout(() => map.invalidateSize(), 100);
        return () => { window.clearTimeout(timer); map.remove(); mapRef.current = null; layerRef.current = null; };
    }, []);

    useEffect(() => {
        const layer = layerRef.current;
        const map = mapRef.current;
        if (!layer || !map) return;
        layer.clearLayers();
        filteredReports.forEach((report) => {
            const lat = Number(report.latitude);
            const lng = Number(report.longitude);
            const marker = L.marker([lat, lng], { icon });
            const popup = document.createElement('div');
            const title = document.createElement('strong');
            title.textContent = report.title || 'Laporan masyarakat';
            const detail = document.createElement('p');
            detail.textContent = `${report.district || 'Wilayah tidak diketahui'} · ${statusLabel[report.status] || report.status}`;
            detail.style.margin = '5px 0';
            const link = document.createElement('a');
            link.href = `/reports/${report.id}`;
            link.textContent = 'Lihat detail';
            popup.append(title, detail, link);
            marker.bindPopup(popup).addTo(layer);
        });
        if (filteredReports.length) map.fitBounds(layer.getBounds().pad(0.15), { maxZoom: 15 });
        else map.setView(FALLBACK, 12);
    }, [filteredReports]);

    const maxCount = Math.max(1, ...districts.map((item) => Number(item.count) || 0));

    return (
        <div className="space-y-6">
            <div><p className="text-sm font-semibold text-emerald-700">PEMETAAN WILAYAH</p><h1 className="mt-2 text-2xl font-bold text-slate-900">Peta Sebaran Laporan</h1><p className="mt-1 text-sm text-slate-500">Lihat persebaran laporan masyarakat berdasarkan titik lokasi dan kecamatan.</p></div>
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <label className="text-sm font-semibold text-slate-700">Filter Kecamatan</label>
                <select value={selectedDistrict} onChange={(event) => setSelectedDistrict(event.target.value)} className="min-w-52 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm">
                    <option value="Semua Kecamatan">Semua Kecamatan</option>
                    {districts.map((district) => <option key={district.name} value={district.name}>{district.name}</option>)}
                </select>
            </div>
            {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div ref={mapElement} className="isolate z-0 h-[460px] w-full [&_.leaflet-tile]:max-w-none" />
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span>{loading ? 'Memuat titik laporan…' : `${filteredReports.length} titik laporan ditampilkan`}</span><span>© OpenStreetMap contributors</span></div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-bold text-slate-900">Ringkasan Laporan per Kecamatan</h2><span className="text-xs text-slate-400">Laporan publik · tidak termasuk yang ditolak</span></div>
                {districts.length ? <div className="mt-5 space-y-4">{districts.map((district) => <button key={district.name} type="button" onClick={() => setSelectedDistrict(district.name)} className="block w-full text-left">
                    <div className="mb-2 flex justify-between gap-3 text-sm"><span className="font-medium text-slate-700">{district.name}</span><span className="text-slate-500">{district.count} laporan</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-600" style={{ width: `${(Number(district.count) / maxCount) * 100}%` }} /></div>
                </button>)}</div> : <p className="mt-4 text-sm text-slate-500">Belum ada ringkasan laporan per kecamatan.</p>}
            </section>
            <div className="text-right"><Link to="/reports" className="text-sm font-semibold text-emerald-700 hover:underline">Lihat riwayat laporan saya →</Link></div>
        </div>
    );
}
