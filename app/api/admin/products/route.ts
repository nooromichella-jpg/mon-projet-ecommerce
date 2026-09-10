// app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { productService } from '@/services/productService';

export async function GET() {
  try {
    const products = await productService.getAll(); // ou ta méthode équivalente
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    console.error("Erreur API Admin GET produits :", error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la récupération' }, { status: 400 });
  }
}
// 1. POST : Ajouter un nouveau produit (Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newProduct = await productService.create(body);

    return NextResponse.json({ 
      success: true, 
      message: 'Produit ajouté avec succès', 
      data: newProduct 
    }, { status: 201 });
  } catch (error) {
    console.error("Erreur API Admin POST produit :", error);
    return NextResponse.json({ success: false, message: 'Erreur lors de l\'ajout' }, { status: 400 });
  }
}

// 2. PUT : Modifier un produit existant (Admin)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updatedData } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID du produit manquant' }, { status: 400 });
    }

    await productService.update(id, updatedData);

    return NextResponse.json({ success: true, message: 'Produit mis à jour avec succès' });
  } catch (error) {
    console.error("Erreur API Admin PUT produit :", error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la mise à jour' }, { status: 400 });
  }
}

// 3. DELETE : Supprimer un produit (Admin)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID du produit manquant' }, { status: 400 });
    }

    await productService.remove(id);

    return NextResponse.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error("Erreur API Admin DELETE produit :", error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la suppression' }, { status: 400 });
  }
}