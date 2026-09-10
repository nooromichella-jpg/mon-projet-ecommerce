// app/admin/orders/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour la recherche et les filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // État pour la modale de détails
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const list = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          resolvedAmount: data.totalAmount ?? data.total ?? data.amount ?? data.price ?? data.montant ?? 0,
          resolvedCustomerName: data.customer?.fullName ?? data.customer?.name ?? data.customerName ?? 'Client inconnu',
          resolvedPhone: data.customer?.phone ?? data.customer?.telephone ?? data.phone ?? 'Non renseigné',
          resolvedCity: data.customer?.city ?? data.customer?.ville ?? data.city ?? 'Antananarivo',
          resolvedStatus: data.status ?? data.statut ?? 'En attente',
          resolvedItems: data.items ?? data.products ?? [],
          createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'Récemment'
        };
      });
      setOrders(list);
    } catch (err) {
      console.error("Erreur lors du chargement des commandes :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Changer le statut d'une commande
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, resolvedStatus: newStatus } : o));
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      alert("Impossible de modifier le statut.");
    }
  };

  // Fonction pour exporter en CSV les commandes filtrées
  const handleExportCSV = () => {
    const headers = "ID,Client,Telephone,Ville,Date,Statut,Montant\n";
    const rows = filteredOrders.map(o => 
      `"${o.id}","${o.resolvedCustomerName}","${o.resolvedPhone}","${o.resolvedCity}","${o.createdAt}","${o.resolvedStatus}",${o.resolvedAmount}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `commandes_nourstore_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrage par recherche et par statut
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.resolvedCustomerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.resolvedPhone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && order.resolvedStatus.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Gestion des Commandes</h1>
          <p className="text-xs text-slate-500 mt-0.5">Suivi des statuts clients, montants et adresses de livraison.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-xs transition border border-emerald-200 shadow-sm"
          >
            📥 Exporter en CSV
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition"
          >
            ← Tableau de bord
          </Link>
        </div>
      </div>

      {/* Barre de recherche et Filtres par statut */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Rechercher par nom, téléphone ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:max-w-xs px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-700"
        />

        {/* Onglets de filtres */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['ALL', 'En attente', 'Validée', 'Livrée'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
                statusFilter === status 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {status === 'ALL' ? 'Toutes' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Tableau des commandes */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 font-mono text-xs">Chargement des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-1">
            <p className="text-slate-500 text-xs">Aucune commande trouvée.</p>
            <p className="text-slate-400 text-[11px]">Modifiez vos filtres de recherche.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Téléphone / Ville</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredOrders.map((order) => {
                  const statusColor = 
                    order.resolvedStatus.toLowerCase().includes('livr') ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    order.resolvedStatus.toLowerCase().includes('valid') ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                    order.resolvedStatus.toLowerCase().includes('annul') ? 'bg-rose-50 text-rose-600 border-rose-100' :
                    'bg-amber-50 text-amber-600 border-amber-100';

                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{order.resolvedCustomerName}</p>
                        <p className="text-[11px] text-slate-400 font-mono">ID: {order.id.slice(0, 8)}...</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-mono text-slate-800">{order.resolvedPhone}</p>
                        <p className="text-[11px] text-slate-400">{order.resolvedCity}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {order.createdAt}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {order.resolvedAmount.toLocaleString()} Ar
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.resolvedStatus}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border focus:outline-none cursor-pointer ${statusColor}`}
                        >
                          <option value="En attente">En attente</option>
                          <option value="Validée">Validée</option>
                          <option value="Livrée">Livrée</option>
                          <option value="Annulée">Annulée</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-[11px] border border-slate-200"
                        >
                          Détails
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

      {/* --- MODALE DE DÉTAILS DE LA COMMANDE --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Détails de la commande</h3>
                <p className="text-[11px] font-mono text-slate-400">ID: {selectedOrder.id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="font-semibold text-slate-400 block">Client</span>
                  <span className="font-bold text-slate-900">{selectedOrder.resolvedCustomerName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-400 block">Téléphone</span>
                  <span className="font-mono text-slate-900">{selectedOrder.resolvedPhone}</span>
                </div>
                <div className="col-span-2 pt-1">
                  <span className="font-semibold text-slate-400 block">Ville / Adresse</span>
                  <span className="text-slate-800">{selectedOrder.resolvedCity}</span>
                </div>
              </div>

              <div>
                <p className="font-semibold text-slate-500 mb-2">Articles commandés :</p>
                <div className="max-h-40 overflow-y-auto space-y-2 border border-slate-100 rounded-xl p-2 bg-slate-50/50">
                  {selectedOrder.resolvedItems.length === 0 ? (
                    <p className="text-slate-400 text-center py-2">Aucun détail d'article disponible.</p>
                  ) : (
                    selectedOrder.resolvedItems.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name || item.title || 'Produit'}</p>
                          <p className="text-[10px] text-slate-400">Qté : {item.quantity || item.qty || 1}</p>
                        </div>
                        <p className="font-mono font-medium text-slate-900">
                          {((item.price || 0) * (item.quantity || item.qty || 1)).toLocaleString()} Ar
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-bold text-sm">
                <span className="text-slate-500">Montant Total :</span>
                <span className="font-mono text-emerald-600">{selectedOrder.resolvedAmount.toLocaleString()} Ar</span>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}