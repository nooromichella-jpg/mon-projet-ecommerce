// app/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Champs du profil client
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        // Si l'utilisateur n'est pas connecté, on le redirige vers le login
        router.push('/login');
        return;
      }

      setUser(currentUser);

      // Récupérer les données supplémentaires depuis Firestore
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setDisplayName(data.displayName || currentUser.displayName || '');
          setPhone(data.phone || '');
          setAddress(data.address || '');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du profil :", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSuccessMessage('');

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        displayName,
        phone,
        address,
        isAdmin: false, // On s'assure qu'un client reste un client
        updatedAt: new Date(),
      }, { merge: true });

      setSuccessMessage("Profil mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <p className="text-sm text-slate-500 animate-pulse">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* En-tête */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Mon Profil Client</h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-xs bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium rounded-xl transition cursor-pointer"
          >
            Se déconnecter
          </button>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center">
            {successMessage}
          </div>
        )}

        {/* Formulaire de modification des informations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nom complet</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ex: Jean Rakoto"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Numéro de téléphone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: +261 34 00 000 00"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Adresse de livraison</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Votre adresse complète pour la livraison..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Enregistrement..." : "Enregistrer mes modifications"}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center">
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-800 transition font-medium">
              ← Retourner à la boutique
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}