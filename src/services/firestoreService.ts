/**
 * Thin Firestore service layer.
 * All functions no-op gracefully when Firebase is not configured.
 *
 * Data model:
 *   users/{userId}/orders/{orderId}
 *   users/{userId}/appointments/{appointmentId}
 *   users/{userId}/cart/current   { items: CartItem[] }
 *   users/{userId}/settings/preferences  { theme: ThemeMode }
 */

import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  type DocumentData,
} from 'firebase/firestore';

type Unsubscribe = () => void;

// ── Subcollections (orders, appointments) ─────────────────────────────────────

export function subscribeToCollection<T extends { id: string }>(
  userId: string,
  subCollection: string,
  callback: (items: T[]) => void,
  orderByField: string
): Unsubscribe {
  if (!db) return () => {};
  const q = query(
    collection(db, 'users', userId, subCollection),
    orderBy(orderByField, 'desc')
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as T)));
  });
}

export function writeToCollection<T extends { id: string }>(
  userId: string,
  subCollection: string,
  item: T
): Promise<void> {
  if (!db) return Promise.resolve();
  const { id, ...rest } = item;
  return setDoc(doc(db, 'users', userId, subCollection, id), rest as DocumentData);
}

// ── Cart document ─────────────────────────────────────────────────────────────

export async function loadCart<T>(userId: string): Promise<T[]> {
  if (!db) return [];
  const snap = await getDoc(doc(db, 'users', userId, 'cart', 'current'));
  return (snap.exists() ? (snap.data().items as T[]) : []);
}

export function writeCart<T>(userId: string, items: T[]): Promise<void> {
  if (!db) return Promise.resolve();
  return setDoc(doc(db, 'users', userId, 'cart', 'current'), { items });
}

// ── User profile document ─────────────────────────────────────────────────────

export interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export async function loadUserProfile(userId: string): Promise<UserProfile | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export function saveUserProfile(userId: string, profile: UserProfile): Promise<void> {
  if (!db) return Promise.resolve();
  return setDoc(doc(db, 'users', userId), {
    ...profile,
    lastLoginAt: new Date().toISOString(),
  }, { merge: true });
}

// ── Settings document ─────────────────────────────────────────────────────────

export async function loadSettings<T>(userId: string): Promise<T | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));
  return snap.exists() ? (snap.data() as T) : null;
}

export function writeSettings(
  userId: string,
  data: Record<string, unknown>
): Promise<void> {
  if (!db) return Promise.resolve();
  return setDoc(doc(db, 'users', userId, 'settings', 'preferences'), data, { merge: true });
}
