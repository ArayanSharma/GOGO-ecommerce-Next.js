'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'gogo_cart_v1';

const CartContext = createContext(null);

const normalizeCartProduct = (product) => {
  if (!product) return null;

  const id = String(product.id || product._id || '');
  if (!id) return null;

  const price = Number(product.price || 0);
  const originalPrice = Number(product.originalPrice || price);

  return {
    id,
    name: product.name || product.product || 'Untitled Product',
    category: product.category || 'Uncategorized',
    image: product.image || product.thumbnail || '/p1.webp',
    price,
    originalPrice,
    rating: Number(product.rating || 4),
    stock: Number(product.stock || 0),
    quantity: Math.max(1, Number(product.quantity || 1)),
  };
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setCartItems(parsed);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch (error) {
      console.error('Failed to save cart to localStorage', error);
    }
  }, [cartItems]);

  const isInCart = (productId) => cartItems.some((item) => item.id === String(productId));
  const getCartQuantity = (productId) => {
    const item = cartItems.find((cartItem) => cartItem.id === String(productId));
    return Number(item?.quantity || 0);
  };

  const addToCart = (product, quantity = 1) => {
    const normalized = normalizeCartProduct({ ...product, quantity });
    if (!normalized) return false;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === normalized.id);
      if (!existing) {
        return [normalized, ...prev];
      }

      const nextQuantity = Math.max(1, existing.quantity + normalized.quantity);
      return prev.map((item) =>
        item.id === normalized.id ? { ...item, quantity: nextQuantity } : item
      );
    });

    return true;
  };

  const updateCartQuantity = (productId, quantity) => {
    const safeQty = Math.max(1, Number(quantity || 1));
    const targetId = String(productId);
    setCartItems((prev) =>
      prev.map((item) => (item.id === targetId ? { ...item, quantity: safeQty } : item))
    );
  };

  const removeFromCart = (productId) => {
    const targetId = String(productId);
    setCartItems((prev) => prev.filter((item) => item.id !== targetId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    );
    const itemCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 1), 0);

    return {
      subtotal,
      itemCount,
      shipping: 0,
      total: subtotal,
    };
  }, [cartItems]);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount: totals.itemCount,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      total: totals.total,
      isInCart,
      getCartQuantity,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
    }),
    [cartItems, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
