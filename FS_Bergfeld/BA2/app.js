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
let protocolSpiderChart = null;
let currentView = "observe";
let detailOpen = false;
let observeMode = "multi";
let singleDimensionId = dimensions[0].id;
let singleSubcategoryId = dimensions[0].subcategories[0].id;
let recentlySortedKey = null;
let itemMoveSnapshot = null;
let activeObservationNoteKey = null;
let draftLiveDecisions = {};
let expandedLiveEventId = null;
let recentLiveSavedId = null;
let chartOverlayOpen = false;
let liveSwipeStart = null;
let liveShortcutLock = false;
let liveSuggestionCacheKey = "";
let liveSuggestionCacheResult = null;
let phase2CacheKey = "";
let phase2CacheBoard = null;
let rawLogbookSplitWidth = Number(window.localStorage?.getItem("ufbRawLogSplitWidth") ?? 42) || 42;

const detailPanel = document.querySelector("#detailPanel");
const saveState = document.querySelector("#saveState");
const importFile = document.querySelector("#importFile");
const toolsToggleBtn = document.querySelector("#toolsToggleBtn");
const closeToolsBtn = document.querySelector("#closeToolsBtn");
const chartNav = document.querySelector("#chartNav");
const bucketView = document.querySelector("#bucketView");
const dimensionStrip = document.querySelector("#dimensionStrip");
const chartPanel = document.querySelector("#chartPanel");
const toggleChartBtn = document.querySelector("#toggleChartBtn");
const closeChartBtn = document.querySelector("#closeChartBtn");
const observeView = document.querySelector("#observeView");
const logbookView = document.querySelector("#logbookView");
const evaluateView = document.querySelector("#evaluateView");
const observeTab = document.querySelector("#observeTab");
const logbookTab = document.querySelector("#logbookTab");
const evaluateTab = document.querySelector("#evaluateTab");
const protocolTab = document.querySelector("#protocolTab");
const evidenceCards = document.querySelector("#evidenceCards");
const developmentCards = document.querySelector("#developmentCards");
const synthesisCards = document.querySelector("#synthesisCards");
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
const customCardDialog = document.querySelector("#customCardDialog");
const customCardHeading = document.querySelector("#customCardHeading");
const customCardNote = document.querySelector("#customCardNote");
const logbookHeading = document.querySelector("#logbookHeading");
const phaseDuration = document.querySelector("#phaseDuration");
const observationFields = document.querySelector("#observationFields");
const logbookAlternative = document.querySelector("#logbookAlternative");
const quoteDrafts = document.querySelector("#quoteDrafts");
const quoteDialog = document.querySelector("#quoteDialog");
const quoteName = document.querySelector("#quoteName");
const quoteText = document.querySelector("#quoteText");
const quoteHint = document.querySelector("#quoteHint");
const groupDialog = document.querySelector("#groupDialog");
const groupEditorList = document.querySelector("#groupEditorList");
const groupDrafts = document.querySelector("#groupDrafts");
const logbookEntries = document.querySelector("#logbookEntries");
const observationDate = document.querySelector("#observationDate");
const observationPlace = document.querySelector("#observationPlace");
const observationName = document.querySelector("#observationName");
const observationGroup = document.querySelector("#observationGroup");
const liveTimestamp = document.querySelector("#liveTimestamp");
const lessonStartBtn = document.querySelector("#lessonStartBtn");
const lessonEndBtn = document.querySelector("#lessonEndBtn");
const lessonTimingStatus = document.querySelector("#lessonTimingStatus");
const liveType = document.querySelector("#liveType");
const livePhase = document.querySelector("#livePhase");
const liveSocialForm = document.querySelector("#liveSocialForm");
const liveMinute = document.querySelector("#liveMinute");
const livePanel = document.querySelector(".live-panel");
const livePhaseButtons = document.querySelector("#livePhaseButtons");
const liveText = document.querySelector("#liveText");
const liveHintText = document.querySelector("#liveHintText");
const liveSmartHints = document.querySelector("#liveSmartHints");
const liveSuggestions = document.querySelector("#liveSuggestions");
const manualItemSelect = document.querySelector("#manualItemSelect");
const saveLiveObservationBtn = document.querySelector("#saveLiveObservationBtn");
const rawObservationList = document.querySelector("#rawObservationList");
const openSketchBtn = document.querySelector("#openSketchBtn");
const sketchDialog = document.querySelector("#sketchDialog");
const closeSketchDialogBtn = document.querySelector("#closeSketchDialogBtn");
const sketchCanvas = document.querySelector("#sketchCanvas");
const clearSketchBtn = document.querySelector("#clearSketchBtn");
const saveSketchBtn = document.querySelector("#saveSketchBtn");
const discussionCards = document.querySelector("#discussionCards");

let pendingCustomCardType = "evidence";
let pendingCustomCardScope = "evaluation";
let currentQuoteType = "s-schueler";
let pendingQuotes = [];
let pendingGroups = [];
let activeLiveSuggestions = [];
let selectedLiveItemIds = new Set();
let liveValence = "neutral";
let sketchContext = null;
let sketchTool = "pen";
let sketchColor = "#18333a";
let sketchDrawing = false;
let sketchLastPoint = null;
let sketchHasInk = false;
let pendingLiveSketchDataUrl = "";
let pendingLiveSketchCreatedAt = null;
let activeDiscussionCardId = null;
let activeProtocolCardId = null;
let activeLiveAssistField = null;
let inputAssistanceCache = null;
let liveSmartHintTimer = null;
let liveSuggestionTimer = null;
let idleAnalysisTimer = null;
let idleAnalysisRunning = false;
let lastUserActivityAt = Date.now();
let lastIdlePreparedKey = "";

const IDLE_ANALYSIS_DELAY_MS = 60000;

document.addEventListener("DOMContentLoaded", () => {
  session = loadStoredSession() ?? createEmptySession();
  bindEvents();
  render();
});

function bindEvents() {
  bindIdleAnalysisEvents();

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
  document.querySelector("#exportChartBtn").addEventListener("click", exportChartImage);
  importFile.addEventListener("change", importSession);
  toolsToggleBtn?.addEventListener("click", () => setToolsOpen(!document.body.classList.contains("tools-open")));
  closeToolsBtn?.addEventListener("click", () => setToolsOpen(false));
  toggleChartBtn?.addEventListener("click", () => {
    chartOverlayOpen = !chartOverlayOpen;
    detailOpen = false;
    render();
  });
  lessonStartBtn?.addEventListener("click", startLessonTiming);
  lessonEndBtn?.addEventListener("click", endLessonTiming);
  closeChartBtn?.addEventListener("click", () => {
    chartOverlayOpen = false;
    render();
  });
  bindLiveEvents();
  window.addEventListener("research-pattern-library-loaded", () => {
    updateLiveSuggestions();
    (session.rawObservations ?? [])
      .filter((event) => !event.excluded && !event.postAnalysis?.ignored && !event.postAnalysis?.updatedAt)
      .slice(0, 30)
      .forEach((event, index) => queueLivePostAnalysis(event.id, 360 + index * 60));
    if (currentView === "evaluate") {
      render();
    }
  });

  observeTab.addEventListener("click", () => {
    currentView = "observe";
    render();
  });

  logbookTab.addEventListener("click", () => {
    currentView = "logbook";
    detailOpen = false;
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
  document.querySelector("#shareProtocolBtn")?.addEventListener("click", exportCuratedProtocolHtml);
  document.querySelector("#fullSessionExportBtn")?.addEventListener("click", exportSession);
  document.querySelector("#saveAndNewBtn").addEventListener("click", () => {
    exportSession();
    resetSession();
  });
  document.querySelector("#discardAndNewBtn").addEventListener("click", resetSession);
  document.querySelector("#cancelNewBtn").addEventListener("click", () => newSessionDialog.classList.add("hidden"));
  document.querySelector("#calculateSynthesisBtn").addEventListener("click", () => {
    phase2CacheKey = "";
    phase2CacheBoard = null;
    lastIdlePreparedKey = "";
    precomputeIdleAnalysis();
    window.setTimeout(() => {
      getPhase2Board({ includeOpen: true });
      getPhase2Board({ includeOpen: false });
      render();
    }, 200);
  });
  document.querySelector("#addEvidenceCardBtn").addEventListener("click", () => openCustomCard("evidence", "evaluation"));
  document.querySelector("#addDevelopmentCardBtn").addEventListener("click", () => openCustomCard("development", "evaluation"));
  document.querySelector("#closeCustomCardBtn").addEventListener("click", closeCustomCard);
  document.querySelector("#saveCustomCardBtn").addEventListener("click", saveCustomCard);
  document.querySelector("#addLogEntryBtn").addEventListener("click", addLogEntry);
  document.querySelector("#groupWorkBtn").addEventListener("click", openGroupDialog);
  document.querySelector("#feedbackLogBtn").addEventListener("click", prepareFeedbackLog);
  document.querySelector("#addObservationFieldBtn").addEventListener("click", () => addObservationField());
  document.querySelector("#closeGroupDialogBtn").addEventListener("click", closeGroupDialog);
  document.querySelector("#addGroupBtn").addEventListener("click", () => {
    syncGroupDraftFromEditor();
    pendingGroups.push({ id: `group-${Date.now()}`, label: `Gruppe ${pendingGroups.length + 1}`, note: "" });
    renderGroupEditor();
  });
  document.querySelector("#saveGroupsBtn").addEventListener("click", saveGroupDrafts);
  document.querySelectorAll("[data-quote-type]").forEach((button) => {
    button.addEventListener("click", () => {
      openQuoteDialog(button.dataset.quoteType);
    });
  });
  document.querySelector("#closeQuoteDialogBtn").addEventListener("click", closeQuoteDialog);
  document.querySelector("#saveQuoteBtn").addEventListener("click", saveQuoteDraft);
  openSketchBtn?.addEventListener("click", openSketchDialog);
  closeSketchDialogBtn?.addEventListener("click", closeSketchDialog);
  clearSketchBtn?.addEventListener("click", clearSketchCanvas);
  saveSketchBtn?.addEventListener("click", saveSketchEntry);
  document.querySelectorAll("[data-sketch-tool]").forEach((button) => {
    button.addEventListener("click", () => setSketchTool(button.dataset.sketchTool));
  });
  document.querySelectorAll("[data-sketch-color]").forEach((button) => {
    button.addEventListener("click", () => setSketchColor(button.dataset.sketchColor));
  });
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
  [observationDate, observationPlace, observationName, observationGroup].forEach((input) => {
    input.addEventListener("input", () => {
      session.observationInfo = readObservationInfo();
      persistSession();
      renderProtocol();
    });
  });
}

function bindIdleAnalysisEvents() {
  const mark = () => markUserActivityForIdleAnalysis();
  ["input", "keydown", "pointerdown", "click", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, mark, { passive: true, capture: true });
  });
  scheduleIdleAnalysis();
}

function markUserActivityForIdleAnalysis() {
  lastUserActivityAt = Date.now();
  scheduleIdleAnalysis();
}

function scheduleIdleAnalysis() {
  window.clearTimeout(idleAnalysisTimer);
  idleAnalysisTimer = window.setTimeout(runIdleAnalysisIfStillQuiet, IDLE_ANALYSIS_DELAY_MS);
}

function runIdleAnalysisIfStillQuiet() {
  const quietFor = Date.now() - lastUserActivityAt;
  if (quietFor < IDLE_ANALYSIS_DELAY_MS || idleAnalysisRunning) {
    scheduleIdleAnalysis();
    return;
  }
  const prepareKey = [
    session.updatedAt,
    session.rawObservations?.length ?? 0,
    session.lessonTiming?.startTime ?? "",
    session.lessonTiming?.endTime ?? ""
  ].join("|");
  if (prepareKey === lastIdlePreparedKey || !(session.rawObservations ?? []).length) {
    scheduleIdleAnalysis();
    return;
  }
  lastIdlePreparedKey = prepareKey;
  idleAnalysisRunning = true;
  const run = () => {
    precomputeIdleAnalysis();
    idleAnalysisRunning = false;
    scheduleIdleAnalysis();
  };
  if (window.analysisJobQueue?.enqueue) {
    window.analysisJobQueue.enqueue("idle-phase2-precompute", run, { delay: 0 });
  } else {
    window.setTimeout(run, 0);
  }
}

function precomputeIdleAnalysis() {
  const pending = (session.rawObservations ?? [])
    .filter((event) => !event.excluded && event.type !== "sketch" && !event.postAnalysis?.ignored && !event.postAnalysis?.updatedAt)
    .slice(0, 12);
  pending.forEach((event, index) => queueLivePostAnalysis(event.id, index * 90));

  window.setTimeout(() => {
    getPhase2Board({ includeOpen: true });
    window.setTimeout(() => {
      getPhase2Board({ includeOpen: false });
      if (currentView === "evaluate") {
        renderCondensationMode();
      }
    }, 80);
  }, 80);
}

function openSketchDialog() {
  if (!sketchDialog || !sketchCanvas) {
    return;
  }
  sketchDialog.classList.remove("hidden");
  setupSketchCanvas();
  clearSketchCanvas();
  setSketchTool("pen");
  window.setTimeout(() => sketchCanvas.focus?.(), 0);
}

function closeSketchDialog() {
  sketchDialog?.classList.add("hidden");
  focusLiveTextSoftly();
}

function setupSketchCanvas() {
  if (!sketchCanvas || sketchContext) {
    return;
  }
  sketchContext = sketchCanvas.getContext("2d");
  sketchContext.lineCap = "round";
  sketchContext.lineJoin = "round";
  sketchCanvas.addEventListener("pointerdown", startSketchStroke);
  sketchCanvas.addEventListener("pointermove", continueSketchStroke);
  sketchCanvas.addEventListener("pointerup", endSketchStroke);
  sketchCanvas.addEventListener("pointercancel", endSketchStroke);
  sketchCanvas.addEventListener("pointerleave", endSketchStroke);
}

function setSketchTool(tool) {
  sketchTool = tool === "eraser" ? "eraser" : "pen";
  document.querySelectorAll("[data-sketch-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sketchTool === sketchTool);
  });
}

function setSketchColor(color) {
  sketchColor = color || "#18333a";
  sketchTool = "pen";
  document.querySelectorAll("[data-sketch-tool]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sketchTool === "pen");
  });
  document.querySelectorAll("[data-sketch-color]").forEach((button) => {
    button.classList.toggle("active", button.dataset.sketchColor === sketchColor);
  });
}

function clearSketchCanvas() {
  if (!sketchCanvas || !sketchContext) {
    return;
  }
  sketchContext.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);
  sketchHasInk = false;
}

function sketchPointFromEvent(event) {
  const rect = sketchCanvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * sketchCanvas.width,
    y: ((event.clientY - rect.top) / rect.height) * sketchCanvas.height
  };
}

function startSketchStroke(event) {
  event.preventDefault();
  sketchDrawing = true;
  sketchHasInk = true;
  sketchLastPoint = sketchPointFromEvent(event);
  sketchCanvas.setPointerCapture?.(event.pointerId);
  drawSketchDot(sketchLastPoint);
}

function continueSketchStroke(event) {
  if (!sketchDrawing || !sketchLastPoint) {
    return;
  }
  event.preventDefault();
  const point = sketchPointFromEvent(event);
  sketchContext.save();
  sketchContext.globalCompositeOperation = sketchTool === "eraser" ? "destination-out" : "source-over";
  sketchContext.strokeStyle = sketchColor;
  sketchContext.lineWidth = sketchTool === "eraser" ? 28 : 4;
  sketchContext.beginPath();
  sketchContext.moveTo(sketchLastPoint.x, sketchLastPoint.y);
  sketchContext.lineTo(point.x, point.y);
  sketchContext.stroke();
  sketchContext.restore();
  sketchLastPoint = point;
}

function endSketchStroke(event) {
  if (!sketchDrawing) {
    return;
  }
  sketchDrawing = false;
  sketchLastPoint = null;
  if (event?.pointerId !== undefined) {
    sketchCanvas.releasePointerCapture?.(event.pointerId);
  }
}

function drawSketchDot(point) {
  if (!sketchContext || !point) {
    return;
  }
  sketchContext.save();
  sketchContext.globalCompositeOperation = sketchTool === "eraser" ? "destination-out" : "source-over";
  sketchContext.fillStyle = sketchColor;
  sketchContext.beginPath();
  sketchContext.arc(point.x, point.y, sketchTool === "eraser" ? 14 : 2.2, 0, Math.PI * 2);
  sketchContext.fill();
  sketchContext.restore();
}

function saveSketchEntry() {
  if (!sketchCanvas || !sketchHasInk) {
    alert("Noch keine Skizze vorhanden.");
    return;
  }
  pendingLiveSketchDataUrl = sketchCanvas.toDataURL("image/jpeg", 0.85);
  pendingLiveSketchCreatedAt = new Date().toISOString();
  session.pendingSketch = {
    dataUrl: pendingLiveSketchDataUrl,
    createdAt: pendingLiveSketchCreatedAt
  };
  session.updatedAt = new Date().toISOString();
  persistSession();
  closeSketchDialog();
  updateSaveState("Skizze für die nächste Beobachtung vorgemerkt");
}

function setToolsOpen(isOpen) {
  document.body.classList.toggle("tools-open", Boolean(isOpen));
  toolsToggleBtn?.setAttribute("aria-expanded", String(Boolean(isOpen)));
}

function bindLiveEvents() {
  if (!liveText) {
    return;
  }

  const quickPhases = ["Einstieg", "Arbeitsphase", "Sicherung"];
  quickPhases.forEach((phase) => {
    livePhase.insertAdjacentHTML("beforeend", `<option value="${phase}">${phase}</option>`);
  });
  (window.UFB_SOCIAL_FORMS ?? []).forEach((form) => {
    liveSocialForm.insertAdjacentHTML("beforeend", `<option value="${form}">${form}</option>`);
  });
  livePhase.value = "Arbeitsphase";
  liveSocialForm.value = "Plenum";
  renderLivePhaseButtons(quickPhases);
  manualItemSelect.innerHTML = `<option value="">Item manuell wählen</option>` + itemCatalog().map((item) =>
    `<option value="${item.id}">${item.id} ${item.shortLabel ?? item.label ?? item.exactText ?? ""}</option>`
  ).join("");

  [liveText, liveHintText, liveType, livePhase, liveSocialForm, liveMinute].filter(Boolean).forEach((input) => {
    input.addEventListener("input", updateLiveSuggestions);
    input.addEventListener("change", updateLiveSuggestions);
  });
  [liveText, liveHintText].filter(Boolean).forEach((textarea) => {
    textarea.addEventListener("focus", () => {
      activeLiveAssistField = textarea;
      scheduleLiveSmartHints();
    });
    textarea.addEventListener("keydown", handleLiveEnterSave);
  });
  livePanel?.addEventListener("keydown", (event) => {
    if (event.target === liveText || event.target === liveHintText) {
      return;
    }
    handleLiveEnterSave(event);
  }, true);
  manualItemSelect.addEventListener("change", () => {
    if (manualItemSelect.value) {
      cycleDraftLiveDecision(manualItemSelect.value, "positive");
      manualItemSelect.value = "";
      renderLiveSuggestions();
      focusLiveTextSoftly();
    }
  });
  saveLiveObservationBtn.addEventListener("click", saveRawObservation);
}

function handleLiveEnterSave(event) {
  if (event.key !== "Enter" || event.shiftKey || !liveText?.value.trim()) {
    return;
  }
  const target = event.target;
  if (target?.tagName === "SELECT" || target?.type === "file") {
    return;
  }
  if (target?.closest?.(".live-panel") || target === liveText || target === liveHintText) {
    event.preventDefault();
    event.stopPropagation();
    saveRawObservation();
  }
}

function focusLiveTextSoftly() {
  if (document.activeElement !== liveText) {
    liveText?.focus({ preventScroll: true });
  }
}

function renderLivePhaseButtons(phases = ["Einstieg", "Arbeitsphase", "Sicherung"]) {
  if (!livePhaseButtons) {
    return;
  }
  livePhaseButtons.innerHTML = phases.map((phase) => `
    <button class="mini-button ${phase === livePhase.value ? "active" : ""}" type="button" data-live-phase="${phase}">
      ${phase}
    </button>
  `).join("");
  livePhaseButtons.querySelectorAll("[data-live-phase]").forEach((button) => {
    button.addEventListener("click", () => {
      livePhase.value = button.dataset.livePhase;
      renderLivePhaseButtons(phases);
      updateLiveSuggestions();
    });
  });
}

function startLessonTiming() {
  const now = new Date();
  session.lessonTiming = {
    ...(session.lessonTiming ?? {}),
    startTime: now.toISOString(),
    endTime: null,
    durationMinutes: session.lessonTiming?.durationMinutes ?? 45,
    updatedAt: now.toISOString()
  };
  session.updatedAt = now.toISOString();
  persistSession();
  updateSaveState("Stundenbeginn gesetzt");
  render();
}

