export default function PageHeader({ title, description, action }) {
    return (
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-green-dark md:text-3xl">
                    {title}
                </h1>
                <div className="mt-2 h-[3px] w-12 rounded bg-accent" />
                {description && <p className="mt-3 text-sm text-muted">{description}</p>}
            </div>
            {action}
        </div>
    );
}
