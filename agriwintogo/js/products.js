/* =========================================================
   AgriWin Togo — Catalogue produits (Phase 1 : sans paiement en ligne)
   Chaque fiche est structurée pour évoluer facilement vers un
   panier e-commerce en Phase 2 (id, prix, stock, sku déjà prévus).
   ========================================================= */

window.AGRIWIN_CATEGORIES = [
  { id: "tous", label: "Tous les produits" },
  { id: "fruitiers", label: "Plants fruitiers" },
  { id: "forestiers", label: "Plants forestiers & ornement" },
  { id: "semences", label: "Semences & intrants" },
  { id: "elevage", label: "Élevage" },
];

window.AGRIWIN_PRODUCTS = [
  {
    id: "manguier-greffe",
    sku: "AWT-PL-001",
    name: "Manguier greffé (variété améliorée)",
    category: "fruitiers",
    price: 2500,
    unit: "plant",
    stock: "disponible",
    badge: "Meilleure vente",
    image: "images/placeholders/product-manguier.svg",
    description:
      "Plant de manguier greffé, à croissance rapide et entrée en production précoce. Idéal pour vergers commerciaux et projets d'agroforesterie.",
  },
  {
    id: "avocatier-greffe",
    sku: "AWT-PL-002",
    name: "Avocatier greffé (variété Hass et locale)",
    category: "fruitiers",
    price: 3000,
    unit: "plant",
    stock: "disponible",
    badge: "Populaire",
    image: "images/placeholders/product-avocatier.svg",
    description:
      "Plants d'avocatier sélectionnés, adaptés au climat togolais, pour une production fruitière de qualité export.",
  },
  {
    id: "cocotier-nain",
    sku: "AWT-PL-003",
    name: "Cocotier nain hybride",
    category: "fruitiers",
    price: 3500,
    unit: "plant",
    stock: "sur commande",
    badge: null,
    image: "images/placeholders/product-cocotier.svg",
    description:
      "Variété naine à haut rendement, très recherchée pour les exploitations côtières et les projets d'agrotourisme.",
  },
  {
    id: "agrumes",
    sku: "AWT-PL-004",
    name: "Agrumes (citronnier, oranger, pamplemoussier)",
    category: "fruitiers",
    price: 2000,
    unit: "plant",
    stock: "disponible",
    badge: null,
    image: "images/placeholders/product-agrumes.svg",
    description:
      "Plants d'agrumes greffés, résistants et productifs, disponibles en plusieurs variétés selon la saison.",
  },
  {
    id: "anacardier",
    sku: "AWT-PL-005",
    name: "Anacardier (noix de cajou)",
    category: "fruitiers",
    price: 1800,
    unit: "plant",
    stock: "disponible",
    badge: null,
    image: "images/placeholders/product-anacardier.svg",
    description:
      "Plants d'anacardier robustes, adaptés aux sols pauvres, pour une culture de rente durable et rentable.",
  },
  {
    id: "palmier-huile",
    sku: "AWT-PL-006",
    name: "Palmier à huile sélectionné",
    category: "forestiers",
    price: 2800,
    unit: "plant",
    stock: "sur commande",
    badge: "Nouveau",
    image: "images/placeholders/product-palmier.svg",
    description:
      "Semences pré-germées de palmier à huile issues de matériel végétal amélioré, pour plantations industrielles ou familiales.",
  },
  {
    id: "teck",
    sku: "AWT-PL-007",
    name: "Plants de teck",
    category: "forestiers",
    price: 1200,
    unit: "plant",
    stock: "disponible",
    badge: null,
    image: "images/placeholders/product-teck.svg",
    description:
      "Plants de teck pour reboisement, investissement forestier ou création de brise-vent en bordure de parcelle.",
  },
  {
    id: "moringa",
    sku: "AWT-PL-008",
    name: "Plants de moringa",
    category: "forestiers",
    price: 1000,
    unit: "plant",
    stock: "disponible",
    badge: "Nouveau",
    image: "images/placeholders/product-moringa.svg",
    description:
      "Arbre aux multiples vertus nutritionnelles et médicinales, à croissance très rapide et facile d'entretien.",
  },
  {
    id: "semences-maraicheres",
    sku: "AWT-SE-001",
    name: "Semences maraîchères sélectionnées",
    category: "semences",
    price: 1500,
    unit: "sachet",
    stock: "disponible",
    badge: null,
    image: "images/placeholders/product-semences-maraicheres.svg",
    description:
      "Assortiment de semences maraîchères à haut rendement (tomate, piment, gombo, légumes feuilles...).",
  },
  {
    id: "engrais-organique",
    sku: "AWT-IN-001",
    name: "Engrais organique / compost",
    category: "semences",
    price: 5000,
    unit: "sac de 25kg",
    stock: "disponible",
    badge: null,
    image: "images/placeholders/product-engrais-organique.svg",
    description:
      "Fertilisant organique naturel pour améliorer durablement la fertilité de vos sols et la vigueur de vos cultures.",
  },
  {
    id: "poussins-volaille",
    sku: "AWT-EL-001",
    name: "Poussins & volaille améliorée",
    category: "elevage",
    price: 1200,
    unit: "sujet",
    stock: "sur commande",
    badge: "Populaire",
    image: "images/placeholders/product-volaille.svg",
    description:
      "Sujets de volaille locale améliorée et poussins d'un jour, avec accompagnement technique au démarrage.",
  },
  {
    id: "petits-ruminants",
    sku: "AWT-EL-002",
    name: "Petits ruminants (caprins/ovins)",
    category: "elevage",
    price: 35000,
    unit: "sujet",
    stock: "sur commande",
    badge: null,
    image: "images/placeholders/product-caprin.svg",
    description:
      "Sujets sélectionnés pour l'élevage caprin et ovin, avec conseils d'installation et de suivi sanitaire.",
  },
];

