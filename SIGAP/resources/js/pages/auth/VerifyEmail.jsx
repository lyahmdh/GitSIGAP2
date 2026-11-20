
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
        <div className="flex min-h-[75vh] items-center justify-center px-6 py-14">
            <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                    {verified ? '✓' : '✉️'}
                </div>

                <h1 className="mt-5 text-2xl font-bold text-slate-900">
                    {verified ? 'Email Terverifikasi' : 'Verifikasi Email'}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    {verified
                        ? 'Alamat email akun kamu sudah berhasil diverifikasi. Sekarang kamu dapat melanjutkan menggunakan SIGAP.'
                        : 'Kami perlu memverifikasi alamat email akun kamu. Silakan periksa inbox untuk menemukan tautan verifikasi.'
                    }
                </p>

                {user?.email && (
                    <p className="mt-3 font-semibold text-slate-800">
                        {user.email}
                    </p>
                )}

                {message && (
                    <p
                        className={`mt-5 rounded-lg p-3 text-sm ${
                            verified
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-50 text-slate-600'
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
                            className="mt-7 w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {resendLoading
                                ? 'Mengirim...'
                                : 'Kirim Ulang Email'
                            }
                        </button>

                        <button
                            type="button"
                            onClick={checkVerification}
                            disabled={checkLoading}
                            className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {checkLoading
                                ? 'Memeriksa...'
                                : 'Saya Sudah Verifikasi'
                            }
                        </button>
                    </>
                )}

                {verified && (
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="mt-7 w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
                    >
                        Lanjut ke Dashboard
                    </button>
                )}
            </div>
        </div>
    );
}
