import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import React from "react"
import { useCreateStaff } from "@/hooks/useStaff"

// Zod schema for staff form validation
const staffFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string().min(1, "Phone number is required"),
  familyContact: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  category: z.enum(["Type 1", "Type 2", "Type 3", "Type 4"], {
    required_error: "Category is required",
  }),
  address: z.string().optional(),
  joiningDate: z.date({
    required_error: "Joining date is required",
  }),
})

type StaffFormData = z.infer<typeof staffFormSchema>

interface AddStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStaffDialog({ open, onOpenChange }: AddStaffDialogProps) {
  const createStaffMutation = useCreateStaff()
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      familyContact: "",
      role: "",
      category: "Type 1",
      address: "",
      joiningDate: new Date(),
    },
  })

  const handleAdd = (data: StaffFormData) => {
    createStaffMutation.mutate({
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      familyPhone: data.familyContact || undefined,
      role: data.role,
      category: data.category,
      address: data.address || undefined,
      joiningDate: data.joiningDate,
      isActive: true,
    }, {
      onSuccess: () => {
        onOpenChange(false)
        reset()
      }
    })
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value)
    setValue("joiningDate", date)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => onOpenChange(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Staff Member
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleAdd)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-800 text-sm opacity-80">👤 Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  {...register("phone", { required: "Phone number is required" })}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="familyContact">Family Contact Number</Label>
                <Input
                  id="familyContact"
                  {...register("familyContact")}
                  placeholder="Enter family contact number"
                />
                {errors.familyContact && <p className="text-red-500 text-xs mt-1">{errors.familyContact.message}</p>}
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  {...register("role", { required: "Role is required" })}
                  placeholder="Enter role (e.g., Manager, Cashier)"
                />
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
              </div>
            </div>
          </div>

          {/* Category and Joining Date */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-800 text-sm opacity-80">📋 Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setValue("category", value as any)} defaultValue="Type 1">
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Type 1">Type 1</SelectItem>
                    <SelectItem value="Type 2">Type 2</SelectItem>
                    <SelectItem value="Type 3">Type 3</SelectItem>
                    <SelectItem value="Type 4">Type 4</SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
              </div>
              <div>
                <Label htmlFor="joiningDate">Joining Date *</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  onChange={handleDateChange}
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
                {errors.joiningDate && <p className="text-red-500 text-xs mt-1">{errors.joiningDate.message}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-800 text-sm opacity-80">🏠 Address</h3>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                {...register("address")}
                placeholder="Enter address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createStaffMutation.isPending}>
              {createStaffMutation.isPending ? "Adding..." : "Add Staff Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 