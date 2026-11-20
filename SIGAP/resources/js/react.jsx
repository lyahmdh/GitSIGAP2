
import React from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

function ReactMigrationPreview() {
    const [user, setUser] = React.useState(null);
    const [mode, setMode] = React.useState('login');

    const [status, setStatus] = React.useState('Memeriksa autentikasi...');
    const [loading, setLoading] = React.useState(false);
    const [errors, setErrors] = React.useState([]);

    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [remember, setRemember] = React.useState(false);

    async function initializeCsrf() {
        await axios.get('/sanctum/csrf-cookie');
    }

    // Memeriksa session Sanctum
    async function checkSession() {
        setLoading(true);

        try {
            const response = await axios.get('/api/spa/auth/me');

            setUser(response.data.user);
            setStatus('Session Sanctum aktif.');
        } catch (error) {
            setUser(null);

            if (error.response?.status === 401) {
                setStatus('Kamu belum login.');
            } else {
                setStatus('Gagal menghubungi API Laravel.');
            }
        } finally {
            setLoading(false);
        }
    }

    // Login
    async function handleLogin(event) {
        event.preventDefault();

        setLoading(true);
        setErrors([]);
        setStatus('Sedang memproses login...');

        try {
            await initializeCsrf();

            const response = await axios.post('/api/spa/auth/login', {
                email,
                password,
                remember,
            });

            setUser(response.data.user);
            setPassword('');
            setStatus(response.data.message);
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                setErrors(Object.values(validationErrors).flat());
                setStatus('Login gagal. Periksa kembali data kamu.');
            } else {
                setStatus(
                    error.response?.data?.message ||
                    'Login gagal. Periksa koneksi server.'
                );
            }
        } finally {
            setLoading(false);
        }
    }

    // Register
    async function handleRegister(event) {
        event.preventDefault();

        setLoading(true);
        setErrors([]);
        setStatus('Sedang memproses registrasi...');

        try {
            await initializeCsrf();

            const response = await axios.post('/api/spa/auth/register', {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });

            setUser(response.data.user);

            setName('');
            setEmail('');
            setPassword('');
            setPasswordConfirmation('');

            setStatus(response.data.message || 'Registrasi berhasil.');
        } catch (error) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                setErrors(Object.values(validationErrors).flat());
                setStatus('Registrasi gagal. Periksa kembali data kamu.');
            } else {
                setStatus(
                    error.response?.data?.message ||
                    'Registrasi gagal. Periksa koneksi server.'
                );
            }
        } finally {
            setLoading(false);
        }
    }

    // Logout
    async function handleLogout() {
        setLoading(true);
        setErrors([]);

        try {
            await axios.post('/api/spa/auth/logout');

            setUser(null);
            setPassword('');
            setPasswordConfirmation('');
            setMode('login');
            setStatus('Berhasil logout dari SIGAP.');
        } catch (error) {
            setStatus(
                error.response?.data?.message ||
                'Logout gagal. Silakan coba kembali.'
            );
        } finally {
            setLoading(false);
        }
    }

    // Ganti mode login/register
    function switchMode(newMode) {
        setMode(newMode);
        setErrors([]);
        setStatus(
            newMode === 'login'
                ? 'Silakan login menggunakan akun SIGAP.'
                : 'Silakan buat akun SIGAP baru.'
        );

        setName('');
        setEmail('');
        setPassword('');
        setPasswordConfirmation('');
    }

    React.useEffect(() => {
        checkSession();
    }, []);

    return (
        <main className="min-h-screen bg-stone-100 px-6 py-12">
            <section className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-stone-200">

                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                    SIGAP · Frontend Migration
                </p>

                <h1 className="mt-3 text-3xl font-bold text-stone-900">
                    React + Laravel Sanctum
                </h1>

                <p className="mt-3 leading-7 text-stone-600">
                    Autentikasi React menggunakan session Laravel
                    dan cookie Sanctum.
                </p>

                <div className="mt-6 rounded-xl bg-stone-50 p-4">
                    <h2 className="font-semibold text-stone-900">
                        Status autentikasi
                    </h2>

                    <p className="mt-2 text-sm text-stone-600" role="status">
                        {status}
                    </p>
                </div>

                {user ? (
                    <div className="mt-6">
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
                            <h2 className="font-semibold text-emerald-900">
                                Berhasil login!
                            </h2>

                            <div className="mt-3 space-y-2 text-sm text-stone-700">
                                <p><strong>Nama:</strong> {user.name}</p>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Role:</strong> {user.role}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={loading}
                            className="mt-5 w-full rounded-lg bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Logout'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mt-6 grid grid-cols-2 rounded-lg bg-stone-100 p-1">
                            <button
                                type="button"
                                onClick={() => switchMode('login')}
                                className={`rounded-md px-4 py-2 text-sm font-semibold ${
                                    mode === 'login'
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-stone-500'
                                }`}
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                onClick={() => switchMode('register')}
                                className={`rounded-md px-4 py-2 text-sm font-semibold ${
                                    mode === 'register'
                                        ? 'bg-white text-emerald-700 shadow-sm'
                                        : 'text-stone-500'
                                }`}
                            >
                                Register
                            </button>
                        </div>

                        <form
                            onSubmit={mode === 'login' ? handleLogin : handleRegister}
                            className="mt-6 space-y-5"
                        >
                            {mode === 'register' && (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-stone-700">
                                        Nama lengkap
                                    </label>

                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        maxLength={100}
                                        required
                                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-stone-700">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
                                    placeholder="Masukkan email"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-stone-700">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    minLength={8}
                                    required
                                    className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
                                    placeholder="Minimal 8 karakter"
                                />
                            </div>

                            {mode === 'register' ? (
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-stone-700">
                                        Konfirmasi password
                                    </label>

                                    <input
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(event) => setPasswordConfirmation(event.target.value)}
                                        minLength={8}
                                        required
                                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-emerald-600"
                                        placeholder="Ulangi password"
                                    />
                                </div>
                            ) : (
                                <label className="flex items-center gap-2 text-sm text-stone-600">
                                    <input
                                        type="checkbox"
                                        checked={remember}
                                        onChange={(event) => setRemember(event.target.checked)}
                                    />
                                    Ingat saya
                                </label>
                            )}

                            {errors.length > 0 && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                    {errors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-lg bg-emerald-700 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50"
                            >
                                {loading
                                    ? 'Memproses...'
                                    : mode === 'login'
                                        ? 'Login'
                                        : 'Buat akun'}
                            </button>
                        </form>
                    </>
                )}

                <div className="mt-6 flex flex-wrap gap-3 border-t border-stone-200 pt-5">
                    <button
                        onClick={checkSession}
                        disabled={loading}
                        className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
                    >
                        Periksa session
                    </button>

                    <a
                        href="/"
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                        Kembali ke website lama
                    </a>
                </div>
            </section>
        </main>
    );
}

createRoot(document.getElementById('react-root')).render(
    <ReactMigrationPreview />
);
