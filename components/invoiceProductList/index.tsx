import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { createInvoice } from "@/lib/features/invoiceSlice";
import { useRouter } from "next/navigation";

function InvoiceProductList({ productList, removeProduct, handleCreateInvoice }) {
  console.log("___productlist_sjdlfkjdjfjdkf_productList", productList);
  const dispatch = useDispatch();
  const router = useRouter();
  const getTotals = () => {
    return productList?.reduce(
      (acc, product) => ({
        subtotal: acc.subtotal + product.price,
        gst: acc.gst + product.gst,
        total: acc.total + product.discountedPrice,
      }),
      { subtotal: 0, gst: 0, total: 0 }
    );
  };

  const handleGenerateInvoice = () => {
    if (productList) {
      dispatch(createInvoice(productList));
      router.push("/dashboard/billing");
    }
  };

  const totals = getTotals();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Rate (₹)</TableHead>
                <TableHead>Price (₹)</TableHead>
                <TableHead>GST (₹)</TableHead>
                <TableHead>Final Price (₹)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productList?.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.type}</TableCell>
                  <TableCell>{product?.serialNumber}</TableCell>
                  <TableCell>{product?.quantity}</TableCell>
                  <TableCell>₹{product?.rate}</TableCell>
                  <TableCell>₹{product?.price}</TableCell>
                  <TableCell>₹{product?.gst}</TableCell>
                  <TableCell className="font-semibold">
                    ₹{product.discountedPrice}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProduct(product.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-80 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total GST:</span>
              <span>₹{totals.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Grand Total:</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleCreateInvoice}>Create Invoice</Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default InvoiceProductList;
