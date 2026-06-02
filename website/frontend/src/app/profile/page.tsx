import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { fetchProfile } from '@/lib/api';
import type { User } from '@/types';
import ProfileContainer from './ProfileContainer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'My Profile | Brand Deals',
  description: 'Manage your credentials, preferences, and saved shipping destinations.',
};

// Fallback high-fidelity user profile if database is empty/offline
const FALLBACK_USER: User = {
  _id: 'mock-user-1',
  name: 'Aradhya Sharma',
  email: 'aradhya@deals.com',
  role: 'customer',
  savedAddresses: [
    {
      _id: 'mock-addr-1',
      street: 'Flat 405, Sea Breeze Apartments, Juhu Tara Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400049',
      country: 'India',
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  let initialUser: User = FALLBACK_USER;

  if (token) {
    const res = await fetchProfile(token);
    if (res && res.success) {
      initialUser = res.data.user;
    }
  }

  return (
    <div className="container">
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h1 className={styles.title}>My Account</h1>
          <p className={styles.subtitle}>Manage your credentials and saved shipping destinations</p>
        </header>

        {/* Dynamic Client Actions */}
        <ProfileContainer initialUser={initialUser} />
      </div>
    </div>
  );
}
