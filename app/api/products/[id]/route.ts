import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';

// GET single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id).lean();
    
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
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if product exists
    const existingProduct = await Product.findById(params.id);
    if (!existingProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if SKU is being changed and if it already exists
    if (body.sku && body.sku !== existingProduct.sku) {
      const skuExists = await Product.findOne({ sku: body.sku, _id: { $ne: params.id } });
      if (skuExists) {
        return NextResponse.json(
          { success: false, error: 'SKU already exists' },
          { status: 400 }
        );
      }
    }

    // Check if barcode is being changed and if it already exists
    if (body.barcode && body.barcode !== existingProduct.barcode) {
      const barcodeExists = await Product.findOne({ barcode: body.barcode, _id: { $ne: params.id } });
      if (barcodeExists) {
        return NextResponse.json(
          { success: false, error: 'Barcode already exists' },
          { status: 400 }
        );
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// PATCH bulk upload - create multiple products based on quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { quantity } = body;
    
    if (!quantity || !Number.isInteger(quantity) || quantity <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid quantity is required (must be a positive integer)' },
        { status: 400 }
      );
    }

    // Get the base product to use as template
    const baseProduct = await Product.findById(params.id);
    
    if (!baseProduct) {
      return NextResponse.json(
        { success: false, error: 'Base product not found' },
        { status: 404 }
      );
    }

    const createdProducts = [];
    const errors = [];

    // Create multiple products with numbered names
    for (let i = 1; i <= quantity; i++) {
      try {
        // Generate unique SKU and barcode for each product
        const timestamp = Date.now();
        const uniqueSuffix = `${timestamp}_${i}`;
        
        const newProductData = {
          ...baseProduct.toObject(),
          _id: undefined, // Remove the original _id
          name: `${baseProduct.name}_${i}`,
          sku: `${baseProduct.sku}_${uniqueSuffix}`,
          barcode: baseProduct.barcode ? `${baseProduct.barcode}_${uniqueSuffix}` : undefined,
          stockQuantity: 1, // Set individual stock quantity to 1
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const newProduct = new Product(newProductData);
        const savedProduct = await newProduct.save();
        createdProducts.push(savedProduct);
      } catch (error) {
        console.error(`Error creating product ${i}:`, error);
        errors.push(`Failed to create product ${i}: ${error.message}`);
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
        requestedCount: quantity,
        products: createdProducts,
        errors: errors.length > 0 ? errors : undefined
      },
      message: `Successfully created ${createdProducts.length} products`
    });
  } catch (error) {
    console.error('Error in bulk upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to perform bulk upload' },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 