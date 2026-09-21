/* AgriWin Togo — produits vedettes de la page d'accueil (js/products.js requis avant ce fichier) */
(function () {
  "use strict";

  var grid = document.getElementById("featuredGrid");
  if (!grid) return;

  function render(products) {
    var active = products.filter(function (p) { return p.active !== false; });
    // Les produits avec un badge (Populaire, Nouveau...) passent en premier.
    var sorted = active.slice().sort(function (a, b) {
      return (b.badge ? 1 : 0) - (a.badge ? 1 : 0);
    });
    var featured = sorted.slice(0, 4);
    grid.innerHTML = featured.length
      ? featured.map(window.AgriwinProductCardHTML).join("")
      : '<p style="grid-column:1/-1;text-align:center;color:var(--ink-500);">Catalogue en cours de mise à jour.</p>';
  }

  render(window.AGRIWIN_PRODUCTS || []);

  window.AgriwinLoadProducts().then(render);
})();
