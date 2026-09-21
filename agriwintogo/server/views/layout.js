function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

function adminLayout({ title, active, flash, body }) {
  const nav = [
    { href: "/admin/produits", label: "Produits", key: "produits" },
    { href: "/admin/parametres", label: "Paramètres du site", key: "parametres" },
  ];

  const navHtml = nav
    .map(
      (item) =>
        `<a href="${item.href}" class="admin-nav-link${item.key === active ? " active" : ""}">${item.label}</a>`
    )
    .join("");

  const flashHtml = flash
    ? `<div class="admin-flash admin-flash-${flash.type}">${escapeHtml(flash.message)}</div>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)} — Administration AgriWin Togo</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/images/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body>
<div class="admin-shell">
  <header class="admin-topbar">
    <a href="/admin/produits" class="admin-brand">
      <img src="/images/logo.png" alt="AgriWin Togo" width="34" height="36">
      <span>Administration</span>
    </a>
    <nav class="admin-nav">${navHtml}</nav>
    <div class="admin-topbar-actions">
      <a href="/" target="_blank" rel="noopener" class="admin-btn admin-btn-ghost">Voir le site ↗</a>
      <form method="POST" action="/admin/deconnexion" style="display:inline;">
        <button type="submit" class="admin-btn admin-btn-ghost">Déconnexion</button>
      </form>
    </div>
  </header>
  <main class="admin-main">
    ${flashHtml}
    ${body}
  </main>
</div>
</body>
</html>`;
}

function loginLayout({ error }) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Connexion — Administration AgriWin Togo</title>
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/png" href="/images/favicon-32.png">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/admin/assets/admin.css">
</head>
<body class="admin-login-body">
  <form method="POST" action="/admin/connexion" class="admin-login-card">
    <img src="/images/logo.png" alt="AgriWin Togo" width="56" height="59">
    <h1>Espace administration</h1>
    <p>Connectez-vous pour gérer les produits et les coordonnées du site.</p>
    ${error ? `<div class="admin-flash admin-flash-error">${escapeHtml(error)}</div>` : ""}
    <label>Identifiant<input type="text" name="username" autocomplete="username" required autofocus></label>
    <label>Mot de passe<input type="password" name="password" autocomplete="current-password" required></label>
    <button type="submit" class="admin-btn admin-btn-primary">Se connecter</button>
  </form>
</body>
</html>`;
}

module.exports = { adminLayout, loginLayout, escapeHtml };
