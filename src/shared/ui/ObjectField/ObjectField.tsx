import * as React from "react";
import {memo, useCallback, useMemo} from "react";

import {DebouncedInput} from '../DebouncedInput';
import {DebouncedTextarea} from '../DebouncedTextarea';
import {Button} from '../Button';
import './ObjectField.css';

interface ObjectFieldProps {
    title?: string;
    label?: string;
    value: Record<string, any>;
    onChange: (newValue: Record<string, any>) => void;
    mode?: 'view' | 'edit';
    debounceDelay: number;
}

interface ObjectFieldItemProps {
    itemKey: string;
    value: any;
    debounceDelay: number;
    onKeyChange: (oldKey: string, newKey: string) => void;
    onValueChange: (key: string, value: string) => void;
    onRemove: (key: string) => void;
}

const ObjectFieldItem = memo((
    {
        itemKey,
        value,
        debounceDelay,
        onKeyChange,
        onValueChange,
        onRemove
    }: ObjectFieldItemProps
): React.JSX.Element => {
    const handleKeyChange = useCallback(
        (newKey: string) => {
            onKeyChange(itemKey, newKey);
        },
        [itemKey, onKeyChange]
    );

    const handleValueChange = useCallback(
        (newValue: string) => {
            onValueChange(itemKey, newValue);
        },
        [itemKey, onValueChange]
    );

    const handleRemove = useCallback(() => {
        onRemove(itemKey);
    }, [itemKey, onRemove]);

    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    return (
        <div className="object-field-item">
            <DebouncedInput
                value={itemKey}
                onChange={handleKeyChange}
                placeholder="Ключ"
                debounceDelay={debounceDelay}
            />
            <DebouncedTextarea
                value={stringValue}
                onChange={handleValueChange}
                placeholder="Значение"
                debounceDelay={debounceDelay}
                rows={3}
            />
            <div className="object-field-item-actions">
                <Button
                    type="button"
                    variant="danger"
                    size="xs"
                    onClick={handleRemove}
                    aria-label="Удалить поле"
                >
                    Удалить
                </Button>
            </div>
        </div>
    );
});

ObjectFieldItem.displayName = 'ObjectFieldItem';

export const ObjectField = memo((
    {
        title,
        label,
        value,
        onChange,
        mode = 'edit',
        debounceDelay = 300
    }: ObjectFieldProps
): React.JSX.Element | null => {
    const handleAdd = useCallback(() => {
        onChange({...value, '': ''});
    }, [value, onChange]);

    const handleRemove = useCallback(
        (key: string) => {
            const newData = {...value};
            delete newData[key];
            onChange(newData);
        },
        [value, onChange]
    );

    const handleKeyUpdate = useCallback(
        (oldKey: string, newKey: string) => {
            if (oldKey === newKey) return;

            const newData = {...value};
            const val = newData[oldKey];
            delete newData[oldKey];
            newData[newKey] = val;
            onChange(newData);
        },
        [value, onChange]
    );

    const handleValueUpdate = useCallback(
        (key: string, newValue: string) => {
            onChange({...value, [key]: newValue});
        },
        [value, onChange]
    );

    const items = useMemo(
        () =>
            Object.entries(value).map(([key, val]) => (
                <ObjectFieldItem
                    key={key}
                    itemKey={key}
                    value={val}
                    debounceDelay={debounceDelay}
                    onKeyChange={handleKeyUpdate}
                    onValueChange={handleValueUpdate}
                    onRemove={handleRemove}
                />
            )),
        [value, debounceDelay, handleKeyUpdate, handleValueUpdate, handleRemove]
    );

    if (mode === 'view' && Object.keys(value).length === 0) {
        return null;
    }

    return (
        <div className="object-field">
            {(title || label) && <label className="object-field-label">{title || label}</label>}

            {mode === 'view' ? (
                <div>
                    {Object.entries(value).map(([key, val]) => (
                        <div key={key}>
                            <span>{key}:</span>
                            <span>
                                    {typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}
                                </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="object-field-container">
                    <div className="object-field-items">{items}</div>
                    <Button
                        type="button"
                        variant="secondary"
                        size="small"
                        onClick={handleAdd}
                        className="object-field-add-button"
                    >
                        + Добавить поле
                    </Button>
                </div>
            )}
        </div>
    );
});

ObjectField.displayName = 'ObjectField';
