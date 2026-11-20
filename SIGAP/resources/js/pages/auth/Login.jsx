import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await login(form);
            navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            setError(
                validationErrors
                    ? Object.values(validationErrors).flat().join(' ')
                    : err.response?.data?.message ||
                      'Login gagal. Periksa kembali email dan password.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-6 py-14">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">SIGAP</p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">Selamat Datang</h1>
                <p className="mt-2 text-sm text-slate-500">Masuk untuk melanjutkan ke akun SIGAP.</p>

                {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

                <label className="mt-6 block text-sm font-semibold text-slate-700">Email</label>
                <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                    placeholder="nama@email.com"
                    autoComplete="email"
                />

                <label className="mt-5 block text-sm font-semibold text-slate-700">Password</label>
                <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                />

                <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                    <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                    />
                    Ingat saya
                </label>

                <button disabled={loading} className="mt-6 w-full rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
                    {loading ? 'Memproses...' : 'Masuk'}
                </button>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Belum memiliki akun? <Link to="/register" className="font-semibold text-emerald-700">Daftar</Link>
                </p>
            </form>
        </div>
    );
}