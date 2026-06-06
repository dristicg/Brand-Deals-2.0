'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import { addToCart } from '@/lib/api';
import styles from './page.module.css';

interface ProductDetailsSectionProps {
  product: Product;
}

export default function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState('');

  const handleSelectSize = (size: number | null) => {
    setSelectedSize(size);
    setAdded(false);
    setError('');
  };

  const handleAddToCart = async () => {
    if (!selectedSize) return;

    setIsAdding(true);
    setError('');
    
    try {
      const res = await addToCart(product._id, selectedSize, 1);
      if (res && res.success) {
        setAdded(true);
        // Calculate total items in cart
        const totalItems = res.data.cart.items.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(totalItems);
        window.dispatchEvent(new CustomEvent('cart-update', { detail: { count: totalItems } }));
        
        // Auto-reset "Added" message after 4 seconds
        setTimeout(() => setAdded(false), 4000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to add to cart. Are you logged in?');
    } finally {
      setIsAdding(false);
    }
  };

  const isOutOfStock = product.sizes.reduce((acc, s) => acc + s.stock, 0) === 0;

  return (
    <div className={styles.actionArea}>
      {/* Size Selector */}
      <SizeSelector sizes={product.sizes} onSelectSize={handleSelectSize} />

      {error && <div style={{ color: 'var(--color-danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

      {/* Interactive Add To Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={selectedSize === null || isAdding || isOutOfStock}
        className={styles.addToCartBtn}
        id="add-to-cart-cta"
      >
        {isOutOfStock ? (
          'Out of Stock'
        ) : isAdding ? (
          <span>Adding to Cart...</span>
        ) : added ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-xs)' }}>
            Added to Cart! &#10003; ({cartCount} item{cartCount !== 1 ? 's' : ''} in cart)
          </span>
        ) : selectedSize === null ? (
          'Select a Size to Add'
        ) : (
          `Add Size UK ${selectedSize} to Cart`
        )}
      </button>
    </div>
  );
}
