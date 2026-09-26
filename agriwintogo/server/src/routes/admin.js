const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");

const db = require("../db");
const { checkCredentials, requireAuth } = require("../auth");
const { adminLayout, loginLayout, escapeHtml } = require("../../views/layout");
const { PAGES } = require("../content-schema");

const router = express.Router();

const CATEGORIES = [
  { id: "fruitiers", label: "Arbres & plants fruitiers" },
  { id: "agrumes", label: "Agrumes sélectionnés" },
  { id: "epices", label: "Épices, arômes & condiments" },
  { id: "herbes", label: "Herbes aromatiques & santé" },
  { id: "ornement", label: "Plantes d'ornement & intérieur" },
];
const categoryLabel = (id) => (CATEGORIES.find((c) => c.id === id) || {}).label || id;

const UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "images", "products");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeBase = (req.body.name || "produit")
      .toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "produit";
    cb(null, `${safeBase}-${Date.now()}${crypto.randomBytes(3).toString("hex")}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype)) {
      return cb(new Error("Le fichier doit être une image (JPG, PNG, WEBP...)."));
    }
    cb(null, true);
  },
});

const CONTENT_UPLOAD_DIR = path.join(__dirname, "..", "..", "..", "images", "content");
fs.mkdirSync(CONTENT_UPLOAD_DIR, { recursive: true });

const contentStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, CONTENT_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const safeField = file.fieldname.replace(/[^a-z0-9]+/gi, "-");
    cb(null, `${req.params.pageId}-${safeField}-${Date.now()}${crypto.randomBytes(3).toString("hex")}${ext}`);
  },
});
const uploadContent = multer({
  storage: contentStorage,
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!/^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(file.mimetype)) {
      return cb(new Error("Le fichier doit être une image (JPG, PNG, WEBP...)."));
    }
    cb(null, true);
  },
});

function popFlash(req) {
  const flash = req.session.flash;
  delete req.session.flash;
  return flash;
}
function setFlash(req, type, message) {
  req.session.flash = { type, message };
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ---------- Connexion ---------- */

router.get("/connexion", (req, res) => {
  if (req.session && req.session.isAdmin) return res.redirect("/admin/produits");
  res.send(loginLayout({}));
});

router.post("/connexion", express.urlencoded({ extended: true }), async (req, res) => {
  const { username, password } = req.body;
  const ok = await checkCredentials(username, password);
  if (!ok) {
    return res.status(401).send(loginLayout({ error: "Identifiant ou mot de passe incorrect." }));
  }
  req.session.isAdmin = true;
  req.session.username = username;
  const next = typeof req.query.next === "string" && req.query.next.startsWith("/admin") ? req.query.next : "/admin/produits";
  res.redirect(next);
});

router.post("/deconnexion", (req, res) => {
  req.session.destroy(() => res.redirect("/admin/connexion"));
});

router.get("/", requireAuth, (req, res) => res.redirect("/admin/produits"));

/* ---------- Produits ---------- */

router.get("/produits", requireAuth, (req, res) => {
  const products = db.getProducts();
  const rows = products
    .map(
      (p) => `
      <tr>
        <td><img class="thumb" src="/${escapeHtml(p.image)}" alt=""></td>
        <td><strong>${escapeHtml(p.name)}</strong><br><span style="color:var(--ink-500);font-size:12.5px;">${escapeHtml(p.sku || "")}</span></td>
        <td>${escapeHtml(categoryLabel(p.category))}</td>
        <td>${
          p.priceOnRequest
            ? "Sur demande"
            : `${new Intl.NumberFormat("fr-FR").format(p.price)}${p.priceMax ? " – " + new Intl.NumberFormat("fr-FR").format(p.priceMax) : ""} FCFA / ${escapeHtml(p.unit)}`
        }</td>
        <td><span class="admin-badge ${p.active === false ? "admin-badge-off" : "admin-badge-on"}">${p.active === false ? "Masqué" : "Visible"}</span></td>
        <td>
          <div class="row-actions">
            <a class="admin-btn admin-btn-outline admin-btn-sm" href="/admin/produits/${p.id}/modifier">Modifier</a>
            <form method="POST" action="/admin/produits/${p.id}/supprimer" onsubmit="return confirm('Supprimer ce produit ?');">
              <button type="submit" class="admin-btn admin-btn-danger admin-btn-sm">Supprimer</button>
            </form>
          </div>
        </td>
      </tr>`
    )
    .join("");

  const body = `
    <div class="admin-page-head">
      <div>
        <h1>Produits (${products.length})</h1>
        <p>Ce que vous voyez ici s'affiche automatiquement dans le catalogue du site.</p>
      </div>
      <a href="/admin/produits/nouveau" class="admin-btn admin-btn-primary">+ Ajouter un produit</a>
    </div>
    <div class="admin-table-wrap">
      ${
        products.length
          ? `<table class="admin-table">
              <thead><tr><th>Photo</th><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Statut</th><th></th></tr></thead>
              <tbody>${rows}</tbody>
            </table>`
          : `<div class="admin-empty">Aucun produit pour l'instant. <a href="/admin/produits/nouveau">Ajoutez le premier</a>.</div>`
      }
    </div>`;

  res.send(adminLayout({ title: "Produits", active: "produits", flash: popFlash(req), body }));
});

function productForm(p = {}) {
  const categoryOptions = CATEGORIES.map(
    (c) => `<option value="${c.id}" ${p.category === c.id ? "selected" : ""}>${c.label}</option>`
  ).join("");
  return `
    <form class="admin-form" method="POST" action="${p.id ? `/admin/produits/${p.id}` : "/admin/produits"}" enctype="multipart/form-data">
      <div class="admin-field full">
        <label>Nom du produit
          <input type="text" name="name" value="${escapeHtml(p.name || "")}" required placeholder="Ex. Manguier greffé (variété améliorée)">
        </label>
      </div>
      <div class="admin-field">
        <label>Catégorie
          <select name="category" required>${categoryOptions}</select>
        </label>
      </div>
      <div class="admin-field">
        <label>Référence (SKU)
          <input type="text" name="sku" value="${escapeHtml(p.sku || "")}" placeholder="Ex. AWT-PL-001">
        </label>
      </div>
      <div class="admin-field">
        <label>Prix (FCFA)
          <input type="number" name="price" min="0" step="1" value="${p.price != null ? p.price : ""}" required>
        </label>
        <span class="hint">Laissez à 0 et cochez « Sur demande » ci-dessous si le prix n'est pas fixe.</span>
      </div>
      <div class="admin-field">
        <label>Prix maximum (optionnel, pour une fourchette)
          <input type="number" name="priceMax" min="0" step="1" value="${p.priceMax != null ? p.priceMax : ""}">
        </label>
        <span class="hint">Ex. 1 500 à 2 500 FCFA affichera « 1 500 – 2 500 FCFA ». Laissez vide pour un prix unique.</span>
      </div>
      <div class="admin-field">
        <label style="flex-direction:row;align-items:center;gap:8px;">
          <input type="checkbox" name="priceOnRequest" value="1" ${p.priceOnRequest ? "checked" : ""} style="width:auto;">
          Prix sur demande (masque le prix)
        </label>
      </div>
      <div class="admin-field">
        <label>Unité
          <input type="text" name="unit" value="${escapeHtml(p.unit || "plant")}" required placeholder="Ex. plant, sachet, sujet...">
        </label>
      </div>
      <div class="admin-field">
        <label>Disponibilité
          <select name="stock">
            <option value="disponible" ${p.stock === "disponible" ? "selected" : ""}>En stock</option>
            <option value="sur commande" ${p.stock !== "disponible" ? "selected" : ""}>Sur commande</option>
          </select>
        </label>
      </div>
      <div class="admin-field">
        <label>Badge (optionnel)
          <input type="text" name="badge" value="${escapeHtml(p.badge || "")}" placeholder="Ex. Populaire, Nouveau, Meilleure vente">
        </label>
      </div>
      <div class="admin-field full">
        <label>Description
          <textarea name="description" rows="3" required>${escapeHtml(p.description || "")}</textarea>
        </label>
      </div>
      <div class="admin-field full">
        <label>Photo du produit</label>
        ${p.image ? `<div class="admin-current-image"><img src="/${escapeHtml(p.image)}" alt=""><span class="hint">Photo actuelle — choisissez un fichier ci-dessous pour la remplacer.</span></div>` : ""}
        <input type="file" name="image" accept="image/*">
        <span class="hint">JPG, PNG ou WEBP, 3 Mo maximum. ${p.id ? "Laissez vide pour garder la photo actuelle." : "Laissez vide pour utiliser une image par défaut."}</span>
      </div>
      <div class="admin-field">
        <label style="flex-direction:row;align-items:center;gap:8px;">
          <input type="checkbox" name="active" value="1" ${p.active === false ? "" : "checked"} style="width:auto;">
          Visible sur le site
        </label>
      </div>
      <div class="admin-form-actions">
        <button type="submit" class="admin-btn admin-btn-primary">${p.id ? "Enregistrer les modifications" : "Ajouter le produit"}</button>
        <a href="/admin/produits" class="admin-btn admin-btn-outline">Annuler</a>
      </div>
    </form>`;
}

router.get("/produits/nouveau", requireAuth, (req, res) => {
  const body = `<div class="admin-page-head"><div><h1>Ajouter un produit</h1></div></div>
    <div class="admin-card">${productForm({})}</div>`;
  res.send(adminLayout({ title: "Ajouter un produit", active: "produits", flash: popFlash(req), body }));
});

router.post("/produits", requireAuth, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      setFlash(req, "error", err.message);
      return res.redirect("/admin/produits/nouveau");
    }
    next();
  });
}, (req, res) => {
  const products = db.getProducts();
  const id = slugify(req.body.name) + "-" + Date.now().toString(36);
  const image = req.file ? `images/products/${req.file.filename}` : "images/placeholders/product-manguier.svg";
  const product = {
    id,
    sku: (req.body.sku || "").trim(),
    name: req.body.name.trim(),
    category: req.body.category,
    price: Math.max(0, parseInt(req.body.price, 10) || 0),
    priceMax: req.body.priceMax ? Math.max(0, parseInt(req.body.priceMax, 10) || 0) : null,
    priceOnRequest: req.body.priceOnRequest === "1",
    unit: req.body.unit.trim(),
    stock: req.body.stock === "disponible" ? "disponible" : "sur commande",
    badge: (req.body.badge || "").trim() || null,
    image,
    description: req.body.description.trim(),
    active: req.body.active === "1",
    createdAt: new Date().toISOString(),
  };
  products.push(product);
  db.saveProducts(products);
  setFlash(req, "success", `Produit « ${product.name} » ajouté.`);
  res.redirect("/admin/produits");
});

router.get("/produits/:id/modifier", requireAuth, (req, res) => {
  const product = db.getProducts().find((p) => p.id === req.params.id);
  if (!product) {
    setFlash(req, "error", "Produit introuvable.");
    return res.redirect("/admin/produits");
  }
  const body = `<div class="admin-page-head"><div><h1>Modifier : ${escapeHtml(product.name)}</h1></div></div>
    <div class="admin-card">${productForm(product)}</div>`;
  res.send(adminLayout({ title: "Modifier un produit", active: "produits", flash: popFlash(req), body }));
});

router.post("/produits/:id", requireAuth, (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      setFlash(req, "error", err.message);
      return res.redirect(`/admin/produits/${req.params.id}/modifier`);
    }
    next();
  });
}, (req, res) => {
  const products = db.getProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    setFlash(req, "error", "Produit introuvable.");
    return res.redirect("/admin/produits");
  }
  const existing = products[idx];
  const oldImage = existing.image;
  const newImage = req.file ? `images/products/${req.file.filename}` : existing.image;

  products[idx] = {
    ...existing,
    sku: (req.body.sku || "").trim(),
    name: req.body.name.trim(),
    category: req.body.category,
    price: Math.max(0, parseInt(req.body.price, 10) || 0),
    priceMax: req.body.priceMax ? Math.max(0, parseInt(req.body.priceMax, 10) || 0) : null,
    priceOnRequest: req.body.priceOnRequest === "1",
    unit: req.body.unit.trim(),
    stock: req.body.stock === "disponible" ? "disponible" : "sur commande",
    badge: (req.body.badge || "").trim() || null,
    image: newImage,
    description: req.body.description.trim(),
    active: req.body.active === "1",
    updatedAt: new Date().toISOString(),
  };
  db.saveProducts(products);

  // Supprime l'ancienne photo seulement si elle a été remplacée et qu'elle nous appartient
  if (req.file && oldImage && oldImage.startsWith("images/products/")) {
    const oldPath = path.join(__dirname, "..", "..", "..", oldImage);
    fs.unlink(oldPath, () => {});
  }

  setFlash(req, "success", `Produit « ${products[idx].name} » mis à jour.`);
  res.redirect("/admin/produits");
});

router.post("/produits/:id/supprimer", requireAuth, (req, res) => {
  const products = db.getProducts();
  const idx = products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) {
    setFlash(req, "error", "Produit introuvable.");
    return res.redirect("/admin/produits");
  }
  const [removed] = products.splice(idx, 1);
  db.saveProducts(products);
  if (removed.image && removed.image.startsWith("images/products/")) {
    const imgPath = path.join(__dirname, "..", "..", "..", removed.image);
    fs.unlink(imgPath, () => {});
  }
  setFlash(req, "success", `Produit « ${removed.name} » supprimé.`);
  res.redirect("/admin/produits");
});

/* ---------- Contenu des pages ---------- */

router.get("/contenu", requireAuth, (req, res) => {
  const cards = Object.keys(PAGES)
    .map((pageId) => {
      const page = PAGES[pageId];
      return `
        <a class="admin-card admin-card-link" href="/admin/contenu/${pageId}">
          <h3>${escapeHtml(page.label)}</h3>
          <p class="hint">${page.fields.length} éléments modifiables (textes${page.fields.some((f) => f.type === "image") ? " et photos" : ""})</p>
        </a>`;
    })
    .join("");

  const body = `
    <div class="admin-page-head">
      <div>
        <h1>Contenu des pages</h1>
        <p>Choisissez une page pour modifier ses titres, ses textes et ses photos. Les éléments de structure (boutons, icônes) ne sont pas modifiables ici.</p>
      </div>
    </div>
    <div class="admin-card-grid">${cards}</div>`;

  res.send(adminLayout({ title: "Contenu des pages", active: "contenu", flash: popFlash(req), body }));
});

router.get("/contenu/:pageId", requireAuth, (req, res) => {
  const page = PAGES[req.params.pageId];
  if (!page) {
    setFlash(req, "error", "Page introuvable.");
    return res.redirect("/admin/contenu");
  }
  const content = db.getContent();
  const fieldsHtml = page.fields
    .map((field) => {
      const fullKey = `${req.params.pageId}.${field.key}`;
      const value = content[fullKey] != null ? content[fullKey] : field.default;
      if (field.type === "image") {
        return `
          <div class="admin-field full">
            <label>${escapeHtml(field.label)}</label>
            <div class="admin-current-image"><img src="/${escapeHtml(value)}" alt=""><span class="hint">Photo actuelle — choisissez un fichier ci-dessous pour la remplacer.</span></div>
            <input type="file" name="${escapeHtml(field.key)}" accept="image/*">
            <span class="hint">JPG, PNG ou WEBP, 3 Mo maximum. Laissez vide pour garder la photo actuelle.</span>
          </div>`;
      }
      if (field.type === "textarea") {
        return `
          <div class="admin-field full">
            <label>${escapeHtml(field.label)}
              <textarea name="${escapeHtml(field.key)}" rows="3">${escapeHtml(value)}</textarea>
            </label>
          </div>`;
      }
      return `
        <div class="admin-field full">
          <label>${escapeHtml(field.label)}
            <input type="text" name="${escapeHtml(field.key)}" value="${escapeHtml(value)}">
          </label>
        </div>`;
    })
    .join("");

  const body = `
    <div class="admin-page-head">
      <div>
        <h1>Contenu — ${escapeHtml(page.label)}</h1>
        <p>Les modifications apparaissent immédiatement sur le site public.</p>
      </div>
    </div>
    <div class="admin-card">
      <form class="admin-form" method="POST" action="/admin/contenu/${req.params.pageId}" enctype="multipart/form-data">
        ${fieldsHtml}
        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Enregistrer</button>
          <a href="/admin/contenu" class="admin-btn admin-btn-outline">Annuler</a>
        </div>
      </form>
    </div>`;

  res.send(adminLayout({ title: `Contenu — ${page.label}`, active: "contenu", flash: popFlash(req), body }));
});

router.post("/contenu/:pageId", requireAuth, (req, res, next) => {
  const page = PAGES[req.params.pageId];
  if (!page) {
    setFlash(req, "error", "Page introuvable.");
    return res.redirect("/admin/contenu");
  }
  const imageFields = page.fields.filter((f) => f.type === "image").map((f) => ({ name: f.key, maxCount: 1 }));
  uploadContent.fields(imageFields)(req, res, (err) => {
    if (err) {
      setFlash(req, "error", err.message);
      return res.redirect(`/admin/contenu/${req.params.pageId}`);
    }
    next();
  });
}, (req, res) => {
  const page = PAGES[req.params.pageId];
  const content = db.getContent();
  const files = req.files || {};

  for (const field of page.fields) {
    const fullKey = `${req.params.pageId}.${field.key}`;
    if (field.type === "image") {
      if (files[field.key] && files[field.key][0]) {
        content[fullKey] = `images/content/${files[field.key][0].filename}`;
      }
      // pas de fichier envoyé : on garde la photo actuelle
    } else {
      content[fullKey] = (req.body[field.key] || "").trim();
    }
  }
  db.saveContent(content);
  setFlash(req, "success", `Contenu de « ${page.label} » mis à jour.`);
  res.redirect(`/admin/contenu/${req.params.pageId}`);
});

/* ---------- Menu du site ---------- */

router.get("/menu", requireAuth, (req, res) => {
  const nav = db.getNav().slice().sort((a, b) => a.order - b.order);
  const rows = nav
    .map(
      (item, i) => `
      <tr>
        <td colspan="2">
          <form method="POST" action="/admin/menu/${item.id}" class="admin-inline-form" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
            <input type="text" name="label" value="${escapeHtml(item.label)}" required style="min-width:160px;" placeholder="Texte affiché">
            <input type="text" name="href" value="${escapeHtml(item.href)}" required style="min-width:160px;" placeholder="Page cible">
            <button type="submit" class="admin-btn admin-btn-outline admin-btn-sm">Enregistrer</button>
          </form>
        </td>
        <td style="white-space:nowrap;">
          <form method="POST" action="/admin/menu/${item.id}/deplacer" class="admin-inline-form" style="display:inline;">
            <input type="hidden" name="direction" value="haut">
            <button type="submit" class="admin-btn admin-btn-outline admin-btn-sm" ${i === 0 ? "disabled" : ""}>↑</button>
          </form>
          <form method="POST" action="/admin/menu/${item.id}/deplacer" class="admin-inline-form" style="display:inline;">
            <input type="hidden" name="direction" value="bas">
            <button type="submit" class="admin-btn admin-btn-outline admin-btn-sm" ${i === nav.length - 1 ? "disabled" : ""}>↓</button>
          </form>
        </td>
        <td>
          <form method="POST" action="/admin/menu/${item.id}/visibilite" class="admin-inline-form">
            <input type="hidden" name="hidden" value="${item.hidden ? "0" : "1"}">
            <button type="submit" class="admin-btn ${item.hidden ? "admin-btn-outline" : "admin-btn-primary"} admin-btn-sm">${item.hidden ? "Masqué — afficher" : "Visible — masquer"}</button>
          </form>
        </td>
      </tr>`
    )
    .join("");

  const body = `
    <div class="admin-page-head">
      <div>
        <h1>Menu du site</h1>
        <p>Renommez les liens, changez leur ordre (↑ ↓), ou masquez-en un temporairement. Pour supprimer définitivement un lien, contactez-nous d'abord.</p>
      </div>
    </div>
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead><tr><th>Texte affiché</th><th>Lien (page cible)</th><th></th><th>Ordre</th><th>Statut</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="admin-card" style="margin-top:24px;">
      <h3 style="margin-top:0;">Ajouter un lien au menu</h3>
      <form class="admin-form" method="POST" action="/admin/menu">
        <div class="admin-field">
          <label>Texte affiché
            <input type="text" name="label" required placeholder="Ex. Blog">
          </label>
        </div>
        <div class="admin-field">
          <label>Page cible
            <input type="text" name="href" required placeholder="Ex. contact.html ou services.html#conseil">
          </label>
          <span class="hint">Nom exact du fichier de la page (index.html, a-propos.html...), ou une adresse complète (https://...) pour un lien externe.</span>
        </div>
        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Ajouter au menu</button>
        </div>
      </form>
    </div>`;

  res.send(adminLayout({ title: "Menu", active: "menu", flash: popFlash(req), body }));
});

router.post("/menu", requireAuth, express.urlencoded({ extended: true }), (req, res) => {
  const nav = db.getNav();
  const label = (req.body.label || "").trim();
  const href = (req.body.href || "").trim();
  if (!label || !href) {
    setFlash(req, "error", "Le texte et le lien sont obligatoires.");
    return res.redirect("/admin/menu");
  }
  let id = slugify(label) || "lien";
  if (nav.some((item) => item.id === id)) id = id + "-" + Date.now().toString(36);
  const maxOrder = nav.reduce((max, item) => Math.max(max, item.order), 0);
  nav.push({ id, label, href, order: maxOrder + 1, hidden: false });
  db.saveNav(nav);
  setFlash(req, "success", `Lien « ${label} » ajouté au menu.`);
  res.redirect("/admin/menu");
});

router.post("/menu/:id", requireAuth, express.urlencoded({ extended: true }), (req, res) => {
  const nav = db.getNav();
  const item = nav.find((i) => i.id === req.params.id);
  if (!item) {
    setFlash(req, "error", "Lien introuvable.");
    return res.redirect("/admin/menu");
  }
  item.label = (req.body.label || item.label).trim();
  item.href = (req.body.href || item.href).trim();
  db.saveNav(nav);
  setFlash(req, "success", "Menu mis à jour.");
  res.redirect("/admin/menu");
});

router.post("/menu/:id/deplacer", requireAuth, express.urlencoded({ extended: true }), (req, res) => {
  const nav = db.getNav().slice().sort((a, b) => a.order - b.order);
  const idx = nav.findIndex((i) => i.id === req.params.id);
  const swapWith = req.body.direction === "haut" ? idx - 1 : idx + 1;
  if (idx === -1 || swapWith < 0 || swapWith >= nav.length) {
    return res.redirect("/admin/menu");
  }
  const tmp = nav[idx].order;
  nav[idx].order = nav[swapWith].order;
  nav[swapWith].order = tmp;
  db.saveNav(nav);
  res.redirect("/admin/menu");
});

router.post("/menu/:id/visibilite", requireAuth, express.urlencoded({ extended: true }), (req, res) => {
  const nav = db.getNav();
  const item = nav.find((i) => i.id === req.params.id);
  if (item) {
    item.hidden = req.body.hidden === "1";
    db.saveNav(nav);
    setFlash(req, "success", item.hidden ? `« ${item.label} » masqué du menu.` : `« ${item.label} » visible dans le menu.`);
  }
  res.redirect("/admin/menu");
});

/* ---------- Paramètres du site ---------- */

router.get("/parametres", requireAuth, (req, res) => {
  const s = db.getSettings();
  const body = `
    <div class="admin-page-head">
      <div>
        <h1>Paramètres du site</h1>
        <p>Ces coordonnées s'affichent automatiquement sur toutes les pages (téléphone, WhatsApp, e-mail, réseaux sociaux).</p>
      </div>
    </div>
    <div class="admin-card">
      <form class="admin-form" method="POST" action="/admin/parametres">
        <div class="admin-field">
          <label>Téléphone affiché
            <input type="text" name="phone" value="${escapeHtml(s.phone)}" required placeholder="+228 96 63 82 00">
          </label>
        </div>
        <div class="admin-field">
          <label>Numéro pour Appel / WhatsApp (chiffres uniquement, avec indicatif pays)
            <input type="text" name="phoneDigits" value="${escapeHtml(s.phoneDigits)}" required pattern="[0-9]+" placeholder="22896638200">
          </label>
        </div>
        <div class="admin-field full">
          <label>E-mail
            <input type="email" name="email" value="${escapeHtml(s.email)}" required>
          </label>
        </div>
        <div class="admin-field">
          <label>Lien Facebook
            <input type="url" name="facebook" value="${escapeHtml(s.facebook)}">
          </label>
        </div>
        <div class="admin-field">
          <label>Lien TikTok
            <input type="url" name="tiktok" value="${escapeHtml(s.tiktok)}">
          </label>
        </div>
        <div class="admin-field full">
          <label>Adresse
            <input type="text" name="address" value="${escapeHtml(s.address)}">
          </label>
        </div>
        <div class="admin-form-actions">
          <button type="submit" class="admin-btn admin-btn-primary">Enregistrer</button>
        </div>
      </form>
    </div>`;
  res.send(adminLayout({ title: "Paramètres", active: "parametres", flash: popFlash(req), body }));
});

router.post("/parametres", requireAuth, express.urlencoded({ extended: true }), (req, res) => {
  const digits = (req.body.phoneDigits || "").replace(/[^0-9]/g, "");
  db.saveSettings({
    phone: (req.body.phone || "").trim(),
    phoneDigits: digits,
    email: (req.body.email || "").trim(),
    facebook: (req.body.facebook || "").trim(),
    tiktok: (req.body.tiktok || "").trim(),
    address: (req.body.address || "").trim(),
  });
  setFlash(req, "success", "Paramètres enregistrés.");
  res.redirect("/admin/parametres");
});

module.exports = router;
