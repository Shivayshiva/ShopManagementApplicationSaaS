"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Package,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import GlobalTable from "@/components/common/GlobalTable";
import TooltipText from "@/components/common/TooltipText";
import type { IProduct } from "@/lib/models/Product";
import { toast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/productDetails/ProductDetailsDialog";
import moment from "moment";
import { useRef } from "react";
import UploadImageModalProductList from "@/components/uploadImageModalProductList";
import ImagePreviewProductList from "@/components/imagePreviewProductList";

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [skuImagesOpen, setSkuImagesOpen] = useState(false);
  const [skuImages, setSkuImages] = useState<string[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadingProduct, setUploadingProduct] = useState<IProduct | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch products from API using TanStack Query
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      if (data.success && data.data) {
        return data.data as IProduct[];
      } else {
        throw new Error(data.error || "Failed to load products");
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Use fetched products or empty array
  const products: IProduct[] = productsData || [];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string, stock: number) => {
    if (status === "out_of_stock" || stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    }
    if (status === "low_stock" || stock <= 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    }
    return <Badge variant="default">In Stock</Badge>;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUploadClick = (product: IProduct) => {
    setUploadingProduct(product);
    setUploadOpen(true);
    setSelectedFiles([]);
    setUploadedImages(product.images || []);
  };

  const handleUploadSubmit = async () => {
    if (!uploadingProduct || selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append("images", file));
      const response = await fetch(`/api/products/${uploadingProduct._id}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success && data.images) {
        setUploadedImages(data.images);
        toast({ title: "Upload successful", description: "Images uploaded successfully.", variant: "default" });
        refetch();
        setUploadOpen(false);
      } else {
        toast({ title: "Upload failed", description: data.error || "Failed to upload images.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Upload failed", description: (err as Error).message || "Failed to upload images.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const productColumns = [
    {
      header: "Product",
      cell: (product: any) => (
        <div className="flex items-center space-x-3">
            <TooltipText
              text={product.name}
              description={product?.description}
              width={120}
            />
        </div>
      ),
    },
    {
      header: "SKU",
      cell: (product: any) => (
        <span
          className="cursor-pointer text-blue-600 underline"
          onClick={() => {
            setSkuImages(product?.images || []);
            setSkuImagesOpen(true);
          }}
        >
          <TooltipText text={product?.sku} width={120} />
        </span>
      ),
    },
    {
      header: "Upload",
      cell: (product: any) => (
        <Button variant="outline" size="sm" onClick={() => handleUploadClick(product)}>
          Upload
        </Button>
      ),
    },
    {
      header: "Category",
      cell: (product: any) => product?.category,
    },
    {
      header: "Bill No.",
      cell: (product: any) => product?.billNo,
    },
    {
      header: "Product Of",
      cell: (product: any) => product?.productOf,
    },
    {
      header: "Tags",
      cell: (product: any) => product?.tags?.join(","),
    },
    {
      header: "Buy Price",
      cell: (product: any) => `Rs.${product?.purchasePrice}`,
    },
    {
      header: "NPP",
      cell: (product: any) => `${product?.npp}%`,
    },
    {
      header: "Initial Sell Price",
      cell: (product: any) => `Rs.${product?.initialSellPrice}`,
    },
    
    {
      header: "Discount",
      cell: (product: any) => `${product?.discount}%`,
    },
   
    {
      header: "Final Sell Price",
      cell: (product: any) => `Rs.${product?.finalSellPrice}`,
    },
    {
      header: "Purchase Date",
      cell: (product: any) => product?.purchaseDate ? moment(product.purchaseDate).format("DD MMM YYYY, hh:mm A") : "-",
    },
    
    {
      header: "Actions",
      cell: (product: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSelectedProduct(product); setDetailsOpen(true); }}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Handler for deleting all products
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL products? This action cannot be undone.")) return;
    setIsDeletingAll(true);
    try {
      const response = await fetch("/api/products", { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        toast({ title: "All products deleted", description: data.message || "Successfully deleted all products.", variant: "default" });
        refetch();
      } else {
        toast({ title: "Delete failed", description: data.error || "Failed to delete products.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Delete failed", description: (err as Error).message || "Failed to delete products.", variant: "destructive" });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className="space-y-4 px-2 sm:px-4 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Manage your product inventory and details
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link href="/dashboard/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/products/add-bulk">
              <Package className="h-4 w-4 mr-2" />
              Add Bulk Product
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAll}
            disabled={isDeletingAll || isLoading || products.length === 0}
          >
            {isDeletingAll ? "Deleting..." : "Delete All"}
          </Button>
        </div>
      </div>

     
      {/* Loading and Error States */}
      {isLoading ? (
        <div className="text-center py-10">Loading products...</div>
      ) : isError ? (
        <div className="text-center text-red-500 py-10">
          {error?.message || "Failed to load products."}
        </div>
      ) : (
        <GlobalTable
          columns={productColumns}
          data={filteredProducts}
          title="Products"
          stateList={filteredProducts}
        />
      )}
      <ProductDetailsDialog open={detailsOpen} onOpenChange={setDetailsOpen} product={selectedProduct} />
      {/* Upload Images Modal */}
      

      <UploadImageModalProductList
        refetch={refetch}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        uploadOpen={uploadOpen}
        setUploadOpen={setUploadOpen}
        uploadingProduct={uploadingProduct}
      />
      
      {/* SKU Images Modal */}

      <ImagePreviewProductList skuImagesOpen={skuImagesOpen} setSkuImagesOpen={setSkuImagesOpen} skuImages={skuImages} />
    </div>
  );
}
