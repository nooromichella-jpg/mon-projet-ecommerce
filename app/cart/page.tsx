// app/cart/page.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import Link from 'next/link';
import { ArrowLeft, Trash2, ShoppingBag, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Lien de retour */}
        <Link 
          href="/products" 
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" /> Continuer mes achats
        </Link>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Mon Panier et Validation</h1>

        {/* Message d'alerte ou de succès */}
        {message && (
          <div className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2.5 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-slate-600 text-sm font-medium">Votre panier est actuellement vide.</p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl transition shadow-xs text-xs font-medium">
              Découvrir les produits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleCheckout} className="space-y-6">
            
            {/* Liste des articles */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 divide-y divide-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Articles dans le panier</h2>
              
              {items.map((item, index) => {
                const qty = item.quantity || 1;
                return (
                  <div key={`${item.id}-${index}`} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between first:pt-0 last:pb-0 gap-4">
                    <div className="flex items-center space-x-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs shrink-0 font-bold">IMG</div>
                      )}
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                        <p className="text-emerald-600 font-mono font-bold text-xs mt-0.5">{item.price.toLocaleString()} Ar</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                        <button 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, qty - 1)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono font-bold text-xs text-slate-900">{qty}</span>
                        <button 
                          type="button"
                          onClick={() => handleQuantityChange(item.id, qty + 1)}
                          className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs font-medium transition cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Formulaire d'informations de livraison */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Informations de livraison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nom complet *</label>
                  <input 
                    type="text" 
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    placeholder="Ex: Jean Rakoto" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Téléphone *</label>
                  <input 
                    type="tel" 
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    placeholder="Ex: 034 00 000 00" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Adresse de livraison *</label>
                <input 
                  type="text" 
                  required
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  placeholder="Ex: Lot II A 15 Analamahitsy, Tana" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email (facultatif)</label>
                <input 
                  type="email" 
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  placeholder="Ex: jean@example.com" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Résumé et bouton de validation */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase font-medium">Total à payer :</p>
                <p className="text-2xl font-mono font-bold text-emerald-600">{total.toLocaleString()} Ar</p>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  type="button"
                  onClick={clearCart} 
                  disabled={loading}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition cursor-pointer text-xs font-medium disabled:opacity-50"
                >
                  Vider le panier
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-medium transition cursor-pointer shadow-sm disabled:opacity-50 text-xs text-center"
                >
                  {loading ? 'Validation en cours...' : 'Confirmer la commande 🛒'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}