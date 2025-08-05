import { NextRequest, NextResponse } from 'next/server';
import { emailHandler } from '@/utils/nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      template, 
      data, 
      to, 
      customEmail 
    } = body;

    // Validate required fields
    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email is required' },
        { status: 400 }
      );
    }

    let success = false;

    // If custom email is provided, send it directly
    if (customEmail) {
      const { subject, html, text, from } = customEmail;
      success = await emailHandler.sendEmail({
        to,
        subject,
        html,
        text,
        from
      });
    }
    // If template is provided, use template
    else if (template && data) {
      success = await emailHandler.sendTemplateEmail(template, data, to);
    }
    else {
      return NextResponse.json(
        { error: 'Either template with data or customEmail object is required' },
        { status: 400 }
      );
    }

    if (success) {
      return NextResponse.json(
        { message: 'Email sent successfully' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to test email connection
export async function GET() {
  try {
    const isConnected = await emailHandler.verifyConnection();
    
    if (isConnected) {
      return NextResponse.json(
        { message: 'Email service is connected' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: 'Email service connection failed' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Email connection test error:', error);
    return NextResponse.json(
      { error: 'Failed to test email connection' },
      { status: 500 }
    );
  }
} 