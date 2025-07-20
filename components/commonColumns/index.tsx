import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { GlobalDialog } from "@/components/common/GlobalDialog";
import React from "react";
import { LabelValueRow } from "@/components/common/LabelValueRow";
import { OrderSummaryCard } from "@/components/common/OrderSummaryCard";
import moment from "moment";

const getStatusBadge = (status: string) => {
  console.log("getStatusBadge called with status:", status);
  if (status === "paid") {
    return <Badge variant="default">Paid</Badge>;
  } else if (status === "unpaid") {
    return <Badge variant="secondary">Unpaid</Badge>;
  } else if (status === "active") {
    return <Badge variant="default">Active</Badge>;
  } else {
    return <Badge variant="secondary">Inactive</Badge>;
  }
};

// Common function for status badge (handles both payment and purchase status)
const getStatusBadgeCommon = (status: string) => {
  let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  let label = status;
  switch (status) {
    case "pending":
      variant = "secondary";
      label = "Pending";
      break;
    case "paid":
      variant = "default";
      label = "Paid";
      break;
    case "partial":
      variant = "outline";
      label = "Partial";
      break;
    case "failed":
      variant = "destructive";
      label = "Failed";
      break;
    case "laterOn":
      variant = "secondary";
      label = "Later On";
      break;
    case "hold":
      variant = "secondary";
      label = "Hold";
      break;
    case "purchased":
      variant = "default";
      label = "Purchased";
      break;
    case "notPurchased":
      variant = "destructive";
      label = "Not Purchased";
      break;
    case "completed":
      variant = "default";
      label = "Completed";
      break;
    default:
      label = status || "Unknown";
      variant = "outline";
  }
  return <Badge variant={variant}>{label}</Badge>;
};

