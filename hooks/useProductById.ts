import { IProduct } from "@/lib/models/Product";
import { useQuery } from "@tanstack/react-query";

const useProductById = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) throw new Error("Product ID is required");

      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();

      if (data.success && data.data) {
        return data.data as IProduct;
      } else {
        throw new Error(data.error || "Failed to load product");
      }
    },
    enabled:false, // Don't auto-run on mount
    staleTime: 5 * 60 * 1000,
  });
};

export default useProductById;
