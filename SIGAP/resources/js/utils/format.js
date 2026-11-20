// Helper format tampilan — menggantikan Carbon (format, isoFormat, diffForHumans) dan asset('storage/...') di Blade.

const parse = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};

/** Setara asset('storage/' . $path) */
export function storageUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `/storage/${String(path).replace(/^\/+/, '')}`;
}

/** Setara Carbon format('d M Y') → "20 Nov 2026" */
export function formatDate(value) {
    const date = parse(value);
    if (!date) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

/** Setara Carbon isoFormat('D MMMM Y') → "20 November 2026" */
export function formatDateLong(value) {
    const date = parse(value);
    if (!date) return '-';

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(date);
}

/** Setara Carbon diffForHumans() → "3 jam yang lalu" */
export function timeAgo(value) {
    const date = parse(value);
    if (!date) return '';

    const seconds = Math.round((date.getTime() - Date.now()) / 1000);
    const rtf = new Intl.RelativeTimeFormat('id-ID', { numeric: 'auto' });

    const units = [
        ['year', 31536000],
        ['month', 2592000],
        ['week', 604800],
        ['day', 86400],
        ['hour', 3600],
        ['minute', 60],
    ];

    for (const [unit, size] of units) {
        if (Math.abs(seconds) >= size) {
            return rtf.format(Math.trunc(seconds / size), unit);
        }
    }

    return 'baru saja';
}

export function getInitial(name, fallback = 'A') {
    return String(name || fallback).trim().charAt(0).toUpperCase() || fallback;
}
