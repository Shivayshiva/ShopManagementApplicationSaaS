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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  User,
} from "lucide-react"

export default function TicketsPage() {
  const { tickets, shops, addTicket, updateTicket, deleteTicket } = useStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [shopFilter, setShopFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [newTicket, setNewTicket] = useState({
    title: "",
    shop: "",
    priority: "medium" as const,
    status: "open" as const,
    created: new Date().toISOString().split("T")[0],
    assignee: "Support Team",
    description: "",
  })

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.shop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.assignee.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
      const matchesShop = shopFilter === "all" || ticket.shop === shopFilter

      return matchesSearch && matchesStatus && matchesPriority && matchesShop
    })
  }, [tickets, searchTerm, statusFilter, priorityFilter, shopFilter])

  const handleAddTicket = () => {
    if (!newTicket.title || !newTicket.shop || !newTicket.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    addTicket(newTicket)
    setIsAddDialogOpen(false)
    setNewTicket({
      title: "",
      shop: "",
      priority: "medium",
      status: "open",
      created: new Date().toISOString().split("T")[0],
      assignee: "Support Team",
      description: "",
    })
    toast({
      title: "Ticket Created",
      description: `Support ticket "${newTicket.title}" has been created.`,
    })
  }

  const handleTicketAction = (ticketId: number, action: string) => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (!ticket) return

    switch (action) {
      case "view":
        setSelectedTicket(ticket)
        break
      case "in-progress":
        updateTicket(ticketId, { status: "in-progress" })
        toast({
          title: "Ticket Updated",
          description: `Ticket "${ticket.title}" is now in progress.`,
        })
        break
      case "resolve":
        updateTicket(ticketId, { status: "resolved" })
        toast({
          title: "Ticket Resolved",
          description: `Ticket "${ticket.title}" has been resolved.`,
        })
        break
      case "close":
        updateTicket(ticketId, { status: "closed" })
        toast({
          title: "Ticket Closed",
          description: `Ticket "${ticket.title}" has been closed.`,
        })
        break
      case "reopen":
        updateTicket(ticketId, { status: "open" })
        toast({
          title: "Ticket Reopened",
          description: `Ticket "${ticket.title}" has been reopened.`,
        })
        break
      case "assign":
        toast({
          title: "Assignment",
          description: "Opening assignment dialog...",
        })
        break
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in-progress":
        return "secondary"
      case "resolved":
        return "default"
      case "closed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const stats = [
    {
      title: "Total Tickets",
      value: tickets.length.toString(),
      change: `${tickets.filter((t) => t.status === "open").length} open`,
      icon: MessageSquare,
    },
    {
      title: "Open Tickets",
      value: tickets.filter((t) => t.status === "open").length.toString(),
      change: "+5 from yesterday",
      icon: AlertTriangle,
    },
    {
      title: "In Progress",
      value: tickets.filter((t) => t.status === "in-progress").length.toString(),
      change: "2 assigned today",
      icon: Clock,
    },
    {
      title: "Resolved Today",
      value: tickets.filter((t) => t.status === "resolved").length.toString(),
      change: "85% resolution rate",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Ticket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Support Ticket</DialogTitle>
                <DialogDescription>Create a new support ticket for a shop.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    className="col-span-3"
                    placeholder="Brief description of the issue"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shop" className="text-right">
                    Shop *
                  </Label>
                  <Select value={newTicket.shop} onValueChange={(value) => setNewTicket({ ...newTicket, shop: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select shop" />
                    </SelectTrigger>
                    <SelectContent>
                      {shops.map((shop) => (
                        <SelectItem key={shop.id} value={shop.name}>
                          {shop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={newTicket.priority}
                    onValueChange={(value: any) => setNewTicket({ ...newTicket, priority: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assignee" className="text-right">
                    Assignee
                  </Label>
                  <Select
                    value={newTicket.assignee}
                    onValueChange={(value) => setNewTicket({ ...newTicket, assignee: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Support Team">Support Team</SelectItem>
                      <SelectItem value="John Support">John Support</SelectItem>
                      <SelectItem value="Sarah Tech">Sarah Tech</SelectItem>
                      <SelectItem value="Mike Admin">Mike Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    className="col-span-3"
                    placeholder="Detailed description of the issue"
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddTicket}>Create Ticket</Button>
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
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search through support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
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
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
          <CardDescription>Manage support tickets from all shops</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Shop</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{ticket.title}</div>
                      <div className="text-sm text-muted-foreground">#{ticket.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{ticket.shop}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(ticket.priority) as any}>{ticket.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(ticket.status) as any}>
                      {ticket.status === "in-progress" && <Clock className="mr-1 h-3 w-3" />}
                      {ticket.status === "resolved" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {ticket.status === "open" && <AlertTriangle className="mr-1 h-3 w-3" />}
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3" />
                      <span className="text-sm">{ticket.assignee}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{ticket.created}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, "view")}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {ticket.status === "open" && (
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, "in-progress")}>
                            <Clock className="mr-2 h-4 w-4" />
                            Start Progress
                          </DropdownMenuItem>
                        )}
                        {(ticket.status === "open" || ticket.status === "in-progress") && (
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, "resolve")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark Resolved
                          </DropdownMenuItem>
                        )}
                        {ticket.status === "resolved" && (
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, "close")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Close Ticket
                          </DropdownMenuItem>
                        )}
                        {ticket.status === "closed" && (
                          <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, "reopen")}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Reopen Ticket
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleTicketAction(ticket.id, "assign")}>
                          <User className="mr-2 h-4 w-4" />
                          Reassign
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

      {/* Ticket Details Modal */}
      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>
              #{selectedTicket?.id} - {selectedTicket?.title}
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Shop</label>
                  <p className="text-sm text-muted-foreground">{selectedTicket.shop}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Badge variant={getPriorityColor(selectedTicket.priority) as any} className="mt-1">
                    {selectedTicket.priority}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={getStatusColor(selectedTicket.status) as any} className="mt-1">
                    {selectedTicket.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Assignee</label>
                  <p className="text-sm text-muted-foreground">{selectedTicket.assignee}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Created</label>
                  <p className="text-sm text-muted-foreground">{selectedTicket.created}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm">{selectedTicket.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleTicketAction(selectedTicket.id, "in-progress")}
                  disabled={selectedTicket.status !== "open"}
                >
                  Start Progress
                </Button>
                <Button
                  onClick={() => handleTicketAction(selectedTicket.id, "resolve")}
                  disabled={selectedTicket.status === "resolved" || selectedTicket.status === "closed"}
                >
                  Mark Resolved
                </Button>
                <Button variant="outline" onClick={() => handleTicketAction(selectedTicket.id, "assign")}>
                  Reassign
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
