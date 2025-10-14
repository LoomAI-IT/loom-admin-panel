import * as React from 'react';
import {ReactNode} from 'react';
import {useModal} from '../../lib/hooks';
import './DetailsViewer.css';

export interface DetailField<T = any> {
    name: string;
    label: string;
    important?: boolean;
    groupWith?: string[];
}

export interface DetailSection<T = any> {
    title: string;
    fields: DetailField<T>[];
}

interface DetailsViewerProps<T> {
    sections: DetailSection<T>[];
    values: T;
    onClose?: () => void;
    className?: string;
}

export const DetailsViewer = <T extends Record<string, any>>(
    {
        sections,
        values,
    }: DetailsViewerProps<T>
) => {
    const modal = useModal();

    React.useEffect(() => {
        if (values) {
            modal.open();
        }
    }, [values, modal]);

    const renderFieldValue = (value: any, fieldName: string, label: string, isImportant = false): ReactNode => {
        if (value === null || value === undefined || value === '') {
            return (
                <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                    <span className="detail-field-label">{label}:</span>
                    <span className="detail-value-empty">Не указано</span>
                </div>
            );
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return (
                    <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                        <span className="detail-field-label">{label}:</span>
                        <span className="detail-value-empty">Пустой список</span>
                    </div>
                );
            }

            // Массив объектов
            if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                return (
                    <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                        <span className="detail-field-label">{label}:</span>
                        <div className="detail-value-object-list">
                            {value.map((item, index) => (
                                <div key={index} className="object-sample-card">
                                    <div className="sample-header">Элемент {index + 1}</div>
                                    <div className="sample-content">
                                        {Object.entries(item).map(([key, val]) => (
                                            <div key={key} className="sample-field">
                                                <span className="sample-key">{key}:</span>
                                                <span className="sample-value">
                                                    {typeof val === 'object'
                                                        ? <pre className="json-pre">{JSON.stringify(val, null, 2)}</pre>
                                                        : String(val)
                                                    }
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            // Обычный массив строк
            return (
                <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                    <span className="detail-field-label">{label}:</span>
                    <ul className="detail-value-list">
                        {value.map((item, index) => (
                            <li key={index} className="list-item">
                                {String(item)}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }

        if (typeof value === 'boolean') {
            return (
                <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                    <span className="detail-field-label">{label}:</span>
                    <span className="detail-value">
                        {value ? '✓ Да' : '✗ Нет'}
                    </span>
                </div>
            );
        }

        if (typeof value === 'number') {
            return (
                <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                    <span className="detail-field-label">{label}:</span>
                    <span className="detail-value">
                        {value}
                    </span>
                </div>
            );
        }

        // Для textarea-подобных полей с переносами
        if (typeof value === 'string' && (value.includes('\n') || value.length > 100)) {
            return (
                <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                    <span className="detail-field-label">{label}:</span>
                    <div className="textarea-preview">
                        <p>{value}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className={`detail-value-wrapper ${isImportant ? 'important' : ''}`}>
                <span className="detail-field-label">{label}:</span>
                <span className="detail-value">
                    {String(value)}
                </span>
            </div>
        );
    };

    const renderField = (field: DetailField<T>): ReactNode => {
        if (!field.name) return null;

        const value = values[field.name as keyof T];

        return (
            <div className={`detail-row ${field.important ? 'important' : ''}`}>
                {renderFieldValue(value, field.name, field.label, field.important)}
            </div>
        );
    };

    const renderSection = (section: DetailSection<T>) => {
        // Группируем поля для grid (как в FormBuilder)
        const processedFields: Array<DetailField<T> | DetailField<T>[]> = [];
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

        const renderedFields = processedFields
            .map((fieldOrGroup) => {
                if (Array.isArray(fieldOrGroup)) {
                    return (
                        <div key={fieldOrGroup[0].name} className="detail-grid-2">
                            {fieldOrGroup.map((field) => renderField(field))}
                        </div>
                    );
                }
                return renderField(fieldOrGroup);
            })
            .filter(Boolean);

        if (renderedFields.length === 0) return null;

        return (
            <section key={section.title} className="detail-section">
                <h3 className="section-title">{section.title}</h3>
                <div className="section-fields">
                    {renderedFields}
                </div>
            </section>
        );
    };

    return (
        <div className="details-content">
            {sections.map(renderSection)}
        </div>
    );
};