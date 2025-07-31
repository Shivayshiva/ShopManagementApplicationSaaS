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
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, RefreshCw } from "lucide-react"

const revenueData = [
  { month: "Jan", revenue: 45000, growth: 12, subscriptions: 234, churn: 5 },
  { month: "Feb", revenue: 52000, growth: 15, subscriptions: 267, churn: 8 },
  { month: "Mar", revenue: 48000, growth: -8, subscriptions: 251, churn: 12 },
  { month: "Apr", revenue: 61000, growth: 27, subscriptions: 289, churn: 6 },
  { month: "May", revenue: 55000, growth: -10, subscriptions: 276, churn: 15 },
  { month: "Jun", revenue: 67000, growth: 22, subscriptions: 312, churn: 9 },
  { month: "Jul", revenue: 71000, growth: 6, subscriptions: 328, churn: 7 },
  { month: "Aug", revenue: 69000, growth: -3, subscriptions: 321, churn: 11 },
  { month: "Sep", revenue: 78000, growth: 13, subscriptions: 345, churn: 8 },
  { month: "Oct", revenue: 82000, growth: 5, subscriptions: 356, churn: 6 },
  { month: "Nov", revenue: 89000, growth: 9, subscriptions: 378, churn: 4 },
  { month: "Dec", revenue: 95000, growth: 7, subscriptions: 392, churn: 5 },
]

const planRevenueData = [
  { name: "Basic", value: 234000, color: "#8884d8", subscribers: 234 },
  { name: "Pro", value: 456000, color: "#82ca9d", subscribers: 156 },
  { name: "Premium", value: 789000, color: "#ffc658", subscribers: 89 },
  { name: "Enterprise", value: 321000, color: "#ff7300", subscribers: 23 },
]

const dailyRevenueData = [
  { day: "Mon", revenue: 12000, transactions: 45 },
  { day: "Tue", revenue: 15000, transactions: 52 },
  { day: "Wed", revenue: 18000, transactions: 61 },
  { day: "Thu", revenue: 14000, transactions: 48 },
  { day: "Fri", revenue: 22000, transactions: 73 },
  { day: "Sat", revenue: 19000, transactions: 58 },
  { day: "Sun", revenue: 16000, transactions: 51 },
]

export default function RevenueAnalyticsPage() {
  const { toast } = useToast()
  const [timePeriod, setTimePeriod] = useState("12months")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const avgGrowth = revenueData.reduce((sum, item) => sum + item.growth, 0) / revenueData.length

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRefreshing(false)
    toast({
      title: "Data Refreshed",
      description: "Revenue analytics data has been updated.",
    })
  }

  const handleExport = () => {
    const csvContent = [
      ["Month", "Revenue", "Growth %", "Subscriptions", "Churn %"],
      ...revenueData.map((item) => [item.month, item.revenue, item.growth, item.subscriptions, item.churn]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "revenue-analytics.csv"
    a.click()

    toast({
      title: "Export Complete",
      description: "Revenue data has been exported to CSV.",
    })
  }

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: avgGrowth > 0 ? `+${avgGrowth.toFixed(1)}%` : `${avgGrowth.toFixed(1)}%`,
      changeType: avgGrowth > 0 ? "positive" : "negative",
      icon: DollarSign,
    },
    {
      title: "This Month",
      value: "$95,000",
      change: "+7%",
      changeType: "positive",
      icon: Calendar,
    },
    {
      title: "Average Monthly",
      value: `$${(totalRevenue / 12).toLocaleString()}`,
      change: "Based on 12 months",
      changeType: "neutral",
      icon: DollarSign,
    },
    {
      title: "Growth Rate",
      value: `${avgGrowth.toFixed(1)}%`,
      change: "Average monthly",
      changeType: avgGrowth > 0 ? "positive" : "negative",
      icon: avgGrowth > 0 ? TrendingUp : TrendingDown,
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Revenue Analytics</h2>
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

      {/* Revenue Stats */}
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
                <span
                  className={
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }
                >
                  {stat.changeType === "positive" && <TrendingUp className="inline h-3 w-3 mr-1" />}
                  {stat.changeType === "negative" && <TrendingDown className="inline h-3 w-3 mr-1" />}
                  {stat.change}
                </span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Revenue Trend */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Revenue performance over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                growth: {
                  label: "Growth %",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--color-revenue)"
                    fill="var(--color-revenue)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Revenue by Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Revenue distribution across subscription plans</CardDescription>
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
                    data={planRevenueData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {planRevenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Daily Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue (This Week)</CardTitle>
            <CardDescription>Daily revenue breakdown for the current week</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="var(--color-revenue)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Metrics</CardTitle>
          <CardDescription>Monthly subscription and churn analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              subscriptions: {
                label: "Subscriptions",
                color: "hsl(var(--chart-1))",
              },
              churn: {
                label: "Churn %",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="subscriptions"
                  stroke="var(--color-subscriptions)"
                  strokeWidth={2}
                />
                <Line yAxisId="right" type="monotone" dataKey="churn" stroke="var(--color-churn)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
