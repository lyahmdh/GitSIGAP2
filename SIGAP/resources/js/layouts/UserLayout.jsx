import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

export default function UserLayout() {
    const { user } = useAuth();
    const needsVerification = user && user.role !== 'admin' && !user.email_verified_at;

    return (
        <div className="min-h-screen bg-cream">
            <Navbar />
            {needsVerification && (
                <div className="border-b border-amber-300 bg-amber-50 px-5 py-3 text-amber-900">
                    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 text-sm">
                        <p>
                            <strong>Perhatian:</strong> Email akun kamu belum terverifikasi.
                            Kamu tetap dapat membuat laporan, tetapi tidak akan menerima notifikasi perkembangan laporan melalui email sebelum melakukan verifikasi.
                        </p>
                        <Link to="/verify-email" className="shrink-0 font-semibold underline underline-offset-2">
                            Verifikasi sekarang
                        </Link>
                    </div>
                </div>
            )}
            <main className="mx-auto max-w-7xl p-5 md:p-8"><Outlet /></main>
        </div>
    );
}
