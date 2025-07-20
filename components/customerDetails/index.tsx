import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch } from "react-redux";
import { FormSingleSelect } from "../common/form-fields/FormSingleSelect";
import { useToast } from "../ui/use-toast";
import { setSelectedCustomer } from "../../lib/features/customerSlice";
import type { Customer, CustomerState } from "../../lib/features/customerSlice";
import GlobalButton from "../common/globalButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useCustomers } from "../../hooks/useCustomers";

// Validation schema
const customerSelectSchema = z.object({
  selectedCustomerId: z.string().min(1, "Please select a customer"),
});

type CustomerSelectData = z.infer<typeof customerSelectSchema>;

interface CustomerDetailsProps {
  handleCustomerDetailsPass?: (customer: any) => void;
}

/**
 * CustomerDetails Component
 * 
 * This component provides customer selection functionality with the following features:
 * - Customer selection via dropdown
 * - Form validation using react-hook-form and zod
 * - Redux integration for state management
 * - Exposes selectedCustomerDetail through ref
 * 
 * Usage:
 * ```tsx
 * const customerDetailsRef = useRef<{ selectedCustomerDetail: Customer | null }>(null);
 * 
 * // Access selected customer details
 * const selectedCustomer = customerDetailsRef.current?.selectedCustomerDetail;
 * ```
 */

export const CustomerDetails = forwardRef<{ selectedCustomerDetail: Customer | null }, CustomerDetailsProps>(({ handleCustomerDetailsPass }, ref) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState<Customer | null>(null)
  
  // Get customers from database using custom hook
  const { customers, loading, error } = useCustomers();
  
  const form = useForm<CustomerSelectData>({ 
    mode: "onChange",
    resolver: zodResolver(customerSelectSchema),
    defaultValues: {
      selectedCustomerId: "",
    }
  });
  
  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = form;
  
  useImperativeHandle(ref, () => ({
    selectedCustomerDetail,
  }), [selectedCustomerDetail]);

  // Watch for changes in selected customer
  const selectedCustomerId = watch("selectedCustomerId");

  // Notify parent component when selectedCustomerDetail changes
//   useEffect(() => {
//     if (selectedCustomerDetail && handleCustomerDetailsPass) {
//       handleCustomerDetailsPass(selectedCustomerDetail);
//     }
//   }, [selectedCustomerDetail, handleCustomerDetailsPass]);

  const onSubmit = (data: CustomerSelectData) => {
    const selectedCustomer = customers.find(customer => customer.id === data.selectedCustomerId);
    if (selectedCustomer) {
        console.log("selectedCustomers_customer",selectedCustomer)
        setSelectedCustomerDetail(selectedCustomer)
      dispatch(setSelectedCustomer(selectedCustomer));
      handleCustomerDetailsPass?.(selectedCustomer);
      toast({
        title: "Success",
        description: `Customer "${selectedCustomer.customerName}" selected successfully!`,
      });
    }
  };

  // Convert customers to select options
  const customerOptions = customers.map((customer: Customer) => ({
    label: customer.customerName,
    value: customer.id,
  }));

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 text-red-600">
            <div className="h-6 w-6">⚠️</div>
            <p>Failed to load customers. Please try again.</p>
          </div>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormSingleSelect
              label="Select Customer *"
              name="selectedCustomerId"
              control={control}
              options={customerOptions}
              placeholder="Choose a customer from the list"
              error={errors.selectedCustomerId?.message}
            />
            
            <div className="mt-6">
              <GlobalButton
                text="Select Customer"
                type="submit"
                className="w-full"
                disabled={!selectedCustomerId}
              />
            </div>
          </form>
        </>
      )}

      {selectedCustomerDetail && (
        <div className="bg-white rounded-lg shadow-md p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-500">Customer Name</label>
              <p className="text-base text-gray-900 font-medium">{selectedCustomerDetail.customerName}</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-blue-600 hover:text-blue-800 underline cursor-pointer">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer ID</label>
                    <p className="text-base font-mono text-sm">{selectedCustomerDetail.id}</p>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-900">
                    Customer Details - {selectedCustomerDetail.customerName}
                  </DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer Name</label>
                        <p className="text-base text-gray-900">{selectedCustomerDetail.customerName}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Mobile</label>
                        <p className="text-base text-gray-900">{selectedCustomerDetail.customerMobile}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Address</label>
                        <p className="text-base text-gray-900">{selectedCustomerDetail.customerAddress}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Status</label>
                        <p className="text-base text-gray-900 capitalize">{selectedCustomerDetail.customerStatus}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer Date</label>
                        <p className="text-base text-gray-900">{selectedCustomerDetail.customerDate || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Created At</label>
                        <p className="text-base text-gray-900">{new Date(selectedCustomerDetail.createdAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Updated At</label>
                        <p className="text-base text-gray-900">{new Date(selectedCustomerDetail.updatedAt).toLocaleDateString()}</p>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-500">Customer ID</label>
                        <p className="text-base text-gray-900 font-mono text-sm">{selectedCustomerDetail.id}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Optional fields */}
                  {(selectedCustomerDetail.email || selectedCustomerDetail.phone || selectedCustomerDetail.name) && (
                    <div className="pt-4 border-t border-gray-200">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Additional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedCustomerDetail.email && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-base text-gray-900">{selectedCustomerDetail.email}</p>
                          </div>
                        )}
                        
                        {selectedCustomerDetail.phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Phone</label>
                            <p className="text-base text-gray-900">{selectedCustomerDetail.phone}</p>
                          </div>
                        )}
                        
                        {selectedCustomerDetail.name && (
                          <div>
                            <label className="text-sm font-medium text-gray-500">Name</label>
                            <p className="text-base text-gray-900">{selectedCustomerDetail.name}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
});

export default CustomerDetails;
