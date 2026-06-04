'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './page.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      <h1 className={styles.title}>Payment Successful!</h1>
      <p className={styles.subtitle}>Thank you for your purchase. Your order has been placed.</p>
      
      {orderNumber && (
        <div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Order Number:</p>
          <div className={styles.orderNumber}>{orderNumber}</div>
        </div>
      )}

      <div className={styles.actions}>
        <Link href="/orders" className={`${styles.btn} ${styles.btnPrimary}`}>
          View Orders
        </Link>
        <Link href="/collections" className={`${styles.btn} ${styles.btnSecondary}`}>
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '100px', color: '#fff' }}>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
