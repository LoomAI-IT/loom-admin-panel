import {memo, useCallback, useMemo} from 'react';
import {DebouncedInput} from '../DebouncedInput';
import {DebouncedTextarea} from '../DebouncedTextarea';
import {Button} from '../Button';
import './ObjectListField.css';

interface ObjectListFieldProps {
    title?: string;
    label?: string;
    value: Record<string, any>[];
    onChange: (newValue: Record<string, any>[]) => void;
    mode?: 'view' | 'edit';
    debounceDelay?: number;
}

// Компонент для отдельного поля внутри объекта
const ObjectField = memo(
    ({
        objectIndex,
        fieldKey,
        fieldValue,
        debounceDelay,
        onKeyChange,
        onValueChange,
        onRemove,
    }: {
        objectIndex: number;
        fieldKey: string;
        fieldValue: any;
        debounceDelay: number;
        onKeyChange: (objectIndex: number, oldKey: string, newKey: string) => void;
        onValueChange: (objectIndex: number, key: string, value: string) => void;
        onRemove: (objectIndex: number, key: string) => void;
    }): React.JSX.Element => {
        const handleKeyChange = useCallback(
            (newKey: string) => {
                onKeyChange(objectIndex, fieldKey, newKey);
            },
            [objectIndex, fieldKey, onKeyChange]
        );

        const handleValueChange = useCallback(
            (newValue: string) => {
                onValueChange(objectIndex, fieldKey, newValue);
            },
            [objectIndex, fieldKey, onValueChange]
        );

        const handleRemove = useCallback(() => {
            onRemove(objectIndex, fieldKey);
        }, [objectIndex, fieldKey, onRemove]);

        const stringValue = typeof fieldValue === 'string' ? fieldValue : JSON.stringify(fieldValue);

        return (
            <div className="object-field-row">
                <DebouncedInput
                    className="field-key-input"
                    value={fieldKey}
                    onChange={handleKeyChange}
                    placeholder="Ключ"
                    debounceDelay={debounceDelay}
                />
                <DebouncedTextarea
                    value={stringValue}
                    onChange={handleValueChange}
                    placeholder="Значение"
                    debounceDelay={debounceDelay}
                />
                <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={handleRemove}
                    className="remove-field-button"
                >
                    ×
                </Button>
            </div>
        );
    }
);

ObjectField.displayName = 'ObjectField';

// Компонент для отдельного объекта в списке
const ObjectItem = memo(
    ({
        object,
        index,
        debounceDelay,
        onAddField,
        onRemoveField,
        onKeyChange,
        onValueChange,
        onRemove,
    }: {
        object: Record<string, any>;
        index: number;
        debounceDelay: number;
        onAddField: (index: number) => void;
        onRemoveField: (objectIndex: number, key: string) => void;
        onKeyChange: (objectIndex: number, oldKey: string, newKey: string) => void;
        onValueChange: (objectIndex: number, key: string, value: string) => void;
        onRemove: (index: number) => void;
    }): React.JSX.Element => {
        const handleAddField = useCallback(() => {
            onAddField(index);
        }, [index, onAddField]);

        const handleRemove = useCallback(() => {
            onRemove(index);
        }, [index, onRemove]);

        const fields = useMemo(
            () =>
                Object.entries(object).map(([key, value]) => (
                    <ObjectField
                        key={key}
                        objectIndex={index}
                        fieldKey={key}
                        fieldValue={value}
                        debounceDelay={debounceDelay}
                        onKeyChange={onKeyChange}
                        onValueChange={onValueChange}
                        onRemove={onRemoveField}
                    />
                )),
            [object, index, debounceDelay, onKeyChange, onValueChange, onRemoveField]
        );

        return (
            <div className="object-item-edit-card">
                <div className="object-item-edit-header">
                    <span className="object-item-title">Элемент {index + 1}</span>
                    <Button
                        type="button"
                        variant="danger"
                        size="small"
                        onClick={handleRemove}
                        className="remove-item-button"
                    >
                        ×
                    </Button>
                </div>

                <div className="object-item-edit-fields">
                    {fields}
                    <Button
                        type="button"
                        size="small"
                        onClick={handleAddField}
                        className="add-field-button"
                    >
                        + Добавить поле
                    </Button>
                </div>
            </div>
        );
    }
);

ObjectItem.displayName = 'ObjectItem';

export const ObjectListField = memo(
    ({title, label, value, onChange, mode = 'edit', debounceDelay = 300}: ObjectListFieldProps): React.JSX.Element | null => {
        const handleAddObject = useCallback(() => {
            onChange([...value, {}]);
        }, [value, onChange]);

        const handleRemoveObject = useCallback(
            (index: number) => {
                onChange(value.filter((_, i) => i !== index));
            },
            [value, onChange]
        );

        const handleAddField = useCallback(
            (objectIndex: number) => {
                const updated = [...value];
                updated[objectIndex] = {...updated[objectIndex], '': ''};
                onChange(updated);
            },
            [value, onChange]
        );

        const handleRemoveField = useCallback(
            (objectIndex: number, key: string) => {
                const updated = [...value];
                const obj = {...updated[objectIndex]};
                delete obj[key];
                updated[objectIndex] = obj;
                onChange(updated);
            },
            [value, onChange]
        );

        const handleKeyChange = useCallback(
            (objectIndex: number, oldKey: string, newKey: string) => {
                if (oldKey === newKey) return;

                const updated = [...value];
                const obj = {...updated[objectIndex]};
                const val = obj[oldKey];
                delete obj[oldKey];
                obj[newKey] = val;
                updated[objectIndex] = obj;
                onChange(updated);
            },
            [value, onChange]
        );

        const handleValueChange = useCallback(
            (objectIndex: number, key: string, newValue: string) => {
                const updated = [...value];
                updated[objectIndex] = {...updated[objectIndex], [key]: newValue};
                onChange(updated);
            },
            [value, onChange]
        );

        // Мемоизация items для предотвращения лишних ре-рендеров
        const items = useMemo(
            () =>
                value.map((obj, index) => (
                    <ObjectItem
                        key={index}
                        object={obj}
                        index={index}
                        debounceDelay={debounceDelay}
                        onAddField={handleAddField}
                        onRemoveField={handleRemoveField}
                        onKeyChange={handleKeyChange}
                        onValueChange={handleValueChange}
                        onRemove={handleRemoveObject}
                    />
                )),
            [
                value,
                debounceDelay,
                handleAddField,
                handleRemoveField,
                handleKeyChange,
                handleValueChange,
                handleRemoveObject,
            ]
        );

        if (mode === 'view' && value.length === 0) {
            return null;
        }

        return (
            <div className="object-list-field">
                {(title || label) && <h3 className="field-title">{title || label}</h3>}

                {mode === 'view' ? (
                    <div className="object-list-view">
                        {value.map((obj, objIdx) => (
                            <div key={objIdx} className="object-item-card">
                                <div className="object-item-header">
                                    <span className="object-item-title">Элемент {objIdx + 1}</span>
                                </div>
                                <div className="object-item-fields">
                                    {Object.entries(obj).map(([key, val]) => (
                                        <div key={key} className="object-field-item">
                                            <span className="field-key">{key}:</span>
                                            <span className="field-value">
                                                {typeof val === 'object'
                                                    ? JSON.stringify(val, null, 2)
                                                    : String(val)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="object-list-edit">{items}</div>
                        <Button
                            type="button"
                            size="small"
                            onClick={handleAddObject}
                            className="add-item-button"
                        >
                            + Добавить элемент
                        </Button>
                    </>
                )}
            </div>
        );
    }
);

ObjectListField.displayName = 'ObjectListField';
