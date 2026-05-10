const STORAGE_KEY = "beobachtungsassistent:tiefenstruktur:v1";

const dimensions = [
  {
    id: "dimension-1",
    title: "Kognitive Aktivierung",
    color: "#316f91",
    subcategories: [
      {
        id: "1-1",
        title: "1.1 Verständnisorientierung",
        chartLabel: "1.1 Verständnisorientierung",
        items: [
          "Es wird deutlich, welche Inhalte oder Zusammenhänge die SuS verstehen oder reflektieren sollen.",
          "Die Unterrichtsgestaltung unterstützt das Verständnis zentraler Inhalte.",
          "Inhalte und Zusammenhänge werden klar, strukturiert und verständlich dargestellt.",
          "Die LK stellt Bezüge zu zentralen Inhalten der Stunde her.",
          "Die LK orientiert den Unterricht an zentralen fachlichen Lernzielen.",
          "Zentrale Inhalte oder Zusammenhänge der Stunde werden erkennbar hervorgehoben.",
          "Zentrale Inhalte oder Zusammenhänge werden mit Blick auf das Lernziel zusammengefasst."
        ]
      },
      {
        id: "1-2",
        title: "1.2 Ermittlung von Denkweisen / Vorstellungen",
        chartLabel: "1.2 Ermittlung von Denkweisen / Vorstellungen",
        items: [
          "Die LK verschafft sich Einblick in Denkweisen und Lernstände der SuS.",
          "Die LK greift unterschiedliche Beiträge der SuS auf.",
          "Die LK erfragt Denkweisen, Vorstellungen und Lösungsansätze der SuS.",
          "Die SuS werden aufgefordert, ihre Antworten oder Lösungswege zu begründen.",
          "Die LK thematisiert Verständnis und Verständnisschwierigkeiten der SuS.",
          "Die LK nutzt Aufgaben, Fragen oder Gesprächsimpulse, um Denkweisen der SuS sichtbar zu machen.",
          "Die LK nimmt Arbeitsergebnisse oder Lösungswege der SuS in den Blick."
        ]
      },
      {
        id: "1-3",
        title: "1.3 Herausfordernde Aufgaben und Fragen",
        chartLabel: "1.3 Herausfordernde Aufgaben und Fragen",
        items: [
          "Fragen und Aufgaben regen zur vertieften fachlichen Auseinandersetzung an.",
          "Die LK stellt unterschiedliche Lösungen, Denkweisen oder Sachverhalte kontrastierend gegenüber.",
          "Die SuS werden angeregt, eigene Lösungsansätze zu entwickeln.",
          "Die SuS werden zu Selbsterklärungen und Begründungen angeregt.",
          "Die Aufgaben oder Fragen gehen über reine Reproduktion hinaus.",
          "Die LK greift Widersprüche, unterschiedliche Sichtweisen oder unerwartete Antworten fachlich auf.",
          "Die SuS werden angeregt, Zusammenhänge herzustellen oder ihr Wissen auf neue Situationen zu übertragen."
        ]
      },
      {
        id: "1-4",
        title: "1.4 Fachliche Beteiligung der SuS",
        chartLabel: "1.4 Fachliche Beteiligung der SuS",
        items: [
          "Die SuS sind erkennbar auf das Unterrichtsgeschehen fokussiert.",
          "Die SuS beteiligen sich fachlich am Unterricht.",
          "Die SuS beteiligen sich mit längeren fachlichen Beiträgen am Unterricht.",
          "Die SuS stellen Fragen oder erläutern eigene Verständnisse und Schwierigkeiten.",
          "Die SuS arbeiten auch bei anspruchsvolleren Aufgaben fachlich weiter.",
          "Die SuS nehmen fachliche Impulse der LK oder anderer SuS auf.",
          "Die SuS bringen eigene fachliche Überlegungen in die Bearbeitung ein."
        ]
      }
    ]
  },
  {
    id: "dimension-2",
    title: "Konstruktive Unterstützung",
    color: "#7c6942",
    subcategories: [
      {
        id: "2-1",
        title: "2.1 Qualität des Feedbacks",
        chartLabel: "2.1 Qualität des Feedbacks",
        items: [
          "Die LK gibt Rückmeldungen, die sich konkret auf Inhalt, Vorgehen oder Ergebnis beziehen.",
          "Die LK macht deutlich, was an einer Antwort oder Lösung fachlich tragfähig ist.",
          "Die LK gibt Hinweise, wie SuS ihre Antwort, Lösung oder Arbeitsweise weiterentwickeln können.",
          "Rückmeldungen der LK unterstützen die Weiterarbeit der SuS im Lernprozess.",
          "Die LK nutzt Fehler oder unvollständige Antworten als Anlass für fachliche Klärung."
        ]
      },
      {
        id: "2-2",
        title: "2.2 Individuelle Unterstützung im Lernprozess",
        chartLabel: "2.2 Individuelle Unterstützung im Lernprozess",
        items: [
          "Die LK unterstützt SuS gezielt bei Verständnisproblemen.",
          "Die LK erklärt auf Rückfragen verständlich und nachvollziehbar.",
          "Die LK berücksichtigt unterschiedliche Lernvoraussetzungen.",
          "Die LK ermöglicht angemessene Denk- und Antwortzeiten.",
          "Hilfestellungen der LK orientieren sich am Lernstand der SuS."
        ]
      },
      {
        id: "2-3",
        title: "2.3 Wertschätzung und Respekt",
        chartLabel: "2.3 Wertschätzung und Respekt",
        items: [
          "Die LK begegnet den SuS respektvoll und wertschätzend.",
          "Die LK begegnet den SuS fair und respektvoll.",
          "Die LK greift Perspektiven und Beiträge der SuS auf."
        ]
      },
      {
        id: "2-4",
        title: "2.4 Klassenklima",
        chartLabel: "2.4 Klassenklima",
        items: [
          "Die SuS hören einander zu und lassen sich ausreden.",
          "Die SuS unterstützen sich gegenseitig im Lernprozess.",
          "Die SuS stellen einander bei Fehlern nicht bloß.",
          "Die SuS begegnen der LK respektvoll.",
          "Die SuS arbeiten in Partner- oder Gruppenphasen sachbezogen zusammen.",
          "Die SuS beziehen andere SuS in Partner- oder Gruppenphasen ein.",
          "Die SuS gehen in Arbeitsphasen respektvoll mit Beiträgen oder Fragen anderer um."
        ]
      }
    ]
  },
  {
    id: "dimension-3",
    title: "Strukturierte Klassenführung",
    color: "#596b8c",
    subcategories: [
      {
        id: "3-1",
        title: "3.1 Störungen durch Schülerinnen und Schüler",
        chartLabel: "3.1 Störungen durch Schülerinnen und Schüler",
        items: [
          "Der Unterricht verläuft geordnet und störungsarm.",
          "Die Lautstärke ist der Unterrichtsphase angemessen.",
          "Vereinbarte Regeln und Abläufe werden eingehalten."
        ]
      },
      {
        id: "3-2",
        title: "3.2 Monitoring",
        chartLabel: "3.2 Monitoring",
        items: [
          "Die LK nimmt Lern- und Arbeitsprozesse der SuS wahr.",
          "Die LK ist im Unterrichtsgeschehen präsent.",
          "Die LK reagiert frühzeitig und angemessen auf Störungen.",
          "Die LK behält die Klasse und einzelne Arbeitsprozesse sichtbar im Blick.",
          "Die LK erkennt Unterstützungsbedarf oder Unruhe während der Arbeitsphasen.",
          "Die LK reagiert auf Störungen oder Abschweifungen, bevor sie den Lernprozess deutlich beeinträchtigen.",
          "Die LK nutzt kurze verbale oder nonverbale Signale, um Arbeitsprozesse zu stabilisieren."
        ]
      },
      {
        id: "3-3",
        title: "3.3 Effiziente Zeitnutzung",
        chartLabel: "3.3 Zeitnutzung",
        items: [
          "Die Unterrichtszeit wird überwiegend für fachliche Lernprozesse genutzt.",
          "Die LK plant angemessene Bearbeitungs- und Denkzeiten ein.",
          "Der Unterricht beginnt ohne längere vermeidbare Verzögerungen.",
          "Übergänge zwischen Unterrichtsphasen verlaufen zügig und klar.",
          "Materialien, Medien oder organisatorische Abläufe sind so vorbereitet, dass Arbeitszeit erhalten bleibt.",
          "Die SuS haben ausreichend Zeit für fachliche Bearbeitung oder Reflexion.",
          "Die Unterrichtszeit wird nicht durch längere Leerlaufphasen unterbrochen."
        ]
      }
    ]
  }
];

