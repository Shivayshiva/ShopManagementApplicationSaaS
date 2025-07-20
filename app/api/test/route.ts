import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'Backend is working correctly!',
      timestamp: new Date().toISOString(),
      database: 'Connected',
      features: [
        'MongoDB with Mongoose',
        'Product Management API',
        'Customer Management API', 
        'Invoice Management API',
        'Dashboard Statistics API'
      ]
    });
  } catch (error) {
    console.error('Test API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 