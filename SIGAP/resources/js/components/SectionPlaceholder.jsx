export default function SectionPlaceholder({ title, description }) {
    return (
        <section className="rounded-2xl border border-dashed border-green-light/40 bg-white p-8">
            <p className="section-eyebrow">SIGAP</p>
            <h1 className="mt-3 font-display text-2xl font-semibold text-green-dark">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{description}</p>
            <div className="mt-8 rounded-xl bg-cream p-5">
                <p className="text-sm font-medium text-green-dark">Area konten {title}</p>
                <p className="mt-1 text-xs text-muted">
                    Komponen dan integrasi data akan dikembangkan pada tahap berikutnya.
                </p>
            </div>
        </section>
    );
}
