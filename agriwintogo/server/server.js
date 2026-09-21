require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");

const { seed } = require("./src/seed");
const adminRoutes = require("./src/routes/admin");
const apiRoutes = require("./src/routes/api");

seed(); // importe le catalogue existant une seule fois si data/products.json n'existe pas encore

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_ROOT = path.join(__dirname, ".."); // le dossier agriwintogo/ (site statique)

app.disable("x-powered-by");

app.use(
  session({
    name: "agriwin.sid",
    secret: process.env.SESSION_SECRET || "change-moi-en-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 12, // 12h
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" && process.env.TRUST_PROXY === "1",
    },
  })
);

// Assets propres au panneau d'administration (CSS)
app.use("/admin/assets", express.static(path.join(__dirname, "public")));

// Panneau d'administration
app.use("/admin", adminRoutes);

// API publique (lue par le site statique)
app.use("/api", apiRoutes);

// Le site public (HTML/CSS/JS/images existants) — inchangé, servi tel quel
app.use(express.static(SITE_ROOT, { extensions: ["html"] }));

app.use((req, res) => {
  res.status(404).send("Page introuvable.");
});

app.listen(PORT, () => {
  console.log(`AgriWin Togo — serveur démarré sur http://localhost:${PORT}`);
  console.log(`Panneau d'administration : http://localhost:${PORT}/admin/connexion`);
});
