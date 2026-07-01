from __future__ import annotations

import json
import re
import unicodedata
from pathlib import Path

from pypdf import PdfReader


ROOT = Path(__file__).resolve().parent
PDFS = [
    {
        "id": "gesamtschule",
        "title": "Gesamtschule",
        "path": ROOT / "assets" / "klp-gesamtschule-mathematik.pdf",
    },
    {
        "id": "gymnasium",
        "title": "Gymnasium G9",
        "path": ROOT / "assets" / "klp-gymnasium-g9-mathematik.pdf",
    },
]


def clean_text(value: str) -> str:
    return " ".join(value.replace("\x00", " ").split())


def normalize_for_search(value: str) -> str:
    replacements = str.maketrans(
        {
            "ä": "ae",
            "ö": "oe",
            "ü": "ue",
            "Ä": "ae",
            "Ö": "oe",
            "Ü": "ue",
            "ß": "ss",
        }
    )
    value = value.translate(replacements).casefold()
    value = unicodedata.normalize("NFKD", value)
    value = "".join(character for character in value if not unicodedata.combining(character))
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


index = []
for pdf in PDFS:
    reader = PdfReader(pdf["path"])
    pages = []
    for page_number, page in enumerate(reader.pages, start=1):
        text = clean_text(page.extract_text() or "")
        pages.append(
            {
                "page": page_number,
                "text": text,
                "searchText": normalize_for_search(text),
            }
        )
    index.append({"id": pdf["id"], "title": pdf["title"], "pages": pages})

output = "window.KLP_SEARCH_INDEX = "
output += json.dumps(index, ensure_ascii=False, separators=(",", ":"))
output += ";\n"

(ROOT / "search-index.js").write_text(output, encoding="utf-8")
