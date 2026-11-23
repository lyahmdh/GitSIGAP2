import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';

const HERO_IMG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80';
const ABOUT_IMG = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80';


const aboutPoints = [
    ['Laporan Terstruktur', 'Dilengkapi foto, peta, dan tingkat keparahan'],
    ['Transparansi Penuh', 'Status dan update proyek bisa diakses publik'],
    ['Prioritas Otomatis', 'Sistem menghitung priority score secara cerdas'],
    ['Notifikasi Email', 'Warga diberitahu setiap ada update laporan'],
];

const features = [
    ['👁️', 'Transparansi Dana & Proyek', 'Masyarakat dapat memantau penggunaan dana secara terbuka, mulai dari anggaran hingga progres pembangunan di lapangan.'],
    ['💰', 'Pengelolaan Dana Efisien', 'Membantu pemerintah mengelola proyek, laporan, dan anggaran secara lebih terstruktur dengan dashboard yang informatif.'],
    ['📈', 'Monitoring Proyek Real-time', 'Pantau perkembangan proyek secara real-time, termasuk progres pekerjaan dan status pembangunan yang sedang berjalan.'],
    ['👥', 'Partisipasi Warga', 'Mendorong warga untuk aktif berpartisipasi dalam mengawasi dan mendukung pembangunan melalui laporan dan komentar.'],
    ['📱', 'Laporan Warga Mudah', 'Warga dapat melaporkan berbagai permasalahan fasilitas dengan mudah dan cepat, dilengkapi peta interaktif dan foto bukti.'],
    ['ℹ️', 'Akses Informasi Terpusat', 'Informasi terkait proyek pembangunan dan anggaran dapat diakses masyarakat secara mudah dalam satu platform terpadu.'],
];

const steps = [
    ['✏️', '01', 'Buat Laporan', 'Isi formulir laporan lengkap dengan foto bukti, pilih lokasi di peta, dan tentukan tingkat keparahan kerusakan.'],
    ['🔍', '02', 'Verifikasi Admin', 'Admin meninjau laporan masuk. Laporan valid akan diverifikasi dan masuk ke antrean penanganan berdasarkan priority score.'],
    ['🛠️', '03', 'Tindak Lanjut', 'Pemerintah menindaklanjuti laporan dengan prioritas tertinggi. Progress ditambahkan secara berkala disertai foto lapangan.'],
    ['✅', '04', 'Selesai & Laporan', 'Setelah perbaikan selesai, status diupdate ke "Selesai" dan warga menerima notifikasi email konfirmasi.'],
];

const faqs = [
    ['Bagaimana cara melaporkan masalah fasilitas publik?', 'Klik tombol "Buat Laporan" di beranda atau menu "Lapor". Anda perlu masuk akun terlebih dahulu. Isi formulir dengan judul, deskripsi, foto bukti (maks. 5 foto), pilih lokasi di peta, dan tentukan tingkat keparahan. Laporan akan langsung masuk ke sistem.'],
    ['Apakah laporan bisa dikirim secara anonim?', 'Ya. Saat membuat laporan, tersedia opsi "Laporan Anonim". Jika diaktifkan, nama pelapor tidak akan ditampilkan kepada publik. Namun data Anda tetap tersimpan untuk keperluan tindak lanjut oleh admin.'],
    ['Siapa saja yang dapat menggunakan SIGAP?', 'SIGAP dapat diakses oleh semua kalangan. Masyarakat umum (tamu) dapat melihat daftar laporan dan detail proyek tanpa perlu mendaftar. Untuk membuat laporan, Anda perlu mendaftarkan akun terlebih dahulu.'],
    ['Apakah data yang ditampilkan di SIGAP terpercaya?', 'Setiap laporan masuk akan diverifikasi oleh admin sebelum ditindaklanjuti. Laporan yang tidak valid atau duplikat akan ditolak. Pembaruan status dan update proyek hanya dapat dilakukan oleh admin yang terverifikasi.'],
    ['Apakah masyarakat bisa memantau perkembangan laporan?', 'Ya. Setiap laporan memiliki halaman detail yang dapat diakses publik. Di sana Anda dapat melihat status terkini, priority score, komentar warga, dan update proyek dari admin beserta foto progress pekerjaan.'],
];

/* Angka naik dari 0 saat terlihat di layar (setara script counter di Blade) */
function Counter({ end }) {
    const ref = useRef(null);
    const [value, setValue] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let raf;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const start = performance.now();
                const duration = 1400;
                const tick = (now) => {
                    const p = Math.min((now - start) / duration, 1);
                    setValue(Math.round(end * p));
                    if (p < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.5 },
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [end]);

    return <span ref={ref}>{value.toLocaleString('id-ID')}</span>;
}

