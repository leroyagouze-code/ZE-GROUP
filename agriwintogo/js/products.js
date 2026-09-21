/* =========================================================
   AgriWin Togo — Catalogue produits (Phase 1 : sans paiement en ligne)
   Catalogue réel fourni par le client (pépinière), 51 plants.
   Chaque fiche est structurée pour évoluer facilement vers un
   panier e-commerce en Phase 2 (id, prix, stock, sku déjà prévus).
   ========================================================= */

window.AGRIWIN_CATEGORIES = [
  { id: "tous", label: "Tous les produits" },
  { id: "fruitiers", label: "Arbres & plants fruitiers" },
  { id: "agrumes", label: "Agrumes sélectionnés" },
  { id: "epices", label: "Épices, arômes & condiments" },
  { id: "herbes", label: "Herbes aromatiques & santé" },
  { id: "ornement", label: "Plantes d'ornement & intérieur" },
];

window.AGRIWIN_PRODUCTS = [
  {
    "id": "mangoustanier",
    "sku": "AWT-FR-001",
    "name": "Mangoustanier",
    "category": "fruitiers",
    "price": 10000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/mangoustanier.jpg",
    "description": "Fruit exotique raffiné et très prisé."
  },
  {
    "id": "cocotier-nain-hybride",
    "sku": "AWT-FR-002",
    "name": "Cocotier nain hybride",
    "category": "fruitiers",
    "price": 2500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/cocotier-nain-hybride.jpg",
    "description": "Variété à forte productivité et croissance rapide."
  },
  {
    "id": "cocotier-nain-pure",
    "sku": "AWT-FR-003",
    "name": "Cocotier nain pur",
    "category": "fruitiers",
    "price": 3500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/cocotier-nain-pure.jpg",
    "description": "Variété pure naine idéale pour vergers."
  },
  {
    "id": "cocotier-1-litre",
    "sku": "AWT-FR-004",
    "name": "Cocotier 1 litre",
    "category": "fruitiers",
    "price": 5000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/cocotier-1-litre.jpg",
    "description": "Grand sujet prêt pour plantation rapide."
  },
  {
    "id": "sapotier",
    "sku": "AWT-FR-005",
    "name": "Sapotier",
    "category": "fruitiers",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/sapotier.jpg",
    "description": "Fruit doux et sucré à la chair délicieuse."
  },
  {
    "id": "tamarinier-indica",
    "sku": "AWT-FR-006",
    "name": "Tamarinier Indica (Tamarin rouge)",
    "category": "fruitiers",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/tamarinier-indica.jpg",
    "description": "Tamarinier classique à saveur acidulée."
  },
  {
    "id": "tamarinier-velours",
    "sku": "AWT-FR-007",
    "name": "Tamarinier velours (Tamarin noir)",
    "category": "fruitiers",
    "price": 1500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/tamarinier-velours.jpg",
    "description": "Espèce recherchée aux fruits veloutés."
  },
  {
    "id": "papayer",
    "sku": "AWT-FR-008",
    "name": "Papayer Solo / Papayer précoce",
    "category": "fruitiers",
    "price": 500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/papayer.jpg",
    "description": "Productivité précoce, chair très sucrée.",
    "priceMax": 1500
  },
  {
    "id": "pommier-fruit",
    "sku": "AWT-FR-009",
    "name": "Pommier fruit",
    "category": "fruitiers",
    "price": 15000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/pommier-fruit.jpg",
    "description": "Variété adaptée pour vergers fruitiers."
  },
  {
    "id": "grenadier-rouge",
    "sku": "AWT-FR-010",
    "name": "Grenadier rouge",
    "category": "fruitiers",
    "price": 5000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/grenadier-rouge.jpg",
    "description": "Grenades rouges juteuses et riches en antioxydants."
  },
  {
    "id": "fruit-du-dragon",
    "sku": "AWT-FR-011",
    "name": "Arbre Fruit du Dragon (Pitaya)",
    "category": "fruitiers",
    "price": 12000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/fruit-du-dragon.jpg",
    "description": "Fruit exotique spectaculaire et très rafraîchissant."
  },
  {
    "id": "ramboutanier",
    "sku": "AWT-FR-012",
    "name": "Ramboutanier",
    "category": "fruitiers",
    "price": 12000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/ramboutanier.jpg",
    "description": "Litchi chevelu très prisé."
  },
  {
    "id": "cherimolier",
    "sku": "AWT-FR-013",
    "name": "Chérimolier",
    "category": "fruitiers",
    "price": 5000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/cherimolier.jpg",
    "description": "Fruit au goût raffiné d'ananas et de vanille."
  },
  {
    "id": "carambolier",
    "sku": "AWT-FR-014",
    "name": "Carambolier",
    "category": "fruitiers",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/carambolier.jpg",
    "description": "Fruits en forme d'étoile, croquants et acidulés."
  },
  {
    "id": "goyavier-poire",
    "sku": "AWT-FR-015",
    "name": "Goyavier poire / Thaïlandais",
    "category": "fruitiers",
    "price": 1500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/goyavier-poire.jpg",
    "description": "Chair ferme, très parfumée et riche en vitamine C.",
    "priceMax": 2000
  },
  {
    "id": "manne-israel",
    "sku": "AWT-FR-016",
    "name": "Manne d'Israël",
    "category": "fruitiers",
    "price": 5000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/manne-israel.jpg",
    "description": "Fruit rare d'exception aux saveurs douces."
  },
  {
    "id": "pommier-etoile",
    "sku": "AWT-FR-017",
    "name": "Pommier étoilé (Pomme étoilée)",
    "category": "fruitiers",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/pommier-etoile.jpg",
    "description": "Fruit doux à pulpe lactée sucrée."
  },
  {
    "id": "arbre-a-pain",
    "sku": "AWT-FR-018",
    "name": "Arbre à pain",
    "category": "fruitiers",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/arbre-a-pain.jpg",
    "description": "Grand arbre nourrissant à haute valeur nutritive."
  },
  {
    "id": "figuier-barbarie",
    "sku": "AWT-FR-019",
    "name": "Figuier de barbarie",
    "category": "fruitiers",
    "price": 8000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/figuier-barbarie.jpg",
    "description": "Cactus fruitier résistant aux fruits juteux."
  },
  {
    "id": "vigne-raisinier",
    "sku": "AWT-FR-020",
    "name": "Vigne (Raisinier)",
    "category": "fruitiers",
    "price": 6000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/vigne-raisinier.jpg",
    "description": "Grappes généreuses pour consommation directe."
  },
  {
    "id": "avocatier-greffe",
    "sku": "AWT-FR-021",
    "name": "Avocatier greffé / Hass",
    "category": "fruitiers",
    "price": 1500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/avocatier-greffe.jpg",
    "description": "Fruits à chair crémeuse de qualité supérieure.",
    "priceMax": 2500
  },
  {
    "id": "manguiers",
    "sku": "AWT-FR-022",
    "name": "Manguiers (Gouverneur, Kent, Eldon, Camerounais)",
    "category": "fruitiers",
    "price": 1000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/manguiers.jpg",
    "description": "Grands cultivars greffés à haute productivité.",
    "priceMax": 5000
  },
  {
    "id": "corossolier",
    "sku": "AWT-FR-023",
    "name": "Corossolier grand",
    "category": "fruitiers",
    "price": 1500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/corossolier.jpg",
    "description": "Fruit volumineux apprécié pour ses qualités gustatives."
  },
  {
    "id": "bananiers",
    "sku": "AWT-FR-024",
    "name": "Bananiers (Double-régime / Plantain)",
    "category": "fruitiers",
    "price": 600,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/bananiers.jpg",
    "description": "Plants vigoureux à haut rendement.",
    "priceMax": 1700
  },
  {
    "id": "pecher-kiwi-prunier-olivier",
    "sku": "AWT-FR-025",
    "name": "Pêcher / Kiwi / Prunier / Olivier",
    "category": "fruitiers",
    "price": 8000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/pecher-kiwi-prunier-olivier.jpg",
    "description": "Arbres fruitiers d'acclimatation et de collection.",
    "priceMax": 15000
  },
  {
    "id": "citronniers",
    "sku": "AWT-AG-001",
    "name": "Citronniers (Standard & Greffé)",
    "category": "agrumes",
    "price": 500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/citronniers.jpg",
    "description": "Agrumes juteux indispensables au jardin.",
    "priceMax": 1500
  },
  {
    "id": "citronnier-lime-tahiti",
    "sku": "AWT-AG-002",
    "name": "Citronnier Lime de Tahiti",
    "category": "agrumes",
    "price": 3500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/citronnier-lime-tahiti.jpg",
    "description": "Lime sans pépins, très parfumée et juteuse."
  },
  {
    "id": "clementinier",
    "sku": "AWT-AG-003",
    "name": "Clémentinier greffé (Togo & Importé)",
    "category": "agrumes",
    "price": 3500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/clementinier.jpg",
    "description": "Fruits doux, sucrés et faciles à éplucher.",
    "priceMax": 9000
  },
  {
    "id": "tangelo",
    "sku": "AWT-AG-004",
    "name": "Tangelo & Tangelo Minneola",
    "category": "agrumes",
    "price": 1000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/tangelo.jpg",
    "description": "Hybride pamplemousse-mandarine très juteux.",
    "priceMax": 2500
  },
  {
    "id": "oranger-sanguine",
    "sku": "AWT-AG-005",
    "name": "Oranger Sanguine / Pineapple",
    "category": "agrumes",
    "price": 700,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/oranger-sanguine.jpg",
    "description": "Oranges douces à pulpe colorée ou parfumée.",
    "priceMax": 2500
  },
  {
    "id": "fruit-passion",
    "sku": "AWT-AG-006",
    "name": "Fruit de la passion",
    "category": "agrumes",
    "price": 600,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/fruit-passion.jpg",
    "description": "Liane fruitière vigoureuse aux fruits aromatiques."
  },
  {
    "id": "vanillier",
    "sku": "AWT-EP-001",
    "name": "Vanillier (Vanille)",
    "category": "epices",
    "price": 6000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/vanillier.jpg",
    "description": "Orchidée grimpante produisant les célèbres gousses de vanille."
  },
  {
    "id": "poivrier-noir",
    "sku": "AWT-EP-002",
    "name": "Poivrier noir",
    "category": "epices",
    "price": 1500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/poivrier-noir.jpg",
    "description": "Liane d'épice incontournable pour poivre en grain."
  },
  {
    "id": "poivre-long-africain",
    "sku": "AWT-EP-003",
    "name": "Poivre long africain",
    "category": "epices",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/poivre-long-africain.jpg",
    "description": "Poivre rare aux notes aromatiques et piquantes."
  },
  {
    "id": "muscadier",
    "sku": "AWT-EP-004",
    "name": "Muscadier",
    "category": "epices",
    "price": 11000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/muscadier.jpg",
    "description": "Arbre produisant la noix de muscade et le macis."
  },
  {
    "id": "cannelier",
    "sku": "AWT-EP-005",
    "name": "Cannelier",
    "category": "epices",
    "price": 8000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/cannelier.jpg",
    "description": "Arbre à cannelle au feuillage et à l'écorce parfumés."
  },
  {
    "id": "piment-guinee",
    "sku": "AWT-EP-006",
    "name": "Piment de Guinée (Maniguette)",
    "category": "epices",
    "price": 5000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/piment-guinee.jpg",
    "description": "Graines de paradis aux vertus condimentaires."
  },
  {
    "id": "petit-cola",
    "sku": "AWT-EP-007",
    "name": "Petit Cola / Petit Cola Greffé",
    "category": "epices",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/petit-cola.jpg",
    "description": "Noix médicinale très recherchée.",
    "priceMax": 7000
  },
  {
    "id": "colatier",
    "sku": "AWT-EP-008",
    "name": "Colatier",
    "category": "epices",
    "price": 0,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/colatier.jpg",
    "description": "Arbre traditionnel à noix de cola.",
    "priceOnRequest": true
  },
  {
    "id": "stevia",
    "sku": "AWT-HE-001",
    "name": "Stevia",
    "category": "herbes",
    "price": 4000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/stevia.jpg",
    "description": "Édulcorant naturel à pouvoir sucrant élevé."
  },
  {
    "id": "baie-miracle",
    "sku": "AWT-HE-002",
    "name": "Baie de Miracle (Jeune & Grand Plant)",
    "category": "herbes",
    "price": 3000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/baie-miracle.jpg",
    "description": "Fruit modifiant la perception de l'acidité en goût sucré.",
    "priceMax": 20000
  },
  {
    "id": "vetiver",
    "sku": "AWT-HE-003",
    "name": "Vétiver",
    "category": "herbes",
    "price": 6000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/vetiver.jpg",
    "description": "Plante aromatique, fixation des sols et essence parfumée."
  },
  {
    "id": "menthe-basilic-verveine-origan",
    "sku": "AWT-HE-004",
    "name": "Menthe / Basilic / Verveine / Origan",
    "category": "herbes",
    "price": 2500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/menthe-basilic-verveine-origan.jpg",
    "description": "Plantes condimentaires indispensables en cuisine.",
    "priceMax": 3500
  },
  {
    "id": "romarin-sauge-lauriers",
    "sku": "AWT-HE-005",
    "name": "Romarin / Sauge / Lauriers",
    "category": "herbes",
    "price": 3000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/romarin-sauge-lauriers.jpg",
    "description": "Herbes fines aromatiques et médicinales.",
    "priceMax": 8000
  },
  {
    "id": "petiveria-justicia",
    "sku": "AWT-HE-006",
    "name": "Petiveria alliacea & Justicia",
    "category": "herbes",
    "price": 3000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/petiveria-justicia.jpg",
    "description": "Plantes répulsives naturelles anti-serpents."
  },
  {
    "id": "muriers",
    "sku": "AWT-OR-001",
    "name": "Jeunes plants de Mûriers",
    "category": "ornement",
    "price": 5000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/muriers.jpg",
    "description": "Mûrier à petites baies douces et feuillage dense."
  },
  {
    "id": "pomme-sauvage",
    "sku": "AWT-OR-002",
    "name": "Pomme sauvage (Atokliko)",
    "category": "ornement",
    "price": 2000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/pomme-sauvage.jpg",
    "description": "Espèce locale rustique et décorative."
  },
  {
    "id": "pachira-tisse",
    "sku": "AWT-OR-003",
    "name": "Pachira tissé",
    "category": "ornement",
    "price": 10000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/pachira-tisse.jpg",
    "description": "Arbre à argent à tronc tressé, très élégant."
  },
  {
    "id": "lucky-bamboo",
    "sku": "AWT-OR-004",
    "name": "Lucky Bamboo (60cm & 1m)",
    "category": "ornement",
    "price": 8500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/lucky-bamboo.jpg",
    "description": "Tiges de bambou porte-bonheur pour décoration d'intérieur.",
    "priceMax": 12500
  },
  {
    "id": "arbre-de-jade",
    "sku": "AWT-OR-005",
    "name": "Arbre de Jade",
    "category": "ornement",
    "price": 5000,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/arbre-de-jade.jpg",
    "description": "Plante grasse succulente de culture facile."
  },
  {
    "id": "gardenia-thumbergia",
    "sku": "AWT-OR-006",
    "name": "Gardénia thumbergia",
    "category": "ornement",
    "price": 4500,
    "unit": "plant",
    "stock": "disponible",
    "badge": null,
    "image": "images/products/catalogue/gardenia-thumbergia.jpg",
    "description": "Arbuste d'ornement aux fleurs blanches magnifiquement odorantes."
  }
];

