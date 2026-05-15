/*
  Item-level heuristic prototype for UFB Tiefenstrukturen.
  Scope: 1.1 Verständnisorientierung and 1.2 Ermittlung von Denkweisen / Vorstellungen.
  The exact item texts are fixed reference texts; only detection metadata is interpretive.
*/

const UFB_HEURISTIC_ROOT = typeof window !== "undefined" ? window : globalThis;
const UFB_TEXT_TOOLS = (() => {
  if (typeof module !== "undefined" && module.exports) {
    try {
      return require("./text-normalization.js");
    } catch (_error) {
      return UFB_HEURISTIC_ROOT.UFB_TEXT_NORMALIZATION;
    }
  }
  return UFB_HEURISTIC_ROOT.UFB_TEXT_NORMALIZATION;
})();
const NORMALIZED_TEXT_CACHE = new Map();

const UFB_ITEM_HEURISTICS = [
  {
    id: "1.1.1",
    parentId: "1.1",
    dimension: "Kognitive Aktivierung",
    exactText: "Es wird deutlich, welche Inhalte oder Zusammenhänge die SuS verstehen oder reflektieren sollen.",
    shortLabel: "Verstehensziel sichtbar",
    manualCore: "Erkennbar wird, welche fachliche Idee, Problemstellung, Leitfrage oder welcher Zusammenhang verstanden oder reflektiert werden soll.",
    likelyPhases: ["Einstieg", "Sicherung", "Unterrichtsgespräch", "Erarbeitung"],
    likelySocialForms: ["Plenum", "Lehrervortrag", "Schülerpräsentation"],
    positiveMarkers: [
      { pattern: "leitfrage wird geklaert", weight: 6 },
      { pattern: "problemstellung wird geklaert", weight: 6 },
      { pattern: "problemorientierung", weight: 6 },
      { pattern: "frage klaeren", weight: 5 },
      { pattern: "ausgangsproblem wird aufgegriffen", weight: 5 },
      { pattern: "am ende sollt ihr verstehen", weight: 6 },
      { pattern: "ziel der stunde wird deutlich", weight: 6 },
      { pattern: "problemfrage wird fachlich klar aufgebaut", weight: 7 },
      { pattern: "sicherung bezieht sich auf leitfrage", weight: 6 },
      { pattern: "was war die frage", weight: 4 },
      { pattern: "welchen zusammenhang", weight: 4 }
    ],
    developmentMarkers: [
      { pattern: "unklar was verstanden werden soll", weight: 7 },
      { pattern: "leitfrage fehlt", weight: 6 },
      { pattern: "worum koennte es heute gehen", weight: 6 },
      { pattern: "ziel bleibt unklar", weight: 7 },
      { pattern: "problemorientierung fehlt", weight: 6 },
      { pattern: "warum machen wir das", weight: 5 },
      { pattern: "nur auftrag aber kein verstehensziel", weight: 6 },
      { pattern: "sicherung ohne leitfrage", weight: 6 },
      { pattern: "keine rueckbindung an das problem", weight: 6 }
    ],
    teacherPhrases: [
      { pattern: "heute geht es darum", weight: 5, tendency: "positive" },
      { pattern: "wir klaeren die frage", weight: 5, tendency: "positive" },
      { pattern: "was bedeutet das", weight: 4, tendency: "positive" },
      { pattern: "was sollt ihr verstehen", weight: 6, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "was sollen wir lernen", weight: 6, tendency: "development" },
      { pattern: "warum machen wir das", weight: 5, tendency: "development" },
      { pattern: "worum geht es", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "leitfrage", weight: 5 },
      { token: "problemstellung", weight: 5 },
      { token: "problemorientierung", weight: 6, fuzzy: true },
      { token: "ausgangsproblem", weight: 5 },
      { token: "verstehen", weight: 3, fuzzy: true },
      { token: "reflektieren", weight: 3, fuzzy: true },
      { token: "zusammenhang", weight: 4, fuzzy: true },
      { token: "verstehensziel", weight: 5, fuzzy: true },
      { token: "sicherung", weight: 2 },
      { token: "bedeutung", weight: 3 }
    ],
    mathSpecificMarkers: [
      { pattern: "bedeutung des terms", weight: 3 },
      { pattern: "graph interpretieren", weight: 3 },
      { pattern: "modellbezug", weight: 3 },
      { pattern: "sachzusammenhang", weight: 3 }
    ],
    contextBoosts: {
      phase: { "Einstieg": 2, "Sicherung": 3, "Unterrichtsgespräch": 1.5 },
      socialForm: { "Plenum": 1.5, "Lehrervortrag": 1 },
      method: { "Problemorientierung": 2, "Leitfrage": 2 },
      focus: { "Leitfrage": 2, "Problemorientierung": 2 }
    },
    counterIndicators: [
      { pattern: "leitfrage wird beantwortet", weight: -3 },
      { pattern: "problem wird geloest", weight: -3 }
    ],
    typicalLAAErrors: ["Aktivität wird klar, aber Verstehensziel bleibt implizit.", "Sicherung löst sich von Leitfrage oder Problemorientierung."],
    impulseQuestions: ["Woran konnten die SuS erkennen, welcher fachliche Zusammenhang verstanden werden sollte?"]
  },
  {
    id: "1.1.2",
    parentId: "1.1",
    dimension: "Kognitive Aktivierung",
    exactText: "Die Unterrichtsgestaltung unterstützt das Verständnis zentraler Inhalte.",
    shortLabel: "Verständnis unterstützen",
    manualCore: "Aufbau, Material, Visualisierung, Tafelbild, Zwischensicherung und kognitive Entlastung unterstützen zentrale fachliche Inhalte.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Sicherung"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Lehrervortrag"],
    positiveMarkers: [
      { pattern: "tafelbild unterstuetzt", weight: 6 },
      { pattern: "visualisierung macht sichtbar", weight: 6 },
      { pattern: "zentrale inhalte werden gesichert", weight: 6 },
      { pattern: "zwischensicherung", weight: 5 },
      { pattern: "beispiele bauen aufeinander auf", weight: 5 },
      { pattern: "darstellungswechsel wird verbunden", weight: 5 },
      { pattern: "material hilft beim verstehen", weight: 5 }
    ],
    developmentMarkers: [
      { pattern: "nichts wird notiert", weight: 6 },
      { pattern: "kein tafelbild", weight: 6 },
      { pattern: "keine visualisierung", weight: 5 },
      { pattern: "zu viel auf einmal", weight: 6 },
      { pattern: "viele konkurrierende informationen", weight: 7 },
      { pattern: "material und auftrag enthalten viele konkurrierende informationen", weight: 8 },
      { pattern: "kognitive ueberlastung", weight: 7 },
      { pattern: "fokus geht verloren", weight: 6 },
      { pattern: "zentrale inhalte gehen unter", weight: 7 },
      { pattern: "ziele nicht gut definiert", weight: 5 },
      { pattern: "zielklarheit fehlt", weight: 5 }
    ],
    teacherPhrases: [
      { pattern: "ich notiere das", weight: 3, tendency: "positive" },
      { pattern: "das halten wir fest", weight: 4, tendency: "positive" },
      { pattern: "hier seht ihr", weight: 3, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "das ist zu viel", weight: 5, tendency: "development" },
      { pattern: "ich komme nicht mit", weight: 5, tendency: "development" },
      { pattern: "was sollen wir abschreiben", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "tafelbild", weight: 5, fuzzy: true },
      { token: "visualisierung", weight: 5, fuzzy: true },
      { token: "notiert", weight: 4, fuzzy: true },
      { token: "material", weight: 3 },
      { token: "zentral", weight: 3 },
      { token: "kognitiv", weight: 4 },
      { token: "ueberlastung", weight: 5, fuzzy: true },
      { token: "fokus", weight: 4 },
      { token: "zwischensicherung", weight: 5, fuzzy: true },
      { token: "zielklarheit", weight: 4, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "tabelle graph term", weight: 4 },
      { pattern: "skizze", weight: 2 },
      { pattern: "koordinatensystem", weight: 3 },
      { pattern: "darstellung verbinden", weight: 4 },
      { pattern: "zahlengerade", weight: 3 }
    ],
    contextBoosts: {
      phase: { "Erarbeitung": 2, "Sicherung": 2, "Arbeitsphase": 1.5 },
      socialForm: { "Lehrervortrag": 1.5, "Plenum": 1.5 },
      method: { "Tafelbild": 2, "Visualisierung": 2, "Darstellungswechsel": 2 },
      medium: { "Tafel": 1.5, "Whiteboard": 1.5, "Arbeitsblatt": 1 }
    },
    counterIndicators: [
      { pattern: "zentrale idee wird notiert", weight: -4 },
      { pattern: "tafelbild strukturiert", weight: -4 }
    ],
    typicalLAAErrors: ["Ziele sind unklar, dadurch fehlt Auswahl zentraler Inhalte.", "Zu viele Inhalte oder Medien erhöhen kognitive Last statt Verständnis."],
    impulseQuestions: ["Welche Gestaltungselemente haben das Verstehen zentraler Inhalte gestützt oder erschwert?"]
  },
  {
    id: "1.1.3",
    parentId: "1.1",
    dimension: "Kognitive Aktivierung",
    exactText: "Inhalte und Zusammenhänge werden klar, strukturiert und verständlich dargestellt.",
    shortLabel: "Klar strukturiert darstellen",
    manualCore: "Fachliche Inhalte werden sprachlich, visuell und logisch nachvollziehbar strukturiert.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Sicherung", "Unterrichtsgespräch"],
    likelySocialForms: ["Plenum", "Lehrervortrag"],
    positiveMarkers: [
      { pattern: "klar strukturiert", weight: 7 },
      { pattern: "roter faden", weight: 6 },
      { pattern: "verstaendlich erklaert", weight: 6 },
      { pattern: "begriffe werden geklaert", weight: 5 },
      { pattern: "begriffe werden sauber eingefuehrt", weight: 7 },
      { pattern: "beispiele erklaert", weight: 5 },
      { pattern: "schritt fuer schritt", weight: 4 }
    ],
    developmentMarkers: [
      { pattern: "erklaerung springt", weight: 6 },
      { pattern: "tafelbild unuebersichtlich", weight: 6 },
      { pattern: "fachbegriffe bleiben ungeklaert", weight: 6 },
      { pattern: "sus verlieren den zusammenhang", weight: 6 }
    ],
    teacherPhrases: [
      { pattern: "zuerst dann danach", weight: 3, tendency: "positive" },
      { pattern: "ich ordne das", weight: 3, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "ich komme nicht mit", weight: 4, tendency: "development" },
      { pattern: "das ist unklar", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "klar", weight: 3 },
      { token: "strukturiert", weight: 4, fuzzy: true },
      { token: "verstaendlich", weight: 4, fuzzy: true },
      { token: "uebersichtlich", weight: 4, fuzzy: true },
      { token: "fachbegriff", weight: 3, fuzzy: true },
      { token: "begriff", weight: 4, fuzzy: true },
      { token: "eingefuehrt", weight: 5, fuzzy: true },
      { token: "beispiel", weight: 3, fuzzy: true },
      { token: "gliedern", weight: 3, fuzzy: true },
      { token: "darstellen", weight: 3, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "definition", weight: 2 },
      { pattern: "begriff einfuehren", weight: 5 },
      { pattern: "satz", weight: 2 },
      { pattern: "rechenweg strukturiert", weight: 4 },
      { pattern: "begruendungskette", weight: 4 }
    ],
    contextBoosts: {
      phase: { "Erarbeitung": 2, "Sicherung": 2 },
      socialForm: { "Plenum": 1.5, "Lehrervortrag": 1.5 }
    },
    counterIndicators: [
      { pattern: "schueler erklaeren verstaendlich", weight: -2 }
    ],
    typicalLAAErrors: ["Fachlich richtige Erklärung ist für Lernende nicht hinreichend geordnet."],
    impulseQuestions: ["Welche Struktur half den SuS, den fachlichen Zusammenhang nachzuvollziehen?"]
  },
  {
    id: "1.1.4",
    parentId: "1.1",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK stellt Bezüge zu zentralen Inhalten der Stunde her.",
    shortLabel: "Bezüge herstellen",
    manualCore: "Beiträge, Aufgaben, Ergebnisse und Phasen werden mit zentralen Inhalten der Stunde verbunden.",
    likelyPhases: ["Erarbeitung", "Sicherung", "Unterrichtsgespräch", "Übergang"],
    likelySocialForms: ["Plenum", "Lehrervortrag"],
    positiveMarkers: [
      { pattern: "bezug zur leitfrage", weight: 6 },
      { pattern: "rueckbezug", weight: 5 },
      { pattern: "das haengt zusammen mit", weight: 5 },
      { pattern: "wir nutzen jetzt", weight: 4 },
      { pattern: "verbindung zwischen aufgabe und ziel", weight: 6 }
    ],
    developmentMarkers: [
      { pattern: "kein bezug zur leitfrage", weight: 7 },
      { pattern: "aufgabe bleibt isoliert", weight: 6 },
      { pattern: "beiträge bleiben unverbunden", weight: 6 },
      { pattern: "sicherung ohne rueckbezug", weight: 6 }
    ],
    teacherPhrases: [
      { pattern: "das brauchen wir fuer", weight: 4, tendency: "positive" },
      { pattern: "erinnert euch an", weight: 3, tendency: "positive" },
      { pattern: "zurueck zur leitfrage", weight: 6, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "was hat das damit zu tun", weight: 5, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "bezug", weight: 4 },
      { token: "rueckbezug", weight: 5, fuzzy: true },
      { token: "verbinden", weight: 4, fuzzy: true },
      { token: "leitfrage", weight: 4 },
      { token: "zusammenhang", weight: 4, fuzzy: true },
      { token: "zentral", weight: 2 }
    ],
    mathSpecificMarkers: [
      { pattern: "term mit situation verbinden", weight: 4 },
      { pattern: "graph mit sachkontext", weight: 4 },
      { pattern: "modell zurueckbeziehen", weight: 4 }
    ],
    contextBoosts: {
      phase: { "Sicherung": 3, "Übergang": 2, "Unterrichtsgespräch": 1.5 },
      socialForm: { "Plenum": 1.5 }
    },
    counterIndicators: [
      { pattern: "auf leitfrage bezogen", weight: -3 }
    ],
    typicalLAAErrors: ["Einzelbeiträge werden nicht auf zentrale fachliche Linie bezogen."],
    impulseQuestions: ["Welche Bezüge haben zentrale Inhalte über die Stunde hinweg verbunden?"]
  },
  {
    id: "1.1.5",
    parentId: "1.1",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK orientiert den Unterricht an zentralen fachlichen Lernzielen.",
    shortLabel: "Lernzielorientierung",
    manualCore: "Der Unterricht bleibt an zentralen fachlichen Lernzielen ausgerichtet; Konkretes wird verallgemeinert und fachliche Zusammenhänge werden erarbeitet.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Sicherung"],
    likelySocialForms: ["Plenum", "Lehrervortrag", "Gruppenarbeit"],
    positiveMarkers: [
      { pattern: "lernziel wird sichtbar", weight: 6 },
      { pattern: "fachlich konkretisiert", weight: 5 },
      { pattern: "konkretes wird verallgemeinert", weight: 7 },
      { pattern: "allgemeiner zusammenhang wird erarbeitet", weight: 7 },
      { pattern: "regel wird aus beispielen entwickelt", weight: 6 },
      { pattern: "prinzip wird herausgearbeitet", weight: 6 },
      { pattern: "am ende sollt ihr begruenden", weight: 6 },
      { pattern: "loesung tragfaehig", weight: 5 },
      { pattern: "welche loesung tragfaehig ist", weight: 6 }
    ],
    developmentMarkers: [
      { pattern: "ziel bleibt implizit", weight: 6 },
      { pattern: "methode dominiert fachlichkeit", weight: 6 },
      { pattern: "bei einzelbeispielen haengen geblieben", weight: 6 },
      { pattern: "keine verallgemeinerung", weight: 6 },
      { pattern: "nebenthemen dominieren", weight: 5 }
    ],
    teacherPhrases: [
      { pattern: "was gilt allgemein", weight: 6, tendency: "positive" },
      { pattern: "was koennen wir daraus ableiten", weight: 5, tendency: "positive" },
      { pattern: "welche regel", weight: 4, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "ist das immer so", weight: 5, tendency: "positive" },
      { pattern: "gilt das auch", weight: 4, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "lernziel", weight: 5, fuzzy: true },
      { token: "fachlich", weight: 3, fuzzy: true },
      { token: "verallgemeinern", weight: 6, fuzzy: true },
      { token: "allgemein", weight: 4 },
      { token: "regel", weight: 3 },
      { token: "prinzip", weight: 4 },
      { token: "ableiten", weight: 3 },
      { token: "tragfaehig", weight: 5, fuzzy: true },
      { token: "konkret", weight: 2 }
    ],
    mathSpecificMarkers: [
      { pattern: "vom beispiel zur regel", weight: 5 },
      { pattern: "satz entwickeln", weight: 4 },
      { pattern: "funktionaler zusammenhang", weight: 4 },
      { pattern: "modellieren", weight: 2 },
      { pattern: "argumentieren", weight: 2 }
    ],
    contextBoosts: {
      phase: { "Einstieg": 1.5, "Erarbeitung": 2, "Sicherung": 3 },
      socialForm: { "Plenum": 1.5 }
    },
    counterIndicators: [
      { pattern: "regel wird gesichert", weight: -3 },
      { pattern: "verallgemeinerung gelingt", weight: -3 }
    ],
    typicalLAAErrors: ["Fachliche Zielidee bleibt unter Aktivität oder Methode verborgen.", "Ein Beispiel wird bearbeitet, ohne allgemeinen Zusammenhang zu erarbeiten."],
    impulseQuestions: ["Wie wurde aus konkreten Beispielen ein fachlicher Zusammenhang oder ein Lernziel sichtbar?"]
  },
  {
    id: "1.1.6",
    parentId: "1.1",
    dimension: "Kognitive Aktivierung",
    exactText: "Zentrale Inhalte oder Zusammenhänge der Stunde werden erkennbar hervorgehoben.",
    shortLabel: "Zentrales hervorheben",
    manualCore: "Wichtige fachliche Inhalte werden markiert, gewichtet und als Kern der Stunde erkennbar gemacht.",
    likelyPhases: ["Erarbeitung", "Sicherung", "Unterrichtsgespräch"],
    likelySocialForms: ["Plenum", "Lehrervortrag"],
    positiveMarkers: [
      { pattern: "zentrale idee hervorgehoben", weight: 6 },
      { pattern: "zentrale inhalte werden von sus zusammengefasst", weight: 7 },
      { pattern: "wichtiges wird markiert", weight: 6 },
      { pattern: "merksatz", weight: 5 },
      { pattern: "kern wird herausgestellt", weight: 5 },
      { pattern: "wichtig unwichtig unterschieden", weight: 5 }
    ],
    developmentMarkers: [
      { pattern: "alles wirkt gleich wichtig", weight: 6 },
      { pattern: "kern bleibt verborgen", weight: 6 },
      { pattern: "keine gewichtung", weight: 5 },
      { pattern: "viele einzelinfos", weight: 5 },
      { pattern: "zentrale inhalte werden nicht zusammengefasst", weight: 8 },
      { pattern: "nicht zusammengefasst", weight: 6 }
    ],
    teacherPhrases: [
      { pattern: "das ist wichtig", weight: 4, tendency: "positive" },
      { pattern: "merkt euch", weight: 4, tendency: "positive" },
      { pattern: "der kern ist", weight: 5, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "was ist wichtig", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "wichtig", weight: 3 },
      { token: "zentral", weight: 4 },
      { token: "hervorheben", weight: 5, fuzzy: true },
      { token: "markieren", weight: 4, fuzzy: true },
      { token: "kern", weight: 4 },
      { token: "merksatz", weight: 4, fuzzy: true },
      { token: "fazit", weight: 3 },
      { token: "zusammengefasst", weight: 4, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "zentrale regel", weight: 4 },
      { pattern: "definition markieren", weight: 4 },
      { pattern: "strategie hervorheben", weight: 4 }
    ],
    contextBoosts: {
      phase: { "Sicherung": 3, "Erarbeitung": 1.5 },
      socialForm: { "Plenum": 1.5 }
    },
    counterIndicators: [
      { pattern: "kern wird benannt", weight: -3 }
    ],
    typicalLAAErrors: ["Viele fachliche Informationen werden angeboten, aber nicht gewichtet."],
    impulseQuestions: ["Was wurde als fachlicher Kern der Stunde erkennbar hervorgehoben?"]
  },
  {
    id: "1.1.7",
    parentId: "1.1",
    dimension: "Kognitive Aktivierung",
    exactText: "Zentrale Inhalte oder Zusammenhänge werden mit Blick auf das Lernziel zusammengefasst.",
    shortLabel: "Lernzielbezogen zusammenfassen",
    manualCore: "Zentrale Erkenntnisse werden am Lernziel, an der Leitfrage oder am Ausgangsproblem gebündelt.",
    likelyPhases: ["Sicherung", "Nach Stunde", "Unterrichtsgespräch"],
    likelySocialForms: ["Plenum", "Schülerpräsentation"],
    positiveMarkers: [
      { pattern: "zusammenfassung am ende", weight: 6 },
      { pattern: "fazit zur leitfrage", weight: 7 },
      { pattern: "mit blick auf das lernziel", weight: 7 },
      { pattern: "zentrale erkenntnis gesichert", weight: 6 },
      { pattern: "sus formulieren was gelernt wurde", weight: 6 }
    ],
    developmentMarkers: [
      { pattern: "nur ergebnisse vorgelesen", weight: 6 },
      { pattern: "keine zusammenfassung", weight: 6 },
      { pattern: "kein bezug zum lernziel", weight: 6 },
      { pattern: "sicherung bleibt oberflaechlich", weight: 6 },
      { pattern: "kein fachlicher abschluss", weight: 5 }
    ],
    teacherPhrases: [
      { pattern: "was haben wir gelernt", weight: 5, tendency: "positive" },
      { pattern: "fasst zusammen", weight: 5, tendency: "positive" },
      { pattern: "zur leitfrage", weight: 5, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "wir haben gelernt", weight: 5, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "zusammenfassung", weight: 5, fuzzy: true },
      { token: "zusammenfassen", weight: 5, fuzzy: true },
      { token: "fazit", weight: 4 },
      { token: "sicherung", weight: 4 },
      { token: "lernziel", weight: 5, fuzzy: true },
      { token: "leitfrage", weight: 5 },
      { token: "abschluss", weight: 3 },
      { token: "erkenntnis", weight: 4, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "regel sichern", weight: 4 },
      { pattern: "verfahren zusammenfassen", weight: 4 },
      { pattern: "ergebnis interpretieren", weight: 4 }
    ],
    contextBoosts: {
      phase: { "Sicherung": 4, "Nach Stunde": 2 },
      socialForm: { "Plenum": 1.5 }
    },
    counterIndicators: [
      { pattern: "fazit wird formuliert", weight: -3 }
    ],
    typicalLAAErrors: ["Sicherung bleibt Ergebnisvergleich und bündelt keine fachliche Erkenntnis."],
    impulseQuestions: ["Wie wurde das Lernergebnis mit Blick auf Ziel oder Leitfrage zusammengeführt?"]
  },
  {
    id: "1.2.1",
    parentId: "1.2",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK verschafft sich Einblick in Denkweisen und Lernstände der SuS.",
    shortLabel: "Einblick in Denkweisen",
    manualCore: "Die Lehrkraft gewinnt Hinweise auf Denkweisen, Lernstände, Strategien, Fehlvorstellungen oder Verständnisschwierigkeiten.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: [
      { pattern: "lehrkraft schaut in hefte", weight: 5 },
      { pattern: "diagnosefrage", weight: 6 },
      { pattern: "lernstand wird sichtbar", weight: 6 },
      { pattern: "denkweise wird sichtbar", weight: 6 },
      { pattern: "verschiedene lernstaende", weight: 5 }
    ],
    developmentMarkers: [
      { pattern: "keine echte verstaendnispruefung", weight: 7 },
      { pattern: "gibt es noch fragen", weight: 4 },
      { pattern: "nein dann weiter", weight: 4 },
      { pattern: "alle verstanden ohne pruefung", weight: 6 },
      { pattern: "unsicherheit wird nicht geprueft", weight: 6 },
      { pattern: "lernstaende bleiben unsichtbar", weight: 6 }
    ],
    teacherPhrases: [
      { pattern: "wie bist du darauf gekommen", weight: 6, tendency: "positive" },
      { pattern: "was hast du dir gedacht", weight: 6, tendency: "positive" },
      { pattern: "zeigt mir euren stand", weight: 4, tendency: "positive" },
      { pattern: "gibt es noch fragen", weight: 4, tendency: "development" },
      { pattern: "alle verstanden", weight: 3, tendency: "development" }
    ],
    studentPhrases: [
      { pattern: "ich dachte", weight: 5, tendency: "positive" },
      { pattern: "ich verstehe nicht", weight: 5, tendency: "development" },
      { pattern: "ich bin anders vorgegangen", weight: 5, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "lernstand", weight: 5, fuzzy: true },
      { token: "denkweise", weight: 5, fuzzy: true },
      { token: "diagnose", weight: 5, fuzzy: true },
      { token: "gedacht", weight: 3 },
      { token: "verstanden", weight: 3, fuzzy: true },
      { token: "unsicherheit", weight: 4, fuzzy: true },
      { token: "hefte", weight: 2 }
    ],
    mathSpecificMarkers: [
      { pattern: "rechenweg anschauen", weight: 4 },
      { pattern: "loesungsweg anschauen", weight: 4 },
      { pattern: "fehler als hinweis", weight: 4 },
      { pattern: "strategie erkennen", weight: 3 }
    ],
    contextBoosts: {
      phase: { "Einstieg": 2, "Arbeitsphase": 2, "Unterrichtsgespräch": 1.5 },
      socialForm: { "Gruppenarbeit": 1.5, "Einzelarbeit": 1.5, "Plenum": 1 }
    },
    counterIndicators: [
      { pattern: "denkwege werden sichtbar", weight: -3 }
    ],
    typicalLAAErrors: ["Die Frage nach Verständnis ersetzt keine Diagnose der Denkwege."],
    impulseQuestions: ["Wodurch erhielt die Lehrkraft Einblick in Denkweisen oder Lernstände?"]
  },
  {
    id: "1.2.2",
    parentId: "1.2",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK greift unterschiedliche Beiträge der SuS auf.",
    shortLabel: "Beiträge aufgreifen",
    manualCore: "Unterschiedliche Beiträge, Ideen, Fehler oder Lösungswege der SuS werden aufgenommen, verbunden oder weitergeführt.",
    likelyPhases: ["Unterrichtsgespräch", "Sicherung", "Erarbeitung", "Gruppendiskussion"],
    likelySocialForms: ["Plenum", "Gruppenarbeit", "Partnerarbeit"],
    positiveMarkers: [
      { pattern: "beitraege werden aufgegriffen", weight: 6 },
      { pattern: "unterschiedliche ideen verbunden", weight: 6 },
      { pattern: "schueleridee wird weitergedacht", weight: 6 },
      { pattern: "fehler wird genutzt", weight: 5 },
      { pattern: "loesungen werden vorgestellt", weight: 5 },
      { pattern: "wir haben einen anderen weg genommen", weight: 6 },
      { pattern: "wer moechte vorstellen", weight: 4 }
    ],
    developmentMarkers: [
      { pattern: "beitraege verpuffen", weight: 6 },
      { pattern: "nicht gefragt ob jemand vorstellen moechte", weight: 7 },
      { pattern: "keine einladung zum vorstellen", weight: 6 },
      { pattern: "schuelerprodukte bleiben privat", weight: 6 },
      { pattern: "nur richtige antwort zaehlt", weight: 6 },
      { pattern: "falsche beitraege werden uebergangen", weight: 6 }
    ],
    teacherPhrases: [
      { pattern: "wer moechte vorstellen", weight: 5, tendency: "positive" },
      { pattern: "wer hat einen anderen weg", weight: 6, tendency: "positive" },
      { pattern: "ich greife das auf", weight: 5, tendency: "positive" },
      { pattern: "was machen wir mit diesem beitrag", weight: 5, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "bei mir ist", weight: 4, tendency: "positive" },
      { pattern: "ich habe aber", weight: 4, tendency: "positive" },
      { pattern: "wir haben einen anderen weg", weight: 6, tendency: "positive" },
      { pattern: "ich sehe das anders", weight: 5, tendency: "positive" },
      { pattern: "kann man auch", weight: 4, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "beitrag", weight: 4, fuzzy: true },
      { token: "aufgreifen", weight: 5, fuzzy: true },
      { token: "vorstellen", weight: 5, fuzzy: true },
      { token: "schueleridee", weight: 5, fuzzy: true },
      { token: "unterschiedlich", weight: 4, fuzzy: true },
      { token: "verbinden", weight: 3, fuzzy: true },
      { token: "weiterdenken", weight: 4, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "verschiedene loesungswege", weight: 5 },
      { pattern: "anderer ansatz", weight: 4 },
      { pattern: "alternative darstellung", weight: 4 },
      { pattern: "teilloesung", weight: 3 }
    ],
    contextBoosts: {
      phase: { "Unterrichtsgespräch": 3, "Sicherung": 2, "Gruppendiskussion": 2 },
      socialForm: { "Plenum": 2, "Gruppenarbeit": 1 }
    },
    counterIndicators: [
      { pattern: "beitrag wird weitergefuehrt", weight: -3 }
    ],
    typicalLAAErrors: ["Schülerbeiträge werden gesammelt, aber nicht fachlich genutzt oder verbunden."],
    impulseQuestions: ["Welche Schülerbeiträge wurden für die fachliche Weiterarbeit nutzbar gemacht?"]
  },
  {
    id: "1.2.3",
    parentId: "1.2",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK erfragt Denkweisen, Vorstellungen und Lösungsansätze der SuS.",
    shortLabel: "Denkweisen erfragen",
    manualCore: "Die Lehrkraft fragt gezielt nach Denkweisen, Vorstellungen, Ansätzen und Vorgehensweisen der SuS.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: [
      { pattern: "denkweise erfragt", weight: 7 },
      { pattern: "loesungsansatz erfragt", weight: 7 },
      { pattern: "vorstellung erfragt", weight: 6 },
      { pattern: "nach vorgehen gefragt", weight: 5 },
      { pattern: "warum gehst du so vor", weight: 6 }
    ],
    developmentMarkers: [
      { pattern: "nur ergebnis wird abgefragt", weight: 6 },
      { pattern: "keine nachfrage zum denkweg", weight: 7 },
      { pattern: "denkweg bleibt verborgen", weight: 6 },
      { pattern: "lehrkraft erklaert selbst weiter", weight: 5 }
    ],
    teacherPhrases: [
      { pattern: "wie hast du gedacht", weight: 7, tendency: "positive" },
      { pattern: "erklaer deinen ansatz", weight: 7, tendency: "positive" },
      { pattern: "warum gehst du so vor", weight: 7, tendency: "positive" },
      { pattern: "welche vorstellung steckt dahinter", weight: 7, tendency: "positive" },
      { pattern: "wie bist du", weight: 6, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "ich habe zuerst", weight: 5, tendency: "positive" },
      { pattern: "mein weg ist", weight: 5, tendency: "positive" },
      { pattern: "ich dachte dass", weight: 5, tendency: "positive" },
      { pattern: "ich bin davon ausgegangen", weight: 5, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "denkweise", weight: 5, fuzzy: true },
      { token: "vorstellung", weight: 5, fuzzy: true },
      { token: "loesungsansatz", weight: 6, fuzzy: true },
      { token: "ansatz", weight: 4, fuzzy: true },
      { token: "vorgehen", weight: 4, fuzzy: true },
      { token: "gedacht", weight: 4 },
      { token: "warum", weight: 2 }
    ],
    mathSpecificMarkers: [
      { pattern: "gleichung aufgestellt", weight: 3 },
      { pattern: "graph gedeutet", weight: 3 },
      { pattern: "modell gewaehlt", weight: 3 },
      { pattern: "rechenweg erklaert", weight: 4 }
    ],
    contextBoosts: {
      phase: { "Einstieg": 2, "Erarbeitung": 2, "Unterrichtsgespräch": 2, "Arbeitsphase": 1.5 },
      socialForm: { "Plenum": 1.5, "Gruppenarbeit": 1 }
    },
    counterIndicators: [
      { pattern: "nur endergebnis", weight: -2 }
    ],
    typicalLAAErrors: ["Fragen bleiben auf Ergebnisebene und erfassen nicht den Denkweg."],
    impulseQuestions: ["Welche Vorstellungen oder Lösungsansätze wurden durch Fragen sichtbar?"]
  },
  {
    id: "1.2.4",
    parentId: "1.2",
    dimension: "Kognitive Aktivierung",
    exactText: "Die SuS werden aufgefordert, ihre Antworten oder Lösungswege zu begründen.",
    shortLabel: "Begründungen einfordern",
    manualCore: "SuS sollen Antworten, Lösungswege oder fachliche Aussagen begründen, erklären, herleiten oder absichern.",
    likelyPhases: ["Erarbeitung", "Unterrichtsgespräch", "Sicherung", "Gruppendiskussion"],
    likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: [
      { pattern: "begruendungen eingefordert", weight: 7 },
      { pattern: "begruendungen einfordern", weight: 7 },
      { pattern: "begruendungen von den sus einfordern", weight: 8 },
      { pattern: "loesungsweg begruenden", weight: 7 },
      { pattern: "antwort begruenden", weight: 7 },
      { pattern: "warum erklaeren", weight: 5 },
      { pattern: "woran erkennst du das", weight: 6 },
      { pattern: "wie kannst du das zeigen", weight: 6 }
    ],
    developmentMarkers: [
      { pattern: "keine begruendung", weight: 7 },
      { pattern: "antwort bleibt unbegruendet", weight: 7 },
      { pattern: "ergebnis wird akzeptiert ohne nachfrage", weight: 7 },
      { pattern: "nur vorgelesen", weight: 5 },
      { pattern: "richtig reicht", weight: 5 },
      { pattern: "keine begruendungen verglichen", weight: 6 }
    ],
    teacherPhrases: [
      { pattern: "begründe", weight: 7, tendency: "positive" },
      { pattern: "begruende", weight: 7, tendency: "positive" },
      { pattern: "begruendungen einfordern", weight: 7, tendency: "positive" },
      { pattern: "begruendungen von den sus einfordern", weight: 8, tendency: "positive" },
      { pattern: "warum", weight: 3, tendency: "positive" },
      { pattern: "erklaer deinen weg", weight: 7, tendency: "positive" },
      { pattern: "woran erkennst du", weight: 6, tendency: "positive" },
      { pattern: "zeige das", weight: 4, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "weil", weight: 3, tendency: "positive" },
      { pattern: "das sieht man daran", weight: 5, tendency: "positive" },
      { pattern: "ich kann das zeigen", weight: 5, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "begruenden", weight: 6, fuzzy: true },
      { token: "begruendung", weight: 6, fuzzy: true },
      { token: "warum", weight: 3 },
      { token: "erklaeren", weight: 4, fuzzy: true },
      { token: "nachweisen", weight: 4, fuzzy: true },
      { token: "herleiten", weight: 5, fuzzy: true },
      { token: "argumentieren", weight: 5, fuzzy: true },
      { token: "loesungsweg", weight: 4, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "beweis", weight: 4 },
      { pattern: "herleitung", weight: 5 },
      { pattern: "term erklaeren", weight: 4 },
      { pattern: "graph begruenden", weight: 4 },
      { pattern: "darstellung begruenden", weight: 5 }
    ],
    contextBoosts: {
      phase: { "Unterrichtsgespräch": 2, "Sicherung": 2.5, "Erarbeitung": 2 },
      socialForm: { "Plenum": 1.5, "Partnerarbeit": 1, "Gruppenarbeit": 1 }
    },
    counterIndicators: [
      { pattern: "begruendungen werden verglichen", weight: -3 },
      { pattern: "begründen eingefordert", weight: -2 }
    ],
    typicalLAAErrors: ["Richtige Ergebnisse werden bestätigt, ohne fachliche Begründung einzufordern."],
    impulseQuestions: ["Wo wurden Antworten oder Lösungswege fachlich begründet statt nur genannt?"]
  },
  {
    id: "1.2.5",
    parentId: "1.2",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK thematisiert Verständnis und Verständnisschwierigkeiten der SuS.",
    shortLabel: "Verständnisschwierigkeiten thematisieren",
    manualCore: "Verständnisprobleme, Missverständnisse, Fehler oder Hürden werden sichtbar benannt und fachlich bearbeitet.",
    likelyPhases: ["Arbeitsphase", "Erarbeitung", "Unterrichtsgespräch", "Sicherung"],
    likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: [
      { pattern: "verstaendnisproblem wird aufgegriffen", weight: 7 },
      { pattern: "schwierigkeit wird benannt", weight: 6 },
      { pattern: "missverstaendnis wird geklaert", weight: 7 },
      { pattern: "wo hakt es", weight: 5 },
      { pattern: "fehler als hinweis genutzt", weight: 5 }
    ],
    developmentMarkers: [
      { pattern: "ich verstehe nicht wird nicht aufgegriffen", weight: 8 },
      { pattern: "gibt es noch fragen", weight: 3 },
      { pattern: "nein dann weiter", weight: 3 },
      { pattern: "schwierigkeiten bleiben privat", weight: 6 },
      { pattern: "lehrkraft geht weiter", weight: 5 },
      { pattern: "missverstaendnis bleibt unbearbeitet", weight: 7 },
      { pattern: "frage wird abgewuergt", weight: 7 }
    ],
    teacherPhrases: [
      { pattern: "wo hakt es", weight: 6, tendency: "positive" },
      { pattern: "was ist unklar", weight: 5, tendency: "positive" },
      { pattern: "welche stelle ist schwierig", weight: 6, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "ich verstehe das nicht", weight: 7, tendency: "development" },
      { pattern: "ich weiss nicht weiter", weight: 6, tendency: "development" },
      { pattern: "ich check das nicht", weight: 6, tendency: "development" },
      { pattern: "was bedeutet das", weight: 4, tendency: "development" }
    ],
    singleWordTokens: [
      { token: "verstehen", weight: 4, fuzzy: true },
      { token: "schwierigkeit", weight: 5, fuzzy: true },
      { token: "unklar", weight: 4, fuzzy: true },
      { token: "missverstaendnis", weight: 6, fuzzy: true },
      { token: "hakt", weight: 4 },
      { token: "fehler", weight: 3 },
      { token: "klaerung", weight: 4, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "vorzeichenfehler", weight: 4 },
      { pattern: "einheitenproblem", weight: 4 },
      { pattern: "termverstaendnis", weight: 5 },
      { pattern: "darstellungswechsel unklar", weight: 5 }
    ],
    contextBoosts: {
      phase: { "Arbeitsphase": 2, "Erarbeitung": 2, "Sicherung": 1.5 },
      socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5, "Plenum": 1 }
    },
    counterIndicators: [
      { pattern: "missverstaendnis geklaert", weight: -3 }
    ],
    typicalLAAErrors: ["Verständnissignale der SuS werden gehört, aber nicht diagnostisch genutzt."],
    impulseQuestions: ["Welche Verständnisschwierigkeit wurde sichtbar, und wie wurde sie fachlich bearbeitet?"]
  },
  {
    id: "1.2.6",
    parentId: "1.2",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK nutzt Aufgaben, Fragen oder Gesprächsimpulse, um Denkweisen der SuS sichtbar zu machen.",
    shortLabel: "Denkweisen sichtbar machen",
    manualCore: "Aufgaben, Fragen oder Gesprächsimpulse sind so gestaltet, dass Denkwege, Vorstellungen oder Strategien der SuS sichtbar werden.",
    likelyPhases: ["Einstieg", "Erarbeitung", "Unterrichtsgespräch", "Gruppendiskussion"],
    likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
    positiveMarkers: [
      { pattern: "diagnoseaufgabe", weight: 7 },
      { pattern: "impulsfrage macht denkwege sichtbar", weight: 7 },
      { pattern: "mehrere loesungswege sichtbar", weight: 6 },
      { pattern: "think pair share", weight: 5 },
      { pattern: "fehlersuche", weight: 5 },
      { pattern: "aufgabe fordert erklaerung", weight: 6 }
    ],
    developmentMarkers: [
      { pattern: "aufgabe erzeugt nur ergebnis", weight: 6 },
      { pattern: "impuls zu geschlossen", weight: 6 },
      { pattern: "keine denkwege sichtbar", weight: 7 },
      { pattern: "nur ein wort antworten", weight: 5 },
      { pattern: "ja nein frage", weight: 5 }
    ],
    teacherPhrases: [
      { pattern: "zeigt verschiedene wege", weight: 5, tendency: "positive" },
      { pattern: "was faellt euch auf", weight: 4, tendency: "positive" },
      { pattern: "ordnet die loesungen", weight: 4, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "unsere idee war", weight: 5, tendency: "positive" },
      { pattern: "wir dachten zuerst", weight: 5, tendency: "positive" },
      { pattern: "wir haben es so gemacht", weight: 5, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "impuls", weight: 4, fuzzy: true },
      { token: "diagnoseaufgabe", weight: 6, fuzzy: true },
      { token: "denkweg", weight: 5, fuzzy: true },
      { token: "sichtbar", weight: 4, fuzzy: true },
      { token: "fehlersuche", weight: 4, fuzzy: true },
      { token: "sortieraufgabe", weight: 4, fuzzy: true },
      { token: "reproduktion", weight: 3, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "darstellungen zuordnen", weight: 5 },
      { pattern: "loesungswege vergleichen", weight: 5 },
      { pattern: "fehler finden", weight: 4 },
      { pattern: "offene aufgabe", weight: 4 }
    ],
    contextBoosts: {
      phase: { "Einstieg": 2, "Erarbeitung": 2, "Unterrichtsgespräch": 2 },
      socialForm: { "Partnerarbeit": 1.5, "Gruppenarbeit": 1.5, "Plenum": 1 },
      method: { "Think-Pair-Share": 2, "Diagnoseaufgabe": 3, "Fehlersuche": 2, "Sortieraufgabe": 2 },
      focus: { "Denkwege": 2, "Vorstellungen": 2 }
    },
    counterIndicators: [
      { pattern: "denkwege werden sichtbar", weight: -3 }
    ],
    typicalLAAErrors: ["Aufgaben erzeugen Ergebnisse, aber keine sichtbaren Denkprozesse."],
    impulseQuestions: ["Welche Aufgabe oder welcher Impuls hat Denkweisen der SuS sichtbar gemacht?"]
  },
  {
    id: "1.2.7",
    parentId: "1.2",
    dimension: "Kognitive Aktivierung",
    exactText: "Die LK nimmt Arbeitsergebnisse oder Lösungswege der SuS in den Blick.",
    shortLabel: "Arbeitsergebnisse in den Blick nehmen",
    manualCore: "Konkrete Schülerprodukte, Fotos, Whiteboards, Hefte, Lösungswege oder Zwischenergebnisse werden sichtbar gemacht und genutzt.",
    likelyPhases: ["Arbeitsphase", "Sicherung", "Erarbeitung", "Gruppendiskussion"],
    likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
    positiveMarkers: [
      { pattern: "arbeitsergebnisse in den blick", weight: 7 },
      { pattern: "fotos von den ergebnissen", weight: 7 },
      { pattern: "whiteboards nebeneinander", weight: 7 },
      { pattern: "ergebnisse nebeneinander an der tafel", weight: 7 },
      { pattern: "schuelerloesungen sichtbar", weight: 7 },
      { pattern: "gruppenprodukte vergleichen", weight: 6 },
      { pattern: "dokumentenkamera", weight: 5 },
      { pattern: "gallery walk", weight: 5 },
      { pattern: "museumsgang", weight: 5 }
    ],
    developmentMarkers: [
      { pattern: "ergebnisse bleiben ungesehen", weight: 7 },
      { pattern: "nur eine glatte loesung wird genommen", weight: 8 },
      { pattern: "irrwege bleiben ungesehen", weight: 8 },
      { pattern: "zwischenergebnisse nicht in den blick", weight: 8 },
      { pattern: "nimmt zwischenergebnisse nicht in den blick", weight: 8 },
      { pattern: "gruppenprodukte werden nicht genutzt", weight: 7 },
      { pattern: "fehler bleiben unbemerkt", weight: 6 },
      { pattern: "nur allgemein gefragt", weight: 5 },
      { pattern: "keine sichtung der schuelerprodukte", weight: 7 }
    ],
    teacherPhrases: [
      { pattern: "zeigt eure loesung", weight: 5, tendency: "positive" },
      { pattern: "ich fotografiere das", weight: 5, tendency: "positive" },
      { pattern: "haengt eure boards auf", weight: 5, tendency: "positive" }
    ],
    studentPhrases: [
      { pattern: "bei uns steht", weight: 5, tendency: "positive" },
      { pattern: "unser ergebnis ist", weight: 4, tendency: "positive" },
      { pattern: "wir haben hier", weight: 4, tendency: "positive" }
    ],
    singleWordTokens: [
      { token: "arbeitsergebnis", weight: 6, fuzzy: true },
      { token: "loesungsweg", weight: 5, fuzzy: true },
      { token: "whiteboard", weight: 6, fuzzy: true },
      { token: "foto", weight: 5 },
      { token: "fotografiert", weight: 5, fuzzy: true },
      { token: "nebeneinander", weight: 5, fuzzy: true },
      { token: "heft", weight: 3 },
      { token: "gruppenprodukt", weight: 6, fuzzy: true },
      { token: "zwischenstand", weight: 5, fuzzy: true },
      { token: "dokumentenkamera", weight: 5, fuzzy: true }
    ],
    mathSpecificMarkers: [
      { pattern: "loesungsblatt", weight: 4 },
      { pattern: "rechenweg im heft", weight: 5 },
      { pattern: "skizze vergleichen", weight: 4 },
      { pattern: "darstellung vergleichen", weight: 4 }
    ],
    contextBoosts: {
      phase: { "Arbeitsphase": 2, "Sicherung": 3, "Gruppendiskussion": 2 },
      socialForm: { "Gruppenarbeit": 2, "Partnerarbeit": 1.5, "Plenum": 1 },
      medium: { "Whiteboard": 2, "Tafel": 1.5, "Dokumentenkamera": 2, "Foto": 2 },
      method: { "Gallery Walk": 2, "Museumsgang": 2, "Gruppenpuzzle": 1 }
    },
    counterIndicators: [
      { pattern: "schuelerloesungen werden verglichen", weight: -3 }
    ],
    typicalLAAErrors: ["Arbeitsprodukte entstehen, werden aber nicht für Diagnose oder fachliches Gespräch genutzt."],
    impulseQuestions: ["Welche Schülerprodukte oder Lösungswege wurden sichtbar und für die Weiterarbeit genutzt?"]
  }
];

