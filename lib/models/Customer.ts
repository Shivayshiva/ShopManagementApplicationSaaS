import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  productsPurchased: mongoose.Types.ObjectId[];
  wishlistProducts: mongoose.Types.ObjectId[];
  totalPurchases: number;
  totalVisitCount: number;
  groupType: string;
  lastPurchaseDate?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
    maxlength: [100, 'Customer name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      trim: true
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
      default: 'USA'
    }
  },
  productsPurchased: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: []
  }],
  wishlistProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: []
  }],
  totalPurchases: {
    type: Number,
    default: 0,
    min: [0, 'Total purchases cannot be negative']
  },
  totalVisitCount: {
    type: Number,
    default: 0,
    min: [0, 'Total visit count cannot be negative']
  },
  groupType: {
    type: String,
    trim: true,
    maxlength: [50, 'Group type cannot exceed 50 characters']
  },
  lastPurchaseDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

CustomerSchema.index({ name: 'text', email: 'text' });
// CustomerSchema.index({ email: 1 });
CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ 'address.city': 1 });

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);   