function SectionHeading({ eyebrow, title, center = false }) {
    return (
        <div className={center ? 'text-center' : ''}>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">{eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-green-dark md:text-4xl">
                {title}
            </h2>
            <div className={`mt-4 h-[3px] w-12 rounded bg-accent ${center ? 'mx-auto' : ''}`} />
        </div>
    );
}

function Faq() {
    const [open, setOpen] = useState(0);

    return (
        <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {faqs.map(([q, a], i) => {
                const isOpen = open === i;
                return (
                    <div key={q} className="overflow-hidden rounded-2xl border border-cream-dark bg-white">
                        <button
                            type="button"
                            onClick={() => setOpen(isOpen ? -1 : i)}
                            aria-expanded={isOpen}
                            className={`flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-[15px] font-semibold transition-colors ${
                                isOpen ? 'border-b border-cream-dark text-accent' : 'text-green-dark'
                            }`}
                        >
                            {q}
                            <span
                                aria-hidden="true"
                                className={`shrink-0 text-xl leading-none transition-transform duration-200 ${
                                    isOpen ? 'rotate-45' : ''
                                }`}
                            >
                                +
                            </span>
                        </button>
                        {isOpen && (
                            <p className="px-6 py-4 text-sm leading-7 text-muted">{a}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function Home({ isLoggedIn = false }) {
    const location = useLocation();
    const [stats, setStats] = useState({ total: 0, aktif: 0, selesai: 0, diterima: 0 });

    useEffect(() => {
        let active = true;
        api.get('/api/public/home-stats')
            .then(({ data }) => {
                if (active && data?.success && data.data) setStats(data.data);
            })
            .catch((error) => {
                console.error('Statistik homepage gagal dimuat:', error);
            });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!location.hash) return;
        const targetId = decodeURIComponent(location.hash.slice(1));
        requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
        });
    }, [location.hash]);

    const statItems = [
        ['Total Laporan', stats.total],
        ['Proyek Aktif', stats.aktif],
        ['Proyek Selesai', stats.selesai],
        ['Laporan Diterima', stats.diterima],
    ];

    return (
        <>

            {/* HERO */}
            <section className="relative flex min-h-[88vh] items-center overflow-hidden bg-green-dark">
                <div
                    className="absolute inset-0 bg-cover opacity-30 saturate-[.7]"
                    style={{ backgroundImage: `url('${HERO_IMG}')`, backgroundPosition: 'center 30%' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-green-dark/90 via-green-dark/75 to-brown-dark/65" />

                <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-24">
                    <div className="max-w-2xl">
                        <div className="animate-fade-up mb-5 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-accent">
                            <span aria-hidden="true">🛡️</span> Platform Aduan Fasilitas Publik
                        </div>

                        <h1
                            className="animate-fade-up font-display text-4xl font-semibold leading-[1.18] text-white md:text-6xl"
                            style={{ animationDelay: '.1s' }}
                        >
                            Laporkan. Pantau. <span className="text-accent">Wujudkan</span>
                            <br />
                            Perubahan Nyata.
                        </h1>

                        <p
                            className="animate-fade-up mt-5 max-w-xl text-base leading-7 text-white/75 md:text-lg"
                            style={{ animationDelay: '.22s' }}
                        >
                            SIGAP memudahkan warga melaporkan kerusakan fasilitas umum secara terstruktur,
                            dan memastikan pemerintah menindaklanjuti berdasarkan urgensi yang terukur.
                        </p>

                        <div
                            className="animate-fade-up mt-8 flex flex-wrap gap-4"
                            style={{ animationDelay: '.34s' }}
                        >
                            <Link
                                to="/reports/create"
                                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 font-bold text-white shadow-lg shadow-accent/35 transition hover:-translate-y-0.5 hover:bg-brown-warm"
                            >
                                📣 Buat Laporan
                            </Link>
                            <Link
                                to="/laporan"
                                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/45 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10"
                            >
                                📋 Lihat Semua Proyek
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* STATS */}
            <section className="relative z-10 -mt-12">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid grid-cols-2 gap-y-6 rounded-3xl bg-gradient-to-br from-brown-dark to-brown-mid px-4 py-8 shadow-2xl md:grid-cols-4">
                        {statItems.map(([label, value], i) => (
                            <div
                                key={label}
                                className={`px-2 text-center ${i < 3 ? 'md:border-r md:border-white/10' : ''}`}
                            >
                                <div className="font-display text-4xl font-semibold leading-none text-white">
                                    <Counter end={value} />
                                </div>
                                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-white/60">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TENTANG */}
            <section id="tentang-sigap" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-24">
                <div className="grid items-center gap-12 lg:grid-cols-12">
                    <div className="lg:col-span-5">
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src={ABOUT_IMG}
                                alt="Warga dan fasilitas desa"
                                className="h-[420px] w-full object-cover"
                                loading="lazy"
                            />
                            <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-bold text-white">
                                🏅 Transparan &amp; Akuntabel
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-accent">
                            Tentang Kami
                        </p>
                        <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-green-dark md:text-4xl">
                            Apa itu <span className="text-accent">SIGAP</span>?
                        </h2>
                        <div className="mb-5 mt-4 h-[3px] w-12 rounded bg-accent" />

                        <p className="leading-8 text-muted">
                            <strong className="text-green-dark">SIGAP</strong> (Sistem Informasi Gangguan &amp;
                            Aduan Publik) adalah platform digital yang menjembatani warga dan pemerintah dalam
                            penanganan kerusakan fasilitas publik.
                        </p>
                        <p className="mt-3 leading-8 text-muted">
                            Melalui SIGAP, warga dapat melaporkan masalah lengkap dengan foto dan lokasi peta.
                            Sistem secara otomatis menghitung <em>priority score</em> berdasarkan tingkat
                            keparahan, jumlah pelapor, dan waktu tunggu — sehingga penanganan dilakukan
                            berdasarkan urgensi yang terukur, bukan sekadar urutan datang.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {aboutPoints.map(([title, desc]) => (
                                <div key={title} className="flex items-start gap-3">
                                    <span className="mt-0.5 text-xl text-green-light" aria-hidden="true">✔</span>
                                    <div>
                                        <div className="text-sm font-bold text-green-dark">{title}</div>
                                        <div className="text-[13px] text-muted">{desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FITUR */}
            <section id="fitur-sigap" className="scroll-mt-24 bg-white py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <SectionHeading center eyebrow="Mengapa SIGAP?" title="Fitur yang Membuat Perbedaan" />

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map(([icon, title, desc]) => (
                            <article
                                key={title}
                                className="group relative overflow-hidden rounded-2xl border border-cream-dark bg-cream p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-green-light to-accent opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-pale to-green-light/15 text-2xl">
                                    {icon}
                                </div>
                                <h3 className="mb-2 text-[17px] font-bold text-green-dark">{title}</h3>
                                <p className="text-sm leading-7 text-muted">{desc}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* CARA KERJA */}
            <section id="cara-kerja" className="scroll-mt-24 bg-cream py-20">
                <div className="mx-auto max-w-7xl px-6">
                    <SectionHeading center eyebrow="Alur Penggunaan" title="Bagaimana Cara Kerjanya?" />

                    <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map(([icon, num, title, desc]) => (
                            <div key={num} className="p-3 text-center">
                                <div className="mx-auto mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-green-light to-green-light text-3xl shadow-lg shadow-green-mid/30">
                                    {icon}
                                </div>
                                <div className="mb-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-accent">
                                    Langkah {num}
                                </div>
                                <h3 className="mb-2 text-base font-bold text-green-dark">{title}</h3>
                                <p className="text-[13.5px] leading-7 text-muted">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="scroll-mt-24 bg-cream pb-24">
                <div className="mx-auto max-w-7xl px-6">
                    <SectionHeading center eyebrow="Pertanyaan Umum" title="Frequently Asked Questions" />
                    <Faq />
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-green-dark to-green-light py-20 text-center">
                <div className="mx-auto max-w-7xl px-6">
                    <h2 className="font-display text-3xl font-semibold text-white md:text-4xl">
                        {isLoggedIn ? 'Ada Fasilitas Umum yang Perlu Diperbaiki?' : 'Siap Membuat Perubahan?'}
                    </h2>
                    <p className="mx-auto mb-8 mt-4 max-w-md leading-7 text-white/70">
                        {isLoggedIn
                            ? 'Buat laporan sekarang dan bantu pemerintah menindaklanjuti permasalahan di lingkungan Anda.'
                            : 'Bergabunglah dengan ribuan warga yang sudah melaporkan kondisi fasilitas publik di kota Anda.'}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            to={isLoggedIn ? '/reports/create' : '/register'}
                            className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 font-bold text-white shadow-lg shadow-accent/35 transition hover:-translate-y-0.5 hover:bg-brown-warm"
                        >
                            {isLoggedIn ? '📣 Buat Laporan' : '➕ Daftar Sekarang'}
                        </Link>
                        <Link
                            to="/laporan"
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-white/45 px-7 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10"
                        >
                            🔎 {isLoggedIn ? 'Lihat Rekap Laporan' : 'Lihat Laporan Publik'}
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
