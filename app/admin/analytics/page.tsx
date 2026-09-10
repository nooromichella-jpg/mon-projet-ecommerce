// app/admin/analytics/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageBasket: 0,
    statusCounts: {
      pending: 0,
      validated: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'orders'));
        
        let revenue = 0;
        let count = querySnapshot.size;
        let statuses: any = { pending: 0, validated: 0, shipped: 0, delivered: 0, cancelled: 0 };
        let ordersList: any[] = [];

        querySnapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          const amount = data.totalAmount ?? data.total ?? data.amount ?? data.price ?? data.montant ?? 0;
          revenue += amount;

          const status = (data.status || data.statut || 'En attente').toLowerCase();
          if (status.includes('attente')) statuses.pending++;
          else if (status.includes('valid')) statuses.validated++;
          else if (status.includes('expédi')) statuses.shipped++;
          else if (status.includes('livr')) statuses.delivered++;
          else if (status.includes('annul')) statuses.cancelled++;
          else statuses.pending++;

          ordersList.push({
            id: docSnap.id,
            amount: amount,
            customerName: data.customer?.fullName ?? data.customer?.name ?? data.customerName ?? 'Client inconnu',
            status: data.status ?? data.statut ?? 'En attente',
            createdAt: data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'Récemment'
          });
        });

        setStats({
          totalRevenue: revenue,
          totalOrders: count,
          averageBasket: count > 0 ? Math.round(revenue / count) : 0,
          statusCounts: statuses
        });
        setRecentOrders(ordersList.slice(0, 5)); // Les 5 dernières commandes
      } catch (err) {
        console.error("Erreur lors du calcul des statistiques :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <p className="text-slate-400 font-mono text-xs">Chargement des statistiques...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Analyses et Performances</h1>
        <p className="text-xs text-slate-500 mt-0.5">Vue globale chiffrée de l'activité de NourStore.</p>
      </div>

      {/* Cartes de métriques clés */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chiffre d'affaires global</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">{stats.totalRevenue.toLocaleString()} <span className="text-sm font-normal text-slate-500">Ar</span></p>
          <p className="text-[11px] text-slate-400 pt-1">Total cumulé des commandes</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nombre de commandes</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{stats.totalOrders}</p>
          <p className="text-[11px] text-slate-400 pt-1">Transactions enregistrées</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Panier moyen</p>
          <p className="text-2xl font-bold font-mono text-indigo-600">{stats.averageBasket.toLocaleString()} <span className="text-sm font-normal text-slate-500">Ar</span></p>
          <p className="text-[11px] text-slate-400 pt-1">Valeur moyenne par commande</p>
        </div>
      </div>

      {/* Répartition par statuts */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">État des commandes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
            <p className="text-[11px] text-slate-500 font-medium">En attente</p>
            <p className="text-lg font-bold font-mono text-slate-800 mt-1">{stats.statusCounts.pending}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
            <p className="text-[11px] text-slate-500 font-medium">Validées</p>
            <p className="text-lg font-bold font-mono text-indigo-600 mt-1">{stats.statusCounts.validated}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
            <p className="text-[11px] text-slate-500 font-medium">Expédiées</p>
            <p className="text-lg font-bold font-mono text-amber-600 mt-1">{stats.statusCounts.shipped}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
            <p className="text-[11px] text-slate-500 font-medium">Livrées</p>
            <p className="text-lg font-bold font-mono text-emerald-600 mt-1">{stats.statusCounts.delivered}</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center col-span-2 sm:col-span-1">
            <p className="text-[11px] text-slate-500 font-medium">Annulées</p>
            <p className="text-lg font-bold font-mono text-rose-600 mt-1">{stats.statusCounts.cancelled}</p>
          </div>
        </div>
      </div>

      {/* Dernières transactions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-3">
        <div className="p-5 pb-0">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aperçu des dernières transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Statut</th>
                <th className="py-3 px-5 text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">Aucune transaction récente.</td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-5 font-semibold text-slate-900">{order.customerName}</td>
                    <td className="py-3 px-5 text-slate-500">{order.createdAt}</td>
                    <td className="py-3 px-5">
                      <span className="px-2.5 py-1 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right font-mono font-medium text-emerald-600">
                      {order.amount.toLocaleString()} Ar
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}