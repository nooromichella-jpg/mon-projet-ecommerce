// app/checkout/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Antananarivo',
  });

  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Votre panier est vide !");
      return;
    }

    setLoading(true);

    try {
      // 1. Décrémenter le stock de chaque produit dans Firestore
      for (const item of items) {
        const productRef = doc(db, 'products', item.id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
          const productData = productSnap.data();
          const currentStock = productData.stock !== undefined ? productData.stock : (productData.quantity || 0);
          const newStock = Math.max(0, currentStock - item.quantity);

          await updateDoc(productRef, {
            stock: newStock
          });
        }
      }

      // 2. Enregistrement de la commande dans la collection Firestore "orders"
      await addDoc(collection(db, 'orders'), {
        customer: formData,
        items: items,
        totalAmount: totalPrice,
        status: 'En attente',
        createdAt: serverTimestamp(),
      });

      // 3. Préparer le message WhatsApp avec ton numéro
      const adminPhoneNumber = "261322098269"; 
      const itemsListText = items.map(i => `- ${i.name} (x${i.quantity}) : ${(i.price * i.quantity).toLocaleString()} Ar`).join('\n');
      
      const whatsappMessage = `*Nouvelle Commande sur NourStore !* 🛍️\n\n` +
        `*Client :* ${formData.fullName}\n` +
        `*Téléphone :* ${formData.phone}\n` +
        `*Adresse :* ${formData.address}, ${formData.city}\n\n` +
        `*Produits commandés :*\n${itemsListText}\n\n` +
        `*Total à payer :* ${totalPrice.toLocaleString()} Ar`;

      const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      toast.success("Commande validée avec succès ! 🎉");
      clearCart();

      // Ouvre WhatsApp automatiquement avec le résumé de la commande
      window.open(whatsappUrl, '_blank');

      router.push('/');
    } catch (error) {
      console.error("Erreur lors de la validation de la commande :", error);
      toast.error("Une erreur est survenue lors de la validation.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-6xl mb-4 block">🛒</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-500 mb-6">Ajoutez des produits avant de passer à la caisse.</p>
        <Link href="/products" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition">
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Formulaire de livraison */}
        <form onSubmit={handleSubmitOrder} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Informations de livraison</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <input 
              type="text" 
              name="fullName" 
              required 
              value={formData.fullName} 
              onChange={handleChange}
              placeholder="Ex: Randria Jean" 
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de téléphone</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              value={formData.phone} 
              onChange={handleChange}
              placeholder="Ex: 034 00 000 00" 
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse exacte</label>
            <input 
              type="text" 
              name="address" 
              required 
              value={formData.address} 
              onChange={handleChange}
              placeholder="Ex: Lot II Bis 67Ha" 
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
            <select 
              name="city" 
              value={formData.city} 
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
            >
              <option value="Antananarivo">Antananarivo</option>
              <option value="Autres villes">Autres villes (Madagascar)</option>
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-600/20 transition duration-200 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Traitement en cours..." : "Confirmer la commande"}
          </button>
        </form>

        {/* Résumé du panier */}
        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 h-fit space-y-6">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4">Résumé de votre panier</h2>

          <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-white" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-gray-500">Qté : {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-emerald-600 text-sm">
                  {(item.price * item.quantity).toLocaleString()} Ar
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Sous-total</span>
              <span>{totalPrice.toLocaleString()} Ar</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Livraison à Antananarivo</span>
              <span className="text-emerald-600 font-medium">Gratuite</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-gray-900 pt-2 border-t">
              <span>Total à payer</span>
              <span className="text-emerald-600">{totalPrice.toLocaleString()} Ar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}