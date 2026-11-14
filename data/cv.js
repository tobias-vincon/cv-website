/*
 * Inhalt des Lebenslaufs.
 * --------------------------------------------------------------
 * Hier pflegst du alle Inhalte. Die Seite (js/graph.js) liest nur
 * dieses Objekt aus – Layout und Logik musst du nicht anfassen.
 *
 * ZWEISPRACHIG: Jeder Text ist entweder ein einfacher String (gilt für
 * beide Sprachen, z. B. Paper-Titel) oder ein Objekt { en: "…", de: "…" }.
 *
 * branches: Spuren im Git-Baum (Reihenfolge = Spalte von links).
 *   name     Git-Name, auch für Links wie index.html?branch=research/phd
 * commits:  chronologisch sortiert, ÄLTESTER ZUERST.
 *   id       eindeutiger Schlüssel (auch für "git show <id>" im Terminal)
 *   branch   id des Branches, auf dem der Commit liegt
 *   parents  ids der Vorgänger. Zwei Parents = Merge.
 *            Ein Parent auf einem anderen Branch = Abzweigung.
 *   year     Jahr für die Heatmap (optional, sonst aus date gelesen)
 *   date     Anzeige-Datum (frei formatierbar)
 *   type     z. B. "feat", "docs", "merge", "init" (nur Optik)
 *   title    Commit-Message
 *   org      Organisation / Ort (optional)
 *   era      Abschnitt aus "eras" für die Trenner (optional)
 *   tag      Git-Tag, z. B. Abschluss (optional)
 *   stat     Kennzahlen im Stil von "git log --stat", z. B.
 *            [{ value: "+12", label: { en: "people", de: "Personen" } }] (optional).
 *            Bei Publikations-Commits (type "docs") wird die Anzahl automatisch ergänzt.
 *   minor    true = in der Kurzansicht ausblenden (optional; "docs" immer ausgeblendet)
 *   details  Liste mit Stichpunkten, aufklappbar (optional).
 *            Eintrag als Text oder mit Link: { text: "…", href: "https://…" }
 *            Zwischenüberschrift: { heading: "2022" } (Jahreszahl ordnet folgende Paper zu)
 *            Links zählen als Publikation, außer mit paper: false
 *   head     true = aktueller Stand (HEAD)
 *
 * person.photo: Pfad zum Porträt (quadratisch, z. B. 400×400 px).
 *   Fehlt die Datei, werden stattdessen die Initialen angezeigt.
 *
 * Optional pro Branch: lane = Spaltennummer (sonst Reihenfolge).
 * So kann ein neuer Branch eine frei gewordene Spalte nutzen.
 */
