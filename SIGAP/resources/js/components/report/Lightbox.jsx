import { useEffect, useRef } from 'react';
import Icon from './icons';

/**
 * Lightbox dengan slide — setara skrip #lightbox di laporan/show.blade.php.
 * Navigasi: tombol, panah keyboard, Esc, dan geser (swipe) di layar sentuh.
 */
export default function Lightbox({ images, index, onClose, onChange }) {
    const touchStartX = useRef(0);
    const total = images.length;

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowLeft' && index > 0) onChange(index - 1);
            if (event.key === 'ArrowRight' && index < total - 1) onChange(index + 1);
        };

        document.addEventListener('keydown', onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [index, total, onClose, onChange]);

    const handleTouchEnd = (event) => {
        const diff = touchStartX.current - event.changedTouches[0].clientX;
        if (Math.abs(diff) < 40) return;

        if (diff > 0 && index < total - 1) onChange(index + 1);
        if (diff < 0 && index > 0) onChange(index - 1);
    };

    const navButton =
        'absolute top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition hover:bg-white/25';

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label="Pratinjau foto"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            onTouchStart={(event) => {
                touchStartX.current = event.touches[0].clientX;
            }}
            onTouchEnd={handleTouchEnd}
        >
            <button
                type="button"
                onClick={onClose}
                aria-label="Tutup"
                className="absolute right-5 top-4 text-white/90 transition hover:text-white"
            >
                <Icon name="close" className="h-8 w-8" />
            </button>

            {index > 0 && (
                <button
                    type="button"
                    onClick={() => onChange(index - 1)}
                    aria-label="Foto sebelumnya"
                    className={`${navButton} left-5`}
                >
                    <Icon name="chevronLeft" className="h-6 w-6" />
                </button>
            )}

            <img
                src={images[index]}
                alt={`Foto ${index + 1} dari ${total}`}
                draggable={false}
                className="max-h-[82vh] max-w-[90vw] select-none rounded-xl object-contain"
            />

            {index < total - 1 && (
                <button
                    type="button"
                    onClick={() => onChange(index + 1)}
                    aria-label="Foto berikutnya"
                    className={`${navButton} right-5`}
                >
                    <Icon name="chevronRight" className="h-6 w-6" />
                </button>
            )}

            {total > 1 && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-black/35 px-4 py-1 text-sm font-semibold text-white/75 backdrop-blur-sm">
                    {index + 1} / {total}
                </div>
            )}
        </div>
    );
}
