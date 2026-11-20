import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ReportCard({ report, detailPath = '/reports' }) {
    const formatDate = (date) => {
        if (!date) return 'Tanggal belum tersedia';

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return 'Tanggal tidak valid';
        }

        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(parsedDate);
    };

    return (
        <article className="group relative overflow-hidden rounded-[14px] border border-cream-dark bg-white p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-float">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-green-light to-accent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {report.category?.name || 'Kategori laporan'}
                    </p>

                    <h3 className="mt-2 font-bold text-green-dark">
                        {report.title || 'Judul laporan'}
                    </h3>
                </div>

                <StatusBadge status={report.status} />
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
                {report.description || 'Deskripsi laporan belum tersedia.'}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-cream-dark pt-4">
                <span className="text-xs text-muted">{formatDate(report.created_at)}</span>

                <Link
                    to={`${detailPath}/${report.id}`}
                    className="text-sm font-semibold text-green-mid hover:text-accent"
                >
                    Lihat detail →
                </Link>
            </div>
        </article>
    );
}
