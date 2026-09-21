# Site AgriWin Togo — Phase 1 (vitrine + catalogue)

Site statique (HTML/CSS/JS, sans framework ni build) pour **AgriWin Togo**,
livré en **Phase 1** : vitrine complète + catalogue produits consultable,
sans paiement en ligne.

## Structure

```
agriwintogo/
├── index.html          Accueil
├── a-propos.html        À propos
├── services.html         Nos services (6 services, ancres #conseil, #prestations, #formation, #ecoulement, #pepiniere, #elevage)
├── produits.html         Nos produits (présentation des familles)
├── realisations.html     Nos réalisations (portfolio)
├── catalogue.html        Catalogue filtrable / recherchable
├── contact.html          Formulaire + appel + WhatsApp + carte
├── css/style.css         Charte graphique & styles (mobile-first)
├── js/main.js            Nav mobile, bouton retour en haut, formulaire de contact
├── js/products.js        Données produits (structure prête pour un panier en Phase 2)
├── js/catalogue.js       Filtrage / recherche du catalogue
├── images/               Logo, favicons, visuels placeholder (SVG)
├── robots.txt, sitemap.xml, site.webmanifest   SEO technique de base
```

## À remplacer avant mise en ligne définitive

Ces éléments sont des **placeholders clairement identifiés** à remplacer dès
que le contenu réel sera fourni :

- **Numéro de téléphone / WhatsApp** : `+228 90 00 00 00` (présent dans
  toutes les pages : en-tête, pied de page, boutons flottants, `js/main.js`,
  `js/catalogue.js`). À remplacer partout par le vrai numéro.
- **E-mail** : `contact@agriwintogo.com` (déjà cohérent avec le nom de
  domaine réservé).
- **Réseaux sociaux** : liens Facebook (`facebook.com/agriwintogo`) et
  TikTok (`tiktok.com/@agriwintogo`) à remplacer par les vraies pages.
- **Photos** : toutes les images sont des visuels SVG générés (vert,
  clairement annotés « Image à venir »), dans `images/placeholders/`. Il
  suffit de remplacer les fichiers ou de changer les chemins `src` dans le
  HTML par de vraies photos (logo, équipe, plants, réalisations).
- **Localisation (carte)** : la carte dans `contact.html` utilise des
  coordonnées approximatives pour Kégué — à ajuster avec l'adresse exacte.
- **Produits et prix** (`js/products.js`) : liste indicative à ajuster avec
  le vrai catalogue et les prix réels.

## Formulaire de contact (Phase 1, sans backend)

Le site n'a pas de serveur/backend. Le formulaire de `contact.html` :
1. Valide les champs obligatoires côté navigateur.
2. Construit un message récapitulatif.
3. L'envoie soit vers WhatsApp (`wa.me`), soit vers le client e-mail du
   visiteur (`mailto:`), selon le bouton choisi.

Pour un vrai envoi automatisé sans intervention du visiteur, prévoir en
évolution rapide un service comme Formspree, EmailJS ou un petit backend
(PHP/Node) — la structure du formulaire (`id="contactForm"`) est prête à
être branchée dessus.

## Évolution vers la Phase 2 (boutique en ligne)

La structure a été pensée pour évoluer sans réécriture complète :

- Chaque produit dans `js/products.js` possède déjà un `id`, un `sku`, un
  `price` et un `stock` — il suffira d'ajouter un panier (state JS +
  `localStorage` ou backend) et un bouton « Ajouter au panier » à côté du
  bouton WhatsApp actuel dans `js/catalogue.js`.
- Le catalogue est déjà filtrable/recherchable ; il ne reste qu'à ajouter
  le tunnel de paiement (T-Money, Flooz/Moov Money) et la gestion des
  commandes/stocks.
- Les codes promo pourront être ajoutés comme un champ supplémentaire sur
  le futur panier, sans impacter les pages existantes.

## Déploiement

Site 100% statique : il peut être déployé tel quel sur n'importe quel
hébergement statique (GitHub Pages, Netlify, Vercel, hébergement mutualisé
classique) pointant vers le nom de domaine `agriwintogo.com`. Un fichier
`CNAME` propre à ce sous-projet devra être ajouté par l'hébergeur choisi
(ce dépôt héberge déjà un autre site à la racine, avec son propre CNAME
pour `zegroupafrica.com` — ne pas le modifier).

## SEO de base inclus

- Balises `<title>` et `<meta description>` uniques par page.
- Balises Open Graph pour le partage sur les réseaux sociaux.
- `robots.txt` + `sitemap.xml`.
- Données structurées `schema.org/Organization` sur la page d'accueil.
- Images en `loading="lazy"`, dimensions déclarées pour éviter les sauts
  de mise en page.
- HTML sémantique (`header`, `nav`, `main`, `footer`, hiérarchie de
  titres).
