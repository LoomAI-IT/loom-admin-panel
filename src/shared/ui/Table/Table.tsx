import type { ReactNode } from 'react';
import './Table.css';

interface TableProps {
  children: ReactNode;
  className?: string;
}

export const Table = ({ children, className = '' }: TableProps) => {
  return <table className={`table ${className}`}>{children}</table>;
};

interface TableHeaderProps {
  children: ReactNode;
}

export const TableHeader = ({ children }: TableHeaderProps) => {
  return <thead className="table-header">{children}</thead>;
};

interface TableBodyProps {
  children: ReactNode;
}

export const TableBody = ({ children }: TableBodyProps) => {
  return <tbody className="table-body">{children}</tbody>;
};

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const TableRow = ({ children, onClick, className = '' }: TableRowProps) => {
  return (
    <tr
      className={`table-row ${onClick ? 'table-row-clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

interface TableCellProps {
  children: ReactNode;
  header?: boolean;
  className?: string;
}

export const TableCell = ({ children, header = false, className = '' }: TableCellProps) => {
  const Tag = header ? 'th' : 'td';
  return <Tag className={`table-cell ${className}`}>{children}</Tag>;
};
