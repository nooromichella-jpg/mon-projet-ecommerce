// app/login/page.tsx
'use client';

export const dynamic = 'force-dynamic';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db, googleProvider } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuthRedirect = async (user: any) => {
    const userDocRef = doc(db, 'users', user.uid);
    let userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        email: user.email,
        isAdmin: false,
        createdAt: new Date(),
      });
      userDoc = await getDoc(userDocRef);
    }

    const userData = userDoc.data();

    if (userData && userData.isAdmin === true) {
      router.push('/admin');
    } else {
      // Redirection directe vers le panier pour les clients
      router.push('/cart');
    }
  };

  const handleLoginOrRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. On essaie de connecter l'utilisateur s'il existe déjà
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleAuthRedirect(userCredential.user);
    } catch (err: any) {
      // 2. Si le compte n'existe pas encore, on le CRÉE automatiquement !
      try {
        const newUserCredential = await createUserWithEmailAndPassword(auth, email, password);
        await handleAuthRedirect(newUserCredential.user);
      } catch (createErr: any) {
        console.error("Erreur d'authentification :", createErr);
        // Firebase exige au moins 6 caractères pour le mot de passe
        if (createErr.code === 'auth/weak-password') {
          setError("Le mot de passe doit contenir au moins 6 caractères.");
        } else {
          setError("Impossible de se connecter ou de créer le compte. Vérifiez vos informations.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthRedirect(result.user);
    } catch (err: any) {
      console.error("Erreur de connexion Google :", err);
      setError("Échec de la connexion avec Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-8 shadow-sm space-y-6">
        
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2">
            <span className="font-bold text-xl text-slate-900">NourStore</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono font-semibold">ESPACE CLIENT & ADMIN</span>
          </div>
          <p className="text-xs text-slate-500">Connectez-vous ou créez votre compte en un clin d'œil pour valider votre panier.</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginOrRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Adresse E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Mot de passe (6 caractères min.)</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Patientez..." : "Continuer vers le panier"}
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-slate-400 text-[10px] uppercase">Ou continuer avec</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs py-3 rounded-xl shadow-sm transition duration-200 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Continuer avec Google
        </button>

        <div className="border-t border-slate-100 pt-4 text-center">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-slate-800 transition font-medium underline cursor-pointer"
          >
            ← Retourner sur le site public
          </a>
        </div>

      </div>
    </div>
  );
}