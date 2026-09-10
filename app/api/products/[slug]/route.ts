// app/api/products/[slug]/route.ts
import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // On récupère tous les produits depuis Firebase
    const productsList = await productService.getAll();
    
    // On cherche le produit qui correspond au slug
    const product = productsList.find((p: any) => p.slug === slug);

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Erreur API GET produit par slug :", error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}