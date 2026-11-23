import { Link } from 'react-router-dom';

const aboutLinks = ['Profil SIGAP', 'Keamanan', 'Hubungi Kami', 'FAQ'];

const quickLinks = [
    ['Rekap Laporan Publik', '/laporan'],
    ['Monitoring Proyek', '/laporan'],
    ['Laporan Warga', '/laporan'],
    ['Buat Laporan Baru', '/reports/create'],
];

const socials = [
    ['X', 'Twitter/X'],
    ['IG', 'Instagram'],
    ['YT', 'YouTube'],
    ['in', 'LinkedIn'],
];

const contacts = [
    ['✉', 'sigap@pemerintah.go.id'],
    ['☎', '(0341) 123-4567'],
    ['⌖', 'Jl. Veteran No. 1, Malang, Jawa Timur'],
];

const linkClass = 'block text-sm text-white/65 transition hover:text-accent';

export default function Footer() {
    return (
        <footer className="bg-green-dark pb-6 pt-12 text-sm text-white/75">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12">
                    <div className="lg:col-span-4">
                        <p className="font-display text-[1.4rem] font-semibold text-white">
                            <span className="text-accent">SI</span>GAP
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                            Sistem Informasi Gangguan &amp; Aduan Publik
                        </p>
                        <p className="mt-4 max-w-[280px] text-[13.5px] leading-[1.65] text-white/55">
                            Platform digital untuk melaporkan dan memantau kondisi fasilitas publik secara
                            transparan, agar pemerintah dapat menindaklanjuti dengan lebih cepat dan terukur.
                        </p>
                        <div className="mt-4 flex gap-1.5">
                            {socials.map(([label, title]) => (
                                <span
                                    key={title}
                                    title={title}
                                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white/75 transition hover:bg-accent hover:text-white"
                                >
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-white">
                            Tentang Kami
                        </p>
                        <ul className="space-y-2">
                            {aboutLinks.map((label) => (
                                <li key={label} className={linkClass}>
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-white">
                            Tautan Lainnya
                        </p>
                        <ul className="space-y-2">
                            {quickLinks.map(([label, to]) => (
                                <li key={label}>
                                    <Link to={to} className={linkClass}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <p className="mb-4 text-sm font-bold uppercase tracking-[0.08em] text-white">
                            Kontak
                        </p>
                        <ul className="space-y-2.5">
                            {contacts.map(([icon, text]) => (
                                <li key={text} className="flex items-start gap-2 text-[13.5px] text-white/60">
                                    <span aria-hidden="true" className="mt-0.5 text-accent">
                                        {icon}
                                    </span>
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-white/10 pt-5 text-center text-xs text-white/40 md:flex-row">
                    <span>© {new Date().getFullYear()} SIGAP. All rights reserved.</span>
                    <span>Sistem Informasi Gangguan &amp; Aduan Publik</span>
                </div>
            </div>
        </footer>
    );
}
