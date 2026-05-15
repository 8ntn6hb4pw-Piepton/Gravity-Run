#!/usr/bin/env node
/*
  Reproducible stress test for the UFB item heuristic.

  This does not decide whether suggestions are pedagogically correct. It checks
  whether the offline rule system behaves plausibly under messy, real-ish input:
  max. 3 suggestions, fallbacks, confidence, valence tendency, typo correction,
  and review queues for human calibration.
*/

const fs = require("fs");
const path = require("path");

require("./text-normalization.js");
const itemHeuristics = require("./item-heuristics.js");
require("./item-heuristics-extended.js");
require("./user-corpus-calibration.js");
const freeAnchors = require("./free-observation-anchors.js");
const learningProfile = require("./learning-profile.js");

const DEFAULT_CORPUS = "test-corpus-user-2026-05-13.json";
const DEFAULT_REPORT_JSON = "heuristic-evaluation-results.json";
const DEFAULT_REPORT_MD = "heuristic-evaluation-report.md";

function normalizeType(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("lehrer")) return "teacher_quote";
  if (text.includes("schüler") || text.includes("schueler")) return "student_quote";
  if (text.includes("frei")) return "free";
  return "observation";
}

function normalizeSocialForm(value) {
  return String(value || "")
    .replaceAll("Grupenarbeit", "Gruppenarbeit")
    .replaceAll("grupenarbeit", "Gruppenarbeit")
    .trim();
}

function normalizeExpectedValence(value) {
  const text = String(value || "").toLowerCase();
  if (["positive", "green", "gruen", "grün", "lerntragend"].includes(text)) return "positive";
  if (["development", "blue", "blau", "violett", "entwicklung", "entwicklungsrelevant"].includes(text)) return "development";
  if (["free", "frei", "freie beobachtung"].includes(text)) return "free";
  return "unknown";
}

function loadCorpus(filePath) {
  const resolved = path.resolve(filePath);
  return JSON.parse(fs.readFileSync(resolved, "utf8")).map((entry, index) => ({
    id: entry.id || `case-${String(index + 1).padStart(3, "0")}`,
    nr: entry.nr || String(index + 1),
    phase: entry.phase || "",
    socialForm: normalizeSocialForm(entry.socialForm),
    type: entry.type || "Beobachtungsnotiz",
    text: entry.text || "",
    expectedValence: normalizeExpectedValence(entry.expectedValence || entry.directionRaw),
    expectedItemIds: entry.expectedItemIds || entry.expectedItems || [],
    directionRaw: entry.directionRaw || ""
  }));
}

function compactSuggestion(suggestion) {
  return {
    itemId: suggestion.item.id,
    parentId: suggestion.item.parentId,
    label: suggestion.item.shortLabel,
    exactText: suggestion.item.exactText,
    score: suggestion.score,
    confidence: suggestion.confidence,
    confidenceLabel: suggestion.confidenceLabel,
    tendency: suggestion.tendency,
    reasons: suggestion.reasons.map((entry) => entry.text)
  };
}

function analyzeCase(entry, profile = null) {
  const observation = {
    text: entry.text,
    phase: entry.phase,
    socialForm: entry.socialForm,
    type: normalizeType(entry.type)
  };
  const result = profile
    ? learningProfile.analyzeUfbItemObservationWithLearning(observation, [], profile)
    : itemHeuristics.analyzeUfbItemObservation(observation, []);
  const freeResult = freeAnchors.analyzeFreeProfessionalObservation(observation);
  const suggestions = result.suggestions.map(compactSuggestion);
  const top = suggestions[0] || null;
  return {
    ...entry,
    normalizedType: observation.type,
    normalizedSocialForm: observation.socialForm,
    normalizedText: result.textPreparation?.normalizedText || "",
    corrections: result.textPreparation?.corrections || [],
    freeAnchors: freeResult.anchors.map((anchor) => ({
      id: anchor.id,
      title: anchor.title,
      score: anchor.score,
      confidence: anchor.confidence,
      tendency: anchor.tendency,
      impulse: anchor.impulse,
      tags: anchor.tags,
      reasons: anchor.reasons.map((entry) => entry.text)
    })),
    fallback: result.fallback,
    message: result.message,
    suggestionCount: suggestions.length,
    top,
    suggestions,
    topScores: result.allScores.slice(0, 6).map((score) => ({
      itemId: score.item.id,
      label: score.item.shortLabel,
      score: score.score,
      confidence: score.confidence,
      confidenceLabel: score.confidenceLabel,
      tendency: score.tendency
    })),
    reviewFlags: []
  };
}

