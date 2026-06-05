import mongoose, { Schema, Document, Model } from 'mongoose';
import Product from './Product';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IReviewModel extends Model<IReview> {
  calcAverageRatings(productId: mongoose.Types.ObjectId): Promise<void>;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Review must belong to a product'],
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    review: {
      type: String,
      required: [true, 'Please provide a review text'],
      maxlength: [1000, 'Review cannot be more than 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a user from submitting more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to calculate average rating
ReviewSchema.statics.calcAverageRatings = async function (productId: mongoose.Types.ObjectId) {
  const stats = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].nRating,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0,
    });
  }
};

// Call calcAverageRatings after save
ReviewSchema.post<IReview>('save', function () {
  (this.constructor as any as IReviewModel).calcAverageRatings(this.product);
});

// Call calcAverageRatings after remove/delete
ReviewSchema.post<IReview>(/findOneAnd/, async function (doc: IReview | null) {
  if (doc) {
    await (doc.constructor as any as IReviewModel).calcAverageRatings(doc.product);
  }
});

const Review = mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);

export default Review;
