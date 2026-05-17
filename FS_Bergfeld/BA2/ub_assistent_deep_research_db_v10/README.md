# Deep-Research-Datenbank für den UB-Beobachtungsassistenten

Stand: 2026-05-16

Ziel:
Diese Datenbank erweitert die bestehende App „Beobachtungsassistent 1.0“.
Sie ist kein Neubaukonzept, sondern eine strukturierte Wissensbasis für:
- Logbuchzentrierung,
- Spider-Web als bewusster Markierungsmodus,
- grün/blaue Verdichtungen,
- stille Inaktivitätsanalyse,
- quellenmarkierte Beobachtungsindikatoren,
- Nachbesprechungskarten.

Wichtig:
Die Datenbank trennt drei Ebenen:

1. Quellenbasierte Forschungskonstrukte
   Beispiele:
   - Tiefenstrukturen / Basisdimensionen: IBBW/UFB.
   - Kognitive Aktivierung: Clearing House Unterricht.
   - Formative Assessment: Black & Wiliam.
   - Instruktionsprinzipien / Scaffolding: Rosenshine.
   - Multimedia / kognitive Entlastung: Mayer.
   - Worked Examples: Atkinson/Derry/Renkl/Wortham.
   - Mathematische Kompetenzen: KMK/IQB.
   - Grundvorstellungen / Darstellungswechsel: Prediger/Leuders/DZLM.

2. Didaktische Modellierung
   Beispiele:
   - konkrete Beobachtungsitems,
   - grün/blaue Signale,
   - Buzzword-Regeln,
   - Verdichtungssätze,
   - Impulsfragen.

3. Designentscheidungen aus dem Nutzerworkflow
   Beispiele:
   - Logbuch bleibt Zentrum,
   - Spider-Web-Klicks werden beim Schließen als Batch gespeichert,
   - Inaktivität löst stille Analyse aus,
   - grün = lerntragend, blau = Entwicklungshinweis.

Keine Datei behauptet, dass die UI-Logik direkt aus Forschung folgt.
Die UI-Logik ist eine begründete Designentscheidung, die zu deinem Beobachtungsworkflow passt.

Dateien:
- 00_sources_deep_research.json
- 01_domain_system.json
- 02_observation_items_deep.json
- 03_buzzword_rules_idle_only.json
- 04_condensation_patterns.json
- 05_card_templates.json
- 06_ui_logic_quiet_idle.json
- 07_data_model.json
- 08_quality_gates.json
- observation_items.csv
- codex_prompt_deep_research_extension.md