function countBy(items, selector) {
  const counts = {};
  items.forEach((item) => {
    const key = selector(item) || "<leer>";
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.fromEntries(Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])));
}

function topEntries(object, limit = 12) {
  return Object.entries(object).slice(0, limit).map(([key, value]) => ({ key, value }));
}

function addReviewFlags(caseResult) {
  const flags = [];
  if (caseResult.fallback) {
    if (caseResult.freeAnchors.length) {
      flags.push("free_professional_observation");
    } else {
      flags.push("unresolved_fallback");
    }
  }
  if (caseResult.suggestionCount > 3) {
    flags.push("too_many_suggestions");
  }
  if (caseResult.top && caseResult.top.confidence < 55) {
    flags.push("low_confidence");
  }
  if (caseResult.expectedValence === "development" && caseResult.top?.tendency === "positive") {
    flags.push("valence_conflict_blue_vs_positive");
  }
  if (caseResult.expectedValence === "positive" && caseResult.top?.tendency === "development") {
    flags.push("valence_conflict_green_vs_development");
  }
  if (["positive", "development"].includes(caseResult.expectedValence) && caseResult.top?.tendency === "neutral") {
    flags.push("neutral_tendency_for_colored_case");
  }
  if (caseResult.expectedItemIds.length && !caseResult.expectedItemIds.some((id) => caseResult.suggestions.some((suggestion) => suggestion.itemId === id))) {
    flags.push("expected_item_missing");
  }
  if (caseResult.expectedValence === "free" && caseResult.suggestions.length > 0) {
    flags.push("free_case_got_suggestion");
  }
  return { ...caseResult, reviewFlags: flags };
}

function summarize(results, corpusPath) {
  const total = results.length;
  const withSuggestions = results.filter((item) => item.suggestionCount > 0);
  const fallbacks = results.filter((item) => item.fallback);
  const freeProfessional = results.filter((item) => item.freeAnchors.length > 0);
  const unresolvedFallbacks = results.filter((item) => item.fallback && item.freeAnchors.length === 0);
  const tooMany = results.filter((item) => item.suggestionCount > 3);
  const corrections = results.flatMap((item) => item.corrections);
  const correctionCounts = countBy(corrections, (entry) => `${entry.from} -> ${entry.to}`);
  const reviewCounts = countBy(results.flatMap((item) => item.reviewFlags), (flag) => flag);
  const hasExpectedItems = results.some((item) => item.expectedItemIds.length > 0);
  const expectedItemHits = hasExpectedItems
    ? results.filter((item) => item.expectedItemIds.length && item.expectedItemIds.some((id) => item.suggestions.some((suggestion) => suggestion.itemId === id))).length
    : null;

  return {
    corpusPath,
    generatedAt: new Date().toISOString(),
    total,
    withSuggestions: withSuggestions.length,
    fallbacks: fallbacks.length,
    fallbackRate: Number((fallbacks.length / total).toFixed(3)),
    freeProfessionalObservations: freeProfessional.length,
    unresolvedFallbacks: unresolvedFallbacks.length,
    unresolvedFallbackRate: Number((unresolvedFallbacks.length / total).toFixed(3)),
    tooManySuggestions: tooMany.length,
    totalCorrections: corrections.length,
    expectedItemAccuracy: hasExpectedItems ? Number((expectedItemHits / results.filter((item) => item.expectedItemIds.length).length).toFixed(3)) : null,
    distributions: {
      phase: countBy(results, (item) => item.phase),
      socialForm: countBy(results, (item) => item.socialForm),
      type: countBy(results, (item) => item.type),
      expectedValence: countBy(results, (item) => item.expectedValence),
      topItem: countBy(results.filter((item) => item.top), (item) => `${item.top.itemId} ${item.top.label}`),
      topParent: countBy(results.filter((item) => item.top), (item) => item.top.parentId),
      topTendency: countBy(results.filter((item) => item.top), (item) => item.top.tendency),
      confidenceLabel: countBy(results.filter((item) => item.top), (item) => item.top.confidenceLabel),
      correction: correctionCounts,
      freeAnchor: countBy(results.flatMap((item) => item.freeAnchors), (anchor) => anchor.title),
      reviewFlag: reviewCounts
    },
    reviewQueues: {
      freeProfessional: freeProfessional.map(compactCaseForReview),
      unresolvedFallbacks: unresolvedFallbacks.map(compactCaseForReview),
      valenceConflicts: results.filter((item) => item.reviewFlags.some((flag) => flag.startsWith("valence_conflict"))).map(compactCaseForReview),
      neutralColored: results.filter((item) => item.reviewFlags.includes("neutral_tendency_for_colored_case")).map(compactCaseForReview),
      lowConfidence: results.filter((item) => item.reviewFlags.includes("low_confidence")).map(compactCaseForReview),
      freeCaseSuggestions: results.filter((item) => item.reviewFlags.includes("free_case_got_suggestion")).map(compactCaseForReview)
    }
  };
}

