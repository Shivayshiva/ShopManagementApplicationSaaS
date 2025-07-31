"use client"

import {
  Receipt,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { staffMenuItems } from "@/constants/common/staff.common"

// const menuItems = [
//   {
//     title: "Dashboard",
//     url: "/",
//     icon: Home,
//   },
//   {
//     title: "Sales & Billing",
//     url: "/sales",
//     icon: CreditCard,
//   },
//   {
//     title: "Inventory",
//     url: "/inventory",
//     icon: Package,
//   },
//   {
//     title: "Orders",
//     url: "/orders",
//     icon: ShoppingCart,
//     badge: "3",
//   },
//   {
//     title: "Customers",
//     url: "/customers",
//     icon: Users,
//   },
//   {
//     title: "Expenses",
//     url: "/expenses",
//     icon: Wallet,
//   },
//   {
//     title: "Reports",
//     url: "/reports",
//     icon: BarChart3,
//   },
//   {
//     title: "Attendance",
//     url: "/attendance",
//     icon: Clock,
//   },
//   {
//     title: "Notifications",
//     url: "/notifications",
//     icon: Bell,
//     badge: "5",
//   },
//   {
//     title: "Settings",
//     url: "/settings",
//     icon: Settings,
//   },
// ]

export function StaffSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Receipt className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">ShopManager</span>
            <span className="text-xs text-muted-foreground">Staff Portal</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {staffMenuItems?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-12">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">John Smith</span>
                <span className="text-xs text-muted-foreground">Staff Member</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
