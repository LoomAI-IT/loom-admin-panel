import {useState} from 'react';
import {Activity, TrendingUp} from 'lucide-react';
import {Modal} from '../../../shared/ui';
import {UserMovementCard} from './UserMovementCard';
import {TimeFilter} from './TimeFilter';
import {useUserMovementMap} from '../lib/useUserMovementMap';
import {useDragScroll} from '../lib/useDragScroll';
import './UserMovementMap.css';

interface UserMovementMapProps {
    accountId: number;
    isOpen: boolean;
    onClose: () => void;
}

export const UserMovementMap = ({accountId, isOpen, onClose}: UserMovementMapProps) => {
    const [countLastHours, setCountLastHours] = useState(24);

    const {movements, loading, error, stats} = useUserMovementMap({
        accountId,
        countLastHours,
        isOpen,
    });

    const {scrollRef, isDragging, onMouseDown, onMouseMove, onMouseUp, onMouseLeave} =
        useDragScroll();

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Карта перемещений" size="xl">
            <div className="user-movement-map">
                {/* Заголовок с фильтром и статистикой */}
                <div className="movement-map-header">
                    <TimeFilter value={countLastHours} onChange={setCountLastHours} />

                    {!loading && !error && movements.length > 0 && (
                        <div className="movement-map-stats">
                            <div className="movement-map-stat">
                                <Activity size={16} />
                                <span>Всего: {stats.totalMovements}</span>
                            </div>
                            <div className="movement-map-stat">
                                <TrendingUp size={16} />
                                <span>Средняя длительность: {stats.averageDuration} мс</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Основной контент */}
                <div className="movement-map-content">
                    {loading && (
                        <div className="movement-map-loading">
                            <div className="spinner" />
                            <p>Загрузка данных...</p>
                        </div>
                    )}

                    {error && (
                        <div className="movement-map-error">
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && movements.length === 0 && (
                        <div className="movement-map-empty">
                            <Activity size={48} />
                            <p>Нет данных о перемещениях за выбранный период</p>
                        </div>
                    )}

                    {!loading && !error && movements.length > 0 && (
                        <div
                            ref={scrollRef}
                            className={`movement-map-scroll ${isDragging ? 'is-dragging' : ''}`}
                            onMouseDown={onMouseDown}
                            onMouseMove={onMouseMove}
                            onMouseUp={onMouseUp}
                            onMouseLeave={onMouseLeave}
                        >
                            <div className="movement-map-timeline">
                                {movements.map((movement, index) => (
                                    <UserMovementCard
                                        key={`${movement.start_time}-${index}`}
                                        movement={movement}
                                        isLast={index === movements.length - 1}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Подсказка */}
                {!loading && !error && movements.length > 0 && (
                    <div className="movement-map-hint">
                        <p>💡 Используйте мышь для перемещения по карте</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
