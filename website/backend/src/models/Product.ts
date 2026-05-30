import mongoose, { Schema, Document } from 'mongoose';

export interface ISize {
  size: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  brand: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  description: string;
  price: number;
  comparePrice: number;
  images: string[];
  sizes: ISize[];
  isActive: boolean;
  ratingsAverage: number;
  ratingsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const SizeSchema = new Schema<ISize>(
  {
    size: {
      type: Number,
      required: [true, 'Shoe size is required'],
      min: [3, 'Shoe size must be at least 3'],
      max: [15, 'Shoe size cannot exceed 15'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Gender is required'],
      enum: {
        values: ['Men', 'Women', 'Unisex', 'Kids'],
        message: '{VALUE} is not a valid gender option',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    comparePrice: {
      type: Number,
      required: [true, 'Compare price is required'],
      min: [0, 'Compare price cannot be negative'],
    },
    images: {
      type: [String],
      default: [],
    },
    sizes: {
      type: [SizeSchema],
      required: [true, 'At least one size is required'],
      validate: {
        validator: function (val: ISize[]) {
          return val.length > 0;
        },
        message: 'Product must have at least one size entry',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Slugify helper: converts a product name into a URL-safe slug
 * Example: "Nike Air Max 90" -> "nike-air-max-90"
 */
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '')   // Remove non-word characters
    .replace(/\-\-+/g, '-')    // Replace multiple hyphens with single
    .replace(/^-+/, '')         // Trim leading hyphens
    .replace(/-+$/, '');        // Trim trailing hyphens
};

/**
 * Pre-save hook: auto-generate a unique slug from the product name
 */
ProductSchema.pre<IProduct>('save', async function (next) {
  // Only regenerate slug when name changes or document is new
  if (!this.isModified('name')) {
    return next();
  }

  let baseSlug = slugify(this.name);
  let candidateSlug = baseSlug;
  let counter = 1;

  // Ensure uniqueness by appending a counter suffix if needed
  while (true) {
    const existing = await mongoose.models.Product.findOne({ slug: candidateSlug });
    if (!existing || existing._id.toString() === this._id.toString()) {
      break;
    }
    candidateSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  this.slug = candidateSlug;
  next();
});

// Compound index for efficient catalog browsing queries
ProductSchema.index({ brand: 1, category: 1, gender: 1, price: 1 });
ProductSchema.index({ name: 'text', description: 'text' });

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
