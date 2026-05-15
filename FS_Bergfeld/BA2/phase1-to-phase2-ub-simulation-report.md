# Phase 1 -> Phase 2: UB-Simulation

Stand: 2026-05-13

## Ziel

Dieser Test prüft nicht einzelne Formulierungen, sondern komplette simulierte Unterrichtsbesuche:

1. rohe Live-Notiz erfassen,
2. wenige UFB-Vorschläge erzeugen,
3. menschliche Tap-Entscheidung simulieren,
4. bestätigte Ereignisse an Phase 2 übergeben,
5. Verdichtungskarten erzeugen,
6. prüfen, ob ein übersichtliches Kartenset statt Wust entsteht.

Es wurde keine UI verändert.

## Umfang

- simulierte UBs: 5
- Live-Ereignisse: 66
- an Phase 2 übergebene Beobachtungen: 65
- bewusst ausgeschlossen: 1 Ereignis durch 3x-Tap / raus
- freie fachliche Beobachtungen: Rahmung, Materialgestaltung, Humor

## Ergebnis

| Kennwert | Ergebnis |
| --- | ---: |
| fehlende Live-Vorschläge | 0 |
| zu viele Live-Vorschläge | 0 |
| Wust-Flags in Phase 2 | 0 |
| fehlende Kernrelationen | 0 |

## Simulierte Unterrichtsbesuche

| Szenario | Phase-2-Karten | Unterdrückt | Hauptmuster |
| --- | ---: | ---: | --- |
| Gruppenarbeit startet unsicher, Leerlauf verdichtet sich | 8 | 3 | Auftrag-Leerlauf-Hilfebedarf; Monitoring-Blindstellen; freie Materialbeobachtung |
| Denkwege und Begründungen tragen das Gespräch | 5 | 7 | Schülerdenken sprachlich sichtbar; Ziel, Kern und Sicherung |
| Feedback und Unterstützung wirken punktuell, bleiben aber uneinheitlich | 2 | 0 | Feedback mit und ohne Ausblick; fachliche Qualität klären |
| Zeit, Material und Sicherung gefährden den fachlichen Kern | 5 | 2 | Sicherung wird Zeitopfer; Ziel und Auftrag unklar; Ergebnisse werden nicht verglichen |
| Fehlerarbeit wird fachlich genutzt, sozial aber fragil | 1 | 2 | Fehlerkultur als Chance und Risiko |

## Nachgeschärft Durch Diesen Test

- Monitoring erkennt nun auch Hinweise wie "LK schaut auf Tafel", wenn Gruppen warten.
- 1.1.2 erkennt Material/Auftrag als kognitive Last bei konkurrierenden Informationen.
- 1.4.1 erkennt fachlichen Fokusverlust bei unterschiedlichen Zielrichtungen.
- 1.4.3 erkennt Präsentationsrückzug nach unsicherer oder beschämender Situation.
- 2.2.3 erkennt fehlende Variation bei Erklärung und passende Hilfekarten.
- 3.3.4 erkennt "Was sollen wir genau abgeben?" als Auftrags-/Übergangsproblem.
- 2.3.1, 2.3.3 und 2.4.2 wurden für Fehlerkultur, Wertschätzung und Peer-Hilfe nachgeschärft.

## Fachlicher Zwischenstand

Die Logik verhält sich jetzt in der gewünschten Richtung:

- Live bleibt assistiv: Das System schlägt vor, es entscheidet nicht.
- Ein bestätigter Tap erzeugt erst die spätere Relevanz.
- 3x-Tap entfernt ein Ereignis zuverlässig aus Phase 2.
- Phase 2 sammelt intern viel, zeigt aber nach außen verdichtete Musterkarten.
- Freie professionelle Beobachtungen werden nicht künstlich ins Spider-Web gezwungen.

## Wiederholung

```bash
node -e 'const sim=require("./phase1-to-phase2-ub-simulation.js").runPhase1ToPhase2UbSimulation(); console.log(JSON.stringify(sim.summary, null, 2));'
```

Der vollständige Test liegt in:

```text
phase1-to-phase2-ub-simulation.js
```
