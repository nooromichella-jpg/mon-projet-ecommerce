// app/products/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // 👈 Import de Framer Motion
import ProductSkeleton from '@/components/ProductSkeleton';
import { useCartStore } from '@/store/useCartStore';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Animation d'apparition du titre */}
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold text-gray-900 mb-8"
      >
        Tous nos produits
      </motion.h1>

      {loading ? (
        /* Affichage des Skeletons pendant le chargement */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
          <ProductSkeleton />
        </div>
      ) : (
        /* Grille animée des produits une fois chargés */
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1, // Effet cascade : chaque carte apparaît 0.1s après la précédente
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {products.map((product: any) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
              }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }} // Petit soulèvement au survol comme sur la page d'accueil
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 flex flex-col hover:shadow-xl transition-shadow"
            >
              <div className="w-full h-52 overflow-hidden rounded-xl bg-gray-100 mb-4 relative group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
              <p className="text-emerald-600 font-bold text-xl mb-4">{product.price.toLocaleString()} Ar</p>
              <button 
                onClick={() => {
                  addItem(product);
                  toast.success(`${product.name} ajouté au panier !`);
                }}
                className="mt-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2.5 rounded-xl font-medium transition"
              >
                Ajouter 🛒
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}