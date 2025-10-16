import {useCallback} from 'react';
import {
    type Autoposting,
    type AutopostingCategory,
    autopostingApi,
    autopostingCategoryApi,
} from '../../../entities/autoposting';
import {useEntityList} from '../../../shared/lib/hooks';

export interface AutopostingWithCategory {
    autoposting: Autoposting;
    category: AutopostingCategory;
}

interface UseAutopostingsModelProps {
    organizationId: number;
}

export const useAutopostingsModel = ({organizationId}: UseAutopostingsModelProps) => {
    const loadAutopostings = useCallback(
        () => autopostingApi.getByOrganization(organizationId),
        [organizationId]
    );

    const autopostingList = useEntityList<Autoposting>({
        loadFn: loadAutopostings,
    });

    const loadAutopostingWithCategory = async (
        autoposting: Autoposting
    ): Promise<AutopostingWithCategory> => {
        const category = await autopostingCategoryApi.getById(
            autoposting.autoposting_category_id
        );
        return {autoposting, category};
    };

    const createAutoposting = async (
        categoryRequest: any,
        autopostingRequest: any
    ) => {
        const categoryResponse = await autopostingCategoryApi.create(categoryRequest);

        if (!categoryResponse.autoposting_category_id) {
            throw new Error('Failed to create autoposting category');
        }

        const request = {
            ...autopostingRequest,
            autoposting_category_id: categoryResponse.autoposting_category_id,
        };

        await autopostingApi.create(request);
    };

    const updateAutoposting = async (
        autopostingId: number,
        categoryId: number,
        categoryRequest: any,
        autopostingRequest: any
    ) => {
        await autopostingCategoryApi.update(categoryId, categoryRequest);
        await autopostingApi.update(autopostingId, autopostingRequest);
    };

    const updateAutopostingStatus = async (
        autopostingId: number,
        enabled: boolean
    ) => {
        await autopostingApi.update(autopostingId, {enabled});
    };

    const deleteAutoposting = async (autopostingId: number) => {
        await autopostingApi.delete(autopostingId);
    };

    return {
        // State
        autopostings: autopostingList.entities,
        loading: autopostingList.loading,
        error: autopostingList.error,

        // Actions
        refresh: autopostingList.refresh,
        loadAutopostingWithCategory,
        createAutoposting,
        updateAutoposting,
        updateAutopostingStatus,
        deleteAutoposting,
    };
};
