'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { CartItem } from '@/types';
import { updateCartItem, removeFromCart } from '@/lib/api';
import styles from './page.module.css';

interface CartContainerProps {
  initialItems: CartItem[];
}

export default function CartContainer({ initialItems }: CartContainerProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const handleQtyChange = async (itemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1 || updatingItemId) return;

    setUpdatingItemId(itemId);

    // Call API
    const res = await updateCartItem(itemId, newQty);

    // Update locally immediately for responsiveness
    setItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: newQty } : item
      )
    );
    
    setUpdatingItemId(null);
  };

  const handleRemove = async (itemId: string) => {
    if (updatingItemId) return;
    setUpdatingItemId(itemId);

    await removeFromCart(itemId);

    // Update locally
    setItems((prev) => prev.filter((item) => item._id !== itemId));
    setUpdatingItemId(null);
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const originalSubtotal = items.reduce((acc, item) => acc + (item.product.comparePrice || item.product.price) * item.quantity, 0);
  const discountTotal = originalSubtotal - subtotal;

  // Free shipping above 5000 INR, otherwise 150 INR
  const shipping = subtotal > 5000 || subtotal === 0 ? 0 : 150;
  // Estimate GST at 18% (included in item prices but displayed as breakdown for trust)
  const estimatedTax = Math.round((subtotal * 0.18) / 1.18);
  const finalTotal = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className={styles.empty} id="empty-cart-panel">
        <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className={styles.emptyTitle}>Your Cart is Empty</h2>
        <p className={styles.emptyDesc}>
          You haven't added any premium original sneakers to your cart yet. Let's find your perfect fit!
        </p>
        <Link href="/collections" className={styles.shopBtn} id="cart-start-shopping">
          Explore Shoes
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Items List */}
      <div className={styles.itemsList}>
        {items.map((item) => {
          const product = item.product;
          const hasComparePrice = product.comparePrice && product.comparePrice > product.price;

          return (
            <div key={item._id} className={`${styles.cartItemCard} glass-card`}>
              {/* Product Image */}
              <div className={styles.itemImage}>
                <Image
                  src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
                  alt={product.name}
                  fill
                  sizes="100px"
                />
              </div>

              {/* Product Specifications */}
              <div className={styles.itemDetails}>
                <div className={styles.itemHeader}>
                  <span className={styles.itemBrand}>{product.brand}</span>
                  <Link href={`/product/${product.slug}`} className={styles.itemName}>
                    {product.name}
                  </Link>
                  <span className={styles.itemSpecs}>
                    Size: UK {item.size} &bull; Category: {product.category}
                  </span>
                </div>

                {/* Quantity Buttons */}
                <div className={styles.qtyRow}>
                  <button
                    onClick={() => handleQtyChange(item._id, item.quantity, -1)}
                    disabled={item.quantity <= 1 || updatingItemId === item._id}
                    className={styles.qtyBtn}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className={styles.qtyVal}>{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item._id, item.quantity, 1)}
                    disabled={updatingItemId === item._id}
                    className={styles.qtyBtn}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Meta & Actions */}
              <div className={styles.itemMeta}>
                <div className={styles.priceBlock}>
                  {hasComparePrice && (
                    <span className={styles.comparePrice}>
                      &#8377;{((product.comparePrice || 0) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className={styles.price}>
                    &#8377;{(product.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item._id)}
                  disabled={updatingItemId === item._id}
                  className={styles.deleteBtn}
                  title="Remove item"
                  aria-label={`Remove ${product.name} from cart`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <aside className={`${styles.summaryCard} glass-card`}>
        <h3 className={styles.summaryTitle}>Order Summary</h3>

        <div className={styles.summaryRows}>
          <div className={styles.summaryRow}>
            <span>Original Price</span>
            <span>&#8377;{originalSubtotal.toLocaleString('en-IN')}</span>
          </div>

          {discountTotal > 0 && (
            <div className={styles.summaryRow} style={{ color: 'var(--color-success)' }}>
              <span>Store Savings</span>
              <span>- &#8377;{discountTotal.toLocaleString('en-IN')}</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span>Estimated Shipping</span>
            <span>{shipping === 0 ? 'FREE' : `₹${shipping.toLocaleString('en-IN')}`}</span>
          </div>

          <div className={styles.summaryRow}>
            <span>Estimated GST (18%)</span>
            <span>&#8377;{estimatedTax.toLocaleString('en-IN')}</span>
          </div>

          <div className={styles.summaryRowTotal}>
            <span>Order Total</span>
            <span>&#8377;{finalTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Promo Code Input */}
        <div className={styles.promoWrapper}>
          <input
            type="text"
            placeholder="Promo Code (e.g. DEALS20)"
            className={styles.promoInput}
            aria-label="Promo code input"
          />
          <button className={styles.promoBtn}>Apply</button>
        </div>

        <Link href="/checkout" className={styles.checkoutBtn} id="checkout-cta-btn">
          Proceed to Secure Checkout
        </Link>
      </aside>
    </div>
  );
}
