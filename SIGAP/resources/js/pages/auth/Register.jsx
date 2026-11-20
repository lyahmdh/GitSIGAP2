import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthShell, { AuthAlert, AuthInput, AuthSubmit } from '../../components/auth/AuthShell';

// Skor 0-3, sama seperti pwStrength() di auth/register.blade.php
function passwordScore(value) {
    let score = 0;
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++;
    if (/\d/.test(value) || /[^a-zA-Z0-9]/.test(value)) score++;
    return score;
}

const barColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-green-light'];

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
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const score = form.password ? passwordScore(form.password) : 0;

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError('');
        setFieldErrors({});

        try {
            await register(form);
            navigate('/verify-email');
        } catch (err) {
            const errors = err.response?.data?.errors;

            if (errors) {
                setFieldErrors(
                    Object.fromEntries(
                        Object.entries(errors).map(([key, messages]) => [key, messages[0]])
                    )
                );
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal.');
            }
        } finally {
            setLoading(false);
        }
    }

    const bind = (name) => ({
        value: form[name],
        error: fieldErrors[name],
        onChange: (e) => setForm({ ...form, [name]: e.target.value }),
    });

    return (
        <AuthShell
            greenSide="left"
            title={
                <>
                    Selamat
                    <br />
                    Datang!
                </>
            }
            subtitle="Bangun layanan publik yang lebih baik bersama kami. Laporkan, pantau, dan wujudkan perubahan nyata."
            switchTo="/login"
            switchLabel="Masuk"
        >
            <form onSubmit={handleSubmit} noValidate>
                <h1 className="mb-5 text-center font-display text-[2rem] font-bold text-ink">Buat Akun</h1>

                <AuthAlert>{error}</AuthAlert>

                <AuthInput
                    icon="user"
                    required
                    placeholder="Nama lengkap"
                    autoComplete="name"
                    {...bind('name')}
                />

                <AuthInput
                    icon="mail"
                    type="email"
                    required
                    placeholder="Email"
                    autoComplete="email"
                    {...bind('email')}
                />

                <AuthInput
                    icon="lock"
                    type="password"
                    required
                    minLength={8}
                    placeholder="Kata Sandi"
                    autoComplete="new-password"
                    {...bind('password')}
                />

                <div className="-mt-1 mb-3 flex gap-1.5 px-4" aria-hidden="true">
                    {[1, 2, 3].map((level) => (
                        <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                                score >= level ? barColors[score] : 'bg-gray-200'
                            }`}
                        />
                    ))}
                </div>

                <AuthInput
                    icon="lock"
                    type="password"
                    required
                    placeholder="Konfirmasi Kata Sandi"
                    autoComplete="new-password"
                    {...bind('password_confirmation')}
                />

                <AuthSubmit loading={loading}>Buat Akun</AuthSubmit>

                <p className="mt-4 text-center text-[13px] text-muted">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="font-bold text-ink">
                        Masuk
                    </Link>
                </p>
            </form>
        </AuthShell>
    );
}
