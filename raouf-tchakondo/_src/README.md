# Site Raouf Tchakondo — prototype (lot 1)

Prototype statique et bilingue du site décrit dans le *Cahier des charges — Site web de Raouf Tchakondo*.
Il sert de maquette fonctionnelle pour valider l'arborescence, le ton et la direction artistique avec Raouf avant le développement définitif (Next.js + CMS, section 6 du cahier des charges).

Aperçu : `https://zegroupafrica.com/raouf-tchakondo/` (une fois la branche publiée sur GitHub Pages).

## Générer le site

```bash
node raouf-tchakondo/_src/build.mjs
```

Aucune dépendance (Node 18+). Le script régénère tout le dossier `raouf-tchakondo/` (sauf `_src/`).
Le dossier `_src/` n'est pas publié par GitHub Pages (préfixe `_`).

Tester en local :

```bash
python3 -m http.server 8000   # depuis la racine du dépôt
# puis http://localhost:8000/raouf-tchakondo/
```

## Structure

| Fichier | Rôle |
| --- | --- |
| `content.mjs` | **Tous les contenus FR / EN** : bio, frise, créations, agenda, danses sources, textes des pages, e-mails, WhatsApp |
| `build.mjs` | Gabarits HTML, SEO (hreflang, Open Graph, schema.org), sitemap, image de partage |
| `assets/style.css` | Direction artistique : noir profond, blanc cassé, accent ocre ; mode sombre par défaut, mode clair |
| `assets/main.js` | Interactions : menu plein écran, ligne qui danse, carte des tournées, filtres, module « Le langage », `.ics`, formulaires |

## Ce que couvre le prototype

- Les 8 rubriques + contact/booking, en FR (`/`) et EN (`/en/`), URL distinctes et bascule en un clic.
- Une fiche par création, avec forme géométrique propre et bouton « Programmer cette pièce » (formulaire pré-rempli).
- Ouverture « point → cercle » (une fois par session), ligne animée au scroll qui dessine des figures, carte des tournées par année.
- Agenda avec filtre par pays, ajout au calendrier (.ics), places restantes.
- Inscription aux stages avec choix de session, nombre de places, total, choix T-Money / Flooz / Moov Money / carte.
- Kit presse : bios courte (80 mots) et longue copiables, demande du kit par e-mail.
- Garde-fous : animations coupées si « réduire les animations » est activé ; version allégée automatique sur 2G/3G ou mode économie de données.
- Accessibilité : navigation clavier, lien d'évitement, contrastes AA, cibles tactiles de 44 px.
- Poids de l'accueil ≈ 70 Ko hors polices.

## Ce qui reste simulé (à brancher au développement définitif)

- **Formulaires** (booking, brief, newsletter, inscription) : ouvrent la messagerie avec la demande pré-remplie. À remplacer par l'API (Cloudflare Turnstile, notification e-mail / WhatsApp, Brevo).
- **Paiement** : FedaPay / CinetPay / PayDunya + Stripe non connectés.
- **Kit presse PDF + ZIP** : à générer depuis le CMS.
- **Vidéos et photos** : aucun visuel de banque d'images ; des emplacements signalés attendent le tournage dédié.
- `config.preview = true` ajoute un bandeau, `noindex` et `robots.txt` bloquant. Passer à `false` au lancement.

## À vérifier / compléter avec Raouf

Tous les champs `null` de `content.mjs` apparaissent sur le site avec la mention « À confirmer ». En particulier :

- Créations : année, format, durée, distribution, synopsis, fiche technique ; statut de *Le Double Masque* et *Maquis Scories*.
- Tournées : villes et années (Cotonou et Abidjan sont sans date), festivals, prix.
- Agenda : les 3 dates actuelles sont des **exemples fictifs** (`demo: true`, badge « Exemple ») ; elles ne sont pas publiées en données structurées.
- Association danse ↔ figure dans « Le langage » et origine exacte de chaque danse (Adjogbo, Hébiésso, Gadao, Kondona).
- Couleur d'accent (ocre latéritique `#c4622d` ou rouge vodou), numéro WhatsApp, adresses e-mail, liens des réseaux sociaux.
- Autorisations d'afficher les logos partenaires.
