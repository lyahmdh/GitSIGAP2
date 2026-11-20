import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import StatusBadge from '../../components/StatusBadge';

/*
 * Setara profile/show.blade.php + profile/edit.blade.php.
 * Panel kiri: identitas + ringkasan (mode lihat) atau form edit (mode edit).
 * Panel kanan: riwayat laporan.
 *
 * TODO (tahap integrasi API): ganti sampleReports dengan data laporan milik user
 * dan sambungkan form edit ke endpoint update profil.
 */
const sampleReports = [
    { id: 1, title: 'Kerusakan Jalan di Area Permukiman', date: '20 November 2026', status: 'masuk' },
    { id: 2, title: 'Lampu Penerangan Tidak Berfungsi', date: '18 November 2026', status: 'ditindaklanjuti' },
    { id: 3, title: 'Saluran Drainase Tersumbat', date: '15 November 2026', status: 'selesai' },
    { id: 4, title: 'Fasilitas Taman Rusak', date: '12 November 2026', status: 'diverifikasi' },
];

const filters = [
    ['semua', 'Semua'],
    ['masuk', 'Masuk'],
    ['diverifikasi', 'Diverifikasi'],
    ['ditindaklanjuti', 'Ditindaklanjuti'],
    ['selesai', 'Selesai'],
];

function getInitials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function formatJoined(date) {
    if (!date) return null;
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return null;
    return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(parsed);
}

const sidebarInput =
    'w-full rounded-lg border-[1.5px] border-white/25 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/70 disabled:opacity-60';

function EmailBanner() {
    const [hidden, setHidden] = useState(false);
    if (hidden) return null;

    return (
        <div className="mb-6 flex items-start gap-3 rounded-[14px] border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <span aria-hidden="true" className="mt-0.5 text-lg">⚠</span>
            <div className="flex-1">
                <p className="font-bold">Email Belum Diverifikasi</p>
                <p className="mt-1 leading-6">
                    Verifikasi email Anda untuk menerima notifikasi perubahan status laporan.
                </p>
                <Link
                    to="/verify-email"
                    className="mt-3 inline-flex rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white hover:bg-brown-warm"
                >
                    Verifikasi Sekarang
                </Link>
            </div>
            <button
                type="button"
                onClick={() => setHidden(true)}
                aria-label="Tutup notifikasi"
                className="text-lg leading-none text-amber-700 hover:text-amber-900"
            >
                ×
            </button>
        </div>
    );
}

