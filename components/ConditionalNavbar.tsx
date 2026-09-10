// components/ConditionalNavbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Masquer la Navbar sur la page de login et sur tout l'espace admin (/admin, /admin/orders, etc.)
  if (pathname === '/login' || pathname?.startsWith('/admin')) {
    return null;
  }

  return <Navbar />;
}