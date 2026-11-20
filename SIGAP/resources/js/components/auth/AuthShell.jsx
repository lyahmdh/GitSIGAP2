import { useState } from 'react';
import { Link } from 'react-router-dom';

const BG_IMG = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80';

/*
 * Kerangka halaman login/register (setara auth/login.blade.php & auth/register.blade.php).
 * greenSide: sisi tempat panel hijau berada ('left' | 'right').
 */
export default function AuthShell({ greenSide = 'right', title, subtitle, switchTo, switchLabel, children }) {
    const green = (
        <div className="flex shrink-0 flex-col items-center justify-center rounded-[28px] bg-gradient-to-br from-green-light to-green-dark px-8 py-10 text-center md:w-[42%]">
            <h2 className="font-display text-[1.9rem] font-bold leading-[1.22] text-white">{title}</h2>
            <p className="mb-7 mt-4 max-w-[215px] text-sm leading-[1.75] text-white/80">{subtitle}</p>
            <Link
                to={switchTo}
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/55 px-6 py-2.5 text-sm font-bold text-white transition hover:border-white hover:bg-white/15"
            >
                {switchLabel}
            </Link>
        </div>
    );

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#1a1a1a] p-5">
            <div
                className="fixed inset-0 bg-cover bg-center brightness-50 saturate-[.65]"
                style={{ backgroundImage: `url('${BG_IMG}')` }}
                aria-hidden="true"
            />

            <div className="relative z-10 flex w-full max-w-[840px] flex-col overflow-hidden rounded-[28px] bg-[#F9F8F5] shadow-[0_32px_90px_rgba(0,0,0,0.5)] md:min-h-[500px] md:flex-row">
                {greenSide === 'left' && green}
                <div className="flex min-w-0 flex-1 flex-col justify-center px-7 py-10 md:px-11 md:py-12">
                    {children}
                </div>
                {greenSide === 'right' && green}
            </div>
        </div>
    );
}

const icons = {
    mail: 'M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v.4l-10 6.2L2 6.4V6Zm0 2.75V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.75l-9.47 5.87a1 1 0 0 1-1.06 0L2 8.75Z',
    lock: 'M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h1Zm2 0h6V8a3 3 0 0 0-6 0v2Z',
    user: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 0 1 16 0H4Z',
};

function Icon({ name }) {
    return (
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
            <path d={icons[name]} />
        </svg>
    );
}

export function AuthInput({ icon, error, type = 'text', ...props }) {
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="mb-3">
            <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink">
                    <Icon name={icon} />
                </span>
                <input
                    {...props}
                    type={isPassword && show ? 'text' : type}
                    className={`w-full rounded-full border-[1.5px] bg-white py-2.5 pl-10 pr-11 text-sm text-ink outline-none transition placeholder:text-gray-400 focus:border-green-mid focus:shadow-[0_0_0_3px_rgba(45,90,46,0.11)] ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((value) => !value)}
                        aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted hover:text-ink"
                    >
                        {show ? 'Tutup' : 'Lihat'}
                    </button>
                )}
            </div>
            {error && <p className="mt-1 pl-4 text-xs text-red-500">{error}</p>}
        </div>
    );
}

export function AuthAlert({ children }) {
    if (!children) return null;
    return (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {children}
        </div>
    );
}

export function AuthSubmit({ loading, children }) {
    return (
        <button
            disabled={loading}
            className="mt-1 w-full rounded-full bg-green-mid py-3 text-[15px] font-bold text-white transition hover:-translate-y-px hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
            {loading ? 'Memproses...' : children}
        </button>
    );
}
