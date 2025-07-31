"use client"

import { useState } from "react"
import { Phone, Plus, Search, Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const customers = [
  {
    id: 1,
    name: "John Doe",
    phone: "+91 98765 43210",
    email: "john@example.com",
    address: "123 Main St, City",
    totalOrders: 15,
    totalSpent: 12450,
    loyaltyPoints: 245,
    lastVisit: "2024-01-15",
    notes: "Prefers cash payments",
  },
  {
    id: 2,
    name: "Jane Smith",
    phone: "+91 87654 32109",
    email: "jane@example.com",
    address: "456 Oak Ave, City",
    totalOrders: 8,
    totalSpent: 6750,
    loyaltyPoints: 135,
    lastVisit: "2024-01-14",
    notes: "Regular customer, likes electronics",
  },
  {
    id: 3,
    name: "Bob Wilson",
    phone: "+91 76543 21098",
    email: "bob@example.com",
    address: "789 Pine Rd, City",
    totalOrders: 22,
    totalSpent: 18900,
    loyaltyPoints: 378,
    lastVisit: "2024-01-13",
    notes: "VIP customer, bulk orders",
  },
]

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Customer Management</h1>
            <p className="text-sm text-muted-foreground">Manage customer information and relationships</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Enter customer information to create a new profile</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Enter customer name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input id="email" type="email" placeholder="customer@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter customer address" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder="Any special notes about the customer" />
                </div>
                <Button className="w-full">Add Customer</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active This Month</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {customers.filter((c) => new Date(c.lastVisit) > new Date("2024-01-01")).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Customers</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {customers.filter((c) => c.totalSpent > 15000).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Loyalty Points</CardTitle>
              <Star className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {customers.reduce((sum, c) => sum + c.loyaltyPoints, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Directory</CardTitle>
            <CardDescription>View and manage customer information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, phone, or email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Loyalty Points</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.address}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{customer.phone}</p>
                        <p className="text-sm text-muted-foreground">{customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₹{customer.totalSpent.toLocaleString()}</p>
                        {customer.totalSpent > 15000 && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="mr-1 h-3 w-3" />
                            VIP
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-purple-600">
                        {customer.loyaltyPoints} pts
                      </Badge>
                    </TableCell>
                    <TableCell>{customer.lastVisit}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Customer Profile - {customer.name}</DialogTitle>
                              <DialogDescription>Complete customer information and purchase history</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">Phone</p>
                                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Email</p>
                                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Total Orders</p>
                                  <p className="text-sm text-muted-foreground">{customer.totalOrders}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Total Spent</p>
                                  <p className="text-sm text-muted-foreground">
                                    ₹{customer.totalSpent.toLocaleString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Loyalty Points</p>
                                  <p className="text-sm text-muted-foreground">{customer.loyaltyPoints} points</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">Last Visit</p>
                                  <p className="text-sm text-muted-foreground">{customer.lastVisit}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Address</p>
                                <p className="text-sm text-muted-foreground">{customer.address}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Notes</p>
                                <p className="text-sm text-muted-foreground">{customer.notes}</p>
                              </div>
                              <div className="flex gap-2">
                                <Button className="flex-1">Edit Customer</Button>
                                <Button variant="outline" className="flex-1 bg-transparent">
                                  View Orders
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
