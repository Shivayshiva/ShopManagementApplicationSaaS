
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Shop from '@/lib/models/Shops';
import connectDB from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    // Only allow fields defined in the schema
    const allowedFields = [
      'shopName', 'businessType', 'industry', 'shopLogoUrl', 'gstNumber',
      'ownerName', 'email', 'phoneNumber', 'role', 'panCard', 'aadharCard',
      'addressLine1', 'addressLine2', 'city', 'state', 'country', 'pincode', 'geoCoordinates'
    ];
    const shopData = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowedFields.includes(key))
    );
    const shop = new Shop(shopData);
    await shop.save();
    return NextResponse.json({ success: true, shop }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json({ success: false, message: 'Duplicate entry', error: error.keyValue }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// GET /api/superAdmin/shop?limit=10&page=1
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const skip = (page - 1) * limit;
    const activeOnly = searchParams?.get('activeOnly') === 'true';

    // Build query based on parameters
    const query = activeOnly ? { isActive: true } : {};
    
    const [shops, total] = await Promise.all([
      Shop.find(),
      Shop.countDocuments(query)
    ]);

  console.log("D_D_F_G_E_W_G_H_G", shops)
    return NextResponse.json({  
      success: true,
      data: shops,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
