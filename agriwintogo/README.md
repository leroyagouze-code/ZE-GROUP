# Site AgriWin Togo

Site vitrine + catalogue pour **AgriWin Togo**, avec un serveur optionnel
qui ajoute un panneau d'administration (gestion des produits et des
coordonnées sans toucher au code).

## Structure

```
agriwintogo/
├── index.html            Accueil
├── a-propos.html          À propos
├── services.html           Nos services (6 services, ancres #conseil, #prestations, #formation, #ecoulement, #pepiniere, #elevage)
├── produits.html           Nos produits (présentation des familles)
├── realisations.html       Nos réalisations
├── catalogue.html          Catalogue filtrable / recherchable
├── contact.html            Formulaire + appel + WhatsApp + carte
├── css/style.css           Charte graphique & styles (mobile-first)
├── js/site-config.js       Coordonnées du site (charge /api/parametres.json si le serveur tourne)
├── js/products.js          Données produits statiques (repli si le serveur n'est pas lancé)
├── js/featured.js          Produits vedettes de l'accueil
├── js/catalogue.js         Filtrage / recherche du catalogue
├── js/main.js               Nav mobile, bouton retour en haut, formulaire de contact
├── images/                 Logo, favicons, photos, visuels placeholder (SVG)
├── robots.txt, sitemap.xml, site.webmanifest   SEO technique de base
└── server/                 Serveur Node.js + panneau d'administration (voir server/README.md)
```

Le site fonctionne **avec ou sans** le serveur :
- **Sans serveur** (ouverture directe de `index.html`, ou hébergement
  statique classique) : tout fonctionne avec les données écrites dans le
  code (`js/products.js` et les coordonnées par défaut).
- **Avec le serveur** (`server/`) : les mêmes pages vont chercher les
  produits et les coordonnées à jour auprès du serveur, ce qui permet de
  tout modifier depuis `/admin` sans redéployer le code. Voir
  **`server/README.md`** pour le démarrer et le déployer.

## Coordonnées réelles (issues du brief créa)

Le numéro de téléphone/WhatsApp (`+228 96 63 82 00`) et l'e-mail
(`agriwintogo@gmail.com`) sont les vraies coordonnées d'AgriWin Togo
(KEGNON Emmanuel, CEO). Elles peuvent maintenant être changées à tout
moment depuis `/admin/parametres` une fois le serveur lancé.

## À remplacer avant mise en ligne définitive

- **Réseaux sociaux** : liens Facebook (`facebook.com/agriwintogo`) et
  TikTok (`tiktok.com/@agriwintogo`) à remplacer par les vraies URLs des
  comptes (le brief indique seulement le nom « AgriWin Togo »).
- **Photos** : le site mélange des photos réelles libres de droits
  (`images/photos/`, à remplacer par vos propres photos dès qu'elles
  seront transmises) et des visuels SVG générés pour les produits et
  certains services (`images/placeholders/`, clairement annotés « Image à
  venir »).
- **Localisation (carte)** : la carte dans `contact.html` utilise des
  coordonnées approximatives pour Kégué — à ajuster avec l'adresse exacte.
- **Produits et prix** : gérables directement depuis `/admin/produits` une
  fois le serveur lancé (plus besoin de modifier le code).

## Formulaire de contact

Le formulaire de `contact.html` valide les champs, construit un message
récapitulatif, puis l'envoie soit vers WhatsApp (`wa.me`), soit vers le
client e-mail du visiteur (`mailto:`), selon le bouton choisi — aucune
donnée n'est stockée sur le serveur pour l'instant.

## Panneau d'administration (`server/`)

Un serveur Node.js optionnel sert le site et ajoute une page privée
`/admin` où l'équipe AgriWin Togo peut, sans coder :
- Ajouter / modifier / supprimer des produits (nom, prix, stock, photo,
  visibilité).
- Modifier les coordonnées affichées sur tout le site (téléphone,
  WhatsApp, e-mail, réseaux sociaux, adresse).

Voir **`server/README.md`** pour le démarrer localement et le mettre en
ligne (Render, VPS, hébergement avec Node.js...).

## Évolution vers une boutique en ligne complète

La structure a été pensée pour évoluer sans réécriture complète :
- Chaque produit possède déjà un `id`, un `sku`, un `price` et un `stock` —
  il suffira d'ajouter un panier (state JS + backend) et un bouton
  « Ajouter au panier » à côté du bouton WhatsApp actuel.
- Le catalogue est déjà filtrable/recherchable et branché sur un vrai
  stockage serveur (`server/data/products.json`) ; il reste à ajouter le
  tunnel de paiement (T-Money, Flooz/Moov Money), la gestion des commandes
  et les codes promo.

## Déploiement

- **Site seul (sans admin)** : 100% statique, déployable sur n'importe quel
  hébergement statique (GitHub Pages, Netlify, Vercel, hébergement
  mutualisé) pointant vers `agriwintogo.com`. Ce dépôt héberge déjà un
  autre site à la racine, avec son propre `CNAME` pour `zegroupafrica.com`
  — ne pas le modifier.
- **Site + panneau d'administration** : nécessite un hébergement capable de
  faire tourner Node.js en continu — voir les options détaillées dans
  `server/README.md`.

## SEO de base inclus

- Balises `<title>` et `<meta description>` uniques par page.
- Balises Open Graph pour le partage sur les réseaux sociaux.
- `robots.txt` + `sitemap.xml`.
- Données structurées `schema.org/Organization` sur la page d'accueil.
- Images en `loading="lazy"`, dimensions déclarées pour éviter les sauts
  de mise en page.
- HTML sémantique (`header`, `nav`, `main`, `footer`, hiérarchie de
  titres).
