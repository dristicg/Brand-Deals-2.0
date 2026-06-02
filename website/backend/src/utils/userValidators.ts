import { z } from 'zod';

/**
 * Zod validation schema for user profile updates
 */
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long' })
    .max(50, { message: 'Name cannot exceed 50 characters' })
    .trim()
    .optional(),
  email: z
    .string()
    .email({ message: 'Please provide a valid email address' })
    .trim()
    .toLowerCase()
    .optional(),
});

/**
 * Zod validation schema for user address entries
 */
export const AddressSchema = z.object({
  street: z
    .string({ required_error: 'Street is required' })
    .min(3, { message: 'Street must be at least 3 characters' })
    .trim(),
  city: z
    .string({ required_error: 'City is required' })
    .min(2, { message: 'City must be at least 2 characters' })
    .trim(),
  state: z
    .string({ required_error: 'State is required' })
    .min(2, { message: 'State must be at least 2 characters' })
    .trim(),
  postalCode: z
    .string({ required_error: 'Postal code is required' })
    .min(4, { message: 'Postal code must be at least 4 digits' })
    .trim(),
  country: z
    .string({ required_error: 'Country is required' })
    .min(2, { message: 'Country must be at least 2 characters' })
    .trim(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
