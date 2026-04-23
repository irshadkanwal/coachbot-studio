import { useCallback, useEffect, useRef, useState } from 'react';

export interface PaginationState {
  hasMore: boolean;
  page: number;
  limit: number;
  isLoading: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  hasMore: boolean;
  page: number;
  limit: number;
}

export interface UsePaginationOptions<T> {
  initialData: T[];
  initialResponse: PaginationResponse<T>;
  onLoadMore: (page: number, limit: number) => Promise<PaginationResponse<T>>;
  onSearch?: (query: string, page: number, limit: number) => Promise<PaginationResponse<T>>;
}

export interface UsePaginationReturn<T> {
  data: T[];
  pagination: PaginationState;
  loadMore: () => Promise<void>;
  search: (query: string) => Promise<void>;
  reset: () => void;
  setData: (data: T[]) => void;
}

export function usePagination<T>({
  initialData,
  initialResponse,
  onLoadMore,
  onSearch,
}: UsePaginationOptions<T>): UsePaginationReturn<T> {
  const initialDataRef = useRef(initialData);
  const initialResponseRef = useRef(initialResponse);

  useEffect(() => {
    initialDataRef.current = initialData;
    initialResponseRef.current = initialResponse;
  }, [initialData, initialResponse]);

  const [data, setData] = useState<T[]>(initialData);
  const [pagination, setPagination] = useState<PaginationState>({
    hasMore: initialResponse.hasMore,
    page: initialResponse.page,
    limit: initialResponse.limit,
    isLoading: false,
  });

  const loadMore = useCallback(async () => {
    if (!pagination.hasMore || pagination.isLoading) return;

    setPagination((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await onLoadMore(pagination.page + 1, pagination.limit);

      setData((prev) => [...prev, ...response.data]);
      setPagination({
        hasMore: response.hasMore,
        page: response.page,
        limit: response.limit,
        isLoading: false,
      });
    } catch (error) {
      setPagination((prev) => ({ ...prev, isLoading: false }));
      console.error('Error loading more data:', error);
    }
  }, [pagination.hasMore, pagination.page, pagination.limit, pagination.isLoading, onLoadMore]);

  const search = useCallback(
    async (query: string) => {
      if (!onSearch) return;

      setPagination((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await onSearch(query, 1, pagination.limit);

        setData(response.data);
        setPagination({
          hasMore: response.hasMore,
          page: response.page,
          limit: response.limit,
          isLoading: false,
        });
      } catch (error) {
        setPagination((prev) => ({ ...prev, isLoading: false }));
        console.error('Error searching data:', error);
      }
    },
    [onSearch, pagination.limit]
  );

  const reset = useCallback(() => {
    setData(initialDataRef.current);
    setPagination({
      hasMore: initialResponseRef.current.hasMore,
      page: initialResponseRef.current.page,
      limit: initialResponseRef.current.limit,
      isLoading: false,
    });
  }, []);

  return {
    data,
    pagination,
    loadMore,
    search,
    reset,
    setData,
  };
}
