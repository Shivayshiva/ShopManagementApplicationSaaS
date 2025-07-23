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

function MainWithSidebarResponsive({ children }: { children: React.ReactNode }) {
  const { isMobile, state } = useSidebar();
  // Sidebar widths from sidebar.tsx
  const SIDEBAR_WIDTH = "16rem";
  const SIDEBAR_WIDTH_ICON = "3rem";
  // Only apply margin on desktop
  const marginLeft = isMobile ? undefined : state === "expanded" ? SIDEBAR_WIDTH : SIDEBAR_WIDTH_ICON;
  return (
    <main
      className={`p-4 sm:p-6 ${isMobile ? "max-w-[90vw]" :"max-w-[80vw]" }  transition-all duration-200`}
      // style={marginLeft ? { marginLeft } : undefined}
    >
      <Suspense>
        <Providers>
          <SidebarTrigger />
          {children}
        </Providers>
      </Suspense>
    </main>
  );
}

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
    <div className="min-h-screen bg-background flex w-full overflow-x-hidden">
      <SidebarProvider>
        <SidebarComponent />
        <div className="flex-1 w-full flex flex-col">
          <MainWithSidebarResponsive>{children}</MainWithSidebarResponsive>
        </div>
      </SidebarProvider>



    </div>
  );
}
