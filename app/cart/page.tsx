// app/cart/page.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  quantity?: number;
}

export default function CartPage() {
  const cartStore = useCartStore() as any;
  const items: CartItem[] = cartStore.items;
  const removeItem = cartStore.removeItem;
  const clearCart = cartStore.clearCart;
  const updateQuantity = cartStore.updateQuantity;

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // États pour les informations du client
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
  });

  const total = items.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleQuantityChange = (id: string, newQty: number) => {
    if (newQty <= 0) {
      removeItem(id);
    } else if (updateQuantity) {
      updateQuantity(id, newQty);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/cart/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, total, customer }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: data.message, type: 'success' });
        clearCart(); // Vide le panier après validation
      } else {
        setMessage({ text: data.message || 'Une erreur est survenue.', type: 'error' });
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
      setMessage({ text: 'Impossible de contacter le serveur.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/products" className="text-blue-600 hover:underline mb-6 inline-block font-medium">
          &larr; Continuer mes achats
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-gray-900">Mon Panier et Validation</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-md">
            <p className="text-gray-600 text-lg mb-4">Votre panier est vide.</p>
            <Link href="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg transition inline-block shadow-sm">
              Découvrir les produits
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-8">
            {/* Liste des articles */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 divide-y divide-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Articles dans le panier</h2>
              {items.map((item, index) => {
                const qty = item.quantity || 1;
                return (
                  <div key={`${item.id}-${index}`} className="py-4 flex items-center justify-between first:pt-0 last:pb-0 gap-4">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-100" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-emerald-600 font-bold">{item.price.toLocaleString()} Ar</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                        <button 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, qty - 1)}
                          className="w-7 h-7 bg-white hover:bg-gray-100 text-gray-700 rounded shadow-xs flex items-center justify-center font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium text-sm">{qty}</span>
                        <button 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, qty + 1)}
                          className="w-7 h-7 bg-white hover:bg-gray-100 text-gray-700 rounded shadow-xs flex items-center justify-center font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Formulaire d'informations de livraison */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Informations de livraison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input 
                    type="text" 
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Ex: Jean Rakoto" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input 
                    type="tel" 
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Ex: 034 00 000 00" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                <input 
                  type="text" 
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Ex: Lot II A 15 Analamahitsy" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (facultatif)</label>
                <input 
                  type="email" 
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="Ex: jean@example.com" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Résumé et bouton de validation */}
            <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-gray-600">Total à payer :</p>
                <p className="text-3xl font-bold text-emerald-600">{total.toLocaleString()} Ar</p>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                <button 
                  type="button"
                  onClick={clearCart} 
                  disabled={loading}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition cursor-pointer font-medium disabled:opacity-50"
                >
                  Vider
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition cursor-pointer shadow-sm disabled:opacity-50 text-center"
                >
                  {loading ? 'Validation en cours...' : 'Confirmer la commande'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}