import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const productId = params.id;

  // Parse form data
  const formData = await request.formData();
  const files = formData.getAll('images');

  if (!files || files.length === 0) {
    return NextResponse.json({ success: false, error: 'No images provided' }, { status: 400 });
  }

  try {
    // Check if product exists first
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Upload each file to Cloudinary
    const uploadResults = await Promise.all(
      files.map(async (file: any) => {
        if (!file || typeof file.arrayBuffer !== 'function') return null;
        const buffer = Buffer.from(await file.arrayBuffer());
        // Use a promise to wrap the stream
        return new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'product-images', resource_type: 'image' },
            (error: any, result: any) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            }
          );
          stream.end(buffer);
        });
      })
    );
    const imageUrls = uploadResults.filter(Boolean);

    // Update product images
    product.images = [...(product.images || []), ...imageUrls];
    await product.save();

    return NextResponse.json({ success: true, images: product.images });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 