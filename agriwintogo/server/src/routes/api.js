const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/produits.json", (req, res) => {
  const products = db.getProducts().filter((p) => p.active !== false);
  res.json(products);
});

router.get("/parametres.json", (req, res) => {
  res.json(db.getSettings());
});

router.get("/contenu.json", (req, res) => {
  res.json(db.getContent());
});

router.get("/menu.json", (req, res) => {
  const nav = db.getNav()
    .filter((item) => !item.hidden)
    .sort((a, b) => a.order - b.order);
  res.json(nav);
});

module.exports = router;
