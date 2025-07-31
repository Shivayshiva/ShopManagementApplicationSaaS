import type React from "react"
import "@/styles/globals.css" 
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { StaffSidebar } from "@/components/sidebarComponents/staff.sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider defaultOpen={true}>
          <StaffSidebar />
          <main className="flex-1">{children}</main>
          <Toaster />
        </SidebarProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
