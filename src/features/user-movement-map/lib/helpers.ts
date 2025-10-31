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
 * Конвертирует время в московское (UTC+3)
 */
const convertToMoscowTime = (dateTimeStr: string): Date => {
    let date: Date;

    // Проверяем, содержит ли строка timezone info (Z, +offset, или -offset)
    const hasTimezone = dateTimeStr.endsWith('Z') ||
                       dateTimeStr.includes('+') ||
                       (dateTimeStr.includes('T') && dateTimeStr.lastIndexOf('-') > dateTimeStr.indexOf('T'));

    if (hasTimezone) {
        // Строка уже содержит timezone - парсим как есть
        date = new Date(dateTimeStr);
    } else {
        // Naive datetime - явно указываем, что это UTC, добавляя 'Z'
        date = new Date(dateTimeStr + 'Z');
    }

    // Добавляем 3 часа для московского времени (в миллисекундах)
    const moscowTime = new Date(date.getTime() + 3 * 60 * 60 * 1000);
    return moscowTime;
};

/**
 * Форматирует дату/время для отображения в московском времени (UTC+3)
 */
export const formatTime = (dateTimeStr: string): string => {
    const moscowDate = convertToMoscowTime(dateTimeStr);
    return moscowDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC',
    });
};

/**
 * Форматирует дату для отображения в московском времени (UTC+3)
 */
export const formatDate = (dateTimeStr: string): string => {
    const moscowDate = convertToMoscowTime(dateTimeStr);
    return moscowDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC',
    });
};

/**
 * Вычисляет временной интервал между двумя действиями
 * @param endTime - время окончания предыдущего действия
 * @param startTime - время начала следующего действия
 * @returns интервал в миллисекундах
 */
export const calculateTimeBetween = (endTime: string, startTime: string): number => {
    const end = convertToMoscowTime(endTime);
    const start = convertToMoscowTime(startTime);
    return start.getTime() - end.getTime();
};

/**
 * Форматирует временной интервал в читаемый формат
 * @param milliseconds - интервал в миллисекундах
 * @returns отформатированная строка (например, "5 сек", "2 мин 30 сек", "1 час 15 мин")
 */
export const formatTimeBetween = (milliseconds: number): string => {
    if (milliseconds < 0) {
        return '0 сек';
    }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    // Если меньше минуты - показываем секунды
    if (seconds < 60) {
        return `${seconds} сек`;
    }

    // Если меньше часа - показываем минуты и секунды
    if (minutes < 60) {
        const remainingSeconds = seconds % 60;
        if (remainingSeconds === 0) {
            return `${minutes} мин`;
        }
        return `${minutes} мин ${remainingSeconds} сек`;
    }

    // Если час или больше - показываем часы и минуты
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
        return `${hours} час${hours > 1 ? 'а' : ''}${hours > 4 ? 'ов' : ''}`;
    }
    return `${hours} час${hours > 1 ? 'а' : ''}${hours > 4 ? 'ов' : ''} ${remainingMinutes} мин`;
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
