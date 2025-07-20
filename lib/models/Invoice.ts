import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  product: mongoose.Types.ObjectId;
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  customer: mongoose.Types.ObjectId;
  soldBy: mongoose.Types.ObjectId;
  items: IInvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed';
  notes?: string;
  dueDate?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;

}

const InvoiceItemSchema: Schema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },

  finalSoldPrice: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
});

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [InvoiceItemSchema],
  intialTotalPrice: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  gstTotalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Tax cannot be negative']
  },
  totalDiscount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  totalFinalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  purchaseStatus: {
    type: String,
    enum: ['hold', 'purchased','notPurchased','completed'],
    default: 'notPurchased'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'other'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'partial', 'failed','laterOn'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  dueDate: {
    type: Date
  },
  paidAt: {
    type: Date
  },
  soldBy: {
    type: Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ customer: 1 });
InvoiceSchema.index({ status: 1 });
InvoiceSchema.index({ paymentStatus: 1 });
InvoiceSchema.index({ createdAt: -1 });

// InvoiceSchema.pre('save', async function(next) {
//   if (this.isNew && !this.invoiceNumber) {
//     this.invoiceNumber = `INV-${nanoid(10)}`;
//   }
//   next();
// });

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema); 