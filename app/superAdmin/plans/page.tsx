"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useStore } from "@/lib/store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, Edit, Trash2, Plus, Users, Package, HardDrive, CreditCard, Check, X, Copy } from "lucide-react"

export default function PlansPage() {
  const { plans, addPlan, updatePlan, deletePlan } = useStore()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: 0,
    billing: "monthly" as const,
    description: "",
    features: {
      products: 100,
      staff: 2,
      storage: "1GB",
      support: "Email",
    },
    subscribers: 0,
    status: "draft" as const,
    created: new Date().toISOString().split("T")[0],
  })

  const handleAddPlan = () => {
    if (!newPlan.name || !newPlan.description || newPlan.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields with valid values.",
        variant: "destructive",
      })
      return
    }

    addPlan(newPlan)
    setIsAddDialogOpen(false)
    setNewPlan({
      name: "",
      price: 0,
      billing: "monthly",
      description: "",
      features: {
        products: 100,
        staff: 2,
        storage: "1GB",
        support: "Email",
      },
      subscribers: 0,
      status: "draft",
      created: new Date().toISOString().split("T")[0],
    })
    toast({
      title: "Plan Created",
      description: `${newPlan.name} plan has been created successfully.`,
    })
  }

  const handleUpdatePlan = () => {
    if (!editingPlan) return

    updatePlan(editingPlan.id, editingPlan)
    setEditingPlan(null)
    toast({
      title: "Plan Updated",
      description: `${editingPlan.name} plan has been updated successfully.`,
    })
  }

  const handleDeletePlan = (planId: number, planName: string) => {
    deletePlan(planId)
    toast({
      title: "Plan Deleted",
      description: `${planName} plan has been deleted.`,
      variant: "destructive",
    })
  }

  const handlePlanAction = (planId: number, action: string) => {
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return

    switch (action) {
      case "activate":
        updatePlan(planId, { status: "active" })
        toast({
          title: "Plan Activated",
          description: `${plan.name} plan is now active.`,
        })
        break
      case "deactivate":
        updatePlan(planId, { status: "draft" })
        toast({
          title: "Plan Deactivated",
          description: `${plan.name} plan has been deactivated.`,
        })
        break
      case "duplicate":
        const duplicatedPlan = {
          ...plan,
          name: `${plan.name} (Copy)`,
          subscribers: 0,
          status: "draft" as const,
          created: new Date().toISOString().split("T")[0],
        }
        delete (duplicatedPlan as any).id
        addPlan(duplicatedPlan)
        toast({
          title: "Plan Duplicated",
          description: `${plan.name} has been duplicated.`,
        })
        break
      case "edit":
        setEditingPlan({ ...plan })
        break
      case "subscribers":
        toast({
          title: "Subscribers View",
          description: `Viewing subscribers for ${plan.name} plan.`,
        })
        break
    }
  }

  const stats = [
    {
      title: "Total Plans",
      value: plans.length.toString(),
      change: `${plans.filter((p) => p.status === "active").length} active plans`,
      icon: CreditCard,
    },
    {
      title: "Total Subscribers",
      value: plans.reduce((sum, plan) => sum + plan.subscribers, 0).toString(),
      change: "+12% from last month",
      icon: Users,
    },
    {
      title: "Monthly Revenue",
      value: `$${plans.reduce((sum, plan) => sum + plan.price * plan.subscribers, 0).toLocaleString()}`,
      change: "+8% from last month",
      icon: CreditCard,
    },
    {
      title: "Most Popular",
      value: plans.reduce((prev, current) => (prev.subscribers > current.subscribers ? prev : current)).name,
      change: `${plans.reduce((prev, current) => (prev.subscribers > current.subscribers ? prev : current)).subscribers} subscribers`,
      icon: Package,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Subscription Plans</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Plan</DialogTitle>
                <DialogDescription>Create a new subscription plan for your SaaS platform.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Plan name"
                      className="col-span-3"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Price *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="29"
                      className="col-span-3"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="billing" className="text-right">
                    Billing
                  </Label>
                  <Select
                    value={newPlan.billing}
                    onValueChange={(value: any) => setNewPlan({ ...newPlan, billing: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select billing cycle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Plan description"
                    className="col-span-3"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Plan Features</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="products" className="text-right">
                        Products
                      </Label>
                      <Input
                        id="products"
                        type="number"
                        className="col-span-3"
                        value={newPlan.features.products}
                        onChange={(e) =>
                          setNewPlan({
                            ...newPlan,
                            features: { ...newPlan.features, products: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="staff" className="text-right">
                        Staff
                      </Label>
                      <Input
                        id="staff"
                        type="number"
                        className="col-span-3"
                        value={newPlan.features.staff}
                        onChange={(e) =>
                          setNewPlan({
                            ...newPlan,
                            features: { ...newPlan.features, staff: Number(e.target.value) },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="storage" className="text-right">
                        Storage
                      </Label>
                      <Input
                        id="storage"
                        placeholder="1GB"
                        className="col-span-3"
                        value={newPlan.features.storage}
                        onChange={(e) =>
                          setNewPlan({
                            ...newPlan,
                            features: { ...newPlan.features, storage: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="support" className="text-right">
                        Support
                      </Label>
                      <Select
                        value={newPlan.features.support}
                        onValueChange={(value) =>
                          setNewPlan({
                            ...newPlan,
                            features: { ...newPlan.features, support: value },
                          })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Priority">Priority</SelectItem>
                          <SelectItem value="24/7 Phone">24/7 Phone</SelectItem>
                          <SelectItem value="Dedicated Manager">Dedicated Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddPlan}>Create Plan</Button>
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

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
          <CardDescription>Manage subscription plans and their features</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">${plan.price}</div>
                    <div className="text-sm text-muted-foreground">/{plan.billing}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 text-sm">
                        <Package className="h-3 w-3" />
                        <span>{plan.features.products} products</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <Users className="h-3 w-3" />
                        <span>{plan.features.staff} staff</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm">
                        <HardDrive className="h-3 w-3" />
                        <span>{plan.features.storage} storage</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{plan.subscribers}</div>
                    <div className="text-sm text-muted-foreground">subscribers</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                      {plan.status === "active" && <Check className="mr-1 h-3 w-3" />}
                      {plan.status === "draft" && <X className="mr-1 h-3 w-3" />}
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{plan.created}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handlePlanAction(plan.id, "edit")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePlanAction(plan.id, "duplicate")}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePlanAction(plan.id, "subscribers")}>
                          <Users className="mr-2 h-4 w-4" />
                          View Subscribers
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handlePlanAction(plan.id, plan.status === "active" ? "deactivate" : "activate")
                          }
                        >
                          {plan.status === "active" ? (
                            <X className="mr-2 h-4 w-4" />
                          ) : (
                            <Check className="mr-2 h-4 w-4" />
                          )}
                          {plan.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePlan(plan.id, plan.name)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Plan
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

      {/* Edit Plan Dialog */}
      <Dialog open={!!editingPlan} onOpenChange={() => setEditingPlan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Plan</DialogTitle>
            <DialogDescription>Update plan information and features.</DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingPlan.name}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-price" className="text-right">
                    Price
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingPlan.price}
                    onChange={(e) => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-billing" className="text-right">
                  Billing
                </Label>
                <Select
                  value={editingPlan.billing}
                  onValueChange={(value: any) => setEditingPlan({ ...editingPlan, billing: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingPlan.description}
                  onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Plan Features</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-products" className="text-right">
                      Products
                    </Label>
                    <Input
                      id="edit-products"
                      type="number"
                      className="col-span-3"
                      value={editingPlan.features.products}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          features: { ...editingPlan.features, products: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-staff" className="text-right">
                      Staff
                    </Label>
                    <Input
                      id="edit-staff"
                      type="number"
                      className="col-span-3"
                      value={editingPlan.features.staff}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          features: { ...editingPlan.features, staff: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-storage" className="text-right">
                      Storage
                    </Label>
                    <Input
                      id="edit-storage"
                      className="col-span-3"
                      value={editingPlan.features.storage}
                      onChange={(e) =>
                        setEditingPlan({
                          ...editingPlan,
                          features: { ...editingPlan.features, storage: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-support" className="text-right">
                      Support
                    </Label>
                    <Select
                      value={editingPlan.features.support}
                      onValueChange={(value) =>
                        setEditingPlan({
                          ...editingPlan,
                          features: { ...editingPlan.features, support: value },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Priority">Priority</SelectItem>
                        <SelectItem value="24/7 Phone">24/7 Phone</SelectItem>
                        <SelectItem value="Dedicated Manager">Dedicated Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdatePlan}>Update Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
