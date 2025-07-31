import { useQuery } from '@tanstack/react-query';

export interface ShopQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export function useShops(params: ShopQueryParams = {}) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['shops', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      const res = await fetch(`/api/superAdmin/shop?${searchParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch shops');
      return res.json();
    },
    // keepPreviousData: true,
  });

  return {
    shops: data?.data || [],
    loading: isLoading,
    error: error as Error | null,
    refetch,
    pagination: data?.pagination,
  };
}
