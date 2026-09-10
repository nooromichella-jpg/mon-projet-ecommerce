// app/api/admin/orders/route.ts
import { NextResponse } from 'next/server';
// Ici tu pourrais utiliser firebase-admin côté serveur si besoin

export async function GET() {
  try {
    // Logique serveur / base de données
    return NextResponse.json({ success: true, message: "Données récupérées via l'API" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}