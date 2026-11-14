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
 *   tag      Git-Tag, z. B. Abschluss (optional)
 *   stat     Kennzahlen im Stil von "git log --stat", z. B.
 *            [{ value: "+12", label: { en: "people", de: "Personen" } }] (optional).
 *            Bei Publikations-Commits (type "docs") wird die Anzahl automatisch ergänzt.
 *   minor    true = in der Kurzansicht ausblenden (optional; "docs" immer ausgeblendet)
 *   details  Liste mit Stichpunkten, aufklappbar (optional).
 *            Eintrag als Text oder mit Link: { text: "…", href: "https://…" }
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
    role: "Group Lead · Data AI Platforms & Services",
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
      // Kennzahlen-Kacheln. value "auto:papers" = automatisch gezählte Publikationen
      highlights: [
        { value: "15+", label: { en: "years in data & analytics", de: "Jahre Data & Analytics" } },
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

  branches: [
    { id: "main", name: "main", label: { en: "Career", de: "Beruf" } },
    { id: "studium", name: "study/dual", label: { en: "Dual studies", de: "Duales Studium" } },
    { id: "promotion", name: "research/phd", label: { en: "PhD", de: "Promotion" } },
    { id: "datamesh", name: "feature/data-mesh", label: { en: "Current initiative", de: "Aktuelles Vorhaben" }, lane: 1 },
  ],

  commits: [
    {
      id: "school1",
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
      org: "Hewlett Packard Enterprise, Böblingen",
      details: ["2015–2017"],
    },
    {
      id: "phd-start",
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
        { text: "Real Time Charging Database Benchmarking (iiWAS 2015)",
          href: "https://dblab.reutlingen-university.de/paper/2015_iiWAS_RealTimeChargingDatabaseBenchmarking.pdf" },
      ],
    },
    {
      id: "pub2016",
      branch: "promotion",
      parents: ["phd-start"],
      date: "2016",
      type: "docs",
      title: { en: "2 publications", de: "2 Publikationen" },
      details: [
        { text: "cIPT: Shift of Image Processing Technologies to column-oriented Databases (ADBIS 2016)",
          href: "https://dblab.reutlingen-university.de/paper/2016_ADBIS_cIPTShiftOfImageProcessingTechnologies.pdf" },
        { text: "Near Data Processing within Column-Oriented DBMSs for High Performance Analysis (DEC 2016)",
          href: "https://dblab.reutlingen-university.de/paper/2016_DEC_NDPWithinColumnOrientedDBMS.pdf" },
      ],
    },
    {
      id: "pub2017",
      branch: "promotion",
      parents: ["pub2016"],
      date: "2017",
      type: "docs",
      title: { en: "2 publications", de: "2 Publikationen" },
      details: [
        { text: "Write-optimized Indexing with Partitioned B-trees (iiWAS 2017)",
          href: "https://dblab.reutlingen-university.de/paper/2017_iiWAS_WriteOptimizedIndexingWithpartitionedBTrees.pdf" },
        { text: "Multi-version indexing and modern hardware technologies: a survey (iiWAS 2017)",
          href: "https://dblab.reutlingen-university.de/paper/2017_iiWAS_MultiVersionIndexingAndModernHardwareTechnologies.pdf" },
      ],
    },
    {
      id: "dxc",
      branch: "main",
      parents: ["hpe"],
      date: "2017",
      type: "feat",
      title: "Technical Consultant · Big Data & Analytics",
      org: "DXC Technology, Böblingen",
      details: ["2017–2018"],
    },
    {
      id: "pub2018",
      branch: "promotion",
      parents: ["pub2017"],
      date: "2018",
      type: "docs",
      title: { en: "2 publications", de: "2 Publikationen" },
      details: [
        { text: "NoFTL-KV: Tackling Write-Amplification on KV-Stores with Native Storage Management (EDBT 2018)",
          href: "https://dblab.reutlingen-university.de/paper/2018_EDBT_NoFTL-KV.pdf" },
        { text: "Efficient Data and Indexing Structure for Blockchains in Enterprise Systems (iiWAS 2018)",
          href: "https://dblab.reutlingen-university.de/paper/2018_ExtendedAbstract_EfficientDataandIndexingStructureforBlockchainsinEnterpriseSystems.pdf" },
      ],
    },
    {
      id: "bosch1",
      branch: "main",
      parents: ["dxc"],
      date: "2018",
      type: "feat",
      title: "System Architect · Data Management",
      org: "Bosch eBike Systems, Reutlingen",
      details: [
        {
          en: "Architecture and build-up of the IT landscape for data management and data analytics",
          de: "Architektur und Aufbau der IT-Landschaft für Data Management und Data Analytics",
        },
      ],
    },
    {
      id: "pub2019",
      branch: "promotion",
      parents: ["pub2018"],
      date: "2019",
      type: "docs",
      title: { en: "7 publications, incl. a tutorial at ICDE", de: "7 Publikationen, u. a. Tutorial auf der ICDE" },
      details: [
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
      ],
    },
    {
      id: "pub2020",
      branch: "promotion",
      parents: ["pub2019"],
      date: "2020",
      type: "docs",
      title: { en: "4 publications, incl. VLDB", de: "4 Publikationen, u. a. VLDB" },
      details: [
        { text: "nKV in Action: Accelerating KV-Stores on Native Computational Storage with NDP (VLDB 2020)",
          href: "https://dblab.reutlingen-university.de/paper/2020_VLDB_nKVDemo.pdf" },
        { text: "nKV: Near-Data Processing with KV-Stores on Native Computational Storage (DaMoN 2020)",
          href: "https://dblab.reutlingen-university.de/paper/DaMoN2020-nKV.pdf" },
        { text: "MV-PBT: Multi-Version Indexing for Large Datasets and HTAP Workloads (EDBT 2020)",
          href: "https://dblab.reutlingen-university.de/paper/2020_EDBT_MVPBT.pdf" },
        { text: "On the Necessity of Explicit Cross-Layer Data Formats in NDP Systems (HardBD@ICDE 2020)",
          href: "https://dblab.reutlingen-university.de/paper/2020_HardBD_NDPFormats.pdf" },
      ],
    },
    {
      id: "bosch2",
      branch: "main",
      parents: ["bosch1"],
      date: "2021",
      type: "feat",
      title: "Cluster Lead · Strategic Data Management",
      org: "Bosch eBike Systems, Reutlingen",
      details: [
        { en: "Technical leadership of an expert group", de: "Fachliche Führung einer Expertengruppe" },
        {
          en: "Architecture and build-up of the IT landscape for data management and data analytics",
          de: "Architektur und Aufbau der IT-Landschaft für Data Management und Data Analytics",
        },
      ],
    },
    {
      id: "pub2021",
      branch: "promotion",
      parents: ["pub2020"],
      date: "2021",
      type: "docs",
      title: { en: "3 publications", de: "3 Publikationen" },
      details: [
        { text: "On the necessity of explicit cross-layer data formats in near-data processing systems (DAPD Journal 2021)",
          href: "https://dblab.reutlingen-university.de/paper/2020_DAPD_NDP_Formats.pdf" },
        { text: "A cost model for NDP-aware query optimization for KV-stores (DaMoN 2021)",
          href: "https://dblab.reutlingen-university.de/paper/2021_DAMON_CostModel.pdf" },
        { text: "A Framework for the Automatic Generation of FPGA-based NDP Accelerators (RAW@IPDPS 2021)",
          href: "https://dblab.reutlingen-university.de/paper/2021_IPDPS_AutoGen.pdf" },
      ],
    },
    {
      id: "pub2022",
      branch: "promotion",
      parents: ["pub2021"],
      date: "2022",
      type: "docs",
      title: { en: "4 publications, incl. VLDB and ICDE", de: "4 Publikationen, u. a. VLDB und ICDE" },
      details: [
        { text: "Near-Data Processing in Database Systems on Native Computational Storage under HTAP Workloads (VLDB 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_VLDB_UpdateAwareNDP.pdf" },
        { text: "neoDBMS: In-situ Snapshots for Multi-Version DBMS on Native Computational Storage (ICDE 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_ICDE_neoDB.pdf" },
        { text: "Cache-Coherent Shared Locking for Transactionally Consistent Updates in NDP DBMS (EDBT 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_EDBT_CCIX-Sync.pdf" },
        { text: "Result-Set Management for NDP Operations on Smart Storage (DaMoN 2022)",
          href: "https://dblab.reutlingen-university.de/paper/2022_DAMON_NDPResultSetHandling_extended.pdf" },
      ],
    },
    {
      id: "phd",
      branch: "main",
      parents: ["bosch2", "pub2022"],
      date: "2022",
      type: "merge",
      title: "Merge research/phd: Dr.-Ing. (summa cum laude)",
      org: "TU Darmstadt",
      tag: "v3.0-dr-ing",
      details: [
        {
          en: "Dissertation: Data-intensive Systems on Modern Hardware – Leveraging Near-Data Processing to Counter the Growth of Data",
          de: "Dissertation: Data-intensive Systems on Modern Hardware – Leveraging Near-Data Processing to Counter the Growth of Data",
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
      title: "Group Lead · Data AI Platforms & Services",
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
      org: "Bosch eBike Systems",
      details: [
        { en: "Change management across teams and domains", de: "Change Management über Teams und Domänen hinweg" },
      ],
    },
  ],
};
