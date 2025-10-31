import {useRef, useState, useCallback, type MouseEvent} from 'react';

interface UseDragScrollReturn {
    scrollRef: React.RefObject<HTMLDivElement | null>;
    isDragging: boolean;
    onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseMove: (e: MouseEvent<HTMLDivElement>) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
}

/**
 * Хук для реализации drag-to-scroll функциональности
 * Позволяет пользователю перетаскивать контент мышью для прокрутки
 */
export const useDragScroll = (): UseDragScrollReturn => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const onMouseDown = useCallback((e: MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);

        // Меняем курсор на "grabbing"
        scrollRef.current.style.cursor = 'grabbing';
        scrollRef.current.style.userSelect = 'none';
    }, []);

    const onMouseMove = useCallback(
        (e: MouseEvent<HTMLDivElement>) => {
            if (!isDragging || !scrollRef.current) return;

            e.preventDefault();

            const x = e.pageX - scrollRef.current.offsetLeft;
            const walk = (x - startX) * 2; // Множитель 2 для более быстрой прокрутки

            scrollRef.current.scrollLeft = scrollLeft - walk;
        },
        [isDragging, startX, scrollLeft]
    );

    const onMouseUp = useCallback(() => {
        setIsDragging(false);

        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab';
            scrollRef.current.style.userSelect = 'auto';
        }
    }, []);

    const onMouseLeave = useCallback(() => {
        if (isDragging) {
            setIsDragging(false);

            if (scrollRef.current) {
                scrollRef.current.style.cursor = 'grab';
                scrollRef.current.style.userSelect = 'auto';
            }
        }
    }, [isDragging]);

    return {
        scrollRef,
        isDragging,
        onMouseDown,
        onMouseMove,
        onMouseUp,
        onMouseLeave,
    };
};
