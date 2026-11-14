# Projektkontext für Claude

Persönliche CV-Webseite von Dr.-Ing. Tobias Vinçon. Der Lebenslauf wird als vertikaler
Git-Graph (`git log --graph`) dargestellt: Lebensabschnitte sind Commits, parallele Phasen
(Studium, Promotion neben dem Beruf) sind Branches, Abschlüsse sind Tags.

## Architektur
- Statische Seite ohne Build-Schritt, ohne Frameworks, ohne npm. Muss per Doppelklick auf
  `index.html` (file://) und auf GitHub Pages funktionieren. Deshalb liegen die Daten in
  `data/cv.js` als `window.CV = {...}` und nicht als JSON, das per `fetch` geladen würde.
- `data/cv.js`: einzige Quelle für Inhalte. Commits sind chronologisch, ältester zuerst.
  Texte sind zweisprachig: String (gilt für beide Sprachen) oder `{ en: "…", de: "…" }`.
- `js/graph.js`: erzeugt Karten als HTML, misst deren Position und zeichnet Linien und
  Punkte als SVG darüber. Neu zeichnen bei Resize über `ResizeObserver`.
- `css/style.css`: Farben als CSS-Variablen (`--b0` … `--b5` = Branch-Farben),
  Dark Mode als Standard, Light Mode über `prefers-color-scheme` oder `<html data-theme>`
  (Umschalter oben rechts). Eigene Druck-Styles (`@media print`) für einen PDF-tauglichen Ausdruck.
- Funktionen in `js/graph.js`: Sprache EN/DE (Standard EN, `?lang=de`), Kurzfassung (`?view=summary`
  blendet `docs`- und `minor`-Commits aus), "Alle aufklappen", Kennzahlen (`stat`, Paper werden
  gezählt), Heatmap pro Jahr, Branch-Filter (`?branch=research/phd`), Terminal (Taste `` ` ``,
  Befehle nur auf Englisch), Einblend-Animation (aus bei `prefers-reduced-motion`).
- SEO: `index.html` enthält bewusst eine statische Kopie der wichtigsten Inhalte (Titel, Beschreibung,
  JSON-LD `ProfilePage`/`Person`, Kopfbereich, `<noscript>`-Kurzfassung) für Suchmaschinen ohne
  JavaScript. Bei inhaltlichen Änderungen in `data/cv.js` diese Stellen mitpflegen.
- Adresse: https://tobiasvincon.de/ (in `canonical`, `og:url`, `og:image`, JSON-LD, `robots.txt`,
  `sitemap.xml`). `CNAME` ist für GitHub Pages; `lastmod` in `sitemap.xml` bei Änderungen anpassen.
- Porträt: `assets/photo-320.jpg` auf der Seite, `assets/photo.jpg` (800 px) als Vorschaubild.
- Rechtliches: `impressum.html` und `privacy.html` (Deutsch maßgeblich, Englisch als Übersetzung,
  Umschaltung über `js/legal.js`, `noindex`). Die Postanschrift steht NUR dort, nirgends sonst.
  Bei neuen externen Diensten (Schriften, Analyse, Einbettungen) die Datenschutzerklärung anpassen.

## Konventionen
- Sprache der Inhalte: Englisch (Standard) und Deutsch, neue Texte immer in beiden Sprachen. Code-Kommentare auf Deutsch.
- Keine externen Abhängigkeiten oder CDNs ohne Rückfrage.
- Keine privaten Daten (Adresse, Telefon, Geburtsdatum) auf der Seite.
- Barrierefreiheit beibehalten: Buttons für Interaktion, `aria-expanded`, Fokus sichtbar.
- Nach Änderungen Desktop- und Mobilansicht (≈ 390 px Breite) prüfen.
