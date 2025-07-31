"use client";

import { useState } from "react";
import InvoiceModal from "@/components/InvoiceCreateModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormMultiSelect } from "@/components/common/form-fields/FormMultiSelect";
import { FormTextInput } from "@/components/common/form-fields/FormTextInput";
import { FormNumberInput } from "@/components/common/form-fields/FormNumberInput";
import { Button } from "@/components/ui/button";
import CameraBarcodeScanner from "@/components/common/camerBarCodeDetector";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import Counter from "@/components/counter";

interface Product {
    id: string
    type: string
    serialNumber: string
    quantity: number
    rate: number
    price: number
    gst: number
    discountedPrice: number
  }

export default function CreateInvoicePage() {   

  const [products, setProducts] = useState<Product[]>([])
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      type: "",
      serialNumber: "",
      quantity: 1,
      rate: 0,
      gstPercentage: 18,
      discountPercentage: 0,
    },
  })

  const watched = watch()

  const calculatePricing = (data = watched) => {
    const basePrice = data.quantity * data.rate
    const gstAmount = (basePrice * data.gstPercentage) / 100
    const totalWithGst = basePrice + gstAmount
    const discountAmount = (totalWithGst * data.discountPercentage) / 100
    const finalPrice = totalWithGst - discountAmount
    return {
      price: basePrice,
      gst: gstAmount,
      discountedPrice: finalPrice,
    }
  }

  const onAddProduct = (data: any) => {
    if (!data.type || !data.serialNumber || data.rate <= 0) {
      alert("Please fill in all required fields")
      return
    }
    const pricing = calculatePricing(data)
    const newProduct: Product = {
      id: Date.now().toString(),
      type: data.type,
      serialNumber: data.serialNumber,
      quantity: data.quantity,
      rate: data.rate,
      price: pricing.price,
      gst: pricing.gst,
      discountedPrice: pricing.discountedPrice,
    }
    setProducts((prev) => [...prev, newProduct])
    reset()
  }

  const removeProduct = (id: string) => {
    setProducts((prev) => prev?.filter((product) => product?.id !== id))
  }

  const getTotals = () => {
    return products?.reduce(
      (acc, product) => ({
        subtotal: acc.subtotal + product.price,
        gst: acc.gst + product.gst,
        total: acc.total + product.discountedPrice,
      }),
      { subtotal: 0, gst: 0, total: 0 },
    )
  }

  const totals = getTotals()

  const handleBarCodeScannedData=(response)=>{
    console.log("_SDFDFD___RESPONSE",response)
    setValue("serialNumber", response)
  }

  const onOpenChange=(value:boolean)=>{console.log(value)};


  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-4xl">
        <span className="sr-only">
          <h2>Create Invoice</h2>
        </span>
        <div className="space-y-6 p-2">
          <Card>
            <CardHeader>
              <CardTitle>Create Invoice - Add Product</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <FormMultiSelect
                  label="Product Type *"
                  name="type"
                  control={control}
                  options={["electronics", "furniture", "clothing", "books", "accessories", "other"]}
                  placeholder="Select type"
                  error={errors.type?.message}
                />
                <FormTextInput
                  label="Serial Number *"
                  name="serialNumber"
                  control={control}
                  placeholder="Enter serial number"
                  error={errors.serialNumber?.message}
                />
                <FormNumberInput
                  label="Quantity"
                  name="quantity"
                  control={control}
                  min={1}
                  error={errors.quantity?.message}
                />
                <FormNumberInput
                  label="Rate (₹) *"
                  name="rate"
                  control={control}
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  error={errors.rate?.message}
                />
                <FormNumberInput
                  label="GST (%)"
                  name="gstPercentage"
                  control={control}
                  min={0}
                  max={100}
                  error={errors.gstPercentage?.message}
                />
                <FormNumberInput
                  label="Discount (%)"
                  name="discountPercentage"
                  control={control}
                  min={0}
                  max={100}
                  error={errors.discountPercentage?.message}
                />
                <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-4">
                  <Button onClick={handleSubmit(onAddProduct)} className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                  <CameraBarcodeScanner onResult={value => handleBarCodeScannedData(value)} />
                </div>
              </div>

              {/* Price Preview */}
              {watched.rate > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>₹{(watched.quantity * watched.rate).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST ({watched.gstPercentage}%):</span>
                      <span>₹{((watched.quantity * watched.rate * watched.gstPercentage) / 100).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount ({watched.discountPercentage}%):</span>
                      <span>
                        -₹
                        {(
                          ((watched.quantity * watched.rate +
                            (watched.quantity * watched.rate * watched.gstPercentage) / 100) *
                            watched.discountPercentage) /
                          100
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Final Price:</span>
                      <span>₹{calculatePricing().discountedPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products Table */}
          {products?.length > 0 && (
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
                      {products?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.type}</TableCell>
                          <TableCell>{product?.serialNumber}</TableCell>
                          <TableCell>{product?.quantity}</TableCell>
                          <TableCell>₹{product?.rate}</TableCell>
                          <TableCell>₹{product?.price}</TableCell>
                          <TableCell>₹{product?.gst}</TableCell>
                          <TableCell className="font-semibold">₹{product.discountedPrice}</TableCell>
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
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      alert("Invoice created successfully!")
                      setProducts([])
                      onOpenChange(false)
                    }}
                  >
                    Create Invoice
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {products?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products added yet. Add products using the form above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 