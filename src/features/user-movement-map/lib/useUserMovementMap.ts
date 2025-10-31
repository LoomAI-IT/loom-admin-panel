import {useState, useEffect} from 'react';
import type {UserMovement} from '../../../entities/employee/model/types';
import {userMovementApi} from '../api/userMovementApi';
import {parseDuration, calculateStats, type MovementStats} from './helpers';

interface UseUserMovementMapProps {
    accountId: number;
    countLastHours: number;
    isOpen: boolean;
}

interface UseUserMovementMapReturn {
    movements: UserMovement[];
    loading: boolean;
    error: string | null;
    stats: MovementStats;
}

/**
 * Хук для получения и обработки данных карты перемещений пользователя
 */
export const useUserMovementMap = ({
    accountId,
    countLastHours,
    isOpen,
}: UseUserMovementMapProps): UseUserMovementMapReturn => {
    const [movements, setMovements] = useState<UserMovement[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<MovementStats>({
        totalMovements: 0,
        averageDuration: 0,
        fastestDuration: 0,
        slowestDuration: 0,
    });

    useEffect(() => {
        // Загружаем данные только если модалка открыта
        if (!isOpen) {
            return;
        }

        const fetchMovements = async () => {
            setLoading(true);
            setError(null);

            try {
                const movements = await userMovementApi.getUserMovementMap(
                    accountId,
                    countLastHours
                );

                // Сортируем по времени начала (от старых к новым - слева направо)
                const sortedMovements = [...movements].sort((a, b) => {
                    return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
                });

                setMovements(sortedMovements);

                // Вычисляем статистику
                const durations = sortedMovements.map((m) => parseDuration(m.duration));
                setStats(calculateStats(durations));
            } catch (err) {
                console.error('Failed to fetch user movement map:', err);
                setError('Не удалось загрузить карту перемещений');
                setMovements([]);
                setStats({
                    totalMovements: 0,
                    averageDuration: 0,
                    fastestDuration: 0,
                    slowestDuration: 0,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMovements();
    }, [accountId, countLastHours, isOpen]);

    return {
        movements,
        loading,
        error,
        stats,
    };
};
