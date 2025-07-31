"use client"

import { useState } from "react"
import { Calendar, Clock, LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const attendanceRecords = [
  {
    date: "2024-01-15",
    clockIn: "09:00 AM",
    clockOut: "06:30 PM",
    totalHours: "9h 30m",
    status: "Present",
    sales: "₹12,450",
  },
  {
    date: "2024-01-14",
    clockIn: "09:15 AM",
    clockOut: "06:00 PM",
    totalHours: "8h 45m",
    status: "Present",
    sales: "₹8,750",
  },
  {
    date: "2024-01-13",
    clockIn: "09:30 AM",
    clockOut: "06:15 PM",
    totalHours: "8h 45m",
    status: "Late",
    sales: "₹15,200",
  },
  {
    date: "2024-01-12",
    clockIn: "-",
    clockOut: "-",
    totalHours: "-",
    status: "Absent",
    sales: "₹0",
  },
  {
    date: "2024-01-11",
    clockIn: "08:45 AM",
    clockOut: "06:45 PM",
    totalHours: "10h 00m",
    status: "Present",
    sales: "₹18,900",
  },
]

export default function AttendancePage() {
  const [isClocked, setIsClocked] = useState(true)
  const [currentTime] = useState("2:30 PM")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present":
        return "default"
      case "Late":
        return "secondary"
      case "Absent":
        return "destructive"
      default:
        return "outline"
    }
  }

  const totalHoursThisWeek = "42h 15m"
  const averageHoursPerDay = "8h 27m"
  const totalSalesThisWeek = "₹55,300"

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Shift & Attendance</h1>
            <p className="text-sm text-muted-foreground">Track your working hours and attendance</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isClocked ? "default" : "outline"} className="text-sm">
              <Clock className="mr-1 h-3 w-3" />
              {isClocked ? `Clocked In: 9:00 AM` : "Not Clocked In"}
            </Badge>
            <span className="text-sm text-muted-foreground">Current: {currentTime}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Clock In/Out Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Clock In/Out</CardTitle>
              <CardDescription>Mark your attendance for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold">{currentTime}</div>
                <div className="text-sm text-muted-foreground">Monday, January 15, 2024</div>
              </div>

              <div className="flex gap-2">
                {!isClocked ? (
                  <Button className="flex-1" onClick={() => setIsClocked(true)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Clock In
                  </Button>
                ) : (
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setIsClocked(false)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Clock Out
                  </Button>
                )}
              </div>

              {isClocked && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    You've been working for <span className="font-semibold">5h 30m</span> today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
              <CardDescription>Your performance for today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">6.5h</div>
                  <div className="text-sm text-muted-foreground">Hours Worked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">₹12,450</div>
                  <div className="text-sm text-muted-foreground">Sales Made</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Shift Progress</span>
                  <span>6.5h / 8h</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "81.25%" }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hours (Week)</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalHoursThisWeek}</div>
              <p className="text-xs text-muted-foreground">Target: 40h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Hours/Day</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageHoursPerDay}</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSalesThisWeek}</div>
              <p className="text-xs text-muted-foreground">+12% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">80%</div>
              <p className="text-xs text-muted-foreground">4/5 days this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance History */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Your recent attendance and working hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Select defaultValue="week">
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell>{record.clockIn}</TableCell>
                    <TableCell>{record.clockOut}</TableCell>
                    <TableCell>{record.totalHours}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(record.status)}>{record.status}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{record.sales}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
