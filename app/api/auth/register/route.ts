import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
// import dbConnect from '@/lib/database';

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, age, phone, email, password } = await req.json();

  if (!name || !age || !phone || !email || !password) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists." },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, age, phone, email, password: hashedPassword });
  await user.save();

  return NextResponse.json(
    { message: "User registered successfully." },
    { status: 201 }
  );
}
