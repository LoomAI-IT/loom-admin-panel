import {useState, useCallback} from 'react';

export const useFormState = <T extends Record<string, any>>(initialState: T) => {
    const [formData, setFormData] = useState<T>(initialState);

    const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
        setFormData((prev) => ({...prev, [field]: value}));
    }, []);

    const updateFields = useCallback((updates: Partial<T>) => {
        setFormData((prev) => ({...prev, ...updates}));
    }, []);

    const reset = useCallback((newState?: T) => {
        setFormData(newState ?? initialState);
    }, [initialState]);

    return {formData, updateField, updateFields, reset, setFormData};
};