function compactCaseForReview(item) {
  return {
    id: item.id,
    nr: item.nr,
    phase: item.phase,
    socialForm: item.socialForm,
    type: item.type,
    expectedValence: item.expectedValence,
    text: item.text,
    normalizedText: item.normalizedText,
    top: item.top
      ? {
          itemId: item.top.itemId,
          label: item.top.label,
          score: item.top.score,
          confidence: item.top.confidence,
          confidenceLabel: item.top.confidenceLabel,
          tendency: item.top.tendency
        }
      : null,
    suggestions: item.suggestions.slice(0, 3).map((suggestion) => `${suggestion.itemId} ${suggestion.label} (${suggestion.confidence}%, ${suggestion.tendency})`),
    freeAnchors: item.freeAnchors.map((anchor) => `${anchor.title} (${anchor.confidence}%, ${anchor.tendency})`),
    reviewFlags: item.reviewFlags
  };
}

function renderMarkdown(summary, results) {
  const lines = [];
  lines.push("# Heuristik-Belastungstest");
  lines.push("");
  lines.push(`Korpus: \`${summary.corpusPath}\``);
  lines.push(`Erzeugt: ${summary.generatedAt}`);
  lines.push("");
  lines.push("## Kurzbefund");
  lines.push("");
  lines.push(`- Fälle: ${summary.total}`);
  lines.push(`- Mit Vorschlägen: ${summary.withSuggestions}`);
  lines.push(`- Fallbacks: ${summary.fallbacks} (${Math.round(summary.fallbackRate * 100)}%)`);
  lines.push(`- Davon freie professionelle Anker: ${summary.freeProfessionalObservations}`);
  lines.push(`- Ungelöste Fallbacks: ${summary.unresolvedFallbacks} (${Math.round(summary.unresolvedFallbackRate * 100)}%)`);
  lines.push(`- Zu lange Vorschlagslisten (>3): ${summary.tooManySuggestions}`);
  lines.push(`- Erkannte Tipp-/Normalisierungskorrekturen: ${summary.totalCorrections}`);
  lines.push(`- Trefferquote gegen Ziel-Items: ${summary.expectedItemAccuracy === null ? "nicht berechenbar, weil keine Ziel-Items im Korpus stehen" : `${Math.round(summary.expectedItemAccuracy * 100)}%`}`);
  lines.push("");
  lines.push("## Top-Items");
  lines.push("");
  lines.push("| Item | Anzahl |");
  lines.push("|---|---:|");
  topEntries(summary.distributions.topItem, 20).forEach(({ key, value }) => lines.push(`| ${escapeMd(key)} | ${value} |`));
  lines.push("");
  lines.push("## Freie professionelle Anker");
  lines.push("");
  lines.push("| Anker | Anzahl |");
  lines.push("|---|---:|");
  topEntries(summary.distributions.freeAnchor, 20).forEach(({ key, value }) => lines.push(`| ${escapeMd(key)} | ${value} |`));
  if (!Object.keys(summary.distributions.freeAnchor).length) {
    lines.push("| keine | 0 |");
  }
  lines.push("");
  lines.push("## Review-Flags");
  lines.push("");
  lines.push("| Flag | Anzahl |");
  lines.push("|---|---:|");
  topEntries(summary.distributions.reviewFlag, 20).forEach(({ key, value }) => lines.push(`| ${escapeMd(key)} | ${value} |`));
  if (!Object.keys(summary.distributions.reviewFlag).length) {
    lines.push("| keine | 0 |");
  }
  lines.push("");
  lines.push("## Häufigste Korrekturen");
  lines.push("");
  lines.push("| Korrektur | Anzahl |");
  lines.push("|---|---:|");
  topEntries(summary.distributions.correction, 20).forEach(({ key, value }) => lines.push(`| ${escapeMd(key)} | ${value} |`));
  if (!Object.keys(summary.distributions.correction).length) {
    lines.push("| keine | 0 |");
  }
  lines.push("");
  lines.push("## Freie professionelle Beobachtungen");
  lines.push("");
  summary.reviewQueues.freeProfessional.slice(0, 40).forEach((item) => {
    lines.push(`- **${escapeMd(item.phase)} / ${escapeMd(item.socialForm)} / ${escapeMd(item.type)}**: ${escapeMd(item.text)} → ${escapeMd(item.freeAnchors.join(" | "))}`);
  });
  if (!summary.reviewQueues.freeProfessional.length) {
    lines.push("- keine");
  }
  if (summary.reviewQueues.freeProfessional.length > 40) {
    lines.push(`- ... ${summary.reviewQueues.freeProfessional.length - 40} weitere`);
  }
  lines.push("");
  lines.push("## Ungelöste Fallbacks zur fachlichen Klärung");
  lines.push("");
  summary.reviewQueues.unresolvedFallbacks.slice(0, 40).forEach((item) => {
    lines.push(`- **${escapeMd(item.phase)} / ${escapeMd(item.socialForm)} / ${escapeMd(item.type)}**: ${escapeMd(item.text)}`);
  });
  if (!summary.reviewQueues.unresolvedFallbacks.length) {
    lines.push("- keine");
  }
  if (summary.reviewQueues.unresolvedFallbacks.length > 40) {
    lines.push(`- ... ${summary.reviewQueues.unresolvedFallbacks.length - 40} weitere`);
  }
  lines.push("");
  lines.push("## Fälle mit neutraler Tendenz trotz farbiger Erwartung");
  lines.push("");
  summary.reviewQueues.neutralColored.slice(0, 40).forEach((item) => {
    lines.push(`- ${escapeMd(item.text)} → ${item.suggestions.join(" | ") || "kein Vorschlag"}`);
  });
  if (!summary.reviewQueues.neutralColored.length) {
    lines.push("- keine");
  }
  lines.push("");
  lines.push("## Vollständige Fallliste");
  lines.push("");
  lines.push("| Nr. | Erwartung | Text | Top-3 UFB | freie Anker | Flags |");
  lines.push("|---:|---|---|---|---|---|");
  results.forEach((item) => {
    const top3 = item.suggestions.slice(0, 3).map((suggestion) => `${suggestion.itemId} ${suggestion.label} ${suggestion.confidence}% ${suggestion.tendency}`).join("<br>");
    const free = item.freeAnchors.map((anchor) => `${anchor.title} ${anchor.confidence}% ${anchor.tendency}`).join("<br>");
    lines.push(`| ${escapeMd(item.nr)} | ${escapeMd(item.expectedValence)} | ${escapeMd(item.text)} | ${escapeMd(top3 || "Fallback")} | ${escapeMd(free || "-")} | ${escapeMd(item.reviewFlags.join(", ") || "-")} |`);
  });
  lines.push("");
  return lines.join("\n");
}

