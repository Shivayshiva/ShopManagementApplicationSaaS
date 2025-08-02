import { useMutation } from '@tanstack/react-query';

interface PatchSelectSplashScreenArgs {
  shopId: string;
  splashScreenId: string;
}

async function patchSelectSplashScreen({ shopId, splashScreenId }: PatchSelectSplashScreenArgs) {
    console.log("SS_QQ_EE__TT_YY_HN", { shopId, splashScreenId });

  const res = await fetch(`/api/superAdmin/shop/${shopId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ splashScreenId }),
  });

    console.log("SS_QQ_EE__TT_YSS_QQ_EE__TT_YY_HNY_HN_RES", res);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update splash screen');
  }
  return res.json();
}

export function usePatchSelectSplashScreen() {
  return useMutation({
    mutationFn: patchSelectSplashScreen,
  });
}