const states = {
  0: { shortLabel: "neutral", label: "neutral / nicht markiert", className: "neutral", evidenceScore: 0, developmentScore: 0 },
  1: { shortLabel: "hellgrün", label: "ansatzweise lerntragend sichtbar", className: "light", evidenceScore: 1, developmentScore: 0 },
  2: { shortLabel: "grün", label: "deutlich lerntragend sichtbar", className: "strong", evidenceScore: 2, developmentScore: 0 },
  3: { shortLabel: "hellblau", label: "mögliches Entwicklungspotenzial", className: "development", evidenceScore: 0, developmentScore: 1 },
  4: { shortLabel: "blau", label: "zentrales Entwicklungspotenzial", className: "developmentStrong", evidenceScore: 0, developmentScore: 2 }
};

const scaleValues = [2, 1, 0, 3, 4];

const subcategories = dimensions.flatMap((dimension) =>
  dimension.subcategories.map((subcategory) => ({ ...subcategory, dimension }))
);

const dimensionBandsPlugin = {
  id: "dimensionBands",
  afterDraw(chart, _args, options) {
    const ranges = options?.ranges ?? [];
    const scale = chart.scales.r;
    if (!scale || !ranges.length) {
      return;
    }

    // Hauptdimensionen werden als kompakte Farbleiste oberhalb des Diagramms gezeigt.
  }
};

Chart.register(dimensionBandsPlugin);

let session = createEmptySession();
let activeSubcategoryId = subcategories[0].id;
let radarChart = null;
let currentView = "observe";
let detailOpen = false;
let observeMode = "multi";
let singleDimensionId = dimensions[0].id;
let singleSubcategoryId = dimensions[0].subcategories[0].id;
let recentlySortedKey = null;
let itemMoveSnapshot = null;
let activeObservationNoteKey = null;

const detailPanel = document.querySelector("#detailPanel");
const saveState = document.querySelector("#saveState");
const importFile = document.querySelector("#importFile");
const chartNav = document.querySelector("#chartNav");
const bucketView = document.querySelector("#bucketView");
const dimensionStrip = document.querySelector("#dimensionStrip");
const chartPanel = document.querySelector("#chartPanel");
const observeView = document.querySelector("#observeView");
const evaluateView = document.querySelector("#evaluateView");
const observeTab = document.querySelector("#observeTab");
const evaluateTab = document.querySelector("#evaluateTab");
const protocolTab = document.querySelector("#protocolTab");
const evidenceCards = document.querySelector("#evidenceCards");
const developmentCards = document.querySelector("#developmentCards");
const hiddenStack = document.querySelector("#hiddenStack");
const protocolView = document.querySelector("#protocolView");
const protocolContent = document.querySelector("#protocolContent");
const multiModeBtn = document.querySelector("#multiModeBtn");
const singleModeBtn = document.querySelector("#singleModeBtn");
const singleControls = document.querySelector("#singleControls");
const singleDimensionButtons = document.querySelector("#singleDimensionButtons");
const singleSubcategoryButtons = document.querySelector("#singleSubcategoryButtons");
const newSessionDialog = document.querySelector("#newSessionDialog");
const observationNoteDialog = document.querySelector("#observationNoteDialog");
const observationNoteItem = document.querySelector("#observationNoteItem");
const observationNoteText = document.querySelector("#observationNoteText");

document.addEventListener("DOMContentLoaded", () => {
  session = loadStoredSession() ?? createEmptySession();
  bindEvents();
  render();
});

