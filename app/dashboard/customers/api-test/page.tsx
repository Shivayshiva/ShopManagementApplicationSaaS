"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/CommonCard";
import GlobalButton from "@/components/common/globalButton";
import { useCustomers } from "@/hooks/useCustomers";
import { useCustomer } from "@/hooks/useCustomer";
import { RefreshCw, Database, Users, User } from "lucide-react";

export default function CustomerApiTestPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Use the custom hooks
  const { customers, loading: customersLoading, error: customersError, refetch: refetchCustomers } = useCustomers();
  const { customer: singleCustomer, loading: singleCustomerLoading, error: singleCustomerError, refetch: refetchSingleCustomer } = useCustomer(selectedCustomerId);

  const testGetAllCustomers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customers');
      const result = await response.json();
      setApiResponse({ endpoint: 'GET /api/customers', response: result });
    } catch (error) {
      setApiResponse({ endpoint: 'GET /api/customers', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testGetCustomerById = async () => {
    if (!selectedCustomerId) {
      setApiResponse({ endpoint: 'GET /api/customers/[id]', error: 'Please select a customer first' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/customers/${selectedCustomerId}`);
      const result = await response.json();
      setApiResponse({ endpoint: `GET /api/customers/${selectedCustomerId}`, response: result });
    } catch (error) {
      setApiResponse({ endpoint: `GET /api/customers/${selectedCustomerId}`, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testCreateCustomer = async () => {
    setLoading(true);
    try {
      const newCustomer = {
        name: "Test Customer " + Date.now(),
        email: `test${Date.now()}@example.com`,
        phone: "+1234567890",
        address: {
          street: "123 Test Street",
          city: "Test City",
          state: "Test State",
          zipCode: "12345",
          country: "USA"
        },
        totalVisitCount: 0,
        groupType: "Regular",
        notes: "Test customer created via API"
      };

      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
      const result = await response.json();
      setApiResponse({ endpoint: 'POST /api/customers', response: result });
      
      // Refresh the customers list
      if (result.success) {
        refetchCustomers();
      }
    } catch (error) {
      setApiResponse({ endpoint: 'POST /api/customers', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customer API Test</h1>
        <p className="text-muted-foreground">Test the customer API endpoints and see the responses</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              API Test Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Customer for Single Customer Test:</label>
              <select
                className="w-full p-2 border rounded-md"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
              >
                <option value="">Choose a customer...</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.customerName} ({customer.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <GlobalButton
                text="Test GET All Customers"
                icon={<Users className="h-4 w-4" />}
                onClick={testGetAllCustomers}
                disabled={loading}
                className="w-full"
              />
              
              <GlobalButton
                text="Test GET Customer by ID"
                icon={<User className="h-4 w-4" />}
                onClick={testGetCustomerById}
                disabled={loading || !selectedCustomerId}
                className="w-full"
              />
              
              <GlobalButton
                text="Test POST Create Customer"
                icon={<RefreshCw className="h-4 w-4" />}
                onClick={testCreateCustomer}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Custom Hooks Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Custom Hooks Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">useCustomers Hook:</h4>
              <div className="text-sm space-y-1">
                <p>Loading: {customersLoading ? 'Yes' : 'No'}</p>
                <p>Error: {customersError || 'None'}</p>
                <p>Customers Count: {customers.length}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">useCustomer Hook:</h4>
              <div className="text-sm space-y-1">
                <p>Selected ID: {selectedCustomerId || 'None'}</p>
                <p>Loading: {singleCustomerLoading ? 'Yes' : 'No'}</p>
                <p>Error: {singleCustomerError || 'None'}</p>
                <p>Customer: {singleCustomer ? singleCustomer.customerName : 'None'}</p>
              </div>
            </div>

            <GlobalButton
              text="Refresh Customers"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={refetchCustomers}
              disabled={customersLoading}
              className="w-full"
            />
          </CardContent>
        </Card>
      </div>

      {/* API Response */}
      {apiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md">
              <h4 className="font-medium mb-2">{apiResponse.endpoint}</h4>
              <pre className="text-sm overflow-auto max-h-96">
                {JSON.stringify(apiResponse.response || apiResponse.error, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Customers (from useCustomers hook)</CardTitle>
        </CardHeader>
        <CardContent>
          {customersLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading customers...</p>
            </div>
          ) : customersError ? (
            <div className="text-center py-8 text-red-600">
              <p>Error: {customersError}</p>
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No customers found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {customers.map((customer) => (
                <div key={customer.id} className="border rounded p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{customer.customerName}</h4>
                      <p className="text-sm text-muted-foreground">ID: {customer.id}</p>
                      <p className="text-sm text-muted-foreground">Email: {customer.email || 'N/A'}</p>
                      <p className="text-sm text-muted-foreground">Phone: {customer.phone || customer.customerMobile}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs ${
                        customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {customer.status || 'unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 