const ITEM_PHASES = ["Vor Stunde", "Einstieg", "Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch", "Gruppendiskussion", "Sicherung", "Feedback", "Übergang", "Nach Stunde"];
const ITEM_SOCIAL_FORMS = ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Lehrervortrag", "Schülerpräsentation"];

function normalizeItemText(value) {
  const cacheKey = String(value ?? "");
  if (NORMALIZED_TEXT_CACHE.has(cacheKey)) {
    return NORMALIZED_TEXT_CACHE.get(cacheKey);
  }
  let normalized;
  if (UFB_TEXT_TOOLS?.normalizeTextForHeuristics) {
    normalized = UFB_TEXT_TOOLS.normalizeTextForHeuristics(value);
  } else {
    normalized = String(value ?? "")
      .toLowerCase()
      .replaceAll("ä", "ae")
      .replaceAll("ö", "oe")
      .replaceAll("ü", "ue")
      .replaceAll("ß", "ss")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{Letter}\p{Number}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  if (NORMALIZED_TEXT_CACHE.size > 5000) {
    NORMALIZED_TEXT_CACHE.clear();
  }
  NORMALIZED_TEXT_CACHE.set(cacheKey, normalized);
  return normalized;
}

function prepareItemText(value) {
  if (UFB_TEXT_TOOLS?.prepareTextForHeuristic) {
    return UFB_TEXT_TOOLS.prepareTextForHeuristic(value);
  }
  const normalizedText = normalizeItemText(value);
  const tokens = normalizedText.split(" ").filter(Boolean);
  return {
    original: String(value ?? ""),
    normalizedText,
    tokens,
    signalTokens: tokens,
    corrections: []
  };
}

function itemTokens(text) {
  return prepareItemText(text).tokens;
}

function containsNormalizedPhrase(normalized, pattern) {
  if (!pattern) {
    return false;
  }
  return ` ${normalized} `.includes(` ${pattern} `);
}

function analyzeUfbItemObservation(observation, history = []) {
  const textPreparation = prepareItemText(analysisTextForObservation(observation));
  const normalized = textPreparation.normalizedText;
  const tokens = textPreparation.tokens;
  if (observation.type === "free" || normalized.length < 3) {
    return { suggestions: [], allScores: [], fallback: true, message: "Freie professionelle Beobachtung oder zu wenig Text.", textPreparation };
  }

  const segments = segmentPreparedText(textPreparation).slice(0, 5);
  textPreparation.segments = segments.map((segment) => segment.original);

  const allScores = UFB_ITEM_HEURISTICS.map((item) => {
    const base = scoreItemHeuristic(item, observation, normalized, tokens, history);
    return applySegmentBoost(base, item, observation, history, segments);
  })
    .sort((a, b) => b.score - a.score);
  const topScore = allScores[0]?.score ?? 0;
  const minScore = 4.4;
  const weakTextSignalScore = 3.1;
  const suggestions = allScores
    .filter((result, index) => {
      const textSignal = textSignalScore(result);
      const passesScore = result.score >= minScore || (textSignal >= 1.8 && result.score >= weakTextSignalScore);
      return passesScore && (index < 5 || (index === 5 && result.score >= 12 && topScore - result.score <= 2));
    })
    .slice(0, 5)
    .map((result, index, list) => ({
      ...result,
      confidence: confidencePercent(result, list[index + 1] ?? allScores[index + 1]),
      confidenceLabel: confidenceLabel(confidencePercent(result, list[index + 1] ?? allScores[index + 1]))
    }));

  return {
    suggestions,
    allScores: allScores.map((result, index) => ({
      ...result,
      confidence: confidencePercent(result, allScores[index + 1]),
      confidenceLabel: confidenceLabel(confidencePercent(result, allScores[index + 1]))
    })),
    fallback: suggestions.length === 0,
    message: suggestions.length ? "" : "Keine klare Verknüpfung erkannt: manuell wählen, freie Beobachtung oder später sortieren.",
    textPreparation
  };
}

function analysisTextForObservation(observation = {}) {
  return [
    observation.text,
    observation.hintText,
    observation.professionalHint
  ]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(". ");
}

function segmentPreparedText(textPreparation) {
  const original = String(textPreparation.original ?? "");
  const rawParts = original
    .split(/(?:[.!?;]\s+)|(?:\s+und\s+)|(?:\s+aber\s+)|(?:\s+dann\s+)|(?:\s+während\s+)|(?:\s+waehrend\s+)/i)
    .map((part) => part.trim())
    .filter(Boolean);
  const parts = rawParts.length > 1 ? rawParts : [original];
  return parts
    .map((part) => prepareItemText(part))
    .filter((part) => part.tokens.length >= 2 && part.normalizedText !== textPreparation.normalizedText);
}

function applySegmentBoost(base, item, observation, history, segments) {
  if (!segments.length) {
    return base;
  }
  const segmentScores = segments
    .map((segment) => ({
      segment,
      result: scoreItemHeuristic(item, observation, segment.normalizedText, segment.tokens, history, {
        contextMultiplier: 0,
        recurrenceMultiplier: 0,
        timeMultiplier: 0
      })
    }))
    .filter((entry) => entry.result.score >= 4)
    .sort((a, b) => b.result.score - a.result.score);
  const best = segmentScores[0];
  if (!best) {
    return base;
  }
  const boost = Math.min(5.5, Number((best.result.score * 0.42).toFixed(1)));
  const boostedScore = Math.max(0, Number((base.score + boost).toFixed(1)));
  const tendency = best.result.tendency !== "neutral" && base.tendency === "neutral"
    ? best.result.tendency
    : base.tendency;
  return {
    ...base,
    score: boostedScore,
    tendency,
    reasons: [
      ...base.reasons,
      reason("segment", best.segment.original.slice(0, 64), boost)
    ]
  };
}

function scoreItemHeuristic(item, observation, normalized, tokens, history, options = {}) {
  let score = 0;
  let positive = 0;
  let development = 0;
  const reasons = [];
  const tokenSet = new Set(tokens);
  const matchedPhrases = new Set();
  const contextMultiplier = options.contextMultiplier ?? 0.45;
  const recurrenceMultiplier = options.recurrenceMultiplier ?? 1;
  const timeMultiplier = options.timeMultiplier ?? 1;

  const phaseWeight = item.contextBoosts?.phase?.[observation.phase] ?? (item.likelyPhases.includes(observation.phase) ? 1.2 : 0);
  if (phaseWeight && contextMultiplier) {
    const weight = Number((phaseWeight * contextMultiplier).toFixed(1));
    score += weight;
    reasons.push(reason("phase", observation.phase, weight));
  }

  const socialWeight = item.contextBoosts?.socialForm?.[observation.socialForm] ?? (item.likelySocialForms.includes(observation.socialForm) ? 0.8 : 0);
  if (socialWeight && contextMultiplier) {
    const weight = Number((socialWeight * contextMultiplier).toFixed(1));
    score += weight;
    reasons.push(reason("socialForm", observation.socialForm, weight));
  }

  ["method", "material", "medium", "focus", "topic"].forEach((field) => {
    if (!contextMultiplier) {
      return;
    }
    const contextValue = normalizeItemText(observation[field]);
    if (!contextValue) {
      return;
    }
    Object.entries(item.contextBoosts?.[field] ?? {}).forEach(([pattern, weight]) => {
      if (contextValue.includes(normalizeItemText(pattern))) {
        const weighted = Number((weight * contextMultiplier).toFixed(1));
        score += weighted;
        reasons.push(reason(field, pattern, weighted));
      }
    });
  });

  const speakerPhrases = [
    ...item.teacherPhrases.map((entry) => ({ ...entry, speaker: "teacher_quote" })),
    ...item.studentPhrases.map((entry) => ({ ...entry, speaker: "student_quote" }))
  ].map((entry) => ({
    ...entry,
    weight: entry.speaker === observation.type ? Number((entry.weight + 0.5).toFixed(1)) : entry.weight
  }));

  const phrasePools = [
    ...speakerPhrases,
    ...item.positiveMarkers.map((entry) => ({ ...entry, tendency: "positive" })),
    ...item.developmentMarkers.map((entry) => ({ ...entry, tendency: "development" })),
    ...item.mathSpecificMarkers.map((entry) => ({ ...entry, tendency: "neutral" }))
  ];

  phrasePools
    .slice()
    .sort((a, b) => normalizeItemText(b.pattern).length - normalizeItemText(a.pattern).length)
    .forEach((entry) => {
      const pattern = normalizeItemText(entry.pattern);
      if (pattern && containsNormalizedPhrase(normalized, pattern) && !matchedPhrases.has(pattern)) {
        matchedPhrases.add(pattern);
        score += entry.weight;
        const effectiveTendency = entry.tendency === "positive" && hasNegationNearPhrase(normalized, pattern)
          ? "development"
          : entry.tendency;
        if (effectiveTendency === "positive") positive += entry.weight;
        if (effectiveTendency === "development") development += entry.weight;
        reasons.push(reason(effectiveTendency === "development" ? "developmentPhrase" : effectiveTendency === "positive" ? "positivePhrase" : "mathPhrase", entry.pattern, entry.weight));
      }
    });

  item.singleWordTokens.forEach((entry) => {
    const token = normalizeItemText(entry.token);
    if (tokenSet.has(token)) {
      score += entry.weight;
      reasons.push(reason("token", entry.token, entry.weight));
      return;
    }
    const stemMatch = entry.fuzzy === false ? null : bestStemTokenMatch(token, tokens);
    if (stemMatch) {
      const stemWeight = Number((entry.weight * 0.46).toFixed(1));
      score += stemWeight;
      reasons.push(reason("wordStem", `${entry.token}≈${stemMatch}`, stemWeight));
      return;
    }
    if (entry.fuzzy) {
      const match = bestFuzzyTokenMatch(token, tokens);
      if (match) {
        const fuzzyWeight = Number((entry.weight * 0.55).toFixed(1));
        score += fuzzyWeight;
        reasons.push(reason("fuzzy", `${entry.token}≈${match}`, fuzzyWeight));
      }
    }
  });

  const semantic = semanticSearchScore(item, normalized, tokens);
  if (semantic.score) {
    score += semantic.score;
    if (semantic.tendency === "positive") {
      positive += semantic.score;
    }
    if (semantic.tendency === "development") {
      development += semantic.score;
    }
    semantic.reasons.forEach((entry) => reasons.push(entry));
  }

  item.counterIndicators.forEach((entry) => {
    const pattern = normalizeItemText(entry.pattern);
    if (pattern && normalized.includes(pattern)) {
      score += entry.weight;
      reasons.push(reason("counter", entry.pattern, entry.weight));
    }
  });

  const recurrence = history.filter((event) => (event.confirmedItemIds ?? []).includes(item.id)).length;
  if (recurrence && recurrenceMultiplier) {
    const recurrenceScore = Math.min(2.5, recurrence * 0.8 * recurrenceMultiplier);
    score += recurrenceScore;
    reasons.push(reason("recurrence", `${recurrence} frühere Bestätigung(en)`, recurrenceScore));
  }

  const minute = Number(observation.minuteInLesson);
  if (timeMultiplier && Number.isFinite(minute) && minute >= 35 && ["1.1.7", "1.1.6", "1.1.4"].includes(item.id)) {
    const timeScore = Number((1.2 * timeMultiplier).toFixed(1));
    score += timeScore;
    reasons.push(reason("time", "späte Stunde/Sicherung wahrscheinlich", timeScore));
  }

  return {
    item,
    score: Math.max(0, Number(score.toFixed(1))),
    tendency: development > positive ? "development" : positive > development ? "positive" : "neutral",
    reasons
  };
}

function semanticSearchScore(item, normalized, tokens) {
  const queryTerms = Array.from(new Set(tokens
    .map((token) => heuristicTokenStem(token))
    .filter((token) => token && token.length >= 3 && !SEMANTIC_STOPWORDS.has(token))));
  if (!queryTerms.length) {
    return { score: 0, tendency: "neutral", reasons: [] };
  }
  const document = semanticDocumentForItem(item);
  let score = 0;
  let positive = 0;
  let development = 0;
  const matched = [];
  queryTerms.forEach((term) => {
    const entry = document.terms.get(term);
    if (!entry) {
      return;
    }
    const contribution = Math.min(3.6, Number((Math.sqrt(entry.weight) * 1.24).toFixed(1)));
    score += contribution;
    if (entry.tendency === "positive") {
      positive += contribution;
    }
    if (entry.tendency === "development") {
      development += contribution;
    }
    matched.push(`${entry.label ?? term}≈${term}`);
  });

  document.phrases.forEach((entry) => {
    if (entry.pattern && containsNormalizedPhrase(normalized, entry.pattern)) {
      const contribution = Math.min(3.8, Number((entry.weight * 0.58).toFixed(1)));
      score += contribution;
      if (entry.tendency === "positive") {
        positive += contribution;
      }
      if (entry.tendency === "development") {
        development += contribution;
      }
      matched.push(entry.label);
    }
  });

  if (score <= 0) {
    return { score: 0, tendency: "neutral", reasons: [] };
  }
  const cautiousScore = Math.min(8.5, Number(score.toFixed(1)));
  const cueTendency = developmentCue(normalized) && cautiousScore >= 2.2 ? "development" : "neutral";
  const tendency = development > positive ? "development"
    : positive > development ? "positive"
      : cueTendency;
  return {
    score: cautiousScore,
    tendency,
    reasons: [reason("semantic", matched.slice(0, 4).join(", "), cautiousScore)]
  };
}

const SEMANTIC_STOPWORDS = new Set([
  "der", "die", "das", "ein", "eine", "einer", "einem", "einen", "und", "oder", "aber",
  "bei", "mit", "von", "vom", "zum", "zur", "auf", "aus", "in", "im", "am", "an", "als",
  "ist", "sind", "war", "waren", "wird", "werden", "wurde", "haben", "hat", "sich", "sie",
  "er", "es", "du", "ich", "man", "dann", "noch", "nur", "sehr", "eher", "gerade"
]);

function developmentCue(normalized) {
  return /\b(nicht|kein|keine|keinen|ohne|fehlt|fehlen|unklar|besser|sollte|sollten|zu wenig|zu viel|kaum|verpufft|bleibt)\b/u.test(normalized);
}

function semanticDocumentForItem(item) {
  const terms = new Map();
  const phrases = [];
  const addText = (text, weight, tendency = "neutral", label = "") => {
    const prepared = prepareItemText(text);
    prepared.tokens
      .map((token) => heuristicTokenStem(token))
      .filter((token) => token && token.length >= 3 && !SEMANTIC_STOPWORDS.has(token))
      .forEach((term) => addTerm(terms, term, weight, tendency, label || text));
    const phrase = prepared.normalizedText;
    if (phrase && phrase.split(" ").length >= 2) {
      phrases.push({ pattern: phrase, weight, tendency, label: label || text });
    }
  };
  addText(item.exactText, 3.2, "neutral", "Itemwortlaut");
  addText(item.shortLabel, 3.4, "neutral", "Kurzlabel");
  addText(item.manualCore, 2.4, "neutral", "Kurzdeutung");
  [...(item.positiveMarkers ?? []), ...(item.teacherPhrases ?? []).filter((entry) => entry.tendency === "positive"), ...(item.studentPhrases ?? []).filter((entry) => entry.tendency === "positive")]
    .forEach((entry) => addText(entry.pattern, 3.1, "positive", entry.pattern));
  [...(item.developmentMarkers ?? []), ...(item.teacherPhrases ?? []).filter((entry) => entry.tendency === "development"), ...(item.studentPhrases ?? []).filter((entry) => entry.tendency === "development")]
    .forEach((entry) => addText(entry.pattern, 3.4, "development", entry.pattern));
  [...(item.teacherPhrases ?? []), ...(item.studentPhrases ?? []), ...(item.mathSpecificMarkers ?? [])]
    .forEach((entry) => addText(entry.pattern, 2.3, entry.tendency ?? "neutral", entry.pattern));
  (item.singleWordTokens ?? []).forEach((entry) => addText(entry.token, 4.1, "neutral", entry.token));
  (item.typicalLAAErrors ?? []).forEach((text) => addText(text, 2.7, "development", "typisches Muster"));
  (item.impulseQuestions ?? []).forEach((text) => addText(text, 1.6, "neutral", "Impuls"));
  researchPatternsForItem(item).forEach((pattern) => {
    const tendency = patternTendency(pattern);
    addText(pattern.title, 2.2, tendency, pattern.title);
    (pattern.patternMarkers ?? []).forEach((marker) => addText(marker, 2.6, tendency, marker));
    (pattern.interpretationTemplate ? [pattern.interpretationTemplate] : []).forEach((text) => addText(text, 1.8, tendency, pattern.title));
    (pattern.possiblePrompts ?? []).forEach((prompt) => addText(prompt, 1.4, tendency, pattern.title));
  });
  return { terms, phrases };
}

function addTerm(terms, term, weight, tendency, label) {
  const existing = terms.get(term) ?? { weight: 0, tendency: "neutral", label };
  existing.weight += weight;
  if (existing.tendency === "neutral" && tendency !== "neutral") {
    existing.tendency = tendency;
  }
  if (tendency === "development" && existing.tendency !== "development") {
    existing.tendency = "development";
  }
  terms.set(term, existing);
}

function researchPatternsForItem(item) {
  const library = UFB_HEURISTIC_ROOT.RESEARCH_PATTERN_LIBRARY;
  const patterns = Array.isArray(library?.patterns) ? library.patterns : [];
  if (!patterns.length) {
    return [];
  }
  return patterns.filter((pattern) =>
    (pattern.itemCandidates ?? []).includes(item.id)
    || (pattern.relatedItemFamilies ?? []).includes(item.parentId)
  );
}

function patternTendency(pattern) {
  const value = String(pattern.likelyValence ?? pattern.cardType ?? "").toLowerCase();
  if (value.includes("positive") || value.includes("learning")) {
    return "positive";
  }
  if (value.includes("development") || value.includes("critical")) {
    return "development";
  }
  return "neutral";
}

function hasNegationNearPhrase(normalized, pattern) {
  const words = normalized.split(" ").filter(Boolean);
  const phraseWords = pattern.split(" ").filter(Boolean);
  if (!words.length || !phraseWords.length) {
    return false;
  }
  const negations = new Set(["kein", "keine", "keinen", "keiner", "keinem", "nicht", "ohne", "fehlt", "fehlen", "fehlend", "bleibt"]);
  for (let index = 0; index <= words.length - phraseWords.length; index += 1) {
    const matches = phraseWords.every((word, offset) => words[index + offset] === word);
    if (!matches) {
      continue;
    }
    const before = words.slice(Math.max(0, index - 4), index);
    const after = words.slice(index + phraseWords.length, index + phraseWords.length + 3);
    if (before.some((word) => negations.has(word)) || after.some((word) => negations.has(word))) {
      return true;
    }
  }
  return false;
}

function reason(type, label, weight) {
  const sign = weight >= 0 ? "+" : "";
  return { type, label, weight, text: `${type}: ${label} (${sign}${weight})` };
}

function textSignalScore(result) {
  return (result.reasons ?? [])
    .filter((entry) => !["phase", "socialForm", "recurrence", "time"].includes(entry.type))
    .reduce((sum, entry) => sum + Math.max(0, Number(entry.weight) || 0), 0);
}

function bestStemTokenMatch(expected, tokens) {
  const expectedStem = heuristicTokenStem(expected);
  if (!expectedStem || expectedStem.length < 4) {
    return null;
  }
  return tokens.find((token) => heuristicTokenStem(token) === expectedStem) ?? null;
}

function heuristicTokenStem(token) {
  const value = normalizeItemText(token);
  if (!value || value.length < 4) {
    return "";
  }
  const families = [
    ["versteh", ["versteh", "verstaend", "kapier", "kapiert"]],
    ["denk", ["denk", "denkweis", "nachdenk", "ueberleg", "gruebel"]],
    ["begruend", ["begruend", "argument", "herleit"]],
    ["erklaer", ["erklaer", "erlaeuter"]],
    ["auftrag", ["auftrag", "auftraeg", "arbeitsauftrag", "anweisung"]],
    ["sicher", ["sicher", "absicher", "sicherung", "gesichert"]],
    ["unklar", ["unklar", "unklarheit", "unklarheiten", "unverstaendlich"]],
    ["zeit", ["zeit", "dauer", "timer", "minute"]],
    ["wart", ["wart", "leerlauf"]],
    ["stoer", ["stoer", "unruh", "abschweif", "nebentaetigkeit"]],
    ["laut", ["laut", "laerm"]],
    ["hilfe", ["hilfe", "unterstuetz", "tipp", "scaffold"]],
    ["lernstand", ["lernstand", "stand", "niveau"]],
    ["loesungsweg", ["loesungsweg", "rechenweg", "weg", "vorgehen"]],
    ["beitrag", ["beitrag", "antwort", "meldung"]],
    ["sicherung", ["sicherung", "sichern", "gesichert"]],
    ["fokus", ["fokus", "fokuss", "konzentrier"]]
  ];
  const family = families.find(([, variants]) => variants.some((variant) => value.includes(variant)));
  if (family) {
    return family[0];
  }
  return value
    .replace(/(ungen|lichkeit|keiten|ischen|ische|licher|lichem|lichen|ung|heit|keit|ern|en|er|em|es|e|t)$/u, "");
}

function bestFuzzyTokenMatch(expected, tokens) {
  if (expected.length < 6) {
    return null;
  }
  const maxDistance = expected.length > 10 ? 2 : 1;
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  tokens.forEach((token) => {
    if (Math.abs(token.length - expected.length) > maxDistance || token.length < 5) {
      return;
    }
    const distance = levenshtein(expected, token);
    if (distance <= maxDistance && distance < bestDistance) {
      best = token;
      bestDistance = distance;
    }
  });
  return best;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i += 1) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j += 1) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function confidencePercent(result, nextResult) {
  if (!result || result.score <= 0) {
    return 0;
  }
  const margin = Math.max(0, result.score - (nextResult?.score ?? 0));
  return Math.max(12, Math.min(96, Math.round(22 + result.score * 4.2 + margin * 2.6)));
}

