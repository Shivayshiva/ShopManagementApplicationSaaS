import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Invoice from '@/lib/models/Invoice';

// GET single invoice by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const invoice = await Invoice.findById(params.id)
      .populate('customer', 'name email phone address')
      .populate('items.product', 'name sku price barcode')
      .lean();
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invoice' },
      { status: 500 }
    );
  }
}

// PUT update invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if invoice exists
    const existingInvoice = await Invoice.findById(params.id);
    if (!existingInvoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Only allow certain fields to be updated
    const allowedUpdates = [
      'status', 
      'paymentStatus', 
      'paymentMethod', 
      'notes', 
      'dueDate',
      'paidAt'
    ];

    const updateData: any = {};
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Set paidAt if payment status is being updated to 'paid'
    if (body.paymentStatus === 'paid' && existingInvoice.paymentStatus !== 'paid') {
      updateData.paidAt = new Date();
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('customer', 'name email phone')
     .populate('items.product', 'name sku price');

    return NextResponse.json({
      success: true,
      data: updatedInvoice,
      message: 'Invoice updated successfully'
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

// DELETE invoice (soft delete by updating status)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const invoice = await Invoice.findById(params.id);
    
    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Soft delete by updating status to cancelled
    await Invoice.findByIdAndUpdate(params.id, { 
      status: 'cancelled',
      paymentStatus: 'failed'
    });

    return NextResponse.json({
      success: true,
      message: 'Invoice cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling invoice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to cancel invoice' },
      { status: 500 }
    );
  }
} 