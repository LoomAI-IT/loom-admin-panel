import * as React from 'react';
import {memo, useCallback, useMemo} from 'react';

import {DebouncedTextarea} from '../DebouncedTextarea';
import {Button} from '../Button';

import './StringListField.css';

interface StringListFieldProps {
    title?: string;
    label?: string;
    value: string[];
    onChange: (newValue: string[]) => void;
    mode?: 'view' | 'edit';
    placeholder: string;
    debounceDelay: number;
}

interface StringListItemProps {
    value: string;
    index: number;
    placeholder: string;
    debounceDelay: number;
    onChange: (index: number, value: string) => void;
    onRemove: (index: number) => void;
}

const StringListItem = memo((
    {
        value,
        index,
        placeholder,
        debounceDelay,
        onChange,
        onRemove,
    }: StringListItemProps
): React.JSX.Element => {
    const handleChange = useCallback(
        (newValue: string) => {
            onChange(index, newValue);
        },
        [index, onChange]
    );

    const handleRemove = useCallback(() => {
        onRemove(index);
    }, [index, onRemove]);

    return (
        <div>
            <DebouncedTextarea
                value={value}
                onChange={handleChange}
                placeholder={`${placeholder} ${index + 1}`}
                rows={3}
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

StringListItem.displayName = 'StringListItem';

export const StringListField = memo((
    {
        title,
        label,
        value,
        onChange,
        mode = 'edit',
        placeholder = 'Элемент',
        debounceDelay = 300,
    }: StringListFieldProps
): React.JSX.Element | null => {
    const handleAdd = useCallback(() => {
        onChange([...value, '']);
    }, [value, onChange]);

    const handleRemove = useCallback(
        (index: number) => {
            onChange(value.filter((_, i) => i !== index));
        },
        [value, onChange]
    );

    const handleUpdate = useCallback(
        (index: number, newValue: string) => {
            const updated = [...value];
            updated[index] = newValue;
            onChange(updated);
        },
        [value, onChange]
    );

    const items = useMemo(
        () =>
            value.map((item, index) => (
                <StringListItem
                    key={index}
                    value={item}
                    index={index}
                    placeholder={placeholder}
                    debounceDelay={debounceDelay}
                    onChange={handleUpdate}
                    onRemove={handleRemove}
                />
            )),
        [value, placeholder, debounceDelay, handleUpdate, handleRemove]
    );

    if (mode === 'view' && value.length === 0) {
        return null;
    }

    return (
        <div>
            {(title || label) && <h3>{title || label}</h3>}

            {mode === 'view' ? (
                <div>
                    {value.map((item, idx) => (
                        <div key={idx}>
                            <span>{idx + 1}.</span>
                            <span>{item}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <>
                    <div>{items}</div>
                    <Button type="button" size="small" onClick={handleAdd}>
                        + Добавить элемент
                    </Button>
                </>
            )}
        </div>
    );
});

StringListField.displayName = 'StringListField';
