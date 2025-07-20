import connectDB from './database';
import Product from './models/Product';
import Customer from './models/Customer';
import Invoice from './models/Invoice';

export async function seedDatabase() {
  try {
    await connectDB();
    
    // Clear existing data
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Invoice.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Create sample products
    const products = await Product.create([
      {
        name: 'Laptop Dell XPS 13',
        description: 'High-performance laptop with 13-inch display',
        price: 1299.99,
        costPrice: 899.99,
        category: 'Electronics',
        sku: 'LAP-DELL-XPS13',
        barcode: '1234567890123',
        stockQuantity: 15,
        minStockLevel: 5,
        images: ['laptop1.jpg', 'laptop2.jpg'],
        isActive: true
      },
      {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with advanced camera system',
        price: 999.99,
        costPrice: 699.99,
        category: 'Electronics',
        sku: 'PHN-IPH-15PRO',
        barcode: '1234567890124',
        stockQuantity: 25,
        minStockLevel: 10,
        images: ['iphone1.jpg'],
        isActive: true
      },
      {
        name: 'Wireless Headphones',
        description: 'Noise-cancelling wireless headphones',
        price: 199.99,
        costPrice: 129.99,
        category: 'Electronics',
        sku: 'AUD-WIRELESS-HP',
        barcode: '1234567890125',
        stockQuantity: 8,
        minStockLevel: 15,
        images: ['headphones1.jpg'],
        isActive: true
      }
    ]);
    
    console.log('Created products:', products.length);
    
    // Create sample customers
    const customers = await Customer.create([
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-0123',
        address: {
          street: '123 Main Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        totalPurchases: 0,
        isActive: true
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '+1-555-0124',
        address: {
          street: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        totalPurchases: 0,
        isActive: true
      }
    ]);
    
    console.log('Created customers:', customers.length);
    
    // Create sample invoices
    const invoices = await Invoice.create([
      {
        customer: customers[0]._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            quantity: 1,
            price: products[0].price,
            total: products[0].price
          }
        ],
        subtotal: products[0].price,
        tax: products[0].price * 0.08,
        discount: 0,
        total: products[0].price * 1.08,
        status: 'completed',
        paymentMethod: 'card',
        paymentStatus: 'paid',
        paidAt: new Date()
      }
    ]);
    
    console.log('Created invoices:', invoices.length);
    
    // Update product stock quantities
    await Product.findByIdAndUpdate(products[0]._id, { $inc: { stockQuantity: -1 } });
    
    // Update customer total purchases
    await Customer.findByIdAndUpdate(customers[0]._id, { 
      $inc: { totalPurchases: invoices[0].total },
      lastPurchaseDate: new Date()
    });
    
    console.log('Database seeded successfully!');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
} 