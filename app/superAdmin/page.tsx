"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useToast } from "@/hooks/use-toast"
// import { useStore } from "@/lib/store"
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const recentActivities = [
  {
    id: 1,
    action: "New shop registered",
    shop: "TechStore Pro",
    time: "2 minutes ago",
    type: "success",
  },
  {
    id: 2,
    action: "Payment failed",
    shop: "Fashion Hub",
    time: "15 minutes ago",
    type: "error",
  },
  {
    id: 3,
    action: "Plan upgraded",
    shop: "Home Essentials",
    time: "1 hour ago",
    type: "info",
  },
  {
    id: 4,
    action: "Shop suspended",
    shop: "Old Store",
    time: "2 hours ago",
    type: "warning",
  },
]

export default function SuperAdminDashboard() {
  // const { shops, users, updateShop } = useStore()
  const { toast } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedShop, setSelectedShop] = useState<any>(null)

  const stats = [
    {
      title: "Total Shops",
      value: 1000,
      change: "+12%",
      changeType: "positive" as const,
      icon: Building2,
    },
    {
      title: "Active Users",
      value:400,
      change: "+8%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Monthly Revenue",
      value: "$124,500",
      change: "+15%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Growth Rate",
      value: "23.5%",
      change: "-2%",
      changeType: "negative" as const,
      icon: TrendingUp,
    },
  ]

  const handleRefreshData = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Dashboard data has been updated successfully.",
    })
  }

  const handleShopAction = (shopId: number, action: string) => {
    // const shop = shops.find((s) => s.id === shopId)
    // if (!shop) return

    switch (action) {
      case "activate":
        // updateShop(shopId, { status: "active" })
        toast({
          title: "Shop Activated",
          description: `Shop has been activated successfully.`,
        })
        break
      case "deactivate":
        // updateShop(shopId, { status: "inactive" })
        toast({
          title: "Shop Deactivated",
          description: `Shop has been deactivated.`,
        })
        break
      case "impersonate":
        toast({
          title: "Impersonation Started",
          description: `You are now logged in as Shop. Use with caution.`,
        })
        break
      case "view":
        // setSelectedShop(shop)
        break
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "add-shop":
        toast({
          title: "Add Shop",
          description: "Redirecting to shop creation form...",
        })
        break
      case "manage-users":
        toast({
          title: "User Management",
          description: "Opening user management panel...",
        })
        break
      case "billing":
        toast({
          title: "Billing Overview",
          description: "Loading billing dashboard...",
        })
        break
      case "system-status":
        toast({
          title: "System Status",
          description: "All systems operational ✅",
        })
        break
    }
  }


  const shops = [
    {
      id: 1,
      name: "TechStore Pro",
      owner: "John Doe",
      email: "john@techstore.com",
      plan: "Premium",
      status: "active",
      created: "2024-01-15",
      revenue: "$2,450",
      users: 12,
      products: 156,
      lastLogin: "2 hours ago",
    },
    {
      id: 2,
      name: "Fashion Hub",
      owner: "Sarah Wilson",
      email: "sarah@fashionhub.com",
      plan: "Basic",
      status: "pending",
      created: "2024-01-14",
      revenue: "$890",
      users: 3,
      products: 45,
      lastLogin: "1 day ago",
    },
    {
      id: 3,
      name: "Home Essentials",
      owner: "Mike Johnson",
      email: "mike@homeessentials.com",
      plan: "Pro",
      status: "active",
      created: "2024-01-13",
      revenue: "$1,750",
      users: 8,
      products: 89,
      lastLogin: "30 minutes ago",
    },
    {
      id: 4,
      name: "Sports Central",
      owner: "Lisa Brown",
      email: "lisa@sportscentral.com",
      plan: "Premium",
      status: "inactive",
      created: "2024-01-12",
      revenue: "$3,200",
      users: 15,
      products: 234,
      lastLogin: "1 week ago",
    },
  ]
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">SuperAdmin Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefreshData} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => handleQuickAction("export")}>Export Data</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === "positive" ? "text-green-600" : "text-red-600"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Shops */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Shops</CardTitle>
            <CardDescription>Latest shop registrations and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shops.slice(0, 4).map((shop) => (
                  <TableRow key={shop.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${shop.name.charAt(0)}`} />
                          <AvatarFallback>{shop.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{shop.name}</div>
                          <div className="text-sm text-muted-foreground">{shop.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{shop.owner}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{shop.plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          shop.status === "active" ? "default" : shop.status === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {shop.status === "active" && <CheckCircle className="mr-1 h-3 w-3" />}
                        {shop.status === "pending" && <Activity className="mr-1 h-3 w-3" />}
                        {shop.status === "inactive" && <XCircle className="mr-1 h-3 w-3" />}
                        {shop.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{shop.revenue}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleShopAction(shop.id, "view")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShopAction(shop.id, "impersonate")}>
                            <Users className="mr-2 h-4 w-4" />
                            Impersonate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleShopAction(shop.id, shop.status === "active" ? "deactivate" : "activate")
                            }
                          >
                            <Activity className="mr-2 h-4 w-4" />
                            {shop.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest platform activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "error"
                          ? "bg-red-500"
                          : activity.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.shop}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 flex-col space-y-2" onClick={() => handleQuickAction("add-shop")}>
              <Building2 className="h-6 w-6" />
              <span>Add New Shop</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => handleQuickAction("manage-users")}
            >
              <Users className="h-6 w-6" />
              <span>Manage Users</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => handleQuickAction("billing")}
            >
              <DollarSign className="h-6 w-6" />
              <span>Billing Overview</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => handleQuickAction("system-status")}
            >
              <AlertTriangle className="h-6 w-6" />
              <span>System Status</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shop Details Modal */}
      <Dialog open={!!selectedShop} onOpenChange={() => setSelectedShop(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shop Details</DialogTitle>
            <DialogDescription>Detailed information about {selectedShop?.name}</DialogDescription>
          </DialogHeader>
          {selectedShop && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Shop Name</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Owner</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.owner}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Plan</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.plan}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={selectedShop.status === "active" ? "default" : "secondary"}>
                    {selectedShop.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Revenue</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.revenue}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Users</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.users}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Products</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.products}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
