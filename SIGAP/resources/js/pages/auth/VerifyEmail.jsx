
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';

export default function VerifyEmail() {
    const { user, refreshUser } = useAuth();

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [message, setMessage] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [checkLoading, setCheckLoading] = useState(false);
    const [verified, setVerified] = useState(
        Boolean(user?.email_verified_at)
    );

    // Mendeteksi apakah user baru saja menyelesaikan verifikasi email
    useEffect(() => {
        if (searchParams.get('verified') === '1') {
            refreshUser().then((currentUser) => {
                if (currentUser?.email_verified_at) {
                    setVerified(true);
                    setMessage('Email kamu berhasil diverifikasi.');
                } else {
                    setMessage(
                        'Status verifikasi belum berhasil diperbarui. Silakan coba periksa kembali.'
                    );
                }
            });
        }
    }, [searchParams, refreshUser]);

    // Mengirim ulang email verifikasi
    async function resendVerification() {
        setResendLoading(true);
        setMessage('');

        try {
            const response = await api.post(
                '/api/spa/auth/email/verification-notification'
            );

            if (response.data.verified) {
                setVerified(true);
                await refreshUser();
            }

            setMessage(
                response.data.message ||
                'Email verifikasi berhasil dikirim ulang. Periksa inbox kamu.'
            );
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                'Gagal mengirim email verifikasi.'
            );
        } finally {
            setResendLoading(false);
        }
    }

    // Memeriksa status verifikasi email terbaru
    async function checkVerification() {
        setCheckLoading(true);
        setMessage('');

        try {
            const currentUser = await refreshUser();

            if (currentUser?.email_verified_at) {
                setVerified(true);
                setMessage('Email kamu sudah berhasil diverifikasi.');
            } else {
                setVerified(false);
                setMessage(
                    'Email belum terverifikasi. Silakan periksa tautan di inbox.'
                );
            }
        } catch {
            setMessage('Gagal memeriksa status verifikasi email.');
        } finally {
            setCheckLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-14">
            <div className="w-full max-w-xl rounded-[22px] border border-cream-dark bg-white p-8 text-center shadow-float md:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-light to-green-dark text-3xl text-white shadow-lg shadow-green-mid/30">
                    {verified ? '✓' : '✉'}
                </div>

                <h1 className="mt-5 font-display text-2xl font-semibold text-green-dark">
                    {verified ? 'Email Terverifikasi' : 'Verifikasi Email Anda'}
                </h1>
                <div className="mx-auto mt-3 h-[3px] w-12 rounded bg-accent" />

                <p className="mt-4 text-sm leading-6 text-muted">
                    {verified
                        ? 'Alamat email akun kamu sudah berhasil diverifikasi. Sekarang kamu dapat melanjutkan menggunakan SIGAP.'
                        : 'Kami perlu memverifikasi alamat email akun kamu. Silakan periksa inbox (atau folder spam) untuk menemukan tautan verifikasi.'}
                </p>

                {user?.email && (
                    <p className="mt-3 font-semibold text-green-dark">{user.email}</p>
                )}

                {message && (
                    <p
                        className={`mt-5 rounded-xl p-3 text-sm ${
                            verified
                                ? 'bg-[#D1FAE5] text-[#065F46]'
                                : 'bg-cream text-muted'
                        }`}
                    >
                        {message}
                    </p>
                )}

                {!verified && (
                    <>
                        <button
                            type="button"
                            onClick={resendVerification}
                            disabled={resendLoading}
                            className="btn-green mt-7 w-full"
                        >
                            {resendLoading ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                        </button>

                        <button
                            type="button"
                            onClick={checkVerification}
                            disabled={checkLoading}
                            className="btn-outline mt-3 w-full disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {checkLoading ? 'Memeriksa...' : 'Saya Sudah Verifikasi'}
                        </button>
                    </>
                )}

                {verified && (
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="btn-accent mt-7 w-full"
                    >
                        Lanjut ke Dashboard
                    </button>
                )}
            </div>
        </div>
    );
}
