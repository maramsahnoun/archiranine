# ArchiRanin — Architecture d’Intérieur & Design d'Espace

Plateforme de portfolio et d'administration moderne pour l’architecte d’intérieur **Ranine Sahnoun (ArchiRanin)**.

Ce projet a été optimisé pour **réduire à 100% les coûts d’hébergement (0€ / mois)** en éliminant le serveur backend dédié au profit d’une connexion directe à **Supabase** (Base de données PostgreSQL, Authentification, Stockage de fichiers et API serverless), tout en maximisant le **SEO** et l'**expérience 3D interactive**.

---

## Architecture

- **`frontend/`** : Site vitrine public (React + Vite + Three.js + Tailwind CSS)
  - Visualisation 3D interactive (`.glb` / Three.js OrbitControls)
  - Nuancier architectural & palette de matières
  - Galerie de rendus haute définition avec zoom plein écran
  - Plans 2D d'aménagement consultables et téléchargeables en PDF
  - Support des visites vidéo (YouTube, Vimeo, MP4 direct)
  - Formulaire de contact connecté directement à Supabase
  - Bouton direct WhatsApp (+216 46 412 009)
  - 100% optimisé SEO (JSON-LD Schema, OpenGraph, Balises Meta, Sitemap, Robots.txt)
- **`admin/`** : Tableau de bord administratif sécurisé (React + Vite + Supabase Auth & Storage)
  - Gestion des projets (création, modification, publication, archivage)
  - Upload direct vers Supabase Storage des modèles 3D (`.glb`), photos et plans PDF
  - Gestion des catégories
  - Lecture et gestion des messages de contact clients
  - Configuration du site et réseaux sociaux (LinkedIn, WhatsApp, etc.)

---

## Lancement local

### 1. Site Public (Frontend)

```bash
cd frontend
npm install
npm run dev
```

Disponible sur `http://localhost:5173`.

### 2. Administration

```bash
cd admin
npm install
npm run dev
```

Disponible sur `http://localhost:5174`.

#### Identifiants Administrateur créés :
- **Email** : `sahnounranine8@gmail.com` (ou `admin@archiranin.com`)
- **Mot de passe** : `AdminPassword2026!`

---

## Données & Supabase

- **Projet Supabase** : `https://kptfmbhhrjqhyhcknhxc.supabase.co`
- **Bucket Storage Public** : `archiranin`
- **Schéma SQL** : `database/supabase_schema.sql`
- **Projet exemple importé** : *Villa 1 - Résidence Contemporaine*
  - 8 rendus 3D HD
  - 2 plans 2D PDF (Rez-de-chaussée et Étage)
  - 1 modèle 3D interactif `villa-1.glb` (10 Mo)
  - Informations de contact & logo officiel

---

## Déploiement en production (0€ / mois)

Puisqu'aucun serveur backend Node.js n'est nécessaire :
1. Déployez `frontend` sur **Vercel**, **Netlify** ou **Cloudflare Pages** (gratuit).
2. Déployez `admin` sur un sous-domaine (ex: `admin.archiranin.com` ou via Vercel).
3. Renseignez les variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans votre interface d'hébergement.
