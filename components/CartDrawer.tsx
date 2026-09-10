// components/CartDrawer.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Arrière-plan semi-transparent assombri */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
          />

          {/* Panneau latéral coulissant */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* En-tête du Drawer */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">Mon Panier</h2>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
                    {totalItemsCount}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Liste des articles */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-20">
                    <span className="text-5xl mb-4 block">🛒</span>
                    <p className="text-gray-500 font-medium">Votre panier est vide</p>
                    <p className="text-gray-400 text-sm mt-1">Découvrez nos produits pour commencer vos achats.</p>
                    <button
                      onClick={closeCart}
                      className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition cursor-pointer"
                    >
                      Commencer le shopping
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100 items-center">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-white" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-emerald-600 font-semibold text-sm mt-0.5">{item.price.toLocaleString()} Ar</p>
                        
                        {/* Contrôles de quantité */}
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-bold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium transition cursor-pointer"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pied du Drawer (Total & Bouton de commande) */}
              {items.length > 0 && (
                <div className="border-t border-gray-100 p-6 bg-gray-50 space-y-4">
                  <div className="flex justify-between items-center text-base">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-extrabold text-gray-900 text-lg">{totalPrice.toLocaleString()} Ar</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-emerald-600/20 text-center block transition cursor-pointer"
                  >
                    Commander (Passer à la caisse)
                  </Link>
                  <button
                    onClick={closeCart}
                    className="w-full text-gray-500 hover:text-gray-800 font-medium text-sm text-center transition cursor-pointer"
                  >
                    Continuer mes achats
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}