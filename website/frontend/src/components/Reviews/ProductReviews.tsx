'use client';

import { useState, useEffect } from 'react';
import { fetchProductReviews, submitReview } from '@/lib/api';
import type { Review } from '@/types';
import styles from './ProductReviews.module.css';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function loadReviews() {
      try {
        const res = await fetchProductReviews(productId);
        if (res?.success && res.data.reviews) {
          setReviews(res.data.reviews);
        }
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (productId && !productId.startsWith('mock-')) {
      loadReviews();
    } else {
      setIsLoading(false);
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await submitReview(productId, rating, comment);
      if (res?.success) {
        setSuccess('Your review has been published!');
        setShowForm(false);
        // Add new review to the top of the list locally
        setReviews([res.data.review, ...reviews]);
        setRating(0);
        setComment('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Customer Reviews</h2>
        {!showForm && !success && (
          <button 
            className={styles.writeBtn}
            onClick={() => setShowForm(true)}
            disabled={productId.startsWith('mock-')}
            title={productId.startsWith('mock-') ? "Cannot review mock products" : ""}
          >
            Write a Review
          </button>
        )}
      </div>

      {success && (
        <div className={styles.successMsg}>{success}</div>
      )}

      {showForm && (
        <div className={styles.formContainer}>
          <h3 className={styles.formTitle}>Write your review</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <span className={styles.label}>Rating</span>
              <div className={styles.starRating} onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star}
                    className={`${styles.star} ${(hoverRating || rating) >= star ? styles.filled : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="review" className={styles.label}>Review Details</label>
              <textarea
                id="review"
                className={styles.textarea}
                placeholder="What did you like or dislike? How did it fit?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
              />
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button 
                type="button" 
                className={styles.writeBtn} 
                style={{ background: 'transparent', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }}
                onClick={() => setShowForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className={styles.reviewsGrid}>
          {reviews.map((rev) => {
            const date = new Date(rev.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric'
            });
            
            return (
              <div key={rev._id} className={styles.reviewCard}>
                <div className={styles.reviewHeader}>
                  <div>
                    <span className={styles.userName}>{rev.user?.name || 'Anonymous User'}</span>
                    <span style={{ fontSize: '0.75rem', color: '#52c41a', fontWeight: 600 }}>✓ Verified Purchaser</span>
                  </div>
                  <span className={styles.reviewDate}>{date}</span>
                </div>
                <div className={styles.starsDisplay}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: i < rev.rating ? '#ffc107' : '#e0e0e0' }}>&#9733;</span>
                  ))}
                </div>
                <p className={styles.reviewText}>{rev.review}</p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
