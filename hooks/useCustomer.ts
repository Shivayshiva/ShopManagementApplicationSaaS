import { useState, useEffect } from 'react';
import type { Customer } from '@/lib/features/customerSlice';
import { customerApi } from '@/lib/api-client';

interface UseCustomerReturn {
  customer: Customer | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCustomer(customerId: string): UseCustomerReturn {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomer = async () => {
    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await customerApi.getById(customerId);

      // Transform database customer to match Redux Customer interface
      const dbCustomer = result.data;
      const transformedCustomer: Customer = {
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
      };

      setCustomer(transformedCustomer);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customer';
      setError(errorMessage);
      console.error('Error fetching customer:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  return {
    customer,
    loading,
    error,
    refetch: fetchCustomer,
  };
} 