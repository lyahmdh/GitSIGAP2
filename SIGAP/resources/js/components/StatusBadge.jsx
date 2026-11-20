const statusStyles = {
    masuk: 'bg-blue-50 text-blue-700',
    diverifikasi: 'bg-amber-50 text-amber-700',
    ditindaklanjuti: 'bg-violet-50 text-violet-700',
    selesai: 'bg-emerald-50 text-emerald-700',
    ditolak: 'bg-red-50 text-red-700',
};

const statusLabels = {
    masuk: 'Masuk',
    diverifikasi: 'Diverifikasi',
    ditindaklanjuti: 'Ditindaklanjuti',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
};

export default function StatusBadge({ status = 'masuk' }) {
    const normalizedStatus = String(status || 'masuk').toLowerCase();

    const style =
        statusStyles[normalizedStatus] ||
        'bg-slate-100 text-slate-600';

    const label =
        statusLabels[normalizedStatus] ||
        normalizedStatus.replaceAll('_', ' ');

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}
        >
            {label}
        </span>
    );
}