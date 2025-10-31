import {forwardRef, useState, useRef, type CSSProperties, type MouseEvent, type ForwardedRef} from 'react';
import {Grid, type GridImperativeAPI} from 'react-window';
import type {UserMovement} from '../../../entities/employee/model/types';
import {UserMovementCard} from './UserMovementCard';

interface VirtualizedMovementTimelineProps {
    movements: UserMovement[];
    height: number;
}

// Фиксированная ширина элемента (карточка + стрелка)
const ITEM_WIDTH = 256; // 200px (min-width карточки) + 56px (стрелка с паддингами)

// Пропсы для ячейки
interface CellProps {
    movements: UserMovement[];
}

// Компонент для отдельного элемента (используем columnIndex как индекс перемещения)
const CellRenderer = ({
                          columnIndex,
                          style,
                          movements,
                      }: {
    ariaAttributes: {
        'aria-colindex': number;
        role: 'gridcell';
    };
    columnIndex: number;
    rowIndex: number;
    style: CSSProperties;
} & CellProps) => {
    const movement = movements[columnIndex];
    const isLast = columnIndex === movements.length - 1;

    return (
        <div
            style={{
                ...style,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <UserMovementCard movement={movement} isLast={isLast}/>
        </div>
    );
};

export const VirtualizedMovementTimeline = forwardRef<
    GridImperativeAPI,
    VirtualizedMovementTimelineProps
>((props: VirtualizedMovementTimelineProps, ref: ForwardedRef<GridImperativeAPI>) => {
    const {movements, height} = props;
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;

        // Находим внутренний scrollable элемент Grid
        const scrollableElement = containerRef.current.querySelector(
            '[style*="overflow"]'
        ) as HTMLElement;
        if (!scrollableElement) return;

        setIsDragging(true);
        setStartX(e.pageX);
        setScrollLeft(scrollableElement.scrollLeft);
        containerRef.current.style.cursor = 'grabbing';
        containerRef.current.style.userSelect = 'none';
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !containerRef.current) return;

        e.preventDefault();

        // Находим внутренний scrollable элемент Grid
        const scrollableElement = containerRef.current.querySelector(
            '[style*="overflow"]'
        ) as HTMLElement;
        if (!scrollableElement) return;

        const x = e.pageX;
        const walk = (x - startX) * 2; // Множитель для скорости прокрутки
        scrollableElement.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grab';
            containerRef.current.style.userSelect = 'auto';
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (containerRef.current) {
                containerRef.current.style.cursor = 'grab';
                containerRef.current.style.userSelect = 'auto';
            }
        }
    };

    return (
        <div
            ref={containerRef}
            className={`movement-map-scroll-wrapper ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{
                height: '100%',
                width: '100%',
                cursor: 'grab',
            }}
        >
            <Grid
                gridRef={ref}
                style={{height, width: '100%'}}
                rowCount={1} // Только одна строка для горизонтального списка
                columnCount={movements.length}
                rowHeight={height}
                columnWidth={ITEM_WIDTH}
                cellComponent={CellRenderer}
                cellProps={{movements}}
                overscanCount={5} // Рендерим 5 дополнительных элементов за пределами видимости
            />
        </div>
    );
});

VirtualizedMovementTimeline.displayName = 'VirtualizedMovementTimeline';
