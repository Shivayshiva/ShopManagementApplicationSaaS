import { Resend } from 'resend';

// Email content interface
interface EmailContent {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Email template interface
interface EmailTemplate {
  subject: string;
  html: (data: any) => string;
  text?: (data: any) => string;
}

// Email templates
export const emailTemplates = {
  welcome: {
    subject: 'Welcome to Shop Management System',
    html: (data: { name: string; shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to ${data.shopName}!</h2>
        <p>Hello ${data.name},</p>
        <p>Welcome to our shop management system. We're excited to have you on board!</p>
        <p>You can now access your dashboard and start managing your shop efficiently.</p>
        <p>Best regards,<br>The Shop Management Team</p>
      </div>
    `,
    text: (data: { name: string; shopName: string }) => 
      `Welcome to ${data.shopName}!\n\nHello ${data.name},\n\nWelcome to our shop management system. We're excited to have you on board!\n\nYou can now access your dashboard and start managing your shop efficiently.\n\nBest regards,\nThe Shop Management Team`
  },
  
  passwordReset: {
    subject: 'Password Reset Request',
    html: (data: { name: string; resetLink: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${data.name},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p><a href="${data.resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Shop Management Team</p>
      </div>
    `,
    text: (data: { name: string; resetLink: string }) => 
      `Password Reset Request\n\nHello ${data.name},\n\nWe received a request to reset your password. Click the link below to reset it:\n\n${data.resetLink}\n\nIf you didn't request this, please ignore this email.\n\nThis link will expire in 1 hour.\n\nBest regards,\nThe Shop Management Team`
  },
  
  invoiceNotification: {
    subject: 'New Invoice Generated',
    html: (data: { customerName: string; invoiceNumber: string; amount: number; shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Invoice Generated</h2>
        <p>Hello ${data.customerName},</p>
        <p>A new invoice has been generated for your purchase at ${data.shopName}.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Invoice Number:</strong> ${data.invoiceNumber}</p>
          <p><strong>Amount:</strong> $${data.amount.toFixed(2)}</p>
        </div>
        <p>Thank you for your business!</p>
        <p>Best regards,<br>${data.shopName} Team</p>
      </div>
    `,
    text: (data: { customerName: string; invoiceNumber: string; amount: number; shopName: string }) => 
      `New Invoice Generated\n\nHello ${data.customerName},\n\nA new invoice has been generated for your purchase at ${data.shopName}.\n\nInvoice Number: ${data.invoiceNumber}\nAmount: $${data.amount.toFixed(2)}\n\nThank you for your business!\n\nBest regards,\n${data.shopName} Team`
  },
  
  orderConfirmation: {
    subject: 'Order Confirmation',
    html: (data: { customerName: string; orderNumber: string; items: Array<{ name: string; quantity: number; price: number }>; total: number; shopName: string }) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Order Confirmation</h2>
        <p>Hello ${data.customerName},</p>
        <p>Thank you for your order at ${data.shopName}!</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order Number:</strong> ${data.orderNumber}</p>
          <h3>Order Items:</h3>
          ${data.items.map(item => `
            <div style="margin: 10px 0; padding: 10px; border-bottom: 1px solid #ddd;">
              <p><strong>${item.name}</strong></p>
              <p>Quantity: ${item.quantity} | Price: $${item.price.toFixed(2)}</p>
            </div>
          `).join('')}
          <p style="font-weight: bold; margin-top: 15px;">Total: $${data.total.toFixed(2)}</p>
        </div>
        <p>We'll notify you when your order is ready for pickup.</p>
        <p>Best regards,<br>${data.shopName} Team</p>
      </div>
    `,
    text: (data: { customerName: string; orderNumber: string; items: Array<{ name: string; quantity: number; price: number }>; total: number; shopName: string }) => 
      `Order Confirmation\n\nHello ${data.customerName},\n\nThank you for your order at ${data.shopName}!\n\nOrder Number: ${data.orderNumber}\n\nOrder Items:\n${data.items.map(item => `- ${item.name} (Qty: ${item.quantity}, Price: $${item.price.toFixed(2)})`).join('\n')}\n\nTotal: $${data.total.toFixed(2)}\n\nWe'll notify you when your order is ready for pickup.\n\nBest regards,\n${data.shopName} Team`
  }
};

// Email handler class using Resend
export class EmailHandler {
  private resend: Resend | null = null;
  private defaultFrom: string;

  constructor(apiKey?: string) {
    const apiKeyToUse = apiKey || process.env.RESEND_API_KEY;
    if (apiKeyToUse) {
      this.resend = new Resend(apiKeyToUse);
      this.defaultFrom = process.env.EMAIL_FROM || 'noreply@yourdomain.com';
    } else {
      console.warn('RESEND_API_KEY not found. Email functionality will be disabled.');
      this.defaultFrom = process.env.EMAIL_FROM || 'noreply@yourdomain.com';
    }
  }

  // Send email with custom content
  async sendEmail(content: EmailContent): Promise<boolean> {
    if (!this.resend) {
      console.warn('Email service not configured. Skipping email send.');
      return false;
    }

    try {
      const emailData = {
        from: content.from || this.defaultFrom,
        to: Array.isArray(content.to) ? content.to : [content.to],
        subject: content.subject,
        html: content.html,
        text: content.text
      };

      const { data, error } = await this.resend.emails.send(emailData);
      
      if (error) {
        console.error('Error sending email:', error);
        return false;
      }

      console.log('Email sent successfully:', data?.id);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  // Send email using template
  async sendTemplateEmail(
    templateName: keyof typeof emailTemplates,
    data: any,
    to: string | string[]
  ): Promise<boolean> {
    const template = emailTemplates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found`);
    }

    const content: EmailContent = {
      to,
      subject: template.subject,
      html: template.html(data),
      text: template.text ? template.text(data) : undefined
    };

    return this.sendEmail(content);
  }

  // Send welcome email
  async sendWelcomeEmail(name: string, shopName: string, email: string): Promise<boolean> {
    return this.sendTemplateEmail('welcome', { name, shopName }, email);
  }

  // Send password reset email
  async sendPasswordResetEmail(name: string, resetLink: string, email: string): Promise<boolean> {
    return this.sendTemplateEmail('passwordReset', { name, resetLink }, email);
  }

  // Send invoice notification
  async sendInvoiceNotification(
    customerName: string,
    invoiceNumber: string,
    amount: number,
    shopName: string,
    email: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('invoiceNotification', {
      customerName,
      invoiceNumber,
      amount,
      shopName
    }, email);
  }

  // Send order confirmation
  async sendOrderConfirmation(
    customerName: string,
    orderNumber: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    total: number,
    shopName: string,
    email: string
  ): Promise<boolean> {
    return this.sendTemplateEmail('orderConfirmation', {
      customerName,
      orderNumber,
      items,
      total,
      shopName
    }, email);
  }

  // Verify email configuration
  async verifyConnection(): Promise<boolean> {
    if (!this.resend) {
      console.warn('Email service not configured. Cannot verify connection.');
      return false;
    }

    try {
      // Test by sending a simple email to verify the connection
      const testResult = await this.sendEmail({
        to: 'test@example.com',
        subject: 'Connection Test',
        html: '<p>This is a test email to verify the connection.</p>'
      });
      
      if (testResult) {
        console.log('Email server connection verified');
        return true;
      } else {
        console.error('Email server connection failed');
        return false;
      }
    } catch (error) {
      console.error('Email server connection failed:', error);
      return false;
    }
  }
}

// Create default email handler instance
export const    emailHandler = new EmailHandler();

// Export types for use in other files
export type { EmailContent, EmailTemplate };
