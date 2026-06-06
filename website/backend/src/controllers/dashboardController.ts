import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';

/**
 * @desc    Get dashboard metrics and trends
 * @route   GET /api/v1/dashboard/stats
 * @access  Private (Admin Only)
 */
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. REVENUE & ORDER METRICS
    const orderStats = await Order.aggregate([
      {
        $match: {
          'paymentDetails.status': 'paid',
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalDiscounts: { $sum: '$discountAmount' },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const stats = orderStats[0] || { totalRevenue: 0, totalDiscounts: 0, totalOrders: 0 };
    const netSales = stats.totalRevenue;
    const totalDiscounts = stats.totalDiscounts;
    const grossSales = netSales + totalDiscounts;
    const totalOrdersCount = stats.totalOrders;
    const averageOrderValue = totalOrdersCount > 0 ? Math.round((netSales / totalOrdersCount) * 100) / 100 : 0;

    // 2. ORDER STATUS DISTRIBUTION
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStatusDistribution = statusStats.reduce((acc: any, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Ensure all possible statuses are represented
    const allStatuses = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'];
    allStatuses.forEach((status) => {
      if (!orderStatusDistribution[status]) {
        orderStatusDistribution[status] = 0;
      }
    });

    // 3. CUSTOMER METRICS
    const totalCustomers = await User.countDocuments({ role: 'user' });
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newCustomers30Days = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: thirtyDaysAgo },
    });

    // 4. INVENTORY METRICS
    const allProducts = await Product.find();
    let totalProductsCount = allProducts.length;
    let outOfStockCount = 0;
    let lowStockCount = 0;
    const lowStockAlerts: any[] = [];

    allProducts.forEach((product) => {
      let productTotalStock = 0;
      let hasLowStockSize = false;
      const lowStockSizesList: number[] = [];

      product.sizes.forEach((s) => {
        productTotalStock += s.stock;
        if (s.stock > 0 && s.stock < 5) {
          hasLowStockSize = true;
          lowStockSizesList.push(s.size);
        }
      });

      if (productTotalStock === 0) {
        outOfStockCount++;
      }
      if (hasLowStockSize || productTotalStock === 0) {
        lowStockCount++;
        lowStockAlerts.push({
          productId: product._id,
          name: product.name,
          brand: product.brand,
          totalStock: productTotalStock,
          lowStockSizes: lowStockSizesList,
        });
      }
    });

    // 5. SALES TREND (Last 6 Months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlySalesTrend = await Order.aggregate([
      {
        $match: {
          'paymentDetails.status': 'paid',
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          sales: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format sales trend for frontend charts (ensure all last 6 months are represented)
    const formattedTrend = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed for MongoDB matching
      const label = `${monthNames[d.getMonth()]} ${year}`;

      const trendData = monthlySalesTrend.find(
        (t) => t._id.year === year && t._id.month === month
      );

      formattedTrend.push({
        label,
        sales: trendData ? trendData.sales : 0,
        orders: trendData ? trendData.orders : 0,
      });
    }

    // 6. TOP SELLING PRODUCTS
    const topSellingData = await Order.aggregate([
      {
        $match: {
          'paymentDetails.status': 'paid',
        },
      },
      {
        $unwind: '$items',
      },
      {
        $group: {
          _id: '$items.product',
          totalQtySold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      {
        $sort: { totalQtySold: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: '$productDetails',
      },
      {
        $project: {
          _id: 1,
          totalQtySold: 1,
          totalRevenue: 1,
          name: '$productDetails.name',
          brand: '$productDetails.brand',
          price: '$productDetails.price',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        financials: {
          grossSales,
          netSales,
          totalDiscounts,
          averageOrderValue,
        },
        orders: {
          totalOrders: totalOrdersCount,
          statusDistribution: orderStatusDistribution,
        },
        customers: {
          totalCustomers,
          newCustomers30Days,
        },
        inventory: {
          totalProducts: totalProductsCount,
          outOfStock: outOfStockCount,
          lowStock: lowStockCount,
          lowStockAlerts: lowStockAlerts.slice(0, 10), // Limit alert list size
        },
        salesTrend: formattedTrend,
        topSellingProducts: topSellingData,
      },
    });
  } catch (error) {
    next(error);
  }
};
