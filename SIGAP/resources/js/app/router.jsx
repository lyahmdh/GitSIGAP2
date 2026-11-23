import {
    createBrowserRouter,
    Navigate,
    Outlet,
} from 'react-router-dom';

import useAuth from '../hooks/useAuth';

import PublicLayout from '../layouts/PublicLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/public/Home';
import PublicReports from '../pages/public/PublicReports';
import PublicReportDetail from '../pages/public/PublicReportDetail';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';

import Dashboard from '../pages/user/Dashboard';
import Reports from '../pages/user/Reports';
import CreateReport from '../pages/user/CreateReport';
import ReportDetail from '../pages/user/ReportDetail';
import Profile from '../pages/user/Profile';
import MapReports from '../pages/user/MapReports';

import AdminDashboard from '../pages/admin/Dashboard';
import AdminReports from '../pages/admin/Reports';
import AdminReportDetail from '../pages/admin/ReportDetail';
import SlaMonitoring from '../pages/admin/SlaMonitoring';

function LoadingScreen() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <p className="text-sm text-slate-500">Memuat SIGAP...</p>
        </div>
    );
}

function RequireAuth() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

function RequireAdmin() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== 'admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

function GuestOnly() {
    const { user, loading } = useAuth();

    if (loading) return <LoadingScreen />;

    if (user) {
        return (
            <Navigate
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                replace
            />
        );
    }

    return <Outlet />;
}

const router = createBrowserRouter(
    [
        {
            element: <PublicLayout />,
            children: [
                { path: '/', element: <Home /> },
                { path: '/laporan', element: <PublicReports /> },
                { path: '/laporan/:id', element: <PublicReportDetail /> },
            ],
        },
        {
            element: <GuestOnly />,
            children: [
                { path: '/login', element: <Login /> },
                { path: '/register', element: <Register /> },
            ],
        },
        {
            element: <RequireAuth />,
            children: [
                {
                    path: '/verify-email',
                    element: <VerifyEmail />,
                },
                {
                    element: <UserLayout />,
                    children: [
                        { path: '/dashboard', element: <Dashboard /> },
                        { path: '/reports', element: <Reports /> },
                        { path: '/reports/create', element: <CreateReport /> },
                        { path: '/reports/:id', element: <ReportDetail /> },
                        { path: '/profile', element: <Profile /> },
                        { path: '/map', element: <MapReports /> },
                    ],
                },
            ],
        },
        {
            element: <RequireAdmin />,
            children: [
                {
                    element: <AdminLayout />,
                    children: [
                        { path: '/admin', element: <AdminDashboard /> },
                        { path: '/admin/reports', element: <AdminReports /> },
                        { path: '/admin/reports/:id', element: <AdminReportDetail /> },
                        { path: '/admin/sla', element: <SlaMonitoring /> },
                    ],
                },
            ],
        },
        {
            path: '*',
            element: <Navigate to="/" replace />,
        },
    ],
    {
        basename: '/react',
    }
);

export default router;

