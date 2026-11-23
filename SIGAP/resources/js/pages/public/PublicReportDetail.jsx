import { useParams } from 'react-router-dom';
import ReportDetailView from '../../components/report/ReportDetailView';

// Detail laporan publik (setara laporan/show.blade.php untuk tamu).
export default function PublicReportDetail() {
    const { id } = useParams();

    return (
        <ReportDetailView
            reportId={id}
            variant="public"
            backTo="/laporan"
            backLabel="Semua Proyek"
        />
    );
}
