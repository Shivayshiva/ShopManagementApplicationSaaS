"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/CommonCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { Download, TrendingUp, DollarSign, Package, Users, ShoppingCart, Calendar, FileText } from "lucide-react"

const salesData = [
  { month: "Jan", revenue: 4000, orders: 240, customers: 120 },
  { month: "Feb", revenue: 3000, orders: 198, customers: 110 },
  { month: "Mar", revenue: 5000, orders: 300, customers: 150 },
  { month: "Apr", revenue: 4500, orders: 278, customers: 140 },
  { month: "May", revenue: 6000, orders: 389, customers: 180 },
  { month: "Jun", revenue: 5500, orders: 349, customers: 165 },
]

const categoryData = [
  { name: "Electronics", value: 35, revenue: 15750 },
  { name: "Clothing", value: 25, revenue: 11250 },
  { name: "Books", value: 20, revenue: 9000 },
  { name: "Home", value: 20, revenue: 9000 },
]

const topProducts = [
  { name: "Wireless Headphones", sales: 234, revenue: 23400 },
  { name: "Smart Watch", sales: 189, revenue: 18900 },
  { name: "Laptop Stand", sales: 156, revenue: 7800 },
  { name: "USB Cable", sales: 145, revenue: 2900 },
  { name: "Phone Case", sales: 123, revenue: 3690 },
]

const expenseData = [
  { month: "Jan", expenses: 2500 },
  { month: "Feb", expenses: 2200 },
  { month: "Mar", expenses: 2800 },
  { month: "Apr", expenses: 2600 },
  { month: "May", expenses: 3200 },
  { month: "Jun", expenses: 2900 },
]

export default function ReportsPage() {
  const totalRevenue = salesData.reduce((sum, item) => sum + item.revenue, 0)
  const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0)
  const totalCustomers = Math.max(...salesData.map((item) => item.customers))
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.expenses, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +8.2% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +15.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue - totalExpenses).toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +18.7% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders vs Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="customers" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  <Cell fill="#8884d8" />
                  <Cell fill="#82ca9d" />
                  <Cell fill="#ffc658" />
                  <Cell fill="#ff7300" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={salesData.map((item, index) => ({
                  ...item,
                  expenses: expenseData[index]?.expenses || 0,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="revenue" fill="#8884d8" />
                <Bar dataKey="expenses" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products and Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Order Value</span>
                <span className="text-lg font-bold">${(totalRevenue / totalOrders).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Lifetime Value</span>
                <span className="text-lg font-bold">${(totalRevenue / totalCustomers).toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Profit Margin</span>
                <span className="text-lg font-bold">
                  {(((totalRevenue - totalExpenses) / totalRevenue) * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monthly Growth Rate</span>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-lg font-bold text-green-500">+12.5%</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Detailed Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
