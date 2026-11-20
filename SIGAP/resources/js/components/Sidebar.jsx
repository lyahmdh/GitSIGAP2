import { NavLink } from 'react-router-dom';

const userMenus = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/reports', label: 'Laporan Saya' },
    { to: '/reports/create', label: 'Buat Laporan' },
    { to: '/map', label: 'Peta Laporan' },
    { to: '/profile', label: 'Profil Saya' },
];

const adminMenus = [
    { to: '/admin', label: 'Dashboard Admin' },
    { to: '/admin/reports', label: 'Manajemen Laporan' },
    { to: '/admin/sla', label: 'Monitoring SLA' },
];

export default function Sidebar({ admin = false }) {
    const menus = admin ? adminMenus : userMenus;

    return (
        <aside className="w-full shrink-0 border-b border-slate-200 bg-white p-4 lg:min-h-[calc(100vh-73px)] lg:w-64 lg:border-b-0 lg:border-r">
            <p className="mb-4 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                {admin ? 'Administrator' : 'Menu Pengguna'}
            </p>

            <nav
                aria-label={admin ? 'Navigasi administrator' : 'Navigasi pengguna'}
                className="flex gap-2 overflow-x-auto lg:flex-col"
            >
                {menus.map((menu) => (
                    <NavLink
                        key={menu.to}
                        to={menu.to}
                        end
                        className={({ isActive }) =>
                            `whitespace-nowrap rounded-lg px-3 py-3 text-sm font-medium transition ${
                                isActive
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                            }`
                        }
                    >
                        {menu.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}