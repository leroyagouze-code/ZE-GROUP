/* AgriWin Togo — rendu et filtrage du catalogue (js/products.js requis avant ce fichier) */
(function () {
  "use strict";

  var grid = document.getElementById("catalogueGrid");
  if (!grid) return;

  var searchInput = document.getElementById("catalogueSearch");
  var chipsWrap = document.getElementById("catalogueFilters");
  var emptyState = document.getElementById("catalogueEmpty");
  var resultsCount = document.getElementById("catalogueCount");
  var WHATSAPP_NUMBER = "22896638200"; // TODO: remplacer par le vrai numéro WhatsApp

  var state = { category: "tous", query: "" };

  function stockLabel(stock) {
    return stock === "disponible" ? "En stock" : "Sur commande";
  }

  function productCard(p) {
    var waMsg = encodeURIComponent(
      "Bonjour AgriWin Togo, je suis intéressé(e) par : " + p.name + " (réf. " + p.sku + "). Pouvez-vous me donner plus d'informations ?"
    );
    return (
      '<article class="card product-card" data-id="' + p.id + '">' +
        '<div class="card-media">' +
          (p.badge ? '<span class="product-badge">' + p.badge + "</span>" : "") +
          '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="600" height="600">' +
        "</div>" +
        '<div class="card-body">' +
          '<span class="card-tag">' + stockLabel(p.stock) + "</span>" +
          "<h3>" + p.name + "</h3>" +
          "<p>" + p.description + "</p>" +
          '<div class="product-price"><strong>' + window.formatFCFA(p.price) + "</strong><span>/ " + p.unit + "</span></div>" +
          '<div class="product-actions">' +
            '<a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="https://wa.me/' + WHATSAPP_NUMBER + "?text=" + waMsg + '">Commander</a>' +
            '<a class="btn btn-outline-green btn-sm" href="contact.html?produit=' + encodeURIComponent(p.name) + '">Demander un devis</a>' +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function render() {
    var q = state.query.trim().toLowerCase();
    var items = window.AGRIWIN_PRODUCTS.filter(function (p) {
      var matchCategory = state.category === "tous" || p.category === state.category;
      var matchQuery =
        !q ||
        p.name.toLowerCase().indexOf(q) !== -1 ||
        p.description.toLowerCase().indexOf(q) !== -1;
      return matchCategory && matchQuery;
    });

    grid.innerHTML = items.map(productCard).join("");
    if (resultsCount) {
      resultsCount.textContent =
        items.length + (items.length > 1 ? " produits trouvés" : " produit trouvé");
    }
    if (emptyState) emptyState.classList.toggle("show", items.length === 0);
  }

  if (chipsWrap) {
    chipsWrap.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-chip");
      if (!btn) return;
      chipsWrap.querySelectorAll(".filter-chip").forEach(function (c) {
        c.classList.remove("active");
      });
      btn.classList.add("active");
      state.category = btn.dataset.category;
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      state.query = searchInput.value;
      render();
    });
  }

  render();
})();
