'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import Link from 'next/link';
import { fetchCart, fetchProfile, createPaymentOrder, verifyPayment } from '@/lib/api';
import type { Cart, SavedAddress } from '@/types';
import styles from './page.module.css';

// Declare Razorpay on window
declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [cartRes, profileRes] = await Promise.all([
          fetchCart(),
          fetchProfile()
        ]);

        if (cartRes?.success && cartRes.data.cart) {
          setCart(cartRes.data.cart);
        }

        if (profileRes?.success && profileRes.data.user) {
          const userAddresses = profileRes.data.user.savedAddresses || [];
          setAddresses(userAddresses);
          if (userAddresses.length > 0) {
            setSelectedAddressId(userAddresses[0]._id || '');
          }
        }
      } catch (err) {
        console.error('Error loading checkout data', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const handlePayment = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // 1. Create Order on Backend
      const orderRes = await createPaymentOrder(selectedAddressId);
      
      if (!orderRes || !orderRes.success) {
        throw new Error(orderRes?.message || 'Failed to initialize payment');
      }

      const { orderId, amount, currency } = orderRes.data;

      // 2. Setup Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key_id',
        amount: amount,
        currency: currency,
        name: 'Brand Deals 2.0',
        description: 'Shoe Purchase',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // 3. Verify Payment
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              addressId: selectedAddressId
            });

            if (verifyRes && verifyRes.success) {
              // Redirect to success page
              router.push(`/checkout/success?order=${verifyRes.data.orderNumber}`);
            } else {
              setError(verifyRes?.message || 'Payment verification failed. Please contact support.');
              setIsProcessing(false);
            }
          } catch (err: any) {
            setError(err.message || 'Error verifying payment');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: 'Customer',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#ffffff'
        }
      };

      // 4. Open Razorpay Checkout Modal
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed');
        setIsProcessing(false);
      });
      
      rzp.open();
      
    } catch (err: any) {
      setError(err.message || 'Error initiating checkout');
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container} style={{ display: 'block', textAlign: 'center', paddingTop: '100px' }}>Loading checkout...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className={styles.container} style={{ display: 'block', textAlign: 'center', paddingTop: '100px' }}>
        <h1 className={styles.title}>Your cart is empty</h1>
        <Link href="/collections" className={styles.addAddressBtn}>Continue Shopping</Link>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over 5000
  const total = subtotal + shipping;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className={styles.container}>
        <div className={styles.mainColumn}>
          <h1 className={styles.title}>Checkout</h1>
          
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            
            {addresses.length === 0 ? (
              <div className={styles.noAddress}>
                <p>No addresses found in your profile.</p>
                <Link href="/profile">
                  <button className={styles.addAddressBtn}>Go to Profile to Add Address</button>
                </Link>
              </div>
            ) : (
              <div className={styles.addressList}>
                {addresses.map(addr => (
                  <div 
                    key={addr._id} 
                    className={`${styles.addressCard} ${selectedAddressId === addr._id ? styles.selected : ''}`}
                    onClick={() => setSelectedAddressId(addr._id || '')}
                  >
                    <span className={styles.addressText}><strong>{addr.street}</strong></span>
                    <span className={styles.addressText}>{addr.city}, {addr.state} {addr.postalCode}</span>
                    <span className={styles.addressText}>{addr.country}</span>
                  </div>
                ))}
                <Link href="/profile">
                  <button className={styles.addAddressBtn} style={{ marginTop: '1rem', display: 'inline-block' }}>
                    Manage Addresses
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className={styles.summarySection}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            
            <div className={styles.summaryItems}>
              {cart.items.map(item => (
                <div key={item._id} className={styles.summaryItem}>
                  <span>{item.product.name} (Size {item.size}) x {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
            </div>

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button 
              className={styles.payBtn} 
              onClick={handlePayment}
              disabled={isProcessing || !selectedAddressId}
              style={{ marginTop: '2rem' }}
            >
              {isProcessing ? 'Processing...' : `Pay ₹${total}`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
