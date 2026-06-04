'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchOrderById, cancelOrder } from '@/lib/api';
import type { Order } from '@/types';
import styles from './page.module.css';

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadOrder() {
      if (!orderId) return;
      try {
        const res = await fetchOrderById(orderId);
        if (res?.success && res.data.order) {
          setOrder(res.data.order);
        } else {
          setError('Order not found');
        }
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setIsLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setIsCancelling(true);
    try {
      const res = await cancelOrder(orderId);
      if (res?.success) {
        setOrder(res.data.order);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2>{error || 'Order not found'}</h2>
        <Link href="/orders" style={{ color: 'var(--color-primary)', marginTop: '1rem', display: 'block' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  const date = new Date(order.createdAt).toLocaleString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const canCancel = ['pending', 'confirmed'].includes(order.orderStatus);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/orders" className={styles.backLink}>
          ← Back to Orders
        </Link>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Order #{order.orderNumber}</h1>
          <div className={`${styles.orderStatus} ${styles[`status-${order.orderStatus}`]}`}>
            {order.orderStatus}
          </div>
        </div>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Placed on {date}</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Items in this Order</h2>
            <div className={styles.itemList}>
              {order.items.map((item) => (
                <div key={item._id} className={styles.item}>
                  <img 
                    src={item.product?.images?.[0] || 'https://via.placeholder.com/80'} 
                    alt={item.product?.name || 'Product'} 
                    className={styles.itemImage} 
                  />
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>{item.product?.name || 'Unknown Product'}</span>
                    <span className={styles.itemMeta}>Size: {item.size} | Qty: {item.quantity}</span>
                    <span className={styles.itemPrice}>₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Items Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
            
            {canCancel && (
              <button 
                className={styles.cancelBtn} 
                onClick={handleCancel}
                disabled={isCancelling}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <div className={styles.infoValue}>
              {order.shippingAddress.street}<br/>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br/>
              {order.shippingAddress.country}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Payment Details</h2>
            <div className={styles.infoBlock}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>
                {order.paymentDetails.status}
              </span>
            </div>
            {order.paymentDetails.razorpayPaymentId && (
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>Transaction ID</span>
                <span className={styles.infoValue}>{order.paymentDetails.razorpayPaymentId}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
