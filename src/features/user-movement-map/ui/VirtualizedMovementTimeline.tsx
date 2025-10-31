import {useState, useRef, type MouseEvent} from 'react';
import type {UserMovement} from '../../../entities/employee/model/types';
import {UserMovementCard} from './UserMovementCard';

interface VirtualizedMovementTimelineProps {
    movements: UserMovement[];
    height: number;
}

export const VirtualizedMovementTimeline = ({movements}: VirtualizedMovementTimelineProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        if (!scrollRef.current) return;

        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !scrollRef.current) return;

        e.preventDefault();

        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Множитель для скорости прокрутки
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
        }
    };

    return (
        <div
            ref={scrollRef}
            className={`movement-map-scroll ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <div className="movement-map-timeline">
                {movements.map((movement, index) => (
                    <UserMovementCard
                        key={`${movement.account_id}-${movement.start_time}-${index}`}
                        movement={movement}
                        nextMovement={index < movements.length - 1 ? movements[index + 1] : undefined}
                        isLast={index === movements.length - 1}
                    />
                ))}
            </div>
        </div>
    );
};
