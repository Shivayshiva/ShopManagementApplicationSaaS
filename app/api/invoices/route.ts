import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Invoice from '@/lib/models/Invoice';
import Product from '@/lib/models/Product';
import Customer from '@/lib/models/Customer';
import Staff from '@/lib/models/Staff';
import { nanoid } from 'nanoid';

// GET all invoices
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const purchaseStatus = searchParams.get('purchaseStatus') || '';
    const paymentStatus = searchParams.get('paymentStatus') || '';
    const customerId = searchParams.get('customerId') || '';

    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    if (purchaseStatus) {
      query.purchaseStatus = purchaseStatus;
    }
    
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }
    
    if (customerId) {
      query.customer = customerId;
    }

    const invoices = await Invoice.find(query)
      .populate('customer', 'name email phone')
      .populate('items.productId')
      // .populate('soldBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Transform items: each item should have all product fields, plus finalSoldPrice, no name
    const transformInvoiceItems = (invoice) => ({
      ...invoice,
      items: invoice.items.map(item => {
        const product = item.productId;
        if (!product) return null;
        const { _id, __v, ...productFields } = product; // Optionally remove _id, __v
        return {
          ...productFields,
          _id: product._id, // keep _id for reference
          finalSoldPrice: item.finalSoldPrice
        };
      }).filter(Boolean)
    });

    const transformedInvoices = invoices.map(transformInvoiceItems);

    const total = await Invoice.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: transformedInvoices,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST create new invoice
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['customer', 'items', 'paymentMethod', 'soldBy'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate items
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one item is required' },
        { status: 400 }
      );
    }

    // Check if customer exists
    const customer = await Customer.findById(body.customer);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 400 }
      );
    }

    // Validate and process items
    let intialTotalPrice = 0;
    const processedItems = [];

    for (const item of body.items) {
      if (!item.productId || !item.finalSoldPrice || !item.name) {
        return NextResponse.json(
          { success: false, error: 'Each item must have productId, name, and finalSoldPrice' },
          { status: 400 }
        );
      }

      // Check if product exists
      const product = await Product.findById(item.productId);
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product with ID ${item.productId} not found` },
          { status: 400 }
        );
      }

      // No stockQuantity check needed, each product has one count

      intialTotalPrice += item.finalSoldPrice; // Each product is counted once

      processedItems.push({
        productId: item.productId,
        name: item.name,
        finalSoldPrice: item.finalSoldPrice
      });
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${nanoid(10)}`;

    // Calculate totals
    const gstTotalAmount = body.gstTotalAmount || 0;
    const totalDiscount = body.totalDiscount || 0;
    const totalFinalPrice = body.intialTotalPrice + gstTotalAmount - totalDiscount;
    const purchaseStatus = body.purchaseStatus ;
    const paymentStatus = body.paymentStatus ;

    // Create invoice
    const invoiceData = {
      customer: body.customer,
      items: processedItems,
      intialTotalPrice,
      gstTotalAmount,
      totalDiscount,
      totalFinalPrice,
      purchaseStatus,
      paymentMethod: body.paymentMethod,
      paymentStatus,
      notes: body.notes,
      dueDate: body.dueDate,
      paidAt: body.paidAt,
      soldBy: body.soldBy,
      invoiceNumber // Add invoiceNumber here
    };

    

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    // No stock update needed

    // Update customer total purchases
    await Customer.findByIdAndUpdate(
      body.customer,
      { 
        $inc: { totalPurchases: totalFinalPrice },
        lastPurchaseDate: new Date()
      }
    );

    // Populate the response
    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('customer', 'name email phone')
      .populate('items.productId')
      .populate('soldBy', 'name email');

    // Transform items for single invoice
    const transformInvoiceItems = (invoice) => ({
      ...invoice,
      items: invoice.items.map(item => {
        const product = item.productId;
        if (!product) return null;
        const { _id, __v, ...productFields } = product; // Optionally remove _id, __v
        return {
          ...productFields,
          _id: product._id, // keep _id for reference
          finalSoldPrice: item.finalSoldPrice
        };
      }).filter(Boolean)
    });

    const transformedInvoice = transformInvoiceItems(populatedInvoice.toObject ? populatedInvoice.toObject() : populatedInvoice);

    return NextResponse.json({
      success: true,
      data: transformedInvoice,
      message: 'Invoice created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
} 