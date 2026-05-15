#!/usr/bin/env node
/*
  End-to-end logic simulation from fast Phase-1 live notes to Phase-2
  Verdichtung cards. This is deliberately UI-free.

  The simulation checks whether a whole Unterrichtsbesuch stays manageable:
  raw event -> suggestion -> human confirmation -> Phase-2 cards.
*/

require("./text-normalization.js");
require("./item-heuristics.js");
require("./item-heuristics-extended.js");
require("./user-corpus-calibration.js");
require("./free-observation-anchors.js");

const live = require("./phase1-live-logic.js");
const timingTools = require("./lesson-timing.js");
const phase2 = require("./phase2-patterns.js");

const DEFAULT_LIMITS = {
  positive: 10,
  development: 10,
  mixed: 6,
  free: 8,
  open: 12
};

const SIMULATED_UBS = [
  {
    id: "ub-auftrag-leerlauf",
    title: "UB: Gruppenarbeit startet unsicher, Leerlauf verdichtet sich",
    startTime: "2026-05-13T08:00:00.000Z",
    durationMinutes: 45,
    person: "LAA A",
    visit: "UB1",
    events: [
      e(1, "Beobachtung", "Vor Stunde", "Plenum", "Gäste werden kurz vorgestellt, SuS wirken orientiert.", "free.rahmung-unterrichtsbesuch", "positive", "free"),
      e(3, "Beobachtung", "Einstieg", "Plenum", "Leitfrage wird an der Tafel notiert und kurz eingeordnet.", "1.1.1", "positive"),
      e(6, "Lehrerzitat", "Einstieg", "Plenum", "Am Ende sollt ihr begründen können, welche Lösung tragfähig ist.", "1.1.5", "positive"),
      e(11, "Beobachtung", "Übergang", "Plenum", "Gibt es noch Fragen ersetzt Diagnose; SuS können Auftrag nicht erklären.", "3.3.4", "development"),
      e(12, "Schülerzitat", "Arbeitsphase", "Gruppenarbeit", "Was sollen wir jetzt machen?", "3.3.4", "development"),
      e(14, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Drei Gruppen warten, LK schaut auf Tafel.", "3.2.1", "development"),
      e(15, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Viel Leerlauf in einzelnen Gruppen, niemand beginnt.", "3.3.7", "development"),
      e(17, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "LK erkennt wartende Gruppe erst spät.", "3.2.5", "development"),
      e(19, "Lehrerzitat", "Arbeitsphase", "Gruppenarbeit", "Ich sehe, ihr hängt am Auftrag. Welche Frage habt ihr gerade?", "3.2.5", "positive"),
      e(20, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "LK klärt Auftrag erneut für alle Gruppen.", "3.3.4", "positive"),
      e(23, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Gruppe 2 arbeitet danach fachlich weiter.", "1.4.1", "positive"),
      e(28, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Arbeitsmaterial enthält viel Text und zu viele Bilder.", "free.materialgestaltung", "development", "free"),
      e(31, "Schülerzitat", "Arbeitsphase", "Gruppenarbeit", "Wir haben einen anderen Weg genommen.", "1.2.2", "positive"),
      e(34, "Beobachtung", "Sicherung", "Plenum", "Nur eine glatte Lösung wird genommen; Irrwege bleiben ungesehen.", "1.2.7", "development"),
      e(37, "Beobachtung", "Sicherung", "Plenum", "Sicherung zu knapp, Leitfrage wird nicht mehr aufgegriffen.", "3.3.6", "development"),
      e(39, "Beobachtung", "Sicherung", "Plenum", "Zentrale Inhalte werden nicht zusammengefasst.", "1.1.6", "development"),
      e(41, "Beobachtung", "Sicherung", "Plenum", "Schüler fragt nach Toilette, nicht gesprächsrelevant.", "1.4.1", "excluded")
    ],
    expectedTopRelations: ["B071", "B045", "A029"]
  },
  {
    id: "ub-denkwege-stark",
    title: "UB: Denkwege und Begründungen tragen das Gespräch",
    startTime: "2026-05-13T09:00:00.000Z",
    durationMinutes: 60,
    person: "LAA B",
    visit: "UB2",
    events: [
      e(2, "Beobachtung", "Einstieg", "Plenum", "Problemfrage wird fachlich klar aufgebaut.", "1.1.1", "positive"),
      e(7, "Lehrerzitat", "Erarbeitung", "Plenum", "Welche Idee steckt hinter deinem Ansatz?", "1.2.3", "positive"),
      e(10, "Schülerzitat", "Unterrichtsgespräch", "Plenum", "Ich würde erst den Term umformen, weil...", "1.4.3", "positive"),
      e(13, "Lehrerzitat", "Unterrichtsgespräch", "Plenum", "Wie bist du auf diesen Weg gekommen?", "1.3.4", "positive"),
      e(16, "Beobachtung", "Unterrichtsgespräch", "Plenum", "LK fordert Begründungen nach, Ergebnis allein reicht nicht.", "1.2.4", "positive"),
      e(18, "Beobachtung", "Unterrichtsgespräch", "Plenum", "Zwei Lösungswege werden fachlich kontrastiert.", "1.3.2", "positive"),
      e(20, "Lehrerzitat", "Unterrichtsgespräch", "Plenum", "Was ist an dieser Darstellung genauer?", "1.3.2", "positive"),
      e(24, "Schülerzitat", "Unterrichtsgespräch", "Plenum", "Bei meinem Weg sieht man besser, warum das passt.", "1.4.7", "positive"),
      e(29, "Beobachtung", "Arbeitsphase", "Partnerarbeit", "SuS greifen Impulse voneinander auf und ändern Lösungswege.", "1.4.6", "positive"),
      e(34, "Beobachtung", "Sicherung", "Plenum", "Zentraler Fehler wird angeschrieben und fachlich geklärt.", "1.3.6", "positive"),
      e(40, "Beobachtung", "Sicherung", "Plenum", "Leitfrage wird in der Sicherung wieder aufgenommen.", "1.1.7", "positive"),
      e(44, "Beobachtung", "Sicherung", "Plenum", "Zentrale Inhalte werden von SuS zusammengefasst.", "1.1.6", "positive"),
      e(48, "Beobachtung", "Feedback", "Plenum", "Feedback benennt konkret nächsten Schritt.", "2.1.3", "positive"),
      e(53, "Beobachtung", "Nach Stunde", "Plenum", "Humor lockerte die Situation, fachlicher Fokus blieb erhalten.", "free.humor-atmosphaere", "positive", "free")
    ],
    expectedTopRelations: ["G068", "G046"]
  },
  {
    id: "ub-feedback-ambivalent",
    title: "UB: Feedback und Unterstützung wirken punktuell, bleiben aber uneinheitlich",
    startTime: "2026-05-13T10:00:00.000Z",
    durationMinutes: 45,
    person: "LAA C",
    visit: "UB3",
    events: [
      e(4, "Beobachtung", "Einstieg", "Plenum", "Vorwissen wird über kurze Diagnoseaufgabe sichtbar.", "1.2.6", "positive"),
      e(8, "Lehrerzitat", "Arbeitsphase", "Einzelarbeit", "Wo genau hakt es? Zeig mir die Stelle.", "2.2.1", "positive"),
      e(11, "Lehrerzitat", "Feedback", "Einzelarbeit", "Bis hierhin stimmt dein Ansatz, darauf können wir aufbauen.", "2.1.2", "positive"),
      e(14, "Lehrerzitat", "Feedback", "Einzelarbeit", "Überprüfe die Einheit und ergänze die Begründung.", "2.1.3", "positive"),
      e(17, "Beobachtung", "Arbeitsphase", "Einzelarbeit", "Schüler nickt, setzt Feedback aber nicht um.", "2.1.4", "development"),
      e(20, "Beobachtung", "Feedback", "Plenum", "Bei Ihrem Feedback fehlt hier der Ausblick.", "2.1.3", "development"),
      e(23, "Beobachtung", "Arbeitsphase", "Einzelarbeit", "Erklärung überfordert, knüpft nicht an Vorwissen an.", "2.2.2", "development"),
      e(25, "Beobachtung", "Arbeitsphase", "Einzelarbeit", "Es gibt keine zweite Erklärung oder Variation, obwohl Schüler nicht weiterkommt.", "2.2.3", "development"),
      e(27, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "LK bleibt lange bei einer Gruppe, andere warten.", "3.2.4", "development"),
      e(30, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Hilfekarten werden passend eingesetzt.", "2.2.3", "positive"),
      e(34, "Beobachtung", "Sicherung", "Plenum", "Unvollständige Antwort wird fachlich geklärt statt ersetzt.", "2.1.5", "positive"),
      e(38, "Beobachtung", "Sicherung", "Plenum", "Begründungen werden nicht konsequent nachgefragt.", "1.2.4", "development")
    ],
    expectedTopRelations: ["A007", "G031"]
  },
  {
    id: "ub-sicherung-kern",
    title: "UB: Zeit, Material und Sicherung gefährden den fachlichen Kern",
    startTime: "2026-05-13T11:00:00.000Z",
    durationMinutes: 45,
    person: "LAA D",
    visit: "UB1",
    events: [
      e(2, "Beobachtung", "Einstieg", "Plenum", "Worum könnte es heute gehen? SuS raten, Ziel bleibt unklar.", "1.1.1", "development"),
      e(5, "Beobachtung", "Einstieg", "Plenum", "Material und Auftrag enthalten viele konkurrierende Informationen.", "1.1.2", "development"),
      e(7, "Beobachtung", "Einstieg", "Plenum", "Arbeitsblatt sehr dicht, kognitive Last hoch.", "free.materialgestaltung", "development", "free"),
      e(10, "Beobachtung", "Erarbeitung", "Gruppenarbeit", "SuS sollen eigenen Ansatz entwickeln, sind aber überfordert.", "1.3.3", "development"),
      e(14, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Auftrag wird in mehreren Gruppen unterschiedlich verstanden.", "3.3.4", "development"),
      e(17, "Schülerzitat", "Arbeitsphase", "Gruppenarbeit", "Was sollen wir genau abgeben?", "3.3.4", "development"),
      e(20, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Viele SuS arbeiten fachlich, aber mit verschiedenen Zielrichtungen.", "1.4.1", "development"),
      e(24, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "LK nimmt Zwischenergebnisse nicht in den Blick.", "1.2.7", "development"),
      e(28, "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Arbeitsphase läuft aus, keine klare Zeitmarke.", "3.3.2", "development"),
      e(34, "Beobachtung", "Sicherung", "Plenum", "Sicherung beginnt zu spät.", "3.3.6", "development"),
      e(38, "Beobachtung", "Sicherung", "Plenum", "Es werden nur Ergebnisse vorgelesen, keine Begründungen verglichen.", "1.3.2", "development"),
      e(41, "Beobachtung", "Sicherung", "Plenum", "Problem vom Anfang bleibt offen.", "1.1.7", "development")
    ],
    expectedTopRelations: ["B070", "B002", "B016"]
  },
  {
    id: "ub-fehlerkultur-ambivalent",
    title: "UB: Fehlerarbeit wird fachlich genutzt, sozial aber fragil",
    startTime: "2026-05-13T12:00:00.000Z",
    durationMinutes: 45,
    person: "LAA E",
    visit: "UB4",
    events: [
      e(4, "Beobachtung", "Einstieg", "Plenum", "Normen für Gespräch werden ruhig geklärt.", "2.3.1", "positive"),
      e(9, "Beobachtung", "Erarbeitung", "Plenum", "Zentraler Fehler wird aufgeschrieben.", "1.3.6", "positive"),
      e(12, "Beobachtung", "Unterrichtsgespräch", "Plenum", "Fehler wird fachlich besprochen und an Darstellung geklärt.", "2.1.5", "positive"),
      e(16, "Beobachtung", "Unterrichtsgespräch", "Plenum", "Einige SuS lachen bei falscher Antwort.", "2.4.3", "development"),
      e(17, "Beobachtung", "Unterrichtsgespräch", "Plenum", "LK reagiert erst spät auf das Lachen.", "3.2.3", "development"),
      e(20, "Lehrerzitat", "Unterrichtsgespräch", "Plenum", "Fehler sind hilfreich, wenn wir sie genau prüfen.", "2.3.1", "positive"),
      e(24, "Beobachtung", "Unterrichtsgespräch", "Plenum", "Schüler traut sich danach nicht mehr zu präsentieren.", "1.4.3", "development"),
      e(28, "Beobachtung", "Arbeitsphase", "Partnerarbeit", "Partner erklärt ruhig den nächsten Schritt.", "2.4.2", "positive"),
      e(31, "Beobachtung", "Arbeitsphase", "Partnerarbeit", "Ein Schüler dominiert, stille Schülerin bleibt außen vor.", "2.4.6", "development"),
      e(35, "Beobachtung", "Sicherung", "Plenum", "LK schützt Schülerbeitrag und formuliert wertschätzend um.", "2.3.3", "positive"),
      e(39, "Beobachtung", "Sicherung", "Plenum", "Alternative richtige Idee wird nicht weiter geprüft.", "1.4.7", "development")
    ],
    expectedTopRelations: ["A034"]
  }
];

function e(minute, type, phase, socialForm, text, itemOrAnchor, valence, decisionKind = "item") {
  return {
    minute,
    type,
    phase,
    socialForm,
    text,
    itemOrAnchor,
    valence,
    decisionKind
  };
}

function normalizeLiveType(type) {
  const lower = String(type || "").toLowerCase();
  if (lower.includes("lehrer")) return "teacher_quote";
  if (lower.includes("schüler") || lower.includes("schueler")) return "student_quote";
  if (lower.includes("frei")) return "free";
  return "observation";
}

function buildEvent(raw, scenario, timing) {
  const timestamp = new Date(Date.parse(timing.startTime) + raw.minute * 60 * 1000).toISOString();
  let event = live.createLiveObservationEvent({
    id: `${scenario.id}-${String(raw.minute).padStart(2, "0")}-${raw.itemOrAnchor}`,
    type: normalizeLiveType(raw.type),
    text: raw.text,
    phase: raw.phase,
    socialForm: raw.socialForm,
    timestamp
  }, {
    person: scenario.person,
    visit: scenario.visit
  }, { timing });

  if (raw.decisionKind === "free") {
    event = live.markFreeObservation(event, raw.valence);
  } else if (raw.valence === "excluded") {
    event = live.setItemDecision(event, raw.itemOrAnchor, "excluded");
  } else {
    event = live.setItemDecision(event, raw.itemOrAnchor, raw.valence);
  }
  return event;
}

function analyzeEvent(raw, event) {
  const analysis = live.analyzeLiveObservation(event);
  const suggestionIds = analysis.suggestions.map((suggestion) => suggestion.item.id);
  const freeAnchorIds = analysis.freeAnchors.map((anchor) => anchor.id);
  const isFree = raw.decisionKind === "free";
  const hit = raw.valence === "excluded"
    ? true
    : isFree
      ? freeAnchorIds.includes(raw.itemOrAnchor) || analysis.fallback
      : suggestionIds.includes(raw.itemOrAnchor);
  const flags = [];
  if (!hit) flags.push(isFree ? "free_anchor_not_suggested" : "confirmed_item_not_suggested");
  if (analysis.suggestions.length > 4) flags.push("too_many_suggestions");
  return {
    raw,
    event,
    suggestionIds,
    freeAnchorIds,
    hit,
    flags,
    analysis
  };
}

function summarizeBoard(board, scenario) {
  const sections = Object.fromEntries(board.sections.map((section) => [
    section.id,
    {
      count: section.count,
      overflow: section.overflow.length,
      top: section.cards.slice(0, 5).map(compactCard)
    }
  ]));
  const relationIds = board.cards.map((card) => card.relationId).filter(Boolean);
  const expectedHits = scenario.expectedTopRelations.filter((id) => relationIds.includes(id));
  return {
    totalCards: board.totalCards,
    suppressedCards: board.suppressedCards,
    sections,
    relationIds: relationIds.slice(0, 18),
    expectedHits,
    missingExpected: scenario.expectedTopRelations.filter((id) => !relationIds.includes(id)),
    wustFlags: wustFlags(board)
  };
}

function compactCard(card) {
  return {
    id: card.id,
    relationId: card.relationId,
    title: card.title,
    direction: card.direction,
    priority: card.priority,
    itemIds: card.itemIds,
    evidence: card.evidence.map((entry) => `${entry.minuteInLesson ?? "?"}: ${entry.text}`)
  };
}

function wustFlags(board) {
  const flags = [];
  board.sections.forEach((section) => {
    const limit = DEFAULT_LIMITS[section.id] ?? 12;
    if (section.count > limit) {
      flags.push(`${section.id}_over_limit:${section.count}/${limit}`);
    }
  });
  if (board.totalCards > 28) {
    flags.push(`board_too_large:${board.totalCards}`);
  }
  return flags;
}

function simulateScenario(scenario) {
  const timing = timingTools.createLessonTiming({
    startTime: scenario.startTime,
    durationMinutes: scenario.durationMinutes
  });
  const eventAnalyses = scenario.events.map((raw) => {
    const event = buildEvent(raw, scenario, timing);
    return analyzeEvent(raw, event);
  });
  const events = eventAnalyses.map((entry) => entry.event);
  const phase2Observations = live.toPhase2Observations(events, { includeOpen: true });
  const board = phase2.createPhase2Board(phase2Observations, { timing });
  const suggestionFlags = eventAnalyses.flatMap((entry) => entry.flags.map((flag) => ({
    flag,
    text: entry.raw.text,
    expected: entry.raw.itemOrAnchor,
    suggestions: entry.suggestionIds,
    freeAnchors: entry.freeAnchorIds
  })));
  return {
    id: scenario.id,
    title: scenario.title,
    person: scenario.person,
    visit: scenario.visit,
    eventCount: scenario.events.length,
    liveSummary: live.summarizeLiveEvents(events),
    suggestionFlags,
    phase2ObservationCount: phase2Observations.length,
    board: summarizeBoard(board, scenario)
  };
}

function summarizeSimulation(results) {
  const suggestionFlags = results.flatMap((result) => result.suggestionFlags.map((flag) => ({ scenario: result.id, ...flag })));
  const wustFlags = results.flatMap((result) => result.board.wustFlags.map((flag) => ({ scenario: result.id, flag })));
  return {
    generatedAt: new Date().toISOString(),
    scenarioCount: results.length,
    eventCount: results.reduce((sum, result) => sum + result.eventCount, 0),
    phase2ObservationCount: results.reduce((sum, result) => sum + result.phase2ObservationCount, 0),
    suggestionFlagCount: suggestionFlags.length,
    wustFlagCount: wustFlags.length,
    suggestionFlags,
    wustFlags,
    cardsByScenario: results.map((result) => ({
      id: result.id,
      totalCards: result.board.totalCards,
      suppressedCards: result.board.suppressedCards,
      sections: Object.fromEntries(Object.entries(result.board.sections).map(([id, section]) => [id, section.count])),
      expectedHits: result.board.expectedHits,
      missingExpected: result.board.missingExpected
    }))
  };
}

function runPhase1ToPhase2UbSimulation() {
  const scenarios = SIMULATED_UBS.map(simulateScenario);
  return {
    summary: summarizeSimulation(scenarios),
    scenarios
  };
}

if (require.main === module) {
  console.log(JSON.stringify(runPhase1ToPhase2UbSimulation(), null, 2));
}

module.exports = {
  SIMULATED_UBS,
  runPhase1ToPhase2UbSimulation
};
