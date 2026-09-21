const bcrypt = require("bcryptjs");

const ADMIN_USER = process.env.ADMIN_USER || "admin";

/* On accepte soit un mot de passe déjà "haché" (ADMIN_PASSWORD_HASH, recommandé
   en production), soit un simple mot de passe en clair (ADMIN_PASSWORD, plus
   simple à configurer) qu'on hache une fois en mémoire au démarrage. */
let passwordHashPromise = null;
function getPasswordHash() {
  if (!passwordHashPromise) {
    if (process.env.ADMIN_PASSWORD_HASH) {
      passwordHashPromise = Promise.resolve(process.env.ADMIN_PASSWORD_HASH);
    } else {
      const plain = process.env.ADMIN_PASSWORD || "agriwin2025";
      passwordHashPromise = bcrypt.hash(plain, 10);
    }
  }
  return passwordHashPromise;
}

async function checkCredentials(username, password) {
  if (username !== ADMIN_USER) return false;
  const hash = await getPasswordHash();
  return bcrypt.compare(password || "", hash);
}

function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.redirect("/admin/connexion?next=" + encodeURIComponent(req.originalUrl));
}

module.exports = { ADMIN_USER, checkCredentials, requireAuth };
