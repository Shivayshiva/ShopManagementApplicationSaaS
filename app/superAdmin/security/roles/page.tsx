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
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Search, MoreHorizontal, Shield, Users, Plus, Edit, Trash2, Crown, Key, UserCheck } from "lucide-react"

interface AdminRole {
  id: number
  name: string
  description: string
  permissions: string[]
  userCount: number
  isActive: boolean
  created: string
  lastModified: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

const availablePermissions: Permission[] = [
  { id: "shops.view", name: "View Shops", description: "View shop information", category: "Shops" },
  { id: "shops.create", name: "Create Shops", description: "Create new shops", category: "Shops" },
  { id: "shops.edit", name: "Edit Shops", description: "Edit shop information", category: "Shops" },
  { id: "shops.delete", name: "Delete Shops", description: "Delete shops", category: "Shops" },
  { id: "shops.approve", name: "Approve Shops", description: "Approve pending shops", category: "Shops" },
  { id: "users.view", name: "View Users", description: "View user information", category: "Users" },
  { id: "users.create", name: "Create Users", description: "Create new users", category: "Users" },
  { id: "users.edit", name: "Edit Users", description: "Edit user information", category: "Users" },
  { id: "users.delete", name: "Delete Users", description: "Delete users", category: "Users" },
  { id: "users.suspend", name: "Suspend Users", description: "Suspend user accounts", category: "Users" },
  { id: "billing.view", name: "View Billing", description: "View billing information", category: "Billing" },
  { id: "billing.manage", name: "Manage Billing", description: "Manage billing and payments", category: "Billing" },
  { id: "analytics.view", name: "View Analytics", description: "View analytics and reports", category: "Analytics" },
  { id: "system.manage", name: "System Management", description: "Manage system settings", category: "System" },
  { id: "security.manage", name: "Security Management", description: "Manage security settings", category: "Security" },
]

export default function AdminRolesPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null)
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null)

  const [roles, setRoles] = useState<AdminRole[]>([
    {
      id: 1,
      name: "Super Admin",
      description: "Full system access with all permissions",
      permissions: availablePermissions.map((p) => p.id),
      userCount: 2,
      isActive: true,
      created: "2024-01-01",
      lastModified: "2024-01-15",
    },
    {
      id: 2,
      name: "Shop Manager",
      description: "Manage shops and users with limited access",
      permissions: ["shops.view", "shops.edit", "shops.approve", "users.view", "users.edit"],
      userCount: 5,
      isActive: true,
      created: "2024-01-05",
      lastModified: "2024-01-18",
    },
    {
      id: 3,
      name: "Support Agent",
      description: "Handle support tickets and user issues",
      permissions: ["shops.view", "users.view", "users.suspend", "billing.view"],
      userCount: 8,
      isActive: true,
      created: "2024-01-10",
      lastModified: "2024-01-20",
    },
    {
      id: 4,
      name: "Analytics Viewer",
      description: "View analytics and generate reports",
      permissions: ["shops.view", "users.view", "billing.view", "analytics.view"],
      userCount: 3,
      isActive: false,
      created: "2024-01-12",
      lastModified: "2024-01-22",
    },
  ])

  const [newRole, setNewRole] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
    isActive: true,
  })

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddRole = () => {
    if (!newRole.name || !newRole.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const role: AdminRole = {
      ...newRole,
      id: Math.max(...roles.map((r) => r.id)) + 1,
      userCount: 0,
      created: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    }

    setRoles([...roles, role])
    setIsAddDialogOpen(false)
    setNewRole({
      name: "",
      description: "",
      permissions: [],
      isActive: true,
    })

    toast({
      title: "Role Created",
      description: `${newRole.name} role has been created successfully.`,
    })
  }

  const handleUpdateRole = () => {
    if (!editingRole) return

    setRoles(roles.map((role) => (role.id === editingRole.id ? { ...editingRole } : role)))
    setEditingRole(null)

    toast({
      title: "Role Updated",
      description: `${editingRole.name} role has been updated successfully.`,
    })
  }

  const handleDeleteRole = (roleId: number, roleName: string) => {
    setRoles(roles.filter((role) => role.id !== roleId))
    toast({
      title: "Role Deleted",
      description: `${roleName} role has been deleted.`,
      variant: "destructive",
    })
  }

  const handleToggleRole = (roleId: number) => {
    setRoles(
      roles.map((role) =>
        role.id === roleId
          ? { ...role, isActive: !role.isActive, lastModified: new Date().toISOString().split("T")[0] }
          : role,
      ),
    )

    const role = roles.find((r) => r.id === roleId)
    toast({
      title: `Role ${role?.isActive ? "Deactivated" : "Activated"}`,
      description: `${role?.name} has been ${role?.isActive ? "deactivated" : "activated"}.`,
    })
  }

  const handlePermissionChange = (permissionId: string, checked: boolean, isEditing = false) => {
    if (isEditing && editingRole) {
      const updatedPermissions = checked
        ? [...editingRole.permissions, permissionId]
        : editingRole.permissions.filter((p) => p !== permissionId)
      setEditingRole({ ...editingRole, permissions: updatedPermissions })
    } else {
      const updatedPermissions = checked
        ? [...newRole.permissions, permissionId]
        : newRole.permissions.filter((p) => p !== permissionId)
      setNewRole({ ...newRole, permissions: updatedPermissions })
    }
  }

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {}
    availablePermissions.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = []
      }
      categories[permission.category].push(permission)
    })
    return categories
  }

  const stats = [
    {
      title: "Total Roles",
      value: roles.length.toString(),
      change: `${roles.filter((r) => r.isActive).length} active`,
      icon: Shield,
    },
    {
      title: "Active Roles",
      value: roles.filter((r) => r.isActive).length.toString(),
      change: "+1 this month",
      icon: UserCheck,
    },
    {
      title: "Total Admins",
      value: roles.reduce((sum, role) => sum + role.userCount, 0).toString(),
      change: "Across all roles",
      icon: Users,
    },
    {
      title: "Permissions",
      value: availablePermissions.length.toString(),
      change: "Available permissions",
      icon: Key,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Admin Roles</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Admin Role</DialogTitle>
                <DialogDescription>Create a new admin role with specific permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={newRole.name}
                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Role name"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={newRole.description}
                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Role description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Active</Label>
                  <Switch
                    checked={newRole.isActive}
                    onCheckedChange={(checked) => setNewRole({ ...newRole, isActive: checked })}
                  />
                </div>
                <div className="space-y-4">
                  <Label className="text-sm font-medium">Permissions</Label>
                  {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={newRole.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={permission.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {permission.name}
                              </label>
                              <p className="text-xs text-muted-foreground">{permission.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddRole}>Create Role</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
          <CardTitle>Search Roles</CardTitle>
          <CardDescription>Find admin roles by name or description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Roles ({filteredRoles.length})</CardTitle>
          <CardDescription>Manage admin roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {role.name === "Super Admin" ? (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      ) : (
                        <Shield className="h-4 w-4" />
                      )}
                      <div>
                        <div className="font-medium">{role.name}</div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.slice(0, 3).map((permissionId) => {
                        const permission = availablePermissions.find((p) => p.id === permissionId)
                        return (
                          <Badge key={permissionId} variant="outline" className="text-xs">
                            {permission?.name}
                          </Badge>
                        )
                      })}
                      {role.permissions.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{role.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge variant={role.isActive ? "default" : "secondary"}>
                        {role.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Switch checked={role.isActive} onCheckedChange={() => handleToggleRole(role.id)} size="sm" />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{role.created}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedRole(role)}>
                          <Shield className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditingRole({ ...role })}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteRole(role.id, role.name)}
                          disabled={role.name === "Super Admin"}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Role
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

      {/* Role Details Modal */}
      <Dialog open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Role Details</DialogTitle>
            <DialogDescription>Detailed information about {selectedRole?.name}</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Role Name</label>
                  <p className="text-sm text-muted-foreground">{selectedRole.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={selectedRole.isActive ? "default" : "secondary"}>
                    {selectedRole.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Users</label>
                  <p className="text-sm text-muted-foreground">{selectedRole.userCount} assigned</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">{selectedRole.created}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Permissions ({selectedRole.permissions.length})</label>
                <div className="mt-2 space-y-2">
                  {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => {
                    const categoryPermissions = permissions.filter((p) => selectedRole.permissions.includes(p.id))
                    if (categoryPermissions.length === 0) return null
                    return (
                      <div key={category}>
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">{category}</h4>
                        <div className="flex flex-wrap gap-1">
                          {categoryPermissions.map((permission) => (
                            <Badge key={permission.id} variant="outline" className="text-xs">
                              {permission.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={!!editingRole} onOpenChange={() => setEditingRole(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role information and permissions.</DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={editingRole.name}
                  onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingRole.description}
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                  className="col-span-3"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Active</Label>
                <Switch
                  checked={editingRole.isActive}
                  onCheckedChange={(checked) => setEditingRole({ ...editingRole, isActive: checked })}
                />
              </div>
              <div className="space-y-4">
                <Label className="text-sm font-medium">Permissions</Label>
                {Object.entries(getPermissionsByCategory()).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">{category}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`edit-${permission.id}`}
                            checked={editingRole.permissions.includes(permission.id)}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(permission.id, checked as boolean, true)
                            }
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={`edit-${permission.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.name}
                            </label>
                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateRole}>Update Role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
