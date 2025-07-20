import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Customer from '@/lib/models/Customer';

// GET single customer by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const customer = await Customer.findById(params.id).lean();
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: customer
    });
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
}

// PUT update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if customer exists
    const existingCustomer = await Customer.findById(params.id);
    if (!existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingCustomer.email) {
      const emailExists = await Customer.findOne({ email: body.email, _id: { $ne: params.id } });
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const customer = await Customer.findById(params.id);
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    await Customer.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 