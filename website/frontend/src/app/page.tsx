import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard';
import styles from './page.module.css';

// Stunning fallback products if the backend returns no results
const MOCK_PRODUCTS: Product[] = [
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
  {
    _id: 'mock-3',
    name: 'Puma RS-X "Slate Neon"',
    slug: 'puma-rs-x-slate-neon',
    brand: 'Puma',
    category: 'Lifestyle',
    gender: 'Men',
    description: 'Futuristic chunky sneakers designed for maximum comfort and style.',
    price: 8999,
    comparePrice: 11999,
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 8, stock: 12 }, { size: 10, stock: 6 }],
    isActive: true,
    ratingsAverage: 4.6,
    ratingsCount: 82,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mock-4',
    name: 'Skechers D\'Lites "Bold Retro"',
    slug: 'skechers-dlites-bold-retro',
    brand: 'Skechers',
    category: 'Lifestyle',
    gender: 'Women',
    description: 'Retro chunky sneakers with air-cooled memory foam insoles.',
    price: 5999,
    comparePrice: 7999,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 8 }, { size: 7, stock: 14 }],
    isActive: true,
    ratingsAverage: 4.5,
    ratingsCount: 43,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default async function Home() {
  const response = await fetchProducts({ limit: '4' });
  const products = response.success && response.data.products.length > 0
    ? response.data.products
    : MOCK_PRODUCTS;

  return (
    <div className="container">
      {/* Hero Section */}
      <section className={styles.hero} id="hero-section">
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <span className={`${styles.heroBadge} badge`}>100% Genuine Branded Shoes</span>
          <h1 className={styles.heroTitle}>
            Step Into <span className={styles.heroTitleAccent}>Pure Authenticity</span>
          </h1>
          <p className={styles.heroDesc}>
            Discover genuine premium sneakers from Nike, Adidas, Puma, Skechers, and Reebok.
            Unbeatable prices, fast shipping, and easy returns across India.
          </p>
          <div className={styles.heroActions}>
            <Link href="/collections" className={styles.primaryBtn} id="hero-cta-primary">
              Explore Collections
            </Link>
            <Link href="/collections?sort=newest" className={styles.secondaryBtn} id="hero-cta-secondary">
              View Latest Drops
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Showcase Strip */}
      <section className={styles.brandStripSection} aria-label="Featured Brands">
        <div className={styles.brandStripGrid}>
          <Link href="/collections?brand=Nike" className={styles.brandLogo} id="brand-logo-nike">NIKE</Link>
          <Link href="/collections?brand=Adidas" className={styles.brandLogo} id="brand-logo-adidas">ADIDAS</Link>
          <Link href="/collections?brand=Puma" className={styles.brandLogo} id="brand-logo-puma">PUMA</Link>
          <Link href="/collections?brand=Skechers" className={styles.brandLogo} id="brand-logo-skechers">SKECHERS</Link>
          <Link href="/collections?brand=Reebok" className={styles.brandLogo} id="brand-logo-reebok">REEBOK</Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={styles.section} id="featured-products">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTitleGroup}>
            <h2 className={styles.sectionTitle}>Featured Drops</h2>
            <p className={styles.sectionSubtitle}>Handpicked absolute premium styles chosen for you</p>
          </div>
          <Link href="/collections" className={styles.viewAllLink} id="view-all-featured">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        <div className={styles.productsGrid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
