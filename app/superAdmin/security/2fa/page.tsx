"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  MoreHorizontal,
  Shield,
  Smartphone,
  Key,
  Lock,
  Unlock,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Settings,
} from "lucide-react"

interface TwoFactorUser {
  id: number
  name: string
  email: string
  role: string
  shop: string
  twoFactorEnabled: boolean
  method: "app" | "sms" | "email"
  backupCodes: number
  lastUsed: string
  status: "active" | "disabled" | "locked"
}

interface TwoFactorSettings {
  enforceForAdmins: boolean
  enforceForShopOwners: boolean
  enforceForAllUsers: boolean
  allowedMethods: string[]
  backupCodesCount: number
  sessionTimeout: number
  maxFailedAttempts: number
}

export default function TwoFactorAuthPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<TwoFactorUser | null>(null)
  const [settingsDialog, setSettingsDialog] = useState(false)

  const [users, setUsers] = useState<TwoFactorUser[]>([
    {
      id: 1,
      name: "John Admin",
      email: "john@admin.com",
      role: "Super Admin",
      shop: "System",
      twoFactorEnabled: true,
      method: "app",
      backupCodes: 8,
      lastUsed: "2024-01-20",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Manager",
      email: "sarah@manager.com",
      role: "Shop Manager",
      shop: "TechStore Pro",
      twoFactorEnabled: true,
      method: "sms",
      backupCodes: 10,
      lastUsed: "2024-01-19",
      status: "active",
    },
    {
      id: 3,
      name: "Mike Owner",
      email: "mike@shop.com",
      role: "Owner",
      shop: "Fashion Hub",
      twoFactorEnabled: false,
      method: "app",
      backupCodes: 0,
      lastUsed: "Never",
      status: "disabled",
    },
    {
      id: 4,
      name: "Lisa Support",
      email: "lisa@support.com",
      role: "Support Agent",
      shop: "System",
      twoFactorEnabled: true,
      method: "email",
      backupCodes: 5,
      lastUsed: "2024-01-18",
      status: "locked",
    },
  ])

  const [settings, setSettings] = useState<TwoFactorSettings>({
    enforceForAdmins: true,
    enforceForShopOwners: false,
    enforceForAllUsers: false,
    allowedMethods: ["app", "sms", "email"],
    backupCodesCount: 10,
    sessionTimeout: 30,
    maxFailedAttempts: 3,
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.shop.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleToggle2FA = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              twoFactorEnabled: !user.twoFactorEnabled,
              status: !user.twoFactorEnabled ? "active" : "disabled",
            }
          : user,
      ),
    )

    const user = users.find((u) => u.id === userId)
    toast({
      title: `2FA ${user?.twoFactorEnabled ? "Disabled" : "Enabled"}`,
      description: `Two-factor authentication has been ${user?.twoFactorEnabled ? "disabled" : "enabled"} for ${user?.name}.`,
    })
  }

  const handleUserAction = (userId: number, action: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    switch (action) {
      case "view":
        setSelectedUser(user)
        break
      case "reset":
        toast({
          title: "2FA Reset",
          description: `Two-factor authentication has been reset for ${user.name}.`,
        })
        break
      case "unlock":
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: "active" } : u)))
        toast({
          title: "Account Unlocked",
          description: `${user.name}'s account has been unlocked.`,
        })
        break
      case "generate-backup":
        setUsers(users.map((u) => (u.id === userId ? { ...u, backupCodes: 10 } : u)))
        toast({
          title: "Backup Codes Generated",
          description: `New backup codes generated for ${user.name}.`,
        })
        break
    }
  }

  const handleSettingsUpdate = () => {
    setSettingsDialog(false)
    toast({
      title: "Settings Updated",
      description: "Two-factor authentication settings have been updated.",
    })
  }

  const handleBulkAction = (action: string) => {
    switch (action) {
      case "enforce-all":
        setUsers(users.map((user) => ({ ...user, twoFactorEnabled: true, status: "active" })))
        toast({
          title: "2FA Enforced",
          description: "Two-factor authentication has been enabled for all users.",
        })
        break
      case "reset-all":
        toast({
          title: "Bulk Reset",
          description: "Two-factor authentication has been reset for all users.",
        })
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "disabled":
        return "secondary"
      case "locked":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "app":
        return Smartphone
      case "sms":
        return Smartphone
      case "email":
        return Key
      default:
        return Key
    }
  }

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: `${users.filter((u) => u.twoFactorEnabled).length} with 2FA`,
      icon: Shield,
    },
    {
      title: "2FA Enabled",
      value: users.filter((u) => u.twoFactorEnabled).length.toString(),
      change: `${Math.round((users.filter((u) => u.twoFactorEnabled).length / users.length) * 100)}% adoption`,
      icon: CheckCircle,
    },
    {
      title: "Locked Accounts",
      value: users.filter((u) => u.status === "locked").length.toString(),
      change: "Failed attempts",
      icon: Lock,
    },
    {
      title: "App Method",
      value: users.filter((u) => u.method === "app").length.toString(),
      change: "Most secure",
      icon: Smartphone,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Two-Factor Authentication</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setSettingsDialog(true)}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Shield className="mr-2 h-4 w-4" />
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleBulkAction("enforce-all")}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Enforce for All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleBulkAction("reset-all")}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Find users and manage their 2FA settings</CardDescription>
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
                <SelectItem value="disabled">Disabled</SelectItem>
                <SelectItem value="locked">Locked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users with 2FA ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage two-factor authentication for all users</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>2FA Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Backup Codes</TableHead>
                <TableHead>Last Used</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => {
                const MethodIcon = getMethodIcon(user.method)
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.shop}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusColor(user.status) as any}>
                          {user.twoFactorEnabled ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <AlertTriangle className="mr-1 h-3 w-3" />
                          )}
                          {user.status}
                        </Badge>
                        <Switch
                          checked={user.twoFactorEnabled}
                          onCheckedChange={() => handleToggle2FA(user.id)}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MethodIcon className="h-4 w-4" />
                        <span className="capitalize">{user.method}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.backupCodes} remaining</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.lastUsed}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "view")}>
                            <Shield className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "reset")}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Reset 2FA
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserAction(user.id, "generate-backup")}>
                            <Key className="mr-2 h-4 w-4" />
                            Generate Backup Codes
                          </DropdownMenuItem>
                          {user.status === "locked" && (
                            <DropdownMenuItem onClick={() => handleUserAction(user.id, "unlock")}>
                              <Unlock className="mr-2 h-4 w-4" />
                              Unlock Account
                            </DropdownMenuItem>
                          )}
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
            <DialogTitle>2FA Details</DialogTitle>
            <DialogDescription>Two-factor authentication details for {selectedUser?.name}</DialogDescription>
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
                  <label className="text-sm font-medium">2FA Status</label>
                  <Badge variant={getStatusColor(selectedUser.status) as any}>{selectedUser.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Method</label>
                  <p className="text-sm text-muted-foreground capitalize">{selectedUser.method}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Backup Codes</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.backupCodes} remaining</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Last Used</label>
                  <p className="text-sm text-muted-foreground">{selectedUser.lastUsed}</p>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={() => handleUserAction(selectedUser.id, "reset")}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset 2FA
                </Button>
                <Button variant="outline" onClick={() => handleUserAction(selectedUser.id, "generate-backup")}>
                  <Key className="mr-2 h-4 w-4" />
                  Generate Backup Codes
                </Button>
                {selectedUser.status === "locked" && (
                  <Button variant="outline" onClick={() => handleUserAction(selectedUser.id, "unlock")}>
                    <Unlock className="mr-2 h-4 w-4" />
                    Unlock Account
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={settingsDialog} onOpenChange={setSettingsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>2FA Settings</DialogTitle>
            <DialogDescription>Configure two-factor authentication policies and settings.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enforce for Admins</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
                </div>
                <Switch
                  checked={settings.enforceForAdmins}
                  onCheckedChange={(checked) => setSettings({ ...settings, enforceForAdmins: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enforce for Shop Owners</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for shop owners</p>
                </div>
                <Switch
                  checked={settings.enforceForShopOwners}
                  onCheckedChange={(checked) => setSettings({ ...settings, enforceForShopOwners: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enforce for All Users</Label>
                  <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                </div>
                <Switch
                  checked={settings.enforceForAllUsers}
                  onCheckedChange={(checked) => setSettings({ ...settings, enforceForAllUsers: checked })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Backup Codes Count</Label>
                <Input
                  type="number"
                  value={settings.backupCodesCount}
                  onChange={(e) => setSettings({ ...settings, backupCodesCount: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label>Max Failed Attempts</Label>
                <Input
                  type="number"
                  value={settings.maxFailedAttempts}
                  onChange={(e) => setSettings({ ...settings, maxFailedAttempts: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSettingsUpdate}>Save Settings</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
