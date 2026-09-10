// app/api/cart/checkout/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, total, customer } = body; // 👈 On récupère aussi les infos client

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Le panier est vide.' },
        { status: 400 }
      );
    }

    // Vérification basique des champs client
    if (!customer || !customer.name || !customer.address || !customer.phone) {
      return NextResponse.json(
        { success: false, message: 'Veuillez remplir tous les champs obligatoires.' },
        { status: 400 }
      );
    }

    // Préparer l'objet commande complet pour Firestore
    const orderData = {
      customer, // Nom, adresse, téléphone, etc.
      items,
      total,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'orders'), orderData);

    return NextResponse.json({
      success: true,
      message: 'Commande validée et enregistrée avec succès !',
      orderId: docRef.id,
    });
  } catch (error) {
    console.error('Erreur lors du checkout :', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur lors de la validation.' },
      { status: 500 }
    );
  }
}