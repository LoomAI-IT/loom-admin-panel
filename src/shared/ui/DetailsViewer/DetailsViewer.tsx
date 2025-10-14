import * as React from 'react';
import {JSX, ReactNode} from 'react';
import {useModal} from '../../lib/hooks';
import './DetailsViewer.css';

export interface DetailField<T = any> {
    name: string;
    render?: (values: T) => JSX.Element;
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

    const renderFieldValue = (value: any, fieldName: string, isImportant = false): ReactNode => {
        if (value === null || value === undefined || value === '') {
            return <span className="detail-value-empty">Не указано</span>;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return <span className="detail-value-empty">Пустой список</span>;
            }

            // Массив объектов
            if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                return (
                    <div className={`detail-value-object-list ${isImportant ? 'important' : ''}`}>
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
                );
            }

            // Обычный массив строк
            return (
                <ul className={`detail-value-list ${isImportant ? 'important' : ''}`}>
                    {value.map((item, index) => (
                        <li key={index} className="list-item">
                            {String(item)}
                        </li>
                    ))}
                </ul>
            );
        }

        if (typeof value === 'boolean') {
            return <span className={`detail-value ${isImportant ? 'important' : ''}`}>
                {value ? '✓ Да' : '✗ Нет'}
            </span>;
        }

        if (typeof value === 'number') {
            return <span className={`detail-value ${isImportant ? 'important' : ''}`}>
                {value}
            </span>;
        }

        // Для textarea-подобных полей с переносами
        if (typeof value === 'string' && (value.includes('\n') || value.length > 100)) {
            return (
                <div className={`textarea-preview ${isImportant ? 'important' : ''}`}>
                    <p>{value}</p>
                </div>
            );
        }

        return <span className={`detail-value ${isImportant ? 'important' : ''}`}>
            {String(value)}
        </span>;
    };

    const renderField = (field: DetailField<T>): ReactNode => {
        const fieldLabel = field.name;

        if (field.render) {
            return field.render(values);
        }

        if (!field.name) return null;

        const value = values[field.name as keyof T];

        return (
            <div className={`detail-row ${field.important ? 'important' : ''}`}>
                <div className="detail-label">{fieldLabel}</div>
                <div className="detail-value-container">
                    {renderFieldValue(value, field.name, field.important)}
                </div>
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