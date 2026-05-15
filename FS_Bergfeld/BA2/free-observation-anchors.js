/*
  Free professional observation anchors.
  These are not UFB spider-web items. They catch relevant coaching observations
  that should become free green/blue cards in phase 2 instead of being forced
  into the Tiefenstruktur spider-web.
*/

(function attachFreeObservationAnchors(root) {
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

  const p = (pattern, weight, tendency = "neutral") => ({ pattern, weight, tendency });

  const FREE_OBSERVATION_ANCHORS = [
    {
      id: "free.rahmung-unterrichtsbesuch",
      title: "Rahmung des Unterrichtsbesuchs",
      description: "Gäste, Beobachtungsauftrag und Rolle der Hospitierenden werden für SuS transparent und entlastend eingeordnet.",
      impulse: "Wie kann der Unterrichtsbesuch so gerahmt werden, dass SuS wissen, wer da ist und worauf geschaut wird?",
      tags: ["Rahmung", "Transparenz", "Unterrichtsbesuch"],
      markers: [
        p("begruessung", 3),
        p("gaeste", 7),
        p("gaeste werden vorgestellt", 8, "positive"),
        p("gaeste werden nicht vorgestellt", 8, "development"),
        p("vorgestellt eingeordnet transparenz", 8, "positive"),
        p("nicht vorgestellt eingeordnet", 7, "development"),
        p("die schauen nur auf mich", 9, "development"),
        p("bewerten die schueler nicht", 6, "positive"),
        p("druck raus", 5, "positive"),
        p("moin", 4, "development"),
        p("lets go", 4, "development"),
        p("guten morgen", 4, "positive"),
        p("ihr lieben menschen", 4, "positive")
      ]
    },
    {
      id: "free.sprache-fachsprache",
      title: "Sprache und Fachsprache",
      description: "Sprachliche Präzision, Alltagssprache, Fachsprache und progressive Begriffsbildung werden als Lernbedingung sichtbar.",
      impulse: "Welche sprachliche Stufe brauchen die SuS gerade, damit aus Alltagssprache tragfähige Fachsprache werden kann?",
      tags: ["Sprache", "Fachsprache", "Sprachsensibilität"],
      markers: [
        p("sprache", 6),
        p("fachsprache", 7),
        p("alltagssprache", 6),
        p("adressatengerecht", 6),
        p("nicht exakt", 6, "development"),
        p("sprachsensibilitaet", 7),
        p("sprachsensibel", 7),
        p("plusrechnen", 5),
        p("addition", 5),
        p("fachsprache progressiv", 8, "positive")
      ]
    },
    {
      id: "free.zeit-sicherung",
      title: "Zeit- und Sicherungsplanung",
      description: "Zeitentscheidungen beeinflussen, ob fachliche Bearbeitung, Zwischensicherung und Ergebnissicherung tragfähig stattfinden können.",
      impulse: "Wann hätte die Arbeitsphase zugunsten einer tragfähigen Sicherung beendet oder unterbrochen werden müssen?",
      tags: ["Zeitplanung", "Sicherung", "Arbeitsphase"],
      markers: [
        p("fangen zu spaet an", 8, "development"),
        p("zu spaet", 5, "development"),
        p("sicherung zu spaet", 8, "development"),
        p("bis der letzte fertig ist", 7, "development"),
        p("arbeitsphase zu lang", 7, "development")
      ]
    },
    {
      id: "free.materialgestaltung",
      title: "Materialgestaltung",
      description: "Arbeitsmaterial, Medien und Aufgabenlayout können fachliches Arbeiten stützen oder unnötige Belastung erzeugen.",
      impulse: "Welche Elemente des Materials haben das fachliche Arbeiten wirklich gestützt, welche eher kognitiv belastet?",
      tags: ["Material", "Arbeitsblatt", "kognitive Belastung"],
      markers: [
        p("arbeitsmaterial", 8),
        p("arbeitmaterial", 8),
        p("material", 4),
        p("arbeitsblatt", 5),
        p("zu viel text", 7, "development"),
        p("zu viele abbildungen", 7, "development"),
        p("piktogramm", 5, "development"),
        p("piktogrammen uebersaet", 8, "development"),
        p("kognitive load", 8, "development"),
        p("kognitive belastung", 8, "development"),
        p("aufgabenabhaengigkeit", 8, "development"),
        p("zwischensicherung", 4, "development")
      ]
    },
    {
      id: "free.sozialform-gruppengroesse",
      title: "Passung von Sozialform und Gruppengröße",
      description: "Gruppengröße und Sozialform passen zur Aufgabe, Erfahrung der Lerngruppe und gewünschten Kooperation.",
      impulse: "Welche Gruppengröße und Sozialform hätten den fachlichen Austausch in dieser Situation am besten getragen?",
      tags: ["Sozialform", "Gruppengröße", "Kooperation"],
      markers: [
        p("3er gruppen", 8),
        p("dreiergruppen", 7),
        p("gruppengroesse", 8),
        p("gruppen groesser 4", 8, "development"),
        p("3er gruppen waeren optimal", 8, "development"),
        p("partnerarbeit", 3),
        p("gruppenarbeit", 3),
        p("heterogen", 4),
        p("kooperationserfahrung", 6)
      ]
    },
    {
      id: "free.humor-atmosphaere",
      title: "Humor und Lernatmosphäre",
      description: "Humor kann Beziehung und Lernatmosphäre stützen, aber auch ablenken oder fachliche Klarheit überdecken.",
      impulse: "Hat der Humor in dieser Situation den Lernprozess gestützt oder eher vom fachlichen Kern weggeführt?",
      tags: ["Humor", "Atmosphäre", "Beziehung"],
      markers: [
        p("lustig", 7),
        p("humor", 8),
        p("lachen", 5),
        p("gute atmosphaere", 7, "positive"),
        p("ablenkung", 5, "development")
      ]
    },
    {
      id: "free.meldekette",
      title: "Meldekette als Gesprächswerkzeug",
      description: "Meldeketten sind situativ zu prüfen: Sie können Beiträge vernetzen, aber auch mechanisch oder steuerungsschwach wirken.",
      impulse: "Hat die Meldekette fachliche Bezugnahmen ermöglicht oder eher Moderation ersetzt?",
      tags: ["Meldekette", "Gesprächsführung", "Beteiligung"],
      markers: [
        p("meldekette", 8),
        p("medlekette", 8),
        p("meldenkette", 7),
        p("schueler nehmen sich dran", 5)
      ]
    }
  ];

  function containsPhrase(normalized, pattern) {
    return ` ${normalized} `.includes(` ${pattern} `);
  }

  function analyzeFreeProfessionalObservation(observation) {
    const analysisText = [observation?.text, observation?.hintText, observation?.professionalHint]
      .map((part) => String(part || "").trim())
      .filter(Boolean)
      .join(". ");
    const prepared = textTools?.prepareTextForHeuristic
      ? textTools.prepareTextForHeuristic(analysisText)
      : { normalizedText: analysisText.toLowerCase(), corrections: [] };
    const normalized = prepared.normalizedText;
    const anchors = FREE_OBSERVATION_ANCHORS.map((anchor) => {
      let score = 0;
      let positive = 0;
      let development = 0;
      const reasons = [];
      anchor.markers.forEach((marker) => {
        const pattern = textTools?.normalizeTextForHeuristics
          ? textTools.normalizeTextForHeuristics(marker.pattern)
          : marker.pattern;
        if (pattern && containsPhrase(normalized, pattern)) {
          score += marker.weight;
          if (marker.tendency === "positive") positive += marker.weight;
          if (marker.tendency === "development") development += marker.weight;
          reasons.push({
            type: "freeMarker",
            label: marker.pattern,
            weight: marker.weight,
            text: `freeMarker: ${marker.pattern} (+${marker.weight})`
          });
        }
      });
      const tendency = development > positive ? "development" : positive > development ? "positive" : "neutral";
      return {
        ...anchor,
        score: Number(score.toFixed(1)),
        tendency,
        confidence: Math.max(35, Math.min(96, Math.round(40 + score * 6))),
        reasons
      };
    })
      .filter((anchor) => anchor.score >= 6)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2);

    return {
      anchors,
      textPreparation: prepared,
      hasFreeAnchor: anchors.length > 0
    };
  }

  root.UFB_FREE_OBSERVATION_ANCHORS = FREE_OBSERVATION_ANCHORS;
  root.analyzeFreeProfessionalObservation = analyzeFreeProfessionalObservation;

  if (typeof module !== "undefined") {
    module.exports = {
      FREE_OBSERVATION_ANCHORS,
      analyzeFreeProfessionalObservation
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
