// app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface ChartData {
  date: string;
  revenue: number;
}

export default function AdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'orders'));
        let revenue = 0;
        const revenueByDate: { [key: string]: number } = {};

        querySnapshot.docs.forEach(docSnap => {
          const data = docSnap.data();
          const amount = data.totalAmount ?? data.total ?? data.amount ?? data.price ?? data.montant ?? 0;
          revenue += amount;

          // Traitement de la date pour le graphique
          if (data.createdAt) {
            // Convertit le timestamp Firebase en date lisible (ex: "06/06")
            const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            const dateStr = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
            
            revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + amount;
          }
        });

        // Transformer l'objet en tableau trié pour Recharts
        const formattedChartData = Object.keys(revenueByDate).map(date => ({
          date,
          revenue: revenueByDate[date],
        }));

        setTotalRevenue(revenue);
        setTotalOrders(querySnapshot.size);
        setChartData(formattedChartData);
      } catch (err) {
        console.error("Erreur lors du chargement des stats :", err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Tableau de bord</h1>
        <p className="text-xs text-slate-500 mt-0.5">Vue d'ensemble des performances de la plateforme en temps réel.</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Chiffre d'affaires global</p>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalRevenue.toLocaleString()} <span className="text-emerald-600 text-lg">Ar</span></p>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-medium bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">Actif</span>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Commandes enregistrées</p>
            <p className="text-2xl font-bold font-mono text-slate-900 mt-1">{totalOrders}</p>
          </div>
          <span className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-full border border-slate-200">Total</span>
        </div>
      </div>

      {/* Graphique d'évolution des ventes */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Évolution du Chiffre d'affaires</h2>
          <p className="text-xs text-slate-500">Suivi journalier des revenus générés par les commandes.</p>
        </div>

        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`${Number(value).toLocaleString()} Ar`, 'Revenus']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs">
              Aucune donnée de vente disponible pour le graphique pour le moment.
            </div>
          )}
        </div>
      </div>

      {/* Raccourcis système */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Raccourcis système</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Raccourci Commandes */}
          <Link 
            href="/admin/orders"
            className="group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex items-center justify-between"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                Gestion des Commandes
              </h3>
              <p className="text-xs text-slate-500">Suivi des statuts clients, montants et adresses de livraison.</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-4">
              →
            </div>
          </Link>

          {/* Raccourci Produits */}
          <Link 
            href="/admin/products"
            className="group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex items-center justify-between"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                Catalogue Produits
              </h3>
              <p className="text-xs text-slate-500">Modification, suppression, ajout et gestion de l'inventaire.</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-4">
              →
            </div>
          </Link>

          {/* Raccourci Analyses & Performances */}
          <Link 
            href="/admin/analytics"
            className="group bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-emerald-500 hover:shadow-md transition-all duration-200 flex items-center justify-between sm:col-span-2"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors flex items-center gap-2">
                Analyses et Performances
              </h3>
              <p className="text-xs text-slate-500">Vue globale chiffrée, statistiques de vente et suivi des transactions.</p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 ml-4">
              →
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}