import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/database';
import Product from '@/lib/models/Product';
import Customer from '@/lib/models/Customer';
import Invoice from '@/lib/models/Invoice';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get current date and last month date
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    // Total counts
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await Customer.countDocuments({ isActive: true });
    const totalInvoices = await Invoice.countDocuments();
    
    // Revenue calculations
    const totalRevenue = await Invoice.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const lastMonthRevenue = await Invoice.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid',
          createdAt: { $gte: lastMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    // Recent orders (last 5)
    const recentOrders = await Invoice.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('invoiceNumber customer total status createdAt')
      .lean();
    
    // Top products by sales
    const topProducts = await Invoice.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' }
        }
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          sales: '$totalSales',
          revenue: '$totalRevenue'
        }
      }
    ]);
    
    // Low stock products
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: '$minStockLevel' },
      isActive: true
    })
    .select('name stockQuantity minStockLevel')
    .limit(5)
    .lean();
    
    // Monthly revenue for chart
    const monthlyRevenue = await Invoice.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$total' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    const stats = {
      totalRevenue: totalRevenue[0]?.total || 0,
      lastMonthRevenue: lastMonthRevenue[0]?.total || 0,
      totalProducts,
      totalCustomers,
      totalInvoices,
      recentOrders: recentOrders.map(order => ({
        id: order.invoiceNumber,
        customer: order.customer.name,
        amount: order.total,
        status: order.status,
        time: order.createdAt
      })),
      topProducts: topProducts.map(product => ({
        name: product.name,
        sales: product.sales,
        revenue: product.revenue,
        trend: 'up' // You can implement trend calculation based on previous periods
      })),
      lowStockProducts,
      monthlyRevenue
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
} 