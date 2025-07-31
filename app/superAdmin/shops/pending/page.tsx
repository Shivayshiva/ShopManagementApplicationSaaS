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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Search, MoreHorizontal, CheckCircle, XCircle, Eye, Clock, AlertTriangle } from "lucide-react"


const shops = [
  {
    id: 1,
    name: "Tech Mart",
    owner: "Prashant Kumar",
    email: "prashant@techmart.com",
    plan: "Basic",
    status: "active",
    revenue: "$1500",
    users: 5,
    products: 25,
    created: "2024-09-15",
    lastLogin: "2025-07-27",
  },
  {
    id: 2,
    name: "FashionHub",
    owner: "Anita Sharma",
    email: "anita@fashionhub.com",
    plan: "Pro",
    status: "pending",
    revenue: "$780",
    users: 2,
    products: 12,
    created: "2024-11-01",
    lastLogin: "Never",
  },
];
export default function PendingShopsPage() {
  // const { shops, updateShop } = useStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedShop, setSelectedShop] = useState<any>(null)
  const [reviewDialog, setReviewDialog] = useState<any>(null)
  const [reviewNotes, setReviewNotes] = useState("")

  const pendingShops = useMemo(() => {
    return shops
      .filter((shop) => shop.status === "pending")
      .filter(
        (shop) =>
          shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
          shop.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
  }, [shops, searchTerm])

  const handleApproveShop = (shopId: number, notes?: string) => {
    const shop = shops.find((s) => s.id === shopId)
    if (!shop) return

    // updateShop(shopId, { status: "active" })
    toast({
      title: "Shop Approved",
      description: `${shop.name} has been approved and activated.`,
    })
    setReviewDialog(null)
    setReviewNotes("")
  }

  const handleRejectShop = (shopId: number, notes?: string) => {
    const shop = shops.find((s) => s.id === shopId)
    if (!shop) return

    // updateShop(shopId, { status: "inactive" })
    toast({
      title: "Shop Rejected",
      description: `${shop.name} has been rejected.`,
      variant: "destructive",
    })
    setReviewDialog(null)
    setReviewNotes("")
  }

  const handleBulkApprove = () => {
    pendingShops.forEach((shop) => {
      // updateShop(shop.id, { status: "active" })
    })
    toast({
      title: "Bulk Approval Complete",
      description: `${pendingShops.length} shops have been approved.`,
    })
  }

  const stats = [
    {
      title: "Pending Approval",
      value: pendingShops.length.toString(),
      change: "+3 today",
      icon: Clock,
    },
    {
      title: "Avg Review Time",
      value: "2.5 days",
      change: "-0.5 days",
      icon: AlertTriangle,
    },
    {
      title: "Approval Rate",
      value: "87%",
      change: "+5% this month",
      icon: CheckCircle,
    },
    {
      title: "Rejected",
      value: "12",
      change: "This month",
      icon: XCircle,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Pending Shop Approvals</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleBulkApprove} disabled={pendingShops.length === 0}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Approve All ({pendingShops.length})
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
          <CardTitle>Search Pending Shops</CardTitle>
          <CardDescription>Find shops waiting for approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pending shops..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pending Shops Table */}
      <Card>
        <CardHeader>
          <CardTitle>Shops Awaiting Approval ({pendingShops.length})</CardTitle>
          <CardDescription>Review and approve new shop registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingShops.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No pending approvals</h3>
              <p className="mt-1 text-sm text-muted-foreground">All shops have been reviewed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shop</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingShops.map((shop) => (
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
                    <TableCell className="text-sm text-muted-foreground">{shop.created}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedShop(shop)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Review Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setReviewDialog({ ...shop, action: "approve" })}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve Shop
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setReviewDialog({ ...shop, action: "reject" })}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject Shop
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Shop Details Modal */}
      <Dialog open={!!selectedShop} onOpenChange={() => setSelectedShop(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Shop Review Details</DialogTitle>
            <DialogDescription>Review shop information before approval</DialogDescription>
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
                  <Badge variant="outline">{selectedShop.plan}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Submitted</label>
                  <p className="text-sm text-muted-foreground">{selectedShop.created}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant="secondary">Pending Review</Badge>
                </div>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={() => setReviewDialog({ ...selectedShop, action: "approve" })}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button variant="destructive" onClick={() => setReviewDialog({ ...selectedShop, action: "reject" })}>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{reviewDialog?.action === "approve" ? "Approve Shop" : "Reject Shop"}</DialogTitle>
            <DialogDescription>
              {reviewDialog?.action === "approve"
                ? `Approve ${reviewDialog?.name} and activate their account?`
                : `Reject ${reviewDialog?.name} application?`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm font-medium">Notes</label>
              <Textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Add review notes (optional)"
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>
              Cancel
            </Button>
            {reviewDialog?.action === "approve" ? (
              <Button onClick={() => handleApproveShop(reviewDialog.id, reviewNotes)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve Shop
              </Button>
            ) : (
              <Button variant="destructive" onClick={() => handleRejectShop(reviewDialog.id, reviewNotes)}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Shop
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