window.CV = {
  person: {
    name: "Dr.-Ing. Tobias Vinçon",
    role: "Group Lead · Data/AI Platforms & Services",
    location: { en: "Stuttgart region", de: "Region Stuttgart" },
    photo: "assets/photo-320.jpg", // kleine Version fürs Porträt; assets/photo.jpg (800 px) dient als Vorschaubild
    // TODO: Kurzprofil in deinen eigenen Worten formulieren
    summary: {
      en: "Data architect and leader with a research background: from near-data processing in database systems to establishing data mesh across a growing organisation.",
      de: "Data-Architekt und Führungskraft mit Forschungshintergrund: vom Near-Data Processing in Datenbanksystemen bis zur Etablierung von Data Mesh in einer wachsenden Organisation.",
    },
    // icon: mail | linkedin | dblp | scholar | file (siehe ICONS in js/graph.js), label = Tooltip & Screenreader
    links: [
      { icon: "mail", label: { en: "Email: tobias.vincon@gmail.com", de: "E-Mail: tobias.vincon@gmail.com" }, href: "mailto:tobias.vincon@gmail.com" },
      { icon: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/tobias-vincon-3aa633128/" },
      { icon: "dblp", label: { en: "DBLP (publications)", de: "DBLP (Publikationen)" }, href: "https://dblp.org/pid/178/2061.html" },
      // { icon: "file", label: { en: "CV (PDF)", de: "Lebenslauf (PDF)" }, href: "assets/cv_en.pdf" },
    ],
    // README-Bereich unten auf der Seite
    readme: {
      // Kennzahlen-Kacheln. value "auto:papers" = automatisch gezählte Publikationen,
      // "auto:since:JAHR" = "N+" Jahre seit JAHR
      highlights: [
        { value: "15+", label: { en: "years in data & analytics", de: "Jahre Data & Analytics" } },
        // "auto:since:JAHR" = Jahre seit JAHR, wird automatisch hochgezählt (hier: Cluster Lead seit 2021)
        { value: "auto:since:2021", label: { en: "years in leadership", de: "Jahre Führungserfahrung" } },
        { value: "auto:papers", label: { en: "publications", de: "Publikationen" } },
        { value: "Dr.-Ing.", label: { en: "summa cum laude, TU Darmstadt", de: "summa cum laude, TU Darmstadt" } },
        { value: "VLDB · ICDE", label: { en: "top-tier database venues", de: "führende Datenbank-Konferenzen" } },
      ],
      // Schwerpunkte in Gruppen; color = Branch-Farbe 0–5 (--b0 … --b5)
      expertise: [
        {
          title: { en: "Leadership", de: "Führung" },
          color: 3,
          items: [
            { en: "Leadership & change management", de: "Führung & Change Management" },
            { en: "Data governance", de: "Data Governance" },
            { en: "Product ownership for data platforms", de: "Product Ownership für Datenplattformen" },
            { en: "Building expert teams", de: "Aufbau von Expertenteams" },
          ],
        },
        {
          title: { en: "Data & AI platforms", de: "Data- & AI-Plattformen" },
          color: 0,
          items: [
            "Data Mesh",
            { en: "Data & IT architecture", de: "Data- & IT-Architektur" },
            { en: "Data products & AI assistants", de: "Datenprodukte & KI-Assistenten" },
            { en: "Agile data engineering", de: "Agiles Data Engineering" },
          ],
        },
        {
          title: { en: "Research", de: "Forschung" },
          color: 2,
          items: [
            "Near-data processing",
            "Computational storage",
            { en: "Multi-version indexing", de: "Multi-Version-Indexing" },
            { en: "Database systems on modern hardware", de: "Datenbanksysteme auf moderner Hardware" },
          ],
        },
      ],
      // Führungserfahrung: Verantwortungsbereiche (areas).
      // icon: people | layers | shield | route | sprout (siehe ICONS in js/graph.js)
      // TODO: Kennzahlen ergänzen (z. B. Teamgröße), sobald bekannt
      leadership: {
        areas: [
          {
            icon: "people",
            title: { en: "People leadership", de: "Personalführung" },
            text: {
              en: "Line and technical management of an expert group, including a sub-team for data products and AI assistants",
              de: "Disziplinarische und fachliche Führung einer Expertengruppe, inklusive eines Subteams für Datenprodukte und KI-Assistenten",
            },
          },
          {
            icon: "layers",
            title: { en: "Platform ownership", de: "Plattformverantwortung" },
            text: {
              en: "Accountable for the data and AI platform of Bosch eBike Systems",
              de: "Verantwortlich für die Data- & AI-Plattform von Bosch eBike Systems",
            },
          },
          {
            icon: "shield",
            title: { en: "Governance", de: "Governance" },
            text: {
              en: "Governing the data mesh and its participating teams",
              de: "Governance des Data Mesh und der beteiligten Teams",
            },
          },
          {
            icon: "route",
            title: { en: "Change management", de: "Change Management" },
            text: {
              en: "Establishing data mesh across teams and domains",
              de: "Etablierung von Data Mesh über Teams und Domänen hinweg",
            },
          },
          {
            icon: "sprout",
            title: { en: "Building roles & talent", de: "Rollen & Talente aufbauen" },
            text: {
              en: "Established and staffed the lead architect role for the Data Excellence programme within the team",
              de: "Lead-Architekten-Rolle für das Data Excellence Programm im Team etabliert und besetzt",
            },
          },
        ],
      },
      languages: [
        { name: { en: "German", de: "Deutsch" }, level: { en: "native", de: "Muttersprache" } },
        { name: { en: "English", de: "Englisch" }, level: { en: "fluent", de: "fließend" } },
        { name: { en: "French", de: "Französisch" }, level: { en: "beginner", de: "Grundkenntnisse" } },
      ],
      certificates: ["Bosch certified associate architect", "ITIL V3 Foundation"],
      // icon: bike | mountain | camera (siehe ICONS in js/graph.js)
      interests: [
        { icon: "bike", label: { en: "Cycling", de: "Radfahren" } },
        { icon: "mountain", label: { en: "Skiing", de: "Skifahren" } },
        { icon: "camera", label: { en: "Photography", de: "Fotografie" } },
      ],
    },
  },

  // Arbeitgeber-Logos (lokal gespeichert, Quelle: Wikimedia Commons). Marken der jeweiligen Inhaber.
  // Werden über eras[...].logo referenziert.
  logos: {
    hp: { src: "assets/logos/hp.svg", alt: "Hewlett Packard" },
    hpe: { src: "assets/logos/hpe.svg", alt: "Hewlett Packard Enterprise" },
    dxc: { src: "assets/logos/dxc.svg", alt: "DXC Technology" },
    bosch: { src: "assets/logos/bosch.svg", alt: "Bosch" },
  },

  // Abschnitte (Arbeitgeber/Phasen) als Trenner im Lebenspfad, mit Logo und Link zur Firma.
  // Zuordnung je Commit über era: "…".
  eras: {
    bosch: { name: "Bosch eBike Systems", logo: "bosch", href: "https://www.bosch-ebike.com/",
             period: { en: "since 2018", de: "seit 2018" } },
    dxc: { name: "DXC Technology", logo: "dxc", href: "https://dxc.com/", period: "2017–2018" },
    hpe: { name: "Hewlett Packard Enterprise", logo: "hpe", href: "https://www.hpe.com/", period: "2015–2017" },
    hp: { name: { en: "Hewlett Packard · dual studies", de: "Hewlett Packard · duales Studium" }, logo: "hp",
          href: "https://www.hp.com/", period: "2010–2015" },
    school: { name: { en: "School", de: "Schule" }, period: "2001–2010" },
  },

  branches: [
    { id: "main", name: "main", label: { en: "Career", de: "Beruf" } },
    { id: "studium", name: "study/dual", label: { en: "Dual studies", de: "Duales Studium" } },
    { id: "promotion", name: "research/phd", label: { en: "PhD", de: "Promotion" } },
    { id: "datamesh", name: "feature/data-mesh", label: { en: "Current initiative", de: "Aktuelles Vorhaben" }, lane: 1 },
  ],

  commits: [
    {
      id: "school1",
      era: "school",
      branch: "main",
      parents: [],
      date: "2001",
      type: "init",
      minor: true,
      title: "Initial commit: Nellenburg-Gymnasium",
      org: "Stockach",
      details: [
        { en: "Grammar school up to the intermediate certificate (2001–2007)", de: "Gymnasium bis zur mittleren Reife (2001–2007)" },
      ],
    },
    {
      id: "school2",
      era: "school",
      branch: "main",
      parents: ["school1"],
      date: "2007",
      type: "feat",
      minor: true,
      title: { en: "Technical grammar school, information technology track", de: "Technisches Gymnasium, Profil Informationstechnik" },
      org: "Hohentwiel-Gewerbeschule, Singen",
      details: ["2007–2010", { en: "First focus on computer science", de: "Erster Schwerpunkt auf Informatik" }],
    },

    /* ---------- Duales Studium bei Hewlett Packard ---------- */
    {
      id: "bsc-start",
      branch: "studium",
      parents: ["school2"],
      date: "2010",
      type: "feat",
      title: { en: "Dual study programme in Applied Computer Science", de: "Duales Studium Applied Computer Science" },
      era: "hp",
      org: "DHBW Stuttgart · Hewlett Packard, Böblingen",
      details: [
        {
          en: "Work placements: HP Technology Services, HP Software, HP Account Delivery Management",
          de: "Praxisphasen: HP Technology Services, HP Software, HP Account Delivery Management",
        },
        { en: "Bachelor's thesis at HP Information Management & Analysis", de: "Bachelor-Thesis bei HP Information Management & Analysis" },
      ],
    },
    {
      id: "bsc",
      era: "hp",
      branch: "studium",
      parents: ["bsc-start"],
      date: "2013",
      type: "release",
      title: "Bachelor of Science",
      org: "DHBW Stuttgart",
      tag: "v1.0-bsc",
    },
    {
      id: "msc-start",
      branch: "studium",
      parents: ["bsc"],
      date: "2013",
      type: "feat",
      title: { en: "Dual master's programme in Services Computing", de: "Duales Master-Studium Services Computing" },
      era: "hp",
      org: "Herman Hollerith Zentrum, Böblingen · Hewlett Packard",
      details: [
        {
          en: "Technical Consultant in analytics & data management (master's thesis)",
          de: "Technical Consultant im Bereich Analytics & Data Management (Master-Thesis)",
        },
      ],
    },
    {
      id: "msc",
      era: "hp",
      branch: "main",
      parents: ["school2", "msc-start"],
      date: "2015",
      type: "merge",
      title: "Merge study/dual: Master of Science",
      org: "Herman Hollerith Zentrum",
      tag: "v2.0-msc",
    },

    /* ---------- Beruf & Promotion laufen parallel ---------- */
    {
      id: "hpe",
      branch: "main",
      parents: ["msc"],
      date: "2015",
      type: "feat",
      title: "Technical Consultant · Analytics & Data Management",
      era: "hpe",
      org: "Hewlett Packard Enterprise, Böblingen",
      details: ["2015–2017"],
    },
    {
      id: "phd-start",
      era: "hpe",
      branch: "promotion",
      parents: ["hpe"],
      date: "2015",
      type: "feat",
      title: { en: "PhD: database systems on modern hardware", de: "Promotion: DBMS auf moderner Hardware" },
      org: {
        en: "ESA Group, TU Darmstadt · DB Lab, Reutlingen University",
        de: "ESA-Gruppe, TU Darmstadt · DB Lab, Hochschule Reutlingen",
      },
      details: [
        {
          en: "Research on near-data processing, native/computational storage and multi-version indexing",
          de: "Forschung zu Near-Data Processing, Native/Computational Storage und Multi-Version-Indexing",
        },
      ],
    },
    {
      id: "dxc",
      branch: "main",
      parents: ["hpe"],
      date: "2017",
      type: "feat",
      title: "Technical Consultant · Big Data & Analytics",
      era: "dxc",
      org: "DXC Technology, Böblingen",
      details: ["2017–2018"],
    },
    {
      id: "bosch1",
      branch: "main",
      parents: ["dxc"],
      date: "2018",
      type: "feat",
      title: "System Architect · Data Management",
      era: "bosch",
      org: "Bosch eBike Systems, Reutlingen",
      details: [
        {
          en: "Architecture and build-up of the IT landscape for data management and data analytics",
          de: "Architektur und Aufbau der IT-Landschaft für Data Management und Data Analytics",
        },
      ],
    },
    {
      id: "bosch2",
      branch: "main",
      parents: ["bosch1"],
      date: "2021",
      type: "feat",
      title: "Cluster Lead · Strategic Data Management",
      era: "bosch",
      org: "Bosch eBike Systems, Reutlingen",
      details: [
        { en: "Technical leadership of an expert group", de: "Fachliche Führung einer Expertengruppe" },
        {
          en: "Architecture and build-up of the IT landscape for data management and data analytics",
          de: "Architektur und Aufbau der IT-Landschaft für Data Management und Data Analytics",
        },
      ],
    },
    /* Alle Publikationen der Promotion in einem Commit, nach Jahren gegliedert.
       { heading: "Jahr" } = Zwischenüberschrift; Paper werden für die Heatmap ihrem Jahr zugeordnet. */
    {
      id: "pubs",
      era: "bosch",
      branch: "promotion",
      parents: ["phd-start"],
      year: 2022,
      date: "2015–22",
      type: "docs",
      title: { en: "25 publications, incl. VLDB, ICDE and EDBT", de: "25 Publikationen, u. a. VLDB, ICDE und EDBT" },
      details: [
        { heading: "2022" },
        { text: "Near-Data Processing in Database Systems on Native Computational Storage under HTAP Workloads (VLDB 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_VLDB_UpdateAwareNDP.pdf" },
        { text: "neoDBMS: In-situ Snapshots for Multi-Version DBMS on Native Computational Storage (ICDE 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_ICDE_neoDB.pdf" },
        { text: "Cache-Coherent Shared Locking for Transactionally Consistent Updates in NDP DBMS (EDBT 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_EDBT_CCIX-Sync.pdf" },
        { text: "Result-Set Management for NDP Operations on Smart Storage (DaMoN 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_DAMON_NDPResultSetHandling_extended.pdf" },
        { heading: "2021" },
        { text: "On the necessity of explicit cross-layer data formats in near-data processing systems (DAPD Journal 2021)",
          href: "https://dblab.reutlingen-university.de/paper/2020_DAPD_NDP_Formats.pdf" },
        { text: "A cost model for NDP-aware query optimization for KV-stores (DaMoN 2021)",
          href: "https://dblab.reutlingen-university.de/paper/2021_DAMON_CostModel.pdf" },
        { text: "A Framework for the Automatic Generation of FPGA-based NDP Accelerators (RAW@IPDPS 2021)",
          href: "https://dblab.reutlingen-university.de/paper/2021_IPDPS_AutoGen.pdf" },
        { heading: "2020" },
        { text: "nKV in Action: Accelerating KV-Stores on Native Computational Storage with NDP (VLDB 2020)",
          href: "https://dblab.reutlingen-university.de/paper/2020_VLDB_nKVDemo.pdf" },
        { text: "nKV: Near-Data Processing with KV-Stores on Native Computational Storage (DaMoN 2020)",
          href: "https://dblab.reutlingen-university.de/paper/DaMoN2020-nKV.pdf" },
        { text: "MV-PBT: Multi-Version Indexing for Large Datasets and HTAP Workloads (EDBT 2020)",
          href: "https://dblab.reutlingen-university.de/paper/2020_EDBT_MVPBT.pdf" },
        { text: "On the Necessity of Explicit Cross-Layer Data Formats in NDP Systems (HardBD@ICDE 2020)",
          href: "https://dblab.reutlingen-university.de/paper/2020_HardBD_NDPFormats.pdf" },
        { heading: "2019" },
        { text: "Native Storage Techniques for Data Management (Tutorial, ICDE 2019)",
          href: "https://dblab.reutlingen-university.de/paper/2019_ICDE_NativeStorage.pdf" },
        { text: "nativeNDP: Processing Big Data Analytics on Native Storage Nodes (ADBIS 2019)",
          href: "https://dblab.reutlingen-university.de/paper/2019_ADBIS-nativeNDP.pdf" },
        { text: "IPA-IDX: In-Place Appends for B-Tree Indices (DaMoN 2019)",
          href: "https://dblab.reutlingen-university.de/paper/2019_DAMON_IPA_IDX.pdf" },
        { text: "Indexing large updatable Datasets in Multi-Version DBMS (IDEAS 2019)",
          href: "https://dblab.reutlingen-university.de/paper/2019_IDEAS_PBT.pdf" },
        { text: "Hardware-Assisted Transaction Processing (Encyclopedia of Big Data Technologies)",
          href: "https://link.springer.com/referencework/10.1007/978-3-319-77525-8" },
        { text: "Active Storage (Encyclopedia of Big Data Technologies)",
          href: "https://link.springer.com/referencework/10.1007/978-3-319-77525-8" },
        { text: "Moving Processing to Data: On the Influence of Processing in Memory on Data Management",
          href: "https://arxiv.org/abs/1905.04767" },
        { heading: "2018" },
        { text: "NoFTL-KV: Tackling Write-Amplification on KV-Stores with Native Storage Management (EDBT 2018)",
          href: "https://dblab.reutlingen-university.de/paper/2018_EDBT_NoFTL-KV.pdf" },
        { text: "Efficient Data and Indexing Structure for Blockchains in Enterprise Systems (iiWAS 2018)",
          href: "https://dblab.reutlingen-university.de/paper/2018_ExtendedAbstract_EfficientDataandIndexingStructureforBlockchainsinEnterpriseSystems.pdf" },
        { heading: "2017" },
        { text: "Write-optimized Indexing with Partitioned B-trees (iiWAS 2017)",
          href: "https://dblab.reutlingen-university.de/paper/2017_iiWAS_WriteOptimizedIndexingWithpartitionedBTrees.pdf" },
        { text: "Multi-version indexing and modern hardware technologies: a survey (iiWAS 2017)",
          href: "https://dblab.reutlingen-university.de/paper/2017_iiWAS_MultiVersionIndexingAndModernHardwareTechnologies.pdf" },
        { heading: "2016" },
        { text: "cIPT: Shift of Image Processing Technologies to column-oriented Databases (ADBIS 2016)",
          href: "https://dblab.reutlingen-university.de/paper/2016_ADBIS_cIPTShiftOfImageProcessingTechnologies.pdf" },
        { text: "Near Data Processing within Column-Oriented DBMSs for High Performance Analysis (DEC 2016)",
          href: "https://dblab.reutlingen-university.de/paper/2016_DEC_NDPWithinColumnOrientedDBMS.pdf" },
        { heading: "2015" },
        { text: "Real Time Charging Database Benchmarking (iiWAS 2015)",
          href: "https://dblab.reutlingen-university.de/paper/2015_iiWAS_RealTimeChargingDatabaseBenchmarking.pdf" },
      ],
    },
    {
      id: "phd",
      era: "bosch",
      branch: "main",
      parents: ["bosch2", "pubs"],
      date: "2022",
      type: "merge",
      title: "Merge research/phd: Dr.-Ing. (summa cum laude)",
      org: "TU Darmstadt",
      tag: "v3.0-dr-ing",
      details: [
        {
          text: "Dissertation: Data-intensive Systems on Modern Hardware – Leveraging Near-Data Processing to Counter the Growth of Data",
          href: "https://tuprints.ulb.tu-darmstadt.de/entities/publication/40d28536-090b-43f7-8ab6-9d8f9e368cdc",
          paper: false, // Link ja, aber nicht bei den Publikationen mitzählen
        },
      ],
    },
    {
      id: "bosch3",
      branch: "main",
      parents: ["phd"],
      year: 2023,
      date: { en: "since 2023", de: "seit 2023" },
      type: "feat",
      title: "Group Lead · Data/AI Platforms & Services",
      era: "bosch",
      org: "Bosch eBike Systems, Reutlingen",
      head: true,
      // TODO: Kennzahlen ergänzen, z. B. { value: "+12", label: { en: "people", de: "Personen" } }
      details: [
        {
          en: "Responsible for the data and AI platform of Bosch eBike Systems, the foundation the organisation's data mesh runs on",
          de: "Verantwortlich für die Data- & AI-Plattform von Bosch eBike Systems, die Grundlage für das Data Mesh der Organisation",
        },
        {
          en: "Governance of the data mesh and its participating teams",
          de: "Governance des Data Mesh und der beteiligten Teams",
        },
        {
          en: "A sub-team builds data products and AI assistants on the platform",
          de: "Ein Subteam entwickelt Datenprodukte und KI-Assistenten auf der Plattform",
        },
        { en: "Line and technical management of an expert group", de: "Disziplinarische und fachliche Führung einer Expertengruppe" },
        {
          en: "Responsible for the lead architecture of the Data Excellence programme, a role established and staffed within my team",
          de: "Verantwortung für die Lead-Architektur des Data Excellence Programms, eine in meinem Team etablierte und besetzte Rolle",
        },
      ],
    },
    {
      id: "mesh",
      branch: "datamesh",
      parents: ["bosch3"],
      year: "now",
      date: { en: "ongoing", de: "laufend" },
      type: "wip",
      title: { en: "Establishing data mesh across the organisation", de: "Etablierung von Data Mesh in der Organisation" },
      era: "bosch",
      org: "Bosch eBike Systems",
      details: [
        { en: "Change management across teams and domains", de: "Change Management über Teams und Domänen hinweg" },
      ],
    },
  ],
};
