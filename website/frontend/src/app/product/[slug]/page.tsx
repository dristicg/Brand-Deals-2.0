import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchProductBySlug } from '@/lib/api';
import type { Product } from '@/types';
import ProductDetailsSection from './ProductDetailsSection';
import styles from './page.module.css';

// Rich mock database to fall back on if API is not running/empty
const ALL_MOCK_PRODUCTS: Product[] = [
  {
    _id: 'mock-1',
    name: 'Nike Air Max Plus "Scarlet"',
    slug: 'nike-air-max-plus-scarlet',
    brand: 'Nike',
    category: 'Running',
    gender: 'Men',
    description: 'Experience absolute cushioning with the original iconic Air Max silhouette. Bold scarlet accents paired with deep onyx overlays define this futuristic street classic.',
    price: 14999,
    comparePrice: 18999,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 4 }, { size: 7, stock: 2 }, { size: 8, stock: 10 }, { size: 9, stock: 5 }, { size: 10, stock: 0 }],
    isActive: true,
    ratingsAverage: 4.8,
    ratingsCount: 124,
    createdAt: '2026-05-15T10:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
  },
  {
    _id: 'mock-2',
    name: 'Adidas Ultraboost 1.0 "Cloud"',
    slug: 'adidas-ultraboost-1-0-cloud',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Unisex',
    description: 'Ultimate energy return meets high-fashion aesthetics in the Cloud White colorway. Tailored Primeknit upper hugs your feet while the signature Boost midsole keeps every step incredibly cushioned.',
    price: 17999,
    comparePrice: 21999,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 0 }, { size: 7, stock: 4 }, { size: 8, stock: 3 }, { size: 9, stock: 8 }, { size: 10, stock: 12 }],
    isActive: true,
    ratingsAverage: 4.9,
    ratingsCount: 96,
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    _id: 'mock-3',
    name: 'Puma RS-X "Slate Neon"',
    slug: 'puma-rs-x-slate-neon',
    brand: 'Puma',
    category: 'Lifestyle',
    gender: 'Men',
    description: 'Futuristic chunky sneakers designed for maximum comfort and style. Featuring bold retro overlays and a massive cushioned rubber sole for an uncompromising lifestyle statement.',
    price: 8999,
    comparePrice: 11999,
    images: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 6 }, { size: 7, stock: 4 }, { size: 8, stock: 12 }, { size: 9, stock: 0 }, { size: 10, stock: 6 }],
    isActive: true,
    ratingsAverage: 4.6,
    ratingsCount: 82,
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
  },
  {
    _id: 'mock-4',
    name: 'Skechers D\'Lites "Bold Retro"',
    slug: 'skechers-dlites-bold-retro',
    brand: 'Skechers',
    category: 'Lifestyle',
    gender: 'Women',
    description: 'Retro chunky sneakers with air-cooled memory foam insoles. Classic layered silhouette provides excellent support and a timeless nostalgic look for everyday wear.',
    price: 5999,
    comparePrice: 7999,
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 8 }, { size: 7, stock: 14 }, { size: 8, stock: 0 }, { size: 9, stock: 2 }, { size: 10, stock: 0 }],
    isActive: true,
    ratingsAverage: 4.5,
    ratingsCount: 43,
    createdAt: '2026-05-05T10:00:00Z',
    updatedAt: '2026-05-05T10:00:00Z',
  },
  {
    _id: 'mock-5',
    name: 'Nike Air Force 1 "Cosmic Shadow"',
    slug: 'nike-air-force-1-cosmic-shadow',
    brand: 'Nike',
    category: 'Lifestyle',
    gender: 'Unisex',
    description: 'A timeless silhouette updated with a modern layered shadow design. Triple-white premium leather panels stacked beautifully to create subtle modern contrast.',
    price: 10999,
    comparePrice: 13999,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 2 }, { size: 7, stock: 5 }, { size: 8, stock: 6 }, { size: 9, stock: 12 }, { size: 10, stock: 4 }],
    isActive: true,
    ratingsAverage: 4.7,
    ratingsCount: 154,
    createdAt: '2026-05-18T10:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z',
  },
  {
    _id: 'mock-6',
    name: 'Adidas NMD_R1 "Night Tech"',
    slug: 'adidas-nmd-r1-night-tech',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Men',
    description: 'Streamlined design meets responsive Boost midsoles for urban explorers. Stealthy black Primeknit silhouette contrasted by neon EVA midsole plugs.',
    price: 12999,
    comparePrice: 15999,
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 7, stock: 4 }, { size: 8, stock: 11 }, { size: 9, stock: 7 }, { size: 10, stock: 2 }],
    isActive: true,
    ratingsAverage: 4.4,
    ratingsCount: 65,
    createdAt: '2026-05-12T10:00:00Z',
    updatedAt: '2026-05-12T10:00:00Z',
  },
  {
    _id: 'mock-7',
    name: 'Reebok Nano X4 "Elite Trainer"',
    slug: 'reebok-nano-x4-elite-trainer',
    brand: 'Reebok',
    category: 'Training',
    gender: 'Men',
    description: 'Designed for cross-functional training, lifting, and absolute stability. Highly breathable Flexweave knit upper locks down your midfoot for high-intensity gym sessions.',
    price: 11999,
    comparePrice: 14999,
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 7, stock: 0 }, { size: 8, stock: 4 }, { size: 9, stock: 8 }, { size: 10, stock: 5 }],
    isActive: true,
    ratingsAverage: 4.8,
    ratingsCount: 38,
    createdAt: '2026-05-22T10:00:00Z',
    updatedAt: '2026-05-22T10:00:00Z',
  },
  {
    _id: 'mock-8',
    name: 'Puma Kids Smash v2 "Active"',
    slug: 'puma-kids-smash-v2-active',
    brand: 'Puma',
    category: 'Lifestyle',
    gender: 'Kids',
    description: 'Classic court shoe silhouette scaled down with easy hook-and-loop straps. Soft suede leather upper protects young feet while providing maximum grip for playful days.',
    price: 3499,
    comparePrice: 4499,
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 6, stock: 12 }, { size: 7, stock: 10 }, { size: 8, stock: 0 }],
    isActive: true,
    ratingsAverage: 4.3,
    ratingsCount: 22,
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
  },
];

