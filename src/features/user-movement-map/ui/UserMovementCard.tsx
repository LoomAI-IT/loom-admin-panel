import {memo, useMemo} from 'react';
import {ArrowRight, Clock, Calendar} from 'lucide-react';
import type {UserMovement} from '../../../entities/employee/model/types';
import {formatTime, formatDate, parseDuration, getDurationColor} from '../lib/helpers';

interface UserMovementCardProps {
    movement: UserMovement;
    isLast: boolean;
}

export const UserMovementCard = memo(({movement, isLast}: UserMovementCardProps) => {
    // Мемоизируем вычисления для предотвращения пересчетов при ре-рендерах
    const durationMs = useMemo(() => parseDuration(movement.duration), [movement.duration]);
    const colorVariant = useMemo(() => getDurationColor(durationMs), [durationMs]);
    const formattedDate = useMemo(() => formatDate(movement.start_time), [movement.start_time]);
    const formattedTime = useMemo(() => formatTime(movement.start_time), [movement.start_time]);

    const colorClasses = {
        success: 'movement-card--success',
        warning: 'movement-card--warning',
        danger: 'movement-card--danger',
    };

    return (
        <div className="movement-card-wrapper">
            <div className={`movement-card ${colorClasses[colorVariant]}`}>
                <div className="movement-card-datetime">
                    <div className="movement-card-date">
                        <Calendar size={14} />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="movement-card-time">
                        <Clock size={14} />
                        <span>{formattedTime}</span>
                    </div>
                </div>

                <div className="movement-card-service">{movement.service}</div>

                <div className="movement-card-method">{movement.method}</div>

                <div className={`movement-card-duration movement-card-duration--${colorVariant}`}>
                    {movement.duration}
                </div>
            </div>

            {!isLast && (
                <div className="movement-card-arrow">
                    <ArrowRight size={24} />
                </div>
            )}
        </div>
    );
});

UserMovementCard.displayName = 'UserMovementCard';
