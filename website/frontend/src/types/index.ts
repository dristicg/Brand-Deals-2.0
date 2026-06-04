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

/** Saved address interface matching backend schema */
export interface SavedAddress {
  _id?: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/** User interface matching backend schema */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  savedAddresses: SavedAddress[];
  createdAt: string;
  updatedAt: string;
}

/** Cart item interface matching populated backend items */
export interface CartItem {
  _id: string;
  product: Product;
  size: number;
  quantity: number;
}

/** Cart interface matching backend Cart model */
export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

/** Wishlist interface matching backend Wishlist model */
export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

/** API response for cart operations */
export interface CartResponse {
  success: boolean;
  message?: string;
  data: {
    cart: Cart;
  };
}

/** API response for wishlist operations */
export interface WishlistResponse {
  success: boolean;
  message?: string;
  data: {
    wishlist: Wishlist;
  };
}

/** API response for toggling wishlist items */
export interface ToggleWishlistResponse {
  success: boolean;
  message: string;
  data: {
    isAdded: boolean;
    wishlist: Wishlist;
  };
}

/** API response for user profile details */
export interface ProfileResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
  };
}

/** API response for address operations */
export interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    addresses: SavedAddress[];
  };
}

/** Payment Details interface */
export interface PaymentDetails {
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  status: 'pending' | 'paid' | 'failed';
}

/** Order Item interface */
export interface OrderItem {
  _id: string;
  product: Product;
  size: number;
  quantity: number;
  price: number;
}

/** Order interface */
export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: SavedAddress;
  paymentDetails: PaymentDetails;
  orderStatus: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

/** API response for Razorpay Order creation */
export interface CreatePaymentResponse {
  success: boolean;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    addressId: string;
  };
}

/** API response for listing orders */
export interface OrderListResponse {
  success: boolean;
  data: {
    orders: Order[];
  };
}

/** API response for a single order */
export interface OrderDetailResponse {
  success: boolean;
  data: {
    order: Order;
  };
}
