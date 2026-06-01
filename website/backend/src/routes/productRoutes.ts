import { Router } from 'express';
import { protect, admin } from '../middleware/authMiddleware';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductBySlug,
  getProductById,
} from '../controllers/productController';

const router = Router();

// Public catalog routes
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Admin-only product management routes
router.get('/admin/:id', protect, admin, getProductById);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;

