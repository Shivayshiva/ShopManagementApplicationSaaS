"use client"

import type React from "react"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  CalendarDays,
  MapPin,
  Phone,
  Mail,
  Building,
  User,
  Users,
  Globe,
  CreditCard,
  FileText,
  Clock,
  DollarSign,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Validation schema
const shopFormSchema = z.object({
  // Shop Details
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  shopStatus: z.enum(["active", "inactive", "suspended"]),
  shopLogoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  businessType: z.enum(["retail", "wholesale", "service", "manufacturing"]),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  gstNumber: z.string().min(15, "GST number must be 15 characters").max(15, "GST number must be 15 characters"),

  // Address
  addressLine1: z.string().min(5, "Address line 1 must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  pinCode: z.string().min(5, "Pin code must be at least 5 characters"),
  geoCoordinates: z.string().regex(/^-?\d+\.?\d*,-?\d+\.?\d*$/, "Invalid coordinates format (lat,lng)"),

  // Owner Details
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
  panCard: z.string().min(10, "PAN card must be 10 characters").max(10, "PAN card must be 10 characters"),
  adharCard: z.string().min(12, "Aadhar card must be 12 characters").max(12, "Aadhar card must be 12 characters"),
  loginUrl: z.string().url("Invalid URL"),
})

type ShopFormData = z.infer<typeof shopFormSchema>

// Sample data for demonstration
const shopUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    lastLogin: "2024-01-15 10:30 AM",
    coordinates: "40.7128, -74.0060",
    userType: "Manager",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 234 567 8901",
    lastLogin: "2024-01-14 02:15 PM",
    coordinates: "40.7589, -73.9851",
    userType: "Staff",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+1 234 567 8902",
    lastLogin: "2024-01-13 09:45 AM",
    coordinates: "40.7505, -73.9934",
    userType: "Cashier",
    status: "Inactive",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    phone: "+1 234 567 8903",
    lastLogin: "2024-01-12 03:20 PM",
    coordinates: "40.7282, -73.7949",
    userType: "Assistant Manager",
    status: "Active",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    phone: "+1 234 567 8904",
    lastLogin: "2024-01-11 11:15 AM",
    coordinates: "40.6892, -74.0445",
    userType: "Sales Associate",
    status: "Active",
  },
]

// Default form values
const defaultValues: ShopFormData = {
  shopName: "Tech Store Pro",
  shopStatus: "active",
  shopLogoUrl: "",
  businessType: "retail",
  industry: "Electronics",
  email: "shop@techstore.com",
  gstNumber: "22AAAAA0000A1Z5",
  addressLine1: "123 Main Street",
  addressLine2: "Suite 100",
  city: "New York",
  state: "NY",
  country: "United States",
  pinCode: "10001",
  geoCoordinates: "40.7128,-74.0060",
  ownerName: "Robert Johnson",
  phoneNumber: "+1 555 123 4567",
  panCard: "ABCDE1234F",
  adharCard: "123456789012",
  loginUrl: "https://owner.techstore.com",
}

// Read-only data
const readOnlyData = {
  revenueTotalGenerated: "$125,000.00",
  createdAt: "Jan 15, 2023 10:30 AM",
  lastLogin: "Jan 15, 2024 2:30 PM",
  ownerLastLogin: "Jan 15, 2024 4:45 PM",
}

// Map Component
const MapComponent = ({ coordinates }: { coordinates: string }) => {
  const [lat, lng] = coordinates.split(",").map((coord) => Number.parseFloat(coord.trim()))

  return (
    <div className="w-full h-64 bg-muted rounded-lg border overflow-hidden">
      <iframe
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Shop Location Map"
      />
    </div>
  )
}

