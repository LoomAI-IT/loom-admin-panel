import {useCallback} from 'react';
import {
    type Category,
    type CreateCategoryRequest,
    type UpdateCategoryRequest,
    categoryApi,
} from '../../../entities/category';
import {useEntityList} from '../../../shared/lib/hooks';

interface UseCategoriesModelProps {
    organizationId: number;
}

export const useCategoriesModel = ({organizationId}: UseCategoriesModelProps) => {
    const loadCategories = useCallback(
        () => categoryApi.getByOrganization(organizationId),
        [organizationId]
    );

    const categoryList = useEntityList<Category>({
        loadFn: loadCategories,
    });

    const createCategory = async (request: CreateCategoryRequest) => {
        await categoryApi.create(request);
    };

    const updateCategory = async (categoryId: number, request: UpdateCategoryRequest) => {
        await categoryApi.update(categoryId, request);
    };

    const deleteCategory = async (categoryId: number) => {
        await categoryApi.delete(categoryId);
    };

    return {
        // State
        categories: categoryList.entities,
        loading: categoryList.loading,
        error: categoryList.error,

        // Actions
        refresh: categoryList.refresh,
        createCategory,
        updateCategory,
        deleteCategory,
    };
};
