// components/HeroBanner.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroBanner() {
  // États pour stocker la position de la souris (coordonnées X et Y)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    // Calcule la position de la souris de -0.5 à 0.5 par rapport au centre
    const x = (e.clientX / clientWidth - 0.5) * 20; // Amplitude de 20px
    const y = (e.clientY / clientHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="relative h-[85vh] min-h-[550px] w-full overflow-hidden flex items-center bg-gray-950 cursor-default"
    >
      {/* 🎬 Image de fond qui bouge dynamiquement selon la souris */}
      <motion.div 
        animate={{ 
          x: mousePosition.x, 
          y: mousePosition.y,
          scale: 1.08 // Légère échelle pour éviter de voir les bords lors du déplacement
        }}
        transition={{ type: "spring", stiffness: 75, damping: 30 }}
        className="absolute inset-[-20px] z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1600&auto=format&fit=crop" 
          alt="Boutique NourStore" 
          className="w-full h-full object-cover brightness-[0.6]"
        />
        {/* Dégradé sombre pour que le texte ressorte parfaitement */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/50 to-transparent"></div>
      </motion.div>

      {/* Contenu textuel */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full text-white">
        <div className="max-w-2xl">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-6 inline-block backdrop-blur-md">
              ✨ Nouveau sur NourStore
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6"
          >
            La qualité à portée de main, <span className="text-emerald-400">livrée chez vous.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-300 text-base md:text-lg mb-8 leading-relaxed"
          >
            Découvrez notre sélection exclusive de produits high-tech, accessoires et mode. Commandez en quelques clics à Antananarivo !
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Link 
              href="/products" 
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>Voir la boutique</span>
              <span>&rarr;</span>
            </Link>
          </motion.div>

        </div>
      </div>
    </div>
  );
}