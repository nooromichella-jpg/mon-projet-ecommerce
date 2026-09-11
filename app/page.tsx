// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, Clock, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import HeroBanner from '@/components/HeroBanner';
import FeaturesBar from '@/components/FeaturesBar';
import ProductSkeleton from '@/components/ProductSkeleton';
import { useCartStore } from '@/store/useCartStore';

interface Product {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  image: string;
  slug?: string;
  description?: string;
  category?: string; // Ajouté pour le filtrage
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tous');
  const [loading, setLoading] = useState<boolean>(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        console.log("Données reçues de l'API products :", data);
        if (data.success) {
          setProducts(data.data);
          setFilteredProducts(data.data.slice(0, 4)); // Afficher les 4 premiers par défaut
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur :', err);
        setLoading(false);
      });
  }, []);

  // Fonction de filtrage par catégorie
  const handleFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === 'Tous') {
      setFilteredProducts(products.slice(0, 4));
    } else {
      const filtered = products.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
      setFilteredProducts(filtered.length > 0 ? filtered : products.slice(0, 4));
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id || product._id || product.slug || product.name,
      ...product
    } as any);
    toast.success(`${product.name} a bien été ajouté au panier !`, {
      style: {
        background: '#065f46',
        color: '#fff',
        fontWeight: '500',
      },
    });
  };

  const benefits = [
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: "Livraison rapide à Tana",
      description: "Recevez vos commandes directement chez vous ou à votre bureau en un temps record."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Paiement 100% Sécurisé",
      description: "Commandez en toute sérénité grâce à nos solutions de paiement fiables et adaptées."
    },
    {
      icon: <Headphones className="w-6 h-6 text-emerald-600" />,
      title: "Support client réactif",
      description: "Une équipe à votre écoute pour vous accompagner avant et après vos achats."
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-600" />,
      title: "Produits de qualité",
      description: "Une sélection rigoureuse d'articles tendances et durables pour le quotidien."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-950 pb-20 overflow-hidden">
      {/* 🚀 Hero Banner avec parallaxe */}
      <HeroBanner />

      {/* ✨ Barre de rassurances */}
      <FeaturesBar />

      {/* 🌟 Section "À propos" */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 mt-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-4">
              À propos de NourStore
            </div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
              Votre destination shopping de référence à Antananarivo
            </h2>
            
            <p className="text-gray-600 leading-relaxed mb-8 text-base">
              NourStore est né de la volonté de vous offrir une expérience d'achat en ligne moderne, fluide et sécurisée. Nous sélectionnons rigoureusement des produits de qualité supérieure pour répondre à toutes vos envies du quotidien.
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl blur-lg opacity-30"></div>
            <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1000&auto=format&fit=crop" 
                alt="High-tech et accessoires NourStore" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 📂 Section Catégories Populaires cliquables */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 mt-28"
      >
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Explorer par univers</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Nos Catégories Populaires</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div 
            onClick={() => handleFilter('High-Tech')} 
            className="group relative h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer block"
          >
            <img 
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop" 
              alt="High-Tech" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-xl mb-1">High-Tech & Audio</h3>
              <p className="text-gray-200 text-xs">Filtrer cette catégorie</p>
            </div>
          </div>

          <div 
            onClick={() => handleFilter('Accessoires')} 
            className="group relative h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer block"
          >
            <img 
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop" 
              alt="Accessoires" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-xl mb-1">Accessoires Mode</h3>
              <p className="text-gray-200 text-xs">Filtrer cette catégorie</p>
            </div>
          </div>

          <div 
            onClick={() => handleFilter('Vêtements')} 
            className="group relative h-64 rounded-2xl overflow-hidden shadow-md cursor-pointer block sm:col-span-2 md:col-span-1"
          >
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop" 
              alt="Vêtements et Mode" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-xl mb-1">Vêtements & Tendances</h3>
              <p className="text-gray-200 text-xs">Filtrer cette catégorie</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Section des produits phares avec onglets de filtrage rapide */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 mt-28"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Sélection exclusive</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-1">
              {selectedCategory === 'Tous' ? 'Nos Produits Populaires' : `Filtré : ${selectedCategory}`}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleFilter('Tous')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${selectedCategory === 'Tous' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
            >
              Tous
            </button>
            <button 
              onClick={() => handleFilter('High-Tech')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${selectedCategory === 'High-Tech' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
            >
              High-Tech
            </button>
            <button 
              onClick={() => handleFilter('Accessoires')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${selectedCategory === 'Accessoires' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`}
            >
              Accessoires
            </button>
            <Link 
              href="/products" 
              className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-1 transition ml-4 group"
            >
              Voir tout <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => {
              const identifier = product.id || product._id || product.slug || (product.name ? encodeURIComponent(product.name.trim()) : `produit-${index}`);

              return (
                <motion.div 
                  key={identifier}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col group"
                >
                  <div className="w-full h-48 overflow-hidden rounded-xl bg-gray-100 mb-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-emerald-600 font-bold text-lg mb-4">{product.price?.toLocaleString()} Ar</p>
                  
                  <div className="mt-auto flex gap-2">
                    <Link 
                      href={`/products/${identifier}`}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2.5 rounded-xl font-medium transition text-xs flex items-center justify-center"
                    >
                      Détails
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-center py-2.5 rounded-xl font-medium transition text-xs shadow-xs active:scale-95 cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucun produit trouvé pour cette catégorie.</p>
        )}
      </motion.div>

      {/* 🌟 Section "Pourquoi choisir NourStore ?" */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 mt-28"
      >
        <div className="text-center mb-12">
          <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Nos engagements</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-1">Pourquoi choisir NourStore ?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col items-start">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{benefit.title}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 🌟 Section Modes de Paiement & Confiance */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 mt-20"
      >
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-emerald-600 font-semibold text-xs uppercase tracking-wider">Sécurité & Fiabilité</span>
            <h3 className="text-xl font-bold text-gray-900">Paiement simple et sécurisé à Madagascar</h3>
            <p className="text-gray-500 text-xs max-w-xl">
              Réglez vos achats en toute simplicité à la livraison ou via les services de paiement mobile disponibles localement.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className="font-bold text-xs text-gray-800">Mobile Money</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span className="font-bold text-xs text-gray-800">Paiement à la livraison</span>
            </div>
            <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="font-bold text-xs text-gray-800">Virement / Espèces</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}