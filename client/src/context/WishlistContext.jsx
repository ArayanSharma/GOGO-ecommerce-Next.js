'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'gogo_wishlist_v1';

const WishlistContext = createContext(null);

const getSafeProduct = (product) => {
  if (!product) return null;

  const id = String(product.id || product._id || '');
  if (!id) return null;

  return {
    id,
    name: product.name || product.product || 'Untitled Product',
    image: product.image || product.thumbnail || '/p1.webp',
    category: product.category || 'Uncategorized',
    price: Number(product.price || 0),
    originalPrice: Number(product.originalPrice || product.price || 0),
    rating: Number(product.rating || 4),
    stock: Number(product.stock || 0),
    section: product.section || 'Latest Products',
  };
};

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setWishlistItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load wishlist from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch (error) {
      console.error('Failed to save wishlist to localStorage', error);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => wishlistItems.some((item) => item.id === String(productId));

  const addToWishlist = (product) => {
    const normalized = getSafeProduct(product);
    if (!normalized) return false;

    let added = false;
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === normalized.id)) {
        return prev;
      }
      added = true;
      return [normalized, ...prev];
    });

    return added;
  };

  const removeFromWishlist = (productId) => {
    const targetId = String(productId);
    setWishlistItems((prev) => prev.filter((item) => item.id !== targetId));
  };

  const toggleWishlist = (product) => {
    const normalized = getSafeProduct(product);
    if (!normalized) return false;

    if (isInWishlist(normalized.id)) {
      removeFromWishlist(normalized.id);
      return false;
    }

    addToWishlist(normalized);
    return true;
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount: wishlistItems.length,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
    }),
    [wishlistItems]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
