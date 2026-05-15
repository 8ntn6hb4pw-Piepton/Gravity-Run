/*
  Phase-2 Verdichtung for Beobachtungsassistent Tiefenstruktur.
  Creates card candidates from confirmed item observations.
  This is not a UI module and does not evaluate Unterricht automatically.
*/

(function attachPhase2Patterns(root) {
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

  const relationData = (() => {
    if (typeof module !== "undefined" && module.exports) {
      try {
        return require("./phase2-item-relations.js");
      } catch (_error) {
        return root;
      }
    }
    return root;
  })();

  const PHASE2_SECTIONS = [
    {
      id: "positive",
      title: "Lerntragende Wirkungen",
      emptyText: "Noch keine verdichteten lerntragenden Wirkungen."
    },
    {
      id: "development",
      title: "Entwicklungsrelevante Wirkungen",
      emptyText: "Noch keine verdichteten entwicklungsrelevanten Wirkungen."
    },
    {
      id: "mixed",
      title: "Ambivalenzen",
      emptyText: "Keine ambivalenten Muster."
    },
    {
      id: "free",
      title: "Freie fachliche Beobachtungen",
      emptyText: "Keine freien fachlichen Beobachtungen."
    },
    {
      id: "open",
      title: "Noch sortieren",
      emptyText: "Keine offenen Beobachtungen."
    }
  ];

  const UFB_PHASE2_PATTERNS = [
    {
      id: "positive-denkwege-sprache",
      direction: "positive",
      title: "Schülerdenken sprachlich sichtbar",
      itemIds: ["1.2.3", "1.2.4", "1.3.4", "1.4.3"],
      minItems: 2,
      baseStrength: 88,
      statement: "SuS konnten Denkwege, Lösungswege oder Begründungen fachlich ausdrücken.",
      impulse: "Welche Gesprächsführung hat diese fachliche Sprache ermöglicht?"
    },
    {
      id: "positive-verstehen-sichern",
      direction: "positive",
      title: "Verstehen wurde gebündelt",
      itemIds: ["1.1.1", "1.1.4", "1.1.6", "1.1.7"],
      minItems: 2,
      baseStrength: 84,
      statement: "Zentrale Inhalte, Leitfrage und Sicherung griffen erkennbar ineinander.",
      impulse: "Welche Form der Sicherung hat das Verstehen gestützt?"
    },
    {
      id: "positive-fachlich-herausfordern",
      direction: "positive",
      title: "Fachliche Herausforderung wurde produktiv",
      itemIds: ["1.3.1", "1.3.2", "1.3.5", "1.3.7"],
      minItems: 2,
      baseStrength: 86,
      statement: "Aufgaben, Fragen oder Vergleiche führten über reine Reproduktion hinaus.",
      impulse: "Welche Frage oder Aufgabe hat die fachliche Tiefe getragen?"
    },
    {
      id: "positive-feedback-weiterarbeit",
      direction: "positive",
      title: "Feedback wurde nutzbar",
      itemIds: ["2.1.1", "2.1.3", "2.1.4", "2.2.5"],
      minItems: 2,
      baseStrength: 88,
      statement: "Rückmeldungen wurden konkret und für die Weiterarbeit anschlussfähig.",
      impulse: "Woran war erkennbar, dass SuS mit dem Feedback weiterarbeiten konnten?"
    },
    {
      id: "positive-adaptive-unterstuetzung",
      direction: "positive",
      title: "Unterstützung setzte am Lernstand an",
      itemIds: ["2.2.1", "2.2.2", "2.2.3", "2.2.5", "3.2.5"],
      minItems: 2,
      baseStrength: 84,
      statement: "Unterstützung wurde diagnostisch und passend zum Lernstand angelegt.",
      impulse: "Welche Diagnose half, die Unterstützung passend zu machen?"
    },
    {
      id: "positive-fehlerkultur",
      direction: "positive",
      title: "Fehler wurden lernwirksam geschützt",
      itemIds: ["1.3.6", "2.1.5", "2.4.3", "2.3.1"],
      minItems: 2,
      baseStrength: 84,
      statement: "Fehler oder Irritationen wurden fachlich und respektvoll bearbeitet.",
      impulse: "Wie wurde aus dem Fehler ein Lernanlass ohne Bloßstellung?"
    },
    {
      id: "positive-kooperation",
      direction: "positive",
      title: "Zusammenarbeit wurde fachlich",
      itemIds: ["2.4.2", "2.4.5", "2.4.6", "3.3.4"],
      minItems: 2,
      baseStrength: 82,
      statement: "Partner- oder Gruppenarbeit unterstützte fachlichen Austausch.",
      impulse: "Welche Struktur hat aus Zusammenarbeit fachliches Lernen gemacht?"
    },
    {
      id: "positive-zeit-struktur",
      direction: "positive",
      title: "Zeit und Struktur stützten Lernen",
      itemIds: ["3.3.1", "3.3.2", "3.3.4", "3.3.6"],
      minItems: 2,
      baseStrength: 82,
      statement: "Zeitstruktur, Übergänge und Sicherung schützten fachliche Lernzeit.",
      impulse: "Welche Struktur hat Zeit für Bearbeitung und Sicherung ermöglicht?"
    },
    {
      id: "positive-monitoring",
      direction: "positive",
      title: "Arbeitsprozesse wurden im Blick gehalten",
      itemIds: ["3.2.1", "3.2.4", "3.2.5", "3.2.7"],
      minItems: 2,
      baseStrength: 84,
      statement: "Die LK nahm Arbeitsprozesse wahr und stabilisierte sie passend.",
      impulse: "Welche Wahrnehmung half, den Lernprozess zu steuern?"
    },
    {
      id: "positive-beteiligung",
      direction: "positive",
      title: "Fachliche Beteiligung wurde sichtbar",
      itemIds: ["1.4.2", "1.4.3", "1.4.6", "1.4.7"],
      minItems: 2,
      baseStrength: 82,
      statement: "SuS brachten eigene fachliche Beiträge, Impulse oder Überlegungen ein.",
      impulse: "Welche Moderation hat fachliche Beteiligung ermöglicht?"
    },
    {
      id: "development-auftrag-leerlauf",
      direction: "development",
      title: "Arbeitsauftrag und Leerlauf",
      itemIds: ["3.3.4", "3.3.7", "3.2.5", "1.1.1"],
      minItems: 2,
      baseStrength: 90,
      statement: "Unklare Aufträge oder fehlende Anschlusslogik führten zu Leerlauf oder unsicherem Start.",
      impulse: "Wie könnten Auftrag, Ergebnisqualität und Hilfesystem vor der Arbeitsphase abgesichert werden?"
    },
    {
      id: "development-sicherung-kern",
      direction: "development",
      title: "Sicherung des fachlichen Kerns",
      itemIds: ["3.3.6", "1.1.7", "1.1.4", "1.1.6"],
      minItems: 2,
      baseStrength: 90,
      statement: "Zentrale Erkenntnisse wurden am Ende nicht ausreichend gebündelt oder gesichert.",
      impulse: "Was musste trotz Verlaufsschwierigkeiten fachlich gesichert werden?"
    },
    {
      id: "development-feedback-verpufft",
      direction: "development",
      title: "Feedback blieb wenig nutzbar",
      itemIds: ["2.1.1", "2.1.3", "2.1.4"],
      minItems: 2,
      baseStrength: 86,
      statement: "Rückmeldungen waren nicht ausreichend konkret oder wurden nicht sichtbar umgesetzt.",
      impulse: "Wie kann Feedback so formuliert werden, dass der nächste Schritt sichtbar wird?"
    },
    {
      id: "development-unterstuetzung-ohne-diagnose",
      direction: "development",
      title: "Unterstützung ohne hinreichende Diagnose",
      itemIds: ["2.2.1", "2.2.2", "2.2.5", "3.2.5"],
      minItems: 2,
      baseStrength: 88,
      statement: "Unterstützung setzte nicht klar genug an der konkreten Lernhürde an.",
      impulse: "Welche kurze Diagnosefrage hätte vor der Hilfe geklärt, wo es hakt?"
    },
    {
      id: "development-stoerung-als-symptom",
      direction: "development",
      title: "Störung als Symptom lesen",
      itemIds: ["3.1.1", "3.2.3", "3.3.4", "2.2.1", "1.4.1"],
      minItems: 2,
      baseStrength: 84,
      statement: "Störungen oder Fokusverlust könnten mit Auftrag, Überforderung, Unterstützung oder Monitoring zusammenhängen.",
      impulse: "Welche Bedingung hätte den fachlichen Fokus früher stabilisieren können?"
    },
    {
      id: "development-gruppenarbeit-struktur",
      direction: "development",
      title: "Gruppenarbeit fachlich anlegen",
      itemIds: ["2.4.5", "2.4.6", "3.3.4", "3.3.7"],
      minItems: 2,
      baseStrength: 86,
      statement: "Die Sozialform trug fachlichen Austausch nicht zuverlässig.",
      impulse: "Welche Struktur hätte Zusammenarbeit fachlich notwendig und übersichtlich gemacht?"
    },
    {
      id: "development-begruendungstiefe",
      direction: "development",
      title: "Begründungstiefe ausbauen",
      itemIds: ["1.2.4", "1.3.4", "1.3.5", "1.3.1"],
      minItems: 2,
      baseStrength: 86,
      statement: "Antworten oder Lösungswege blieben zu häufig auf Ergebnis- oder Stichwortebene.",
      impulse: "Welche Nachfrage hätte den Schülern eine fachlich bessere zweite Chance gegeben?"
    },
    {
      id: "development-schuelerideen",
      direction: "development",
      title: "Schülerideen aufnehmen",
      itemIds: ["1.4.7", "2.3.3", "1.2.2", "1.3.3"],
      minItems: 2,
      baseStrength: 84,
      statement: "Tragfähige Schülerideen oder Perspektiven wurden nicht ausreichend weiterentwickelt.",
      impulse: "Wie kann eine alternative Schüleridee geprüft werden, ohne die Zielrichtung der Stunde zu verlieren?"
    },
    {
      id: "development-kognitive-last",
      direction: "development",
      title: "Kognitive Last reduzieren",
      itemIds: ["1.1.2", "2.2.2", "1.3.3", "3.3.4"],
      minItems: 2,
      baseStrength: 82,
      statement: "Die fachliche Orientierung könnte durch Visualisierung, Variation oder klarere Rahmung entlastet werden.",
      impulse: "Welche kleine Strukturhilfe würde Verstehen sichern, ohne das Denken abzunehmen?"
    },
    {
      id: "development-beteiligung-bricht",
      direction: "development",
      title: "Fachliche Beteiligung stabilisieren",
      itemIds: ["1.4.1", "1.4.5", "3.2.5", "2.2.1"],
      minItems: 2,
      baseStrength: 84,
      statement: "Fachliche Beteiligung brach bei Unsicherheit, Anspruch oder fehlender Unterstützung ab.",
      impulse: "Woran hätte die LK den Unterstützungsbedarf früher erkennen können?"
    },
    {
      id: "development-material-robustheit",
      direction: "development",
      title: "Material robust und alltagstauglich",
      itemIds: ["3.3.5", "3.3.3", "3.3.1"],
      minItems: 1,
      baseStrength: 76,
      statement: "Material, Medien oder Organisation kosteten fachliche Lernzeit.",
      impulse: "Wie lässt sich ähnliche Qualität mit kleiner, robuster Vorbereitung erreichen?"
    }
  ];

  function createPhase2Cards(observations = [], options = {}) {
    const itemLookup = new Map((root.UFB_ITEM_HEURISTICS ?? []).map((item) => [item.id, item]));
    const timingConfig = options.timing ?? null;
    const prepared = observations
      .map((observation, index) => normalizeObservation(observation, index, timingConfig))
      .filter((observation) => !observation.archived);
    const confirmed = prepared.filter((observation) => observation.itemIds.length);

    const aggregates = aggregateByItemAndDirection(confirmed);
    const relationCards = createRelationCards(confirmed, aggregates, itemLookup, timingConfig);
    const hasRelationDatabase = getPhase2Relations().length > 0;
    const cards = [
      ...relationCards,
      ...createResearchPatternCards(confirmed, aggregates, itemLookup, timingConfig),
      ...(hasRelationDatabase ? [] : createPatternCards(confirmed, aggregates, itemLookup, timingConfig)),
      ...createSingleItemCards(confirmed, aggregates, itemLookup, timingConfig),
      ...(hasRelationDatabase ? [] : createContradictionCards(confirmed, aggregates, itemLookup, timingConfig)),
      ...createStrongEventCards(confirmed, itemLookup, timingConfig),
      ...createFreeProfessionalCards(prepared, timingConfig),
      ...createOpenSortingCards(prepared, itemLookup, timingConfig)
    ];

    return curatePhase2Cards(dedupeCards(cards), options);
  }

  function createPhase2Board(observations = [], options = {}) {
    const cards = createPhase2Cards(observations, options);
    const visibleCards = cards.filter((card) => !card.suppressed);
    const sections = PHASE2_SECTIONS.map((section) => {
      const sectionCards = visibleCards.filter((card) => sectionForDirection(card.direction) === section.id);
      const limit = options.sectionLimits?.[section.id] ?? defaultSectionLimit(section.id);
      return {
        ...section,
        cards: sectionCards.slice(0, limit),
        overflow: sectionCards.slice(limit),
        count: sectionCards.length
      };
    });
    return {
      generatedAt: new Date().toISOString(),
      totalCards: visibleCards.length,
      suppressedCards: cards.filter((card) => card.suppressed).length,
      sections,
      cards: visibleCards
    };
  }

  function normalizeObservation(observation, index, timingConfig) {
    const state = Number(observation.state ?? observation.value ?? 0);
    const directValence = observation.valence ?? observation.direction;
    const direction = directValence || (state === 1 || state === 2 ? "positive" : state === 3 || state === 4 ? "development" : "neutral");
    const strength = Number(observation.strength ?? (state === 2 || state === 4 ? 2 : state === 1 || state === 3 ? 1 : direction === "positive" || direction === "development" ? 1 : 0));
    const rawIds = observation.confirmedItemIds ?? observation.itemIds ?? (observation.itemId ? [observation.itemId] : []);
    const enriched = typeof timing.enrichObservationWithTiming === "function"
      ? timing.enrichObservationWithTiming(observation, timingConfig)
      : observation;
    return {
      ...enriched,
      id: observation.id ?? `obs-${index}`,
      itemIds: rawIds.filter(Boolean),
      direction,
      strength,
      text: observation.text ?? observation.note ?? observation.quote ?? "",
      phase: observation.phase ?? "ohne Phase",
      socialForm: observation.socialForm ?? "ohne Sozialform",
      archived: Boolean(observation.archived || observation.hidden)
    };
  }

  function aggregateByItemAndDirection(observations) {
    const map = new Map();
    observations.forEach((observation) => {
      if (!["positive", "development"].includes(observation.direction)) {
        return;
      }
      observation.itemIds.forEach((itemId) => {
        const key = `${observation.direction}:${itemId}`;
        const entry = map.get(key) ?? {
          itemId,
          direction: observation.direction,
          count: 0,
          strength: 0,
          observations: []
        };
        entry.count += 1;
        entry.strength += Math.max(1, observation.strength);
        entry.observations.push(observation);
        map.set(key, entry);
      });
    });
    return map;
  }

  function createPatternCards(observations, aggregates, itemLookup, timingConfig) {
    return UFB_PHASE2_PATTERNS.flatMap((pattern) => {
      const matched = pattern.itemIds
        .map((itemId) => aggregates.get(`${pattern.direction}:${itemId}`))
        .filter(Boolean);
      if (matched.length < (pattern.minItems ?? 2)) {
        return [];
      }
      const evidence = selectEvidence(matched.flatMap((entry) => entry.observations));
      const strength = matched.reduce((sum, entry) => sum + entry.strength, 0);
      const priority = pattern.baseStrength + Math.min(14, strength * 2) + Math.min(8, matched.length * 2);
      return [makeCard({
        id: `pattern:${pattern.id}`,
        source: "pattern",
        direction: pattern.direction,
        title: pattern.title,
        statement: pattern.statement,
        impulse: pattern.impulse,
        itemIds: matched.map((entry) => entry.itemId),
        priority,
        evidence,
        observations: matched.flatMap((entry) => entry.observations),
        itemLookup,
        timingConfig
      })];
    });
  }

  function createResearchPatternCards(observations, aggregates, itemLookup, timingConfig) {
    const library = root.RESEARCH_PATTERN_LIBRARY;
    const patterns = Array.isArray(library?.patterns) ? library.patterns : [];
    if (!patterns.length) {
      return [];
    }
    return patterns.flatMap((pattern) => {
      const direction = directionForResearchPattern(pattern);
      const itemMatches = matchedResearchItems(pattern, aggregates, direction);
      const phraseMatches = matchedResearchPhrases(pattern, observations);
      const matchedObservations = uniqueObservations([
        ...itemMatches.flatMap((entry) => entry.observations),
        ...phraseMatches.flatMap((entry) => entry.observations)
      ]);
      if (!matchedObservations.length) {
        return [];
      }
      const observedDirections = new Set(matchedObservations.map((observation) => observation.direction).filter(Boolean));
      if (direction === "mixed" && (!observedDirections.has("positive") || !observedDirections.has("development"))) {
        return [];
      }
      const phraseStrength = phraseMatches.reduce((sum, entry) => sum + entry.count, 0);
      const itemStrength = itemMatches.reduce((sum, entry) => sum + entry.strength, 0);
      const affinityBoost = researchAffinityBoost(pattern, matchedObservations);
      const priority = 58
        + Math.min(24, itemStrength * 4)
        + Math.min(18, phraseStrength * 5)
        + Math.min(10, matchedObservations.length * 3)
        + affinityBoost;
      const itemIds = uniqueIds([
        ...itemMatches.map((entry) => entry.itemId),
        ...(pattern.itemCandidates ?? []).filter((id) => matchedObservations.some((observation) => observation.itemIds.includes(id)))
      ]);
      const enoughSubstance = itemMatches.length >= 2 || phraseStrength >= 2 || (itemMatches.length && phraseStrength);
      const priorityThreshold = direction === "mixed" ? 86 : 76;
      if (!enoughSubstance || itemIds.length < (direction === "mixed" ? 2 : 1) || priority < priorityThreshold) {
        return [];
      }
      return [makeCard({
        id: `research:${pattern.patternId}`,
        source: "research-pattern",
        direction,
        title: pattern.title,
        statement: cautiousStatement(pattern.interpretationTemplate),
        impulse: (pattern.possiblePrompts ?? [])[0] ?? "Welche Beobachtung wäre für die Nachbesprechung tragfähig?",
        itemIds,
        priority,
        evidence: selectEvidence(matchedObservations),
        observations: matchedObservations,
        itemLookup,
        timingConfig,
        scoreHints: {
          phraseStrength,
          itemStrength,
          researchPatternBoost: 10,
          counterSignalPenalty: matchedResearchCounterSignals(pattern, matchedObservations)
        },
        relation: { id: pattern.patternId, type: "internal-pattern", status: "candidate" }
      })];
    });
  }

  function matchedResearchItems(pattern, aggregates, direction) {
    const candidates = new Set(pattern.itemCandidates ?? []);
    const families = pattern.relatedItemFamilies ?? [];
    const directions = direction === "mixed" ? ["positive", "development"] : [direction];
    const matches = [];
    directions.forEach((candidateDirection) => {
      aggregates.forEach((entry) => {
        if (entry.direction !== candidateDirection) {
          return;
        }
        const familyMatch = families.some((family) => entry.itemId.startsWith(`${family}.`) || entry.itemId === family);
        if (candidates.has(entry.itemId) || familyMatch) {
          matches.push(entry);
        }
      });
    });
    return matches;
  }

  function matchedResearchPhrases(pattern, observations) {
    const markers = (pattern.patternMarkers ?? []).map((marker) => normalizePhase2Text(marker)).filter(Boolean);
    if (!markers.length) {
      return [];
    }
    return observations.map((observation) => {
      const text = normalizePhase2Text([observation.text, observation.hintText, observation.professionalHint].filter(Boolean).join(" "));
      const count = markers.reduce((sum, marker) => sum + researchMarkerFit(text, marker), 0);
      return count >= 0.85 ? { observation, observations: [observation], count } : null;
    }).filter(Boolean);
  }

  function matchedResearchCounterSignals(pattern, observations) {
    const signals = (pattern.counterSignals ?? []).map((signal) => normalizePhase2Text(signal)).filter(Boolean);
    if (!signals.length) {
      return 0;
    }
    return observations.reduce((sum, observation) => {
      const text = normalizePhase2Text([observation.text, observation.hintText, observation.professionalHint].filter(Boolean).join(" "));
      return sum + signals.reduce((signalSum, signal) => signalSum + researchMarkerFit(text, signal), 0);
    }, 0);
  }

  function researchMarkerFit(text, marker) {
    if (!text || !marker) {
      return 0;
    }
    if (text.includes(marker)) {
      return 1.25;
    }
    const tokens = marker.split(" ").filter((token) => token.length >= 4);
    if (tokens.length < 2) {
      return tokens[0] && text.includes(tokens[0]) ? 0.65 : 0;
    }
    const hits = tokens.filter((token) => text.includes(token)).length;
    const ratio = hits / tokens.length;
    if (hits >= 2 && ratio >= 0.55) {
      return ratio;
    }
    return 0;
  }

  function directionForResearchPattern(pattern) {
    const value = String(pattern.likelyValence ?? pattern.cardType ?? "").toLowerCase();
    if (value.includes("positive")) {
      return "positive";
    }
    if (value.includes("ambivalent") || value.includes("ambivalence") || value.includes("mixed")) {
      return "mixed";
    }
    if (value.includes("development")) {
      return "development";
    }
    return "mixed";
  }

  function researchAffinityBoost(pattern, observations) {
    const phaseAffinity = new Set(pattern.phaseAffinity ?? []);
    const socialAffinity = new Set(pattern.socialFormAffinity ?? []);
    const phaseHits = observations.filter((observation) => phaseAffinity.has(observation.phase)).length;
    const socialHits = observations.filter((observation) => socialAffinity.has(observation.socialForm)).length;
    return Math.min(8, phaseHits * 1.5 + socialHits);
  }

  function cautiousStatement(template) {
    const text = String(template ?? "").trim();
    if (!text) {
      return "Mehrere Beobachtungen könnten eine mögliche Gesprächslesart nahelegen.";
    }
    if (/^(mehrere beobachtungen|eine mögliche lesart|als gesprächsimpuls)/i.test(text)) {
      return text;
    }
    return `Eine mögliche Lesart wäre: ${text}`;
  }

  function normalizePhase2Text(value) {
    return String(value ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ä/g, "ae")
      .replace(/ö/g, "oe")
      .replace(/ü/g, "ue")
      .replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function uniqueIds(ids) {
    return [...new Set(ids.filter(Boolean))];
  }

  function getPhase2Relations() {
    const relations = relationData.PHASE2_ITEM_RELATIONS ?? root.PHASE2_ITEM_RELATIONS ?? [];
    return relations.filter((relation) => relation.status !== "inactive" && relation.acceptedByUser !== false);
  }

  function createRelationCards(observations, aggregates, itemLookup, timingConfig) {
    return getPhase2Relations().flatMap((relation) => {
      if (relation.direction === "mixed") {
        return createMixedRelationCard(relation, aggregates, itemLookup, timingConfig);
      }
      return createDirectionalRelationCard(relation, aggregates, itemLookup, timingConfig);
    });
  }

  function createDirectionalRelationCard(relation, aggregates, itemLookup, timingConfig) {
    if (!["positive", "development"].includes(relation.direction)) {
      return [];
    }
    const matched = relation.itemIds
      .map((itemId) => aggregates.get(`${relation.direction}:${itemId}`))
      .filter(Boolean);
    if (matched.length !== relation.itemIds.length) {
      return [];
    }
    const observations = uniqueObservations(matched.flatMap((entry) => entry.observations));
    const totalStrength = matched.reduce((sum, entry) => sum + entry.strength, 0);
    const totalCount = matched.reduce((sum, entry) => sum + entry.count, 0);
    const relationText = splitRelationCardText(relation);
    const priority = relation.basePriority
      + Math.min(16, totalStrength * 2)
      + Math.min(8, totalCount)
      + Math.min(8, Math.max(0, relation.itemIds.length - 1) * 2)
      + temporalPriorityBoost(observations, timingConfig);
    return [makeCard({
      id: `relation:${relation.id}`,
      source: "item-relation",
      direction: relation.direction,
      title: relation.title,
      statement: relationText.statement,
      impulse: relationText.impulse,
      itemIds: relation.itemIds,
      priority,
      evidence: selectEvidence(observations),
      observations,
      itemLookup,
      timingConfig,
      relation
    })];
  }

  function createMixedRelationCard(relation, aggregates, itemLookup, timingConfig) {
    const matched = relation.itemIds.map((itemId) => ({
      itemId,
      positive: aggregates.get(`positive:${itemId}`),
      development: aggregates.get(`development:${itemId}`)
    })).filter((entry) => entry.positive || entry.development);
    if (matched.length !== relation.itemIds.length) {
      return [];
    }
    const hasPositive = matched.some((entry) => entry.positive);
    const hasDevelopment = matched.some((entry) => entry.development);
    if (!hasPositive || !hasDevelopment) {
      return [];
    }
    const observations = uniqueObservations(matched.flatMap((entry) => [
      ...(entry.positive?.observations ?? []),
      ...(entry.development?.observations ?? [])
    ]));
    const totalStrength = matched.reduce((sum, entry) =>
      sum + (entry.positive?.strength ?? 0) + (entry.development?.strength ?? 0), 0);
    const relationText = splitRelationCardText(relation);
    const priority = relation.basePriority
      + Math.min(14, totalStrength * 2)
      + Math.min(8, observations.length)
      + Math.min(8, Math.max(0, relation.itemIds.length - 1) * 2)
      + temporalPriorityBoost(observations, timingConfig);
    return [makeCard({
      id: `relation:${relation.id}`,
      source: "item-relation",
      direction: "mixed",
      title: relation.title,
      statement: relationText.statement,
      impulse: relationText.impulse,
      itemIds: relation.itemIds,
      priority,
      evidence: selectEvidence(observations),
      observations,
      itemLookup,
      timingConfig,
      relation
    })];
  }

  function splitRelationCardText(relation) {
    const text = relation.cardText ?? "";
    const parts = text.split(/\s+Frage:\s+/);
    if (parts.length > 1) {
      return {
        statement: parts[0].trim(),
        impulse: parts.slice(1).join(" Frage: ").trim()
      };
    }
    if (relation.direction === "development") {
      return {
        statement: `Entwicklungsrelevante Wirkung: ${relation.title}.`,
        impulse: text.trim()
      };
    }
    return {
      statement: text.trim(),
      impulse: ""
    };
  }

  function createSingleItemCards(observations, aggregates, itemLookup, timingConfig) {
    return Array.from(aggregates.values()).flatMap((entry) => {
      const item = itemLookup.get(entry.itemId);
      const enough = entry.strength >= 3 || entry.count >= 2 || entry.observations.some((observation) => observation.strength >= 2);
      if (!item || !enough) {
        return [];
      }
      const priority = 62 + Math.min(22, entry.strength * 5) + Math.min(8, entry.count * 2);
      const statement = entry.direction === "positive"
        ? `Im Bereich "${item.shortLabel}" wurden lerntragende Evidenzen sichtbar.`
        : `Im Bereich "${item.shortLabel}" zeigt sich ein möglicher Entwicklungsanlass.`;
      return [makeCard({
        id: `single:${entry.direction}:${entry.itemId}`,
        source: "single-item",
        direction: entry.direction,
        title: item.shortLabel,
        statement,
        impulse: item.impulseQuestions?.[0] ?? "Welche konkrete Unterrichtssituation könnte dazu in der Nachbesprechung aufgegriffen werden?",
        itemIds: [entry.itemId],
        priority,
        evidence: selectEvidence(entry.observations),
        observations: entry.observations,
        itemLookup,
        timingConfig
      })];
    });
  }

  function createContradictionCards(observations, aggregates, itemLookup, timingConfig) {
    const itemIds = new Set(Array.from(aggregates.values()).map((entry) => entry.itemId));
    return Array.from(itemIds).flatMap((itemId) => {
      const positive = aggregates.get(`positive:${itemId}`);
      const development = aggregates.get(`development:${itemId}`);
      if (!positive || !development) {
        return [];
      }
      const item = itemLookup.get(itemId);
      const all = [...positive.observations, ...development.observations];
      return [makeCard({
        id: `mixed:${itemId}`,
        source: "contradiction",
        direction: "mixed",
        title: `${item?.shortLabel ?? itemId}: ambivalent`,
        statement: "Zu diesem Item wurden sowohl lerntragende Evidenzen als auch Entwicklungspotenziale markiert.",
        impulse: "In welchen Phasen gelang es, und wo brach es weg?",
        itemIds: [itemId],
        priority: 86 + Math.min(12, positive.strength + development.strength),
        evidence: selectEvidence(all),
        observations: all,
        itemLookup,
        timingConfig
      })];
    });
  }

  function createStrongEventCards(observations, itemLookup, timingConfig) {
    return observations.flatMap((observation) => {
      if (!["positive", "development"].includes(observation.direction) || observation.strength < 2 || observation.itemIds.length !== 1) {
        return [];
      }
      const item = itemLookup.get(observation.itemIds[0]);
      return [makeCard({
        id: `event:${observation.id}`,
        source: "strong-event",
        direction: observation.direction,
        title: observation.direction === "positive" ? "Starke Einzelevidenz" : "Zentraler Einzelanlass",
        statement: item ? `Ein einzelner starker Beleg zu "${item.shortLabel}" könnte gesprächsrelevant sein.` : "Eine einzelne starke Beobachtung könnte gesprächsrelevant sein.",
        impulse: item?.impulseQuestions?.[0] ?? "Was macht diese Einzelbeobachtung für die Nachbesprechung bedeutsam?",
        itemIds: observation.itemIds,
        priority: 70,
        evidence: [observation],
        observations: [observation],
        itemLookup,
        timingConfig
      })];
    });
  }

  function createFreeProfessionalCards(observations, timingConfig) {
    const groups = new Map();
    observations.forEach((observation) => {
      const explicitFree = observation.direction === "free" || observation.type === "free";
      const result = typeof freeAnchors.analyzeFreeProfessionalObservation === "function"
        ? freeAnchors.analyzeFreeProfessionalObservation(observation)
        : { anchors: [] };
      const anchors = result.anchors?.length
        ? result.anchors
        : explicitFree
          ? [{
              id: "free.allgemein",
              title: "Freie fachliche Beobachtung",
              description: "Diese Beobachtung wird bewusst nicht in das UFB-Spider-Web einsortiert.",
              impulse: "Warum ist diese Beobachtung für die Nachbesprechung fachlich relevant?",
              tendency: observation.direction === "development" ? "development" : observation.direction === "positive" ? "positive" : "neutral",
              confidence: 60
            }]
          : [];
      anchors.forEach((anchor) => {
        const direction = anchor.tendency === "development" || observation.direction === "development"
          ? "free-development"
          : anchor.tendency === "positive" || observation.direction === "positive"
            ? "free-positive"
            : "free";
        const key = `${direction}:${anchor.id}`;
        const entry = groups.get(key) ?? {
          anchor,
          direction,
          observations: [],
          priority: 58
        };
        entry.observations.push(observation);
        entry.priority += Math.max(2, Math.round((anchor.confidence ?? 60) / 18));
        groups.set(key, entry);
      });
    });

    return Array.from(groups.values()).map((entry) => makeFreeCard(entry, timingConfig));
  }

  function makeFreeCard(entry, timingConfig) {
    const evidence = selectEvidence(entry.observations);
    return {
      id: `free:${entry.direction}:${entry.anchor.id}`,
      source: "free-professional",
      direction: entry.direction,
      title: entry.anchor.title,
      statement: entry.anchor.description,
      impulse: entry.anchor.impulse,
      itemIds: [],
      itemLabels: [],
      priority: Math.round(entry.priority + Math.min(16, entry.observations.length * 4)),
      strengthLabel: strengthLabel(entry.priority),
      evidence: evidence.map((observation) => compactEvidence(observation)),
      phases: [...new Set(entry.observations.map((observation) => observation.phase).filter(Boolean))],
      socialForms: [...new Set(entry.observations.map((observation) => observation.socialForm).filter(Boolean))],
      temporalPattern: typeof timing.getTemporalPattern === "function"
        ? timing.getTemporalPattern(entry.observations, timingConfig)
        : { label: "ohne Zeitmuster", windows: [] },
      status: "candidate",
      display: compactDisplay(entry.anchor.title, entry.anchor.impulse, entry.anchor.description)
    };
  }

  function createOpenSortingCards(observations, itemLookup, timingConfig) {
    const open = observations.filter((observation) =>
      !observation.itemIds.length
      && !["free", "free-positive", "free-development"].includes(observation.direction)
      && observation.suggestedItems?.length
    );
    if (!open.length) {
      return [];
    }
    const byTopSuggestion = new Map();
    open.forEach((observation) => {
      const top = observation.suggestedItems?.[0];
      const key = top?.id ?? "open";
      const entry = byTopSuggestion.get(key) ?? {
        key,
        item: itemLookup.get(key),
        observations: []
      };
      entry.observations.push(observation);
      byTopSuggestion.set(key, entry);
    });
    return Array.from(byTopSuggestion.values()).map((entry) => makeCard({
      id: `open:${entry.key}`,
      source: "open-sorting",
      direction: "open",
      title: entry.item ? `${entry.item.shortLabel} prüfen` : "Offene Beobachtungen sortieren",
      statement: entry.item
        ? `Diese Beobachtungen könnten zu "${entry.item.shortLabel}" passen, sind aber noch nicht bestätigt.`
        : "Diese Beobachtungen sollten nach der Stunde bewusst sortiert oder freigegeben werden.",
      impulse: "Soll diese Beobachtung einem Item, einer freien fachlichen Beobachtung oder keinem Gesprächsanlass zugeordnet werden?",
      itemIds: entry.item ? [entry.item.id] : [],
      priority: 50 + Math.min(16, entry.observations.length * 3),
      evidence: selectEvidence(entry.observations),
      observations: entry.observations,
      itemLookup,
      timingConfig
    }));
  }

  function makeCard(config) {
    const phases = [...new Set(config.observations.map((observation) => observation.phase).filter(Boolean))];
    const socialForms = [...new Set(config.observations.map((observation) => observation.socialForm).filter(Boolean))];
    const temporalPattern = typeof timing.getTemporalPattern === "function"
      ? timing.getTemporalPattern(config.observations, config.timingConfig)
      : { label: "ohne Zeitmuster", windows: [] };
    const itemLabels = config.itemIds.map((id) => config.itemLookup.get(id)?.shortLabel ?? id);
    const compactedEvidence = config.evidence.map((observation) => compactEvidence(observation));
    const relation = config.relation ?? null;
    const clusterScore = computeClusterScore(config, phases, socialForms, temporalPattern);
    const priority = Math.round(config.priority + clusterScore.priorityBoost);
    return {
      id: config.id,
      source: config.source,
      direction: config.direction,
      title: config.title,
      statement: config.statement,
      impulse: config.impulse,
      cardText: relation?.cardText ?? config.statement,
      relationId: relation?.id ?? null,
      relationType: relation?.type ?? null,
      relationStatus: relation?.status ?? null,
      itemIds: config.itemIds,
      itemLabels,
      priority,
      strengthLabel: strengthLabel(priority),
      clusterScore,
      evidence: compactedEvidence,
      phases,
      socialForms,
      temporalPattern,
      status: "candidate",
      display: compactDisplay(config.title, config.impulse, config.statement)
    };
  }

  function computeClusterScore(config, phases, socialForms, temporalPattern) {
    const observations = config.observations ?? [];
    const strengthSum = observations.reduce((sum, observation) => sum + Math.max(1, Number(observation.strength) || 1), 0);
    const directions = new Set(observations.map((observation) => observation.direction).filter(Boolean));
    const scoreHints = config.scoreHints ?? {};
    const components = {
      itemFrequencyScore: Math.min(24, observations.length * 3 + strengthSum),
      itemFitScore: Math.min(18, (config.itemIds?.length ?? 0) * 4 + (config.source === "item-relation" ? 3 : 0)),
      phraseFitScore: Math.min(18, Number(scoreHints.phraseStrength ?? 0) * 5),
      intensityScore: Math.min(14, strengthSum * 2),
      phaseSpreadScore: Math.min(8, Math.max(0, phases.length - 1) * 2),
      temporalCoherenceScore: Math.min(8, temporalPattern?.windows?.length ? 4 + temporalPattern.windows.length : 0),
      valenceCoherenceScore: config.direction === "mixed" ? 4 : directions.size <= 1 ? 8 : 3,
      ambivalenceScore: config.direction === "mixed" ? 12 : 0,
      evidenceDiversityScore: Math.min(8, Math.max(0, socialForms.length - 1) * 2 + Math.min(4, observations.length)),
      freeAnchorBoost: config.source === "free-professional" ? 8 : 0,
      researchPatternBoost: Number(scoreHints.researchPatternBoost ?? 0),
      counterSignalPenalty: Math.min(14, Number(scoreHints.counterSignalPenalty ?? 0) * 4)
    };
    const total = Object.entries(components)
      .filter(([key]) => key !== "counterSignalPenalty")
      .reduce((sum, [, value]) => sum + value, 0) - components.counterSignalPenalty;
    return {
      ...components,
      total: Math.max(0, Math.round(total)),
      priorityBoost: Math.max(-6, Math.min(8, Math.round((total - 48) / 12)))
    };
  }

  function compactEvidence(observation) {
    return {
      id: observation.id,
      text: observation.text,
      timestamp: observation.timestamp,
      phase: observation.phase,
      socialForm: observation.socialForm,
      minuteInLesson: observation.minuteInLesson,
      lessonWindow: observation.lessonWindow,
      direction: observation.direction,
      strength: observation.strength,
      sketchDataUrl: observation.sketchDataUrl ?? observation.sketchImage ?? "",
      sketchImage: observation.sketchDataUrl ?? observation.sketchImage ?? ""
    };
  }

  function compactDisplay(title, impulse, statement) {
    return {
      title,
      impulse,
      statement,
      collapsedFields: ["itemIds", "itemLabels", "evidence", "phases", "socialForms", "temporalPattern"]
    };
  }

  function curatePhase2Cards(cards, options = {}) {
    const sorted = cards.slice().sort(cardComparator);
    const visiblePatterns = sorted.filter((card) => ["item-relation", "pattern", "research-pattern", "contradiction", "free-professional", "open-sorting"].includes(card.source));
    return sorted.map((card) => {
      const coveredBy = coveringCard(card, visiblePatterns) ?? relationCoveringCard(card, visiblePatterns);
      const coveredSingle = ["single-item", "strong-event"].includes(card.source) && !options.showCoveredSingles;
      const coveredRelation = card.source === "item-relation" && !options.showCoveredRelations;
      const suppressed = Boolean(coveredBy) && (coveredSingle || coveredRelation);
      return {
        ...card,
        suppressed,
        coveredBy: coveredBy?.id ?? null,
        section: sectionForDirection(card.direction)
      };
    }).sort(cardComparator);
  }

  function coveringCard(card, patterns) {
    if (!card.itemIds.length || ["item-relation", "pattern", "contradiction"].includes(card.source)) {
      return null;
    }
    return patterns.find((pattern) =>
      (pattern.direction === card.direction || (pattern.direction === "mixed" && card.direction === "mixed"))
      && pattern.priority >= card.priority
      && card.itemIds.every((itemId) => pattern.itemIds.includes(itemId))
    ) ?? null;
  }

  function relationCoveringCard(card, patterns) {
    if (card.source !== "item-relation" || !card.itemIds.length) {
      return null;
    }
    return patterns.find((pattern) =>
      pattern.id !== card.id
      && pattern.source === "item-relation"
      && pattern.direction === card.direction
      && pattern.priority >= card.priority
      && pattern.itemIds.length > card.itemIds.length
      && card.itemIds.every((itemId) => pattern.itemIds.includes(itemId))
    ) ?? null;
  }

  function uniqueObservations(observations) {
    const seen = new Set();
    return observations.filter((observation) => {
      const key = observation.id ?? `${observation.timestamp ?? ""}:${observation.text}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function temporalPriorityBoost(observations, timingConfig) {
    const phases = new Set(observations.map((observation) => observation.phase).filter(Boolean));
    const socialForms = new Set(observations.map((observation) => observation.socialForm).filter(Boolean));
    const windows = typeof timing.getTemporalPattern === "function"
      ? timing.getTemporalPattern(observations, timingConfig).windows ?? []
      : [];
    return Math.min(4, Math.max(0, phases.size - 1))
      + Math.min(3, Math.max(0, socialForms.size - 1))
      + Math.min(5, Math.max(0, windows.length - 1) * 2);
  }

  function selectEvidence(observations) {
    const seen = new Set();
    return observations
      .slice()
      .sort((a, b) => b.strength - a.strength || String(a.timestamp ?? "").localeCompare(String(b.timestamp ?? "")))
      .filter((observation) => {
        const textKey = normalizePhase2Text(observation.text ?? "");
        const key = textKey || observation.id || `${observation.timestamp ?? ""}:${(observation.itemIds ?? []).join(",")}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      })
      .slice(0, 2);
  }

  function dedupeCards(cards) {
    const seen = new Set();
    return cards.filter((card) => {
      const key = `${card.relationId ?? card.source}:${card.direction}:${card.itemIds.slice().sort().join(",")}:${card.title}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function strengthLabel(priority) {
    if (priority >= 100) return "sehr stark";
    if (priority >= 90) return "stark";
    if (priority >= 78) return "eher stark";
    if (priority >= 66) return "prüfen";
    return "niedrig";
  }

  function directionOrder(direction) {
    return PHASE2_SECTIONS.findIndex((section) => section.id === sectionForDirection(direction));
  }

  function sectionForDirection(direction) {
    if (direction === "positive") return "positive";
    if (direction === "development") return "development";
    if (direction === "mixed") return "mixed";
    if (direction === "free-positive" || direction === "free-development" || direction === "free") return "free";
    if (direction === "open" || direction === "neutral") return "open";
    return "open";
  }

  function defaultSectionLimit(sectionId) {
    if (sectionId === "positive") return 10;
    if (sectionId === "development") return 10;
    if (sectionId === "mixed") return 6;
    if (sectionId === "free") return 8;
    return 12;
  }

  function cardComparator(a, b) {
    return directionOrder(a.direction) - directionOrder(b.direction)
      || b.priority - a.priority
      || (b.evidence?.length ?? 0) - (a.evidence?.length ?? 0)
      || a.title.localeCompare(b.title, "de");
  }

  function runPhase2PatternTests() {
    const timingConfig = typeof timing.createLessonTiming === "function"
      ? timing.createLessonTiming({ startTime: "2026-05-13T08:00:00.000Z", durationMinutes: 45 })
      : null;
    const observations = [
      { id: "a", text: "SuS erklären Lösungsweg selbst.", confirmedItemIds: ["1.3.4"], valence: "positive", strength: 2, phase: "Sicherung", socialForm: "Plenum", timestamp: "2026-05-13T08:34:00.000Z" },
      { id: "b", text: "Begründung eingefordert.", confirmedItemIds: ["1.2.4"], valence: "positive", strength: 2, phase: "Unterrichtsgespräch", socialForm: "Plenum", timestamp: "2026-05-13T08:20:00.000Z" },
      { id: "c", text: "Längere fachliche Beiträge.", confirmedItemIds: ["1.4.3"], valence: "positive", strength: 1, phase: "Sicherung", socialForm: "Plenum", timestamp: "2026-05-13T08:37:00.000Z" },
      { id: "d", text: "Auftrag unklar, Gruppen warten.", confirmedItemIds: ["3.3.4"], valence: "development", strength: 2, phase: "Arbeitsphase", socialForm: "Gruppenarbeit", timestamp: "2026-05-13T08:12:00.000Z" },
      { id: "e", text: "Leerlauf in mehreren Gruppen.", confirmedItemIds: ["3.3.7"], valence: "development", strength: 2, phase: "Arbeitsphase", socialForm: "Gruppenarbeit", timestamp: "2026-05-13T08:16:00.000Z" },
      { id: "f", text: "Unterstützungsbedarf nicht erkannt.", confirmedItemIds: ["3.2.5"], valence: "development", strength: 1, phase: "Arbeitsphase", socialForm: "Gruppenarbeit", timestamp: "2026-05-13T08:18:00.000Z" }
    ];
    const board = createPhase2Board(observations, { timing: timingConfig });
    return {
      total: board.totalCards,
      suppressed: board.suppressedCards,
      sections: board.sections.map((section) => ({ id: section.id, title: section.title, count: section.count, overflow: section.overflow.length })),
      top: board.cards.slice(0, 6).map((card) => ({
        id: card.id,
        direction: card.direction,
        section: card.section,
        title: card.title,
        priority: card.priority,
        itemIds: card.itemIds,
        temporalPattern: card.temporalPattern.label
      }))
    };
  }

  root.UFB_PHASE2_PATTERNS = UFB_PHASE2_PATTERNS;
  root.PHASE2_SECTIONS = PHASE2_SECTIONS;
  root.createPhase2Cards = createPhase2Cards;
  root.createPhase2Board = createPhase2Board;
  root.getPhase2Relations = getPhase2Relations;
  root.runPhase2PatternTests = runPhase2PatternTests;

  if (typeof module !== "undefined") {
    module.exports = {
      PHASE2_SECTIONS,
      UFB_PHASE2_PATTERNS,
      createPhase2Cards,
      createPhase2Board,
      getPhase2Relations,
      runPhase2PatternTests
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
