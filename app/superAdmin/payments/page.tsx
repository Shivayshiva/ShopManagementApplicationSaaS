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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Search,
  MoreHorizontal,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Eye,
  FileText,
} from "lucide-react"

interface PaymentRecord {
  id: number
  shopName: string
  amount: number
  status: "completed" | "pending" | "failed" | "refunded"
  date: string
  method: string
  transactionId: string
  invoiceNumber: string
  description: string
}

export default function PaymentHistoryPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [dateRange, setDateRange] = useState("30days")
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [paymentRecords] = useState<PaymentRecord[]>([
    {
      id: 1,
      shopName: "TechStore Pro",
      amount: 199,
      status: "completed",
      date: "2024-01-15",
      method: "Credit Card",
      transactionId: "txn_1234567890",
      invoiceNumber: "INV-2024-001",
      description: "Premium Plan - Monthly Subscription",
    },
    {
      id: 2,
      shopName: "Fashion Hub",
      amount: 29,
      status: "pending",
      date: "2024-01-20",
      method: "Bank Transfer",
      transactionId: "txn_1234567891",
      invoiceNumber: "INV-2024-002",
      description: "Basic Plan - Monthly Subscription",
    },
    {
      id: 3,
      shopName: "Home Essentials",
      amount: 79,
      status: "failed",
      date: "2024-01-18",
      method: "Credit Card",
      transactionId: "txn_1234567892",
      invoiceNumber: "INV-2024-003",
      description: "Pro Plan - Monthly Subscription",
    },
    {
      id: 4,
      shopName: "Sports Central",
      amount: 199,
      status: "completed",
      date: "2024-01-12",
      method: "PayPal",
      transactionId: "txn_1234567893",
      invoiceNumber: "INV-2024-004",
      description: "Premium Plan - Monthly Subscription",
    },
    {
      id: 5,
      shopName: "Book Corner",
      amount: 29,
      status: "refunded",
      date: "2024-01-10",
      method: "Credit Card",
      transactionId: "txn_1234567894",
      invoiceNumber: "INV-2024-005",
      description: "Basic Plan - Monthly Subscription (Refunded)",
    },
    {
      id: 6,
      shopName: "Digital Arts",
      amount: 79,
      status: "completed",
      date: "2024-01-08",
      method: "Stripe",
      transactionId: "txn_1234567895",
      invoiceNumber: "INV-2024-006",
      description: "Pro Plan - Monthly Subscription",
    },
  ])

  const filteredPaymentRecords = useMemo(() => {
    return paymentRecords.filter((record) => {
      const matchesSearch =
        record.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      const matchesMethod = methodFilter === "all" || record.method === methodFilter

      return matchesSearch && matchesStatus && matchesMethod
    })
  }, [paymentRecords, searchTerm, statusFilter, methodFilter])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Payment history has been updated.",
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["Shop Name", "Amount", "Status", "Date", "Method", "Transaction ID", "Invoice", "Description"],
      ...filteredPaymentRecords.map((record) => [
        record.shopName,
        record.amount,
        record.status,
        record.date,
        record.method,
        record.transactionId,
        record.invoiceNumber,
        record.description,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "payment-history.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Payment history has been exported to CSV.",
    })
  }

  const handlePaymentAction = (recordId: number, action: string) => {
    const record = paymentRecords.find((r) => r.id === recordId)
    if (!record) return

    switch (action) {
      case "view":
        setSelectedPayment(record)
        break
      case "refund":
        toast({
          title: "Refund Initiated",
          description: `Refund process started for ${record.shopName}.`,
        })
        break
      case "download-receipt":
        toast({
          title: "Receipt Downloaded",
          description: `Receipt for transaction ${record.transactionId} downloaded.`,
        })
        break
      case "resend-receipt":
        toast({
          title: "Receipt Sent",
          description: `Receipt resent to ${record.shopName}.`,
        })
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "failed":
        return "destructive"
      case "refunded":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "pending":
        return CreditCard
      case "failed":
        return XCircle
      case "refunded":
        return FileText
      default:
        return CreditCard
    }
  }

  const totalRevenue = filteredPaymentRecords
    .filter((r) => r.status === "completed")
    .reduce((sum, record) => sum + record.amount, 0)

  const totalRefunded = filteredPaymentRecords
    .filter((r) => r.status === "refunded")
    .reduce((sum, record) => sum + record.amount, 0)

  const stats = [
    {
      title: "Total Payments",
      value: filteredPaymentRecords.length.toString(),
      change: "+15 this month",
      icon: CreditCard,
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12% from last month",
      icon: DollarSign,
    },
    {
      title: "Successful Payments",
      value: filteredPaymentRecords.filter((r) => r.status === "completed").length.toString(),
      change: "94% success rate",
      icon: CheckCircle,
    },
    {
      title: "Total Refunded",
      value: `$${totalRefunded.toLocaleString()}`,
      change: `${filteredPaymentRecords.filter((r) => r.status === "refunded").length} refunds`,
      icon: FileText,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Payment History</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="12months">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
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
          <CardDescription>Filter and search payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
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
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="PayPal">PayPal</SelectItem>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Stripe">Stripe</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payment Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records ({filteredPaymentRecords.length})</CardTitle>
          <CardDescription>Complete payment transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shop</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Invoice</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaymentRecords.map((record) => {
                const StatusIcon = getStatusIcon(record.status)
                return (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.shopName}</TableCell>
                    <TableCell className="font-medium">${record.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status) as any}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{record.date}</TableCell>
                    <TableCell className="text-sm">{record.method}</TableCell>
                    <TableCell className="text-sm font-mono">{record.transactionId}</TableCell>
                    <TableCell className="text-sm">{record.invoiceNumber}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePaymentAction(record.id, "view")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePaymentAction(record.id, "download-receipt")}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Receipt
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handlePaymentAction(record.id, "resend-receipt")}>
                            <FileText className="mr-2 h-4 w-4" />
                            Resend Receipt
                          </DropdownMenuItem>
                          {record.status === "completed" && (
                            <DropdownMenuItem onClick={() => handlePaymentAction(record.id, "refund")}>
                              <XCircle className="mr-2 h-4 w-4" />
                              Process Refund
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

      {/* Payment Details Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={() => setSelectedPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Transaction details for {selectedPayment?.shopName}</DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Shop Name</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.shopName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount</label>
                  <p className="text-sm text-muted-foreground">${selectedPayment.amount}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={getStatusColor(selectedPayment.status) as any}>{selectedPayment.status}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Payment Method</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.method}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Transaction ID</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedPayment.transactionId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Invoice Number</label>
                  <p className="text-sm text-muted-foreground">{selectedPayment.invoiceNumber}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <p className="text-sm text-muted-foreground">{selectedPayment.description}</p>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={() => handlePaymentAction(selectedPayment.id, "download-receipt")}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
                <Button variant="outline" onClick={() => handlePaymentAction(selectedPayment.id, "resend-receipt")}>
                  <FileText className="mr-2 h-4 w-4" />
                  Resend Receipt
                </Button>
                {selectedPayment.status === "completed" && (
                  <Button variant="destructive" onClick={() => handlePaymentAction(selectedPayment.id, "refund")}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Process Refund
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
