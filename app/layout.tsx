// app/layout.tsx
'use client'; // Indique que c'est un Client Component pour utiliser usePathname

import './globals.css';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import HomeLink from '../components/HomeLink'; 
import ScrollToTop from '../components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation'; // Import pour détecter la route active

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Vérifie si l'URL actuelle commence par /admin
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between">
        <Toaster position="top-right" />
        
        <div>
          <Navbar />
          <main>
            {children}
          </main>
        </div>

        {/* 🌟 Bouton Retour en haut (Masqué dans l'admin) */}
        {!isAdminRoute && <ScrollToTop />}

        {/* Footer masqué automatiquement si on est dans /admin */}
        {!isAdminRoute && (
          <footer className="bg-white text-slate-600 text-xs py-16 px-6 border-t border-slate-200 relative mt-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-30"></div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
              {/* Logo & Description */}
              <div className="space-y-4">
                <h3 className="text-slate-900 font-extrabold text-sm tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  NourStore
                </h3>
                <p className="text-slate-500 leading-relaxed text-xs">
                  Votre destination shopping de référence à Antananarivo, Madagascar. Retrouvez le meilleur du style et de la technologie.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 text-emerald-600">Navigation</h4>
                <ul className="space-y-2.5">
                  <li><HomeLink /></li>
                  <li><Link href="/products" className="hover:text-emerald-600 transition-colors">Catalogue Produits</Link></li>
                  <li><Link href="/login" className="hover:text-emerald-600 transition-colors">Mon Compte</Link></li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 text-emerald-600">Contact</h4>
                <ul className="space-y-2.5 text-slate-500">
                  <li className="flex items-start gap-2">
                    <span>Lot Près FMAI 56Bis 67ha Sud<br />Antananarivo, Madagascar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>+261 34 00 000 00</span>
                  </li>
                </ul>
              </div>

              {/* Horaires */}
              <div>
                <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 text-emerald-600">Horaires</h4>
                <ul className="space-y-2.5 text-slate-500">
                  <li className="flex items-center gap-2">
                    <span>Lun - Sam : 8h00 - 18h00</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>Dimanche : Fermé</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="max-w-6xl mx-auto border-t border-slate-100 pt-6 text-center text-slate-400 text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>© 2026 NourStore. Tous droits réservés.</p>
              <p className="text-slate-500">Conçu avec passion à Antananarivo 🇲🇬</p>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}