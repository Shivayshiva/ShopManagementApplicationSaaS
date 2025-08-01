import { useMutation } from '@tanstack/react-query';

export async function createSplashScreen(id: string, data: any) {
  const res = await fetch(`/api/superAdmin/splashScreen/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create splash screen');
  }
  return res.json();
}

export function useCreateSplashScreen() {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => createSplashScreen(id, data),
  });
}
