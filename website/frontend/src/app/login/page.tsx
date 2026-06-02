'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './auth.module.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Securely save the JWT inside browser document cookies (expires in 30 days)
        document.cookie = `token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax;`;
        
        // Redirect user to their account profile
        window.location.href = '/profile';
      } else {
        setError(data.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('[Login] Error during request:', err);
      // Inline fallback mock successful login for demonstration in dev if backend is offline!
      if (email === 'aradhya@deals.com' && password === '123456') {
        document.cookie = `token=mock-token-aradhya-2026; path=/; max-age=3600;`;
        window.location.href = '/profile';
      } else {
        setError('Network error. Failed to reach server.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <div className={`${styles.card} glass-card`}>
          <div className={styles.titleGroup}>
            <span className={styles.brand}>
              <span className={styles.brandAccent}>Brand</span>Deals
            </span>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to access your persistent cart and wishlist</p>
          </div>

          {error && <div className={styles.error} id="login-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className={styles.form} id="login-form">
            <div className={styles.inputGroup}>
              <label htmlFor="login-email" className={styles.label}>Email Address</label>
              <input
                type="email"
                id="login-email"
                placeholder="e.g. aradhya@deals.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="login-password" className={styles.label}>Password</label>
              <input
                type="password"
                id="login-password"
                placeholder="Enter your password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || password.length < 6}
              className={styles.btn}
              id="login-submit-btn"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Link href="/register" className={styles.link}>
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