function escapeMd(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", " ")
    .trim();
}

function writeReports(summary, results, jsonPath, markdownPath) {
  fs.writeFileSync(jsonPath, JSON.stringify({ summary, results }, null, 2), "utf8");
  fs.writeFileSync(markdownPath, renderMarkdown(summary, results), "utf8");
}

function main() {
  const corpusPath = process.argv[2] || DEFAULT_CORPUS;
  const reportJson = process.argv[3] || DEFAULT_REPORT_JSON;
  const reportMd = process.argv[4] || DEFAULT_REPORT_MD;
  const corpus = loadCorpus(corpusPath);
  const started = Date.now();
  const results = corpus.map((entry) => addReviewFlags(analyzeCase(entry)));
  const elapsedMs = Date.now() - started;
  const summary = summarize(results, corpusPath);
  summary.elapsedMs = elapsedMs;
  writeReports(summary, results, reportJson, reportMd);
  console.log(JSON.stringify({
    corpus: corpusPath,
    reportJson,
    reportMd,
    total: summary.total,
    elapsedMs,
    withSuggestions: summary.withSuggestions,
    fallbacks: summary.fallbacks,
    freeProfessionalObservations: summary.freeProfessionalObservations,
    unresolvedFallbacks: summary.unresolvedFallbacks,
    tooManySuggestions: summary.tooManySuggestions,
    totalCorrections: summary.totalCorrections,
    reviewFlags: summary.distributions.reviewFlag
  }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = {
  loadCorpus,
  analyzeCase,
  addReviewFlags,
  summarize,
  renderMarkdown
};
