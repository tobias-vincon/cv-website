/*
 * Rendert den Lebenslauf aus data/cv.js als vertikalen Git-Graphen.
 * Ablauf: 1) Commit-Karten als HTML erzeugen
 *         2) Position jeder Karte messen
 *         3) Linien und Punkte als SVG darüberlegen
 * Bei Größenänderung (Fenster, aufgeklappte Details) wird neu gezeichnet.
 *
 * Zusätzlich: Sprache EN/DE, Hell/Dunkel, Kurzansicht, "Alle aufklappen",
 * Kennzahlen (git log --stat), Heatmap, Branch-Filter per URL und ein
 * verstecktes Terminal (Taste `).
 */
(function () {
  "use strict";

  const cv = window.CV;
  const LANE_W = 24;    // Abstand zwischen zwei Spuren in px
  const PAD = 16;       // Rand links/rechts im Graphen
  const CURVE_MAX = 30; // Höhe einer Abzweig-/Merge-Kurve
  const R = 6;          // Radius eines Commit-Punktes
  const NOW = new Date().getFullYear();

  const $ = (id) => document.getElementById(id);
  const root = document.documentElement;
  const wrap = document.querySelector(".graph-wrap");
  const list = $("commits");
  const svg = $("graph");
  const NS = "http://www.w3.org/2000/svg";
  const reduceMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* ---------- Hilfsfunktionen ---------- */
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* Storage nicht verfügbar */ } },
  };
  let params;
  try { params = new URLSearchParams(location.search); } catch (e) { params = new URLSearchParams(); }

  /* Parameter in der Adresszeile setzen, ohne neu zu laden (geht nicht überall bei file://) */
  function setParam(key, value) {
    try {
      const u = new URL(location.href);
      if (value == null) u.searchParams.delete(key);
      else u.searchParams.set(key, value);
      history.replaceState(null, "", u);
    } catch (e) { /* ignorieren */ }
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === "text") node.textContent = v;
      else if (k === "style") node.style.cssText = v;
      else node.setAttribute(k, v);
    }
    for (const child of [].concat(children)) if (child) node.append(child);
    return node;
  }

  /* Kurzer, stabiler Pseudo-Hash pro Commit */
  function shortHash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
  }

  /* ---------- Sprache ---------- */
  const UI = {
    en: {
      title: "Dr.-Ing. Tobias Vinçon – Data & AI Platforms Leader | CV",
      skip: "Skip to career path",
      settings: "Settings",
      contact: "Contact",
      branches: "Branches",
      career: "Career path",
      activity: "Contributions",
      sum: (c, p, y) => `${c} commits · ${p} papers · ${y} years`,
      heatCell: (y, n) => `${y}: ${n === 0 ? "no commits" : n + (n === 1 ? " contribution" : " contributions")}`,
      newest: "↓ newest first",
      oldest: "↑ oldest first",
      summary: "Summary",
      summaryTitle: "Show only roles and degrees",
      expand: "Expand all",
      collapse: "Collapse all",
      focus: "Focus areas",
      leadership: "Leadership experience",
      languages: "Languages",
      certificates: "Certificates",
      interests: "Off the clock",
      legal: "Legal notice",
      privacy: "Privacy policy",
      portrait: "Portrait of",
      toLight: "Switch to light mode",
      toDark: "Switch to dark mode",
      terminal: "Open terminal (shortcut: `)",
      closeTerminal: "Close terminal",
      papers: "papers",
    },
    de: {
      title: "Dr.-Ing. Tobias Vinçon – Data & AI Plattformen | Lebenslauf",
      skip: "Zum Lebenspfad springen",
      settings: "Einstellungen",
      contact: "Kontakt",
      branches: "Branches",
      career: "Lebenspfad",
      activity: "Beiträge",
      sum: (c, p, y) => `${c} Commits · ${p} Paper · ${y} Jahre`,
      heatCell: (y, n) => `${y}: ${n === 0 ? "keine Commits" : n + (n === 1 ? " Beitrag" : " Beiträge")}`,
      newest: "↓ neueste zuerst",
      oldest: "↑ älteste zuerst",
      summary: "Kurzfassung",
      summaryTitle: "Nur Stationen und Abschlüsse zeigen",
      expand: "Alle aufklappen",
      collapse: "Alle zuklappen",
      focus: "Schwerpunkte",
      leadership: "Führungserfahrung",
      languages: "Sprachen",
      certificates: "Zertifikate",
      interests: "Ausgleich",
      legal: "Impressum",
      privacy: "Datenschutz",
      portrait: "Porträt von",
      toLight: "Zum hellen Design wechseln",
      toDark: "Zum dunklen Design wechseln",
      terminal: "Terminal öffnen (Taste: `)",
      closeTerminal: "Terminal schließen",
      papers: "Paper",
    },
  };
  // Standard ist Englisch; Deutsch über den Umschalter oder index.html?lang=de
  let lang = params.get("lang") || store.get("cv-lang") || "en";
  if (!UI[lang]) lang = "en";

  /* Text in der aktuellen Sprache: String oder { en, de } */
  const tr = (v) => (v == null ? "" : typeof v === "object" ? (v[lang] ?? v.en ?? "") : String(v));
  const ui = (key) => UI[lang][key] ?? UI.en[key];
  const en = (v) => (v && typeof v === "object" ? v.en : String(v ?? ""));

  /* ---------- Icons (eigene, schlichte Strich-Icons) ---------- */
  const ICONS = {
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10.5V17M12 17v-6.5M12 13.5c0-1.8 1.1-3 2.6-3s2.4 1.2 2.4 3V17"/><circle cx="8" cy="7.5" r=".6" fill="currentColor"/>',
    scholar: '<path d="M12 4 2 9.5 12 15l10-5.5L12 4Z"/><path d="M6 12v4c0 1.4 2.7 3 6 3s6-1.6 6-3v-4M22 9.5V14"/>',
    // DBLP: aufgeschlagenes Buch (Publikationsliste)
    dblp: '<path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5C17 4.5 14 5 12 6.5Z"/><path d="M12 6.5v13"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/>',
    book: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5v-15Z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19M9 7h6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.7 5.6 3.7 9s-1.2 6.4-3.7 9c-2.5-2.6-3.7-5.6-3.7-9S9.5 5.6 12 3Z"/>',
    badge: '<circle cx="12" cy="9" r="6"/><path d="m9 14.5-1.5 6.5 4.5-2.5 4.5 2.5-1.5-6.5"/><path d="m9.5 9 1.7 1.7L14.5 7.5"/>',
    heart: '<path d="M12 20s-7.5-4.5-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.5-7.5 10-7.5 10Z"/>',
    bike: '<circle cx="5.5" cy="16" r="3.5"/><circle cx="18.5" cy="16" r="3.5"/><path d="M5.5 16 9 9h6.5l3 7M9 9l3.5 7 3-7M8 6.5h3M15 9l-1-3h2"/>',
    mountain: '<path d="m2.5 19.5 7-12 4.5 7.5 2.5-3.5 5 8Z"/><path d="m7.5 11 2 1.5 2-1.5"/>',
    camera: '<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4Z"/><circle cx="12" cy="13.5" r="3.5"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
    people: '<circle cx="9" cy="8" r="3.2"/><path d="M3 19c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 13.7c.5-.1 1-.2 1.5-.2 2.5 0 4.5 1.8 4.5 4.5"/>',
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.5 3.2 8 7.5 9.5 4.3-1.5 7.5-5 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    route: '<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12c0-4-3-7-8-7 0 4.5 3 7 8 7Z"/><path d="M12 14c0-3.5 2.5-6 7-6 0 4-2.5 6-7 6Z"/>',
    terminal: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M12.5 15H17"/>',
  };
  const icon = (name) => {
    const s = document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24");
    s.setAttribute("aria-hidden", "true");
    s.setAttribute("focusable", "false");
    s.innerHTML = ICONS[name]; // feste Strings aus diesem Skript, keine Fremddaten
    return s;
  };

  /* ---------- Branches & Commits vorbereiten ---------- */
  const branches = new Map();
  cv.branches.forEach((b, i) => {
    branches.set(b.id, { ...b, lane: Number.isInteger(b.lane) ? b.lane : i, color: `var(--b${i % 6})` });
  });
  const laneCount = Math.max(...[...branches.values()].map((b) => b.lane)) + 1;
  const graphW = PAD * 2 + (laneCount - 1) * LANE_W;
  wrap.style.setProperty("--graph-w", graphW + "px");

  const byId = new Map(cv.commits.map((c) => [c.id, c]));
  const chrono = new Map(cv.commits.map((c, i) => [c.id, i]));
  const hashOf = new Map(cv.commits.map((c) => [c.id, shortHash(c.id + en(c.title))]));

  const yearOf = (c) => {
    if (c.year === "now") return NOW;
    if (Number.isInteger(c.year)) return c.year;
    const m = en(c.date).match(/\d{4}/);
    return m ? Number(m[0]) : NOW;
  };
  const isPaper = (d) => d && typeof d === "object" && d.href;
  const paperCount = (c) => (c.details || []).filter(isPaper).length;

  /* Kennzahlen: eigene (stat) plus automatisch gezählte Paper */
  function statsOf(c) {
    const out = (c.stat || []).map((s) => ({ value: s.value, label: s.label }));
    const paperLabel = { en: UI.en.papers, de: UI.de.papers };
    if (c.type === "docs") {
      out.push({ value: paperCount(c), label: paperLabel });
    } else if ((c.parents || []).length > 1) {
      // Merge: alle Paper des zusammengeführten Branches zusammenzählen
      const merged = byId.get(c.parents[1]);
      const n = merged ? cv.commits.filter((o) => o.branch === merged.branch).reduce((s, o) => s + paperCount(o), 0) : 0;
      if (n) out.push({ value: n, label: paperLabel });
    }
    return out;
  }
  const totalPapers = cv.commits.reduce((s, c) => s + paperCount(c), 0);

  /* ---------- Zustand ---------- */
  let newestFirst = store.get("cv-order") !== "asc";
  let summary = params.get("view") === "summary";
  let locked = null;   // fest ausgewählter Branch (Legende, URL, Terminal)
  const openIds = new Set();

  const hidden = (c) => summary && (c.minor || c.type === "docs");
  /* Nächster sichtbarer Vorfahr (für Linien, wenn Commits ausgeblendet sind) */
  function visibleAncestor(id) {
    let c = byId.get(id);
    while (c && hidden(c)) c = byId.get((c.parents || [])[0]);
    return c || null;
  }

  const fromUrl = params.get("branch");
  if (fromUrl) {
    const b = [...branches.values()].find((x) => x.name === fromUrl || x.id === fromUrl);
    if (b) locked = b.id;
  }

  /* ---------- Statische Texte ---------- */
  function applyStatic() {
    root.lang = lang;
    document.title = ui("title");
    document.querySelectorAll("[data-i18n]").forEach((n) => { n.textContent = ui(n.dataset.i18n); });
    document.querySelectorAll("[data-i18n-aria]").forEach((n) => n.setAttribute("aria-label", ui(n.dataset.i18nAria)));
    document.querySelectorAll(".lang-switch button").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang))
    );
    $("term-close").setAttribute("aria-label", ui("closeTerminal"));
    // Rechtliche Seiten in der gewählten Sprache öffnen
    $("link-legal").href = "impressum.html?lang=" + lang;
    $("link-privacy").href = "privacy.html?lang=" + lang;
    const pu = $("print-url");
    pu.textContent = /^https?:/.test(location.href) ? location.href.split(/[?#]/)[0] : "";
  }

  /* ---------- Kopfbereich & README ---------- */
  function renderProfile() {
    const p = cv.person;
    $("name").textContent = p.name;
    $("role").textContent = tr(p.role) + (p.location ? " · " + tr(p.location) : "");
    $("summary").textContent = tr(p.summary);
    renderAvatar(p);
    $("links").replaceChildren(
      ...(p.links || []).map((l) => {
        const label = tr(l.label);
        const external = /^https?:/.test(l.href);
        // rel="me": verknüpft die Profile mit dieser Seite (Identitäts-Hinweis für Suchmaschinen)
        const attrs = { href: l.href, target: external ? "_blank" : null, rel: external ? "me noopener" : null };
        if (!ICONS[l.icon]) return el("a", { ...attrs, text: label });
        // Nur Icon sichtbar; label dient als Tooltip und für Screenreader. data-print für den Ausdruck.
        const a = el("a", {
          ...attrs, class: "icon-link", "aria-label": label, title: label,
          "data-print": l.href.replace(/^mailto:/, "").replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""),
        });
        a.append(icon(l.icon));
        return a;
      })
    );

    renderReadme();
  }

  /* Kennzahl auflösen: "auto:papers" = Anzahl Publikationen, "auto:since:2021" = Jahre seitdem als "N+" */
  function highlightValue(v) {
    if (v === "auto:papers") return String(totalPapers);
    const m = /^auto:since:(\d{4})$/.exec(v);
    if (m) return Math.max(1, NOW - Number(m[1])) + "+";
    return tr(v);
  }

  /* ---------- README: Kennzahlen, Schwerpunkte, Sprachen, Zertifikate, Interessen ---------- */
  function renderReadme() {
    const r = cv.person.readme || {};
    const section = (key, iconName, body, cls) =>
      el("section", { class: "rm-section" + (cls ? " " + cls : "") }, [
        el("h3", { class: "rm-h" }, [icon(iconName), el("span", { text: ui(key) })]),
        body,
      ]);

    const tiles = (r.highlights || []).map((h) =>
      el("div", { class: "rm-tile" }, [
        el("span", { class: "rm-value", text: highlightValue(h.value) }),
        el("span", { class: "rm-label", text: tr(h.label) }),
      ])
    );

    const groups = (r.expertise || []).map((g) =>
      el("div", { class: "rm-group", style: `--c:var(--b${(g.color || 0) % 6})` }, [
        el("h4", { text: tr(g.title) }),
        el("ul", { class: "rm-chips" }, (g.items || []).map((t) => el("li", { text: tr(t) }))),
      ])
    );

    const langs = el("ul", { class: "rm-list" }, (r.languages || []).map((l) =>
      el("li", {}, [
        el("span", { text: tr(l.name) }),
        l.level ? el("span", { class: "rm-level", text: tr(l.level) }) : null,
      ])
    ));
    const certs = el("ul", { class: "rm-list" }, (r.certificates || []).map((c) =>
      el("li", {}, [el("span", { class: "rm-check", "aria-hidden": "true", text: "✓" }), el("span", { text: tr(c) })])
    ));
    const hobbies = el("ul", { class: "rm-hobbies" }, (r.interests || []).map((h) =>
      el("li", {}, [ICONS[h.icon] ? icon(h.icon) : null, el("span", { text: tr(h.label) })])
    ));
    const has = (a) => a && a.length;

    // Führungserfahrung: Verantwortungsbereiche als Karten
    const lead = r.leadership;
    const leadBody = lead
      ? el("div", { class: "rm-lead" }, [
          has(lead.areas)
            ? el("ul", { class: "rm-areas" }, lead.areas.map((a) =>
                el("li", {}, [
                  ICONS[a.icon] ? icon(a.icon) : null,
                  el("div", {}, [
                    el("strong", { text: tr(a.title) }),
                    el("p", { text: tr(a.text) }),
                  ]),
                ])
              ))
            : null,
        ])
      : null;

    $("readme").replaceChildren(
      el("div", { class: "rm-file" }, [
        el("div", { class: "rm-bar" }, [icon("book"), el("span", { text: "README.md" })]),
        el("div", { class: "rm-body" }, [
          tiles.length ? el("div", { class: "rm-tiles" }, tiles) : null,
          groups.length ? section("focus", "spark", el("div", { class: "rm-groups" }, groups)) : null,
          leadBody ? section("leadership", "compass", leadBody) : null,
          el("div", { class: "rm-cols" }, [
            has(r.languages) ? section("languages", "globe", langs) : null,
            has(r.certificates) ? section("certificates", "badge", certs) : null,
            has(r.interests) ? section("interests", "heart", hobbies) : null,
          ]),
        ]),
      ])
    );
  }

  /* Porträt: person.photo, sonst Initialen (ohne "Dr.-Ing." o. Ä.) */
  function renderAvatar(p) {
    const box = $("avatar");
    const initials = () => {
      const words = p.name.split(/\s+/).filter((w) => !w.includes("."));
      const text = (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
      box.classList.add("is-initials");
      box.replaceChildren(el("span", { "aria-hidden": "true", text }));
    };
    if (!p.photo) return initials();
    const img = el("img", {
      src: p.photo,
      alt: ui("portrait") + " " + p.name.replace(/^(Dr\.-Ing\.|Dr\.|Prof\.)\s*/g, ""),
      width: "160", height: "160", decoding: "async", fetchpriority: "high",
    });
    img.addEventListener("error", initials);
    box.replaceChildren(img);
  }

  /* ---------- Heatmap (Beiträge pro Jahr) ---------- */
  function renderHeatmap() {
    const years = cv.commits.map(yearOf);
    const first = Math.min(...years);
    const perYear = new Map();
    const bump = (y, n, title) => {
      const e = perYear.get(y) || { n: 0, titles: [] };
      e.n += n;
      if (title) e.titles.push(title);
      perYear.set(y, e);
    };
    for (const c of cv.commits) {
      bump(yearOf(c), 1, tr(c.title));
      // Paper zählen in dem Jahr, das die letzte Zwischenüberschrift nennt (sonst Commit-Jahr)
      let y = yearOf(c);
      const papers = new Map();
      for (const d of c.details || []) {
        if (d && d.heading && /^\d{4}$/.test(tr(d.heading))) y = Number(tr(d.heading));
        else if (isPaper(d)) papers.set(y, (papers.get(y) || 0) + 1);
      }
      for (const [py, n] of papers) bump(py, n, n + " " + ui("papers"));
    }
    const level = (n) => (n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4);
    const cells = [];
    for (let y = first; y <= NOW; y++) {
      const e = perYear.get(y) || { n: 0, titles: [] };
      const label = ui("heatCell")(y, e.n);
      // Jahreszahlen nur am Anfang, am Ende und alle 5 Jahre (ohne Überlappung am Rand)
      const showYear = y === first || y === NOW || (y % 5 === 0 && y - first >= 3 && NOW - y >= 3);
      const cell = e.n
        ? el("button", {
            type: "button", class: "cell", "data-level": level(e.n),
            "aria-label": label, title: label + "\n· " + e.titles.join("\n· "),
          })
        : el("span", { class: "cell", "data-level": 0, title: label, "aria-hidden": "true" });
      if (e.n) cell.addEventListener("click", () => jumpToYear(y));
      cells.push(el("li", { class: showYear ? "has-year" : null, "data-year": y }, [
        cell,
        showYear ? el("span", { class: "yr", "aria-hidden": "true", text: String(y) }) : null,
      ]));
    }
    $("heatmap").replaceChildren(...cells);
    $("activity-sum").textContent = ui("sum")(cv.commits.length, totalPapers, NOW - first + 1);
  }

  function jumpToYear(y) {
    const target = cv.commits.find((c) => yearOf(c) === y);
    if (!target) return;
    if (hidden(target)) { summary = false; updateButtons(); renderCommits(); }
    revealCommit(target.id, false);
  }

  /* Commit in den sichtbaren Bereich holen, kurz hervorheben, optional aufklappen */
  function revealCommit(id, open) {
    const li = list.querySelector(`.commit[data-id="${CSS.escape(id)}"]`);
    if (!li) return;
    const card = li.querySelector(".card");
    if (open && card.classList.contains("has-details") && !card.classList.contains("open")) {
      card.querySelector(".toggle").click();
    }
    li.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    card.classList.remove("ping");
    void card.offsetWidth; // Animation neu starten
    card.classList.add("ping");
  }

  /* ---------- Legende & Branch-Filter ---------- */
  function renderLegend() {
    $("legend").replaceChildren(
      ...[...branches.values()].map((b) => {
        const btn = el(
          "button",
          { type: "button", "aria-pressed": String(locked === b.id), style: `--c:${b.color}`, title: tr(b.label), "data-branch-id": b.id },
          [el("span", { class: "swatch" }), b.name]
        );
        btn.addEventListener("mouseenter", () => !locked && focusBranch(b.id));
        btn.addEventListener("mouseleave", () => !locked && focusBranch(null));
        btn.addEventListener("click", () => setLocked(locked === b.id ? null : b.id));
        return el("li", {}, btn);
      })
    );
  }

  function setLocked(id) {
    locked = id;
    document.querySelectorAll("#legend button").forEach((x) =>
      x.setAttribute("aria-pressed", String(x.dataset.branchId === id))
    );
    setParam("branch", id ? branches.get(id).name : null);
    focusBranch(id);
  }

  let focused = null;
  function focusBranch(id) {
    focused = id;
    wrap.classList.toggle("focus", !!id);
    wrap.querySelectorAll("[data-branch]").forEach((n) => {
      n.classList.toggle("is-focus", n.dataset.branch === id);
    });
  }

  /* ---------- Ansicht: Reihenfolge, Kurzfassung, Alle aufklappen ---------- */
  const orderBtn = $("order-toggle");
  const summaryBtn = $("summary-toggle");
  const expandBtn = $("expand-toggle");

  function visibleWithDetails() {
    return cv.commits.filter((c) => !hidden(c) && c.details && c.details.length);
  }
  function updateButtons() {
    orderBtn.textContent = newestFirst ? ui("newest") : ui("oldest");
    summaryBtn.textContent = ui("summary");
    summaryBtn.title = ui("summaryTitle");
    summaryBtn.setAttribute("aria-pressed", String(summary));
    const all = visibleWithDetails();
    const allOpen = all.length > 0 && all.every((c) => openIds.has(c.id));
    expandBtn.textContent = allOpen ? ui("collapse") : ui("expand");
    expandBtn.dataset.state = allOpen ? "open" : "closed";
  }

  orderBtn.addEventListener("click", () => {
    newestFirst = !newestFirst;
    store.set("cv-order", newestFirst ? "desc" : "asc");
    updateButtons();
    renderCommits();
  });
  summaryBtn.addEventListener("click", () => {
    summary = !summary;
    setParam("view", summary ? "summary" : null);
    updateButtons();
    renderCommits();
  });
  expandBtn.addEventListener("click", () => {
    const open = expandBtn.dataset.state !== "open";
    for (const c of visibleWithDetails()) open ? openIds.add(c.id) : openIds.delete(c.id);
    renderCommits();
  });

  /* ---------- Commit-Karten ---------- */
  function renderStats(c) {
    const stats = statsOf(c);
    if (!stats.length) return null;
    return el("p", { class: "stat" }, stats.map((s) => {
      const n = parseInt(String(s.value).replace(/[^\d-]/g, ""), 10);
      const bar = Number.isFinite(n) && n > 0 ? "+".repeat(Math.min(n, 12)) : "";
      return el("span", { class: "stat-item" }, [
        el("span", { class: "stat-label", text: tr(s.label) }),
        el("span", { class: "stat-sep", text: " | " }),
        el("span", { class: "stat-num", text: String(s.value) }),
        bar ? el("span", { class: "stat-bar", "aria-hidden": "true", text: " " + bar }) : null,
      ]);
    }));
  }

  /* Organisation, optional mit Logo auf hellem Untergrund (lesbar im hellen und dunklen Design) */
  function renderOrg(c) {
    const logo = c.logo && cv.logos && cv.logos[c.logo];
    return el("p", { class: "org" }, [
      logo
        ? el("span", { class: "org-logo org-logo-" + c.logo },
            el("img", { src: logo.src, alt: logo.alt, loading: "lazy", decoding: "async" }))
        : null,
      el("span", { text: tr(c.org) }),
    ]);
  }

  function renderDetail(d) {
    if (d && typeof d === "object" && d.heading) {
      return el("li", { class: "detail-heading", text: tr(d.heading) });
    }
    if (isPaper(d)) {
      return el("li", {}, el("a", { href: d.href, target: "_blank", rel: "noopener", text: tr(d.text) }));
    }
    return el("li", { text: tr(d) });
  }

  function renderCommits() {
    const visible = cv.commits.filter((c) => !hidden(c));
    const ordered = newestFirst ? [...visible].reverse() : visible;

    list.replaceChildren(
      ...ordered.map((c) => {
        const b = branches.get(c.branch);
        const refs = [];
        if (c.head) refs.push(el("span", { class: "ref head", text: "HEAD → " + b.name }));
        if (c.tag) refs.push(el("span", { class: "ref tag", text: "tag: " + c.tag }));
        const isTip = !cv.commits.some((o) => (o.parents || []).includes(c.id));
        if (isTip && !c.head) refs.push(el("span", { class: "ref branch", text: b.name }));

        const hasDetails = !!(c.details && c.details.length);
        const isOpen = hasDetails && openIds.has(c.id);
        const detailsId = "d-" + c.id;
        const card = el("article", {
          class: "card" + (hasDetails ? " has-details" : "") + (isOpen ? " open" : ""),
          style: `--c:${b.color}`,
        }, [
          el("div", { class: "card-head" }, [
            el("span", { class: "hash", text: hashOf.get(c.id) }),
            c.type ? el("span", { class: "type", text: c.type }) : null,
            el("h3", { class: "title", text: tr(c.title) }),
            refs.length ? el("span", { class: "refs" }, refs) : null,
          ]),
          c.org ? renderOrg(c) : null,
          renderStats(c),
          hasDetails
            ? el("button", {
                class: "toggle", type: "button",
                "aria-expanded": String(isOpen), "aria-controls": detailsId,
                text: "git show",
              })
            : null,
          hasDetails ? el("ul", { class: "details", id: detailsId }, c.details.map(renderDetail)) : null,
        ]);

        if (hasDetails) {
          const toggle = card.querySelector(".toggle");
          const flip = () => {
            const open = card.classList.toggle("open");
            toggle.setAttribute("aria-expanded", String(open));
            open ? openIds.add(c.id) : openIds.delete(c.id);
            updateButtons();
          };
          card.addEventListener("click", (e) => {
            if (e.target.closest("a")) return;
            flip();
          });
          toggle.addEventListener("click", (e) => { e.stopPropagation(); flip(); });
        }

        const li = el("li", { class: "commit", "data-id": c.id, "data-branch": c.branch }, [
          el("time", { class: "commit-date", datetime: c.year === "now" ? null : String(yearOf(c)), text: tr(c.date) }),
          el("div", { class: "lane-spacer" }),
          card,
        ]);
        li.addEventListener("mouseenter", () => !locked && focusBranch(c.branch));
        li.addEventListener("mouseleave", () => !locked && focusBranch(null));
        return li;
      })
    );
    updateButtons();
    draw();
    focusBranch(locked);
  }

  /* ---------- SVG zeichnen ---------- */
  function svgEl(tag, attrs) {
    const n = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
    return n;
  }

  // Einblend-Animation: Linien wachsen vom ältesten zum neuesten Commit.
  // Zeitbasiert, damit ein Neuzeichnen (Resize, Schriften) die Animation nicht abbricht.
  const STEP = 70, GROW = 450;
  let animStart = null;
  const animTotal = cv.commits.length * STEP + GROW + 300;

  function draw() {
    const wrapTop = wrap.getBoundingClientRect().top;
    const pos = new Map();
    list.querySelectorAll(".commit").forEach((li) => {
      const anchor = li.querySelector(".hash").getBoundingClientRect();
      const c = byId.get(li.dataset.id);
      pos.set(c.id, { x: PAD + branches.get(c.branch).lane * LANE_W, y: anchor.top - wrapTop + anchor.height / 2 });
    });

    svg.setAttribute("width", graphW);
    svg.setAttribute("height", list.offsetHeight);
    svg.replaceChildren();

    if (animStart === null && !reduceMotion && pos.size) animStart = performance.now();
    const elapsed = animStart === null ? Infinity : performance.now() - animStart;
    const animate = elapsed < animTotal;
    const delay = (ms) => `animation-delay:${Math.round(ms - elapsed)}ms`;

    const edges = svgEl("g", {});
    const dots = svgEl("g", {});

    for (const c of cv.commits) {
      const to = pos.get(c.id);
      if (!to) continue;
      (c.parents || []).forEach((pid, i) => {
        const p = visibleAncestor(pid);
        const from = p && pos.get(p.id);
        if (!from) return;
        const dir = from.y > to.y ? -1 : 1; // Richtung vom Parent zum Kind
        const CURVE = Math.min(CURVE_MAX, Math.abs(to.y - from.y));
        let d, branchId;

        if (from.x === to.x) {
          d = `M${from.x},${from.y} L${to.x},${to.y}`;
          branchId = c.branch;
        } else if (i > 0) {
          // Merge: Linie bleibt in der Spur des Parents, biegt kurz vor dem Kind ein
          const yBend = to.y - dir * CURVE;
          d = `M${from.x},${from.y} L${from.x},${yBend} C${from.x},${yBend + dir * CURVE * 0.6} ${to.x},${to.y - dir * CURVE * 0.4} ${to.x},${to.y}`;
          branchId = p.branch;
        } else {
          // Abzweigung: biegt direkt nach dem Parent in die neue Spur ab
          const yBend = from.y + dir * CURVE;
          d = `M${from.x},${from.y} C${from.x},${from.y + dir * CURVE * 0.4} ${to.x},${yBend - dir * CURVE * 0.6} ${to.x},${yBend} L${to.x},${to.y}`;
          branchId = c.branch;
        }
        const attrs = { d, stroke: branches.get(branchId).color, "data-branch": branchId };
        if (animate) Object.assign(attrs, { pathLength: 1, class: "grow", style: delay(chrono.get(p.id) * STEP + 120) });
        edges.append(svgEl("path", attrs));
      });
    }

    for (const c of cv.commits) {
      const pt = pos.get(c.id);
      if (!pt) continue;
      const { x, y } = pt;
      const color = branches.get(c.branch).color;
      const isMerge = (c.parents || []).length > 1;
      const gAttrs = { "data-branch": c.branch };
      if (animate) Object.assign(gAttrs, { class: "pop", style: delay(chrono.get(c.id) * STEP) });
      const g = svgEl("g", gAttrs);

      if (c.head) g.append(svgEl("circle", { class: "head-ring", cx: x, cy: y, r: R + 1, fill: color }));
      if (c.type === "wip") {
        g.append(svgEl("circle", {
          cx: x, cy: y, r: R, fill: "var(--bg)", stroke: color, "stroke-width": 2, "stroke-dasharray": "3 2.5",
        }));
      } else if (isMerge) {
        g.append(svgEl("circle", { cx: x, cy: y, r: R + 1.5, fill: "var(--bg)", stroke: color, "stroke-width": 2.5 }));
        g.append(svgEl("circle", { cx: x, cy: y, r: R - 2.5, fill: color }));
      } else {
        g.append(svgEl("circle", { cx: x, cy: y, r: c.head ? R + 1 : R, fill: color, stroke: "var(--bg)", "stroke-width": 2 }));
      }
      dots.append(g);
    }

    svg.append(edges, dots);
    if (focused) focusBranch(focused);
  }

  /* ---------- Sprache & Hell/Dunkel ---------- */
  document.querySelectorAll(".lang-switch button").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.lang))
  );
  function setLang(l) {
    if (!UI[l] || l === lang) return;
    lang = l;
    store.set("cv-lang", l);
    if (params.has("lang")) setParam("lang", l);
    renderAll();
  }

  const themeBtn = $("theme-toggle");
  const systemLight = window.matchMedia ? matchMedia("(prefers-color-scheme: light)") : null;
  const currentTheme = () => root.getAttribute("data-theme") || (systemLight && systemLight.matches ? "light" : "dark");
  function updateThemeBtn() {
    const t = currentTheme();
    const label = t === "dark" ? ui("toLight") : ui("toDark");
    themeBtn.replaceChildren(icon(t === "dark" ? "sun" : "moon"));
    themeBtn.setAttribute("aria-label", label);
    themeBtn.title = label;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(root).getPropertyValue("--bg").trim() || meta.content;
  }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    store.set("cv-theme", t);
    updateThemeBtn();
  }
  themeBtn.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
  if (systemLight && systemLight.addEventListener) systemLight.addEventListener("change", updateThemeBtn);

  /* ---------- Terminal ---------- */
  const term = $("terminal");
  const termOut = $("term-out");
  const termInput = $("term-input");
  const termBtn = $("term-toggle");
  const termHistory = [];
  let histPos = 0;
  let greeted = false;

  function updateTermBtn() {
    termBtn.replaceChildren(icon("terminal"));
    termBtn.setAttribute("aria-label", ui("terminal"));
    termBtn.title = ui("terminal");
  }
  function print(text, cls) {
    for (const line of String(text).split("\n")) termOut.append(el("div", { class: cls || null, text: line || " " }));
    termOut.scrollTop = termOut.scrollHeight;
  }
  function openTerminal() {
    term.hidden = false;
    termBtn.setAttribute("aria-expanded", "true");
    if (!greeted) {
      greeted = true;
      print(`Welcome to ${cv.person.name}'s CV. Type 'help' to see what you can do.`, "t-muted");
    }
    termInput.focus();
  }
  function closeTerminal() {
    term.hidden = true;
    termBtn.setAttribute("aria-expanded", "false");
    termBtn.focus();
  }
  termBtn.addEventListener("click", () => (term.hidden ? openTerminal() : closeTerminal()));
  $("term-close").addEventListener("click", closeTerminal);

  document.addEventListener("keydown", (e) => {
    const typing = e.target.closest("input, textarea, [contenteditable]");
    if (e.key === "`" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      term.hidden ? openTerminal() : closeTerminal();
    } else if (e.key === "Escape" && !term.hidden) {
      closeTerminal();
    }
  });

  termInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && histPos > 0) { histPos--; termInput.value = termHistory[histPos]; e.preventDefault(); }
    else if (e.key === "ArrowDown") {
      histPos = Math.min(termHistory.length, histPos + 1);
      termInput.value = termHistory[histPos] || "";
      e.preventDefault();
    }
  });

  const findCommit = (q) => {
    q = (q || "").toLowerCase();
    if (!q || q === "head") return cv.commits.find((c) => c.head);
    return byId.get(q) || cv.commits.find((c) => hashOf.get(c.id).startsWith(q));
  };
  const findBranch = (q) => [...branches.values()].find((b) => b.name === q || b.id === q);

  const COMMANDS = {
    help: () => print([
      "Available commands:",
      "  whoami                 who is this?",
      "  git log [--oneline]    list all commits",
      "  git show <id|hash>     show one commit (e.g. git show phd)",
      "  git branch             list branches",
      "  git checkout <branch>  highlight a branch (git checkout -- to reset)",
      "  cat README.md          expertise, languages, interests",
      "  contact                ways to reach me",
      "  lang en|de             switch language",
      "  theme light|dark       switch colours",
      "  clear · exit",
    ].join("\n")),
    whoami: () => print(`${cv.person.name}\n${tr(cv.person.role)} · ${tr(cv.person.location)}\n${tr(cv.person.summary)}`),
    contact: () => print((cv.person.links || []).map((l) => `  ${tr(l.label).replace(/:.*/, "").padEnd(22)} ${l.href.replace(/^mailto:/, "")}`).join("\n")),
    ls: () => print("README.md  cv.js  photo.jpg"),
    cat: (args) => {
      if ((args[0] || "").toLowerCase() !== "readme.md") return print(`cat: ${args[0] || ""}: No such file`, "t-err");
      const r = cv.person.readme || {};
      const out = [];
      if (r.highlights) out.push("## At a glance\n" + r.highlights.map((h) => `- ${highlightValue(h.value)}  ${tr(h.label)}`).join("\n"));
      for (const g of r.expertise || []) out.push(`## ${tr(g.title)}\n` + g.items.map((t) => "- " + tr(t)).join("\n"));
      if (r.leadership) {
        const L = r.leadership;
        out.push(`## ${ui("leadership")}\n` + (L.areas || []).map((a) => `- ${tr(a.title)}: ${tr(a.text)}`).join("\n"));
      }
      if (r.languages) out.push(`## ${ui("languages")}\n` + r.languages.map((l) => `- ${tr(l.name)}${l.level ? " (" + tr(l.level) + ")" : ""}`).join("\n"));
      if (r.certificates) out.push(`## ${ui("certificates")}\n` + r.certificates.map((c) => "- " + tr(c)).join("\n"));
      if (r.interests) out.push(`## ${ui("interests")}\n` + r.interests.map((h) => "- " + tr(h.label)).join("\n"));
      print(out.join("\n\n"));
    },
    lang: (args) => {
      if (!UI[args[0]]) return print("usage: lang en|de", "t-err");
      setLang(args[0]);
      print(`language: ${args[0]}`);
    },
    theme: (args) => {
      if (args[0] !== "light" && args[0] !== "dark") return print("usage: theme light|dark", "t-err");
      setTheme(args[0]);
      print(`theme: ${args[0]}`);
    },
    clear: () => termOut.replaceChildren(),
    exit: () => closeTerminal(),
    sudo: (args) => {
      if (args.join(" ") !== "hire-me") return print("Nice try. (Hint: sudo hire-me)", "t-muted");
      const mail = (cv.person.links || []).find((l) => l.href.startsWith("mailto:"));
      print("Permission granted. Opening mail …", "t-ok");
      if (mail) location.href = mail.href;
    },
    git: (args) => {
      const sub = args[0];
      if (sub === "log") {
        const lines = [...cv.commits].reverse().map((c) => {
          const b = branches.get(c.branch);
          const refs = [c.head ? "HEAD -> " + b.name : null, c.tag ? "tag: " + c.tag : null].filter(Boolean);
          return args.includes("--oneline")
            ? `${hashOf.get(c.id)} ${tr(c.title)}${refs.length ? " (" + refs.join(", ") + ")" : ""}`
            : `commit ${hashOf.get(c.id)}  [${c.id}]${refs.length ? " (" + refs.join(", ") + ")" : ""}\nDate:   ${tr(c.date)}\n\n    ${tr(c.title)}\n`;
        });
        return print(lines.join("\n"));
      }
      if (sub === "show") {
        const c = findCommit(args[1]);
        if (!c) return print(`fatal: unknown revision '${args[1] || ""}'`, "t-err");
        const det = (c.details || []).map((d) => (d && d.heading ? `\n    ${tr(d.heading)}` : "    - " + (isPaper(d) ? `${tr(d.text)}\n      ${d.href}` : tr(d))));
        const st = statsOf(c).map((s) => ` ${tr(s.label)} | ${s.value}`);
        print([`commit ${hashOf.get(c.id)}  [${c.id}]`, `Branch: ${branches.get(c.branch).name}`, `Date:   ${tr(c.date)}`, "",
          `    ${tr(c.title)}`, c.org ? `    ${tr(c.org)}` : null, "", ...det, ...(st.length ? ["", ...st] : [])]
          .filter((l) => l !== null).join("\n"));
        if (hidden(c)) { summary = false; setParam("view", null); updateButtons(); renderCommits(); }
        return revealCommit(c.id, true);
      }
      if (sub === "branch") {
        return print([...branches.values()].map((b) => `${locked === b.id ? "*" : " "} ${b.name.padEnd(20)} ${tr(b.label)}`).join("\n"));
      }
      if (sub === "checkout") {
        if (args[1] === "--" || args[1] === "-" || !args[1]) { setLocked(null); return print("Showing all branches."); }
        const b = findBranch(args[1]);
        if (!b) return print(`error: pathspec '${args[1]}' did not match any branch`, "t-err");
        setLocked(b.id);
        return print(`Switched to branch '${b.name}'`);
      }
      if (sub === "status") return print(`On branch main\nYour career is up to date with 'origin/main'.\n\nChanges in progress:\n  ${tr(cv.commits[cv.commits.length - 1].title)}`);
      print(`git: '${sub || ""}' is not supported here. See 'help'.`, "t-err");
    },
  };

  $("term-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const line = termInput.value.trim();
    termInput.value = "";
    print("$ " + line, "t-cmd");
    if (!line) return;
    termHistory.push(line);
    histPos = termHistory.length;
    const [cmd, ...args] = line.split(/\s+/);
    const fn = COMMANDS[cmd.toLowerCase()];
    if (fn) fn(args);
    else print(`${cmd}: command not found. Type 'help'.`, "t-err");
  });

  /* ---------- Drucken: alles aufklappen, danach Zustand wiederherstellen ---------- */
  window.addEventListener("beforeprint", () => {
    list.querySelectorAll(".card.has-details").forEach((c) => c.classList.add("print-open"));
  });
  window.addEventListener("afterprint", () => {
    list.querySelectorAll(".print-open").forEach((c) => c.classList.remove("print-open"));
    draw();
  });

  /* ---------- Start ---------- */
  function renderAll() {
    applyStatic();
    renderProfile();
    renderHeatmap();
    renderLegend();
    updateThemeBtn();
    updateTermBtn();
    renderCommits();
  }
  renderAll();

  let frame;
  const redraw = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  };
  if ("ResizeObserver" in window) new ResizeObserver(redraw).observe(list);
  window.addEventListener("resize", redraw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
})();
