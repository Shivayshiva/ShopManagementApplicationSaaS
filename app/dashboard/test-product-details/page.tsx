"use client";

import React, { useRef } from "react";
import ProductDetails from "@/components/productDetails";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function TestProductDetailsPage() {
  const productDetailsRef = useRef<any>(null);

  const handlePrintProducts = () => {
    const products = productDetailsRef.current;
    console.log("Current products:", products);
    alert(`Products to print: ${JSON.stringify(products, null, 2)}`);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Product Details Test</h1>
        <p className="text-muted-foreground">
          Test the new product scanning and search functionality
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ProductDetails ref={productDetailsRef} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">How to use:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>
                  <strong>Scan Product:</strong> Click the barcode scanner icon to scan a product
                </li>
                <li>
                  <strong>Search by Serial Number:</strong> If scanning doesn't work, enter the serial number (SKU or barcode) in the search field and click the search icon
                </li>
                <li>
                  <strong>Manual Entry:</strong> You can also manually fill in the product details
                </li>
                <li>
                  <strong>Add Product:</strong> Click "Add Product" to add the product to the list
                </li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Automatic product detection via scanning</li>
                <li>Fallback search by serial number</li>
                <li>Real-time price calculation with GST and discount</li>
                <li>Product list management</li>
                <li>Total calculation for all added products</li>
              </ul>
            </div>

            <div className="pt-4">
              <Button onClick={handlePrintProducts} className="w-full">
                <Printer className="h-4 w-4 mr-2" />
                Print Products List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 