import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';
import { deleteImageFromCloudinary } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { productId, imageUrl } = body;
    if (!productId || !imageUrl) {
      return NextResponse.json({ success: false, error: 'productId and imageUrl are required' }, { status: 400 });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    // Remove image from product.images
    const newImages = (product.images || []).filter((img: string) => img !== imageUrl);
    if (newImages.length === product.images.length) {
      return NextResponse.json({ success: false, error: 'Image not found in product' }, { status: 404 });
    }
    product.images = newImages;
    await product.save();
    // Remove from Cloudinary
    await deleteImageFromCloudinary(imageUrl);
    return NextResponse.json({ success: true, images: product.images });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting product image:', error.message);
    } else {
      console.error('Error deleting product image:', String(error));
    }
    return NextResponse.json({ success: false, error: 'Failed to delete product image' }, { status: 500 });
  }
} 