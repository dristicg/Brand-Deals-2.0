'use client';

import { useState } from 'react';
import type { User, SavedAddress } from '@/types';
import { updateProfile, addAddress, updateAddress, deleteAddress } from '@/lib/api';
import styles from './page.module.css';

interface ProfileContainerProps {
  initialUser: User;
}

export default function ProfileContainer({ initialUser }: ProfileContainerProps) {
  // Profile state
  const [user, setUser] = useState<User>(initialUser);
  const [name, setName] = useState(initialUser.name);
  const [email, setEmail] = useState(initialUser.email);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Address book state
  const [addresses, setAddresses] = useState<SavedAddress[]>(initialUser.savedAddresses);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // Address form fields
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  // Location detection state
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Handle Profile Update
  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileStatus(null);

    const res = await updateProfile(name, email);

    if (res && res.success) {
      setUser(res.data.user);
      setProfileStatus({ type: 'success', text: 'Profile updated successfully!' });
    } else {
      // Fallback local update for demonstration
      setUser((prev) => ({ ...prev, name, email }));
      setProfileStatus({ type: 'success', text: 'Profile updated locally (Demo Mode).' });
    }

    setIsSavingProfile(false);
    setTimeout(() => setProfileStatus(null), 3000);
  };

  // Open address form for adding
  const handleOpenAdd = () => {
    setEditingAddressId(null);
    setStreet('');
    setCity('');
    setState('');
    setPostalCode('');
    setCountry('India');
    setLocationError(null);
    setIsDetectingLocation(false);
    setShowAddressForm(true);
  };

  // Open address form for editing
  const handleOpenEdit = (addr: SavedAddress) => {
    if (!addr._id) return;
    setEditingAddressId(addr._id);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
    setLocationError(null);
    setIsDetectingLocation(false);
    setShowAddressForm(true);
  };

  // Cancel address form
  const handleCancelForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setLocationError(null);
    setIsDetectingLocation(false);
  };

  // Handle auto-detecting current location using browser geolocation and Nominatim API
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          if (!response.ok) {
            throw new Error('Failed to retrieve location details.');
          }
          const data = await response.json();
          const address = data.address || {};

          // Construct street address dynamically
          const streetParts = [];
          
          const houseNumber = address.house_number || address.building || '';
          const road = address.road || '';
          if (houseNumber && road) {
            streetParts.push(`${houseNumber} ${road}`);
          } else if (road) {
            streetParts.push(road);
          }

          const sub = address.suburb || address.neighbourhood || address.residential || '';
          if (sub) {
            streetParts.push(sub);
          }

          if (streetParts.length === 0 && (address.amenity || address.shop)) {
            streetParts.push(address.amenity || address.shop);
          }

          setStreet(streetParts.join(', ') || 'Current Location');
          setCity(address.city || address.town || address.village || address.county || '');
          setState(address.state || address.state_district || '');
          setPostalCode(address.postcode || '');
          setCountry(address.country || 'India');
        } catch (err: any) {
          setLocationError('Could not fetch address details. Please fill manually.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location access denied. Please enable location permissions.';
        }
        setLocationError(msg);
        setIsDetectingLocation(false);
      }
    );
  };

  // Submit address form (handles add or edit)
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const addressPayload = { street, city, state, postalCode, country };

    if (editingAddressId) {
      // Edit mode
      const res = await updateAddress(editingAddressId, addressPayload);
      if (res && res.success) {
        setAddresses(res.data.addresses);
      } else {
        // Fallback local update
        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddressId ? { ...addr, ...addressPayload } : addr
          )
        );
      }
    } else {
      // Add mode
      const res = await addAddress(addressPayload);
      if (res && res.success) {
        setAddresses(res.data.addresses);
      } else {
        // Fallback local append
        const mockNewAddr: SavedAddress = {
          _id: `mock-addr-${Date.now()}`,
          ...addressPayload,
        };
        setAddresses((prev) => [...prev, mockNewAddr]);
      }
    }

    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  // Handle Address Delete
  const handleDeleteAddress = async (addressId: string) => {
    const res = await deleteAddress(addressId);
    if (res && res.success) {
      setAddresses(res.data.addresses);
    } else {
      // Fallback local delete
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
    }
  };

  // Handle Logout
  const handleLogout = () => {
    // Delete authentication token by expiring it
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // Redirect to home
    window.location.href = '/login';
  };

  return (
    <div className={styles.layout}>
      {/* Left Column: Profile Card */}
      <div className={styles.profileColumn}>
        <form onSubmit={handleProfileSave} className={`${styles.formCard} glass-card`} id="profile-details-form">
          <h3 className={styles.cardTitle}>My Details</h3>

          {profileStatus && (
            <div className={`${styles.statusMessage} ${
              profileStatus.type === 'success' ? styles.statusSuccess : styles.statusError
            }`} id="profile-status-alert">
              {profileStatus.text}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="profile-name" className={styles.label}>Full Name</label>
            <input
              type="text"
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="profile-email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="profile-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSavingProfile || (name === user.name && email === user.email)}
            className={styles.submitBtn}
            id="profile-save-btn"
          >
            {isSavingProfile ? 'Saving...' : 'Save Profile Details'}
          </button>
        </form>

        <button onClick={handleLogout} className={styles.logoutBtn} id="profile-logout-btn">
          Log Out
        </button>
      </div>

      {/* Right Column: Address Book */}
      <div className={styles.addressesColumn}>
        {/* Address Form Card */}
        {showAddressForm ? (
          <form onSubmit={handleAddressSubmit} className={`${styles.addressFormCard} glass-card`} id="address-editor-form">
            <h3 className={styles.cardTitle}>
              {editingAddressId ? 'Edit Address' : 'Add New Address'}
            </h3>

            {/* Geolocation autofill trigger button */}
            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isDetectingLocation}
              className={styles.detectLocationBtn}
              id="detect-location-btn"
            >
              {isDetectingLocation ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={styles.spinIcon} style={{ width: '14px', height: '14px', marginRight: '6px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Detecting Location...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '14px', height: '14px', marginRight: '6px' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  Use Current Location
                </>
              )}
            </button>

            {locationError && (
              <span className={styles.locationError} id="location-detect-error">
                {locationError}
              </span>
            )}

            <div className={styles.formGrid}>
              <div className={`${styles.inputGroup} ${styles.formFullWidth}`}>
                <label htmlFor="addr-street" className={styles.label}>Street / Landmark</label>
                <input
                  type="text"
                  id="addr-street"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Flat 302, Green Meadows, Bandra West"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="addr-city" className={styles.label}>City</label>
                <input
                  type="text"
                  id="addr-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="addr-state" className={styles.label}>State</label>
                <input
                  type="text"
                  id="addr-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="addr-pin" className={styles.label}>Postal Code / PIN</label>
                <input
                  type="text"
                  id="addr-pin"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="e.g. 400050"
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="addr-country" className={styles.label}>Country</label>
                <input
                  type="text"
                  id="addr-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={handleCancelForm} className={styles.cancelBtn}>
                Cancel
              </button>
              <button type="submit" className={styles.saveAddrBtn} id="address-submit-btn">
                {editingAddressId ? 'Update Address' : 'Add Address'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className={styles.headerRow}>
              <h2 className={styles.colTitle}>Saved Addresses</h2>
              <button onClick={handleOpenAdd} className={styles.addAddrBtn} id="add-address-cta">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '14px', height: '14px' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div style={{ padding: 'var(--space-xl)', background: 'var(--color-bg-secondary)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                  No saved addresses found. Add a shipping address for faster checkouts!
                </p>
              </div>
            ) : (
              <div className={styles.addressGrid}>
                {addresses.map((addr) => (
                  <div key={addr._id} className={`${styles.addressCard} glass-card`}>
                    <div className={styles.addressDetails}>
                      <span className={styles.addressTextBold}>Shipping Destination</span>
                      <span>{addr.street}</span>
                      <span>{addr.city}, {addr.state} - {addr.postalCode}</span>
                      <span>{addr.country}</span>
                    </div>

                    <div className={styles.addressActions}>
                      {/* Edit Address */}
                      <button
                        onClick={() => handleOpenEdit(addr)}
                        className={styles.actionIconBtn}
                        title="Edit address"
                        aria-label="Edit address"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>
                      </button>

                      {/* Delete Address */}
                      <button
                        onClick={() => addr._id && handleDeleteAddress(addr._id)}
                        className={`${styles.actionIconBtn} styles.actionIconBtnDanger`}
                        title="Delete address"
                        aria-label="Delete address"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
