// services/productService.ts
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from "firebase/firestore";

// Nom de la collection dans Firestore
const COLLECTION_NAME = "products";

export const productService = {
  // 1. Récupérer tous les produits depuis Firestore
  async getAll() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const products: any[] = [];
      querySnapshot.forEach((docSnap) => {
        products.push({
          id: docSnap.id,
          ...docSnap.data(),
        });
      });
      return products;
    } catch (error) {
      console.error("Erreur lors de la récupération des produits :", error);
      return [];
    }
  },

  // 2. Ajouter un nouveau produit dans Firestore
  async create(body: any) {
    try {
      const newProductData = {
        name: body.name || 'Nouveau produit',
        price: Number(body.price) || 0,
        category: body.category || 'accessoires', // 👈 Ajouté ici pour enregistrer la catégorie
        image: body.image || '',
        slug: body.slug || 'nouveau-produit',
        description: body.description || '',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newProductData);
      
      return {
        id: docRef.id,
        ...newProductData,
      };
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit :", error);
      throw error;
    }
  },

  // 3. Mettre à jour un produit existant dans Firestore
  async update(id: string, updatedData: any) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updatedData);
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      return false;
    }
  },

  // 4. Supprimer un produit de Firestore
  async remove(id: string) {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      return false;
    }
  }
};