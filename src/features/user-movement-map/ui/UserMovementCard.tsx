import {ArrowRight, Clock, Calendar} from 'lucide-react';
import type {UserMovement} from '../../../entities/employee/model/types';
import {formatTime, formatDate, parseDuration, getDurationColor} from '../lib/helpers';

interface UserMovementCardProps {
    movement: UserMovement;
    isLast: boolean;
}

export const UserMovementCard = ({movement, isLast}: UserMovementCardProps) => {
    const durationMs = parseDuration(movement.duration);
    const colorVariant = getDurationColor(durationMs);

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
                        <span>{formatDate(movement.start_time)}</span>
                    </div>
                    <div className="movement-card-time">
                        <Clock size={14} />
                        <span>{formatTime(movement.start_time)}</span>
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
};
