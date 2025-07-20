import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import React from "react"

interface AddCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCustomer: (data: any) => void
}

export function AddCustomerDialog({ open, onOpenChange, onAddCustomer }: AddCustomerDialogProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: "",
      gender: "",
      dateOfBirth: "",
      mobileNumber: "",
      alternateMobileNumber: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
      country: "India",
      totalPurchases: 0,
      totalVisits: 0,
      loyaltyPoints: 0,
      preferredItems: "",
      status: "active",
    },
  })

  const handleAdd = (data: any) => {
    onAddCustomer(data)
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-6 p-4 max-h-[70vh] overflow-y-auto">
          {/* 🧍 Basic Customer Information */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-800 text-sm opacity-80">🧍 Basic Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <Input {...register("fullName", { required: "Full name is required" })} />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select className="w-full border rounded px-3 py-2" {...register("gender")}> 
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Date of Birth</label>
                <Input type="date" {...register("dateOfBirth")} />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          {/* 📞 Contact Information */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-800 text-sm opacity-80">📞 Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Mobile Number</label>
                <Input {...register("mobileNumber", { required: "Mobile number is required" })} />
                {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber.message as string}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Alternate Mobile Number</label>
                <Input {...register("alternateMobileNumber")} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input type="email" {...register("email")} />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          {/* 🏠 Address */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-800 text-sm opacity-80">🏠 Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Address Line 1</label>
                <Input {...register("addressLine1", { required: "Address Line 1 is required" })} />
                {errors.addressLine1 && <p className="text-red-500 text-xs mt-1">{errors.addressLine1.message as string}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Address Line 2</label>
                <Input {...register("addressLine2")} />
              </div>
              <div>
                <label className="block mb-1 font-medium">City</label>
                <Input {...register("city", { required: "City is required" })} />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">State</label>
                <Input {...register("state", { required: "State is required" })} />
                {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message as string}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Pin Code</label>
                <Input {...register("pinCode", { required: "Pin Code is required" })} />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1">{errors.pinCode.message as string}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Country</label>
                <Input {...register("country")} defaultValue="India" />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          {/* 🛍️ Purchase & Loyalty Details */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-800 text-sm opacity-80">🛍️ Purchase & Loyalty Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Total Purchases</label>
                <Input type="number" {...register("totalPurchases")} min={0} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Total Visits</label>
                <Input type="number" {...register("totalVisits")} min={0} />
              </div>
              <div>
                <label className="block mb-1 font-medium">Loyalty Points</label>
                <Input type="number" {...register("loyaltyPoints")} min={0} />
              </div>
              <div className="md:col-span-3">
                <label className="block mb-1 font-medium">Preferred Items</label>
                <Input {...register("preferredItems")} />
              </div>
            </div>
          </div>
          <hr className="my-4" />
          {/* Status */}
          <div>
            <label className="block mb-1 font-medium text-gray-800 text-sm opacity-80">Status</label>
            <select className="w-full border rounded px-3 py-2" {...register("status")}> 
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 