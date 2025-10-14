import {useState, useCallback, useEffect} from 'react';

/**
 * Хук для управления списком сущностей с фильтрацией и сортировкой
 * Упрощает работу со списками в таблицах и grid-представлениях
 */

interface UseEntityListOptions<TEntity> {
    loadFn: () => Promise<TEntity[]>;
    autoLoad?: boolean;
    filterFn?: (entity: TEntity, searchQuery: string) => boolean;
    sortFn?: (a: TEntity, b: TEntity) => number;
}

interface UseEntityListReturn<TEntity> {
    // Данные
    entities: TEntity[];
    filteredEntities: TEntity[];
    loading: boolean;
    error: string | null;

    // Поиск и фильтрация
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // Операции
    load: () => Promise<void>;
    refresh: () => Promise<void>;
    clearError: () => void;

    // Выделение
    selectedIds: Set<number>;
    toggleSelect: (id: number) => void;
    selectAll: () => void;
    clearSelection: () => void;
}

export const useEntityList = <TEntity extends { id: number }>(
    options: UseEntityListOptions<TEntity>
): UseEntityListReturn<TEntity> => {
    const {loadFn, autoLoad = true, filterFn, sortFn} = options;

    const [entities, setEntities] = useState<TEntity[]>([]);
    const [loading, setLoading] = useState(autoLoad);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Загрузка данных
    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await loadFn();
            setEntities(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ошибка при загрузке данных';
            setError(errorMessage);
            console.error('Error loading entities:', err);
        } finally {
            setLoading(false);
        }
    }, [loadFn]);

    // Обновление данных (то же, что load, но явное для пользователя)
    const refresh = useCallback(async () => {
        await load();
    }, [load]);

    // Фильтрация и сортировка
    const filteredEntities = (() => {
        let result = [...entities];

        // Применяем фильтрацию
        if (searchQuery && filterFn) {
            result = result.filter(entity => filterFn(entity, searchQuery));
        }

        // Применяем сортировку
        if (sortFn) {
            result.sort(sortFn);
        }

        return result;
    })();

    // Управление выделением
    const toggleSelect = useCallback((id: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    const selectAll = useCallback(() => {
        const allIds = new Set(filteredEntities.map(e => e.id));
        setSelectedIds(allIds);
    }, [filteredEntities]);

    const clearSelection = useCallback(() => {
        setSelectedIds(new Set());
    }, []);

    // Автозагрузка при монтировании и при изменении loadFn
    useEffect(() => {
        if (autoLoad) {
            load();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoLoad, loadFn]);

    return {
        entities,
        filteredEntities,
        loading,
        error,

        searchQuery,
        setSearchQuery,

        load,
        refresh,
        clearError,

        selectedIds,
        toggleSelect,
        selectAll,
        clearSelection,
    };
};