function endLessonTiming() {
  const now = new Date();
  const startTime = session.lessonTiming?.startTime
    ?? (session.rawObservations ?? []).slice().reverse().find((entry) => entry.timestamp)?.timestamp
    ?? now.toISOString();
  const durationMinutes = Math.max(1, Math.round((now.getTime() - new Date(startTime).getTime()) / 60000));
  session.lessonTiming = {
    ...(session.lessonTiming ?? {}),
    startTime,
    endTime: now.toISOString(),
    durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : (session.lessonTiming?.durationMinutes ?? 45),
    updatedAt: now.toISOString()
  };
  session.updatedAt = now.toISOString();
  persistSession();
  updateSaveState("Stundenende gesetzt");
  render();
}

function lessonTimingConfig() {
  const timing = session.lessonTiming;
  if (!timing?.startTime) {
    return null;
  }
  const start = new Date(timing.startTime).getTime();
  const end = timing.endTime ? new Date(timing.endTime).getTime() : NaN;
  const measuredDuration = Number.isFinite(end) && Number.isFinite(start) && end > start
    ? Math.round((end - start) / 60000)
    : null;
  return {
    startTime: timing.startTime,
    endTime: timing.endTime ?? null,
    durationMinutes: measuredDuration ?? timing.durationMinutes ?? 45
  };
}

function renderLessonTimingControls() {
  const timing = lessonTimingConfig();
  lessonStartBtn?.classList.toggle("active", Boolean(timing?.startTime && !timing?.endTime));
  lessonEndBtn?.classList.toggle("active", Boolean(timing?.endTime));
  if (!lessonTimingStatus) {
    return;
  }
  if (!timing?.startTime) {
    lessonTimingStatus.textContent = "Zeit offen";
    return;
  }
  const start = formatTime(timing.startTime);
  const end = timing.endTime ? formatTime(timing.endTime) : "läuft";
  lessonTimingStatus.textContent = `${start}–${end}`;
}

function renderLiveMode() {
  if (!liveTimestamp) {
    return;
  }
  liveTimestamp.textContent = new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
  renderLessonTimingControls();
  renderRawObservationList();
}

function currentLiveObservationDraft() {
  const timestamp = new Date().toISOString();
  const timing = lessonTimingConfig();
  const manualMinute = liveMinute ? Number.parseInt(liveMinute.value, 10) : NaN;
  const minuteInLesson = Number.isFinite(manualMinute)
    ? manualMinute
    : (timing ? window.getMinuteInLesson?.(timestamp, timing) ?? null : null);
  const input = {
    id: `raw-${Date.now()}`,
    type: liveType.value,
    text: liveText.value.trim(),
    hintText: liveHintText?.value.trim() ?? "",
    professionalHint: liveHintText?.value.trim() ?? "",
    phase: livePhase.value,
    socialForm: liveSocialForm.value,
    timestamp,
    minuteInLesson,
    lessonWindow: timing ? window.getLessonWindow?.(minuteInLesson, timing.durationMinutes) ?? null : null,
    decisions: draftLiveDecisions
  };
  return window.createLiveObservationEvent?.(input) ?? {
    ...input,
    decisions: { ...draftLiveDecisions },
    status: "open"
  };
}

function updateLiveSuggestions() {
  applyLiveInputShortcuts();
  const draft = currentLiveObservationDraft();
  if (!liveAnalysisText(draft)) {
    activeLiveSuggestions = [];
    draftLiveDecisions = {};
    clearLiveSmartHints();
    clearLiveSuggestionAnalysis();
    renderLiveSuggestions();
    return;
  }
  scheduleLiveSmartHints();
  scheduleLiveSuggestionAnalysis(360);
}

function scheduleLiveSuggestionAnalysis(delay = 360) {
  window.clearTimeout(liveSuggestionTimer);
  liveSuggestionTimer = window.setTimeout(() => {
    liveSuggestionTimer = null;
    runLiveSuggestionAnalysis();
  }, delay);
}

function clearLiveSuggestionAnalysis() {
  window.clearTimeout(liveSuggestionTimer);
  liveSuggestionTimer = null;
}

function runLiveSuggestionAnalysis() {
  const draft = currentLiveObservationDraft();
  if (!liveAnalysisText(draft)) {
    activeLiveSuggestions = [];
    renderLiveSuggestions();
    return;
  }
  const cacheKey = liveSuggestionAnalysisKey(draft);
  if (cacheKey && cacheKey === liveSuggestionCacheKey && liveSuggestionCacheResult) {
    activeLiveSuggestions = (liveSuggestionCacheResult.suggestions ?? []).slice(0, 3);
    renderLiveSuggestions(liveSuggestionCacheResult);
    return;
  }
  const result = window.analyzeLiveObservation?.(draft, recentObservationHistory(20)) ?? { suggestions: [], fallback: true };
  liveSuggestionCacheKey = cacheKey;
  liveSuggestionCacheResult = result;
  activeLiveSuggestions = (result.suggestions ?? []).slice(0, 3);
  renderLiveSuggestions(result);
}

function liveSuggestionAnalysisKey(draft) {
  return [
    liveAnalysisText(draft).toLowerCase().trim(),
    draft.type,
    draft.phase,
    draft.socialForm
  ].join("|");
}

function scheduleLiveSmartHints(delay = 240) {
  if (!liveSmartHints) {
    return;
  }
  window.clearTimeout(liveSmartHintTimer);
  liveSmartHintTimer = window.setTimeout(() => {
    liveSmartHintTimer = null;
    renderLiveSmartHints();
  }, delay);
}

function clearLiveSmartHints() {
  window.clearTimeout(liveSmartHintTimer);
  liveSmartHintTimer = null;
  if (liveSmartHints) {
    liveSmartHints.innerHTML = "";
  }
}

function liveAnalysisText(draft) {
  return [draft?.text, draft?.hintText, draft?.professionalHint]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(" ");
}

function recentObservationHistory(limit = 60) {
  return (session.rawObservations ?? []).slice(0, limit);
}

function applyLiveInputShortcuts() {
  if (liveShortcutLock) {
    return;
  }
  const text = liveText.value;
  const shortcut = socialFormShortcutFromText(text);
  if (shortcut && liveSocialForm.value !== shortcut) {
    liveSocialForm.value = shortcut;
  }
}

function socialFormShortcutFromText(text) {
  const mapping = {
    GA: "Gruppenarbeit",
    PA: "Partnerarbeit",
    EA: "Einzelarbeit",
    LV: "Lehrervortrag",
    PL: "Plenum",
    SP: "Schülerpräsentation"
  };
  const match = String(text ?? "").match(/(?:^|\s)(GA|PA|EA|LV|PL|SP)(?=$|\s|[,.!?;:])/i);
  return match ? mapping[match[1].toUpperCase()] : null;
}

function renderLiveSmartHints() {
  if (!liveSmartHints) {
    return;
  }
  const field = activeLiveAssistField ?? liveText;
  const text = field?.value.trim() ?? "";
  const quoteLikely = /["„“‚‘’']/.test(text) || /^[SL]\s*[:：]/i.test(text);
  const shortcut = socialFormShortcutFromText(text);
  const typeHint = quoteLikely ? `
    <span class="smart-hint-label">Zitat?</span>
    <button class="smart-hint-button" type="button" data-smart-type="student_quote">Schüler:in</button>
    <button class="smart-hint-button" type="button" data-smart-type="teacher_quote">Lehrer</button>
  ` : "";
  const socialHint = shortcut ? `<span class="smart-hint-pill">${escapeHtml(shortcut)}</span>` : "";
  const assist = buildInputAssistance(text);
  const correctionHints = assist.corrections.map((entry) =>
    `<button class="smart-hint-button correction" type="button" data-completion="${escapeHtml(entry.to)}" data-completion-mode="replace-word">Korrektur: ${escapeHtml(entry.to)}</button>`
  ).join("");
  const wordHints = assist.words.map((word) =>
    `<button class="smart-hint-button" type="button" data-completion="${escapeHtml(word)}" data-completion-mode="replace-word">${escapeHtml(word)}</button>`
  ).join("");
  const phraseHints = assist.phrases.map((phrase) =>
    `<button class="smart-hint-button phrase" type="button" data-completion="${escapeHtml(phrase)}" data-completion-mode="phrase">${escapeHtml(phrase)}</button>`
  ).join("");
  liveSmartHints.innerHTML = typeHint || socialHint || correctionHints || wordHints || phraseHints
    ? `${typeHint}${socialHint}${correctionHints}${wordHints}${phraseHints}`
    : "";
  liveSmartHints.querySelectorAll("[data-smart-type]").forEach((button) => {
    button.addEventListener("click", () => {
      liveType.value = button.dataset.smartType;
      updateLiveSuggestions();
    });
  });
  liveSmartHints.querySelectorAll("[data-completion]").forEach((button) => {
    button.addEventListener("click", () => {
      applyLiveCompletion(field, button.dataset.completion, button.dataset.completionMode);
    });
  });
}

function buildInputAssistance(text) {
  const tools = window.UFB_TEXT_NORMALIZATION;
  const prepared = tools?.prepareTextForHeuristic?.(text) ?? { tokens: String(text ?? "").split(/\s+/), corrections: [] };
  const currentWord = currentInputWord(text);
  const normalizedCurrent = tools?.normalizeTextForHeuristics?.(currentWord) ?? currentWord.toLowerCase();
  const lexicon = inputAssistanceLexicon();
  const corrections = (prepared.corrections ?? [])
    .filter((entry) => entry.from && entry.to && currentWord.toLowerCase().includes(String(entry.from).slice(0, 4)))
    .slice(0, 2);
  const words = normalizedCurrent.length >= 3
    ? lexicon.words
      .filter((word) => word.startsWith(normalizedCurrent) && word !== normalizedCurrent)
      .slice(0, 3)
    : [];
  const normalizedText = tools?.normalizeTextForHeuristics?.(text) ?? text.toLowerCase();
  const phrases = lexicon.phrases
    .filter((phrase) => {
      const normalizedPhrase = tools?.normalizeTextForHeuristics?.(phrase) ?? phrase.toLowerCase();
      return normalizedCurrent.length >= 3
        ? normalizedPhrase.includes(normalizedCurrent) && !normalizedText.includes(normalizedPhrase)
        : false;
    })
    .slice(0, 2);
  return { corrections, words, phrases };
}

function inputAssistanceLexicon() {
  const libraryKey = window.RESEARCH_PATTERN_LIBRARY_STATUS?.patternCount ?? 0;
  if (inputAssistanceCache?.key === libraryKey) {
    return inputAssistanceCache;
  }
  const tools = window.UFB_TEXT_NORMALIZATION;
  const words = new Set();
  const phrases = new Set([
    "Schüleridee wird nicht aufgegriffen.",
    "Der Denkweg wird nicht weitergeführt.",
    "Der Arbeitsauftrag bleibt unklar.",
    "Die Lehrkraft redet in die Unruhe hinein.",
    "Die Sicherung bleibt auf Ergebnisebene.",
    "Ein fachlich tragfähiger Beitrag wird nicht genutzt.",
    "Die Gruppe arbeitet organisatorisch, aber wenig sachbezogen.",
    "Die SuS können den Auftrag nicht erklären.",
    "Die Denkzeit wirkt zu knapp."
  ]);
  const addText = (text, asPhrase = false) => {
    const value = String(text ?? "").trim();
    if (!value) {
      return;
    }
    if (asPhrase && value.split(/\s+/).length >= 3 && value.length <= 120) {
      phrases.add(value);
    }
    const prepared = tools?.prepareTextForHeuristic?.(value) ?? { signalTokens: value.toLowerCase().split(/\s+/) };
    (prepared.signalTokens ?? []).forEach((token) => {
      if (token.length >= 5) {
        words.add(token);
      }
    });
  };
  itemCatalog().forEach((item) => {
    addText(item.exactText);
    addText(item.shortLabel);
    addText(item.manualCore, true);
    ["positiveMarkers", "developmentMarkers", "teacherPhrases", "studentPhrases", "mathSpecificMarkers"].forEach((key) => {
      (item[key] ?? []).forEach((entry) => addText(entry.pattern, true));
    });
  });
  (window.RESEARCH_PATTERN_LIBRARY?.patterns ?? []).forEach((pattern) => {
    (pattern.patternMarkers ?? []).forEach((marker) => addText(marker, true));
    (pattern.possiblePrompts ?? []).forEach((prompt) => addText(prompt, true));
  });
  inputAssistanceCache = {
    key: libraryKey,
    words: Array.from(words).sort((a, b) => a.length - b.length || a.localeCompare(b)),
    phrases: Array.from(phrases).sort((a, b) => a.length - b.length)
  };
  return inputAssistanceCache;
}

function currentInputWord(text) {
  const beforeCursor = String(text ?? "");
  const match = beforeCursor.match(/([\p{Letter}äöüÄÖÜß]{2,})$/u);
  return match?.[1] ?? "";
}

function applyLiveCompletion(field, completion, mode) {
  if (!field || !completion) {
    return;
  }
  const value = field.value;
  if (mode === "phrase") {
    field.value = value.trim() ? `${value.trim()} ${completion}` : completion;
  } else {
    field.value = value.replace(/([\p{Letter}äöüÄÖÜß]{2,})$/u, completion);
  }
  field.focus({ preventScroll: true });
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function renderLiveSuggestions(result = null) {
  if (!liveSuggestions) {
    return;
  }
  const hasAnalysisText = Boolean(liveAnalysisText(currentLiveObservationDraft()));
  const fallback = hasAnalysisText && (result?.fallback || !activeLiveSuggestions.length);
  const selectedIds = new Set(Object.keys(draftLiveDecisions ?? {}));
  const suggestions = mergeSuggestionsWithDecisions(activeLiveSuggestions, draftLiveDecisions);
  liveSuggestions.innerHTML = `
    <div class="suggestion-row">
      ${suggestions.map((suggestion) => {
        const decision = draftLiveDecisions?.[suggestion.item.id]?.valence ?? "neutral";
        return `
        <button class="suggestion-chip ${decisionClass(decision)} ${selectedIds.has(suggestion.item.id) ? "selected" : ""}" type="button" data-suggested-item="${suggestion.item.id}">
          <strong class="suggestion-item-text">${escapeHtml(suggestion.item.exactText ?? suggestion.item.label ?? suggestion.item.shortLabel ?? "")}</strong>
          <span class="suggestion-meta">${formatItemId(suggestion.item.id)} · ${escapeHtml(parentLabelForItem(suggestion.item))} · ${confidenceText(suggestion)} · ${decisionHint(decision, suggestion.tendency)}</span>
        </button>
      `;}).join("")}
      ${fallback ? `<span class="suggestion-empty">Keine starke mögliche Lesart. Du kannst speichern und später sortieren.</span>` : ""}
    </div>
  `;
  liveSuggestions.querySelectorAll("[data-suggested-item]").forEach((button) => {
    button.addEventListener("click", () => {
      cycleDraftLiveDecision(button.dataset.suggestedItem);
      renderLiveSuggestions(result);
      focusLiveTextSoftly();
    });
  });
}

function saveRawObservation() {
  const draft = currentLiveObservationDraft();
  if (!draft.text) {
    return;
  }
  clearLiveSuggestionAnalysis();
  const suggestionsForSave = activeLiveSuggestions.length
    ? activeLiveSuggestions
    : (liveSuggestionCacheResult?.suggestions ?? []);
  draft.suggestedItems = suggestionsForSave.slice(0, 3).map((suggestion) => ({
    id: suggestion.item.id,
    score: suggestion.score,
    confidence: suggestion.confidence,
    confidenceLabel: suggestion.confidenceLabel,
    tendency: suggestion.tendency,
    reasons: suggestion.reasons
  }));
  if (draft.type === "free") {
    Object.assign(draft, window.markFreeObservation?.(draft, "free") ?? { freeDecision: { valence: "free" }, status: "free" });
  }
  const pendingSketch = session.pendingSketch?.dataUrl
    ? session.pendingSketch
    : (pendingLiveSketchDataUrl ? { dataUrl: pendingLiveSketchDataUrl, createdAt: pendingLiveSketchCreatedAt } : null);
  if (pendingSketch?.dataUrl) {
    draft.sketchDataUrl = pendingSketch.dataUrl;
    draft.sketchImage = pendingSketch.dataUrl;
    draft.sketchCreatedAt = pendingSketch.createdAt ?? new Date().toISOString();
  }
  decorateLiveEventForLegacy(draft);
  session.rawObservations ??= [];
  session.rawObservations.unshift(draft);
  recentLiveSavedId = draft.id;
  if (pendingSketch?.dataUrl) {
    pendingLiveSketchDataUrl = "";
    pendingLiveSketchCreatedAt = null;
    delete session.pendingSketch;
    clearSketchCanvas();
  }
  selectedLiveItemIds.clear();
  activeLiveSuggestions = [];
  draftLiveDecisions = {};
  liveText.value = "";
  if (liveHintText) {
    liveHintText.value = "";
  }
  if (liveMinute) {
    liveMinute.value = "";
  }
  liveType.value = "observation";
  manualItemSelect.value = "";
  clearLiveSmartHints();
  persistSession();
  render();
  queueLivePostAnalysis(draft.id, 280);
  window.setTimeout(() => {
    if (recentLiveSavedId === draft.id) {
      recentLiveSavedId = null;
      renderRawObservationList();
    }
  }, 1500);
}

function queueLivePostAnalysis(eventId, delay = 240) {
  if (!eventId) {
    return;
  }
  const jobId = `live-post:${eventId}`;
  if (window.analysisJobQueue?.enqueue) {
    window.analysisJobQueue.enqueue(jobId, () => runLivePostAnalysis(eventId), { delay });
    return;
  }
  window.setTimeout(() => runLivePostAnalysis(eventId), delay);
}

function runLivePostAnalysis(eventId) {
  const event = liveEventById(eventId);
  if (!event || event.excluded || event.type === "sketch" || event.postAnalysis?.ignored) {
    return;
  }
  const analysis = window.analyzeLiveObservation?.(event, recentObservationHistory(80)) ?? { allScores: [] };
  const alreadyShown = new Set([
    ...(event.suggestedItems ?? []).map((entry) => entry.id),
    ...Object.keys(event.decisions ?? {})
  ]);
  const additions = (analysis.allScores ?? [])
    .filter((entry) => entry?.item?.id && !alreadyShown.has(entry.item.id))
    .filter((entry) => Number(entry.score ?? 0) >= 4.2 || postAnalysisTextSignal(entry) >= 2.4)
    .slice(0, 3)
    .map(suggestionSnapshot);
  if (!additions.length) {
    return;
  }
  event.postAnalysis = {
    status: "new",
    suggestions: additions,
    updatedAt: new Date().toISOString()
  };
  persistSession();
  if (currentView === "observe") {
    renderRawObservationList();
  }
}

function postAnalysisTextSignal(entry) {
  return (entry.reasons ?? [])
    .filter((reasonEntry) => !["phase", "socialForm", "recurrence", "time"].includes(reasonEntry.type))
    .reduce((sum, reasonEntry) => sum + Math.max(0, Number(reasonEntry.weight) || 0), 0);
}

function suggestionSnapshot(entry) {
  return {
    id: entry.item.id,
    score: entry.score,
    confidence: entry.confidence,
    confidenceLabel: entry.confidenceLabel,
    tendency: entry.tendency,
    reasons: entry.reasons,
    item: {
      id: entry.item.id,
      parentId: entry.item.parentId,
      label: entry.item.label,
      shortLabel: entry.item.shortLabel,
      exactText: entry.item.exactText
    }
  };
}

function renderRawObservationList() {
  if (!rawObservationList) {
    return;
  }
  const observations = (session.rawObservations ?? []).slice(0, 60);
  if (observations.length && !observations.some((observation) => observation.id === expandedLiveEventId)) {
    expandedLiveEventId = observations[0].id;
  }
  const selected = observations.find((observation) => observation.id === expandedLiveEventId) ?? null;
  rawObservationList.style.setProperty("--raw-log-width", `${Math.max(28, Math.min(62, rawLogbookSplitWidth))}%`);
  rawObservationList.innerHTML = observations.length
    ? `
      <div class="raw-split">
        <div class="raw-logbook-column" aria-label="Live-Logbuch">
          ${observations.map(renderRawObservationCard).join("")}
        </div>
        <div class="raw-splitter" role="separator" aria-orientation="vertical" tabindex="0" title="Trennstelle ziehen" data-raw-splitter></div>
        <aside class="raw-item-inspector" aria-label="Itemprüfung">
          ${selected ? renderRawObservationInspector(selected) : `<p class="empty-state">Logbucheintrag antippen.</p>`}
        </aside>
      </div>
    `
    : `<p class="empty-state">Noch keine Live-Beobachtung gespeichert.</p>`;

  rawObservationList.querySelectorAll(".raw-observation").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button, select")) {
        return;
      }
      expandedLiveEventId = card.dataset.liveId;
      renderRawObservationListKeepScroll();
    });
  });

  rawObservationList.querySelectorAll("[data-live-card-chip]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      updateLiveObservationDecision(button.dataset.liveId, button.dataset.liveCardChip);
    });
  });

  rawObservationList.querySelectorAll("[data-live-post-star]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      expandedLiveEventId = button.dataset.livePostStar;
      const liveEvent = liveEventById(button.dataset.livePostStar);
      if (liveEvent?.postAnalysis) {
        liveEvent.postAnalysis.status = "seen";
        persistSession();
      }
      renderRawObservationListKeepScroll();
    });
  });

  rawObservationList.querySelectorAll("[data-live-quick-valence]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const { liveId, itemId, valence } = button.dataset;
      if (itemId) {
        updateLiveObservationDecision(liveId, itemId, valence);
      } else {
        setManualEventValence(liveId, valence);
      }
    });
  });

  rawObservationList.querySelectorAll("[data-live-manual-valence]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      setManualEventValence(button.dataset.liveManualValence, button.dataset.manualValence);
    });
  });

  bindRawSplitResize();
}

