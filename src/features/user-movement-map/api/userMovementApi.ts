import {internalDashboardClient} from '../../../shared/api';
import type {UserMovement, UserMovementMapResponse} from '../../../entities/employee/model/types';

export const userMovementApi = {
    getUserMovementMap: async (
        accountId: number,
        countLastHours: number
    ): Promise<UserMovement[]> => {
        const response = await internalDashboardClient.get<UserMovementMapResponse>(
            `/user-movement-map/${accountId}/${countLastHours}`
        );
        // API возвращает массив напрямую
        return response.data;
    },
};
