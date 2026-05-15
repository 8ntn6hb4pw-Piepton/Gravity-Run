# Phase-1-Livelogik: aktueller Stand

Stand: 2026-05-13

## Prinzip

Live-Eingaben werden als rohe Ereignisse gespeichert. Die Heuristik macht Vorschläge, aber nur eine menschliche Tap-Entscheidung wird für Phase 2 wirksam.

## Tap-Logik

| Tap | Bedeutung | Phase 2 |
| ---: | --- | --- |
| 0 | nicht bestätigt | nein |
| 1 | lerntragend bestätigt | ja, grün |
| 2 | entwicklungsrelevant bestätigt | ja, blau |
| 3 | raus / nicht berücksichtigen | nein |

Häufungen entstehen nicht durch mehrfaches Tippen auf demselben Chip, sondern durch wiederholte bestätigte Ereignisse zum selben Item über die Stunde.

## Kontext

Jedes Ereignis speichert automatisch:

- Zeitstempel
- Minute in der Stunde
- Zeitfenster
- Phase
- Sozialform
- optional Methode, Material, Medium, Thema, Fokus

## Testfälle

| Eingabe | Top-Vorschläge |
| --- | --- |
| Die Schüler wissen gerade nicht, was zu tun ist, viel Leerlauf in einzelnen Gruppen. | 3.3.7 Leerlauf vermeiden; 3.3.4 Übergänge und Auftrag klären; 3.2.5 Unterstützungsbedarf erkennen |
| Schüler stören, ich erkenne gerade keine Reaktion. | 3.2.3 früh und angemessen reagieren |
| Gut, dass Sie hier Begründungen von den SuS einfordern. | 1.2.4 Begründungen einfordern |
| Bei Ihrem Feedback fehlt der Ausblick. | 2.1.3 Weiterarbeit ermöglichen; 2.1.1 konkretes Feedback |
| Die Kleidung wirkt für die Unterrichtssituation unangemessen. | keine UFB-Zuordnung; freie professionelle Beobachtung |

## Wiederholung

```bash
node -e 'const live=require("./phase1-live-logic.js"); console.log(JSON.stringify(live.runPhase1LiveLogicTests(), null, 2));'
```
