import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';
import QRCode from 'qrcode';
import cloudinary from '@/lib/cloudinary';
import 'dotenv/config';
import { nanoid } from 'nanoid';

// GET all products
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price', 'costPrice', 'category', 'sku'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: body.sku });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists' },
        { status: 400 }
      );
    }

    // Check if barcode already exists (if provided)
    if (body.barcode) {
      const existingBarcode = await Product.findOne({ barcode: body.barcode });
      if (existingBarcode) {
        return NextResponse.json(
          { success: false, error: 'Barcode already exists' },
          { status: 400 }
        );
      }
    }

    const product = new Product(body);
    await product.save();

    try {
      const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost';
      const port = process.env.NEXT_PUBLIC_PORT || '3000';
      const productUrl = `${domain}:${port}/product/${product._id}`;
      const qrDataUrl = await QRCode.toDataURL(productUrl);

      const uploadResponse = await cloudinary.uploader.upload(qrDataUrl, {
        folder: 'product-qrcodes',
        public_id: `product_${product._id}`,
        overwrite: true,
      });

      product.qrCode = uploadResponse.secure_url;
      product.barCode = uploadResponse.secure_url; // Set barCode to QR code URL
      await product.save();
    } catch (qrError) {
      console.error('QR/Cloudinary error:', qrError);
    }

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PATCH create bulk products
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Required fields as per new Product schema and frontend payload
    const requiredFields = [
      'name', 'count', 'color', 'category', 'purchasePrice', 'gst', 'npp', 'initialSellPrice', 'finalSellPrice', 'productOf'
    ];
    
    // Validate required fields for bulk creation
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Count for bulk creation
    const count = body.count;
    if (!count || count <= 0) {
      return NextResponse.json(
        { success: false, error: 'Count must be a positive number' },
        { status: 400 }
      );
    }

    const createdProducts = [];
    const errors = [];

    for (let i = 1; i <= count; i++) {
      try {
        // Generate SKU in format: T + last 2 digits of billNo + 2-digit npp + 2-digit day + 2-digit month
        const billNoStr = (body.billNo || '').toString();
        const billNoLast2 = billNoStr.slice(-2).padStart(2, '0');
        const nppStr = (body.npp !== undefined && body.npp !== null) ? body.npp.toString().padStart(2, '0') : '00';
        let dayStr = '00', monthStr = '00';
        if (body.purchaseDate) {
          const dateObj = new Date(body.purchaseDate);
          dayStr = dateObj.getDate().toString().padStart(2, '0');
          monthStr = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        }
        const sku = `T${billNoLast2}${nppStr}${dayStr}${monthStr}`;
        // Remove barCode generation, will set after QR upload

        // Prepare product data as per schema and frontend payload
        console.log("body_body_body",body)
        const nppFirstDigit = String(body.npp)[0] || '0';
        const dateObj = body.purchaseDate ? new Date(body.purchaseDate) : new Date();
        const dayStr1 = dateObj.getDate().toString().padStart(2, '0');
        const monthStr2 = (dateObj.getMonth() + 1).toString().padStart(2, '0');
        const countStr = String(i).padStart(3, '0');
        const productName = `${body.name}${nppFirstDigit}${dayStr1}${monthStr2}${countStr}`;
        const productData: any = {
          name: productName,
          description: body.description || `${body.productName} - Item ${i}`,
          purchasePrice: body.purchasePrice,
          gst: body.gst,
          npp: body.npp,
          discount: body.discount ? body.discount: 0,
          initialSellPrice: body.initialSellPrice,
          finalSellPrice: body.finalSellPrice,
          category: body.category,
          sku,
          images: Array.isArray(body.images) ? body.images : [],
          billNo: body.billNo || '',
          color: Array.isArray(body.color) ? body.color : (body.color ? [body.color] : []),
          productOf: body.productOf,
          purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : undefined,
          subCategory: body.subcategory || '',
          tags: Array.isArray(body.tags) ? body.tags : (body.tags ? [body.tags] : []),
          isSold: false,
          soldBy: undefined,
          soldPrice: undefined,
          barCode: "pending" // Set a temporary value for barCode
        };

        // Remove undefined fields (mongoose will ignore them, but for cleanliness)
        Object.keys(productData).forEach(key => {
          if (productData[key] === undefined) {
            delete productData[key];
          }
        });

        // Check for unique SKU
        const existingSku = await Product.findOne({ sku: productData.sku });
        if (existingSku) {
          errors.push(`SKU already exists: ${productData.sku}`);
          continue;
        }

        const savedProduct = await Product.create(productData);

        try {
          const domain = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost';
          const port = process.env.NEXT_PUBLIC_PORT || '3000';
          const productUrl = `${domain}:${port}/product/${savedProduct._id}`;
          const qrDataUrl = await QRCode.toDataURL(productUrl);

          const uploadResponse = await cloudinary.uploader.upload(qrDataUrl, {
            folder: 'product-qrcodes',
            public_id: `product_${savedProduct._id}`,
            overwrite: true,
          });
          console.log("PP_df_R_WE_ETR_DF",uploadResponse?.secure_url)
          savedProduct.qrCode = uploadResponse.secure_url;
          savedProduct.barCode = uploadResponse.secure_url; // Set barCode to QR code URL
          await savedProduct.save();
        } catch (qrError) {
          console.error('QR/Cloudinary error:', qrError);
        }

        createdProducts.push(savedProduct);
      } catch (error: unknown) {
        console.error(`Error creating product`, error instanceof Error ? error.stack : error);
        errors.push(`Failed to create product ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    if (createdProducts.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to create any products', errors },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        createdCount: createdProducts.length,
        requestedCount: count,
        products: createdProducts,
        errors: errors.length > 0 ? errors : undefined
      },
      message: `Successfully created ${createdProducts.length} products`
    });
  } catch (error) {
    console.error('Error in bulk product creation:', error.stack);
    return NextResponse.json(
      { success: false, error: 'Failed to create bulk products' },
      { status: 500 }
    );
  }
} 

// DELETE all products
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const result = await Product.deleteMany({});
    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} products.`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete products' },
      { status: 500 }
    );
  }
} 

