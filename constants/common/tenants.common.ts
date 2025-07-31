import {
  BarChart3,
  Package,
  PersonStanding,
  Receipt,
  Settings,
  Store,
  TrendingDown,
  Users,
} from "lucide-react";
import { tenantsRoutes } from "../route.constants.ts/routes.tenants";

export const tenantMenuItems = [
  { name: "Dashboard", href: tenantsRoutes.dashboard, icon: BarChart3 },
  { name: "Products", href: tenantsRoutes.products, icon: Package },
  { name: "Shop Display", href: tenantsRoutes.shop, icon: Store },
  { name: "Billing", href: tenantsRoutes.billing, icon: Receipt },
  { name: "Customers", href: tenantsRoutes.customers, icon: Users },
  { name: "Expenses", href: tenantsRoutes.expenses, icon: TrendingDown },
  { name: "Staff", href: tenantsRoutes.staff, icon: PersonStanding },
  { name: "Settings", href: tenantsRoutes.settings, icon: Settings },
];
