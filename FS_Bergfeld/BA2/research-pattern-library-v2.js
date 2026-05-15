/* Generated fallback from research-pattern-library-v2.json. Internal logic only; do not show source families in reader. */
(function(root){
  root.RESEARCH_PATTERN_LIBRARY = {
  "libraryId": "research-pattern-library-v2",
  "version": "0.2.0",
  "language": "de",
  "visibility": "internal_only",
  "purpose": "Interne, evidenzorientierte Musterbibliothek für Phase-2-Verdichtung und Gesprächsimpulse. Nicht direkt im LAA-Reader anzeigen.",
  "designPrinciples": [
    "Die Bibliothek erzeugt Hypothesen, keine Diagnosen.",
    "Quellen dienen als Hintergrundlogik, nicht als sichtbare Theorieetiketten.",
    "Muster werden nur als mögliche Gesprächslesarten genutzt.",
    "Der Nutzer entscheidet in Phase 2, was übernommen, geparkt oder verworfen wird.",
    "Originalbeobachtungen bleiben wichtiger als Theoriebezüge."
  ],
  "sourceFamilies": [
    {
      "id": "ufb_tiefenstruktur",
      "label": "Unterrichtsfeedbackbogen Tiefenstrukturen"
    },
    {
      "id": "qa_nrw",
      "label": "Qualitätsanalyse NRW"
    },
    {
      "id": "helmke",
      "label": "Helmke, Unterrichtsqualität"
    },
    {
      "id": "visible_learning",
      "label": "Hattie / Visible Learning"
    },
    {
      "id": "clt",
      "label": "Cognitive Load Theory"
    },
    {
      "id": "paed_psych",
      "label": "Pädagogische Psychologie"
    },
    {
      "id": "math_didactics",
      "label": "Mathematikdidaktik"
    },
    {
      "id": "nrw_curriculum_math",
      "label": "Lehrpläne Mathematik NRW"
    },
    {
      "id": "clearinghouse_tum",
      "label": "Clearing House Unterricht"
    },
    {
      "id": "forschungsmonitor_schule",
      "label": "Forschungsmonitor Schule"
    }
  ],
  "scoringModel": {
    "intendedUse": "Phase-2-Cluster und Nachanalyse. Nicht für harte Entscheidungen.",
    "inputs": [
      "confirmedItems",
      "candidateItems",
      "rawObservationText",
      "normalizedObservationText",
      "hintText",
      "phase",
      "socialForm",
      "valence",
      "intensity",
      "freeAnchors",
      "timePosition",
      "discussionStatus",
      "sketchLinks"
    ],
    "scores": {
      "itemFitScore": "Nähe der bestätigten und vorgeschlagenen Items zum Muster.",
      "phraseFitScore": "Nähe von Beobachtungs- und Hinweistext zu patternMarkers.",
      "intensityScore": "Dunkelgrün oder dunkelblau stärker als helle Markierung.",
      "phaseScore": "Muster in passender Phase oder phasenübergreifend stärker.",
      "temporalCoherenceScore": "Mehrere nahe Einträge als situatives Muster, gestreute Einträge als strukturelles Muster.",
      "valenceCoherenceScore": "Einheitliche Valenz stärkt klare Karte, gemischte Valenz stärkt Ambivalenzkarte.",
      "evidenceDiversityScore": "Beobachtung + Zitat + Hinweis + Skizze + freier Anker erhöht Tragfähigkeit.",
      "counterSignalPenalty": "Gegenindikatoren senken, schließen aber nicht hart aus."
    },
    "thresholds": {
      "strong": 0.72,
      "medium": 0.52,
      "weak": 0.35
    },
    "uiLabels": {
      "strong": "starke mögliche Lesart",
      "medium": "mögliche Lesart",
      "weak": "schwache Nebenlesart"
    }
  },
  "patterns": [
    {
      "patternId": "student_thinking_visible_not_used",
      "title": "Schülerdenken wird sichtbar, aber nicht weitergeführt",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Tiefenstruktur",
        "Visible Learning",
        "Mathematikdidaktik",
        "Pädagogische Psychologie"
      ],
      "primaryDomains": [
        "Kognitive Aktivierung",
        "Mathematikdidaktik"
      ],
      "relatedItemFamilies": [
        "1.2",
        "1.4",
        "1.3"
      ],
      "itemCandidates": [
        "1.2.1",
        "1.2.2",
        "1.2.3",
        "1.4.2",
        "1.4.3"
      ],
      "patternMarkers": [
        "geht nicht auf die Idee ein",
        "greift Beitrag nicht auf",
        "liegen lassen",
        "Schüleransatz bleibt stehen",
        "Denkweg wird nicht weitergeführt",
        "guter Beitrag verpufft",
        "Lehrkraft erklärt selbst weiter",
        "Schüler sagt nur ein Wort",
        "fachlicher Gedanke bleibt ungenutzt"
      ],
      "counterSignals": [
        "Beitrag wird explizit aufgegriffen",
        "Schüler vergleichen Denkwege",
        "Schülerbeitrag wird zur Sicherung genutzt"
      ],
      "phaseAffinity": [
        "Erarbeitung",
        "Sicherung",
        "Unterrichtsgespräch"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch"
      ],
      "likelyValence": "development_or_ambivalent",
      "cardType": "development_or_ambivalence",
      "interpretationTemplate": "Mehrere Beobachtungen könnten darauf hindeuten, dass Schülerdenken zwar sichtbar wurde, aber nicht konsequent als Lerngegenstand weitergeführt wurde.",
      "possiblePrompts": [
        "Welche Schülergedanken hätten stärker als gemeinsamer Denkgegenstand genutzt werden können?",
        "Welche Nachfrage hätte den Denkweg sichtbar gemacht?",
        "Wo hätte ein Schülerbeitrag die fachliche Vertiefung tragen können?"
      ],
      "scoringHints": [
        "Hinweisfeld stark gewichten, wenn dort 'aufgreifen', 'liegen lassen', 'kluger Beitrag' steht.",
        "1.2.2 gegenüber 1.4.2 priorisieren, wenn ein vorhandener Beitrag nicht weitergeführt wird."
      ]
    },
    {
      "patternId": "cognitive_overload_unnecessary",
      "title": "Mögliche unnötige kognitive Belastung",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Cognitive Load Theory",
        "Helmke",
        "Tiefenstruktur",
        "Pädagogische Psychologie"
      ],
      "primaryDomains": [
        "Konstruktive Unterstützung",
        "Strukturierung",
        "Cognitive Load"
      ],
      "relatedItemFamilies": [
        "1.1",
        "2.2",
        "3.3"
      ],
      "itemCandidates": [
        "1.1.2",
        "1.1.3",
        "2.2.3",
        "3.3.4",
        "3.3.6"
      ],
      "patternMarkers": [
        "zu viel Text",
        "sprachlich überfrachtet",
        "keiner kapiert",
        "Aufgabe überfordert",
        "Arbeitsauftrag unklar",
        "zu viele Informationen",
        "Material unübersichtlich",
        "Schüler fragen mehrfach nach",
        "Tempo zu hoch",
        "keine Segmentierung"
      ],
      "counterSignals": [
        "Auftrag wird knapp und klar geklärt",
        "Material fokussiert zentrale Information",
        "Lehrkraft segmentiert sichtbar",
        "Schüler können selbstständig beginnen"
      ],
      "phaseAffinity": [
        "Einstieg",
        "Erarbeitung",
        "Arbeitsphase"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Einzelarbeit",
        "Gruppenarbeit"
      ],
      "likelyValence": "development",
      "cardType": "development",
      "interpretationTemplate": "Mehrere Beobachtungen könnten auf vermeidbare kognitive Belastung hindeuten.",
      "possiblePrompts": [
        "Wo entstand möglicherweise vermeidbare kognitive Belastung?",
        "Welche Information hätte reduziert, segmentiert oder später gegeben werden können?",
        "Welche Darstellung hätte Verständnis entlastet?"
      ],
      "scoringHints": [
        "Booste bei 'zu viel', 'unklar', 'überfordert' oder wiederholten Nachfragen.",
        "Bei Mathematik Symbolsprache, Darstellungswechsel und Textmenge zusätzlich beachten."
      ]
    },
    {
      "patternId": "procedural_without_understanding",
      "title": "Verfahren werden ausgeführt, aber wenig verstanden oder begründet",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Mathematikdidaktik",
        "Lehrpläne Mathematik NRW",
        "Visible Learning",
        "Tiefenstruktur"
      ],
      "primaryDomains": [
        "Mathematikdidaktik",
        "Kognitive Aktivierung"
      ],
      "relatedItemFamilies": [
        "1.1",
        "1.3",
        "1.4"
      ],
      "itemCandidates": [
        "1.1.4",
        "1.3.2",
        "1.3.4",
        "1.3.7",
        "1.4.3"
      ],
      "patternMarkers": [
        "nur Ergebnis",
        "Rechenweg ohne Begründung",
        "Formel anwenden",
        "kein Warum",
        "keine Vernetzung",
        "Darstellungswechsel nicht genutzt",
        "Begriff bleibt unklar",
        "Algorithmus wird vorgemacht",
        "Schüler rechnen nach"
      ],
      "counterSignals": [
        "Schüler begründen Verfahren",
        "Darstellungen werden verbunden",
        "Begriff wird aus Beispielen aufgebaut",
        "Fehler werden fachlich genutzt"
      ],
      "phaseAffinity": [
        "Erarbeitung",
        "Arbeitsphase",
        "Sicherung"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch",
        "Einzelarbeit"
      ],
      "likelyValence": "development_or_ambivalent",
      "cardType": "development_or_ambivalence",
      "interpretationTemplate": "Eine mögliche Lesart wäre, dass die Stunde prozedurale Aktivität erzeugt, aber fachliches Verstehen nur begrenzt vertieft.",
      "possiblePrompts": [
        "Wo wurde mathematisch begründet und wo nur gerechnet?",
        "Welche Darstellung hätte den Begriff oder Zusammenhang stärker sichtbar gemacht?",
        "Welche Schülererklärung hätte zur Vertiefung genutzt werden können?"
      ],
      "scoringHints": [
        "In Mathematikstunden bei Ergebnisorientierung ohne Begründung boosten.",
        "Sicherung auf Ergebnisebene ist ein starkes Signal."
      ]
    },
    {
      "patternId": "learning_goal_not_operational",
      "title": "Lernziel oder Kernanliegen bleibt für Lernende nicht handlungsleitend",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Visible Learning",
        "Helmke",
        "Tiefenstruktur",
        "QA NRW"
      ],
      "primaryDomains": [
        "Zielklarheit",
        "Strukturierung"
      ],
      "relatedItemFamilies": [
        "1.1",
        "3.3"
      ],
      "itemCandidates": [
        "1.1.1",
        "1.1.5",
        "1.1.7",
        "3.3.4"
      ],
      "patternMarkers": [
        "Ziel bleibt unklar",
        "warum machen wir das",
        "kein Rückbezug",
        "Einstieg passt nicht zur Stunde",
        "Auftrag ohne Zweck",
        "Sicherung ohne Kern",
        "roter Faden fehlt",
        "Kernanliegen nicht sichtbar"
      ],
      "counterSignals": [
        "Verstehensziel explizit",
        "Rückbezug in Sicherung",
        "Schüler können Ziel in eigenen Worten sagen"
      ],
      "phaseAffinity": [
        "Einstieg",
        "Sicherung",
        "Erarbeitung"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch"
      ],
      "likelyValence": "development",
      "cardType": "development",
      "interpretationTemplate": "Mehrere Beobachtungen könnten darauf hindeuten, dass Ziel oder Kernanliegen für die Lernenden nicht durchgehend orientierend war.",
      "possiblePrompts": [
        "Woran sollten die Lernenden am Ende merken, was sie verstanden haben?",
        "Wo hätte ein Rückbezug zum Kernanliegen die Stunde bündeln können?"
      ]
    },
    {
      "patternId": "feedback_low_information",
      "title": "Feedback bleibt wenig informationshaltig",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Visible Learning",
        "Pädagogische Psychologie",
        "Tiefenstruktur",
        "Helmke"
      ],
      "primaryDomains": [
        "Feedback",
        "Konstruktive Unterstützung"
      ],
      "relatedItemFamilies": [
        "2.1",
        "1.2"
      ],
      "itemCandidates": [
        "2.1.1",
        "2.1.5",
        "1.2.5"
      ],
      "patternMarkers": [
        "nur richtig falsch",
        "gut gemacht ohne Begründung",
        "Fehler wird übergangen",
        "Feedback bleibt allgemein",
        "keine nächste Handlung",
        "Lösung wird genannt",
        "Schüler weiß nicht was verbessern"
      ],
      "counterSignals": [
        "Feedback enthält nächsten Schritt",
        "Fehler wird fachlich geklärt",
        "Rückmeldung bezieht sich auf Lernziel"
      ],
      "phaseAffinity": [
        "Arbeitsphase",
        "Sicherung",
        "Erarbeitung"
      ],
      "socialFormAffinity": [
        "Einzelarbeit",
        "Partnerarbeit",
        "Plenum"
      ],
      "likelyValence": "development_or_ambivalent",
      "cardType": "development_or_ambivalence",
      "interpretationTemplate": "Eine mögliche Gesprächslesart wäre, dass Feedback vorhanden ist, aber noch stärker lernsteuernd werden könnte.",
      "possiblePrompts": [
        "Welche Rückmeldung hätte den nächsten Lernschritt sichtbar gemacht?",
        "Woran konnten die Lernenden erkennen, was fachlich tragfähig war?"
      ]
    },
    {
      "patternId": "late_reactive_support",
      "title": "Unterstützung reagiert spät statt präventiv",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Helmke",
        "Pädagogische Psychologie",
        "QA NRW",
        "Tiefenstruktur"
      ],
      "primaryDomains": [
        "Konstruktive Unterstützung",
        "Klassenführung"
      ],
      "relatedItemFamilies": [
        "2.2",
        "3.2"
      ],
      "itemCandidates": [
        "2.2.1",
        "2.2.3",
        "3.2.3",
        "3.2.5"
      ],
      "patternMarkers": [
        "merkt spät",
        "geht erst spät rum",
        "Hilfe nach Scheitern",
        "viele warten",
        "Leerlauf",
        "Unterstützung kommt zu spät",
        "Schüler hängen",
        "Überforderung wird spät erkannt"
      ],
      "counterSignals": [
        "Lehrkraft scannt früh",
        "kurze präventive Klärung",
        "Hilfen sind verfügbar",
        "Fehler werden früh sichtbar gemacht"
      ],
      "phaseAffinity": [
        "Arbeitsphase",
        "Erarbeitung"
      ],
      "socialFormAffinity": [
        "Einzelarbeit",
        "Gruppenarbeit",
        "Partnerarbeit"
      ],
      "likelyValence": "development",
      "cardType": "development",
      "interpretationTemplate": "Mehrere Beobachtungen könnten darauf hindeuten, dass Unterstützung eher reaktiv als vorausschauend eingesetzt wurde.",
      "possiblePrompts": [
        "Wo hätte eine frühe Diagnose oder Zwischenklärung Lernzeit geschützt?",
        "Welche Signale der Lernenden hätten früher aufgegriffen werden können?"
      ]
    },
    {
      "patternId": "activation_without_structure",
      "title": "Hohe Aktivierung bei sinkender Struktur",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Helmke",
        "Tiefenstruktur",
        "Visible Learning"
      ],
      "primaryDomains": [
        "Kognitive Aktivierung",
        "Klassenführung"
      ],
      "relatedItemFamilies": [
        "1.4",
        "3.1",
        "3.3"
      ],
      "itemCandidates": [
        "1.4.2",
        "1.4.3",
        "3.1.1",
        "3.3.4"
      ],
      "patternMarkers": [
        "viele Beiträge aber unklar",
        "Zwischenrufe",
        "Gespräch springt",
        "Unruhe",
        "Lehrkraft bündelt wenig",
        "rote Linie geht verloren",
        "Aktivität hoch aber Fokus unklar"
      ],
      "counterSignals": [
        "Beiträge werden strukturiert gesammelt",
        "Lehrkraft bündelt sichtbar",
        "Gespräch bleibt am fachlichen Kern"
      ],
      "phaseAffinity": [
        "Erarbeitung",
        "Sicherung",
        "Unterrichtsgespräch"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch"
      ],
      "likelyValence": "ambivalent",
      "cardType": "ambivalence",
      "interpretationTemplate": "Eine mögliche Ambivalenz: Die Stunde aktiviert, braucht aber stärkere Bündelung, damit Aktivierung fachlich trägt.",
      "possiblePrompts": [
        "Wie hätte die hohe Beteiligung stärker fachlich gebündelt werden können?",
        "Welche Beiträge waren zentral und welche hätten zurückgestellt werden können?"
      ]
    },
    {
      "patternId": "structured_but_low_activation",
      "title": "Klare Führung, aber geringe kognitive Eigenaktivität",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Helmke",
        "Tiefenstruktur",
        "Visible Learning",
        "Mathematikdidaktik"
      ],
      "primaryDomains": [
        "Klassenführung",
        "Kognitive Aktivierung"
      ],
      "relatedItemFamilies": [
        "3.1",
        "1.3",
        "1.4"
      ],
      "itemCandidates": [
        "3.1.1",
        "1.3.3",
        "1.3.4",
        "1.4.2"
      ],
      "patternMarkers": [
        "sehr ruhig aber passiv",
        "Lehrkraft macht viel",
        "Schüler hören zu",
        "wenig Denkzeit",
        "wenig eigene Ansätze",
        "keine Irritation",
        "nur Nachvollzug"
      ],
      "counterSignals": [
        "Schüler entwickeln eigene Ansätze",
        "produktive Denkzeit",
        "Schüler erklären längere fachliche Beiträge"
      ],
      "phaseAffinity": [
        "Einstieg",
        "Erarbeitung",
        "Sicherung"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch"
      ],
      "likelyValence": "ambivalent",
      "cardType": "ambivalence",
      "interpretationTemplate": "Eine mögliche Ambivalenz: Die Klassenführung ist stabil, die kognitive Aktivierung bleibt aber begrenzt.",
      "possiblePrompts": [
        "Wo hätte die klare Struktur Raum für eigenes Denken öffnen können?",
        "Welche Frage hätte mehr Denkaktivität erzeugt?"
      ]
    },
    {
      "patternId": "groupwork_organizational_not_cognitive",
      "title": "Gruppenarbeit bleibt organisatorisch statt fachlich",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Forschungsmonitor Schule",
        "Tiefenstruktur",
        "Helmke",
        "Pädagogische Psychologie"
      ],
      "primaryDomains": [
        "Kooperation",
        "Kognitive Aktivierung"
      ],
      "relatedItemFamilies": [
        "2.4",
        "1.4",
        "3.3"
      ],
      "itemCandidates": [
        "2.4.5",
        "2.4.6",
        "1.4.3",
        "3.3.4"
      ],
      "patternMarkers": [
        "viel Organisation wenig Mathematik",
        "einer arbeitet allein",
        "Aufgaben werden verteilt",
        "kein Austausch über Lösung",
        "Gruppen zu groß",
        "Kooperationserfahrung unklar",
        "nur abschreiben",
        "Materialverwaltung"
      ],
      "counterSignals": [
        "Schüler erklären sich Lösungswege",
        "gegenseitige Begründung",
        "Rollen dienen fachlicher Auseinandersetzung"
      ],
      "phaseAffinity": [
        "Arbeitsphase"
      ],
      "socialFormAffinity": [
        "Gruppenarbeit",
        "Partnerarbeit"
      ],
      "likelyValence": "development_or_ambivalent",
      "cardType": "development_or_ambivalence",
      "interpretationTemplate": "Eine mögliche Lesart wäre, dass die Sozialform aktiv wirkt, aber fachliches gemeinsames Denken noch stärker angelegt werden müsste.",
      "possiblePrompts": [
        "Wo wurde in der Gruppe wirklich fachlich gedacht?",
        "Welche Struktur hätte sachbezogene Zusammenarbeit wahrscheinlicher gemacht?"
      ]
    },
    {
      "patternId": "surface_security_not_learning",
      "title": "Ruhige Klasse wird mit Lernen verwechselt",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Helmke",
        "QA NRW",
        "Tiefenstruktur",
        "Pädagogische Psychologie"
      ],
      "primaryDomains": [
        "Klassenführung",
        "Lernprozessdiagnose"
      ],
      "relatedItemFamilies": [
        "3.1",
        "3.2",
        "1.2"
      ],
      "itemCandidates": [
        "3.1.1",
        "3.2.1",
        "3.2.5",
        "1.2.1"
      ],
      "patternMarkers": [
        "Schüler sind ruhig",
        "aber keiner arbeitet",
        "keine Denkspuren",
        "nur still",
        "wenig Beteiligung",
        "Lernstand unklar",
        "keine Überprüfung"
      ],
      "counterSignals": [
        "ruhige, sichtbare Bearbeitung",
        "Denkwege werden geprüft",
        "Lehrkraft gewinnt Einblick in Lernstände"
      ],
      "phaseAffinity": [
        "Arbeitsphase",
        "Plenum"
      ],
      "socialFormAffinity": [
        "Einzelarbeit",
        "Plenum"
      ],
      "likelyValence": "ambivalent",
      "cardType": "ambivalence",
      "interpretationTemplate": "Eine mögliche Ambivalenz: Der Verlauf wirkt ruhig, aber Lernprozesse werden möglicherweise zu wenig sichtbar.",
      "possiblePrompts": [
        "Woran wurde sichtbar, dass wirklich gelernt wurde?",
        "Welche Beobachtung hätte Lernaktivität statt nur Ruhe gezeigt?"
      ]
    },
    {
      "patternId": "sicherung_surface_level",
      "title": "Sicherung bleibt auf Oberflächen- oder Ergebnisebene",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Tiefenstruktur",
        "Mathematikdidaktik",
        "Visible Learning",
        "Lehrpläne Mathematik NRW"
      ],
      "primaryDomains": [
        "Sicherung",
        "Mathematische Begriffsbildung"
      ],
      "relatedItemFamilies": [
        "1.1",
        "1.3",
        "1.2"
      ],
      "itemCandidates": [
        "1.1.7",
        "1.1.4",
        "1.3.7",
        "1.2.7"
      ],
      "patternMarkers": [
        "nur Ergebnisse",
        "keine Zusammenfassung",
        "kein Rückbezug",
        "Zwischensicherung fehlt",
        "Sicherung zu knapp",
        "kein fachlicher Kern",
        "Lösungen werden nur vorgelesen"
      ],
      "counterSignals": [
        "fachlicher Kern wird zusammengefasst",
        "Fehler und Wege werden verglichen",
        "Rückbezug auf Lernziel"
      ],
      "phaseAffinity": [
        "Sicherung"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch"
      ],
      "likelyValence": "development",
      "cardType": "development",
      "interpretationTemplate": "Mehrere Beobachtungen könnten darauf hindeuten, dass Sicherung eher Ergebnisse sammelt als Verständnis bündelt.",
      "possiblePrompts": [
        "Was sollte in der Sicherung fachlich hängen bleiben?",
        "Welche Denkwege oder Begriffe hätten gesichert werden müssen?"
      ]
    },
    {
      "patternId": "mathematical_language_not_built",
      "title": "Fach- und Bildungssprache wird nicht tragfähig aufgebaut",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Mathematikdidaktik",
        "Pädagogische Psychologie",
        "Tiefenstruktur",
        "Lehrpläne Mathematik NRW"
      ],
      "primaryDomains": [
        "Sprache",
        "Mathematikdidaktik"
      ],
      "relatedItemFamilies": [
        "1.1",
        "2.2",
        "1.4"
      ],
      "itemCandidates": [
        "1.1.3",
        "2.2.2",
        "2.2.3",
        "1.4.3"
      ],
      "patternMarkers": [
        "Fachsprache beachten",
        "Sprache ungenau",
        "Alltagssprache bleibt stehen",
        "Begriff nicht geklärt",
        "Formulierung wird nicht eingefordert",
        "Schüler sagen nur irgendwas",
        "mathematische Sprache fehlt"
      ],
      "counterSignals": [
        "Fachbegriffe werden aufgebaut",
        "Schüler formulieren mathematisch zunehmend präzise",
        "Lehrkraft modelliert und fordert Fachsprache"
      ],
      "phaseAffinity": [
        "Erarbeitung",
        "Sicherung",
        "Unterrichtsgespräch"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch"
      ],
      "likelyValence": "development",
      "cardType": "development",
      "interpretationTemplate": "Eine mögliche Lesart wäre, dass fachliche Sprache noch stärker aufgebaut, modelliert und eingefordert werden müsste.",
      "possiblePrompts": [
        "Welche Begriffe sollten die Lernenden am Ende präziser verwenden können?",
        "Wo hätte Sprache vom Alltäglichen ins Mathematische überführt werden können?"
      ]
    },
    {
      "patternId": "error_potential_not_used",
      "title": "Fehler werden nicht als Lernanlass genutzt",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Tiefenstruktur",
        "Visible Learning",
        "Pädagogische Psychologie",
        "Mathematikdidaktik"
      ],
      "primaryDomains": [
        "Fehlerkultur",
        "Kognitive Aktivierung"
      ],
      "relatedItemFamilies": [
        "1.3",
        "2.1",
        "2.4"
      ],
      "itemCandidates": [
        "1.3.6",
        "2.1.5",
        "2.4.3"
      ],
      "patternMarkers": [
        "Fehler wird übergangen",
        "Fehlerkultur",
        "falsche Antwort wird schnell korrigiert",
        "Lehrkraft gibt Lösung",
        "Irritation wird nicht genutzt",
        "Missverständnis bleibt unklar"
      ],
      "counterSignals": [
        "Fehler wird fachlich geklärt",
        "Irritation produktiv genutzt",
        "Schüler vergleichen Fehlvorstellung und tragfähige Lösung"
      ],
      "phaseAffinity": [
        "Erarbeitung",
        "Sicherung"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Unterrichtsgespräch"
      ],
      "likelyValence": "development_or_ambivalent",
      "cardType": "development_or_ambivalence",
      "interpretationTemplate": "Mehrere Beobachtungen könnten darauf hindeuten, dass Fehler oder Irritationen noch stärker als Lernanlass genutzt werden könnten.",
      "possiblePrompts": [
        "Welcher Fehler hätte fachlich produktiv gemacht werden können?",
        "Wie hätte die Irritation zum gemeinsamen Denken genutzt werden können?"
      ]
    },
    {
      "patternId": "transition_task_unclear",
      "title": "Übergänge und Arbeitsaufträge erzeugen Reibung",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Helmke",
        "QA NRW",
        "Tiefenstruktur",
        "Cognitive Load Theory"
      ],
      "primaryDomains": [
        "Strukturierte Klassenführung",
        "Arbeitsorganisation"
      ],
      "relatedItemFamilies": [
        "3.3",
        "3.1",
        "2.2"
      ],
      "itemCandidates": [
        "3.3.4",
        "3.3.7",
        "3.1.3",
        "2.2.2"
      ],
      "patternMarkers": [
        "Auftrag unklar",
        "Übergang unruhig",
        "Schüler wissen nicht was tun",
        "viele Nachfragen zum Auftrag",
        "Leerlauf",
        "Materialsuche",
        "Start verzögert",
        "Phase beginnt nicht fachlich"
      ],
      "counterSignals": [
        "Auftrag knapp und sichtbar",
        "Schüler starten zügig",
        "Material ist vorbereitet",
        "Übergang klar ritualisiert"
      ],
      "phaseAffinity": [
        "Einstieg",
        "Arbeitsphase",
        "Erarbeitung"
      ],
      "socialFormAffinity": [
        "Plenum",
        "Gruppenarbeit",
        "Einzelarbeit"
      ],
      "likelyValence": "development",
      "cardType": "development",
      "interpretationTemplate": "Eine mögliche Lesart wäre, dass Übergänge oder Aufträge Lernzeit und Orientierung kosten.",
      "possiblePrompts": [
        "Was mussten die Lernenden genau tun und woran war das sichtbar?",
        "Welche Übergangsstruktur hätte den fachlichen Beginn beschleunigt?"
      ]
    },
    {
      "patternId": "motivation_without_learning_function",
      "title": "Motivation oder Kontext trägt fachliches Lernen nur begrenzt",
      "visibility": "internal_only",
      "sourceFamilies": [
        "Pädagogische Psychologie",
        "Mathematikdidaktik",
        "Tiefenstruktur",
        "Visible Learning"
      ],
      "primaryDomains": [
        "Motivation",
        "Kognitive Aktivierung"
      ],
      "relatedItemFamilies": [
        "1.1",
        "1.3",
        "1.4"
      ],
      "itemCandidates": [
        "1.1.1",
        "1.1.4",
        "1.3.3",
        "1.4.2"
      ],
      "patternMarkers": [
        "Einstieg als Motivator",
        "netter Kontext",
        "aber fachlich nicht genutzt",
        "Showeffekt",
        "Kontext bleibt dekorativ",
        "keine Verbindung zur Aufgabe",
        "Interesse ohne mathematische Frage"
      ],
      "counterSignals": [
        "Kontext erzeugt mathematische Fragestellung",
        "Einstieg trägt Kernproblem",
        "Motivation wird fachlich zurückgebunden"
      ],
      "phaseAffinity": [
        "Einstieg",
        "Erarbeitung"
      ],
      "socialFormAffinity": [
        "Plenum"
      ],
      "likelyValence": "ambivalent",
      "cardType": "ambivalence",
      "interpretationTemplate": "Eine mögliche Ambivalenz: Der Kontext aktiviert Interesse, trägt aber das fachliche Lernen nur begrenzt.",
      "possiblePrompts": [
        "Welche mathematische Frage hat der Einstieg wirklich erzeugt?",
        "Wo wurde der Kontext fachlich wieder aufgenommen?"
      ]
    }
  ]
};
  root.RESEARCH_PATTERN_LIBRARY_STATUS = { loaded: true, patternCount: (root.RESEARCH_PATTERN_LIBRARY.patterns || []).length, message: 'Interne Musterbibliothek lokal bereit.' };
  root.dispatchEvent?.(new CustomEvent('research-pattern-library-loaded', { detail: root.RESEARCH_PATTERN_LIBRARY_STATUS }));
})(typeof window !== 'undefined' ? window : globalThis);
