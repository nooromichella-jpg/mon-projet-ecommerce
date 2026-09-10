// store/useCartStore.ts
import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean; // État pour savoir si le drawer est ouvert ou fermé
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  
  addItem: (product) => set((state) => {
    const existingIndex = state.items.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      const newItems = [...state.items];
      newItems[existingIndex].quantity += 1;
      return { items: newItems, isOpen: true }; // Ouvre le panier automatiquement à l'ajout
    }
    return { items: [...state.items, { ...product, quantity: 1 }], isOpen: true };
  }),

  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id),
  })),

  updateQuantity: (id, quantity) => set((state) => {
    if (quantity <= 0) {
      return { items: state.items.filter((item) => item.id !== id) };
    }
    return {
      items: state.items.map((item) => item.id === id ? { ...item, quantity } : item),
    };
  }),

  clearCart: () => set({ items: [] }),
}));