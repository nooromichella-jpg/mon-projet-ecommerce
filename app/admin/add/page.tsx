// app/admin/add/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AddProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: 'accessoires',
    image: '',
    slug: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);

  // Génération automatique du slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    
    setForm({
      ...form,
      name: val,
      slug: generatedSlug,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success('Produit ajouté avec succès dans Firebase ! 🎉');
        router.push('/products');
      } else {
        toast.error("Erreur lors de l'ajout du produit.");
      }
    } catch (err) {
      console.error(err);
      toast.error('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Ajouter un produit</h1>
        <Link href="/products" className="text-sm font-medium text-emerald-600 hover:underline">
          ← Retour aux produits
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom du produit</label>
          <input
            type="text"
            placeholder="Ex: Casque Sans Fil Bluetooth"
            value={form.name}
            onChange={handleNameChange}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Prix (en Ariary)</label>
          <input
            type="number"
            placeholder="Ex: 150000"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          >
            <option value="accessoires">Accessoires</option>
            <option value="hightech">High-Tech</option>
            <option value="mode">Mode</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL de l'image</label>
          <input
            type="text"
            placeholder="https://images.unsplash.com/..."
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL unique)</label>
          <input
            type="text"
            placeholder="casque-sans-fil-bluetooth"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            placeholder="Description détaillée du produit..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition h-32 resize-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-emerald-600/20 transition duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Enregistrement en cours...' : 'Ajouter à Firebase '}
        </button>
      </form>
    </div>
  );
}