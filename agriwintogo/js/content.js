/**
 * Contenu et menu modifiables depuis /admin.
 * Sans serveur (ou si les fichiers api/*.json sont absents), le site garde
 * le texte écrit directement dans le HTML — comportement inchangé.
 */
(function () {
  function currentFile() {
    var last = window.location.pathname.split("/").pop();
    return last || "index.html";
  }

  function navLinkHtml(item) {
    var target = item.href.split("#")[0];
    var isActive = target === currentFile();
    var isExternal = /^https?:\/\//.test(item.href);
    var extra = isExternal ? ' target="_blank" rel="noopener"' : "";
    var cls = isActive ? ' class="active"' : "";
    var text = String(item.label).replace(/[&<>]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
    });
    return '<a href="' + item.href + '"' + cls + extra + ">" + text + "</a>";
  }

  function applyMenu(nav) {
    if (!nav || !nav.length) return;
    var linksHtml = nav.map(navLinkHtml).join("");

    var mainNav = document.querySelector(".main-nav");
    if (mainNav) mainNav.innerHTML = linksHtml;

    var mobileNavLinks = document.getElementById("mobileNavLinks");
    if (mobileNavLinks) mobileNavLinks.innerHTML = linksHtml;

    var footerNavLinks = document.getElementById("footerNavLinks");
    if (footerNavLinks) {
      footerNavLinks.innerHTML =
        '<li><a href="index.html">Accueil</a></li>' +
        nav.map(function (item) {
          var text = String(item.label).replace(/[&<>]/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c];
          });
          return "<li><a href=\"" + item.href + "\">" + text + "</a></li>";
        }).join("");
    }
  }

  function applyContent(content) {
    if (!content) return;
    document.querySelectorAll("[data-ck]").forEach(function (el) {
      var key = el.getAttribute("data-ck");
      if (!(key in content) || content[key] == null) return;
      var value = content[key];
      if (el.tagName === "IMG") {
        el.setAttribute("src", value);
      } else {
        el.textContent = value;
      }
    });
  }

  fetch("api/menu.json")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(applyMenu)
    .catch(function () {}); // le menu écrit dans le HTML reste affiché

  fetch("api/contenu.json")
    .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
    .then(applyContent)
    .catch(function () {}); // le texte écrit dans le HTML reste affiché
})();
