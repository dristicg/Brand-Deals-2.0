import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { CreateProductSchema, UpdateProductSchema } from '../utils/productValidators';
import { AppError } from '../utils/AppError';

/**
 * @desc    Create a new product
 * @route   POST /api/v1/products
 * @access  Private/Admin
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = CreateProductSchema.parse(req.body);
    const product = await Product.create(validatedData);

    res.status(201).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing product
 * @route   PUT /api/v1/products/:id
 * @access  Private/Admin
 */
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validatedData = UpdateProductSchema.parse(req.body);

    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    // Apply validated fields to existing document (triggers pre-save hooks like slug)
    Object.assign(product, validatedData);
    await product.save();

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all products with search, filters, sorting, and pagination
 * @route   GET /api/v1/products
 * @access  Public
 *
 * Query Parameters:
 *   search   - Text search across name and description
 *   brand    - Filter by brand (comma-separated for multiple)
 *   category - Filter by category
 *   gender   - Filter by gender (Men, Women, Unisex, Kids)
 *   minPrice - Minimum price filter
 *   maxPrice - Maximum price filter
 *   size     - Filter products that have a specific size available
 *   sort     - Sort order: newest | price_asc | price_desc | popular
 *   page     - Page number (default: 1)
 *   limit    - Results per page (default: 12)
 */
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      search,
      brand,
      category,
      gender,
      minPrice,
      maxPrice,
      size,
      sort,
      page = '1',
      limit = '12',
    } = req.query;

    // Build filter object
    const filter: any = { isActive: true };

    // Text search via regex (case-insensitive)
    if (search && typeof search === 'string') {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    // Brand filter (supports comma-separated values for multi-brand)
    if (brand && typeof brand === 'string') {
      const brands = brand.split(',').map((b) => b.trim());
      filter.brand = { $in: brands };
    }

    // Category filter
    if (category && typeof category === 'string') {
      filter.category = category.trim();
    }

    // Gender filter
    if (gender && typeof gender === 'string') {
      filter.gender = gender.trim();
    }

    // Price range filters
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Size availability filter
    if (size) {
      filter['sizes.size'] = Number(size);
      filter['sizes.stock'] = { $gt: 0 };
    }

    // Sorting configuration
    let sortOption: any = { createdAt: -1 }; // Default: newest first
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'popular') sortOption = { ratingsAverage: -1, ratingsCount: -1 };

    // Pagination
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    // Execute query with pagination
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: { products },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single product by slug
 * @route   GET /api/v1/products/:slug
 * @access  Public
 */
export const getProductBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single product by ID (Admin)
 * @route   GET /api/v1/products/admin/:id
 * @access  Private/Admin
 */
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { product },
    });
  } catch (error) {
    next(error);
  }
};

