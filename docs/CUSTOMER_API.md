# Customer API Documentation

This document describes the customer API functionality implemented in the shop management application.

## Overview

The customer API provides endpoints to manage customer data in the database. The implementation includes:

- **API Routes**: Next.js API routes for CRUD operations
- **Custom Hooks**: React hooks for easy integration with components
- **API Client**: Utility functions for making API calls
- **Error Handling**: Comprehensive error handling and loading states

## API Endpoints

### GET /api/customers
Fetch all customers with optional pagination and filtering.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for name/email
- `isActive` (optional): Filter by active status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "customer_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "address": {
        "street": "123 Main St",
        "city": "New York",
        "state": "NY",
        "zipCode": "10001",
        "country": "USA"
      },
      "totalPurchases": 1500.00,
      "totalVisitCount": 5,
      "groupType": "Regular",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

### GET /api/customers/[id]
Fetch a single customer by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "customer_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "totalPurchases": 1500.00,
    "totalVisitCount": 5,
    "groupType": "Regular",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/customers
Create a new customer.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "totalVisitCount": 0,
  "groupType": "Regular",
  "notes": "New customer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "new_customer_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "totalPurchases": 0,
    "totalVisitCount": 0,
    "groupType": "Regular",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Customer created successfully"
}
```

### PUT /api/customers/[id]
Update an existing customer.

**Request Body:** (all fields optional)
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "phone": "+1234567890",
  "address": {
    "street": "456 Oak St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "country": "USA"
  },
  "totalVisitCount": 10,
  "groupType": "VIP",
  "notes": "Updated customer information",
  "isActive": true
}
```

### DELETE /api/customers/[id]
Delete a customer.

**Response:**
```json
{
  "success": true,
  "message": "Customer deleted successfully"
}
```

## Custom Hooks

### useCustomers()
Hook to fetch all customers from the database.

**Usage:**
```tsx
import { useCustomers } from '@/hooks/useCustomers';

function MyComponent() {
  const { customers, loading, error, refetch } = useCustomers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>{customer.customerName}</div>
      ))}
    </div>
  );
}
```

**Returns:**
- `customers`: Array of Customer objects
- `loading`: Boolean indicating if request is in progress
- `error`: Error message if request failed
- `refetch`: Function to refetch customers

### useCustomer(customerId)
Hook to fetch a single customer by ID.

**Usage:**
```tsx
import { useCustomer } from '@/hooks/useCustomer';

function CustomerDetail({ customerId }) {
  const { customer, loading, error, refetch } = useCustomer(customerId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!customer) return <div>Customer not found</div>;

  return (
    <div>
      <h1>{customer.customerName}</h1>
      <p>{customer.email}</p>
    </div>
  );
}
```

## API Client

The `apiClient` provides utility functions for making API calls with built-in error handling.

**Usage:**
```tsx
import { customerApi } from '@/lib/api-client';

// Get all customers
const customers = await customerApi.getAll();

// Get customer by ID
const customer = await customerApi.getById('customer_id');

// Create new customer
const newCustomer = await customerApi.create({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  address: {
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA'
  }
});

// Update customer
const updatedCustomer = await customerApi.update('customer_id', {
  name: 'John Smith'
});

// Delete customer
await customerApi.delete('customer_id');
```

## Data Transformation

The hooks automatically transform database customer objects to match the Redux Customer interface:

**Database Customer → Redux Customer:**
```tsx
{
  _id: dbCustomer._id,
  customerName: dbCustomer.name,
  customerMobile: dbCustomer.phone,
  customerDate: dbCustomer.createdAt,
  customerAddress: `${dbCustomer.address.street}, ${dbCustomer.address.city}, ${dbCustomer.address.state} ${dbCustomer.address.zipCode}`,
  customerStatus: dbCustomer.isActive ? 'paid' : 'unpaid',
  createdAt: dbCustomer.createdAt,
  updatedAt: dbCustomer.updatedAt,
  // Additional fields for compatibility
  name: dbCustomer.name,
  email: dbCustomer.email,
  phone: dbCustomer.phone,
  totalOrders: 0, // Calculated from invoices
  totalSpent: dbCustomer.totalPurchases || 0,
  status: dbCustomer.isActive ? 'active' : 'inactive',
  joinDate: dbCustomer.createdAt,
  lastOrder: dbCustomer.lastPurchaseDate || null,
}
```

## Error Handling

All API calls include comprehensive error handling:

- **Network errors**: Automatic retry and user-friendly messages
- **Validation errors**: Field-specific error messages
- **Server errors**: Graceful degradation with retry options
- **Loading states**: Visual feedback during API calls

## Testing

A test page is available at `/dashboard/customers/api-test` to test all API endpoints and see real-time responses.

## Integration with Redux

The hooks automatically sync with Redux store:

- `useCustomers()` dispatches `setCustomers()` action
- Customer data is available in both hooks and Redux store
- Components can use either source for customer data

## Database Schema

The customer data is stored in MongoDB with the following schema:

```typescript
interface ICustomer {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalPurchases: number;
  totalVisitCount: number;
  groupType: string;
  lastPurchaseDate?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
``` 