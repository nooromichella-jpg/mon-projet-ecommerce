// components/HomeLink.tsx
'use client';

import Link from 'next/link';

export default function HomeLink() {
  return (
    <Link 
      href="/" 
      onClick={() => {
        if (window.location.pathname === '/') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }}
      className="hover:text-emerald-400 transition-colors"
    >
      Accueil
    </Link>
  );
}