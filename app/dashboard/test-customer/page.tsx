"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/CommonCard";
import { CustomerDetails } from "@/components/customerDetails";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import type { Customer } from "@/lib/features/customerSlice";

export default function TestCustomerPage() {
  const customers = useSelector((state: RootState) => state.customer.customers);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Test Customer Details</h1>
        <p className="text-muted-foreground">Test the CustomerDetails component with Redux integration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerDetails />
          </CardContent>
        </Card>

        {/* Customer List */}
        <Card>
          <CardHeader>
            <CardTitle>Saved Customers ({customers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <p className="text-muted-foreground">No customers saved yet. Add one using the form on the left.</p>
            ) : (
              <div className="space-y-4">
                {customers.map((customer: Customer) => (
                  <div key={customer.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{customer.customerName}</h3>
                    <p className="text-sm text-muted-foreground">Mobile: {customer.customerMobile}</p>
                    <p className="text-sm text-muted-foreground">Address: {customer.customerAddress}</p>
                    <p className="text-sm text-muted-foreground">Status: {customer.customerStatus}</p>
                    <p className="text-sm text-muted-foreground">Date: {customer.customerDate}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 