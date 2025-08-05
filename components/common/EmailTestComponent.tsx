'use client';

import React, { useState } from 'react';
import { useEmail } from '@/hooks/useEmail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';

export const EmailTestComponent = () => {
  const [testEmail, setTestEmail] = useState('');
  const [testName, setTestName] = useState('');
  const [shopName, setShopName] = useState('');
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);

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

  const handleTestConnection = async () => {
    const response = await testConnection();
    setResult(response);
  };

  const handleSendWelcomeEmail = async () => {
    if (!testEmail || !testName || !shopName) {
      setResult({ success: false, error: 'Please fill in all fields' });
      return;
    }
    const response = await sendWelcomeEmail(testName, shopName, testEmail);
    setResult(response);
  };

  const handleSendPasswordReset = async () => {
    if (!testEmail || !testName) {
      setResult({ success: false, error: 'Please fill in email and name' });
      return;
    }
    const resetLink = `${window.location.origin}/auth/reset-password?token=test-token`;
    const response = await sendPasswordResetEmail(testName, resetLink, testEmail);
    setResult(response);
  };

  const handleSendInvoiceNotification = async () => {
    if (!testEmail || !testName || !shopName) {
      setResult({ success: false, error: 'Please fill in all fields' });
      return;
    }
    const response = await sendInvoiceNotification(
      testName,
      'INV-2024-001',
      299.99,
      shopName,
      testEmail
    );
    setResult(response);
  };

  const handleSendOrderConfirmation = async () => {
    if (!testEmail || !testName || !shopName) {
      setResult({ success: false, error: 'Please fill in all fields' });
      return;
    }
    const response = await sendOrderConfirmation(
      testName,
      'ORD-2024-001',
      [
        { name: 'Product 1', quantity: 2, price: 49.99 },
        { name: 'Product 2', quantity: 1, price: 29.99 }
      ],
      129.97,
      shopName,
      testEmail
    );
    setResult(response);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Test Component
        </CardTitle>
        <CardDescription>
          Test the email functionality with different templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="testEmail">Test Email</Label>
            <Input
              id="testEmail"
              type="email"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="testName">Name</Label>
            <Input
              id="testName"
              placeholder="John Doe"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              placeholder="My Shop"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
        </div>

        {/* Test Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={handleTestConnection}
            disabled={isLoading}
            variant="outline"
            size="sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
            Test Connection
          </Button>
          <Button
            onClick={handleSendWelcomeEmail}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Welcome Email
          </Button>
          <Button
            onClick={handleSendPasswordReset}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Password Reset
          </Button>
          <Button
            onClick={handleSendInvoiceNotification}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Invoice Notification
          </Button>
          <Button
            onClick={handleSendOrderConfirmation}
            disabled={isLoading}
            size="sm"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Order Confirmation
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={clearError}
                className="p-0 h-auto ml-2"
              >
                Clear
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Result Display */}
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              {result.message || result.error}
              <Button
                variant="link"
                size="sm"
                onClick={() => setResult(null)}
                className="p-0 h-auto ml-2"
              >
                Clear
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}; 