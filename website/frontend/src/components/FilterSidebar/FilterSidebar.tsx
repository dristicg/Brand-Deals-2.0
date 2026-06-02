'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './FilterSidebar.module.css';

const BRANDS = ['Nike', 'Adidas', 'Puma', 'Skechers', 'Reebok'];
const GENDERS = ['Men', 'Women', 'Unisex', 'Kids'];
const SORTS = [
  { value: 'newest', label: 'Newest Drops' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Customer Rating' },
];

export default function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search input state
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  // Price range state
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Keep state in sync with URL changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchTerm(searchParams.get('search') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
  }, [searchParams]);

  // Helper to update a query parameter
  const updateQuery = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Always reset page to 1 on filter change
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  // Helper to toggle multi-select checkboxes (e.g. brand, gender)
  const handleToggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const existing = params.get(key);

    if (existing) {
      const list = existing.split(',');
      if (list.includes(value)) {
        const filtered = list.filter((item) => item !== value);
        if (filtered.length > 0) {
          params.set(key, filtered.join(','));
        } else {
          params.delete(key);
        }
      } else {
        params.set(key, [...list, value].join(','));
      }
    } else {
      params.set(key, value);
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery('search', searchTerm || null);
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClearAll = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    router.push(pathname);
  };

  // Checkbox helpers
  const isBrandChecked = (brand: string) => {
    const list = searchParams.get('brand')?.split(',') || [];
    return list.includes(brand);
  };

  const isGenderChecked = (gender: string) => {
    const list = searchParams.get('gender')?.split(',') || [];
    return list.includes(gender);
  };

  return (
    <aside className={styles.sidebar} aria-label="Product filters">
      <div className={styles.titleRow}>
        <h2 className={styles.sidebarTitle}>Filters</h2>
        <button onClick={handleClearAll} className={styles.clearAllBtn} id="clear-filters-btn">
          Clear All
        </button>
      </div>

      {/* Search Filter */}
      <form onSubmit={handleSearchSubmit} className={styles.filterGroup}>
        <span className={styles.groupTitle}>Search Products</span>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Type and press Enter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
            id="filter-search-input"
          />
          <svg className={styles.searchIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </form>

      {/* Sort Filter */}
      <div className={styles.sortWrapper}>
        <label htmlFor="sort-select" className={styles.sortLabel}>Sort By</label>
        <select
          id="sort-select"
          value={searchParams.get('sort') || 'newest'}
          onChange={(e) => updateQuery('sort', e.target.value)}
          className={styles.sortSelect}
        >
          {SORTS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Brand Checkboxes */}
      <div className={styles.filterGroup}>
        <span className={styles.groupTitle}>Brand</span>
        <div className={styles.optionsList}>
          {BRANDS.map((brand) => (
            <label key={brand} className={styles.optionLabel} htmlFor={`brand-${brand}`}>
              <input
                type="checkbox"
                id={`brand-${brand}`}
                checked={isBrandChecked(brand)}
                onChange={() => handleToggle('brand', brand)}
                className={styles.checkboxInput}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Gender Checkboxes */}
      <div className={styles.filterGroup}>
        <span className={styles.groupTitle}>Category</span>
        <div className={styles.optionsList}>
          {GENDERS.map((gender) => (
            <label key={gender} className={styles.optionLabel} htmlFor={`gender-${gender}`}>
              <input
                type="checkbox"
                id={`gender-${gender}`}
                checked={isGenderChecked(gender)}
                onChange={() => handleToggle('gender', gender)}
                className={styles.checkboxInput}
              />
              {gender}
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className={styles.filterGroup}>
        <span className={styles.groupTitle}>Price Range (&#8377;)</span>
        <div className={styles.priceInputs}>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={styles.priceInput}
            aria-label="Minimum price"
          />
          <span className={styles.priceDivider}>to</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={styles.priceInput}
            aria-label="Maximum price"
          />
        </div>
        <button onClick={handlePriceApply} className={styles.applyPriceBtn} id="apply-price-btn">
          Apply Price Filter
        </button>
      </div>
    </aside>
  );
}
