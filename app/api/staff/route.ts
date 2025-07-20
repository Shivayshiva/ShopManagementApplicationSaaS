import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Staff from '@/lib/models/Staff';

// GET all staff members
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');
    const category = searchParams.get('category') || '';

    const skip = (page - 1) * limit;
    
    // Build query
    let query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (isActive !== null && isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (category) {
      query.category = category;
    }

    const staffMembers = await Staff.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Ensure all fields are present in each staff member
    const defaultStaff = {
      name: '',
      email: '',
      phone: '',
      familyPhone: '',
      role: '',
      isActive: true,
      category: 'Type 1',
      address: '',
      joiningDate: new Date(),
      passwordHash: '',
      attendance: [],
      totalSales: [],
      createdAt: null,
      updatedAt: null,
      _id: null,
      __v: null
    };

    const normalizedStaff = staffMembers.map((s: any) => ({
      ...defaultStaff,
      ...s,
    }));

    const total = await Staff.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: normalizedStaff,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff members' },
      { status: 500 }
    );
  }
}

// POST create new staff member
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'phone', 'role', 'category'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate category
    const validCategories = ['Type 1', 'Type 2', 'Type 3', 'Type 4'];
    if (!validCategories.includes(body.category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category. Must be one of: Type 1, Type 2, Type 3, Type 4' },
        { status: 400 }
      );
    }

    // Check if email already exists (if provided)
    if (body.email) {
      const existingStaff = await Staff.findOne({ email: body.email });
      if (existingStaff) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Check if phone already exists
    const existingPhone = await Staff.findOne({ phone: body.phone });
    if (existingPhone) {
      return NextResponse.json(
        { success: false, error: 'Phone number already exists' },
        { status: 400 }
      );
    }

    // Set default values
    // Generate unique staffID
    const count = await Staff.countDocuments();
    let staffID;
    let isUnique = false;
    while (!isUnique) {
      staffID = `STF-${String(count + 1 + Math.floor(Math.random() * 1000)).padStart(6, '0')}`;
      const exists = await Staff.findOne({ staffID });
      if (!exists) isUnique = true;
    }

    const staffData = {
      ...body,
      isActive: body.isActive !== undefined ? body.isActive : true,
      joiningDate: body.joiningDate ? new Date(body.joiningDate) : new Date(),
      attendance: [],
      totalSales: [],
      staffID,
    };

    const staff = new Staff(staffData);
    await staff.save();

    return NextResponse.json({
      success: true,
      data: staff,
      message: 'Staff member created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}

// PATCH update staff member
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Require either id or email to identify the staff member
    if (!body.id && !body.email && !body.phone) {
      return NextResponse.json(
        { success: false, error: 'Staff id, email, or phone is required' },
        { status: 400 }
      );
    }

    // Build query to find the staff member
    const query: any = {};
    if (body.id) query._id = body.id;
    if (body.email) query.email = body.email;
    if (body.phone) query.phone = body.phone;

    // Remove id/email/phone from update fields
    const updateFields = { ...body };
    delete updateFields.id;
    delete updateFields.email;
    delete updateFields.phone;

    // Validate category if provided
    if (updateFields.category) {
      const validCategories = ['Type 1', 'Type 2', 'Type 3', 'Type 4'];
      if (!validCategories.includes(updateFields.category)) {
        return NextResponse.json(
          { success: false, error: 'Invalid category. Must be one of: Type 1, Type 2, Type 3, Type 4' },
          { status: 400 }
        );
      }
    }

    // Check if email is being changed and if it already exists
    if (updateFields.email) {
      const emailQuery: any = { email: updateFields.email };
      if (body.id) emailQuery._id = { $ne: body.id };
      if (body.email) emailQuery.email = { $ne: body.email };
      if (body.phone) emailQuery.phone = { $ne: body.phone };
      
      const emailExists = await Staff.findOne(emailQuery);
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Check if phone is being changed and if it already exists
    if (updateFields.phone) {
      const phoneQuery: any = { phone: updateFields.phone };
      if (body.id) phoneQuery._id = { $ne: body.id };
      if (body.email) phoneQuery.email = { $ne: body.email };
      if (body.phone) phoneQuery.phone = { $ne: body.phone };
      
      const phoneExists = await Staff.findOne(phoneQuery);
      if (phoneExists) {
        return NextResponse.json(
          { success: false, error: 'Phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Convert joiningDate to Date if provided
    if (updateFields.joiningDate) {
      updateFields.joiningDate = new Date(updateFields.joiningDate);
    }

    // Update the staff member
    const updatedStaff = await Staff.findOneAndUpdate(
      query,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedStaff) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedStaff,
      message: 'Staff member updated successfully'
    });
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}
