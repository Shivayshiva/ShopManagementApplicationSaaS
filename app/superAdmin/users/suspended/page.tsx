"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  MoreHorizontal,
  UserCheck,
  Ban,
  Eye,
  MessageSquare,
  AlertTriangle,
  Shield,
  User,
  Crown,
} from "lucide-react"
const users = [
  {
    id: 1,
    name: "Amit Singh",
    email: "amit@shopwave.com",
    role: "Owner",
    status: "suspended",
    shop: "Tech Bazaar",
    joinDate: "2024-12-01",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@fashionloop.com",
    role: "Manager",
    status: "suspended",
    shop: "Fashion Loop",
    joinDate: "2024-11-21",
  },
  {
    id: 3,
    name: "Ravi Verma",
    email: "ravi@megastore.com",
    role: "Staff",
    status: "active",
    shop: "Mega Store",
    joinDate: "2024-10-13",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    email: "sneha@dailyneeds.com",
    role: "Manager",
    status: "suspended",
    shop: "Daily Needs",
    joinDate: "2025-01-10",
  },
  {
    id: 5,
    name: "Arjun Patel",
    email: "arjun@freshmart.com",
    role: "Owner",
    status: "active",
    shop: "Fresh Mart",
    joinDate: "2023-09-05",
  },
  {
    id: 6,
    name: "Kiran Mehta",
    email: "kiran@hitech.com",
    role: "Staff",
    status: "suspended",
    shop: "HiTech Plaza",
    joinDate: "2025-02-14",
  },
  {
    id: 7,
    name: "Neha Gupta",
    email: "neha@bazaar.in",
    role: "Manager",
    status: "active",
    shop: "City Bazaar",
    joinDate: "2023-12-19",
  },
  {
    id: 8,
    name: "Suresh Kumar",
    email: "suresh@mobizone.com",
    role: "Owner",
    status: "active",
    shop: "MobiZone",
    joinDate: "2022-08-08",
  },
  {
    id: 9,
    name: "Divya Rao",
    email: "divya@bookbarn.com",
    role: "Staff",
    status: "suspended",
    shop: "Book Barn",
    joinDate: "2024-07-17",
  },
  {
    id: 10,
    name: "Manoj Yadav",
    email: "manoj@foodmart.com",
    role: "Staff",
    status: "active",
    shop: "Food Mart",
    joinDate: "2024-05-23",
  },
]



export default function SuspendedUsersPage() {
  // const { users, updateUser } = useStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [reactivateDialog, setReactivateDialog] = useState<any>(null)
  const [reactivateReason, setReactivateReason] = useState("")

  const suspendedUsers = useMemo(() => {
    return users
      .filter((user) => user.status === "suspended")
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.shop?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
      )
  }, [users, searchTerm])

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

  const handleReactivateUser = (userId: number, reason?: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    // updateUser(userId, { status: "active" })
    toast({
      title: "User Reactivated",
      description: `${user.name} has been reactivated successfully.`,
    })
    setReactivateDialog(null)
    setReactivateReason("")
  }

  const handleBulkReactivate = () => {
    suspendedUsers.forEach((user) => {
      // updateUser(user.id, { status: "active" })
    })
    toast({
      title: "Bulk Reactivation Complete",
      description: `${suspendedUsers.length} users have been reactivated.`,
    })
  }

  const handleSendMessage = (user: any) => {
    toast({
      title: "Message Sent",
      description: `Message sent to ${user.name} regarding their suspension.`,
    })
  }

  const stats = [
    {
      title: "Suspended Users",
      value: suspendedUsers.length.toString(),
      change: "-2 this week",
      icon: Ban,
    },
    {
      title: "Avg Suspension Time",
      value: "5.2 days",
      change: "+1.2 days",
      icon: AlertTriangle,
    },
    {
      title: "Reactivation Rate",
      value: "78%",
      change: "+5% this month",
      icon: UserCheck,
    },
    {
      title: "Permanent Bans",
      value: "3",
      change: "This month",
      icon: Ban,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Suspended Users</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleBulkReactivate} disabled={suspendedUsers.length === 0}>
            <UserCheck className="mr-2 h-4 w-4" />
            Reactivate All ({suspendedUsers.length})
          </Button>
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
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Suspended Users</CardTitle>
          <CardDescription>Find suspended users across all shops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search suspended users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Suspended Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Suspended Users ({suspendedUsers.length})</CardTitle>
          <CardDescription>Manage suspended user accounts</CardDescription>
        </CardHeader>
        <CardContent>
          {suspendedUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No suspended users</h3>
              <p className="mt-1 text-sm text-muted-foreground">All users are currently active.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Shop</TableHead>
                  <TableHead>Suspended Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suspendedUsers.map((user) => {
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
                      <TableCell>{user?.shop}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.joinDate}</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Policy Violation</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setReactivateDialog(user)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Reactivate User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendMessage(user)}>
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Suspended User Details</DialogTitle>
            <DialogDescription>Review suspension details for {selectedUser?.name}</DialogDescription>
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
                  <Badge variant="destructive">Suspended</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Suspended Date</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.joinDate}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Suspension Reason</label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm">Policy violation: Inappropriate content and spam behavior detected.</p>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={() => setReactivateDialog(selectedUser)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Reactivate User
                </Button>
                <Button variant="outline" onClick={() => handleSendMessage(selectedUser)}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reactivate Dialog */}
      <Dialog open={!!reactivateDialog} onOpenChange={() => setReactivateDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate User</DialogTitle>
            <DialogDescription>Reactivate {reactivateDialog?.name} and restore their account access?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Reason</label>
              <Textarea
                value={reactivateReason}
                onChange={(e) => setReactivateReason(e.target.value)}
                placeholder="Reason for reactivation (optional)"
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReactivateDialog(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleReactivateUser(reactivateDialog?.id, reactivateReason)}>
              <UserCheck className="mr-2 h-4 w-4" />
              Reactivate User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