function bindEvents() {
  document.querySelector("#newSessionBtn").addEventListener("click", () => {
    newSessionDialog.classList.remove("hidden");
  });

  document.querySelector("#loadLatestBtn").addEventListener("click", () => {
    const stored = loadStoredSession();
    if (!stored) {
      alert("Es ist noch keine lokal gespeicherte Beobachtung vorhanden.");
      return;
    }
    session = stored;
    render();
  });

  document.querySelector("#saveBtn").addEventListener("click", () => {
    persistSession();
    updateSaveState("Gespeichert");
  });

  document.querySelector("#exportBtn").addEventListener("click", exportSession);
  document.querySelector("#shareBtn").addEventListener("click", shareSummary);
  importFile.addEventListener("change", importSession);

  observeTab.addEventListener("click", () => {
    currentView = "observe";
    render();
  });

  evaluateTab.addEventListener("click", () => {
    currentView = "evaluate";
    detailOpen = false;
    render();
  });

  protocolTab.addEventListener("click", () => {
    currentView = "protocol";
    detailOpen = false;
    render();
  });

  multiModeBtn.addEventListener("click", () => {
    observeMode = "multi";
    detailOpen = false;
    render();
  });

  singleModeBtn.addEventListener("click", () => {
    observeMode = "single";
    activeSubcategoryId = singleSubcategoryId;
    detailOpen = false;
    render();
  });

  document.querySelector("#printProtocolBtn").addEventListener("click", () => window.print());
  document.querySelector("#saveAndNewBtn").addEventListener("click", () => {
    persistSession();
    resetSession();
  });
  document.querySelector("#discardAndNewBtn").addEventListener("click", resetSession);
  document.querySelector("#cancelNewBtn").addEventListener("click", () => newSessionDialog.classList.add("hidden"));
  document.querySelector("#closeObservationNoteBtn").addEventListener("click", closeObservationNote);
  document.querySelector("#saveObservationNoteBtn").addEventListener("click", saveObservationNote);
  document.querySelector("#clearObservationNoteBtn").addEventListener("click", () => {
    observationNoteText.value = "";
    saveObservationNote();
  });
  observationNoteText.addEventListener("input", () => {
    if (!activeObservationNoteKey) {
      return;
    }
    cardMeta(activeObservationNoteKey).observationNote = observationNoteText.value;
    if (!cardMeta(activeObservationNoteKey).note?.trim()) {
      cardMeta(activeObservationNoteKey).note = observationNoteText.value;
    }
    persistSession();
  });
}

function createEmptySession() {
  const observations = {};
  subcategories.forEach((subcategory) => {
    subcategory.items.forEach((_, index) => {
      observations[itemKey(subcategory.id, index)] = 0;
    });
  });

  return {
    version: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    observations,
    cardMeta: {}
  };
}

function render() {
  renderViewShell();
  renderModeControls();
  renderDimensionStrip();
  renderChartNav();
  renderBucketView();
  if (detailOpen) {
    renderDetailPanel();
  } else {
    closeDetailPanel();
  }
  renderEvaluation();
  renderProtocol();
  updateChart();
  updateSaveState(`Aktualisiert ${new Date(session.updatedAt).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit"
  })}`);
}

function renderDimensionStrip() {
  dimensionStrip.classList.toggle("hidden", observeMode === "single");
  if (observeMode === "single") {
    return;
  }

  dimensionStrip.innerHTML = dimensions.map((dimension) => `
    <span style="--dimension-color: ${dimension.color}">
      ${dimension.title}
    </span>
  `).join("");
}

function renderChartNav() {
  chartNav.classList.toggle("hidden", observeMode === "single");
  chartNav.innerHTML = chartEntries().map((entry) => `
    <button
      class="chart-label ${entry.id === activeSubcategoryId ? "active" : ""}"
      type="button"
      data-entry="${entry.id}"
      style="--label-color: ${entry.color}; --label-bg: ${hexToRgb(entry.color)}"
    >
      ${entry.label}
    </button>
  `).join("");

  chartNav.querySelectorAll(".chart-label").forEach((button) => {
    button.addEventListener("click", () => {
      if (observeMode === "multi") {
        activeSubcategoryId = button.dataset.entry;
      } else {
        activeSubcategoryId = singleSubcategoryId;
      }
      detailOpen = true;
      currentView = "observe";
      render();
    });
  });
}

function renderBucketView() {
  bucketView.classList.toggle("hidden", observeMode !== "single");
  if (observeMode !== "single") {
    bucketView.onclick = null;
    return;
  }

  const subcategory = subcategories.find((candidate) => candidate.id === singleSubcategoryId) ?? subcategories[0];
  const balls = subcategory.items
    .map((_, index) => session.observations[itemKey(subcategory.id, index)] ?? 0)
    .filter((value) => value !== 0);

  bucketView.innerHTML = `
    <div class="bucket-title">${subcategory.title}</div>
    <div class="bucket">
      ${balls.length ? balls.map((value, index) => {
        const column = index % 5;
        const row = Math.floor(index / 5);
        const offset = row % 2 ? 9 : 0;
        return `<span class="bucket-ball ${states[value].className}" style="left:${16 + offset + column * 15}%; bottom:${16 + row * 28}px; --drop-delay:${index * 55}ms"></span>`;
      }).join("") : `<p>Noch keine Markierungen</p>`}
    </div>
  `;

  bucketView.onclick = () => {
    activeSubcategoryId = singleSubcategoryId;
    detailOpen = true;
    render();
  };
}

function renderViewShell() {
  const isObserve = currentView === "observe";
  const isEvaluate = currentView === "evaluate";
  observeView.classList.toggle("hidden", !isObserve);
  evaluateView.classList.toggle("hidden", !isEvaluate);
  protocolView.classList.toggle("hidden", currentView !== "protocol");
  observeTab.classList.toggle("active", isObserve);
  evaluateTab.classList.toggle("active", isEvaluate);
  protocolTab.classList.toggle("active", currentView === "protocol");
  observeView.classList.toggle("with-detail", detailOpen);
}

function renderModeControls() {
  multiModeBtn.classList.toggle("active", observeMode === "multi");
  singleModeBtn.classList.toggle("active", observeMode === "single");
  singleControls.classList.toggle("hidden", observeMode !== "single");

  singleDimensionButtons.innerHTML = dimensions.map((dimension) => `
    <button class="mini-button dimension-choice ${dimension.id === singleDimensionId ? "active" : ""}" type="button" data-dimension="${dimension.id}" style="--mini-color: ${dimension.color}">
      ${dimension.title}
    </button>
  `).join("");

  const activeDimension = dimensions.find((dimension) => dimension.id === singleDimensionId) ?? dimensions[0];
  singleSubcategoryButtons.innerHTML = `
    <label class="single-select-label" for="singleSubcategorySelect">Merkmal</label>
    <select id="singleSubcategorySelect" class="single-select" style="--mini-color: ${activeDimension.color}">
      ${activeDimension.subcategories.map((subcategory) => `
        <option value="${subcategory.id}" ${subcategory.id === singleSubcategoryId ? "selected" : ""}>
          ${subcategory.title}
        </option>
      `).join("")}
    </select>
  `;

  singleDimensionButtons.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      singleDimensionId = button.dataset.dimension;
      const dimension = dimensions.find((candidate) => candidate.id === singleDimensionId);
      singleSubcategoryId = dimension.subcategories[0].id;
      activeSubcategoryId = singleSubcategoryId;
      detailOpen = false;
      render();
    });
  });

  document.querySelector("#singleSubcategorySelect").addEventListener("change", (event) => {
    singleSubcategoryId = event.target.value;
    activeSubcategoryId = singleSubcategoryId;
    detailOpen = true;
    render();
  });
}

