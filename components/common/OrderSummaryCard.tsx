import { Badge } from "@/components/ui/badge";
import React from "react";

interface OrderSummaryCardProps {
  orderNumber: string | number;
  date: string;
  amount: number;
  status: string;
}

const getStatusBadge = (status: string) => {
  if (status === "completed" || status === "paid") {
    return <Badge variant="default">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  } else if (status === "unpaid" || status === "pending") {
    return <Badge variant="secondary">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  } else {
    return <Badge variant="outline">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
  }
};

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  orderNumber,
  date,
  amount,
  status,
}) => (
  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
    <div>
      <p className="font-medium">Order #{orderNumber}</p>
      <p className="text-sm text-muted-foreground">{date}</p>
    </div>
    <div className="text-right">
      <p className="font-medium">${amount.toFixed(2)}</p>
      {getStatusBadge(status)}
    </div>
  </div>
); 