function renderRawObservationCard(observation) {
  const status = liveEventStatusInfo(observation);
  const isExpanded = expandedLiveEventId === observation.id;
  const postSuggestions = compactPostAnalysisSuggestions(observation);
  const sketchImage = observation.sketchDataUrl ?? observation.sketchImage ?? "";
  return `
    <article class="raw-observation ${status.className} ${isExpanded ? "selected" : ""} ${recentLiveSavedId === observation.id ? "just-saved" : ""}" data-live-id="${observation.id}" title="Antippen zum Prüfen">
      ${postSuggestions.length ? `<button class="raw-post-star ${observation.postAnalysis?.status === "seen" ? "seen" : ""}" type="button" data-live-post-star="${observation.id}" aria-label="Neue mögliche Lesart">★</button>` : ""}
      <div class="raw-time">${formatTime(observation.timestamp)}</div>
      <div class="raw-main">
        <strong>${typeLabel(observation.type)} · ${escapeHtml(observation.phase ?? "ohne Phase")} · ${escapeHtml(observation.socialForm ?? "ohne Sozialform")}</strong>
        <p>${escapeHtml(observation.text)}</p>
        ${sketchImage ? `<img class="raw-sketch-thumb compact" src="${escapeHtml(sketchImage)}" alt="Skizze">` : ""}
        <small>${status.label}</small>
      </div>
      <div class="raw-status-dot" aria-hidden="true"></div>
      </article>
  `;
}

function renderQuickRateButtons(observation) {
  const suggestions = compactLiveEventSuggestions(observation);
  const topItem = suggestions[0]?.item ?? null;
  const itemAttr = topItem ? `data-item-id="${topItem.id}"` : "";
  const label = topItem ? escapeHtml(topItem.shortLabel ?? topItem.exactText ?? topItem.id) : "direkt";
  return `
    <div class="raw-quick-rate" role="group" aria-label="Schnellbewertung">
      <button class="mini-button" type="button" style="--mini-color:#42a51f"
        data-live-quick-valence data-live-id="${observation.id}" ${itemAttr} data-valence="positive">
        grün${topItem ? ` · ${label}` : ""}
      </button>
      <button class="mini-button" type="button" style="--mini-color:#1f6fb8"
        data-live-quick-valence data-live-id="${observation.id}" ${itemAttr} data-valence="development">
        blau${topItem ? ` · ${label}` : ""}
      </button>
    </div>`;
}

function renderRawObservationInspector(observation) {
  const suggested = compactLiveEventSuggestions(observation);
  const postSuggestions = compactPostAnalysisSuggestions(observation);
  const suggestedIds = new Set(suggested.map((suggestion) => suggestion.item.id));
  const additionalSuggestions = postSuggestions.filter((suggestion) => !suggestedIds.has(suggestion.item.id));
  const hintText = observation.hintText ?? observation.professionalHint ?? "";
  const sketchImage = observation.sketchDataUrl ?? observation.sketchImage ?? "";
  const status = liveEventStatusInfo(observation);
  const topItem = suggested[0]?.item ?? additionalSuggestions[0]?.item ?? null;
  const topItemAttr = topItem ? `data-item-id="${topItem.id}"` : "";
  const isPositive = status.className === "positive";
  const isDevelopment = status.className === "development";
  const hasValence = isPositive || isDevelopment;
  return `
    <div class="raw-inspector-header">
      <span>${formatTime(observation.timestamp)} · ${typeLabel(observation.type)}</span>
      <strong>${escapeHtml(observation.text)}</strong>
    </div>
    <div class="raw-valence-bar">
      <button class="mini-button ${isPositive ? "active" : ""}" type="button"
        style="--mini-color:#42a51f"
        data-live-quick-valence data-live-id="${observation.id}" data-valence="positive"
        title="Als lerntragend markieren">grün – lerntragend</button>
      <button class="mini-button ${isDevelopment ? "active" : ""}" type="button"
        style="--mini-color:#1f6fb8"
        data-live-quick-valence data-live-id="${observation.id}" data-valence="development"
        title="Als Entwicklungspotenzial markieren">blau – Entwicklungspotenzial</button>
      ${hasValence ? `<button class="mini-button" type="button"
        data-live-manual-valence="${observation.id}" data-manual-valence="neutral"
        title="Bewertung zurücksetzen">✕ zurücksetzen</button>` : ""}
    </div>
    ${hintText ? `
      <div class="raw-hint">
        <strong>Tipps / Hinweise / Impulse</strong>
        <p>${escapeHtml(hintText)}</p>
      </div>
    ` : ""}
    ${sketchImage ? `<img class="raw-sketch-thumb" src="${escapeHtml(sketchImage)}" alt="Skizze">` : ""}
    <div class="raw-item-column">
      <section class="raw-item-section">
        <h4>Items bisher</h4>
        <div class="suggestion-row">
          ${suggested.length
            ? suggested.map((suggestion) => renderRawSuggestionChip(observation, suggestion)).join("")
            : `<span class="suggestion-empty">Noch kein Item bestätigt oder vorgeschlagen.</span>`}
        </div>
      </section>
      <section class="raw-item-section raw-post-analysis">
        <h4>Zusätzliche mögliche Bezüge</h4>
        <div class="suggestion-row">
          ${additionalSuggestions.length
            ? additionalSuggestions.map((suggestion) => renderRawSuggestionChip(observation, suggestion, "post")).join("")
            : `<span class="suggestion-empty">Keine weiteren Bezüge offen.</span>`}
        </div>
      </section>
    </div>
  `;
}

function bindRawSplitResize() {
  const splitter = rawObservationList.querySelector("[data-raw-splitter]");
  const split = rawObservationList.querySelector(".raw-split");
  if (!splitter || !split) {
    return;
  }
  splitter.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    splitter.setPointerCapture?.(event.pointerId);
    split.classList.add("resizing");
    const move = (moveEvent) => {
      const rect = split.getBoundingClientRect();
      const percent = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      rawLogbookSplitWidth = Math.max(28, Math.min(62, percent));
      rawObservationList.style.setProperty("--raw-log-width", `${rawLogbookSplitWidth}%`);
    };
    const up = () => {
      split.classList.remove("resizing");
      window.localStorage?.setItem("ufbRawLogSplitWidth", String(Math.round(rawLogbookSplitWidth)));
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  });
}

function renderRawSuggestionChip(observation, suggestion, extraClass = "") {
  const decision = observation.decisions?.[suggestion.item.id]?.valence ?? "neutral";
  return `
    <button class="suggestion-chip live-card-chip ${extraClass} ${decisionClass(decision)}" type="button" data-live-id="${observation.id}" data-live-card-chip="${suggestion.item.id}">
      <strong class="suggestion-item-text">${escapeHtml(suggestion.item.exactText ?? suggestion.item.label ?? suggestion.item.shortLabel ?? "")}</strong>
      <span class="suggestion-meta">${formatItemId(suggestion.item.id)} · ${escapeHtml(parentLabelForItem(suggestion.item))} · ${confidenceText(suggestion)} · ${decisionHint(decision, suggestion.tendency)}</span>
    </button>
  `;
}

function compactLiveEventSuggestions(observation) {
  if (observation.suggestedItems?.length) {
    return mergeSuggestionsWithDecisions(observation.suggestedItems.slice(0, 3), observation.decisions ?? {});
  }
  const analyzed = window.analyzeLiveObservation?.(observation, recentObservationHistory(60)) ?? { suggestions: [] };
  observation.suggestedItems = (analyzed.suggestions ?? []).slice(0, 3).map((suggestion) => ({
    id: suggestion.item.id,
    score: suggestion.score,
    confidence: suggestion.confidence,
    confidenceLabel: suggestion.confidenceLabel,
    tendency: suggestion.tendency,
    reasons: suggestion.reasons
  }));
  return mergeSuggestionsWithDecisions(observation.suggestedItems, observation.decisions ?? {});
}

function compactPostAnalysisSuggestions(observation) {
  if (observation.postAnalysis?.ignored) {
    return [];
  }
  return (observation.postAnalysis?.suggestions ?? [])
    .map((suggestion) => {
      const item = itemByHeuristicId(suggestion.id ?? suggestion.item?.id) ?? suggestion.item ?? {};
      return {
        ...suggestion,
        item: {
          id: item.id ?? suggestion.id,
          parentId: item.parentId ?? suggestion.item?.parentId,
          label: item.label ?? item.shortLabel ?? suggestion.item?.label,
          shortLabel: item.shortLabel ?? suggestion.item?.shortLabel,
          exactText: item.exactText ?? suggestion.item?.exactText
        }
      };
    })
    .filter((suggestion) => suggestion.item.id)
    .slice(0, 3);
}

function cycleDraftLiveDecision(itemId, forcedValence = null) {
  const current = draftLiveDecisions?.[itemId]?.valence ?? "neutral";
  const nextValence = forcedValence ?? nextTapValence(current);
  draftLiveDecisions = setDecisionOnMap(draftLiveDecisions, itemId, nextValence);
}

function updateLiveObservationDecision(eventId, itemId, forcedValence = null) {
  const event = liveEventById(eventId);
  if (!event) {
    return;
  }
  const current = event.decisions?.[itemId]?.valence ?? "neutral";
  const nextValence = forcedValence ?? nextTapValence(current);
  event.excluded = false;
  event.decisions = setDecisionOnMap(event.decisions ?? {}, itemId, nextValence);
  event.status = liveEventStatusInfo(event).status;
  decorateLiveEventForLegacy(event);
  rememberLiveDecision(event);
  session.updatedAt = new Date().toISOString();
  persistSession();
  renderLiveDecisionInPlace();
}

function renderLiveDecisionInPlace() {
  const split = rawObservationList?.querySelector(".raw-split");
  const logbookScroll = split?.querySelector(".raw-logbook-column")?.scrollTop ?? 0;
  const inspectorScroll = split?.querySelector(".raw-item-inspector")?.scrollTop ?? 0;
  renderRawObservationList();
  split?.querySelector(".raw-logbook-column")?.scrollTo({ top: logbookScroll, behavior: "instant" });
  split?.querySelector(".raw-item-inspector")?.scrollTo({ top: inspectorScroll, behavior: "instant" });
  if (detailOpen) {
    renderDetailPanel();
  }
}

function renderRawObservationListKeepScroll() {
  const logbookScroll = rawObservationList?.querySelector(".raw-logbook-column")?.scrollTop ?? 0;
  renderRawObservationList();
  rawObservationList?.querySelector(".raw-logbook-column")?.scrollTo({ top: logbookScroll, behavior: "instant" });
}

function excludeLiveObservation(eventId) {
  const event = liveEventById(eventId);
  if (!event) {
    return;
  }
  event.excluded = true;
  event.status = "excluded";
  decorateLiveEventForLegacy(event);
  session.updatedAt = new Date().toISOString();
  persistSession();
  render();
}

function markLiveObservationFree(eventId) {
  const event = liveEventById(eventId);
  if (!event) {
    return;
  }
  Object.assign(event, window.markFreeObservation?.(event, "free") ?? { freeDecision: { valence: "free" }, status: "free", decisions: {} });
  decorateLiveEventForLegacy(event);
  session.updatedAt = new Date().toISOString();
  persistSession();
  render();
}

function setManualEventValence(eventId, valence) {
  const event = liveEventById(eventId);
  if (!event) {
    return;
  }
  if (!valence || valence === "neutral") {
    delete event.manualValence;
  } else {
    event.manualValence = valence;
  }
  decorateLiveEventForLegacy(event);
  session.updatedAt = new Date().toISOString();
  persistSession();
  renderLiveDecisionInPlace();
}

function liveEventById(eventId) {
  return (session.rawObservations ?? []).find((observation) => observation.id === eventId);
}

function nextTapValence(current) {
  if (current === "positive") {
    return "development";
  }
  if (current === "development") {
    return "neutral";
  }
  return "positive";
}

function setDecisionOnMap(map, itemId, valence) {
  const next = { ...(map ?? {}) };
  if (!valence || valence === "neutral" || valence === "none") {
    delete next[itemId];
    return next;
  }
  next[itemId] = {
    itemId,
    tapCount: valence === "development" ? 2 : valence === "excluded" ? 3 : 1,
    status: valence,
    valence,
    strength: valence === "development" || valence === "positive" ? 1 : 0,
    updatedAt: new Date().toISOString()
  };
  return next;
}

function mergeSuggestionsWithDecisions(suggestions = [], decisions = {}) {
  const byId = new Map();
  suggestions.forEach((suggestion) => {
    const itemId = suggestion.item?.id ?? suggestion.id;
    const item = suggestion.item ?? itemByHeuristicId(itemId) ?? {};
    if (itemId) {
      byId.set(itemId, {
        ...suggestion,
        item: {
          id: itemId,
          label: item.shortLabel ?? item.label ?? item.exactText ?? itemId,
          shortLabel: item.shortLabel ?? item.label ?? itemId,
          exactText: item.exactText ?? ""
        }
      });
    }
  });
  Object.keys(decisions ?? {}).forEach((itemId) => {
    if (!byId.has(itemId)) {
      const item = itemByHeuristicId(itemId);
      byId.set(itemId, {
        item: {
          id: itemId,
          label: item?.shortLabel ?? item?.label ?? item?.exactText ?? itemId,
          shortLabel: item?.shortLabel ?? itemId,
          exactText: item?.exactText ?? ""
        },
        score: 0,
        confidence: 0,
        tendency: "neutral",
        reasons: []
      });
    }
  });
  const decisionCount = Object.keys(decisions ?? {}).length;
  return Array.from(byId.values())
    .sort((a, b) =>
      Number(Boolean(decisions?.[b.item.id])) - Number(Boolean(decisions?.[a.item.id]))
      || (b.score ?? 0) - (a.score ?? 0)
    )
    .slice(0, Math.max(5, decisionCount));
}

function decorateLiveEventForLegacy(event) {
  const decisions = Object.values(event.decisions ?? {}).filter((decision) => ["positive", "development"].includes(decision.valence));
  event.confirmedItemIds = decisions.map((decision) => decision.itemId);
  event.valence = decisions.some((decision) => decision.valence === "development") ? "development"
    : decisions.some((decision) => decision.valence === "positive") ? "positive"
      : event.freeDecision ? "free"
        : event.excluded ? "excluded"
          : event.manualValence ?? "neutral";
}

function rememberLiveDecision(event) {
  if (!window.rememberEventDecisions) {
    return;
  }
  session.learningProfile = window.rememberEventDecisions(session.learningProfile ?? {}, event);
}

function liveEventStatusInfo(event) {
  if (event.excluded || event.status === "excluded" || event.valence === "excluded") {
    return { status: "excluded", className: "excluded", label: "ausgeblendet / nicht für Verdichtung" };
  }
  if (event.type === "sketch") {
    return { status: "free", className: "free sketch", label: "Skizze / freie fachliche Beobachtung" };
  }
  const decisions = Object.values(event.decisions ?? {});
  const development = decisions.filter((decision) => decision.valence === "development").length;
  const positive = decisions.filter((decision) => decision.valence === "positive").length;
  if (development) {
    return { status: "confirmed", className: "development", label: `${development}x entwicklungsrelevant${positive ? ` · ${positive}x lerntragend` : ""}` };
  }
  if (positive) {
    return { status: "confirmed", className: "positive", label: `${positive}x lerntragend bestätigt` };
  }
  if (event.freeDecision || event.type === "free" || event.valence === "free") {
    return { status: "free", className: "free", label: "freie fachliche Beobachtung" };
  }
  if (event.manualValence === "positive") {
    return { status: "confirmed", className: "positive", label: "direkt bewertet: lerntragend" };
  }
  if (event.manualValence === "development") {
    return { status: "confirmed", className: "development", label: "direkt bewertet: Entwicklungspotenzial" };
  }
  return { status: "open", className: "neutral", label: "offen: später sortieren" };
}

function decisionClass(valence) {
  return {
    positive: "decision-positive",
    development: "decision-development",
    excluded: "decision-excluded",
    neutral: ""
  }[valence] ?? "";
}

function decisionHint(decision, tendency) {
  if (decision === "positive") {
    return "1x grün";
  }
  if (decision === "development") {
    return "2x blau";
  }
  return tendencyLabel(tendency);
}

function confidenceText(suggestion) {
  const confidence = Number(suggestion.confidence ?? 0);
  if (confidence > 0) {
    return `${confidence}% ${suggestion.confidenceLabel ?? ""}`.trim();
  }
  const score = Number(suggestion.score ?? 0);
  return score > 0 ? `Score ${score.toFixed(1)}` : "manuell";
}

function itemCatalog() {
  return window.UFB_ITEM_HEURISTICS ?? subcategories.flatMap((subcategory) =>
    subcategory.items.map((text, index) => ({
      id: `${subcategory.id.replace("-", ".")}.${index + 1}`,
      parentId: subcategory.id.replace("-", "."),
      shortLabel: `${subcategory.title} ${index + 1}`,
      exactText: text
    }))
  );
}

function itemByHeuristicId(itemId) {
  return itemCatalog().find((item) => item.id === itemId);
}

function parentLabelForItem(item) {
  const parentId = String(item?.parentId ?? item?.id ?? "").split(".").slice(0, 2).join(".");
  const subcategory = subcategories.find((candidate) => candidate.id.replace("-", ".") === parentId);
  return subcategory?.title ?? parentId ?? "";
}

function tendencyLabel(tendency) {
  return {
    positive: "eher lerntragend?",
    development: "eher Entwicklungspotenzial?",
    neutral: "unklar"
  }[tendency] ?? "unklar";
}

function typeLabel(type) {
  return {
    observation: "Beobachtung",
    student_quote: "Schülerzitat",
    teacher_quote: "Lehrerzitat",
    free: "freie Beobachtung",
    sketch: "Skizze"
  }[type] ?? "Beobachtung";
}

function formatItemId(id) {
  return String(id ?? "").replace("-", ".");
}

function createEmptySession() {
  const observations = {};
  subcategories.forEach((subcategory) => {
    subcategory.items.forEach((_, index) => {
      observations[itemKey(subcategory.id, index)] = 0;
    });
  });

  return {
    version: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    observationInfo: {
      date: todayInputDate(),
      place: "",
      name: "",
      group: ""
    },
    observations,
    cardMeta: {},
    rawObservations: [],
    lessonTiming: null,
    condensationCards: {},
    customCards: [],
    logbook: [],
    pendingSketch: null,
    hiddenSyntheses: [],
    synthesisRequested: false
  };
}

function render() {
  renderViewShell();
  renderObservationInfo();
  renderLiveMode();
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
  renderLogbook();
  renderDiscussion();
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
    .map((_, index) => visualItemValue(itemKey(subcategory.id, index)))
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
  const isLogbook = currentView === "logbook";
  const isEvaluate = currentView === "evaluate";
  const showObserveWorkspace = isObserve || isLogbook;
  observeView.classList.toggle("hidden", !showObserveWorkspace);
  observeView.classList.toggle("with-logbook", isLogbook);
  observeView.classList.toggle("live-focus", isObserve);
  observeView.classList.toggle("logbook-focus", isLogbook);
  observeView.classList.toggle("chart-open", chartOverlayOpen && isObserve);
  logbookView.classList.toggle("hidden", !isLogbook);
  evaluateView.classList.toggle("hidden", !isEvaluate);
  protocolView.classList.toggle("hidden", currentView !== "protocol");
  observeTab.classList.toggle("active", isObserve || isLogbook);
  logbookTab.classList.toggle("active", isLogbook);
  evaluateTab.classList.toggle("active", isEvaluate);
  protocolTab.classList.toggle("active", currentView === "protocol");
  observeView.classList.toggle("with-detail", detailOpen);
  toggleChartBtn?.classList.toggle("active", chartOverlayOpen && isObserve);
  toggleChartBtn?.setAttribute("aria-expanded", String(chartOverlayOpen && isObserve));
}

