import {useEffect, useState} from 'react';

/**
 * Хук для debouncing значений
 * @param value - значение для debounce
 * @param delay - задержка в мс (по умолчанию 300ms)
 * @returns debounced значение
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
