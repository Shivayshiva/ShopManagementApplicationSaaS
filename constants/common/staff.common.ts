import {
  BarChart3,
  Bell,
  Clock,
  CreditCard,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react"
import { staffRoutes } from "../route.constants.ts/routes.staff"

export const staffMenuItems = [
  {
    title: "Dashboard",
    url: staffRoutes.dashboard,
    icon: Home,
  },
  {
    title: "Sales & Billing",
    url: staffRoutes.sales,
    icon: CreditCard,
  },
  {
    title: "Inventory",
    url: staffRoutes.inventory,
    icon: Package,
  },
  {
    title: "Orders",
    url: staffRoutes.orders,
    icon: ShoppingCart,
    badge: "3",
  },
  {
    title: "Customers",
    url: staffRoutes.customers,
    icon: Users,
  },
  {
    title: "Expenses",
    url: staffRoutes.expenses,
    icon: Wallet,
  },
  {
    title: "Reports",
    url: staffRoutes.reports,
    icon: BarChart3,
  },
  {
    title: "Attendance",
    url: staffRoutes.attendance,
    icon: Clock,
  },
  {
    title: "Notifications",
    url: staffRoutes.notifications,
    icon: Bell,
    badge: "5",
  },
  {
    title: "Settings",
    url: staffRoutes.settings,
    icon: Settings,
  },
]