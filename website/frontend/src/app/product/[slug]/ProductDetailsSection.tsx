'use client';

import { useState } from 'react';
import type { Product } from '@/types';
import SizeSelector from '@/components/SizeSelector/SizeSelector';
import styles from './page.module.css';

interface ProductDetailsSectionProps {
  product: Product;
}

export default function ProductDetailsSection({ product }: ProductDetailsSectionProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleSelectSize = (size: number | null) => {
    setSelectedSize(size);
    setAdded(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;

    setIsAdding(true);
    // Simulate API request to add to cart
    setTimeout(() => {
      setIsAdding(false);
      setAdded(true);
      // Auto-reset "Added" message after 3 seconds
      setTimeout(() => setAdded(false), 3000);
    }, 800);
  };

  const isOutOfStock = product.sizes.reduce((acc, s) => acc + s.stock, 0) === 0;

  return (
    <div className={styles.actionArea}>
      {/* Size Selector */}
      <SizeSelector sizes={product.sizes} onSelectSize={handleSelectSize} />

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
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
            Added to Cart! &#10003;
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
