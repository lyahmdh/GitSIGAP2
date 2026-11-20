export default function Loading({ label = 'Memuat SIGAP...', fullScreen = false }) {
    return (
        <div
            role="status"
            className={`flex flex-col items-center justify-center gap-3 ${
                fullScreen ? 'min-h-screen bg-cream' : 'py-16'
            }`}
        >
            <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-green-pale border-t-accent" />
            <p className="text-sm font-medium text-muted">{label}</p>
        </div>
    );
}
