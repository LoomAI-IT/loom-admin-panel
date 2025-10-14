import * as React from 'react';
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
    debounceDelay: number;
}

interface ObjectItemProps {
    object: Record<string, any>;
    index: number;
    debounceDelay: number;
    onAddField: (index: number) => void;
    onRemoveField: (objectIndex: number, key: string) => void;
    onKeyChange: (objectIndex: number, oldKey: string, newKey: string) => void;
    onValueChange: (objectIndex: number, key: string, value: string) => void;
    onRemove: (index: number) => void;
}

interface ObjectFieldProps {
    objectIndex: number;
    fieldKey: string;
    fieldValue: any;
    debounceDelay: number;
    onKeyChange: (objectIndex: number, oldKey: string, newKey: string) => void;
    onValueChange: (objectIndex: number, key: string, value: string) => void;
    onRemove: (objectIndex: number, key: string) => void;
}

// Компонент для отдельного поля внутри объекта
const ObjectField = memo((
    {
        objectIndex,
        fieldKey,
        fieldValue,
        debounceDelay,
        onKeyChange,
        onValueChange,
        onRemove,
    }: ObjectFieldProps
): React.JSX.Element => {
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
        <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)'}}>
            <DebouncedInput
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
                rows={2}
            />
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button
                    type="button"
                    variant="danger"
                    size="xs"
                    onClick={handleRemove}
                    aria-label="Удалить поле"
                >
                    Удалить поле
                </Button>
            </div>
        </div>
    );
});

ObjectField.displayName = 'ObjectField';

// Компонент для отдельного объекта в списке
const ObjectItem = memo((
    {
        object,
        index,
        debounceDelay,
        onAddField,
        onRemoveField,
        onKeyChange,
        onValueChange,
        onRemove,
    }: ObjectItemProps
): React.JSX.Element => {
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
        <div className="object-list-item">
            <div className="object-list-item-header">
                <span className="object-list-item-title">Элемент {index + 1}</span>
                <Button
                    type="button"
                    variant="danger"
                    size="xs"
                    onClick={handleRemove}
                    aria-label="Удалить элемент"
                >
                    Удалить элемент
                </Button>
            </div>

            <div className="object-list-item-fields">
                {fields}
            </div>

            <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={handleAddField}
                style={{marginTop: 'var(--spacing-2)'}}
            >
                + Добавить поле
            </Button>
        </div>
    );
});

ObjectItem.displayName = 'ObjectItem';

export const ObjectListField = memo((
    {
        title,
        label,
        value,
        onChange,
        mode = 'edit',
        debounceDelay = 300
    }: ObjectListFieldProps
): React.JSX.Element | null => {
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
            {(title || label) && <label className="object-list-field-label">{title || label}</label>}

            {mode === 'view' ? (
                <div>
                    {value.map((obj, objIdx) => (
                        <div key={objIdx}>
                            <div>
                                <span>Элемент {objIdx + 1}</span>
                            </div>
                            <div>
                                {Object.entries(obj).map(([key, val]) => (
                                    <div key={key}>
                                        <span>{key}:</span>
                                        <span>
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
                    <div className="object-list-items">{items}</div>
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={handleAddObject}
                        className="object-list-add-button"
                    >
                        + Добавить элемент
                    </Button>
                </>
            )}
        </div>
    );
});

ObjectListField.displayName = 'ObjectListField';
