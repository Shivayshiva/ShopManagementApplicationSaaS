# User Creation API Documentation

## Endpoint
`PUT /api/superAdmin/users`

## Description
This API endpoint creates a new user for the shop management system. It first checks if a shop exists with the provided GST number, then creates a user account and sends login credentials via email.

## Request Body

```json
{
  "gstNumber": "string (required)",
  "email": "string (required, valid email)",
  "name": "string (required)",
  "mobileNumber": "string (required, min 10 digits)",
  "role": "string (optional, default: 'staff')",
  "shopId": "string (required)",
  "superAdminId": "string (required)"
}
```

### Field Descriptions

- **gstNumber**: The GST number of the shop. Must match an existing shop in the database.
- **email**: User's email address. Must be unique and valid email format.
- **name**: User's full name.
- **mobileNumber**: User's mobile number. Must be unique and at least 10 digits.
- **role**: User's role in the system. Must be one of: 'admin', 'manager', 'staff', 'cashier'. Defaults to 'staff'.
- **shopId**: The ID of the shop the user belongs to.
- **superAdminId**: The ID of the super admin creating the user.

## Response

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "mobileNumber": "1234567890",
    "role": "staff",
    "shopId": "shop_id",
    "superAdminId": "super_admin_id",
    "isActive": true,
    "userType": "shop_user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "User created successfully and credentials sent via email"
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "code": "invalid_string",
      "message": "Invalid email address",
      "path": ["email"]
    }
  ]
}
```

#### Shop Not Found (404)
```json
{
  "success": false,
  "error": "Shop with this GST number does not exist"
}
```

#### User Already Exists (409)
```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

#### Email Send Failure (200 with warning)
```json
{
  "success": true,
  "data": { /* user data */ },
  "message": "User created successfully but email notification failed",
  "warning": "Email notification could not be sent"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "error": "Failed to create user"
}
```

## Features

1. **GST Number Validation**: Checks if a shop exists with the provided GST number before creating the user.
2. **Duplicate Prevention**: Ensures no user exists with the same email or mobile number.
3. **Random Password Generation**: Generates a secure 12-character random password.
4. **Email Notification**: Sends login credentials to the user's email address.
5. **Input Validation**: Uses Zod schema for comprehensive input validation.
6. **Error Handling**: Provides detailed error messages for different scenarios.

## Email Template

The API sends a professional email with:
- Welcome message
- Login credentials (email and password)
- Security reminder to change password
- Professional styling

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 12
- Random password generation using nanoid
- Email validation
- Mobile number validation
- Role-based access control

## Example Usage

```javascript
const response = await fetch('/api/superAdmin/users', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    gstNumber: "27AAPFU0939F1Z5",
    email: "john.doe@example.com",
    name: "John Doe",
    mobileNumber: "9876543210",
    role: "staff",
    shopId: "507f1f77bcf86cd799439011",
    superAdminId: "507f1f77bcf86cd799439012"
  })
});

const result = await response.json();
console.log(result);
```

## Dependencies

- **bcryptjs**: For password hashing
- **nanoid**: For random password generation
- **zod**: For input validation
- **Resend**: For email sending
- **Mongoose**: For database operations

## Environment Variables Required

- `RESEND_API_KEY`: Resend API key for email functionality
- `EMAIL_FROM`: Default sender email address (optional) 