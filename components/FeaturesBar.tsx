// components/FeaturesBar.tsx
'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Star, Headphones } from 'lucide-react';

export default function FeaturesBar() {
  const features = [
    {
      icon: <Truck className="w-6 h-6 text-emerald-600" />,
      title: 'Livraison Rapide',
      description: 'À Antananarivo et environs',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Paiement Sécurisé',
      description: 'Transactions 100% sécurisées',
    },
    {
      icon: <Star className="w-6 h-6 text-emerald-600" />,
      title: 'Qualité Garantie',
      description: 'Produits sélectionnés avec soin',
    },
    {
      icon: <Headphones className="w-6 h-6 text-emerald-600" />,
      title: 'Support Réactif',
      description: 'À votre écoute du Lundi au Samedi',
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 mt-8 mb-12 relative z-20">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-emerald-50/50 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner shrink-0">
              {feature.icon}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{feature.title}</h4>
              <p className="text-gray-500 text-xs mt-0.5">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}