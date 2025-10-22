"use client";

import React from "react";
import Providers from "@/lib/Providers";
import SidebarComponent from "@/components/sidebarComponents/tenants.sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function TenantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen bg-background flex w-full overflow-x-hidden">
        <SidebarProvider>
          <SidebarComponent />
          <div className="flex-1 w-full flex flex-col">
            <main className="p-4 sm:p-6 max-w-[80vw] transition-all duration-200">
              <SidebarTrigger />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </Providers>
  );
}
