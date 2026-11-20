import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import reportService from '../../services/reportService';
import { formatDate, formatDateLong, getInitial, storageUrl, timeAgo } from '../../utils/format';
import Loading from '../Loading';
import StatusBadge from '../StatusBadge';
import Icon from './icons';
import Lightbox from './Lightbox';
import ReadOnlyMap from './ReadOnlyMap';

const TRACKER_STEPS = [
    { key: 'masuk', label: 'Laporan Masuk', icon: 'inbox' },
    { key: 'diverifikasi', label: 'Proses Verifikasi', icon: 'book' },
    { key: 'ditindaklanjuti', label: 'Proses Tindak Lanjut', icon: 'flame' },
    { key: 'selesai', label: 'Selesai', icon: 'checkCircle' },
];

function SectionCard({ icon, title, children }) {
    return (
        <section className="rounded-2xl border border-cream-dark bg-white p-6 md:p-7">
            <h2 className="mb-4 flex items-center gap-2 border-b-2 border-cream-dark pb-3 font-display text-lg font-semibold text-green-dark">
                <Icon name={icon} className="h-5 w-5 text-brown-warm" />
                {title}
            </h2>
            {children}
        </section>
    );
}

function PhotoGallery({ images, onOpen }) {
    const total = images.length;
    if (total === 0) return null;

    const shown = images.slice(0, 3);
    const extra = total > 3 ? total - 3 : 0;

    const tile = (src, i, className = '') => {
        const showMore = i === shown.length - 1 && extra > 0;

        return (
            <button
                key={src}
                type="button"
                onClick={() => onOpen(i)}
                aria-label={`Buka foto ${i + 1}`}
                className={`group relative cursor-zoom-in overflow-hidden rounded-xl ${className}`}
            >
                <img
                    src={src}
                    alt={`Foto laporan ${i + 1}`}
                    loading="lazy"
                    className="block h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {showMore && (
                    <span className="absolute inset-0 flex items-center justify-center bg-green-dark/65 text-2xl font-bold text-white">
                        +{extra}
                    </span>
                )}
            </button>
        );
    };

    if (total === 1) {
        return <div className="h-56">{tile(shown[0], 0, 'h-full w-full')}</div>;
    }

    // 2–3 foto: foto pertama besar di kiri, sisanya bertumpuk di kanan
    return (
        <div className="grid h-56 grid-cols-[2fr_1fr] grid-rows-2 gap-2">
            {tile(shown[0], 0, 'row-span-2')}
            {shown.length === 2
                ? tile(shown[1], 1, 'row-span-2')
                : shown.slice(1).map((src, i) => tile(src, i + 1))}
        </div>
    );
}

