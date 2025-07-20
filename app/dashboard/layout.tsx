"use client";
import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import Providers from "@/lib/Providers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GlobalLoader from "@/components/common/GlobalLoader";
import Sidebar from "@/components/common/Sidebar";
import HeaderSection from "@/components/common/Header";

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
      <Sidebar
        sidebarOpen={sidebarOpen}
        // handleSidebarOpen={handleSidebarOpen}
      />

      <div className="flex-1 w-full flex flex-col">
        {/* <HeaderSection handleSidebarOpen={handleSidebarOpen} /> */}
        <main className="p-4 sm:p-6 max-w-[80vw]">
          <Suspense>
            <Providers>
              {/* <div className="flex-1 space-y-4 w-full py-2 bg-gray-200 transition-all duration-200 ease-in-out peer-data-[state=expanded]:ml-[16rem] peer-data-[state=collapsed]:ml-0 overflow-x-hidden"> */}
                {/* <div
                  className={`${
                    sidebarOpen
                      ? `xl:max-w-[78vw] lg:max-w-[78vw] md:max-w-[78vw]`
                      : `lg:max-w-full md:max-w-[90vw]`
                  } bg-white min-h-screen rounded-2xl mx-auto overflow-x-hidden`}
                > */}
                  {children}
                {/* </div> */}
              {/* </div> */}
            </Providers>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
