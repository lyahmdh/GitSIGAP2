import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import Icon from '../../components/report/icons';
import StatusBadge from '../../components/StatusBadge';
import reportService from '../../services/reportService';
import { formatDate, storageUrl } from '../../utils/format';

const PER_PAGE = 12;

// Opsi status mengikuti Blade. "Ditolak" tidak ditampilkan karena laporan ditolak
// memang disembunyikan dari publik (API menyaring status != ditolak).
const STATUS_OPTIONS = [
    { value: 'masuk', label: 'Laporan Masuk' },
    { value: 'diverifikasi', label: 'Diverifikasi' },
    { value: 'ditindaklanjuti', label: 'Ditindaklanjuti' },
    { value: 'selesai', label: 'Selesai' },
];

const FILTER_KEYS = ['kecamatan', 'kategori', 'status', 'q', 'sort'];

const selectClass = 'field-input !bg-cream !py-2.5 !text-sm focus:!bg-white';

function PageHeader() {
    return (
        <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-green-dark)_0%,var(--color-green-mid)_70%,var(--color-brown-dark)_100%)] pb-10 pt-14">
            <div className="pointer-events-none absolute -right-14 -top-14 h-80 w-80 rounded-full bg-white/[0.04]" />
            <div className="pointer-events-none absolute -bottom-10 left-[8%] h-44 w-44 rounded-full bg-accent/[0.07]" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
                <h1 className="mb-1.5 font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold text-white">
                    Semua Laporan
                </h1>
                <p className="text-[0.95rem] text-white/65">
                    Daftar seluruh laporan fasilitas publik yang dapat diakses masyarakat.
                </p>
            </div>
        </div>
    );
}