function StatusTracker({ report }) {
    const rawIndex = TRACKER_STEPS.findIndex((step) => step.key === report.status);
    const currentIndex = rawIndex === -1 ? 0 : rawIndex;

    return (
        <section className="rounded-2xl border border-cream-dark bg-white p-6 md:p-8">
            <div className="relative flex items-start">
                <div className="absolute left-[12.5%] right-[12.5%] top-[22px] h-0.5 bg-cream-dark md:top-7" />

                {TRACKER_STEPS.map((step, index) => {
                    const isDone = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    const circle = isCurrent
                        ? 'border-green-dark bg-green-dark text-white shadow-[0_4px_16px_rgba(30,58,31,0.3)]'
                        : isDone
                          ? 'border-green-mid bg-green-pale text-green-mid'
                          : 'border-cream-dark bg-cream-dark text-muted';

                    return (
                        <div key={step.key} className="relative z-[1] flex-1 text-center">
                            <div
                                className={`mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-full border-[3px] transition md:h-14 md:w-14 ${circle}`}
                            >
                                <Icon name={step.icon} className="h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <p
                                className={`mb-0.5 text-[0.7rem] font-bold md:text-[0.8rem] ${
                                    isDone || isCurrent ? 'text-green-dark' : 'text-muted'
                                }`}
                            >
                                {step.label}
                            </p>
                            <p className="min-h-4 text-[0.72rem] text-muted">
                                {index === 0
                                    ? formatDate(report.created_at)
                                    : isDone || isCurrent
                                      ? formatDate(report.updated_at)
                                      : ''}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-cream-dark pt-4">
                <span className="text-[0.8rem] text-muted">Status saat ini:</span>
                <StatusBadge status={report.status} />
            </div>
        </section>
    );
}

function CommentItem({ comment, canDelete, onDelete }) {
    const name = comment.user?.name || 'Pengguna';
    const photo = storageUrl(comment.user?.profile_photo);

    return (
        <div className="flex gap-3.5 border-b border-cream-dark py-4 last:border-b-0">
            <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-green-mid bg-green-pale text-[0.8rem] font-bold text-green-dark">
                {photo ? (
                    <img src={photo} alt={name} className="h-full w-full object-cover" />
                ) : (
                    getInitial(name)
                )}
            </div>

            <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-sm font-bold text-green-dark">{name}</p>
                <p className="break-words text-sm leading-relaxed text-muted">{comment.comment}</p>
                <p className="mt-1 text-[0.72rem] text-[#A0AEC0]">{timeAgo(comment.created_at)}</p>
            </div>

            {canDelete && (
                <button
                    type="button"
                    onClick={() => onDelete(comment.id)}
                    title="Hapus"
                    aria-label="Hapus komentar"
                    className="self-start text-[#FC8181] transition hover:text-red-600"
                >
                    <Icon name="trash" className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

/**
 * Detail laporan bersama — dipakai PublicReportDetail (/laporan/:id) dan
 * user ReportDetail (/reports/:id). Sumber tampilan: resources/views/laporan/show.blade.php.
 *
 * variant:
 *   "public"    → hero full-width (untuk PublicLayout)
 *   "dashboard" → hero bersudut membulat di dalam <main> (untuk UserLayout)
 */
export default function ReportDetailView({
    reportId,
    variant = 'public',
    backTo = '/laporan',
    backLabel = 'Kembali',
}) {
    const { user } = useAuth();
    const isPublic = variant === 'public';

    const [report, setReport] = useState(null);
    const [status, setStatus] = useState('loading'); // loading | ready | notfound | error
    const [lightbox, setLightbox] = useState(null); // { images: string[], index: number }

    const [commentText, setCommentText] = useState('');
    const [commentError, setCommentError] = useState('');
    const [posting, setPosting] = useState(false);

    const load = useCallback(() => {
        let active = true;
        setStatus('loading');

        reportService
            .getReport(reportId)
            .then((response) => {
                if (!active) return;
                setReport(response.data);
                setStatus('ready');
            })
            .catch((error) => {
                if (!active) return;
                setStatus(error.response?.status === 404 ? 'notfound' : 'error');
            });

        return () => {
            active = false;
        };
    }, [reportId]);

    useEffect(() => load(), [load]);

    useEffect(() => {
        if (!report?.title) return undefined;

        const previous = document.title;
        document.title = `${report.title} — SIGAP`;

        return () => {
            document.title = previous;
        };
    }, [report?.title]);

    const closeLightbox = useCallback(() => setLightbox(null), []);
    const changeLightbox = useCallback(
        (index) => setLightbox((current) => (current ? { ...current, index } : current)),
        [],
    );

    const submitComment = async (event) => {
        event.preventDefault();

        const text = commentText.trim();
        if (!text || posting) return;

        setPosting(true);
        setCommentError('');

        try {
            const response = await reportService.addComment(report.id, text);

            setReport((current) => ({
                ...current,
                comments: [...(current.comments ?? []), response.data],
            }));
            setCommentText('');
        } catch (error) {
            setCommentError(
                error.response?.data?.errors?.comment?.[0] ??
                    error.response?.data?.message ??
                    'Komentar gagal dikirim. Coba lagi.',
            );
        } finally {
            setPosting(false);
        }
    };

    const deleteComment = async (commentId) => {
        if (!window.confirm('Hapus komentar ini?')) return;

        try {
            await reportService.deleteComment(commentId);

            setReport((current) => ({
                ...current,
                comments: (current.comments ?? []).filter((item) => item.id !== commentId),
            }));
        } catch (error) {
            setCommentError(error.response?.data?.message ?? 'Komentar gagal dihapus.');
        }
    };

    if (status === 'loading') {
        return <Loading label="Memuat detail laporan..." />;
    }

    if (status !== 'ready') {
        return (
            <div className="mx-auto max-w-xl px-4 py-20 text-center">
                <Icon name="folder" className="mx-auto h-14 w-14 text-muted/40" />
                <h1 className="mt-4 font-display text-xl font-semibold text-green-dark">
                    {status === 'notfound' ? 'Laporan Tidak Ditemukan' : 'Laporan Gagal Dimuat'}
                </h1>
                <p className="mt-2 text-sm text-muted">
                    {status === 'notfound'
                        ? 'Laporan ini tidak tersedia atau telah dihapus.'
                        : 'Terjadi kendala saat mengambil data. Silakan coba lagi.'}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                    {status === 'error' && (
                        <button type="button" onClick={load} className="btn-accent">
                            Coba lagi
                        </button>
                    )}
                    <Link to={backTo} className="btn-outline">
                        {backLabel}
                    </Link>
                </div>
            </div>
        );
    }

    const images = (report.images ?? []).map((image) => storageUrl(image.image_path));
    const updates = report.project_updates ?? report.projectUpdates ?? [];
    const comments = report.comments ?? [];

    const address =
        [
            report.subdistrict && `Kelurahan ${report.subdistrict}`,
            report.district && `Kecamatan ${report.district}`,
        ]
            .filter(Boolean)
            .join(', ') || '-';

    const authorName = report.is_anonymous ? 'Anonim' : report.user?.name || 'Pengguna';

    const heroClass = isPublic
        ? 'relative h-80 overflow-hidden bg-green-dark'
        : 'relative h-56 overflow-hidden rounded-2xl bg-green-dark md:h-64';

    return (
        <div className={isPublic ? 'bg-cream pb-12' : 'pb-4'}>
            {lightbox && (
                <Lightbox
                    images={lightbox.images}
                    index={lightbox.index}
                    onClose={closeLightbox}
                    onChange={changeLightbox}
                />
            )}

            {/* ── HERO ───────────────────────────────── */}
            <div className={heroClass}>
                {images[0] && (
                    <img
                        src={images[0]}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.65]"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-green-dark/30 to-green-dark/85" />

                <div className="absolute inset-x-0 top-0 z-10">
                    <div className={`pt-5 ${isPublic ? 'mx-auto max-w-7xl px-4 sm:px-6' : 'px-5'}`}>
                        <Link
                            to={backTo}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/80 transition hover:text-white"
                        >
                            <Icon name="arrowLeft" className="h-4 w-4" />
                            {backLabel}
                        </Link>
                    </div>
                </div>
            </div>

            <div className={isPublic ? 'mx-auto max-w-7xl px-4 sm:px-6' : 'px-2 sm:px-4'}>
                {/* ── INFO CARD (menimpa hero) ─────────── */}
                <div
                    className={`relative z-10 rounded-2xl border border-cream-dark bg-white p-6 md:p-8 ${
                        isPublic ? '-mt-20 md:-mt-20' : '-mt-14'
                    }`}
                >
                    <div className="grid items-start gap-6 md:grid-cols-12">
                        <div className="md:col-span-7">
                            <h1 className="font-display text-[1.4rem] font-semibold leading-tight text-green-dark sm:text-3xl">
                                {report.title}
                            </h1>

                            <p className="mt-2 text-sm font-medium italic text-brown-warm">
                                oleh {authorName}
                            </p>

                            <p className="mt-3 flex items-start gap-1.5 text-sm text-muted">
                                <Icon name="pin" className="mt-0.5 h-4 w-4 shrink-0 text-brown-warm" />
                                {address}
                            </p>

                            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-green-dark px-3.5 py-1.5 text-[0.775rem] font-bold text-white">
                                <Icon name="tag" className="h-3.5 w-3.5" />
                                {report.category?.name || 'Umum'}
                            </span>
                        </div>

                        <div className="md:col-span-5">
                            <PhotoGallery
                                images={images}
                                onOpen={(index) => setLightbox({ images, index })}
                            />
                        </div>
                    </div>
                </div>

                {/* ── STATUS TRACKER ───────────────────── */}
                <div className="mt-6">
                    <StatusTracker report={report} />
                </div>

                {/* ── KONTEN ───────────────────────────── */}
                <div className="mt-6 grid items-start gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-7">
                        <SectionCard icon="file" title="Deskripsi Proyek">
                            <p className="whitespace-pre-line break-words text-[0.935rem] leading-[1.8] text-muted">
                                {report.description}
                            </p>

                            <ReadOnlyMap
                                className="mt-4"
                                latitude={report.latitude}
                                longitude={report.longitude}
                                title={report.title}
                                address={address}
                            />

                            <p className="mt-2 flex items-center gap-1.5 text-[0.78rem] text-muted">
                                <Icon name="pin" className="h-3.5 w-3.5 text-brown-warm" />
                                {address}
                            </p>
                        </SectionCard>

                        <SectionCard icon="calendarCheck" title="Update Proyek">
                            {updates.length > 0 ? (
                                <div className="relative before:absolute before:bottom-0 before:left-[17px] before:top-0 before:w-0.5 before:bg-cream-dark">
                                    {updates.map((update) => {
                                        const photos = (update.images ?? []).map((image) =>
                                            storageUrl(image.image_path),
                                        );

                                        return (
                                            <div
                                                key={update.id}
                                                className="relative flex gap-4 pb-6 last:pb-0"
                                            >
                                                <div className="z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-green-mid bg-green-pale text-green-mid">
                                                    <Icon name="calendarCheck" className="h-4 w-4" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="mb-0.5 text-[0.775rem] font-bold text-brown-warm">
                                                        {formatDateLong(update.created_at)}
                                                    </p>
                                                    <p className="mb-1 text-[0.9rem] font-bold text-green-dark">
                                                        {update.title}
                                                    </p>
                                                    <p className="whitespace-pre-line break-words text-sm leading-[1.7] text-muted">
                                                        {update.description}
                                                    </p>

                                                    {photos.length > 0 && (
                                                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                                                            {photos.map((src, index) => (
                                                                <button
                                                                    key={src}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setLightbox({ images: photos, index })
                                                                    }
                                                                    aria-label={`Buka foto update ${index + 1}`}
                                                                    className="group h-16 w-16 cursor-zoom-in overflow-hidden rounded-lg border-[1.5px] border-cream-dark"
                                                                >
                                                                    <img
                                                                        src={src}
                                                                        alt="Foto update proyek"
                                                                        loading="lazy"
                                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                                    />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-6 text-center">
                                    <Icon name="calendarX" className="mx-auto h-8 w-8 text-[#A0AEC0]" />
                                    <p className="mt-2 text-[0.9rem] text-muted">
                                        Belum ada update terbaru dari admin.
                                    </p>
                                </div>
                            )}
                        </SectionCard>
                    </div>

                    {/* ── KOMENTAR WARGA ─────────────────── */}
                    <div className="lg:sticky lg:top-24 lg:col-span-5">
                        <SectionCard icon="chat" title="Komentar Warga">
                            {comments.length > 0 ? (
                                <div>
                                    {comments.map((comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            comment={comment}
                                            canDelete={Boolean(user) && user.id === comment.user_id}
                                            onDelete={deleteComment}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-4 text-center text-sm text-muted">
                                    <Icon name="chat" className="mx-auto mb-2 h-8 w-8 opacity-30" />
                                    Belum ada komentar. Jadilah yang pertama!
                                </div>
                            )}

                            {user ? (
                                <form onSubmit={submitComment} className="mt-4">
                                    <div className="flex items-end gap-2.5">
                                        <textarea
                                            value={commentText}
                                            onChange={(event) => setCommentText(event.target.value)}
                                            placeholder="Tulis komentar…"
                                            rows={1}
                                            maxLength={500}
                                            required
                                            aria-label="Komentar"
                                            className="field-input min-h-11 flex-1 resize-none bg-cream focus:bg-white"
                                        />
                                        <button
                                            type="submit"
                                            disabled={posting || !commentText.trim()}
                                            className="btn-green whitespace-nowrap !px-5 !py-2.5 text-sm"
                                        >
                                            <Icon name="send" className="h-4 w-4" />
                                            {posting ? 'Mengirim…' : 'Kirim'}
                                        </button>
                                    </div>
                                    {commentError && (
                                        <p role="alert" className="mt-1.5 text-[0.775rem] text-[#E53E3E]">
                                            {commentError}
                                        </p>
                                    )}
                                </form>
                            ) : (
                                <div className="mt-4 rounded-xl bg-cream p-3.5 text-center text-sm text-muted">
                                    <Link to="/login" className="font-bold text-green-mid hover:text-accent">
                                        Masuk
                                    </Link>{' '}
                                    untuk menambahkan komentar.
                                </div>
                            )}
                        </SectionCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
