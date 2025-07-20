"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Search,
  Download,
  Eye,
  Receipt,
  DollarSign,
  FileText,
  Calendar,
} from "lucide-react";
import Title from "@/components/common/Title";
import { useSelector, useDispatch } from "react-redux";
import type { Invoice, Product } from "@/lib/features/invoiceSlice";
import { resetInvoiceState } from "@/lib/features/invoiceSlice";
import GlobalCard from "@/components/common/GlobalCard";
import GlobalTable from "@/components/common/GlobalTable";
import InvoiceModal from "@/components/InvoiceCreateModal";
import { useRouter } from "next/navigation";
import { invoiceColumn } from "@/components/commonColumns";
import { RootState } from "@/lib/store";
import { useInvoices } from '@/hooks/useInvoices';

export default function BillingPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch invoices using TanStack Query
  const { invoices, loading, error, refetch } = useInvoices();

  console.log("invoices_invoices",invoices);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between">
        <Title
          title="Billing & Invoices"
          subtitle="Manage invoices and track payments"
        />
        <div className="flex gap-2">
          <Button
            onClick={() => {
              dispatch(resetInvoiceState());
              // Also clear localStorage
              if (typeof window !== 'undefined') {
                localStorage.removeItem('persist:root');
              }
              refetch(); // Refetch invoices after reset
            }}
            variant="outline"
          >
            Reset State
          </Button>
          <Button
            onClick={() => router.push("/dashboard/billing/create-invoice")}
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Search Bar */}

      {/* <div className="overflow-x-auto"> */}
        <GlobalTable
          columns={invoiceColumn}
          data={invoices}
          title="Invoices"
          loading={loading}
          // stateList={invoices}
        />
      {/* </div> */}

      <InvoiceModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