function renderDetailPanel() {
  const subcategory = getActiveSubcategory();
  const stats = subcategoryStats(subcategory);
  detailPanel.style.setProperty("--active-color", subcategory.dimension.color);
  detailPanel.classList.remove("hidden");
  detailPanel.innerHTML = `
    <div class="detail-header">
      <button class="detail-nav-button prev" id="prevDetailBtn" type="button" aria-label="Vorheriges Merkmal">←</button>
      <button class="detail-nav-button next" id="nextDetailBtn" type="button" aria-label="Nächstes Merkmal">→</button>
      <button class="close-button" id="closeDetailBtn" type="button" aria-label="Itemfenster schließen">×</button>
      <p class="dimension-label">${subcategory.dimension.title}</p>
      <h2>${subcategory.title}</h2>
    </div>
    <div class="item-list">
      ${sortedItems(subcategory).map(({ item, index }) => renderItem(subcategory, item, index)).join("")}
    </div>
  `;

  document.querySelector("#closeDetailBtn").addEventListener("click", () => {
    detailOpen = false;
    render();
  });

  document.querySelector("#prevDetailBtn").addEventListener("click", () => moveDetailSelection(-1));
  document.querySelector("#nextDetailBtn").addEventListener("click", () => moveDetailSelection(1));

  detailPanel.querySelectorAll(".scale-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const key = button.dataset.key;
      const previousValue = session.observations[key] ?? 0;
      const nextValue = Number(button.dataset.value);
      const willMoveDown = previousValue === 0 && nextValue !== 0;
      itemMoveSnapshot = willMoveDown ? captureItemPositions() : null;
      session.observations[key] = nextValue;
      recentlySortedKey = willMoveDown ? key : null;
      session.updatedAt = new Date().toISOString();
      persistSession();
      render();
    });
  });

  detailPanel.querySelectorAll(".item-card").forEach((card) => {
    card.addEventListener("click", () => openObservationNote(card.dataset.key));
  });

  if (itemMoveSnapshot) {
    animateItemReorder(itemMoveSnapshot, recentlySortedKey);
    itemMoveSnapshot = null;
  }
}

function openObservationNote(key) {
  const item = itemByKey(key);
  if (!item) {
    return;
  }
  activeObservationNoteKey = key;
  observationNoteItem.textContent = item.text;
  observationNoteText.value = cardMeta(key).observationNote ?? "";
  observationNoteDialog.classList.remove("hidden");
  observationNoteText.focus();
}

function closeObservationNote() {
  if (activeObservationNoteKey) {
    cardMeta(activeObservationNoteKey).observationNote = observationNoteText.value.trim();
    persistSession();
  }
  activeObservationNoteKey = null;
  observationNoteDialog.classList.add("hidden");
}

function saveObservationNote() {
  if (!activeObservationNoteKey) {
    return;
  }
  cardMeta(activeObservationNoteKey).observationNote = observationNoteText.value.trim();
  if (!cardMeta(activeObservationNoteKey).note?.trim()) {
    cardMeta(activeObservationNoteKey).note = observationNoteText.value.trim();
  }
  persistSession();
  closeObservationNote();
  render();
}

function captureItemPositions() {
  const positions = {};
  detailPanel.querySelectorAll(".item-card[data-key]").forEach((card) => {
    positions[card.dataset.key] = card.getBoundingClientRect().top;
  });
  return positions;
}

function animateItemReorder(previousPositions, movedKey) {
  const cards = Array.from(detailPanel.querySelectorAll(".item-card[data-key]"));
  const animatedCards = [];

  cards.forEach((card) => {
    const oldTop = previousPositions[card.dataset.key];
    if (typeof oldTop !== "number") {
      return;
    }

    const newTop = card.getBoundingClientRect().top;
    const delta = oldTop - newTop;
    if (Math.abs(delta) < 2) {
      return;
    }

    card.style.transition = "none";
    card.style.transform = `translateY(${delta}px)`;
    card.classList.add("reordering");
    card.classList.toggle("moving-down", card.dataset.key === movedKey);
    card.classList.toggle("making-room", card.dataset.key !== movedKey);
    animatedCards.push(card);
  });

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      animatedCards.forEach((card) => {
        card.style.transition = "transform 2300ms cubic-bezier(0.16, 0.72, 0.18, 1)";
        card.style.transform = "translateY(0)";
      });
    });
  });

  window.setTimeout(() => {
    animatedCards.forEach((card) => {
      card.style.transition = "";
      card.style.transform = "";
      card.classList.remove("reordering", "moving-down", "making-room", "just-sorted");
    });
    if (recentlySortedKey === movedKey) {
      recentlySortedKey = null;
    }
  }, 2400);
}

function moveDetailSelection(direction) {
  const entries = observeMode === "single"
    ? (dimensions.find((dimension) => dimension.id === singleDimensionId) ?? dimensions[0]).subcategories
    : subcategories;
  const currentId = observeMode === "single" ? singleSubcategoryId : activeSubcategoryId;
  const currentIndex = entries.findIndex((subcategory) => subcategory.id === currentId);
  const nextIndex = (currentIndex + direction + entries.length) % entries.length;
  const nextSubcategory = entries[nextIndex];
  activeSubcategoryId = nextSubcategory.id;
  if (observeMode === "single") {
    singleSubcategoryId = nextSubcategory.id;
    singleDimensionId = nextSubcategory.dimension?.id ?? singleDimensionId;
  }
  recentlySortedKey = null;
  detailOpen = true;
  render();
}

function sortedItems(subcategory) {
  return subcategory.items
    .map((item, index) => ({
      item,
      index,
      value: session.observations[itemKey(subcategory.id, index)] ?? 0
    }))
    .sort((a, b) => {
      const aMarked = a.value === 0 ? 0 : 1;
      const bMarked = b.value === 0 ? 0 : 1;
      return aMarked - bMarked || a.index - b.index;
    });
}

