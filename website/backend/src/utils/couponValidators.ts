import { z } from 'zod';

export const CreateCouponSchema = z.object({
  code: z
    .string({
      required_error: 'Coupon code is required',
    })
    .min(3, 'Coupon code must be at least 3 characters long')
    .max(20, 'Coupon code cannot exceed 20 characters')
    .regex(/^[A-Za-z0-9-_]+$/, 'Coupon code must contain only alphanumeric characters, hyphens, or underscores'),
  discountType: z.enum(['percentage', 'fixed'], {
    required_error: 'Discount type is required and must be either percentage or fixed',
  }),
  discountValue: z
    .number({
      required_error: 'Discount value is required',
    })
    .min(0, 'Discount value cannot be negative'),
  minCartAmount: z
    .number()
    .min(0, 'Minimum cart amount cannot be negative')
    .optional(),
  maxDiscountAmount: z
    .number()
    .min(0, 'Maximum discount amount cannot be negative')
    .optional(),
  startDate: z
    .string({
      required_error: 'Start date is required',
    })
    .transform((val) => new Date(val)),
  expiryDate: z
    .string({
      required_error: 'Expiry date is required',
    })
    .transform((val) => new Date(val)),
  usageLimit: z
    .number()
    .min(1, 'Usage limit must be at least 1')
    .optional(),
  userUsageLimit: z
    .number()
    .min(1, 'User usage limit must be at least 1')
    .optional(),
}).refine(
  (data) => {
    if (data.discountType === 'percentage' && data.discountValue > 100) {
      return false;
    }
    return true;
  },
  {
    message: 'Percentage discount value cannot exceed 100%',
    path: ['discountValue'],
  }
).refine(
  (data) => {
    return data.expiryDate > data.startDate;
  },
  {
    message: 'Expiry date must be after start date',
    path: ['expiryDate'],
  }
);

export const UpdateCouponSchema = z.object({
  discountType: z.enum(['percentage', 'fixed']).optional(),
  discountValue: z.number().min(0).optional(),
  minCartAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  startDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  expiryDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  usageLimit: z.number().min(1).optional(),
  userUsageLimit: z.number().min(1).optional(),
  active: z.boolean().optional(),
});

export const ValidateCouponSchema = z.object({
  code: z
    .string({
      required_error: 'Coupon code is required',
    })
    .min(1, 'Coupon code cannot be empty'),
});
