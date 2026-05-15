#!/usr/bin/env node
/*
  Stress test for Phase-1 live suggestions.
  It uses deliberately short, messy observation language and checks whether the
  rule system proposes a small, plausible set of UFB items or free anchors.
*/

require("./text-normalization.js");
require("./item-heuristics.js");
require("./item-heuristics-extended.js");
require("./user-corpus-calibration.js");
require("./free-observation-anchors.js");
const live = require("./phase1-live-logic.js");
const timingTools = require("./lesson-timing.js");

const timing = timingTools.createLessonTiming({
  startTime: "2026-05-13T08:00:00.000Z",
  durationMinutes: 45
});

const LIVE_STRESS_CASES = [
  c("L01", "Lehrerzitat", "Einstieg", "Plenum", "Gibt es noch Fragen? Nein? Dann weiter.", ["1.2.1", "1.2.5", "3.3.4"], "development"),
  c("L02", "Schülerzitat", "Arbeitsphase", "Gruppenarbeit", "Was sollen wir jetzt machen?", ["3.3.4", "3.3.7", "3.2.5"], "development"),
  c("L03", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Drei Gruppen warten, LK schaut auf Tafel.", ["3.2.1", "3.2.5", "3.3.7"], "development"),
  c("L04", "Beobachtung", "Erarbeitung", "Partnerarbeit", "SuS vergleichen zwei Lösungswege und begründen Unterschiede.", ["1.3.2", "1.3.4", "1.2.4"], "positive"),
  c("L05", "Lehrerzitat", "Unterrichtsgespräch", "Plenum", "Wie bist du auf diesen Weg gekommen?", ["1.2.3", "1.3.4"], "positive"),
  c("L06", "Beobachtung", "Sicherung", "Plenum", "Fehler wird ausgelacht, LK reagiert nicht.", ["2.4.3", "2.3.1", "3.2.3"], "development"),
  c("L07", "Beobachtung", "Sicherung", "Plenum", "Sicherung sammelt nur Ergebnisse, kein Bezug zur Leitfrage.", ["1.1.7", "1.1.4", "1.3.2"], "development"),
  c("L08", "freie Beobachtung", "Vor Stunde", "Plenum", "Kleidung wirkt für Unterrichtssituation unangemessen.", [], "free", { shouldFallback: true }),

  c("V01", "Beobachtung", "Einstieg", "Plenum", "Leitfrage wird klar benannt, SuS wissen welche Frage sie klären sollen.", ["1.1.1"], "positive"),
  c("V02", "Beobachtung", "Erarbeitung", "Lehrervortrag", "Kein Tafelbild, keine Visualisierung, viel zu viele Infos auf einmal.", ["1.1.2"], "development"),
  c("V03", "Beobachtung", "Erarbeitung", "Plenum", "Begriffe werden sauber eingeführt und an Beispielen erklärt.", ["1.1.3"], "positive"),
  c("V04", "Beobachtung", "Erarbeitung", "Plenum", "LK stellt immer wieder den Bezug zur Leitfrage her.", ["1.1.4"], "positive"),
  c("V05", "Beobachtung", "Sicherung", "Plenum", "Aus dem konkreten Beispiel wird eine allgemeine Regel entwickelt.", ["1.1.5"], "positive"),
  c("V06", "Beobachtung", "Sicherung", "Plenum", "Zentrale Inhalte werden zusammengefasst, SuS formulieren das Fazit.", ["1.1.6", "1.1.7"], "positive"),
  c("V07", "Beobachtung", "Sicherung", "Plenum", "Problem vom Anfang bleibt offen, Leitfrage taucht nicht mehr auf.", ["1.1.7", "1.1.1"], "development"),

  c("D01", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "LK geht herum und schaut sich Rechenwege in den Heften an.", ["1.2.1", "1.2.7", "3.2.1"], "positive"),
  c("D02", "Lehrerzitat", "Sicherung", "Plenum", "Wer möchte seinen Lösungsweg vorstellen?", ["1.2.2", "1.2.7"], "positive"),
  c("D03", "Lehrerzitat", "Unterrichtsgespräch", "Plenum", "Welche Idee steckt hinter deinem Ansatz?", ["1.2.3"], "positive"),
  c("D04", "Beobachtung", "Unterrichtsgespräch", "Plenum", "Begründungen werden nicht nachgefragt, richtiges Ergebnis reicht.", ["1.2.4", "1.3.4"], "development"),
  c("D05", "Schülerzitat", "Arbeitsphase", "Einzelarbeit", "Ich verstehe das nicht, sagt S3, LK geht weiter.", ["1.2.5", "2.2.1"], "development"),
  c("D06", "Beobachtung", "Einstieg", "Partnerarbeit", "Diagnoseaufgabe: SuS ordnen Graphen und Terme einander zu.", ["1.2.6"], "positive"),
  c("D07", "Beobachtung", "Sicherung", "Gruppenarbeit", "Fotos der Gruppenergebnisse hängen nebeneinander an der Tafel.", ["1.2.7"], "positive"),

  c("H01", "Beobachtung", "Unterrichtsgespräch", "Plenum", "Halbrichtige Antwort, LK nimmt sofort jemand anders dran.", ["1.3.1"], "development"),
  c("H02", "Beobachtung", "Sicherung", "Plenum", "Zwei Lösungswege stehen an der Tafel, werden fachlich kontrastiert.", ["1.3.2"], "positive"),
  c("H03", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "SuS sollen eigenen Ansatz entwickeln, aber Aufgabe ist nicht überfordernd.", ["1.3.3"], "positive"),
  c("H04", "Beobachtung", "Unterrichtsgespräch", "Plenum", "Schüler sagt ein Wort, Lehrer ergänzt den ganzen Rest.", ["1.3.4"], "development"),
  c("H05", "Beobachtung", "Arbeitsphase", "Einzelarbeit", "Aufgaben bleiben nur AFB I: einsetzen, rechnen, Ergebnis nennen.", ["1.3.5"], "development"),
  c("H06", "Beobachtung", "Sicherung", "Plenum", "Zentraler Fehler wird aufgeschrieben und gemeinsam fachlich geklärt.", ["1.3.6", "2.1.5"], "positive"),
  c("H07", "Beobachtung", "Sicherung", "Plenum", "Transferfrage kommt zu früh, Basis ist noch nicht gelegt.", ["1.3.7"], "development"),

  c("B01", "Beobachtung", "Sicherung", "Plenum", "Unaufmerksamer Schüler wird vorsichtig angesprochen, LK schaut wo es hakt.", ["1.4.1", "1.4.4"], "positive"),
  c("B02", "Beobachtung", "Unterrichtsgespräch", "Plenum", "Nur Einwortantworten, LK lässt das gelten.", ["1.4.2"], "development"),
  c("B03", "Schülerzitat", "Sicherung", "Plenum", "Ich würde den Term erst umformen und dann vergleichen, weil...", ["1.4.3", "1.3.4"], "positive"),
  c("B04", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Gruppe hängt, stellt aber keine Frage, LK geht hin und schaut wo es hakt.", ["1.4.4", "3.2.5"], "positive"),
  c("B05", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Anspruchsvolle Aufgabe führt zu Leerlauf, SuS geben auf.", ["1.4.5", "3.3.7"], "development"),
  c("B06", "Schülerzitat", "Gruppendiskussion", "Gruppenarbeit", "S2 greift den Hinweis von S1 auf und ändert den Lösungsweg.", ["1.4.6"], "positive"),
  c("B07", "Beobachtung", "Unterrichtsgespräch", "Plenum", "Alternative richtige Schüleridee wird nicht erkannt und umgelenkt.", ["1.4.7"], "development"),

  c("F01", "Beobachtung", "Feedback", "Plenum", "Feedback nur gut, richtig, falsch; SuS wissen nicht was genau.", ["2.1.1"], "development"),
  c("F02", "Lehrerzitat", "Feedback", "Einzelarbeit", "Bis hierhin stimmt dein Ansatz, darauf können wir aufbauen.", ["2.1.2"], "positive"),
  c("F03", "Lehrerzitat", "Feedback", "Einzelarbeit", "Überprüfe die Einheit und ergänze die Begründung.", ["2.1.3"], "positive"),
  c("F04", "Beobachtung", "Arbeitsphase", "Einzelarbeit", "Schüler nickt okay, setzt das Feedback aber nicht um.", ["2.1.4"], "development"),
  c("F05", "Beobachtung", "Feedback", "Plenum", "Bei Ihrem Feedback fehlt der Ausblick.", ["2.1.3", "2.1.4"], "development"),
  c("F06", "Beobachtung", "Sicherung", "Plenum", "Unvollständige Antwort wird fachlich geklärt statt ersetzt.", ["2.1.5"], "positive"),

  c("U01", "Lehrerzitat", "Arbeitsphase", "Einzelarbeit", "Wo genau hakt es? Zeig mir die Stelle.", ["2.2.1"], "positive"),
  c("U02", "Beobachtung", "Arbeitsphase", "Einzelarbeit", "Erklärung überfordert, knüpft nicht an Vorwissen an, keine Variation.", ["2.2.2", "2.2.3"], "development"),
  c("U03", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Hilfekarten und verschiedene Darstellungen passend zum Lernstand.", ["2.2.3"], "positive"),
  c("U04", "Beobachtung", "Unterrichtsgespräch", "Plenum", "Komplexe Frage, LK beantwortet sie sofort selbst.", ["2.2.4"], "development"),
  c("U05", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Hilfe ist zu aufwändig für die Wirkung, LK bleibt lange bei einer Gruppe.", ["2.2.5", "3.2.4"], "development"),

  c("W01", "Beobachtung", "Arbeitsphase", "Plenum", "Normkonflikt wird ruhig bearbeitet, Würde bleibt gewahrt.", ["2.3.1"], "positive"),
  c("W02", "Schülerzitat", "Arbeitsphase", "Plenum", "Warum immer ich? Das ist unfair.", ["2.3.2"], "development"),
  c("W03", "Beobachtung", "Unterrichtsgespräch", "Plenum", "Alternative Sichtweise des Schülers wird respektvoll aufgenommen.", ["2.3.3"], "positive"),

  c("K01", "Beobachtung", "Unterrichtsgespräch", "Plenum", "SuS fallen einander ins Wort, Beitrag wird unterbrochen.", ["2.4.1"], "development"),
  c("K02", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Fertige SuS gehen rum und erklären Mitschülern den nächsten Schritt.", ["2.4.2", "3.3.7"], "positive"),
  c("K03", "Beobachtung", "Sicherung", "Plenum", "Fehler wird ausgelacht, LK reagiert darauf und schützt den Schüler.", ["2.4.3", "2.3.1"], "positive"),
  c("K04", "Schülerzitat", "Arbeitsphase", "Plenum", "Mach ich nicht, ist mir egal.", ["2.4.4"], "development"),
  c("K05", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Gruppenarbeit ist nur Sitzordnung, keine Kooperationsnotwendigkeit.", ["2.4.5"], "development"),
  c("K06", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Ein Schüler dominiert, stille SuS bleiben außen vor.", ["2.4.6"], "development"),
  c("K07", "Schülerzitat", "Arbeitsphase", "Gruppenarbeit", "Das weiß man doch, sagt S1 zur Frage von S2.", ["2.4.7"], "development"),

  c("S01", "Beobachtung", "Arbeitsphase", "Plenum", "Wiederholte Störungen unterbrechen den Rechenweg.", ["3.1.1"], "development"),
  c("S02", "Beobachtung", "Sicherung", "Plenum", "Lautstärke verhindert, dass die Präsentation hörbar ist.", ["3.1.2"], "development"),
  c("S03", "Beobachtung", "Übergang", "Plenum", "Abläufe unklar, SuS fragen ständig: Wie geht das nochmal?", ["3.1.3"], "development"),

  c("M01", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "LK setzt sich ans Pult, keine Diagnose der Arbeitsstände.", ["3.2.1"], "development"),
  c("M02", "Lehrerzitat", "Arbeitsphase", "Plenum", "Ich hake das kurz ab, arbeitet bitte an Aufgabe 2 weiter.", ["3.2.2"], "positive"),
  c("M03", "Beobachtung", "Arbeitsphase", "Plenum", "Schüler frisiert Haare, LK nimmt Störung nicht wahr.", ["3.2.3"], "development"),
  c("M04", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "LK erklärt jeder Gruppe dieselbe Frage einzeln, mehrere Gruppen warten.", ["3.2.4"], "development"),
  c("M05", "Lehrerzitat", "Arbeitsphase", "Gruppenarbeit", "Ich sehe, ihr hängt am Auftrag. Welche Frage habt ihr gerade?", ["3.2.5"], "positive"),
  c("M06", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Abschweifung läuft lange, Lernprozess ist beeinträchtigt.", ["3.2.6"], "development"),
  c("M07", "Lehrerzitat", "Arbeitsphase", "Plenum", "Stopp, zurück zur Aufgabe.", ["3.2.7"], "positive"),

  c("Z01", "Beobachtung", "Arbeitsphase", "Gruppenarbeit", "Viel Zeit ohne fachlichen Lernprozess, lange Leerlaufphase.", ["3.3.1", "3.3.7"], "development"),
  c("Z02", "Beobachtung", "Arbeitsphase", "Plenum", "Keine Zeitangabe, Arbeitsphase läuft aus, Sicherung verdrängt.", ["3.3.2", "3.3.6"], "development"),
  c("Z03", "Beobachtung", "Einstieg", "Plenum", "Pünktlicher Beginn mit passender Vorwissenaktivierung.", ["3.3.3"], "positive"),
  c("Z04", "Beobachtung", "Übergang", "Plenum", "Gibt es noch Fragen ersetzt Diagnose; SuS können Auftrag nicht erklären.", ["3.3.4"], "development"),
  c("Z05", "Beobachtung", "Einstieg", "Plenum", "Link geht nicht, AB funktioniert nicht, Technik nicht getestet.", ["3.3.5"], "development"),
  c("Z06", "Beobachtung", "Sicherung", "Plenum", "Arbeitsphase zu spät beendet, Sicherung fällt weg.", ["3.3.6"], "development"),
  c("Z07", "Beobachtung", "Arbeitsphase", "Einzelarbeit", "Sprinteraufgabe disfunktional, zu schwer und wird nie gesichert.", ["3.3.7"], "development"),

  free("X01", "Einstieg", "Plenum", "Gäste werden nicht vorgestellt, SuS wirken irritiert.", "free.rahmung-unterrichtsbesuch", "development"),
  free("X02", "Einstieg", "Plenum", "LK erklärt, wofür die Gäste da sind, nimmt Druck raus.", "free.rahmung-unterrichtsbesuch", "positive"),
  free("X03", "Einstieg", "Plenum", "LK sagt: Die schauen nur auf mich. Das ist ungenau.", "free.rahmung-unterrichtsbesuch", "development"),
  free("X04", "Arbeitsphase", "Gruppenarbeit", "3er Gruppen wären passender als große Vierergruppen.", "free.sozialform-gruppengroesse", "development"),
  free("X05", "Erarbeitung", "Plenum", "Fachsprache wird nicht adressatengerecht aufgebaut, plusrechnen statt Addition bleibt stehen.", "free.sprache-fachsprache", "development"),
  free("X06", "Arbeitsphase", "Einzelarbeit", "Arbeitsmaterial zu viel Text, zu viele Abbildungen, kognitive Load zu hoch.", "free.materialgestaltung", "development"),
  free("X07", "Unterrichtsgespräch", "Plenum", "Humor lockert die Situation, die Atmosphäre bleibt lernförderlich.", "free.humor-atmosphaere", "positive"),
  free("X08", "Unterrichtsgespräch", "Plenum", "Meldekette vernetzt Beiträge, SuS nehmen Bezug aufeinander.", "free.meldekette", "positive")
];

function c(id, type, phase, socialForm, text, expectedAny, expectedValence, options = {}) {
  return { id, type, phase, socialForm, text, expectedAny, expectedValence, ...options };
}

function free(id, phase, socialForm, text, expectedFreeAnchor, expectedValence) {
  return c(id, "Beobachtung", phase, socialForm, text, [], expectedValence, { expectedFreeAnchor });
}

function normalizeType(type) {
  const lower = String(type || "").toLowerCase();
  if (lower.includes("lehrer")) return "teacher_quote";
  if (lower.includes("schüler") || lower.includes("schueler")) return "student_quote";
  if (lower.includes("frei")) return "free";
  return "observation";
}

function runCase(testCase, index) {
  const event = live.createLiveObservationEvent({
    id: `stress-${testCase.id}`,
    type: normalizeType(testCase.type),
    text: testCase.text,
    phase: testCase.phase,
    socialForm: testCase.socialForm,
    timestamp: new Date(Date.parse(timing.startTime) + (index % 42) * 60 * 1000).toISOString()
  }, {}, { timing });
  const analysis = live.analyzeLiveObservation(event, [], {});
  const topIds = analysis.suggestions.map((suggestion) => suggestion.item.id);
  const freeAnchorIds = analysis.freeAnchors.map((anchor) => anchor.id);
  const itemHit = testCase.expectedAny.length
    ? testCase.expectedAny.some((id) => topIds.includes(id))
    : true;
  const freeHit = testCase.expectedFreeAnchor
    ? freeAnchorIds.includes(testCase.expectedFreeAnchor)
    : true;
  const fallbackHit = testCase.shouldFallback
    ? analysis.fallback
    : true;
  const valenceHit = testCase.expectedValence && analysis.suggestions[0]
    ? analysis.suggestions.some((suggestion) => suggestion.tendency === testCase.expectedValence || suggestion.tendency === "neutral")
    : true;
  const reviewFlags = [];
  if (!itemHit) reviewFlags.push("expected_item_missing");
  if (!freeHit) reviewFlags.push("expected_free_anchor_missing");
  if (!fallbackHit) reviewFlags.push("expected_fallback_missing");
  if (analysis.suggestions.length > 4) reviewFlags.push("too_many_suggestions");
  if (!analysis.suggestions.length && !analysis.freeAnchors.length && !testCase.shouldFallback) reviewFlags.push("unresolved");
  if (!valenceHit && testCase.expectedValence !== "free") reviewFlags.push("valence_tendency_mismatch");
  return {
    ...testCase,
    topIds,
    freeAnchorIds,
    fallback: analysis.fallback,
    suggestionCount: analysis.suggestions.length,
    reviewFlags,
    suggestions: analysis.suggestions.map((suggestion) => ({
      id: suggestion.item.id,
      label: suggestion.item.label,
      confidence: suggestion.confidence,
      confidenceLabel: suggestion.confidenceLabel,
      tendency: suggestion.tendency,
      score: suggestion.score,
      reasons: suggestion.reasons.slice(0, 5)
    })),
    freeAnchors: analysis.freeAnchors.map((anchor) => ({
      id: anchor.id,
      title: anchor.title,
      confidence: anchor.confidence,
      tendency: anchor.tendency
    }))
  };
}

function countBy(items, selector) {
  const counts = {};
  items.forEach((item) => {
    const key = selector(item);
    if (!key) return;
    counts[key] = (counts[key] ?? 0) + 1;
  });
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "de")));
}

function summarize(results) {
  const flagged = results.filter((result) => result.reviewFlags.length);
  return {
    generatedAt: new Date().toISOString(),
    total: results.length,
    clean: results.length - flagged.length,
    flagged: flagged.length,
    itemHitRate: ratio(results.filter((result) => !result.reviewFlags.includes("expected_item_missing")).length, results.length),
    freeAnchorHitRate: ratio(results.filter((result) => !result.reviewFlags.includes("expected_free_anchor_missing")).length, results.length),
    tooManySuggestions: results.filter((result) => result.reviewFlags.includes("too_many_suggestions")).length,
    unresolved: results.filter((result) => result.reviewFlags.includes("unresolved")).length,
    flagCounts: countBy(results.flatMap((result) => result.reviewFlags), (flag) => flag),
    topItemCounts: countBy(results.flatMap((result) => result.topIds.slice(0, 1)), (id) => id),
    freeAnchorCounts: countBy(results.flatMap((result) => result.freeAnchorIds), (id) => id),
    reviewQueue: flagged.map((result) => ({
      id: result.id,
      text: result.text,
      expectedAny: result.expectedAny,
      expectedFreeAnchor: result.expectedFreeAnchor,
      expectedValence: result.expectedValence,
      topIds: result.topIds,
      freeAnchorIds: result.freeAnchorIds,
      flags: result.reviewFlags,
      suggestions: result.suggestions
    }))
  };
}

function ratio(value, total) {
  return total ? Number((value / total).toFixed(3)) : 0;
}

function runPhase1LiveStressEvaluation() {
  const results = LIVE_STRESS_CASES.map(runCase);
  return {
    summary: summarize(results),
    results
  };
}

if (require.main === module) {
  console.log(JSON.stringify(runPhase1LiveStressEvaluation(), null, 2));
}

module.exports = {
  LIVE_STRESS_CASES,
  runPhase1LiveStressEvaluation
};