function renderObservationInfo() {
  const info = normalizedObservationInfo(session.observationInfo);
  observationDate.value = info.date;
  observationPlace.value = info.place;
  observationName.value = info.name;
  observationGroup.value = info.group;
}

function readObservationInfo() {
  return normalizedObservationInfo({
    date: observationDate.value,
    place: observationPlace.value,
    name: observationName.value,
    group: observationGroup.value
  });
}

function normalizedObservationInfo(info = {}) {
  return {
    date: info.date || todayInputDate(),
    place: info.place || "",
    name: info.name || "",
    group: info.group || ""
  };
}

function todayInputDate() {
  const date = new Date();
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().slice(0, 10);
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
      const wasGray = previousValue === 0 && nextValue !== 0;
      itemMoveSnapshot = wasGray ? captureItemPositions() : null;
      session.observations[key] = nextValue;
      recentlySortedKey = wasGray ? key : null;
      session.updatedAt = new Date().toISOString();
      persistSession();
      render();
      if (wasGray) {
        openObservationNote(key);
      }
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
  const noteText = observationNoteText.value.trim();
  cardMeta(activeObservationNoteKey).observationNote = noteText;
  if (!cardMeta(activeObservationNoteKey).note?.trim()) {
    cardMeta(activeObservationNoteKey).note = noteText;
  }
  addSpiderNoteToLogbook(activeObservationNoteKey, noteText);
  persistSession();
  closeObservationNote();
  render();
}

function addSpiderNoteToLogbook(itemKey, noteText) {
  const heuristicId = itemKeyToHeuristicId(itemKey);
  if (!heuristicId || !itemByKey(itemKey)) {
    return;
  }
  session.rawObservations ??= [];
  session.rawObservations = session.rawObservations.filter(
    (obs) => !(obs.source === "spider" && obs.decisions?.[heuristicId])
  );
  if (!noteText) {
    return;
  }
  const scaleValue = session.observations[itemKey] ?? 0;
  const valence = scaleValue >= 3 ? "development" : "positive";
  const event = {
    id: `spider-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: "observation",
    source: "spider",
    text: noteText,
    phase: livePhase?.value ?? "ohne Phase",
    socialForm: liveSocialForm?.value ?? "Plenum",
    timestamp: new Date().toISOString(),
    decisions: {
      [heuristicId]: {
        itemId: heuristicId,
        tapCount: valence === "development" ? 2 : 1,
        status: valence,
        valence,
        strength: 1,
        updatedAt: new Date().toISOString()
      }
    },
    status: "confirmed"
  };
  decorateLiveEventForLegacy(event);
  session.rawObservations.unshift(event);
  queueLivePostAnalysis(event.id, 500);
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
      value: visualItemValue(itemKey(subcategory.id, index))
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
  const manualValue = session.observations[key] ?? 0;
  const liveStats = liveDecisionStatsForItemKey(key);
  const value = manualValue || liveStats.visualValue;
  const state = states[value];
  const meta = cardMeta(key);
  const sortedClass = key === recentlySortedKey ? "just-sorted" : "";
  const liveClass = !manualValue && liveStats.total ? "from-logbook" : "";
  const liveLabel = !manualValue && liveStats.total
    ? `<span class="item-live-badge">${liveStats.positive ? `${liveStats.positive}x grün` : ""}${liveStats.positive && liveStats.development ? " · " : ""}${liveStats.development ? `${liveStats.development}x blau` : ""}</span>`
    : "";
  return `
    <article class="item-card ${state.className} ${liveClass} ${sortedClass} ${meta.observationNote ? "has-note" : ""}" data-key="${key}" title="Für Beobachtungsnotiz antippen">
      <p class="item-title">${item}${liveLabel}</p>
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

function renderCondensationMode() {
  const board = getPhase2Board({ includeOpen: true });

  if (!board) {
    renderLegacyCondensationMode();
    return;
  }

  const visibleSections = board.sections.map((section) => ({
    ...section,
    cards: section.cards.filter((card) => !cardMeta(card.id).hidden && !cardMeta(card.id).archived)
  }));

  synthesisCards.innerHTML = `
    <div class="condense-summary">
      ${visibleSections.map((section) => `<span>${section.cards.length} ${escapeHtml(section.title)}</span>`).join("")}
    </div>
  `;
  evidenceCards.innerHTML = renderPhase2Section(visibleSections.find((section) => section.id === "positive"))
    + renderPhase2Section(visibleSections.find((section) => section.id === "mixed"));
  developmentCards.innerHTML = renderPhase2Section(visibleSections.find((section) => section.id === "development"))
    + renderPhase2Section(visibleSections.find((section) => section.id === "free"))
    + renderPhase2Section(visibleSections.find((section) => section.id === "open"));
  hiddenStack.innerHTML = renderHiddenPhase2Stack(board.cards);
  bindPhase2Actions();
}

function renderLegacyCondensationMode() {
  const clusters = buildCondensationClusters();
  const evidence = clusters.filter((cluster) => cluster.valence === "positive");
  const development = clusters.filter((cluster) => cluster.valence === "development");
  const neutral = clusters.filter((cluster) => cluster.valence === "neutral");
  const free = clusters.filter((cluster) => cluster.valence === "free");

  synthesisCards.innerHTML = `
    <div class="condense-summary">
      <span>${evidence.length} lerntragende Muster</span>
      <span>${development.length} entwicklungsrelevante Muster</span>
      <span>${neutral.length} unsicher</span>
      <span>${free.length} frei</span>
    </div>
  `;
  evidenceCards.innerHTML = renderCondensationSection(evidence, "Noch keine bestätigten lerntragenden Wirkungen.")
    + renderCondensationSection(neutral, "Keine unsicheren Beobachtungen.", "Unsichere Beobachtungen");
  developmentCards.innerHTML = renderCondensationSection(development, "Noch keine bestätigten entwicklungsrelevanten Wirkungen.")
    + renderCondensationSection(free, "Keine freien professionellen Beobachtungen.", "Freie professionelle Beobachtungen");
  hiddenStack.innerHTML = "";
  bindCondensationActions();
}

function renderPhase2Section(section) {
  if (!section) {
    return "";
  }
  const primarySection = section.id === "positive" || section.id === "development";
  if (!section.cards.length) {
    return `${primarySection ? "" : `<h3 class="cluster-section-heading">${escapeHtml(section.title)}</h3>`}<p class="empty-state">${escapeHtml(section.emptyText)}</p>`;
  }
  return `
    ${primarySection ? "" : `<h3 class="cluster-section-heading">${escapeHtml(section.title)}</h3>`}
    <div class="phase2-card-flow">
      ${section.cards.map(renderPhase2Card).join("")}
    </div>
  `;
}

function evidenceSketchImage(entry) {
  return entry?.sketchDataUrl ?? entry?.sketchImage ?? "";
}

function renderEvidenceSketch(entry, className = "evidence-sketch-thumb") {
  const sketchImage = evidenceSketchImage(entry);
  return sketchImage
    ? `<img class="${className}" src="${escapeHtml(sketchImage)}" alt="Skizze zur Beobachtung">`
    : "";
}

function renderPhase2Card(card) {
  const meta = cardMeta(card.id);
  const evidence = (card.evidence ?? []).slice(0, 2);
  const direction = sectionForPhase2Card(card);
  return `
    <article class="phase2-card ${direction} ${meta.focus ? "focus" : ""} ${meta.relevant ? "relevant" : ""}" data-phase2-id="${escapeHtml(card.id)}">
      <button class="phase2-archive" type="button" data-phase2-action="archive" data-phase2-id="${escapeHtml(card.id)}" aria-label="Karte ausblenden">×</button>
      <div class="phase2-topline">
        <strong>${escapeHtml(card.title)}</strong>
        <span>${Math.round(card.priority ?? 0)}</span>
      </div>
      <p>${escapeHtml(card.statement ?? "")}</p>
      ${card.impulse ? `<p class="phase2-impulse">${escapeHtml(card.impulse)}</p>` : ""}
      <div class="phase2-detail">
        ${evidence.map((entry) => `<blockquote>${escapeHtml(entry.text ?? "")}${renderEvidenceSketch(entry)}</blockquote>`).join("")}
        <small>${escapeHtml((card.itemIds ?? []).join(" · "))} · ${escapeHtml((card.phases ?? []).join(", ") || "ohne Phase")}</small>
      </div>
      <div class="card-actions inline-actions">
        <button type="button" class="${meta.focus ? "active" : ""}" data-phase2-action="focus" data-phase2-id="${escapeHtml(card.id)}">Fokus</button>
        <button type="button" class="${meta.relevant ? "active" : ""}" data-phase2-action="relevant" data-phase2-id="${escapeHtml(card.id)}">Gesprächsrelevant</button>
      </div>
    </article>
  `;
}

function getPhase2Board(options = {}) {
  const includeOpen = options.includeOpen !== false;
  const timing = lessonTimingConfig();
  const cacheKey = JSON.stringify({
    includeOpen,
    updatedAt: session.updatedAt,
    rawCount: session.rawObservations?.length ?? 0,
    timingStart: timing?.startTime ?? "",
    timingEnd: timing?.endTime ?? ""
  });
  if (cacheKey === phase2CacheKey && phase2CacheBoard) {
    return phase2CacheBoard;
  }
  const phase2Observations = window.toPhase2Observations?.(session.rawObservations ?? [], { includeOpen }) ?? [];
  phase2CacheBoard = window.createPhase2Board?.(phase2Observations, {
    timing,
    sectionLimits: {
      positive: 10,
      development: 10,
      mixed: 6,
      free: 6,
      open: 8
    }
  }) ?? null;
  phase2CacheKey = cacheKey;
  return phase2CacheBoard;
}

function renderHiddenPhase2Stack(cards) {
  const hidden = cards.filter((card) => cardMeta(card.id).archived || cardMeta(card.id).hidden);
  return hidden.length ? `
    <button type="button" class="hidden-stack-button">${hidden.length} ausgeblendet</button>
    <div class="hidden-stack-list">
      ${hidden.map((card) => `
        <button type="button" data-phase2-action="restore" data-phase2-id="${escapeHtml(card.id)}">
          ${escapeHtml(card.title ?? "Karte")}
        </button>
      `).join("")}
    </div>
  ` : "";
}

function bindPhase2Actions() {
  document.querySelectorAll("[data-phase2-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const id = button.dataset.phase2Id;
      const meta = cardMeta(id);
      if (button.dataset.phase2Action === "focus") {
        meta.focus = !meta.focus;
      }
      if (button.dataset.phase2Action === "relevant") {
        meta.relevant = !meta.relevant;
      }
      if (button.dataset.phase2Action === "archive") {
        meta.archived = true;
      }
      if (button.dataset.phase2Action === "restore") {
        meta.archived = false;
        meta.hidden = false;
      }
      persistSession();
      render();
    });
  });
  document.querySelectorAll(".phase2-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("show-detail"));
  });
}

function sectionForPhase2Card(card) {
  if (card.direction === "positive") {
    return "positive";
  }
  if (card.direction === "development") {
    return "development";
  }
  if (card.direction?.startsWith("free")) {
    return "free";
  }
  if (card.direction === "mixed") {
    return "mixed";
  }
  return "neutral";
}

function buildCondensationClusters() {
  const groups = new Map();
  (session.rawObservations ?? []).filter((observation) => !observation.archived).forEach((observation) => {
    const ids = observation.valence === "free" || !observation.confirmedItemIds?.length
      ? ["free"]
      : observation.confirmedItemIds;
    ids.forEach((id) => {
      const key = `${observation.valence}:${id}`;
      if (!groups.has(key)) {
        const subcategory = subcategories.find((candidate) => candidate.id === id);
        groups.set(key, {
          key,
          itemId: id,
          subcategory,
          valence: observation.valence,
          observations: [],
          meta: session.condensationCards?.[key] ?? {}
        });
      }
      groups.get(key).observations.push(observation);
    });
  });
  return Array.from(groups.values()).sort((a, b) => {
    const order = { positive: 0, development: 0, neutral: 1, free: 2 };
    return (order[a.valence] ?? 9) - (order[b.valence] ?? 9)
      || b.observations.length - a.observations.length
      || (a.subcategory?.title ?? "frei").localeCompare(b.subcategory?.title ?? "frei", "de");
  });
}

function renderCondensationSection(clusters, emptyText, heading = "") {
  if (!clusters.length) {
    return heading ? `<h3 class="cluster-section-heading">${heading}</h3><p class="empty-state">${emptyText}</p>` : `<p class="empty-state">${emptyText}</p>`;
  }
  return `
    ${heading ? `<h3 class="cluster-section-heading">${heading}</h3>` : ""}
    <div class="condensation-list">
      ${clusters.map(renderCondensationCard).join("")}
    </div>
  `;
}

function renderCondensationCard(cluster) {
  const title = cluster.subcategory ? `${formatItemId(cluster.itemId)} ${cluster.subcategory.title.replace(/^\d\.\d\s*/, "")}` : "Freie professionelle Beobachtung";
  const observations = cluster.observations.slice(0, 2);
  const phases = Array.from(new Set(cluster.observations.map((observation) => observation.phase))).join(", ");
  const colorClass = cluster.valence;
  return `
    <article class="condensation-card ${colorClass}" data-condense-key="${cluster.key}">
      <div class="cluster-topline">
        <span>${escapeHtml(title)}</span>
        <em>${cluster.observations.length}</em>
      </div>
      <p>${escapeHtml(shortInterpretation(cluster))}</p>
      <ul>
        ${observations.map((observation) => `<li>${escapeHtml(observation.text)}</li>`).join("")}
      </ul>
      <small>Phase(n): ${escapeHtml(phases || "offen")}</small>
      <div class="card-actions inline-actions">
        <button type="button" class="${cluster.meta.focus ? "active" : ""}" data-condense-action="focus" data-key="${cluster.key}">Fokus</button>
        <button type="button" class="${cluster.meta.relevant ? "active" : ""}" data-condense-action="relevant" data-key="${cluster.key}">Gesprächsrelevant</button>
        <button type="button" data-condense-action="edit" data-key="${cluster.key}">Bearbeiten</button>
        <button type="button" data-condense-action="archive" data-key="${cluster.key}">Archivieren</button>
      </div>
    </article>
  `;
}

function shortInterpretation(cluster) {
  if (cluster.valence === "positive") {
    return cluster.subcategory ? `Hier verdichten sich Hinweise auf eine lerntragende Wirkung im Bereich ${cluster.subcategory.title}.` : "Freie professionelle Beobachtung.";
  }
  if (cluster.valence === "development") {
    return cluster.subcategory ? `Hier verdichten sich Hinweise auf eine entwicklungsrelevante Wirkung im Bereich ${cluster.subcategory.title}.` : "Freie professionelle Beobachtung.";
  }
  if (cluster.valence === "free") {
    return "Bewusst freie Beobachtung ohne UFB-Zuordnung.";
  }
  return "Zuordnung oder Wirkung ist noch offen.";
}

function bindCondensationActions() {
  document.querySelectorAll("[data-condense-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.key;
      session.condensationCards ??= {};
      session.condensationCards[key] ??= {};
      const meta = session.condensationCards[key];
      if (button.dataset.condenseAction === "focus") {
        meta.focus = !meta.focus;
      }
      if (button.dataset.condenseAction === "relevant") {
        meta.relevant = !meta.relevant;
      }
      if (button.dataset.condenseAction === "archive") {
        archiveCondensationCluster(key);
      }
      if (button.dataset.condenseAction === "edit") {
        editCondensationCluster(key);
      }
      persistSession();
      render();
    });
  });
}

function archiveCondensationCluster(key) {
  const [valence, itemId] = key.split(":");
  (session.rawObservations ?? []).forEach((observation) => {
    if (observation.valence === valence && (itemId === "free" || observation.confirmedItemIds?.includes(itemId))) {
      observation.archived = true;
    }
  });
}

function editCondensationCluster(key) {
  const [oldValence, oldItemId] = key.split(":");
  const nextItem = prompt("Item-ID eintragen (z. B. 1.2) oder frei lassen für freie Beobachtung:", oldItemId === "free" ? "" : formatItemId(oldItemId));
  const nextValence = prompt("Wirkung: positive, development, neutral oder free", oldValence) || oldValence;
  const normalizedItem = nextItem ? nextItem.trim().replace(".", "-") : "free";
  (session.rawObservations ?? []).forEach((observation) => {
    if (observation.valence === oldValence && (oldItemId === "free" || observation.confirmedItemIds?.includes(oldItemId))) {
      observation.valence = nextValence;
      observation.confirmedItemIds = normalizedItem === "free" ? [] : [normalizedItem];
    }
  });
}

