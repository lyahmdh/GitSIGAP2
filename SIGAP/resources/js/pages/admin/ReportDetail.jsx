import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import reportService from '../../services/reportService';
import { formatDateLong, storageUrl } from '../../utils/format';
import Loading from '../../components/Loading';
import ReadOnlyMap from '../../components/report/ReadOnlyMap';

const statusOrder = ['masuk', 'diverifikasi', 'ditindaklanjuti', 'selesai'];
const statusLabels = {
    masuk: 'Masuk',
    diverifikasi: 'Diverifikasi',
    ditindaklanjuti: 'Ditindaklanjuti',
    selesai: 'Selesai',
    ditolak: 'Ditolak',
};
const statusStyles = {
    masuk: 'bg-amber-100 text-amber-800',
    diverifikasi: 'bg-violet-100 text-violet-800',
    ditindaklanjuti: 'bg-blue-100 text-blue-800',
    selesai: 'bg-green-100 text-green-800',
    ditolak: 'bg-red-100 text-red-800',
};
const transitions = {
    masuk: ['diverifikasi', 'ditolak'],
    diverifikasi: ['ditindaklanjuti', 'ditolak'],
    ditindaklanjuti: ['selesai'],
    selesai: [],
    ditolak: [],
};
const steps = [
    { key: 'masuk', label: 'Laporan Masuk', icon: '▣' },
    { key: 'diverifikasi', label: 'Proses Verifikasi', icon: '▤' },
    { key: 'ditindaklanjuti', label: 'Proses Tindak Lanjut', icon: '⚒' },
    { key: 'selesai', label: 'Selesai', icon: '✓' },
];
const severityLabels = { 1: 'Rendah', 2: 'Sedang', 3: 'Mendesak' };
const inputClass = 'mt-1.5 w-full rounded-lg border border-cream-dark px-3 py-2.5 font-normal outline-none focus:border-green-mid disabled:bg-cream disabled:text-muted';

function getErrorMessage(error, fallback) {
    const validationErrors = error.response?.data?.errors;
    if (validationErrors) {
        const firstError = Object.values(validationErrors).flat()[0];
        if (firstError) return firstError;
    }

    return error.response?.data?.message || fallback;
}

function sortUpdates(items = []) {
    return [...items].sort((a, b) => {
        const dateDifference = new Date(a.created_at || 0) - new Date(b.created_at || 0);
        return dateDifference || Number(a.id) - Number(b.id);
    });
}

