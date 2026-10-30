# Déploiement en production – ArchiRanin

Architecture : 100 % statique (React/Vite) + Supabase (BDD, Auth, Storage). Aucun serveur backend à payer.

| App | Dossier | Domaine cible | Port local |
|-----|---------|---------------|-----------|
| Site public | `frontend/` | `https://votre-domaine.com` | 5173 |
| Administration | `admin/` | `https://admin.votre-domaine.com` | 5174 |

## 1. Hébergeur recommandé (gratuit)
Cloudflare Pages, Netlify ou Vercel. Les fichiers `public/_redirects` (fallback SPA) et `public/_headers` (sécurité + cache) sont déjà prêts (compatibles Cloudflare Pages et Netlify).

Pour **chaque** projet (frontend et admin) :
- Repository : `maramsahnoun/archiranine`
- Root directory : `frontend` (puis `admin`)
- Build command : `npm run build`
- Output directory : `dist`
- Variables d'environnement : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (voir `.env.production.example`)

## 2. Nom de domaine
1. Acheter le domaine, puis l'ajouter dans l'hébergeur (Custom domain) pour le site public ; ajouter `admin.` pour l'admin.
2. Créer chez le registrar les enregistrements DNS indiqués par l'hébergeur (CNAME vers `*.pages.dev` / `*.netlify.app`, ou A/ALIAS pour l'apex). Le HTTPS est automatique.
3. Rediriger `www` vers l'apex (ou l'inverse) – une seule version canonique.

## 3. Après obtention du domaine (à faire ensemble)
- [ ] Remplacer `archiranin.com` par le vrai domaine dans `frontend/public/sitemap.xml`, `frontend/public/robots.txt`, `frontend/index.html` (canonical, og:url, JSON-LD).
- [ ] Supabase → Authentication → URL Configuration : *Site URL* = `https://admin.votre-domaine.com` et ajouter les deux domaines dans *Redirect URLs*.
- [ ] Supabase → Storage : buckets publics en lecture, écriture réservée aux utilisateurs authentifiés.
- [ ] Créer le compte admin (Authentication → Users) et désactiver l'inscription publique (*Disable signups*).
- [ ] Google Search Console : ajouter la propriété, soumettre `https://votre-domaine.com/sitemap.xml`.
- [ ] Remplacer l'image `og:image` par un visuel hébergé sur le domaine (1200×630).

## 4. Sécurité – IMPORTANT
- Le mot de passe de la base et la clé `service_role` ont été partagés en clair dans une conversation : **les régénérer** (Supabase → Project Settings → Database → Reset password ; API → rotate JWT secret / keys) avant la mise en ligne.
- La clé `service_role` ne doit **jamais** être utilisée dans `frontend/` ou `admin/` ni commitée. Seule la clé `anon` (publique) est utilisée côté navigateur, protégée par les politiques RLS de `database/supabase_schema.sql`.
- Restreindre la politique d'insertion des messages (anti-spam) : ajouter un captcha (Cloudflare Turnstile) ou une limite côté Supabase avant le lancement.

## 5. Vérifications avant mise en ligne
```bash
cd frontend && npm ci && npm run build && npm run preview
cd ../admin && npm ci && npm run build && npm run preview
```
- Lighthouse (Performance / SEO / Accessibilité) ≥ 90.
- Chunk JS principal > 1 Mo : prévoir un code-splitting (`React.lazy` pour les pages et la 3D) – optimisation recommandée.
- Tester : accueil, projets, détail d'un projet + visionneuse 3D, contact, 404, mobile.
