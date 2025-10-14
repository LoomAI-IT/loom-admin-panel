/**
 * Утилиты для работы с формами
 * Устраняют дублирование кода при обработке данных форм
 * Следуют принципам DRY и KISS
 */

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
 * Преобразует строку в число с плавающей точкой или возвращает undefined
 */
export const parseFloatOrUndefined = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  const parsed = parseFloat(trimmed);
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
 * Преобразует пустой массив в undefined
 */
export const arrayOrUndefined = <T>(items: T[]): T[] | undefined => {
  return items.length === 0 ? undefined : items;
};

/**
 * Преобразует пустой объект в undefined
 */
export const objectOrUndefined = <T extends Record<string, any>>(obj: T): T | undefined => {
  return Object.keys(obj).length === 0 ? undefined : obj;
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

/**
 * Создает начальные значения формы из сущности с безопасными значениями по умолчанию
 */
export const createInitialFormValues = <TEntity extends Record<string, any>>(
  entity: TEntity | null,
  defaults: Record<string, any> = {}
): Record<string, any> => {
  if (!entity) return defaults;

  const values: Record<string, any> = { ...defaults };

  for (const [key, defaultValue] of Object.entries(defaults)) {
    const entityValue = entity[key];

    if (entityValue === null || entityValue === undefined) {
      values[key] = defaultValue;
    } else if (Array.isArray(defaultValue)) {
      values[key] = Array.isArray(entityValue) ? entityValue : defaultValue;
    } else if (typeof defaultValue === 'object' && defaultValue !== null) {
      values[key] = typeof entityValue === 'object' ? entityValue : defaultValue;
    } else if (typeof defaultValue === 'string') {
      values[key] = entityValue?.toString() || '';
    } else {
      values[key] = entityValue;
    }
  }

  return values;
};

/**
 * Сравнивает два объекта на предмет изменений
 */
export const hasFormChanged = <T extends Record<string, any>>(
  original: T,
  current: T
): boolean => {
  return JSON.stringify(original) !== JSON.stringify(current);
};

/**
 * Получает только измененные поля формы
 */
export const getChangedFields = <T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> => {
  const changed: any = {};

  for (const key of Object.keys(current)) {
    if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
      changed[key] = current[key];
    }
  }

  return changed;
};