function renderEvaluation() {
  if ((session.rawObservations ?? []).length) {
    renderCondensationMode();
    return;
  }
  const cards = markedItems();
  const visibleCards = cards.filter((card) => !card.meta.hidden);
  const evidence = cards
    .filter((card) => card.value === 1 || card.value === 2)
    .sort(cardSort);
  const development = cards
    .filter((card) => card.value === 3 || card.value === 4)
    .sort(cardSort);
  const customEvidence = customCardsByType("evidence");
  const customDevelopment = customCardsByType("development");
  const hiddenSyntheses = new Set(session.hiddenSyntheses ?? []);
  const syntheses = session.synthesisRequested
    ? crossItemSyntheses(visibleCards).filter((synthesis) => !hiddenSyntheses.has(synthesis.synthesisId))
    : [];

  synthesisCards.innerHTML = session.synthesisRequested
    ? (syntheses.length
      ? syntheses.map(renderSynthesisCard).join("")
      : `<p class="empty-state">Noch keine itemübergreifenden Zusammenhänge erkennbar.</p>`)
    : `<p class="empty-state">Wird erst auf Knopfdruck berechnet.</p>`;

  evidenceCards.innerHTML = evidence.length
    ? renderDimensionEvaluation(evidence, "evidence") + renderCustomCards(customEvidence)
    : (customEvidence.length ? renderCustomCards(customEvidence) : `<p class="empty-state">Noch keine lerntragenden Wirkungen markiert.</p>`);
  developmentCards.innerHTML = development.length
    ? renderDimensionEvaluation(development, "development") + renderCustomCards(customDevelopment)
    : (customDevelopment.length ? renderCustomCards(customDevelopment) : `<p class="empty-state">Noch keine entwicklungsrelevanten Wirkungen markiert.</p>`);

  document.querySelectorAll(".cluster-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("show-detail");
    });
  });
  document.querySelectorAll(".synthesis-card").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("show-detail");
    });
  });
  document.querySelectorAll("[data-action='hide-synthesis']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const synthesisId = button.dataset.synthesisId;
      if (!synthesisId) {
        return;
      }
      session.hiddenSyntheses = Array.from(new Set([...(session.hiddenSyntheses ?? []), synthesisId]));
      persistSession();
      render();
    });
  });
  document.querySelectorAll(".custom-eval-card").forEach((card) => {
    card.addEventListener("click", () => card.classList.toggle("show-detail"));
  });
  document.querySelectorAll("[data-action='delete-custom-card']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      session.customCards = (session.customCards ?? []).filter((card) => card.id !== button.dataset.id);
      persistSession();
      render();
    });
  });
  document.querySelectorAll("[data-action='priority-cluster']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const keys = keysFromDataset(button.dataset.keys);
      const nextPriority = nextPriorityValue(Math.max(...keys.map((key) => cardMeta(key).priority ?? 0)));
      keys.forEach((key) => {
        cardMeta(key).priority = nextPriority;
      });
      persistSession();
      render();
    });
  });
  document.querySelectorAll("[data-action='priority-custom-card']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const card = (session.customCards ?? []).find((candidate) => candidate.id === button.dataset.id);
      if (card) {
        card.priority = nextPriorityValue(card.priority ?? 0);
      }
      persistSession();
      render();
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

function customCardsByType(type) {
  return (session.customCards ?? []).filter((card) => (card.scope ?? "evaluation") === "evaluation" && card.type === type);
}

function renderCustomCards(cards) {
  if (!cards.length) {
    return "";
  }
  return `
    <details class="evaluation-group custom-group" open>
      <summary style="--group-color: #7a8790">
        <span>Eigene Karten</span>
        <em>${cards.length}</em>
      </summary>
      <div class="cluster-grid">
        ${cards.map(renderCustomCard).join("")}
      </div>
    </details>
  `;
}

function renderCustomCard(card) {
  const color = card.type === "development" ? "#2369a8" : "#4a9f2f";
  return `
    <article class="custom-eval-card ${card.type}" style="--card-color: ${color}">
      <div class="cluster-topline">
        <span>${escapeHtml(card.title)}</span>
      </div>
      <small>Eigene Ergänzung</small>
      <button class="priority-button ${card.priority ? "active" : ""}" type="button" data-action="priority-custom-card" data-id="${card.id}" title="Priorität">${priorityLabel(card.priority ?? 0)}</button>
      <button class="custom-delete" type="button" data-action="delete-custom-card" data-id="${card.id}" title="Entfernen">×</button>
      <div class="cluster-detail">
        <p>${escapeHtml(card.note || "")}</p>
      </div>
    </article>
  `;
}

function openCustomCard(type, scope = "evaluation") {
  pendingCustomCardType = type;
  pendingCustomCardScope = scope;
  customCardHeading.value = "";
  customCardNote.value = "";
  const noteLabel = customCardNote?.previousElementSibling;
  if (noteLabel) {
    noteLabel.textContent = scope === "discussion" ? "Beobachtung / Gesprächsnotiz" : "Fachspezifische Anmerkung";
  }
  if (customCardHeading) {
    customCardHeading.placeholder = scope === "discussion" ? "Kurzer Kartentitel" : "Kurzer Stichpunkt";
  }
  if (customCardNote) {
    customCardNote.placeholder = scope === "discussion" ? "Beobachtung, Gesprächsimpuls oder Vereinbarung" : "Gedanke für die Auswertung";
  }
  customCardDialog.classList.remove("hidden");
  customCardHeading.focus();
}

function closeCustomCard() {
  customCardDialog.classList.add("hidden");
}

function saveCustomCard() {
  const title = customCardHeading.value.trim();
  const note = customCardNote.value.trim();
  if (!title && !note) {
    closeCustomCard();
    return;
  }
  session.customCards ??= [];
  if (pendingCustomCardScope === "discussion") {
    const direction = pendingCustomCardType;
    const id = `custom-discussion-${Date.now()}`;
    session.customCards.push({
      id,
      scope: "discussion",
      type: direction,
      direction,
      title: title || "Eigene Gesprächskarte",
      note,
      priority: 72,
      createdAt: new Date().toISOString()
    });
    cardMeta(id).relevant = true;
  } else {
    session.customCards.push({
      id: `custom-${Date.now()}`,
      scope: "evaluation",
      type: pendingCustomCardType,
      title: title || "Eigene Ergänzung",
      note,
      priority: 0,
      createdAt: new Date().toISOString()
    });
  }
  persistSession();
  closeCustomCard();
  render();
}

function addLogEntry() {
  const heading = logbookHeading.value.trim();
  const duration = phaseDuration.value.trim();
  const observations = observationValues();
  const observation = observations.join("\n");
  const alternative = logbookAlternative.value.trim();
  if (!heading && !duration && !observation && !alternative && !pendingQuotes.length && !pendingGroups.length) {
    return;
  }
  session.logbook ??= [];
  session.logbook.unshift({
    id: `log-${Date.now()}`,
    heading,
    duration,
    observation,
    observations,
    alternative,
    quotes: pendingQuotes,
    groups: pendingGroups,
    createdAt: new Date().toISOString()
  });
  logbookHeading.value = "";
  phaseDuration.value = "";
  resetObservationFields();
  logbookAlternative.value = "";
  pendingQuotes = [];
  pendingGroups = [];
  renderQuoteDrafts();
  renderGroupDrafts();
  persistSession();
  renderLogbook();
}

function observationValues() {
  return Array.from(observationFields.querySelectorAll(".observation-input"))
    .map((input) => input.value.trim())
    .filter(Boolean);
}

function addObservationField(value = "") {
  const textarea = document.createElement("textarea");
  textarea.className = "card-note logbook-input observation-input";
  textarea.placeholder = "Weitere Beobachtung";
  textarea.value = value;
  observationFields.append(textarea);
  textarea.focus();
}

function resetObservationFields() {
  observationFields.innerHTML = `<textarea class="card-note logbook-input observation-input" placeholder="Was ist sichtbar oder hörbar?"></textarea>`;
}

function openQuoteDialog(type) {
  currentQuoteType = type;
  quoteName.value = "";
  quoteText.value = "";
  quoteHint.value = "";
  document.querySelector("#quoteDialogTitle").textContent = logTypeLabel(type);
  quoteDialog.classList.remove("hidden");
  quoteText.focus();
}

function closeQuoteDialog() {
  quoteDialog.classList.add("hidden");
}

function saveQuoteDraft() {
  const text = quoteText.value.trim();
  const name = quoteName.value.trim();
  const hint = quoteHint.value.trim();
  if (text) {
    pendingQuotes.push({
      id: `quote-${Date.now()}`,
      type: currentQuoteType,
      name,
      text,
      hint
    });
    renderQuoteDrafts();
  }
  closeQuoteDialog();
}

function renderQuoteDrafts() {
  quoteDrafts.innerHTML = pendingQuotes.length
    ? pendingQuotes.map((quote) => `
      <blockquote class="quote-bubble ${quote.type}">
        <strong>${logTypeLabel(quote.type)}${quote.name ? ` · ${escapeHtml(quote.name)}` : ""}</strong>
        <p>${escapeHtml(quote.text)}</p>
        ${quote.hint ? `<em>${escapeHtml(quote.hint)}</em>` : ""}
      </blockquote>
    `).join("")
    : "";
}

function openGroupDialog() {
  if (!pendingGroups.length) {
    pendingGroups = [
      { id: "group-1", label: "Gruppe 1", note: "" },
      { id: "group-2", label: "Gruppe 2", note: "" }
    ];
  }
  renderGroupEditor();
  groupDialog.classList.remove("hidden");
}

function closeGroupDialog() {
  groupDialog.classList.add("hidden");
}

function renderGroupEditor() {
  groupEditorList.innerHTML = pendingGroups.map((group) => `
    <section class="group-editor-item" data-group-id="${group.id}">
      <input class="text-input group-label-input" value="${escapeHtml(group.label)}" aria-label="Gruppenbezeichnung">
      <textarea class="card-note group-note-input" placeholder="Anmerkungen zur Gruppe">${escapeHtml(group.note)}</textarea>
    </section>
  `).join("");
}

function syncGroupDraftFromEditor() {
  pendingGroups = Array.from(groupEditorList.querySelectorAll(".group-editor-item")).map((item, index) => ({
    id: item.dataset.groupId || `group-${index + 1}`,
    label: item.querySelector(".group-label-input").value.trim() || `Gruppe ${index + 1}`,
    note: item.querySelector(".group-note-input").value.trim()
  }));
}

function saveGroupDrafts() {
  syncGroupDraftFromEditor();
  renderGroupDrafts();
  if (!logbookHeading.value.trim()) {
    logbookHeading.value = "Gruppenarbeit";
  }
  closeGroupDialog();
}

function renderGroupDrafts() {
  groupDrafts.innerHTML = pendingGroups.length
    ? `
      <div class="group-draft-list">
        ${pendingGroups.map((group) => `
          <span class="group-chip"><strong>${escapeHtml(group.label)}</strong>${group.note ? ` · ${escapeHtml(group.note)}` : ""}</span>
        `).join("")}
      </div>
    `
    : "";
}

function prepareFeedbackLog() {
  if (!logbookHeading.value.trim()) {
    logbookHeading.value = "Feedback/Unterstützung";
  }
  const firstObservation = observationFields.querySelector(".observation-input");
  if (firstObservation && !firstObservation.value.trim()) {
    firstObservation.value = "Feedback-/Unterstützungssituation: ";
  }
  firstObservation?.focus();
}

function renderLogbook() {
  if (!logbookEntries) {
    return;
  }
  const entries = session.logbook ?? [];
  logbookEntries.innerHTML = entries.length
    ? entries.map((entry) => `
      <article class="log-entry">
        <time>${new Date(entry.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</time>
        ${entry.duration ? `<span class="duration-pill">◷ ${escapeHtml(entry.duration)}</span>` : ""}
        ${entry.heading ? `<h3>${escapeHtml(entry.heading)}</h3>` : ""}
        <div class="log-entry-grid">
          <section>
            <strong>Beobachtungen</strong>
            ${renderObservationList(entry)}
          </section>
          <section>
            <strong>Alternativen/Hinweise</strong>
            <p>${escapeHtml(entry.alternative ?? "")}</p>
          </section>
        </div>
        ${entry.quotes?.length ? `<div class="quote-row">${entry.quotes.map((quote) => `
          <blockquote class="quote-bubble ${quote.type}">
            <strong>${logTypeLabel(quote.type)}${quote.name ? ` · ${escapeHtml(quote.name)}` : ""}</strong>
            <p>${escapeHtml(quote.text)}</p>
            ${quote.hint ? `<em>${escapeHtml(quote.hint)}</em>` : ""}
          </blockquote>
        `).join("")}</div>` : ""}
        ${entry.groups?.length ? `<div class="group-draft-list">${entry.groups.map((group) => `
          <span class="group-chip"><strong>${escapeHtml(group.label)}</strong>${group.note ? ` · ${escapeHtml(group.note)}` : ""}</span>
        `).join("")}</div>` : ""}
      </article>
    `).join("")
    : `<p class="empty-state">Noch keine Logbucheinträge.</p>`;
}

function flushDiscussionNoteEdits() {
  if (!discussionCards) return;
  discussionCards.querySelectorAll("[data-edit-note]").forEach((ta) => {
    const parts = ta.dataset.editNote.split(":");
    const cardId = parts[0];
    const index = Number(parts[1]);
    const meta = cardMeta(cardId);
    if (meta.discussionNotes?.[index] !== undefined) {
      meta.discussionNotes[index].text = ta.value;
    }
  });
  discussionCards.querySelectorAll(".evidence-edit-text").forEach((ta) => {
    const meta = cardMeta(ta.dataset.cardId);
    if (ta.dataset.evidenceIndex !== undefined) {
      meta.evidenceEdits = meta.evidenceEdits ?? {};
      meta.evidenceEdits[ta.dataset.evidenceIndex] = ta.value;
    }
  });
}

function renderDiscussion() {
  if (!discussionCards) {
    return;
  }
  flushDiscussionNoteEdits();
  const cards = selectedPhase2DiscussionCards();
  if (cards.length && !cards.some((card) => card.id === activeDiscussionCardId)) {
    activeDiscussionCardId = cards[0].id;
  }
  if (!cards.length) {
    activeDiscussionCardId = null;
  }
  const activeCard = cards.find((card) => card.id === activeDiscussionCardId) ?? null;
  discussionCards.innerHTML = renderDiscussionBoard(cards, activeCard);
  discussionCards.querySelectorAll("[data-discussion-select]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDiscussionCardId = button.dataset.discussionSelect;
      renderDiscussion();
    });
  });
  discussionCards.querySelectorAll("[data-discussion-state]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.key;
      const meta = cardMeta(key);
      meta.status = button.dataset.discussionState;
      persistSession();
      renderDiscussion();
      renderProtocol();
    });
  });
  discussionCards.querySelectorAll("[data-add-discussion-card]").forEach((button) => {
    button.addEventListener("click", () => {
      openCustomCard(discussionDirectionFromSection(button.dataset.addDiscussionCard), "discussion");
    });
  });
  discussionCards.querySelectorAll("[data-discussion-note]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      const meta = cardMeta(textarea.dataset.discussionNote);
      meta.discussionNote = textarea.value;
      meta.note = textarea.value;
      persistSession();
    });
  });
  discussionCards.querySelectorAll("[data-discussion-title]").forEach((input) => {
    input.addEventListener("input", () => {
      const meta = cardMeta(input.dataset.discussionTitle);
      meta.customTitle = input.value || undefined;
      persistSession();
    });
  });
  discussionCards.querySelectorAll("[data-hide-impulse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      cardMeta(btn.dataset.hideImpulse).impulseHidden = true;
      persistSession();
      renderDiscussion();
      renderProtocol();
    });
  });
  discussionCards.querySelectorAll("[data-spellcheck]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const section = btn.closest(".discussion-evidence-section");
      section?.querySelectorAll(".evidence-edit-text").forEach((ta) => {
        ta.spellcheck = true;
        ta.focus();
      });
    });
  });
  discussionCards.querySelectorAll(".evidence-edit-text").forEach((ta) => {
    ta.addEventListener("input", () => {
      const meta = cardMeta(ta.dataset.cardId);
      meta.evidenceEdits = meta.evidenceEdits ?? {};
      meta.evidenceEdits[ta.dataset.evidenceIndex] = ta.value;
      persistSession();
    });
  });
  discussionCards.querySelectorAll("[data-add-note]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const meta = cardMeta(btn.dataset.addNote);
      meta.discussionNotes = meta.discussionNotes ?? [];
      meta.discussionNotes.push({ id: `note-${Date.now()}`, text: "", type: "conversation" });
      persistSession();
      renderDiscussion();
    });
  });
  discussionCards.querySelectorAll("[data-delete-note]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const [cardId, indexStr] = btn.dataset.deleteNote.split(":");
      const meta = cardMeta(cardId);
      meta.discussionNotes = (meta.discussionNotes ?? []).filter((_, i) => i !== Number(indexStr));
      persistSession();
      renderDiscussion();
      renderProtocol();
    });
  });
  discussionCards.querySelectorAll("[data-note-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parts = btn.dataset.noteType.split(":");
      const cardId = parts[0];
      const index = Number(parts[1]);
      const type = parts[2];
      const meta = cardMeta(cardId);
      if (meta.discussionNotes?.[index]) {
        meta.discussionNotes[index].type = type;
        persistSession();
        // Update in place — no full re-render so textarea text is preserved
        const editor = btn.closest(".discussion-note-editor");
        if (editor) {
          editor.className = `discussion-note-editor ${type}`;
          editor.querySelectorAll(".note-type-buttons button").forEach((b) => {
            const bParts = b.dataset.noteType?.split(":") ?? [];
            b.classList.toggle("active", bParts[2] === type);
          });
        }
        renderProtocol();
      }
    });
  });
  discussionCards.querySelectorAll("[data-edit-note]").forEach((ta) => {
    const saveNote = () => {
      const parts = ta.dataset.editNote.split(":");
      const cardId = parts[0];
      const index = Number(parts[1]);
      const meta = cardMeta(cardId);
      if (meta.discussionNotes?.[index] !== undefined) {
        meta.discussionNotes[index].text = ta.value;
        persistSession();
      }
    };
    ta.addEventListener("input", saveNote);
    ta.addEventListener("blur", saveNote);
  });
}

function renderDiscussionBoard(cards, activeCard) {
  const sections = [
    { id: "positive", title: "Lerntragende Wirkungen", cards: cards.filter((card) => card.direction === "positive") },
    { id: "development", title: "Entwicklungsrelevante Wirkungen", cards: cards.filter((card) => card.direction === "development") },
    { id: "mixed", title: "Ambivalenzen", cards: cards.filter((card) => card.direction === "mixed") },
    { id: "free", title: "Freie Beobachtungen", cards: cards.filter((card) => String(card.direction ?? "").startsWith("free")) }
  ];
  return `
    <div class="discussion-board">
      <div class="discussion-left">
        ${sections.map((section) => `
          <section class="discussion-section">
            <div class="discussion-section-heading">
              <h3>${escapeHtml(section.title)} <em>${section.cards.length}</em></h3>
              <button class="add-card-button discussion-add-button" type="button" data-add-discussion-card="${escapeHtml(section.id)}" aria-label="Karte ergänzen">+</button>
            </div>
            <div class="discussion-mini-grid">
              ${section.cards.length
                ? section.cards.map((card) => renderDiscussionMiniCard(card, activeCard?.id === card.id)).join("")
                : `<p class="empty-state compact">Keine Karten.</p>`}
            </div>
          </section>
        `).join("")}
      </div>
      <aside class="discussion-detail-pane">
        ${activeCard ? renderDiscussionDetail(activeCard) : `<p class="empty-state">Karte antippen, dann hier notieren.</p>`}
      </aside>
    </div>
  `;
}

function discussionDirectionFromSection(sectionId) {
  if (sectionId === "positive") return "positive";
  if (sectionId === "development") return "development";
  if (sectionId === "mixed") return "mixed";
  if (sectionId === "free") return "free";
  return "neutral";
}

function renderDiscussionMiniCard(card, active) {
  const meta = cardMeta(card.id);
  const status = meta.status ? statusLabel(meta.status) : (meta.focus ? "Fokus" : "relevant");
  return `
    <article class="discussion-mini-card ${sectionForPhase2Card(card)} ${active ? "expanded" : ""} ${discussionStatusClass(meta.status)}">
      <button class="discussion-mini-main" type="button" data-discussion-select="${escapeHtml(card.id)}">
        <span>${escapeHtml(card.title)}</span>
        <em>${escapeHtml(status)}</em>
        ${active ? `<small>${escapeHtml(card.statement ?? "")}</small>` : ""}
      </button>
      <div class="discussion-mini-actions" aria-label="Status">
        <button type="button" class="${meta.status === "thematisiert" ? "active" : ""}" data-discussion-state="thematisiert" data-key="${escapeHtml(card.id)}">thematisiert</button>
        <button type="button" class="${meta.status === "nicht_thematisiert" ? "active" : ""}" data-discussion-state="nicht_thematisiert" data-key="${escapeHtml(card.id)}">nicht</button>
      </div>
    </article>
  `;
}

function renderDiscussionDetail(card) {
  const meta = cardMeta(card.id);
  const title = meta.customTitle ?? card.title;
  const evidence = (card.evidence ?? []).slice(0, 4);
  const notes = meta.discussionNotes ?? [];
  return `
    <article class="discussion-detail-card ${sectionForPhase2Card(card)}">
      <input class="discussion-title-input" type="text"
        data-discussion-title="${escapeHtml(card.id)}"
        value="${escapeHtml(title)}"
        placeholder="Titel…">
      <p class="discussion-interpretation">${escapeHtml(card.statement ?? "")}</p>
      ${card.impulse && !meta.impulseHidden ? `
        <div class="discussion-impulse-row">
          <div><strong>Impuls</strong><p>${escapeHtml(card.impulse)}</p></div>
          <button class="icon-button" type="button" data-hide-impulse="${escapeHtml(card.id)}" title="Impuls entfernen">✕</button>
        </div>
      ` : ""}
      ${evidence.length ? `
        <div class="discussion-evidence-section">
          <div class="discussion-evidence-header">
            <strong>Beobachtungsnotizen</strong>
            <button class="mini-button" type="button" data-spellcheck="${escapeHtml(card.id)}">Rechtschreibung prüfen</button>
          </div>
          ${evidence.map((entry, i) => {
            const text = meta.evidenceEdits?.[i] ?? entry.text ?? "";
            const obs = liveEventById(entry.id);
            const hint = obs?.hintText || obs?.professionalHint || "";
            return `
              <div class="evidence-edit-row">
                <textarea class="evidence-edit-text card-note" spellcheck="false"
                  data-card-id="${escapeHtml(card.id)}"
                  data-evidence-index="${i}">${escapeHtml(text)}</textarea>
                ${hint ? `<div class="evidence-edit-hint"><em>Hinweis:</em> ${escapeHtml(hint)}</div>` : ""}
              </div>`;
          }).join("")}
        </div>
      ` : ""}
      <div class="discussion-notes-section">
        <div class="discussion-notes-label">Notizen</div>
        ${notes.map((note, i) => `
          <div class="discussion-note-editor ${note.type ?? "conversation"}">
            <div class="note-editor-header">
              <div class="note-type-buttons">
                <button type="button" class="${note.type === "conversation" || !note.type ? "active" : ""}" data-note-type="${escapeHtml(card.id)}:${i}:conversation">Gesprächsnotiz</button>
                <button type="button" class="${note.type === "agreement" ? "active" : ""}" data-note-type="${escapeHtml(card.id)}:${i}:agreement">Vereinbarung</button>
                <button type="button" class="${note.type === "plg" ? "active" : ""}" data-note-type="${escapeHtml(card.id)}:${i}:plg">PLG-Aufgabe</button>
              </div>
              <button type="button" class="icon-button" data-delete-note="${escapeHtml(card.id)}:${i}">✕</button>
            </div>
            <textarea class="card-note discussion-note-text" data-edit-note="${escapeHtml(card.id)}:${i}"
              placeholder="Notiz…">${escapeHtml(note.text ?? "")}</textarea>
          </div>
        `).join("")}
        <button class="mini-button add-note-button" type="button" data-add-note="${escapeHtml(card.id)}">+ Notiz hinzufügen</button>
      </div>
      <div class="card-actions inline-actions">
        <button type="button" class="${meta.status === "thematisiert" ? "active" : ""}" data-discussion-state="thematisiert" data-key="${escapeHtml(card.id)}">thematisiert</button>
        <button type="button" class="${meta.status === "nicht_thematisiert" ? "active" : ""}" data-discussion-state="nicht_thematisiert" data-key="${escapeHtml(card.id)}">nicht thematisiert</button>
      </div>
    </article>
  `;
}

