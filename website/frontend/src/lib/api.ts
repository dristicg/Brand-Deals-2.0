import type {
  ProductListResponse,
  ProductDetailResponse,
  ProductQueryParams,
  CartResponse,
  WishlistResponse,
  ToggleWishlistResponse,
  ProfileResponse,
  AddressResponse,
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

/* ========================================================
   PERSISTENT CART, WISHLIST & PROFILE API EXTENSIONS (SPRINT 5)
   ======================================================== */

// Helper to get request options (handles method, JSON payload, and Cookie/Authorization)
function getFetchOptions(method: string, body?: unknown, token?: string): RequestInit {
  const headers: Record<string, string> = {};
  if (body) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include', // Essential for HttpOnly cookie carrying in browser
  };
}

/**
 * Fetch authenticated user's cart
 */
export async function fetchCart(token?: string): Promise<CartResponse | null> {
  const url = `${API_BASE}/cart`;
  try {
    const res = await fetch(url, getFetchOptions('GET', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] fetchCart failed:', error);
    return null;
  }
}

/**
 * Add an item to the user's cart
 */
export async function addToCart(
  productId: string,
  size: number,
  quantity: number = 1,
  token?: string
): Promise<CartResponse | null> {
  const url = `${API_BASE}/cart`;
  try {
    const res = await fetch(
      url,
      getFetchOptions('POST', { productId, size, quantity }, token)
    );
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] addToCart failed:', error);
    return null;
  }
}

/**
 * Update the quantity of a specific cart item
 */
