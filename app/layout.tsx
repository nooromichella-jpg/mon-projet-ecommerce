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
        {/* Gestionnaire de notifications Toast globales */}
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#065f46',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
            },
          }} 
        />

        {/* Barre de navigation globale */}
        <Navbar />
        
        {/* Contenu principal de la page actuelle */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Pied de page */}
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          <p>© 2026 NourStore </p>
        </footer>
      </body>
    </html>
  );
}