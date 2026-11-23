import { Navigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuth from '../hooks/useAuth';

export default function PublicLayout() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex min-h-screen items-center justify-center bg-cream"><p className="text-sm text-muted">Memuat SIGAP...</p></div>;
    }

    if (user?.role === 'admin') return <Navigate to="/admin" replace />;

    return (
        <div className="flex min-h-screen flex-col bg-cream">
            <Navbar />
            <main className="flex-1"><Outlet /></main>
            <Footer />
        </div>
    );
}
