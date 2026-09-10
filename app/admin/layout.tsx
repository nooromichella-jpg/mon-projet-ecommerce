// app/admin/layout.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdminAuthorized, setIsAdminAuthorized] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Étant donné qu'on utilise une page de login unique (/login), 
  // on gère l'authentification directement sur les routes /admin
  useEffect(() => {
    // Vérification de l'état de l'authentification Firebase
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // Pas connecté -> Redirection vers la page de login unique
        router.push('/login');
      } else {
        // Connecté -> Vérification du rôle admin dans Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists() && userDoc.data().isAdmin === true) {
            setIsAdminAuthorized(true);
          } else {
            // Connecté mais pas admin -> Déconnexion et redirection vers /login
            await signOut(auth);
            router.push('/login');
          }
        } catch (err) {
          console.error("Erreur de vérification des droits :", err);
          router.push('/login');
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribeAuth();
  }, [router]);

  // Écoute en temps réel des commandes pour le badge de notification
  useEffect(() => {
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      let count = 0;
      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const status = (data.status || data.statut || 'En attente').toLowerCase();
        if (status.includes('attente')) {
          count++;
        }
      });
      setPendingCount(count);
    }, (error) => {
      console.error("Erreur lors de l'écoute des notifications :", error);
    });

    return () => unsubscribeOrders();
  }, []);

  // Affichage d'un écran de chargement pendant la vérification des droits
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-xs font-mono text-slate-500 animate-pulse">Vérification des accès administrateur...</p>
      </div>
    );
  }

  // Si l'utilisateur n'est pas autorisé, on ne rend rien (la redirection va s'opérer)
  if (!isAdminAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex text-slate-900">
      {/* Sidebar de navigation latérale */}
      <aside className="w-64 bg-white text-slate-800 flex flex-col justify-between hidden md:flex border-r border-slate-200 shadow-sm">
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-slate-900">NourStore</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono font-semibold">ADMIN</span>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-2 font-semibold">Menu principal</p>
            
            <Link href="/admin" className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition">
              Vue d'ensemble
            </Link>

            <Link href="/admin/orders" className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition">
              <span>Commandes</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded-full animate-pulse border border-amber-200 font-mono">
                  {pendingCount}
                </span>
              )}
            </Link>

            <Link href="/admin/products" className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition">
              Produits
            </Link>
            
            <Link href="/admin/products/new" className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition">
              Nouveau Produit
            </Link>

            <Link href="/admin/analytics" className="block px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition">
              Analyses
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 text-xs space-y-2">
          <button
            onClick={async () => {
              await signOut(auth);
              router.push('/login');
            }}
            className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition font-medium text-center cursor-pointer"
          >
            Déconnexion Admin
          </button>
          
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition font-medium">
            ← Retour au site client
          </Link>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 bg-slate-50 min-h-screen p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}