function closeDetailPanel() {
  detailPanel.classList.add("hidden");
  detailPanel.innerHTML = "";
}

function renderItem(subcategory, item, index) {
  const key = itemKey(subcategory.id, index);
  const value = session.observations[key] ?? 0;
  const state = states[value];
  const meta = cardMeta(key);
  const sortedClass = key === recentlySortedKey ? "just-sorted" : "";
  return `
    <article class="item-card ${state.className} ${sortedClass} ${meta.observationNote ? "has-note" : ""}" data-key="${key}" title="Für Beobachtungsnotiz antippen">
      <p class="item-title">${item}</p>
      <div class="item-scale wheel" aria-label="Farbskala für Item">
        ${scaleValues.map((scaleValue) => {
          const scaleState = states[scaleValue];
          return `
            <button
              class="scale-button ${scaleState.className} ${value === scaleValue ? "active" : ""}"
              type="button"
              data-key="${key}"
              data-value="${scaleValue}"
              aria-pressed="${value === scaleValue}"
              aria-label="${scaleState.label}"
              title="${scaleState.label}"
            >
              <span>${scaleState.shortLabel}</span>
            </button>
          `;
        }).join("")}
      </div>
      <p class="item-state">${state.label}</p>
      ${meta.observationNote ? `<span class="item-note-indicator">Notiz</span>` : ""}
    </article>
  `;
}

function updateChart() {
  if (observeMode === "single") {
    if (radarChart) {
      radarChart.destroy();
      radarChart = null;
    }
    return;
  }
  const entries = chartEntries();
  const labels = entries.map((entry) => entry.label);
  const profileData = entries.map((entry) => Number(entry.evidenceValue.toFixed(3)));
  const developmentData = entries.map((entry) => Number(entry.developmentValue.toFixed(3)));
  const activeIndex = entries.findIndex((entry) => entry.id === activeSubcategoryId);

  const dimensionRanges = dimensionAnnotations();
  const chartData = {
    labels,
    datasets: [
      {
        label: "Beobachtete lerntragende Evidenzen",
        data: profileData,
        borderColor: "#32895a",
        backgroundColor: "rgba(50, 137, 90, 0.18)",
        pointBackgroundColor: entries.map((entry) => entry.id === activeSubcategoryId ? entry.color : "#32895a"),
        pointBorderColor: "#ffffff",
        pointRadius: entries.map((entry) => entry.id === activeSubcategoryId ? 8 : 5),
        pointHoverRadius: 9,
        borderWidth: 2,
        spanGaps: false
      },
      {
        label: "Markierte Entwicklungspotenziale",
        data: developmentData,
        borderColor: "#7b4bb2",
        backgroundColor: "rgba(123, 75, 178, 0.13)",
        pointBackgroundColor: "#7b4bb2",
        pointBorderColor: "#ffffff",
        pointRadius: 5,
        pointHoverRadius: 9,
        borderWidth: 2,
        spanGaps: false
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 180 },
    layout: { padding: 30 },
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          stepSize: 0.5,
          backdropColor: "transparent",
          color: "#69787f",
          callback: (value) => `${value}`
        },
        pointLabels: {
          color: "rgba(38, 56, 64, 0)",
          font: (context) => ({
            size: context.index === activeIndex ? 13 : 11,
            weight: context.index === activeIndex ? 800 : 700
          })
        },
        grid: { color: "#d9e2e3" },
        angleLines: {
          color: (context) => context.index === activeIndex ? entries[context.index].color : "#d9e2e3",
          lineWidth: (context) => context.index === activeIndex ? 2 : 1
        }
      }
    },
    plugins: {
      legend: { display: false },
      dimensionBands: { ranges: dimensionRanges },
      tooltip: {
        callbacks: {
          title: (items) => entries[items[0].dataIndex].title,
          label: (context) => {
            if (context.datasetIndex === 1) {
              return `Blaues Profil: ${entries[context.dataIndex].developmentScoreSum} von ${entries[context.dataIndex].maxScore}`;
            }
            return `Grünes Profil: ${entries[context.dataIndex].evidenceScoreSum} von ${entries[context.dataIndex].maxScore}`;
          }
        }
      }
    },
    onClick: (event, elements, chart) => {
      const index = elements[0]?.index ?? labelIndexFromEvent(event, chart);
      if (Number.isInteger(index) && entries[index]) {
        activeSubcategoryId = observeMode === "multi" ? entries[index].id : singleSubcategoryId;
        detailOpen = true;
        currentView = "observe";
        render();
      }
    },
    onHover: (event, elements, chart) => {
      const index = elements[0]?.index ?? labelIndexFromEvent(event, chart);
      chart.canvas.style.cursor = Number.isInteger(index) ? "pointer" : "default";
    }
  };

  const canvas = document.querySelector("#radarChart");
  if (radarChart) {
    radarChart.data = chartData;
    radarChart.options = options;
    radarChart.update();
  } else {
    radarChart = new Chart(canvas, { type: "radar", data: chartData, options });
  }
}

function renderEvaluation() {
  const cards = markedItems();
  const evidence = cards
    .filter((card) => card.value === 1 || card.value === 2)
    .sort(cardSort);
  const development = cards
    .filter((card) => card.value === 3 || card.value === 4)
    .sort(cardSort);

  evidenceCards.innerHTML = evidence.length
    ? renderDimensionEvaluation(evidence, "evidence")
    : `<p class="empty-state">Noch keine lerntragenden Wirkungen markiert.</p>`;
  developmentCards.innerHTML = development.length
    ? renderDimensionEvaluation(development, "development")
    : `<p class="empty-state">Noch keine Entwicklungspotenziale markiert.</p>`;

  document.querySelectorAll(".cluster-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("show-detail");
    });
  });
  document.querySelectorAll("[data-action='hide-card']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      cardMeta(button.dataset.key).hidden = true;
      persistSession();
      render();
    });
  });
  document.querySelectorAll("[data-action='lock-card']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const meta = cardMeta(button.dataset.key);
      meta.locked = !meta.locked;
      persistSession();
      render();
    });
  });
  document.querySelectorAll("[data-action='hide-cluster']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      keysFromDataset(button.dataset.keys).forEach((key) => {
        cardMeta(key).hidden = true;
      });
      persistSession();
      render();
    });
  });
  document.querySelectorAll("[data-action='lock-cluster']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const keys = keysFromDataset(button.dataset.keys);
      const shouldLock = !keys.every((key) => cardMeta(key).locked);
      keys.forEach((key) => {
        cardMeta(key).locked = shouldLock;
      });
      persistSession();
      render();
    });
  });
  document.querySelectorAll(".card-note").forEach((textarea) => {
    textarea.addEventListener("click", (event) => event.stopPropagation());
    textarea.addEventListener("input", () => {
      cardMeta(textarea.dataset.key).note = textarea.value;
      persistSession();
    });
  });
  document.querySelectorAll("[data-action='restore-card']").forEach((button) => {
    button.addEventListener("click", () => {
      cardMeta(button.dataset.key).hidden = false;
      persistSession();
      render();
    });
  });
  renderHiddenStack(cards.filter((card) => card.meta.hidden));
}

