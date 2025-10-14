import type {ReactNode} from 'react';
import './Table.css';

interface TableProps {
    children: ReactNode;
}

export const Table = ({children}: TableProps) => {
    return <table>{children}</table>;
};

interface TableHeaderProps {
    children: ReactNode;
}

export const TableHeader = ({children}: TableHeaderProps) => {
    return <thead>{children}</thead>;
};

interface TableBodyProps {
    children: ReactNode;
}

export const TableBody = ({children}: TableBodyProps) => {
    return <tbody>{children}</tbody>;
};

interface TableRowProps {
    children: ReactNode;
    onClick?: () => void;
}

export const TableRow = ({children, onClick,}: TableRowProps) => {
    return (
        <tr
            onClick={onClick}
        >
            {children}
        </tr>
    );
};

interface TableCellProps {
    children: ReactNode;
    header?: boolean;
}

export const TableCell = ({children, header = false}: TableCellProps) => {
    const Tag = header ? 'th' : 'td';
    return <Tag>{children}</Tag>;
};
