/*
  Local learning profile for the Beobachtungsassistent.
  It learns from confirmed human decisions only. It never changes UFB item text
  and never turns suggestions into automatic evaluations.
*/

(function attachLearningProfile(root) {
  const textTools = (() => {
    if (typeof module !== "undefined" && module.exports) {
      try {
        return require("./text-normalization.js");
      } catch (_error) {
        return root.UFB_TEXT_NORMALIZATION;
      }
    }
    return root.UFB_TEXT_NORMALIZATION;
  })();

  const base = (() => {
    if (typeof module !== "undefined" && module.exports) {
      try {
        return require("./item-heuristics.js");
      } catch (_error) {
        return root;
      }
    }
    return root;
  })();

  const STORAGE_KEY = "ufbTiefenstruktur.learningProfile.v1";
  const PROFILE_VERSION = "2026-05-13.1";
  const MAX_EXAMPLES = 800;

  function getItems() {
    return root.UFB_ITEM_HEURISTICS || base.UFB_ITEM_HEURISTICS || [];
  }

  function getItemById(id) {
    return getItems().find((item) => item.id === id);
  }

  function createLearningProfile() {
    return {
      version: PROFILE_VERSION,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      examples: [],
      itemStats: {}
    };
  }

  function cloneProfile(profile) {
    return JSON.parse(JSON.stringify(profile || createLearningProfile()));
  }

  function loadLearningProfile(storage = root.localStorage) {
    if (!storage?.getItem) {
      return createLearningProfile();
    }
    try {
      const parsed = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
      return parsed?.itemStats ? parsed : createLearningProfile();
    } catch (_error) {
      return createLearningProfile();
    }
  }

  function saveLearningProfile(profile, storage = root.localStorage) {
    const next = cloneProfile(profile);
    next.updatedAt = new Date().toISOString();
    if (storage?.setItem) {
      storage.setItem(STORAGE_KEY, JSON.stringify(next));
    }
    return next;
  }

  function normalizeValence(value) {
    const valence = String(value || "").toLowerCase();
    if (["positive", "green", "gruen", "grün", "lerntragend"].includes(valence)) {
      return "positive";
    }
    if (["development", "blue", "blau", "violett", "entwicklungsrelevant", "entwicklung"].includes(valence)) {
      return "development";
    }
    if (["excluded", "raus", "archiviert", "ignore", "ignored"].includes(valence)) {
      return "excluded";
    }
    if (["free", "frei", "freie beobachtung"].includes(valence)) {
      return "free";
    }
    return "neutral";
  }

  function countIn(object, key, amount = 1) {
    if (!key) {
      return;
    }
    object[key] = (object[key] || 0) + amount;
  }

  function importantTokens(prepared) {
    return [...new Set((prepared.signalTokens || []).filter((token) => token.length > 2))].slice(0, 18);
  }

  function importantPhrases(prepared) {
    if (textTools?.getSignalNgrams) {
      return [...new Set(textTools.getSignalNgrams(prepared, [2, 3]).filter((phrase) => phrase.length >= 7))].slice(0, 14);
    }
    return [];
  }

  function ensureItemStats(profile, itemId) {
    profile.itemStats[itemId] = profile.itemStats[itemId] || {
      total: 0,
      positive: 0,
      development: 0,
      neutral: 0,
      excluded: 0,
      tokens: {},
      phrases: {},
      phases: {},
      socialForms: {},
      examples: []
    };
    return profile.itemStats[itemId];
  }

  function decisionItemIds(decision) {
    const ids = decision?.itemIds || decision?.selectedItemIds || decision?.confirmedItemIds || (decision?.itemId ? [decision.itemId] : []);
    return [...new Set(ids.filter(Boolean))];
  }

  function rememberDecision(profile, observation, decision) {
    const next = cloneProfile(profile);
    const prepared = textTools?.prepareTextForHeuristic
      ? textTools.prepareTextForHeuristic(observation?.text || "")
      : { normalizedText: String(observation?.text || "").toLowerCase(), signalTokens: [], corrections: [] };
    const valence = normalizeValence(decision?.valence || observation?.valence);
    const itemIds = decisionItemIds(decision);
    const example = {
      id: decision?.id || `learn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: observation?.timestamp || new Date().toISOString(),
      text: observation?.text || "",
      normalizedText: prepared.normalizedText,
      type: observation?.type || "observation",
      phase: observation?.phase || "",
      socialForm: observation?.socialForm || "",
      minuteInLesson: observation?.minuteInLesson ?? null,
      itemIds,
      valence,
      corrections: prepared.corrections || []
    };
    next.examples.push(example);
    if (next.examples.length > MAX_EXAMPLES) {
      next.examples = next.examples.slice(next.examples.length - MAX_EXAMPLES);
    }

    itemIds.forEach((itemId) => {
      const stats = ensureItemStats(next, itemId);
      stats.total += 1;
      countIn(stats, valence);
      importantTokens(prepared).forEach((token) => countIn(stats.tokens, token));
      importantPhrases(prepared).forEach((phrase) => countIn(stats.phrases, phrase));
      countIn(stats.phases, observation?.phase || "");
      countIn(stats.socialForms, observation?.socialForm || "");
      stats.examples.push(example.id);
      if (stats.examples.length > 50) {
        stats.examples = stats.examples.slice(stats.examples.length - 50);
      }
    });

    next.updatedAt = new Date().toISOString();
    return next;
  }

  function tokenOverlapScore(stats, tokens, reasons) {
    let score = 0;
    tokens.forEach((token) => {
      const count = stats.tokens[token] || 0;
      if (count > 0) {
        const weight = Math.min(2.4, 0.8 + count * 0.35);
        score += weight;
        reasons.push(reason("learnedToken", `${token} (${count}x bestaetigt)`, weight));
      }
    });
    return score;
  }

  function phraseOverlapScore(stats, phrases, normalizedText, reasons) {
    let score = 0;
    phrases.forEach((phrase) => {
      const count = stats.phrases[phrase] || 0;
      if (count > 0 && normalizedText.includes(phrase)) {
        const weight = Math.min(4, 1.5 + count * 0.6);
        score += weight;
        reasons.push(reason("learnedPhrase", `${phrase} (${count}x bestaetigt)`, weight));
      }
    });
    return score;
  }

  function contextLearningScore(stats, observation, reasons) {
    let score = 0;
    if (observation?.phase && stats.phases[observation.phase]) {
      const weight = Math.min(1.6, 0.6 + stats.phases[observation.phase] * 0.2);
      score += weight;
      reasons.push(reason("learnedPhase", `${observation.phase} (${stats.phases[observation.phase]}x)`, weight));
    }
    if (observation?.socialForm && stats.socialForms[observation.socialForm]) {
      const weight = Math.min(1.4, 0.5 + stats.socialForms[observation.socialForm] * 0.2);
      score += weight;
      reasons.push(reason("learnedSocialForm", `${observation.socialForm} (${stats.socialForms[observation.socialForm]}x)`, weight));
    }
    return score;
  }

  function learnedTendency(stats) {
    if ((stats.development || 0) > (stats.positive || 0) && (stats.development || 0) > (stats.neutral || 0)) {
      return "development";
    }
    if ((stats.positive || 0) > (stats.development || 0) && (stats.positive || 0) > (stats.neutral || 0)) {
      return "positive";
    }
    return "neutral";
  }

  function reason(type, label, weight) {
    const rounded = Number(weight.toFixed(1));
    const sign = rounded >= 0 ? "+" : "";
    return { type, label, weight: rounded, text: `${type}: ${label} (${sign}${rounded})` };
  }

  function scoreLearningProfile(profile, observation) {
    const prepared = textTools?.prepareTextForHeuristic
      ? textTools.prepareTextForHeuristic(observation?.text || "")
      : { normalizedText: String(observation?.text || "").toLowerCase(), signalTokens: [] };
    const tokens = new Set(importantTokens(prepared));
    const phrases = importantPhrases(prepared);
    return Object.entries(profile?.itemStats || {})
      .map(([itemId, stats]) => {
        const item = getItemById(itemId);
        if (!item || stats.excluded > Math.max(stats.positive || 0, stats.development || 0, stats.neutral || 0)) {
          return null;
        }
        const reasons = [];
        let score = 0;
        score += tokenOverlapScore(stats, tokens, reasons);
        score += phraseOverlapScore(stats, phrases, prepared.normalizedText, reasons);
        score += contextLearningScore(stats, observation, reasons);
        if (stats.total >= 3 && score > 0) {
          const weight = Math.min(1.8, stats.total * 0.25);
          score += weight;
          reasons.push(reason("learnedRecurrence", `${stats.total} bestaetigte Zuordnung(en)`, weight));
        }
        return {
          item,
          score: Number(score.toFixed(1)),
          tendency: learnedTendency(stats),
          reasons,
          source: "learningProfile"
        };
      })
      .filter((result) => result && result.score >= 2.5)
      .sort((a, b) => b.score - a.score);
  }

  function confidencePercent(score, nextScore = 0) {
    const gap = Math.max(0, score - nextScore);
    return Math.max(35, Math.min(96, Math.round(38 + score * 4.2 + gap * 2.5)));
  }

  function confidenceLabel(percent) {
    if (percent >= 90) return "sehr hoch";
    if (percent >= 78) return "hoch";
    if (percent >= 64) return "eher hoch";
    if (percent >= 50) return "eher niedrig";
    if (percent >= 38) return "niedrig";
    return "sehr niedrig";
  }

  function mergeLearning(baseResult, learningSuggestions) {
    const map = new Map((baseResult.allScores || []).map((entry) => [entry.item.id, { ...entry, reasons: [...entry.reasons] }]));
    learningSuggestions.forEach((learned) => {
      const existing = map.get(learned.item.id);
      const learningBoost = Math.min(8, learned.score);
      if (existing) {
        existing.score = Number((existing.score + learningBoost).toFixed(1));
        existing.reasons.push(...learned.reasons.map((entry) => ({ ...entry, type: `learning:${entry.type}` })));
        if (existing.tendency === "neutral" && learned.tendency !== "neutral") {
          existing.tendency = learned.tendency;
        }
      } else {
        map.set(learned.item.id, {
          item: learned.item,
          score: Number(learningBoost.toFixed(1)),
          tendency: learned.tendency,
          reasons: learned.reasons.map((entry) => ({ ...entry, type: `learning:${entry.type}` }))
        });
      }
    });
    const allScores = [...map.values()].sort((a, b) => b.score - a.score);
    const topScore = allScores[0]?.score ?? 0;
    const suggestions = allScores
      .filter((result, index) => result.score >= 6 && (index < 3 || (index === 3 && result.score >= 12 && topScore - result.score <= 2)))
      .slice(0, 4)
      .map((result, index) => {
        const confidence = confidencePercent(result.score, allScores[index + 1]?.score || 0);
        return { ...result, confidence, confidenceLabel: confidenceLabel(confidence) };
      });
    return { allScores, suggestions };
  }

  function analyzeUfbItemObservationWithLearning(observation, history = [], profile = loadLearningProfile()) {
    const baseAnalyze = base.analyzeUfbItemObservation || root.analyzeUfbItemObservation;
    const baseResult = baseAnalyze(observation, history);
    const learningSuggestions = scoreLearningProfile(profile, observation);
    const merged = mergeLearning(baseResult, learningSuggestions);
    return {
      ...baseResult,
      suggestions: merged.suggestions,
      allScores: merged.allScores.map((entry, index) => {
        const confidence = confidencePercent(entry.score, merged.allScores[index + 1]?.score || 0);
        return { ...entry, confidence, confidenceLabel: confidenceLabel(confidence) };
      }),
      fallback: merged.suggestions.length === 0,
      message: merged.suggestions.length ? "" : baseResult.message,
      learningSuggestions
    };
  }

  function resetLearningProfile(storage = root.localStorage) {
    if (storage?.removeItem) {
      storage.removeItem(STORAGE_KEY);
    }
    return createLearningProfile();
  }

  const api = {
    STORAGE_KEY,
    PROFILE_VERSION,
    createLearningProfile,
    loadLearningProfile,
    saveLearningProfile,
    resetLearningProfile,
    rememberDecision,
    scoreLearningProfile,
    analyzeUfbItemObservationWithLearning
  };

  root.UFB_LEARNING_PROFILE = api;
  root.analyzeUfbItemObservationWithLearning = analyzeUfbItemObservationWithLearning;

  if (typeof module !== "undefined") {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
