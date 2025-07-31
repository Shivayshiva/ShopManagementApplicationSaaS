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
import { Building2, TrendingUp, Users, DollarSign, Download, RefreshCw } from "lucide-react"

const shopGrowthData = [
  { month: "Jan", newShops: 12, activeShops: 45, churnedShops: 2 },
  { month: "Feb", newShops: 18, activeShops: 61, churnedShops: 3 },
  { month: "Mar", newShops: 15, activeShops: 73, churnedShops: 4 },
  { month: "Apr", newShops: 22, activeShops: 91, churnedShops: 2 },
  { month: "May", newShops: 19, activeShops: 108, churnedShops: 5 },
  { month: "Jun", newShops: 25, activeShops: 128, churnedShops: 3 },
  { month: "Jul", newShops: 28, activeShops: 153, churnedShops: 4 },
  { month: "Aug", newShops: 24, activeShops: 173, churnedShops: 6 },
  { month: "Sep", newShops: 31, activeShops: 198, churnedShops: 3 },
  { month: "Oct", newShops: 27, activeShops: 222, churnedShops: 5 },
  { month: "Nov", newShops: 33, activeShops: 250, churnedShops: 4 },
  { month: "Dec", newShops: 29, activeShops: 275, churnedShops: 2 },
]

const planDistributionData = [
  { name: "Basic", value: 45, color: "#8884d8" },
  { name: "Pro", value: 30, color: "#82ca9d" },
  { name: "Premium", value: 20, color: "#ffc658" },
  { name: "Enterprise", value: 5, color: "#ff7300" },
]

const shopPerformanceData = [
  { category: "E-commerce", shops: 85, avgRevenue: 2500 },
  { category: "Services", shops: 62, avgRevenue: 1800 },
  { category: "Digital Products", shops: 43, avgRevenue: 3200 },
  { category: "Marketplace", shops: 28, avgRevenue: 4100 },
  { category: "Subscription", shops: 35, avgRevenue: 2900 },
]


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

export default function ShopAnalyticsPage() {
  const { toast } = useToast()
  const [timePeriod, setTimePeriod] = useState("12months")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Shop analytics data has been updated.",
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["Month", "New Shops", "Active Shops", "Churned Shops"],
      ...shopGrowthData.map((item) => [item.month, item.newShops, item.activeShops, item.churnedShops]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "shop-analytics.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Shop analytics data has been exported to CSV.",
    })
  }

  const stats = [
    {
      title: "Total Shops",
      value: shops.length.toString(),
      change: "+12% from last month",
      icon: Building2,
    },
    {
      title: "Active Shops",
      value: shops.filter((s) => s.status === "active").length.toString(),
      change: "+8% from last month",
      icon: TrendingUp,
    },
    {
      title: "Avg Users per Shop",
      value: "8.5",
      change: "+15% from last month",
      icon: Users,
    },
    {
      title: "Avg Revenue per Shop",
      value: "$2,450",
      change: "+22% from last month",
      icon: DollarSign,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Shop Analytics</h2>
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
        {/* Shop Growth Trend */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Shop Growth Trend</CardTitle>
            <CardDescription>New shop registrations and churn over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                newShops: {
                  label: "New Shops",
                  color: "hsl(var(--chart-1))",
                },
                activeShops: {
                  label: "Active Shops",
                  color: "hsl(var(--chart-2))",
                },
                churnedShops: {
                  label: "Churned Shops",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={shopGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="activeShops"
                    stackId="1"
                    stroke="var(--color-activeShops)"
                    fill="var(--color-activeShops)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="newShops"
                    stackId="2"
                    stroke="var(--color-newShops)"
                    fill="var(--color-newShops)"
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Distribution of shops across subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                basic: { label: "Basic", color: "#8884d8" },
                pro: { label: "Pro", color: "#82ca9d" },
                premium: { label: "Premium", color: "#ffc658" },
                enterprise: { label: "Enterprise", color: "#ff7300" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Shop Performance by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Category</CardTitle>
            <CardDescription>Shop count and average revenue by business category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                shops: {
                  label: "Shops",
                  color: "hsl(var(--chart-1))",
                },
                avgRevenue: {
                  label: "Avg Revenue",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shopPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar yAxisId="left" dataKey="shops" fill="var(--color-shops)" />
                  <Bar yAxisId="right" dataKey="avgRevenue" fill="var(--color-avgRevenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly New Shops */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly New Shop Registrations</CardTitle>
          <CardDescription>Track new shop sign-ups and churn patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              newShops: {
                label: "New Shops",
                color: "hsl(var(--chart-1))",
              },
              churnedShops: {
                label: "Churned Shops",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={shopGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="newShops"
                  stroke="var(--color-newShops)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="churnedShops"
                  stroke="var(--color-churnedShops)"
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
