import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchCart } from '@/lib/api';
import type { CartItem } from '@/types';
import CartContainer from './CartContainer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Shopping Cart | Brand Deals',
  description: 'Review your selection of premium original branded shoes before secure checkout.',
};

// Fallback high-fidelity cart items if database is empty/offline
const FALLBACK_CART_ITEMS: CartItem[] = [
  {
    _id: 'cart-item-1',
    product: {
      _id: '65e8a712f5a65c92c8123451',
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
    size: 8,
    quantity: 1,
  },
  {
    _id: 'cart-item-2',
    product: {
      _id: '65e8a712f5a65c92c8123452',
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
    size: 9,
    quantity: 2,
  },
];

export default async function CartPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let initialItems: CartItem[] = [];

  if (token) {
    const res = await fetchCart(token);
    if (res && res.success && res.data.cart.items.length > 0) {
      initialItems = res.data.cart.items;
    } else {
      // User is logged in but has no cart products in database, let's keep empty so they can build it
      initialItems = [];
    }
  } else {
    // Guest view / API offline fallback
    initialItems = FALLBACK_CART_ITEMS;
  }

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <p className={styles.subtitle}>Review your premium sneaker choices before secure checkout</p>
        </header>

        {/* Dynamic Client Actions */}
        <CartContainer initialItems={initialItems} />
      </div>
    </div>
  );
}
