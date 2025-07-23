"use client";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Title from "@/components/common/Title";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { createInvoice } from "@/lib/features/invoiceSlice";
import { useRouter } from "next/navigation";
import CustomerDetails from "@/components/customerDetails";
import ProductDetails from "@/components/productDetails";
import type { Customer } from "@/lib/features/customerSlice";
import GlobalButton from "@/components/common/globalButton";
import { invoiceSchema } from "@/utils/zodValidation.utils";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useStaff } from "@/hooks/useStaff";
import StaffSelection from "@/components/staffDetailsInCreateInvoice";
import { useMutation } from '@tanstack/react-query';
import { addInvoice } from '@/lib/api-client';

interface Product {
  id: string;
  type: string;
  serialNumber: string;
  quantity: number;
  rate: number;
  price: number;
  gst: number;
  discountedPrice: number;
}

interface Invoice {
  id: string;
  customerName: string;
  customerMobile: string;
  customerDate: string | null;
  customerTime?: string;
  customerStatus: "paid" | "unpaid";
  customerAddress: string;
  products: Product[];
}

interface DraftInvoice {
  customerName: string;
  customerMobile: string;
  customerDate: string | null;
  customerTime?: string;
  customerStatus: "paid" | "unpaid";
  customerAddress: string;
  products: Product[];
}

const initialDraft: DraftInvoice = {
  customerName: "",
  customerMobile: "",
  customerDate: null,
  customerTime: "",
  customerStatus: "paid",
  customerAddress: "",
  products: [],
};



export default function CreateInvoicePage() {
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [draftInvoice, setDraftInvoice] = useState<DraftInvoice>(initialDraft);
  const [customerSelected,setCustomerSelected]=useState({});
  const [selectedStaff, setSelectedStaff] = useState<string>("");
  const [staffError, setStaffError] = useState("");
  const { data: staffData, isLoading: staffLoading } = useStaff({ limit: 100, isActive: true });
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      customerName: "",
      customerMobile: "",
      customerDate: null,
      customerTime: "",
      customerStatus: "paid",
      customerAddress: "",
      type: "",
      serialNumber: "",
      quantity: 1,
      rate: 0,
      gstPercentage: 18,
      discountPercentage: 0,
    },
  });
  const router = useRouter();
  const staffRef = useRef<any>(null);

  const createInvoiceMutation = useMutation({
    mutationFn: addInvoice,
    onSuccess: () => {
      setDraftInvoice(initialDraft);
      reset();
      router.push('/dashboard/billing');
    },
    onError: (error: any) => {
      alert(error.message || 'Failed to create invoice');
    },
  });

  const watched = watch();
  const customerDetailsRef = useRef<{ selectedCustomerDetail: Customer | null }>(null);
  const productDetailsRef = useRef<Product[]>(null);
  // Sync customer fields from form to draftInvoice
  useEffect(() => {
    setDraftInvoice((prev) => ({
      ...prev,
      customerName: watched.customerName,
      customerMobile: watched.customerMobile,
      customerDate: watched.customerDate,
      customerTime: watched.customerTime,
      customerStatus: watched.customerStatus as "paid" | "unpaid",
      customerAddress: watched.customerAddress,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    watched.customerName,
    watched.customerMobile,
    watched.customerDate,
    watched.customerTime,
    watched.customerStatus,
    watched.customerAddress,
  ]);

  // const calculatePricing = (data = watched) => {
  //   const basePrice = data.quantity * data.rate;
  //   const gstAmount = (basePrice * data.gstPercentage) / 100;
  //   const totalWithGst = basePrice + gstAmount;
  //   const discountAmount = (totalWithGst * data.discountPercentage) / 100;
  //   const finalPrice = totalWithGst - discountAmount;
  //   return {
  //     price: basePrice,
  //     gst: gstAmount,
  //     discountedPrice: finalPrice,
  //   };
  // };

  // const onAddProduct = (data: any) => {
  //   if (!data.type || !data.serialNumber || data.rate <= 0) {
  //     return;
  //   }
  //   const pricing = calculatePricing(data);
  //   const newProduct: Product = {
  //     id: Date.now().toString(),
  //     type: data.type,
  //     serialNumber: data.serialNumber,
  //     quantity: data.quantity,
  //     rate: data.rate,
  //     price: pricing.price,
  //     gst: pricing?.gst,
  //     discountedPrice: pricing.discountedPrice,
  //   };
  //   setDraftInvoice((prev) => ({
  //     ...prev,
  //     products: [...prev.products, newProduct],
  //   }));
  //   reset();
  // };

  // const onAddProductOnQRCodeScan = (data: any) => {
  //   if (!data.type || !data.serialNumber || data.rate <= 0) {
  //     return;
  //   }
  //   const newProduct: Product = {
  //     id: Date?.now()?.toString(),
  //     type: data?.type,
  //     serialNumber: data?.serialNumber,
  //     quantity: data?.quantity,
  //     rate: data?.rate,
  //     price: data?.price,
  //     gst: data?.gst,
  //     discountedPrice: data?.discountedPrice,
  //   };

  //   console.log("DFSDLFLSDF_SDFWWWWW_SKSKD", newProduct);
  //   // setProducts((prev) => [...prev, newProduct]); // This line was removed
  //   reset();
  // };

  const handleSave = () => {
    setStaffError("");
    const selectedProductListDetails = productDetailsRef?.current;
    const selectedCustomer = customerDetailsRef?.current?.selectedCustomerDetail;
    const selectedStaff = staffRef?.current?.selectedStaff;

    if (!selectedStaff) {
      setStaffError("Please select a staff member.");
      return;
    }
    if (!selectedCustomer) {
      alert("Please select a customer first.");
      return;
    }
    if (!selectedProductListDetails || selectedProductListDetails.length === 0) {
      alert("Please add at least one product.");
      return;
    }

    const items = selectedProductListDetails.map((item: any) => ({
      productId: item._id,
      name: item.name,
      finalSoldPrice: 100000,
    }));

    // Calculate totals
    const intialTotalPrice = items.reduce((acc: number, item: any) => acc + (item.finalSoldPrice * (item.quantity || 1)), 0);
    const gstTotalAmount = selectedProductListDetails.reduce((acc: number, item: any) => acc + ((item.gst || 0) / 100 * item.sellPrice), 0);
    const totalDiscount = selectedProductListDetails.reduce((acc: number, item: any) => acc + (item.discount || 0), 0);
    const totalFinalPrice = intialTotalPrice + gstTotalAmount - totalDiscount;

    const payload = {
      customer: selectedCustomer.id,
      items:items,
      intialTotalPrice,
      gstTotalAmount,
      totalDiscount,
      totalFinalPrice,
      purchaseStatus: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'cash', // or get from a form field
      notes: '',
      soldBy: selectedStaff._id,
    };

    createInvoiceMutation.mutate(payload);
  };

  const handleCustomerDetailsPass = (response: any) => {
    setCustomerSelected(response);
  };


  return (
    <div className="w-full max-w-4xl px-2 sm:px-4 md:px-8">
      <Title title="Create Invoice" />
      <StaffSelection ref={staffRef} />
      <Title title="Customer Details" className="text-lg" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <CustomerDetails ref={customerDetailsRef} handleCustomerDetailsPass={handleCustomerDetailsPass} />
      </div>
      <Separator className="my-6" />
      <div className="">
        <ProductDetails ref={productDetailsRef} />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
        <GlobalButton
          onClick={handleSave}
          text="Create Invoice"
          className="w-full sm:w-fit"
          variant="default"
        />
      </div>
    </div>
  );
}
