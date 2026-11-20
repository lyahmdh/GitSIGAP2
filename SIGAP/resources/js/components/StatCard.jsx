export default function StatCard({ title, value = '—', description }) {
    return (
        <div className="card-sigap p-5">
            <p className="text-sm font-medium text-muted">{title}</p>
            <p className="mt-3 font-display text-3xl font-semibold text-green-dark">{value}</p>
            {description && <p className="mt-2 text-xs text-muted">{description}</p>}
        </div>
    );
}
