// app/api/products/route.ts
import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';

// GET : Récupérer tous les produits pour les visiteurs du site
export async function GET() {
  try {
    const products = await productService.getAll();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("Erreur API GET produits :", error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la récupération' }, { status: 500 });
  }
}