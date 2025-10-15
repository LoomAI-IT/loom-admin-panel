import type {ReactNode} from 'react';
import './Table.css';

interface TableProps {
    children: ReactNode;
}

export const Table = ({children}: TableProps) => {
    return <table className="table">{children}</table>;
};

interface TableHeaderProps {
    children: ReactNode;
}

export const TableHeader = ({children}: TableHeaderProps) => {
    return <thead className="table-header">{children}</thead>;
};

interface TableBodyProps {
    children: ReactNode;
}

export const TableBody = ({children}: TableBodyProps) => {
    return <tbody className="table-body">{children}</tbody>;
};

interface TableRowProps {
    children: ReactNode;
    onClick?: () => void;
}

export const TableRow = ({children, onClick,}: TableRowProps) => {
    return (
        <tr
            className={onClick ? 'table-row table-row--clickable' : 'table-row'}
            onClick={onClick}
        >
            {children}
        </tr>
    );
};

interface TableCellProps {
    children?: ReactNode;
    header?: boolean;
    className?: string;
}

export const TableCell = ({children, header = false, className: customClassName}: TableCellProps) => {
    const Tag = header ? 'th' : 'td';
    const className = [
        header ? 'table-cell table-cell--header' : 'table-cell',
        customClassName
    ].filter(Boolean).join(' ');
    return <Tag className={className}>{children}</Tag>;
};
