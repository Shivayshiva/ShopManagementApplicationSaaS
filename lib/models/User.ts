import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  name: string;
  age: number;
  phone: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  role: "superadmin" | "shopAdmin" | "staff";
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superadmin", "shopAdmin", "staff"], default: "staff" },
  },
  { timestamps: true }
);

export default models.User || model<IUser>("User", UserSchema);
