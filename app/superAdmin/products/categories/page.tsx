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
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Tag,
  Package,
  TrendingUp,
  Eye,
  Archive,
  Search,
  Filter,
  Download,
  Upload,
  FolderOpen,
  Hash,
} from "lucide-react"

export default function ProductCategoriesPage() {
  const { productCategories, addProductCategory, updateProductCategory, deleteProductCategory, products } = useStore()
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    slug: "",
    parentId: null as number | null,
    status: "active" as const,
    sortOrder: 0,
    image: "",
    metaTitle: "",
    metaDescription: "",
    created: new Date().toISOString().split("T")[0],
  })

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const categoryData = {
      ...newCategory,
      slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
    }

    addProductCategory(categoryData)
    setIsAddDialogOpen(false)
    setNewCategory({
      name: "",
      description: "",
      slug: "",
      parentId: null,
      status: "active",
      sortOrder: 0,
      image: "",
      metaTitle: "",
      metaDescription: "",
      created: new Date().toISOString().split("T")[0],
    })
    toast({
      title: "Category Created",
      description: `${categoryData.name} category has been created successfully.`,
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory) return

    updateProductCategory(editingCategory.id, editingCategory)
    setEditingCategory(null)
    toast({
      title: "Category Updated",
      description: `${editingCategory.name} has been updated successfully.`,
    })
  }

  const handleDeleteCategory = (categoryId: number, categoryName: string) => {
    deleteProductCategory(categoryId)
    toast({
      title: "Category Deleted",
      description: `${categoryName} has been deleted.`,
      variant: "destructive",
    })
  }

  const handleCategoryAction = (categoryId: number, action: string) => {
    const category = productCategories.find((c) => c.id === categoryId)
    if (!category) return

    switch (action) {
      case "activate":
        updateProductCategory(categoryId, { status: "active" })
        toast({
          title: "Category Activated",
          description: `${category.name} is now active.`,
        })
        break
      case "deactivate":
        updateProductCategory(categoryId, { status: "inactive" })
        toast({
          title: "Category Deactivated",
          description: `${category.name} has been deactivated.`,
          variant: "destructive",
        })
        break
      case "archive":
        updateProductCategory(categoryId, { status: "archived" })
        toast({
          title: "Category Archived",
          description: `${category.name} has been archived.`,
          variant: "destructive",
        })
        break
      case "edit":
        setEditingCategory({ ...category })
        break
      case "view":
        toast({
          title: "Category Details",
          description: `Viewing details for ${category.name}.`,
        })
        break
    }
  }

  const filteredCategories = productCategories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || category.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = [
    {
      title: "Total Categories",
      value: productCategories.length.toString(),
      change: `${productCategories.filter((c) => c.status === "active").length} active`,
      icon: Tag,
    },
    {
      title: "Products Categorized",
      value: products.filter((p) => p.category).length.toString(),
      change: `${Math.round((products.filter((p) => p.category).length / products.length) * 100)}% of total`,
      icon: Package,
    },
    {
      title: "Top Category",
      value:
        productCategories.reduce((prev, current) => (prev.productCount > current.productCount ? prev : current)).name ||
        "N/A",
      change: `${
        productCategories.reduce((prev, current) => (prev.productCount > current.productCount ? prev : current))
          .productCount || 0
      } products`,
      icon: TrendingUp,
    },
    {
      title: "Uncategorized",
      value: products.filter((p) => !p.category).length.toString(),
      change: "Need categorization",
      icon: FolderOpen,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Product Categories</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>Create a new product category.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Category name"
                      className="col-span-3"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="slug" className="text-right">
                      Slug
                    </Label>
                    <Input
                      id="slug"
                      placeholder="Auto-generated if empty"
                      className="col-span-3"
                      value={newCategory.slug}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Category description"
                    className="col-span-3"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="parentId" className="text-right">
                      Parent Category
                    </Label>
                    <Select
                      value={newCategory.parentId?.toString() || "none"}
                      onValueChange={(value) =>
                        setNewCategory({ ...newCategory, parentId: value === "none" ? null : Number(value) })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select parent (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Parent</SelectItem>
                        {productCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sortOrder" className="text-right">
                      Sort Order
                    </Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      placeholder="0"
                      className="col-span-3"
                      value={newCategory.sortOrder}
                      onChange={(e) => setNewCategory({ ...newCategory, sortOrder: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="image"
                    placeholder="https://example.com/image.jpg"
                    className="col-span-3"
                    value={newCategory.image}
                    onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">SEO Settings</h4>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="metaTitle" className="text-right">
                      Meta Title
                    </Label>
                    <Input
                      id="metaTitle"
                      placeholder="SEO title"
                      className="col-span-3"
                      value={newCategory.metaTitle}
                      onChange={(e) => setNewCategory({ ...newCategory, metaTitle: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="metaDescription" className="text-right">
                      Meta Description
                    </Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="SEO description"
                      className="col-span-3"
                      value={newCategory.metaDescription}
                      onChange={(e) => setNewCategory({ ...newCategory, metaDescription: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCategory}>Create Category</Button>
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Category Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({filteredCategories.length})</CardTitle>
          <CardDescription>Manage product categories and their hierarchy</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                        {category.image ? (
                          <img
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        ) : (
                          <Tag className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{category.description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                  <TableCell>
                    {category.parentId ? (
                      <Badge variant="outline">
                        {productCategories.find((c) => c.id === category.parentId)?.name || "Unknown"}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">Root</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{category.productCount}</div>
                    <div className="text-xs text-muted-foreground">products</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      <Hash className="mr-1 h-3 w-3" />
                      {category.sortOrder}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        category.status === "active"
                          ? "default"
                          : category.status === "inactive"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {category.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{category.created}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCategoryAction(category.id, "view")}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCategoryAction(category.id, "edit")}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Category
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleCategoryAction(category.id, category.status === "active" ? "deactivate" : "activate")
                          }
                        >
                          {category.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleCategoryAction(category.id, "archive")}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category information and settings.</DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="edit-name"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-slug" className="text-right">
                    Slug
                  </Label>
                  <Input
                    id="edit-slug"
                    value={editingCategory.slug}
                    onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-parentId" className="text-right">
                    Parent
                  </Label>
                  <Select
                    value={editingCategory.parentId?.toString() || "none"}
                    onValueChange={(value) =>
                      setEditingCategory({ ...editingCategory, parentId: value === "none" ? null : Number(value) })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent</SelectItem>
                      {productCategories
                        .filter((c) => c.id !== editingCategory.id)
                        .map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edit-sortOrder" className="text-right">
                    Sort Order
                  </Label>
                  <Input
                    id="edit-sortOrder"
                    type="number"
                    value={editingCategory.sortOrder}
                    onChange={(e) => setEditingCategory({ ...editingCategory, sortOrder: Number(e.target.value) })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={editingCategory.status}
                  onValueChange={(value: any) => setEditingCategory({ ...editingCategory, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