function selectedPhase2DiscussionCards() {
  const board = getPhase2Board({ includeOpen: true });
  return [
    ...((board?.cards ?? [])
    .filter((card) => {
      const meta = cardMeta(card.id);
      return !meta.archived && !meta.hidden && (meta.focus || meta.relevant);
    })),
    ...discussionCustomCards()
  ]
    .sort((a, b) =>
      Number(Boolean(cardMeta(b.id).focus)) - Number(Boolean(cardMeta(a.id).focus))
      || directionRank(a.direction) - directionRank(b.direction)
      || (b.priority ?? 0) - (a.priority ?? 0)
      || String(a.title ?? "").localeCompare(String(b.title ?? ""), "de")
    );
}

function discussionCustomCards() {
  return (session.customCards ?? [])
    .filter((card) => card.scope === "discussion")
    .filter((card) => !cardMeta(card.id).archived && !cardMeta(card.id).hidden)
    .map((card) => ({
      id: card.id,
      source: "custom-discussion",
      direction: card.direction ?? card.type ?? "free",
      title: card.title || "Eigene Karte",
      statement: card.note || "Eigene Gesprächskarte.",
      impulse: card.impulse ?? "",
      itemIds: [],
      phases: [],
      socialForms: [],
      priority: Number(card.priority ?? 72),
      evidence: card.note ? [{ id: `${card.id}:note`, text: card.note }] : [],
      observations: [],
      display: {
        title: card.title || "Eigene Karte",
        statement: card.note || "Eigene Gesprächskarte."
      }
    }));
}

function directionRank(direction) {
  if (direction === "positive") return 0;
  if (direction === "development") return 1;
  if (direction === "mixed") return 2;
  if (String(direction ?? "").startsWith("free")) return 3;
  return 4;
}

function renderDiscussionPhase2Card(card) {
  const meta = cardMeta(card.id);
  const evidence = (card.evidence ?? []).slice(0, 2);
  return `
    <article class="discussion-card ${sectionForPhase2Card(card)}">
      <div class="cluster-topline">
        <span>${escapeHtml(card.title)}</span>
        <em>${meta.status ? statusLabel(meta.status) : (meta.focus ? "Fokus" : "relevant")}</em>
      </div>
      <p>${escapeHtml(card.statement ?? "")}</p>
      ${evidence.length ? `<ul>${evidence.map((observation) => `<li>${escapeHtml(observation.text ?? "")}</li>`).join("")}</ul>` : ""}
      ${card.impulse ? `<strong>Impuls</strong><p>${escapeHtml(card.impulse)}</p>` : ""}
      <div class="card-actions inline-actions">
        <button type="button" data-discussion-status="angesprochen" data-key="${escapeHtml(card.id)}">angesprochen</button>
        <button type="button" data-discussion-status="nicht" data-key="${escapeHtml(card.id)}">nicht angesprochen</button>
        <button type="button" data-discussion-status="spaeter" data-key="${escapeHtml(card.id)}">später</button>
        <button type="button" data-discussion-status="kollegium" data-key="${escapeHtml(card.id)}">kam hinzu</button>
        <button type="button" data-discussion-status="logbuch" data-key="${escapeHtml(card.id)}">ins Logbuch</button>
      </div>
    </article>
  `;
}

function renderDiscussionCard(cluster) {
  const title = cluster.subcategory ? cluster.subcategory.title.replace(/^\d\.\d\s*/, "") : "Freie Beobachtung";
  const evidence = cluster.observations.slice(0, 2);
  const question = cluster.subcategory
    ? (window.UFB_HEURISTICS ?? []).find((item) => item.id === cluster.itemId)?.impulseQuestions?.[0]
    : "Welche Bedeutung hat diese Beobachtung für die weitere professionelle Reflexion?";
  return `
    <article class="discussion-card ${cluster.valence}">
      <div class="cluster-topline">
        <span>${escapeHtml(title)}</span>
        <em>${cluster.meta.status ? statusLabel(cluster.meta.status) : "offen"}</em>
      </div>
      <p>${escapeHtml(shortInterpretation(cluster))}</p>
      <ul>
        ${evidence.map((observation) => `<li>${escapeHtml(observation.text)}</li>`).join("")}
      </ul>
      <strong>Impulsfrage</strong>
      <p>${escapeHtml(question)}</p>
      <div class="card-actions inline-actions">
        <button type="button" data-discussion-status="angesprochen" data-key="${cluster.key}">angesprochen</button>
        <button type="button" data-discussion-status="nicht" data-key="${cluster.key}">nicht angesprochen</button>
        <button type="button" data-discussion-status="spaeter" data-key="${cluster.key}">später</button>
        <button type="button" data-discussion-status="kollegium" data-key="${cluster.key}">kam hinzu</button>
        <button type="button" data-discussion-status="logbuch" data-key="${cluster.key}">ins Logbuch</button>
      </div>
    </article>
  `;
}

function statusLabel(status) {
  return {
    thematisiert: "thematisiert",
    nicht_thematisiert: "nicht thematisiert",
    angesprochen: "angesprochen",
    nicht: "nicht angesprochen",
    spaeter: "später",
    kollegium: "kam hinzu",
    logbuch: "Logbuch"
  }[status] ?? "offen";
}

function discussionStatusClass(status) {
  if (status === "thematisiert" || status === "angesprochen" || status === "logbuch") {
    return "is-discussed";
  }
  if (status === "nicht_thematisiert" || status === "nicht") {
    return "is-muted";
  }
  return "";
}

function renderObservationList(entry) {
  const observations = entry.observations?.length ? entry.observations : [entry.observation ?? entry.text ?? ""].filter(Boolean);
  if (!observations.length) {
    return `<p></p>`;
  }
  return `<ul class="log-observation-list">${observations.map((observation) => `<li>${escapeHtml(observation)}</li>`).join("")}</ul>`;
}

function logTypeLabel(type) {
  return {
    notiz: "Notiz",
    ueberschrift: "Überschrift",
    "s-schueler": "Zitat SuS",
    "s-lehrkraft": "Zitat LK"
  }[type] ?? "Notiz";
}

function crossItemSyntheses(cards) {
  const visible = cards.filter((card) => !card.meta.hidden);
  const rules = [
    {
      id: "thinking-chain",
      title: "Vom Lernziel zur kognitiven Aktivierung",
      areas: ["1-1", "1-2", "1-3"],
      minAreas: 2,
      evidence: "Lernzielklarheit, sichtbare Denkweisen und fachliche Herausforderung stützen eine Linie fachlicher Tiefenverarbeitung.",
      development: "Lernzielklarheit, sichtbare Denkweisen und fachliche Herausforderung könnten stärker miteinander verbunden werden."
    },
    {
      id: "understanding-cycle",
      title: "Verstehen aufbauen und sichern",
      areas: ["1-1", "1-2", "2-1"],
      minAreas: 2,
      evidence: "Zentrale Inhalte, Schülervorstellungen und Rückmeldungen greifen beim Aufbau von Verständnis ineinander.",
      development: "Verständnis könnte gezielter gesichert werden, wenn Schülervorstellungen und Feedback stärker aufeinander bezogen werden."
    },
    {
      id: "deep-talk",
      title: "Fachliches Gespräch vertiefen",
      areas: ["1-2", "1-3", "1-4"],
      minAreas: 2,
      evidence: "Beiträge, Begründungen und herausfordernde Fragen verdichten sich zu einem fachlich tragfähigen Gespräch.",
      development: "Das Unterrichtsgespräch könnte stärker auf Begründungen, Denkwege und fachliche Vertiefung ausgerichtet werden."
    },
    {
      id: "adaptive-support",
      title: "Denkweisen als Ausgangspunkt für Unterstützung",
      areas: ["1-2", "2-1", "2-2"],
      minAreas: 2,
      evidence: "Sichtbare Denkweisen, Feedback und individuelle Unterstützung greifen als adaptive Lernbegleitung ineinander.",
      development: "Es könnte lohnen zu prüfen, wie Denkweisen der SuS noch stärker für Feedback oder Unterstützung genutzt werden."
    },
    {
      id: "participation-climate",
      title: "Fachliche Beteiligung und Lernklima",
      areas: ["1-4", "2-3", "2-4"],
      minAreas: 2,
      evidence: "Fachliche Beteiligung steht im Zusammenhang mit wertschätzender Kommunikation und tragfähiger Zusammenarbeit.",
      development: "Die Gesprächslinie könnte sein, wie Klima, Zusammenarbeit und fachliche Beteiligung einander stützen oder begrenzen."
    },
    {
      id: "student-agency",
      title: "Schüleraktivität fachlich nutzen",
      areas: ["1-3", "1-4", "2-4"],
      minAreas: 2,
      evidence: "Eigene Lösungsansätze, fachliche Beiträge und Zusammenarbeit eröffnen aktive fachliche Beteiligung.",
      development: "Schüleraktivität könnte stärker fachlich gebunden werden, etwa über eigene Lösungsansätze, Beiträge und Zusammenarbeit."
    },
    {
      id: "respect-risk-taking",
      title: "Sicherheit für fachliches Risiko",
      areas: ["1-4", "2-3", "2-4"],
      minAreas: 2,
      evidence: "Wertschätzung und Klassenklima unterstützen, dass SuS fachliche Beiträge, Fragen oder Schwierigkeiten einbringen.",
      development: "Ein möglicher Fokus ist, wie Wertschätzung und Klassenklima fachliche Beiträge oder Fragen der SuS erleichtern."
    },
    {
      id: "learning-time",
      title: "Präsenz, Störungsarmut und Lernzeit",
      areas: ["3-1", "3-2", "3-3"],
      minAreas: 2,
      evidence: "Monitoring, geordnete Abläufe und Zeitnutzung sichern Raum für fachliche Lernprozesse.",
      development: "Für die Nachbesprechung könnte der Zusammenhang zwischen Präsenz, Störungen und nutzbarer Lernzeit relevant sein."
    },
    {
      id: "workphase-quality",
      title: "Arbeitsphasen lernwirksam halten",
      areas: ["2-2", "3-2", "3-3"],
      minAreas: 2,
      evidence: "Unterstützung, Monitoring und Zeitnutzung stabilisieren Arbeitsphasen für fachliche Bearbeitung.",
      development: "Arbeitsphasen könnten lernwirksamer werden, wenn Unterstützung, Monitoring und Zeitstruktur stärker zusammenspielen."
    },
    {
      id: "classroom-flow",
      title: "Unterrichtsfluss sichern",
      areas: ["3-1", "3-2", "3-3", "2-4"],
      minAreas: 2,
      evidence: "Regeln, Präsenz, Übergänge und Zusammenarbeit sichern einen ruhigen Unterrichtsfluss.",
      development: "Unterrichtsfluss könnte durch klarere Abläufe, frühere Signale oder stabilere Zusammenarbeit unterstützt werden."
    },
    {
      id: "challenge-support",
      title: "Herausforderung und Unterstützung balancieren",
      areas: ["1-3", "2-1", "2-2"],
      minAreas: 2,
      evidence: "Fachliche Herausforderung und Unterstützung erscheinen als zusammenhängende Balance im Lernprozess.",
      development: "Interessant könnte sein, wie anspruchsvolle Aufgaben durch Feedback, Hilfen oder Denkzeiten getragen werden."
    },
    {
      id: "demand-time",
      title: "Anspruch und Denkzeit abstimmen",
      areas: ["1-3", "2-2", "3-3"],
      minAreas: 2,
      evidence: "Anspruchsvolle Aufgaben werden durch Denkzeiten und Zeitstruktur tragfähig gerahmt.",
      development: "Anspruch und verfügbare Denk- oder Bearbeitungszeit könnten noch genauer aufeinander abgestimmt werden."
    },
    {
      id: "feedback-culture",
      title: "Fehler, Beiträge und Weiterarbeit",
      areas: ["1-2", "1-4", "2-1", "2-3"],
      minAreas: 2,
      evidence: "Beiträge, Fehler oder Lösungswege werden als Ausgangspunkt für fachliche Weiterarbeit nutzbar.",
      development: "Die Nachbesprechung könnte aufgreifen, wie Beiträge oder Fehler noch stärker für fachliche Klärung genutzt werden."
    },
    {
      id: "feedback-next-step",
      title: "Rückmeldung mit nächstem Lernschritt",
      areas: ["2-1", "2-2", "1-1"],
      minAreas: 2,
      evidence: "Rückmeldungen und Hilfen beziehen sich auf zentrale Inhalte und unterstützen nächste Lernschritte.",
      development: "Rückmeldungen könnten stärker auf zentrale Inhalte und konkrete nächste Lernschritte ausgerichtet werden."
    },
    {
      id: "visibility-response",
      title: "Wahrnehmen und reagieren",
      areas: ["1-2", "2-2", "3-2"],
      minAreas: 2,
      evidence: "Denkweisen, Unterstützungsbedarf und Arbeitsprozesse werden wahrgenommen und passend aufgegriffen.",
      development: "Interessant wäre, wie sichtbare Denkweisen, Unterstützungsbedarf und Monitoring noch schneller in Reaktionen münden."
    },
    {
      id: "structure-cognition",
      title: "Struktur als Bedingung für Denken",
      areas: ["1-1", "1-3", "3-3"],
      minAreas: 2,
      evidence: "Klare fachliche Struktur und Zeitnutzung schaffen Raum für anspruchsvolles Denken.",
      development: "Fachliche Struktur, Anspruch und Zeitnutzung könnten stärker aufeinander abgestimmt werden."
    }
  ];

  const evidenceCards = visible.filter((card) => card.value === 1 || card.value === 2);
  const developmentCards = visible.filter((card) => card.value === 3 || card.value === 4);
  const evidenceSyntheses = rules
    .map((rule) => synthesisForRule(rule, evidenceCards, "evidence"))
    .filter(Boolean)
    .sort(synthesisSort);
  const developmentSyntheses = rules
    .map((rule) => synthesisForRule(rule, developmentCards, "development"))
    .filter(Boolean)
    .sort(synthesisSort);

  const balanced = [
    ...developmentSyntheses.slice(0, 3),
    ...evidenceSyntheses.slice(0, 3)
  ];
  const remaining = [...developmentSyntheses.slice(3), ...evidenceSyntheses.slice(3)]
    .sort(synthesisSort);

  return [...balanced, ...remaining]
    .slice(0, 6)
    .sort((a, b) => modeOrder(a.mode) - modeOrder(b.mode) || b.weight - a.weight || a.title.localeCompare(b.title, "de"));
}

function synthesisForRule(rule, cards, mode) {
  const matched = cards.filter((card) => rule.areas.includes(card.subcategory.id));
  const representedAreas = new Set(matched.map((card) => card.subcategory.id));
  if (representedAreas.size < rule.minAreas) {
    return null;
  }

  const strongDevelopment = matched.filter((card) => card.value === 4).length;
  const strongEvidence = matched.filter((card) => card.value === 2).length;
  return {
    ...rule,
    synthesisId: `${mode}:${rule.id}`,
    mode,
    cards: matched,
    representedAreas,
    text: mode === "development" ? rule.development : rule.evidence,
    weight: representedAreas.size * 12 + strongDevelopment * 5 + strongEvidence * 4 + matched.length
  };
}

function modeOrder(mode) {
  return mode === "development" ? 0 : 1;
}

function synthesisSort(a, b) {
  return b.weight - a.weight || a.title.localeCompare(b.title, "de");
}

function renderSynthesisCard(synthesis) {
  const color = synthesis.mode === "development" ? "#2369a8" : "#4a9f2f";
  const modeLabel = synthesis.mode === "development" ? "Entwicklungslinie" : "Lerntragende Linie";
  return `
    <article class="synthesis-card ${synthesis.mode}" style="--synthesis-color: ${color}">
      <button class="synthesis-hide" type="button" data-action="hide-synthesis" data-synthesis-id="${synthesis.synthesisId}" aria-label="Zusammenhang ausblenden">×</button>
      <div class="synthesis-topline">
        <span>${synthesis.title}</span>
        <em>${synthesis.cards.length}</em>
      </div>
      <p>${synthesis.text}</p>
      <small>${modeLabel} · ${Array.from(synthesis.representedAreas).join(" · ")}</small>
      <div class="synthesis-detail">
        ${synthesis.cards.map((card) => `
          <p><strong>${keywordFor(card)}:</strong> ${card.item}</p>
        `).join("")}
      </div>
    </article>
  `;
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
    const topic = topicFor(card);
    const key = `${card.value}|${card.subcategory.dimension.id}|${topic.id}`;
    if (!clusters.has(key)) {
      clusters.set(key, {
        key,
        value: card.value,
        state: card.state,
        topic,
        keyword: topic.title,
        dimension: card.subcategory.dimension,
        subcategories: new Map(),
        cards: []
      });
    }
    const cluster = clusters.get(key);
    cluster.cards.push(card);
    cluster.subcategories.set(card.subcategory.id, card.subcategory.title);
  });
  return Array.from(clusters.values()).sort((a, b) =>
    bestPriority(a.cards) - bestPriority(b.cards)
    || a.topic.order - b.topic.order
    || a.keyword.localeCompare(b.keyword, "de")
  );
}

function bestPriority(cards) {
  return Math.min(...cards.map((card) => ({ 4: 0, 3: 1, 2: 0, 1: 1 }[card.value] ?? 9)));
}

function keysFromDataset(value) {
  return String(value ?? "").split("|").filter(Boolean);
}

function nextPriorityValue(value) {
  return value >= 2 ? 0 : value + 1;
}

function priorityLabel(value) {
  return value === 2 ? "++" : value === 1 ? "+" : "+";
}

function keywordFor(card) {
  return topicFor(card).title;
}

