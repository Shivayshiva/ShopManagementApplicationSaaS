import mongoose, { Schema, Document } from 'mongoose';

export interface IShop extends Document {
  shopName: string;
  businessType: 'Retail' | 'Wholesale' | 'Franchise' | 'Online';
  industry: 'Grocery' | 'Pharmacy' | 'Electronics' | 'Apparel';
  shopLogoUrl?: string;
  gstNumber: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  role: string;
  panCard: string;
  aadharCard: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  geoCoordinates?: string;
  createdAt?: Date;
  updatedAt?: Date;
}


const ShopSchema: Schema = new Schema<IShop>({
  shopName: { type: String, required: true, index: true },
  businessType: { type: String, enum: ['Retail', 'Wholesale', 'Franchise', 'Online'], required: true },
  industry: { type: String, enum: ['Grocery', 'Pharmacy', 'Electronics', 'Apparel'], required: true },
  shopLogoUrl: { type: String },
  gstNumber: { type: String, required: true, unique: true, index: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phoneNumber: { type: String, required: true },
  role: { type: String, required: true },
  panCard: { type: String, required: true },
  aadharCard: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true, index: true },
  geoCoordinates: { type: String },
}, { timestamps: true });

export default mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);
