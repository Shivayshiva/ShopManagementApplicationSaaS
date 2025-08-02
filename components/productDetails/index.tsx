import React, { forwardRef, useImperativeHandle, useState } from "react";
import { FormBarcodeSelect } from "../common/form-fields/FormBarcodeSelect";
import { FormTextInput } from "../common/form-fields/FormTextInput";
import { Button } from "../ui/button";
import { Plus, ScanBarcode } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CameraBarcodeScanner from "../common/camerBarCodeDetector";
import Title from "../common/Title";
import GlobalTable from "../common/GlobalTable";
import { GlobalDialog } from "../common/GlobalDialog";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "../ui/carousel";
import Image from "next/image";
import { IProduct } from "@/lib/models/Product";

// Zod validation schema for product details
const productDetailsSchema = z.object({
  type: z.string().min(1, "Product type is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
});

type ProductDetailsFormData = z.infer<typeof productDetailsSchema>;

// Extend Product interface to include all required fields
interface Product {
  _id: string;
  barCode: string; // image url for barcode
  billNo: string;
  discount: number;
  gst: number;
  images: string[]; // array of image URLs
  name: string;
  productOf: string;
  purchaseDate: string; // ISO string or formatted date
  sellPrice: number;
  tags: string[];
  type: string;
  serialNumber: string;
}

const ProductDetails = forwardRef((_, ref) => {
  const [productList, setProductList] = useState<Product[]>([]);
  console.log("productList_productList", productList)
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const form = useForm<ProductDetailsFormData>({
    mode: "onChange",
    resolver: zodResolver(productDetailsSchema),
    defaultValues: {
      type: "",
      serialNumber: "",
    },
  });

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = form;

  useImperativeHandle(ref, () => productList, [productList]);



  // Handle form submission
  const onSubmit = (data: ProductDetailsFormData) => {

    const newProduct: Product = {
      _id: Date.now().toString(),
      barCode: "",
      billNo: "",
      discount: 0,
      gst: 0,
      images: [],
      name: data.type,
      productOf: "",
      purchaseDate: new Date().toISOString(),
      sellPrice: 0,
      tags: [],
      type: data.type,
      serialNumber: data.serialNumber,
    };

    setProductList(prev => [...prev, newProduct]);
    reset();
  };


  const fetchProductById = async (url: string) => {
    console.log("1111111111111111111111111111111111", res);

    if (url) {
      const res = await fetch(url);
      const data = await res.json();
      if (data.success ) {
        // setIsScannerOpen(false);
        return data.data as IProduct;
      } else {
        throw new Error(data.error || "Failed to fetch product");
      }
    }

  };

  const handleBarCodeScannedData = (response: any) => {
    console.log("response_response_11111response_response", response);

    if(response){
      fetchProductById(response);
    }


  };

  const handleProductFound = (productData: any) => {
    console.log("productData_123_productData", productData);
    setValue("type", productData.type || "");
    setValue("serialNumber", productData.serialNumber || "");

    setProductList(prev => [...prev, productData]);
    reset();
  };

  const columns = [
    {
      header: 'Product',
      cell: (item: Product) => (
        <GlobalDialog
          trigger={
            <Button variant="ghost" className="flex flex-col items-start px-2 py-1">
              <span className="text-xs font-semibold text-gray-700">{item.serialNumber}</span>
              <span className="text-sm text-gray-900">{item.name}</span>
            </Button>
          }
          title={<div className="flex flex-col"><span className="text-base font-bold">{item.name}</span><span className="text-xs text-gray-500">SKU: {item.serialNumber}</span></div>}
        >
          <div className="w-full max-w-md mx-auto">
            <div className="mb-4">
              <span className="block text-xs text-gray-500 mb-1">BarCode:</span>
              <Image src={item.barCode} alt="barcode" width={96} height={96} className="w-24 h-24 object-contain border rounded" unoptimized />
            </div>
            <div className="mb-4">
              <span className="block text-xs text-gray-500 mb-1">Images:</span>
              <Carousel>
                <CarouselContent>
                  {item?.images?.map((img, idx) => (
                    <CarouselItem key={idx}>
                      <Image src={img} alt={`product-img-${idx}`} width={320} height={192} className="w-full h-48 object-contain rounded" unoptimized />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          </div>
        </GlobalDialog>
      ),
    },
    { header: 'Product Of', cell: (item: Product) => item.productOf },
    { header: 'Purchase Date', cell: (item: Product) => item.purchaseDate },
    { header: 'GST', cell: (item: Product) => `${item.gst}%` },
    { header: 'Sell Price', cell: (item: Product) => `₹${item.sellPrice}` },
    {
      header: 'Tags', cell: (item: Product) => (
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag, idx) => (
            <span key={idx} className="bg-gray-200 text-xs px-2 py-0.5 rounded">{tag}</span>
          ))}
        </div>
      )
    },
    { header: 'Discount', cell: (item: Product) => `${item.discount}%` },
  ];

  return (
    <>
      <Title title="Product Details" className="text-lg" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormBarcodeSelect
          label="Product Serial Number *"
          name="type"
          control={control}
          options={[
            "electronics",
            "furniture",
            "clothing",
            "books",
            "accessories",
            "other",
          ]}
          placeholder="Select type"
          error={errors.type?.message}
          onScanClick={() => setIsScannerOpen(true)}
          onProductFound={handleProductFound}
        />


      </form>

      {productList.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Added Products ({productList.length})</h3>
          <GlobalTable
            columns={columns}
            data={productList}
            loading={false}
            title="Products"
          />
        </div>
      )}

      <CameraBarcodeScanner
        onResult={handleBarCodeScannedData}
        isScannerOpen={isScannerOpen}
        onOpenChange={setIsScannerOpen}
      // isSearchFieldRequired={false}
      />
    </>
  );
});

export default ProductDetails;