function topicFor(card) {
  const text = `${card.subcategory.title} ${card.item}`.toLowerCase();
  const fallbackTitle = card.subcategory.title.replace(/^\d\.\d\s*/, "");
  const rules = [
    { id: "feedback", order: 10, title: "Feedback für Weiterarbeit", evidence: "Rückmeldungen unterstützen die fachliche Weiterarbeit.", development: "Feedback könnte stärker auf fachliche Weiterarbeit ausgerichtet werden.", patterns: ["rückmeldung", "feedback", "fehler", "weiterarbeit"] },
    { id: "denkweisen", order: 20, title: "Denkweisen sichtbar machen", evidence: "Denkweisen, Vorstellungen oder Lösungswege der SuS werden sichtbar.", development: "Denkweisen und Lösungswege könnten gezielter sichtbar gemacht werden.", patterns: ["denkweisen", "vorstellungen", "lösungsans", "lösungswege", "lernstände", "arbeitsergebnisse"] },
    { id: "verstaendnis", order: 30, title: "Verständnis sichern", evidence: "Zentrale Inhalte und Zusammenhänge werden verständnisorientiert geklärt.", development: "Verständnis zentraler Inhalte könnte noch stärker gesichert werden.", patterns: ["verständnis", "inhalte", "zusammenhänge", "lernziel", "lernzielen", "zusammengefasst", "hervorgehoben"] },
    { id: "herausforderung", order: 40, title: "Kognitive Herausforderung", evidence: "Aufgaben und Fragen regen fachliches Denken an.", development: "Aufgaben und Fragen könnten fachlich stärker herausfordern.", patterns: ["aufgaben", "fragen", "reproduktion", "transfer", "widersprüche", "selbsterklärungen", "begründungen", "kontrastierend"] },
    { id: "beteiligung", order: 50, title: "Fachliche Beteiligung", evidence: "Die SuS beteiligen sich fachlich und bleiben am Lernprozess beteiligt.", development: "Fachliche Beteiligung der SuS könnte gezielter aktiviert werden.", patterns: ["beteiligen", "beiträge", "fokussiert", "fragen oder erläutern", "fachlich weiter", "fachliche impulse", "überlegungen"] },
    { id: "unterstuetzung", order: 60, title: "Lernunterstützung", evidence: "Unterstützung orientiert sich an Lernstand und Verständnisproblemen.", development: "Unterstützung könnte stärker am konkreten Lernstand ausgerichtet werden.", patterns: ["unterstützt", "hilfestellungen", "rückfragen", "lernvoraussetzungen", "denk- und antwortzeiten", "lernstand"] },
    { id: "wertschaetzung", order: 70, title: "Wertschätzende Kommunikation", evidence: "Kommunikation verläuft respektvoll und wertschätzend.", development: "Wertschätzende Kommunikation könnte im Gespräch aufgegriffen werden.", patterns: ["wertschätzend", "fair", "respektvoll", "perspektiven"] },
    { id: "zusammenarbeit", order: 80, title: "Zusammenarbeit im Klassenraum", evidence: "Zusammenarbeit und Umgang der SuS unterstützen den Lernprozess.", development: "Zusammenarbeit und Einbezug in Partner- oder Gruppenphasen könnten thematisiert werden.", patterns: ["gruppen", "partner", "einander", "ausreden", "bloß", "gegenseitig"] },
    { id: "stoerungen", order: 90, title: "Störungsarme Lernzeit", evidence: "Der Unterricht verläuft geordnet und störungsarm.", development: "Störungen, Lautstärke oder Regeln könnten stärker lernzeitstützend bearbeitet werden.", patterns: ["störungen", "störungsarm", "lautstärke", "regeln", "abläufe"] },
    { id: "monitoring", order: 100, title: "Präsenz und Monitoring", evidence: "Lern- und Arbeitsprozesse werden sichtbar im Blick behalten.", development: "Monitoring und frühes Reagieren könnten stärker sichtbar werden.", patterns: ["monitoring", "nimmt lern", "präsent", "im blick", "unterstützungsbedarf", "unruhe", "signale", "frühzeitig"] },
    { id: "zeit", order: 110, title: "Zeit und Übergänge", evidence: "Unterrichtszeit wird für fachliche Lernprozesse genutzt.", development: "Zeitnutzung, Übergänge oder Leerlauf könnten in den Blick genommen werden.", patterns: ["zeit", "übergänge", "leerlauf", "materialien", "organisatorische", "bearbeitungs"] }
  ];
  return rules.find((rule) => rule.patterns.some((pattern) => text.includes(pattern)))
    ?? { id: card.subcategory.id, order: 999, title: fallbackTitle, evidence: fallbackTitle, development: fallbackTitle };
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
  const priority = Math.max(...cluster.cards.map((card) => card.meta.priority ?? 0));
  const label = isDevelopment ? cluster.topic.development : cluster.topic.evidence;
  const stateLabel = isDevelopment
    ? `${cluster.value === 4 ? "zentrales" : "mögliches"} Entwicklungspotenzial`
    : cluster.state.label;
  const subcategoryLabel = Array.from(cluster.subcategories.values()).join(" · ");
  return `
    <article class="cluster-card ${cluster.state.className} ${allLocked ? "locked" : ""}" style="--card-color: ${stateColor(cluster.value)}">
      <div class="cluster-topline">
        <span>${cluster.topic.title}</span>
        ${cluster.cards.length > 1 ? `<em>${cluster.cards.length}</em>` : ""}
      </div>
      <small>${stateLabel}</small>
      <div class="card-actions">
        <button type="button" class="priority-button ${priority ? "active" : ""}" data-action="priority-cluster" data-keys="${keys}" title="Priorität">${priorityLabel(priority)}</button>
        <button type="button" data-action="lock-cluster" data-keys="${keys}" title="Fixieren">${allLocked ? "🔒" : "🔓"}</button>
        <button type="button" data-action="hide-cluster" data-keys="${keys}" title="Verwerfen">×</button>
      </div>
      <div class="cluster-detail">
        <p><strong>${label}</strong></p>
        <p>${subcategoryLabel}</p>
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
  session.cardMeta[key].discussionNote ??= "";
  session.cardMeta[key].priority ??= 0;
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
  const info = normalizedObservationInfo(session.observationInfo);
  const phase2ProtocolCards = protocolPhase2Cards();
  if (phase2ProtocolCards.length && !phase2ProtocolCards.some((card) => card.id === activeProtocolCardId)) {
    activeProtocolCardId = phase2ProtocolCards[0].id;
  }
  const activeCard = phase2ProtocolCards.find((card) => card.id === activeProtocolCardId) ?? null;
  protocolContent.innerHTML = `
    <div class="protocol-hero">
      <div>
        <h1>Beobachtungsassistent 1.0</h1>
        <p>Kuratiertes Reflexionsprotokoll. Keine Gesamtbewertung.</p>
      </div>
      <span>${phase2ProtocolCards.length} Gesprächspunkt${phase2ProtocolCards.length === 1 ? "" : "e"}</span>
    </div>
    ${renderProtocolObservationInfo(info)}
    ${phase2ProtocolCards.length ? `
      <div class="protocol-top-row" id="protocolTopRow">
        ${renderProtocolTimeline()}
        <div class="protocol-spider">
          <canvas id="protocolSpiderCanvas"></canvas>
        </div>
        <div id="protocolSpiderItems" class="protocol-spider-items"></div>
      </div>
      <div class="protocol-landscape ${activeCard ? "has-focus" : ""}">
        <section class="protocol-bubbles" aria-label="Protokollierte Gesprächspunkte">
          ${phase2ProtocolCards.map((card, index) => renderProtocolBubble(card, index, activeCard?.id)).join("")}
        </section>
        <aside class="protocol-detail" aria-live="polite">
          ${activeCard ? renderProtocolDetail(activeCard) : `<p class="empty-state">Bubble antippen, um Gesprächsnotizen und Vereinbarungen zu sehen.</p>`}
        </aside>
      </div>
      ${renderProtocolLogbook()}
    ` : `<p class="empty-state">Noch keine thematisierten Karten für das Protokoll ausgewählt.</p>`}
  `;
  bindProtocolLandscape();
  renderProtocolSpiderChart();
}

function renderProtocolSpiderChart() {
  const canvas = document.querySelector("#protocolSpiderCanvas");
  if (!canvas) return;
  if (protocolSpiderChart) {
    protocolSpiderChart.destroy();
    protocolSpiderChart = null;
  }
  const entries = subcategories.map((subcategory) => ({
    shortLabel: subcategory.id.replace(/-/g, "."),
    title: subcategory.title,
    subcategory,
    ...subcategoryStats(subcategory)
  }));
  if (!entries.length) return;
  const dimensionRanges = dimensionAnnotations();
  protocolSpiderChart = new Chart(canvas, {
    type: "radar",
    data: {
      labels: entries.map((e) => e.shortLabel),
      datasets: [
        {
          data: entries.map((e) => Number(e.evidenceValue.toFixed(3))),
          borderColor: "#32895a",
          backgroundColor: "rgba(50, 137, 90, 0.18)",
          pointBackgroundColor: "#32895a",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          borderWidth: 2,
          spanGaps: false
        },
        {
          data: entries.map((e) => Number(e.developmentValue.toFixed(3))),
          borderColor: "#7b4bb2",
          backgroundColor: "rgba(123, 75, 178, 0.13)",
          pointBackgroundColor: "#7b4bb2",
          pointBorderColor: "#ffffff",
          pointRadius: 4,
          borderWidth: 2,
          spanGaps: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: { duration: 0 },
      layout: { padding: 16 },
      scales: {
        r: {
          min: 0, max: 1,
          ticks: { stepSize: 0.5, backdropColor: "transparent", color: "#69787f", callback: (v) => `${v}` },
          pointLabels: { color: "rgba(38,56,64,0.75)", font: { size: 9, weight: 700 } },
          grid: { color: "#d9e2e3" },
          angleLines: { color: "#d9e2e3", lineWidth: 1 }
        }
      },
      plugins: {
        legend: { display: false },
        dimensionBands: { ranges: dimensionRanges },
        tooltip: {
          callbacks: {
            title: (items) => entries[items[0].dataIndex]?.title ?? "",
            label: () => "Antippen für Items"
          }
        }
      },
      onClick: (event, elements) => {
        const index = elements[0]?.index;
        if (Number.isInteger(index) && entries[index]) {
          renderProtocolSpiderItemList(entries[index].subcategory);
        }
      },
      onHover: (event, elements) => {
        canvas.style.cursor = elements.length ? "pointer" : "default";
      }
    }
  });
}

function renderProtocolSpiderItemList(subcategory) {
  const panel = document.querySelector("#protocolSpiderItems");
  if (!panel) return;
  const items = subcategory.items.map((text, index) => {
    const key = itemKey(subcategory.id, index);
    const value = visualItemValue(key);
    const state = states[value];
    if (value === 0) return null;
    return `<div class="spider-item-row ${state.className}">
      <span class="spider-item-dot"></span>
      <span class="spider-item-text">${escapeHtml(text)}</span>
    </div>`;
  }).filter(Boolean);

  panel.innerHTML = `
    <div class="spider-items-header">
      <strong>${escapeHtml(subcategory.title)}</strong>
      <button class="spider-items-close" type="button">×</button>
    </div>
    ${items.length
      ? items.join("")
      : `<p class="spider-items-empty">Keine Items markiert</p>`}
  `;
  panel.classList.add("visible");
  document.querySelector("#protocolTopRow")?.classList.add("with-items");
  panel.querySelector(".spider-items-close").addEventListener("click", () => {
    panel.classList.remove("visible");
    panel.innerHTML = "";
    document.querySelector("#protocolTopRow")?.classList.remove("with-items");
  });
}

function protocolPhase2Cards() {
  const board = getPhase2Board({ includeOpen: false });
  const generated = (board?.cards ?? []).filter((card) => {
    const meta = cardMeta(card.id);
    return !meta.archived
      && !meta.hidden
      && protocolMetaIncluded(meta);
  });
  const custom = discussionCustomCards().filter((card) => {
    const meta = cardMeta(card.id);
    return protocolMetaIncluded(meta);
  });
  return [...generated, ...custom].sort((a, b) => directionRank(a.direction) - directionRank(b.direction) || (b.priority ?? 0) - (a.priority ?? 0));
}

function protocolMetaIncluded(meta) {
  if (meta.includeInProtocol === false) {
    return false;
  }
  return meta.discussed === true
    || meta.protocolled === true
    || meta.includeInProtocol === true
    || meta.status === "thematisiert"
    || meta.status === "angesprochen"
    || meta.status === "logbuch";
}

function protocolCardKind(card) {
  if (card.direction === "positive") {
    return "positive";
  }
  if (card.direction === "mixed") {
    return "mixed";
  }
  if (card.direction === "free" || card.direction === "open") {
    return "free";
  }
  return "development";
}

function protocolCardTime(card, index = 0) {
  const times = (card.evidence ?? [])
    .map((entry) => entry.timestamp ?? liveEventById(entry.id)?.timestamp)
    .filter(Boolean)
    .map((value) => new Date(value).getTime())
    .filter(Number.isFinite);
  return times.length ? Math.min(...times) : Date.now() + index * 60000;
}

function protocolCardIntensity(card) {
  const evidenceCount = Math.max(1, (card.evidence ?? []).length);
  const priority = Number(card.priority ?? 0);
  return Math.max(1, Math.min(5, Math.round(priority / 22) + Math.min(2, evidenceCount - 1)));
}

function renderProtocolTimeline() {
  const allObs = session.rawObservations ?? [];
  const colored = allObs.filter((obs) => obs.valence === "positive" || obs.valence === "development");
  const width = 960;
  const height = 76;
  const baseline = 38;
  const margin = 16;
  const barW = 7;
  const barH = 28;

  let minTime, maxTime;
  const timing = lessonTimingConfig();
  if (timing?.startTime) {
    minTime = new Date(timing.startTime).getTime();
    maxTime = timing.endTime
      ? new Date(timing.endTime).getTime()
      : minTime + Math.max(1, Number(timing.durationMinutes) || 45) * 60000;
  } else if (allObs.length) {
    const times = allObs.map((obs) => new Date(obs.timestamp).getTime()).filter(Number.isFinite);
    minTime = Math.min(...times);
    maxTime = Math.max(...times);
  } else {
    minTime = Date.now() - 2700000;
    maxTime = Date.now();
  }
  const spread = Math.max(1, maxTime - minTime);

  const positiveCount = colored.filter((o) => o.valence === "positive").length;
  const developmentCount = colored.filter((o) => o.valence === "development").length;

  const bars = colored.map((obs) => {
    const t = new Date(obs.timestamp).getTime();
    const ratio = Math.max(0, Math.min(1, (t - minTime) / spread));
    const x = margin + ratio * (width - margin * 2);
    const isPositive = obs.valence === "positive";
    return `
      <rect class="timeline-bar ${isPositive ? "positive" : "development"}"
        x="${x - barW / 2}" y="${isPositive ? baseline + 1 : baseline - barH}"
        width="${barW}" height="${barH}" rx="${barW / 2}">
        <title>${escapeHtml(obs.text)}</title>
      </rect>`;
  }).join("");

  return `
    <section class="protocol-timeline-card" aria-label="Beobachtungsverlauf">
      <div class="protocol-section-title">
        <h2>Verlauf</h2>
        <span>${positiveCount > 0 ? `${positiveCount}× grün` : ""}${positiveCount > 0 && developmentCount > 0 ? " · " : ""}${developmentCount > 0 ? `${developmentCount}× blau` : ""}${colored.length === 0 ? "keine bewerteten Beobachtungen" : ""}</span>
      </div>
      <svg class="protocol-timeline" viewBox="0 0 ${width} ${height}" role="img" aria-label="Verlauf der Beobachtungen">
        <line class="timeline-axis" x1="${margin}" y1="${baseline}" x2="${width - margin}" y2="${baseline}"></line>
        ${bars}
      </svg>
    </section>
  `;
}

function protocolTimelineBounds(cards) {
  const timing = lessonTimingConfig();
  if (timing?.startTime) {
    const minTime = new Date(timing.startTime).getTime();
    const endTime = timing.endTime
      ? new Date(timing.endTime).getTime()
      : minTime + Math.max(1, Number(timing.durationMinutes) || 45) * 60000;
    if (Number.isFinite(minTime) && Number.isFinite(endTime) && endTime > minTime) {
      return { minTime, maxTime: endTime };
    }
  }
  const times = cards.map(protocolCardTime);
  return {
    minTime: Math.min(...times),
    maxTime: Math.max(...times)
  };
}

function renderProtocolBubble(card, index, activeId) {
  const meta = cardMeta(card.id);
  const kind = protocolCardKind(card);
  const size = Math.max(118, Math.min(210, 104 + protocolCardIntensity(card) * 18));
  const active = card.id === activeId;
  return `
    <button class="protocol-bubble ${kind} ${active ? "active" : ""}" type="button" data-protocol-focus="${escapeHtml(card.id)}" style="--bubble-size: ${size}px; --bubble-delay: ${Math.min(index, 8) * 18}ms">
      <span>${escapeHtml(card.title)}</span>
      <em>${escapeHtml(statusLabel(meta.status || "thematisiert"))}</em>
    </button>
  `;
}

function noteTypeLabel(type) {
  if (type === "agreement") return "Vereinbarung";
  if (type === "plg") return "PLG-Aufgabe";
  return "Gesprächsnotiz";
}

function renderProtocolDetail(card) {
  const meta = cardMeta(card.id);
  const title = meta.customTitle ?? card.title;
  const evidence = (card.evidence ?? []).slice(0, 4);
  const dimensionTags = [...new Set(
    (card.itemIds ?? []).filter(Boolean).map((id) => id.split(".").slice(0, 2).join("."))
  )];
  const phaseTags = (card.phases ?? []).filter(Boolean);
  const notes = meta.discussionNotes ?? [];
  const hints = evidence.map((entry) => {
    const obs = liveEventById(entry.id);
    return obs?.hintText || obs?.professionalHint || "";
  });
  const hasHints = hints.some(Boolean);
  return `
    <article class="protocol-detail-card ${protocolCardKind(card)}">
      <h3 class="protocol-card-title">${escapeHtml(title)}</h3>
      ${!meta.impulseHidden && card.impulse ? `
        <div class="protocol-detail-impulse"><strong>Impuls</strong><p>${escapeHtml(card.impulse)}</p></div>
      ` : ""}
      ${evidence.length ? `
        <div class="protocol-detail-evidence">
          <strong>Beobachtungsnotizen aus dem Unterricht</strong>
          <div class="evidence-block">
            <em class="evidence-sub-label">Beobachtung</em>
            ${evidence.map((entry, i) => `<blockquote>${escapeHtml(meta.evidenceEdits?.[i] ?? entry.text ?? "")}${renderEvidenceSketch(entry, "protocol-sketch-thumb")}</blockquote>`).join("")}
          </div>
          <div class="evidence-block">
            <em class="evidence-sub-label">Hinweise</em>
            ${hasHints ? hints.filter(Boolean).map((h) => `<blockquote>${escapeHtml(h)}</blockquote>`).join("") : `<span class="evidence-none">keine</span>`}
          </div>
        </div>
      ` : ""}
      ${(dimensionTags.length || phaseTags.length) ? `
        <div class="protocol-detail-tags">
          ${dimensionTags.length ? `<span class="tag-section-label">Dimensionen</span>` : ""}
          ${dimensionTags.map((d) => `<span>${escapeHtml(d)}</span>`).join("")}
          ${phaseTags.map((p) => `<span>${escapeHtml(p)}</span>`).join("")}
        </div>
      ` : ""}
      ${notes.filter((n) => (n.text ?? "").trim()).length ? `
        <div class="protocol-discussion-notes">
          ${notes.filter((n) => (n.text ?? "").trim()).map((note) => `
            <div class="discussion-note-item ${note.type ?? "conversation"}">
              <span class="note-type-label">${noteTypeLabel(note.type)}</span>
              <p class="note-item-text">${escapeHtml(note.text)}</p>
            </div>
          `).join("")}
        </div>
      ` : ""}
    </article>
  `;
}

function bindProtocolLandscape() {
  protocolContent.querySelectorAll("[data-protocol-focus]").forEach((element) => {
    element.addEventListener("click", () => {
      const id = element.dataset.protocolFocus;
      activeProtocolCardId = activeProtocolCardId === id ? null : id;
      renderProtocol();
    });
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        element.click();
      }
    });
  });
}

function renderProtocolPhase2List(cards) {
  if (!cards.length) {
    return `<p>Keine Karten ausgewählt.</p>`;
  }
  return `
    <ul class="protocol-list">
      ${cards.map((card) => `
        <li>
          <strong>${escapeHtml(card.title)}</strong><br>
          ${escapeHtml(card.statement ?? "")}<br>
          ${(card.evidence ?? []).slice(0, 2).map((observation) => `${escapeHtml(observation.text ?? "")}${renderEvidenceSketch(observation, "protocol-sketch-thumb")}`).join("<br>")}
          ${cardMeta(card.id).discussionNote ? `<br><em>${escapeHtml(cardMeta(card.id).discussionNote)}</em>` : ""}
        </li>
      `).join("")}
    </ul>
  `;
}

function renderProtocolRawList(clusters) {
  if (!clusters.length) {
    return `<p>Keine Karten ausgewählt.</p>`;
  }
  return `
    <ul class="protocol-list">
      ${clusters.map((cluster) => `
        <li>
          <strong>${escapeHtml(cluster.subcategory ? cluster.subcategory.title : "Freie professionelle Beobachtung")}</strong><br>
          ${escapeHtml(shortInterpretation(cluster))}<br>
          ${cluster.observations.slice(0, 2).map((observation) => escapeHtml(observation.text)).join("<br>")}
        </li>
      `).join("")}
    </ul>
  `;
}

function renderProtocolObservationInfo(info) {
  const rows = [
    ["Datum", formatDate(info.date)],
    ["Ort", info.place],
    ["Name", info.name],
    ["Lerngruppe", info.group]
  ].filter(([, value]) => value);

  if (!rows.length) {
    return "";
  }

  return `
    <dl class="protocol-meta">
      ${rows.map(([label, value]) => `
        <div>
          <dt>${label}</dt>
          <dd>${escapeHtml(value)}</dd>
        </div>
      `).join("")}
    </dl>
  `;
}

function formatDate(value) {
  if (!value) {
    return "";
  }
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}.${month}.${year}` : value;
}

