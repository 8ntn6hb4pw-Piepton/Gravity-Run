/*
  Extension for the item-level UFB heuristic.
  Adds item profiles for 1.3 through 3.3 without changing the existing UI.
  The logic remains assistive: it proposes plausible item links, it does not evaluate.
*/

(function attachExtendedItemHeuristics(root) {
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

  const target = root.UFB_ITEM_HEURISTICS || base.UFB_ITEM_HEURISTICS;
  if (!target) {
    return;
  }

  const mk = (data) => ({
    parentId: data.id.split(".").slice(0, 2).join("."),
    dimension: data.dimension,
    exactText: data.exactText,
    shortLabel: data.shortLabel,
    manualCore: data.manualCore,
    likelyPhases: data.likelyPhases ?? [],
    likelySocialForms: data.likelySocialForms ?? [],
    positiveMarkers: data.positiveMarkers ?? [],
    developmentMarkers: data.developmentMarkers ?? [],
    teacherPhrases: data.teacherPhrases ?? [],
    studentPhrases: data.studentPhrases ?? [],
    singleWordTokens: data.singleWordTokens ?? [],
    mathSpecificMarkers: data.mathSpecificMarkers ?? [],
    contextBoosts: data.contextBoosts ?? {},
    counterIndicators: data.counterIndicators ?? [],
    typicalLAAErrors: data.typicalLAAErrors ?? [],
    impulseQuestions: data.impulseQuestions ?? [],
    ...data
  });

  const p = (pattern, weight, tendency) => tendency ? { pattern, weight, tendency } : { pattern, weight };
  const tok = (token, weight = 3, fuzzy = true) => ({ token, weight, fuzzy });

  const UFB_ADDITIONAL_ITEM_HEURISTICS = [
    mk({
      id: "1.3.1",
      dimension: "Kognitive Aktivierung",
      exactText: "Fragen und Aufgaben regen zur vertieften fachlichen Auseinandersetzung an.",
      shortLabel: "fachlich vertiefen",
      manualCore: "Aufgaben und Fragen halten die fachliche Auseinandersetzung offen: Antworten werden nicht vorschnell entlassen, sondern präzisiert, geprüft und vertieft.",
      likelyPhases: ["Erarbeitung", "Unterrichtsgespräch", "Sicherung"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [
        p("lehrkraft fragt nach", 5), p("halbrichtige antwort wird geklaert", 7), p("schueler bekommt zweite chance", 7),
        p("antwort wird vertieft", 6), p("fachlich nachgeschaerft", 6), p("nicht sofort weitergegangen", 5),
        p("genauer erklaeren", 5), p("aussage pruefen", 5)
      ],
      developmentMarkers: [
        p("zu schnell entlassen", 7), p("naechster schueler dran", 6), p("halbrichtige antwort bleibt stehen", 7),
        p("okay obwohl unklar", 6), p("keine vertiefung", 6), p("antwort wird abgehakt", 5),
        p("auf ergebnisebene geblieben", 5)
      ],
      teacherPhrases: [
        p("was meinst du genau", 6, "positive"), p("sag es noch genauer", 6, "positive"),
        p("reicht uns das schon", 5, "positive"), p("kannst du das praezisieren", 6, "positive")
      ],
      studentPhrases: [
        p("ich glaube", 3, "neutral"), p("so ungefaehr", 5, "development"), p("irgendwie", 4, "development"),
        p("weiss nicht genau", 5, "development")
      ],
      singleWordTokens: [
        tok("vertiefen", 5), tok("nachfragen", 5), tok("praezisieren", 5), tok("genauer", 4, false),
        tok("halbrichtig", 6), tok("oberflaechlich", 5), tok("aushalten", 3), tok("weiterfragen", 5)
      ],
      mathSpecificMarkers: [
        p("term erklaeren", 4), p("graph deuten", 4), p("aussage pruefen", 5),
        p("rechenweg absichern", 5), p("zusammenhang klaeren", 5)
      ],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2.5, "Erarbeitung": 2, "Sicherung": 2 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("randstaendiger fehler", -3), p("fuer lernziel nicht relevant", -3)],
      typicalLAAErrors: ["Halbrichtige Antworten werden zu schnell akzeptiert oder durch andere SuS ersetzt."],
      impulseQuestions: ["Wo hätte eine Schülerantwort fachlich weiterentwickelt werden können?"]
    }),

    mk({
      id: "1.3.2",
      dimension: "Kognitive Aktivierung",
      exactText: "Die LK stellt unterschiedliche Lösungen, Denkweisen oder Sachverhalte kontrastierend gegenüber.",
      shortLabel: "fachlich kontrastieren",
      manualCore: "Unterschiedliche Wege, Sichtweisen oder Sachverhalte werden fachlich gegeneinander gehalten: Was ist genauer, tragfähiger, passender zum Operator oder effizienter?",
      likelyPhases: ["Unterrichtsgespräch", "Sicherung", "Gruppendiskussion"],
      likelySocialForms: ["Plenum", "Gruppenarbeit", "Partnerarbeit"],
      positiveMarkers: [
        p("loesungswege werden verglichen", 7), p("fachlich kontrastiert", 7), p("gegenuebergestellt", 6),
        p("was ist genauer", 6), p("was passt besser", 6), p("unterschiede herausgearbeitet", 6),
        p("operatorengerecht verglichen", 6), p("analytisch und heuristisch verglichen", 6),
        p("begruendungen verglichen", 6)
      ],
      developmentMarkers: [
        p("loesungen nur nebeneinander", 7), p("nicht verglichen", 6), p("auch richtig ohne klaerung", 6),
        p("unterschiede nicht genutzt", 6), p("nur vorgestellt", 5),
        p("keine begruendungen verglichen", 7), p("nur ergebnisse vorgelesen", 7)
      ],
      teacherPhrases: [
        p("was ist an weg a anders", 6, "positive"), p("welcher weg passt besser", 6, "positive"),
        p("was ist genauer", 6, "positive"), p("was ist an dieser darstellung genauer", 7, "positive"),
        p("vergleicht die beiden wege", 6, "positive")
      ],
      studentPhrases: [
        p("ich habe es anders", 5, "positive"), p("bei uns geht das auch", 4, "positive"),
        p("das ist einfacher", 4, "positive"), p("das ist genauer", 5, "positive")
      ],
      singleWordTokens: [
        tok("vergleichen", 6), tok("kontrastieren", 6), tok("gegenueberstellen", 6), tok("unterschied", 5),
        tok("gemeinsamkeit", 4), tok("tragfaehig", 5), tok("operator", 4), tok("analytisch", 4), tok("heuristisch", 4),
        tok("darstellung", 4), tok("genauer", 4)
      ],
      mathSpecificMarkers: [
        p("rechnerisch grafisch", 5), p("term graph", 4), p("tabelle gleichung", 4),
        p("modell rechnung", 4), p("operator beurteilen", 5), p("operator vergleichen", 5)
      ],
      contextBoosts: { phase: { "Sicherung": 3, "Unterrichtsgespräch": 2, "Gruppendiskussion": 2 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("nur sichtbar gemacht", -2), p("ohne fachlichen vergleich", -3)],
      typicalLAAErrors: ["Mehrere Lösungen werden gezeigt, aber fachlich nicht gegeneinander ausgewertet."],
      impulseQuestions: ["Welche Unterschiede zwischen Lösungswegen hätten fachlich produktiv gemacht werden können?"]
    }),

    mk({
      id: "1.3.3",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS werden angeregt, eigene Lösungsansätze zu entwickeln.",
      shortLabel: "eigene Ansätze entwickeln",
      manualCore: "SuS erhalten realistischen Denkspielraum für eigene Ansätze, ohne durch ungerahmtes 'Macht mal' überfordert zu werden.",
      likelyPhases: ["Erarbeitung", "Arbeitsphase", "Gruppendiskussion"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [
        p("eigener loesungsansatz", 7), p("eigene strategie entwickeln", 7), p("denkspielraum", 6),
        p("tragfaehiger rahmen", 5), p("idee fachlich weiterentwickelt", 6), p("verschiedene ansaetze zugelassen", 6)
      ],
      developmentMarkers: [
        p("macht mal selbst", 6), p("ueberforderung durch offenheit", 7), p("verfahren komplett vorgemacht", 6),
        p("keine eigenen ansaetze moeglich", 6), p("schueleridee wird umgelenkt", 5), p("unlogische entwicklungsaufgabe", 6)
      ],
      teacherPhrases: [
        p("findet einen eigenen weg", 5, "positive"), p("welche strategie koennte helfen", 6, "positive"),
        p("deine idee ist gut da fehlt noch", 7, "positive"), p("wir schauen wie wir das erreichen", 5, "positive")
      ],
      studentPhrases: [
        p("ich habe es anders versucht", 6, "positive"), p("unser ansatz", 5, "positive"), p("kann man auch", 4, "positive"),
        p("ich weiss nicht wie anfangen", 5, "development")
      ],
      singleWordTokens: [
        tok("ansatz", 5), tok("strategie", 5), tok("ausprobieren", 4), tok("eigener", 4), tok("offen", 3),
        tok("ueberforderung", 5), tok("entwickeln", 4), tok("problemloesen", 5)
      ],
      mathSpecificMarkers: [
        p("loesungsstrategie waehlen", 6), p("skizze selbst erstellen", 4), p("modell entwickeln", 5),
        p("term selbst aufstellen", 5), p("heuristisches vorgehen", 5)
      ],
      contextBoosts: { phase: { "Arbeitsphase": 2.5, "Erarbeitung": 2, "Gruppendiskussion": 1.5 }, socialForm: { "Gruppenarbeit": 1.5, "Partnerarbeit": 1.5, "Einzelarbeit": 1 } },
      counterIndicators: [p("neue technik braucht kleinschrittigkeit", -3), p("starkes scaffolding sinnvoll", -3)],
      typicalLAAErrors: ["Offenheit wird mit Überforderung verwechselt oder eigene Schüleransätze werden an der Zielidee der LK vorbeigelenkt."],
      impulseQuestions: ["Welcher eigene Ansatz war für SuS realistisch entwickelbar und fachlich tragfähig?"]
    }),

    mk({
      id: "1.3.4",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS werden zu Selbsterklärungen und Begründungen angeregt.",
      shortLabel: "selbst erklären lassen",
      manualCore: "SuS erklären und begründen selbst; die LK fordert Präsentation und Begründung ein, ohne den fachlichen Satz vorschnell zu übernehmen.",
      likelyPhases: ["Unterrichtsgespräch", "Sicherung", "Erarbeitung"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [
        p("sus erklaeren selbst", 7), p("selbsterklaerung", 7), p("begruendung eingefordert", 6),
        p("vollstaendige erklaerung eingefordert", 6), p("praesentation eingefordert", 5), p("denkraum offen gehalten", 5)
      ],
      developmentMarkers: [
        p("schueler sagt ein wort lehrer den rest", 8), p("lehrkraft erklaert schuelerloesung selbst", 7),
        p("nur ergebnis genannt", 6), p("praesentation nicht eingefordert", 5), p("lehrer ergaenzt vorschnell", 7),
        p("schueler sagt ein wort lehrer ergaenzt den ganzen rest", 9), p("lehrer ergaenzt den ganzen rest", 8),
        p("ein wort lehrer ergaenzt", 8)
      ],
      teacherPhrases: [
        p("erklaer deinen weg", 7, "positive"), p("sag das bitte vollstaendig", 7, "positive"),
        p("begründe das", 7, "positive"), p("stell deinen loesungsweg vor", 6, "positive"),
        p("wie bist du auf diesen weg gekommen", 7, "positive")
      ],
      studentPhrases: [
        p("ich habe zuerst", 5, "positive"), p("dann habe ich", 4, "positive"), p("weil", 3, "positive"),
        p("daran sieht man", 5, "positive"), p("mein weg war", 5, "positive")
      ],
      singleWordTokens: [tok("selbsterklaerung", 7), tok("erklaeren", 5), tok("begruenden", 6), tok("praesentieren", 5), tok("loesungsweg", 5), tok("vollstaendig", 4), tok("herleitung", 4), tok("ergaenzt", 5), tok("rest", 4)],
      mathSpecificMarkers: [p("rechenweg erklaeren", 5), p("herleitung", 5), p("begruendungskette", 6), p("argumentation", 5), p("beweisidee", 4)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2.5, "Sicherung": 2.5, "Erarbeitung": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("sprachlich stuetzen", -2), p("fachsprachlich praezisieren", -2)],
      typicalLAAErrors: ["Die LK übernimmt die Erklärung, sobald SuS nur ein Stichwort liefern."],
      impulseQuestions: ["Wo konnten SuS ihren Lösungsweg selbst erklären und begründen?"]
    }),

    mk({
      id: "1.3.5",
      dimension: "Kognitive Aktivierung",
      exactText: "Die Aufgaben oder Fragen gehen über reine Reproduktion hinaus.",
      shortLabel: "über Reproduktion hinaus",
      manualCore: "Aufgaben und Fragen verlangen passend zur Stunde mehr als AFB I: Anwendung, Begründung, Transfer, Vergleich, Beurteilung oder Problemlösen.",
      likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Sicherung"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
      positiveMarkers: [
        p("ueber reine reproduktion hinaus", 8), p("afb ii", 6), p("afb iii", 6), p("anwenden und begruenden", 6),
        p("vergleichen und beurteilen", 6), p("transferaufgabe", 6), p("problemloeseaufgabe", 6)
      ],
      developmentMarkers: [
        p("nur afb i", 7), p("nur einsetzen", 6), p("nur wiederholen", 6), p("nur schema anwenden", 6),
        p("nur abschreiben", 5), p("keine fachliche anforderung ueber reproduktion", 7)
      ],
      teacherPhrases: [
        p("beurteilt", 5, "positive"), p("untersucht", 5, "positive"), p("vergleicht", 5, "positive"),
        p("begruendet", 5, "positive"), p("uebertragt", 5, "positive")
      ],
      studentPhrases: [
        p("muessen wir nur einsetzen", 5, "development"), p("ist das wie eben", 4, "development"),
        p("warum gilt das", 4, "positive")
      ],
      singleWordTokens: [tok("reproduktion", 7), tok("anwenden", 5), tok("uebertragen", 5), tok("beurteilen", 5), tok("untersuchen", 5), tok("modellieren", 5), tok("afb", 5, false), tok("operator", 4)],
      mathSpecificMarkers: [p("modellieren", 5), p("argumentieren", 5), p("problemlösen", 5), p("darstellungswechsel", 5), p("operator begruenden", 5), p("operator beurteilen", 5)],
      contextBoosts: { phase: { "Erarbeitung": 2, "Arbeitsphase": 2, "Sicherung": 1.5 }, socialForm: { "Einzelarbeit": 1, "Partnerarbeit": 1, "Gruppenarbeit": 1 } },
      counterIndicators: [p("einstieg afb i sinnvoll", -3), p("sicherung afb i sinnvoll", -2)],
      typicalLAAErrors: ["Die Stunde bleibt auf AFB I, obwohl Lernziel und Lerngruppe mehr fachliche Verarbeitung tragen könnten."],
      impulseQuestions: ["Welche Anforderung ging über Reproduktion hinaus und passte zur Stunde?"]
    }),

    mk({
      id: "1.3.6",
      dimension: "Kognitive Aktivierung",
      exactText: "Die LK greift Widersprüche, unterschiedliche Sichtweisen oder unerwartete Antworten fachlich auf.",
      shortLabel: "Irritation produktiv nutzen",
      manualCore: "Fachlich relevante Fehler, Widersprüche oder unerwartete Antworten werden als Lernanlass genutzt; Randfehler werden nicht künstlich groß gemacht.",
      likelyPhases: ["Unterrichtsgespräch", "Sicherung", "Erarbeitung"],
      likelySocialForms: ["Plenum", "Gruppendiskussion"],
      positiveMarkers: [
        p("zentraler fehler wird aufgegriffen", 7), p("fehler wird aufgeschrieben", 6), p("widerspruch wird geprueft", 7),
        p("unerwartete antwort fachlich genutzt", 7), p("gegenbeispiel genutzt", 6), p("fehler als lernanlass", 7)
      ],
      developmentMarkers: [
        p("zentraler fehler wird uebergangen", 8), p("falsche antwort nur ersetzt", 6), p("widerspruch wird abgewuergt", 7),
        p("irritation nicht genutzt", 6), p("unerwartete antwort ignoriert", 6)
      ],
      teacherPhrases: [
        p("das schreiben wir mal auf", 6, "positive"), p("warum passt das nicht", 6, "positive"),
        p("was lernen wir aus diesem fehler", 7, "positive"), p("das ist fachlich interessant", 5, "positive")
      ],
      studentPhrases: [
        p("aber bei mir kommt", 5, "positive"), p("das widerspricht", 6, "positive"), p("das kann nicht stimmen", 5, "positive"),
        p("warum ist das falsch", 5, "positive")
      ],
      singleWordTokens: [tok("fehler", 5), tok("widerspruch", 6), tok("unerwartet", 5), tok("irritation", 5), tok("gegenbeispiel", 6), tok("fehlvorstellung", 6), tok("aufgreifen", 5)],
      mathSpecificMarkers: [p("falsche verallgemeinerung", 7), p("gegenbeispiel", 6), p("definitionsgrenze", 5), p("nicht aequivalente umformung", 6), p("vorzeichenfehler mit konzeptbezug", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2.5, "Sicherung": 2, "Erarbeitung": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("randfehler", -3), p("fluechtigkeitsfehler", -3), p("vom stundenziel weg", -3)],
      typicalLAAErrors: ["Fachlich zentrale Fehler werden korrigiert, aber nicht lernwirksam geklärt."],
      impulseQuestions: ["Welcher Fehler oder Widerspruch hätte fachlich geklärt werden sollen?"]
    }),

    mk({
      id: "1.3.7",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS werden angeregt, Zusammenhänge herzustellen oder ihr Wissen auf neue Situationen zu übertragen.",
      shortLabel: "vernetzen und übertragen",
      manualCore: "SuS stellen Zusammenhänge her oder übertragen Wissen auf neue Situationen. AFB-II-/Transferimpulse können fehlen, aber auch zu früh kommen.",
      likelyPhases: ["Sicherung", "Erarbeitung", "Unterrichtsgespräch"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [
        p("zusammenhaenge herstellen", 7), p("wissen uebertragen", 7), p("transferfrage", 6), p("neue situation", 6),
        p("bezug zu vorwissen", 5), p("regel auf neuen fall anwenden", 6)
      ],
      developmentMarkers: [
        p("kein transfer", 6), p("afb ii fehlt", 6), p("transfer zu frueh", 6), p("zusammenhang bleibt implizit", 6),
        p("sicherung bleibt beim einzelfall", 6), p("wissen bleibt isoliert", 6)
      ],
      teacherPhrases: [
        p("gilt das auch fuer", 6, "positive"), p("wo begegnet uns das noch", 6, "positive"),
        p("was folgt daraus", 5, "positive"), p("uebertragt das auf", 6, "positive")
      ],
      studentPhrases: [
        p("das ist wie bei", 5, "positive"), p("dann muesste auch", 5, "positive"),
        p("kann man das uebertragen", 6, "positive"), p("das hatten wir schon", 4, "positive")
      ],
      singleWordTokens: [tok("zusammenhang", 5), tok("uebertragen", 6), tok("transfer", 6), tok("vernetzen", 5), tok("vorwissen", 5), tok("neue situation", 5), tok("afb", 4, false)],
      mathSpecificMarkers: [p("darstellungswechsel", 5), p("sachkontext wechseln", 5), p("parameter veraendern", 5), p("modell uebertragen", 5), p("vom beispiel zur regel", 5)],
      contextBoosts: { phase: { "Sicherung": 3, "Erarbeitung": 1.5, "Unterrichtsgespräch": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("basis noch nicht gelegt", -3), p("kurze sicherung ausreichend", -2)],
      typicalLAAErrors: ["Transfer fehlt ganz oder wird eingefordert, bevor die fachliche Basis stabil ist."],
      impulseQuestions: ["Welcher Zusammenhang oder Transfer war für diese Stunde tragfähig?"]
    }),

    mk({
      id: "1.4.1",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS sind erkennbar auf das Unterrichtsgeschehen fokussiert.",
      shortLabel: "fachlich fokussiert",
      manualCore: "Die fachliche Aufmerksamkeit der SuS ist sichtbar; Fokusverlust wird sensibel wahrgenommen, ohne vorschnell zu pathologisieren.",
      likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [
        p("sus arbeiten an der aufgabe", 6), p("blick auf material", 4), p("fachlich fokussiert", 7),
        p("folgen den beitraegen", 5), p("vorsichtig angesprochen", 5), p("geschaut wo es hakt", 5),
        p("arbeitet fachlich weiter", 7), p("fachlich weiter", 5)
      ],
      developmentMarkers: [
        p("viele sus off task", 7), p("fokusverlust", 6), p("anschluss verloren", 6), p("unaufmerksam", 5),
        p("abdriften", 5), p("dauerhaft abgelenkt", 6), p("darf ich auf toilette zentrale phase", 5),
        p("verschiedene zielrichtungen", 6), p("verschiedenen zielrichtungen", 7)
      ],
      teacherPhrases: [p("wo hakt es gerade", 5, "positive"), p("bist du noch bei der aufgabe", 4, "positive"), p("komm zur aufgabe zurueck", 4, "development")],
      studentPhrases: [p("was machen wir gerade", 5, "development"), p("wo sind wir", 5, "development"), p("ich habe nicht zugehoert", 5, "development"), p("darf ich auf toilette", 3, "development")],
      singleWordTokens: [tok("fokussiert", 6), tok("aufmerksam", 4), tok("offtask", 6), tok("abgelenkt", 5), tok("leerlauf", 4), tok("unaufmerksam", 5), tok("adhs", 2, false), tok("anschluss", 4)],
      mathSpecificMarkers: [p("arbeit an skizze", 4), p("bearbeitung am term", 4), p("fachlicher austausch", 4), p("blick auf rechenweg", 4)],
      contextBoosts: { phase: { "Arbeitsphase": 2, "Unterrichtsgespräch": 1.5, "Sicherung": 1.5 }, socialForm: { "Gruppenarbeit": 1.5, "Einzelarbeit": 1 } },
      counterIndicators: [p("stilles nachdenken", -3), p("kurze ablenkung", -2), p("regulationsbedarf", -1)],
      typicalLAAErrors: ["Fokusverlust wird nur als Disziplinproblem gelesen, nicht als möglicher Hinweis auf Überforderung, Unklarheit oder Regulationsbedarf."],
      impulseQuestions: ["Woran war fachlicher Fokus sichtbar, und wo hätte Anschluss sensibel stabilisiert werden können?"]
    }),

    mk({
      id: "1.4.2",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS beteiligen sich fachlich am Unterricht.",
      shortLabel: "fachliche Beteiligung",
      manualCore: "SuS beteiligen sich inhaltlich an Aufgabe, Problem oder Gespräch; reine Organisation oder Ein-Wort-Routinen zählen nur schwach.",
      likelyPhases: ["Unterrichtsgespräch", "Erarbeitung", "Sicherung", "Arbeitsphase"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("fachliche beitraege", 6), p("mehrere sus beteiligen sich", 6), p("inhaltlicher beitrag", 6), p("aufgabe fachlich bearbeitet", 5)],
      developmentMarkers: [p("nur lehrer spricht", 7), p("einwort antworten", 7), p("einwortantworten", 8), p("nur einwortantworten", 8), p("laesst das gelten", 6), p("nur chorisch", 5), p("organisatorische fragen dominieren", 5), p("beteiligung bleibt minimal", 6), p("darf ich auf toilette in konsolidierung", 5)],
      teacherPhrases: [p("was denkst du fachlich", 4, "positive"), p("wer kann dazu etwas sagen", 4, "positive")],
      studentPhrases: [p("das ergebnis ist", 4, "positive"), p("ich denke", 4, "positive"), p("darf ich auf toilette", 3, "development"), p("nur ja", 3, "development")],
      singleWordTokens: [tok("beteiligung", 6), tok("fachlich", 4), tok("einwort", 6), tok("einwortantworten", 8), tok("chorisch", 4), tok("meldung", 3), tok("toilette", 3), tok("konsolidierung", 4)],
      mathSpecificMarkers: [p("rechenweg nennen", 4), p("mathematischen begriff nutzen", 5), p("vermutung aeussern", 4), p("loesungsansatz formulieren", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2, "Sicherung": 2, "Arbeitsphase": 1.5 }, socialForm: { "Plenum": 1.5, "Gruppenarbeit": 1 } },
      counterIndicators: [p("kurze antwort passend", -2), p("organisatorische klaerung notwendig", -2)],
      typicalLAAErrors: ["Minimale Ein-Wort-Beteiligung wird als tragfähige fachliche Beteiligung gelesen."],
      impulseQuestions: ["Welche SuS beteiligten sich fachlich, und wo blieb Beteiligung auf Minimalantworten begrenzt?"]
    }),

    mk({
      id: "1.4.3",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS beteiligen sich mit längeren fachlichen Beiträgen am Unterricht.",
      shortLabel: "längere fachliche Beiträge",
      manualCore: "SuS formulieren zusammenhängende fachliche Gedanken, Erklärungen oder Begründungen.",
      likelyPhases: ["Unterrichtsgespräch", "Sicherung", "Gruppendiskussion"],
      likelySocialForms: ["Plenum", "Gruppenarbeit", "Partnerarbeit"],
      positiveMarkers: [p("laengerer fachlicher beitrag", 7), p("mehrere saetze", 6), p("zusammenhaengend erklaert", 7), p("gedankengang dargestellt", 6), p("loesungsweg dargestellt", 6)],
      developmentMarkers: [p("nur ein wort", 6), p("lehrer beendet beitrag", 6), p("kein laengerer beitrag ermoeglicht", 6), p("nur ergebnisnennung", 5), p("traut sich nicht mehr zu praesentieren", 7), p("traut sich danach nicht mehr zu praesentieren", 8)],
      teacherPhrases: [p("fuehre das aus", 5, "positive"), p("erklaer deinen gedankengang", 6, "positive"), p("sag es in ganzen saetzen", 5, "positive")],
      studentPhrases: [p("zuerst habe ich", 5, "positive"), p("dann habe ich", 4, "positive"), p("das haengt damit zusammen", 6, "positive"), p("ich wuerde erst", 4, "positive"), p("weil", 3, "positive")],
      singleWordTokens: [tok("laengerer", 5), tok("gedankengang", 6), tok("zusammenhaengend", 6), tok("ausfuehren", 5), tok("loesungsweg", 5), tok("mehrere", 3)],
      mathSpecificMarkers: [p("vollstaendiger rechenweg", 6), p("argumentationskette", 6), p("beschreibung eines graphen", 5), p("modellierungsschritte", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2.5, "Sicherung": 2.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("kurze beitraege passend", -2)],
      typicalLAAErrors: ["Die LK nimmt kurze Stichworte auf und formuliert den fachlichen Beitrag selbst aus."],
      impulseQuestions: ["Wo konnten SuS längere fachliche Gedanken selbst ausführen?"]
    }),

    mk({
      id: "1.4.4",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS stellen Fragen oder erläutern eigene Verständnisse und Schwierigkeiten.",
      shortLabel: "Verständnis sichtbar machen",
      manualCore: "SuS artikulieren Fragen, Verständnisse oder Schwierigkeiten; wenn sie das nicht tun, wird sichtbar, ob die LK es bemerkt und erkundet.",
      likelyPhases: ["Arbeitsphase", "Unterrichtsgespräch", "Erarbeitung", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("sus stellen fachliche fragen", 7), p("verstaendnisproblem benannt", 6), p("eigene deutung erlaeutert", 6), p("wo sie haengen wird sichtbar", 6), p("lehrkraft geht hin und schaut", 5)],
      developmentMarkers: [p("sichtbare unsicherheit nicht erkundet", 7), p("keine fragen trotz stocken", 6), p("schwierigkeiten bleiben privat", 6), p("laufen lassen bis unendlich", 7), p("suS bleiben allein", 6)],
      teacherPhrases: [p("wo haengt ihr", 5, "positive"), p("welche frage habt ihr", 5, "positive"), p("zeig mir wo es hakt", 5, "positive")],
      studentPhrases: [p("ich verstehe nicht", 6, "positive"), p("warum ist das so", 5, "positive"), p("ich komme hier nicht weiter", 6, "positive"), p("was bedeutet", 4, "positive")],
      singleWordTokens: [tok("frage", 4), tok("verstehen", 4), tok("unklar", 5), tok("schwierigkeit", 5), tok("hakt", 5), tok("stocken", 5), tok("unsicherheit", 5)],
      mathSpecificMarkers: [p("frage zu begriff", 4), p("frage zu rechenweg", 4), p("frage zu darstellung", 4), p("operator unklar", 5), p("fehlvorstellung ausgesprochen", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 2, "Unterrichtsgespräch": 1.5, "Erarbeitung": 1.5 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("keine fragen heisst nicht verstanden", -2)],
      typicalLAAErrors: ["Die LK erkennt nicht, dass SuS Schwierigkeiten nicht artikulieren, obwohl sie sichtbar hängen."],
      impulseQuestions: ["Wo wurden Verständnisse oder Schwierigkeiten der SuS sichtbar?"]
    }),

    mk({
      id: "1.4.5",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS arbeiten auch bei anspruchsvolleren Aufgaben fachlich weiter.",
      shortLabel: "fachlich dranbleiben",
      manualCore: "SuS bleiben bei Anspruch fachlich aktiv; wenn sie abbrechen, wird geprüft, ob Aufgabe, Auftrag, Unterstützung oder Fokus problematisch sind.",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Gruppendiskussion"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("fachlich weitergearbeitet", 7), p("bei schwieriger aufgabe dran geblieben", 7), p("loesungsansatz diskutiert", 6), p("loesung ueberarbeitet", 5), p("fachliche rueckfrage statt abbruch", 6)],
      developmentMarkers: [p("schneller abbruch", 6), p("warten passiv", 5), p("anspruch fuehrt zu leerlauf", 7), p("laufen lassen bis unendlich", 7), p("haengen ohne weiterarbeit", 6)],
      teacherPhrases: [p("wo haengt ihr gerade", 5, "positive"), p("welche strategie habt ihr", 5, "positive"), p("probiert den naechsten schritt", 4, "positive")],
      studentPhrases: [p("ich probiere es nochmal", 5, "positive"), p("wir haengen hier", 5, "development"), p("das ist zu schwer", 5, "development"), p("keine ahnung", 4, "development")],
      singleWordTokens: [tok("dranbleiben", 6), tok("weiterarbeiten", 6), tok("anspruchsvoll", 5), tok("probieren", 4), tok("abbrechen", 5), tok("rueckzug", 5), tok("ueberfordert", 5), tok("leerlauf", 4)],
      mathSpecificMarkers: [p("problemaufgabe", 5), p("transferaufgabe", 5), p("begruendungsaufgabe", 5), p("modellierungsaufgabe", 5), p("strategie suchen", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2 }, socialForm: { "Gruppenarbeit": 1.5, "Einzelarbeit": 1.5 } },
      counterIndicators: [p("denkpause", -3), p("leise bearbeitung", -2)],
      typicalLAAErrors: ["Anspruchsvolle Aufgaben werden laufen gelassen, obwohl SuS fachlich aussteigen."],
      impulseQuestions: ["Wo blieb fachliches Dranbleiben sichtbar, und wo brauchte es Stabilisierung?"]
    }),

    mk({
      id: "1.4.6",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS nehmen fachliche Impulse der LK oder anderer SuS auf.",
      shortLabel: "fachliche Impulse aufnehmen",
      manualCore: "SuS greifen fachliche Impulse auf; das ist anspruchsvoll und muss oft durch Moderation ermöglicht werden.",
      likelyPhases: ["Unterrichtsgespräch", "Sicherung", "Gruppendiskussion", "Arbeitsphase"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("impuls aufgegriffen", 7), p("hinweis aufgegriffen", 7), p("bezug auf vorredner", 6), p("loesung nach hinweis veraendert", 6), p("loesungsweg nach hinweis geaendert", 7), p("anschlusskommunikation", 6), p("moderation steuert anschluss", 6)],
      developmentMarkers: [p("impuls verpufft", 7), p("keine anschlusskommunikation", 6), p("gute schueleridee verpufft", 6), p("beitrag bleibt ohne rueckbindung", 6), p("sus reagieren nur auf lehrkraft", 5)],
      teacherPhrases: [p("bezieh dich auf", 5, "positive"), p("was nimmst du von", 5, "positive"), p("greift die idee auf", 6, "positive")],
      studentPhrases: [p("wie s1 gesagt hat", 6, "positive"), p("greift den hinweis auf", 7, "positive"), p("ich nehme das von", 6, "positive"), p("das hilft weil", 5, "positive"), p("ich aendere meinen weg", 5, "positive")],
      singleWordTokens: [tok("aufnehmen", 6), tok("aufgreifen", 6), tok("greift", 4), tok("hinweis", 4), tok("aendert", 4), tok("anschluss", 6), tok("rueckbindung", 5), tok("vorredner", 5), tok("impuls", 5), tok("verpufft", 6), tok("moderation", 4)],
      mathSpecificMarkers: [p("anderen loesungsweg aufnehmen", 6), p("fehlerhinweis verarbeiten", 5), p("fachbegriff uebernehmen", 4), p("begruendung ergaenzen", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2.5, "Sicherung": 2, "Gruppendiskussion": 2 }, socialForm: { "Plenum": 1.5, "Gruppenarbeit": 1 } },
      counterIndicators: [p("abschreiben", -3), p("nur wiederholt", -2)],
      typicalLAAErrors: ["Schülerideen bleiben isoliert, weil die Moderation keine fachlichen Anschlüsse herstellt."],
      impulseQuestions: ["Welche fachlichen Impulse wurden von SuS aufgegriffen und weiterverarbeitet?"]
    }),

    mk({
      id: "1.4.7",
      dimension: "Kognitive Aktivierung",
      exactText: "Die SuS bringen eigene fachliche Überlegungen in die Bearbeitung ein.",
      shortLabel: "eigene fachliche Überlegungen",
      manualCore: "SuS bringen eigene tragfähige Ideen ein; die LK erkennt auch alternative richtige Ideen, nicht nur die eigene Zielidee.",
      likelyPhases: ["Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch", "Gruppendiskussion"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
      positiveMarkers: [p("eigene fachliche ueberlegung", 7), p("eigene vermutung", 6), p("eigener ansatz", 6), p("gegenbeispiel eingebracht", 6), p("alternative richtige idee erkannt", 7)],
      developmentMarkers: [p("nur kopieren", 6), p("alternative richtige idee nicht erkannt", 8), p("lehrkraft verfolgt nur eigene idee", 7), p("schueleransatz vorschnell umgelenkt", 7), p("eigene idee wird uebergangen", 6), p("alternative richtige idee wird nicht weiter geprueft", 8)],
      teacherPhrases: [p("dein ansatz ist interessant", 5, "positive"), p("lass uns deine idee pruefen", 6, "positive"), p("das ist ein anderer tragfaehiger weg", 7, "positive")],
      studentPhrases: [p("ich vermute", 5, "positive"), p("ich wuerde", 4, "positive"), p("bei meinem weg", 6, "positive"), p("kann man nicht auch", 5, "positive"), p("mein beispiel", 5, "positive"), p("ich nehme lieber", 4, "positive")],
      singleWordTokens: [tok("vermutung", 5), tok("gegenbeispiel", 6), tok("eigene idee", 6), tok("alternative", 5), tok("ueberlegung", 5), tok("uebergangen", 5), tok("umgelenkt", 5)],
      mathSpecificMarkers: [p("eigener term", 5), p("eigene skizze", 5), p("eigenes beispiel", 5), p("alternative darstellung", 5), p("strategieauswahl", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 2, "Erarbeitung": 2, "Unterrichtsgespräch": 1.5 }, socialForm: { "Gruppenarbeit": 1.5, "Partnerarbeit": 1.5 } },
      counterIndicators: [p("freies raten", -3), p("nicht anschlussfaehig", -3), p("passt nicht zum stundenziel", -3)],
      typicalLAAErrors: ["Die LK erkennt alternative, aber tragfähige Schülerideen nicht, weil sie stark auf die eigene Zielidee fokussiert ist."],
      impulseQuestions: ["Welche eigene fachliche Überlegung der SuS war anschlussfähig?"]
    }),

    mk({
      id: "2.1.1",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK gibt Rückmeldungen, die sich konkret auf Inhalt, Vorgehen oder Ergebnis beziehen.",
      shortLabel: "konkretes Feedback",
      manualCore: "Rückmeldungen beziehen sich konkret auf Inhalt, Vorgehen, Ergebnis oder Teilschritt und bleiben nicht bei pauschalem Lob/Korrektur.",
      likelyPhases: ["Arbeitsphase", "Feedback", "Sicherung", "Unterrichtsgespräch"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
      positiveMarkers: [p("konkrete rueckmeldung", 7), p("feedback zum inhalt", 6), p("feedback zum vorgehen", 6), p("feedback zum ergebnis", 6), p("teilschritt benannt", 5)],
      developmentMarkers: [p("nur gut", 5), p("nur richtig falsch", 6), p("allgemeines feedback", 6), p("unklar was genau", 6), p("nur verhaltensfeedback", 5)],
      teacherPhrases: [p("dein ansatz ist tragfaehig weil", 7, "positive"), p("hier stimmt der rechenschritt", 6, "positive"), p("an dieser stelle fehlt", 6, "positive"), p("der fehler liegt bei", 6, "positive")],
      studentPhrases: [p("was ist daran falsch", 5, "development"), p("was soll ich aendern", 5, "development"), p("warum stimmt das nicht", 5, "development")],
      singleWordTokens: [tok("feedback", 5), tok("rueckmeldung", 6), tok("konkret", 5), tok("vorgehen", 4), tok("ergebnis", 3), tok("teilschritt", 4), tok("fachlich", 3)],
      mathSpecificMarkers: [p("rueckmeldung zum rechenweg", 6), p("rueckmeldung zur darstellung", 5), p("rueckmeldung zur begruendung", 5), p("operator", 3)],
      contextBoosts: { phase: { "Feedback": 3, "Arbeitsphase": 2, "Sicherung": 1.5 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("reines lob", -2), p("kurze bestaetigung ausreichend", -2)],
      typicalLAAErrors: ["Feedback bleibt pauschal und zeigt nicht, woran SuS weiterarbeiten können."],
      impulseQuestions: ["Worauf bezog sich die Rückmeldung konkret?"]
    }),

    mk({
      id: "2.1.2",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK macht deutlich, was an einer Antwort oder Lösung fachlich tragfähig ist.",
      shortLabel: "Tragfähigkeit markieren",
      manualCore: "Tragfähige Teile von Antworten oder Lösungen werden sichtbar gemacht, auch wenn anderes noch fehlerhaft ist.",
      likelyPhases: ["Unterrichtsgespräch", "Feedback", "Arbeitsphase", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("tragfaehiger teil benannt", 7), p("bis hierhin stimmt", 6), p("darauf aufbauen", 6), p("teilidee erkannt", 6), p("richtiger ansatz bei falschem ergebnis", 7)],
      developmentMarkers: [p("alles falsch", 6), p("teilweise richtige antwort verworfen", 7), p("tragfaehiger gedanke nicht erkannt", 7), p("nur richtig falsch", 5)],
      teacherPhrases: [p("der ansatz ist richtig", 6, "positive"), p("dieser teil traegt", 7, "positive"), p("darauf koennen wir aufbauen", 6, "positive"), p("bis hierhin stimmt es", 6, "positive")],
      studentPhrases: [p("war alles falsch", 5, "development"), p("ist mein ansatz falsch", 5, "development"), p("der anfang stimmt doch", 5, "positive")],
      singleWordTokens: [tok("tragfaehig", 6), tok("teilidee", 5), tok("teilschritt", 4), tok("ansatz", 4), tok("brauchbar", 4), tok("aufbauen", 4)],
      mathSpecificMarkers: [p("richtiger ansatz falsches ergebnis", 7), p("korrekter zwischenschritt", 5), p("passende darstellung", 5), p("sinnvolle modellannahme", 5)],
      contextBoosts: { phase: { "Feedback": 3, "Unterrichtsgespräch": 2, "Arbeitsphase": 1.5 }, socialForm: { "Plenum": 1, "Einzelarbeit": 1 } },
      counterIndicators: [p("nicht schoenfaerben", -2), p("fachlich falsch", -2)],
      typicalLAAErrors: ["Fehler verdecken tragfähige Teilideen; SuS wissen nicht, worauf sie aufbauen können."],
      impulseQuestions: ["Was war an der Antwort oder Lösung fachlich tragfähig?"]
    }),

    mk({
      id: "2.1.3",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK gibt Hinweise, wie SuS ihre Antwort, Lösung oder Arbeitsweise weiterentwickeln können.",
      shortLabel: "Weiterarbeit ermöglichen",
      manualCore: "Rückmeldungen enthalten einen nutzbaren nächsten Schritt, ohne den Denkprozess unnötig abzunehmen.",
      likelyPhases: ["Feedback", "Arbeitsphase", "Sicherung"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
      positiveMarkers: [p("naechster schritt benannt", 7), p("hinweis zur weiterarbeit", 7), p("loesung ueberarbeiten", 6), p("handlungsorientiertes feedback", 6), p("fehler mit weiterarbeit verbunden", 6)],
      developmentMarkers: [p("keine naechste handlung", 6), p("nur nochmal machen", 5), p("feedback endet bei korrektur", 6), p("loesung vorweggenommen", 5), p("was soll ich jetzt machen", 5), p("feedback fehlt ausblick", 8), p("fehlt der ausblick", 8), p("ausblick fehlt", 8)],
      teacherPhrases: [p("ueberpruefe nochmal", 5, "positive"), p("ergaenze an dieser stelle", 6, "positive"), p("achte jetzt auf", 5, "positive"), p("der naechste schritt waere", 6, "positive")],
      studentPhrases: [p("was soll ich jetzt machen", 5, "development"), p("wie verbessere ich das", 5, "development"), p("was fehlt noch", 5, "development")],
      singleWordTokens: [tok("weiterentwickeln", 6), tok("weiterarbeit", 6), tok("naechster", 4), tok("ueberarbeiten", 5), tok("hinweis", 4), tok("verbessern", 4), tok("ergaenzen", 4), tok("ausblick", 5)],
      mathSpecificMarkers: [p("begruendung nachtragen", 5), p("einheiten pruefen", 5), p("operator beachten", 5), p("zwischenergebnis kontrollieren", 5)],
      contextBoosts: { phase: { "Feedback": 3, "Arbeitsphase": 2 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("vollstaendige loesung vorsagen", -3), p("zu viele hinweise", -2)],
      typicalLAAErrors: ["Feedback korrigiert, aber eröffnet keine fachlich klare Weiterarbeit."],
      impulseQuestions: ["Welcher nächste Schritt wurde durch die Rückmeldung möglich?"]
    }),

    mk({
      id: "2.1.4",
      dimension: "Konstruktive Unterstützung",
      exactText: "Rückmeldungen der LK unterstützen die Weiterarbeit der SuS im Lernprozess.",
      shortLabel: "Feedback wirkt weiter",
      manualCore: "Feedback ist nutzbar und führt sichtbar zu Weiterarbeit; scheinbares Verstehen wird nicht ungeprüft vorausgesetzt.",
      likelyPhases: ["Feedback", "Arbeitsphase", "Sicherung"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("feedback wird umgesetzt", 8), p("suS ueberarbeiten nach feedback", 7), p("rueckmeldung hilft weiter", 7), p("naechster schritt wird gezeigt", 6), p("verstaendnis des feedbacks geprueft", 6)],
      developmentMarkers: [p("feedback verpufft", 7), p("nickt aber setzt nicht um", 8), p("scheinbar verstanden", 6), p("keine umsetzung sichtbar", 7), p("arbeitet falsch weiter", 6), p("nach feedback verwirrt", 6), p("feedback ohne ausblick", 5), p("ausblick fehlt", 5)],
      teacherPhrases: [p("zeig mir was du jetzt aenderst", 7, "positive"), p("erklaer mir den naechsten schritt", 7, "positive"), p("nutze das jetzt fuer", 5, "positive"), p("hast du es verstanden", 2, "development")],
      studentPhrases: [p("okay", 2, "development"), p("ja hab ich", 4, "development"), p("jetzt weiss ich weiter", 5, "positive"), p("ich aendere das", 5, "positive"), p("was soll ich machen", 5, "development")],
      singleWordTokens: [tok("umsetzen", 6), tok("ueberarbeiten", 5), tok("verpufft", 6), tok("scheinbar", 4), tok("verstanden", 3), tok("nickt", 4), tok("weiterarbeit", 5)],
      mathSpecificMarkers: [p("rechenweg angepasst", 5), p("darstellung ueberarbeitet", 5), p("begruendung ergaenzt", 5), p("modell praezisiert", 5)],
      contextBoosts: { phase: { "Feedback": 3, "Arbeitsphase": 2 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("kleine korrektur reicht", -2), p("wirkung spaeter sichtbar", -2)],
      typicalLAAErrors: ["SuS bestätigen Feedback verbal, aber es wird nicht geprüft, ob es für Weiterarbeit tragfähig ist."],
      impulseQuestions: ["Woran wurde sichtbar, ob Feedback für die Weiterarbeit nutzbar war?"]
    }),

    mk({
      id: "2.1.5",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK nutzt Fehler oder unvollständige Antworten als Anlass für fachliche Klärung.",
      shortLabel: "Fehler fachlich klären",
      manualCore: "Fehler oder unvollständige Antworten werden als fachlicher Klärungsanlass genutzt, ohne SuS bloßzustellen.",
      likelyPhases: ["Feedback", "Unterrichtsgespräch", "Sicherung", "Arbeitsphase"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("fehler fachlich geklaert", 8), p("unvollstaendige antwort weiterbearbeitet", 7), p("fehler als lernanlass", 7), p("fehlvorstellung sichtbar gemacht", 6), p("klasse lernt aus fehler", 6)],
      developmentMarkers: [p("fehler nur korrigiert", 6), p("fehler uebergangen", 6), p("unvollstaendige antwort ersetzt", 6), p("falsche antwort peinlich markiert", 7), p("fachliche klaerung bleibt aus", 7)],
      teacherPhrases: [p("woher kommt dieser fehler", 6, "positive"), p("was zeigt uns das", 5, "positive"), p("lass uns das klaeren", 6, "positive"), p("welche idee steckt dahinter", 6, "positive")],
      studentPhrases: [p("ich hab da einen fehler", 5, "positive"), p("warum ist das falsch", 5, "positive"), p("bei mir kommt etwas anderes", 5, "positive")],
      singleWordTokens: [tok("fehler", 5), tok("unvollstaendig", 6), tok("klaerung", 6), tok("lernanlass", 6), tok("denkfehler", 5), tok("fehlvorstellung", 6), tok("missverstaendnis", 5)],
      mathSpecificMarkers: [p("vorzeichenfehler", 4), p("falsche umformung", 5), p("falsche verallgemeinerung", 6), p("einheitenfehler", 4), p("fehlinterpretation graph", 5)],
      contextBoosts: { phase: { "Feedback": 3, "Sicherung": 2, "Unterrichtsgespräch": 2 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("fluechtigkeitsfehler", -3), p("nicht jeder fehler zentral", -2)],
      typicalLAAErrors: ["Fehler werden korrigiert, aber nicht als fachlicher Klärungsanlass genutzt."],
      impulseQuestions: ["Welche fachliche Klärung wurde durch Fehler oder unvollständige Antworten möglich?"]
    }),

    mk({
      id: "2.2.1",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK unterstützt SuS gezielt bei Verständnisproblemen.",
      shortLabel: "Verständnis gezielt unterstützen",
      manualCore: "Gezielte Unterstützung beginnt mit Diagnose: Wo hakt es genau, was ist verstanden, welcher Schritt ist unklar?",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Feedback"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("diagnose vor hilfe", 8), p("wo hakt es gefragt", 7), p("problemstelle geklaert", 7), p("gezielt unterstuetzt", 6), p("hilfe setzt am problem an", 6)],
      developmentMarkers: [p("hilfe ohne diagnose", 8), p("allgemein weiter erklaert", 6), p("loesung statt unterstuetzung", 6), p("problem bleibt unbearbeitet", 6), p("nicht erkannt wo es hakt", 7)],
      teacherPhrases: [p("wo genau hakt es", 7, "positive"), p("zeig mir die stelle", 6, "positive"), p("was hast du bis hierhin verstanden", 7, "positive"), p("welcher schritt ist unklar", 7, "positive")],
      studentPhrases: [p("ich verstehe das nicht", 6, "development"), p("ich weiss nicht weiter", 6, "development"), p("wie fange ich an", 5, "development")],
      singleWordTokens: [tok("diagnose", 7), tok("verstaendnisproblem", 6), tok("hakt", 5), tok("gezielt", 5), tok("unterstuetzen", 4), tok("klaeren", 4)],
      mathSpecificMarkers: [p("operator unklar", 5), p("begriff unklar", 5), p("darstellung unklar", 5), p("zwischenschritt unklar", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("vorsagen", -3)],
      typicalLAAErrors: ["Die LK erklärt sofort, ohne die konkrete Verständnishürde zu diagnostizieren."],
      impulseQuestions: ["Wie wurde das konkrete Verständnisproblem diagnostiziert?"]
    }),

    mk({
      id: "2.2.2",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK erklärt auf Rückfragen verständlich und nachvollziehbar.",
      shortLabel: "verständlich erklären",
      manualCore: "Erklärungen beantworten die Rückfrage, knüpfen an Vorwissen und Problemstelle an, werden variiert und bleiben anschaulich.",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Feedback", "Unterrichtsgespräch"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit", "Plenum"],
      positiveMarkers: [p("erklaerung knuepft an vorwissen an", 7), p("anschaulich erklaert", 6), p("andere erklaerung gewaehlt", 7), p("beispiel gewechselt", 6), p("problemstelle aufgegriffen", 7), p("darstellung gewechselt", 6)],
      developmentMarkers: [p("erklaerung ueberfordert", 7), p("nicht an vorwissen angeknuepft", 7), p("nicht anschaulich", 6), p("gleiche erklaerung wiederholt", 7), p("bezieht sich nicht auf problem", 7), p("keine variation", 7)],
      teacherPhrases: [p("ich erklaere es anders", 7, "positive"), p("schau auf dieses beispiel", 6, "positive"), p("wir nehmen eine andere darstellung", 7, "positive"), p("du kennst schon", 5, "positive")],
      studentPhrases: [p("kannst du das nochmal anders erklaeren", 7, "development"), p("ich verstehe den schritt nicht", 6, "development"), p("ach so jetzt", 4, "positive")],
      singleWordTokens: [tok("rueckfrage", 5), tok("verstaendlich", 6), tok("nachvollziehbar", 6), tok("anschaulich", 6), tok("vorwissen", 6), tok("variation", 6), tok("ueberfordert", 5)],
      mathSpecificMarkers: [p("beispielrechnung", 4), p("darstellung wechseln", 6), p("skizze nutzen", 5), p("fachsprache uebersetzen", 5), p("rechenregel begruenden", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 2, "Erarbeitung": 2, "Feedback": 2 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("fachlich falsch vereinfacht", -3), p("zu viel erklaerung", -2)],
      typicalLAAErrors: ["Bei Nichtverstehen wird dieselbe Erklärung wiederholt, statt Zugang, Darstellung oder Beispiel zu wechseln."],
      impulseQuestions: ["Wie wurde die Erklärung an Vorwissen und Problemstelle der SuS angepasst?"]
    }),

    mk({
      id: "2.2.3",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK berücksichtigt unterschiedliche Lernvoraussetzungen.",
      shortLabel: "Lernvoraussetzungen berücksichtigen",
      manualCore: "Unterschiedliche Lernstände und Zugänge werden wahrgenommen und ohne Etikettierung passend unterstützt.",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Feedback"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("unterschiedliche lernvoraussetzungen beruecksichtigt", 8), p("passende zugaenge", 6), p("gestufte hilfen", 6), p("erweiterung fuer schnelle", 4), p("ohne stigmatisierung", 5), p("hilfekarten passend eingesetzt", 6)],
      developmentMarkers: [p("alle gleiche hilfe trotz unterschiedlicher probleme", 7), p("ueberforderung nicht erkannt", 6), p("unterforderung nicht erkannt", 6), p("differenzierung wirkt zufaellig", 5), p("keine zweite erklaerung", 7), p("keine variation obwohl", 7)],
      teacherPhrases: [p("du kannst mit diesem hinweis starten", 5, "positive"), p("welche hilfe brauchst du", 5, "positive"), p("wenn ihr fertig seid prueft", 4, "positive")],
      studentPhrases: [p("das ist zu leicht", 4, "development"), p("das ist zu schwer", 5, "development"), p("wir sind schon fertig", 4, "development"), p("brauchen wir einen tipp", 4, "positive")],
      singleWordTokens: [tok("lernvoraussetzungen", 7), tok("differenzierung", 5), tok("lernstand", 5), tok("hilfekarte", 5), tok("erweiterung", 4), tok("ueberforderung", 5), tok("unterforderung", 5)],
      mathSpecificMarkers: [p("gestufte hilfen", 6), p("operatorhilfen", 5), p("basisaufgabe", 4), p("vertiefungsaufgabe", 4), p("verschiedene darstellungen", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("gemeinsame aufgabe sinnvoll", -2), p("differenzierung nicht normativ", -2)],
      typicalLAAErrors: ["Unterschiedliche Lernstände werden sichtbar, aber nicht für passende Zugänge genutzt."],
      impulseQuestions: ["Welche unterschiedlichen Lernvoraussetzungen wurden sichtbar und wie wurden sie berücksichtigt?"]
    }),

    mk({
      id: "2.2.4",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK ermöglicht angemessene Denk- und Antwortzeiten.",
      shortLabel: "Denkzeit ermöglichen",
      manualCore: "Denk- und Antwortzeiten passen zur kognitiven Anforderung; Wartezeit wird nicht dogmatisch gezählt, aber anspruchsvolle Fragen brauchen Raum.",
      likelyPhases: ["Unterrichtsgespräch", "Erarbeitung", "Sicherung", "Feedback"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("denkzeit gegeben", 7), p("antwortzeit gegeben", 7), p("nach schuelerantwort gewartet", 6), p("think pair share", 5), p("zeit zum formulieren", 6)],
      developmentMarkers: [p("eigene frage sofort beantwortet", 8), p("kaum denkzeit", 7), p("schueler beginnt lehrer ergaenzt", 7), p("schnelle antwort dominiert", 5), p("komplexe frage ohne wartezeit", 7)],
      teacherPhrases: [p("denkt kurz nach", 5, "positive"), p("ich gebe euch eine minute", 5, "positive"), p("formuliere es in ruhe", 6, "positive"), p("ich warte noch", 5, "positive")],
      studentPhrases: [p("moment", 3, "positive"), p("ich ueberlege", 4, "positive"), p("kann ich kurz nachdenken", 5, "positive")],
      singleWordTokens: [tok("denkzeit", 7), tok("antwortzeit", 7), tok("warten", 4), tok("pause", 4), tok("sofort", 4), tok("vorschnell", 5), tok("selbstbeantwortung", 6)],
      mathSpecificMarkers: [p("zeit fuer begruendung", 6), p("zeit fuer rechenweg", 5), p("zeit fuer transfer", 5), p("stille denkphase", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2.5, "Sicherung": 2, "Erarbeitung": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("faktenfrage", -2), p("zu lange wartezeit ohne auftrag", -3)],
      typicalLAAErrors: ["Anspruchsvolle Fragen werden gestellt, aber sofort durch LK-Hilfen oder Selbstbeantwortung entlastet."],
      impulseQuestions: ["Wie passte die Denkzeit zur fachlichen Anforderung?"]
    }),

    mk({
      id: "2.2.5",
      dimension: "Konstruktive Unterstützung",
      exactText: "Hilfestellungen der LK orientieren sich am Lernstand der SuS.",
      shortLabel: "adaptive Hilfen",
      manualCore: "Hilfen setzen am Lernstand und Schülerweg an, sind wirksam und ökonomisch genug für den Unterrichtsfluss.",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Feedback"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("hilfe am lernstand", 8), p("anschluss an schuelerweg", 7), p("gestufter tipp", 6), p("naechster schritt statt loesung", 7), p("oekonomische hilfe", 5)],
      developmentMarkers: [p("hilfe passt nicht zum lernstand", 8), p("standardweg unabhaengig vom schueleransatz", 7), p("zu viel hilfe", 5), p("zu wenig hilfe", 5), p("hilfe zu aufwaendig fuer wirkung", 7), p("lange gebunden bei einer gruppe", 5)],
      teacherPhrases: [p("was hast du bisher", 6, "positive"), p("zeig mir deinen weg", 6, "positive"), p("der naechste schritt koennte sein", 6, "positive"), p("versuch zuerst", 4, "positive")],
      studentPhrases: [p("ich bin bis hier gekommen", 5, "positive"), p("was mache ich als naechstes", 5, "development"), p("das war zu viel hilfe", 6, "development")],
      singleWordTokens: [tok("hilfestellung", 6), tok("lernstand", 6), tok("adaptiv", 6), tok("tipp", 4), tok("gestuft", 5), tok("schuelerweg", 5), tok("aufwaendig", 5), tok("wirkung", 4)],
      mathSpecificMarkers: [p("anschluss an rechenweg", 6), p("anschluss an darstellung", 5), p("hilfekarte passend zum fehler", 6), p("zwischenergebnis pruefen", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2, "Feedback": 2 }, socialForm: { "Einzelarbeit": 1.5, "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("direkte erklaerung noetig", -2), p("anforderung nicht entfernen", -2)],
      typicalLAAErrors: ["Hilfen sind gut gemeint, aber nicht am konkreten Lernstand oder nicht ökonomisch im Unterrichtsfluss."],
      impulseQuestions: ["Wie passte die Hilfestellung zum aktuellen Lernstand und zur Wirkung?"]
    }),

    mk({
      id: "2.3.1",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK begegnet den SuS respektvoll und wertschätzend.",
      shortLabel: "respektvoll begegnen",
      manualCore: "Die LK wahrt die Würde der SuS auch bei Fehlern, Rückfragen, Störungen und Normkonflikten.",
      likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("respektvoll angesprochen", 7), p("wertschaetzender ton", 7), p("fehler nicht blossgestellt", 6), p("normkonflikt professionell bearbeitet", 7), p("normen fuer gespraech werden ruhig geklaert", 7), p("fehler sind hilfreich", 6), p("wuerde gewahrt", 7)],
      developmentMarkers: [p("abwertender ton", 7), p("ironisch blossstellend", 8), p("genervte reaktion", 5), p("vor klasse beschaemt", 8), p("respektlos auf rueckfrage", 7)],
      teacherPhrases: [p("danke fuer deinen gedanken", 5, "positive"), p("gut dass du fragst", 5, "positive"), p("wir bleiben bei der sache", 5, "positive"), p("wir lachen niemanden aus", 6, "positive")],
      studentPhrases: [p("das ist peinlich", 6, "development"), p("ich trau mich nicht", 6, "development"), p("war doch nur eine frage", 5, "development")],
      singleWordTokens: [tok("respektvoll", 7), tok("wertschaetzend", 7), tok("abwertend", 7), tok("blossstellen", 7), tok("ironisch", 5), tok("beschaemen", 7), tok("normkonflikt", 6)],
      mathSpecificMarkers: [p("fehlerkultur", 5), p("falscher ansatz nicht blossgestellt", 6), p("rueckfrage ernst genommen", 5)],
      contextBoosts: { phase: { "Feedback": 2, "Unterrichtsgespräch": 2, "Arbeitsphase": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("klare grenzsetzung", -2), p("humor ohne abwertung", -2)],
      typicalLAAErrors: ["Normkonflikte oder Fehler werden persönlich statt professionell-sachlich bearbeitet."],
      impulseQuestions: ["Wie wurde Wertschätzung auch in schwierigen Situationen gewahrt?"]
    }),

    mk({
      id: "2.3.2",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK begegnet den SuS fair und respektvoll.",
      shortLabel: "fair handeln",
      manualCore: "LK-Handeln wirkt nachvollziehbar, fair und respektvoll; unterschiedliche Unterstützung kann fair sein, wenn sie passend begründet ist.",
      likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Unterrichtsgespräch", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("fair behandelt", 7), p("regeln nachvollziehbar", 6), p("beteiligungschancen verteilt", 6), p("erwartungen transparent", 6), p("nicht willkuerlich", 5)],
      developmentMarkers: [p("willkuerlich", 7), p("bevorzugt", 6), p("benachteiligt", 6), p("ungleiche reaktion", 6), p("das ist unfair", 5)],
      teacherPhrases: [p("das gilt fuer alle", 5, "positive"), p("ich gebe anderen die chance", 5, "positive"), p("ich erklaere warum", 4, "positive")],
      studentPhrases: [p("warum immer ich", 6, "development"), p("der durfte das auch", 5, "development"), p("das ist unfair", 6, "development")],
      singleWordTokens: [tok("fair", 7), tok("gerecht", 6), tok("willkuerlich", 7), tok("bevorzugen", 5), tok("benachteiligen", 5), tok("transparent", 4)],
      mathSpecificMarkers: [p("nicht nur leistungsstarke sus", 5), p("loesungswege fair geprueft", 5), p("falsche antwort fair behandelt", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2, "Arbeitsphase": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("gezielte ansprache", -2), p("differenzierung ist nicht gleichbehandlung", -2)],
      typicalLAAErrors: ["LK-Reaktionen wirken für SuS nicht nachvollziehbar oder Beteiligungschancen verteilen sich ungleich."],
      impulseQuestions: ["Woran war Fairness und Nachvollziehbarkeit im Umgang sichtbar?"]
    }),

    mk({
      id: "2.3.3",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die LK greift Perspektiven und Beiträge der SuS auf.",
      shortLabel: "Perspektiven aufgreifen",
      manualCore: "Perspektiven und Beiträge der SuS werden ernst genommen; hier geht es um Beziehungsqualität, nicht primär um fachliche Nutzung.",
      likelyPhases: ["Unterrichtsgespräch", "Erarbeitung", "Sicherung", "Arbeitsphase"],
      likelySocialForms: ["Plenum", "Gruppenarbeit", "Partnerarbeit"],
      positiveMarkers: [p("perspektive ernst genommen", 7), p("beitrag respektvoll aufgegriffen", 7), p("schueleridee wertgeschaetzt", 6), p("rueckfrage aufgenommen", 5), p("alternative sichtweise zugelassen", 6), p("schuetzt schuelerbeitrag", 7), p("wertschaetzend um", 6)],
      developmentMarkers: [p("perspektive uebergangen", 7), p("beitrag ignoriert", 6), p("nur erwartete antwort", 6), p("alternative sichtweise abgebrochen", 7), p("formal quittiert aber nicht aufgenommen", 6)],
      teacherPhrases: [p("interessanter blick", 5, "positive"), p("daran koennen wir anknuepfen", 5, "positive"), p("du siehst das anders erklaer mal", 6, "positive"), p("wir nehmen deine frage auf", 5, "positive")],
      studentPhrases: [p("ich sehe das anders", 5, "positive"), p("ich meinte eigentlich", 5, "positive"), p("meine idee war", 5, "positive")],
      singleWordTokens: [tok("perspektive", 6), tok("beitrag", 4), tok("sichtweise", 5), tok("aufgreifen", 5), tok("ignorieren", 5), tok("uebergehen", 5)],
      mathSpecificMarkers: [p("alternative loesungsidee", 5), p("schuelerfrage zum sachkontext", 5), p("andere darstellung ernst genommen", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2.5, "Sicherung": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("irrelevante beitraege begrenzen", -2), p("nicht jede perspektive zentral", -2)],
      typicalLAAErrors: ["Schülerperspektiven werden formal gehört, aber nicht als bedeutsam für das Gespräch gewürdigt."],
      impulseQuestions: ["Wie wurden Perspektiven der SuS respektvoll aufgenommen?"]
    }),

    mk({
      id: "2.4.1",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die SuS hören einander zu und lassen sich ausreden.",
      shortLabel: "einander zuhören",
      manualCore: "SuS lassen Beiträge zu, hören einander fachlich zu und unterbrechen nicht destruktiv.",
      likelyPhases: ["Unterrichtsgespräch", "Gruppendiskussion", "Sicherung", "Partnerarbeit", "Gruppenarbeit"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("einander zugehoert", 7), p("ausreden lassen", 7), p("gespraechsregeln eingehalten", 6), p("reagieren auf beitraege anderer", 6)],
      developmentMarkers: [p("fallen einander ins wort", 7), p("unterbrechen", 6), p("reinrufen", 5), p("zwischenrufe stoeren", 6), p("hoeren nicht zu", 6)],
      teacherPhrases: [p("lasst ihn ausreden", 5, "development"), p("wir hoeren erst zu", 5, "positive")],
      studentPhrases: [p("lass mich ausreden", 6, "development"), p("ich war noch nicht fertig", 6, "development"), p("hoer doch zu", 5, "development")],
      singleWordTokens: [tok("zuhoeren", 6), tok("ausreden", 6), tok("unterbrechen", 6), tok("zwischenruf", 5), tok("reinrufen", 5), tok("gespraechsregel", 5)],
      mathSpecificMarkers: [p("loesungsweg angehoert", 5), p("begruendung nicht unterbrochen", 5), p("rueckfrage bezieht sich auf beitrag", 5)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2, "Gruppendiskussion": 2, "Sicherung": 1.5 }, socialForm: { "Plenum": 1.5, "Gruppenarbeit": 1 } },
      counterIndicators: [p("lebhafte diskussion", -2), p("kurze zwischenfrage fachlich sinnvoll", -2)],
      typicalLAAErrors: ["Gesprächsregeln werden formal erwartet, aber fachliches Zuhören wird nicht stabilisiert."],
      impulseQuestions: ["Wie trug gegenseitiges Zuhören zum fachlichen Gespräch bei?"]
    }),

    mk({
      id: "2.4.2",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die SuS unterstützen sich gegenseitig im Lernprozess.",
      shortLabel: "gegenseitig unterstützen",
      manualCore: "SuS unterstützen einander fachlich; Peer-Hilfe kann methodisch/organisatorisch bewusst durch die LK angelegt sein.",
      likelyPhases: ["Arbeitsphase", "Gruppendiskussion", "Erarbeitung"],
      likelySocialForms: ["Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("sus erklaeren einander", 7), p("gegenseitig unterstuetzt", 7), p("peer hilfe", 6), p("fertige sus helfen", 5), p("lernhelfer", 5), p("rollen foerdern zusammenarbeit", 5), p("partner erklaert ruhig", 7), p("naechsten schritt", 4)],
      developmentMarkers: [p("arbeiten isoliert nebeneinander", 6), p("hilfe verweigert", 6), p("ein schueler uebernimmt alles", 7), p("abschreibenlassen", 6), p("hilfesystem nicht geklaert", 6)],
      teacherPhrases: [p("geh rum und hilf", 5, "positive"), p("erklaere aber gib nicht nur die loesung", 7, "positive"), p("fragt zuerst euren partner", 5, "positive")],
      studentPhrases: [p("ich erklaere dir das", 6, "positive"), p("warte ich zeig dir den schritt", 5, "positive"), p("lass mich das machen", 5, "development")],
      singleWordTokens: [tok("helfen", 5), tok("unterstuetzen", 6), tok("peer", 5, false), tok("lernhelfer", 5), tok("abschreiben", 5), tok("dominieren", 5), tok("partnerhilfe", 5), tok("rollenkarte", 4)],
      mathSpecificMarkers: [p("peer erklaerung zum rechenweg", 6), p("gemeinsames pruefen", 5), p("gegenseitige strategieklärung", 5), p("tipp zur darstellung", 4)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Gruppendiskussion": 2 }, socialForm: { "Gruppenarbeit": 2, "Partnerarbeit": 2 } },
      counterIndicators: [p("abschreiben ist keine hilfe", -3), p("herumgehen nicht automatisch lernfoerderlich", -2)],
      typicalLAAErrors: ["Peer-Hilfe wird erwartet, aber nicht so gerahmt, dass sie lernwirksam statt lösungsweitergebend wird."],
      impulseQuestions: ["Wie wurde gegenseitige fachliche Unterstützung ermöglicht?"]
    }),

    mk({
      id: "2.4.3",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die SuS stellen einander bei Fehlern nicht bloß.",
      shortLabel: "Fehler nicht bloßstellen",
      manualCore: "Fehler anderer werden respektvoll behandelt; die LK schützt die Fehlerkultur, wenn Lachen oder Bloßstellung entsteht.",
      likelyPhases: ["Unterrichtsgespräch", "Sicherung", "Gruppendiskussion", "Arbeitsphase"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("fehler respektvoll behandelt", 7), p("lachen gestoppt", 7), p("fehler als lernanlass gerahmt", 6), p("schueler geschuetzt", 6), p("sachebene hergestellt", 6)],
      developmentMarkers: [p("fehler ausgelacht", 8), p("lachen bleibt unkommentiert", 8), p("abwertender kommentar", 7), p("schueler blossgestellt", 7), p("sagt lieber nichts mehr", 6)],
      teacherPhrases: [p("wir lachen niemanden aus", 7, "positive"), p("der fehler ist fachlich interessant", 6, "positive"), p("wir bleiben bei der sache", 5, "positive")],
      studentPhrases: [p("haha falsch", 7, "development"), p("das ist doch einfach", 5, "development"), p("peinlich", 6, "development"), p("ich sag lieber nichts", 6, "development")],
      singleWordTokens: [tok("ausgelacht", 8), tok("lachen", 5), tok("peinlich", 6), tok("blossstellen", 7), tok("abwertend", 6), tok("fehlerkultur", 5)],
      mathSpecificMarkers: [p("falscher rechenweg ausgelacht", 7), p("verstaendnisfrage abgewertet", 7), p("fehler in praesentation kommentiert", 6)],
      contextBoosts: { phase: { "Unterrichtsgespräch": 2, "Sicherung": 2, "Gruppendiskussion": 1.5 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("gemeinsames entlastendes lachen", -3), p("sachliche korrektur", -2)],
      typicalLAAErrors: ["Lachen über Fehler wird nicht als Lernklima-Signal erkannt oder nicht professionell gerahmt."],
      impulseQuestions: ["Wie wurde die Fehlerkultur in der Situation geschützt?"]
    }),

    mk({
      id: "2.4.4",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die SuS begegnen der LK respektvoll.",
      shortLabel: "Respekt gegenüber LK",
      manualCore: "SuS kommunizieren respektvoll mit der LK; in Phase 2 wird entwicklungsorientiert gefragt, warum es ggf. nicht gelingt.",
      likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("respektvoller ton gegenueber lehrkraft", 7), p("hinweise angemessen angenommen", 5), p("widerspruch respektvoll", 5), p("kommunikation bleibt sachlich", 6)],
      developmentMarkers: [p("respektloser kommentar", 7), p("demonstratives ignorieren", 6), p("provokation", 5), p("offene verweigerung", 6), p("abwertender ton gegenueber lk", 7)],
      teacherPhrases: [p("wir klaeren das sachlich", 5, "positive"), p("ich hoere deinen einwand", 5, "positive")],
      studentPhrases: [p("ist mir egal", 6, "development"), p("mach ich nicht", 6, "development"), p("sie haben keine ahnung", 8, "development")],
      singleWordTokens: [tok("respektlos", 7), tok("ignorieren", 5), tok("provozieren", 5), tok("verweigern", 6), tok("augenrollen", 4), tok("sachlich", 3)],
      mathSpecificMarkers: [p("fachlicher widerspruch sachlich", 5), p("rueckfrage zur aufgabe respektvoll", 4)],
      contextBoosts: { phase: { "Arbeitsphase": 1.5, "Unterrichtsgespräch": 1.5 }, socialForm: { "Plenum": 1.2 } },
      counterIndicators: [p("fachlicher widerspruch", -2), p("jugendlicher tonfall", -2)],
      typicalLAAErrors: ["Respektprobleme werden nur moralisch gelesen, statt Ursachen wie Auftrag, Überforderung, Beziehung oder Struktur mitzudenken."],
      impulseQuestions: ["Welche Bedingungen könnten respektvolle Kommunikation erschwert oder gestützt haben?"]
    }),

    mk({
      id: "2.4.5",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die SuS arbeiten in Partner- oder Gruppenphasen sachbezogen zusammen.",
      shortLabel: "sachbezogene Zusammenarbeit",
      manualCore: "PA/GA ist methodisch so angelegt, dass sachbezogene Zusammenarbeit möglich und notwendig wird; Gruppenarbeit ist mehr als Sitzordnung.",
      likelyPhases: ["Arbeitsphase", "Gruppendiskussion", "Erarbeitung"],
      likelySocialForms: ["Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("sachbezogene zusammenarbeit", 8), p("kooperationsbeduerftige aufgabe", 7), p("gemeinsames produkt", 6), p("austauschauftrag", 6), p("rollen foerdern fachlichen austausch", 6)],
      developmentMarkers: [p("gruppenarbeit nur sitzordnung", 8), p("gruppe redet ueber anderes", 6), p("keine kooperationsnotwendigkeit", 7), p("kein gemeinsames produkt", 5), p("arbeitsteilung ohne fachliche kommunikation", 6)],
      teacherPhrases: [p("einigt euch auf eine gemeinsame begruendung", 7, "positive"), p("vergleicht eure wege", 6, "positive"), p("jede person erklaert einen teil", 6, "positive")],
      studentPhrases: [p("lass uns vergleichen", 5, "positive"), p("ich mache alles", 6, "development"), p("keine ahnung was wir tun sollen", 6, "development")],
      singleWordTokens: [tok("gruppenarbeit", 4), tok("partnerarbeit", 4), tok("sachbezogen", 7), tok("kooperationsbeduerftig", 7), tok("sitzordnung", 6), tok("austauschauftrag", 6), tok("arbeitsteilung", 5)],
      mathSpecificMarkers: [p("gemeinsamer rechenweg", 5), p("vergleich von ergebnissen", 5), p("diskussion ueber darstellung", 5), p("gemeinsame begruendung", 6)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Gruppendiskussion": 2 }, socialForm: { "Gruppenarbeit": 2.5, "Partnerarbeit": 2.5 } },
      counterIndicators: [p("leise einzelarbeit intendiert", -2), p("einzeldenken in gruppe bewusst", -2)],
      typicalLAAErrors: ["PA/GA wird gewählt, ohne Aufgabe und Methode so anzulegen, dass fachliche Zusammenarbeit nötig wird."],
      impulseQuestions: ["Wie war die Zusammenarbeit methodisch so angelegt, dass sie fachlich wurde?"]
    }),

    mk({
      id: "2.4.6",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die SuS beziehen andere SuS in Partner- oder Gruppenphasen ein.",
      shortLabel: "andere einbeziehen",
      manualCore: "SuS werden in PA/GA einbezogen; Dominanz und Ausschluss werden sichtbar.",
      likelyPhases: ["Arbeitsphase", "Gruppendiskussion", "Erarbeitung"],
      likelySocialForms: ["Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("stille sus einbezogen", 7), p("gruppe fragt nach meinung", 6), p("beteiligung verteilt", 6), p("nicht monopolisiert", 5), p("andere erklaeren den stand", 5)],
      developmentMarkers: [p("schueler ausgeschlossen", 8), p("ein schueler dominiert", 7), p("stille sus aussen vor", 6), p("beitrag ignoriert", 5), p("arbeit monopolisiert", 6)],
      teacherPhrases: [p("achtet darauf alle einzubeziehen", 5, "positive"), p("jede person erklaert", 5, "positive")],
      studentPhrases: [p("was meinst du", 5, "positive"), p("mach du auch mal", 5, "positive"), p("ich darf nie", 6, "development"), p("du machst alles", 6, "development")],
      singleWordTokens: [tok("einbeziehen", 7), tok("ausschliessen", 7), tok("dominieren", 6), tok("still", 4), tok("monopolisiert", 6), tok("beteiligung", 4)],
      mathSpecificMarkers: [p("alle erklaeren teil des loesungswegs", 6), p("rollenverteilung", 4), p("einbezug bei praesentation", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Gruppendiskussion": 2 }, socialForm: { "Gruppenarbeit": 2.5, "Partnerarbeit": 2 } },
      counterIndicators: [p("rollenbedingt unterschiedlich", -2), p("stille phase kein ausschluss", -2)],
      typicalLAAErrors: ["Dominanz oder Ausschluss in Gruppen wird nicht als lernrelevantes Klima-Signal erkannt."],
      impulseQuestions: ["Wie wurden stille oder randständige SuS in die fachliche Arbeit einbezogen?"]
    }),

    mk({
      id: "2.4.7",
      dimension: "Konstruktive Unterstützung",
      exactText: "Die SuS gehen in Arbeitsphasen respektvoll mit Beiträgen oder Fragen anderer um.",
      shortLabel: "respektvoll mit Beiträgen umgehen",
      manualCore: "Beiträge und Fragen anderer werden in Arbeitsphasen respektvoll behandelt; fachliche Kritik bleibt sachlich.",
      likelyPhases: ["Arbeitsphase", "Gruppendiskussion", "Partnerarbeit"],
      likelySocialForms: ["Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("fragen anderer ernst genommen", 7), p("beitraege sachlich kommentiert", 6), p("unterstuetzend auf unsicherheit reagiert", 6), p("fachliche kritik wertschätzend", 6)],
      developmentMarkers: [p("fragen abgewertet", 7), p("beitraege verspottet", 7), p("genervt auf hilfebedarf", 6), p("kritik wird persoenlich", 6), p("unsicherheit sozial riskant", 7)],
      teacherPhrases: [p("bleibt bei der sache", 4, "positive"), p("formuliert eure kritik sachlich", 5, "positive")],
      studentPhrases: [p("das ist eine gute frage", 5, "positive"), p("ich erklaere es dir", 5, "positive"), p("stell dich nicht so an", 7, "development"), p("das weiss man doch", 6, "development")],
      singleWordTokens: [tok("frage", 3), tok("beitrag", 3), tok("respektvoll", 6), tok("genervt", 5), tok("verspotten", 7), tok("abwerten", 6), tok("unsicherheit", 5)],
      mathSpecificMarkers: [p("verstaendnisfrage in gruppe", 6), p("rueckfrage zum rechenweg", 5), p("alternative idee respektvoll geprueft", 6)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Gruppendiskussion": 2 }, socialForm: { "Gruppenarbeit": 2, "Partnerarbeit": 2 } },
      counterIndicators: [p("sachliche korrektur", -2), p("fachliche kritik", -2)],
      typicalLAAErrors: ["In Arbeitsphasen wird die soziale Qualität fachlicher Rückfragen in Gruppen zu wenig beachtet."],
      impulseQuestions: ["Wie wurde mit Fragen und Beiträgen anderer in Arbeitsphasen umgegangen?"]
    }),

    mk({
      id: "3.1.1",
      dimension: "Strukturierte Klassenführung",
      exactText: "Der Unterricht verläuft geordnet und störungsarm.",
      shortLabel: "störungsarmer Verlauf",
      manualCore: "Störungen werden als beobachtbare Lernbedingungen erfasst; Phase 2 fragt entwicklungsorientiert nach Ursachen und Stellschrauben.",
      likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Sicherung", "Übergang"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("stoerungsarm", 7), p("geordnet", 6), p("unterrichtsfluss bleibt erhalten", 6), p("fachliches arbeiten moeglich", 6), p("stoerungen bleiben kurz", 5)],
      developmentMarkers: [p("wiederholte stoerungen", 7), p("unterrichtsfluss bricht ab", 7), p("fachliche arbeit kommt nicht zustande", 8), p("viele off task", 6), p("stoerung dominiert", 7)],
      teacherPhrases: [p("zurueck zur aufgabe", 4, "positive"), p("wir brauchen ruhe fuer", 4, "positive"), p("stopp wir arbeiten weiter", 4, "positive")],
      studentPhrases: [p("ich mach nicht mit", 5, "development"), p("hoer auf", 4, "development"), p("sei leise", 4, "development")],
      singleWordTokens: [tok("stoerung", 7), tok("stoerungsarm", 7), tok("geordnet", 5), tok("unterbrechung", 5), tok("unruhig", 5), tok("chaos", 6), tok("offtask", 5)],
      mathSpecificMarkers: [p("rechenweg unterbrochen", 5), p("sicherung verliert fokus", 5), p("gruppenarbeit kippt", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 2, "Übergang": 2, "Sicherung": 1.5 }, socialForm: { "Gruppenarbeit": 1.5, "Plenum": 1 } },
      counterIndicators: [p("produktive lautstaerke", -3), p("fachliche diskussion lebhaft", -3), p("kurze unruhe im uebergang", -2)],
      typicalLAAErrors: ["Störungen werden als Schülerproblem gelesen, ohne Bedingungen wie Auftrag, Überforderung, Monitoring oder Zeitnutzung zu prüfen."],
      impulseQuestions: ["Welche Bedingungen haben den fachlichen Fokus gestützt oder gestört?"]
    }),

    mk({
      id: "3.1.2",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die Lautstärke ist der Unterrichtsphase angemessen.",
      shortLabel: "angemessene Lautstärke",
      manualCore: "Lautstärke wird relativ zur Phase und Sozialform beurteilt: Gruppenarbeit darf hörbar sein, Plenum muss Verständigung ermöglichen.",
      likelyPhases: ["Arbeitsphase", "Unterrichtsgespräch", "Gruppendiskussion", "Sicherung"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit", "Einzelarbeit"],
      positiveMarkers: [p("arbeitslautstaerke angemessen", 7), p("praesentation hoerbar", 6), p("ruhe fuer zuhoeren", 5), p("gruppenarbeit arbeitsfaehig", 6)],
      developmentMarkers: [p("lautstaerke verhindert arbeiten", 8), p("lautstaerke verhindert", 8), p("praesentation nicht hoerbar", 8), p("beitrag nicht hoerbar", 7), p("arbeitsphase kippt in laerm", 7), p("plenum unruhig", 6), p("wiederholt wegen lautstaerke unterbrochen", 6)],
      teacherPhrases: [p("arbeitslautstaerke", 6, "positive"), p("bitte leiser", 4, "development"), p("so kann niemand zuhoeren", 6, "development")],
      studentPhrases: [p("ich verstehe nichts", 6, "development"), p("zu laut", 5, "development"), p("was hat sie gesagt", 5, "development")],
      singleWordTokens: [tok("lautstaerke", 7), tok("laut", 5), tok("leise", 3), tok("arbeitsruhe", 6), tok("laerm", 6), tok("hoerbar", 5), tok("geraeuschpegel", 5)],
      mathSpecificMarkers: [p("loesungsweg nicht hoerbar", 6), p("praesentation geht unter", 6), p("mathematische diskussion akustisch unmoeglich", 7)],
      contextBoosts: { phase: { "Arbeitsphase": 2, "Unterrichtsgespräch": 2, "Sicherung": 2 }, socialForm: { "Gruppenarbeit": 1.5, "Plenum": 1.5 } },
      counterIndicators: [p("gruppenarbeit darf lauter sein", -3), p("kurze materialphase", -2)],
      typicalLAAErrors: ["Lautstärke wird absolut statt phasenbezogen eingeschätzt."],
      impulseQuestions: ["War die Lautstärke für diese Phase fachlich arbeitsfähig?"]
    }),

    mk({
      id: "3.1.3",
      dimension: "Strukturierte Klassenführung",
      exactText: "Vereinbarte Regeln und Abläufe werden eingehalten.",
      shortLabel: "Regeln und Abläufe tragen",
      manualCore: "Regeln, Routinen und Abläufe unterstützen Lernen; Unklarheit in Abläufen kann Störungen und Zeitverlust erzeugen.",
      likelyPhases: ["Einstieg", "Arbeitsphase", "Übergang", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("ablaeufe funktionieren", 7), p("regeln eingehalten", 7), p("routine traegt", 6), p("uebergang nach routine", 5), p("materialorganisation funktioniert", 5)],
      developmentMarkers: [p("regeln unklar", 6), p("ablaeufe unklar", 6), p("staendig neu erklaert", 6), p("uebergaenge dauern lange", 6), p("gespraechsregeln verletzt", 5)],
      teacherPhrases: [p("wie vereinbart", 5, "positive"), p("ihr kennt den ablauf", 5, "positive"), p("die gespraechsregel gilt", 5, "positive")],
      studentPhrases: [p("wo ist das material", 5, "development"), p("wer ist dran", 4, "development"), p("wie geht das nochmal", 5, "development")],
      singleWordTokens: [tok("regel", 5), tok("ablauf", 6), tok("routine", 5), tok("uebergang", 4), tok("materialdienst", 4), tok("organisation", 4), tok("vereinbart", 4)],
      mathSpecificMarkers: [p("praesentationsroutine fuer loesungswege", 5), p("partnerkontrolle nach ablauf", 5), p("sicherungsroutine", 5)],
      contextBoosts: { phase: { "Übergang": 3, "Arbeitsphase": 2, "Einstieg": 1.5 }, socialForm: { "Plenum": 1, "Gruppenarbeit": 1 } },
      counterIndicators: [p("neue methode braucht einfuehrungszeit", -3), p("regelklaerung sinnvoll", -2)],
      typicalLAAErrors: ["Abläufe werden vorausgesetzt, obwohl sie für SuS nicht handlungsleitend sind."],
      impulseQuestions: ["Welche Regeln oder Abläufe haben Lernzeit geschützt oder erschwert?"]
    }),

    mk({
      id: "3.2.1",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK nimmt Lern- und Arbeitsprozesse der SuS wahr.",
      shortLabel: "Lernprozesse wahrnehmen",
      manualCore: "Monitoring bedeutet Diagnose von Lern- und Arbeitsprozessen, nicht bloß Verhalten sehen.",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Gruppendiskussion"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("rundgang diagnostisch", 8), p("geht herum", 5), p("arbeitsstaende wahrgenommen", 7), p("hefte angeschaut", 5), p("muster in bearbeitungen erkannt", 7)],
      developmentMarkers: [p("setzt sich ans pult", 7), p("keine diagnose", 8), p("arbeitsprozesse unbeobachtet", 7), p("bleibt vorne trotz arbeitsphase", 6), p("lk schaut auf tafel", 7), p("gruppen warten lk schaut auf tafel", 8), p("falscher rechenweg laeuft weiter", 6)],
      teacherPhrases: [p("wo seid ihr gerade", 5, "positive"), p("zeigt mir euren stand", 6, "positive"), p("ich sehe hier hakt es", 6, "positive")],
      studentPhrases: [p("wir kommen nicht weiter", 5, "development"), p("sind wir richtig", 4, "development"), p("wir warten", 4, "development")],
      singleWordTokens: [tok("wahrnehmen", 6), tok("rundgang", 6), tok("diagnose", 7), tok("arbeitsstand", 6), tok("pult", 5), tok("hefte", 4), tok("schauen", 3)],
      mathSpecificMarkers: [p("rechenwege in heften", 6), p("zwischenergebnisse pruefen", 5), p("fehlvorstellungen erkennen", 6), p("gruppenloesungen sichten", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2 }, socialForm: { "Gruppenarbeit": 2, "Einzelarbeit": 1.5 } },
      counterIndicators: [p("kurz bei einzelner gruppe", -2), p("stille einzelarbeit", -2)],
      typicalLAAErrors: ["In Arbeitsphasen wird Verhalten gesehen, aber Lernstand und Arbeitsprozess werden nicht diagnostiziert."],
      impulseQuestions: ["Wie gewann die LK Einblick in Lern- und Arbeitsprozesse?"]
    }),

    mk({
      id: "3.2.2",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK ist im Unterrichtsgeschehen präsent.",
      shortLabel: "präsent sein",
      manualCore: "Präsenz heißt ansprechbar und im Geschehen; notwendige Organisation ist legitim, wenn sie kurz und transparent gerahmt wird.",
      likelyPhases: ["Einstieg", "Arbeitsphase", "Erarbeitung", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("im raum praesent", 6), p("ansprechbar", 6), p("orga transparent gemacht", 6), p("klasse weiss wie weiterarbeiten", 6), p("ueberblick behalten", 5)],
      developmentMarkers: [p("lange mit orga beschaeftigt", 7), p("wirkt abwesend", 6), p("lange am laptop", 6), p("praesenz verloren", 7), p("suS wissen nicht ob ansprechbar", 5)],
      teacherPhrases: [p("ich hake das kurz ab", 6, "positive"), p("arbeitet weiter an", 5, "positive"), p("danach komme ich herum", 5, "positive")],
      studentPhrases: [p("kommt mal jemand", 5, "development"), p("sie sieht uns nicht", 6, "development"), p("wir warten auf hilfe", 5, "development")],
      singleWordTokens: [tok("praesent", 6), tok("ansprechbar", 6), tok("raum", 3), tok("laptop", 4), tok("orga", 4), tok("abhaken", 4), tok("einsammeln", 4), tok("eintragen", 4)],
      mathSpecificMarkers: [p("praesenz bei arbeitsphase", 5), p("kurze fachliche checks", 5), p("sicherung vorbereitet durch rundgang", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 2.5, "Erarbeitung": 2 }, socialForm: { "Gruppenarbeit": 1.5, "Einzelarbeit": 1 } },
      counterIndicators: [p("orga gehoert zum lehrerhandeln", -3), p("frontalphase", -2)],
      typicalLAAErrors: ["Notwendige Organisation wird nicht transparent gerahmt und wirkt wie Abwesenheit aus dem Unterrichtsgeschehen."],
      impulseQuestions: ["Wie blieb die LK trotz Organisation im Unterrichtsgeschehen präsent?"]
    }),

    mk({
      id: "3.2.3",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK reagiert frühzeitig und angemessen auf Störungen.",
      shortLabel: "früh und angemessen reagieren",
      manualCore: "Die LK nimmt Störungen als solche wahr und reagiert kurz, passend und lernprozessbezogen, bevor sie eskalieren.",
      likelyPhases: ["Arbeitsphase", "Unterrichtsgespräch", "Sicherung", "Übergang"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("stoerung frueh wahrgenommen", 8), p("fruehzeitig reagiert", 7), p("angemessen reagiert", 7), p("fachlicher lernfluss geschuetzt", 6), p("kurz und ruhig reagiert", 5)],
      developmentMarkers: [p("stoerung nicht wahrgenommen", 8), p("haare frisieren", 4), p("nebentaetigkeit unbemerkt", 6), p("reagiert sehr spaet", 7), p("reagiert erst spaet", 7), p("lachen bleibt unkommentiert", 7), p("stoerung eskaliert", 7), p("reaktion ueberzogen", 6), p("keine reaktion", 8), p("reagiert nicht", 8), p("schueler stoeren", 7)],
      teacherPhrases: [p("zurueck zur aufgabe", 5, "positive"), p("stopp wir bleiben beim auftrag", 6, "positive"), p("ich sehe ihr braucht klaerung", 6, "positive")],
      studentPhrases: [p("hoer auf", 4, "development"), p("ist doch egal", 5, "development"), p("wir sind fertig", 4, "development")],
      singleWordTokens: [tok("fruehzeitig", 6), { token: "angemessen", weight: 1, fuzzy: false }, tok("stoerung", 5), tok("stoeren", 5), tok("reagieren", 5), tok("reaktion", 5), tok("eskalieren", 5), tok("nebentaetigkeit", 5), tok("haare", 3), tok("handy", 5)],
      mathSpecificMarkers: [p("stoerung waehrend erklaerung", 5), p("off task fachlich zurueckfuehren", 5), p("unruhe wegen unklarem rechenweg", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 2.5, "Sicherung": 2, "Übergang": 2 }, socialForm: { "Gruppenarbeit": 1.5, "Plenum": 1.5 } },
      counterIndicators: [p("kleine stoerung bewusst ignoriert", -3), p("selbstregulation", -2)],
      typicalLAAErrors: ["Störungen werden erst erkannt, wenn sie den Lernprozess bereits deutlich beeinträchtigen."],
      impulseQuestions: ["Welche Störung wurde wahrgenommen und welche Reaktion hätte den Lernprozess geschützt?"]
    }),

    mk({
      id: "3.2.4",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK behält die Klasse und einzelne Arbeitsprozesse sichtbar im Blick.",
      shortLabel: "Überblick behalten",
      manualCore: "Die LK balanciert Einzelhilfe und Gesamtüberblick; wiederkehrende Probleme werden gesammelt und ggf. gemeinsam geklärt.",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Gruppendiskussion"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("klasse und gruppen im blick", 7), p("balanciert einzelhilfe und ueberblick", 8), p("wiederkehrendes problem erkannt", 7), p("gemeinsam geklaert", 6), p("zwischenstopp", 5)],
      developmentMarkers: [p("zu lange bei einer gruppe", 8), p("lange bei einer gruppe", 7), p("andere warten", 6), p("meldungen nicht gesehen", 7), p("erklaert jeder gruppe dasselbe", 7), p("mehrere gruppen warten", 6), p("gesamtueberblick verloren", 7)],
      teacherPhrases: [p("mehrere gruppen haben dieselbe frage", 7, "positive"), p("wir stoppen kurz gemeinsam", 6, "positive"), p("ich sammle eure stolperstellen", 6, "positive")],
      studentPhrases: [p("wir warten schon lange", 6, "development"), p("sie ist nur bei gruppe", 6, "development"), p("wir sind fertig", 4, "development")],
      singleWordTokens: [tok("ueberblick", 7), tok("scannen", 5), tok("zwischenstopp", 5), tok("gleiche frage", 5), tok("wiederholt", 4), tok("melden", 4), tok("gebunden", 5)],
      mathSpecificMarkers: [p("mehrere gruppen mit gleichem fehler", 7), p("falsche strategien in mehreren heften", 6), p("gemeinsamer zwischenstopp fachlich sinnvoll", 6)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2 }, socialForm: { "Gruppenarbeit": 2, "Einzelarbeit": 1.5 } },
      counterIndicators: [p("intensive einzelhilfe noetig", -2), p("ueberblick durch zwischenstopp", 2)],
      typicalLAAErrors: ["Die LK bindet sich in Einzelhilfe und verliert Meldungen, Wartezeiten oder gemeinsame Problemstellen aus dem Blick."],
      impulseQuestions: ["Wann wäre Bündelung statt wiederholter Einzelhilfe lernwirksamer gewesen?"]
    }),

    mk({
      id: "3.2.5",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK erkennt Unterstützungsbedarf oder Unruhe während der Arbeitsphasen.",
      shortLabel: "Unterstützungsbedarf erkennen",
      manualCore: "Unruhe, Leerlauf oder Rückfragen werden als mögliche Hinweise auf fachlichen Unterstützungsbedarf gelesen.",
      likelyPhases: ["Arbeitsphase", "Erarbeitung", "Gruppendiskussion"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("unterstuetzungsbedarf erkannt", 8), p("leerlauf bemerkt", 6), p("ueberforderung erkannt", 6), p("unruhe als hilfebedarf gelesen", 7), p("wartende gruppe aufgegriffen", 6)],
      developmentMarkers: [p("unterstuetzungsbedarf bleibt unerkannt", 8), p("suS warten lange", 6), p("unruhe nur sanktioniert", 6), p("fachliche ueberforderung als stoerung gelesen", 7), p("gruppen haengen unbemerkt", 7), p("wartende gruppe erst spaet", 7), p("erkennt wartende gruppe erst spaet", 8)],
      teacherPhrases: [p("ihr haengt am auftrag", 6, "positive"), p("braucht ihr einen hinweis", 5, "positive"), p("welche frage habt ihr gerade", 5, "positive")],
      studentPhrases: [p("was sollen wir tun", 6, "development"), p("wir wissen nicht weiter", 6, "development"), p("ist das richtig", 4, "development")],
      singleWordTokens: [tok("unterstuetzungsbedarf", 8), tok("unruhe", 5), tok("warten", 4), tok("ueberfordert", 5), tok("haengt", 5), tok("leerlauf", 5), tok("diagnostisch", 4)],
      mathSpecificMarkers: [p("gleiche rueckfrage mehrfach", 6), p("fehlender start in problemloeseaufgabe", 6), p("operator unklar", 5), p("falsches verstaendnis der darstellung", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2 }, socialForm: { "Gruppenarbeit": 2, "Einzelarbeit": 1.5 } },
      counterIndicators: [p("leises arbeiten", -2), p("kurze rueckfrage normal", -2)],
      typicalLAAErrors: ["Unruhe wird als Verhalten gelesen, obwohl sie aus Auftrag, Überforderung oder fehlender Unterstützung entstehen kann."],
      impulseQuestions: ["Welche Signale zeigten Unterstützungsbedarf während der Arbeitsphase?"]
    }),

    mk({
      id: "3.2.6",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK reagiert auf Störungen oder Abschweifungen, bevor sie den Lernprozess deutlich beeinträchtigen.",
      shortLabel: "Lernprozess schützen",
      manualCore: "Beginnender Fokusverlust wird lernprozessbezogen stabilisiert, ohne jede kleine Nebenspur sofort zu übersteuern.",
      likelyPhases: ["Arbeitsphase", "Unterrichtsgespräch", "Sicherung", "Übergang"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("fokus frueh stabilisiert", 7), p("abschweifung knapp zurueckgefuehrt", 7), p("lernprozess geschuetzt", 7), p("beginnende abdriftung erkannt", 6)],
      developmentMarkers: [p("abschweifung laeuft lange", 7), p("lernprozess beeintraechtigt", 8), p("intervention kommt zu spaet", 7), p("rein disziplinarisch", 5), p("fokusverlust nicht gestoppt", 7)],
      teacherPhrases: [p("zurueck zur fachlichen frage", 6, "positive"), p("was ist euer naechster schritt", 5, "positive"), p("bleibt bei eurem loesungsweg", 5, "positive")],
      studentPhrases: [p("wir reden ueber was anderes", 5, "development"), p("muessen wir noch arbeiten", 5, "development"), p("keine ahnung", 4, "development")],
      singleWordTokens: [tok("abschweifung", 6), tok("fokusverlust", 6), tok("beeintraechtigen", 6), tok("zurueckfuehren", 5), tok("abdriften", 5), tok("stabilisieren", 5)],
      mathSpecificMarkers: [p("gruppe verlaesst aufgabe", 6), p("rechenweg nicht weitergefuehrt", 5), p("sicherung verliert anschluss", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Sicherung": 2 }, socialForm: { "Gruppenarbeit": 1.5, "Plenum": 1.5 } },
      counterIndicators: [p("kurze soziale entlastung", -2), p("fachliche nebenspur produktiv", -2)],
      typicalLAAErrors: ["Abschweifungen werden erst bearbeitet, wenn die fachliche Bearbeitung bereits abgebrochen ist."],
      impulseQuestions: ["Welche kurze Reaktion hätte den fachlichen Lernprozess stabilisieren können?"]
    }),

    mk({
      id: "3.2.7",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK nutzt kurze verbale oder nonverbale Signale, um Arbeitsprozesse zu stabilisieren.",
      shortLabel: "kurze Signale nutzen",
      manualCore: "Kurze, klare, ggf. deutliche Signale stabilisieren Arbeitsprozesse sachbezogen, ohne lange Unterbrechungen oder Bloßstellung.",
      likelyPhases: ["Arbeitsphase", "Übergang", "Unterrichtsgespräch", "Sicherung"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("kurzes klares signal", 7), p("stop signal", 7), p("sachbezogen laut", 5), p("blickkontakt stabilisiert", 5), p("naehe genutzt", 4), p("arbeitsfluss erhalten", 6)],
      developmentMarkers: [p("signal undeutlich", 6), p("lange intervention", 6), p("lauter ton persoenlich", 7), p("wiederholte unklare ermahnungen", 6), p("keine rueckfuehrung zum lernprozess", 6)],
      teacherPhrases: [p("stopp", 6, "positive"), p("hey", 4, "positive"), p("zur aufgabe", 5, "positive"), p("naechster schritt", 5, "positive"), p("arbeitsauftrag", 4, "positive")],
      studentPhrases: [p("ach so", 3, "positive"), p("wir sollen weiterarbeiten", 4, "positive")],
      singleWordTokens: [tok("signal", 6), tok("nonverbal", 5), tok("stopp", 6), tok("hey", 4, false), tok("blickkontakt", 5), tok("naehe", 4), tok("deutlich", 4), tok("sachbezogen", 5)],
      mathSpecificMarkers: [p("kurzer hinweis zurueck zum rechenweg", 6), p("handzeichen fuer arbeitslautstaerke", 5), p("fachlicher impuls statt unterbrechung", 6)],
      contextBoosts: { phase: { "Arbeitsphase": 2.5, "Übergang": 2, "Sicherung": 1.5 }, socialForm: { "Gruppenarbeit": 1.5, "Plenum": 1.5 } },
      counterIndicators: [p("laut nicht automatisch schlecht", -2), p("ernste stoerung braucht mehr", -2)],
      typicalLAAErrors: ["Statt kurzer klarer Signale entstehen lange Ermahnungen, die den Arbeitsfluss selbst unterbrechen."],
      impulseQuestions: ["Welche kurzen Signale stabilisierten den Arbeitsprozess sachbezogen?"]
    }),

    mk({
      id: "3.3.1",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die Unterrichtszeit wird überwiegend für fachliche Lernprozesse genutzt.",
      shortLabel: "Lernzeit fachlich nutzen",
      manualCore: "Effiziente Zeitnutzung heißt fachliche Lernzeit schützen, nicht jede Sekunde füllen.",
      likelyPhases: ["Einstieg", "Erarbeitung", "Arbeitsphase", "Sicherung", "Übergang"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("lernzeit fachlich genutzt", 8), p("unterrichtszeit fachlich genutzt", 7), p("phasen tragen zum lernziel bei", 6), p("organisation bleibt begrenzt", 5)],
      developmentMarkers: [p("viel zeit ohne fachlichen lernprozess", 8), p("lange leerlaufphase", 7), p("organisation dominiert", 6), p("fachliche arbeit beginnt spaet", 6), p("nebenthemen verbrauchen zeit", 6)],
      teacherPhrases: [p("nutzt die zeit fuer", 5, "positive"), p("wir kommen zurueck zum thema", 5, "positive")],
      studentPhrases: [p("was machen wir jetzt", 5, "development"), p("wir warten", 5, "development"), p("wir haben nichts zu tun", 6, "development")],
      singleWordTokens: [tok("lernzeit", 7), tok("unterrichtszeit", 6), tok("fachlich", 3), tok("leerlauf", 6), tok("zeitverlust", 6), tok("organisation", 3), tok("nebenthema", 4)],
      mathSpecificMarkers: [p("zeit fuer begruendung", 5), p("fachliche uebungszeit", 5), p("mathematisches gespraech", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 2, "Übergang": 2, "Sicherung": 2 }, socialForm: { "Gruppenarbeit": 1, "Plenum": 1 } },
      counterIndicators: [p("denkzeit zaehlt als lernzeit", -3), p("beziehungsarbeit lernfoerderlich", -2), p("kurze organisation notwendig", -2)],
      typicalLAAErrors: ["Zeit wird gefüllt, aber nicht fachlich lernwirksam genutzt."],
      impulseQuestions: ["Wo ging fachliche Lernzeit verloren, und wodurch?"]
    }),

    mk({
      id: "3.3.2",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die LK plant angemessene Bearbeitungs- und Denkzeiten ein.",
      shortLabel: "Zeiten passend planen",
      manualCore: "Zeitangaben sind klar, realistisch und werden gesteuert; Überschreitungen werden fachlich begründet.",
      likelyPhases: ["Erarbeitung", "Arbeitsphase", "Sicherung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("klare zeitangabe", 7), p("zeitrahmen mitgeteilt", 7), p("bearbeitungszeit passt", 6), p("zeit angepasst begruendet", 6), p("zeitstruktur im blick", 6)],
      developmentMarkers: [p("keine zeitangabe", 6), p("zeit angekuendigt aber nicht gesteuert", 7), p("arbeitsphase laeuft aus", 7), p("sicherung verdraengt", 7), p("zeit ueberschritten unkommentiert", 6)],
      teacherPhrases: [p("ihr habt fuenf minuten", 5, "positive"), p("noch zwei minuten", 5, "positive"), p("wir verlaengern weil", 6, "positive"), p("wir stoppen gleich und sichern", 6, "positive")],
      studentPhrases: [p("wie lange haben wir", 5, "development"), p("wir brauchen noch zeit", 4, "development"), p("das schafft man nicht", 5, "development")],
      singleWordTokens: [tok("zeitangabe", 6), tok("bearbeitungszeit", 6), tok("denkzeit", 5), tok("timer", 4), tok("ueberschreitung", 6), tok("verlaengern", 4), tok("abgeschnitten", 5)],
      mathSpecificMarkers: [p("zeit fuer problemloesen", 5), p("zeit fuer begruendung", 5), p("zeit fuer loesungswegvergleich", 5)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Erarbeitung": 2, "Sicherung": 2 }, socialForm: { "Gruppenarbeit": 1.5, "Einzelarbeit": 1.5 } },
      counterIndicators: [p("kurze aktivierung sinnvoll", -2), p("lange zeit komplexe aufgabe", -2)],
      typicalLAAErrors: ["Zeit wird gegeben, aber nicht so gesteuert, dass Bearbeitung und Sicherung zusammenpassen."],
      impulseQuestions: ["Wie wurde Zeit für Bearbeitung und Sicherung geplant und gesteuert?"]
    }),

    mk({
      id: "3.3.3",
      dimension: "Strukturierte Klassenführung",
      exactText: "Der Unterricht beginnt ohne längere vermeidbare Verzögerungen.",
      shortLabel: "zügiger fachlicher Beginn",
      manualCore: "Die Stunde beginnt ohne vermeidbaren Zeitverlust fachlich orientiert. Vorwissenaktivierung, tägliche Übung oder Startaufgabe sind nur Mittel, kein Dogma.",
      likelyPhases: ["Einstieg", "Vor Stunde"],
      likelySocialForms: ["Plenum", "Einzelarbeit"],
      positiveMarkers: [p("puenktlicher beginn", 7), p("zuegiger start", 6), p("fachliche orientierung am anfang", 6), p("vorwissen passend aktiviert", 5), p("startaufgabe funktional", 5)],
      developmentMarkers: [p("vermeidbare verzoegerung", 7), p("unpünktlicher beginn", 6), p("anfang zerfasert", 6), p("materialsuche verzoegert start", 6), p("einstieg ohne fachliche ausrichtung", 5)],
      teacherPhrases: [p("wir starten direkt", 5, "positive"), p("startet mit", 4, "positive"), p("falls die technik nicht geht", 4, "positive")],
      studentPhrases: [p("haben wir schon angefangen", 5, "development"), p("was sollen wir machen", 5, "development"), p("wir warten", 4, "development")],
      singleWordTokens: [tok("beginn", 5), tok("puenktlich", 6), tok("start", 4), tok("einstieg", 4), tok("vorwissen", 4), tok("startaufgabe", 4), tok("taegliche", 2), tok("verzoegerung", 6)],
      mathSpecificMarkers: [p("kopfrechenstart", 3), p("problemfrage", 4), p("wiederholungsimpuls", 4), p("vorwissenaktivierung", 5)],
      contextBoosts: { phase: { "Einstieg": 4, "Vor Stunde": 2 }, socialForm: { "Plenum": 1 } },
      counterIndicators: [p("taegliche uebung kein muss", -3), p("vorwissen muss passen", -3), p("ruhiges ankommen sinnvoll", -2)],
      typicalLAAErrors: ["Startformen werden ritualisiert, ohne fachliche Funktion, oder vermeidbare Verzögerungen verhindern Orientierung."],
      impulseQuestions: ["Wie führte der Beginn ohne unnötigen Zeitverlust fachlich in die Stunde?"]
    }),

    mk({
      id: "3.3.4",
      dimension: "Strukturierte Klassenführung",
      exactText: "Übergänge zwischen Unterrichtsphasen verlaufen zügig und klar.",
      shortLabel: "Übergänge und Auftrag klären",
      manualCore: "Phasenwechsel und Arbeitsaufträge sind handlungsklar: wer, mit wem, wie lange, woran Qualität/Fertigsein erkennbar ist, wo Hilfe liegt und was danach passiert.",
      likelyPhases: ["Übergang", "Arbeitsphase", "Erarbeitung", "Sicherung"],
      likelySocialForms: ["Plenum", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("auftrag abgesichert", 8), p("suS koennen auftrag erklaeren", 8), p("organisation geklaert", 7), p("ergebnisqualitaet geklaert", 7), p("fertig regel klar", 7), p("hilfesystem klar", 6)],
      developmentMarkers: [p("auftrag nur vorgelesen", 7), p("auftrag unklar", 8), p("was zu tun ist", 7), p("was zu tun ist unklar", 8), p("wissen nicht was zu tun ist", 8), p("gibt es noch fragen ersetzt diagnose", 8), p("suS starten unterschiedlich", 7), p("organisation unklar", 7), p("qualitaet unklar", 6), p("fertige sus wissen nicht weiter", 6)],
      teacherPhrases: [p("erklaert was ihr machen muesst", 8, "positive"), p("woran merkt ihr dass ihr fertig seid", 8, "positive"), p("wie soll ein gutes ergebnis aussehen", 8, "positive"), p("wer arbeitet mit wem", 6, "positive"), p("wo findet ihr hilfe", 6, "positive")],
      studentPhrases: [p("was jetzt", 5, "development"), p("was sollen wir machen", 7, "development"), p("was sollen wir genau abgeben", 8, "development"), p("mit wem arbeiten wir", 5, "development"), p("wann sind wir fertig", 5, "development")],
      singleWordTokens: [tok("uebergang", 5), tok("arbeitsauftrag", 7), tok("auftrag", 6), tok("organisation", 5), tok("ergebnisqualitaet", 7), tok("fertig", 4), tok("hilfesystem", 5), tok("abgeben", 5), tok("klar", 3)],
      mathSpecificMarkers: [p("uebergang von rechnung zu begruendung", 5), p("wechsel in partnervergleich", 5), p("auftragsqualitaet", 5), p("produktkriterium", 6)],
      contextBoosts: { phase: { "Übergang": 4, "Arbeitsphase": 2.5, "Erarbeitung": 2 }, socialForm: { "Gruppenarbeit": 2, "Partnerarbeit": 1.5, "Plenum": 1 } },
      counterIndicators: [p("komplexe methode braucht zeit", -2), p("zuegig heisst nicht hektisch", -2)],
      typicalLAAErrors: ["Arbeitsaufträge werden formuliert, aber nicht diagnostisch abgesichert; SuS starten mit unterschiedlichem Verständnis."],
      impulseQuestions: ["Woran konnten SuS erkennen, was zu tun ist und was ein gutes Ergebnis ausmacht?"]
    }),

    mk({
      id: "3.3.5",
      dimension: "Strukturierte Klassenführung",
      exactText: "Materialien, Medien oder organisatorische Abläufe sind so vorbereitet, dass Arbeitszeit erhalten bleibt.",
      shortLabel: "Arbeitszeit sichern",
      manualCore: "Material/Medien sind robust vorbereitet, aber alltagstauglich: klein, klar, stabil, nützlich statt unrealistischer Übervorbereitung.",
      likelyPhases: ["Vor Stunde", "Einstieg", "Arbeitsphase", "Übergang"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("material funktionsfaehig", 7), p("link getestet", 6), p("technik getestet", 6), p("plan b vorhanden", 6), p("robust vorbereitet", 6), p("einfach und nuetzlich", 5)],
      developmentMarkers: [p("kopien fehlen", 7), p("link geht nicht", 7), p("ab funktioniert nicht", 7), p("technik nicht getestet", 7), p("materialsuche frisst zeit", 7), p("unrealistische vorarbeit", 5)],
      teacherPhrases: [p("falls es nicht laedt", 5, "positive"), p("das material liegt bereit", 5, "positive"), p("plan b", 5, "positive")],
      studentPhrases: [p("ich habe kein blatt", 6, "development"), p("wo ist die datei", 6, "development"), p("der link geht nicht", 7, "development")],
      singleWordTokens: [tok("material", 5), tok("medien", 5), tok("vorbereitet", 5), tok("plan", 3), tok("kopien", 5), tok("link", 5), tok("technik", 5), tok("alltagstauglich", 5)],
      mathSpecificMarkers: [p("geodreieck bereit", 4), p("rechner bereit", 4), p("cas bereit", 4), p("digitale simulation funktioniert", 5), p("koordinatensystem vorhanden", 4)],
      contextBoosts: { phase: { "Vor Stunde": 3, "Einstieg": 2, "Arbeitsphase": 2 }, socialForm: { "Gruppenarbeit": 1.5 } },
      counterIndicators: [p("nicht alles vorab ausbreiten", -2), p("unrealistische uebervorbereitung", -2), p("technisches problem extern", -2)],
      typicalLAAErrors: ["Vorbereitung ist entweder zu fragil oder so überaufwändig, dass sie im Alltag nicht tragfähig ist."],
      impulseQuestions: ["Wie lässt sich gleich gute Materialqualität alltagstauglich erreichen?"]
    }),

    mk({
      id: "3.3.6",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die SuS haben ausreichend Zeit für fachliche Bearbeitung oder Reflexion.",
      shortLabel: "Zeit für Bearbeitung und Sicherung",
      manualCore: "Fachliche Bearbeitung braucht Zeit, aber Sicherung darf nicht entfallen; bei Schwierigkeiten wird gesichert, was zu sichern ist.",
      likelyPhases: ["Arbeitsphase", "Sicherung", "Erarbeitung"],
      likelySocialForms: ["Plenum", "Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("ausreichend zeit fuer bearbeitung", 7), p("zeit fuer reflexion", 6), p("sicherung fokussiert", 7), p("arbeitsphase rechtzeitig beendet", 6), p("gesichert was zu sichern ist", 8)],
      developmentMarkers: [p("sicherung zu kurz geplant", 8), p("arbeitsphase zu spaet beendet", 8), p("sicherung faellt weg", 8), p("zentrale erkenntnis ungesichert", 8), p("reflexion gehetzt", 6), p("nicht fertig entbindet von sicherung", 6)],
      teacherPhrases: [p("wir sichern jetzt das wichtigste", 6, "positive"), p("wir stoppen und buendeln", 6, "positive"), p("was ist heute klar geworden", 5, "positive")],
      studentPhrases: [p("ich war noch nicht fertig", 4, "development"), p("wir hatten keine zeit", 5, "development"), p("das ging zu schnell", 5, "development")],
      singleWordTokens: [tok("ausreichend", 4), tok("bearbeitung", 5), tok("reflexion", 6), tok("sicherung", 7), tok("gehetzt", 5), tok("ungesichert", 7), tok("abbrechen", 4)],
      mathSpecificMarkers: [p("zeit fuer loesungswegvergleich", 5), p("zeit fuer fehlerklaerung", 5), p("zeit fuer schriftliche sicherung", 5), p("transferfrage", 4)],
      contextBoosts: { phase: { "Sicherung": 4, "Arbeitsphase": 2 }, socialForm: { "Plenum": 1.5 } },
      counterIndicators: [p("nicht jede aufgabe muss fertig", -2), p("bewusstes anreissen", -2)],
      typicalLAAErrors: ["Die Arbeitsphase wird verlängert, bis keine Zeit mehr bleibt, das zentrale Lernen fachlich zu sichern."],
      impulseQuestions: ["Was musste trotz Schwierigkeiten am Ende fachlich gesichert werden?"]
    }),

    mk({
      id: "3.3.7",
      dimension: "Strukturierte Klassenführung",
      exactText: "Die Unterrichtszeit wird nicht durch längere Leerlaufphasen unterbrochen.",
      shortLabel: "Leerlauf vermeiden",
      manualCore: "Systematischer Leerlauf wird vermieden, ohne Kontrollwahn oder sinnlose Sprinteraufgaben zu erzeugen.",
      likelyPhases: ["Arbeitsphase", "Übergang", "Erarbeitung"],
      likelySocialForms: ["Einzelarbeit", "Partnerarbeit", "Gruppenarbeit"],
      positiveMarkers: [p("langer leerlauf vermieden", 7), p("fertige sus helfen sinnvoll", 6), p("peer hilfe klar gerahmt", 5), p("schnelle sus pruefen oder erklaeren", 5), p("wartezeiten sinnvoll ueberbrueckt", 5)],
      developmentMarkers: [p("gruppen warten lange", 7), p("systematischer leerlauf", 8), p("viel leerlauf", 8), p("leerlauf in einzelnen gruppen", 8), p("sinnlose sprinteraufgabe", 7), p("sprinteraufgabe disfunktional", 8), p("zusatzaufgabe ungeeignet", 7), p("nie gesichert", 5)],
      teacherPhrases: [p("wenn ihr fertig seid prueft", 5, "positive"), p("unterstuetzt eine andere gruppe", 6, "positive"), p("vergleicht euren weg", 5, "positive")],
      studentPhrases: [p("wir sind fertig", 5, "development"), p("was sollen wir jetzt machen", 6, "development"), p("wir warten", 5, "development"), p("keine ahnung", 3, "development")],
      singleWordTokens: [tok("leerlauf", 7), tok("warten", 5), tok("fertig", 4), tok("sprinteraufgabe", 8), tok("zusatzaufgabe", 5), tok("peerhilfe", 5), tok("ueberbruecken", 4)],
      mathSpecificMarkers: [p("begruendung ergaenzen", 4), p("loesung pruefen", 4), p("partnervergleich", 5), p("fehler suchen", 4), p("transferfrage", 4)],
      contextBoosts: { phase: { "Arbeitsphase": 3, "Übergang": 2 }, socialForm: { "Gruppenarbeit": 2, "Partnerarbeit": 1.5, "Einzelarbeit": 1 } },
      counterIndicators: [p("zwei minuten nichts zu tun", -4), p("denkpause ist kein leerlauf", -3), p("nicht jede eventualitaet braucht aufgabe", -3)],
      typicalLAAErrors: ["Leerlauf wird mit Zusatzaufgaben kaschiert, die fachlich nicht anschlussfähig oder nicht sicherbar sind."],
      impulseQuestions: ["Wo entstand systematischer Leerlauf, und welche einfache Alternative wäre tragfähig?"]
    })
  ];

  const existingIds = new Set(target.map((item) => item.id));
  UFB_ADDITIONAL_ITEM_HEURISTICS.forEach((item) => {
    if (!existingIds.has(item.id)) {
      target.push(item);
    }
  });

  function runUfbFullHeuristicStressTests() {
    const analyzer = root.analyzeUfbItemObservation || base.analyzeUfbItemObservation;
    if (!analyzer) {
      return [];
    }
    const cases = [
      ["Lehrer nimmt nach halbrichtiger Antwort direkt jemand anderes dran.", "observation", "Unterrichtsgespräch", "Plenum", ["1.3.1"]],
      ["Zwei Lösungswege stehen an der Tafel, aber sie werden nicht verglichen.", "observation", "Sicherung", "Plenum", ["1.3.2"]],
      ["SuS sollen selbst einen Ansatz finden, aber niemand weiß wie anfangen.", "observation", "Arbeitsphase", "Gruppenarbeit", ["1.3.3"]],
      ["Schüler sagt ein Wort, Lehrer erklärt den Rest des Lösungswegs.", "observation", "Unterrichtsgespräch", "Plenum", ["1.3.4"]],
      ["Aufgabe bleibt nur AFB I: einsetzen, Ergebnis nennen, fertig.", "observation", "Arbeitsphase", "Einzelarbeit", ["1.3.5"]],
      ["Zentraler Fehler wird aufgeschrieben und gemeinsam fachlich geklärt.", "observation", "Sicherung", "Plenum", ["1.3.6", "2.1.5"]],
      ["Transferfrage kommt zu früh, Basis ist noch nicht gelegt.", "observation", "Sicherung", "Plenum", ["1.3.7"]],
      ["Viele SuS off-task, ein Schüler fragt in der Sicherung ob er auf Toilette darf.", "observation", "Sicherung", "Plenum", ["1.4.1", "1.4.2"]],
      ["Nur Einwort-Antworten, LK lässt das immer wieder gelten.", "observation", "Unterrichtsgespräch", "Plenum", ["1.4.2"]],
      ["S erklärt über mehrere Sätze seinen Rechenweg.", "student_quote", "Sicherung", "Plenum", ["1.4.3", "1.3.4"]],
      ["Gruppe hängt, stellt aber keine Frage; LK geht hin und schaut wo es hakt.", "observation", "Arbeitsphase", "Gruppenarbeit", ["1.4.4", "3.2.5"]],
      ["Anspruchsvolle Aufgabe führt zu Leerlauf, SuS geben nach zwei Minuten auf.", "observation", "Arbeitsphase", "Gruppenarbeit", ["1.4.5"]],
      ["S2 greift den Hinweis von S1 auf und ändert den Lösungsweg.", "student_quote", "Gruppendiskussion", "Gruppenarbeit", ["1.4.6"]],
      ["Alternative richtige Schüleridee wird von der LK nicht erkannt und umgelenkt.", "observation", "Unterrichtsgespräch", "Plenum", ["1.4.7"]],
      ["Feedback nur: gut, richtig, falsch. SuS wissen nicht was genau.", "observation", "Feedback", "Plenum", ["2.1.1"]],
      ["LK sagt: Bis hierhin stimmt dein Ansatz, darauf können wir aufbauen.", "teacher_quote", "Feedback", "Einzelarbeit", ["2.1.2"]],
      ["LK gibt nächsten Schritt: Überprüfe die Einheit und ergänze die Begründung.", "teacher_quote", "Feedback", "Einzelarbeit", ["2.1.3"]],
      ["Schüler nickt okay, setzt das Feedback aber nicht um und rechnet falsch weiter.", "observation", "Arbeitsphase", "Einzelarbeit", ["2.1.4"]],
      ["Unvollständige Antwort wird fachlich geklärt statt einfach ersetzt.", "observation", "Sicherung", "Plenum", ["2.1.5"]],
      ["LK fragt erst: Wo genau hakt es? Zeig mir die Stelle.", "teacher_quote", "Arbeitsphase", "Einzelarbeit", ["2.2.1"]],
      ["Erklärung überfordert, nicht anschaulich, keine andere Darstellung.", "observation", "Arbeitsphase", "Einzelarbeit", ["2.2.2"]],
      ["Hilfekarten und verschiedene Darstellungen passend zum Lernstand.", "observation", "Arbeitsphase", "Gruppenarbeit", ["2.2.3"]],
      ["Komplexe Frage, LK beantwortet sie sofort selbst.", "observation", "Unterrichtsgespräch", "Plenum", ["2.2.4"]],
      ["Hilfe ist zu aufwändig für die Wirkung, LK bleibt lange bei einer Gruppe.", "observation", "Arbeitsphase", "Gruppenarbeit", ["2.2.5", "3.2.4"]],
      ["Normkonflikt wird ruhig bearbeitet, Würde bleibt gewahrt.", "observation", "Arbeitsphase", "Plenum", ["2.3.1"]],
      ["Schüler sagt: Warum immer ich? Das ist unfair.", "student_quote", "Arbeitsphase", "Plenum", ["2.3.2"]],
      ["Alternative Sichtweise des Schülers wird respektvoll aufgenommen.", "observation", "Unterrichtsgespräch", "Plenum", ["2.3.3"]],
      ["SuS fallen einander ins Wort, Beitrag wird unterbrochen.", "observation", "Unterrichtsgespräch", "Plenum", ["2.4.1"]],
      ["Fertige SuS gehen rum und erklären Mitschülern den nächsten Schritt.", "observation", "Arbeitsphase", "Gruppenarbeit", ["2.4.2", "3.3.7"]],
      ["Fehler wird ausgelacht, LK reagiert nicht.", "observation", "Sicherung", "Plenum", ["2.4.3"]],
      ["S sagt zur LK: Mach ich nicht, ist mir egal.", "student_quote", "Arbeitsphase", "Plenum", ["2.4.4"]],
      ["Gruppenarbeit ist nur Sitzordnung, keine Kooperationsnotwendigkeit.", "observation", "Arbeitsphase", "Gruppenarbeit", ["2.4.5"]],
      ["Ein Schüler dominiert, stille SuS bleiben außen vor.", "observation", "Arbeitsphase", "Gruppenarbeit", ["2.4.6"]],
      ["Frage in der Gruppe wird abgewertet: Das weiß man doch.", "student_quote", "Arbeitsphase", "Gruppenarbeit", ["2.4.7"]],
      ["Wiederholte Störungen unterbrechen den Rechenweg.", "observation", "Arbeitsphase", "Plenum", ["3.1.1"]],
      ["Lautstärke verhindert, dass die Präsentation hörbar ist.", "observation", "Sicherung", "Plenum", ["3.1.2"]],
      ["Abläufe unklar, SuS fragen ständig: Wie geht das nochmal?", "observation", "Übergang", "Plenum", ["3.1.3"]],
      ["LK setzt sich ans Pult, keine Diagnose der Arbeitsstände.", "observation", "Arbeitsphase", "Gruppenarbeit", ["3.2.1"]],
      ["LK hakt kurz Orga ab und sagt transparent, woran weitergearbeitet wird.", "teacher_quote", "Arbeitsphase", "Plenum", ["3.2.2"]],
      ["Schüler frisiert Haare und driftet ab, LK nimmt Störung nicht wahr.", "observation", "Arbeitsphase", "Plenum", ["3.2.3"]],
      ["LK erklärt jeder Gruppe dieselbe Frage einzeln, mehrere Gruppen warten.", "observation", "Arbeitsphase", "Gruppenarbeit", ["3.2.4"]],
      ["Unruhe wird als Hilfebedarf erkannt: ihr hängt am Auftrag.", "teacher_quote", "Arbeitsphase", "Gruppenarbeit", ["3.2.5"]],
      ["Abschweifung läuft lange, Lernprozess ist beeinträchtigt.", "observation", "Arbeitsphase", "Gruppenarbeit", ["3.2.6"]],
      ["Klares Stop-Signal: Stopp, zurück zur Aufgabe.", "teacher_quote", "Arbeitsphase", "Plenum", ["3.2.7"]],
      ["Viel Zeit ohne fachlichen Lernprozess, lange Leerlaufphase.", "observation", "Arbeitsphase", "Gruppenarbeit", ["3.3.1", "3.3.7"]],
      ["Keine Zeitangabe, Arbeitsphase läuft aus, Sicherung verdrängt.", "observation", "Arbeitsphase", "Plenum", ["3.3.2", "3.3.6"]],
      ["Pünktlicher Beginn mit passender Vorwissenaktivierung.", "observation", "Einstieg", "Plenum", ["3.3.3"]],
      ["Gibt es noch Fragen ersetzt Diagnose; SuS können Auftrag nicht erklären.", "observation", "Übergang", "Plenum", ["3.3.4"]],
      ["Link geht nicht, AB funktioniert nicht, Technik nicht getestet.", "observation", "Einstieg", "Plenum", ["3.3.5"]],
      ["Arbeitsphase zu spät beendet, Sicherung fällt weg.", "observation", "Sicherung", "Plenum", ["3.3.6"]],
      ["Sprinteraufgabe disfunktional, zu schwer und wird nie gesichert.", "observation", "Arbeitsphase", "Einzelarbeit", ["3.3.7"]]
    ];

    return cases.map(([text, type, phase, socialForm, expected]) => {
      const result = analyzer({ text, type, phase, socialForm }, []);
      const top = result.suggestions.map((suggestion) => suggestion.item.id);
      return {
        text,
        expected,
        top,
        fallback: result.fallback,
        tooMany: result.suggestions.length > 4,
        hitExpected: expected.some((id) => top.includes(id)),
        suggestions: result.suggestions.map((suggestion) => ({
          id: suggestion.item.id,
          label: suggestion.item.shortLabel,
          score: suggestion.score,
          confidence: suggestion.confidence,
          confidenceLabel: suggestion.confidenceLabel,
          tendency: suggestion.tendency,
          reasons: suggestion.reasons.map((reason) => reason.text)
        }))
      };
    });
  }

  root.UFB_ADDITIONAL_ITEM_HEURISTICS = UFB_ADDITIONAL_ITEM_HEURISTICS;
  root.runUfbFullHeuristicStressTests = runUfbFullHeuristicStressTests;

  if (typeof module !== "undefined") {
    module.exports = {
      UFB_ADDITIONAL_ITEM_HEURISTICS,
      runUfbFullHeuristicStressTests
    };
  }
})(typeof window !== "undefined" ? window : globalThis);
