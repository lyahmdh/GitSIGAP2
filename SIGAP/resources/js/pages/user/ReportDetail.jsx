import { useParams } from 'react-router-dom';
import ReportDetailView from '../../components/report/ReportDetailView';

// Detail laporan di area user — tampilan & data sama dengan halaman publik.
export default function ReportDetail() {
    const { id } = useParams();

    return (
        <ReportDetailView
            reportId={id}
            variant="dashboard"
            backTo="/profile"
            backLabel="Profil Saya"
        />
    );
}
