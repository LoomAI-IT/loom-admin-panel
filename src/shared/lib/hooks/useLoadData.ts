import { useState, useEffect, useCallback } from 'react';

interface UseLoadDataOptions<T> {
  loadFn: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export const useLoadData = <T>({
  loadFn,
  onSuccess,
  onError,
  immediate = true,
}: UseLoadDataOptions<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await loadFn();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadFn, onSuccess, onError]);

  useEffect(() => {
    if (immediate) {
      load();
    }
  }, [immediate, load]);

  return { data, loading, error, reload: load };
};