function DistrictStrip({ stats }) {
    if (stats.length === 0) return null;

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <div className="grid grid-cols-2 gap-4 rounded-3xl bg-[linear-gradient(90deg,#8f3d00,#b45400)] p-5 sm:grid-cols-3 md:p-6 lg:grid-cols-5 lg:gap-6">
                {stats.map((district) => (
                    <div
                        key={district.name}
                        className="rounded-[20px] bg-[#451900] px-3 py-6 text-center transition hover:-translate-y-0.5"
                    >
                        <div className="text-5xl font-extrabold leading-none text-white">
                            {district.count}
                        </div>
                        <div className="mt-3 text-[0.95rem] font-semibold text-white">{district.name}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjectCard({ report }) {
    const cover = storageUrl(report.images?.[0]?.image_path);

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-cream-dark bg-white shadow-card transition duration-200 hover:-translate-y-1 hover:border-green-light/25 hover:shadow-float">
            <div className="relative h-[170px] shrink-0 overflow-hidden bg-cream-dark">
                {cover ? (
                    <img
                        src={cover}
                        alt={report.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted/40">
                        <Icon name="image" className="h-10 w-10" />
                    </div>
                )}

                <div className="absolute left-3 top-3">
                    <StatusBadge status={report.status} />
                </div>
            </div>

            <div className="flex flex-1 flex-col px-5 py-4">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted">
                    <Icon name="tag" className="h-3.5 w-3.5" />
                    {report.category?.name || 'Umum'}
                </p>

                <h2 className="mb-2 line-clamp-2 flex-1 text-[0.975rem] font-bold leading-snug text-green-dark">
                    {report.title}
                </h2>

                <div className="mb-3.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.775rem] text-muted">
                    <span className="flex items-center gap-1">
                        <Icon name="pin" className="h-3.5 w-3.5" />
                        {report.district || '-'}
                    </span>
                    <span className="flex items-center gap-1">
                        <Icon name="calendar" className="h-3.5 w-3.5" />
                        {formatDate(report.created_at)}
                    </span>
                </div>

                <div className="mb-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/[0.12] px-2.5 py-1 text-[0.72rem] font-bold text-brown-warm">
                        <Icon name="bolt" className="h-3 w-3" />
                        Prioritas {Math.round(Number(report.priority_score) || 0)}
                    </span>
                </div>

                <Link
                    to={`/laporan/${report.id}`}
                    className="btn-green mt-auto !rounded-lg !px-4 !py-2 text-sm"
                >
                    Lihat Detail
                </Link>
            </div>
        </article>
    );
}

function Pagination({ meta, onChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page: current, last_page: last } = meta;

    const pages = [];
    for (let page = 1; page <= last; page += 1) {
        if (page === 1 || page === last || Math.abs(page - current) <= 1) {
            pages.push(page);
        } else if (pages[pages.length - 1] !== '…') {
            pages.push('…');
        }
    }

    const base =
        'flex h-9 min-w-9 items-center justify-center rounded-lg border border-cream-dark bg-white px-2 text-sm font-medium text-green-mid transition';

    return (
        <nav aria-label="Navigasi halaman" className="mt-8 flex justify-center">
            <ul className="flex items-center gap-1">
                <li>
                    <button
                        type="button"
                        disabled={current === 1}
                        onClick={() => onChange(current - 1)}
                        aria-label="Halaman sebelumnya"
                        className={`${base} hover:border-green-light hover:bg-green-pale disabled:opacity-40`}
                    >
                        <Icon name="chevronLeft" />
                    </button>
                </li>

                {pages.map((page, index) => (
                    <li key={`${page}-${index}`}>
                        {page === '…' ? (
                            <span className="px-1 text-muted">…</span>
                        ) : (
                            <button
                                type="button"
                                onClick={() => onChange(page)}
                                aria-current={page === current ? 'page' : undefined}
                                className={`${base} ${
                                    page === current
                                        ? '!border-green-mid !bg-green-mid !text-white'
                                        : 'hover:border-green-light hover:bg-green-pale'
                                }`}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                <li>
                    <button
                        type="button"
                        disabled={current === last}
                        onClick={() => onChange(current + 1)}
                        aria-label="Halaman berikutnya"
                        className={`${base} hover:border-green-light hover:bg-green-pale disabled:opacity-40`}
                    >
                        <Icon name="chevronRight" />
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default function PublicReports() {
    const [searchParams, setSearchParams] = useSearchParams();

    const kecamatan = searchParams.get('kecamatan') ?? '';
    const kategori = searchParams.get('kategori') ?? '';
    const status = searchParams.get('status') ?? '';
    const q = searchParams.get('q') ?? '';
    const sortValue = searchParams.get('sort') || 'newest';
    const sort = ['newest', 'oldest', 'priority'].includes(sortValue) ? sortValue : 'newest';
    const page = Math.max(1, Number(searchParams.get('page')) || 1);

    const [searchInput, setSearchInput] = useState(q);
    const [districtStats, setDistrictStats] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reports, setReports] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const hasFilters = FILTER_KEYS.some((key) => searchParams.has(key));

    // Jaga kolom cari tetap sinkron saat URL berubah (mis. tombol Reset / back)
    useEffect(() => setSearchInput(q), [q]);

    useEffect(() => {
        const previous = document.title;
        document.title = 'Semua Laporan — SIGAP';
        return () => {
            document.title = previous;
        };
    }, []);

    // Data pendukung: strip kecamatan + dropdown kategori (sekali saja)
    useEffect(() => {
        let active = true;

        reportService
            .getDistrictStats()
            .then((response) => active && setDistrictStats(response.data ?? []))
            .catch(() => {});

        reportService
            .getCategories()
            .then((data) => active && setCategories(Array.isArray(data) ? data : []))
            .catch(() => {});

        return () => {
            active = false;
        };
    }, []);

    // Daftar laporan — dimuat ulang setiap filter/halaman berubah
    useEffect(() => {
        let active = true;
        setLoading(true);
        setError(false);

        const params = { page, per_page: PER_PAGE, sort };
        if (kecamatan) params.district = kecamatan;
        if (kategori) params.category_id = kategori;
        if (status) params.status = status;
        if (q) params.search = q;

        reportService
            .getPublicReports(params)
            .then((response) => {
                if (!active) return;
                setReports(response.data ?? []);
                setMeta(response.meta ?? null);
            })
            .catch(() => active && setError(true))
            .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, [kecamatan, kategori, status, q, sort, page, reloadKey]);

    const updateParams = (patch, { keepPage = false } = {}) => {
        const next = new URLSearchParams(searchParams);

        Object.entries(patch).forEach(([key, value]) => {
            if (value) next.set(key, value);
            else next.delete(key);
        });

        if (!keepPage) next.delete('page');
        setSearchParams(next);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateParams({ q: searchInput.trim() });
    };


    const total = meta?.total ?? reports.length;

    return (
        <div>
            <PageHeader />
            <DistrictStrip stats={districtStats} />

            <div className="bg-cream pb-16 pt-2">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    {/* ── FILTER BAR ───────────────────── */}
                    <form
                        onSubmit={handleSubmit}
                        className="mb-8 rounded-[14px] border border-cream-dark bg-white p-5 shadow-card"
                    >
                        <div className="grid items-center gap-2.5 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.5fr)_auto_auto_auto]">
                            <select
                                value={kecamatan}
                                onChange={(event) => updateParams({ kecamatan: event.target.value })}
                                aria-label="Kecamatan"
                                className={selectClass}
                            >
                                <option value="">Kecamatan</option>
                                {districtStats.map((district) => (
                                    <option key={district.name} value={district.name}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={kategori}
                                onChange={(event) => updateParams({ kategori: event.target.value })}
                                aria-label="Kategori"
                                className={selectClass}
                            >
                                <option value="">Kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={status}
                                onChange={(event) => updateParams({ status: event.target.value })}
                                aria-label="Status"
                                className={selectClass}
                            >
                                <option value="">Semua Status</option>
                                {STATUS_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Cari judul laporan…"
                                aria-label="Cari judul laporan"
                                className={selectClass}
                            />

                            <select
                                value={sort}
                                onChange={(event) => updateParams({ sort: event.target.value })}
                                aria-label="Urutkan laporan"
                                className={`${selectClass} min-w-[165px]`}
                            >
                                <option value="newest">Sort by: Terbaru</option>
                                <option value="oldest">Sort by: Terlama</option>
                                <option value="priority">Sort by: Priority Score</option>
                            </select>

                            <button type="submit" className="btn-green !px-5 !py-2.5 text-sm">
                                <Icon name="search" />
                                Cari
                            </button>

                            {hasFilters && (
                                <Link
                                    to="/laporan"
                                    className="flex items-center gap-1 text-[0.8rem] text-muted transition hover:text-green-mid"
                                >
                                    <Icon name="xCircle" className="h-3.5 w-3.5" />
                                    Reset
                                </Link>
                            )}
                        </div>
                    </form>

                    {/* ── HASIL ────────────────────────── */}
                    <div className="mb-4 flex items-center justify-between text-sm text-muted">
                        <span>
                            Menampilkan <strong className="text-ink">{loading ? '…' : total}</strong> laporan
                        </span>
                        <span className="text-[0.775rem]">
                            Diurutkan:{' '}
                            <strong className="text-green-mid">
                                {sort === 'priority' ? 'Priority Score' : sort === 'oldest' ? 'Terlama' : 'Terbaru'}
                            </strong>
                        </span>
                    </div>

                    {loading ? (
                        <Loading label="Memuat laporan..." />
                    ) : error ? (
                        <div className="py-20 text-center">
                            <p className="font-bold text-green-dark">Laporan gagal dimuat</p>
                            <p className="mt-1 text-sm text-muted">Periksa koneksi Anda lalu coba lagi.</p>
                            <button
                                type="button"
                                onClick={() => setReloadKey((key) => key + 1)}
                                className="btn-accent mt-4"
                            >
                                Coba lagi
                            </button>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="px-8 py-20 text-center text-muted">
                            <Icon name="folder" className="mx-auto mb-4 h-14 w-14 opacity-35" />
                            <h2 className="mb-2 font-bold text-green-dark">Tidak Ada Laporan Ditemukan</h2>
                            <p>Coba ubah filter pencarian Anda.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {reports.map((report) => (
                                    <ProjectCard key={report.id} report={report} />
                                ))}
                            </div>

                            <Pagination
                                meta={meta}
                                onChange={(nextPage) => {
                                    updateParams({ page: String(nextPage) }, { keepPage: true });
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