function confidenceLabel(value) {
  if (value >= 90) return "sehr hoch";
  if (value >= 80) return "hoch";
  if (value >= 68) return "eher hoch";
  if (value >= 55) return "eher niedrig";
  if (value >= 40) return "niedrig";
  return "sehr niedrig";
}

function runUfbItemHeuristicTests() {
  const cases = [
    { text: "Sicherung sammelt nur Ergebnisse, kein Bezug zur Leitfrage.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.1.7", "1.1.4", "1.2.4"] },
    { text: "Leitfrage wird am Ende wieder aufgegriffen und die SuS formulieren das Fazit.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.1.7", "1.1.4"] },
    { text: "Leitfrge taucht in der Sicherung nicht mehr auf, Problem vom Anfang bleibt offen.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.1.1", "1.1.4", "1.1.7"] },
    { text: "Problemorientierung am Anfang stark: SuS wissen, welche Frage sie klaeren sollen.", type: "observation", phase: "Einstieg", socialForm: "Plenum", expected: ["1.1.1", "1.1.5"] },
    { text: "Kein Tafelbild, keine Visualisierung, sehr viele Infos auf einmal.", type: "observation", phase: "Erarbeitung", socialForm: "Lehrervortrag", expected: ["1.1.2", "1.1.3"] },
    { text: "Nichts notiert, kein Bild, viele neue Begriffe, Arbeitsspeicher der SuS wirkt ueberlastet.", type: "observation", phase: "Erarbeitung", socialForm: "Lehrervortrag", expected: ["1.1.2", "1.1.3"] },
    { text: "Die Ziele sind nicht gut definiert, Fokus geht verloren.", type: "observation", phase: "Einstieg", socialForm: "Plenum", expected: ["1.1.2", "1.1.5"] },
    { text: "Aus dem Beispiel wird eine allgemeine Regel entwickelt.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.1.5", "1.1.6"] },
    { text: "Konkreter Fall wird fachlich verallgemeinert, daraus entsteht eine Regel.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.1.5", "1.1.7"] },
    { text: "LAA fragt: Wer möchte seinen Lösungsweg vorstellen?", type: "teacher_quote", phase: "Sicherung", socialForm: "Plenum", expected: ["1.2.2", "1.2.7"] },
    { text: "Niemand wird gefragt, ob jemand vorstellen möchte, Ergebnisse bleiben privat.", type: "observation", phase: "Sicherung", socialForm: "Gruppenarbeit", expected: ["1.2.2", "1.2.7"] },
    { text: "Wie bist du auf diesen Weg gekommen?", type: "teacher_quote", phase: "Unterrichtsgespräch", socialForm: "Plenum", expected: ["1.2.3", "1.2.1"] },
    { text: "Gut, dass Sie hier Begründungen von den SuS einfordern.", type: "observation", phase: "Unterrichtsgespräch", socialForm: "Plenum", expected: ["1.2.4"] },
    { text: "Begruendungn werden nicht nachgefragt, richtiges Ergebnis reicht.", type: "observation", phase: "Unterrichtsgespräch", socialForm: "Plenum", expected: ["1.2.4"] },
    { text: "Es werden nur Ergebnisse vorgelesen, keine Begründungen verglichen.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.2.4", "1.1.7"] },
    { text: "Fotos von den Gruppenergebnissen werden nebeneinander an der Tafel verglichen.", type: "observation", phase: "Sicherung", socialForm: "Gruppenarbeit", expected: ["1.2.7", "1.2.2"] },
    { text: "Whiteboards hängen vorne, unterschiedliche Rechenwege werden sichtbar.", type: "observation", phase: "Sicherung", socialForm: "Gruppenarbeit", expected: ["1.2.7", "1.2.6"] },
    { text: "Gruppen fotografieren ihre Zwischenstaende, Boards liegen nebeneinander und werden besprochen.", type: "observation", phase: "Gruppendiskussion", socialForm: "Gruppenarbeit", expected: ["1.2.7", "1.2.2"] },
    { text: "Ich verstehe das nicht, sagt S3, Lehrkraft geht weiter.", type: "student_quote", phase: "Arbeitsphase", socialForm: "Einzelarbeit", expected: ["1.2.5", "1.2.1"] },
    { text: "Gibt es noch Fragen? Nein? Dann weiter.", type: "teacher_quote", phase: "Übergang", socialForm: "Plenum", expected: ["1.2.1", "1.2.5"] },
    { text: "Diagnoseaufgabe: SuS ordnen Graphen und Terme einander zu.", type: "observation", phase: "Einstieg", socialForm: "Partnerarbeit", expected: ["1.2.6", "1.2.1"] },
    { text: "Tafelbild ist strukutriert, zentrale Idee wird markiert.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.1.3", "1.1.6", "1.1.2"] },
    { text: "SuS fragen: Was sollen wir lernen?", type: "student_quote", phase: "Einstieg", socialForm: "Plenum", expected: ["1.1.1", "1.1.5"] },
    { text: "Graph wird mit Sachkontext verbunden und das Ergebnis interpretiert.", type: "observation", phase: "Sicherung", socialForm: "Plenum", expected: ["1.1.4", "1.1.7"] },
    { text: "Die Aufgabe erzeugt nur ein Ergebnis, Denkwege werden nicht sichtbar.", type: "observation", phase: "Erarbeitung", socialForm: "Einzelarbeit", expected: ["1.2.6", "1.2.3"] },
    { text: "Fachbegriffe bleiben ungeklaert, die Erklärung springt.", type: "observation", phase: "Erarbeitung", socialForm: "Plenum", expected: ["1.1.3"] },
    { text: "Museumsgang: Gruppenprodukte werden verglichen.", type: "observation", phase: "Sicherung", socialForm: "Gruppenarbeit", expected: ["1.2.7", "1.2.2"] },
    { text: "Kleidung wirkt für Unterrichtssituation unangemessen.", type: "free", phase: "Vor Stunde", socialForm: "Plenum", expected: [] }
  ];

  return cases.map((test) => {
    const result = analyzeUfbItemObservation(test, []);
    const top = result.suggestions.map((suggestion) => suggestion.item.id);
    return {
      text: test.text,
      expected: test.expected,
      top,
      fallback: result.fallback,
      tooMany: result.suggestions.length > 4,
      hitExpected: test.expected.length === 0 ? result.fallback : test.expected.some((id) => top.includes(id)),
      suggestions: result.suggestions.map((suggestion) => ({
        id: suggestion.item.id,
        label: suggestion.item.shortLabel,
        score: suggestion.score,
        confidence: suggestion.confidence,
        confidenceLabel: suggestion.confidenceLabel,
        tendency: suggestion.tendency,
        reasons: suggestion.reasons.map((entry) => entry.text)
      })),
      topScores: result.allScores.slice(0, 5).map((entry) => ({
        id: entry.item.id,
        score: entry.score,
        confidence: entry.confidence,
        confidenceLabel: entry.confidenceLabel,
        tendency: entry.tendency,
        reasons: entry.reasons.map((reasonEntry) => reasonEntry.text)
      }))
    };
  });
}

const root = UFB_HEURISTIC_ROOT;
root.UFB_ITEM_HEURISTICS = UFB_ITEM_HEURISTICS;
root.ITEM_PHASES = ITEM_PHASES;
root.ITEM_SOCIAL_FORMS = ITEM_SOCIAL_FORMS;
root.analyzeUfbItemObservation = analyzeUfbItemObservation;
root.runUfbItemHeuristicTests = runUfbItemHeuristicTests;

if (typeof module !== "undefined") {
  module.exports = {
    UFB_ITEM_HEURISTICS,
    ITEM_PHASES,
    ITEM_SOCIAL_FORMS,
    analyzeUfbItemObservation,
    runUfbItemHeuristicTests,
    normalizeItemText,
    prepareItemText,
    bestFuzzyTokenMatch,
    levenshtein
  };
}