export async function updateCartItem(
  itemId: string,
  quantity: number,
  token?: string
): Promise<CartResponse | null> {
  const url = `${API_BASE}/cart/items/${itemId}`;
  try {
    const res = await fetch(url, getFetchOptions('PUT', { quantity }, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] updateCartItem failed:', error);
    return null;
  }
}

/**
 * Remove an item from the cart
 */
export async function removeFromCart(
  itemId: string,
  token?: string
): Promise<CartResponse | null> {
  const url = `${API_BASE}/cart/items/${itemId}`;
  try {
    const res = await fetch(url, getFetchOptions('DELETE', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] removeFromCart failed:', error);
    return null;
  }
}

/**
 * Clear the entire cart
 */
export async function clearCart(token?: string): Promise<CartResponse | null> {
  const url = `${API_BASE}/cart`;
  try {
    const res = await fetch(url, getFetchOptions('DELETE', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] clearCart failed:', error);
    return null;
  }
}

/**
 * Fetch authenticated user's wishlist
 */
export async function fetchWishlist(token?: string): Promise<WishlistResponse | null> {
  const url = `${API_BASE}/wishlist`;
  try {
    const res = await fetch(url, getFetchOptions('GET', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] fetchWishlist failed:', error);
    return null;
  }
}

/**
 * Toggle a product inside the user's wishlist
 */
export async function toggleWishlist(
  productId: string,
  token?: string
): Promise<ToggleWishlistResponse | null> {
  const url = `${API_BASE}/wishlist`;
  try {
    const res = await fetch(url, getFetchOptions('POST', { productId }, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] toggleWishlist failed:', error);
    return null;
  }
}

/**
 * Fetch authenticated user's profile details
 */
export async function fetchProfile(token?: string): Promise<ProfileResponse | null> {
  const url = `${API_BASE}/users/me`;
  try {
    const res = await fetch(url, getFetchOptions('GET', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] fetchProfile failed:', error);
    return null;
  }
}

/**
 * Update authenticated user's credentials
 */
export async function updateProfile(
  name?: string,
  email?: string,
  token?: string
): Promise<ProfileResponse | null> {
  const url = `${API_BASE}/users/me`;
  try {
    const res = await fetch(url, getFetchOptions('PUT', { name, email }, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] updateProfile failed:', error);
    return null;
  }
}

/**
 * Add an item to the cart
 */
export async function addToCart(
  productId: string,
  size: number,
  quantity: number = 1,
  token?: string
): Promise<any | null> {
  const url = `${API_BASE}/cart`;
  try {
    const res = await fetch(url, getFetchOptions('POST', { productId, size, quantity }, token));
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to add item to cart');
    }
    return res.json();
  } catch (error) {
    console.error('[API] addToCart failed:', error);
    throw error;
  }
}

/**
 * Add a new saved address
 */
export async function addAddress(
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  },
  token?: string
): Promise<AddressResponse | null> {
  const url = `${API_BASE}/users/me/addresses`;
  try {
    const res = await fetch(url, getFetchOptions('POST', address, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] addAddress failed:', error);
    return null;
  }
}

/**
 * Update an existing saved address
 */
export async function updateAddress(
  addressId: string,
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  },
  token?: string
): Promise<AddressResponse | null> {
  const url = `${API_BASE}/users/me/addresses/${addressId}`;
  try {
    const res = await fetch(url, getFetchOptions('PUT', address, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] updateAddress failed:', error);
    return null;
  }
}

/**
 * Delete a specific saved address
 */
export async function deleteAddress(
  addressId: string,
  token?: string
): Promise<AddressResponse | null> {
  const url = `${API_BASE}/users/me/addresses/${addressId}`;
  try {
    const res = await fetch(url, getFetchOptions('DELETE', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] deleteAddress failed:', error);
    return null;
  }
}

/* ========================================================
   CHECKOUT & ORDER MANAGEMENT API EXTENSIONS (SPRINT 6)
   ======================================================== */

import type { CreatePaymentResponse, OrderListResponse, OrderDetailResponse } from '../types';

/**
 * Create a Razorpay Order
 */
export async function createPaymentOrder(
  addressId: string,
  token?: string
): Promise<CreatePaymentResponse | null> {
  const url = `${API_BASE}/payments/create-order`;
  try {
    const res = await fetch(url, getFetchOptions('POST', { addressId }, token));
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create payment order');
    }
    return res.json();
  } catch (error) {
    console.error('[API] createPaymentOrder failed:', error);
    throw error;
  }
}

/**
 * Verify Razorpay Payment and create DB Order
 */
export async function verifyPayment(
  paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    addressId: string;
  },
  token?: string
): Promise<OrderDetailResponse | null> {
  const url = `${API_BASE}/payments/verify`;
  try {
    const res = await fetch(url, getFetchOptions('POST', paymentData, token));
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Payment verification failed');
    }
    return res.json();
  } catch (error) {
    console.error('[API] verifyPayment failed:', error);
    throw error;
  }
}

/**
 * Fetch authenticated user's orders
 */
export async function fetchMyOrders(token?: string): Promise<OrderListResponse | null> {
  const url = `${API_BASE}/orders`;
  try {
    const res = await fetch(url, getFetchOptions('GET', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] fetchMyOrders failed:', error);
    return null;
  }
}

/**
 * Fetch a single order by ID
 */
export async function fetchOrderById(orderId: string, token?: string): Promise<OrderDetailResponse | null> {
  const url = `${API_BASE}/orders/${orderId}`;
  try {
    const res = await fetch(url, getFetchOptions('GET', undefined, token));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] fetchOrderById failed:', error);
    return null;
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: string, token?: string): Promise<OrderDetailResponse | null> {
  const url = `${API_BASE}/orders/${orderId}/cancel`;
  try {
    const res = await fetch(url, getFetchOptions('PATCH', undefined, token));
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to cancel order');
    }
    return res.json();
  } catch (error) {
    console.error('[API] cancelOrder failed:', error);
    throw error;
  }
}

/* ========================================================
   REVIEWS & RATINGS API EXTENSIONS (SPRINT 7)
   ======================================================== */

/**
 * Fetch reviews for a product
 */
export async function fetchProductReviews(productId: string): Promise<any | null> {
  const url = `${API_BASE}/reviews/${productId}`;
  try {
    const res = await fetch(url, getFetchOptions('GET'));
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('[API] fetchProductReviews failed:', error);
    return null;
  }
}

/**
 * Submit a new review for a product
 */
export async function submitReview(
  productId: string,
  rating: number,
  review: string,
  token?: string
): Promise<any | null> {
  const url = `${API_BASE}/reviews/${productId}`;
  try {
    const res = await fetch(url, getFetchOptions('POST', { rating, review }, token));
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to submit review');
    }
    return res.json();
  } catch (error) {
    console.error('[API] submitReview failed:', error);
    throw error;
  }
}
