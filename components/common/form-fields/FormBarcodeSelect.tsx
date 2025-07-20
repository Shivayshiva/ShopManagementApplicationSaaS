import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScanBarcode, Search, Plus, Check, ChevronsUpDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useQuery, useMutation } from "@tanstack/react-query";

export function FormBarcodeSelect({ 
  label, 
  name, 
  options, 
  control, 
  placeholder = "Enter serial number or select from options", 
  error, 
  onScanClick,
  onProductFound
}: any) {
  const [searchValue, setSearchValue] = useState("");
  const [foundProducts, setFoundProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all products using React Query
  const {
    data: allProductsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: productsError
  } = useQuery({
    queryKey: ["all-products"],
    queryFn: async () => {
      const response = await fetch("/api/products?limit=1000");
      const data = await response.json();
      if (data.success && data.data) {
        return data.data
      } else {
        throw new Error(data.error || "Failed to load products");
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  // Search product by serial number using React Query Mutation
  const searchProductMutation = useMutation({
    mutationFn: async (searchText: string) => {
      const response = await fetch(`/api/products/search?serialNumber=${encodeURIComponent(searchText.trim())}`);
      const data = await response.json();
      if (data.success && data.data) {
        return data.data;
      } else {
        throw new Error(data.error || "Product not found");
      }
    },
    onSuccess: (product: any) => {
      // const productData = {
      //   type: product.category || "",
      //   serialNumber: product.sku || product.barcode || "",
      //   quantity: 1,
      //   rate: product.finalRate || product.price || 0,
      //   gstPercentage: 18,
      //   discountPercentage: product.discount || 0,
      //   name: product.name,
      //   description: product.description
      // };
      setFoundProducts(prev => {
        const exists = prev.find(p => p.serialNumber === product.sku);
        if (!exists) {
          return [...prev, product];
        }
        return prev;
      });
      toast.success("Product found and added to options!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Product not found");
    }
  });

  // Combine original options with found products and all products
  const allProducts = allProductsData || [];

  console.log("_sd_we_Ew_sd_ew_sd",allProductsData)
  const allOptions = [
    ...(options || []),
    ...allProducts,
    ...foundProducts.map((product: any) => ({
      value: product.serialNumber,
      label: `${product.name} - ${product.serialNumber}`
    }))
  ];

  const handleSearch = (searchText: string) => {
    if (!searchText.trim()) return;
    searchProductMutation.mutate(searchText);
  };

  const handleSelectChange = (selectedProduct: any) => {
    console.log("data_data_data_34", selectedProduct)
    setSelectedProduct(selectedProduct);
    if (selectedProduct && onProductFound) {
      // Convert the selected product to the expected format
      // const productData = {
      //   type: selectedProduct.category || "",
      //   serialNumber: selectedProduct.sku || selectedProduct.barcode || selectedProduct._id,
      //   quantity: 1,
      //   rate: selectedProduct.finalRate || selectedProduct.price || 0,
      //   gstPercentage: 18,
      //   discountPercentage: selectedProduct.discount || 0,
      //   name: selectedProduct.name,
      //   description: selectedProduct.description
      // };
      onProductFound(selectedProduct);
      toast.success("Product added to list!");
    }
  };

  // Debounced search input
  useEffect(() => {
    if (!searchValue.trim()) return;
    const timeoutId = setTimeout(() => {
      handleSearch(searchValue);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  return (
    <div>
      <label className="block mb-1">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex gap-2">
            <div className="flex-1">
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="w-full justify-between bg-transparent"
                    disabled={isLoadingProducts}
                  >
                    {field.value ? 
                      (typeof field.value === 'object' ? field.value.name : allOptions.find((option) => option.value === field.value)?.label) : 
                      isLoadingProducts ? "Loading products..." : placeholder
                    }
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput 
                      placeholder="Type to search products..." 
                      className="px-4 py-2"
                      value={searchValue}
                      onValueChange={setSearchValue}
                    />
                    <CommandList>
                      {(searchProductMutation.isPending || isLoadingProducts) && (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                          <span className="ml-2 text-sm text-muted-foreground">
                            {isLoadingProducts ? "Loading products..." : "Searching..."}
                          </span>
                        </div>
                      )}
                      {isErrorProducts && (
                        <div className="text-red-500 text-xs py-2 px-4">{productsError?.message || "Failed to load products"}</div>
                      )}
                      <CommandEmpty>No products found.</CommandEmpty>
                      <CommandGroup>
                        {allProducts?.map((option: any) => (
                          <CommandItem
                            key={option?._id}
                            value={option._id}
                            onSelect={(currentValue) => {
                              const selectedProduct = allProducts.find((p: any) => p._id === currentValue);
                              field.onChange(selectedProduct);
                              handleSelectChange(selectedProduct);
                              setIsOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", field.value?._id === option._id ? "opacity-100" : "opacity-0")} />
                            {option.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <Button 
              type="button" 
              onClick={onScanClick} 
              variant="outline"
              className="px-3"
            >
              <ScanBarcode className="h-4 w-4" />
            </Button>
          </div>
        )}
      />
      {error && (
        <p className="text-red-500 text-xs mt-3">{error}</p>
      )}
    </div>
  );
} 