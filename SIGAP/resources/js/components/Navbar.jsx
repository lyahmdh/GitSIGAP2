import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function getInitials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (first + last).toUpperCase();
}

const navLinkClass = ({ isActive }) =>
    `rounded-lg px-3.5 py-1.5 text-[15px] font-medium transition ${
        isActive
            ? 'bg-white/15 text-white'
            : 'text-white/80 hover:bg-white/10 hover:text-white'
    }`;

function UserMenu({ user, onLogout }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const location = useLocation();

    useEffect(() => setOpen(false), [location.pathname]);

    useEffect(() => {
        const close = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        const esc = (event) => event.key === 'Escape' && setOpen(false);
        document.addEventListener('mousedown', close);
        document.addEventListener('keydown', esc);
        return () => {
            document.removeEventListener('mousedown', close);
            document.removeEventListener('keydown', esc);
        };
    }, []);

    const isAdmin = user.role === 'admin';

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={open}
                className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition hover:bg-white/10"
            >
                <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border-2 border-accent bg-accent text-sm font-bold text-white">
                    {getInitials(user.name)}
                </span>
                <span className="hidden max-w-[130px] truncate text-sm font-medium text-white lg:inline">
                    {user.name}
                </span>
                <span
                    aria-hidden="true"
                    className={`hidden text-[10px] text-white/70 transition-transform lg:inline ${
                        open ? 'rotate-180' : ''
                    }`}
                >
                    ▼
                </span>
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 z-50 mt-2 min-w-[210px] rounded-[14px] border border-cream-dark bg-white p-2 shadow-float"
                >
                    <div className="px-3 py-2">
                        <p className="truncate text-sm font-bold text-ink">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    <div className="my-1.5 h-px bg-cream-dark" />

                    {isAdmin ? (
                        <Link
                            role="menuitem"
                            to="/admin"
                            className="block rounded-lg px-3.5 py-2 text-sm font-medium text-ink hover:bg-cream"
                        >
                            Dashboard Admin
                        </Link>
                    ) : (
                        <>
                            <Link
                                role="menuitem"
                                to="/dashboard"
                                className="block rounded-lg px-3.5 py-2 text-sm font-medium text-ink hover:bg-cream"
                            >
                                Dashboard
                            </Link>
                            <Link
                                role="menuitem"
                                to="/profile"
                                className="block rounded-lg px-3.5 py-2 text-sm font-medium text-ink hover:bg-cream"
                            >
                                Profil Saya
                            </Link>
                        </>
                    )}

                    <div className="my-1.5 h-px bg-cream-dark" />
                    <button
                        type="button"
                        role="menuitem"
                        onClick={onLogout}
                        className="block w-full rounded-lg px-3.5 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => setMobileOpen(false), [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/', { replace: true });
        } catch (error) {
            console.error('Gagal logout:', error);
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-green-dark shadow-[0_2px_12px_rgba(0,0,0,0.25)]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-3">
                <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-white">
                    <span className="text-accent">SI</span>GAP
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileOpen((value) => !value)}
                    aria-label="Buka menu navigasi"
                    aria-expanded={mobileOpen}
                    className="rounded-lg border-[1.5px] border-white/40 px-2.5 py-1.5 text-white md:hidden"
                >
                    <svg width="22" height="22" viewBox="0 0 30 30" aria-hidden="true">
                        <path
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            d="M4 7h22M4 15h22M4 23h22"
                        />
                    </svg>
                </button>

                <div
                    className={`${
                        mobileOpen ? 'flex' : 'hidden'
                    } w-full flex-col gap-3 md:flex md:w-auto md:flex-1 md:flex-row md:items-center md:justify-between`}
                >
                    <nav className="flex flex-col gap-1 md:ml-4 md:flex-row">
                        <NavLink to="/" end className={navLinkClass}>
                            Home
                        </NavLink>
                        <NavLink to="/reports/create" className={navLinkClass}>
                            Lapor
                        </NavLink>
                        <NavLink to="/laporan" className={navLinkClass}>
                            Rekap
                        </NavLink>
                    </nav>

                    <div className="flex items-center gap-2">
                        {user ? (
                            <UserMenu user={user} onLogout={handleLogout} />
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-full border-[1.5px] border-white/50 px-[1.1rem] py-1.5 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    to="/register"
                                    className="rounded-full border-[1.5px] border-accent bg-accent px-5 py-1.5 text-sm font-bold text-white transition hover:border-brown-warm hover:bg-brown-warm"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
