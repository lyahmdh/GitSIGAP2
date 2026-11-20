import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Gagal logout:', error);
        }
    };

    const publicNavClass = ({ isActive }) =>
        `text-sm font-medium transition ${
            isActive
                ? 'text-emerald-700'
                : 'text-slate-600 hover:text-emerald-700'
        }`;

    return (
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
                <Link
                    to="/"
                    className="shrink-0 text-2xl font-black tracking-tight text-emerald-700"
                >
                    SIGAP<span className="text-slate-800">.</span>
                </Link>

                <nav className="hidden items-center gap-7 md:flex">
                    <NavLink to="/" end className={publicNavClass}>
                        Beranda
                    </NavLink>

                    <NavLink to="/laporan" className={publicNavClass}>
                        Laporan Publik
                    </NavLink>
                </nav>

                <div className="flex shrink-0 items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                Keluar
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-semibold text-slate-700 hover:text-emerald-700"
                            >
                                Masuk
                            </Link>

                            <Link
                                to="/register"
                                className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}