export const customerTableColumn = (
  selectedCustomer: any,
  handleModalOpen: (customer: any) => void
) => {
  return [
    {
      header: "Customer",
      cell: (customer: any) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <p className="font-medium">{customer?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {customer?.address?.street}
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <div className="space-y-2">
                <p className="font-medium">{customer?.name}</p>
                {customer?.notes ? (
                  <p className="text-sm">{customer?.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No notes available
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      header: "Contact",
      cell: (customer: any) => (
        <div>
          <p className="text-sm">{customer?.email}</p>
          <p className="text-sm text-muted-foreground">{customer?.phone}</p>
        </div>
      ),
    },
    {
      header: "Group Type",
      cell: (customer: any) => (
        <div>
          <p className="text-sm font-medium">{customer?.groupType || "-"}</p>
        </div>
      ),
    },
    {
      header: "Orders",
      cell: (customer: any) => customer.totalOrders ?? "-",
    },
    {
      header: "Total Spent",
      cell: (customer: any) => (
        <span className="font-medium">Rs.{customer?.totalSpent ?? "-"}</span>
      ),
    },
    {
      header: "Last Purchase Date",
      cell: (customer: any) => (
        <span className="font-medium">{customer?.lastPurchaseDate ? moment(customer.lastPurchaseDate).format("DD MMM YYYY, hh:mm A") : "-"}</span>
      ),
    },
    {
      header: "Total Visit",
      cell: (customer: any) => (
        <span className="font-medium">{customer?.totalVisitCount ?? 0}</span>
      ),
    },
    {
      header: "Wishlist Products",
      cell: (customer: any) => (
        <span className="font-medium">
          {customer?.wishlistProducts?.length ?? "-"}
        </span>
      ),
    },

    {
      header: "Status",
      cell: (customer: any) => getStatusBadge(customer?.status),
    },
    {
      header: "Created On",
      cell: (customer: any) => (
        <span className="font-medium">{customer?.createdAt ? moment(customer.createdAt).format("DD MMM YYYY, hh:mm A") : "-"}</span>
      ),
    },
    {
      header: "Actions",
      cell: (customer: any) => (
        <GlobalDialog
          trigger={
            <Button variant="outline" size="icon" onClick={handleModalOpen}>
              <Eye className="h-4 w-4" />
            </Button>
          }
          title="Customer Details"
          contentClassName="max-w-2xl"
        >
          {customer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <LabelValueRow label="Name:" value={customer.name} />
                  <LabelValueRow label="Email:" value={customer.email} />
                  <LabelValueRow label="Phone:" value={customer.phone} />
                  <LabelValueRow
                    label="Status:"
                    value={getStatusBadge(customer.status)}
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Purchase History</h3>
                  <LabelValueRow
                    label="Total Orders:"
                    value={customer.totalOrders}
                  />
                  <LabelValueRow
                    label="Total Spent:"
                    value={`$${customer.totalSpent}`}
                  />
                  <LabelValueRow
                    label="Avg Order:"
                    value={`$${(
                      customer.totalSpent / customer.totalOrders
                    ).toFixed(2)}`}
                  />
                  <LabelValueRow
                    label="Last Order:"
                    value={customer.lastOrder}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Recent Orders</h3>
                <div className="space-y-2">
                  <OrderSummaryCard
                    orderNumber={3210}
                    date="2024-01-15"
                    amount={125.5}
                    status="completed"
                  />
                  <OrderSummaryCard
                    orderNumber={3205}
                    date="2024-01-10"
                    amount={89.99}
                    status="completed"
                  />
                  <OrderSummaryCard
                    orderNumber={3205}
                    date="2024-01-10"
                    amount={89.99}
                    status="completed"
                  />
                </div>
              </div>
            </div>
          )}
        </GlobalDialog>
      ),
    },
  ];
};

export const invoiceColumn = [
  {
    header: "Invoice ID",
    cell: (row: any) => {
      return <span className="font-mono">{row?.invoiceNumber}</span>;
    },
  },

  {
    header: "Customer",
    cell: (row: any) => (
      <div className="flex items-center space-x-2">
        <div>
          <p className="font-medium">
            {row?.customerName || row?.customer?.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {row?.customer?.phone}
          </p>
        </div>
        <GlobalDialog
          trigger={
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          }
          title="Customer Details"
          contentClassName="max-w-md"
        >
          <div className="space-y-4">
            <LabelValueRow label="Name:" value={row?.customer?.name} />
            <LabelValueRow label="Phone:" value={row?.customer?.phone} />
            <LabelValueRow label="Email:" value={row?.customer?.email} />
            <LabelValueRow label="Address:" value={row?.customer?.address} />
          </div>
        </GlobalDialog>
      </div>
    ),
  },
  {
    header: "Initial Amount",
    cell: (row: any) => (
      <div>
        <p className="text-sm text-muted-foreground">
          Rs.{row?.intialTotalPrice }
        </p>
      </div>
    ),
  },
  {
    header: "Total GST Amount",
    cell: (row: any) => {
      return <div> Rs.{row?.gstTotalAmount}</div>;
    },
  },
  {
    header: "Total Discount",
    cell: (row: any) => {
      return <div>Rs. {row?.totalDiscount}</div>;
    },
  },
  {
    header: "Final Price",
    cell: (row: any) => {
      return <div>Rs.{row?.totalFinalPrice}</div>;
    },
  },
  {
    header: "Purchase Status",
    cell: (row: any) => getStatusBadgeCommon(row?.purchaseStatus),
  },
  {
    header: "Payment Status",
    cell: (row: any) => getStatusBadgeCommon(row?.paymentStatus),
  },
  {
    header: "Payment Method",
    cell: (row: any) => row?.paymentMethod,
  },
  {
    header: "Created On",
    cell: (row: any) => row?.createdAt ? moment(row.createdAt).format("DD MMM YYYY, hh:mm A") : "-",
  },
  {
    header: "Sold By (Staff)",
    cell: (row: any) => {
      return <span className="font-mono">{row?.soldBy?.name}</span>;
    },
  },
  {
    header: "Actions",
    cell: (row: any) => (
      <div className="flex justify-end space-x-2">
        <GlobalDialog
          trigger={
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          }
          title="Invoice Details"
          contentClassName="max-w-2xl"
        >
          {/* Your dialog content here */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Bill To:</h3>
                <LabelValueRow
                  label="Name:"
                  value={row?.customerName || row?.customer}
                />
                <LabelValueRow label="Email:" value={row?.email} />
                <LabelValueRow
                  label="Phone:"
                  value={row?.customerMobile || row?.phone}
                />
                <LabelValueRow label="Address:" value={row?.customerAddress} />
              </div>
              <div className="text-right">
                <p>
                  <strong>Invoice Date:</strong>{" "}
                  {row?.customerDate || row?.date}
                </p>
                <p>
                  <strong>Created:</strong> {row?.createdAt}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {getStatusBadge(row?.customerStatus || row?.status)}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Items:</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>GST</TableHead>
                    <TableHead className="text-right">Final Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {row?.products?.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item?.serialNumber || item?.name}</TableCell>
                      <TableCell>{item?.type}</TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>${item?.rate || item?.price}</TableCell>
                      <TableCell>
                        {item?.discountPercentage
                          ? `${item.discountPercentage}% ($${item.discountAmount})`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {item?.gstPercentage
                          ? `${item.gstPercentage}% ($${item.gstAmount})`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        $
                        {item?.finalPrice?.toFixed(2) ||
                          (
                            item?.quantity * (item?.rate || item?.price)
                          ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">
                Total: $
                {row?.products
                  ?.reduce(
                    (sum: number, product: any) =>
                      sum + (product.finalPrice || product.price),
                    0
                  )
                  ?.toFixed(2) || row?.amount}
              </p>
            </div>
          </div>
        </GlobalDialog>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
