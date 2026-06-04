'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchMyOrders } from '@/lib/api';
import type { Order } from '@/types';
import styles from './page.module.css';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetchMyOrders();
        if (res?.success && res.data.orders) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOrders();
  }, []);

  if (isLoading) {
    return <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>Loading orders...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <Link href="/profile" style={{ color: 'var(--color-text-secondary)', textDecoration: 'underline' }}>
          Back to Profile
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>You haven't placed any orders yet.</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
            When you purchase items, they will appear here.
          </p>
          <Link href="/collections" className={styles.viewBtn}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => {
            const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'short', day: 'numeric'
            });
            
            return (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderNumber}>#{order.orderNumber}</span>
                    <span className={styles.orderDate}>Placed on {date}</span>
                  </div>
                  <div className={`${styles.orderStatus} ${styles[`status-${order.orderStatus}`]}`}>
                    {order.orderStatus}
                  </div>
                </div>

                <div className={styles.orderBody}>
                  <div className={styles.itemImages}>
                    {order.items.slice(0, 3).map((item, idx) => (
                      <img 
                        key={idx}
                        src={item.product.images[0] || 'https://via.placeholder.com/60'} 
                        alt={item.product.name} 
                        className={styles.itemImage}
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className={styles.moreItems}>
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className={styles.orderActions}>
                    <span className={styles.orderTotal}>₹{order.totalAmount}</span>
                    <Link href={`/orders/${order._id}`} className={styles.viewBtn}>
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
