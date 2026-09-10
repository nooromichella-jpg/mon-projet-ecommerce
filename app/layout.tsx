// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'NourStore',
  description: 'Projet e-commerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
        <Toaster position="top-right" />
        
        <Navbar />
        
        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          <p>© 2026 NourStore </p>
        </footer>
      </body>
    </html>
  );
}