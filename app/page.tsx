// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import HeroBanner from '@/components/HeroBanner';
import ProductSkeleton from '@/components/ProductSkeleton';
import { useCartStore } from '@/store/useCartStore';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  description?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data.slice(0, 3));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur :', err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast.success(`${product.name} a bien été ajouté au panier !`, {
      icon: '🛒',
      style: {
        background: '#065f46',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 pb-20 overflow-hidden">
      {/* 🚀 Hero Banner avec effet de parallaxe au survol de la souris */}
      <HeroBanner />

      {/* 🌟 Section "À propos" avec animation au scroll */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 mt-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4"
            >
              <span>✨</span> À propos de NourStore
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Votre destination shopping de référence à Antananarivo
            </h2>
            
            <p className="text-gray-600 leading-relaxed mb-8 text-base">
              NourStore est né de la volonté de vous offrir une expérience d'achat en ligne moderne, fluide et sécurisée. Nous sélectionnons rigoureusement des produits de qualité supérieure — high-tech, accessoires et mode — pour répondre à toutes vos envies du quotidien.
            </p>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm font-medium text-gray-800">
              {['Produits garantis', 'Livraison rapide', 'Paiement sécurisé', 'Support dédié'].map((text, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">✓</div>
                  <span>{text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image high-tech avec effet visuel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl blur-lg opacity-30"></div>
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1000&auto=format&fit=crop" 
                alt="High-tech et accessoires NourStore" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Section des produits phares avec animation au scroll */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 mt-28"
      >
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Sélection exclusive</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Nos Produits Populaires</h2>
          </div>
          <Link 
            href="/products" 
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 transition group"
          >
            Voir tout <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        {/* Grille des 3 produits ou Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="w-full h-52 overflow-hidden rounded-xl bg-gray-100 mb-4">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-emerald-600 font-bold text-xl mb-4">{product.price.toLocaleString()} Ar</p>
                
                <div className="mt-auto flex gap-2">
                  <Link 
                    href={`/products/${product.slug}`}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2.5 rounded-xl font-medium transition text-sm flex items-center justify-center"
                  >
                    Détails
                  </Link>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2.5 rounded-xl font-medium transition text-sm shadow-xs active:scale-95 cursor-pointer"
                  >
                    Ajouter 🛒
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucun produit disponible pour le moment.</p>
        )}
      </motion.div>
    </div>
  );
}