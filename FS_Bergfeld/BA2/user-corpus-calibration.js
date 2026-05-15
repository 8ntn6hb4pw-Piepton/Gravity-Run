/*
  Calibration layer from the user-provided test corpus.
  Purpose: teach the rule-based item suggestions common Fachleiter shorthand,
  typos, and compact coaching phrases without changing the fixed UFB items.
*/

(function attachUserCorpusCalibration(root) {
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

  const byId = new Map(target.map((item) => [item.id, item]));
  const p = (pattern, weight, tendency) => ({ pattern, weight, tendency });
  const tok = (token, weight = 3, fuzzy = true) => ({ token, weight, fuzzy });

  function add(id, patch) {
    const item = byId.get(id);
    if (!item) {
      return;
    }
    [
      "positiveMarkers",
      "developmentMarkers",
      "teacherPhrases",
      "studentPhrases",
      "singleWordTokens",
      "mathSpecificMarkers",
      "counterIndicators"
    ].forEach((key) => {
      if (patch[key]?.length) {
        item[key].push(...patch[key]);
      }
    });
  }

  add("1.1.1", {
    positiveMarkers: [
      p("ich erklaere euch was wir vorhaben", 7, "positive"),
      p("woran ihr erkennt dass ihr es verstanden habt", 7, "positive"),
      p("verstehensziel wird transparent", 7, "positive"),
      p("problem vom anfang wird aufgegriffen", 6, "positive")
    ],
    developmentMarkers: [
      p("worum koennte es heute gehen", 7, "development"),
      p("kein ratespiel", 5, "development"),
      p("einstieg passt nicht zur stunde", 7, "development"),
      p("einstieg motivator funktioniert nicht", 6, "development"),
      p("motivator funktioniert nicht", 5, "development"),
      p("keine rueckbindung an die eingangsfrage", 7, "development"),
      p("was ist jetzt mit dem problem vom anfang", 7, "development")
    ],
    teacherPhrases: [
      p("ich habe da mal was mitgebracht", 3, "development"),
      p("worum koennte es heute gehen", 7, "development")
    ],
    singleWordTokens: [tok("zieltransparenz", 5), tok("ratespiel", 5), tok("eingangsfrage", 5), tok("leitfrage", 5)]
  });

  add("1.1.2", {
    positiveMarkers: [
      p("zentrale inhalte werden notiert", 6, "positive"),
      p("tafelbild traegt", 6, "positive"),
      p("visualisierung traegt", 6, "positive"),
      p("zwischensicherung traegt", 6, "positive")
    ],
    developmentMarkers: [
      p("zu viel text", 6, "development"),
      p("sprachlich ueberfrachtet", 7, "development"),
      p("zu komplex", 5, "development"),
      p("kein beobachtungsauftrag", 5, "development"),
      p("visualisierung fehlt", 6, "development"),
      p("abschreibzeit fehlt", 4, "development"),
      p("was haben die jetzt im heft", 6, "development")
    ],
    singleWordTokens: [tok("abschreibzeit", 5), tok("ueberfrachtet", 6), tok("visualiserung", 4), tok("visualisierung", 5)]
  });

  add("1.1.3", {
    developmentMarkers: [
      p("merksatz zu technisch", 7, "development"),
      p("anschaulichkeit hilft hier nicht weiter", 6, "development"),
      p("erklaerung vorher planen", 5, "development"),
      p("fachsprache progressiv aufbauen", 5, "development")
    ],
    positiveMarkers: [p("sprache progressiv aufbauen", 5, "positive"), p("fachsprache einfordern", 5, "positive")],
    singleWordTokens: [tok("anschaulichkeit", 4), tok("fachsprache", 5), tok("merksatz", 4)]
  });

  add("1.1.4", {
    developmentMarkers: [
      p("rueckbezug zur eingangsfrage fehlt", 7, "development"),
      p("keine verbindung zur leitfrage", 6, "development"),
      p("was ist jetzt mit dem problem vom anfang", 7, "development")
    ],
    positiveMarkers: [p("rueckbezug zur eingangsfrage", 6, "positive"), p("bezug zum problem vom anfang", 6, "positive")]
  });

  add("1.1.5", {
    positiveMarkers: [p("zielklarheit hergestellt", 6, "positive"), p("funktion der aufgabe wird geklaert", 6, "positive")],
    developmentMarkers: [
      p("zieltransparenz fehlt", 7, "development"),
      p("funktion was bringt das", 6, "development"),
      p("was bringt das", 5, "development"),
      p("einstieg passt nicht zur stunde", 6, "development")
    ],
    singleWordTokens: [tok("zielklarheit", 5), tok("zieltransparenz", 5), tok("funktion", 4)]
  });

  add("1.1.7", {
    positiveMarkers: [p("sichern was zu sichern ist", 6, "positive"), p("zentrale erkenntnis wird gesichert", 7, "positive")],
    developmentMarkers: [
      p("sicherung fehlt", 8, "development"),
      p("sicherung zu kurz", 7, "development"),
      p("zu kurz schaffen sie nicht", 7, "development"),
      p("zu knapp", 6, "development"),
      p("nur ergebnisse gesichert", 7, "development"),
      p("keine erkenntnisse", 7, "development"),
      p("keine verallgemeinerung erkennbar", 7, "development"),
      p("zwischensicherung waere sinnvoll", 6, "development")
    ],
    singleWordTokens: [tok("zwischensicherung", 5), tok("verallgemeinerung", 5), tok("sicherung", 4)]
  });

  add("1.2.1", {
    positiveMarkers: [
      p("diagnose der klarheit passt", 7, "positive"),
      p("verschafft sich klarheit", 7, "positive"),
      p("auftrag wird abgesichert", 6, "positive"),
      p("wer kann erklaeren was zu tun ist", 7, "positive")
    ],
    developmentMarkers: [
      p("keine diagnose", 8, "development"),
      p("sie betreiben keine diagnose", 8, "development"),
      p("alles klar", 5, "development"),
      p("seid ihr alle fertig", 6, "development"),
      p("koennen die das jetzt", 6, "development"),
      p("schueler gaukeln verstaendnis vor", 7, "development"),
      p("gaukeln verstaendnis vor", 7, "development")
    ],
    teacherPhrases: [p("gibt es noch fragen", 4, "development"), p("alles klar", 5, "development")],
    singleWordTokens: [tok("diagnose", 6), tok("klarheit", 4)]
  });

  add("1.2.2", {
    developmentMarkers: [p("schuelerbeitrag wird ignoriert", 7, "development"), p("der schueler meinte", 4, "development")],
    positiveMarkers: [p("schuelerbeitrag wird aufgegriffen", 7, "positive")]
  });

  add("1.2.4", {
    positiveMarkers: [p("begruendung wird eingefordert", 7, "positive"), p("warum wird nachgefragt", 6, "positive")],
    developmentMarkers: [p("einwort antwort wird akzeptiert", 7, "development"), p("keine begruendung eingefordert", 8, "development")]
  });

  add("1.2.5", {
    developmentMarkers: [
      p("ich habe nichts kapiert", 7, "development"),
      p("ich verstehe nicht", 7, "development"),
      p("kapiere ich nicht", 7, "development"),
      p("kapier ich nicht", 7, "development"),
      p("nicht kapiert", 6, "development"),
      p("verstaendnisprobleme bleiben stehen", 7, "development"),
      p("keiner kapiert etwas", 7, "development")
    ],
    studentPhrases: [p("ich habe nichts kapiert", 7, "development"), p("ich verstehe nicht", 7, "development"), p("kapiere ich nicht", 7, "development")],
    singleWordTokens: [tok("kapiere", 6), tok("kapier", 6), tok("kapiert", 6)]
  });

  add("1.3.3", {
    developmentMarkers: [
      p("sie loesen das selbst", 8, "development"),
      p("was machen die schueler", 6, "development"),
      p("lehrkraft nimmt loesung vorweg", 7, "development")
    ],
    positiveMarkers: [p("schueler entwickeln eigenen ansatz", 7, "positive")]
  });

  add("1.3.4", {
    positiveMarkers: [p("selbsterklaerung eingefordert", 7, "positive"), p("wer kann mir erklaeren", 5, "positive")],
    developmentMarkers: [
      p("einwort antwort wird akzeptiert", 8, "development"),
      p("lehrer ergaenzt den rest", 7, "development"),
      p("sagt nur ein wort", 6, "development")
    ]
  });

  add("1.3.5", {
    developmentMarkers: [p("aufgabe ueberfordert", 6, "development"), p("nur afb 1", 6, "development")]
  });

  add("1.4.1", {
    positiveMarkers: [p("schueler arbeiten fokussiert weiter", 7, "positive")],
    developmentMarkers: [
      p("schueler faengt nicht an", 7, "development"),
      p("unaufmerksam", 5, "development"),
      p("fokus fehlt", 5, "development")
    ]
  });

  add("1.4.2", {
    developmentMarkers: [p("geringe beteiligung", 7, "development"), p("einwort antwort wird akzeptiert", 6, "development")],
    positiveMarkers: [p("fachliche beteiligung breit", 7, "positive")]
  });

  add("1.4.3", {
    developmentMarkers: [p("sagt nur ein wort", 7, "development"), p("einwort antwort", 7, "development"), p("lehrer ignoriert", 5, "development")],
    positiveMarkers: [p("laengerer fachlicher beitrag", 7, "positive")]
  });

  add("1.4.5", {
    developmentMarkers: [p("schueler macht nichts", 7, "development"), p("gruppe arbeitet nicht weiter", 7, "development")],
    positiveMarkers: [p("arbeiten fachlich weiter", 7, "positive")]
  });

  add("2.1.1", {
    developmentMarkers: [p("qualitaet", 3, "development"), p("ihr habt aber schon gearbeitet", 5, "development")],
    positiveMarkers: [p("feedback bezieht sich konkret auf die qualitaet", 7, "positive")]
  });

  add("2.1.3", {
    developmentMarkers: [p("ausblick fehlt", 7, "development"), p("wie weiter fehlt", 6, "development")],
    positiveMarkers: [p("hinweis zur weiterarbeit", 7, "positive")]
  });

  add("2.2.1", {
    developmentMarkers: [
      p("keiner kapiert etwas", 7, "development"),
      p("ich verstehe nicht", 7, "development"),
      p("kapiere ich nicht", 7, "development"),
      p("kapier ich nicht", 7, "development"),
      p("nicht kapiert", 6, "development"),
      p("ueberforderung", 6, "development")
    ],
    positiveMarkers: [p("verstaendnisproblem gezielt unterstuetzt", 7, "positive")]
  });

  add("2.2.2", {
    developmentMarkers: [
      p("erklaert zu viel", 7, "development"),
      p("erklaerung ueberfordert", 7, "development"),
      p("keine variation der erklaerung", 7, "development"),
      p("anschaulichkeit hilft hier nicht weiter", 6, "development"),
      p("kapiere ich nicht", 5, "development"),
      p("kapier ich nicht", 5, "development")
    ],
    positiveMarkers: [p("erklaerung variiert", 7, "positive"), p("erklaerung knuepft an vorwissen an", 7, "positive")]
  });

  add("2.2.4", {
    developmentMarkers: [
      p("zu wenig zeit zum nachdenken", 10, "development"),
      p("zu wenig zeit zum denken", 10, "development"),
      p("zu wenig denkzeit", 10, "development"),
      p("kaum denkzeit", 10, "development"),
      p("keine denkzeit", 10, "development"),
      p("nicht genug zeit zum nachdenken", 9, "development")
    ],
    positiveMarkers: [
      p("ausreichend zeit zum nachdenken", 9, "positive"),
      p("denkzeit wird gegeben", 9, "positive")
    ],
    singleWordTokens: [tok("nachdenken", 8), tok("denkzeit", 8), tok("denkpause", 7)]
  });

  add("2.2.3", {
    developmentMarkers: [p("vorwissen", 5, "development"), p("gruppen sind nicht heterogen genug", 5, "development"), p("gruppen sind nicht heterogen", 5, "development"), p("zu viel text", 4, "development")],
    positiveMarkers: [p("knuepft an vorwissen an", 7, "positive")]
  });

  add("2.4.2", {
    positiveMarkers: [p("fertige helfen anderen", 7, "positive"), p("unterstuetzen sich gegenseitig", 7, "positive")],
    developmentMarkers: [p("keine gegenseitige unterstuetzung", 7, "development")]
  });

  add("2.4.5", {
    positiveMarkers: [p("gemeinsame aufgabe traegt", 7, "positive"), p("austausch ist fachlich notwendig", 7, "positive")],
    developmentMarkers: [
      p("zusammenarbeit nicht moeglich", 8, "development"),
      p("tauschen sich nicht aus", 8, "development"),
      p("aufgabe bedarf keinen austausch", 8, "development"),
      p("gruppenarbeit erzeugt keinen mehrwert", 8, "development"),
      p("jeder fuer sich", 7, "development"),
      p("gruppen groesser 4", 5, "development"),
      p("gemeinsame aufgabe fehlt", 7, "development")
    ],
    singleWordTokens: [tok("kooperationserfahrung", 5), tok("zusammenarbeit", 5)]
  });

  add("2.4.6", {
    developmentMarkers: [p("hat keinen partner", 8, "development"), p("xy hat keinen partner", 8, "development"), p("schueler macht nicht mit", 7, "development"), p("macht nicht mit", 7, "development")],
    studentPhrases: [p("der macht nicht mit", 7, "development"), p("macht nicht mit", 7, "development")]
  });

  add("3.1.2", {
    developmentMarkers: [p("zu laut", 8, "development"), p("lautstaerke passt nicht", 8, "development")],
    positiveMarkers: [p("lautstaerke passt zur phase", 7, "positive")]
  });

  add("3.1.3", {
    developmentMarkers: [
      p("einzelarbeit wird nicht konsequent eingehalten", 8, "development"),
      p("tauschen sich schon aus", 6, "development"),
      p("absprachen unklar", 6, "development")
    ],
    positiveMarkers: [p("arbeitsform wird klar kommuniziert", 7, "positive")]
  });

  add("3.2.1", {
    positiveMarkers: [p("geht rum", 6, "positive"), p("lernprozesse werden wahrgenommen", 7, "positive")],
    developmentMarkers: [
      p("lehrer geht nicht rum", 8, "development"),
      p("meldungen nicht bemerkt", 7, "development"),
      p("meldungen nicht gesehen", 7, "development"),
      p("bemerken die meldungen nicht", 7, "development"),
      p("geht nicht rum", 7, "development"),
      p("schaut nicht in die gruppen", 7, "development"),
      p("diagnose fehlt", 7, "development")
    ]
  });

  add("3.2.3", {
    developmentMarkers: [p("reden in die unruhe rein", 8, "development"), p("stoerung wird nicht aufgegriffen", 8, "development")],
    positiveMarkers: [p("stoerung wird kurz aufgegriffen", 7, "positive")]
  });

  add("3.2.4", {
    developmentMarkers: [
      p("lehrer haelt sich nur bei einer gruppe auf", 8, "development"),
      p("zu lange bei einer gruppe", 8, "development"),
      p("meldungen nicht bemerkt", 7, "development"),
      p("mehrere warten", 6, "development")
    ],
    positiveMarkers: [p("zwischenstopp buendelt gleiche fragen", 7, "positive")]
  });

  add("3.2.5", {
    developmentMarkers: [
      p("schueler faengt nicht an", 7, "development"),
      p("schueler macht nichts", 7, "development"),
      p("macht ein schueler nichts", 7, "development"),
      p("gruppe wartet", 7, "development"),
      p("ueberforderung", 6, "development"),
      p("unterstuetzungsbedarf bleibt liegen", 8, "development")
    ]
  });

  add("3.2.7", {
    developmentMarkers: [p("reden in die unruhe rein", 6, "development"), p("signal fehlt", 6, "development")],
    positiveMarkers: [p("kurzer stopp klaert", 7, "positive")]
  });

  add("3.3.2", {
    developmentMarkers: [
      p("viel zu lang", 8, "development"),
      p("zu kurz schaffen sie nicht", 7, "development"),
      p("zu wenig zeit zum nachdenken", 8, "development"),
      p("zu wenig zeit zum denken", 8, "development"),
      p("zu wenig denkzeit", 8, "development"),
      p("kaum denkzeit", 8, "development"),
      p("keine denkzeit", 8, "development"),
      p("zeitangabe fehlt", 6, "development"),
      p("bearbeitungszeit passt nicht", 7, "development")
    ],
    positiveMarkers: [p("zeitangabe wird mitgeteilt", 7, "positive"), p("zeitplanung passt", 7, "positive")],
    singleWordTokens: [tok("nachdenken", 6), tok("denkzeit", 6), tok("wartezeit", 5)]
  });

  add("3.3.3", {
    developmentMarkers: [p("einstieg passt nicht zur stunde", 4, "development")],
    positiveMarkers: [p("unterricht beginnt zuegig fachlich", 7, "positive")]
  });

  add("3.3.4", {
    positiveMarkers: [
      p("arbeitsauftrag gut abgesichert", 8, "positive"),
      p("auftrag wirkt klar", 7, "positive"),
      p("sichert arbeitsauftrag ab", 8, "positive"),
      p("wer arbeitet mit wem", 7, "positive"),
      p("woran merkt ihr dass ihr fertig seid", 7, "positive"),
      p("was macht ihr wenn ihr fertig seid", 7, "positive")
    ],
    developmentMarkers: [
      p("arbeitsauftrag nicht abgesichert", 8, "development"),
      p("arbeitsauftrag vollkommen unklar", 8, "development"),
      p("auftrag unklar", 8, "development"),
      p("uebergang verwirrend", 7, "development"),
      p("was sollen die jetzt machen", 8, "development"),
      p("was sollen wir machen", 8, "development"),
      p("was machen die genau", 6, "development"),
      p("setzt euch mal irgendwie zusammen", 8, "development"),
      p("wer mit wem", 6, "development")
    ],
    teacherPhrases: [p("setzt euch mal irgendwie zusammen", 8, "development")],
    studentPhrases: [p("was sollen wir machen", 8, "development"), p("was sollen wir jetzt machen", 8, "development")]
  });

  add("3.3.5", {
    developmentMarkers: [p("links gehen nicht", 7, "development"), p("material fehlt", 7, "development"), p("ab funktioniert nicht", 7, "development")],
    positiveMarkers: [p("material liegt bereit", 7, "positive")]
  });

  add("3.3.6", {
    developmentMarkers: [
      p("zu wenig zeit zum nachdenken", 7, "development"),
      p("zu wenig zeit zum denken", 7, "development"),
      p("zu wenig denkzeit", 7, "development"),
      p("kaum denkzeit", 7, "development"),
      p("zu kurz", 6, "development"),
      p("zu knapp", 6, "development"),
      p("sicherung zu kurz", 7, "development"),
      p("abschreibzeit", 5, "development"),
      p("koennen die das jetzt", 6, "development")
    ],
    positiveMarkers: [p("ausreichend zeit fuer sicherung", 7, "positive")],
    singleWordTokens: [tok("nachdenken", 5), tok("denkzeit", 5)]
  });

  add("3.3.7", {
    positiveMarkers: [p("leerlauf vermieden", 7, "positive"), p("fertige helfen anderen", 6, "positive")],
    developmentMarkers: [
      p("leerlauf", 8, "development"),
      p("wir sind fertig", 6, "development"),
      p("schueler steht auf", 5, "development"),
      p("laesst dennoch laufen", 7, "development")
    ],
    studentPhrases: [p("wir sind fertig", 6, "development")]
  });

  add("1.2.1", {
    developmentMarkers: [
      p("immer derselbe schueler", 7, "development"),
      p("schueler xy zum vierten mal", 6, "development"),
      p("nur optimalloesung", 6, "development"),
      p("nur die optimalloesung", 7, "development"),
      p("nehmen nur die optimalloesung", 7, "development"),
      p("denkprozesse bleiben verdeckt", 7, "development")
    ]
  });

  add("1.2.2", {
    developmentMarkers: [
      p("sie haben nicht richtig zugehoert", 7, "development"),
      p("nur optimalloesung", 8, "development"),
      p("nur die optimalloesung", 8, "development"),
      p("nehmen nur die optimalloesung", 8, "development"),
      p("nur glatte loesung", 8, "development"),
      p("andere loesungen werden nicht aufgegriffen", 8, "development"),
      p("schuelerbeitraege werden nicht wirklich gehoert", 8, "development")
    ]
  });

  add("1.2.7", {
    developmentMarkers: [
      p("nur optimalloesung", 8, "development"),
      p("nur die optimalloesung", 8, "development"),
      p("nehmen nur die optimalloesung", 8, "development"),
      p("nur glatte loesung", 8, "development"),
      p("irrwege werden nicht genutzt", 8, "development"),
      p("wie sichern sie die ergebnisse ab", 7, "development"),
      p("ergebnisse sehr verschieden", 6, "development")
    ],
    positiveMarkers: [p("unterschiedliche ergebnisse werden sichtbar", 7, "positive")]
  });

  add("1.3.2", {
    developmentMarkers: [
      p("nur optimalloesung", 8, "development"),
      p("nur die optimalloesung", 8, "development"),
      p("nehmen nur die optimalloesung", 8, "development"),
      p("nur glatte loesung", 8, "development"),
      p("loesungen werden nicht verglichen", 8, "development"),
      p("ergebnisse sehr verschieden", 6, "development")
    ],
    positiveMarkers: [p("verschiedene ergebnisse werden verglichen", 7, "positive")]
  });

  add("1.3.6", {
    developmentMarkers: [
      p("nur optimalloesung", 7, "development"),
      p("nur die optimalloesung", 7, "development"),
      p("nehmen nur die optimalloesung", 7, "development"),
      p("irrwege werden nicht genutzt", 8, "development"),
      p("fehler werden nicht aufgegriffen", 8, "development")
    ],
    positiveMarkers: [p("fehler an der tafel wird fachlich geklaert", 7, "positive")]
  });

  add("1.3.4", {
    positiveMarkers: [p("praesentation fachlich angeleitet", 7, "positive")],
    developmentMarkers: [
      p("praesentation nicht angeleitet", 8, "development"),
      p("schueler sitzt bei praesentation", 5, "development"),
      p("sie sagen was man kapieren muss nicht die schueler", 8, "development")
    ]
  });

  add("1.4.2", {
    developmentMarkers: [
      p("immer derselbe schueler", 8, "development"),
      p("schueler xy zum vierten mal", 7, "development")
    ]
  });

  add("1.4.3", {
    developmentMarkers: [
      p("praesentation nicht angeleitet", 8, "development"),
      p("schueler sitzt bei praesentation", 5, "development")
    ],
    positiveMarkers: [p("praesentation fachlich angeleitet", 7, "positive")]
  });

  add("1.4.6", {
    positiveMarkers: [p("meldekette traegt fachliche bezuege", 7, "positive")],
    developmentMarkers: [p("meldekette mechanisch", 7, "development")]
  });

  add("2.1.1", {
    developmentMarkers: [p("qualitaet der ergebnisse", 7, "development")]
  });

  add("2.1.2", {
    developmentMarkers: [
      p("qualitaet der ergebnisse", 8, "development"),
      p("fachliche tragfaehigkeit wird nicht markiert", 8, "development"),
      p("nur dass etwas gesagt wurde", 6, "development")
    ],
    positiveMarkers: [p("tragfaehigkeit der loesung wird markiert", 8, "positive")]
  });

  add("2.1.5", {
    developmentMarkers: [p("fehler an der tafel", 7, "development"), p("fachlicher fehler", 6, "development")],
    positiveMarkers: [p("fehler wird fachlich geklaert", 8, "positive")]
  });

  add("2.2.1", {
    developmentMarkers: [p("sie halten sich zu stark zurueck", 7, "development")]
  });

  add("2.2.5", {
    developmentMarkers: [p("sie halten sich zu stark zurueck", 7, "development"), p("hilfe bleibt aus", 7, "development")],
    positiveMarkers: [p("hilfe passt zum lernstand", 7, "positive")]
  });

  add("2.3.1", {
    positiveMarkers: [p("guten morgen", 5, "positive"), p("danke", 6, "positive"), p("wertschaetzend", 7, "positive")],
    developmentMarkers: [p("hi moin lets go", 4, "development")]
  });

  add("2.3.3", {
    developmentMarkers: [p("sie haben nicht richtig zugehoert", 7, "development")]
  });

  add("2.4.1", {
    positiveMarkers: [p("meldekette traegt", 6, "positive")],
    developmentMarkers: [p("meldekette mechanisch", 6, "development")]
  });

  add("3.2.2", {
    developmentMarkers: [p("sie halten sich zu stark zurueck", 6, "development")]
  });

  add("3.2.6", {
    developmentMarkers: [
      p("diskussion ufert aus", 8, "development"),
      p("diskussion driftet ab", 8, "development"),
      p("ins faseln kommen", 7, "development")
    ],
    positiveMarkers: [p("leitplanken gesetzt", 7, "positive")]
  });

  add("3.3.2", {
    developmentMarkers: [p("fangen zu spaet an", 7, "development")]
  });

  add("3.3.6", {
    developmentMarkers: [p("fangen zu spaet an", 8, "development"), p("bis der letzte fertig ist", 7, "development")]
  });

  add("1.1.1", {
    developmentMarkers: [p("sie sagen was man kapieren muss nicht die schueler", 7, "development")]
  });

  add("1.1.2", {
    positiveMarkers: [p("material traegt zum lernprozess bei", 7, "positive")],
    developmentMarkers: [
      p("arbeitsmaterial", 5, "development"),
      p("aufgabenabhaengigkeit", 7, "development"),
      p("kognitive load", 7, "development")
    ]
  });

  add("1.1.3", {
    developmentMarkers: [p("fehler an der tafel", 7, "development")]
  });

  add("1.1.5", {
    developmentMarkers: [p("sie sagen was man kapieren muss nicht die schueler", 7, "development")]
  });

  add("1.1.7", {
    developmentMarkers: [
      p("wie sichern sie die ergebnisse ab", 7, "development"),
      p("fehler an der tafel", 5, "development")
    ]
  });

  add("3.3.4", {
    developmentMarkers: [p("was machen die genau", 6, "development")]
  });

  root.USER_CORPUS_CALIBRATION_VERSION = "2026-05-13.1";

  if (typeof module !== "undefined") {
    module.exports = { version: root.USER_CORPUS_CALIBRATION_VERSION };
  }
})(typeof window !== "undefined" ? window : globalThis);
