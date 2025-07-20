import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';
import QRCode from 'qrcode';


import cloudinary from '@/lib/cloudinary';
import 'dotenv/config';

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { sku, ...updateFields } = body;

    if (!sku) {
      return NextResponse.json({
        success: false,
        error: 'SKU is required to update a product'
      }, { status: 400 });
    }

    const product = await Product.findOne({ sku });
    if (!product) {
      return NextResponse.json({
        success: false,
        error: 'Product not found'
      }, { status: 404 });
    }

    // Prevent updating SKU to an existing SKU
    if (updateFields.sku && updateFields.sku !== sku) {
      const skuExists = await Product.findOne({ sku: updateFields.sku });
      if (skuExists) {
        return NextResponse.json({
          success: false,
          error: 'SKU already exists'
        }, { status: 400 });
      }
    }
    // Prevent updating barcode to an existing barcode
    if (updateFields.barcode && updateFields.barcode !== product.barcode) {
      const barcodeExists = await Product.findOne({ barcode: updateFields.barcode });
      if (barcodeExists) {
        return NextResponse.json({
          success: false,
          error: 'Barcode already exists'
        }, { status: 400 });
      }
    }

    Object.assign(product, updateFields);
    await product.save();

    try {
        const domain = process.env.NEXT_PUBLIC_DOMAIN ;
        const port = process.env.NEXT_PUBLIC_PORT;
        const productUrl = `${domain}:${port}/product/${product._id}`;
        const qrDataUrl = await QRCode.toDataURL(productUrl);
  
        const uploadResponse = await cloudinary.uploader.upload(qrDataUrl, {
          folder: 'product-qrcodes',
          public_id: `product_${product._id}`,
          overwrite: true,
        });
  
        product.qrCode = uploadResponse.secure_url;
        await product.save();
      } catch (qrError) {
        console.error('QR/Cloudinary error:', qrError);
      }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update product'
    }, { status: 500 });
  }
} 