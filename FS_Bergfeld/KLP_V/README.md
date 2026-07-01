# KLP-Vergleich Mathematik

Kleine statische HTML-Seite zum parallelen Lesen der Kernlehrplaene Mathematik:

- Gesamtschule, Kernlehrplan Mathematik 2022
- Gymnasium G9, Kernlehrplan Mathematik 2019

Die Seite kann lokal geoeffnet oder ueber GitHub Pages bereitgestellt werden.

## Dateien

- `index.html`: Vergleichsansicht mit zwei PDF-Fenstern und Suchfeldern
- `search-index.js`: Suchindex fuer Trefferlisten, Mehrwortsuche, Umlautvarianten und Seitenspruenge
- `build_search_index.py`: Hilfsskript zum Neuaufbau des Suchindex nach PDF-Aenderungen
- `assets/klp-gesamtschule-mathematik.pdf`
- `assets/klp-gymnasium-g9-mathematik.pdf`

## GitHub Pages

1. Diesen Ordner als Repository zu GitHub hochladen.
2. In GitHub unter `Settings > Pages` die Bereitstellung aus dem Branch `main` aktivieren.
3. Als Ordner `/root` auswaehlen, wenn `index.html` direkt im Repository liegt.

Falls der gesamte Workspace als Repository genutzt wird, kann die Seite auch aus dem Unterordner `klp-vergleich` heraus verlinkt werden.