/* Formatage prix en Francs CFA (XOF) */
window.formatFCFA = function (value) {
  return (
    new Intl.NumberFormat("fr-FR").format(value).replace(/\u202f/g, " ") +
    " FCFA"
  );
};

/* Affiche soit un prix unique, soit une fourchette (priceMax), soit "Sur demande". */
window.formatProductPrice = function (p) {
  if (p.priceOnRequest) return "Sur demande";
  if (p.priceMax && p.priceMax > p.price) {
    return window.formatFCFA(p.price) + " – " + window.formatFCFA(p.priceMax);
  }
  return window.formatFCFA(p.price);
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
        '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="700" height="700">' +
      "</div>" +
      '<div class="card-body">' +
        '<span class="card-tag">' + agriwinStockLabel(p.stock) + "</span>" +
        "<h3>" + p.name + "</h3>" +
        "<p>" + p.description + "</p>" +
        '<div class="product-price"><strong>' + window.formatProductPrice(p) + "</strong>" + (p.priceOnRequest ? "" : "<span>/ " + p.unit + "</span>") + "</div>" +
        '<div class="product-actions">' +
          '<a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="https://wa.me/' + whatsappNumber + "?text=" + waMsg + '">Commander</a>' +
          '<a class="btn btn-outline-green btn-sm" href="contact.html?produit=' + encodeURIComponent(p.name) + '">Demander un devis</a>' +
        "</div>" +
      "</div>" +
    "</article>"
  );
};
