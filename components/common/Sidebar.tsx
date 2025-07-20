import { BarChart3, FileText, Package, Receipt, Settings, Store, TrendingDown, Users, X, TestTube, PersonStanding } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Add prop types for Sidebar
interface SidebarProps {
  sidebarOpen: boolean;
  handleSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, handleSidebarOpen }: SidebarProps) => {
    const pathname = usePathname();

    const navigation = [
        { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
        { name: "Products", href: "/dashboard/products", icon: Package },
        { name: "Shop Display", href: "/dashboard/shop", icon: Store },
        { name: "Billing", href: "/dashboard/billing", icon: Receipt },
        { name: "Customers", href: "/dashboard/customers", icon: Users },
        { name: "Expenses", href: "/dashboard/expenses", icon: TrendingDown },
        // { name: "Reports", href: "/dashboard/reports", icon: FileText },
        // { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Staff", href: "/dashboard/staff-managment", icon: PersonStanding },
      ];
  return(
    <>
    {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => handleSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-primary" />
            {/* <span className="text-xl font-bold">Vaishno Vastralaya</span> */}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => handleSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                onClick={() => handleSidebarOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      </>
  )
  
}

export default Sidebar