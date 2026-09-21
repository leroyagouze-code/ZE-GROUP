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

module.exports = router;
