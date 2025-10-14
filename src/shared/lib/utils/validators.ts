/**
 * Переиспользуемые валидаторы для форм
 * Следуют принципам DRY и Single Responsibility
 */

export type ValidationResult = string | null;

/**
 * Проверка на обязательное поле
 */
export const required = (value: any, fieldName: string = 'Поле'): ValidationResult => {
  if (value === null || value === undefined) {
    return `${fieldName} обязательно для заполнения`;
  }

  if (typeof value === 'string' && value.trim() === '') {
    return `${fieldName} обязательно для заполнения`;
  }

  if (Array.isArray(value) && value.length === 0) {
    return `${fieldName} не может быть пустым`;
  }

  return null;
};

/**
 * Проверка минимальной длины строки
 */
export const minLength = (value: string, min: number, fieldName: string = 'Поле'): ValidationResult => {
  if (value.length < min) {
    return `${fieldName} должно содержать минимум ${min} символов`;
  }
  return null;
};

/**
 * Проверка максимальной длины строки
 */
export const maxLength = (value: string, max: number, fieldName: string = 'Поле'): ValidationResult => {
  if (value.length > max) {
    return `${fieldName} должно содержать максимум ${max} символов`;
  }
  return null;
};

/**
 * Проверка на корректность email
 */
export const email = (value: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Некорректный email адрес';
  }
  return null;
};

/**
 * Проверка на число
 */
export const isNumber = (value: any, fieldName: string = 'Значение'): ValidationResult => {
  if (isNaN(Number(value))) {
    return `${fieldName} должно быть числом`;
  }
  return null;
};

/**
 * Проверка минимального значения числа
 */
export const min = (value: number, minValue: number, fieldName: string = 'Значение'): ValidationResult => {
  if (value < minValue) {
    return `${fieldName} должно быть не меньше ${minValue}`;
  }
  return null;
};

/**
 * Проверка максимального значения числа
 */
export const max = (value: number, maxValue: number, fieldName: string = 'Значение'): ValidationResult => {
  if (value > maxValue) {
    return `${fieldName} должно быть не больше ${maxValue}`;
  }
  return null;
};

/**
 * Проверка диапазона значений
 */
export const range = (
  value: number,
  minValue: number,
  maxValue: number,
  fieldName: string = 'Значение'
): ValidationResult => {
  if (value < minValue || value > maxValue) {
    return `${fieldName} должно быть в диапазоне от ${minValue} до ${maxValue}`;
  }
  return null;
};

/**
 * Проверка на соответствие паттерну
 */
export const pattern = (value: string, regex: RegExp, message: string): ValidationResult => {
  if (!regex.test(value)) {
    return message;
  }
  return null;
};

/**
 * Проверка на URL
 */
export const url = (value: string): ValidationResult => {
  try {
    new URL(value);
    return null;
  } catch {
    return 'Некорректный URL';
  }
};

/**
 * Композитный валидатор - объединяет несколько валидаторов
 */
export const compose = (...validators: Array<(value: any) => ValidationResult>) => {
  return (value: any): ValidationResult => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  };
};

/**
 * Условный валидатор - применяется только если условие истинно
 */
export const when = (
  condition: boolean,
  validator: (value: any) => ValidationResult
) => {
  return (value: any): ValidationResult => {
    if (condition) {
      return validator(value);
    }
    return null;
  };
};

/**
 * Валидатор объекта - проверяет все поля объекта
 */
export const validateObject = <T extends Record<string, any>>(
  obj: T,
  rules: Partial<Record<keyof T, (value: any) => ValidationResult>>
): Record<keyof T, string> | null => {
  const errors: any = {};
  let hasErrors = false;

  for (const [key, validator] of Object.entries(rules)) {
    if (validator && typeof validator === 'function') {
      const error = validator(obj[key]);
      if (error) {
        errors[key] = error;
        hasErrors = true;
      }
    }
  }

  return hasErrors ? errors : null;
};

/**
 * Создает валидатор на основе схемы
 */
export const createValidator = <T extends Record<string, any>>(
  schema: Partial<Record<keyof T, (value: any) => ValidationResult>>
) => {
  return (data: T): ValidationResult => {
    const errors = validateObject(data, schema);
    if (errors) {
      // Возвращаем первую ошибку
      const firstError = Object.values(errors)[0];
      return firstError as string;
    }
    return null;
  };
};
