const UFB_HEURISTICS = [
  {
    id: "1-1",
    dimension: "Kognitive Aktivierung",
    label: "Verständnisorientierung",
    manualCore: "Zentrale Inhalte, Zusammenhänge und Lernziele werden verstehensorientiert geklärt, gerahmt oder gesichert.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Sicherung", "Unterrichtsgespräch", "Nach Stunde"],
    likelySocialForms: ["Plenum", "Lehrervortrag", "Schülerpräsentation"],
    positiveMarkers: ["bezug zur leitfrage", "lernziel klar", "zusammenfassung", "zentraler zusammenhang", "verständnis sichern"],
    developmentMarkers: ["kein bezug zur leitfrage", "nur ergebnisse", "unklarer auftrag", "kein roter faden", "nicht zusammengefasst"],
    teacherPhrases: [
      { pattern: "was ist heute wichtig", weight: 4, tendency: "positive" },
      { pattern: "das ziel ist", weight: 4, tendency: "positive" },
      { pattern: "wir sichern", weight: 3, tendency: "positive" },
      { pattern: "dann machen wir weiter", weight: 2, tendency: "development", requiresContext: true },
      { pattern: "dann weiter", weight: 3, tendency: "development", requiresContext: true }
    ],
    studentPhrases: [
      { pattern: "was sollen wir", weight: 3, tendency: "development" },
      { pattern: "ich verstehe nicht was", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "leitfrage", weight: 4 },
      { token: "lernziel", weight: 4 },
      { token: "zusammenhang", weight: 3 },
      { token: "sicherung", weight: 2 },
      { token: "ergebnis", weight: 1 },
      { token: "unklar", weight: 3 }
    ],
    behaviorMarkers: [
      { marker: "Bezug zur Leitfrage wird hergestellt", weight: 5, tendency: "positive", patterns: ["bezug zur leitfrage hergestellt", "leitfrage beantwortet"] },
      { marker: "Sicherung sammelt nur Ergebnisse", weight: 5, tendency: "development", patterns: ["nur ergebnisse", "nur vorgelesen", "kein bezug"] }
    ],
    mathSpecificMarkers: ["darstellung", "term", "gleichung", "begründung", "modell", "definition", "satz"],
    typicalLAAErrors: ["Stundenziel bleibt nur implizit", "Sicherung wird Ergebnissammlung ohne Verständnisbezug"],
    counterIndicators: ["begründungen werden verglichen", "leitfrage wird beantwortet"],
    impulseQuestions: ["Woran konnten die SuS erkennen, welcher fachliche Zusammenhang in dieser Phase zentral war?"]
  },
  {
    id: "1-2",
    dimension: "Kognitive Aktivierung",
    label: "Ermittlung von Denkweisen und Vorstellungen",
    manualCore: "Denkweisen, Vorstellungen, Lösungswege und Verständnisstände der SuS werden sichtbar gemacht und aufgegriffen.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Unterrichtsgespräch", "Arbeitsphase", "Sicherung"],
    likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: ["denkweg sichtbar", "lösungsweg erklärt", "vorstellung erfragt", "begründung eingefordert"],
    developmentMarkers: ["keine verständnisprüfung", "keine wartezeit", "antworten nur abgefragt", "denkwege bleiben unsichtbar"],
    teacherPhrases: [
      { pattern: "wie bist du", weight: 6, tendency: "positive" },
      { pattern: "erklär deinen weg", weight: 6, tendency: "positive" },
      { pattern: "warum meinst du", weight: 5, tendency: "positive" },
      { pattern: "gibt es noch fragen", weight: 2, tendency: "development", requiresContext: true },
      { pattern: "keine fragen", weight: 3, tendency: "development", requiresContext: true }
    ],
    studentPhrases: [
      { pattern: "ich dachte", weight: 4, tendency: "positive" },
      { pattern: "bei mir", weight: 3, tendency: "positive" },
      { pattern: "ich versteh", weight: 4, tendency: "development" },
      { pattern: "anderer weg", weight: 5, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "warum", weight: 2 },
      { token: "gedacht", weight: 3 },
      { token: "verstanden", weight: 2 },
      { token: "erklären", weight: 3 },
      { token: "lösungsweg", weight: 4 },
      { token: "denkweg", weight: 4 },
      { token: "fragen", weight: 2 }
    ],
    behaviorMarkers: [
      { marker: "Keine echte Verständnisprüfung", weight: 4, tendency: "development", patterns: ["keine echte verständnisprüfung", "gibt es noch fragen", "nein dann weiter"] },
      { marker: "Mehrere Lösungswege werden gesammelt", weight: 5, tendency: "positive", patterns: ["mehrere lösungswege", "zwei lösungswege", "anderer weg"] },
      { marker: "Denkwege bleiben in der Sicherung unsichtbar", weight: 4, tendency: "development", patterns: ["nur ergebnisse", "keine begründungen verglichen", "keine begründungen"] }
    ],
    mathSpecificMarkers: ["rechenweg", "lösungsweg", "darstellung", "begründung", "ansatz", "fehler"],
    typicalLAAErrors: ["Frage nach Verständnis ersetzt Diagnose", "Schülerantworten werden nicht als Denkwege genutzt"],
    counterIndicators: ["denkwege werden begründet", "lösungswege werden verglichen"],
    impulseQuestions: ["Welche Denkweise der SuS wurde sichtbar, und wie wurde sie für die Weiterarbeit genutzt?"]
  },
  {
    id: "1-3",
    dimension: "Kognitive Aktivierung",
    label: "Herausfordernde Aufgaben und Fragen",
    manualCore: "Aufgaben und Fragen regen zu Begründungen, Vergleichen, Transfer oder vertiefter fachlicher Auseinandersetzung an.",
    likelyPhases: ["Erarbeitung", "Unterrichtsgespräch", "Gruppendiskussion", "Sicherung"],
    likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: ["begründungen vergleichen", "unterschiede begründen", "transfer", "mehrere lösungswege", "widerspruch"],
    developmentMarkers: ["nur reproduktion", "nur ergebnisse", "keine begründung", "kleinschrittig ohne denkraum"],
    teacherPhrases: [
      { pattern: "begründe", weight: 5, tendency: "positive" },
      { pattern: "vergleicht", weight: 4, tendency: "positive" },
      { pattern: "was ist der unterschied", weight: 5, tendency: "positive" },
      { pattern: "weg gekommen", weight: 2, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "ich hab einen anderen weg", weight: 6, tendency: "positive" },
      { pattern: "das geht auch", weight: 3, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "begründung", weight: 4 },
      { token: "begründen", weight: 4 },
      { token: "vergleichen", weight: 4 },
      { token: "unterschied", weight: 3 },
      { token: "anderer", weight: 2 },
      { token: "weg", weight: 2 }
    ],
    behaviorMarkers: [
      { marker: "Lösungswege werden verglichen", weight: 6, tendency: "positive", patterns: ["lösungswege vergleichen", "zwei lösungswege", "begründen unterschiede"] },
      { marker: "Sicherung ohne Begründungsvergleich", weight: 5, tendency: "development", patterns: ["keine begründungen", "nur ergebnisse vorgelesen", "nicht verglichen", "nur ergebnisse"] }
    ],
    mathSpecificMarkers: ["beweis", "strategie", "modellieren", "transfer", "darstellungen", "gegenbeispiel"],
    typicalLAAErrors: ["Anspruch wird durch zu frühe Hilfen reduziert", "Sicherung bleibt auf Ergebnisniveau"],
    counterIndicators: ["begründungen werden eingefordert", "mehrere lösungswege werden kontrastiert"],
    impulseQuestions: ["Wo wurde fachliches Denken über reine Ergebnissicherung hinaus angeregt?"]
  },
  {
    id: "1-4",
    dimension: "Kognitive Aktivierung",
    label: "Fachliche Beteiligung der Schülerinnen und Schüler",
    manualCore: "SuS beteiligen sich sichtbar fachlich, bleiben an Aufgaben dran und bringen Überlegungen, Fragen oder Beiträge ein.",
    likelyPhases: ["Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch", "Gruppendiskussion"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: ["fachliche beiträge", "fragen der sus", "dranbleiben", "längere beiträge", "eigene überlegung"],
    developmentMarkers: ["niemand beginnt", "passiv", "tuscheln", "off task", "warten"],
    teacherPhrases: [],
    studentPhrases: [
      { pattern: "ich hab einen anderen weg", weight: 4, tendency: "positive" },
      { pattern: "was sollen wir jetzt machen", weight: 3, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "beteiligen", weight: 4 },
      { token: "dranbleiben", weight: 4 },
      { token: "tuscheln", weight: 3 },
      { token: "warten", weight: 3 },
      { token: "beginnt", weight: 2 }
    ],
    behaviorMarkers: [
      { marker: "SuS arbeiten fachlich weiter", weight: 5, tendency: "positive", patterns: ["arbeiten fachlich", "bleiben dran", "diskutieren fachlich"] },
      { marker: "SuS vergleichen und begründen fachlich", weight: 4, tendency: "positive", patterns: ["vergleichen zwei lösungswege", "begründen unterschiede"] },
      { marker: "SuS beginnen nicht", weight: 4, tendency: "development", patterns: ["niemand beginnt", "gruppen warten", "tuscheln"] }
    ],
    mathSpecificMarkers: ["rechnen", "zeichnen", "begründen", "diskutieren", "lösungsweg"],
    typicalLAAErrors: ["Aktivität wird organisatorisch, aber nicht fachlich gebunden"],
    counterIndicators: ["fachliche diskussion", "suS begründen"],
    impulseQuestions: ["Welche fachliche Beteiligung der SuS wurde sichtbar, und wodurch wurde sie getragen?"]
  },
  {
    id: "2-1",
    dimension: "Konstruktive Unterstützung",
    label: "Qualität des Feedbacks",
    manualCore: "Rückmeldungen beziehen sich konkret auf Inhalt, Vorgehen oder Ergebnis und unterstützen nächste Lernschritte.",
    likelyPhases: ["Arbeitsphase", "Erarbeitung", "Feedback", "Sicherung"],
    likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
    positiveMarkers: ["konkretes feedback", "nächster schritt", "tragfähig", "hinweis zur weiterarbeit"],
    developmentMarkers: ["nur richtig falsch", "unklares feedback", "keine weiterarbeit", "feedback fehlt"],
    teacherPhrases: [
      { pattern: "dein nächster schritt", weight: 5, tendency: "positive" },
      { pattern: "schau noch einmal", weight: 3, tendency: "positive" },
      { pattern: "das ist richtig", weight: 2, tendency: "neutral" }
    ],
    studentPhrases: [],
    singleWordTokens: [
      { token: "feedback", weight: 5 },
      { token: "rückmeldung", weight: 5 },
      { token: "hinweis", weight: 3 },
      { token: "fehler", weight: 3 },
      { token: "weiterarbeit", weight: 4 }
    ],
    behaviorMarkers: [
      { marker: "Fehler wird für Klärung genutzt", weight: 5, tendency: "positive", patterns: ["fehler wird genutzt", "anlass für klärung"] },
      { marker: "Feedback bleibt pauschal", weight: 4, tendency: "development", patterns: ["nur richtig falsch", "pauschales feedback"] }
    ],
    mathSpecificMarkers: ["rechenfehler", "ansatz", "strategie", "darstellung", "einheit"],
    typicalLAAErrors: ["Feedback bestätigt nur, ohne nächsten Lernschritt"],
    counterIndicators: ["konkreter hinweis", "weiterentwickeln"],
    impulseQuestions: ["Welche Rückmeldung hat den nächsten fachlichen Schritt eröffnet?"]
  },
  {
    id: "2-2",
    dimension: "Konstruktive Unterstützung",
    label: "Individuelle Unterstützung im Lernprozess",
    manualCore: "Unterstützung, Hilfen, Erklärungen und Denkzeiten passen zum Lernstand oder Unterstützungsbedarf der SuS.",
    likelyPhases: ["Arbeitsphase", "Erarbeitung", "Feedback", "Übergang"],
    likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: ["gezielte hilfe", "denkzeit", "wartet", "erklärt nachvollziehbar", "lernstand"],
    developmentMarkers: ["gruppen warten", "keine hilfe", "unklarer auftrag", "niemand beginnt", "wartezeit fehlt"],
    teacherPhrases: [
      { pattern: "brauchst du einen tipp", weight: 4, tendency: "positive" },
      { pattern: "gibt es noch fragen", weight: 4, tendency: "development", requiresContext: true },
      { pattern: "ich komme gleich", weight: 2, tendency: "neutral" }
    ],
    studentPhrases: [
      { pattern: "was sollen wir jetzt machen", weight: 5, tendency: "development" },
      { pattern: "ich versteh", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "hilfe", weight: 4 },
      { token: "unterstützung", weight: 5 },
      { token: "tipp", weight: 3 },
      { token: "warten", weight: 4 },
      { token: "denkzeit", weight: 3 },
      { token: "fragen", weight: 1 }
    ],
    behaviorMarkers: [
      { marker: "Gruppen warten auf Unterstützung", weight: 6, tendency: "development", patterns: ["gruppen warten", "drei gruppen warten", "niemand beginnt"] },
      { marker: "Hilfen passen zum Lernstand", weight: 5, tendency: "positive", patterns: ["gezielt bei", "passender tipp", "lernstand"] }
    ],
    mathSpecificMarkers: ["hilfekarte", "tipp", "zwischenschritt", "darstellung wechseln"],
    typicalLAAErrors: ["Unterstützung kommt zu spät oder nimmt Denken vollständig ab"],
    counterIndicators: ["angemessene denkzeit", "gezielte unterstützung"],
    impulseQuestions: ["Woran wurde sichtbar, dass Unterstützung zum Lernstand passte?"]
  },
  {
    id: "2-3",
    dimension: "Konstruktive Unterstützung",
    label: "Wertschätzung und Respekt",
    manualCore: "Die Kommunikation der Lehrkraft mit SuS ist fair, respektvoll und greift Beiträge wertschätzend auf.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Unterrichtsgespräch", "Feedback", "Nach Stunde"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Gruppenarbeit"],
    positiveMarkers: ["wertschätzend", "respektvoll", "beitrag aufgegriffen", "fair"],
    developmentMarkers: ["abwertend", "bloßgestellt", "ignoriert", "ausgelacht ohne reaktion"],
    teacherPhrases: [
      { pattern: "danke für deinen beitrag", weight: 5, tendency: "positive" },
      { pattern: "interessanter gedanke", weight: 4, tendency: "positive" }
    ],
    studentPhrases: [],
    singleWordTokens: [
      { token: "wertschätzend", weight: 5 },
      { token: "respektvoll", weight: 5 },
      { token: "ausgelacht", weight: 5 },
      { token: "bloßgestellt", weight: 5 },
      { token: "ignoriert", weight: 3 }
    ],
    behaviorMarkers: [
      { marker: "Fehler wird ausgelacht und nicht aufgefangen", weight: 6, tendency: "development", patterns: ["fehler wird ausgelacht", "lehrkraft reagiert nicht"] },
      { marker: "Beitrag wird wertschätzend aufgegriffen", weight: 5, tendency: "positive", patterns: ["beitrag aufgegriffen", "wertschätzend"] }
    ],
    mathSpecificMarkers: ["fehlerkultur", "falsche antwort", "beitrag"],
    typicalLAAErrors: ["Fehlerkultur bleibt unausgesprochen und wird nicht geschützt"],
    counterIndicators: ["fehler wird als lernanlass genutzt", "respektvoll aufgegriffen"],
    impulseQuestions: ["Wie wurden Beiträge oder Fehler kommunikativ geschützt und weitergeführt?"]
  },
  {
    id: "2-4",
    dimension: "Konstruktive Unterstützung",
    label: "Klassenklima",
    manualCore: "SuS gehen respektvoll miteinander um, hören zu, arbeiten zusammen und schließen niemanden aus.",
    likelyPhases: ["Arbeitsphase", "Partnerarbeit", "Gruppendiskussion", "Erarbeitung"],
    likelySocialForms: ["Partnerarbeit", "Gruppenarbeit", "Plenum"],
    positiveMarkers: ["hören zu", "lassen ausreden", "beziehen ein", "sachbezogen zusammen"],
    developmentMarkers: ["ausgelacht", "ausgeschlossen", "stellt bloß", "gruppe ignoriert"],
    teacherPhrases: [],
    studentPhrases: [],
    singleWordTokens: [
      { token: "ausgelacht", weight: 5 },
      { token: "ausgeschlossen", weight: 5 },
      { token: "zusammenarbeit", weight: 4 },
      { token: "gruppe", weight: 2 },
      { token: "zuhören", weight: 4 }
    ],
    behaviorMarkers: [
      { marker: "SuS schließen andere ein", weight: 5, tendency: "positive", patterns: ["beziehen andere ein", "helfen sich"] },
      { marker: "Fehler wird ausgelacht", weight: 5, tendency: "development", patterns: ["fehler wird ausgelacht", "stellen bloß"] }
    ],
    mathSpecificMarkers: ["gruppenarbeit", "partnerarbeit", "erklären sich"],
    typicalLAAErrors: ["Kooperation wird organisatorisch gesetzt, aber sozial nicht abgesichert"],
    counterIndicators: ["helfen sich", "lassen ausreden"],
    impulseQuestions: ["Wie wurde sichtbar, dass Zusammenarbeit fachlich und sozial tragfähig war?"]
  },
  {
    id: "3-1",
    dimension: "Strukturierte Klassenführung",
    label: "Störungen durch Schülerinnen und Schüler",
    manualCore: "Der Unterricht verläuft geordnet, störungsarm und mit angemessener Lautstärke.",
    likelyPhases: ["Einstieg", "Arbeitsphase", "Übergang", "Unterrichtsgespräch"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: ["geordnet", "störungsarm", "lautstärke angemessen", "regeln eingehalten"],
    developmentMarkers: ["tuscheln", "laut", "störung", "unruhe", "abschweifen"],
    teacherPhrases: [],
    studentPhrases: [],
    singleWordTokens: [
      { token: "störung", weight: 5 },
      { token: "unruhe", weight: 4 },
      { token: "tuscheln", weight: 4 },
      { token: "laut", weight: 3 },
      { token: "regeln", weight: 3 }
    ],
    behaviorMarkers: [
      { marker: "Störungen beeinträchtigen Arbeitsbeginn", weight: 4, tendency: "development", patterns: ["tuscheln", "niemand beginnt"] }
    ],
    mathSpecificMarkers: [],
    typicalLAAErrors: ["Störungen werden erst spät als Lernzeitverlust sichtbar"],
    counterIndicators: ["geordnet", "störungsarm"],
    impulseQuestions: ["Welche Störungen waren lernprozessrelevant und wie wurden sie bearbeitet?"]
  },
  {
    id: "3-2",
    dimension: "Strukturierte Klassenführung",
    label: "Monitoring",
    manualCore: "Die Lehrkraft nimmt Lern- und Arbeitsprozesse wahr, ist präsent und reagiert frühzeitig.",
    likelyPhases: ["Arbeitsphase", "Gruppendiskussion", "Übergang", "Erarbeitung"],
    likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
    positiveMarkers: ["geht herum", "blickt in gruppen", "reagiert früh", "nimmt wahr", "präsent"],
    developmentMarkers: ["steht vorne", "schaut auf tafel", "gruppen warten", "reagiert nicht", "sieht nicht"],
    teacherPhrases: [],
    studentPhrases: [],
    singleWordTokens: [
      { token: "monitoring", weight: 5 },
      { token: "vorne", weight: 3 },
      { token: "tafel", weight: 2 },
      { token: "warten", weight: 4 },
      { token: "reagiert", weight: 3 },
      { token: "präsent", weight: 4 }
    ],
    behaviorMarkers: [
      { marker: "Lehrkraft bleibt vorne, Gruppen warten", weight: 7, tendency: "development", patterns: ["steht vorne", "schaut auf tafel", "gruppen warten"] },
      { marker: "Lehrkraft reagiert nicht auf sichtbaren Bedarf", weight: 5, tendency: "development", patterns: ["reagiert nicht", "lehrkraft reagiert nicht"] },
      { marker: "Lehrkraft nimmt Arbeitsprozesse sichtbar wahr", weight: 5, tendency: "positive", patterns: ["geht herum", "blickt in gruppen", "nimmt wahr"] }
    ],
    mathSpecificMarkers: ["arbeitsprozesse", "lösungswege", "hefte", "gruppen"],
    typicalLAAErrors: ["Tafel-/Materialfokus ersetzt Monitoring der Lernprozesse"],
    counterIndicators: ["geht herum", "reagiert frühzeitig"],
    impulseQuestions: ["Welche Hinweise auf Lern- oder Unterstützungsbedarf wurden wahrgenommen?"]
  },
  {
    id: "3-3",
    dimension: "Strukturierte Klassenführung",
    label: "Zeitnutzung",
    manualCore: "Unterrichtszeit wird fachlich genutzt; Übergänge, Materialien und Arbeitsphasen erhalten Lernzeit.",
    likelyPhases: ["Vor Stunde", "Einstieg", "Arbeitsphase", "Übergang", "Sicherung"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: ["zügiger übergang", "arbeitszeit genutzt", "material vorbereitet", "klare zeit"],
    developmentMarkers: ["leerlauf", "warten", "niemand beginnt", "verzögerung", "zeit verloren"],
    teacherPhrases: [
      { pattern: "ihr habt zehn minuten", weight: 3, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "was sollen wir jetzt machen", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "zeit", weight: 3 },
      { token: "warten", weight: 5 },
      { token: "beginnt", weight: 3 },
      { token: "leerlauf", weight: 5 },
      { token: "übergang", weight: 4 },
      { token: "verzögerung", weight: 4 }
    ],
    behaviorMarkers: [
      { marker: "Arbeitsbeginn verzögert sich", weight: 6, tendency: "development", patterns: ["niemand beginnt", "gruppen warten", "leerlauf"] },
      { marker: "Zeitstruktur ist klar", weight: 4, tendency: "positive", patterns: ["zehn minuten", "zeitvorgabe", "zügig"] }
    ],
    mathSpecificMarkers: ["arbeitsphase", "bearbeitungszeit", "sicherung"],
    typicalLAAErrors: ["Unklare Aufträge erzeugen Leerlauf und Wartezeit"],
    counterIndicators: ["zügig", "klare zeitvorgabe"],
    impulseQuestions: ["Wo wurde Lernzeit gewonnen oder verloren?"]
  }
];

const UFB_PHASES = ["Vor Stunde", "Einstieg", "Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch", "Gruppendiskussion", "Sicherung", "Feedback", "Übergang", "Nach Stunde"];
const UFB_SOCIAL_FORMS = ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Lehrervortrag", "Schülerpräsentation"];

function normalizeHeuristicText(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function analyzeUfbObservation(observation, history = []) {
  const normalized = normalizeHeuristicText(observation.text);
  const tokens = new Set(normalized.split(" ").filter(Boolean));
  if (observation.type === "free") {
    return { suggestions: [], allScores: [], fallback: true, message: "Freie professionelle Beobachtung" };
  }

  const allScores = UFB_HEURISTICS.map((item) => scoreUfbItem(item, observation, normalized, tokens, history))
    .sort((a, b) => b.score - a.score);
  const strong = allScores.filter((result) => result.score >= 5);
  const top = strong.filter((result, index) => index < 3 || (index === 3 && result.score >= 9 && strong[0].score - result.score <= 2));
  const suggestions = top.length ? top : [];

  return {
    suggestions,
    allScores,
    fallback: suggestions.length === 0,
    message: suggestions.length ? "" : "Keine klare Verknüpfung erkannt"
  };
}

function scoreUfbItem(item, observation, normalized, tokens, history) {
  const reasons = [];
  let score = 0;
  let tendencyPositive = 0;
  let tendencyDevelopment = 0;

  if (item.likelyPhases.includes(observation.phase)) {
    const weight = item.phaseWeights?.[observation.phase] ?? 1.5;
    score += weight;
    reasons.push(`Phase: ${observation.phase} (+${weight})`);
  }
  if (item.likelySocialForms.includes(observation.socialForm)) {
    const weight = item.socialFormWeights?.[observation.socialForm] ?? 1;
    score += weight;
    reasons.push(`Sozialform: ${observation.socialForm} (+${weight})`);
  }

  const phraseSource = observation.type === "teacher_quote" ? item.teacherPhrases : observation.type === "student_quote" ? item.studentPhrases : [...item.teacherPhrases, ...item.studentPhrases];
  phraseSource.forEach((phrase) => {
    const pattern = normalizeHeuristicText(phrase.pattern);
    if (pattern && normalized.includes(pattern)) {
      score += phrase.weight;
      phrase.tendency === "development" ? tendencyDevelopment += phrase.weight : tendencyPositive += phrase.weight;
      reasons.push(`Phrase: „${phrase.pattern}“ (+${phrase.weight})`);
    }
  });

  item.behaviorMarkers.forEach((marker) => {
    if ((marker.patterns ?? [marker.marker]).some((pattern) => normalized.includes(normalizeHeuristicText(pattern)))) {
      score += marker.weight;
      marker.tendency === "development" ? tendencyDevelopment += marker.weight : tendencyPositive += marker.weight;
      reasons.push(`Marker: ${marker.marker} (+${marker.weight})`);
    }
  });

  item.singleWordTokens.forEach((entry) => {
    const token = normalizeHeuristicText(entry.token);
    if (tokens.has(token)) {
      score += entry.weight;
      reasons.push(`Token: ${entry.token} (+${entry.weight})`);
    }
  });

  item.mathSpecificMarkers.forEach((marker) => {
    if (normalized.includes(normalizeHeuristicText(marker))) {
      score += 1;
      reasons.push(`Mathebezug: ${marker} (+1)`);
    }
  });

  item.counterIndicators.forEach((indicator) => {
    if (normalized.includes(normalizeHeuristicText(indicator))) {
      score -= 3;
      reasons.push(`Gegenindikator: ${indicator} (-3)`);
    }
  });

  const recurrence = history.filter((entry) => (entry.confirmedItemIds ?? []).includes(item.id)).length;
  if (recurrence) {
    const recurrenceScore = Math.min(2, recurrence);
    score += recurrenceScore;
    reasons.push(`Wiederholung bestätigter Zuordnung (+${recurrenceScore})`);
  }

  return {
    item,
    score: Math.max(0, Number(score.toFixed(1))),
    tendency: tendencyDevelopment > tendencyPositive ? "development" : tendencyPositive > tendencyDevelopment ? "positive" : "neutral",
    reasons
  };
}

function runUfbHeuristicTests() {
  const cases = [
    { type: "teacher_quote", phase: "Einstieg", socialForm: "Plenum", text: "Gibt es noch Fragen? Nein? Dann weiter.", expected: ["1-2", "1-1", "2-2"] },
    { type: "student_quote", phase: "Arbeitsphase", socialForm: "Gruppenarbeit", text: "Was sollen wir jetzt machen?", expected: ["2-2", "3-3", "1-4"] },
    { type: "observation", phase: "Arbeitsphase", socialForm: "Gruppenarbeit", text: "Drei Gruppen warten, Lehrkraft schaut auf Tafel.", expected: ["3-2", "3-3", "2-2"] },
    { type: "observation", phase: "Erarbeitung", socialForm: "Partnerarbeit", text: "SuS vergleichen zwei Lösungswege und begründen Unterschiede.", expected: ["1-3", "1-2", "1-4"] },
    { type: "teacher_quote", phase: "Unterrichtsgespräch", socialForm: "Plenum", text: "Wie bist du auf diesen Weg gekommen?", expected: ["1-2", "1-3"] },
    { type: "observation", phase: "Arbeitsphase", socialForm: "Gruppenarbeit", text: "Fehler wird ausgelacht, Lehrkraft reagiert nicht.", expected: ["2-3", "2-4", "3-2"] },
    { type: "observation", phase: "Sicherung", socialForm: "Plenum", text: "Sicherung sammelt nur Ergebnisse, kein Bezug zur Leitfrage.", expected: ["1-1", "1-3", "1-2"] },
    { type: "free", phase: "Vor Stunde", socialForm: "Plenum", text: "Kleidung wirkt für Unterrichtssituation unangemessen.", expected: [] }
  ];

  return cases.map((test) => {
    const result = analyzeUfbObservation(test, []);
    return {
      text: test.text,
      expected: test.expected,
      top: result.suggestions.map((suggestion) => suggestion.item.id),
      tooMany: result.suggestions.length > 4,
      fallback: result.fallback,
      scores: result.allScores.slice(0, 5).map((entry) => ({
        id: entry.item.id,
        label: entry.item.label,
        score: entry.score,
        tendency: entry.tendency,
        reasons: entry.reasons
      }))
    };
  });
}

window.UFB_HEURISTICS = UFB_HEURISTICS;
window.UFB_PHASES = UFB_PHASES;
window.UFB_SOCIAL_FORMS = UFB_SOCIAL_FORMS;
window.analyzeUfbObservation = analyzeUfbObservation;
window.runUfbHeuristicTests = runUfbHeuristicTests;
