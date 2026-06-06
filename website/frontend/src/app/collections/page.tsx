import Link from 'next/link';
import { fetchProducts } from '@/lib/api';
import type { Product, ProductQueryParams } from '@/types';
import ProductCard from '@/components/ProductCard/ProductCard';
import FilterSidebar from '@/components/FilterSidebar/FilterSidebar';
import styles from './page.module.css';

// Rich set of fallback products for high-fidelity catalog filtering
const ALL_MOCK_PRODUCTS: Product[] = [
  {
    _id: '65e8a712f5a65c92c8123451',
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
    createdAt: '2026-05-15T10:00:00Z',
    updatedAt: '2026-05-15T10:00:00Z',
  },
  {
    _id: '65e8a712f5a65c92c8123452',
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
    createdAt: '2026-05-20T10:00:00Z',
    updatedAt: '2026-05-20T10:00:00Z',
  },
  {
    _id: '65e8a712f5a65c92c8123453',
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
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-05-10T10:00:00Z',
  },
  {
    _id: '65e8a712f5a65c92c8123454',
    name: "Skechers D'Lites \"Bold Retro\"",
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
    createdAt: '2026-05-05T10:00:00Z',
    updatedAt: '2026-05-05T10:00:00Z',
  },
  {
    _id: '65e8a712f5a65c92c8123455',
    name: 'Nike Air Force 1 "Cosmic Shadow"',
    slug: 'nike-air-force-1-cosmic-shadow',
    brand: 'Nike',
    category: 'Lifestyle',
    gender: 'Unisex',
    description: 'A timeless silhouette updated with a modern layered shadow design.',
    price: 10999,
    comparePrice: 13999,
    images: ['https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 8, stock: 6 }, { size: 10, stock: 4 }],
    isActive: true,
    ratingsAverage: 4.7,
    ratingsCount: 154,
    createdAt: '2026-05-18T10:00:00Z',
    updatedAt: '2026-05-18T10:00:00Z',
  },
  {
    _id: '65e8a712f5a65c92c8123456',
    name: 'Adidas NMD_R1 "Night Tech"',
    slug: 'adidas-nmd-r1-night-tech',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Men',
    description: 'Streamlined design meets responsive Boost midsoles for urban explorers.',
    price: 12999,
    comparePrice: 15999,
    images: ['https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 8, stock: 11 }, { size: 9, stock: 7 }],
    isActive: true,
    ratingsAverage: 4.4,
    ratingsCount: 65,
    createdAt: '2026-05-12T10:00:00Z',
    updatedAt: '2026-05-12T10:00:00Z',
  },
  {
    _id: '65e8a712f5a65c92c8123457',
    name: 'Reebok Nano X4 "Elite Trainer"',
    slug: 'reebok-nano-x4-elite-trainer',
    brand: 'Reebok',
    category: 'Training',
    gender: 'Men',
    description: 'Designed for cross-functional training, lifting, and absolute stability.',
    price: 11999,
    comparePrice: 14999,
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 9, stock: 8 }, { size: 10, stock: 5 }],
    isActive: true,
    ratingsAverage: 4.8,
    ratingsCount: 38,
    createdAt: '2026-05-22T10:00:00Z',
    updatedAt: '2026-05-22T10:00:00Z',
  },
  {
    _id: '65e8a712f5a65c92c8123458',
    name: 'Puma Kids Smash v2 "Active"',
    slug: 'puma-kids-smash-v2-active',
    brand: 'Puma',
    category: 'Lifestyle',
    gender: 'Kids',
    description: 'Classic court shoe silhouette scaled down with easy hook-and-loop straps.',
    price: 3499,
    comparePrice: 4499,
    images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80'],
    sizes: [{ size: 2, stock: 12 }, { size: 3, stock: 10 }],
    isActive: true,
    ratingsAverage: 4.3,
    ratingsCount: 22,
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z',
  },
];

