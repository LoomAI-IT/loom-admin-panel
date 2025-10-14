import * as React from 'react';
import {ReactNode} from 'react';
import {JsonImportModal, loadJsonFromFile} from "../../../features/json-import";
import {Button, DebouncedInput, DebouncedTextarea, Modal, ObjectListField, StringListField} from '../';
import {useModal, useNotification} from "../../lib/hooks";

import './FormBuilder.css';

export type FormFieldType = 'input' | 'textarea' | 'stringList' | 'objectList' | 'checkbox' | 'custom';

export interface FormField<TEntityFormData = any> {
    name: string;
    type: FormFieldType;
    label?: string;
    placeholder?: string;
    required?: boolean;
    inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
    inputType?: string;
    debounceDelay?: number;
    customRender?: (value: any, onChange: (value: any) => void) => ReactNode;
    groupWith?: string[];
}

export interface FormSection<TEntityFormData = any> {
    title: string;
    fields: FormField<TEntityFormData>[];
}

interface FormBuilderProps<TEntityFormData> {
    title: string;
    sections: FormSection<TEntityFormData>[];
    values: TEntityFormData;
    isSubmitting: boolean;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent) => void;
    jsonToForm: (jsonData: any) => TEntityFormData;
    setFormData: (formData: TEntityFormData) => void;
}

export const FormBuilder = <TEntityFormData extends Record<string, any>>(
    {
        title,
        sections,
        values,
        isSubmitting,
        isOpen,
        onClose,
        onSubmit,
        jsonToForm,
        setFormData,
    }: FormBuilderProps<TEntityFormData>
) => {
    const jsonImportModal = useModal();

    const notification = useNotification();

    const handleJsonImport = (jsonData: any) => {
        const formData = jsonToForm(jsonData);
        setFormData(formData);
        jsonImportModal.close();
        notification.success('Настройки успешно загружены из JSON');
    };

    const handleLoadJsonFile = async () => {
        try {
            const jsonData = await loadJsonFromFile();
            handleJsonImport(jsonData);
        } catch (err) {
            notification.error('Ошибка при загрузке JSON файла');
        }
    };

    const updateField = <K extends keyof TEntityFormData>(field: K, value: TEntityFormData[K]) => {
        setFormData({...values, [field]: value});
    };

    const renderField = (field: FormField<TEntityFormData>) => {
        const value = values[field.name as keyof TEntityFormData];

        if (field.type === 'custom' && field.customRender) {
            return field.customRender(value, (newValue) => updateField(field.name as keyof TEntityFormData, newValue));
        }

        switch (field.type) {
            case 'input':
                return (
                    <DebouncedInput
                        label={field.label}
                        type={field.inputType || 'text'}
                        inputMode={field.inputMode}
                        value={String(value || '')}
                        onChange={(newValue) => updateField(field.name as keyof TEntityFormData, newValue as TEntityFormData[keyof TEntityFormData])}
                        placeholder={field.placeholder}
                        required={field.required}
                        debounceDelay={field.debounceDelay || 300}
                    />
                );

            case 'textarea':
                return (
                    <DebouncedTextarea
                        label={field.label}
                        value={String(value || '')}
                        onChange={(newValue) => updateField(field.name as keyof TEntityFormData, newValue as TEntityFormData[keyof TEntityFormData])}
                        placeholder={field.placeholder}
                        required={field.required}
                        debounceDelay={field.debounceDelay || 300}
                    />
                );

            case 'stringList':
                return (
                    <StringListField
                        label={field.label}
                        value={(value as string[]) || []}
                        onChange={(newValue) => updateField(field.name as keyof TEntityFormData, newValue as TEntityFormData[keyof TEntityFormData])}
                        placeholder={field.placeholder || 'элемент'}
                        debounceDelay={field.debounceDelay || 300}
                    />
                );

            case 'objectList':
                return (
                    <ObjectListField
                        label={field.label}
                        value={(value as Record<string, any>[]) || []}
                        onChange={(newValue) => updateField(field.name as keyof TEntityFormData, newValue as TEntityFormData[keyof TEntityFormData])}
                        debounceDelay={field.debounceDelay || 300}
                    />
                );

            case 'checkbox':
                return (
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={Boolean(value)}
                                onChange={(e) => updateField(field.name as keyof TEntityFormData, e.target.checked as TEntityFormData[keyof TEntityFormData])}
                                style={{marginRight: '8px'}}
                            />
                            {field.label}
                        </label>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderSection = (section: FormSection<TEntityFormData>) => {
        // Группируем поля для grid
        const processedFields: Array<FormField<TEntityFormData> | FormField<TEntityFormData>[]> = [];
        const groupedFieldsSet = new Set<string>();

        section.fields.forEach((field) => {
            if (groupedFieldsSet.has(field.name)) return;

            if (field.groupWith && field.groupWith.length > 0) {
                const group = [field];
                field.groupWith.forEach((groupFieldName) => {
                    const groupField = section.fields.find((f) => f.name === groupFieldName);
                    if (groupField) {
                        group.push(groupField);
                        groupedFieldsSet.add(groupFieldName);
                    }
                });
                processedFields.push(group);
            } else {
                processedFields.push(field);
            }
        });

        return (
            <section key={section.title}>
                <h3>{section.title}</h3>
                {processedFields.map((fieldOrGroup, idx) => {
                    if (Array.isArray(fieldOrGroup)) {
                        return (
                            <div key={idx}>
                                {fieldOrGroup.map((field) => (
                                    <div key={field.name}>{renderField(field)}</div>
                                ))}
                            </div>
                        );
                    }
                    return <div key={fieldOrGroup.name}>{renderField(fieldOrGroup)}</div>;
                })}
            </section>
        );
    };

    return (
        <>
            <JsonImportModal
                isOpen={jsonImportModal.isOpen}
                onClose={jsonImportModal.close}
                onImport={handleJsonImport}
            />
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={title}
            >
                <form onSubmit={onSubmit}>
                    <div>
                        <Button
                            variant="secondary"
                            onClick={jsonImportModal.open}
                            disabled={isSubmitting}
                            size="small"
                        >Вставить JSON</Button>
                        <Button
                            variant="secondary"
                            onClick={handleLoadJsonFile}
                            disabled={isSubmitting}
                            size="small"
                        >Загрузить JSON</Button>
                    </div>
                    <div>
                        {sections.map((section) => renderSection(section))}
                    </div>
                    <div>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >Отмена</Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                        >{isSubmitting ? 'Сохранение...' : 'Сохранить'}</Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};
