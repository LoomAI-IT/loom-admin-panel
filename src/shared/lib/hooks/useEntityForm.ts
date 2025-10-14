import { useState, useCallback } from 'react';

/**
 * Универсальный хук для управления формами создания/редактирования сущностей
 * Решает проблему дублирования formData и editFormData
 * Следует принципу DRY - один хук для create и edit режимов
 */

type FormMode = 'create' | 'edit';

interface UseEntityFormOptions<TFormData, TEntity = TFormData> {
  initialData: TFormData;
  mode?: FormMode;
  entity?: TEntity;
  transformEntityToForm?: (entity: TEntity) => TFormData;
  onSubmit?: (data: TFormData, mode: FormMode) => Promise<void> | void;
  validateFn?: (data: TFormData) => string | null;
}

interface UseEntityFormReturn<TFormData> {
  // Состояние формы
  formData: TFormData;
  mode: FormMode;
  isSubmitting: boolean;
  error: string | null;
  isDirty: boolean;

  // Методы обновления
  updateField: <K extends keyof TFormData>(field: K, value: TFormData[K]) => void;
  updateFields: (updates: Partial<TFormData>) => void;
  setFormData: (data: TFormData) => void;

  // Управление формой
  reset: () => void;
  resetToEntity: <TEntity>(entity: TEntity, transformFn: (e: TEntity) => TFormData) => void;
  submit: () => Promise<boolean>;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Переключение режима
  switchToEdit: <TEntity>(entity: TEntity, transformFn: (e: TEntity) => TFormData) => void;
  switchToCreate: () => void;
}

export const useEntityForm = <TFormData extends Record<string, any>, TEntity = TFormData>(
  options: UseEntityFormOptions<TFormData, TEntity>
): UseEntityFormReturn<TFormData> => {
  const {
    initialData,
    mode: initialMode = 'create',
    entity,
    transformEntityToForm,
    onSubmit,
    validateFn,
  } = options;

  // Если передана сущность для редактирования, трансформируем её в форму
  const getInitialFormData = (): TFormData => {
    if (initialMode === 'edit' && entity && transformEntityToForm) {
      return transformEntityToForm(entity);
    }
    return initialData;
  };

  const [formData, setFormData] = useState<TFormData>(getInitialFormData());
  const [mode, setMode] = useState<FormMode>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalData] = useState<TFormData>(getInitialFormData());

  // Проверка, была ли форма изменена
  const isDirty = JSON.stringify(formData) !== JSON.stringify(originalData);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Обновление одного поля
  const updateField = useCallback(<K extends keyof TFormData>(field: K, value: TFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Очищаем ошибку при изменении формы
    if (error) clearError();
  }, [error, clearError]);

  // Обновление нескольких полей
  const updateFields = useCallback((updates: Partial<TFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    if (error) clearError();
  }, [error, clearError]);

  // Сброс формы к начальным значениям
  const reset = useCallback(() => {
    setFormData(getInitialFormData());
    setError(null);
    setIsSubmitting(false);
  }, []);

  // Сброс формы к значениям сущности (для edit режима)
  const resetToEntity = useCallback(<E,>(entity: E, transformFn: (e: E) => TFormData) => {
    const formData = transformFn(entity);
    setFormData(formData);
    setError(null);
  }, []);

  // Переключение в режим редактирования
  const switchToEdit = useCallback(<E,>(entity: E, transformFn: (e: E) => TFormData) => {
    const formData = transformFn(entity);
    setFormData(formData);
    setMode('edit');
    setError(null);
  }, []);

  // Переключение в режим создания
  const switchToCreate = useCallback(() => {
    setFormData(initialData);
    setMode('create');
    setError(null);
  }, [initialData]);

  // Отправка формы
  const submit = useCallback(async (): Promise<boolean> => {
    // Валидация
    if (validateFn) {
      const validationError = validateFn(formData);
      if (validationError) {
        setError(validationError);
        return false;
      }
    }

    if (!onSubmit) {
      console.warn('onSubmit handler is not provided');
      return false;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData, mode);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка при отправке формы';
      setError(errorMessage);
      console.error('Form submission error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, mode, onSubmit, validateFn]);

  return {
    // Состояние
    formData,
    mode,
    isSubmitting,
    error,
    isDirty,

    // Методы обновления
    updateField,
    updateFields,
    setFormData,

    // Управление формой
    reset,
    resetToEntity,
    submit,
    setError,
    clearError,

    // Переключение режима
    switchToEdit,
    switchToCreate,
  };
};
