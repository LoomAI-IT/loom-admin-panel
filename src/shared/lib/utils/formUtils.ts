/**
 * Фильтрует пустые строки из массива
 */
export const filterEmptyStrings = (items: string[]): string[] => {
    return items.filter(item => item.trim() !== '');
};

/**
 * Фильтрует пустые объекты из массива
 */
export const filterEmptyObjects = <T extends Record<string, any>>(items: T[]): T[] => {
    return items.filter(item => Object.keys(item).length > 0);
};

/**
 * Преобразует строку в число или возвращает undefined, если строка пустая
 */
export const parseNumberOrUndefined = (value: string): number | undefined => {
    const trimmed = value.trim();
    if (trimmed === '') return undefined;
    const parsed = parseInt(trimmed, 10);
    return isNaN(parsed) ? undefined : parsed;
};

/**
 * Преобразует пустую строку в undefined, иначе возвращает строку
 */
export const stringOrUndefined = (value: string): string | undefined => {
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
};

/**
 * Очищает данные формы от пустых значений
 * Фильтрует массивы и преобразует пустые строки в undefined
 */
export const cleanFormData = <T extends Record<string, any>>(data: T): Partial<T> => {
    const cleaned: any = {};

    for (const [key, value] of Object.entries(data)) {
        if (value === null || value === undefined) {
            continue;
        }

        // Если это массив строк
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
            const filtered = filterEmptyStrings(value as string[]);
            cleaned[key] = filtered.length > 0 ? filtered : undefined;
        }
        // Если это массив объектов
        else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            const filtered = filterEmptyObjects(value);
            cleaned[key] = filtered.length > 0 ? filtered : undefined;
        }
        // Если это пустой массив
        else if (Array.isArray(value) && value.length === 0) {
            cleaned[key] = undefined;
        }
        // Если это строка
        else if (typeof value === 'string') {
            cleaned[key] = stringOrUndefined(value);
        }
        // Остальные типы оставляем как есть
        else {
            cleaned[key] = value;
        }
    }

    return cleaned;
};