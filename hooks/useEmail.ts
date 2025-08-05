import { useState } from 'react';

interface EmailData {
  template?: keyof typeof import('@/utils/nodemailer').emailTemplates;
  data?: any;
  to: string | string[];
  customEmail?: {
    subject: string;
    html: string;
    text?: string;
    from?: string;
  };
}

interface EmailResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export const useEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendEmail = async (emailData: EmailData): Promise<EmailResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send email');
      }

      return {
        success: true,
        message: result.message || 'Email sent successfully',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send email';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendWelcomeEmail = async (name: string, shopName: string, email: string): Promise<EmailResponse> => {
    return sendEmail({
      template: 'welcome',
      data: { name, shopName },
      to: email,
    });
  };

  const sendPasswordResetEmail = async (name: string, resetLink: string, email: string): Promise<EmailResponse> => {
    return sendEmail({
      template: 'passwordReset',
      data: { name, resetLink },
      to: email,
    });
  };

  const sendInvoiceNotification = async (
    customerName: string,
    invoiceNumber: string,
    amount: number,
    shopName: string,
    email: string
  ): Promise<EmailResponse> => {
    return sendEmail({
      template: 'invoiceNotification',
      data: { customerName, invoiceNumber, amount, shopName },
      to: email,
    });
  };

  const sendOrderConfirmation = async (
    customerName: string,
    orderNumber: string,
    items: Array<{ name: string; quantity: number; price: number }>,
    total: number,
    shopName: string,
    email: string
  ): Promise<EmailResponse> => {
    return sendEmail({
      template: 'orderConfirmation',
      data: { customerName, orderNumber, items, total, shopName },
      to: email,
    });
  };

  const testConnection = async (): Promise<EmailResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/email', {
        method: 'GET',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to test connection');
      }

      return {
        success: true,
        message: result.message || 'Connection test successful',
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to test connection';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendInvoiceNotification,
    sendOrderConfirmation,
    testConnection,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}; 