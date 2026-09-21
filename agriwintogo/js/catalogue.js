/* AgriWin Togo — rendu et filtrage du catalogue (js/products.js requis avant ce fichier) */
(function () {
  "use strict";

  var grid = document.getElementById("catalogueGrid");
  if (!grid) return;

  var searchInput = document.getElementById("catalogueSearch");
  var chipsWrap = document.getElementById("catalogueFilters");
  var emptyState = document.getElementById("catalogueEmpty");
  var resultsCount = document.getElementById("catalogueCount");

  var state = { category: "tous", query: "" };
  var allProducts = window.AGRIWIN_PRODUCTS || [];

  function render() {
    var q = state.query.trim().toLowerCase();
    var items = allProducts.filter(function (p) {
      var matchCategory = state.category === "tous" || p.category === state.category;
      var matchQuery =
        !q ||
        p.name.toLowerCase().indexOf(q) !== -1 ||
        p.description.toLowerCase().indexOf(q) !== -1;
      return matchCategory && matchQuery;
    });

    grid.innerHTML = items.map(window.AgriwinProductCardHTML).join("");
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

  render(); // affichage immédiat avec les données statiques (pas d'attente)

  window.AgriwinLoadProducts().then(function (products) {
    allProducts = products;
    render(); // ré-affiche avec les données à jour dès qu'elles arrivent du serveur
  });
})();
