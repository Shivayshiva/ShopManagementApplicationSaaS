"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useToast } from "@/hooks/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Users, TrendingUp, UserPlus, UserMinus, Download, RefreshCw } from "lucide-react"

const users = [
  {
    id: 1,
    name: "Amit Singh",
    email: "amit@shopwave.com",
    role: "Owner",
    status: "suspended",
    shop: "Tech Bazaar",
    joinDate: "2024-12-01",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@fashionloop.com",
    role: "Manager",
    status: "suspended",
    shop: "Fashion Loop",
    joinDate: "2024-11-21",
  },
  {
    id: 3,
    name: "Ravi Verma",
    email: "ravi@megastore.com",
    role: "Staff",
    status: "active",
    shop: "Mega Store",
    joinDate: "2024-10-13",
  },
  {
    id: 4,
    name: "Sneha Joshi",
    email: "sneha@dailyneeds.com",
    role: "Manager",
    status: "suspended",
    shop: "Daily Needs",
    joinDate: "2025-01-10",
  },
  {
    id: 5,
    name: "Arjun Patel",
    email: "arjun@freshmart.com",
    role: "Owner",
    status: "active",
    shop: "Fresh Mart",
    joinDate: "2023-09-05",
  },
  {
    id: 6,
    name: "Kiran Mehta",
    email: "kiran@hitech.com",
    role: "Staff",
    status: "suspended",
    shop: "HiTech Plaza",
    joinDate: "2025-02-14",
  },
  {
    id: 7,
    name: "Neha Gupta",
    email: "neha@bazaar.in",
    role: "Manager",
    status: "active",
    shop: "City Bazaar",
    joinDate: "2023-12-19",
  },
  {
    id: 8,
    name: "Suresh Kumar",
    email: "suresh@mobizone.com",
    role: "Owner",
    status: "active",
    shop: "MobiZone",
    joinDate: "2022-08-08",
  },
  {
    id: 9,
    name: "Divya Rao",
    email: "divya@bookbarn.com",
    role: "Staff",
    status: "suspended",
    shop: "Book Barn",
    joinDate: "2024-07-17",
  },
  {
    id: 10,
    name: "Manoj Yadav",
    email: "manoj@foodmart.com",
    role: "Staff",
    status: "active",
    shop: "Food Mart",
    joinDate: "2024-05-23",
  },
]


const userGrowthData = [
  { month: "Jan", newUsers: 145, activeUsers: 1250, churnedUsers: 23 },
  { month: "Feb", newUsers: 167, activeUsers: 1394, churnedUsers: 31 },
  { month: "Mar", newUsers: 189, activeUsers: 1552, churnedUsers: 28 },
  { month: "Apr", newUsers: 203, activeUsers: 1727, churnedUsers: 35 },
  { month: "May", newUsers: 178, activeUsers: 1870, churnedUsers: 42 },
  { month: "Jun", newUsers: 234, activeUsers: 2062, churnedUsers: 38 },
  { month: "Jul", newUsers: 256, activeUsers: 2280, churnedUsers: 45 },
  { month: "Aug", newUsers: 221, activeUsers: 2456, churnedUsers: 52 },
  { month: "Sep", newUsers: 289, activeUsers: 2693, churnedUsers: 41 },
  { month: "Oct", newUsers: 267, activeUsers: 2919, churnedUsers: 48 },
  { month: "Nov", newUsers: 312, activeUsers: 3183, churnedUsers: 39 },
  { month: "Dec", newUsers: 298, activeUsers: 3442, churnedUsers: 44 },
]

const roleDistributionData = [
  { name: "Shop Owners", value: 35, color: "#8884d8" },
  { name: "Managers", value: 25, color: "#82ca9d" },
  { name: "Staff", value: 40, color: "#ffc658" },
]

const userActivityData = [
  { day: "Mon", logins: 1250, orders: 340 },
  { day: "Tue", logins: 1380, orders: 420 },
  { day: "Wed", logins: 1520, orders: 380 },
  { day: "Thu", logins: 1420, orders: 450 },
  { day: "Fri", logins: 1680, orders: 520 },
  { day: "Sat", logins: 1340, orders: 380 },
  { day: "Sun", logins: 1180, orders: 290 },
]

const engagementData = [
  { metric: "Daily Active", value: 2450, change: 12 },
  { metric: "Weekly Active", value: 5680, change: 8 },
  { metric: "Monthly Active", value: 12340, change: 15 },
  { metric: "Session Duration", value: 24, change: -3 },
]

export default function UserAnalyticsPage() {
  const { toast } = useToast()
  const [timePeriod, setTimePeriod] = useState("12months")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "User analytics data has been updated.",
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["Month", "New Users", "Active Users", "Churned Users"],
      ...userGrowthData.map((item) => [item.month, item.newUsers, item.activeUsers, item.churnedUsers]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "user-analytics.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "User analytics data has been exported to CSV.",
    })
  }

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+18% from last month",
      icon: Users,
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      change: "+12% from last month",
      icon: TrendingUp,
    },
    {
      title: "New This Month",
      value: "298",
      change: "+8% from last month",
      icon: UserPlus,
    },
    {
      title: "Churn Rate",
      value: "1.3%",
      change: "-0.2% from last month",
      icon: UserMinus,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">User Analytics</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time period" />
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
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* User Growth Trend */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>User acquisition and retention over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                newUsers: {
                  label: "New Users",
                  color: "hsl(var(--chart-1))",
                },
                activeUsers: {
                  label: "Active Users",
                  color: "hsl(var(--chart-2))",
                },
                churnedUsers: {
                  label: "Churned Users",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="activeUsers"
                    stackId="1"
                    stroke="var(--color-activeUsers)"
                    fill="var(--color-activeUsers)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="newUsers"
                    stackId="2"
                    stroke="var(--color-newUsers)"
                    fill="var(--color-newUsers)"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>Distribution of users by their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                owners: { label: "Shop Owners", color: "#8884d8" },
                managers: { label: "Managers", color: "#82ca9d" },
                staff: { label: "Staff", color: "#ffc658" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {roleDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Daily User Activity</CardTitle>
            <CardDescription>Daily logins and order activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                logins: {
                  label: "Logins",
                  color: "hsl(var(--chart-1))",
                },
                orders: {
                  label: "Orders",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="logins" fill="var(--color-logins)" />
                  <Bar dataKey="orders" fill="var(--color-orders)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {engagementData.map((metric) => (
          <Card key={metric.metric}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.metric === "Session Duration" ? `${metric.value}m` : metric.value.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className={metric.change > 0 ? "text-green-600" : "text-red-600"}>
                  {metric.change > 0 ? "+" : ""}
                  {metric.change}%
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Monthly User Acquisition */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly User Acquisition vs Churn</CardTitle>
          <CardDescription>Track user acquisition and churn patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              newUsers: {
                label: "New Users",
                color: "hsl(var(--chart-1))",
              },
              churnedUsers: {
                label: "Churned Users",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="var(--color-newUsers)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="churnedUsers"
                  stroke="var(--color-churnedUsers)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
