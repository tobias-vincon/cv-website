/*
 * Sprachumschaltung für die rechtlichen Seiten (Impressum, Datenschutz).
 * Beide Sprachen stehen im HTML; angezeigt wird die gewählte.
 * Reihenfolge: ?lang=… → gespeicherte Wahl (wie auf der Hauptseite) → Englisch.
 */
(function () {
  "use strict";
  var lang = "en";
  try {
    var fromUrl = new URLSearchParams(location.search).get("lang");
    var stored = localStorage.getItem("cv-lang");
    lang = fromUrl === "de" || fromUrl === "en" ? fromUrl : stored === "de" || stored === "en" ? stored : "en";
  } catch (e) { /* Standard verwenden */ }

  function apply(l) {
    lang = l;
    document.documentElement.lang = l;
    document.title = document.body.getAttribute("data-title-" + l) || document.title;
    document.querySelectorAll("[data-lang-block]").forEach(function (n) {
      n.hidden = n.getAttribute("data-lang-block") !== l;
    });
    document.querySelectorAll(".lang-switch button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l));
    });
    document.querySelectorAll("[data-href-lang]").forEach(function (a) {
      a.href = a.getAttribute("data-href-lang") + "?lang=" + l;
    });
  }

  document.querySelectorAll(".lang-switch button").forEach(function (b) {
    b.addEventListener("click", function () {
      var l = b.getAttribute("data-lang");
      try { localStorage.setItem("cv-lang", l); } catch (e) {}
      apply(l);
    });
  });
  apply(lang);
})();
