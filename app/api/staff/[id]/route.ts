import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Staff from '@/lib/models/Staff';

// GET single staff member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const staff = await Staff.findById(params.id).lean();
    
    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Error fetching staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch staff member' },
      { status: 500 }
    );
  }
}

// PUT update staff member
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    // Check if staff member exists
    const existingStaff = await Staff.findById(params.id);
    if (!existingStaff) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (body.category) {
      const validCategories = ['Type 1', 'Type 2', 'Type 3', 'Type 4'];
      if (!validCategories.includes(body.category)) {
        return NextResponse.json(
          { success: false, error: 'Invalid category. Must be one of: Type 1, Type 2, Type 3, Type 4' },
          { status: 400 }
        );
      }
    }

    // Check if email is being changed and if it already exists
    if (body.email && body.email !== existingStaff.email) {
      const emailExists = await Staff.findOne({ email: body.email, _id: { $ne: params.id } });
      if (emailExists) {
        return NextResponse.json(
          { success: false, error: 'Email already exists' },
          { status: 400 }
        );
      }
    }

    // Check if phone is being changed and if it already exists
    if (body.phone && body.phone !== existingStaff.phone) {
      const phoneExists = await Staff.findOne({ phone: body.phone, _id: { $ne: params.id } });
      if (phoneExists) {
        return NextResponse.json(
          { success: false, error: 'Phone number already exists' },
          { status: 400 }
        );
      }
    }

    // Convert joiningDate to Date if provided
    if (body.joiningDate) {
      body.joiningDate = new Date(body.joiningDate);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

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

// DELETE staff member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const staff = await Staff.findById(params.id);
    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    await Staff.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Staff member deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
} 

// PATCH update or insert attendance for a staff member
export async function PATCH(
  request: NextRequest,
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise;
  try {
    await connectDB();
    const body = await request.json();
    const { date, clockingTime, clockoutTime, status } = body;

    if (!date || !status) {
      return NextResponse.json(
        { success: false, error: 'date and status are required' },
        { status: 400 }
      );
    }

    console.log("params_params_id", params?.id);

    // Find staff member
    const staff = await Staff.findById(params?.id);
    if (!staff) {
      return NextResponse.json(
        { success: false, error: 'Staff member not found' },
        { status: 404 }
      );
    }

    // Ensure attendance array exists
    if (!Array.isArray(staff.attendance)) {
      staff.attendance = [];
    }

    // Find if attendance for the date exists
    const attendanceIndex = staff.attendance.findIndex((a: any) => {
      // Compare only the date part (ignore time)
      return new Date(a.date).toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10);
    });

    if (attendanceIndex !== -1) {
      // Update existing attendance
      const existingAttendance = staff.attendance[attendanceIndex];
      staff.attendance[attendanceIndex] = {
        ...existingAttendance,
        checkIn: clockingTime !== undefined ? clockingTime : existingAttendance.checkIn,
        checkOut: clockoutTime !== undefined ? clockoutTime : existingAttendance.checkOut,
        status: status,
        date: new Date(date),
      };
    } else {
      // Add new attendance record
      staff.attendance.push({
        checkIn: clockingTime || '',
        checkOut: clockoutTime || '',
        status: status,
        date: new Date(date),
      });
    }

    await staff.save();

    return NextResponse.json({
      success: true,
      data: staff.attendance,
      message: 'Attendance updated successfully',
    });
  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
} 