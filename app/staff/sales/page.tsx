"use client"

import { useState } from "react"
import { CreditCard, Plus, Printer, QrCode, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export default function SalesPage() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Product A", price: 299, quantity: 2, total: 598 },
    { id: 2, name: "Product B", price: 150, quantity: 1, total: 150 },
  ])

  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const discount = 50
  const tax = (subtotal - discount) * 0.18
  const total = subtotal - discount + tax

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Sales & Billing</h1>
            <p className="text-sm text-muted-foreground">Create new sales and manage billing</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Product Search & Cart */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Products</CardTitle>
                <CardDescription>Search and add products to cart</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-8" />
                  </div>
                  <Button variant="outline" size="icon">
                    <QrCode className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div>
                      <p className="font-medium">Product A</p>
                      <p className="text-sm text-muted-foreground">SKU: ABC123 • Stock: 25</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹299</p>
                      <Button size="sm" variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <div>
                      <p className="font-medium">Product B</p>
                      <p className="text-sm text-muted-foreground">SKU: DEF456 • Stock: 12</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹150</p>
                      <Button size="sm" variant="outline">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cart Items */}
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>
                          <Input type="number" value={item.quantity} className="w-16" />
                        </TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell>₹{item.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Billing & Payment */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer or walk-in" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                      <SelectItem value="john">John Doe (+91 98765 43210)</SelectItem>
                      <SelectItem value="jane">Jane Smith (+91 87654 32109)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter phone number" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bill Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Discount</span>
                    <div className="flex items-center gap-2">
                      <Input type="number" value={discount} className="w-20 h-8" />
                      <span>₹{discount}</span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Payment Method</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="split">Split Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="received">Amount Received</Label>
                    <Input id="received" type="number" placeholder="Enter amount" />
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Process Payment
                    </Button>
                    <Button variant="outline" size="icon">
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Sales */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">INV-001</p>
                      <p className="text-sm text-muted-foreground">2 items • Cash</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹748</p>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <p className="font-medium">INV-002</p>
                      <p className="text-sm text-muted-foreground">1 item • UPI</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹299</p>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
