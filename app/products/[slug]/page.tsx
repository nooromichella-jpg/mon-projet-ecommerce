// app/products/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  description?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  // Sécurisation pour récupérer le paramètre de l'URL proprement
  const identifier = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedMessage, setAddedMessage] = useState<boolean>(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    // Si l'identifiant est absent ou vaut "undefined", on arrête tout
    if (!identifier || identifier === 'undefined') {
      setLoading(false);
      return;
    }

    fetch(`/api/products/${identifier}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProduct(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur :', err);
        setLoading(false);
      });
  }, [identifier]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center animate-fade-in">
          <p className="text-red-600 font-medium text-lg mb-4">Produit introuvable sur le serveur.</p>
          <Link href="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition shadow-sm font-medium">
            &larr; Retourner aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-gray-200 animate-fade-in">
        <Link 
          href="/products" 
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block font-medium transition-colors"
        >
          &larr; Retour aux produits
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2 items-center">
          <div className="w-full h-80 overflow-hidden rounded-xl bg-gray-100 shadow-inner">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer" 
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold mb-3 tracking-tight text-gray-900">{product.name}</h1>
            <p className="text-3xl text-emerald-600 font-bold mb-4">{product.price.toLocaleString()} Ar</p>
            <p className="text-gray-600 mb-8 leading-relaxed">{product.description || "Aucune description détaillée n'est disponible pour ce produit."}</p>
            
            <button 
              onClick={handleAddToCart}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-8 py-3.5 rounded-xl transition-all shadow-md font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ajouter au panier 🛒</span>
            </button>

            {addedMessage && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl flex items-center gap-2 shadow-xs animate-fade-in">
                <span className="font-bold">✓</span> Produit ajouté au panier avec succès !
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}