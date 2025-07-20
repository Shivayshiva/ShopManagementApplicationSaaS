"use client";

import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormTextInput } from "@/components/common/form-fields/FormTextInput";
import { FormMultiSelect } from "@/components/common/form-fields/FormMultiSelect";
import { FormSingleSelect } from "@/components/common/form-fields/FormSingleSelect";
import { FormNumberInput } from "@/components/common/form-fields/FormNumberInput";
import { FormCalendar } from "@/components/common/form-fields/FormCalendar";
import { FormMultiImageUpload } from "@/components/common/form-fields/FormMultiImageUpload";
import { FormTextarea } from "@/components/common/form-fields/FormTextarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "@/components/common/Title";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GlobalButton from "@/components/common/globalButton";
import { categoryOptions, colorOptions, productOfOptions, subcategoryOptions, tagOptions } from "@/lib/dummyData";

// const categoryOptions = ["Electronics", "Clothing", "Books", "Home", "Toys"];
// const subcategoryOptions = [
//   "Mobile",
//   "Laptop",
//   "Shirt",
//   "Pants",
//   "Fiction",
//   "Non-fiction",
//   "Furniture",
//   "Decor",
//   "Action",
//   "Puzzle",
// ];
// const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
// const colorOptions = ["Red", "Blue", "Green", "Black", "White", "Yellow"];
// const tagOptions = ["New", "Sale", "Popular", "Limited", "Exclusive"];
// const productOfOptions = ["Apple", "Samsung", "Nike", "Adidas", "Dell", "HP", "Sony", "LG", "Canon", "Nikon"];

const addProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  images: z.array(z.any()).optional(),
  description: z.string().optional(),
  category: z.array(z.string()).min(1, "Select at least one category"),
  subcategory: z.array(z.string()).min(1, "Select at least one subcategory"),
  color: z.array(z.string()).min(1, "Select at least one color"),
  tags: z.array(z.string()).min(1, "Select at least one tag"),
  purchaseDate: z.date({ required_error: "Purchase date is required" }),
  billNo: z.string().min(1, "Bill number is required"),
  productOf: z.string().min(1, "Product of is required"),
  purchasePrice: z.string().min(1, "Purchase price is required").refine((val) => !isNaN(Number(val)), {
    message: "Must be a number",
  }),
  npp: z.string().min(1, "NPP is required").refine((val) => !isNaN(Number(val)), {
    message: "Must be a number",
  }),
  discount: z.string().min(1, "Discount is required").refine((val) => !isNaN(Number(val)), {
    message: "Must be a number",
  }),
  finalRate: z.string().min(1, "Final rate is required").refine((val) => !isNaN(Number(val)), {
    message: "Must be a number",
  }),
});

type AddProductFormData = z.infer<typeof addProductSchema>;

