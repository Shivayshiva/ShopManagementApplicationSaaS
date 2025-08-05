import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Test the user creation data structure
    const testData = {
      gstNumber: "ABCDE1234F",
      email: "test@example.com",
      name: "Test User",
      mobileNumber: "9876543210",
      role: "staff" as const,
      shopId: "test_shop_id",
      superAdminId: "super_admin_id",
      panCardNumber: "ABCDE1234F",
      aadharCardNumber: "123456789012",
      panCardImage: "https://example.com/pan.jpg",
      aadharCardFrontImage: "https://example.com/aadhar_front.jpg",
      aadharCardBackImage: "https://example.com/aadhar_back.jpg",
      profileImage: "https://example.com/profile.jpg"
    };

    return NextResponse.json({
      success: true,
      message: "Test data structure is valid",
      data: testData
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Test failed"
    }, { status: 500 });
  }
} 