import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.cardLink}>
        {/* Image Container */}
        <div className={styles.imageContainer}>
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={styles.image}
            priority={false}
          />
          {hasDiscount && (
            <span className={`${styles.discountBadge} badge badge--danger`}>
              {discountPct}% OFF
            </span>
          )}
          <span className={`${styles.brandBadge} badge`}>
            {product.brand}
          </span>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <span className={styles.category}>
            {product.category} &bull; {product.gender}
          </span>
          <h3 className={styles.title}>
            {product.name}
          </h3>

          {/* Rating */}
          <div className={styles.rating}>
            <span className={styles.star}>&#9733;</span>
            <span className={styles.ratingValue}>{product.ratingsAverage.toFixed(1)}</span>
            <span className={styles.ratingCount}>({product.ratingsCount})</span>
          </div>

          {/* Footer with Price and Button */}
          <div className={styles.footer}>
            <div className={styles.priceContainer}>
              {hasDiscount && (
                <span className={styles.comparePrice}>
                  &#8377;{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className={styles.price}>
                &#8377;{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            <div className={styles.actionIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '18px', height: '18px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
