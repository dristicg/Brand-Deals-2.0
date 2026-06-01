import type {
  ProductListResponse,
  ProductDetailResponse,
  ProductQueryParams,
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/**
 * Fetch paginated product listings with optional filters
 * Used in Server Components for SSR / SSG
 */
export async function fetchProducts(
  params: ProductQueryParams = {}
): Promise<ProductListResponse> {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  const url = `${API_BASE}/products${queryString ? `?${queryString}` : ''}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });

    if (!res.ok) {
      throw new Error(`API responded with status ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('[API] Failed to fetch products:', error);
    // Return empty fallback so pages render gracefully
    return {
      success: false,
      count: 0,
      total: 0,
      page: 1,
      pages: 0,
      data: { products: [] },
    };
  }
}

/**
 * Fetch a single product by its URL slug
 * Used in Server Components for product detail pages
 */
export async function fetchProductBySlug(
  slug: string
): Promise<ProductDetailResponse | null> {
  const url = `${API_BASE}/products/${slug}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    console.error(`[API] Failed to fetch product "${slug}":`, error);
    return null;
  }
}
