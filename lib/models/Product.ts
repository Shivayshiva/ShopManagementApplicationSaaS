import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  purchasePrice: number;
  gst: number;
  npp: string;
  discount: number;
  category: string;
  barCode: string;
  sku: string;
  images: string[];
  billNo: string;
  color: string[];
  productOf: string;
  purchaseDate: Date;
  subCategory: string;
  tags: string[];
  isSold: boolean;
  soldBy: string;
  soldPrice: number;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  purchasePrice: {
    type: Number,
    required: [true, 'Purchase price is required'],
    min: [0, 'Purchase price cannot be negative']
  },
  gst: {
    type: Number,
    required: [true, 'GST is required'],
    min: [0, 'GST cannot be negative']
  },
  npp: {
    type: String,
    trim: true,
    required: [true, 'NPP is required']
  },
  discount: {
    type: Number,
    default: 0
  },
  initialSellPrice: {
    type: Number,
    required: [true, 'Sell price is required'],
    min: [0, 'Sell price cannot be negative']
  },
  finalSellPrice: {
    type: Number,
    required: [true, 'Sell price is required'],
    min: [0, 'Sell price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true
  },
  barCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    required: [true, 'Bar code is required']
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  billNo: {
    type: String,
    trim: true
  },
  color: [{
    type: String,
    trim: true
  }],
  productOf: {
    type: String,
    trim: true,
    required: [true, 'ProductOf is required']
  },
  purchaseDate: {
    type: Date
  },
  subCategory: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isSold: {
    type: Boolean,
    default: false
  },
  soldBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    trim: true
  },
  soldPrice: {
    type: Number,
    min: [0, 'Sold price cannot be negative']
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ sku: 1 });
ProductSchema.index({ barCode: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema); 