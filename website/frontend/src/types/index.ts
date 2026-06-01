/** Size-stock entry for a product */
export interface Size {
  size: number;
  stock: number;
}

/** Product model matching backend schema */
export interface Product {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  description: string;
  price: number;
  comparePrice: number;
  images: string[];
  sizes: Size[];
  isActive: boolean;
  ratingsAverage: number;
  ratingsCount: number;
  createdAt: string;
  updatedAt: string;
}

/** Paginated API response for product listings */
export interface ProductListResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  data: {
    products: Product[];
  };
}

/** Single product API response */
export interface ProductDetailResponse {
  success: boolean;
  data: {
    product: Product;
  };
}

/** Generic API error response */
export interface ApiError {
  success: false;
  message: string;
}

/** Query parameters for product listing */
export interface ProductQueryParams {
  search?: string;
  brand?: string;
  category?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  size?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
  page?: string;
  limit?: string;
}
