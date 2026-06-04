import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';
import { UpdateOrderStatusSchema } from '../utils/orderValidators';

/**
 * @desc    Get logged in user's orders
 * @route   GET /api/v1/orders
 * @access  Private
 */
export const getMyOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name slug brand images',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/v1/orders/:id
 * @access  Private
 */
export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const order = await Order.findById(req.params.id).populate({
      path: 'items.product',
      select: 'name slug brand images price',
    });

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Ensure user owns the order, unless admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to view this order', 403));
    }

    res.status(200).json({
      success: true,
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel an order (Customer)
 * @route   PATCH /api/v1/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Ensure user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to modify this order', 403));
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return next(new AppError(`Order cannot be cancelled because it is already ${order.orderStatus}`, 400));
    }

    order.orderStatus = 'cancelled';
    await order.save();

    // Restore stock since order is cancelled
    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product, 'sizes.size': item.size },
        { $inc: { 'sizes.$.stock': item.quantity } }
      );
    }

    // In a full implementation, you would also trigger a refund here if paymentDetails.status === 'paid'

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/v1/orders/admin
 * @access  Private/Admin
 */
export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate('user', 'id name email')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update order status
 * @route   PATCH /api/v1/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = UpdateOrderStatusSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    const currentStatus = order.orderStatus;
    const newStatus = validation.data.status;

    // Disallow transitions from cancelled/refunded
    if (['cancelled', 'refunded'].includes(currentStatus) && !['cancelled', 'refunded'].includes(newStatus)) {
      return next(new AppError(`Cannot change status of a ${currentStatus} order`, 400));
    }

    // Handle stock restoration if transitioning to cancelled/refunded from an active state
    if (!['cancelled', 'refunded'].includes(currentStatus) && ['cancelled', 'refunded'].includes(newStatus)) {
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.product, 'sizes.size': item.size },
          { $inc: { 'sizes.$.stock': item.quantity } }
        );
      }
    }

    order.orderStatus = newStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        order,
      },
    });
  } catch (error) {
    next(error);
  }
};
