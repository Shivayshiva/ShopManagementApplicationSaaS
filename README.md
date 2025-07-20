<<<<<<< HEAD
# ShopManagementApplicationSaaS
Its a shop management application using nextjs and typescript. Development SaaS product
=======
# Shop Management App

A comprehensive shop management application built with Next.js, TypeScript, and MongoDB.

## Features

- **Product Management**: Add, edit, delete, and track inventory
- **Customer Management**: Manage customer information and purchase history
- **Invoice Generation**: Create and manage invoices with automatic stock updates
- **Dashboard**: Real-time statistics and analytics
- **Barcode Support**: Scan and manage products with barcodes
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **TypeScript** - Type-safe backend code

## Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm, yarn, or pnpm

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shop-management-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/shop-management
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shop-management
   ```

4. **Start MongoDB** (if using local MongoDB)
   ```bash
   # On Windows
   mongod
   
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:4000](http://localhost:4000)

## API Endpoints

### Products
- `GET /api/products` - Get all products (with pagination, search, filtering)
- `POST /api/products` - Create a new product
- `GET /api/products/[id]` - Get a specific product
- `PUT /api/products/[id]` - Update a product
- `DELETE /api/products/[id]` - Delete a product
- `GET /api/products/search` - Search product by serial number (SKU or barcode)

### Customers
- `GET /api/customers` - Get all customers (with pagination, search, filtering)
- `POST /api/customers` - Create a new customer
- `GET /api/customers/[id]` - Get a specific customer
- `PUT /api/customers/[id]` - Update a customer
- `DELETE /api/customers/[id]` - Delete a customer

### Invoices
- `GET /api/invoices` - Get all invoices (with pagination, filtering)
- `POST /api/invoices` - Create a new invoice
- `GET /api/invoices/[id]` - Get a specific invoice
- `PUT /api/invoices/[id]` - Update an invoice
- `DELETE /api/invoices/[id]` - Cancel an invoice

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Database Schema

### Product
```typescript
{
  name: string;
  description: string;
  price: number;
  costPrice: number;
  category: string;
  barcode?: string;
  sku: string;
  stockQuantity: number;
  minStockLevel: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Customer
```typescript
{
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
  lastPurchaseDate?: Date;
  isActive: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Invoice
```typescript
{
  invoiceNumber: string;
  customer: ObjectId;
  items: [{
    product: ObjectId;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'bank_transfer' | 'other';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed';
  notes?: string;
  dueDate?: Date;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Key Features

### Automatic Stock Management
- Stock quantities are automatically updated when invoices are created
- Low stock alerts for products below minimum stock level
- Stock validation before creating invoices

### Invoice Generation
- Automatic invoice number generation
- Real-time total calculations
- Customer purchase history tracking
- Multiple payment methods support

### Search and Filtering
- Full-text search for products and customers
- Product scanning via barcode with fallback search by serial number
- Real-time product lookup and auto-population of details
- Category-based filtering
- Status-based filtering for invoices
- Pagination support for all list views

### Dashboard Analytics
- Total revenue and growth metrics
- Recent orders tracking
- Top-selling products
- Low stock alerts
- Monthly revenue charts

## Development

### Project Structure
```
shop-management-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── products/      # Product endpoints
│   │   ├── customers/     # Customer endpoints
│   │   ├── invoices/      # Invoice endpoints
│   │   └── dashboard/     # Dashboard endpoints
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utilities and models
│   ├── models/           # Mongoose models
│   ├── database.ts       # MongoDB connection
│   └── api-utils.ts      # API utilities
└── public/               # Static assets
```

### Adding New Features

1. **Create a new model** in `lib/models/`
2. **Add API routes** in `app/api/`
3. **Create frontend components** in `components/`
4. **Add pages** in `app/`

### Database Indexes
The application includes optimized database indexes for:
- Text search on product names and descriptions
- Email uniqueness for customers
- SKU and barcode uniqueness for products
- Invoice number uniqueness
- Date-based sorting

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- **Netlify**: Similar to Vercel deployment
- **Railway**: Good for full-stack applications
- **Heroku**: Traditional deployment option

### Environment Variables for Production
```env
MONGODB_URI=your-production-mongodb-uri
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 
>>>>>>> c91c639 (shop managment application first code added)
