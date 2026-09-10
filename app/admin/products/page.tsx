// app/admin/products/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // États pour les modales
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // Pour "Détails"
  const [editingProduct, setEditingProduct] = useState<any>(null);   // Pour "Modifier"

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
          resolvedDescription: data.description || 'Aucune description disponible.'
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

  const handleDelete = async (productId: string, productName: string) => {
    if (window.confirm(`Voulez-vous vraiment supprimer le produit "${productName}" ?`)) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        alert("Impossible de supprimer ce produit.");
      }
    }
  };

  // Enregistrement des modifications d'un produit
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const productRef = doc(db, 'products', editingProduct.id);
      await updateDoc(productRef, {
        name: editingProduct.resolvedName,
        price: Number(editingProduct.resolvedPrice),
        stock: Number(editingProduct.resolvedStock),
        description: editingProduct.resolvedDescription
      });
      setEditingProduct(null);
      fetchProducts(); // Recharge la liste
    } catch (err) {
      console.error("Erreur lors de la modification :", err);
      alert("Erreur lors de la mise à jour du produit.");
    }
  };

  const filteredProducts = products.filter(product =>
    product.resolvedName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Catalogue des produits</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gérez votre inventaire, les prix et les stocks de la boutique.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition shadow-sm"
        >
          + Nouveau Produit
        </Link>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Rechercher un produit dans l'inventaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
        />
        <div className="text-xs text-slate-400 font-medium shrink-0">
          {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 font-mono text-xs">Chargement du catalogue...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <p className="text-slate-500 text-xs">Aucun produit trouvé.</p>
            <Link href="/admin/products/new" className="text-xs font-semibold text-emerald-600 hover:underline">
              Ajouter votre premier produit
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Produit</th>
                  <th className="py-3 px-4">Prix</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Statut Stock</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredProducts.map((product) => {
                  const isLowStock = product.resolvedStock <= 5;
                  const isOutOfStock = product.resolvedStock === 0;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {product.resolvedImage ? (
                          <img
                            src={product.resolvedImage}
                            alt={product.resolvedName}
                            className="w-10 h-10 object-cover rounded-xl border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 text-xs shrink-0 font-bold">
                            IMG
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{product.resolvedName}</p>
                          <p className="text-[11px] text-slate-400 font-mono">ID: {product.id}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900">
                        {product.resolvedPrice.toLocaleString()} Ar
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        {product.resolvedStock}
                      </td>
                      <td className="py-3 px-4">
                        {isOutOfStock ? (
                          <span className="px-2.5 py-1 text-[10px] font-semibold bg-rose-50 text-rose-600 rounded-full border border-rose-100">
                            Rupture
                          </span>
                        ) : isLowStock ? (
                          <span className="px-2.5 py-1 text-[10px] font-semibold bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                            Stock faible
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                            En stock
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-[11px] border border-slate-200"
                        >
                          Détails
                        </button>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium transition text-[11px] border border-indigo-100"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.resolvedName)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium transition text-[11px] border border-rose-100"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODALE DE DÉTAILS --- */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Détails du produit</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              {selectedProduct.resolvedImage && (
                <img src={selectedProduct.resolvedImage} alt="" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
              )}
              <div>
                <span className="font-semibold text-slate-400">Nom :</span>
                <p className="font-bold text-slate-900 text-sm">{selectedProduct.resolvedName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-slate-400">Prix :</span>
                  <p className="font-mono font-bold text-emerald-600">{selectedProduct.resolvedPrice.toLocaleString()} Ar</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-400">Stock disponible :</span>
                  <p className="font-mono font-bold">{selectedProduct.resolvedStock}</p>
                </div>
              </div>
              <div>
                <span className="font-semibold text-slate-400">Description :</span>
                <p className="text-slate-600 mt-0.5">{selectedProduct.resolvedDescription}</p>
              </div>
            </div>
            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODALE DE MODIFICATION --- */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form onSubmit={handleUpdateSubmit} className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Modifier le produit</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div>
                <label className="font-semibold text-slate-500 block mb-1">Nom du produit</label>
                <input
                  type="text"
                  value={editingProduct.resolvedName}
                  onChange={(e) => setEditingProduct({ ...editingProduct, resolvedName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Prix (Ar)</label>
                  <input
                    type="number"
                    value={editingProduct.resolvedPrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, resolvedPrice: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-500 block mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.resolvedStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, resolvedStock: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 font-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold text-slate-500 block mb-1">Description</label>
                <textarea
                  value={editingProduct.resolvedDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, resolvedDescription: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition shadow-sm"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}