"use client"

import { useState } from "react"
import { BarChart3, Calendar, Download, FileText, Printer, TrendingDown, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Sample data for reports
const salesData = [
  { date: "2024-01-15", sales: 12450, orders: 8, avgOrder: 1556 },
  { date: "2024-01-14", sales: 8750, orders: 5, avgOrder: 1750 },
  { date: "2024-01-13", sales: 15200, orders: 12, avgOrder: 1267 },
  { date: "2024-01-12", sales: 9800, orders: 6, avgOrder: 1633 },
  { date: "2024-01-11", sales: 18900, orders: 15, avgOrder: 1260 },
  { date: "2024-01-10", sales: 11200, orders: 7, avgOrder: 1600 },
  { date: "2024-01-09", sales: 13500, orders: 9, avgOrder: 1500 },
]

const productPerformance = [
  {
    product: "Product A",
    sku: "ABC123",
    unitsSold: 45,
    revenue: 13455,
    profit: 4500,
    margin: "33.4%",
    trend: "up",
  },
  {
    product: "Product B",
    sku: "DEF456",
    unitsSold: 32,
    revenue: 4800,
    profit: 1600,
    margin: "33.3%",
    trend: "up",
  },
  {
    product: "Product C",
    sku: "GHI789",
    unitsSold: 18,
    revenue: 8100,
    profit: 2430,
    margin: "30.0%",
    trend: "down",
  },
  {
    product: "Product D",
    sku: "JKL012",
    unitsSold: 28,
    revenue: 5572,
    profit: 1671,
    margin: "30.0%",
    trend: "up",
  },
]

const categoryPerformance = [
  { category: "Electronics", sales: 25000, percentage: 45, growth: "+12%" },
  { category: "Clothing", sales: 15000, percentage: 27, growth: "+8%" },
  { category: "Home", sales: 10000, percentage: 18, growth: "-3%" },
  { category: "Books", sales: 5500, percentage: 10, growth: "+15%" },
]

const staffPerformance = [
  { name: "John Smith", sales: 45000, orders: 120, avgOrder: 375, commission: 2250 },
  { name: "Jane Doe", sales: 38000, orders: 95, avgOrder: 400, commission: 1900 },
  { name: "Bob Wilson", sales: 32000, orders: 80, avgOrder: 400, commission: 1600 },
]

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("week")
  const [reportType, setReportType] = useState("sales")

  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0)
  const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalSales / totalOrders
  const salesGrowth = ((salesData[0].sales - salesData[6].sales) / salesData[6].sales) * 100

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Reports & Analytics</h1>
            <p className="text-sm text-muted-foreground">View sales and performance reports</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />+{salesGrowth.toFixed(1)}% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">{Math.round(totalOrders / 7)} orders/day average</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Math.round(avgOrderValue)}</div>
              <p className="text-xs text-muted-foreground">+5.2% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.1%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Reports Tabs */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Sales Report</TabsTrigger>
            <TabsTrigger value="products">Product Performance</TabsTrigger>
            <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          </TabsList>

          {/* Sales Report */}
          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Sales Report</CardTitle>
                <CardDescription>Sales performance over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sales Amount</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Avg Order Value</TableHead>
                      <TableHead>Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((day, index) => {
                      const prevDay = salesData[index + 1]
                      const growth = prevDay ? ((day.sales - prevDay.sales) / prevDay.sales) * 100 : 0

                      return (
                        <TableRow key={day.date}>
                          <TableCell className="font-medium">{day.date}</TableCell>
                          <TableCell>₹{day.sales.toLocaleString()}</TableCell>
                          <TableCell>{day.orders}</TableCell>
                          <TableCell>₹{day.avgOrder}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {growth > 0 ? (
                                <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
                              ) : (
                                <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
                              )}
                              <span className={growth > 0 ? "text-green-600" : "text-red-600"}>
                                {growth > 0 ? "+" : ""}
                                {growth.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Sales Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>Visual representation of sales over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Sales Chart Visualization</p>
                    <p className="text-sm text-muted-foreground">Chart component would be integrated here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Product Performance */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance Report</CardTitle>
                <CardDescription>Top performing products by sales and profit</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Units Sold</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Profit</TableHead>
                      <TableHead>Margin</TableHead>
                      <TableHead>Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productPerformance.map((product) => (
                      <TableRow key={product.sku}>
                        <TableCell className="font-medium">{product.product}</TableCell>
                        <TableCell>{product.sku}</TableCell>
                        <TableCell>{product.unitsSold}</TableCell>
                        <TableCell>₹{product.revenue.toLocaleString()}</TableCell>
                        <TableCell>₹{product.profit.toLocaleString()}</TableCell>
                        <TableCell>{product.margin}</TableCell>
                        <TableCell>
                          <Badge variant={product.trend === "up" ? "default" : "secondary"}>
                            {product.trend === "up" ? (
                              <TrendingUp className="mr-1 h-3 w-3" />
                            ) : (
                              <TrendingDown className="mr-1 h-3 w-3" />
                            )}
                            {product.trend === "up" ? "Rising" : "Declining"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>By units sold this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productPerformance
                      .sort((a, b) => b.unitsSold - a.unitsSold)
                      .slice(0, 3)
                      .map((product, index) => (
                        <div key={product.sku} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.product}</p>
                              <p className="text-sm text-muted-foreground">{product.sku}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{product.unitsSold} units</p>
                            <p className="text-sm text-muted-foreground">₹{product.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Profitable Products</CardTitle>
                  <CardDescription>By profit margin this week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productPerformance
                      .sort((a, b) => Number.parseFloat(b.margin) - Number.parseFloat(a.margin))
                      .slice(0, 3)
                      .map((product, index) => (
                        <div key={product.sku} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{product.product}</p>
                              <p className="text-sm text-muted-foreground">{product.sku}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{product.margin}</p>
                            <p className="text-sm text-muted-foreground">₹{product.profit.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Category Analysis */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Sales breakdown by product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {categoryPerformance.map((category) => (
                    <div key={category.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{category.category}</h4>
                          <Badge variant="outline">{category.growth}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{category.sales.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{category.percentage}% of total</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Staff Performance */}
          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance Report</CardTitle>
                <CardDescription>Individual staff member sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Member</TableHead>
                      <TableHead>Total Sales</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Avg Order Value</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Performance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffPerformance.map((staff, index) => (
                      <TableRow key={staff.name}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>₹{staff.sales.toLocaleString()}</TableCell>
                        <TableCell>{staff.orders}</TableCell>
                        <TableCell>₹{staff.avgOrder}</TableCell>
                        <TableCell>₹{staff.commission.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                            {index === 0 ? "Excellent" : index === 1 ? "Good" : "Average"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Custom Report Generator */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Report Generator</CardTitle>
            <CardDescription>Generate custom reports with specific parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="grid gap-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="inventory">Inventory Report</SelectItem>
                    <SelectItem value="customer">Customer Report</SelectItem>
                    <SelectItem value="expense">Expense Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input type="date" id="start-date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input type="date" id="end-date" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="format">Export Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Generate Report</Button>
              <Button variant="outline" className="bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
