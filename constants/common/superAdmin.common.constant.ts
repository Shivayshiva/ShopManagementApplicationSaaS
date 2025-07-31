import {
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Shield,
  Package,
  Settings,
  HeadphonesIcon,
  Activity,
  Flag,
  Database,
  DollarSign,
  FileText,
  Server,
  Home,
  Eye,
  UserCheck,
  AlertTriangle,
  TrendingUp,
  Mail,
  Lock,
  Globe,
  Download,
  MessageCircleMore,
  MailCheck,
  MessageSquareText,
} from "lucide-react";

import { superAdminRoutes } from "../route.constants.ts/routes.superAdmin";

export const superAdminMenuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: superAdminRoutes.dashboard,
  },
  {
    title: "Shop Management",
    icon: Building2,
    items: [
      { title: "All Shops", url: superAdminRoutes.shops, icon: Eye },
      {
        title: "Pending Approvals",
        url: superAdminRoutes.shops + "/pending",
        icon: UserCheck,
      },
      {
        title: "Shop Analytics",
        url: superAdminRoutes.shops + "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "User Management",
    icon: Users,
    items: [
      { title: "All Users", url: superAdminRoutes.users, icon: Users },
      {
        title: "Suspended Users",
        url: superAdminRoutes.users + "/suspended",
        icon: AlertTriangle,
      },
      {
        title: "User Analytics",
        url: superAdminRoutes.users + "/analytics",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Subscriptions",
    icon: CreditCard,
    items: [
      {
        title: "Plans",
        url: superAdminRoutes.settings + "/plans",
        icon: CreditCard,
      },
      {
        title: "Billing",
        url: superAdminRoutes.settings + "/billing",
        icon: DollarSign,
      },
      {
        title: "Payment History",
        url: superAdminRoutes.settings + "/payments",
        icon: FileText,
      },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    items: [
      {
        title: "Admin Roles",
        url: superAdminRoutes.settings + "/roles",
        icon: Shield,
      },
      {
        title: "2FA Settings",
        url: superAdminRoutes.settings + "/2fa",
        icon: Lock,
      },
      {
        title: "Login History",
        url: superAdminRoutes.settings + "/logs",
        icon: Activity,
      },
    ],
  },
  {
    title: "Products",
    icon: Package,
    items: [
      {
        title: "Global Catalog",
        url: superAdminRoutes.products,
        icon: Package,
      },
      { title: "Categories", url: superAdminRoutes.categories, icon: FileText },
      {
        title: "Performance",
        url: superAdminRoutes.products + "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      {
        title: "Revenue",
        url: superAdminRoutes.analytics + "/revenue",
        icon: DollarSign,
      },
      {
        title: "Customer Trends",
        url: superAdminRoutes.analytics + "/customers",
        icon: Users,
      },
      {
        title: "Reports",
        url: superAdminRoutes.analytics + "/reports",
        icon: Download,
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      {
        title: "Global Settings",
        url: superAdminRoutes.settings + "/global",
        icon: Globe,
      },
      {
        title: "Email Templates",
        url: superAdminRoutes.settings + "/email",
        icon: Mail,
      },
      {
        title: "Notifications",
        url: superAdminRoutes.settings + "/notifications",
        icon: AlertTriangle,
      },
    ],
  },
  {
    title: "Support",
    icon: HeadphonesIcon,
    items: [
      {
        title: "Tickets",
        url: superAdminRoutes.support + "/tickets",
        icon: HeadphonesIcon,
      },
      { title: "Chat", url: superAdminRoutes.support + "/chat", icon: Mail },
      {
        title: "Knowledge Base",
        url: superAdminRoutes.support + "/kb",
        icon: FileText,
      },
    ],
  },
  {
    title: "Chat",
    icon: MessageCircleMore,
    items: [
      {
        title: "Real-Time Chat",
        url: superAdminRoutes.realTimeChat ,
        icon: MessageSquareText,
      },
      {
        title: "Email Support",
        url: superAdminRoutes.status,
        icon: MailCheck,
      },
    ],
  },
  {
    title: "System",
    icon: Server,
    items: [
      {
        title: "Activity Logs",
        url: superAdminRoutes.system + "/logs",
        icon: Activity,
      },
      {
        title: "Feature Flags",
        url: superAdminRoutes.system + "/features",
        icon: Flag,
      },
      {
        title: "Data Management",
        url: superAdminRoutes.system + "/data",
        icon: Database,
      },
      {
        title: "Status",
        url: superAdminRoutes.system + "/status",
        icon: Server,
      },
    ],
  },
];