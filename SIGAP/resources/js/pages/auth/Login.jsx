import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthShell, { AuthAlert, AuthInput, AuthSubmit } from '../../components/auth/AuthShell';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: '', password: '', remember: false });
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            const result = await login(form);
            navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors) {
                setFieldErrors(
                    Object.fromEntries(
                        Object.entries(validationErrors).map(([key, messages]) => [key, messages[0]])
                    )
                );
            } else {
                setError(
                    err.response?.data?.message ||
                        'Login gagal. Periksa kembali email dan password.'
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthShell
            greenSide="right"
            title={
                <>
                    Selamat Datang
                    <br />
                    Kembali!
                </>
            }
            subtitle="Bangun layanan publik yang lebih baik bersama kami. Laporkan, pantau, dan wujudkan perubahan nyata."
            switchTo="/register"
            switchLabel="Buat Akun"
        >
            <form onSubmit={handleSubmit} noValidate>
                <h1 className="mb-6 text-center font-display text-[2rem] font-bold text-ink">Masuk</h1>

                <AuthAlert>{error}</AuthAlert>

                <AuthInput
                    icon="mail"
                    type="email"
                    required
                    placeholder="Email"
                    autoComplete="email"
                    value={form.email}
                    error={fieldErrors.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <AuthInput
                    icon="lock"
                    type="password"
                    required
                    placeholder="Kata Sandi"
                    autoComplete="current-password"
                    value={form.password}
                    error={fieldErrors.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />

                <label className="mb-4 ml-1 flex items-center gap-2 text-sm text-muted">
                    <input
                        type="checkbox"
                        className="accent-green-mid"
                        checked={form.remember}
                        onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                    />
                    Ingat saya
                </label>

                <AuthSubmit loading={loading}>Masuk</AuthSubmit>

                <p className="mt-4 text-center text-[13px] text-muted">
                    Belum punya akun?{' '}
                    <Link to="/register" className="font-bold text-ink">
                        Buat Akun
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}
