/*
  Repeatable logic check for Phase-2 relation cards.
  This file does not drive the UI. It stress-tests the reviewed relation catalog
  with confirmed observations and prints the generated Verdichtung cards.
*/

require("./item-heuristics.js");
require("./item-heuristics-extended.js");

const { createLessonTiming } = require("./lesson-timing.js");
const { createPhase2Board, getPhase2Relations } = require("./phase2-patterns.js");
const { relationSummary } = require("./phase2-item-relations.js");

const timing = createLessonTiming({
  startTime: "2026-05-13T08:00:00.000Z",
  durationMinutes: 45
});

function observation(id, minute, itemId, valence, strength, text, phase, socialForm) {
  return {
    id,
    text,
    confirmedItemIds: [itemId],
    valence,
    strength,
    phase,
    socialForm,
    timestamp: new Date(Date.parse(timing.startTime) + minute * 60 * 1000).toISOString(),
    minuteInLesson: minute
  };
}

const scenarios = [
  {
    id: "positive-verstehen-buendeln",
    title: "Ziel, Kern und Sicherung tragen den Lernweg",
    observations: [
      observation("pv1", 2, "1.1.1", "positive", 2, "Leitfrage wird fachlich geklärt.", "Einstieg", "Plenum"),
      observation("pv2", 14, "1.1.4", "positive", 1, "LK stellt Bezüge zur Leitfrage her.", "Erarbeitung", "Plenum"),
      observation("pv3", 31, "1.1.6", "positive", 2, "zentrale Inhalte werden gebündelt.", "Sicherung", "Plenum"),
      observation("pv4", 39, "1.1.7", "positive", 2, "Sicherung nimmt das Ausgangsproblem wieder auf.", "Sicherung", "Plenum")
    ]
  },
  {
    id: "positive-denkwege-sprache",
    title: "Schülerdenken wird im Gespräch sprachlich sichtbar",
    observations: [
      observation("pd1", 15, "1.2.3", "positive", 2, "SuS erläutern unterschiedliche Denkwege.", "Unterrichtsgespräch", "Plenum"),
      observation("pd2", 18, "1.2.4", "positive", 2, "LK fordert Begründungen ein.", "Unterrichtsgespräch", "Plenum"),
      observation("pd3", 20, "1.3.4", "positive", 2, "Schüler erklären ihre Lösungswege selbst.", "Unterrichtsgespräch", "Plenum"),
      observation("pd4", 22, "1.4.3", "positive", 1, "längere fachliche Beiträge der SuS.", "Sicherung", "Plenum")
    ]
  },
  {
    id: "development-auftrag-leerlauf",
    title: "Auftrag, Leerlauf und Hilfebedarf verdichten sich",
    observations: [
      observation("da1", 10, "3.3.4", "development", 2, "Gruppen wissen nicht, was zu tun ist.", "Arbeitsphase", "Gruppenarbeit"),
      observation("da2", 12, "3.3.7", "development", 2, "viel Leerlauf in einzelnen Gruppen.", "Arbeitsphase", "Gruppenarbeit"),
      observation("da3", 14, "3.2.5", "development", 1, "LK sieht wartende Gruppen erst spät.", "Arbeitsphase", "Gruppenarbeit")
    ]
  },
  {
    id: "development-kognitive-last",
    title: "Zu viel kognitive Last verhindert fachliche Orientierung",
    observations: [
      observation("kl1", 5, "1.1.2", "development", 2, "Material und Auftrag enthalten zu viele konkurrierende Informationen.", "Einstieg", "Plenum"),
      observation("kl2", 12, "2.2.2", "development", 1, "Erklärung knüpft nicht an Vorwissen an.", "Erarbeitung", "Plenum"),
      observation("kl3", 16, "1.3.3", "development", 1, "SuS sollen Lösung selbst entwickeln, sind aber überfordert.", "Erarbeitung", "Gruppenarbeit"),
      observation("kl4", 17, "3.3.4", "development", 2, "Auftrag wird von mehreren Gruppen unterschiedlich verstanden.", "Arbeitsphase", "Gruppenarbeit")
    ]
  },
  {
    id: "mixed-fehlerkultur",
    title: "Fehler werden teilweise genutzt, bleiben aber sozial fragil",
    observations: [
      observation("mf1", 19, "1.3.6", "positive", 2, "zentraler Fehler wird fachlich aufgegriffen.", "Sicherung", "Plenum"),
      observation("mf2", 20, "2.3.1", "positive", 1, "LK bleibt wertschätzend in der Klärung.", "Sicherung", "Plenum"),
      observation("mf3", 21, "2.4.3", "development", 2, "ein Schüler wird bei Fehler ausgelacht.", "Sicherung", "Plenum"),
      observation("mf4", 22, "2.1.5", "development", 1, "Hilfestellung bleibt für den Schüler zu allgemein.", "Sicherung", "Plenum")
    ]
  }
];

function summarizeBoard(scenario) {
  const board = createPhase2Board(scenario.observations, { timing });
  return {
    id: scenario.id,
    title: scenario.title,
    totalVisibleCards: board.totalCards,
    suppressedCards: board.suppressedCards,
    sections: board.sections.map((section) => ({
      id: section.id,
      title: section.title,
      count: section.count,
      topCards: section.cards.slice(0, 5).map((card) => ({
        id: card.id,
        relationId: card.relationId,
        title: card.title,
        direction: card.direction,
        priority: card.priority,
        strengthLabel: card.strengthLabel,
        itemIds: card.itemIds,
        cardText: card.cardText,
        temporalPattern: card.temporalPattern.label
      }))
    }))
  };
}

function runPhase2RelationEvaluation() {
  return {
    generatedAt: new Date().toISOString(),
    relationSummary: relationSummary(),
    activeRelations: getPhase2Relations().length,
    scenarios: scenarios.map(summarizeBoard)
  };
}

if (require.main === module) {
  console.log(JSON.stringify(runPhase2RelationEvaluation(), null, 2));
}

module.exports = {
  scenarios,
  runPhase2RelationEvaluation
};
