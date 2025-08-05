"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  UserX,
  UserCheck,
  Mail,
  Download,
  Shield,
  User,
  Crown,
  Plus,
  MessageSquare,
  Ban,
} from "lucide-react"
import CreateUserModal from "./components/createUserModal"
import UserRegistrationModal from "./components/createUserModal"


  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@techstore.com",
      role: "Owner",
      shop: "TechStore Pro",
      status: "active",
      lastLogin: "2 hours ago",
      joinDate: "2024-01-15",
      orders: 45,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@techstore.com",
      role: "Manager",
      shop: "TechStore Pro",
      status: "active",
      lastLogin: "1 day ago",
      joinDate: "2024-01-16",
      orders: 23,
    },
    {
      id: 3,
      name: "Sarah Wilson",
      email: "sarah@fashionhub.com",
      role: "Owner",
      shop: "Fashion Hub",
      status: "pending",
      lastLogin: "3 days ago",
      joinDate: "2024-01-14",
      orders: 12,
    },
  ]

export default function UsersPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [shopFilter, setShopFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [messageDialog, setMessageDialog] = useState<any>(null)
  const [message, setMessage] = useState("");

    const [newUser, setNewUser] = useState({
      name: "",
      email: "",
      role: "Staff",
      shop: "",
      status: "active" as const,
      lastLogin: "Never",
      joinDate: new Date().toISOString().split("T")[0],
      orders: 0,
    })



  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.shop.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || user.status === statusFilter
      const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase()
      const matchesShop = shopFilter === "all" || user.shop === shopFilter

      return matchesSearch && matchesStatus && matchesRole && matchesShop
    })
  }, [users, searchTerm, statusFilter, roleFilter, shopFilter])

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Owner":
        return Crown
      case "Manager":
        return Shield
      default:
        return User
    }
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.shop) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    // addUser(newUser)
    setIsAddDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      role: "Staff",
      shop: "",
      status: "active",
      lastLogin: "Never",
      joinDate: new Date().toISOString().split("T")[0],
      orders: 0,
    })
    toast({
      title: "User Added",
      description: `${newUser.name} has been added successfully.`,
    })
  }

  const handleUserAction = (userId: number, action: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    switch (action) {
      case "suspend":
        // updateUser(userId, { status: "suspended" })
        toast({
          title: "User Suspended",
          description: `${user.name} has been suspended.`,
        })
        break
      case "reactivate":
        // updateUser(userId, { status: "active" })
        toast({
          title: "User Reactivated",
          description: `${user.name} has been reactivated.`,
        })
        break
      case "view":
        setSelectedUser(user)
        break
      case "message":
        setMessageDialog(user)
        break
      case "delete":
        // deleteUser(userId)
        toast({
          title: "User Deleted",
          description: `${user.name} has been deleted.`,
          variant: "destructive",
        })
        break
    }
  }

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Message Sent",
      description: `Message sent to ${messageDialog.name} successfully.`,
    })
    setMessageDialog(null)
    setMessage("")
  }

  const handleExport = () => {
    const csvContent = [
      ["Name", "Email", "Role", "Shop", "Status", "Orders", "Last Login", "Join Date"],
      ...filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role,
        user.shop,
        user.status,
        user.orders,
        user.lastLogin,
        user.joinDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Users data has been exported to CSV.",
    })
  }

  const handleBulkNotification = () => {
    toast({
      title: "Notification Sent",
      description: `Bulk notification sent to ${filteredUsers.length} users.`,
    })
  }

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+8%",
      changeType: "positive" as const,
      icon: User,
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      change: "+12%",
      changeType: "positive" as const,
      icon: UserCheck,
    },
    {
      title: "Suspended",
      value: users.filter((u) => u.status === "suspended").length.toString(),
      change: "+3%",
      changeType: "negative" as const,
      icon: UserX,
    },
    {
      title: "Shop Owners",
      value: users.filter((u) => u.role === "Owner").length.toString(),
      change: "+15%",
      changeType: "positive" as const,
      icon: Crown,
    },
  ]

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
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Users
          </Button>
          <Button variant="outline" onClick={handleBulkNotification}>
            <Mail className="mr-2 h-4 w-4" />
            Send Notification
          </Button>

        <UserRegistrationModal/>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search through all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
              </SelectContent>
            </Select>
            <Select value={shopFilter} onValueChange={setShopFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Shop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shops</SelectItem>
                {shops.map((shop) => (
                  <SelectItem key={shop.id} value={shop.name}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage all users across all shops</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role)
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${user.name.charAt(0)}`} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <RoleIcon className="h-4 w-4" />
                        <span>{user.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.shop}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : user.status === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.orders}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "message")}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleUserAction(user.id, user.status === "suspended" ? "reactivate" : "suspend")
                            }
                          >
                            {user.status === "suspended" ? (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Reactivate
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Detailed information about {selectedUser?.name}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Shop</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.shop}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={selectedUser.status === "active" ? "default" : "secondary"}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Orders</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.orders}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Login</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.lastLogin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Join Date</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.joinDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={!!messageDialog} onOpenChange={() => setMessageDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>Send a message to {messageDialog?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message..."
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
