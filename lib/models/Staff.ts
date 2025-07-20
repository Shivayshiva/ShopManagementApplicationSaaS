// models/Staff.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance {
  date: Date;
  status: 'present' | 'absent' | 'half-Day' | 'leave';
  checkIn?: string;
  checkOut?: string;
  remarks?: string;
}

export interface ISaleRecord {
  month: number;  // 1–12
  year: number;
  sale: number;
}

export type StaffCategory = 'Type 1' | 'Type 2' | 'Type 3' | 'Type 4';

export interface IStaff extends Document {
  name: string;
  email: string;
  phone: string;
  familyPhone?: string;
  role: string;
  isActive: boolean;
  category: StaffCategory;
  address?: string;
  joiningDate: Date;
  passwordHash?: string;
  attendance: IAttendance[];
  totalSales: ISaleRecord[];
  staffID: string;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['present', 'absent', 'half-Day', 'leave'],
      required: true,
    },
    checkIn: { type: String },
    checkOut: { type: String },
    remarks: { type: String },
  },
  { _id: false }
);

const SaleRecordSchema = new Schema<ISaleRecord>(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    sale: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const StaffSchema = new Schema<IStaff>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, required: true },
    familyPhone: { type: String },
    role: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    category: {
      type: String,
      enum: ['Type 1', 'Type 2', 'Type 3', 'Type 4'],
      required: true,
    },
    address: { type: String },
    joiningDate: { type: Date, default: Date.now },
    passwordHash: { type: String },
    attendance: [AttendanceSchema],
    totalSales: [SaleRecordSchema],
    staffID: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
