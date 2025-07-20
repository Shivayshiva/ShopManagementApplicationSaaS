import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Shop Management API is running!',
    status: 'success',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: 'Data received successfully',
      data: body,
      status: 'success'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON data' },
      { status: 400 }
    );
  }
} 