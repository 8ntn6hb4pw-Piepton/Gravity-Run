# Phase-1-Liveheuristik: Belastungstest

Stand: 2026-05-13

## Ziel

Der Test prüft, ob kurze, unordentliche Unterrichtsnotizen unter Zeitdruck zu wenigen plausiblen Vorschlägen führen.

Die Heuristik bleibt assistiv:

- sie bewertet nicht automatisch,
- sie schlägt nur passende UFB-Items oder freie fachliche Anker vor,
- grün/blau wird durch die Nutzerentscheidung bestätigt,
- neutrale Tendenz ist kein Fehler, sondern Zurückhaltung.

## Umfang

- Testfälle: 82
- abgedeckt: alle UFB-Bereiche sowie freie fachliche Beobachtungen
- Vorschläge pro Fall: maximal 4, praktisch meist 1-3
- freie Anker: Rahmung Unterrichtsbesuch, Fachsprache, Materialgestaltung, Gruppengröße, Humor, Meldekette

## Ergebnis Nach Nachschärfung

| Kennwert | Ergebnis |
| --- | ---: |
| saubere Fälle | 82 / 82 |
| offene Blindstellen | 0 |
| erwartete Itemtreffer | 100 % |
| erwartete freie Anker | 100 % |
| Fälle mit zu vielen Vorschlägen | 0 |
| ungelöste Fallbacks | 0 |

Das ist kein Beweis für pädagogische Wahrheit. Es zeigt aber, dass die aktuell kuratierte Heuristik bei kurzen, realistisch unordentlichen Eingaben nicht ausfranst: Sie liefert wenige plausible Vorschläge, erkennt freie fachliche Beobachtungen und zwingt keine Bewertung.

## Nachgeschärfte Blindstellen

- Begriffe sauber einführen / Beispiele erklären -> 1.1.3
- Schüler sagt ein Wort, Lehrkraft ergänzt den Rest -> 1.3.4
- Nur Einwortantworten werden akzeptiert -> 1.4.2
- Lautstärke verhindert Hörbarkeit einer Präsentation -> 3.1.2
- Auftrag unklar / was zu tun ist / Leerlauf in Gruppen -> 3.3.4, 3.3.7
- Feedback ohne Ausblick -> 2.1.3, 2.1.4

## Konsequenz Für Punkt 1

Die Live-Logik kann als erste tragfähige Baseline gelten:

- Rohbeobachtungen bleiben speicherbar.
- Vorschläge sind assistiv und müssen bestätigt werden.
- Bestätigte grüne/blaue Entscheidungen werden Phase 2 übergeben.
- Nicht bestätigte Vorschläge verändern Spider-Web und Verdichtung nicht endgültig.
- Wiederholte bestätigte Ereignisse zum selben Item erhöhen später die Priorität.
- Freie professionelle Beobachtungen bleiben erhalten, ohne in das UFB-Netz hineingezwungen zu werden.

## Wiederholung

```bash
node -e 'const stress=require("./phase1-live-stress-evaluation.js").runPhase1LiveStressEvaluation(); console.log(JSON.stringify(stress.summary, null, 2));'
```

Der ausführliche Test liegt in:

```text
phase1-live-stress-evaluation.js
```

## Merker Für Spätere UI

Die Logik eignet sich für eine sehr knappe Oberfläche:

- Eingabe bleibt roh und schnell.
- Das System zeigt nur wenige Chips.
- Einmal tippen bestätigt lerntragend.
- Zweimal tippen bestätigt entwicklungsrelevant.
- Dreimal tippen nimmt den Vorschlag aus Phase 2 heraus.
- Offene Ereignisse bleiben für die Nachsortierung erhalten.
