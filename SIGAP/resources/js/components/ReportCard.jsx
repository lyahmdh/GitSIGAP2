import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function ReportCard({
    report,
    detailPath = '/reports',
}) {
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
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p className="text-xs font-medium text-slate-400">
                        {report.category?.name || 'Kategori laporan'}
                    </p>

                    <h3 className="mt-2 font-bold text-slate-900">
                        {report.title || 'Judul laporan'}
                    </h3>
                </div>

                <StatusBadge status={report.status} />
            </div>

            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                {report.description || 'Deskripsi laporan belum tersedia.'}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">
                    {formatDate(report.created_at)}
                </span>

                <Link
                    to={`${detailPath}/${report.id}`}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                >
                    Lihat detail →
                </Link>
            </div>
        </article>
    );
}