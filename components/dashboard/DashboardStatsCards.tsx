import GlobalCard from "@/components/common/GlobalCard";
import { TrendingUp, TrendingDown, DollarSign, Package, Users, ShoppingCart } from "lucide-react";
import React from "react";

const stats = [
  {
    title: "Total Revenue",
    value: "Rs.45,231.89",
    trend: "up",
    trendValue: "+20.1% from last month",
    valueClass: "mt-2",
  },
  {
    title: "Orders",
    value: "2,350",
    trend: "up",
    trendValue: "+180.1% from last month",
    valueClass: "mt-2",
  },
  {
    title: "Products",
    value: "1,234",
    trend: "up",
    trendValue: "+19% from last month",
    valueClass: "mt-2",
  },
  {
    title: "Customers",
    value: "573",
    trend: "down",
    trendValue: "-2% from last month",
    valueClass: "mt-2",
  },
];

export default function DashboardStatsCards() {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-1 ">
      {stats.map((stat) => (
        <GlobalCard
          key={stat.title}
          title={stat.title}
          content={
            <>
              <div className={`text-lg sm:text-lg font-semibold ${stat.valueClass}`}>{stat.value}</div>
              <div className="flex items-center justify-end text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                {stat.trendValue}
              </div>
            </>
          }
          headerClassName="flex flex-row items-center justify-between pb-2 "
        />
      ))}
    </div>
  );
}