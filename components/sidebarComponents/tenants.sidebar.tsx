import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { BarChart3, Package, Store, Receipt, Users, TrendingDown, PersonStanding, LogOut } from 'lucide-react';
import GlobalButton from '@/components/common/globalButton';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Products', href: '/dashboard/products', icon: Package },
  { name: 'Shop Display', href: '/dashboard/shop', icon: Store },
  { name: 'Billing', href: '/dashboard/billing', icon: Receipt },
  { name: 'Customers', href: '/dashboard/customers', icon: Users },
  { name: 'Expenses', href: '/dashboard/expenses', icon: TrendingDown },
  { name: 'Staff', href: '/dashboard/staff-managment', icon: PersonStanding },
];

const SidebarComponent = () => {
  const pathname = usePathname();
  const { isMobile, state, openMobile } = useSidebar();

  const showText = isMobile ? openMobile : state === "expanded";

  const router = useRouter();
  const handleLogout = () => {
    // Auth removed: navigate to login page. Re-integrate signOut when auth is added back.
    router.push('/auth/login');
  };

  return (
      <Sidebar className="flex flex-col h-screen justify-between overflow-hidden min-w-0 w-full max-w-xs sm:max-w-sm md:max-w-[16rem]" collapsible="icon">
        <div className="flex-1 flex flex-col overflow-hidden">
          <SidebarHeader>
            <div className="flex items-center space-x-2 p-2">
              <Store className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
              {showText && (
                <span className="font-bold text-base sm:text-lg">Shop Management</span>
              )}
            </div>
          </SidebarHeader>
          <SidebarContent className="overflow-y-auto ">
            <SidebarMenu className="pr-2 sm:pr-5">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name} className="pl-3 sm:pl-5 py-1">
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <a
                        className={`
                          flex items-center gap-2 sm:gap-3 border rounded-md transition-colors
                          ${pathname === item.href
                            ? 'border-primary bg-black text-white'
                            : 'border-transparent hover:border-primary/30 hover:bg-primary/5'}
                          ${showText ? 'px-2 justify-start' : 'px-0 justify-center'}
                          py-2 text-sm sm:text-base'
                        `}
                      >
                        <item.icon className="h-5 w-5" />
                        {showText && (
                          <span>{item.name}</span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </div>
        <SidebarFooter className="border-t border-sidebar-border px-2 py-2 sm:py-3">
          <GlobalButton
            onClick={handleLogout}
            text={showText ? "Sign Out" : ""}
            icon={<LogOut className="h-4 w-4" />}
            className="w-full flex items-center gap-2 cursor-pointer rounded-sm px-2 sm:px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors text-sm font-medium"
          />
        </SidebarFooter>
      </Sidebar>
  );
};

export default SidebarComponent;