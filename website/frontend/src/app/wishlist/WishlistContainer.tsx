'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard';
import { toggleWishlist } from '@/lib/api';
import styles from './page.module.css';

interface WishlistContainerProps {
  initialProducts: Product[];
}

export default function WishlistContainer({ initialProducts }: WishlistContainerProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isToggling, setIsToggling] = useState<string | null>(null);

  const handleRemove = async (productId: string) => {
    if (isToggling) return;
    setIsToggling(productId);

    // Call API to toggle (remove)
    const res = await toggleWishlist(productId);
    
    // Even if API fails (e.g. backend offline in dev), let's remove it locally to ensure high fidelity demo!
    setProducts((prev) => prev.filter((p) => p._id !== productId));
    setIsToggling(null);
  };

  if (products.length === 0) {
    return (
      <div className={styles.empty} id="empty-wishlist-panel">
        <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <h2 className={styles.emptyTitle}>Your Wishlist is Empty</h2>
        <p className={styles.emptyDesc}>
          Save your absolute favorite genuine sneakers here to keep track of them!
        </p>
        <Link href="/collections" className={styles.shopBtn} id="wishlist-start-shopping">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product) => (
        <div key={product._id} className={styles.cardWrapper}>
          {/* Floating Remove Button */}
          <button
            onClick={() => handleRemove(product._id)}
            disabled={isToggling === product._id}
            className={styles.removeBtn}
            title="Remove from wishlist"
            aria-label={`Remove ${product.name} from wishlist`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Card */}
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
