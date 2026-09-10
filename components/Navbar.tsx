// components/Navbar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../store/useCartStore';
import CartDrawer from './CartDrawer';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
}

export default function Navbar() {
  const cartItemsCount = useCartStore((state) => 
    state.items.reduce((total, item) => total + (item.quantity || 1), 0)
  );
  const openCart = useCartStore((state) => state.openCart);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Effet pour récupérer et filtrer les produits en temps réel
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsSearching(true);
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const filtered = data.data.filter((product: Product) =>
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filtered.slice(0, 5)); // Limiter à 5 suggestions max
          }
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Fermer les suggestions si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSuggestions([]);
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <Link href="/" className="text-xl font-bold text-gray-900 flex items-center gap-2 shrink-0">
             <span className="text-emerald-600 hover:opacity-90 transition">NourStore</span>
          </Link>

          {/* Barre de recherche avec suggestions instantanées */}
          <div className="flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit..."
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition shadow-xs"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded-r-xl text-sm font-medium transition flex items-center justify-center cursor-pointer"
              >
                🔍
              </button>
            </form>

            {/* 🌟 Liste déroulante des suggestions en temps réel */}
            {suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                {suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    onClick={() => {
                      setSuggestions([]);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-none"
                  >
                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{product.name}</h4>
                      <p className="text-emerald-600 font-semibold text-xs">{product.price.toLocaleString()} Ar</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6 shrink-0">
            <Link href="/" className="text-gray-600 hover:text-emerald-600 font-medium transition duration-200">
              Accueil
            </Link>

            <Link href="/products" className="text-gray-600 hover:text-emerald-600 font-medium transition duration-200">
              Produits
            </Link>

            <button 
              onClick={openCart}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-200 border border-gray-200 transform hover:scale-105 active:scale-95 shadow-xs cursor-pointer"
            >
              <span>Panier</span>
              <span className="bg-emerald-600 text-white font-bold text-xs px-2 py-0.5 rounded-full transition-transform animate-pulse">
                {cartItemsCount}
              </span>
            </button>
          </div>
        </div>
      </nav>

      <CartDrawer />
    </>
  );
}