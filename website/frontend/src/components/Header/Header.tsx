import Link from 'next/link';
import { cookies } from 'next/headers';
import styles from './Header.module.css';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get('token')?.value;
  return (
    <HeaderClient>
      <header className={styles.header} id="site-header">
      <div className={styles.headerInner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoAccent}>Brand</span>Deals
        </Link>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          <Link href="/collections" className={styles.navLink}>
            Collections
          </Link>
          <Link href="/collections?gender=Men" className={styles.navLink}>
            Men
          </Link>
          <Link href="/collections?gender=Women" className={styles.navLink}>
            Women
          </Link>
          <Link href="/collections?gender=Kids" className={styles.navLink}>
            Kids
          </Link>
        </nav>

        {/* Action Icons */}
        <div className={styles.actions}>
          {/* Search */}
          <Link href="/collections" className={styles.iconBtn} aria-label="Search products">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </Link>

          {/* Wishlist */}
          <Link href="/wishlist" className={styles.iconBtn} aria-label="Wishlist">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </Link>

          {/* Cart */}
          <Link href="/cart" className={styles.iconBtn} aria-label="Shopping cart">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </Link>

          {/* Profile */}
          <Link href={isLoggedIn ? "/profile" : "/login"} className={styles.iconBtn} aria-label="Account" id="header-profile-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className={`${styles.iconBtn} ${styles.menuToggle}`} aria-label="Toggle menu">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
      </header>
    </HeaderClient>
  );
}
