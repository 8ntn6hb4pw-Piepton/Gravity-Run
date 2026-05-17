# Codex-Prompt: Deep-Research-Datenbank in bestehende App einbauen, nicht neu bauen

Du arbeitest an der bestehenden App „Beobachtungsassistent 1.0“.
Die aktuelle App hat bereits: Werkzeugleiste, Live, Verdichten, Nachbesprechung, Protokoll, Beobachtung, Spider-Web, Beobachtungsfeld, Hinweise/Impulse, manuelle Itemwahl, JSON sichern/öffnen, Browserstand und „Zusammenhänge berechnen“.

## Auftrag

Baue die beigefügte Deep-Research-Datenbank als lokale Wissensbasis ein.
Erfinde die App nicht neu. Ergänze gezielt.

## Zwingende Leitidee

Die App bleibt logbuchzentriert.

Der Nutzer schreibt Beobachtungen und Hinweise frei ins Logbuch.
Items sind nicht die Hauptbedienung, sondern eine Hintergrundstruktur.
Das Spider-Web bleibt als bewusst geöffneter Markierungsmodus erhalten.

## Dateien einbinden

Nutze diese Dateien:

- 00_sources_deep_research.json
- 01_domain_system.json
- 02_observation_items_deep.json
- 03_buzzword_rules_idle_only.json
- 04_condensation_patterns.json
- 05_card_templates.json
- 06_ui_logic_quiet_idle.json
- 07_data_model.json
- 08_quality_gates.json

## Quellenlogik

Unterscheide strikt:

1. Forschungskonstrukte:
   - UFB / IBBW: Tiefenstrukturen, kognitive Aktivierung, konstruktive Unterstützung, strukturierte Klassenführung.
   - Clearing House Unterricht: kognitive Aktivierung als aktive Auseinandersetzung.
   - KMK/IQB: mathematische Kompetenzen.
   - Prediger/Leuders/DZLM: Grundvorstellungen, Darstellungswechsel, Funktionsverständnis.
   - Black & Wiliam: formative Assessment, Feedback.
   - Rosenshine: Checking understanding, guided practice, scaffolding.
   - Mayer: Multimedia Learning, kognitive Entlastung.
   - Worked Examples: Beispielbasiertes Lernen und Selbsterklärung.

2. Modellierte Beobachtungsitems:
   Diese sind aus Quellen abgeleitet, aber nicht wörtlich aus Quellen übernommen.

3. UI-Designentscheidungen:
   Logbuchzentrierung, Spider-Web-Batch, grün/blau-Farblogik und Inaktivitätsrechnung sind Designentscheidungen aus dem Nutzerworkflow. Diese dürfen nicht als Forschungsbefund ausgegeben werden.

## Grün/Blau

Migriere konsequent auf:

- Grün = lerntragende Wirkung / Stärke.
- Blau = Entwicklungshinweis / Klärungsbedarf / Nachbesprechungsfokus.
- Neutral = Kontext / unklar.

Kein Violett.

## Live-Verhalten

Beim Tippen darf die App nicht sichtbar rechnen.

Während aktiver Eingabe:
- lokal speichern,
- Eintrag als dirty markieren,
- keine vollständige Analyse,
- keine Spider-Web-Neuberechnung,
- keine Kartenberechnung,
- keine springenden Vorschläge.

Nach kurzer Inaktivität:
- leichte Keyword-Indexierung,
- dirty entries vormerken,
- keine dominante UI-Änderung.

Nach längerer Inaktivität:
- nur neue/geänderte Einträge analysieren,
- mögliche Item-Links intern vorbereiten,
- Verdichtungen vorbereiten,
- Ergebnisse cachen.

Erst bei Klick auf „Zusammenhänge berechnen“ oder „Auswerten“:
- Karten generieren,
- Verdichtungen priorisieren,
- Spider-Web-Zusammenfassung aktualisieren,
- Nachbesprechungsstruktur erzeugen.

## Spider-Web-Batch

Wenn der Nutzer das Spider-Web öffnet:
- Zustand merken.
- Nutzer darf mehrere Items grün/blau markieren.
- Beim Schließen alle seit Öffnung geänderten Markierungen als genau einen Logbuch-Datensatz speichern.

Dieser Datensatz enthält:
- Zeitstempel,
- Phase,
- grüne Items,
- blaue Items,
- optionalen Kommentar,
- usedForInterpretation = true.

Erzeuge nicht pro Item einen eigenen Logbucheintrag.

## Freie Beobachtungen ohne Itembezug

Ein Logbucheintrag ohne Itembezug bleibt vollwertig.
Keine erzwungene Zuordnung.
Wenn kein sicherer Itembezug gefunden wird:
- als Kontextbeobachtung speichern,
- optional neutral verdichten,
- später mit anderen Einträgen verbinden.

## Verdichtungen

Verdichtungen sind bearbeitbare Sätze aus:
- freien Beobachtungen,
- Hinweisen,
- Spider-Web-Batches,
- wiederkehrenden Mustern,
- grün/blauen Markierungen.

Sie dürfen nie als automatische Wahrheit auftreten.
Formuliere:
- „möglicherweise“,
- „deutet darauf hin“,
- „für die Nachbesprechung lohnt“,
- „könnte relevant sein“.

Der Nutzer kann jede Verdichtung:
- bearbeiten,
- löschen,
- grün/blau/neutral markieren,
- in Karten übernehmen oder ausschließen.

## Gewichtung

Nutze 07_data_model.json.

Nicht Items zählen.
Beobachtungsdaten verdichten.

Hohe Gewichte:
- manuell grün/blau,
- freie Beobachtung mit Hinweis,
- Spider-Web-Batch mit Kommentar,
- wiederkehrendes Muster.

Niedrige Gewichte:
- automatisch vermutete Item-Links ohne Nutzerbestätigung.

## Nachbesprechung

Karten werden aus Verdichtungen erzeugt:

Grüne Karten:
- lerntragende Wirkungen,
- belegbasiert,
- zuerst sichtbar.

Blaue Karten:
- Entwicklungshinweise,
- Klärungsbedarf,
- konkrete nächste Entscheidung.

Neutrale Karten:
- Kontextbeobachtungen nur bei Relevanz.

## Akzeptanztests

Arbeite 08_quality_gates.json ab.
Die Umsetzung ist erst fertig, wenn alle Must-Gates erfüllt sind.
