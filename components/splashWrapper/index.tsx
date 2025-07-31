"use client";

import { Suspense, useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen"; 

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

//   const [showSplash, setShowSplash] = useState(true);

//   useEffect(() => {
//     const alreadyShown = sessionStorage.getItem("splashShown");
//     if (alreadyShown) {
//       setShowSplash(false);
//     } else {
//       const timer = setTimeout(() => {
//         sessionStorage.setItem("splashShown", "true");
//         setShowSplash(false);
//       }, 2000); // splash duration
//       return () => clearTimeout(timer);
//     }
//   }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={<SplashScreen />}>
      {loading ? <SplashScreen /> : children }
    </Suspense>
  );

//   return <>{showSplash ? <SplashScreen /> : children}</>;
}


//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoading(false), 3000);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Suspense fallback={<SplashScreen />}>
//       {loading ? <SplashScreen /> : <RedirectByRole loading={loading} />}
//     </Suspense>
//   );