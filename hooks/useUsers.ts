import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

// User interface based on the API requirements
export interface CreateUserData {
  gstNumber: string;
  email: string;
  name: string;
  mobileNumber: string;
  role: 'admin' | 'manager' | 'staff' | 'cashier';
  shopId: string;
  superAdminId: string;
  // Document information
  panCardNumber: string;
  aadharCardNumber: string;
  panCardImage: string;
  aadharCardFrontImage: string;
  aadharCardBackImage: string;
  profileImage?: string;
}

// API function to create user
const createUser = async (userData: CreateUserData) => {
  const response = await fetch('/api/superAdmin/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to create user');
  }

  return data;
};

// Query keys for users
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

// Hook to create a new user
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      
      toast.success(data.message || 'User created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create user');
    },
  });
} 