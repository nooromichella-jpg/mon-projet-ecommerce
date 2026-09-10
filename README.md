# NourStore 🛒

NourStore est une plateforme e-commerce moderne et performante, dotée d'un tableau de bord administrateur sécurisé, d'une gestion de stock en temps réel, d'un suivi analytique des ventes et de notifications automatisées.

---

## Fonctionnalités Principales

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

## Technique d'empilement

* **Framework** : Next.js (App Router)
* **Style** : Tailwind CSS
* **Base de données & Auth** : Firebase (Firestore, Authentification, Google Provider)
* **Graphiques** : Recharts
* **Notifications** : React Hot Toast

---

## Architecture du Projet

```text
nourstore/
├── app/
│   ├── admin/          # Panneaux de gestion & page de login sécurisée
│   ├── api/            # Routes API (séparation public / admin)
│   │   ├── products/   # API Publique (GET)
│   │   └── checkout/   # API Admin (POST, PUT, DELETE)
│   ├── page.tsx        # Page d'accueil e-commerce
│   ├── layout.tsx      # Structure globale & providers
│   └── globals.css     # Styles globaux Tailwind
├── components/         # Composants réutilisables (Navbar, Panier, Cartes, Graphiques)
├── lib/                # Configuration (Firebase, services externes)
├── services/           # Logique métier et appels de données
├── package.json        # Dépendances du projet
└── README.md           # Documentation du projet"# mon-projet-ecommerce"  
