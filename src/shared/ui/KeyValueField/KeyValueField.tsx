import * as React from "react";
import {memo, useCallback, useMemo} from "react";

import {DebouncedInput} from '../DebouncedInput';
import {DebouncedTextarea} from '../DebouncedTextarea';
import {Button} from '../Button';
import './KeyValueField.css';

interface KeyValueFieldProps {
    title?: string;
    label?: string;
    value: Record<string, any>;
    onChange: (newValue: Record<string, any>) => void;
    mode?: 'view' | 'edit';
    debounceDelay: number;
}

interface KeyValueItemProps {
    itemKey: string;
    value: any;
    debounceDelay: number;
    onKeyChange: (oldKey: string, newKey: string) => void;
    onValueChange: (key: string, value: string) => void;
    onRemove: (key: string) => void;
}

const KeyValueItem = memo((
    {
        itemKey,
        value,
        debounceDelay,
        onKeyChange,
        onValueChange,
        onRemove
    }: KeyValueItemProps
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
        <div>
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
            />
            <Button
                type="button"
                variant="danger"
                size="small"
                onClick={handleRemove}
            >
                ×
            </Button>
        </div>
    );
});

KeyValueItem.displayName = 'KeyValueItem';

export const KeyValueField = memo((
    {
        title,
        label,
        value,
        onChange,
        mode = 'edit',
        debounceDelay = 300
    }: KeyValueFieldProps
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
                <KeyValueItem
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
        <div>
            {(title || label) && <h3>{title || label}</h3>}

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
                <>
                    <div>{items}</div>
                    <Button type="button" size="small" onClick={handleAdd}>
                        + Добавить поле
                    </Button>
                </>
            )}
        </div>
    );
});

KeyValueField.displayName = 'KeyValueField';
