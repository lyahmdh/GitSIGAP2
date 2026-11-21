import { NavLink } from 'react-router-dom';

const userMenus = [
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
        <aside className="w-full shrink-0 border-b border-cream-dark bg-white p-4 lg:min-h-[calc(100vh-61px)] lg:w-64 lg:border-b-0 lg:border-r">
            <p className="mb-4 px-3 text-xs font-bold uppercase tracking-[0.12em] text-accent">
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
                            `whitespace-nowrap rounded-lg border-l-[3px] px-3 py-2.5 text-sm font-medium transition ${
                                isActive
                                    ? 'border-accent bg-green-pale/50 font-semibold text-green-dark'
                                    : 'border-transparent text-muted hover:bg-cream hover:text-green-dark'
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
