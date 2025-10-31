/**
 * Парсит строку длительности (например, "468 мс", "1 с 200 мс") в миллисекунды
 */
export const parseDuration = (durationStr: string): number => {
    // Убираем лишние пробелы и приводим к нижнему регистру
    const normalized = durationStr.toLowerCase().trim();

    // Проверяем различные форматы
    // Формат: "468 мс"
    const msMatch = normalized.match(/(\d+)\s*мс/);
    if (msMatch) {
        return parseInt(msMatch[1], 10);
    }

    // Формат: "1 с" или "1с"
    const secMatch = normalized.match(/(\d+)\s*с(?:\s|$)/);
    if (secMatch) {
        return parseInt(secMatch[1], 10) * 1000;
    }

    // Формат: "1 с 200 мс"
    const combinedMatch = normalized.match(/(\d+)\s*с\s*(\d+)\s*мс/);
    if (combinedMatch) {
        return parseInt(combinedMatch[1], 10) * 1000 + parseInt(combinedMatch[2], 10);
    }

    // По умолчанию возвращаем 0
    return 0;
};

/**
 * Определяет цвет на основе длительности операции
 * < 100ms - зеленый (быстро)
 * 100-300ms - желтый (средне)
 * > 300ms - красный (медленно)
 */
export const getDurationColor = (durationMs: number): 'success' | 'warning' | 'danger' => {
    if (durationMs < 100) {
        return 'success'; // зеленый
    } else if (durationMs <= 300) {
        return 'warning'; // желтый
    } else {
        return 'danger'; // красный
    }
};

/**
 * Форматирует дату/время для отображения
 */
export const formatTime = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
};

/**
 * Форматирует дату для отображения
 */
export const formatDate = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

/**
 * Вычисляет статистику по массиву перемещений
 */
export interface MovementStats {
    totalMovements: number;
    averageDuration: number;
    fastestDuration: number;
    slowestDuration: number;
}

export const calculateStats = (durations: number[]): MovementStats => {
    if (durations.length === 0) {
        return {
            totalMovements: 0,
            averageDuration: 0,
            fastestDuration: 0,
            slowestDuration: 0,
        };
    }

    const total = durations.reduce((sum, d) => sum + d, 0);
    const average = Math.round(total / durations.length);
    const fastest = Math.min(...durations);
    const slowest = Math.max(...durations);

    return {
        totalMovements: durations.length,
        averageDuration: average,
        fastestDuration: fastest,
        slowestDuration: slowest,
    };
};
