export default function SectionPlaceholder({ title, description }) {
    return (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                SIGAP
            </p>
            <h1 className="mt-3 text-2xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {description}
            </p>
            <div className="mt-8 rounded-xl bg-slate-50 p-5">
                <p className="text-sm font-medium text-slate-700">
                    Area konten {title}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    Komponen dan integrasi data akan dikembangkan pada tahap berikutnya.
                </p>
            </div>
        </section>
    );
}