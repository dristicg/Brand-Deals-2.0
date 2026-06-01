'use client';

import { useState } from 'react';
import type { Size } from '@/types';
import styles from './SizeSelector.module.css';

interface SizeSelectorProps {
  sizes: Size[];
  onSelectSize: (size: number | null) => void;
}

export default function SizeSelector({ sizes, onSelectSize }: SizeSelectorProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const handleSelect = (sizeNum: number) => {
    const newVal = selectedSize === sizeNum ? null : sizeNum;
    setSelectedSize(newVal);
    onSelectSize(newVal);
  };

  const getStockForSize = (sizeNum: number) => {
    return sizes.find((s) => s.size === sizeNum)?.stock || 0;
  };

  // Standard sizes to display (UK/India shoe sizes 6 to 10)
  const ALL_SIZES = [6, 7, 8, 9, 10];

  const selectedStock = selectedSize ? getStockForSize(selectedSize) : null;

  return (
    <div className={styles.container}>
      <div className={styles.labelRow}>
        <span className={styles.label}>
          Select Size (UK):{' '}
          {selectedSize && (
            <span className={styles.selectedVal}>{selectedSize}</span>
          )}
        </span>
      </div>

      <div className={styles.grid}>
        {ALL_SIZES.map((sizeNum) => {
          const stock = getStockForSize(sizeNum);
          const isOutOfStock = stock <= 0;

          return (
            <button
              key={sizeNum}
              type="button"
              disabled={isOutOfStock}
              onClick={() => handleSelect(sizeNum)}
              className={`${styles.sizeBtn} ${
                selectedSize === sizeNum ? styles.sizeBtnActive : ''
              }`}
              aria-label={`Size UK ${sizeNum}`}
            >
              {sizeNum}
            </button>
          );
        })}
      </div>

      <div className={styles.stockIndicator}>
        {selectedSize !== null && selectedStock !== null && (
          selectedStock <= 3 ? (
            <span className={styles.stockLow}>Only {selectedStock} pairs left in stock!</span>
          ) : (
            <span>In Stock ({selectedStock} available)</span>
          )
        )}
      </div>
    </div>
  );
}
