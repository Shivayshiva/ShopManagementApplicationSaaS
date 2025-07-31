import GlobalCard from "@/components/common/GlobalCard";
import { Badge } from "@/components/ui/badge";
import { recentOrders_dashboard, topProducts_dashboard } from "@/lib/dummyData";
import {
  TrendingUp,
  TrendingDown,
  Package,
} from "lucide-react";
import DashboardStatsCards from "@/components/dashboard/DashboardStatsCards";

export default function DashboardPage() {
  return (
    <div className="space-y-4 px-2 ">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Welcome back! Here's what's happening with your shop.
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStatsCards />

      {/* Recent Orders and Top Products */}

    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlobalCard
          title="Recent Orders"
          content={
            <div className="space-y-4">
              {recentOrders_dashboard?.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer}
                      </p>
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
                      <span className="text-xs text-muted-foreground">
                        {order.time}
                      </span>
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
                      <p className="text-sm text-muted-foreground">
                        {product.sales} sales
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ${product.revenue.toLocaleString()}
                    </p>
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
  );
}