function renderHiddenStack(hiddenCards) {
  hiddenStack.innerHTML = hiddenCards.length
    ? `
      <button class="hidden-stack-button" type="button">Ablage (${hiddenCards.length})</button>
      <div class="hidden-stack-list">
        ${hiddenCards.map((card) => `
          <button type="button" data-action="restore-card" data-key="${card.key}">
            ${keywordFor(card)}
          </button>
        `).join("")}
      </div>
    `
    : "";
}

function renderDimensionEvaluation(cards, type) {
  return dimensions
    .map((dimension, dimensionIndex) => {
      const dimensionCards = cards.filter((card) => card.subcategory.dimension.id === dimension.id && !card.meta.hidden);
      return { dimension, dimensionIndex, cards: dimensionCards };
    })
    .filter((group) => group.cards.length)
    .sort((a, b) => bestPriority(a.cards) - bestPriority(b.cards) || a.dimensionIndex - b.dimensionIndex)
    .map(({ dimension, cards: dimensionCards }) => {
    if (!dimensionCards.length) {
      return "";
    }

    return `
      <details class="evaluation-group" open>
        <summary style="--group-color: ${dimension.color}">
          <span>${dimension.title}</span>
          <em>${dimensionCards.length}</em>
        </summary>
        <div class="cluster-grid">
          ${clusterCards(dimensionCards).map((cluster) => renderClusterCard(cluster, type)).join("")}
        </div>
      </details>
    `;
  }).join("");
}

function clusterCards(cards) {
  const clusters = new Map();
  cards.forEach((card) => {
    const key = `${card.value}|${card.subcategory.id}|${keywordFor(card)}`;
    if (!clusters.has(key)) {
      clusters.set(key, {
        key,
        value: card.value,
        state: card.state,
        keyword: keywordFor(card),
        subcategory: card.subcategory,
        cards: []
      });
    }
    clusters.get(key).cards.push(card);
  });
  return Array.from(clusters.values()).sort((a, b) =>
    bestPriority(a.cards) - bestPriority(b.cards)
    || a.subcategoryIndex - b.subcategoryIndex
    || a.keyword.localeCompare(b.keyword, "de")
  );
}

function bestPriority(cards) {
  return Math.min(...cards.map((card) => ({ 4: 0, 3: 1, 2: 0, 1: 1 }[card.value] ?? 9)));
}

function keysFromDataset(value) {
  return String(value ?? "").split("|").filter(Boolean);
}

function keywordFor(card) {
  const title = card.subcategory.title.replace(/^\d\.\d\s*/, "");
  const item = card.item;
  if (item.includes("Rückmeldungen") || item.includes("Feedback")) return "Feedback";
  if (item.includes("Denkweisen") || item.includes("Lösungsansätze")) return "Denkweisen";
  if (item.includes("Verständnis")) return "Verständnis";
  if (item.includes("Aufgaben") || item.includes("Fragen")) return "Aufgaben";
  if (item.includes("Beiträge")) return "Beiträge";
  if (item.includes("Arbeitsprozesse") || item.includes("Arbeitsphasen")) return "Arbeitsprozesse";
  if (item.includes("Störungen") || item.includes("Unruhe")) return "Störungen";
  if (item.includes("Zeit") || item.includes("Übergänge")) return "Zeitnutzung";
  if (item.includes("Gruppen") || item.includes("Partner")) return "Zusammenarbeit";
  return title;
}

function renderKeywordCard(card) {
  const isDevelopment = card.value === 3 || card.value === 4;
  const keyword = keywordFor(card);
  const developmentText = `Im Bereich „${keyword}“ besteht ${card.value === 4 ? "zentrales" : "mögliches"} Entwicklungspotenzial.`;
  const noteText = card.meta.note || card.meta.observationNote || "";
  return `
    <article class="keyword-card ${card.state.className} ${card.meta.locked ? "locked" : ""}" style="--card-color: ${stateColor(card.value)}">
      <span>${keyword}</span>
      <strong>${isDevelopment ? developmentText : card.state.label}</strong>
      <em>${card.subcategory.title}</em>
      <div class="card-actions">
        <button type="button" data-action="lock-card" data-key="${card.key}" title="Fixieren">${card.meta.locked ? "🔒" : "🔓"}</button>
        <button type="button" data-action="hide-card" data-key="${card.key}" title="Verwerfen">×</button>
      </div>
      <div class="keyword-detail">
        <p>${card.item}</p>
        ${card.meta.observationNote ? `<p><strong>Beobachtungsnotiz:</strong> ${escapeHtml(card.meta.observationNote)}</p>` : ""}
        <label class="card-note-label" for="note-${card.key}">Fachspezifische Anmerkung</label>
        <textarea id="note-${card.key}" class="card-note" data-key="${card.key}" placeholder="Fachspezifische Anmerkung">${escapeHtml(noteText)}</textarea>
      </div>
    </article>
  `;
}