export default function AddProductPage() {
  const [calculatedFinalRate, setCalculatedFinalRate] = useState<string>("");
  const router = useRouter();
  const [productAdditionStatus, setProductAdditionStatus] = useState(false);


  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      images: [],
      description: "",
      category: [],
      subcategory: [],
      color: [],
      tags: [],
      purchaseDate: undefined,
      billNo: "",
      productOf: "",
      purchasePrice: "",
      npp: "",
      discount: "",
      finalRate: "",
    },
  });


  console.log("_error_error_error",errors)
  const purchasePrice = watch("purchasePrice");
  const npp = watch("npp");
  const discount = watch("discount");

  // Calculate final rate whenever relevant fields change
  useEffect(() => {
    const calculateFinalRate = () => {
      const price = parseFloat(purchasePrice) || 0;
      const nppPercentage = parseFloat(npp) || 0;
      const discountPercentage = parseFloat(discount) || 0;

      // Calculate NPP addition (percentage of purchase price)
      const nppAmount = price * (nppPercentage / 100);
      // Calculate discount reduction (percentage of purchase price)
      const discountAmount = price * (discountPercentage / 100);

      const finalRateValue = price + nppAmount - discountAmount;
      const finalRateString = finalRateValue.toFixed(2);
      
      setCalculatedFinalRate(finalRateString);
      setValue("finalRate", finalRateString);
    };

    calculateFinalRate();
  }, [purchasePrice, npp, discount, setValue]);

  const onSubmit = async (data: AddProductFormData) => {
    // Transform data to match backend expectations
    const payload = {
        productName : data.name,
        count:1,
      description: data.description || "",
      price: parseFloat(data.finalRate), // Selling price
      purchasePrice : parseFloat(data.purchasePrice),
      category: data.category[0], // backend expects string
      subcategory: data.subcategory[0], // backend expects string
      sku: `SKU_${data.name.replace(/\s+/g, '_')}_${Date.now()}`,
      stockQuantity: 1, // Default or add to form if needed
      minStockLevel: 10, // Default or add to form if needed
      images: data.images || [],
      isActive: true,
      billNo: data.billNo,
      color: data.color, // array
      discount: parseFloat(data.discount),
      finalRate: parseFloat(data.finalRate),
      npp: data.npp,
      productOf : data.productOf,
      purchaseDate: data.purchaseDate,
      tags: data.tags,
    };

    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        // alert("Product added successfully!");
        toast.success("Products Created Successfully")
        // Optionally, reset form or redirect
      } else {
        // alert(result.error || "Failed to add product");
      }
    } catch (err) {
    //   alert("Network or unexpected error");
    }
  };

  const handleMultipleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    const base64Images = await Promise.all(Array.from(files).map(file => toBase64(file)));

    // Call the API to upload images
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: base64Images }),
      });
      const data = await res.json();
      if (data.urls) {
        setValue("images", data.urls); // Set the image URLs in the form
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      alert("Image upload error");
    }
  };


  return (
    <div className="max-w-full">
      <Title
        title="Add Product"
        subtitle="Add a new product to your inventory"
        className="mb-10"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-x-4 gap-y-6 pr-60 font-medium"
      >
        <FormTextInput
          label="Product Name"
          name="name"
          control={control}
          error={errors.name?.message}
          placeholder="Enter product name"
        />
        <FormMultiSelect
          label="Category"
          name="category"
          options={categoryOptions}
          control={control}
          error={errors.category?.message}
          placeholder="Select category"
        />
        <FormMultiSelect
          label="Subcategory"
          name="subcategory"
          options={subcategoryOptions}
          control={control}
          error={errors.subcategory?.message}
        />
        <FormMultiSelect
          label="Color"
          name="color"
          options={colorOptions}
          control={control}
          error={errors.color?.message}
        />
        <FormMultiSelect
          label="Tags"
          name="tags"
          options={tagOptions}
          control={control}
          error={errors.tags?.message}
        />
        <FormCalendar
          label="Purchase Date"
          name="purchaseDate"
          control={control}
          error={errors.purchaseDate?.message}
        />
        <FormTextInput
          label="Bill No."
          name="billNo"
          control={control}
          error={errors.billNo?.message}
          placeholder="Enter bill number"
        />
        <FormSingleSelect
          label="Product Of"
          name="productOf"
          options={productOfOptions}
          control={control}
          error={errors.productOf?.message}
          placeholder="Select manufacturer"
        />
        <FormNumberInput
          label="Purchase Price"
          name="purchasePrice"
          control={control}
          error={errors.purchasePrice?.message}
          placeholder="Enter purchase price"
        />
        <FormNumberInput
          label="NPP (%)"
          name="npp"
          control={control}
          error={errors.npp?.message}
          placeholder="Enter NPP percentage"
        />
        <FormNumberInput
          label="Discount (%)"
          name="discount"
          control={control}
          error={errors.discount?.message}
          placeholder="Enter discount percentage"
        />
        <FormNumberInput
          label="Final Rate"
          name="finalRate"
          control={control}
          error={errors.finalRate?.message}
          placeholder="Calculated final rate"
          disabled
        />

        <FormMultiImageUpload
          label="Product Images"
          name="images"
          control={control}
          error={errors.images?.message}
          onFilesSelected={handleMultipleImageUpload}
        />
        <FormTextarea
          label="Description"
          name="description"
          control={control}
          error={errors.description?.message}
          placeholder="Enter product description"
        />

        <div className="col-span-2 flex gap-4 pt-6">
          <GlobalButton type="submit" text="Add Product" className="flex-1" />
          <GlobalButton type="button" text="Cancel" variant="outline" className="flex-1" />
        </div>


        
      </form>

      {productAdditionStatus && (
        <div>
          <GlobalButton
            type="button"
            text="Download QR (ZIP)"
            variant="secondary"
            className="flex-1"
            onClick={() => {
            }}
          />
          <GlobalButton
            type="button"
            text="GoTo List"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/dashboard/products")}
          />{" "}
        </div>
      )}
    </div>
  );
}
