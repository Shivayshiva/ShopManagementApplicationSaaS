"use client"

import GlobalCard from "@/components/common/GlobalCard"
import { Badge } from "@/components/ui/badge"
import { recentOrders_dashboard, topProducts_dashboard } from "@/lib/dummyData"
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from "lucide-react"


export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your shop.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlobalCard
          title="Total Revenue"
          header={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          content={
            <>
              <div className="text-2xl font-bold">$45,231.89</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +20.1% from last month
              </div>
            </>
          }
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
        />
        <GlobalCard
          title="Orders"
          header={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          content={
            <>
              <div className="text-2xl font-bold">+2,350</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +180.1% from last month
              </div>
            </>
          }
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
        />
        <GlobalCard
          title="Products"
          header={<Package className="h-4 w-4 text-muted-foreground" />}
          content={
            <>
              <div className="text-2xl font-bold">1,234</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                +19% from last month
              </div>
            </>
          }
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
        />
        <GlobalCard
          title="Customers"
          header={<Users className="h-4 w-4 text-muted-foreground" />}
          content={
            <>
              <div className="text-2xl font-bold">573</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                -2% from last month
              </div>
            </>
          }
          headerClassName="flex flex-row items-center justify-between space-y-0 pb-2"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlobalCard
          title="Sales Overview"
          content={null}
        />
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlobalCard
          title="Recent Orders"
          content={
            <div className="space-y-4">
              {recentOrders_dashboard?.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${order.amount}</p>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          order.status === "completed"
                            ? "default"
                            : order.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {order.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{order.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        />
        <GlobalCard
          title="Top Products"
          content={
            <div className="space-y-4">
              {topProducts_dashboard.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                    <div className="flex items-center">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        />
      </div>
    </div>
  )
}
