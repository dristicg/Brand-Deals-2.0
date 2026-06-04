import { z } from 'zod';

export const CreateRazorpayOrderSchema = z.object({
  addressId: z.string({
    required_error: 'Address ID is required',
  }).min(1, 'Address ID cannot be empty'),
});

export const VerifyPaymentSchema = z.object({
  razorpay_order_id: z.string({
    required_error: 'Razorpay order ID is required',
  }),
  razorpay_payment_id: z.string({
    required_error: 'Razorpay payment ID is required',
  }),
  razorpay_signature: z.string({
    required_error: 'Razorpay signature is required',
  }),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(
    ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'],
    { required_error: 'Status is required and must be a valid order status' }
  ),
});
