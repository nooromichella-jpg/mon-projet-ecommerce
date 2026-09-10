// app/api/products/[slug]/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.slug;

    if (!identifier || identifier === 'undefined') {
      return NextResponse.json({ success: false, message: "Identifiant manquant" }, { status: 400 });
    }

    // 1. On essaie de récupérer directement le document par son ID Firestore
    const docRef = doc(db, 'products', identifier);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } 
      });
    }

    // 2. Si ce n'est pas un ID, on cherche par le champ "slug" dans la collection
    const productsRef = collection(db, 'products');
    const qSlug = query(productsRef, where('slug', '==', identifier));
    const querySnapshot = await getDocs(qSlug);

    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      return NextResponse.json({ 
        success: true, 
        data: { id: docData.id, ...docData.data() } 
      });
    }

    return NextResponse.json({ success: false, message: "Produit non trouvé" }, { status: 404 });

  } catch (error: any) {
    console.error("Erreur API GET produit :", error);
    return NextResponse.json({ success: false, message: 'Erreur serveur', error: error.message }, { status: 500 });
  }
}