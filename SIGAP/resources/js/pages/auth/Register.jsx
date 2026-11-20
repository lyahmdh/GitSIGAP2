import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            await register(form);
            navigate('/verify-email');
        } catch (err) {
            const errors = err.response?.data?.errors;
            setError(
                errors
                    ? Object.values(errors).flat().join(' ')
                    : err.response?.data?.message || 'Registrasi gagal.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-[75vh] items-center justify-center px-6 py-14">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-sm font-bold uppercase tracking-wider text-emerald-700">SIGAP</p>
                <h1 className="mt-3 text-3xl font-bold text-slate-900">Buat Akun</h1>
                <p className="mt-2 text-sm text-slate-500">Daftar untuk menyampaikan laporan fasilitas publik.</p>

                {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

                {[
                    ['name', 'Nama Lengkap', 'text'],
                    ['email', 'Email', 'email'],
                    ['password', 'Password', 'password'],
                    ['password_confirmation', 'Konfirmasi Password', 'password'],
                ].map(([name, label, type]) => (
                    <div key={name} className="mt-5">
                        <label className="block text-sm font-semibold text-slate-700">{label}</label>
                        <input
                            type={type}
                            required
                            autoComplete={
                                name === 'name'
                                    ? 'name'
                                    : name === 'email'
                                        ? 'email'
                                        : 'new-password'
                            }
                            value={form[name]}
                            onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                        />
                    </div>
                ))}

                <button disabled={loading} className="mt-7 w-full rounded-lg bg-emerald-700 px-4 py-3 font-bold text-white hover:bg-emerald-800 disabled:opacity-60">
                    {loading ? 'Memproses...' : 'Daftar Sekarang'}
                </button>

                <p className="mt-6 text-center text-sm text-slate-500">
                    Sudah punya akun? <Link to="/login" className="font-semibold text-emerald-700">Masuk</Link>
                </p>
            </form>
        </div>
    );
}