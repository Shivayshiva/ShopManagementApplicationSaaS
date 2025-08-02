import { useQuery } from '@tanstack/react-query';

export async function fetchSplashScreensByIds(ids: string[]) {
  const res = await fetch('/api/superAdmin/splashScreen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to fetch splash screens');
  }
  return res.json();
}

export function useSplashScreensByIds(ids: string[], enabled = true) {
  return useQuery({
    queryKey: ['splashScreens', ids],
    queryFn: () => fetchSplashScreensByIds(ids),
    enabled: enabled && ids.length > 0,
  });
}
