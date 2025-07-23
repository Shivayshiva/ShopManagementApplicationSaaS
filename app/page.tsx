"use client";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import SplashScreen from "@/components/SplashScreen";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading) {
      redirect("/dashboard");
    }
  }, [loading]);

  return loading ? <SplashScreen /> : null;
}
