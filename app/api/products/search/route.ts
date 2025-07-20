import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const serialNumber = searchParams.get('serialNumber');
    
    if (!serialNumber) {
      return NextResponse.json(
        { success: false, error: 'Serial number is required' },
        { status: 400 }
      );
    }

    // Search by SKU or barcode
    const product = await Product.findOne({
      $or: [
        { sku: serialNumber },
        { barcode: serialNumber }
      ],
      isActive: true
    }).lean();
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error searching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search product' },
      { status: 500 }
    );
  }
} 