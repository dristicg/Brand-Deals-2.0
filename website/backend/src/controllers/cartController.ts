import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AppError } from '../utils/AppError';

/**
 * Get or create the authenticated user's cart
 * GET /api/v1/cart
 */
export const getCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  // Find or create cart for user
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name slug brand category gender price comparePrice images sizes isActive',
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: {
      cart,
    },
  });
};

/**
 * Add an item to the user's cart
 * POST /api/v1/cart
 */
export const addItemToCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const { productId, size, quantity = 1 } = req.body;

  if (!productId || !size) {
    return next(new AppError('Product ID and Size are required', 400));
  }

  // 1. Verify product exists and is active
  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    return next(new AppError('Product not found or inactive', 404));
  }

  // 2. Verify requested size exists and has sufficient stock
  const sizeObj = product.sizes.find((s) => s.size === size);
  if (!sizeObj) {
    return next(new AppError(`Size UK ${size} is not available for this shoe`, 400));
  }

  if (sizeObj.stock < quantity) {
    return next(new AppError(`Insufficient stock. Only ${sizeObj.stock} units available for Size ${size}`, 400));
  }

  // 3. Find or create cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  // 4. Check if item (product + size combination) already exists in cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId && item.size === size
  );

  if (existingItemIndex > -1) {
    // Increment quantity
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (sizeObj.stock < newQty) {
      return next(new AppError(`Cannot add more. Limit exceeded (Max stock: ${sizeObj.stock})`, 400));
    }
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    // Add new item
    cart.items.push({ product: productId, size, quantity });
  }

  await cart.save();

  // Populate product details for response
  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name slug brand category gender price comparePrice images sizes isActive',
  });

  res.status(200).json({
    success: true,
    message: 'Item added to cart successfully',
    data: {
      cart: populatedCart,
    },
  });
};

/**
 * Update the quantity of a specific cart item
 * PUT /api/v1/cart/items/:itemId
 */
export const updateItemQuantity = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const { quantity } = req.body;
  const { itemId } = req.params;

  if (quantity === undefined || quantity < 1) {
    return next(new AppError('Please provide a valid quantity (minimum 1)', 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  // Find subdocument cart item
  const cartItem = (cart.items as any).id(itemId);
  if (!cartItem) {
    return next(new AppError('Cart item not found', 404));
  }

  // Verify stock limit for new quantity
  const product = await Product.findById(cartItem.product);
  if (!product) {
    return next(new AppError('Associated product no longer exists', 404));
  }

  const sizeObj = product.sizes.find((s) => s.size === cartItem.size);
  if (!sizeObj || sizeObj.stock < quantity) {
    return next(new AppError(`Cannot update quantity. Only ${sizeObj ? sizeObj.stock : 0} units in stock.`, 400));
  }

  cartItem.quantity = quantity;
  await cart.save();

  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name slug brand category gender price comparePrice images sizes isActive',
  });

  res.status(200).json({
    success: true,
    message: 'Cart updated successfully',
    data: {
      cart: populatedCart,
    },
  });
};

/**
 * Remove an item from cart
 * DELETE /api/v1/cart/items/:itemId
 */
export const removeItemFromCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const { itemId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  const cartItem = (cart.items as any).id(itemId);
  if (!cartItem) {
    return next(new AppError('Cart item not found', 404));
  }

  cartItem.deleteOne();
  await cart.save();

  const populatedCart = await cart.populate({
    path: 'items.product',
    select: 'name slug brand category gender price comparePrice images sizes isActive',
  });

  res.status(200).json({
    success: true,
    message: 'Item removed from cart',
    data: {
      cart: populatedCart,
    },
  });
};

/**
 * Clear all items from cart
 * DELETE /api/v1/cart
 */
export const clearCart = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new AppError('Cart not found', 404));
  }

  cart.items = [];
  await cart.save();

  res.status(200).json({
    success: true,
    message: 'Cart cleared successfully',
    data: {
      cart,
    },
  });
};
