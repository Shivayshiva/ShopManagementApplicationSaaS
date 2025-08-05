# Email Handler Documentation

This document describes how to use the email handler functionality in the shop management application.

## Overview

The email handler uses [Resend](https://resend.com) as the email service provider. It provides a simple and reliable way to send emails with pre-built templates for common use cases.

## Setup

### 1. Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key-here
EMAIL_FROM=noreply@yourdomain.com
```

### 2. Get Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Create a new API key
3. Verify your domain or use the sandbox domain for testing
4. Add the API key to your environment variables

## Usage

### Using the React Hook

The easiest way to use email functionality is through the `useEmail` hook:

```tsx
import { useEmail } from '@/hooks/useEmail';

const MyComponent = () => {
  const {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendInvoiceNotification,
    sendOrderConfirmation,
    testConnection,
    isLoading,
    error,
    clearError
  } = useEmail();

  const handleSendWelcomeEmail = async () => {
    const result = await sendWelcomeEmail('John Doe', 'My Shop', 'john@example.com');
    if (result.success) {
      console.log('Email sent successfully');
    } else {
      console.error('Failed to send email:', result.error);
    }
  };

  return (
    <button onClick={handleSendWelcomeEmail} disabled={isLoading}>
      Send Welcome Email
    </button>
  );
};
```

### Using the Email Handler Directly

You can also use the email handler directly in server-side code:

```tsx
import { emailHandler } from '@/utils/nodemailer';

// Send a welcome email
const success = await emailHandler.sendWelcomeEmail('John Doe', 'My Shop', 'john@example.com');

// Send a password reset email
const success = await emailHandler.sendPasswordResetEmail('John Doe', 'https://example.com/reset', 'john@example.com');

// Send a custom email
const success = await emailHandler.sendEmail({
  to: 'john@example.com',
  subject: 'Custom Subject',
  html: '<p>Custom HTML content</p>',
  text: 'Custom text content'
});
```

### Using the API Route

You can also send emails via the API route:

```tsx
// Send using template
const response = await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    template: 'welcome',
    data: { name: 'John Doe', shopName: 'My Shop' },
    to: 'john@example.com'
  })
});

// Send custom email
const response = await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'john@example.com',
    customEmail: {
      subject: 'Custom Subject',
      html: '<p>Custom HTML content</p>',
      text: 'Custom text content'
    }
  })
});
```

## Available Templates

### 1. Welcome Email
```tsx
await sendWelcomeEmail(name: string, shopName: string, email: string)
```

### 2. Password Reset Email
```tsx
await sendPasswordResetEmail(name: string, resetLink: string, email: string)
```

### 3. Invoice Notification
```tsx
await sendInvoiceNotification(
  customerName: string,
  invoiceNumber: string,
  amount: number,
  shopName: string,
  email: string
)
```

### 4. Order Confirmation
```tsx
await sendOrderConfirmation(
  customerName: string,
  orderNumber: string,
  items: Array<{ name: string; quantity: number; price: number }>,
  total: number,
  shopName: string,
  email: string
)
```

## Testing

### Test Component

Use the `EmailTestComponent` to test all email functionality:

```tsx
import { EmailTestComponent } from '@/components/common/EmailTestComponent';

const TestPage = () => {
  return (
    <div className="container mx-auto py-8">
      <EmailTestComponent />
    </div>
  );
};
```

### API Testing

Test the email connection via API:

```bash
# Test connection
curl -X GET http://localhost:4000/api/email

# Send test email
curl -X POST http://localhost:4000/api/email \
  -H "Content-Type: application/json" \
  -d '{
    "template": "welcome",
    "data": {"name": "John Doe", "shopName": "Test Shop"},
    "to": "test@example.com"
  }'
```

## Error Handling

The email handler provides comprehensive error handling:

```tsx
const { sendEmail, error, isLoading } = useEmail();

if (error) {
  console.error('Email error:', error);
  // Handle error (show toast, alert, etc.)
}

if (isLoading) {
  // Show loading state
}
```

## Configuration

### Custom Email Templates

You can add custom email templates by modifying the `emailTemplates` object in `utils/nodemailer.ts`:

```tsx
export const emailTemplates = {
  // ... existing templates
  customTemplate: {
    subject: 'Custom Template',
    html: (data: { name: string }) => `
      <div>
        <h1>Hello ${data.name}!</h1>
        <p>This is a custom template.</p>
      </div>
    `,
    text: (data: { name: string }) => `Hello ${data.name}! This is a custom template.`
  }
};
```

### Custom Email Handler

You can create a custom email handler with different configuration:

```tsx
import { EmailHandler } from '@/utils/nodemailer';

const customEmailHandler = new EmailHandler('your-custom-api-key');
```

## Troubleshooting

### Common Issues

1. **"RESEND_API_KEY is required"**
   - Make sure you've set the `RESEND_API_KEY` environment variable
   - Verify the API key is valid

2. **"Email service connection failed"**
   - Check your internet connection
   - Verify your Resend API key is correct
   - Make sure your domain is verified in Resend

3. **"Failed to send email"**
   - Check the recipient email address is valid
   - Verify your sender email is verified in Resend
   - Check the Resend dashboard for any delivery issues

### Debug Mode

Enable debug logging by adding this to your environment:

```env
DEBUG_EMAIL=true
```

## Security Considerations

1. **API Key Security**: Never expose your Resend API key in client-side code
2. **Email Validation**: Always validate email addresses before sending
3. **Rate Limiting**: Be mindful of Resend's rate limits
4. **Spam Prevention**: Use proper email templates and avoid spam trigger words

## Best Practices

1. **Use Templates**: Prefer using email templates over custom HTML for consistency
2. **Error Handling**: Always handle email sending errors gracefully
3. **Loading States**: Show loading states during email sending
4. **Testing**: Test emails in development before sending to real users
5. **Monitoring**: Monitor email delivery rates and bounce rates

## Support

For issues with the email handler:
1. Check the Resend documentation: https://resend.com/docs
2. Review the error messages in the console
3. Test with the `EmailTestComponent`
4. Check your Resend dashboard for delivery status 