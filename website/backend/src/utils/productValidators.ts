import { z } from 'zod';

/**
 * Zod sub-schema for a single size-stock entry
 */
const SizeEntrySchema = z.object({
  size: z
    .number({ required_error: 'Shoe size is required' })
    .min(3, { message: 'Shoe size must be at least 3' })
    .max(15, { message: 'Shoe size cannot exceed 15' }),
  stock: z
    .number({ required_error: 'Stock is required' })
    .int({ message: 'Stock must be a whole number' })
    .min(0, { message: 'Stock cannot be negative' }),
});

/**
 * Zod validation schema for creating a new product (all fields required)
 */
export const CreateProductSchema = z.object({
  name: z
    .string({ required_error: 'Product name is required' })
    .min(2, { message: 'Product name must be at least 2 characters' })
    .max(200, { message: 'Product name cannot exceed 200 characters' })
    .trim(),
  brand: z
    .string({ required_error: 'Brand is required' })
    .min(1, { message: 'Brand is required' })
    .trim(),
  category: z
    .string({ required_error: 'Category is required' })
    .min(1, { message: 'Category is required' })
    .trim(),
  gender: z.enum(['Men', 'Women', 'Unisex', 'Kids'], {
    required_error: 'Gender is required',
    invalid_type_error: 'Gender must be Men, Women, Unisex, or Kids',
  }),
  description: z
    .string({ required_error: 'Description is required' })
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(5000, { message: 'Description cannot exceed 5000 characters' })
    .trim(),
  price: z
    .number({ required_error: 'Price is required' })
    .min(0, { message: 'Price cannot be negative' }),
  comparePrice: z
    .number({ required_error: 'Compare price is required' })
    .min(0, { message: 'Compare price cannot be negative' }),
  images: z
    .array(z.string().url({ message: 'Each image must be a valid URL' }))
    .optional()
    .default([]),
  sizes: z
    .array(SizeEntrySchema)
    .min(1, { message: 'At least one size entry is required' }),
  isActive: z.boolean().optional().default(true),
});

/**
 * Zod validation schema for updating an existing product (all fields optional)
 */
export const UpdateProductSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Product name must be at least 2 characters' })
    .max(200, { message: 'Product name cannot exceed 200 characters' })
    .trim()
    .optional(),
  brand: z.string().min(1).trim().optional(),
  category: z.string().min(1).trim().optional(),
  gender: z
    .enum(['Men', 'Women', 'Unisex', 'Kids'], {
      invalid_type_error: 'Gender must be Men, Women, Unisex, or Kids',
    })
    .optional(),
  description: z
    .string()
    .min(10, { message: 'Description must be at least 10 characters' })
    .max(5000, { message: 'Description cannot exceed 5000 characters' })
    .trim()
    .optional(),
  price: z.number().min(0, { message: 'Price cannot be negative' }).optional(),
  comparePrice: z
    .number()
    .min(0, { message: 'Compare price cannot be negative' })
    .optional(),
  images: z
    .array(z.string().url({ message: 'Each image must be a valid URL' }))
    .optional(),
  sizes: z
    .array(SizeEntrySchema)
    .min(1, { message: 'At least one size entry is required' })
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
