import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer} id="site-footer">
      <div className={styles.footerInner}>
        <div className={styles.footerGrid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandName}>
              <span className={styles.brandAccent}>Brand</span>Deals
            </div>
            <p className={styles.brandDesc}>
              Your destination for 100% original branded shoes. Nike, Adidas,
              Puma, Skechers, Reebok &amp; more — delivered across India.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className={styles.colTitle}>Shop</h4>
            <div className={styles.colLinks}>
              <Link href="/collections" className={styles.colLink}>All Shoes</Link>
              <Link href="/collections?gender=Men" className={styles.colLink}>Men</Link>
              <Link href="/collections?gender=Women" className={styles.colLink}>Women</Link>
              <Link href="/collections?gender=Kids" className={styles.colLink}>Kids</Link>
            </div>
          </div>

          {/* Brands */}
          <div>
            <h4 className={styles.colTitle}>Brands</h4>
            <div className={styles.colLinks}>
              <Link href="/collections?brand=Nike" className={styles.colLink}>Nike</Link>
              <Link href="/collections?brand=Adidas" className={styles.colLink}>Adidas</Link>
              <Link href="/collections?brand=Puma" className={styles.colLink}>Puma</Link>
              <Link href="/collections?brand=Skechers" className={styles.colLink}>Skechers</Link>
              <Link href="/collections?brand=Reebok" className={styles.colLink}>Reebok</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h4 className={styles.colTitle}>Support</h4>
            <div className={styles.colLinks}>
              <Link href="/orders" className={styles.colLink}>Track Order</Link>
              <Link href="/profile" className={styles.colLink}>My Account</Link>
              <Link href="/wishlist" className={styles.colLink}>Wishlist</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Brand Deals. All rights reserved.
          </p>
          <div className={styles.socials}>
            <a href="#" className={styles.socialLink} aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
              </svg>
            </a>
            <a href="#" className={styles.socialLink} aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
