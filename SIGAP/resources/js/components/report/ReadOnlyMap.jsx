import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Vite tidak me-resolve path ikon bawaan Leaflet, jadi ikon didefinisikan manual.
const defaultIcon = L.icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

// Titik tengah Kota Malang — sama dengan fallback di Blade lama.
const FALLBACK = [-7.9666, 112.6326];

const toNumber = (value, fallback) => {
    const number = Number(value);
    return value === null || value === undefined || Number.isNaN(number) ? fallback : number;
};

/**
 * Peta read-only (setara #detail-map di laporan/show.blade.php):
 * zoom wheel nonaktif, drag aktif, satu marker dengan popup.
 */
export default function ReadOnlyMap({ latitude, longitude, title, address, className = '' }) {
    const containerRef = useRef(null);

    useEffect(() => {
        const lat = toNumber(latitude, FALLBACK[0]);
        const lng = toNumber(longitude, FALLBACK[1]);

        const map = L.map(containerRef.current, {
            zoomControl: true,
            scrollWheelZoom: false,
            dragging: true,
        }).setView([lat, lng], 16);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap',
        }).addTo(map);

        // Popup dibangun dari DOM node (textContent) agar judul dari pengguna tidak dieksekusi sebagai HTML.
        const popup = document.createElement('div');
        const heading = document.createElement('b');
        heading.textContent = title || 'Lokasi laporan';
        popup.appendChild(heading);

        if (address) {
            popup.appendChild(document.createElement('br'));
            popup.appendChild(document.createTextNode(address));
        }

        L.marker([lat, lng], { icon: defaultIcon }).addTo(map).bindPopup(popup);

        return () => map.remove();
    }, [latitude, longitude, title, address]);

    return (
        <div
            ref={containerRef}
            role="img"
            aria-label="Peta lokasi laporan"
            // isolate: z-index internal Leaflet tidak menimpa navbar/lightbox; max-w-none: perbaikan tile vs preflight Tailwind
            className={`isolate z-0 h-56 rounded-xl border-[1.5px] border-cream-dark [&_img]:max-w-none ${className}`}
        />
    );
}