function renderClusterCard(cluster) {
  const isDevelopment = cluster.value === 3 || cluster.value === 4;
  const keys = cluster.cards.map((card) => card.key).join("|");
  const allLocked = cluster.cards.every((card) => card.meta.locked);
  const label = isDevelopment
    ? `${cluster.value === 4 ? "Zentrales" : "Mögliches"} Entwicklungspotenzial`
    : cluster.state.label;
  return `
    <article class="cluster-card ${cluster.state.className} ${allLocked ? "locked" : ""}" style="--card-color: ${stateColor(cluster.value)}">
      <div class="cluster-topline">
        <span>${cluster.keyword}</span>
        ${cluster.cards.length > 1 ? `<em>${cluster.cards.length}</em>` : ""}
      </div>
      <strong>${label}</strong>
      <small>${cluster.subcategory.title}</small>
      <div class="card-actions">
        <button type="button" data-action="lock-cluster" data-keys="${keys}" title="Fixieren">${allLocked ? "🔒" : "🔓"}</button>
        <button type="button" data-action="hide-cluster" data-keys="${keys}" title="Verwerfen">×</button>
      </div>
      <div class="cluster-detail">
        ${cluster.cards.map((card) => `
          <section class="cluster-item">
            <p>${card.item}</p>
            ${card.meta.observationNote ? `<p><strong>Beobachtungsnotiz:</strong> ${escapeHtml(card.meta.observationNote)}</p>` : ""}
            <label class="card-note-label" for="note-${card.key}">Fachspezifische Anmerkung</label>
            <textarea id="note-${card.key}" class="card-note" data-key="${card.key}" placeholder="Fachspezifische Anmerkung">${escapeHtml(card.meta.note || card.meta.observationNote || "")}</textarea>
          </section>
        `).join("")}
      </div>
    </article>
  `;
}

function renderGroupedEvaluation(cards) {
  const groups = [];
  cards.forEach((card) => {
    const key = card.subcategory.id;
    let group = groups.find((candidate) => candidate.key === key);
    if (!group) {
      group = {
        key,
        dimension: card.subcategory.dimension,
        subcategory: card.subcategory,
        cards: []
      };
      groups.push(group);
    }
    group.cards.push(card);
  });

  return groups.map((group, index) => `
    <details class="evaluation-group" ${index === 0 ? "open" : ""}>
      <summary style="--group-color: ${group.dimension.color}">
        <span>${group.dimension.title}</span>
        <strong>${group.subcategory.title}</strong>
        <em>${group.cards.length}</em>
      </summary>
      <div class="evaluation-list compact-list">
        ${group.cards.map((card) => renderEvaluationCard(card, type)).join("")}
      </div>
    </details>
  `).join("");
}

function markedItems() {
  const cards = [];
  subcategories.forEach((subcategory, subcategoryIndex) => {
    subcategory.items.forEach((item, itemIndex) => {
      const key = itemKey(subcategory.id, itemIndex);
      const value = session.observations[key] ?? 0;
      if (value === 0) {
        return;
      }
      cards.push({
        key,
        value,
        state: states[value],
        item,
        subcategory,
        meta: cardMeta(key),
        subcategoryIndex,
        dimensionIndex: dimensions.findIndex((dimension) => dimension.id === subcategory.dimension.id)
      });
    });
  });
  return cards;
}

function cardMeta(key) {
  session.cardMeta ??= {};
  session.cardMeta[key] ??= { hidden: false, locked: false, note: "", observationNote: "" };
  session.cardMeta[key].observationNote ??= "";
  session.cardMeta[key].note ??= "";
  if (session.cardMeta[key].observationNote && !session.cardMeta[key].note.trim()) {
    session.cardMeta[key].note = session.cardMeta[key].observationNote;
  }
  return session.cardMeta[key];
}

function resetSession() {
  session = createEmptySession();
  activeSubcategoryId = subcategories[0].id;
  singleDimensionId = dimensions[0].id;
  singleSubcategoryId = dimensions[0].subcategories[0].id;
  observeMode = "multi";
  detailOpen = false;
  currentView = "observe";
  persistSession();
  newSessionDialog.classList.add("hidden");
  render();
}

function cardSort(a, b) {
  const priority = { 4: 0, 3: 1, 2: 0, 1: 1 };
  return priority[a.value] - priority[b.value]
    || a.dimensionIndex - b.dimensionIndex
    || a.subcategoryIndex - b.subcategoryIndex;
}

function stateColor(value) {
  return {
    1: "#8bd255",
    2: "#4a9f2f",
    3: "#87c7ff",
    4: "#2369a8"
  }[value] ?? "#d8dde2";
}

function renderEvaluationCard(card) {
  return `
    <article class="evaluation-card ${card.state.className}" style="--card-color: ${card.subcategory.dimension.color}">
      <p>${card.item}</p>
      <strong>${card.state.label}</strong>
    </article>
  `;
}

function renderProtocol() {
  const canvas = document.querySelector("#radarChart");
  const chartImage = canvas ? canvas.toDataURL("image/png") : "";
  const cards = markedItems().filter((card) => !card.meta.hidden);
  const evidence = cards.filter((card) => card.value === 1 || card.value === 2).sort(cardSort);
  const development = cards.filter((card) => card.value === 3 || card.value === 4).sort(cardSort);
  protocolContent.innerHTML = `
    <h1>Beobachtungsassistent Tiefenstruktur</h1>
    <p>Strukturierte Gesprächsgrundlage, keine Gesamtbewertung.</p>
    ${chartImage ? `<img class="protocol-chart" src="${chartImage}" alt="Spiderdiagramm">` : ""}
    <h2>Positivrunde: Lerntragende Wirkungen</h2>
    ${renderProtocolList(evidence)}
    <h2>Entwicklungspotenziale</h2>
    ${renderProtocolList(development)}
  `;
}

function renderProtocolList(cards) {
  if (!cards.length) {
    return `<p>Keine Karten ausgewählt.</p>`;
  }
  return cards.map((card) => `
    <article class="protocol-card">
      <h3>${keywordFor(card)}</h3>
      <p><strong>${card.subcategory.dimension.title}</strong> · ${card.subcategory.title}</p>
      <p>${card.item}</p>
      ${card.meta.observationNote ? `<p><strong>Beobachtungsnotiz:</strong> ${escapeHtml(card.meta.observationNote)}</p>` : ""}
      ${card.meta.note ? `<p><strong>Fachspezifische Anmerkung:</strong> ${escapeHtml(card.meta.note)}</p>` : ""}
    </article>
  `).join("");
}

function dimensionAnnotations() {
  let cursor = 0;
  return dimensions.map((dimension) => {
    const start = cursor;
    const end = cursor + dimension.subcategories.length - 1;
    cursor = end + 1;
    return { title: dimension.title, color: dimension.color, start, end };
  });
}

