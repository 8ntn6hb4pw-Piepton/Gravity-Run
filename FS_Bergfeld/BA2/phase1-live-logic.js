/*
  Phase-1 live observation logic.
  No UI: this module only turns fast classroom notes into reviewable events.
  The system suggests possible UFB item links, but only human tap decisions
  become confirmed observations for Phase 2.
*/

(function attachPhase1LiveLogic(root) {
  const itemHeuristics = (() => {
    if (typeof module !== "undefined" && module.exports) {
      try {
        require("./text-normalization.js");
        const base = require("./item-heuristics.js");
        require("./item-heuristics-extended.js");
        return base;
      } catch (_error) {
        return root;
      }
    }
    return root;
  })();

  const learning = (() => {
    if (typeof module !== "undefined" && module.exports) {
      try {
        return require("./learning-profile.js");
      } catch (_error) {
        return root;
      }
    }
    return root;
  })();

  const timing = (() => {
    if (typeof module !== "undefined" && module.exports) {
      try {
        return require("./lesson-timing.js");
      } catch (_error) {
        return root;
      }
    }
    return root;
  })();

  const freeAnchors = (() => {
    if (typeof module !== "undefined" && module.exports) {
      try {
        return require("./free-observation-anchors.js");
      } catch (_error) {
        return root;
      }
    }
    return root;
  })();

  const LIVE_TYPES = [
    { id: "observation", label: "Beobachtung" },
    { id: "student_quote", label: "Schülerzitat" },
    { id: "teacher_quote", label: "Lehrerzitat" },
    { id: "free", label: "freie professionelle Beobachtung" }
  ];

  const TAP_STATES = [
    { tapCount: 0, status: "none", valence: "neutral", label: "nicht bestätigt", phase2: false },
    { tapCount: 1, status: "positive", valence: "positive", label: "lerntragend bestätigt", phase2: true },
    { tapCount: 2, status: "development", valence: "development", label: "entwicklungsrelevant bestätigt", phase2: true },
    { tapCount: 3, status: "excluded", valence: "excluded", label: "raus / nicht berücksichtigen", phase2: false }
  ];

  const DEFAULT_CONTEXT = {
    phase: "Erarbeitung",
    socialForm: "Plenum",
    method: "",
    material: "",
    medium: "",
    topic: "",
    focus: ""
  };

  function normalizeLiveType(value) {
    const text = String(value || "").toLowerCase();
    if (["student_quote", "schuelerzitat", "schülerzitat", "sus", "schueler"].includes(text)) return "student_quote";
    if (["teacher_quote", "lehrerzitat", "lk", "lehrkraft"].includes(text)) return "teacher_quote";
    if (["free", "frei", "freie beobachtung", "freie professionelle beobachtung"].includes(text)) return "free";
    if (["sketch", "skizze", "zeichnung"].includes(text)) return "sketch";
    return "observation";
  }

  function getAnalyzer() {
    return learning.analyzeUfbItemObservationWithLearning
      || root.analyzeUfbItemObservationWithLearning
      || itemHeuristics.analyzeUfbItemObservation
      || root.analyzeUfbItemObservation;
  }

  function createLiveObservationEvent(input = {}, context = {}, options = {}) {
    const now = input.timestamp ?? new Date().toISOString();
    const timingConfig = options.timing ?? context.timing ?? null;
    const baseEvent = {
      id: input.id ?? `live-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: normalizeLiveType(input.type),
      text: String(input.text ?? input.note ?? input.quote ?? "").trim(),
      hintText: String(input.hintText ?? input.professionalHint ?? "").trim(),
      professionalHint: String(input.professionalHint ?? input.hintText ?? "").trim(),
      timestamp: now,
      ...DEFAULT_CONTEXT,
      ...context,
      ...pickContext(input),
      decisions: normalizeDecisions(input.decisions),
      freeDecision: input.freeDecision ?? null,
      status: input.status ?? "open"
    };
    return typeof timing.enrichObservationWithTiming === "function"
      ? timing.enrichObservationWithTiming(baseEvent, timingConfig)
      : { ...baseEvent, minuteInLesson: input.minuteInLesson ?? null };
  }

  function pickContext(source) {
    return {
      phase: source.phase ?? undefined,
      socialForm: source.socialForm ?? undefined,
      method: source.method ?? undefined,
      material: source.material ?? undefined,
      medium: source.medium ?? undefined,
      topic: source.topic ?? undefined,
      focus: source.focus ?? undefined,
      minuteInLesson: source.minuteInLesson ?? undefined
    };
  }

  function normalizeDecisions(decisions = {}) {
    if (Array.isArray(decisions)) {
      return decisions.reduce((map, decision) => {
        if (decision?.itemId) {
          map[decision.itemId] = normalizeDecision(decision);
        }
        return map;
      }, {});
    }
    return Object.fromEntries(Object.entries(decisions).map(([itemId, decision]) => [
      itemId,
      normalizeDecision({ itemId, ...decision })
    ]));
  }

  function normalizeDecision(decision = {}) {
    const state = TAP_STATES.find((entry) => entry.status === decision.status || entry.valence === decision.valence)
      ?? TAP_STATES[Math.max(0, Math.min(3, Number(decision.tapCount ?? 0)))];
    return {
      itemId: decision.itemId,
      tapCount: state.tapCount,
      status: state.status,
      valence: state.valence,
      strength: state.phase2 ? 1 : 0,
      updatedAt: decision.updatedAt ?? new Date().toISOString()
    };
  }

  function analyzeLiveObservation(eventOrInput, history = [], options = {}) {
    const event = eventOrInput?.id && eventOrInput?.timestamp
      ? eventOrInput
      : createLiveObservationEvent(eventOrInput, options.context ?? {}, options);
    const analyzer = getAnalyzer();
    const analysis = event.type === "free" || !event.text
      ? { suggestions: [], allScores: [], fallback: true, message: "Freie professionelle Beobachtung oder leerer Text." }
      : analyzer?.(event, history, options.profile) ?? { suggestions: [], allScores: [], fallback: true, message: "Keine Heuristik geladen." };
    const maxSuggestions = Number(options.maxSuggestions ?? 3);
    const suggestions = (analysis.suggestions ?? []).slice(0, Math.max(1, Math.min(5, maxSuggestions))).map((suggestion) => compactSuggestion(suggestion, event));
    const freeResult = typeof freeAnchors.analyzeFreeProfessionalObservation === "function"
      ? freeAnchors.analyzeFreeProfessionalObservation(event)
      : { anchors: [] };
    return {
      event,
      suggestions,
      fallback: suggestions.length === 0,
      message: suggestions.length ? "" : (analysis.message || "Keine klare Verknüpfung erkannt: manuell wählen, freie Beobachtung oder später sortieren."),
      freeAnchors: (freeResult.anchors ?? []).map(compactFreeAnchor),
      textPreparation: analysis.textPreparation ?? null,
      allScores: (analysis.allScores ?? []).slice(0, 12).map((score) => compactSuggestion(score, event))
    };
  }

  function compactSuggestion(suggestion, event) {
    const item = suggestion.item ?? {};
    const decision = event.decisions?.[item.id] ?? TAP_STATES[0];
    return {
      item: {
        id: item.id,
        parentId: item.parentId,
        label: item.shortLabel ?? item.label ?? item.id,
        shortLabel: item.shortLabel ?? item.label ?? item.id,
        exactText: item.exactText ?? "",
        dimension: item.dimension ?? ""
      },
      score: Number(suggestion.score ?? 0),
      confidence: Number(suggestion.confidence ?? 0),
      confidenceLabel: suggestion.confidenceLabel ?? "",
      tendency: suggestion.tendency ?? "neutral",
      reasons: (suggestion.reasons ?? []).map((reason) => typeof reason === "string" ? reason : reason.text ?? String(reason.label ?? "")),
      decision: decision.status,
      tapCount: decision.tapCount,
      phase2: Boolean(decision.phase2)
    };
  }

  function compactFreeAnchor(anchor) {
    return {
      id: anchor.id,
      title: anchor.title,
      confidence: anchor.confidence,
      tendency: anchor.tendency,
      impulse: anchor.impulse,
      tags: anchor.tags ?? []
    };
  }

  function tapSuggestion(event, itemId) {
    const next = cloneEvent(event);
    const current = next.decisions?.[itemId]?.tapCount ?? 0;
    const nextTap = current >= 3 ? 0 : current + 1;
    next.decisions ??= {};
    if (nextTap === 0) {
      delete next.decisions[itemId];
    } else {
      next.decisions[itemId] = normalizeDecision({ itemId, tapCount: nextTap });
    }
    next.status = eventStatus(next);
    return next;
  }

  function setItemDecision(event, itemId, valence) {
    const next = cloneEvent(event);
    next.decisions ??= {};
    if (!valence || valence === "neutral" || valence === "none") {
      delete next.decisions[itemId];
    } else {
      next.decisions[itemId] = normalizeDecision({ itemId, valence });
    }
    next.status = eventStatus(next);
    return next;
  }

  function markFreeObservation(event, valence = "free") {
    const next = cloneEvent(event);
    next.decisions = {};
    next.freeDecision = {
      valence,
      updatedAt: new Date().toISOString()
    };
    next.status = "free";
    return next;
  }

  function eventStatus(event) {
    const decisions = Object.values(event.decisions ?? {});
    if (event.freeDecision || event.type === "free") return "free";
    if (decisions.some((decision) => decision.valence === "positive" || decision.valence === "development")) return "confirmed";
    if (decisions.some((decision) => decision.valence === "excluded")) return "excluded";
    return "open";
  }

  function toPhase2Observations(events = [], options = {}) {
    return events.flatMap((event, index) => {
      if (event.excluded || event.status === "excluded") {
        return [];
      }
      if ((event.type === "sketch" || event.sketchDataUrl) && !options.includeSketches) {
        return [];
      }
      const decisions = Object.values(event.decisions ?? {});
      const confirmed = decisions.filter((decision) => ["positive", "development"].includes(decision.valence));
      if (confirmed.length) {
        return confirmed.map((decision) => phase2ObservationFromDecision(event, decision, index, options));
      }
      const legacyItemIds = (event.confirmedItemIds ?? []).filter(Boolean);
      if (legacyItemIds.length && ["positive", "development"].includes(event.valence)) {
        return legacyItemIds.map((itemId) => phase2ObservationFromDecision(event, {
          itemId,
          valence: event.valence,
          strength: event.strength ?? 1
        }, index, options));
      }
      if (event.freeDecision || event.type === "free") {
        return [phase2ObservationFromFreeEvent(event, index)];
      }
      if (decisions.some((decision) => decision.valence === "excluded") && !options.includeExcludedAsOpen) {
        return [];
      }
      if (options.includeOpen === false || !event.text) {
        return [];
      }
      return [phase2ObservationFromOpenEvent(event, index)];
    });
  }

  function phase2ObservationFromDecision(event, decision, index, options) {
    return {
      id: `${event.id}:${decision.itemId}:${decision.valence}`,
      originalEventId: event.id,
      type: event.type,
      text: event.text,
      hintText: event.hintText ?? event.professionalHint ?? "",
      professionalHint: event.professionalHint ?? event.hintText ?? "",
      phase: event.phase,
      socialForm: event.socialForm,
      method: event.method,
      material: event.material,
      medium: event.medium,
      topic: event.topic,
      focus: event.focus,
      timestamp: event.timestamp,
      minuteInLesson: event.minuteInLesson,
      lessonWindow: event.lessonWindow,
      confirmedItemIds: [decision.itemId],
      itemIds: [decision.itemId],
      valence: decision.valence,
      direction: decision.valence,
      strength: options.repeatedEventStrength ? Math.max(1, decision.strength ?? 1) : 1,
      source: "phase1-live-event",
      eventIndex: index
    };
  }

  function phase2ObservationFromFreeEvent(event, index) {
    const valence = event.freeDecision?.valence === "positive" ? "free-positive"
      : event.freeDecision?.valence === "development" ? "free-development"
        : "free";
    return {
      id: `${event.id}:free`,
      originalEventId: event.id,
      type: event.type,
      text: event.text,
      hintText: event.hintText ?? event.professionalHint ?? "",
      professionalHint: event.professionalHint ?? event.hintText ?? "",
      phase: event.phase,
      socialForm: event.socialForm,
      timestamp: event.timestamp,
      minuteInLesson: event.minuteInLesson,
      lessonWindow: event.lessonWindow,
      confirmedItemIds: [],
      itemIds: [],
      valence,
      direction: valence,
      strength: 1,
      source: "phase1-live-event",
      eventIndex: index
    };
  }

  function phase2ObservationFromOpenEvent(event, index) {
    const analysis = analyzeLiveObservation(event, [], {});
    return {
      id: `${event.id}:open`,
      originalEventId: event.id,
      type: event.type,
      text: event.text,
      hintText: event.hintText ?? event.professionalHint ?? "",
      professionalHint: event.professionalHint ?? event.hintText ?? "",
      phase: event.phase,
      socialForm: event.socialForm,
      timestamp: event.timestamp,
      minuteInLesson: event.minuteInLesson,
      lessonWindow: event.lessonWindow,
      confirmedItemIds: [],
      itemIds: [],
      valence: "neutral",
      direction: "neutral",
      strength: 0,
      suggestedItems: analysis.suggestions.slice(0, 3).map((suggestion) => ({
        id: suggestion.item.id,
        score: suggestion.score,
        confidence: suggestion.confidence,
        tendency: suggestion.tendency,
        reasons: suggestion.reasons
      })),
      source: "phase1-live-event",
      eventIndex: index
    };
  }

  function summarizeLiveEvents(events = []) {
    const summary = {
      total: events.length,
      confirmed: 0,
      open: 0,
      free: 0,
      excluded: 0,
      confirmedByItem: {},
      developmentByItem: {},
      positiveByItem: {}
    };
    events.forEach((event) => {
      const status = eventStatus(event);
      summary[status] = (summary[status] ?? 0) + 1;
      Object.values(event.decisions ?? {}).forEach((decision) => {
        if (decision.valence === "positive" || decision.valence === "development") {
          count(summary.confirmedByItem, decision.itemId);
          count(decision.valence === "positive" ? summary.positiveByItem : summary.developmentByItem, decision.itemId);
        }
      });
    });
    return summary;
  }

  function rememberEventDecisions(profile, event) {
    if (typeof learning.rememberDecision !== "function") {
      return profile;
    }
    return Object.values(event.decisions ?? {}).reduce((nextProfile, decision) =>
      learning.rememberDecision(nextProfile, event, {
        itemId: decision.itemId,
        valence: decision.valence,
        id: `${event.id}:${decision.itemId}:${decision.valence}`
      }), profile);
  }

  function cloneEvent(event) {
    return JSON.parse(JSON.stringify(event));
  }

  function count(object, key) {
    object[key] = (object[key] ?? 0) + 1;
  }

  function runPhase1LiveLogicTests() {
    const lesson = typeof timing.createLessonTiming === "function"
      ? timing.createLessonTiming({ startTime: "2026-05-13T08:00:00.000Z", durationMinutes: 45 })
      : null;
    const cases = [
      {
        text: "Die Schüler wissen gerade nicht, was zu tun ist, viel Leerlauf in einzelnen Gruppen.",
        phase: "Arbeitsphase",
        socialForm: "Gruppenarbeit",
        expectedAny: ["3.3.4", "3.3.7", "3.2.5"]
      },
      {
        text: "Schüler stören, ich erkenne gerade keine Reaktion.",
        phase: "Arbeitsphase",
        socialForm: "Plenum",
        expectedAny: ["3.2.3", "3.2.7", "3.1.1"]
      },
      {
        text: "Gut, dass Sie hier Begründungen von den SuS einfordern.",
        phase: "Unterrichtsgespräch",
        socialForm: "Plenum",
        expectedAny: ["1.3.4", "1.2.4"]
      },
      {
        text: "Bei Ihrem Feedback fehlt der Ausblick.",
        phase: "Feedback",
        socialForm: "Plenum",
        expectedAny: ["2.1.3", "2.1.4"]
      },
      {
        text: "Die Kleidung wirkt für die Unterrichtssituation unangemessen.",
        type: "free",
        phase: "Vor Stunde",
        socialForm: "Plenum",
        expectedAny: []
      }
    ];
    const analyses = cases.map((entry, index) => {
      const event = createLiveObservationEvent({ ...entry, type: entry.type ?? "observation", timestamp: `2026-05-13T08:${String(index * 6 + 2).padStart(2, "0")}:00.000Z` }, {}, { timing: lesson });
      const result = analyzeLiveObservation(event, [], {});
      return {
        text: entry.text,
        top: result.suggestions.map((suggestion) => `${suggestion.item.id} ${suggestion.item.label} (${suggestion.confidence}%, ${suggestion.tendency})`),
        fallback: result.fallback,
        expectedHit: entry.expectedAny.length === 0
          ? result.fallback
          : entry.expectedAny.some((id) => result.suggestions.some((suggestion) => suggestion.item.id === id)),
        tooMany: result.suggestions.length > 4
      };
    });

    const tapBase = createLiveObservationEvent({
      text: "SuS begründen ihre Lösungswege.",
      type: "observation",
      phase: "Unterrichtsgespräch",
      socialForm: "Plenum",
      timestamp: "2026-05-13T08:16:00.000Z"
    }, {}, { timing: lesson });
    const once = tapSuggestion(tapBase, "1.3.4");
    const twice = tapSuggestion(once, "1.3.4");
    const thrice = tapSuggestion(twice, "1.3.4");
    return {
      analyses,
      tapCycle: [
        { label: "1x", decisions: once.decisions, phase2: toPhase2Observations([once]) },
        { label: "2x", decisions: twice.decisions, phase2: toPhase2Observations([twice]) },
        { label: "3x", decisions: thrice.decisions, phase2: toPhase2Observations([thrice], { includeOpen: false }) }
      ],
      summary: summarizeLiveEvents([once, thrice])
    };
  }

  root.UFB_LIVE_TYPES = LIVE_TYPES;
  root.UFB_LIVE_TAP_STATES = TAP_STATES;
  root.createLiveObservationEvent = createLiveObservationEvent;
  root.analyzeLiveObservation = analyzeLiveObservation;
  root.tapSuggestion = tapSuggestion;
  root.setItemDecision = setItemDecision;
  root.markFreeObservation = markFreeObservation;
  root.toPhase2Observations = toPhase2Observations;
  root.summarizeLiveEvents = summarizeLiveEvents;
  root.rememberEventDecisions = rememberEventDecisions;
  root.runPhase1LiveLogicTests = runPhase1LiveLogicTests;

  if (typeof module !== "undefined") {
    module.exports = {
      LIVE_TYPES,
      TAP_STATES,
      createLiveObservationEvent,
      analyzeLiveObservation,
      tapSuggestion,
      setItemDecision,
      markFreeObservation,
      toPhase2Observations,
      summarizeLiveEvents,
      rememberEventDecisions,
      runPhase1LiveLogicTests
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
