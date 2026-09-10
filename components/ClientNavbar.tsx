// components/ClientNavbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ClientNavbar() {
  const pathname = usePathname();

  // Masquer la Navbar sur /login et sur toutes les pages qui commencent par /admin
  if (pathname === '/login' || pathname?.startsWith('/admin')) {
    return null;
  }

  return <Navbar />;
}