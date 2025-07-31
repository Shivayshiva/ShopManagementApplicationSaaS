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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  MoreHorizontal,
  DollarSign,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Eye,
  Mail,
} from "lucide-react"

interface BillingRecord {
  id: number
  shopName: string
  plan: string
  amount: number
  status: "paid" | "pending" | "failed" | "overdue"
  dueDate: string
  paidDate?: string
  invoiceNumber: string
  paymentMethod: string
}

export default function BillingPage() {
  const { shops } = useStore()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [selectedBilling, setSelectedBilling] = useState<BillingRecord | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [billingRecords] = useState<BillingRecord[]>([
    {
      id: 1,
      shopName: "TechStore Pro",
      plan: "Premium",
      amount: 199,
      status: "paid",
      dueDate: "2024-01-15",
      paidDate: "2024-01-14",
      invoiceNumber: "INV-2024-001",
      paymentMethod: "Credit Card",
    },
    {
      id: 2,
      shopName: "Fashion Hub",
      plan: "Basic",
      amount: 29,
      status: "pending",
      dueDate: "2024-01-20",
      invoiceNumber: "INV-2024-002",
      paymentMethod: "Bank Transfer",
    },
    {
      id: 3,
      shopName: "Home Essentials",
      plan: "Pro",
      amount: 79,
      status: "failed",
      dueDate: "2024-01-18",
      invoiceNumber: "INV-2024-003",
      paymentMethod: "Credit Card",
    },
    {
      id: 4,
      shopName: "Sports Central",
      plan: "Premium",
      amount: 199,
      status: "overdue",
      dueDate: "2024-01-10",
      invoiceNumber: "INV-2024-004",
      paymentMethod: "PayPal",
    },
    {
      id: 5,
      shopName: "Book Corner",
      plan: "Basic",
      amount: 29,
      status: "paid",
      dueDate: "2024-01-22",
      paidDate: "2024-01-21",
      invoiceNumber: "INV-2024-005",
      paymentMethod: "Credit Card",
    },
  ])

  const filteredBillingRecords = useMemo(() => {
    return billingRecords.filter((record) => {
      const matchesSearch =
        record.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      const matchesPlan = planFilter === "all" || record.plan === planFilter

      return matchesSearch && matchesStatus && matchesPlan
    })
  }, [billingRecords, searchTerm, statusFilter, planFilter])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Billing data has been updated.",
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["Shop Name", "Plan", "Amount", "Status", "Due Date", "Invoice Number", "Payment Method"],
      ...filteredBillingRecords.map((record) => [
        record.shopName,
        record.plan,
        record.amount,
        record.status,
        record.dueDate,
        record.invoiceNumber,
        record.paymentMethod,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "billing-records.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Billing data has been exported to CSV.",
    })
  }

  const handleBillingAction = (recordId: number, action: string) => {
    const record = billingRecords.find((r) => r.id === recordId)
    if (!record) return

    switch (action) {
      case "view":
        setSelectedBilling(record)
        break
      case "send-reminder":
        toast({
          title: "Reminder Sent",
          description: `Payment reminder sent to ${record.shopName}.`,
        })
        break
      case "mark-paid":
        toast({
          title: "Payment Recorded",
          description: `Payment for ${record.shopName} has been marked as paid.`,
        })
        break
      case "retry-payment":
        toast({
          title: "Payment Retry",
          description: `Payment retry initiated for ${record.shopName}.`,
        })
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return CheckCircle
      case "pending":
        return CreditCard
      case "failed":
        return XCircle
      case "overdue":
        return AlertTriangle
      default:
        return CreditCard
    }
  }

  const totalRevenue = filteredBillingRecords
    .filter((r) => r.status === "paid")
    .reduce((sum, record) => sum + record.amount, 0)

  const pendingAmount = filteredBillingRecords
    .filter((r) => r.status === "pending" || r.status === "overdue")
    .reduce((sum, record) => sum + record.amount, 0)

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12% from last month",
      icon: DollarSign,
    },
    {
      title: "Pending Payments",
      value: `$${pendingAmount.toLocaleString()}`,
      change: `${filteredBillingRecords.filter((r) => r.status === "pending").length} invoices`,
      icon: CreditCard,
    },
    {
      title: "Failed Payments",
      value: filteredBillingRecords.filter((r) => r.status === "failed").length.toString(),
      change: "-2 from last month",
      icon: XCircle,
    },
    {
      title: "Overdue",
      value: filteredBillingRecords.filter((r) => r.status === "overdue").length.toString(),
      change: "+1 from last month",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Billing Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search billing records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search billing records..."
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
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Billing Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Records ({filteredBillingRecords.length})</CardTitle>
          <CardDescription>Manage subscription billing and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBillingRecords.map((record) => {
                const StatusIcon = getStatusIcon(record.status)
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.shopName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.plan}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">${record.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status) as any}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{record.dueDate}</TableCell>
                    <TableCell className="text-sm">{record.invoiceNumber}</TableCell>
                    <TableCell className="text-sm">{record.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleBillingAction(record.id, "view")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {(record.status === "pending" || record.status === "overdue") && (
                            <DropdownMenuItem onClick={() => handleBillingAction(record.id, "send-reminder")}>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Reminder
                            </DropdownMenuItem>
                          )}
                          {record.status === "failed" && (
                            <DropdownMenuItem onClick={() => handleBillingAction(record.id, "retry-payment")}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retry Payment
                            </DropdownMenuItem>
                          )}
                          {record.status !== "paid" && (
                            <DropdownMenuItem onClick={() => handleBillingAction(record.id, "mark-paid")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark as Paid
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

      {/* Billing Details Modal */}
      <Dialog open={!!selectedBilling} onOpenChange={() => setSelectedBilling(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Billing Details</DialogTitle>
            <DialogDescription>Invoice details for {selectedBilling?.shopName}</DialogDescription>
          </DialogHeader>
          {selectedBilling && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Shop Name</label>
                  <p className="text-sm text-muted-foreground">{selectedBilling.shopName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Plan</label>
                  <Badge variant="outline">{selectedBilling.plan}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-muted-foreground">${selectedBilling.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={getStatusColor(selectedBilling.status) as any}>{selectedBilling.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <p className="text-sm text-muted-foreground">{selectedBilling.dueDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Invoice Number</label>
                  <p className="text-sm text-muted-foreground">{selectedBilling.invoiceNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <p className="text-sm text-muted-foreground">{selectedBilling.paymentMethod}</p>
                </div>
                {selectedBilling.paidDate && (
                  <div>
                    <label className="text-sm font-medium">Paid Date</label>
                    <p className="text-sm text-muted-foreground">{selectedBilling.paidDate}</p>
                  </div>
                )}
              </div>
              <div className="flex space-x-2 pt-4">
                {selectedBilling.status === "pending" && (
                  <Button onClick={() => handleBillingAction(selectedBilling.id, "send-reminder")}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Reminder
                  </Button>
                )}
                {selectedBilling.status === "failed" && (
                  <Button onClick={() => handleBillingAction(selectedBilling.id, "retry-payment")}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Payment
                  </Button>
                )}
                {selectedBilling.status !== "paid" && (
                  <Button variant="outline" onClick={() => handleBillingAction(selectedBilling.id, "mark-paid")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
