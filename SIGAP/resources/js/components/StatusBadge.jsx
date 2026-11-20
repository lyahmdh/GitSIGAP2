// Warna mengikuti .badge-* di layouts/app.blade.php (Blade lama)
const statusStyles = {
    masuk: 'bg-[#FEF3C7] text-[#92400E]',
    diverifikasi: 'bg-[#EDE9FE] text-[#5B21B6]',
    ditindaklanjuti: 'bg-[#DBEAFE] text-[#1E40AF]',
    selesai: 'bg-[#D1FAE5] text-[#065F46]',
    ditolak: 'bg-[#FEE2E2] text-[#991B1B]',
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

    const style = statusStyles[normalizedStatus] || 'bg-cream-dark text-muted';

    const label = statusLabels[normalizedStatus] || normalizedStatus.replaceAll('_', ' ');

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}>
            {label}
        </span>
    );
}
