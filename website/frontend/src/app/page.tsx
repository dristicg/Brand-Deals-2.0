import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/types';
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
          {products.map((product) => {
            const hasDiscount = product.comparePrice && product.comparePrice > product.price;
            const discountPct = hasDiscount
              ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
              : 0;

            return (
              <div key={product._id} className="glass-card" style={{ padding: 'var(--space-md)', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}>
                <Link href={`/product/${product.slug}`} style={{ display: 'flex', flexDirection: 'column', height: '100%', color: 'inherit' }}>
                  {/* Image Container */}
                  <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--color-bg-secondary)', marginBottom: 'var(--space-md)' }}>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      style={{ objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
                    />
                    {hasDiscount && (
                      <span className="badge badge--danger" style={{ position: 'absolute', top: 'var(--space-sm)', right: 'var(--space-sm)', zIndex: 2 }}>
                        {discountPct}% OFF
                      </span>
                    )}
                    <span className="badge" style={{ position: 'absolute', bottom: 'var(--space-sm)', left: 'var(--space-sm)', zIndex: 2, background: 'rgba(0,0,0,0.6)', border: '1px solid var(--color-border)', fontSize: '10px' }}>
                      {product.brand}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 'var(--space-xs)' }}>
                      {product.category} &bull; {product.gender}
                    </span>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: '0 0 var(--space-sm) 0', color: 'var(--color-text-primary)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4em', lineHeight: '1.2em' }}>
                      {product.name}
                    </h3>

                    {/* Ratings */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
                      <span style={{ color: 'var(--color-warning)', fontSize: '14px' }}>&#9733;</span>
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{product.ratingsAverage.toFixed(1)}</span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>({product.ratingsCount})</span>
                    </div>

                    {/* Pricing & CTA */}
                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {hasDiscount && (
                          <span style={{ fontSize: 'var(--text-xs)', textDecoration: 'line-through', color: 'var(--color-text-muted)' }}>
                            &#8377;{product.comparePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span style={{ fontSize: 'var(--text-lg)', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                          &#8377;{product.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--transition-fast)' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" style={{ width: '18px', height: '18px', margin: 'auto' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
