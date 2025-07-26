import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Loader2 } from 'lucide-react'; // You can use any icon or loader component
import { motion } from 'framer-motion'; // Optional for smooth animation

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const allowedAdminEmails = ['admin@motivation.com', 'shreyanshpalwalia@gmail.com'];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Sign-out failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = !!user && allowedAdminEmails.includes(user.email?.toLowerCase() ?? '');

  // ✨ Custom loader while checking auth
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-black">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        </motion.div>
        <p className="ml-4 text-xl font-semibold text-indigo-600">Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithEmail, signOutUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
