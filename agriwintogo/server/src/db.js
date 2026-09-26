const fs = require("fs");
const path = require("path");
const { DEFAULT_CONTENT, DEFAULT_NAV } = require("./content-schema");

const DATA_DIR = path.join(__dirname, "..", "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const NAV_FILE = path.join(DATA_DIR, "nav.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON(file, fallback) {
  ensureDataDir();
  if (!fs.existsSync(file)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    console.error("Erreur de lecture " + file + " :", err.message);
    return fallback;
  }
}

/* Écriture atomique : on écrit dans un fichier temporaire puis on renomme,
   pour ne jamais laisser un fichier .json à moitié écrit si le process
   s'arrête au mauvais moment. */
function writeJSON(file, data) {
  ensureDataDir();
  const tmp = file + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

const DEFAULT_SETTINGS = {
  phone: "+228 96 63 82 00",
  phoneDigits: "22896638200",
  email: "agriwintogo@gmail.com",
  facebook: "https://facebook.com/agriwintogo",
  tiktok: "https://tiktok.com/@agriwintogo",
  address: "Kégué, Togo",
};

module.exports = {
  PRODUCTS_FILE,
  SETTINGS_FILE,

  getProducts() {
    return readJSON(PRODUCTS_FILE, []);
  },
  saveProducts(products) {
    writeJSON(PRODUCTS_FILE, products);
  },

  getSettings() {
    return Object.assign({}, DEFAULT_SETTINGS, readJSON(SETTINGS_FILE, {}));
  },
  saveSettings(settings) {
    writeJSON(SETTINGS_FILE, settings);
  },

  CONTENT_FILE,
  getContent() {
    return Object.assign({}, DEFAULT_CONTENT, readJSON(CONTENT_FILE, {}));
  },
  saveContent(content) {
    writeJSON(CONTENT_FILE, content);
  },

  NAV_FILE,
  getNav() {
    const nav = readJSON(NAV_FILE, null);
    return nav && nav.length ? nav : DEFAULT_NAV.slice();
  },
  saveNav(nav) {
    writeJSON(NAV_FILE, nav);
  },
};
