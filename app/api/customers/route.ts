import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Customer from '@/lib/models/Customer';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Ensure all fields are present in each customer
    const defaultCustomer = {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'USA',
      },
      productsPurchased: [],
      wishlistProducts: [],
      totalPurchases: 0,
      totalVisitCount: 0,
      groupType: '',
      lastPurchaseDate: null,
      isActive: true,
      notes: '',
      createdAt: null,
      updatedAt: null,
      _id: null,
      __v: null
    };

    const normalizedCustomers = customers.map((c: any) => ({
      ...defaultCustomer,
      ...c,
      address: { ...defaultCustomer.address, ...(c.address || {}) },
    }));

    const total = await Customer.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: normalizedCustomers,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const requiredFields = ['name', 'email', 'phone', 'address'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate address fields
    const addressFields = ['street', 'city', 'state', 'zipCode'];
    for (const field of addressFields) {
      if (!body.address[field]) {
        return NextResponse.json(
          { success: false, error: `Address ${field} is required` },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email: body.email });
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Email already exists' },
        { status: 400 }
      );
    }

    const customer = new Customer(body);
    await customer.save();

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Customer created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
} 

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    if (!body.id && !body.email) {
      return NextResponse.json(
        { success: false, error: 'Customer id or email is required' },
        { status: 400 }
      );
    }

    const query: any = {};
    if (body.id) query._id = body.id;
    if (body.email) query.email = body.email;

    const updateFields = { ...body };
    delete updateFields.id;
    delete updateFields.email;

    if (updateFields.address) {
      const addressFields = ['street', 'city', 'state', 'zipCode'];
      for (const field of addressFields) {
        if (field in updateFields.address && !updateFields.address[field]) {
          return NextResponse.json(
            { success: false, error: `Address ${field} is required` },
            { status: 400 }
          );
        }
      }
    }

    // Update the customer
    const updatedCustomer = await Customer.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

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