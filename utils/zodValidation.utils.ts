import { z } from "zod";

export const addBulkProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  count: z
    .string()
    .min(1, "Count is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Must be a positive number",
    }),
  color: z.array(z.string()).min(1, "Select at least one color"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  purchaseDate: z.date({ required_error: "Purchase date is required" }),
  billNo: z.string().min(1, "Bill number is required"),
  productOf: z.string().min(1, "Product of is required"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  images: z.array(z.any()).optional(),
  purchasePrice: z
    .string()
    .min(1, "Purchase price is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  gst: z
    .string()
    .min(1, "GST is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  npp: z
    .string()
    .min(1, "NPP is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  discount: z
    .string()
    .min(1, "Discount is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  initialSellPrice: z
    .string()
    .min(1, "Initial sell price is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  finalSellPrice: z
    .string()
    .min(1, "Final sell price is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a number",
    }),
  description: z.string().optional(),
});

export const invoiceSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerMobile: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be at most 15 digits"),
  customerDate: z.date({ required_error: "Date is required" }).nullable(),
  customerTime: z.string().optional(),
  customerStatus: z.enum(["paid", "unpaid"], {
    required_error: "Status is required",
  }),
  customerAddress: z.string().min(1, "Customer address is required"),
  type: z.union([
    z.string().min(1, "Product type is required"),
    z.array(z.string()).min(1, "Product type is required"),
  ]),
  serialNumber: z.string().min(1, "Serial number is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0.01, "Rate must be greater than 0"),
  gstPercentage: z.coerce.number().min(0).max(100),
  discountPercentage: z.coerce.number().min(0).max(100),
});

export const customerFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.object({
    street: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zipCode: z.string().min(1, "ZIP code is required"),
    country: z.string().min(1, "Country is required"),
  }),
  totalVisitCount: z.string().min(1, "Visit count is required"),
  groupType: z.string().optional(),
  notes: z.string().optional(),
});
