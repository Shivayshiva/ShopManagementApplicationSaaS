"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Eye,
  Users,
  DollarSign,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import GlobalTable from "@/components/common/GlobalTable";
import GlobalButton from "@/components/common/globalButton";
import { customerTableColumn } from "@/components/commonColumns";
import StatCard from "@/components/common/StatCard";
import Title from "@/components/common/Title";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Customer } from "@/lib/features/customerSlice";
import GlobalLoader from "@/components/common/GlobalLoader";
import ErrorMessage from "@/components/common/ErrorMessage";
import NoData from "@/components/common/NoData";

export default function CustomersPage() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchCustomers = async () => {
    const { data } = await axios.get(`/api/customers?page=${page}&limit=${limit}`);
    return data;
  };

  const {
    data: customers,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["customers", page, limit],
    queryFn: fetchCustomers,
  });

  console.log("_sdf_R_FGE_S_W",customers?.data)

  const totalCustomers = customers?.data?.length;
  const activeCustomers = customers?.data?.filter(
    (c: Customer) => c.status === "active"
  ).length;
  const totalRevenue = customers?.data?.reduce(
    (sum: number, c: Customer) => sum + (c.totalSpent || 0),
    0
  );
  const avgOrderValue =
    totalRevenue /
    customers?.data?.reduce(
      (sum: number, c: Customer) => sum + (c.totalOrders || 0),
      0
    );

  const handleModalOpen = (customer: Customer) => {
    setSelectedCustomer(customer);
  };

  return (
    <div className="space-y-4 px-2 sm:px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex flex-col gap-1">
          <Title
            title="Customers"
            subtitle="Manage customer relationships and purchase history"
          />
          {isError && (
            <ErrorMessage
              message={error?.message}
              icon={<AlertCircle className="h-4 w-4" />}
              className="text-sm"
            />
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <GlobalButton
            text="Refresh"
            icon={
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            }
            onClick={refetch}
            disabled={loading}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          />
          <GlobalButton
            text="Add New Customer"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => router.push("/dashboard/customers/add-new-customer")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard
          title="Total Customers"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          value={totalCustomers}
          description="All registered customers"
        />
        <StatCard
          title="Active Customers"
          icon={<Users className="h-4 w-4 text-green-500" />}
          value={activeCustomers}
          description="Currently active"
        />
        <StatCard
          title="Total Revenue"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          value={`$${totalRevenue?.toFixed(2)}`}
          description="From all customers"
        />
        <StatCard
          title="Avg Order Value"
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
          value={`$${avgOrderValue?.toFixed(2)}`}
          description="Per order"
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <Title title="Customer List" />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <GlobalLoader message="Loading customers..." />
          </div>
        ) : isError ? (
          <div className="text-center py-8">
            <ErrorMessage message="Failed to load customers. Please try again." />
            <GlobalButton
              text="Retry"
              onClick={refetch}
              className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
            />
          </div>
        ) : customers?.data?.length === 0 ? (
          <NoData message="No customers found." />
        ) : (
          <GlobalTable
            columns={customerTableColumn(selectedCustomer, handleModalOpen)}
            data={customers?.data}
            title="Customer List"
            loading={loading}
            currentPage={customers?.pagination?.page || 1}
            setCurrentPage={setPage}
            currentPageCount={customers?.pagination?.limit || 10}
            setCurrentPageCount={setLimit}
            totalPages={customers?.pagination?.totalPages || 1}
            totalCount={customers?.pagination?.total || 0}
          />
        )}
      </div>
    </div>
  );
}
