import { useQuery } from '@tanstack/react-query';
import { getInvoiceById, getInvoices } from '@/lib/api-client';

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

// Make sure this function exists and fetches invoice by ID

export function useInvoiceById(id?: string) {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoiceById(id || ""),
    enabled: !!id, // only runs the query if `id` is defined
  });

  return {
    invoice: data || null,
    loading: isLoading,
    error: error as Error | null,
    refetch,
  };
}
