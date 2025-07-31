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
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Eye,
  MapPin,
  Clock,
  User,
} from "lucide-react"

interface LoginLog {
  id: number
  userId: number
  userName: string
  email: string
  role: string
  timestamp: string
  ipAddress: string
  location: string
  device: string
  browser: string
  status: "success" | "failed" | "blocked" | "suspicious"
  failureReason?: string
  sessionDuration?: string
}

export default function LoginHistoryPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timeFilter, setTimeFilter] = useState("24hours")
  const [selectedLog, setSelectedLog] = useState<LoginLog | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const [loginLogs] = useState<LoginLog[]>([
    {
      id: 1,
      userId: 1,
      userName: "John Admin",
      email: "john@admin.com",
      role: "Super Admin",
      timestamp: "2024-01-20 14:30:25",
      ipAddress: "192.168.1.100",
      location: "New York, US",
      device: "Desktop",
      browser: "Chrome 120.0",
      status: "success",
      sessionDuration: "2h 15m",
    },
    {
      id: 2,
      userId: 2,
      userName: "Sarah Manager",
      email: "sarah@manager.com",
      role: "Shop Manager",
      timestamp: "2024-01-20 13:45:12",
      ipAddress: "10.0.0.50",
      location: "London, UK",
      device: "Mobile",
      browser: "Safari 17.0",
      status: "failed",
      failureReason: "Invalid password",
    },
    {
      id: 3,
      userId: 3,
      userName: "Mike Owner",
      email: "mike@shop.com",
      role: "Owner",
      timestamp: "2024-01-20 12:20:08",
      ipAddress: "203.0.113.45",
      location: "Sydney, AU",
      device: "Tablet",
      browser: "Firefox 121.0",
      status: "success",
      sessionDuration: "45m",
    },
    {
      id: 4,
      userId: 4,
      userName: "Lisa Support",
      email: "lisa@support.com",
      role: "Support Agent",
      timestamp: "2024-01-20 11:15:33",
      ipAddress: "198.51.100.25",
      location: "Toronto, CA",
      device: "Desktop",
      browser: "Edge 120.0",
      status: "blocked",
      failureReason: "Too many failed attempts",
    },
    {
      id: 5,
      userId: 5,
      userName: "Unknown User",
      email: "hacker@evil.com",
      role: "Unknown",
      timestamp: "2024-01-20 10:30:45",
      ipAddress: "185.220.101.182",
      location: "Unknown, TOR",
      device: "Desktop",
      browser: "Chrome 119.0",
      status: "suspicious",
      failureReason: "Suspicious activity detected",
    },
    {
      id: 6,
      userId: 6,
      userName: "Alex Developer",
      email: "alex@dev.com",
      role: "Developer",
      timestamp: "2024-01-20 09:45:22",
      ipAddress: "172.16.0.10",
      location: "Berlin, DE",
      device: "Desktop",
      browser: "Chrome 120.0",
      status: "success",
      sessionDuration: "4h 30m",
    },
  ])

  const filteredLogs = useMemo(() => {
    return loginLogs.filter((log) => {
      const matchesSearch =
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress.includes(searchTerm) ||
        log.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || log.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [loginLogs, searchTerm, statusFilter])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Login history has been updated.",
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["User", "Email", "Role", "Timestamp", "IP Address", "Location", "Device", "Browser", "Status", "Reason"],
      ...filteredLogs.map((log) => [
        log.userName,
        log.email,
        log.role,
        log.timestamp,
        log.ipAddress,
        log.location,
        log.device,
        log.browser,
        log.status,
        log.failureReason || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "login-history.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Login history has been exported to CSV.",
    })
  }

  const handleLogAction = (logId: number, action: string) => {
    const log = loginLogs.find((l) => l.id === logId)
    if (!log) return

    switch (action) {
      case "view":
        setSelectedLog(log)
        break
      case "block-ip":
        toast({
          title: "IP Blocked",
          description: `IP address ${log.ipAddress} has been blocked.`,
        })
        break
      case "investigate":
        toast({
          title: "Investigation Started",
          description: `Security investigation initiated for ${log.userName}.`,
        })
        break
      case "whitelist":
        toast({
          title: "IP Whitelisted",
          description: `IP address ${log.ipAddress} has been whitelisted.`,
        })
        break
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "failed":
        return "secondary"
      case "blocked":
        return "destructive"
      case "suspicious":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle
      case "failed":
        return XCircle
      case "blocked":
        return Shield
      case "suspicious":
        return AlertTriangle
      default:
        return Activity
    }
  }

  const stats = [
    {
      title: "Total Logins",
      value: loginLogs.length.toString(),
      change: "+15 today",
      icon: Activity,
    },
    {
      title: "Successful",
      value: loginLogs.filter((l) => l.status === "success").length.toString(),
      change: `${Math.round((loginLogs.filter((l) => l.status === "success").length / loginLogs.length) * 100)}% success rate`,
      icon: CheckCircle,
    },
    {
      title: "Failed Attempts",
      value: loginLogs.filter((l) => l.status === "failed").length.toString(),
      change: "+3 from yesterday",
      icon: XCircle,
    },
    {
      title: "Suspicious Activity",
      value: loginLogs.filter((l) => l.status === "suspicious" || l.status === "blocked").length.toString(),
      change: "Requires attention",
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Login History</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1hour">Last hour</SelectItem>
              <SelectItem value="24hours">Last 24 hours</SelectItem>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Login History</CardTitle>
          <CardDescription>Filter login attempts by user, IP, location, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, email, IP, or location..."
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
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="suspicious">Suspicious</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Login History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Login Attempts ({filteredLogs.length})</CardTitle>
          <CardDescription>Recent login attempts and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Session</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => {
                const StatusIcon = getStatusIcon(log.status)
                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-sm text-muted-foreground">{log.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span className="text-sm">{log.timestamp}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <div>
                          <div className="text-sm">{log.location}</div>
                          <div className="text-xs text-muted-foreground">{log.ipAddress}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{log.device}</div>
                        <div className="text-xs text-muted-foreground">{log.browser}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(log.status) as any}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {log.status}
                      </Badge>
                      {log.failureReason && (
                        <div className="text-xs text-muted-foreground mt-1">{log.failureReason}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {log.sessionDuration ? (
                        <Badge variant="outline">{log.sessionDuration}</Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleLogAction(log.id, "view")}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {(log.status === "suspicious" || log.status === "failed") && (
                            <DropdownMenuItem onClick={() => handleLogAction(log.id, "block-ip")}>
                              <Shield className="mr-2 h-4 w-4" />
                              Block IP
                            </DropdownMenuItem>
                          )}
                          {log.status === "suspicious" && (
                            <DropdownMenuItem onClick={() => handleLogAction(log.id, "investigate")}>
                              <AlertTriangle className="mr-2 h-4 w-4" />
                              Investigate
                            </DropdownMenuItem>
                          )}
                          {log.status === "success" && (
                            <DropdownMenuItem onClick={() => handleLogAction(log.id, "whitelist")}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Whitelist IP
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

      {/* Login Details Modal */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Login Details</DialogTitle>
            <DialogDescription>Detailed information about this login attempt</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">User</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.userName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Timestamp</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.timestamp}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">IP Address</label>
                  <p className="text-sm text-muted-foreground font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.location}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Device</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.device}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Browser</label>
                  <p className="text-sm text-muted-foreground">{selectedLog.browser}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Badge variant={getStatusColor(selectedLog.status) as any}>{selectedLog.status}</Badge>
                </div>
                {selectedLog.sessionDuration && (
                  <div>
                    <label className="text-sm font-medium">Session Duration</label>
                    <p className="text-sm text-muted-foreground">{selectedLog.sessionDuration}</p>
                  </div>
                )}
              </div>
              {selectedLog.failureReason && (
                <div>
                  <label className="text-sm font-medium">Failure Reason</label>
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="text-sm">{selectedLog.failureReason}</p>
                  </div>
                </div>
              )}
              <div className="flex space-x-2 pt-4">
                {(selectedLog.status === "suspicious" || selectedLog.status === "failed") && (
                  <Button onClick={() => handleLogAction(selectedLog.id, "block-ip")}>
                    <Shield className="mr-2 h-4 w-4" />
                    Block IP
                  </Button>
                )}
                {selectedLog.status === "suspicious" && (
                  <Button variant="outline" onClick={() => handleLogAction(selectedLog.id, "investigate")}>
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Investigate
                  </Button>
                )}
                {selectedLog.status === "success" && (
                  <Button variant="outline" onClick={() => handleLogAction(selectedLog.id, "whitelist")}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Whitelist IP
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
