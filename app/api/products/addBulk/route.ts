import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { template, quantity } = body;

    // Validate quantity
    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json({
        success: false,
        error: 'Valid quantity is required (must be a positive integer)'
      }, { status: 400 });
    }
    const requiredFields = [
      'name', 'purchasePrice', 'gst', 'npp', 'sellPrice', 'category',  'productOf'
    ];
    const missingFields = requiredFields.filter(field => !template[field] && template[field] !== 0);
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Missing required fields in template: ${missingFields.join(', ')}`
      }, { status: 400 });
    }
    const createdProducts = [];
    const errors = [];
    for (let i = 1; i <= quantity; i++) {
      try {
        const timestamp = Date.now();
        const uniqueSuffix = `${timestamp}_${i}`;
        // Check for unique SKU and barCode
        const sku = `${template.sku}_${uniqueSuffix}`;
        if (await Product.findOne({ sku })) {
          errors.push(`SKU already exists for product ${i}`);
          continue;
        }
        let barCode;
        if (template.barCode) {
          barCode = `${template.barCode}_${uniqueSuffix}`;
          if (await Product.findOne({ barCode })) {
            errors.push(`BarCode already exists for product ${i}`);
            continue;
          }
        }
        const newProductData = {
          ...template,
          name: `${template.name}_${i}`,
          sku,
          barCode:barCode,
          images: template.images || [],
          billNo: template.billNo || '',
          color: template.color || [],
          purchaseDate: template.purchaseDate || undefined,
          subCategory: template.subCategory || '',
          tags: template.tags || [],
          discount: template.discount || 0,
          isSold: false,
          soldBy: undefined,
          soldPrice: undefined,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const newProduct = new Product(newProductData);
        const savedProduct = await newProduct.save();
        createdProducts.push(savedProduct);
      } catch (error) {
        errors.push(`Failed to create product ${i}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    if (createdProducts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create any products',
        errors
      }, { status: 500 });
    }
    return NextResponse.json({
      success: true,
      data: {
        createdCount: createdProducts.length,
        requestedCount: quantity,
        products: createdProducts,
        errors: errors.length > 0 ? errors : undefined
      },
      message: `Successfully created ${createdProducts.length} products`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to perform bulk upload'
    }, { status: 500 });
  }
} 