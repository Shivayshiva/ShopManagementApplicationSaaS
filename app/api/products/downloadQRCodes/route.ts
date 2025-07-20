import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';
import archiver from 'archiver';
import axios from 'axios';
import { PassThrough } from 'stream';

export const runtime = 'nodejs'; // Ensure streaming works

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { ids } = body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'ids array is required' }, { status: 400 });
    }

    // Fetch products
    const products = await Product.find({ _id: { $in: ids } }, { qrCode: 1, name: 1 }).lean();
    if (!products.length) {
      return NextResponse.json({ success: false, error: 'No products found for given ids' }, { status: 404 });
    }

    // Prepare zip stream
    const zipStream = new PassThrough();
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.pipe(zipStream);

    // Download and append each QR code image
    await Promise.all(products.map(async (product, idx) => {
      if (!product.qrCode) return;
      try {
        const res = await axios.get(product.qrCode, { responseType: 'stream' });
        archive.append(res.data, { name: `${product.name || 'product'}_${product._id}.png` });
      } catch (err) {
        // Optionally log or skip
      }
    }));

    await archive.finalize();

    // Return streaming response
    return new Response(zipStream, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="product-qrcodes.zip"',
      },
    });
  } catch (error) {
    console.error('Error generating QR code zip:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate QR code zip' }, { status: 500 });
  }
} 