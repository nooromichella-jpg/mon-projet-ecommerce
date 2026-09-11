// app/products/[slug]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';
import { ArrowLeft, MapPin, ShieldCheck, Truck, ShoppingCart, AlertTriangle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  description?: string;
  stock?: number;
  quantity?: number;
  category?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const identifier = params?.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [addedMessage, setAddedMessage] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
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
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono font-medium">Chargement des détails du produit...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full space-y-4">
          <p className="text-rose-600 font-medium text-sm">Oups ! Ce produit est introuvable ou a été supprimé.</p>
          <Link href="/products" className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl transition shadow-sm text-xs font-medium">
            <ArrowLeft className="w-4 h-4" /> Retourner au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const availableStock = product.stock !== undefined ? product.stock : (product.quantity !== undefined ? product.quantity : 10);
  const isOutOfStock = availableStock === 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 text-slate-900">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Bouton Retour élégant */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        {/* Contenu principal */}
        <div className="bg-white border border-slate-200 p-6 sm:p-10 rounded-2xl shadow-xs grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Image et badge Tana */}
          <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-100 shadow-inner">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
            />
            {product.category && (
              <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg uppercase shadow-xs">
                {product.category}
              </span>
            )}
          </div>

          {/* Informations produit */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  <MapPin className="w-3.5 h-3.5" /> Disponible à Antananarivo
                </span>
                <span className="text-xs font-mono text-slate-400">Ref: {product.slug || product.id}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{product.name}</h1>

              <p className="text-2xl sm:text-3xl font-mono font-bold text-emerald-600">
                {product.price.toLocaleString()} Ar
              </p>

              <div className="border-t border-slate-100 pt-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {product.description || "Aucune description détaillée n'est disponible pour le moment."}
                </p>
              </div>

              {/* Indicateur de stock local */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100">
                    <AlertTriangle className="w-4 h-4" /> Rupture de stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 font-mono">
                    Stock disponible : {availableStock} unité(s)
                  </span>
                )}
              </div>
            </div>

            {/* Actions : Sélecteur de quantité + Bouton Panier */}
            {!isOutOfStock && (
              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-slate-700">Quantité :</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-xs font-mono font-bold text-slate-900 bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(availableStock, quantity + 1))}
                      className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 transition font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleAddToCart}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white px-6 py-3.5 rounded-xl transition-all shadow-sm font-medium text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" /> 
                  <span>Ajouter au panier — {(product.price * quantity).toLocaleString()} Ar</span>
                </button>

                {addedMessage && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 shadow-xs animate-fade-in font-medium">
                    <span className="font-bold">✓</span> Produit ajouté au panier avec succès !
                  </div>
                )}
              </div>
            )}

            {/* Avantages rassurants spécifiques */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Livraison rapide à Tana</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Paiement sécurisé à la livraison</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}