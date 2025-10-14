import {JSX, ReactNode} from 'react';
import {Button, Table, TableBody, TableCell, TableHeader, TableRow} from '../';
import './DataTable.css';

export interface DataTableColumn<T> {
    header: string;
    key?: keyof T;
    render?: (item: T) => JSX.Element;
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

export const DataTable = <T, >(
    {
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
    }: DataTableProps<T>
) => {
    // Skeleton Loader Component
    const SkeletonRow = () => (
        <div className="skeleton-row">
            {[...Array(columns.length + actions.length)].map((_, idx) => (
                <div key={idx} className="skeleton skeleton-cell" />
            ))}
        </div>
    );

    return (
        <div className="data-table">
            <div className="data-table-header">
                <h2 className="data-table-title">{title}</h2>
                {onAdd && (
                    <div className="data-table-actions">
                        <Button size="small" onClick={onAdd}>
                            {addButtonLabel}
                        </Button>
                    </div>
                )}
            </div>

            {error && (
                <div className="data-table-error">
                    <span>⚠</span>
                    {error}
                </div>
            )}

            {loading ? (
                <div className="data-table-container">
                    <div className="data-table-loading">
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                        <SkeletonRow />
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="data-table-container">
                    <div className="data-table-empty">{emptyMessage}</div>
                </div>
            ) : (
                <div className="data-table-container">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map((col, idx) => (
                                    <TableCell key={idx} header>
                                        {col.header}
                                    </TableCell>
                                ))}
                                {actions.map((action, idx) => (
                                    <TableCell key={`action-${idx}`} header>
                                        {''}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow key={getRowKey(item)}>
                                    {columns.map((col, colIdx) => (
                                        <TableCell key={colIdx}>
                                            {col.render
                                                ? col.render(item)
                                                : col.key
                                                    ? String(item[col.key])
                                                    : ''}
                                        </TableCell>
                                    ))}
                                    {actions.map((action, actionIdx) => (
                                        <TableCell key={`action-${actionIdx}`}>
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
                </div>
            )}
        </div>
    );
};
