import {ReactNode} from 'react';
import {DebouncedInput, DebouncedTextarea, StringListField, ObjectListField} from '../';
import './FormBuilder.css';

export type FormFieldType = 'input' | 'textarea' | 'stringList' | 'objectList' | 'checkbox' | 'custom';

export interface FormField<T = any> {
    name: string;
    type: FormFieldType;
    label?: string;
    placeholder?: string;
    required?: boolean;
    inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
    inputType?: string;
    debounceDelay?: number;
    customRender?: (value: any, onChange: (value: any) => void) => ReactNode;
    // Для группировки полей в одну строку
    groupWith?: string[];
}

export interface FormSection<T = any> {
    title: string;
    fields: FormField<T>[];
}

interface FormBuilderProps<T> {
    sections: FormSection<T>[];
    values: T;
    onChange: (values: T) => void;
    onSubmit?: (e: React.FormEvent) => void;
    children?: ReactNode;
}

export const FormBuilder = <T extends Record<string, any>>({
    sections,
    values,
    onChange,
    onSubmit,
    children,
}: FormBuilderProps<T>) => {
    const updateField = <K extends keyof T>(field: K, value: T[K]) => {
        onChange({...values, [field]: value});
    };

    const renderField = (field: FormField<T>) => {
        const value = values[field.name as keyof T];

        if (field.type === 'custom' && field.customRender) {
            return field.customRender(value, (newValue) => updateField(field.name as keyof T, newValue));
        }

        switch (field.type) {
            case 'input':
                return (
                    <DebouncedInput
                        label={field.label}
                        type={field.inputType || 'text'}
                        inputMode={field.inputMode}
                        value={String(value || '')}
                        onChange={(newValue) => updateField(field.name as keyof T, newValue as T[keyof T])}
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
                        onChange={(newValue) => updateField(field.name as keyof T, newValue as T[keyof T])}
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
                        onChange={(newValue) => updateField(field.name as keyof T, newValue as T[keyof T])}
                        placeholder={field.placeholder || 'элемент'}
                        debounceDelay={field.debounceDelay || 300}
                    />
                );

            case 'objectList':
                return (
                    <ObjectListField
                        label={field.label}
                        value={(value as Record<string, any>[]) || []}
                        onChange={(newValue) => updateField(field.name as keyof T, newValue as T[keyof T])}
                        debounceDelay={field.debounceDelay || 300}
                    />
                );

            case 'checkbox':
                return (
                    <div className="input-wrapper">
                        <label className="input-label">
                            <input
                                type="checkbox"
                                checked={Boolean(value)}
                                onChange={(e) => updateField(field.name as keyof T, e.target.checked as T[keyof T])}
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

    const renderSection = (section: FormSection<T>) => {
        // Группируем поля для grid
        const processedFields: Array<FormField<T> | FormField<T>[]> = [];
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
            <section className="form-section" key={section.title}>
                <h3 className="form-section-title">{section.title}</h3>
                {processedFields.map((fieldOrGroup, idx) => {
                    if (Array.isArray(fieldOrGroup)) {
                        return (
                            <div key={idx} className="input-grid-2">
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
        <form onSubmit={onSubmit} className="form-builder">
            <div className="form-content">
                {sections.map((section) => renderSection(section))}
            </div>
            {children}
        </form>
    );
};
