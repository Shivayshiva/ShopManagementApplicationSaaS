import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';
import cloudinary from '@/lib/cloudinary';

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
    // Extract public_id from imageUrl (format: .../upload/v1234/folder/filename.ext)
    const matches = imageUrl.match(/\/upload\/v\d+\/(.+)$/);
    let publicId = matches ? matches[1].replace(/\.[a-zA-Z0-9]+$/, '') : null;
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
      } catch (err) {
        // Log but don't fail the request if Cloudinary fails
        console.error('Cloudinary delete error:', err);
      }
    }
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