/* Formatage prix en Francs CFA (XOF) */
window.formatFCFA = function (value) {
  return (
    new Intl.NumberFormat("fr-FR").format(value).replace(/ /g, " ") +
    " FCFA"
  );
};

/* =========================================================
   Chargement des produits : essaie l'API du serveur (panneau
   d'administration) et retombe sur la liste statique ci-dessus si le
   serveur n'est pas lancé — ex. quand le site est ouvert en
   double-cliquant sur index.html (fichier local, pas de serveur).
   ========================================================= */
window.AgriwinLoadProducts = function () {
  return fetch("api/produits.json")
    .then(function (res) {
      if (!res.ok) throw new Error("api indisponible");
      return res.json();
    })
    .catch(function () {
      return window.AGRIWIN_PRODUCTS;
    });
};

function agriwinStockLabel(stock) {
  return stock === "disponible" ? "En stock" : "Sur commande";
}

/* Carte produit HTML partagée entre le catalogue et les produits vedettes
   de la page d'accueil, pour ne pas dupliquer le rendu à deux endroits. */
window.AgriwinProductCardHTML = function (p) {
  var settings = window.AGRIWIN_SETTINGS || {};
  var whatsappNumber = settings.phoneDigits || "22896638200";
  var waMsg = encodeURIComponent(
    "Bonjour AgriWin Togo, je suis intéressé(e) par : " + p.name + (p.sku ? " (réf. " + p.sku + ")" : "") + ". Pouvez-vous me donner plus d'informations ?"
  );
  return (
    '<article class="card product-card" data-id="' + p.id + '">' +
      '<div class="card-media">' +
        (p.badge ? '<span class="product-badge">' + p.badge + "</span>" : "") +
        '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="600" height="600">' +
      "</div>" +
      '<div class="card-body">' +
        '<span class="card-tag">' + agriwinStockLabel(p.stock) + "</span>" +
        "<h3>" + p.name + "</h3>" +
        "<p>" + p.description + "</p>" +
        '<div class="product-price"><strong>' + window.formatFCFA(p.price) + "</strong><span>/ " + p.unit + "</span></div>" +
        '<div class="product-actions">' +
          '<a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="https://wa.me/' + whatsappNumber + "?text=" + waMsg + '">Commander</a>' +
          '<a class="btn btn-outline-green btn-sm" href="contact.html?produit=' + encodeURIComponent(p.name) + '">Demander un devis</a>' +
        "</div>" +
      "</div>" +
    "</article>"
  );
};