// Helper to filter mock products locally on the server if database has no entries
function filterMockProducts(params: ProductQueryParams): { products: Product[]; total: number } {
  let filtered = [...ALL_MOCK_PRODUCTS];

  // Search Filter
  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // Brand Filter
  if (params.brand) {
    const brands = params.brand.toLowerCase().split(',');
    filtered = filtered.filter((p) => brands.includes(p.brand.toLowerCase()));
  }

  // Gender/Category Filter
  if (params.gender) {
    const genders = params.gender.toLowerCase().split(',');
    filtered = filtered.filter((p) => genders.includes(p.gender.toLowerCase()));
  }

  // Price Filters
  if (params.minPrice) {
    const min = parseFloat(params.minPrice);
    if (!isNaN(min)) {
      filtered = filtered.filter((p) => p.price >= min);
    }
  }

  if (params.maxPrice) {
    const max = parseFloat(params.maxPrice);
    if (!isNaN(max)) {
      filtered = filtered.filter((p) => p.price <= max);
    }
  }

  // Sort Filter
  const sort = params.sort || 'newest';
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'popular') {
    filtered.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
  } else {
    // newest
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = filtered.length;

  // Pagination (limit = 6 for listing page)
  const page = parseInt(params.page || '1', 10);
  const limit = parseInt(params.limit || '6', 10);
  const skip = (page - 1) * limit;
  filtered = filtered.slice(skip, skip + limit);

  return { products: filtered, total };
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CollectionsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  // Transform SearchParams to standard ProductQueryParams
  const params: ProductQueryParams = {
    search: typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined,
    brand: typeof resolvedParams.brand === 'string' ? resolvedParams.brand : undefined,
    category: typeof resolvedParams.category === 'string' ? resolvedParams.category : undefined,
    gender: typeof resolvedParams.gender === 'string' ? resolvedParams.gender : undefined,
    minPrice: typeof resolvedParams.minPrice === 'string' ? resolvedParams.minPrice : undefined,
    maxPrice: typeof resolvedParams.maxPrice === 'string' ? resolvedParams.maxPrice : undefined,
    sort: typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as ProductQueryParams['sort']) : undefined,
    page: typeof resolvedParams.page === 'string' ? resolvedParams.page : '1',
    limit: '6',
  };

  // Fetch from backend
  const apiRes = await fetchProducts(params);

  // Use API products if successful and count > 0, otherwise fall back to local high-fidelity filters
  const useFallback = !apiRes.success || apiRes.total === 0;
  const { products, total } = useFallback
    ? filterMockProducts(params)
    : { products: apiRes.data.products, total: apiRes.total };

  const currentPage = parseInt(params.page || '1', 10);
  const limit = 6;
  const totalPages = Math.ceil(total / limit);

  // Pagination helper to create full URL search strings
  const getPaginationUrl = (pageNum: number) => {
    const nextParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        nextParams.set(key, value);
      }
    });
    nextParams.set('page', pageNum.toString());
    return `/collections?${nextParams.toString()}`;
  };

  return (
    <div className="container">
      <div className={styles.wrapper}>
        {/* Header */}
        <header className={styles.pageHeader}>
          <h1 className={styles.title}>All Shoes</h1>
          <p className={styles.subtitle}>Browse through our curation of 100% original sneakers</p>
        </header>

        {/* Content Layout */}
        <div className={styles.layout}>
          {/* Sidebar Filters */}
          <div className={styles.sidebarColumn}>
            <FilterSidebar />
          </div>

          {/* Product Results */}
          <div className={styles.productsColumn}>
            <div className={styles.resultsHeader}>
              <span className={styles.countText}>
                Showing <span className={styles.countHighlight}>{products.length}</span> of{' '}
                <span className={styles.countHighlight}>{total}</span> original shoes
              </span>
            </div>

            {products.length === 0 ? (
              <div className={styles.noResults} id="no-results-panel">
                <h3 className={styles.noResultsTitle}>No Products Found</h3>
                <p className={styles.noResultsDesc}>
                  We could not find any shoes matching your active filters. Try clearing some selections!
                </p>
                <Link href="/collections" className={styles.resetBtn} id="reset-filters-cta">
                  Reset All Filters
                </Link>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className={styles.grid}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <nav className={styles.pagination} aria-label="Pagination navigation">
                    <Link
                      href={getPaginationUrl(currentPage - 1)}
                      className={styles.pageBtn}
                      style={{ pointerEvents: currentPage <= 1 ? 'none' : 'auto' }}
                      aria-disabled={currentPage <= 1}
                      id="pagination-prev"
                    >
                      &laquo;
                    </Link>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={getPaginationUrl(pageNum)}
                        className={`${styles.pageBtn} ${
                          pageNum === currentPage ? styles.pageBtnActive : ''
                        }`}
                        id={`pagination-page-${pageNum}`}
                      >
                        {pageNum}
                      </Link>
                    ))}

                    <Link
                      href={getPaginationUrl(currentPage + 1)}
                      className={styles.pageBtn}
                      style={{ pointerEvents: currentPage >= totalPages ? 'none' : 'auto' }}
                      aria-disabled={currentPage >= totalPages}
                      id="pagination-next"
                    >
                      &raquo;
                    </Link>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
