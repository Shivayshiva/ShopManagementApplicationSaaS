"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/common/CommonCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Title from "@/components/common/Title";
import { addCustomer } from "@/lib/features/customerSlice";
import type { Customer } from "@/lib/features/customerSlice";
import { FormTextInput } from "@/components/common/form-fields/FormTextInput";
import { FormNumberInput } from "@/components/common/form-fields/FormNumberInput";
import { toast } from "sonner";
import { customerFormSchema } from "@/utils/zodValidation.utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerApi } from "@/lib/api-client";

// Zod schema for form validation

type CustomerFormData = z.infer<typeof customerFormSchema>;

export default function AddNewCustomerPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
      totalVisitCount: "0",
      groupType: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CustomerFormData) => {
      // Convert totalVisitCount to number for API
      return customerApi.create({
        ...data,
        totalVisitCount: Number(data.totalVisitCount),
      });
    },
    onSuccess: (result, data) => {
      // Defensive: check result.data exists and has _id
      const dbData = result.data as any;
      const newCustomer: Customer = {
        id: dbData?._id || Date.now().toString(),
        customerName: data.name,
        customerMobile: data.phone,
        customerDate: new Date().toISOString(),
        customerAddress: `${data.address.street}, ${data.address.city}, ${data.address.state} ${data.address.zipCode}`,
        customerStatus: "unpaid",
        name: data.name,
        email: data.email,
        phone: data.phone,
        totalOrders: 0,
        totalSpent: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCustomer(newCustomer));
      toast.success("Customer created successfully!");
      reset();
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      router.push("/dashboard/customers");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create customer");
    },
  });

  const onSubmit = (data: CustomerFormData) => {
    mutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Title
          title="Add New Customer"
          subtitle="Create a new customer profile"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormTextInput
                label="Full Name *"
                name="name"
                control={control}
                placeholder="Enter full name"
                error={errors.name?.message}
              />

              <FormTextInput
                label="Email *"
                name="email"
                control={control}
                type="email"
                placeholder="Enter email address"
                error={errors.email?.message}
              />

              <FormTextInput
                label="Phone Number *"
                name="phone"
                control={control}
                placeholder="Enter phone number"
                error={errors.phone?.message}
              />
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormTextInput
                  label="Street Address *"
                  name="address.street"
                  control={control}
                  placeholder="Enter street address"
                  error={errors.address?.street?.message}
                />

                <FormTextInput
                  label="City *"
                  name="address.city"
                  control={control}
                  placeholder="Enter city"
                  error={errors.address?.city?.message}
                />

                <FormTextInput
                  label="State *"
                  name="address.state"
                  control={control}
                  placeholder="Enter state"
                  error={errors.address?.state?.message}
                />

                <FormTextInput
                  label="ZIP Code *"
                  name="address.zipCode"
                  control={control}
                  placeholder="Enter ZIP code"
                  error={errors.address?.zipCode?.message}
                />

                <FormTextInput
                  label="Country *"
                  name="address.country"
                  control={control}
                  placeholder="Enter country"
                  error={errors.address?.country?.message}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <FormTextInput
                label="Notes"
                name="notes"
                control={control}
                placeholder="Enter any additional notes"
                error={errors.notes?.message}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormNumberInput
                  label="Total Visit Count"
                  name="totalVisitCount"
                  control={control}
                  placeholder="Enter total visit count"
                  error={errors.totalVisitCount?.message}
                />

                <FormTextInput
                  label="Group Type"
                  name="groupType"
                  control={control}
                  placeholder="Enter group type (e.g., VIP, Regular, Premium)"
                  error={errors.groupType?.message}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={mutation.status === "pending"}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.status === "pending"}>
                {mutation.status === "pending" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Customer
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
