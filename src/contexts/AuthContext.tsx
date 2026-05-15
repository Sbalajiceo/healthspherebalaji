import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  /** Firestore userId, or 'local_user' when Firebase is not configured */
  userId: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userId: 'local_user',
  loading: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(false);
      } else {
        // Anonymous auth keeps a stable userId across sessions.
        // Replace with email/Google sign-in when adding a login screen.
        try {
          await signInAnonymously(auth!);
        } catch (err) {
          console.error('[Auth] Anonymous sign-in failed:', err);
          setLoading(false);
        }
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, userId: user?.uid ?? 'local_user', loading }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
