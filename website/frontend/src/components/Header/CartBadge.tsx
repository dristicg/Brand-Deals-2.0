'use client';

import { useState, useEffect } from 'react';
import styles from './Header.module.css';

interface CartBadgeProps {
  initialCount: number;
}

export default function CartBadge({ initialCount }: CartBadgeProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.count === 'number') {
        setCount(customEvent.detail.count);
      }
    };
    window.addEventListener('cart-update', handleUpdate);
    return () => window.removeEventListener('cart-update', handleUpdate);
  }, []);

  if (count <= 0) return null;

  return <span className={styles.badge} id="header-cart-badge">{count}</span>;
}