function labelIndexFromEvent(event, chart) {
  const nativeEvent = event.native ?? event;
  if (typeof nativeEvent.clientX !== "number" || typeof nativeEvent.clientY !== "number") {
    return null;
  }

  const rect = chart.canvas.getBoundingClientRect();
  const scaleX = chart.canvas.width / rect.width;
  const scaleY = chart.canvas.height / rect.height;
  const x = (nativeEvent.clientX - rect.left) * scaleX;
  const y = (nativeEvent.clientY - rect.top) * scaleY;
  const scale = chart.scales.r;
  const centerX = scale.xCenter;
  const centerY = scale.yCenter;
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance < scale.drawingArea * 0.25 || distance > scale.drawingArea + 110) {
    return null;
  }

  const angle = normalizeAngle(Math.atan2(dy, dx) + Math.PI / 2);
  const count = chartEntries().length;
  const slice = (Math.PI * 2) / count;
  return Math.round(angle / slice) % count;
}

function chartEntries() {
  if (observeMode === "single") {
    const subcategory = subcategories.find((candidate) => candidate.id === singleSubcategoryId) ?? subcategories[0];
    return subcategory.items.map((item, index) => {
      const value = session.observations[itemKey(subcategory.id, index)] ?? 0;
      const state = states[value];
      return {
        id: `${subcategory.id}:${index}`,
        title: item,
        label: `Item ${index + 1}`,
        color: subcategory.dimension.color,
        evidenceScoreSum: state.evidenceScore,
        developmentScoreSum: state.developmentScore,
        maxScore: 2,
        evidenceValue: state.evidenceScore / 2,
        developmentValue: state.developmentScore / 2
      };
    });
  }

  return subcategories.map((subcategory) => ({
    id: subcategory.id,
    title: subcategory.title,
    label: subcategory.chartLabel,
    color: subcategory.dimension.color,
    ...subcategoryStats(subcategory)
  }));
}

function normalizeAngle(angle) {
  const fullCircle = Math.PI * 2;
  return ((angle % fullCircle) + fullCircle) % fullCircle;
}

function subcategoryStats(subcategory) {
  const values = subcategory.items.map((_, index) => session.observations[itemKey(subcategory.id, index)] ?? 0);
  const evidenceScoreSum = values.reduce((sum, value) => sum + (states[value]?.evidenceScore ?? 0), 0);
  const developmentScoreSum = values.reduce((sum, value) => sum + (states[value]?.developmentScore ?? 0), 0);
  const maxScore = subcategory.items.length * 2;
  return {
    neutral: values.filter((value) => value === 0).length,
    light: values.filter((value) => value === 1).length,
    strong: values.filter((value) => value === 2).length,
    development: values.filter((value) => value === 3).length,
    developmentStrong: values.filter((value) => value === 4).length,
    evidenceScoreSum,
    developmentScoreSum,
    maxScore,
    evidenceValue: maxScore > 0 ? evidenceScoreSum / maxScore : 0,
    developmentValue: maxScore > 0 ? developmentScoreSum / maxScore : 0
  };
}

function getActiveSubcategory() {
  return subcategories.find((subcategory) => subcategory.id === activeSubcategoryId) ?? subcategories[0];
}

function itemKey(subcategoryId, index) {
  return `${subcategoryId}:${index}`;
}

function itemByKey(key) {
  const [subcategoryId, indexText] = key.split(":");
  const subcategory = subcategories.find((candidate) => candidate.id === subcategoryId);
  const index = Number(indexText);
  if (!subcategory || !Number.isInteger(index) || !subcategory.items[index]) {
    return null;
  }
  return { subcategory, index, text: subcategory.items[index] };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function persistSession() {
  session.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function loadStoredSession() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return normalizeSession(JSON.parse(stored));
  } catch {
    return null;
  }
}

function normalizeSession(candidate) {
  const clean = createEmptySession();
  clean.createdAt = candidate.createdAt ?? clean.createdAt;
  clean.updatedAt = candidate.updatedAt ?? clean.updatedAt;
  Object.keys(clean.observations).forEach((key) => {
    const value = Number(candidate.observations?.[key] ?? 0);
    clean.observations[key] = [0, 1, 2, 3, 4].includes(value) ? value : 0;
  });
  clean.cardMeta = candidate.cardMeta ?? {};
  return clean;
}

function exportSession() {
  persistSession();
  const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `beobachtungsassistent-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  updateSaveState("Export vorbereitet");
}

async function shareSummary() {
  const text = buildShareText();
  const shareData = {
    title: "Beobachtungsassistent Tiefenstruktur",
    text
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      updateSaveState("Teilen geöffnet");
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(text);
    updateSaveState("Zusammenfassung kopiert");
    alert("Das Teilen-Menü ist in diesem Browser nicht verfügbar. Die Zusammenfassung wurde in die Zwischenablage kopiert.");
  } catch {
    alert(text);
  }
}

function buildShareText() {
  const visibleCards = markedItems().filter((card) => !card.meta.hidden).sort(cardSort);
  const evidence = visibleCards.filter((card) => card.value === 1 || card.value === 2);
  const development = visibleCards.filter((card) => card.value === 3 || card.value === 4);
  return [
    "Beobachtungsassistent Tiefenstruktur",
    "Strukturierte Gesprächsgrundlage, keine Gesamtbewertung.",
    "",
    "Lerntragende Wirkungen",
    shareSection(evidence),
    "",
    "Entwicklungspotenziale",
    shareSection(development)
  ].join("\n");
}

function shareSection(cards) {
  if (!cards.length) {
    return "Keine Karten ausgewählt.";
  }

  return clusterCards(cards).map((cluster) => {
    const lines = [
      `- ${cluster.keyword} (${cluster.cards.length}): ${cluster.state.label}`,
      `  ${cluster.subcategory.title}`
    ];
    cluster.cards.forEach((card) => {
      if (card.meta.observationNote) {
        lines.push(`  Beobachtungsnotiz: ${card.meta.observationNote}`);
      }
      if (card.meta.note) {
        lines.push(`  Fachspezifische Anmerkung: ${card.meta.note}`);
      }
    });
    return lines.join("\n");
  }).join("\n");
}

function importSession(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      session = normalizeSession(JSON.parse(reader.result));
      activeSubcategoryId = subcategories[0].id;
      persistSession();
      render();
    } catch {
      alert("Die JSON-Datei konnte nicht importiert werden.");
    } finally {
      importFile.value = "";
    }
  });
  reader.readAsText(file);
}

function updateSaveState(message) {
  saveState.textContent = message;
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `${red}, ${green}, ${blue}`;
}
