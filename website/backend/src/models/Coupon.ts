import mongoose, { Schema, Document } from 'mongoose';

export interface IUserUsage {
  user: mongoose.Types.ObjectId;
  count: number;
}

export interface ICoupon extends Document {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minCartAmount: number;
  maxDiscountAmount?: number;
  startDate: Date;
  expiryDate: Date;
  usageLimit?: number;
  usageCount: number;
  userUsageLimit: number;
  usersUsed: IUserUsage[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserUsageSchema = new Schema<IUserUsage>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  count: {
    type: Number,
    default: 0,
    required: true
  }
}, { _id: false });

const CouponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    discountType: {
      type: String,
      required: [true, 'Discount type is required'],
      enum: {
        values: ['percentage', 'fixed'],
        message: 'Discount type must be either percentage or fixed'
      }
    },
    discountValue: {
      type: Number,
      required: [true, 'Discount value is required'],
      min: [0, 'Discount value cannot be negative']
    },
    minCartAmount: {
      type: Number,
      default: 0,
      min: [0, 'Minimum cart amount cannot be negative']
    },
    maxDiscountAmount: {
      type: Number,
      min: [0, 'Maximum discount amount cannot be negative']
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    usageLimit: {
      type: Number,
      min: [1, 'Usage limit must be at least 1']
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0
    },
    userUsageLimit: {
      type: Number,
      default: 1,
      min: [1, 'User usage limit must be at least 1']
    },
    usersUsed: [UserUsageSchema],
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save validation: if percentage, discountValue must be <= 100
CouponSchema.pre<ICoupon>('validate', function(next) {
  if (this.discountType === 'percentage' && this.discountValue > 100) {
    return next(new Error('Percentage discount value cannot exceed 100%'));
  }
  if (this.startDate >= this.expiryDate) {
    return next(new Error('Expiry date must be after start date'));
  }
  next();
});

const Coupon = mongoose.model<ICoupon>('Coupon', CouponSchema);
export default Coupon;