function formatTime(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function renderProtocolList(cards, customCards = []) {
  if (!cards.length && !customCards.length) {
    return `<p>Keine Karten ausgewählt.</p>`;
  }
  const itemRows = cards.map((card) => `
    <li>
      <strong>${keywordFor(card)}</strong><br>
      ${escapeHtml(card.meta.note || card.meta.observationNote || card.item)}
    </li>
  `).join("");
  const customRows = customCards.map((card) => `
    <li>
      <strong>${escapeHtml(card.title)}</strong><br>
      ${escapeHtml(card.note || "")}
    </li>
  `).join("");
  return `<ul class="protocol-list">${itemRows}${customRows}</ul>`;
}

function renderProtocolLogbook() {
  const entries = session.logbook ?? [];
  if (!entries.length) {
    return "";
  }
  return `
    <h2>Logbuch</h2>
    <ul class="protocol-list">
      ${entries.slice().reverse().map((entry) => `
        <li>
          <strong>${new Date(entry.createdAt).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}${entry.heading ? ` · ${escapeHtml(entry.heading)}` : ""}</strong><br>
          ${entry.duration ? `<em>Zeitvorgabe:</em> ${escapeHtml(entry.duration)}<br>` : ""}
          ${entry.observation ? `<em>Beobachtungen:</em> ${escapeHtml(entry.observation)}<br>` : ""}
          ${entry.alternative ? `<em>Alternativen/Hinweise:</em> ${escapeHtml(entry.alternative)}<br>` : ""}
          ${(entry.groups ?? []).map((group) => `<em>${escapeHtml(group.label)}:</em> ${escapeHtml(group.note)}`).join("<br>")}
          ${(entry.quotes ?? []).map((quote) => `<em>${logTypeLabel(quote.type)}${quote.name ? ` · ${escapeHtml(quote.name)}` : ""}:</em> ${escapeHtml(quote.text)}${quote.hint ? ` (${escapeHtml(quote.hint)})` : ""}`).join("<br>")}
        </li>
      `).join("")}
    </ul>
  `;
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
      const value = visualItemValue(itemKey(subcategory.id, index));
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
  const confirmed = confirmedRawObservations();
  const rawEvidence = confirmed.reduce((sum, observation) => sum + liveScoreForSubcategory(observation, subcategory.id, "positive"), 0);
  const rawDevelopment = confirmed.reduce((sum, observation) => sum + liveScoreForSubcategory(observation, subcategory.id, "development"), 0);
  const evidenceScoreSum = values.reduce((sum, value) => sum + (states[value]?.evidenceScore ?? 0), 0) + rawEvidence;
  const developmentScoreSum = values.reduce((sum, value) => sum + (states[value]?.developmentScore ?? 0), 0) + rawDevelopment;
  const maxScore = Math.max(subcategory.items.length * 2, evidenceScoreSum, developmentScoreSum, 2);
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

function confirmedRawObservations() {
  return (session.rawObservations ?? []).filter((observation) =>
    !observation.archived
    && !observation.excluded
    && observation.status !== "excluded"
    && (
      Object.values(observation.decisions ?? {}).some((decision) => ["positive", "development"].includes(decision.valence))
      || (observation.valence !== "free" && observation.confirmedItemIds?.length)
    )
  );
}

function liveScoreForSubcategory(observation, subcategoryId, valence) {
  const decisions = Object.values(observation.decisions ?? {});
  if (decisions.length) {
    return decisions
      .filter((decision) => decision.valence === valence && itemParentId(decision.itemId) === subcategoryId)
      .reduce((sum, decision) => sum + Math.max(1, decision.strength ?? 1), 0);
  }
  return (observation.valence === valence && (observation.confirmedItemIds ?? []).some((id) => itemParentId(id) === subcategoryId))
    ? 1
    : 0;
}

function itemParentId(itemId) {
  const text = String(itemId ?? "");
  if (/^\d-\d$/.test(text)) {
    return text;
  }
  const match = text.match(/^(\d)[.-](\d)/);
  return match ? `${match[1]}-${match[2]}` : text;
}

function getActiveSubcategory() {
  return subcategories.find((subcategory) => subcategory.id === activeSubcategoryId) ?? subcategories[0];
}

function itemKey(subcategoryId, index) {
  return `${subcategoryId}:${index}`;
}

function visualItemValue(key) {
  const manualValue = session.observations?.[key] ?? 0;
  if (manualValue) {
    return manualValue;
  }
  return liveDecisionStatsForItemKey(key).visualValue;
}

function liveDecisionStatsForItemKey(key) {
  const target = itemKeyToHeuristicId(key);
  const stats = { positive: 0, development: 0, total: 0, visualValue: 0 };
  (session.rawObservations ?? []).forEach((observation) => {
    if (observation.excluded || observation.archived || observation.status === "excluded") {
      return;
    }
    Object.values(observation.decisions ?? {}).forEach((decision) => {
      if (!decisionItemMatchesKey(decision.itemId, target)) {
        return;
      }
      if (decision.valence === "positive") {
        stats.positive += Math.max(1, decision.strength ?? 1);
      }
      if (decision.valence === "development") {
        stats.development += Math.max(1, decision.strength ?? 1);
      }
    });
  });
  stats.total = stats.positive + stats.development;
  if (stats.development > stats.positive) {
    stats.visualValue = stats.development > 1 ? 4 : 3;
  } else if (stats.positive > 0) {
    stats.visualValue = stats.positive > 1 ? 2 : 1;
  } else if (stats.development > 0) {
    stats.visualValue = stats.development > 1 ? 4 : 3;
  }
  return stats;
}

function itemKeyToHeuristicId(key) {
  const [subcategoryId, indexText] = String(key ?? "").split(":");
  const itemNumber = Number(indexText) + 1;
  return `${String(subcategoryId ?? "").replace("-", ".")}.${itemNumber}`;
}

function decisionItemMatchesKey(itemId, targetId) {
  return normalizeItemDecisionId(itemId) === targetId;
}

function normalizeItemDecisionId(itemId) {
  const text = String(itemId ?? "").trim();
  const keyMatch = text.match(/^(\d)-(\d):(\d+)$/);
  if (keyMatch) {
    return `${keyMatch[1]}.${keyMatch[2]}.${Number(keyMatch[3]) + 1}`;
  }
  const dotted = text.match(/^(\d)[.-](\d)[.-](\d+)$/);
  if (dotted) {
    return `${dotted[1]}.${dotted[2]}.${Number(dotted[3])}`;
  }
  return text.replaceAll("-", ".");
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
  clean.observationInfo = normalizedObservationInfo(candidate.observationInfo);
  Object.keys(clean.observations).forEach((key) => {
    const value = Number(candidate.observations?.[key] ?? 0);
    clean.observations[key] = [0, 1, 2, 3, 4].includes(value) ? value : 0;
  });
  clean.cardMeta = candidate.cardMeta ?? {};
  clean.rawObservations = Array.isArray(candidate.rawObservations) ? candidate.rawObservations : [];
  clean.lessonTiming = candidate.lessonTiming ?? null;
  clean.condensationCards = candidate.condensationCards ?? {};
  clean.customCards = Array.isArray(candidate.customCards) ? candidate.customCards : [];
  clean.logbook = Array.isArray(candidate.logbook) ? candidate.logbook : [];
  clean.hiddenSyntheses = Array.isArray(candidate.hiddenSyntheses) ? candidate.hiddenSyntheses : [];
  clean.synthesisRequested = Boolean(candidate.synthesisRequested);
  return clean;
}

function exportSession() {
  const blob = sessionJsonBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sessionFileName();
  link.click();
  URL.revokeObjectURL(url);
  updateSaveState("Export vorbereitet");
}

function sessionJsonBlob() {
  persistSession();
  return new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
}

function sessionFileName() {
  const info = normalizedObservationInfo(session.observationInfo);
  const datePart = info.date || new Date().toISOString().slice(0, 10);
  return `beobachtungsassistent-${datePart}.json`;
}

function exportChartImage() {
  if (observeMode === "single") {
    alert("Im Single Modus gibt es kein Spider-Web. Wechsle in den Multimodus.");
    return;
  }
  const canvas = document.querySelector("#radarChart");
  if (!canvas) {
    return;
  }
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `spider-web-${new Date().toISOString().slice(0, 10)}.png`;
  link.click();
  updateSaveState("Spider-Web gesichert");
}

async function shareSummary() {
  const blob = sessionJsonBlob();
  const file = new File([blob], sessionFileName(), { type: "application/json" });

  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({
        title: "Beobachtungsassistent 1.0",
        text: "JSON-Beobachtung für den schreibgeschützten Reader.",
        files: [file]
      });
      updateSaveState("JSON teilen geöffnet");
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = sessionFileName();
  link.click();
  URL.revokeObjectURL(url);
  updateSaveState("JSON-Datei vorbereitet");
  alert("Das Teilen-Menü kann hier keine JSON-Datei übergeben. Die JSON wurde als Datei gesichert und kann im Reader geöffnet werden.");
}

async function exportCuratedProtocolHtml() {
  const cards = protocolPhase2Cards();
  if (!cards.length) {
    alert("Es gibt noch keine thematisierten Karten für ein Protokoll.");
    return;
  }
  const html = buildCuratedProtocolHtml(makeProtocolReaderData(cards));
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const fileName = protocolReaderFileName();
  const file = new File([blob], fileName, { type: "text/html" });

  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({
        title: "Protokoll Beobachtungsassistent 1.0",
        text: "Kuratiertes Reflexionsprotokoll als offline lesbare HTML-Datei.",
        files: [file]
      });
      updateSaveState("Protokoll teilen geöffnet");
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  updateSaveState("Protokoll-HTML vorbereitet");
}

function makeProtocolReaderData(cards) {
  const info = normalizedObservationInfo(session.observationInfo);
  return {
    title: "Beobachtungsassistent 1.0",
    subtitle: "Kuratiertes Reflexionsprotokoll",
    createdAt: new Date().toISOString(),
    observationInfo: info,
    lessonTiming: lessonTimingConfig(),
    chartImage: currentChartImageDataUrl(),
    cards: cards.map(protocolCardPublicData)
  };
}

function protocolCardPublicData(card) {
  const meta = cardMeta(card.id);
  return {
    id: card.id,
    title: card.title ?? "Gesprächspunkt",
    kind: protocolCardKind(card),
    statement: card.statement ?? "",
    impulse: card.impulse ?? "",
    status: statusLabel(meta.status || "thematisiert"),
    discussionNote: meta.discussionNote || meta.note || "",
    itemIds: (card.itemIds ?? []).filter(Boolean),
    phases: (card.phases ?? []).filter(Boolean),
    intensity: protocolCardIntensity(card),
    time: protocolCardTime(card),
    evidence: (card.evidence ?? []).slice(0, 4).map((entry) => ({
      text: entry.text ?? "",
      timestamp: entry.timestamp ?? liveEventById(entry.id)?.timestamp ?? "",
      phase: entry.phase ?? "",
      socialForm: entry.socialForm ?? "",
      sketchDataUrl: evidenceSketchImage(entry)
    }))
  };
}

function protocolReaderFileName() {
  const info = normalizedObservationInfo(session.observationInfo);
  const datePart = info.date || new Date().toISOString().slice(0, 10);
  const namePart = (info.name || "protokoll").toLowerCase().replace(/[^a-z0-9äöüß-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `protokoll-${namePart || "beobachtung"}-${datePart}.html`;
}

function buildCuratedProtocolHtml(data) {
  const payload = JSON.stringify(data).replace(/</g, "\\u003c");
  return `<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(data.subtitle)}</title>
  <style>
    :root { --text:#162127; --muted:#5f6c73; --line:#d9e3e6; --surface:#ffffff; --bg:#f4f7f7; --green:#4a9f2f; --green-soft:#edf8e9; --blue:#2369a8; --blue-soft:#e7f2ff; --mixed:#7a6ea8; --shadow:0 18px 54px rgba(25,39,45,.10); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    * { box-sizing:border-box; }
    body { margin:0; background:var(--bg); color:var(--text); }
    main { max-width:1180px; margin:0 auto; padding:28px; }
    h1,h2,p { margin-top:0; }
    .hero,.card,.timeline-card,.detail { background:var(--surface); border:1px solid var(--line); border-radius:18px; box-shadow:var(--shadow); }
    .hero { padding:24px; margin-bottom:18px; }
    .hero p { color:var(--muted); font-weight:750; }
    .meta { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; margin:16px 0 18px; }
    .meta div { background:#fff; border:1px solid var(--line); border-radius:14px; padding:10px 12px; }
    .meta span { display:block; color:var(--muted); font-size:.78rem; font-weight:850; }
    .timeline-card { padding:16px; margin-bottom:18px; overflow:hidden; }
    svg { width:100%; height:auto; display:block; }
    .axis { stroke:#cad8dc; stroke-width:3; stroke-linecap:round; }
    .marker rect,.marker circle { cursor:pointer; transition:opacity .18s ease, transform .18s ease; transform-origin:center; }
    .marker.positive rect,.marker.positive circle { fill:var(--green); }
    .marker.development rect,.marker.development circle { fill:var(--blue); }
    .marker.mixed rect,.marker.mixed circle { fill:var(--mixed); }
    .marker.free rect,.marker.free circle { fill:#879198; }
    .landscape { display:grid; grid-template-columns:minmax(0,1fr) minmax(300px,390px); gap:18px; align-items:start; }
    .bubbles { min-height:420px; display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:18px; align-items:center; padding:18px; }
    .bubble { min-height:var(--bubble-size); border:1px solid var(--line); border-radius:999px; padding:18px; box-shadow:var(--shadow); color:var(--text); font:inherit; font-weight:900; cursor:pointer; transition:transform .18s ease, opacity .18s ease, box-shadow .18s ease; }
    .bubble span { display:block; line-height:1.08; }
    .bubble em { display:block; margin-top:8px; color:var(--muted); font-size:.78rem; font-style:normal; }
    .bubble.positive { background:var(--green-soft); border-left:8px solid var(--green); }
    .bubble.development { background:var(--blue-soft); border-left:8px solid var(--blue); }
    .bubble.mixed { background:#f5f0ff; border-left:8px solid var(--mixed); }
    .bubble.free { background:#f5f7f7; border-left:8px solid #879198; }
    .bubble.active { transform:scale(1.04); box-shadow:0 24px 70px rgba(25,39,45,.15); }
    .landscape.has-focus .bubble:not(.active) { opacity:.46; transform:scale(.96); }
    .detail { padding:20px; position:sticky; top:18px; }
    .detail.positive { background:var(--green-soft); border-left:8px solid var(--green); }
    .detail.development { background:var(--blue-soft); border-left:8px solid var(--blue); }
    .detail.mixed { background:#f5f0ff; border-left:8px solid var(--mixed); }
    .detail.free { background:#f5f7f7; border-left:8px solid #879198; }
    blockquote { margin:8px 0; padding:10px 12px; background:rgba(255,255,255,.82); border-radius:12px; font-weight:760; }
    .thumb { display:block; max-width:220px; max-height:140px; object-fit:contain; margin-top:8px; border:1px solid var(--line); border-radius:10px; background:#fff; }
    .tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    .tags span { border:1px solid var(--line); background:#fff; border-radius:999px; padding:6px 10px; color:var(--muted); font-weight:800; }
    @media (max-width:820px) { main{padding:16px;} .meta{grid-template-columns:1fr 1fr;} .landscape{grid-template-columns:1fr;} .detail{position:static;} }
    @media (prefers-reduced-motion: reduce) { * { transition:none !important; } }
  </style>
</head>
<body>
  <main id="reader"></main>
  <script>window.PROTOCOL_DATA=${payload};</script>
  <script>
    const data = window.PROTOCOL_DATA;
    const htmlEscape = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
    let activeId = data.cards[0]?.id ?? null;
    function timeOf(card, index) { return Number(card.time) || Date.now() + index * 60000; }
    function renderMeta(info) {
      const rows = [["Datum", info.date], ["Ort", info.place], ["Name", info.name], ["Lerngruppe", info.group]].filter(([, value]) => value);
      return rows.length ? '<section class="meta">' + rows.map(([label, value]) => '<div><span>' + htmlEscape(label) + '</span><strong>' + htmlEscape(value) + '</strong></div>').join("") + '</section>' : "";
    }
    function timelineBounds(cards) {
      if (data.lessonTiming?.startTime) {
        const start = new Date(data.lessonTiming.startTime).getTime();
        const end = data.lessonTiming.endTime ? new Date(data.lessonTiming.endTime).getTime() : start + Math.max(1, Number(data.lessonTiming.durationMinutes) || 45) * 60000;
        if (Number.isFinite(start) && Number.isFinite(end) && end > start) return { min: start, max: end };
      }
      const times = cards.map(timeOf);
      return { min: Math.min(...times), max: Math.max(...times) };
    }
    function renderTimeline(cards) {
      const width = 960, height = 170, baseline = 85, margin = 46;
      const bounds = timelineBounds(cards);
      const min = bounds.min, max = bounds.max, spread = Math.max(1, max - min), single = max === min;
      const markers = cards.map((card, index) => {
        const ratio = Math.max(0, Math.min(1, (timeOf(card, index) - min) / spread));
        const x = single ? margin + (cards.length === 1 ? .5 : index / Math.max(1, cards.length - 1)) * (width - margin * 2) : margin + ratio * (width - margin * 2);
        const h = 20 + Math.max(1, Math.min(5, Number(card.intensity) || 1)) * 11;
        const positive = card.kind === "positive" || card.kind === "mixed";
        const development = card.kind === "development" || card.kind === "mixed";
        return '<g class="marker ' + htmlEscape(card.kind) + '" data-id="' + htmlEscape(card.id) + '">'
          + (development ? '<rect x="' + (x - 8) + '" y="' + (baseline - h) + '" width="16" height="' + h + '" rx="8"></rect>' : '')
          + (positive ? '<rect x="' + (x - 8) + '" y="' + baseline + '" width="16" height="' + h + '" rx="8"></rect>' : '')
          + '<circle cx="' + x + '" cy="' + baseline + '" r="7"></circle><title>' + htmlEscape(card.title) + '</title></g>';
      }).join("");
      return '<section class="timeline-card"><h2>Verlauf</h2><svg viewBox="0 0 ' + width + ' ' + height + '"><line class="axis" x1="' + margin + '" y1="' + baseline + '" x2="' + (width - margin) + '" y2="' + baseline + '"></line>' + markers + '</svg></section>';
    }
    function renderDetail(card) {
      if (!card) return '<aside class="detail"><p>Bubble antippen.</p></aside>';
      return '<aside class="detail ' + htmlEscape(card.kind) + '"><h2>' + htmlEscape(card.title) + '</h2><p>' + htmlEscape(card.statement) + '</p>'
        + (card.impulse ? '<strong>Impuls</strong><p>' + htmlEscape(card.impulse) + '</p>' : '')
        + (card.discussionNote ? '<strong>Gesprächsnotiz / Vereinbarung</strong><p>' + htmlEscape(card.discussionNote) + '</p>' : '')
        + (card.evidence?.length ? '<strong>Evidenzen</strong>' + card.evidence.map((entry) => '<blockquote>' + htmlEscape(entry.text) + (entry.sketchDataUrl ? '<img class="thumb" src="' + htmlEscape(entry.sketchDataUrl) + '" alt="Skizze">' : '') + '</blockquote>').join("") : '')
        + '<div class="tags">' + [...(card.itemIds || []), ...(card.phases || [])].map((tag) => '<span>' + htmlEscape(tag) + '</span>').join("") + '</div></aside>';
    }
    function render() {
      const active = data.cards.find((card) => card.id === activeId);
      document.querySelector("#reader").innerHTML = '<section class="hero"><h1>' + htmlEscape(data.title) + '</h1><p>' + htmlEscape(data.subtitle) + '</p></section>'
        + renderMeta(data.observationInfo || {}) + renderTimeline(data.cards)
        + '<section class="landscape ' + (active ? 'has-focus' : '') + '"><div class="bubbles">' + data.cards.map((card) => '<button class="bubble ' + htmlEscape(card.kind) + (card.id === activeId ? ' active' : '') + '" data-id="' + htmlEscape(card.id) + '" style="--bubble-size:' + Math.max(118, Math.min(210, 104 + (Number(card.intensity) || 1) * 18)) + 'px"><span>' + htmlEscape(card.title) + '</span><em>' + htmlEscape(card.status) + '</em></button>').join("") + '</div>' + renderDetail(active) + '</section>'
        + (data.chartImage ? '<details style="margin-top:18px"><summary>Spider-Web anzeigen</summary><img style="max-width:460px;width:100%;display:block;margin-top:12px" src="' + htmlEscape(data.chartImage) + '" alt="Spider-Web"></details>' : '');
      document.querySelectorAll("[data-id]").forEach((node) => node.addEventListener("click", () => { activeId = activeId === node.dataset.id ? null : node.dataset.id; render(); }));
    }
    render();
  </script>
</body>
</html>`;
}

function buildShareText() {
  const info = normalizedObservationInfo(session.observationInfo);
  const visibleCards = markedItems().filter((card) => !card.meta.hidden).sort(cardSort);
  const evidence = visibleCards.filter((card) => card.value === 1 || card.value === 2);
  const development = visibleCards.filter((card) => card.value === 3 || card.value === 4);
  return [
    "Beobachtungsassistent 1.0",
    "Strukturierte Gesprächsgrundlage, keine Gesamtbewertung.",
    observationInfoText(info),
    "",
    "Lerntragende Wirkungen",
    shareSection(evidence, customCardsByType("evidence")),
    "",
    "Entwicklungspotenziale",
    shareSection(development, customCardsByType("development"))
  ].join("\n");
}

function observationInfoText(info) {
  const parts = [
    info.date ? `Datum: ${formatDate(info.date)}` : "",
    info.place ? `Ort: ${info.place}` : "",
    info.name ? `Name: ${info.name}` : "",
    info.group ? `Lerngruppe: ${info.group}` : ""
  ].filter(Boolean);
  return parts.join(" · ");
}

function shareSection(cards, customCards = []) {
  if (!cards.length && !customCards.length) {
    return "Keine Karten ausgewählt.";
  }

  const clustered = clusterCards(cards).map((cluster) => {
    const isDevelopment = cluster.value === 3 || cluster.value === 4;
    const lines = [
      `- ${cluster.topic.title} (${cluster.cards.length}): ${isDevelopment ? cluster.topic.development : cluster.topic.evidence}`,
      `  ${Array.from(cluster.subcategories.values()).join(" · ")}`
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
  });
  const custom = customCards.map((card) => `- ${card.title}\n  ${card.note || ""}`);
  return [...clustered, ...custom].join("\n");
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
