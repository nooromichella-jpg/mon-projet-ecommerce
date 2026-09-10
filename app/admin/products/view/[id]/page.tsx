// app/admin/products/view/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

interface Product {
  id: string;
  name?: string;
  title?: string;
  price?: number;
  category?: string;
  description?: string;
  image?: string;
}

export default function AdminProductViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error("Erreur de chargement :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-slate-400 font-mono text-xs">Chargement du produit...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <p className="text-rose-600 font-semibold text-sm">Produit introuvable sur le serveur.</p>
          <Link
            href="/admin/products"
            className="inline-block px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-sm"
          >
            ← Retourner aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Détails du produit</h1>
        <p className="text-xs text-slate-500 mt-0.5">Informations complètes de l'article.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Image */}
        <div className="w-full h-80 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
          {product.image ? (
            <img src={product.image} alt={product.name || product.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-slate-400 text-xs">Aucune image</span>
          )}
        </div>

        {/* Informations */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-medium inline-block">
              {product.category || 'Général'}
            </span>
            <h1 className="text-xl font-bold text-slate-900">{product.name || product.title}</h1>
            <p className="text-lg font-mono font-bold text-emerald-600">
              {(product.price || 0).toLocaleString()} Ar
            </p>
            <p className="text-xs text-slate-600 leading-relaxed pt-2">
              {product.description || "Aucune description détaillée n'a été renseignée pour ce produit."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
            <Link
              href="/admin/products"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition border border-slate-200"
            >
              ← Retour aux produits
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}