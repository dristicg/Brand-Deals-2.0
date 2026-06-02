import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchWishlist } from '@/lib/api';
import type { Product } from '@/types';
import WishlistContainer from './WishlistContainer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'My Wishlist | Brand Deals',
  description: 'Your favorite genuine branded sneakers saved in one secure place.',
};

// Fallback high-fidelity wishlist items if database is empty/offline
const FALLBACK_WISHLIST_PRODUCTS: Product[] = [
  {
    _id: 'mock-1',
    name: 'Nike Air Max Plus "Scarlet"',
    slug: 'nike-air-max-plus-scarlet',
    brand: 'Nike',
    category: 'Running',
    gender: 'Men',
    description: 'Experience absolute cushioning with the original iconic Air Max silhouette.',
    price: 14999,
    comparePrice: 18999,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 8, stock: 10 }, { size: 9, stock: 5 }],
    isActive: true,
    ratingsAverage: 4.8,
    ratingsCount: 124,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-2',
    name: 'Adidas Ultraboost 1.0 "Cloud"',
    slug: 'adidas-ultraboost-1-0-cloud',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Unisex',
    description: 'Ultimate energy return meets high-fashion aesthetics in the Cloud White colorway.',
    price: 17999,
    comparePrice: 21999,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 7, stock: 4 }, { size: 9, stock: 8 }],
    isActive: true,
    ratingsAverage: 4.9,
    ratingsCount: 96,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let initialProducts: Product[] = [];

  if (token) {
    const res = await fetchWishlist(token);
    if (res && res.success && res.data.wishlist.products.length > 0) {
      initialProducts = res.data.wishlist.products;
    } else {
      // User is logged in but has no wishlist products in database, let's keep empty so they can build it
      initialProducts = [];
    }
  } else {
    // Guest view / API offline fallback
    initialProducts = FALLBACK_WISHLIST_PRODUCTS;
  }

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>My Wishlist</h1>
          <p className={styles.subtitle}>Keep track of original sneakers you absolutely love</p>
        </header>

        {/* Dynamic Client Actions */}
        <WishlistContainer initialProducts={initialProducts} />
      </div>
    </div>
  );
}
