import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '@/lib/api-client';

export function useInvoices(params?: { page?: number; limit?: number; search?: string }) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['invoices', params],
    queryFn: () => getInvoices(params),
  });

  return {
    invoices: data?.data || [],
    loading: isLoading,
    error: error as Error | null,
    refetch,
    pagination: data?.pagination,
  };
} 