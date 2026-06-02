import { z } from 'zod';

/**
 * Zod validation schema for adding an item to the shopping cart
 */
export const AddItemToCartSchema = z.object({
  productId: z
    .string({ required_error: 'Product ID is required' })
    .min(1, { message: 'Product ID cannot be empty' })
    .trim(),
  size: z
    .coerce
    .number({ required_error: 'Size is required' })
    .positive({ message: 'Size must be a positive number' }),
  quantity: z
    .coerce
    .number()
    .int({ message: 'Quantity must be an integer' })
    .min(1, { message: 'Quantity must be at least 1' })
    .default(1),
});

/**
 * Zod validation schema for updating a cart item's quantity
 */
export const UpdateCartItemQuantitySchema = z.object({
  quantity: z
    .coerce
    .number({ required_error: 'Quantity is required' })
    .int({ message: 'Quantity must be an integer' })
    .min(1, { message: 'Quantity must be at least 1' }),
});
