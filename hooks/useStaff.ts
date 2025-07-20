import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi, type Staff } from '@/lib/api-client';
import { toast } from 'sonner';

// Query keys for staff
export const staffKeys = {
  all: ['staff'] as const,
  lists: () => [...staffKeys.all, 'list'] as const,
  list: (params?: Parameters<typeof staffApi.getAll>[0]) => [...staffKeys.lists(), params] as const,
  details: () => [...staffKeys.all, 'detail'] as const,
  detail: (id: string) => [...staffKeys.details(), id] as const,
};

// Hook to get all staff members
export function useStaff(params?: Parameters<typeof staffApi.getAll>[0]) {
  return useQuery({
    queryKey: staffKeys.list(params),
    queryFn: () => staffApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to get a single staff member by ID
export function useStaffById(id: string) {
  return useQuery({
    queryKey: staffKeys.detail(id),
    queryFn: () => staffApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to create a new staff member
export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.create,
    onSuccess: (data) => {
      // Invalidate and refetch staff lists
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      
      toast.success(data.message || 'Staff member created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create staff member');
    },
  });
}

// Hook to update a staff member
export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof staffApi.update>[1] }) =>
      staffApi.update(id, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch staff lists and the specific staff member
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(variables.id) });
      
      toast.success(data.message || 'Staff member updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update staff member');
    },
  });
}

// Hook to delete a staff member
export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: staffApi.delete,
    onSuccess: (data, deletedId) => {
      // Invalidate and refetch staff lists
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      
      // Remove the deleted staff member from cache
      queryClient.removeQueries({ queryKey: staffKeys.detail(deletedId) });
      
      toast.success(data.message || 'Staff member deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete staff member');
    },
  });
}

// Hook to patch staff attendance
export function usePatchStaffAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { date: string; clockingTime: string; status: string } }) =>
      staffApi.patchAttendance(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: staffKeys.lists() });
      queryClient.invalidateQueries({ queryKey: staffKeys.detail(variables.id) });
      toast.success(data.message || 'Attendance updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update attendance');
    },
  });
} 