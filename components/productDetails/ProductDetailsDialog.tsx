import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import React from "react";
import type { IProduct } from "@/lib/models/Product";
import Image from "next/image";

interface ProductDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: IProduct | null;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({ open, onOpenChange, product }) => {
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-xs sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto rounded-sm scroll-m-0 p-2 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-base">Product Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-xs">
          {/* Barcode as Image */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground mb-1">Barcode</span>
            {product.barCode ? (
              <Image
                src={product.barCode}
                alt="Barcode"
                width={240} // doubled from 192
                height={200} // doubled from 64
                className="object-contain border-black rounded bg-white" // doubled from w-48 h-16
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                // unoptimized
              />
            ) : (
              <span className="text-muted-foreground">No barcode image</span>
            )}
          </div>
          <div className="grid lg:grid-cols-2 sm:grid-cols-1 gap-2">
            <div className="break-words">
              <span className="font-semibold">Name:</span> <span className="break-all">{product.name}</span>
            </div>
            <div className="break-words">
              <span className="font-semibold">SKU:</span> <span className="break-all">{product.sku}</span>
            </div>
            <div className="break-words">
              <span className="font-semibold">Bill No:</span> <span className="break-all">{product.billNo}</span>
            </div>
            <div className="break-words">
              <span className="font-semibold">Product Of:</span> <span className="break-all">{product.productOf}</span>
            </div>
            <div className="break-words">
              <span className="font-semibold">Purchase Date:</span> {product.purchaseDate ? new Date(product.purchaseDate).toLocaleDateString() : "-"}
            </div>
            {/* Remove Created At if not in IProduct */}
            <div className="col-span-2 break-words">
              <span className="font-semibold">Description:</span> <span className="break-all">{product.description || "-"}</span>
            </div>
            <div className="col-span-2 break-words">
              <span className="font-semibold">Tags:</span> <span className="break-all">{product.tags?.length ? product.tags.join(", ") : "-"}</span>
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Colors:</span>
              <div className="flex gap-2 mt-1">
                {product.color?.length ? product.color.map((c, i) => (
                  <span key={i} className="inline-block w-5 h-5 rounded-full border" style={{ backgroundColor: c }} title={c}></span>
                )) : "-"}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog; 