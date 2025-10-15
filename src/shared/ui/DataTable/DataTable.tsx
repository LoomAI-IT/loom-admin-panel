import {type JSX, type ReactNode} from 'react';
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
    onRowClick?: (item: T) => void;
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
        onRowClick,
    }: DataTableProps<T>
) => {
    // Skeleton Loader Component
    const SkeletonRow = () => (
        <div className="skeleton-row">
            {[...Array(columns.length + (actions.length > 0 ? 1 : 0))].map((_, idx) => (
                <div key={idx} className="skeleton skeleton-cell"/>
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
                        <SkeletonRow/>
                        <SkeletonRow/>
                        <SkeletonRow/>
                        <SkeletonRow/>
                        <SkeletonRow/>
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
                                {actions.length > 0 && (
                                    <TableCell key="actions-header" header className="actions-column"></TableCell>
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((item) => (
                                <TableRow
                                    key={getRowKey(item)}
                                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                                >
                                    {columns.map((col, colIdx) => (
                                        <TableCell key={colIdx}>
                                            {col.render
                                                ? col.render(item)
                                                : col.key
                                                    ? String(item[col.key])
                                                    : ''}
                                        </TableCell>
                                    ))}
                                    {actions.length > 0 && (
                                        <TableCell key="actions" className="actions-column">
                                            <div className="action-buttons">
                                                {actions.map((action, actionIdx) => (
                                                    action.render ? (
                                                        <div key={`action-${actionIdx}`} onClick={(e) => e.stopPropagation()}>
                                                            {action.render(item)}
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            key={`action-${actionIdx}`}
                                                            size="small"
                                                            variant={action.variant || 'primary'}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                action.onClick(item);
                                                            }}
                                                            disabled={action.disabled?.(item)}
                                                        >
                                                            {action.label}
                                                        </Button>
                                                    )
                                                ))}
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};
