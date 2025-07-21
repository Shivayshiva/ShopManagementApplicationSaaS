"use client";
import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import Providers from "@/lib/Providers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GlobalLoader from "@/components/common/GlobalLoader";
import Sidebar from "@/components/common/Sidebar";
import HeaderSection from "@/components/common/Header";
import SidebarComponent from "@/components/common/Sidebar";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <GlobalLoader message="Loading dashboard..." />
      </div>
    );
  }

  // const handleSidebarOpen = (status: boolean) => {
  //   setSidebarOpen(status);
  // };

  return (
    <div className="min-h-screen bg-background flex">
      <SidebarProvider>
        <SidebarComponent
          // sidebarOpen={sidebarOpen}
          // handleSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 w-full flex flex-col">
          <main className="p-4 sm:p-6 min-w-[80vw]">
            <Suspense>
              <Providers>
                <SidebarTrigger />
                {children}
              </Providers>
            </Suspense>
          </main>
        </div>
      </SidebarProvider>



    </div>
  );
}
