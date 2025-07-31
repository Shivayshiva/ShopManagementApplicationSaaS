"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
} from "lucide-react";
import Title from "@/components/common/Title";
import { useDispatch } from "react-redux";
import { resetInvoiceState } from "@/lib/features/invoiceSlice";
import GlobalTable from "@/components/common/GlobalTable";
import InvoiceModal from "@/components/InvoiceCreateModal";
import { useRouter } from "next/navigation";
import { invoiceColumn } from "@/components/commonColumns";
import { useInvoices } from '@/hooks/useInvoices';

export default function BillingPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch invoices using TanStack Query
  const { invoices, loading, error, refetch } = useInvoices();


  return (
    <div className="space-y-4 px-2 sm:px-4 md:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <Title
          title="Billing & Invoices"
          subtitle="Manage invoices and track payments"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => router.push("/dashboard/billing/create-invoice")}
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* Table */}
        <GlobalTable
          columns={invoiceColumn}
          data={invoices}
          title="Invoices"
          loading={loading}
        />
      <InvoiceModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