export default function Profile() {
    const { user } = useAuth();

    const [editing, setEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('semua');
    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setMessage('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Perubahan profil berhasil disimpan (simulasi).');
        setEditing(false);
    };

    const displayName = form.name || user?.name || 'Pengguna';
    const joined = formatJoined(user?.created_at);

    const summary = [
        ['Total Laporan', sampleReports.length],
        ['Selesai', sampleReports.filter((r) => r.status === 'selesai').length],
        ['Diproses', sampleReports.filter((r) => ['diverifikasi', 'ditindaklanjuti'].includes(r.status)).length],
        ['Menunggu', sampleReports.filter((r) => r.status === 'masuk').length],
    ];

    const visibleReports = sampleReports.filter((r) => filter === 'semua' || r.status === filter);

    return (
        <div>
            {user && !user.email_verified_at && <EmailBanner />}

            <div className="grid items-start gap-6 lg:grid-cols-[300px_1fr]">
                {/* PANEL KIRI */}
                <aside className="rounded-[22px] bg-gradient-to-b from-green-light to-green-dark p-6 text-white shadow-deep">
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-accent bg-accent font-display text-3xl font-semibold">
                        {getInitials(displayName)}
                    </div>

                    {editing ? (
                        <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-left">
                            <div>
                                <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-white/80">
                                    Nama Lengkap
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Masukkan nama lengkap"
                                    className={sidebarInput}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-white/80">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className={sidebarInput}
                                />
                                <p className="mt-1 text-[11px] text-white/60">Pengubahan email belum tersedia.</p>
                            </div>

                            <div>
                                <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-white/80">
                                    Nomor Telepon
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="08xxxxxxxxxx"
                                    className={sidebarInput}
                                />
                            </div>

                            <div className="rounded-xl bg-white/10">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((value) => !value)}
                                    aria-expanded={showPassword}
                                    className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-semibold"
                                >
                                    Ganti Password
                                    <span
                                        aria-hidden="true"
                                        className={`text-[10px] transition-transform ${showPassword ? 'rotate-180' : ''}`}
                                    >
                                        ▼
                                    </span>
                                </button>
                                {showPassword && (
                                    <div className="space-y-3 px-3.5 pb-3.5">
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={form.current_password}
                                            onChange={handleChange}
                                            placeholder="Password lama"
                                            autoComplete="current-password"
                                            className={sidebarInput}
                                        />
                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder="Password baru (min. 8 karakter)"
                                            autoComplete="new-password"
                                            className={sidebarInput}
                                        />
                                        <input
                                            type="password"
                                            name="password_confirmation"
                                            value={form.password_confirmation}
                                            onChange={handleChange}
                                            placeholder="Ulangi password baru"
                                            autoComplete="new-password"
                                            className={sidebarInput}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 pt-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-full bg-accent py-2.5 text-sm font-bold text-white transition hover:bg-brown-warm"
                                >
                                    Simpan
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditing(false)}
                                    className="w-full rounded-full border-2 border-white/50 py-2.5 text-sm font-bold text-white transition hover:bg-white/10"
                                >
                                    Batalkan
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="mt-5 text-center">
                            <h1 className="font-display text-xl font-semibold">{displayName}</h1>

                            <div className="mt-3 space-y-1.5 text-sm text-white/80">
                                {user?.email && <p className="break-all">✉ {user.email}</p>}
                                {form.phone && <p>☎ {form.phone}</p>}
                                {joined && <p>Bergabung {joined}</p>}
                            </div>

                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="mt-5 w-full rounded-full bg-accent py-2.5 text-sm font-bold text-white transition hover:bg-brown-warm"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}

                    <div className="mt-6 space-y-2">
                        {summary.map(([label, count]) => (
                            <div
                                key={label}
                                className="flex items-center justify-between rounded-full bg-white/10 px-4 py-2 text-sm"
                            >
                                <span>{label}</span>
                                <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-2 text-xs font-bold text-green-dark">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* PANEL KANAN */}
                <section>
                    {message && (
                        <p className="mb-4 rounded-xl bg-[#D1FAE5] px-4 py-3 text-sm text-[#065F46]">{message}</p>
                    )}

                    <h2 className="font-display text-2xl font-semibold text-green-dark md:text-3xl">
                        Riwayat Laporan
                    </h2>
                    <div className="mt-2 h-[3px] w-12 rounded bg-accent" />

                    <div className="mt-5 flex flex-wrap gap-2">
                        {filters.map(([value, label]) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setFilter(value)}
                                className={`rounded-full border-[1.5px] px-4 py-1.5 text-sm font-semibold transition ${
                                    filter === value
                                        ? 'border-green-mid bg-green-mid text-white'
                                        : 'border-cream-dark bg-white text-muted hover:border-green-light hover:text-green-dark'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="mt-5 overflow-hidden rounded-[14px] border border-cream-dark bg-white shadow-card">
                        {visibleReports.length === 0 ? (
                            <div className="px-6 py-14 text-center text-muted">
                                <p className="font-bold text-green-dark">Belum Ada Laporan</p>
                                <p className="mt-1 text-sm">Tidak ada laporan pada filter ini.</p>
                                <Link to="/reports/create" className="btn-accent mt-4 inline-flex text-sm">
                                    Buat Laporan
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[560px] text-left text-sm">
                                    <thead className="bg-green-mid text-white">
                                        <tr>
                                            <th className="w-14 px-4 py-3 font-semibold">No</th>
                                            <th className="px-4 py-3 font-semibold">Nama Jalan</th>
                                            <th className="px-4 py-3 font-semibold">Tanggal Laporan</th>
                                            <th className="px-4 py-3 font-semibold">Status</th>
                                            <th className="px-4 py-3 text-center font-semibold">Detail</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visibleReports.map((report, index) => (
                                            <tr key={report.id} className="border-t border-cream-dark hover:bg-cream/60">
                                                <td className="px-4 py-3 text-muted">{index + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-green-dark">{report.title}</td>
                                                <td className="px-4 py-3 text-muted">{report.date}</td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={report.status} />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        to={`/reports/${report.id}`}
                                                        className="rounded-full bg-accent px-3.5 py-1.5 text-xs font-bold text-white hover:bg-brown-warm"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className="border-t border-cream-dark px-4 py-3 text-xs text-muted">
                            Menampilkan <strong>{visibleReports.length}</strong> laporan
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
