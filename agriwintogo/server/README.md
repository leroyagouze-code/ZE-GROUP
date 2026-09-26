# Serveur AgriWin Togo (panneau d'administration)

Ce petit serveur fait deux choses :
1. Il affiche le site internet, exactement comme avant.
2. Il ajoute une page privée, **`/admin`**, où vous pouvez vous-même ajouter,
   modifier ou supprimer des produits (nom, prix, photo, stock...) et changer
   les coordonnées du site (téléphone, WhatsApp, e-mail, réseaux sociaux) —
   **sans toucher au code**. Le site se met à jour automatiquement.

Si le serveur n'est pas lancé, le site continue de fonctionner normalement
(il utilise alors les informations "de base" écrites dans le code) — vous ne
pouvez juste plus vous connecter à `/admin` pour le moment.

## Démarrer le serveur sur votre ordinateur (pour essayer)

Il faut avoir [Node.js](https://nodejs.org) installé (version 18 ou plus).

```bash
cd agriwintogo/server
cp .env.example .env       # copie le fichier de configuration
# puis ouvrez .env et changez ADMIN_PASSWORD et SESSION_SECRET
npm install                 # installe les briques nécessaires (une seule fois)
npm start                   # démarre le serveur
```

Ensuite, ouvrez votre navigateur :
- Le site : http://localhost:3000
- Le panneau d'administration : http://localhost:3000/admin/connexion
  (identifiant et mot de passe = ceux que vous avez mis dans `.env`)

Pour arrêter le serveur : retournez dans le terminal et appuyez sur `Ctrl + C`.

## Ce que vous pouvez modifier vous-même dans /admin

- **Produits** : ajouter, modifier, supprimer, changer le prix, la photo, le
  stock (« en stock » / « sur commande »), le masquer temporairement du site.
- **Contenu des pages** : les titres, textes et photos principales de chaque
  page (Accueil, À propos, Services, Produits, Réalisations, Catalogue,
  Contact) — remplace le contenu écrit dans le code par ce que vous saisissez.
- **Menu** : renommer les liens du menu, changer leur ordre, en ajouter de
  nouveaux, ou en masquer un temporairement (sans le supprimer). Pour une
  suppression définitive, contactez-nous.
- **Paramètres du site** : le numéro de téléphone/WhatsApp affiché partout,
  l'e-mail, les liens Facebook et TikTok, l'adresse.

Ce que vous ne pouvez **pas encore** modifier depuis `/admin` (ça reste dans
le code pour l'instant) : la mise en page elle-même (ordre des sections,
couleurs, polices), les listes à puces détaillées dans « Nos services », et
les photos d'ambiance des galeries. C'est un chantier possible pour une
prochaine étape si vous en avez besoin.

## Mettre le site en ligne pour de vrai (déploiement)

Ce serveur est écrit en Node.js — un langage accepté par la grande majorité
des hébergeurs modernes. Trois façons de le mettre en ligne, de la plus simple
à la plus technique :

### Option simple et gratuite pour démarrer : Render.com
1. Créez un compte sur [render.com](https://render.com).
2. « New + » → « Web Service » → connectez votre dépôt GitHub (ou faites
   glisser le dossier `agriwintogo`).
3. Render détecte Node.js automatiquement. Réglages :
   - Build Command : `cd server && npm install`
   - Start Command : `cd server && npm start`
4. Dans « Environment », ajoutez les mêmes variables que dans `.env.example`
   (ADMIN_USER, ADMIN_PASSWORD, SESSION_SECRET, NODE_ENV=production).
5. Render vous donne une adresse (ex. `agriwintogo.onrender.com`). Vous
   pourrez ensuite brancher votre nom de domaine `agriwintogo.com` dessus.

### Si vous avez un VPS (serveur privé)
```bash
git clone <votre-dépôt>
cd agriwintogo/server
npm install
cp .env.example .env   # et modifiez les valeurs
npm install -g pm2     # garde le serveur allumé en permanence
pm2 start server.js --name agriwintogo
pm2 save
```

### Si votre hébergeur est un hébergement mutualisé classique (cPanel)
Vérifiez d'abord qu'il propose « Node.js App » dans son panneau (beaucoup
d'hébergeurs récents le font). Si oui, pointez-le vers `server/server.js`
et ajoutez les mêmes variables d'environnement. Sinon, ce type d'hébergement
ne peut pas faire tourner ce serveur — Render (ci-dessus) est alors la
solution la plus simple.

## Sécurité — à faire avant la mise en ligne

- Changez **ADMIN_PASSWORD** dans `.env` pour un vrai mot de passe (pas
  celui de test).
- Changez **SESSION_SECRET** pour une longue phrase aléatoire à vous.
- Ne partagez jamais le fichier `.env` (il n'est volontairement pas envoyé
  sur GitHub — voir `.gitignore`).

## Comment ça marche, en bref (pour les curieux)

- Les produits sont stockés dans `data/products.json`, les coordonnées dans
  `data/settings.json` — des fichiers texte, pas de base de données à
  installer.
- Les photos de produits envoyées depuis `/admin` sont enregistrées dans
  `images/products/`.
- Le site (les fichiers HTML) va chercher ces informations tout seul via
  `/api/produits.json` et `/api/parametres.json`. S'il n'y arrive pas (le
  serveur n'est pas lancé), il utilise les valeurs écrites directement dans
  le code, comme avant.
