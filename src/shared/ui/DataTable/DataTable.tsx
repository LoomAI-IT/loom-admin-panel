import {ReactNode} from 'react';
import {Button, Table, TableHeader, TableBody, TableRow, TableCell} from '../';
import './DataTable.css';

export interface DataTableColumn<T> {
    header: string;
    key?: keyof T;
    render?: (item: T) => ReactNode;
    className?: string;
}

export interface DataTableAction<T> {
    label: string;
    onClick: (item: T) => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: (item: T) => boolean;
    render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
    title: string;
    data: T[];
    columns: DataTableColumn<T>[];
    actions?: DataTableAction<T>[];
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
    onAdd?: () => void;
    addButtonLabel?: string;
    getRowKey: (item: T) => string | number;
}

export const DataTable = <T,>({
    title,
    data,
    columns,
    actions = [],
    loading = false,
    error = null,
    emptyMessage = 'Нет данных',
    onAdd,
    addButtonLabel = 'Добавить',
    getRowKey,
}: DataTableProps<T>) => {
    if (loading) {
        return <div className="data-table-section loading">Загрузка...</div>;
    }

    return (
        <div className="data-table-section">
            <div className="data-table-header">
                <h2>{title}</h2>
                {onAdd && (
                    <Button size="small" onClick={onAdd}>
                        {addButtonLabel}
                    </Button>
                )}
            </div>

            {error && (
                <div className="notification notification-error">
                    <span className="notification-icon">⚠</span>
                    {error}
                </div>
            )}

            {data.length === 0 ? (
                <div className="empty-state">{emptyMessage}</div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col, idx) => (
                                <TableCell key={idx} header className={col.className}>
                                    {col.header}
                                </TableCell>
                            ))}
                            {actions.map((action, idx) => (
                                <TableCell key={`action-${idx}`} header className="table-cell-action">
                                    {''}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={getRowKey(item)}>
                                {columns.map((col, colIdx) => (
                                    <TableCell key={colIdx} className={col.className}>
                                        {col.render
                                            ? col.render(item)
                                            : col.key
                                            ? String(item[col.key])
                                            : ''}
                                    </TableCell>
                                ))}
                                {actions.map((action, actionIdx) => (
                                    <TableCell key={`action-${actionIdx}`} className="table-cell-action">
                                        {action.render ? (
                                            action.render(item)
                                        ) : (
                                            <Button
                                                size="small"
                                                variant={action.variant || 'primary'}
                                                onClick={() => action.onClick(item)}
                                                disabled={action.disabled?.(item)}
                                            >
                                                {action.label}
                                            </Button>
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};
