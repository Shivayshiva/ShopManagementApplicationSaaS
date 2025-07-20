import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCustomers } from '@/lib/features/customerSlice';
import type { Customer } from '@/lib/features/customerSlice';
import { customerApi } from '@/lib/api-client';

interface UseCustomersReturn {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCustomers(): UseCustomersReturn {
  const [customers, setCustomersState] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await customerApi.getAll();

      // Transform database customers to match Redux Customer interface
      const transformedCustomers: Customer[] = result.data.map((dbCustomer: any) => ({
        id: dbCustomer._id,
        customerName: dbCustomer.name,
        customerMobile: dbCustomer.phone,
        customerDate: dbCustomer.createdAt,
        customerAddress: `${dbCustomer.address.street}, ${dbCustomer.address.city}, ${dbCustomer.address.state} ${dbCustomer.address.zipCode}`,
        customerStatus: dbCustomer.isActive ? 'paid' : 'unpaid',
        createdAt: dbCustomer.createdAt,
        updatedAt: dbCustomer.updatedAt,
        // Additional fields for compatibility
        name: dbCustomer.name,
        email: dbCustomer.email,
        phone: dbCustomer.phone,
        totalOrders: 0, // This would need to be calculated from invoices
        totalSpent: dbCustomer.totalPurchases || 0,
        status: dbCustomer.isActive ? 'active' : 'inactive',
        joinDate: dbCustomer.createdAt,
        lastOrder: dbCustomer.lastPurchaseDate || null,
      }));

      setCustomersState(transformedCustomers);
      dispatch(setCustomers(transformedCustomers));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customers';
      setError(errorMessage);
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
  };
} 