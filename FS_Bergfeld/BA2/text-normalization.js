/*
  Text normalization for offline heuristic matching.
  The original observation text stays unchanged. This module only creates a
  corrected, ASCII-normalized matching layer for rules and local learning.
*/

(function attachTextNormalization(root) {
  const PREPARE_CACHE = new Map();

  const TOKEN_REPLACEMENTS = new Map([
    ["vorgstellt", "vorgestellt"],
    ["vorgestllt", "vorgestellt"],
    ["vorgestellt", "vorgestellt"],
    ["pastt", "passt"],
    ["past", "passt"],
    ["paasst", "passt"],
    ["einstie", "einstieg"],
    ["gals", "als"],
    ["sist", "ist"],
    ["sies", "sie sich"],
    ["erklaer", "erklaert"],
    ["erklar", "erklaert"],
    ["erklaertzu", "erklaert zu"],
    ["tzu", "zu"],
    ["vorberietung", "vorbereitung"],
    ["visualiserung", "visualisierung"],
    ["visualisieren", "visualisierung"],
    ["beachen", "beachten"],
    ["grupenarbeit", "gruppenarbeit"],
    ["grupppe", "gruppe"],
    ["grupppe", "gruppe"],
    ["materila", "material"],
    ["kooperationserfarhung", "kooperationserfahrung"],
    ["heterogeny", "heterogen"],
    ["ergbenisse", "ergebnisse"],
    ["optimallloesung", "optimalloesung"],
    ["optimalllösung", "optimalloesung"],
    ["optimallösung", "optimalloesung"],
    ["medlekette", "meldekette"],
    ["spat", "spaet"],
    ["arbeitmaterila", "arbeitsmaterial"],
    ["technsich", "technisch"],
    ["koennnen", "koennen"],
    ["konnnen", "koennen"],
    ["schuler", "schueler"],
    ["schulerinnenund", "schuelerinnen und"],
    ["su", "sus"],
    ["laa", "laa"],
    ["irgenwie", "irgendwie"],
    ["fertig", "fertig"],
    ["verstaendnis", "verstaendnis"],
    ["klarheit", "klarheit"],
    ["kapiere", "verstehe"],
    ["kapier", "verstehe"],
    ["kapiert", "verstanden"],
    ["kapieren", "verstehen"],
    ["nachdenken", "denkzeit"],
    ["nachdenke", "denkzeit"]
  ]);

  const PHRASE_REPLACEMENTS = [
    ["einstieg als motivator", "einstieg motivator"],
    ["einstieg gals motivator", "einstieg als motivator"],
    ["erklart zu viel", "erklaert zu viel"],
    ["erklaert tzu viel", "erklaert zu viel"],
    ["sagt nu rein wort", "sagt nur ein wort"],
    ["nicht sist klar", "nicht ist klar"],
    ["verschaffen sies ich klarheit", "verschaffen sie sich klarheit"],
    ["was sollen die jetzt machen", "was sollen die jetzt machen"],
    ["was sollen wir jetzt machen", "was sollen wir jetzt machen"],
    ["kapiere ich nicht", "ich verstehe nicht"],
    ["kapier ich nicht", "ich verstehe nicht"],
    ["habe ich nicht kapiert", "ich habe nicht verstanden"],
    ["zu wenig zeit zum nachdenken", "kaum denkzeit"],
    ["zu wenig zeit zum denken", "kaum denkzeit"],
    ["keine zeit zum nachdenken", "keine denkzeit"],
    ["nicht genug zeit zum nachdenken", "kaum denkzeit"]
  ];

  const STOPWORDS = new Set([
    "aber", "alle", "als", "am", "an", "auch", "auf", "bei", "bin", "bis", "da", "das", "dass",
    "den", "der", "die", "dies", "diese", "doch", "du", "ein", "eine", "einen", "einer", "er",
    "es", "etwas", "fuer", "haben", "hat", "hier", "ich", "im", "in", "ist", "ja", "mal", "man",
    "mit", "nicht", "noch", "nur", "oder", "sich", "sie", "sind", "so", "und", "vom", "von",
    "war", "was", "wenn", "wer", "wie", "wir", "wird", "wo", "zu", "zum", "zur"
  ]);

  function transliterateGerman(text) {
    return String(text ?? "")
      .replace(/Ä/g, "Ae")
      .replace(/Ö/g, "Oe")
      .replace(/Ü/g, "Ue")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss");
  }

  function basicNormalize(text) {
    return transliterateGerman(text)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function applyPhraseReplacements(text, corrections) {
    let next = text;
    PHRASE_REPLACEMENTS.forEach(([from, to]) => {
      const normalizedFrom = basicNormalize(from);
      const normalizedTo = basicNormalize(to);
      if (normalizedFrom && ` ${next} `.includes(` ${normalizedFrom} `)) {
        next = ` ${next} `.replaceAll(` ${normalizedFrom} `, ` ${normalizedTo} `).trim().replace(/\s+/g, " ");
        if (normalizedFrom !== normalizedTo) {
          corrections.push({ from: normalizedFrom, to: normalizedTo, type: "phrase" });
        }
      }
    });
    return next;
  }

  function applyTokenReplacements(tokens, corrections) {
    const result = [];
    tokens.forEach((token) => {
      const replacement = TOKEN_REPLACEMENTS.get(token);
      if (replacement && replacement !== token) {
        const normalizedReplacement = basicNormalize(replacement);
        corrections.push({ from: token, to: normalizedReplacement, type: "token" });
        result.push(...normalizedReplacement.split(" ").filter(Boolean));
      } else {
        result.push(token);
      }
    });
    return result;
  }

  function uniqueCorrections(corrections) {
    const seen = new Set();
    return corrections.filter((entry) => {
      const key = `${entry.type}:${entry.from}:${entry.to}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function prepareTextForHeuristic(text) {
    const original = String(text ?? "");
    if (PREPARE_CACHE.has(original)) {
      return PREPARE_CACHE.get(original);
    }
    const corrections = [];
    const rawNormalized = basicNormalize(original);
    const phraseNormalized = applyPhraseReplacements(rawNormalized, corrections);
    const tokens = applyTokenReplacements(phraseNormalized.split(" ").filter(Boolean), corrections);
    const normalizedText = applyPhraseReplacements(tokens.join(" "), corrections);
    const finalTokens = normalizedText.split(" ").filter(Boolean);
    const prepared = {
      original,
      normalizedText,
      tokens: finalTokens,
      signalTokens: finalTokens.filter((token) => token.length > 2 && !STOPWORDS.has(token)),
      corrections: uniqueCorrections(corrections)
    };
    if (PREPARE_CACHE.size > 3000) {
      PREPARE_CACHE.clear();
    }
    PREPARE_CACHE.set(original, prepared);
    return prepared;
  }

  function normalizeTextForHeuristics(text) {
    return prepareTextForHeuristic(text).normalizedText;
  }

  function getSignalNgrams(text, sizes = [2, 3]) {
    const prepared = typeof text === "string" ? prepareTextForHeuristic(text) : text;
    const tokens = prepared.signalTokens ?? [];
    const grams = [];
    sizes.forEach((size) => {
      for (let index = 0; index <= tokens.length - size; index += 1) {
        grams.push(tokens.slice(index, index + size).join(" "));
      }
    });
    return grams;
  }

  const api = {
    prepareTextForHeuristic,
    normalizeTextForHeuristics,
    getSignalNgrams,
    transliterateGerman,
    basicNormalize
  };

  root.UFB_TEXT_NORMALIZATION = api;

  if (typeof module !== "undefined") {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
