"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { useForm, Controller } from "react-hook-form"
import { useState, useEffect } from "react"
import { Upload, User, CreditCard, BadgeIcon as IdCard } from "lucide-react"
import { toast } from "sonner"
import { useCreateUser, type CreateUserData } from "@/hooks/useUsers"

// Validation functions
const validatePAN = (value: string) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  return panRegex.test(value) || "Enter a valid PAN card number (e.g., ABCDE1234F)"
}

const validateAadhaar = (value: string) => {
  const aadhaarRegex = /^[0-9]{12}$/
  return aadhaarRegex.test(value) || "Enter a valid 12-digit Aadhaar number"
}

interface FormData {
  name: string
  mobileNumber: string
  email: string
  role: string
  shop: string
  profileImage?: FileList
  panCardNumber: string
  aadharCardNumber: string
  panCardUpload?: FileList
  aadharCardFrontUpload?: FileList
  aadharCardBackUpload?: FileList
}

const roles = [
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
  { value: "cashier", label: "Cashier" },
]

interface Shop {
  _id: string;
  shopName: string;
  isActive: boolean;
}

function FileUploadCard({
  title,
  icon: Icon,
  file,
  onFileChange,
  accept = "image/*,.pdf",
  error,
  preview,
  onPreviewChange,
  onUpload,
  uploadType,
  isLoading = false,
}: {
  title: string
  icon: any
  file?: FileList
  onFileChange: (files: FileList | null) => void
  accept?: string
  error?: string
  preview?: string | null
  onPreviewChange?: (preview: string | null) => void
  onUpload?: (files: FileList, type: 'profile' | 'pan' | 'aadharFront' | 'aadharBack') => Promise<void>
  uploadType?: 'profile' | 'pan' | 'aadharFront' | 'aadharBack'
  isLoading?: boolean
}) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files)
             if (onUpload && uploadType) {
         await onUpload(e.dataTransfer.files, uploadType as 'profile' | 'pan' | 'aadharFront' | 'aadharBack')
       } else {
        handleFilePreview(e.dataTransfer.files[0])
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files)
             if (onUpload && uploadType) {
         await onUpload(e.target.files, uploadType as 'profile' | 'pan' | 'aadharFront' | 'aadharBack')
       } else {
        handleFilePreview(e.target.files[0])
      }
    }
  }

  const handleFilePreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onPreviewChange?.(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      onPreviewChange?.(null)
    }
  }

  return (
    <Card className={`relative ${dragActive ? "border-primary" : ""} ${error ? "border-destructive" : ""}`}>
      <CardContent className="p-4">
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {isLoading ? (
            <div className="space-y-2">
              <div className="mx-auto h-20 w-20 bg-muted rounded-md border flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
              <p className="text-sm font-medium">{title}</p>
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </div>
          ) : preview ? (
            <div className="space-y-2">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="mx-auto h-20 w-20 object-cover rounded-md border"
              />
              <p className="text-sm font-medium">{title}</p>
            </div>
          ) : (
            <>
              <Icon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">{title}</p>
            </>
          )}

          {!preview && <p className="text-xs text-muted-foreground">Drag & drop or click to upload</p>}
        </div>

        {file && file[0] && (
          <div className="mt-2 p-2 bg-muted/50 rounded text-center">
            <p className="text-xs text-muted-foreground truncate" title={file[0].name}>
              📄 {file[0].name}
            </p>
            <p className="text-xs text-muted-foreground">{(file[0].size / 1024 / 1024).toFixed(2)} MB</p>
            {preview && (
              <p className="text-xs text-green-600 font-medium">✓ Uploaded successfully</p>
            )}
          </div>
        )}

        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default function UserRegistrationModal() {
  const [open, setOpen] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [shops, setShops] = useState<Shop[]>([])
  const [loadingShops, setLoadingShops] = useState(false)

  console.log("shop_1234_shops",shops)
  
  // State for storing image URLs
  const [aadharCardFrontImageUrl, setAadharCardFrontImageUrl] = useState<string | null>(null)
  const [aadharCardBackImageUrl, setAadharCardBackImageUrl] = useState<string | null>(null)
  const [panCardImageUrl, setPanCardImageUrl] = useState<string | null>(null)
  const [profilePhotoImageUrl, setProfilePhotoImageUrl] = useState<string | null>(null)
  const [uploadingImages, setUploadingImages] = useState<{[key: string]: boolean}>({})

  // TanStack Query mutation for creating user
  const createUserMutation = useCreateUser()


  
  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      setLoadingShops(true)
      try {
        const response = await fetch('/api/superAdmin/shop')
        const data = await response.json()
        if (data.success) {
          setShops(data.data)
        } else {
          toast.error('Failed to fetch shops')
        }
      } catch (error) {
        console.error('Error fetching shops:', error)
        toast.error('Failed to fetch shops')
      } finally {
        setLoadingShops(false)
      }
    }

    fetchShops()
  }, [])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      mobileNumber: "",
      email: "",
      role: "",
      shop: "",
      panCardNumber: "",
      aadharCardNumber: "",
    },
  })

  const profileImage = watch("profileImage")



  const onSubmit = async (data: FormData) => {
    try {
      // Validate that all required images are uploaded
      if (!panCardImageUrl) {
        toast.error("Please upload PAN card image");
        return;
      }
      if (!aadharCardFrontImageUrl) {
        toast.error("Please upload Aadhaar card front image");
        return;
      }
      if (!aadharCardBackImageUrl) {
        toast.error("Please upload Aadhaar card back image");
        return;
      }

      // Prepare the user data for API
      const userData: CreateUserData = {
        gstNumber: data.panCardNumber, // Using PAN as GST for now, adjust as needed
        email: data.email,
        name: data.name,
        mobileNumber: data.mobileNumber,
        role: data.role as 'admin' | 'manager' | 'staff' | 'cashier',
        shopId: data.shop,
        superAdminId: "super_admin_id",  // You'll need to get this from context or props
        // Document information
        panCardNumber: data.panCardNumber,
        aadharCardNumber: data.aadharCardNumber,
        panCardImage: panCardImageUrl,
        aadharCardFrontImage: aadharCardFrontImageUrl,
        aadharCardBackImage: aadharCardBackImageUrl,
        profileImage: profilePhotoImageUrl || undefined
      }

      // Call the mutation
      await createUserMutation.mutateAsync(userData)

      // Reset form and close modal on success
      reset()
      setProfilePreview(null)
      setAadharCardFrontImageUrl(null)
      setAadharCardBackImageUrl(null)
      setPanCardImageUrl(null)
      setProfilePhotoImageUrl(null)
      setUploadingImages({})
      setOpen(false)
    } catch (error) {
      console.error("Submission error:", error)
    }
  }

  const handleMultipleImageUpload = async (files: FileList, type: 'profile' | 'pan' | 'aadharFront' | 'aadharBack') => {
    if (!files || files.length === 0) return;

    // Set loading state
    setUploadingImages(prev => ({ ...prev, [type]: true }));

    // Convert files to base64 strings
    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64Images = await Promise.all(
        Array.from(files).map((file) => toBase64(file))
      );

      // Call the API to upload images
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: base64Images }),
      });
      
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        const uploadedUrl = data.urls[0]; // Get the first uploaded URL
        
        // Update the appropriate state based on type
        switch (type) {
          case 'profile':
            setProfilePhotoImageUrl(uploadedUrl);
            setProfilePreview(uploadedUrl);
            break;
          case 'pan':
            setPanCardImageUrl(uploadedUrl);
            break;
          case 'aadharFront':
            setAadharCardFrontImageUrl(uploadedUrl);
            break;
          case 'aadharBack':
            setAadharCardBackImageUrl(uploadedUrl);
            break;
        }
        
        toast.success(`${type === 'profile' ? 'Profile' : type === 'pan' ? 'PAN Card' : type === 'aadharFront' ? 'Aadhaar Front' : 'Aadhaar Back'} image uploaded successfully`);
      } else {
        console.error("Image upload failed");
        toast.error("Image upload failed");
      }
    } catch (err) {
      console.error("Image upload error:", err);
      toast.error("Image upload failed");
    } finally {
      // Clear loading state
      setUploadingImages(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleProfileImageChange = async (files: FileList | null) => {
    if (files && files[0]) {
      setValue("profileImage", files)
      await handleMultipleImageUpload(files, 'profile');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <User className="h-4 w-4" />
          Register New User
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">User Registration</DialogTitle>
          <DialogDescription>Fill in the details to register a new user in the system.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Form Content - Left Side */}
            <div className="lg:col-span-3 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      {...register("name", {
                        required: "Name is required",
                        minLength: { value: 2, message: "Name must be at least 2 characters" },
                      })}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">
                      Mobile Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="mobileNumber"
                      placeholder="Enter mobile number"
                      {...register("mobileNumber", {
                        required: "Mobile number is required",
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Enter a valid 10-digit mobile number",
                        },
                      })}
                      className={errors.mobileNumber ? "border-destructive" : ""}
                    />
                    {errors.mobileNumber && <p className="text-xs text-destructive">{errors.mobileNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Enter a valid email address",
                        },
                      })}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Controller
                      name="role"
                      control={control}
                      rules={{ required: "Role is required" }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className={errors.role ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <div className="space-y-2">
                      <Label htmlFor="shop">
                        Shop <span className="text-destructive">*</span>
                      </Label>
                      <Controller
                        name="shop"
                        control={control}
                        rules={{ required: "Shop selection is required" }}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className={errors.shop ? "border-destructive" : ""}>
                              <SelectValue placeholder="Select a shop" />
                            </SelectTrigger>
                            <SelectContent>
                              {/* {loadingShops ? (
                                <SelectItem disabled>
                                  Loading shops...
                                </SelectItem>
                              ) : shops.length === 0 ? (
                                <SelectItem value="" disabled>
                                  No active shops found 
                                </SelectItem>
                              ) : ( */}
                                {shops?.map((shop) => (
                                  <SelectItem key={shop?._id} value={shop?._id}>
                                    {shop?.shopName}
                                  </SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.shop && <p className="text-xs text-destructive">{errors.shop.message}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="panCardNumber">
                      PAN Card Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="panCardNumber"
                      placeholder="ABCDE1234F"
                      {...register("panCardNumber", {
                        required: "PAN Card number is required",
                        validate: validatePAN,
                      })}
                      className={errors.panCardNumber ? "border-destructive" : ""}
                    />
                    {errors.panCardNumber && <p className="text-xs text-destructive">{errors.panCardNumber.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aadharCardNumber">
                      Aadhar Card Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="aadharCardNumber"
                      placeholder="1234 5678 9012"
                      {...register("aadharCardNumber", {
                        required: "Aadhar Card number is required",
                        validate: validateAadhaar,
                      })}
                      className={errors.aadharCardNumber ? "border-destructive" : ""}
                    />
                    {errors.aadharCardNumber && (
                      <p className="text-xs text-destructive">{errors.aadharCardNumber.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Uploads</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Controller
                    name="panCardUpload"
                    control={control}
                    rules={{ 
                      required: "PAN Card upload is required",
                      validate: () => panCardImageUrl ? true : "Please upload PAN card image"
                    }}
                    render={({ field }) => (
                      <FileUploadCard
                        title="PAN Card"
                        icon={CreditCard}
                        file={field.value}
                        onFileChange={field.onChange}
                        accept="image/*,.pdf"
                        error={errors.panCardUpload?.message}
                        preview={panCardImageUrl}
                        onPreviewChange={setPanCardImageUrl}
                        onUpload={handleMultipleImageUpload}
                        uploadType="pan"
                        isLoading={uploadingImages.pan}
                      />
                    )}
                  />

                  <Controller
                    name="aadharCardFrontUpload"
                    control={control}
                    rules={{ 
                      required: "Aadhar Card front upload is required",
                      validate: () => aadharCardFrontImageUrl ? true : "Please upload Aadhaar front image"
                    }}
                    render={({ field }) => (
                      <FileUploadCard
                        title="Aadhar Front"
                        icon={IdCard}
                        file={field.value}
                        onFileChange={field.onChange}
                        accept="image/*,.pdf"
                        error={errors.aadharCardFrontUpload?.message}
                        preview={aadharCardFrontImageUrl}
                        onPreviewChange={setAadharCardFrontImageUrl}
                        onUpload={handleMultipleImageUpload}
                        uploadType="aadharFront"
                        isLoading={uploadingImages.aadharFront}
                      />
                    )}
                  />

                  <Controller
                    name="aadharCardBackUpload"
                    control={control}
                    rules={{ 
                      required: "Aadhar Card back upload is required",
                      validate: () => aadharCardBackImageUrl ? true : "Please upload Aadhaar back image"
                    }}
                    render={({ field }) => (
                      <FileUploadCard
                        title="Aadhar Back"
                        icon={IdCard}
                        file={field.value}
                        onFileChange={field.onChange}
                        accept="image/*,.pdf"
                        error={errors.aadharCardBackUpload?.message}
                        preview={aadharCardBackImageUrl}
                        onPreviewChange={setAadharCardBackImageUrl}
                        onUpload={handleMultipleImageUpload}
                        uploadType="aadharBack"
                        isLoading={uploadingImages.aadharBack}
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Profile Section - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <Card className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-lg font-semibold">Profile Picture</h3>
                    <div className="relative">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={profilePreview || undefined} />
                        <AvatarFallback className="text-2xl">
                          <User className="h-12 w-12" />
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0"
                        onClick={() => document.getElementById("profile-upload")?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                      <input
                        id="profile-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleProfileImageChange(e.target.files)}
                      />
                    </div>
                    {profileImage && profileImage[0] && (
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium text-green-600">✓ Image uploaded</p>
                        <p
                          className="text-xs text-muted-foreground truncate max-w-[150px]"
                          title={profileImage[0].name}
                        >
                          {profileImage[0].name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(profileImage[0].size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                    {!profileImage && (
                      <p className="text-sm text-muted-foreground text-center">
                        Click the upload button to add a profile picture
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setProfilePreview(null)
                setAadharCardFrontImageUrl(null)
                setAadharCardBackImageUrl(null)
                setPanCardImageUrl(null)
                setProfilePhotoImageUrl(null)
                setUploadingImages({})
                setOpen(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || createUserMutation.isPending} className="min-w-[120px]">
              {isSubmitting || createUserMutation.isPending ? "Registering..." : "Register User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
