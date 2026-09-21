/* Importe une fois les produits déjà présents dans js/products.js
   (ceux utilisés par le site statique) dans data/products.json,
   pour que le panneau d'administration démarre avec le vrai catalogue
   au lieu d'une liste vide. Ne fait rien si products.json existe déjà. */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const db = require("./db");

function loadStaticProducts() {
  const file = path.join(__dirname, "..", "..", "js", "products.js");
  const code = fs.readFileSync(file, "utf8");
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  return sandbox.window.AGRIWIN_PRODUCTS || [];
}

function seed() {
  if (fs.existsSync(db.PRODUCTS_FILE)) {
    console.log("data/products.json existe déjà — pas de ré-import.");
    return;
  }
  const products = loadStaticProducts().map((p) => ({
    ...p,
    active: true,
    createdAt: new Date().toISOString(),
  }));
  db.saveProducts(products);
  console.log(`Importé ${products.length} produits depuis js/products.js dans data/products.json`);
}

if (require.main === module) seed();

module.exports = { seed };