export default function ShopDetailModal({open, setOpen}) {
//   const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ShopFormData>({
    resolver: zodResolver(shopFormSchema),
    defaultValues,
  })

  const onSubmit = async (data: ShopFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log("Form data:", data)
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    form.reset(defaultValues)
    setIsEditing(false)
  }

  const renderField = (name: keyof ShopFormData, label: string, icon?: React.ReactNode, type = "text") => {
    if (!isEditing) {
      const value = form.getValues(name)
      return (
        <div className="space-y-3">
          <Label className="text-sm font-medium">{label}</Label>
          <div className={`h-10 px-3 py-2 border rounded-md bg-muted/50 flex items-center ${icon ? "pl-10" : ""}`}>
            {icon && <div className="absolute left-3">{icon}</div>}
            {value || "Not set"}
          </div>
        </div>
      )
    }

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-medium">{label}</FormLabel>
            <FormControl>
              <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">{icon}</div>}
                <Input
                  {...field}
                  type={type}
                  className={`h-10 ${icon ? "pl-10" : ""}`}
                  placeholder={`Enter ${label.toLowerCase()}`}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  const renderSelectField = (name: keyof ShopFormData, label: string, options: { value: string; label: string }[]) => {
    if (!isEditing) {
      const value = form.getValues(name)
      const selectedOption = options.find((opt) => opt.value === value)
      return (
        <div className="space-y-3">
          <Label className="text-sm font-medium">{label}</Label>
          <div className="h-10 px-3 py-2 border rounded-md bg-muted/50 flex items-center">
            {selectedOption ? (
              name === "shopStatus" ? (
                <Badge variant="default">{selectedOption.label}</Badge>
              ) : (
                selectedOption.label
              )
            ) : (
              "Not set"
            )}
          </div>
        </div>
      )
    }

    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-sm font-medium">{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  const renderReadOnlyField = (label: string, value: string, icon?: React.ReactNode) => (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div
        className={`h-10 px-3 py-2 border rounded-md bg-muted/30 text-muted-foreground flex items-center ${icon ? "pl-10" : ""}`}
      >
        {icon && <div className="absolute left-3">{icon}</div>}
        {value}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button>View Shop Details</Button>
      </DialogTrigger> */}
      <DialogContent className="w-[1600px] max-w-[98vw] max-h-[95vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Building className="h-6 w-6" />
                Shop Management
              </DialogTitle>
              <DialogDescription className="mt-2">
                Manage shop details, owner information, and user access
              </DialogDescription>
            </div>
            <Button
              variant={isEditing ? "destructive" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="min-w-[100px]"
              disabled={isLoading}
            >
              {isEditing ? "Cancel Edit" : "Edit"}
            </Button>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="shop-details" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="shop-details" className="flex items-center gap-2 py-3">
                  <Building className="h-4 w-4" />
                  Shop Details
                </TabsTrigger>
                <TabsTrigger value="owner-details" className="flex items-center gap-2 py-3">
                  <User className="h-4 w-4" />
                  Owner Details
                </TabsTrigger>
                <TabsTrigger value="shop-users" className="flex items-center gap-2 py-3">
                  <Users className="h-4 w-4" />
                  Shop Users
                </TabsTrigger>
              </TabsList>

              <TabsContent value="shop-details" className="space-y-8">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5" />
                      Basic Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {renderField("shopName", "Shop Name")}

                      {renderSelectField("shopStatus", "Shop Status", [
                        { value: "active", label: "Active" },
                        { value: "inactive", label: "Inactive" },
                        { value: "suspended", label: "Suspended" },
                      ])}

                      {renderSelectField("businessType", "Business Type", [
                        { value: "retail", label: "Retail" },
                        { value: "wholesale", label: "Wholesale" },
                        { value: "service", label: "Service" },
                        { value: "manufacturing", label: "Manufacturing" },
                      ])}

                      {renderField("industry", "Industry")}

                      {renderField("email", "Email", <Mail className="h-4 w-4 text-muted-foreground" />, "email")}

                      {renderField("gstNumber", "GST Number")}

                      {renderField("shopLogoUrl", "Shop Logo URL", undefined, "url")}

                      {renderReadOnlyField(
                        "Total Revenue Generated",
                        readOnlyData.revenueTotalGenerated,
                        <DollarSign className="h-4 w-4 text-muted-foreground" />,
                      )}

                      {renderReadOnlyField(
                        "Created At",
                        readOnlyData.createdAt,
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />,
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Address Fields */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          {renderField("addressLine1", "Address Line 1")}
                          {renderField("addressLine2", "Address Line 2")}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {renderField("city", "City")}
                          {renderField("state", "State")}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {renderField("country", "Country")}
                          {renderField("pinCode", "Pin Code")}
                        </div>

                        {renderField(
                          "geoCoordinates",
                          "Geo Coordinates",
                          <MapPin className="h-4 w-4 text-muted-foreground" />,
                        )}
                      </div>

                      {/* Map */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Location Map</Label>
                        <MapComponent coordinates={form.watch("geoCoordinates") || defaultValues.geoCoordinates} />
                        <p className="text-xs text-muted-foreground">
                          Interactive map showing the exact location based on coordinates
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="owner-details" className="space-y-8">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5" />
                      Owner Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {renderField("ownerName", "Owner Name")}

                      {renderField("phoneNumber", "Phone Number", <Phone className="h-4 w-4 text-muted-foreground" />)}

                      {renderField("panCard", "PAN Card", <CreditCard className="h-4 w-4 text-muted-foreground" />)}

                      {renderField("adharCard", "Aadhar Card", <FileText className="h-4 w-4 text-muted-foreground" />)}

                      {renderReadOnlyField(
                        "Last Login",
                        readOnlyData.ownerLastLogin,
                        <Clock className="h-4 w-4 text-muted-foreground" />,
                      )}

                      {renderField("loginUrl", "Login URL", <Globe className="h-4 w-4 text-muted-foreground" />, "url")}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="shop-users" className="space-y-8">
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="h-5 w-5" />
                      User Management
                    </CardTitle>
                    <CardDescription>Manage users who have access to this shop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="px-3 py-1">
                          {shopUsers.length} Total Users
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                          {shopUsers.filter((u) => u.status === "Active").length} Active
                        </Badge>
                      </div>
                      <Button size="sm" className="px-4">
                        Add New User
                      </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="font-semibold w-[180px]">Name</TableHead>
                            <TableHead className="font-semibold w-[250px]">Contact</TableHead>
                            <TableHead className="font-semibold w-[180px]">Last Login</TableHead>
                            <TableHead className="font-semibold w-[200px]">Coordinates</TableHead>
                            <TableHead className="font-semibold w-[150px]">User Type</TableHead>
                            <TableHead className="font-semibold w-[120px]">Status</TableHead>
                            <TableHead className="font-semibold w-[100px]">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shopUsers.map((user) => (
                            <TableRow key={user.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium py-4">{user.name}</TableCell>
                              <TableCell className="py-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Phone className="h-3 w-3 flex-shrink-0" />
                                    <span>{user.phone}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs">{user.lastLogin}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                  <span className="text-xs font-mono">{user.coordinates}</span>
                                </div>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge variant="outline" className="px-2 py-1 text-xs">
                                  {user.userType}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <Badge
                                  variant={user.status === "Active" ? "default" : "secondary"}
                                  className="px-2 py-1 text-xs"
                                >
                                  {user.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="py-4">
                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <User className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MapPin className="h-3 w-3" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 pt-6 border-t mt-8">
              <Button variant="outline" onClick={() => setOpen(false)} className="px-6" type="button">
                Close
              </Button>
              {isEditing && (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="px-6 bg-transparent"
                    type="button"
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="px-6" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
