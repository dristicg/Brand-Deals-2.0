import { Request, Response, NextFunction } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Cart from '../models/Cart';
import Order from '../models/Order';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';
import { CreateRazorpayOrderSchema, VerifyPaymentSchema } from '../utils/orderValidators';
import mongoose from 'mongoose';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('CRITICAL: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be defined in environment variables.');
}

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * @desc    Create a Razorpay Order
 * @route   POST /api/v1/payments/create-order
 * @access  Private
 */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    // Parse and validate incoming body
    const validation = CreateRazorpayOrderSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }
    const { addressId } = validation.data;

    // Validate that the address exists in the user's profile
    const address = (req.user.savedAddresses as any).id(addressId);
    if (!address) {
      return next(new AppError('Selected address not found in profile', 404));
    }

    // Get the user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'price isActive sizes name',
    });

    if (!cart || cart.items.length === 0) {
      return next(new AppError('Your cart is empty', 400));
    }

    // Calculate total amount and verify stock
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = item.product as any;
      if (!product.isActive) {
        return next(new AppError(`Product ${product.name} is no longer available`, 400));
      }
      const sizeObj = product.sizes.find((s: any) => s.size === item.size);
      if (!sizeObj || sizeObj.stock < item.quantity) {
        return next(new AppError(`Insufficient stock for ${product.name} (Size ${item.size})`, 400));
      }
      totalAmount += product.price * item.quantity;
    }

    // Note: In real app with coupons, you'd apply discount here

    // Create Razorpay Order
    const options = {
      amount: totalAmount * 100, // Razorpay amount is in paise (smallest currency unit)
      currency: 'INR',
      receipt: `rcpt_${req.user._id}_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        addressId,
      },
    });
  } catch (error) {
    console.error('[Payment] Create Order Error:', error);
    next(new AppError('Could not create payment order. Please try again.', 500));
  }
};

/**
 * @desc    Verify Payment and Create Database Order
 * @route   POST /api/v1/payments/verify
 * @access  Private
 */
export const verifyPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const validation = VerifyPaymentSchema.safeParse(req.body);
    if (!validation.success) {
      return next(new AppError(validation.error.errors[0].message, 400));
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = validation.data;
    
    // addressId should be passed back from frontend or we could store it temporarily,
    // but typically it's sent along with the verify request or stored in a pending order.
    // For simplicity, we expect the frontend to pass addressId in this verify call as well.
    const addressId = req.body.addressId;
    if (!addressId) {
      return next(new AppError('Address ID is required for verification', 400));
    }
    const address = (req.user.savedAddresses as any).id(addressId);
    if (!address) {
      return next(new AppError('Selected address not found in profile', 404));
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET as string;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return next(new AppError('Payment signature verification failed', 400));
    }

    // Fetch Cart
    const cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'price',
    });

    if (!cart || cart.items.length === 0) {
      return next(new AppError('Cart is empty, cannot create order', 400));
    }

    // Build order items and calculate total
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      const product = item.product as any;
      orderItems.push({
        product: product._id,
        size: item.size,
        quantity: item.quantity,
        price: product.price,
      });
      totalAmount += product.price * item.quantity;
    }

    const session = await mongoose.startSession();
    let orderId, orderNumber;

    try {
      await session.withTransaction(async () => {
        // 1. Create the Order in DB
        const orderArr = await Order.create([{
          user: req.user!._id,
          items: orderItems,
          shippingAddress: {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
          paymentDetails: {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'paid',
          },
          orderStatus: 'confirmed',
          totalAmount,
        }], { session });

        const order = orderArr[0];
        orderId = order._id;
        orderNumber = order.orderNumber;

        // 2. Decrement Stock for each product
        for (const item of orderItems) {
          await Product.updateOne(
            { _id: item.product, 'sizes.size': item.size },
            { $inc: { 'sizes.$.stock': -item.quantity } },
            { session }
          );
        }

        // 3. Clear the Cart
        cart.items = [];
        await cart.save({ session });
      });
    } finally {
      await session.endSession();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and order placed successfully',
      data: {
        orderId,
        orderNumber,
      },
    });
  } catch (error) {
    console.error('[Payment] Verify Payment Error:', error);
    next(new AppError('Payment verification failed', 500));
  }
};
