export default function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-slate-500">
                <p className="font-bold text-emerald-700">SIGAP</p>
                <p className="mt-2">
                    Sistem Informasi Pengaduan dan Aspirasi Publik.
                </p>
                <p className="mt-4">
                    © {new Date().getFullYear()} SIGAP. Seluruh hak cipta dilindungi.
                </p>
            </div>
        </footer>
    );
}