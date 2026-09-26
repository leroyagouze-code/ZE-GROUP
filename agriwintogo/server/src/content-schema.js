/**
 * Schéma déclaratif du contenu éditable depuis /admin.
 * Chaque page liste ses champs (texte, texte long, ou photo).
 * Les valeurs par défaut correspondent au texte déjà présent sur le site
 * (sert à préremplir data/content.json au premier démarrage).
 */

const PAGES = {
  index: {
    label: "Accueil",
    file: "index.html",
    fields: [
      { key: "hero.badge", label: "Bandeau — badge (ex: \"Fondée en 2025...\")", type: "text",
        default: "Fondée en 2025 — Basée à Kégué, Togo" },
      { key: "hero.title", label: "Bandeau — titre principal", type: "textarea",
        default: "Chaque plant compte. Chaque projet mérite un partenaire de confiance." },
      { key: "hero.lead", label: "Bandeau — texte d'introduction", type: "textarea",
        default: "AgriWin Togo accompagne particuliers, entreprises, porteurs de projets et ONG : conseil agricole, formation, plants tropicaux et écoulement de produits — au Togo, en Afrique de l'Ouest et à l'international." },
      { key: "hero.image", label: "Bandeau — photo de fond", type: "image",
        default: "images/photos/nursery-hands-seedling-web.jpg" },
      { key: "hero.credentialTitle", label: "Bandeau — encadré, titre", type: "text",
        default: "Une pépinière suivie de près" },
      { key: "hero.credentialText", label: "Bandeau — encadré, texte", type: "textarea",
        default: "Chaque plant est sélectionné et contrôlé avant livraison, pour un taux de reprise élevé sur le terrain." },
      { key: "quote.text", label: "Citation du fondateur", type: "textarea",
        default: "« Nous voulons que chaque client, qu'il soit à Kégué ou à l'international, reçoive des plants de qualité et un accompagnement dans lequel il peut avoir une confiance totale. C'est notre engagement depuis le premier jour. »" },
      { key: "quote.author", label: "Citation — nom", type: "text", default: "KEGNON Emmanuel" },
      { key: "quote.role", label: "Citation — fonction", type: "text", default: "Fondateur & CEO, AgriWin Togo" },
      { key: "quote.image", label: "Citation — portrait", type: "image",
        default: "images/photos/farmer-portrait-web.jpg" },
      { key: "expertise.eyebrow", label: "Section expertise — étiquette", type: "text", default: "Ce que nous faisons" },
      { key: "specialty.eyebrow", label: "Bande spécialité — étiquette", type: "text", default: "Notre spécialité" },
      { key: "specialty.title", label: "Bande spécialité — titre", type: "text",
        default: "Des plants tropicaux suivis du semis jusqu'à la livraison" },
      { key: "specialty.text", label: "Bande spécialité — texte", type: "textarea",
        default: "Manguiers, avocatiers, cocotiers, agrumes, teck, moringa... chaque plant est contrôlé avant de quitter notre pépinière de Kégué." },
      { key: "specialty.image", label: "Bande spécialité — photo", type: "image",
        default: "images/photos/seedling-tray-band-web.jpg" },
      { key: "gallery.eyebrow", label: "Galerie ambiance — étiquette", type: "text", default: "Ambiance & terrain" },
      { key: "gallery.title", label: "Galerie ambiance — titre", type: "text", default: "Le travail de la terre, au quotidien" },
      { key: "cta.title", label: "Bandeau final — titre", type: "text", default: "Un projet agricole en tête ?" },
      { key: "cta.text", label: "Bandeau final — texte", type: "textarea",
        default: "Décrivez-nous votre besoin : nos experts vous répondent rapidement avec une solution adaptée et un devis clair." },
    ],
  },

  "a-propos": {
    label: "À propos",
    file: "a-propos.html",
    fields: [
      { key: "hero.title", label: "Bandeau — titre", type: "textarea",
        default: "Une entreprise togolaise, née pour faire gagner l'agriculture" },
      { key: "hero.lead", label: "Bandeau — texte", type: "textarea",
        default: "Depuis Kégué, AgriWin Togo met son expertise au service de tous ceux qui veulent réussir un projet agricole — du particulier passionné à l'investisseur international." },
      { key: "hero.image", label: "Bandeau — photo de fond", type: "image",
        default: "images/photos/man-planting-tree-web.jpg" },
      { key: "story.eyebrow", label: "Notre histoire — étiquette", type: "text", default: "Notre histoire" },
      { key: "story.title", label: "Notre histoire — titre", type: "text", default: "Fondée en 2025, avec une ambition claire" },
      { key: "story.p1", label: "Notre histoire — paragraphe 1", type: "textarea",
        default: "AgriWin Togo est une entreprise d'expertise et de prestation de services agricoles, de formation et d'écoulement de produits agricoles, avec un accent particulier sur les plants tropicaux très recherchés sur le marché togolais et sous-régional." },
      { key: "story.p2", label: "Notre histoire — paragraphe 2", type: "textarea",
        default: "Basés à Kégué, nous avons construit notre offre autour d'un constat : de nombreux porteurs de projets agricoles manquent d'un accompagnement technique fiable, de plants de qualité et de débouchés pour leurs récoltes. AgriWin Togo répond à ces trois besoins à la fois, dans une seule et même structure de confiance." },
      { key: "story.p3", label: "Notre histoire — paragraphe 3", type: "textarea",
        default: "Aujourd'hui, notre clientèle s'étend des particuliers et petits producteurs aux entreprises, ONG et investisseurs internationaux qui cherchent un partenaire agricole solide au Togo." },
      { key: "story.image", label: "Notre histoire — photo", type: "image",
        default: "images/photos/seedling-tray-band-web.jpg" },
      { key: "mission.title", label: "Notre mission — titre", type: "text", default: "Notre mission" },
      { key: "mission.text", label: "Notre mission — texte", type: "textarea",
        default: "Rendre l'expertise agricole, les plants de qualité et les débouchés commerciaux accessibles à tous les porteurs de projets, quelle que soit leur taille, au Togo et au-delà." },
      { key: "vision.title", label: "Notre vision — titre", type: "text", default: "Notre vision" },
      { key: "vision.text", label: "Notre vision — texte", type: "textarea",
        default: "Devenir une référence ouest-africaine de l'accompagnement agricole intégré, reconnue pour la qualité de ses plants tropicaux et le sérieux de ses prestations." },
      { key: "quote.text", label: "Citation — texte", type: "textarea",
        default: "« Nous voulons que chaque client, qu'il soit à Kégué ou à l'international, reçoive des plants de qualité et un accompagnement dans lequel il peut avoir une confiance totale. C'est notre engagement depuis le premier jour. »" },
      { key: "quote.author", label: "Citation — nom", type: "text", default: "KEGNON Emmanuel" },
      { key: "quote.role", label: "Citation — fonction", type: "text", default: "Fondateur & CEO, AgriWin Togo" },
      { key: "quote.image", label: "Citation — portrait", type: "image",
        default: "images/photos/farmer-portrait-web.jpg" },
      { key: "cta.title", label: "Bandeau final — titre", type: "text", default: "Envie de collaborer avec nous ?" },
      { key: "cta.text", label: "Bandeau final — texte", type: "textarea",
        default: "Que vous soyez un particulier, une entreprise ou une ONG, parlons de votre projet agricole." },
    ],
  },

  services: {
    label: "Nos services",
    file: "services.html",
    fields: [
      { key: "hero.title", label: "Bandeau — titre", type: "textarea",
        default: "Des services agricoles complets, pensés pour votre réussite" },
      { key: "hero.lead", label: "Bandeau — texte", type: "textarea",
        default: "Du conseil à la commercialisation, en passant par la formation et la fourniture de plants, AgriWin Togo vous accompagne à chaque étape de votre projet agricole." },
      { key: "hero.image", label: "Bandeau — photo de fond", type: "image",
        default: "images/photos/nursery-hands-seedling-web.jpg" },

      { key: "conseil.title", label: "Service 1 — titre", type: "text", default: "Expertise & conseil agricole" },
      { key: "conseil.text", label: "Service 1 — texte", type: "textarea",
        default: "Nous réalisons le diagnostic de vos terrains, étudions la faisabilité de votre projet et vous recommandons les cultures, plants ou élevages les plus adaptés à votre sol, votre climat et vos objectifs." },

      { key: "prestations.title", label: "Service 2 — titre", type: "text", default: "Prestations de services agricoles" },
      { key: "prestations.text", label: "Service 2 — texte", type: "textarea",
        default: "Nous exécutons pour vous les travaux agricoles : préparation de terrain, plantation, entretien des cultures et suivi technique régulier, pour des résultats fiables et mesurables." },
      { key: "prestations.image", label: "Service 2 — photo", type: "image",
        default: "images/photos/man-planting-tree-web.jpg" },

      { key: "formation.title", label: "Service 3 — titre", type: "text", default: "Formation agricole" },
      { key: "formation.text", label: "Service 3 — texte", type: "textarea",
        default: "Nous formons particuliers, coopératives et porteurs de projets aux techniques agricoles modernes : pépinière, greffage, maraîchage, élevage et gestion d'exploitation." },

      { key: "ecoulement.title", label: "Service 4 — titre", type: "text", default: "Écoulement de produits agricoles" },
      { key: "ecoulement.text", label: "Service 4 — texte", type: "textarea",
        default: "Nous aidons les producteurs à trouver des débouchés fiables pour leurs récoltes, en les mettant en relation avec des acheteurs locaux et internationaux." },
      { key: "ecoulement.image", label: "Service 4 — photo", type: "image",
        default: "images/photos/woman-market-web.jpg" },

      { key: "pepiniere.title", label: "Service 5 — titre", type: "text", default: "Pépinière & plants tropicaux" },
      { key: "pepiniere.text", label: "Service 5 — texte", type: "textarea",
        default: "Notre spécialité : la production et la vente de plants tropicaux très recherchés — manguiers, avocatiers, cocotiers, agrumes, teck et bien d'autres — prêts à être mis en terre." },
      { key: "pepiniere.image", label: "Service 5 — photo", type: "image",
        default: "images/photos/nursery-hands-seedling-web.jpg" },

      { key: "elevage.title", label: "Service 6 — titre", type: "text", default: "Accompagnement en élevage" },
      { key: "elevage.text", label: "Service 6 — texte", type: "textarea",
        default: "Nous conseillons et fournissons des sujets d'élevage (volaille, petits ruminants) pour vous aider à démarrer ou développer une activité d'élevage rentable et bien encadrée." },

      { key: "cta.title", label: "Bandeau final — titre", type: "text", default: "Un besoin sur mesure ?" },
      { key: "cta.text", label: "Bandeau final — texte", type: "textarea",
        default: "Chaque projet agricole est unique. Contactez-nous pour une solution adaptée à votre terrain et à votre budget." },
    ],
  },

  produits: {
    label: "Nos produits",
    file: "produits.html",
    fields: [
      { key: "hero.title", label: "Bandeau — titre", type: "textarea",
        default: "Des produits agricoles de qualité, prêts à planter ou à élever" },
      { key: "hero.lead", label: "Bandeau — texte", type: "textarea",
        default: "Arbres fruitiers, agrumes, épices, herbes aromatiques et plantes d'ornement — plus de 50 plants sélectionnés et suivis en pépinière." },
      { key: "hero.image", label: "Bandeau — photo de fond", type: "image",
        default: "images/photos/seedling-tray-band-web.jpg" },
      { key: "families.eyebrow", label: "Section familles — étiquette", type: "text", default: "Nos familles de produits" },
      { key: "families.title", label: "Section familles — titre", type: "text",
        default: "Tout ce qu'il faut pour démarrer ou développer votre production" },
      { key: "specialty.eyebrow", label: "Notre spécialité — étiquette", type: "text", default: "Notre spécialité" },
      { key: "specialty.p1", label: "Notre spécialité — paragraphe 1", type: "textarea",
        default: "AgriWin Togo met un accent particulier sur la production de plants tropicaux à forte valeur ajoutée : manguiers, avocatiers, cocotiers, agrumes et bien d'autres variétés très recherchées par les investisseurs agricoles." },
      { key: "specialty.p2", label: "Notre spécialité — paragraphe 2", type: "textarea",
        default: "Chaque plant est suivi en pépinière avant livraison, pour garantir un taux de reprise élevé une fois mis en terre. Nous proposons également des commandes en gros pour les projets de vergers et de reboisement." },
      { key: "specialty.image", label: "Notre spécialité — photo", type: "image",
        default: "images/photos/nursery-hands-seedling-web.jpg" },
      { key: "cta.title", label: "Bandeau final — titre", type: "text", default: "Prêt à passer commande ?" },
      { key: "cta.text", label: "Bandeau final — texte", type: "textarea",
        default: "Consultez notre catalogue avec photos, descriptions et prix indicatifs, puis commandez en un clic via WhatsApp." },
    ],
  },

  realisations: {
    label: "Nos réalisations",
    file: "realisations.html",
    fields: [
      { key: "hero.title", label: "Bandeau — titre", type: "textarea",
        default: "Des projets agricoles concrets, menés avec nos clients" },
      { key: "hero.lead", label: "Bandeau — texte", type: "textarea",
        default: "Un aperçu de l'univers AgriWin Togo — la galerie de nos propres réalisations (pépinière, chantiers, formations) sera mise en ligne dès que les photos nous seront transmises." },
      { key: "hero.image", label: "Bandeau — photo de fond", type: "image",
        default: "images/photos/man-planting-tree-web.jpg" },
      { key: "gallery.eyebrow", label: "Galerie — étiquette", type: "text", default: "Ambiance & terrain" },
      { key: "gallery.title", label: "Galerie — titre", type: "text", default: "Le travail de la terre, au quotidien" },
      { key: "cta.title", label: "Bandeau final — titre", type: "text", default: "Votre projet pourrait être le prochain" },
      { key: "cta.text", label: "Bandeau final — texte", type: "textarea",
        default: "Parlons de vos besoins et voyons comment AgriWin Togo peut vous accompagner." },
    ],
  },

  catalogue: {
    label: "Catalogue",
    file: "catalogue.html",
    fields: [
      { key: "hero.title", label: "Bandeau — titre", type: "text", default: "Catalogue de nos produits" },
      { key: "hero.lead", label: "Bandeau — texte", type: "textarea",
        default: "Plus de 50 plants : arbres fruitiers, agrumes, épices, herbes aromatiques et plantes d'ornement. Commande simple via WhatsApp — paiement en ligne bientôt disponible (Phase 2)." },
      { key: "hero.image", label: "Bandeau — photo de fond", type: "image",
        default: "images/photos/woman-market-web.jpg" },
      { key: "phase2.eyebrow", label: "Bloc boutique en ligne — étiquette", type: "text", default: "Phase 2 — bientôt disponible" },
      { key: "phase2.title", label: "Bloc boutique en ligne — titre", type: "text",
        default: "Une vraie boutique en ligne arrive prochainement" },
      { key: "phase2.text", label: "Bloc boutique en ligne — texte", type: "textarea",
        default: "Dès la validation de notre compte marchand, vous pourrez ajouter vos produits au panier et régler directement en ligne via T-Money ou Flooz/Moov Money. En attendant, chaque commande se fait simplement via WhatsApp ou notre formulaire de contact." },
    ],
  },

  contact: {
    label: "Contact",
    file: "contact.html",
    fields: [
      { key: "hero.title", label: "Bandeau — titre", type: "text", default: "Parlons de votre projet agricole" },
      { key: "hero.lead", label: "Bandeau — texte", type: "textarea",
        default: "Une question, une commande, un devis ? Notre équipe vous répond rapidement par téléphone, WhatsApp ou e-mail." },
      { key: "hero.image", label: "Bandeau — photo de fond", type: "image",
        default: "images/photos/farmer-portrait-web.jpg" },
      { key: "form.title", label: "Formulaire — titre", type: "text", default: "Envoyez-nous votre demande" },
      { key: "form.text", label: "Formulaire — texte", type: "textarea",
        default: "Remplissez le formulaire ci-dessous : votre message sera transmis via WhatsApp ou e-mail, au choix." },
      { key: "map.note", label: "Note sous la carte", type: "text",
        default: "📍 Kégué, Togo — localisation approximative, à ajuster avec l'adresse exacte." },
    ],
  },
};

const DEFAULT_CONTENT = {};
for (const pageId of Object.keys(PAGES)) {
  for (const field of PAGES[pageId].fields) {
    DEFAULT_CONTENT[`${pageId}.${field.key}`] = field.default;
  }
}

const DEFAULT_NAV = [
  { id: "a-propos", label: "À propos", href: "a-propos.html", order: 1, hidden: false },
  { id: "services", label: "Nos services", href: "services.html", order: 2, hidden: false },
  { id: "produits", label: "Nos produits", href: "produits.html", order: 3, hidden: false },
  { id: "realisations", label: "Nos réalisations", href: "realisations.html", order: 4, hidden: false },
  { id: "catalogue", label: "Catalogue", href: "catalogue.html", order: 5, hidden: false },
  { id: "contact", label: "Contact", href: "contact.html", order: 6, hidden: false },
];

module.exports = { PAGES, DEFAULT_CONTENT, DEFAULT_NAV };
