import {type JSX, type ReactNode} from 'react';
import DOMPurify from 'dompurify';
import {useModal} from '../../lib/hooks';
import './DetailsViewer.css';
import {Modal} from "../Modal";
import {Button} from "../Button";
import {JsonViewModal} from "../../../features/json-import";

export interface DetailField {
    name: string;
    label: string;
    groupWith?: string[];
    renderAsHtml?: boolean;
}

export interface DetailSection {
    title: string;
    fields: DetailField[];
}

interface DetailsViewerProps<TEntityFormData> {
    title: string;
    organizationId: number,
    sections: DetailSection[];
    values: TEntityFormData;
    isOpen: boolean;
    onClose: () => void;
    footerActions?: ReactNode;
}

export const DetailsViewer = <TEntityFormData extends Record<string, any>>(
    {
        title,
        organizationId,
        sections,
        values,
        isOpen,
        onClose,
        footerActions,
    }: DetailsViewerProps<TEntityFormData>
) => {
    const jsonViewModal = useModal();

    const renderFieldValue = (value: any, label: string, renderAsHtml?: boolean): JSX.Element => {
        if (value === null || value === undefined || value === '') {
            return (
                <div className="details-viewer-field">
                    <div className="details-viewer-field-label">{label}</div>
                    <div className="details-viewer-field-value details-viewer-field-value--empty">
                        Не указано
                    </div>
                </div>
            );
        }

        // Рендеринг HTML-контента
        if (renderAsHtml && typeof value === 'string') {
            const sanitizedHtml = DOMPurify.sanitize(value);
            return (
                <div className="details-viewer-field">
                    <div className="details-viewer-field-label">{label}</div>
                    <div
                        className="details-viewer-field-value details-viewer-field-value--html"
                        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    />
                </div>
            );
        }

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return (
                    <div className="details-viewer-field">
                        <div className="details-viewer-field-label">{label}</div>
                        <div className="details-viewer-field-value details-viewer-field-value--empty">
                            Пустой список
                        </div>
                    </div>
                );
            }

            // Массив объектов
            if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
                return (
                    <div className="details-viewer-field">
                        <div className="details-viewer-field-label">{label}</div>
                        <div className="details-viewer-object-list">
                            {value.map((item, index) => (
                                <div key={index} className="details-viewer-object-card">
                                    <div className="details-viewer-object-card-header">
                                        Элемент {index + 1}
                                    </div>
                                    <div className="details-viewer-object-card-content">
                                        {Object.entries(item).map(([key, val]) => (
                                            <div key={key}
                                                 className="details-viewer-object-field details-viewer-object-field--vertical">
                                                <div className="details-viewer-object-field-key">{key}</div>
                                                <div className="details-viewer-object-field-value">
                                                    {typeof val === 'object' && val !== null
                                                        ? <pre>{JSON.stringify(val, null, 2)}</pre>
                                                        : String(val)
                                                    }
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            }

            // Обычный массив строк/чисел
            return (
                <div className="details-viewer-field">
                    <div className="details-viewer-field-label">{label}</div>
                    <div className="details-viewer-field-value">
                        <ul className="details-viewer-array-list">
                            {value.map((item, index) => (
                                <li key={index}>
                                    {String(item)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        if (typeof value === 'boolean') {
            return (
                <div className="details-viewer-field">
                    <div className="details-viewer-field-label">{label}</div>
                    <div
                        className={`details-viewer-field-value details-viewer-field-value--boolean ${value ? 'is-true' : 'is-false'}`}>
                        {value ? '✓ Да' : '✗ Нет'}
                    </div>
                </div>
            );
        }

        if (typeof value === 'number') {
            return (
                <div className="details-viewer-field">
                    <div className="details-viewer-field-label">{label}</div>
                    <div className="details-viewer-field-value">
                        {value}
                    </div>
                </div>
            );
        }

        // Обработка объектов (Record<string, any>)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            const entries = Object.entries(value);

            if (entries.length === 0) {
                return (
                    <div className="details-viewer-field">
                        <div className="details-viewer-field-label">{label}</div>
                        <div className="details-viewer-field-value details-viewer-field-value--empty">
                            Пустой объект
                        </div>
                    </div>
                );
            }

            return (
                <div className="details-viewer-field">
                    <div className="details-viewer-field-label">{label}</div>
                    <div className="details-viewer-object-card">
                        <div className="details-viewer-object-card-content">
                            {entries.map(([key, val]) => (
                                <div key={key}
                                     className="details-viewer-object-field details-viewer-object-field--vertical">
                                    <div className="details-viewer-object-field-key">{key}</div>
                                    <div className="details-viewer-object-field-value">
                                        {typeof val === 'object' && val !== null
                                            ? <pre>{JSON.stringify(val, null, 2)}</pre>
                                            : String(val)
                                        }
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // Для textarea-подобных полей с переносами или длинного текста
        if (typeof value === 'string' && (value.includes('\n') || value.length > 100)) {
            return (
                <div className="details-viewer-field">
                    <div className="details-viewer-field-label">{label}</div>
                    <div className="details-viewer-field-value details-viewer-field-value--long-text">
                        {value}
                    </div>
                </div>
            );
        }

        return (
            <div className="details-viewer-field">
                <div className="details-viewer-field-label">{label}</div>
                <div className="details-viewer-field-value">
                    {String(value)}
                </div>
            </div>
        );
    };

    const renderField = (field: DetailField): JSX.Element | null => {
        if (!field.name) return null;

        const value = values[field.name as keyof TEntityFormData];

        return renderFieldValue(value, field.label, field.renderAsHtml);
    };

    const renderSection = (section: DetailSection) => {
        // Группируем поля для grid (как в FormBuilder)
        const processedFields: Array<DetailField | DetailField[]> = [];
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
            .map((fieldOrGroup, idx) => {
                if (Array.isArray(fieldOrGroup)) {
                    return (
                        <div key={idx} className="details-viewer-field-group">
                            {fieldOrGroup.map((field) => renderField(field))}
                        </div>
                    );
                }
                return <div key={fieldOrGroup.name}>{renderField(fieldOrGroup)}</div>;
            })
            .filter(Boolean);

        if (renderedFields.length === 0) return null;

        return (
            <section key={section.title} className="details-viewer-section">
                <h3 className="details-viewer-section-title">{section.title}</h3>
                <div className="details-viewer-fields">
                    {renderedFields}
                </div>
            </section>
        );
    };

    return (
        <>
            <JsonViewModal
                isOpen={jsonViewModal.isOpen}
                onClose={jsonViewModal.close}
                data={values}
                organizationId={organizationId}
                zIndex={1100}
            />

            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={title}
                size="large"
            >
                <div className="details-viewer">
                    <div className="details-viewer-sections">
                        {sections.map(renderSection)}
                    </div>
                    <div className="details-viewer-footer">
                        {footerActions}
                        <Button
                            variant="secondary"
                            onClick={jsonViewModal.open}
                            size="small"
                        >Посмотреть JSON</Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};
