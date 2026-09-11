// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import CartDrawer from './CartDrawer';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const cartItemsCount = useCartStore((state) => 
    state.items.reduce((total, item) => total + (item.quantity || 1), 0)
  );
  const openCart = useCartStore((state) => state.openCart);

  // États pour la gestion de l'utilisateur et du badge de rôle
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingRole, setLoadingRole] = useState(true);

  // Écoute de l'état de connexion et récupération du rôle Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().isAdmin === true);
          }
        } catch (error) {
          console.error("Erreur lors de la récupération du rôle :", error);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoadingRole(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Déconnexion réussie");
      router.push('/');
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  // Ne pas afficher la navbar sur la page de connexion ou dans l'admin
  if (pathname === '/login' || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2 shrink-0">
             <span className="text-emerald-600 hover:opacity-90 transition">NourStore</span>
          </Link>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 font-medium text-sm transition duration-200">
              Accueil
            </Link>

            <Link href="/products" className="text-gray-600 hover:text-emerald-600 font-medium text-sm transition duration-200">
              Produits
            </Link>

            <button 
              onClick={openCart}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 border border-gray-200 transform hover:scale-105 active:scale-95 shadow-xs cursor-pointer text-sm"
            >
              <span>Panier</span>
              {cartItemsCount > 0 && (
                <span className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-full transition-transform animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* ESPACE AUTHENTIFICATION & BADGE */}
            {!loadingRole && (
              user ? (
                <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                  {isAdmin ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-purple-200">
                         Admin
                      </span>
                      <Link 
                        href="/admin" 
                        className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-xl font-medium hover:bg-slate-800 transition"
                      >
                        Dashboard
                      </Link>
                    </div>
                  ) : (
                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                        Client
                    </span>
                  )}

                  <button 
                    onClick={handleLogout}
                    className="text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <Link 
                  href="/login"
                  className="text-xs bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700 transition"
                >
                  Se connecter
                </Link>
              )
            )}
          </div>
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}