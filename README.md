# NourStore 

NourStore est une plateforme e-commerce moderne et performante, dotée d'un tableau de bord administrateur sécurisé, d'une gestion de stock en temps réel, d'un suivi analytique des ventes et de notifications automatisées.

---

## 1. Fonctionnalités Principales

### Côté Public (Client)
* **Catalogue dynamique** : Exploration des produits par catégories (High-Tech, Mode, Accessoires).
* **Panier et Passage de commande** : Ajout d'articles et validation de commande fluide.
* **API Sécurisée** : Routes publiques optimisées en lecture seule (`GET`).

### Côté Administration (Tableau de bord d'administration)
* **Double mode d'authentification** : Connexion sécurisée par Email/Mot de passe ou Google Sign-In avec vérification rigoureuse des rôles (`isadmin`) dans Firestore.
* **Gestion des stocks en temps réel** : Décrémentation automatique des stocks lors de la validation des commandes.
* **Analytique visuelle** : Suivi des revenus et des performances de vente grâce à des graphiques interactifs (Recharts).
* **Notifications WhatsApp** : Envoi automatique d'alertes instantanées au vendeur lors d'une nouvelle commande.
* **CRUD complet** : Ajout, modification et suppression de produits sécurisés via une API dédiée.

---

## 2. Modèles de Données & Relations (Firestore)

La base de données NoSQL (Cloud Firestore) s'articule autour de collections principales interconnectées :

###  Collection : `products` (Produits)
Représente les articles en vente dans le catalogue.
* `id` (String / Auto-generated) : Identifiant unique du produit.
* `name` (String) : Nom du produit.
* `description` (String) : Description détaillée.
* `price` (Number) : Prix unitaire.
* `category` (String) : Catégorie (High-Tech, Mode, etc.).
* `stock` (Number) : Quantité disponible en temps réel (mise à jour automatique à chaque commande).
* `image` (String) : URL de l'image du produit.

### Collection : `users` (Utilisateurs & Rôles)
Gère les profils et les permissions d'accès.
* `uid` (String) : ID unique provenant de Firebase Authentication.
* `email` (String) : Adresse email de l'utilisateur.
* `isAdmin` (Boolean) : Indicateur de privilège (`true` pour l'administrateur, `false` pour les clients).
* `createdAt` (Timestamp) : Date de création du compte.

###  Collection : `orders` (Commandes)
Stocke l'historique des achats effectués par les clients.
* `id` (String) : ID unique de la commande.
* `clientName` (String) : Nom ou identifiant du client.
* `items` (Array d'objets) : Liste des produits commandés (chaque élément contient `productId`, `quantity`, et `price`).
* `totalAmount` (Number) : Montant total de la commande.
* `status` (String) : État de la commande (*En attente*, *Validée*, *Expédiée*).
* `createdAt` (Timestamp) : Date et heure de la commande.

---

## 3. 🔌 Documentation des API

L'application expose des routes API REST pour interagir avec Firestore de manière sécurisée.

### A. API Publique (`/api/products`)
* **`GET /api/products`**
  * **Description** : Récupère la liste complète de tous les produits disponibles dans le catalogue.
  * **Accès** : Public (lecture seule).

### B. API Administration & Gestion (`/api/checkout` & `/api/products`)
* **`POST /api/checkout`**
  * **Description** : Enregistre une nouvelle commande, met à jour (décrémente) le stock des produits dans Firestore et déclenche les notifications.
  * **Accès** : Public / Client.
* **`POST /api/products`**
  * **Description** : Ajoute un nouveau produit au catalogue.
  * **Accès** : Sécurisé (Admin uniquement).
* **`PUT /api/products/[id]`**
  * **Description** : Modifie les informations ou réajuste le stock d'un produit.
  * **Accès** : Sécurisé (Admin uniquement).
* **`DELETE /api/products/[id]`**
  * **Description** : Supprime un produit de la base de données.
  * **Accès** : Sécurisé (Admin uniquement).

---

## 4. Technique d'empilement

* **Framework** : Next.js (App Router)
* **Style** : Tailwind CSS
* **Base de données & Auth** : Firebase (Firestore, Authentification, Google Provider)
* **Graphiques** : Recharts
* **Notifications** : React Hot Toast

---

## 5. Architecture du Projet

```text
nourstore/
├── app/
│   ├── admin/          # Panneaux de gestion & page de login sécurisée
│   ├── api/            # Routes API (séparation public / admin)
│   │   ├── products/   # API Publique (GET) & Gestion Admin (POST, PUT, DELETE)
│   │   └── checkout/   # API de traitement des commandes & flux de stock
│   ├── page.tsx        # Page d'accueil e-commerce
│   ├── layout.tsx      # Structure globale & providers
│   └── globals.css     # Styles globaux Tailwind
├── components/         # Composants réutilisables (Navbar, Panier, Cartes, Graphiques)
├── lib/                # Configuration (Firebase, services externes)
├── services/           # Logique métier et appels de données
├── package.json        # Dépendances du projet
└── README.md           # Documentation du projet
