// app/products/page.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { LayoutGrid, List, Search, ArrowUpDown, Tag, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore'; // Import du store Zustand

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  
  // État pour la vue (Grille ou Liste)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Récupération de la fonction addItem du store Zustand
  const addItem = useCartStore((state) => state.addItem);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'products'));
      const list = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          resolvedName: data.name || data.title || 'Produit sans nom',
          resolvedPrice: data.price || data.prix || 0,
          resolvedStock: data.stock !== undefined ? data.stock : (data.quantity || 0),
          resolvedImage: data.image || data.imageUrl || data.photo || '',
          resolvedDescription: data.description || 'Aucune description disponible.',
          resolvedCategory: data.category || 'Général'
        };
      });
      setProducts(list);
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Extraction dynamique de toutes les catégories uniques avec leurs compteurs
  const categoriesWithCount = useMemo(() => {
    const counts: { [key: string]: number } = { Tous: products.length };
    products.forEach(p => {
      const cat = p.resolvedCategory;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts);
  }, [products]);

  // Filtrage et Tri combinés
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.resolvedName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.resolvedDescription.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tous' || product.resolvedCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.resolvedPrice - b.resolvedPrice);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.resolvedPrice - a.resolvedPrice);
    }

    return result;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Fonction d'ajout au panier connectée à Zustand
  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.resolvedName,
      price: product.resolvedPrice,
      image: product.resolvedImage,
      slug: product.id, // ou product.slug selon ton modèle
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Catalogue des produits</h1>
          <p className="text-sm text-slate-500 mt-1">Explorez notre sélection disponible avec livraison rapide à Antananarivo.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Sélecteur de vue Grille / Liste */}
          <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1.5 px-3 font-medium ${viewMode === 'grid' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition cursor-pointer text-xs flex items-center gap-1.5 px-3 font-medium ${viewMode === 'list' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <List className="w-3.5 h-3.5" /> Liste
            </button>
          </div>
        </div>
      </div>

      {/* Barre de recherche et Tri dynamique */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Trier par :</span>
          </div>
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-medium"
          >
            <option value="default">Pertinence / Nouveautés</option>
            <option value="price-asc">Prix : Moins cher au plus cher</option>
            <option value="price-desc">Prix : Plus cher au moins cher</option>
          </select>
        </div>
      </div>

      {/* Onglets de catégories dynamiques avec compteurs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoriesWithCount.map(([category, count]) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition shrink-0 flex items-center gap-2 cursor-pointer ${
              selectedCategory === category
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-3 h-3 opacity-70" />
            <span>{category}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${selectedCategory === category ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Affichage des produits (Grille / Liste) */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm h-72 animate-pulse space-y-4">
              <div className="w-full h-40 bg-slate-100 rounded-xl" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-16 text-center space-y-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 text-sm">Aucun produit ne correspond à vos critères de recherche.</p>
          <button
            onClick={() => { setSearchTerm(''); setSelectedCategory('Tous'); setSortBy('default'); }}
            className="text-xs font-semibold text-emerald-600 hover:underline pt-2 cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* --- VUE GRILLE --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.resolvedStock === 0;

            return (
              <div key={product.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between group hover:shadow-md transition">
                <div>
                  <div className="w-full h-48 rounded-xl bg-slate-100 overflow-hidden mb-4 relative border border-slate-100">
                    {product.resolvedImage ? (
                      <img src={product.resolvedImage} alt={product.resolvedName} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">IMG</div>
                    )}
                    
                    {/* Badge Catégorie */}
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase shadow-sm">
                      {product.resolvedCategory}
                    </span>

                    {/* Badge Local Tana */}
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> Stock Tana
                    </span>

                    {/* Affichage de la rupture de stock si stock = 0 */}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">Rupture</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{product.resolvedName}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mt-1">{product.resolvedDescription}</p>
                  <p className="text-emerald-600 font-mono font-bold text-sm mt-3">{product.resolvedPrice.toLocaleString()} Ar</p>
                </div>

                <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center rounded-xl text-xs font-medium transition cursor-pointer"
                  >
                    Détails
                  </Link>
                  <button
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(product)}
                    className={`flex-1 py-2 text-center rounded-xl text-xs font-medium transition shadow-sm cursor-pointer ${
                      isOutOfStock 
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isOutOfStock ? 'Indisponible' : 'Ajouter 🛒'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* --- VUE LISTE --- */
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
          {filteredProducts.map((product) => {
            const isOutOfStock = product.resolvedStock === 0;

            return (
              <div key={product.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                <div className="flex items-center gap-4">
                  {product.resolvedImage ? (
                    <img src={product.resolvedImage} alt={product.resolvedName} className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs shrink-0 font-bold">IMG</div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                        {product.resolvedCategory}
                      </span>
                      <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" /> Dispo à Tana
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{product.resolvedName}</h3>
                    <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{product.resolvedDescription}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-emerald-600 font-mono font-bold text-sm">{product.resolvedPrice.toLocaleString()} Ar</p>
                    <p className="text-[11px] text-slate-400 font-mono">Stock : {product.resolvedStock}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium transition cursor-pointer"
                    >
                      Détails
                    </Link>
                    <button
                      disabled={isOutOfStock}
                      onClick={() => handleAddToCart(product)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium transition shadow-sm cursor-pointer ${
                        isOutOfStock 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isOutOfStock ? 'Indisponible' : 'Ajouter 🛒'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}