// Server helper to fetch product from API or fallback
async function getProductData(slug: string): Promise<Product | null> {
  const apiRes = await fetchProductBySlug(slug);
  if (apiRes && apiRes.success) {
    return apiRes.data.product;
  }
  // Fallback to local mock array
  return ALL_MOCK_PRODUCTS.find((p) => p.slug === slug) || null;
}

type Props = {
  params: Promise<{ slug: string }>;
};

// 100% dynamic SEO metadata generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) {
    return {
      title: 'Product Not Found | Brand Deals',
    };
  }

  return {
    title: `${product.name} | ${product.brand}`,
    description: product.description,
    openGraph: {
      title: `${product.name} | ${product.brand} - Brand Deals`,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = await getProductData(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const hasDiscount = product.comparePrice && product.comparePrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  // Mock Reviews
  const mockReviews = [
    {
      id: 1,
      user: 'Aradhya S.',
      rating: 5,
      date: 'May 24, 2026',
      comment: 'Super fast delivery in Mumbai! 100% original product, checked the bar-codes. Very comfy for daily wear!',
    },
    {
      id: 2,
      user: 'Karan J.',
      rating: 4,
      date: 'May 18, 2026',
      comment: 'Great shoes! Cushioning is amazing. Fitted perfectly. Giving 4 stars only because box was slightly compressed during transit.',
    },
  ];

  return (
    <div className="container">
      <div className={styles.wrapper}>
        {/* Back Link */}
        <Link href="/collections" className={styles.backLink} id="back-to-catalog-btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to Collections
        </Link>

        {/* Dynamic Details Grid */}
        <div className={styles.layout}>
          {/* Left: Image Showcase */}
          <div className={styles.imageCard}>
            <Image
              src={product.images[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'}
              alt={product.name}
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              className={styles.image}
              priority
            />
            {hasDiscount && (
              <span className={`${styles.discountTag} badge badge--danger`}>
                {discountPct}% OFF
              </span>
            )}
          </div>

          {/* Right: Metadata & Interaction */}
          <div className={styles.details}>
            <span className={styles.brandLabel}>{product.brand}</span>
            <h1 className={styles.productName}>{product.name}</h1>
            <span className={styles.categoryGender}>
              {product.category} &bull; {product.gender}
            </span>

            {/* Ratings */}
            <div className={styles.ratingRow}>
              <span className={styles.stars}>&#9733;&#9733;&#9733;&#9733;&#9733;</span>
              <span className={styles.ratingText}>{product.ratingsAverage.toFixed(1)}</span>
              <span className={styles.reviewCount}>({product.ratingsCount} customer reviews)</span>
            </div>

            {/* Prices */}
            <div className={styles.priceBlock}>
              <span className={styles.currentPrice}>
                &#8377;{product.price.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <span className={styles.comparePrice}>
                  &#8377;{product.comparePrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Description */}
            <p className={styles.descriptionBox}>{product.description}</p>

            {/* Dynamic Client Actions */}
            <ProductDetailsSection product={product} />

            {/* Guarantee badging */}
            <div className={styles.guarantees}>
              <div className={styles.guaranteeItem}>
                <svg className={styles.guaranteeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className={styles.guaranteeText}>100% Original</span>
              </div>
              <div className={styles.guaranteeItem}>
                <svg className={styles.guaranteeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className={styles.guaranteeText}>Cash on Delivery</span>
              </div>
              <div className={styles.guaranteeItem}>
                <svg className={styles.guaranteeIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                </svg>
                <span className={styles.guaranteeText}>Easy 10D Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className={styles.reviewsSection} aria-label="Customer Reviews">
          <h2 className={styles.reviewsHeader}>Customer Reviews</h2>
          <div className={styles.reviewsGrid}>
            {mockReviews.map((rev) => (
              <div key={rev.id} className={styles.reviewCard}>
                <div className={styles.reviewUserRow}>
                  <span className={styles.reviewUser}>{rev.user}</span>
                  <span className={styles.reviewDate}>{rev.date}</span>
                </div>
                <div style={{ color: 'var(--color-warning)', fontSize: '14px' }}>
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                </div>
                <p className={styles.reviewText}>{rev.comment}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
