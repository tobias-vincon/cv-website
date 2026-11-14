# CV-Webseite als Git-Baum

Lebenslauf von Dr.-Ing. Tobias Vinçon, dargestellt als vertikaler `git log --graph`.
Reines HTML/CSS/JavaScript, ohne Build-Schritt und ohne Abhängigkeiten.

```
cv-website/
├── index.html          Seitengerüst
├── data/cv.js          ALLE Inhalte (Branches, Commits, Profil)  ← hier editieren
├── js/graph.js         Rendering des Git-Graphen (SVG)
├── css/style.css       Aussehen, Farben, Dark/Light-Mode
├── CLAUDE.md           Projektkontext für Claude Code
└── .vscode/            Empfohlene VS-Code-Erweiterungen
```

## Lokal ansehen

- Einfach: `index.html` doppelklicken, sie läuft direkt im Browser.
- Komfortabel: In VS Code die Erweiterung **Live Server** installieren, dann unten rechts
  auf **Go Live** klicken. Die Seite lädt bei jedem Speichern automatisch neu.

## Inhalte ändern

Alles steht in `data/cv.js`. Ein neuer Karriereschritt ist ein neuer Eintrag am Ende von `commits`:

```js
{
  id: "neuer-job",
  branch: "main",
  parents: ["bosch3"],          // Vorgänger-Commit
  date: "2027",
  type: "feat",
  title: "Head of Data …",
  org: "Firma, Ort",
  head: true,                   // und beim alten Commit "head: true" entfernen
  details: ["Stichpunkt 1", "Stichpunkt 2"],
}
```

- **Abzweigung** (neuer Branch): Commit auf neuem `branch`, dessen Parent auf einem anderen Branch liegt.
- **Merge**: Commit mit zwei Parents, der erste ist der Vorgänger auf dem eigenen Branch.
- **Tag** (z. B. Abschluss): `tag: "v4.0-…"`.

## Einmalige Einrichtung (Windows)

1. **Git installieren**: <https://git-scm.com/download/win> (oder `winget install Git.Git`).
   Danach einmalig im Terminal:
   ```
   git config --global user.name "Tobias Vinçon"
   git config --global user.email "deine@mail.de"
   ```
2. **VS Code**: Ordner `cv-website` öffnen (*Datei → Ordner öffnen*). VS Code schlägt die
   empfohlenen Erweiterungen aus `.vscode/extensions.json` vor:
   - **Claude Code** (Anthropic): Claude direkt in VS Code, mit deinem Claude-Konto anmelden
   - **Live Server**: lokale Vorschau
3. **Repository anlegen**: In VS Code links *Quellcodeverwaltung* → **Repository initialisieren**,
   alle Dateien committen.
4. **GitHub**: *Auf GitHub veröffentlichen* (gleiche Ansicht) wählen, Konto verbinden,
   öffentliches Repository z. B. `cv` oder `<benutzername>.github.io` anlegen lassen.

## Online stellen mit GitHub Pages (kostenlos)

1. Im Repository auf GitHub: **Settings → Pages**
2. *Source*: **Deploy from a branch**, Branch `main`, Ordner `/ (root)` → **Save**
3. Nach ca. 1 Minute ist die Seite erreichbar unter
   `https://<benutzername>.github.io/cv/` (bzw. `https://<benutzername>.github.io/`,
   wenn das Repository so heißt).

Jeder `git push` aktualisiert die Seite automatisch. Eine eigene Domain lässt sich unter
*Settings → Pages → Custom domain* eintragen.

## Mit Claude weiterentwickeln

Claude-Code-Panel in VS Code öffnen und z. B. fragen:

- „Füge einen Englisch/Deutsch-Umschalter hinzu“
- „Ergänze einen Branch `side/projects` mit meinen Nebenprojekten“
- „Füge Druck-Styles hinzu, damit die Seite als PDF gut aussieht“

`CLAUDE.md` erklärt Claude den Aufbau des Projekts, damit Änderungen zur Struktur passen.