function PhotoGrid({ images = [], label = 'Foto' }) {
    const [openedImage, setOpenedImage] = useState(null);
    const urls = images
        .map((image) => storageUrl(typeof image === 'string' ? image : image?.image_path))
        .filter(Boolean);

    if (!urls.length) return null;

    return (
        <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {urls.map((url, index) => (
                    <button
                        key={`${url}-${index}`}
                        type="button"
                        onClick={() => setOpenedImage(url)}
                        className="overflow-hidden rounded-lg border border-cream-dark bg-cream text-left"
                        aria-label={`Lihat ${label.toLowerCase()} ${index + 1}`}
                    >
                        <img
                            src={url}
                            alt={`${label} ${index + 1}`}
                            loading="lazy"
                            className="h-32 w-full object-cover transition hover:scale-[1.02]"
                        />
                    </button>
                ))}
            </div>
            {openedImage && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Pratinjau ${label.toLowerCase()}`}
                    onClick={() => setOpenedImage(null)}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
                >
                    <button
                        type="button"
                        onClick={() => setOpenedImage(null)}
                        className="absolute right-5 top-4 rounded-full bg-white/15 px-3 py-2 text-xl text-white"
                        aria-label="Tutup foto"
                    >
                        ×
                    </button>
                    <img
                        src={openedImage}
                        alt={label}
                        onClick={(event) => event.stopPropagation()}
                        className="max-h-[90vh] max-w-full rounded-lg object-contain"
                    />
                </div>
            )}
        </>
    );
}

export default function AdminReportDetail() {
    const { id } = useParams();
    const [report, setReport] = useState(null);
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [notice, setNotice] = useState(null);

    const [selectedStatus, setSelectedStatus] = useState('');
    const [statusSaving, setStatusSaving] = useState(false);
    const [updateTitle, setUpdateTitle] = useState('');
    const [updateDescription, setUpdateDescription] = useState('');
    const [updateImages, setUpdateImages] = useState([]);
    const [updateSaving, setUpdateSaving] = useState(false);

    const loadReport = useCallback(async () => {
        setLoading(true);
        setLoadError('');

        try {
            const [reportResponse, updatesResponse] = await Promise.all([
                reportService.getAdminReport(id),
                reportService.getProjectUpdates(id),
            ]);

            setReport(reportResponse.data);
            setSelectedStatus(reportResponse.data.status);
            setUpdates(sortUpdates(updatesResponse.data || reportResponse.data.project_updates || reportResponse.data.projectUpdates || []));
        } catch (error) {
            setLoadError(getErrorMessage(error, 'Detail laporan gagal dimuat. Periksa koneksi atau hak akses admin.'));
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    const allowedStatuses = useMemo(
        () => transitions[report?.status] || [],
        [report?.status],
    );

    const currentIndex = statusOrder.indexOf(report?.status);
    const districtName = report?.district_record?.name || report?.districtRecord?.name || report?.district || '-';
    const location = report?.formatted_address || [report?.location_detail, districtName].filter(Boolean).join(', ') || '-';
    const reporterName = report?.is_anonymous ? 'Anonim' : report?.user?.name || 'Pengguna';
    const reportImages = report?.images || [];

    const handleStatusSubmit = async (event) => {
        event.preventDefault();
        if (!report || !selectedStatus || selectedStatus === report.status || statusSaving) return;

        setStatusSaving(true);
        setNotice(null);

        try {
            const response = await reportService.updateAdminReportStatus(id, selectedStatus);
            const updatedReport = response.data;
            setReport((current) => ({ ...current, ...updatedReport }));
            setSelectedStatus(updatedReport.status);
            setNotice({ type: 'success', text: response.message || `Status berhasil diperbarui menjadi ${statusLabels[updatedReport.status]}.` });
        } catch (error) {
            setSelectedStatus(report.status);
            setNotice({ type: 'error', text: getErrorMessage(error, 'Status gagal diperbarui. Silakan coba kembali.') });
        } finally {
            setStatusSaving(false);
        }
    };

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = '';

        if (files.length > 5) {
            setNotice({ type: 'error', text: 'Foto dokumentasi maksimal 5 file.' });
            return;
        }

        const invalidFile = files.find((file) => !['image/jpeg', 'image/png'].includes(file.type));
        if (invalidFile) {
            setNotice({ type: 'error', text: 'Format foto harus JPG, JPEG, atau PNG.' });
            return;
        }

        const oversizedFile = files.find((file) => file.size > 2 * 1024 * 1024);
        if (oversizedFile) {
            setNotice({ type: 'error', text: 'Ukuran setiap foto maksimal 2 MB.' });
            return;
        }

        setUpdateImages(files);
        setNotice(null);
    };

    const handleAddUpdate = async (event) => {
        event.preventDefault();
        const title = updateTitle.trim();
        const description = updateDescription.trim();

        if (!title || !description || updateSaving) return;

        setUpdateSaving(true);
        setNotice(null);

        try {
            const response = await reportService.addProjectUpdate(id, {
                title,
                description,
                images: updateImages,
            });

            setUpdates((current) => sortUpdates([...current, response.data]));
            setUpdateTitle('');
            setUpdateDescription('');
            setUpdateImages([]);
            setNotice({ type: 'success', text: response.message || 'Pembaruan progres berhasil disimpan.' });
        } catch (error) {
            setNotice({ type: 'error', text: getErrorMessage(error, 'Pembaruan progres gagal disimpan. Silakan coba kembali.') });
        } finally {
            setUpdateSaving(false);
        }
    };

    if (loading) return <Loading />;

    if (loadError || !report) {
        return (
            <div className="rounded-xl border border-red-200 bg-white p-6 text-green-dark">
                <Link to="/admin/reports" className="text-sm font-semibold text-green-mid hover:underline">← Kembali ke manajemen laporan</Link>
                <p role="alert" className="mt-4 text-sm text-red-700">{loadError || 'Laporan tidak ditemukan.'}</p>
                <button type="button" onClick={loadReport} className="mt-4 rounded-lg bg-green-dark px-4 py-2 text-sm font-bold text-white hover:bg-green-mid">Coba Lagi</button>
            </div>
        );
    }

    return (
        <div className="space-y-6 text-green-dark">
            <header>
                <Link to="/admin/reports" className="text-sm font-semibold text-green-mid hover:underline">← Kembali ke manajemen laporan</Link>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[.16em] text-accent">Detail Laporan · #{String(report.id).padStart(3, '0')}</p>
                        <h1 className="mt-1 font-display text-3xl font-semibold">{report.title}</h1>
                        <p className="mt-1 text-sm text-muted">Informasi laporan, perkembangan status, dan update proyek.</p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyles[report.status] || 'bg-cream text-muted'}`}>{statusLabels[report.status] || report.status}</span>
                </div>
            </header>

            {notice && (
                <div role="status" className={`rounded-lg border px-4 py-3 text-sm ${notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-700'}`}>
                    {notice.text}
                </div>
            )}

            <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                <h2 className="mb-6 font-display text-xl font-semibold">Informasi Laporan</h2>
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Judul Laporan</p><p className="mt-1 font-semibold">{report.title || '-'}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Kategori</p><p className="mt-1">{report.category?.name || '-'}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Pelapor</p><p className="mt-1">{reporterName}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Tanggal Laporan</p><p className="mt-1">{formatDateLong(report.created_at)}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Lokasi</p><p className="mt-1">{location}</p></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Tingkat Keparahan</p><span className="mt-1 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">{severityLabels[report.severity] || 'Tidak diketahui'}</span></div>
                    <div><p className="text-xs font-bold uppercase tracking-wider text-muted">Priority Score</p><p className="mt-1 font-semibold">{Number(report.priority_score || 0).toFixed(2)}/100</p></div>
                    <div className="sm:col-span-2"><p className="text-xs font-bold uppercase tracking-wider text-muted">Deskripsi Laporan</p><p className="mt-1 whitespace-pre-line text-sm leading-7 text-muted">{report.description || '-'}</p></div>
                </div>
                <PhotoGrid images={reportImages} label="Foto laporan" />
            </section>

            <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                <h2 className="mb-6 font-display text-xl font-semibold">Status Penanganan</h2>
                {report.status === 'ditolak' ? (
                    <div className="rounded-lg bg-red-50 p-4 text-sm font-semibold text-red-800">Laporan ini telah ditolak.</div>
                ) : (
                    <div className="relative grid grid-cols-4 gap-2">
                        <div className="absolute left-[12.5%] right-[12.5%] top-6 h-0.5 bg-cream-dark" />
                        {steps.map((step, index) => {
                            const done = currentIndex >= 0 && index < currentIndex;
                            const current = index === currentIndex;
                            return (
                                <div key={step.key} className="relative z-10 text-center">
                                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full border-[3px] text-lg font-bold ${done ? 'border-green-mid bg-green-pale text-green-mid' : current ? 'border-green-dark bg-green-dark text-white shadow-md' : 'border-cream-dark bg-cream text-muted'}`}>{step.icon}</div>
                                    <p className={`mt-2 text-[11px] font-bold sm:text-sm ${done || current ? 'text-green-dark' : 'text-muted'}`}>{step.label}</p>
                                    {(done || current || index === 0) && <p className="mt-1 text-[10px] text-muted">{index === 0 ? formatDateLong(report.created_at) : formatDateLong(report.updated_at)}</p>}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div className="mt-6 border-t border-cream-dark pt-4 text-sm"><span className="text-muted">Status saat ini:</span> <span className={`ml-2 rounded-full px-3 py-1 text-xs font-bold ${statusStyles[report.status] || 'bg-cream text-muted'}`}>{statusLabels[report.status] || report.status}</span></div>
            </section>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
                <div className="space-y-6">
                    <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-semibold"><span className="text-accent">⌖</span> Deskripsi Proyek</h2>
                        <p className="whitespace-pre-line text-sm leading-7 text-muted">{report.description || '-'}</p>
                        <div className="mt-5">
                            <h3 className="mb-2 text-sm font-semibold">Lokasi Laporan</h3>
                            {report.latitude !== null && report.latitude !== undefined &&
                             report.longitude !== null && report.longitude !== undefined &&
                             Number.isFinite(Number(report.latitude)) && Number.isFinite(Number(report.longitude)) ? (
                                <ReadOnlyMap
                                    latitude={report.latitude}
                                    longitude={report.longitude}
                                    title={report.title}
                                    address={location}
                                    className="h-72 w-full"
                                />
                            ) : (
                                <div className="flex min-h-28 items-center justify-center rounded-lg border border-dashed border-cream-dark bg-cream px-4 text-center text-sm text-muted">
                                    Koordinat lokasi laporan belum tersedia.
                                </div>
                            )}
                            <p className="mt-3 text-xs text-muted">⌖ {location}</p>
                        </div>
                    </section>

                    <section className="rounded-xl border border-cream-dark bg-white p-5 md:p-7">
                        <h2 className="mb-5 font-display text-xl font-semibold">▦ Update Proyek</h2>
                        <form onSubmit={handleAddUpdate} className="space-y-4">
                            <label className="block text-sm font-semibold">Judul Update
                                <input required maxLength={150} value={updateTitle} onChange={(event) => setUpdateTitle(event.target.value)} placeholder="Masukkan judul update" className={inputClass} disabled={updateSaving} />
                            </label>
                            <label className="block text-sm font-semibold">Deskripsi
                                <textarea required rows={3} value={updateDescription} onChange={(event) => setUpdateDescription(event.target.value)} placeholder="Jelaskan perkembangan proyek..." className={inputClass} disabled={updateSaving} />
                            </label>
                            <label className="block text-sm font-semibold">Foto Progress <span className="font-normal text-muted">(maksimal 5 foto, JPG/PNG, 2 MB per foto)</span>
                                <input type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" multiple onChange={handleImageChange} disabled={updateSaving} className="mt-1.5 block w-full rounded-lg border border-cream-dark bg-white px-3 py-2 text-sm font-normal file:mr-3 file:rounded-md file:border-0 file:bg-green-pale file:px-3 file:py-2 file:font-semibold file:text-green-dark" />
                            </label>
                            {updateImages.length > 0 && <div className="rounded-lg bg-cream p-3 text-xs text-muted">{updateImages.length} foto dipilih: {updateImages.map((file) => file.name).join(', ')} <button type="button" onClick={() => setUpdateImages([])} className="ml-2 font-bold text-red-600 hover:underline">Hapus pilihan</button></div>}
                            <button type="submit" disabled={updateSaving || !updateTitle.trim() || !updateDescription.trim()} className="rounded-lg bg-green-dark px-5 py-2.5 text-sm font-bold text-white transition hover:bg-green-mid disabled:cursor-not-allowed disabled:opacity-50">{updateSaving ? 'Menyimpan...' : '＋ Tambah Update'}</button>
                        </form>
                        <div className="my-6 border-t border-cream-dark" />
                        {updates.length ? (
                            <div className="relative space-y-6 before:absolute before:bottom-2 before:left-[9px] before:top-2 before:w-px before:bg-cream-dark">
                                {sortUpdates(updates).map((update) => (
                                    <article key={update.id} className="relative flex gap-4">
                                        <span className="relative z-10 mt-1 h-5 w-5 shrink-0 rounded-full border-4 border-green-pale bg-green-mid" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-muted">{formatDateLong(update.created_at)}</p>
                                            <h3 className="mt-1 font-bold">{update.title}</h3>
                                            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-muted">{update.description}</p>
                                            {update.admin?.name && <p className="mt-2 text-xs text-muted">Diperbarui oleh {update.admin.name}</p>}
                                            <PhotoGrid images={update.images || []} label="Foto progres" />
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="py-6 text-center text-sm text-muted">Belum ada update terbaru dari admin.</p>
                        )}
                    </section>
                </div>

                <aside className="h-fit rounded-xl border border-cream-dark bg-white p-5 md:p-6">
                    <h2 className="mb-2 font-display text-xl font-semibold">Perbarui Status</h2>
                    <p className="mb-5 text-sm text-muted">Pilih status berikutnya sesuai perkembangan penanganan laporan.</p>
                    <form onSubmit={handleStatusSubmit} className="space-y-4">
                        <label className="block text-sm font-semibold">Status Laporan
                            <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)} disabled={!allowedStatuses.length || statusSaving} className={inputClass}>
                                <option value={report.status}>{statusLabels[report.status]}</option>
                                {allowedStatuses.map((next) => <option key={next} value={next}>{statusLabels[next]}</option>)}
                            </select>
                        </label>
                        {!allowedStatuses.length && <p className="rounded-lg bg-cream p-3 text-xs text-muted">Status laporan ini sudah final dan tidak memiliki perubahan status berikutnya.</p>}
                        <button type="submit" disabled={!allowedStatuses.length || selectedStatus === report.status || statusSaving} className="w-full rounded-lg bg-green-dark px-4 py-3 text-sm font-bold text-white transition hover:bg-green-mid disabled:cursor-not-allowed disabled:opacity-40">{statusSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
                    </form>
                    <p className="mt-4 text-xs leading-5 text-muted">Perubahan status akan disimpan ke database dan dicatat dalam riwayat status laporan.</p>
                </aside>
            </div>
        </div>
    );
}
