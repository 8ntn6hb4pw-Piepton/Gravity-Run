# Phase-2-Relationen: Belastungstest

Stand: 2026-05-13

## Ziel

Dieser Test prüft, ob die Verdichtung nicht aus vielen Einzelkarten einen Wust erzeugt, sondern bestätigte Beobachtungen zu fachlich plausiblen Gesprächskarten zusammenführt.

## Regelbasis

- aktive Relationen: 194
- grün / lerntragend: 77
- blau / entwicklungsrelevant: 83
- ambivalent: 34
- davon 2er-Kombinationen: 106
- davon 3er-Kombinationen: 52
- davon 4er+-Kombinationen: 26
- davon starke Einzelpunkte: 10

## Wust-Bremse

Wenn eine stärkere Relation mehrere kleinere Karten fachlich abdeckt, werden die kleineren Karten unterdrückt. Sie sind technisch weiter vorhanden, erscheinen aber nicht als Hauptkarte. Eine mehrfach bestätigte kleinere Karte kann sichtbar bleiben, wenn sie durch Häufung stärker wird als die größere Relation.

## Testszenarien

| Szenario | Sichtbare Hauptkarte | Unterdrückt |
| --- | --- | ---: |
| Ziel, Kern und Sicherung tragen den Lernweg | G069: Verstehen wurde gebündelt | 10 |
| Schülerdenken wird im Gespräch sprachlich sichtbar | G068: Schülerdenken sprachlich sichtbar | 11 |
| Auftrag, Leerlauf und Hilfebedarf verdichten sich | B071: Auftrag-Leerlauf-Hilfebedarf | 5 |
| Zu viel kognitive Last verhindert fachliche Orientierung | B081: Kognitive Last reduzieren | 6 |
| Fehler werden teilweise genutzt, bleiben aber sozial fragil | A034: Fehlerkultur als Chance und Risiko | 5 |

## Wiederholung

```bash
node phase2-relation-evaluation.js
```

Der Test erzeugt JSON mit Karten, Priorität, Itembezügen, Kartentext und Zeitmuster.
