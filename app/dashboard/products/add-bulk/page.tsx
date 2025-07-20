"use client";

import { useForm, Controller, Form } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormTextInput } from "@/components/common/form-fields/FormTextInput";
import { FormSingleSelect } from "@/components/common/form-fields/FormSingleSelect";
import { FormMultiSelect } from "@/components/common/form-fields/FormMultiSelect";
import { FormNumberInput } from "@/components/common/form-fields/FormNumberInput";
import { FormCalendar } from "@/components/common/form-fields/FormCalendar";
import { FormMultiImageUpload } from "@/components/common/form-fields/FormMultiImageUpload";
import { FormTextarea } from "@/components/common/form-fields/FormTextarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Title from "@/components/common/Title";
import { useState, useEffect } from "react";
import GlobalButton from "@/components/common/globalButton";
import { useRouter } from "next/navigation";
import { addBulkProductSchema } from "@/utils/zodValidation.utils";
import {
  categoryOptions,
  colorOptions,
  productNameOptions,
  productOfOptions,
  subcategoryOptions,
  tagOptions,
} from "@/lib/dummyData";
import FormMultiColorPicker from "@/components/common/form-fields/FormMultiColorPicker";

type AddBulkProductFormData = z.infer<typeof addBulkProductSchema>;

export default function AddBulkProductPage() {
  const [calculatedFinalRate, setCalculatedFinalRate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [productAdditionStatus, setProductAdditionStatus] = useState(false);
  const [addedPRoductsIds, setAddedProductIds] = useState([]);
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset, // <-- add this
    formState: { errors },
  } = useForm<AddBulkProductFormData>({
    resolver: zodResolver(addBulkProductSchema),
    defaultValues: {
      productName: "",
      count: "",
      color: [],
      category: "",
      subcategory: "",
      purchaseDate: undefined,
      billNo: "",
      productOf: "",
      tags: [],
      images: [],
      purchasePrice: "",
      gst: "", // <-- add this
      npp: "",
      discount: "",
      initialSellPrice: "", // <-- add this
      finalSellPrice: "", // <-- add this
      description: "",
    },
  });
  console.log("errror_error", errors);
  const purchasePrice = watch("purchasePrice");
  const gst = watch("gst"); // <-- add this
  const npp = watch("npp");
  const discount = watch("discount");

  useEffect(() => {
    const calculateSellPrices = () => {
      const price = parseFloat(purchasePrice) || 0;
      const gstPercentage = parseFloat(gst) || 0;
      const nppValue = parseFloat(npp) || 0;
      const discountValue = parseFloat(discount) || 0;

      // initialSellPrice = purchasePrice * gst / 100 + purchasePrice
      const initialSellPrice = (price * gstPercentage) / 100 + price;
      // finalSellPrice = initialSellPrice + npp + gst - discount
      const finalSellPrice =
        initialSellPrice + nppValue + gstPercentage - discountValue;

      setValue("initialSellPrice", initialSellPrice.toFixed(2));
      setValue("finalSellPrice", finalSellPrice.toFixed(2));
    };
    calculateSellPrices();
  }, [purchasePrice, gst, npp, discount, setValue]);

  console.log("KL_sSSSdfd_W_ER_WR", addedPRoductsIds);

  const onSubmit = async (data: AddBulkProductFormData) => {
    setIsSubmitting(true);
    try {
      console.log("_34_34_3434_34_34", data);
      const response = await fetch("/api/products", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.productName.toUpperCase(),
          count: Number(data.count),
          color: data.color,
          category: data.category,
          subCategory: data.subcategory,
          purchaseDate: data.purchaseDate,
          billNo: data.billNo,
          productOf: data.productOf,
          tags: data.tags,
          images: data.images || [],
          purchasePrice: Number(data.purchasePrice),
          gst: Number(data.gst),
          npp: Number(data.npp),
          discount: Number(data.discount),
          initialSellPrice: Number(data.initialSellPrice),
          finalSellPrice: Number(data.finalSellPrice),
          description: data.description || "",
        }),
      });

      const result = await response.json();

      if (result.success) {
        setProductAdditionStatus(true);
        const formatedData = result?.data?.products?.map((item) => item?._id);
        setAddedProductIds(formatedData);
        reset();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error creating bulk products:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultipleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    // Convert files to base64 strings
    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const base64Images = await Promise.all(
      Array.from(files).map((file) => toBase64(file))
    );

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

  const downloadZipFile = async () => {
    if (addedPRoductsIds?.length > 0) {
      try {
        const response = await fetch("/api/products/downloadQRCodes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ids: addedPRoductsIds }),
        });
        if (!response.ok) {
          throw new Error("Failed to download QR codes");
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "product-qrcodes.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        router.push("/dashboard/products");
      } catch (error) {
        alert("Error downloading QR codes ZIP");
      }
    }
  };

  return (
    <div className="flex flex-col gap-y-5">
      <div className="max-w-full">
        <Title
          title="Add Bulk Products"
          subtitle="Add multiple products to your inventory at once"
          className="mb-10"
        />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-x-4 gap-y-6 pr-60 font-medium"
        >
          <FormTextInput
            label="Product Name"
            name="productName"
            control={control}
            error={errors.productName?.message}
            placeholder="Enter product name"
          />
          <FormNumberInput
            label="Count"
            name="count"
            control={control}
            error={errors.count?.message}
            placeholder="Enter quantity"
          />
          <FormMultiColorPicker
            label="Color"
            name="color"
            control={control}
            error={errors.color?.message}
            placeholder="Pick one or more colors"
          />
          <FormSingleSelect
            label="Category"
            name="category"
            options={categoryOptions}
            control={control}
            error={errors.category?.message}
            placeholder="Select category"
          />
          <FormSingleSelect
            label="SubCategory"
            name="subcategory"
            options={subcategoryOptions}
            control={control}
            error={errors.subcategory?.message}
            placeholder="Select subcategory"
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
          <FormMultiSelect
            label="Tags"
            name="tags"
            options={tagOptions}
            control={control}
            error={errors.tags?.message}
            placeholder="Select tags"
          />
          <FormMultiImageUpload
            label="Images"
            name="images"
            control={control}
            error={errors.images?.message}
            onFilesSelected={handleMultipleImageUpload}
          />
          <FormNumberInput
            label="Purchase Price"
            name="purchasePrice"
            control={control}
            error={errors.purchasePrice?.message}
            placeholder="Enter purchase price"
          />

          <FormNumberInput
            label="GST (%)"
            name="gst"
            control={control}
            error={errors.gst?.message}
            placeholder="Enter GST percentage"
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
            label="Initial Sell Price"
            name="initialSellPrice"
            control={control}
            error={errors.initialSellPrice?.message}
            placeholder="Calculated Initial Sell Price"
            disabled
          />
          <FormNumberInput
            label="Final Sell Price"
            name="finalSellPrice"
            control={control}
            error={errors.finalSellPrice?.message}
            placeholder="Calculated Final Sell Price"
            disabled
          />
          <FormTextarea
            label="Description"
            name="description"
            control={control}
            error={errors.description?.message}
            placeholder="Enter product description"
          />

          <div className="col-span-2 flex gap-4 pt-6">
            <GlobalButton
              type="submit"
              text={isSubmitting ? "Creating Products..." : "Add Bulk Products"}
              className="flex-1"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
            <GlobalButton
              type="button"
              text="Cancel"
              variant="outline"
              className="flex-1"
              disabled={isSubmitting}
            />
          </div>
        </form>
      </div>

      {/* Divider between form and status section */}
      {productAdditionStatus && <div className="border-t my-8 w-full" />}

      {productAdditionStatus && (
        <div className="col-span-2 flex gap-4 pt-6">
          <GlobalButton
            type="button"
            text="Download QR (ZIP)"
            variant="default"
            className="flex-1"
            onClick={downloadZipFile}
          />
          <GlobalButton
            type="button"
            text="GoTo List"
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/dashboard/products")}
          />
        </div>
      )}
    </div>
  );
}
