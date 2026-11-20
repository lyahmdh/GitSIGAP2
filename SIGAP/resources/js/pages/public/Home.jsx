import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <section className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white">
                <div className="mx-auto grid max-w-7xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
                            Sistem Informasi Pengaduan
                        </p>

                        <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
                            Suarakan Aspirasi,
                            <span className="block text-emerald-300">
                                Bangun Perubahan.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-xl leading-8 text-emerald-50/80">
                            Laporkan permasalahan fasilitas publik dan pantau
                            perkembangan penanganannya secara transparan melalui SIGAP.
                        </p>

                        <div className="mt-9 flex flex-wrap gap-3">
                            <Link
                                to="/reports/create"
                                className="rounded-xl bg-white px-6 py-3 font-bold text-emerald-900 hover:bg-emerald-50"
                            >
                                Buat Laporan
                            </Link>
                            <Link
                                to="/login"
                                className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
                            >
                                Masuk Akun
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/15 bg-white/10 p-8 backdrop-blur">
                        <p className="text-sm font-semibold text-emerald-200">
                            LAYANAN PUBLIK
                        </p>
                        <h2 className="mt-4 text-3xl font-bold">
                            Pengaduan yang lebih mudah dan transparan.
                        </h2>
                        <p className="mt-4 leading-7 text-emerald-50/75">
                            Satu platform untuk menyampaikan laporan, memantau
                            tindak lanjut, dan melihat kondisi fasilitas publik.
                        </p>
                        <div className="mt-8 grid grid-cols-2 gap-3">
                            {['Jalan & Transportasi', 'Air & Drainase', 'Ruang Publik', 'Penerangan Umum'].map((item) => (
                                <div key={item} className="rounded-xl bg-white/10 p-4 text-sm font-medium">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-6 py-20">
                <div className="max-w-2xl">
                    <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">
                        Cara Kerja
                    </p>
                    <h2 className="mt-3 text-3xl font-bold text-slate-900">
                        Sampaikan laporan dalam beberapa langkah
                    </h2>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {[
                        ['01', 'Buat Laporan', 'Sampaikan permasalahan beserta lokasi dan bukti pendukung.'],
                        ['02', 'Pantau Proses', 'Lihat status dan perkembangan penanganan laporan.'],
                        ['03', 'Dapatkan Hasil', 'Terima informasi ketika laporan telah ditindaklanjuti.'],
                    ].map(([number, title, description]) => (
                        <article key={number} className="rounded-2xl border border-slate-200 bg-white p-6">
                            <span className="text-sm font-black text-emerald-700">{number}</span>
                            <h3 className="mt-4 text-xl font-bold text-slate-900">{title}</h3>
                            <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}