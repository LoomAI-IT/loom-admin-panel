import {ReactNode} from 'react';
import './DetailsViewer.css';

export interface DetailField<T = any> {
    label: string;
    key?: keyof T;
    render?: (data: T) => ReactNode;
    important?: boolean;
}

export interface DetailSection<T = any> {
    title: string;
    fields: DetailField<T>[];
}

interface DetailsViewerProps<T> {
    sections: DetailSection<T>[];
    data: T;
    customFieldRenderer?: (label: string, value: any, isImportant?: boolean) => ReactNode | null;
}

export const DetailsViewer = <T extends Record<string, any>>({
                                                                 sections,
                                                                 data,
                                                                 customFieldRenderer,
                                                             }: DetailsViewerProps<T>) => {
    const defaultRenderField = (label: string, value: any, isImportant = false): ReactNode | null => {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        if (Array.isArray(value)) {
            if (value.length === 0) return null;

            // Массив объектов (например good_samples)
            if (typeof value[0] === 'object' && value[0] !== null) {
                return (
                    <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
                        <div className="detail-label">{label}</div>
                        <div className="object-samples-container">
                            {value.map((sample, index) => (
                                <div key={index} className="object-sample-card">
                                    <div className="object-sample-header">Элемент {index + 1}</div>
                                    <div className="object-sample-content">
                                        {Object.entries(sample).map(([key, val]) => (
                                            <div key={key} className="object-sample-field">
                                                <span className="object-sample-key">{key}:</span>
                                                <span className="object-sample-value">
                                                    {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
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

            // Обычный массив
            return (
                <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
                    <div className="detail-label">{label}</div>
                    <div className="detail-value">
                        <ul className="array-list">
                            {value.map((item, index) => (
                                <li key={index} className="array-item">
                                    {typeof item === 'object' ? JSON.stringify(item, null, 2) : String(item)}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }

        if (typeof value === 'boolean') {
            return (
                <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
                    <div className="detail-label">{label}</div>
                    <div className="detail-value">{value ? 'Да' : 'Нет'}</div>
                </div>
            );
        }

        return (
            <div className={`detail-field ${isImportant ? 'detail-field-important' : ''}`} key={label}>
                <div className="detail-label">{label}</div>
                <div className="detail-value">{String(value)}</div>
            </div>
        );
    };

    const renderField = (field: DetailField<T>): ReactNode | null => {
        let value: any;
        let label = field.label;

        if (field.render) {
            const rendered = field.render(data);
            if (!rendered) return null;
            return rendered;
        }

        if (field.key) {
            value = data[field.key];
        }

        const renderer = customFieldRenderer || defaultRenderField;
        return renderer(label, value, field.important);
    };

    const renderSection = (section: DetailSection<T>): ReactNode | null => {
        const renderedFields = section.fields.map((field) => renderField(field)).filter((field) => field !== null);

        if (renderedFields.length === 0) return null;

        return (
            <div className="detail-section" key={section.title}>
                <h3 className="section-title">{section.title}</h3>
                <div className="section-content">{renderedFields}</div>
            </div>
        );
    };

    return <div className="details-viewer">{sections.map((section) => renderSection(section))}</div>;
};
