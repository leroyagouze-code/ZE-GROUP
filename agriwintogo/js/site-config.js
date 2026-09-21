/* AgriWin Togo — coordonnées du site (téléphone, WhatsApp, e-mail, réseaux).
   Utilise les valeurs déjà écrites dans les pages par défaut, puis les
   met à jour automatiquement si le serveur (panneau d'administration)
   est lancé et que ces valeurs ont été modifiées dans /admin/parametres. */
(function () {
  "use strict";

  window.AGRIWIN_SETTINGS = {
    phone: "+228 96 63 82 00",
    phoneDigits: "22896638200",
    email: "agriwintogo@gmail.com",
    facebook: "https://facebook.com/agriwintogo",
    tiktok: "https://tiktok.com/@agriwintogo",
    address: "Kégué, Togo",
  };

  function replaceTrailingText(el, newText) {
    for (var i = el.childNodes.length - 1; i >= 0; i--) {
      var node = el.childNodes[i];
      if (node.nodeType === 3 && node.textContent.trim() !== "") {
        var hadLeadingSpace = /^\s/.test(node.textContent);
        node.textContent = (hadLeadingSpace ? " " : "") + newText;
        return;
      }
    }
    if (el.children.length === 0) el.textContent = newText;
  }

  function applySettings(s) {
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.setAttribute("href", "tel:+" + s.phoneDigits);
      replaceTrailingText(a, s.phone);
    });

    document.querySelectorAll('a[href*="wa.me/"]').forEach(function (a) {
      var href = a.getAttribute("href").replace(/wa\.me\/\d+/, "wa.me/" + s.phoneDigits);
      a.setAttribute("href", href);
      if (a.children.length === 0 && /\d{6,}/.test(a.textContent.replace(/\D/g, ""))) {
        a.textContent = s.phone;
      }
    });

    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      var href = a.getAttribute("href");
      var query = href.indexOf("?") !== -1 ? href.slice(href.indexOf("?")) : "";
      a.setAttribute("href", "mailto:" + s.email + query);
      replaceTrailingText(a, s.email);
    });

    if (s.facebook) {
      document.querySelectorAll('a[href*="facebook.com"]').forEach(function (a) {
        a.setAttribute("href", s.facebook);
      });
    }
    if (s.tiktok) {
      document.querySelectorAll('a[href*="tiktok.com"]').forEach(function (a) {
        a.setAttribute("href", s.tiktok);
      });
    }
  }

  fetch("api/parametres.json")
    .then(function (res) {
      if (!res.ok) throw new Error("api indisponible");
      return res.json();
    })
    .then(function (settings) {
      window.AGRIWIN_SETTINGS = settings;
      applySettings(settings);
    })
    .catch(function () {
      /* Pas de serveur lancé (ex. site ouvert en double-cliquant sur un
         fichier) : on garde simplement les coordonnées déjà écrites dans
         la page — rien à faire. */
    });
})();
