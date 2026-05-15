import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { isFirebaseConfigured } from '../lib/firebase';
import { loadCart, writeCart } from '../services/firestoreService';

export interface CartItem {
  id: string | number;
  name: string;
  salt: string;
  price: number;
  qty: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  removeItem: (id: string | number) => void;
  updateQty: (id: string | number, qty: number) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [items, setItems]  = useState<CartItem[]>([]);
  const syncTimer          = useRef<ReturnType<typeof setTimeout>>();
  const skipSync           = useRef(false);

  // Load from Firestore on mount / userId change; clear on sign-out
  useEffect(() => {
    setItems([]);
    if (!isFirebaseConfigured || userId === 'local_user') return;
    loadCart<CartItem>(userId).then((saved) => {
      if (saved.length) { skipSync.current = true; setItems(saved); }
    });
  }, [userId]);

  // Debounced Firestore sync on every items change
  useEffect(() => {
    if (!isFirebaseConfigured || userId === 'local_user') return;
    if (skipSync.current) { skipSync.current = false; return; }
    clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => writeCart(userId, items), 600);
    return () => clearTimeout(syncTimer.current);
  }, [items, userId]);

  const mutate = (updater: (prev: CartItem[]) => CartItem[]) => setItems(updater);

  const addItem = (item: Omit<CartItem, 'qty'>, qty = 1) =>
    mutate(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing
        ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i)
        : [...prev, { ...item, qty }];
    });

  const removeItem = (id: string | number) =>
    mutate(prev => prev.filter(i => i.id !== id));

  const updateQty = (id: string | number, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    mutate(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => mutate(() => []);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, totalItems, totalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
