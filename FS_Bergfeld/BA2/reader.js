let dimensions = [];
let subcategories = [];
let readerChart = null;
let currentSession = null;

const states = {
  0: { label: "neutral / nicht markiert", evidenceScore: 0, developmentScore: 0 },
  1: { label: "ansatzweise lerntragend sichtbar", evidenceScore: 1, developmentScore: 0 },
  2: { label: "deutlich lerntragend sichtbar", evidenceScore: 2, developmentScore: 0 },
  3: { label: "mögliches Entwicklungspotenzial", evidenceScore: 0, developmentScore: 1 },
  4: { label: "zentrales Entwicklungspotenzial", evidenceScore: 0, developmentScore: 2 }
};

const readerFile = document.querySelector("#readerFile");
const readerIntro = document.querySelector("#readerIntro");
const readerOutput = document.querySelector("#readerOutput");
const readerMeta = document.querySelector("#readerMeta");
const readerEvidence = document.querySelector("#readerEvidence");
const readerDevelopment = document.querySelector("#readerDevelopment");
const readerLogbook = document.querySelector("#readerLogbook");

document.addEventListener("DOMContentLoaded", async () => {
  await loadStructure();
  readerFile.addEventListener("change", importReaderSession);
  document.querySelector("#printReaderBtn").addEventListener("click", () => window.print());
});

async function loadStructure() {
  const source = await fetch("app.js?v=20260511-obsmeta").then((response) => response.text());
  dimensions = extractConst(source, "dimensions");
  subcategories = dimensions.flatMap((dimension) =>
    dimension.subcategories.map((subcategory) => ({ ...subcategory, dimension }))
  );
}

function extractConst(source, name) {
  const start = source.indexOf(`const ${name} = `);
  if (start === -1) {
    throw new Error(`Struktur ${name} nicht gefunden.`);
  }
  const valueStart = start + `const ${name} = `.length;
  const end = source.indexOf(";\n\n", valueStart);
  return Function(`"use strict"; return (${source.slice(valueStart, end)});`)();
}

function importReaderSession(event) {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      currentSession = normalizeSession(JSON.parse(reader.result));
      renderReader();
    } catch {
      alert("Die JSON-Datei konnte im Reader nicht geöffnet werden.");
    } finally {
      readerFile.value = "";
    }
  });
  reader.readAsText(file);
}

function normalizeSession(candidate) {
  return {
    observationInfo: normalizedObservationInfo(candidate.observationInfo),
    observations: candidate.observations ?? {},
    rawObservations: Array.isArray(candidate.rawObservations) ? candidate.rawObservations : [],
    condensationCards: candidate.condensationCards ?? {},
    cardMeta: candidate.cardMeta ?? {},
    customCards: Array.isArray(candidate.customCards) ? candidate.customCards : [],
    logbook: Array.isArray(candidate.logbook) ? candidate.logbook : []
  };
}

function renderReader() {
  readerIntro.classList.add("hidden");
  readerOutput.classList.remove("hidden");
  renderMeta();
  renderChart();
  renderCards();
  renderLogbook();
}

function renderMeta() {
  const info = normalizedObservationInfo(currentSession.observationInfo);
  const rows = [
    ["Datum", formatDate(info.date)],
    ["Ort", info.place],
    ["Name", info.name],
    ["Lerngruppe", info.group]
  ].filter(([, value]) => value);

  readerMeta.innerHTML = `
    <h2>Protokoll</h2>
    <p>Strukturierte Gesprächsgrundlage, keine Gesamtbewertung.</p>
    ${rows.length ? `
      <dl class="protocol-meta">
        ${rows.map(([label, value]) => `
          <div>
            <dt>${label}</dt>
            <dd>${escapeHtml(value)}</dd>
          </div>
        `).join("")}
      </dl>
    ` : ""}
  `;
}

function renderChart() {
  const entries = subcategories.map((subcategory) => ({
    label: subcategory.chartLabel,
    ...subcategoryStats(subcategory)
  }));

  const data = {
    labels: entries.map((entry) => entry.label),
    datasets: [
      {
        label: "Lerntragende Evidenzen",
        data: entries.map((entry) => Number(entry.evidenceValue.toFixed(3))),
        borderColor: "#32895a",
        backgroundColor: "rgba(50, 137, 90, 0.18)",
        pointBackgroundColor: "#32895a",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
        borderWidth: 2
      },
      {
        label: "Entwicklungspotenziale",
        data: entries.map((entry) => Number(entry.developmentValue.toFixed(3))),
        borderColor: "#2369a8",
        backgroundColor: "rgba(35, 105, 168, 0.13)",
        pointBackgroundColor: "#2369a8",
        pointBorderColor: "#ffffff",
        pointRadius: 4,
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: { stepSize: 0.5, backdropColor: "transparent", color: "#69787f" },
        pointLabels: { color: "#263840", font: { size: 10, weight: 700 } },
        grid: { color: "#d9e2e3" },
        angleLines: { color: "#d9e2e3" }
      }
    },
    plugins: { legend: { position: "bottom" } }
  };

  if (readerChart) {
    readerChart.data = data;
    readerChart.update();
  } else {
    readerChart = new Chart(document.querySelector("#readerChart"), { type: "radar", data, options });
  }
}

function renderCards() {
  if (currentSession.rawObservations.length) {
    const clusters = buildReaderClusters().filter((cluster) => cluster.meta.focus || cluster.meta.relevant || cluster.valence !== "neutral");
    readerEvidence.innerHTML = renderReaderClusterList(clusters.filter((cluster) => cluster.valence === "positive"));
    readerDevelopment.innerHTML = renderReaderClusterList(clusters.filter((cluster) => cluster.valence === "development" || cluster.valence === "free"));
    return;
  }
  const cards = markedItems().filter((card) => !card.meta.hidden);
  const evidence = cards.filter((card) => card.value === 1 || card.value === 2).sort(cardSort);
  const development = cards.filter((card) => card.value === 3 || card.value === 4).sort(cardSort);
  readerEvidence.innerHTML = renderProtocolList(evidence, customCardsByType("evidence"));
  readerDevelopment.innerHTML = renderProtocolList(development, customCardsByType("development"));
}

function buildReaderClusters() {
  const groups = new Map();
  currentSession.rawObservations.filter((observation) => !observation.archived).forEach((observation) => {
    const ids = observation.valence === "free" || !observation.confirmedItemIds?.length ? ["free"] : observation.confirmedItemIds;
    ids.forEach((id) => {
      const key = `${observation.valence}:${id}`;
      if (!groups.has(key)) {
        groups.set(key, {
          key,
          itemId: id,
          subcategory: subcategories.find((candidate) => candidate.id === id),
          valence: observation.valence,
          observations: [],
          meta: currentSession.condensationCards[key] ?? {}
        });
      }
      groups.get(key).observations.push(observation);
    });
  });
  return Array.from(groups.values()).sort((a, b) => b.observations.length - a.observations.length);
}

function renderReaderClusterList(clusters) {
  if (!clusters.length) {
    return `<p>Keine Karten ausgewählt.</p>`;
  }
  return `
    <ul class="protocol-list">
      ${clusters.map((cluster) => `
        <li>
          <strong>${escapeHtml(cluster.subcategory ? cluster.subcategory.title : "Freie professionelle Beobachtung")}</strong><br>
          ${escapeHtml(cluster.valence === "positive" ? "Lerntragende Wirkung" : cluster.valence === "development" ? "Entwicklungspotenzial" : "Freie Beobachtung")} · ${cluster.observations.length} Beleg(e)<br>
          ${cluster.observations.slice(0, 2).map((observation) => escapeHtml(observation.text)).join("<br>")}
        </li>
      `).join("")}
    </ul>
  `;
}

function renderProtocolList(cards, customCards = []) {
  if (!cards.length && !customCards.length) {
    return `<p>Keine Karten ausgewählt.</p>`;
  }

  const itemRows = cards.map((card) => `
    <li>
      <strong>${keywordFor(card)}</strong><br>
      <span>${escapeHtml(card.meta.note || card.meta.observationNote || card.item)}</span><br>
      <small>${card.state.label} · ${card.subcategory.title}</small>
    </li>
  `).join("");
  const customRows = customCards.map((card) => `
    <li>
      <strong>${escapeHtml(card.title)}</strong><br>
      <span>${escapeHtml(card.note || "")}</span>
    </li>
  `).join("");
  return `<ul class="protocol-list">${itemRows}${customRows}</ul>`;
}

function renderLogbook() {
  const entries = currentSession.logbook ?? [];
  if (!entries.length) {
    readerLogbook.innerHTML = "";
    return;
  }

  readerLogbook.innerHTML = `
    <h2>Logbuch</h2>
    <ul class="protocol-list">
      ${entries.map((entry) => `
        <li>
          <strong>${formatTime(entry.createdAt)}${entry.heading ? ` · ${escapeHtml(entry.heading)}` : ""}</strong><br>
          ${entry.duration ? `<em>Zeitvorgabe:</em> ${escapeHtml(entry.duration)}<br>` : ""}
          ${renderObservations(entry)}
          ${entry.alternative ? `<em>Alternativen/Hinweise:</em> ${escapeHtml(entry.alternative)}<br>` : ""}
          ${(entry.groups ?? []).map((group) => `<em>${escapeHtml(group.label)}:</em> ${escapeHtml(group.note)}`).join("<br>")}
          ${(entry.quotes ?? []).map((quote) => `<br><em>${quoteLabel(quote.type)}${quote.name ? ` · ${escapeHtml(quote.name)}` : ""}:</em> ${escapeHtml(quote.text)}${quote.hint ? ` (${escapeHtml(quote.hint)})` : ""}`).join("")}
        </li>
      `).join("")}
    </ul>
  `;
}

function renderObservations(entry) {
  const observations = entry.observations?.length ? entry.observations : [entry.observation ?? entry.text ?? ""].filter(Boolean);
  return observations.map((observation) => `<em>Beobachtung:</em> ${escapeHtml(observation)}<br>`).join("");
}

function markedItems() {
  const cards = [];
  subcategories.forEach((subcategory, subcategoryIndex) => {
    subcategory.items.forEach((item, itemIndex) => {
      const key = itemKey(subcategory.id, itemIndex);
      const value = Number(currentSession.observations[key] ?? 0);
      if (!value) {
        return;
      }
      cards.push({
        key,
        value,
        state: states[value],
        item,
        subcategory,
        meta: currentSession.cardMeta[key] ?? {},
        subcategoryIndex,
        dimensionIndex: dimensions.findIndex((dimension) => dimension.id === subcategory.dimension.id)
      });
    });
  });
  return cards;
}

function subcategoryStats(subcategory) {
  const values = subcategory.items.map((_, index) => Number(currentSession.observations[itemKey(subcategory.id, index)] ?? 0));
  const evidenceScoreSum = values.reduce((sum, value) => sum + (states[value]?.evidenceScore ?? 0), 0);
  const developmentScoreSum = values.reduce((sum, value) => sum + (states[value]?.developmentScore ?? 0), 0);
  const maxScore = subcategory.items.length * 2;
  return {
    evidenceValue: maxScore > 0 ? evidenceScoreSum / maxScore : 0,
    developmentValue: maxScore > 0 ? developmentScoreSum / maxScore : 0
  };
}

function customCardsByType(type) {
  return (currentSession.customCards ?? []).filter((card) => card.type === type && !card.hidden);
}

function cardSort(a, b) {
  const priority = { 4: 0, 3: 1, 2: 0, 1: 1 };
  return priority[a.value] - priority[b.value]
    || a.dimensionIndex - b.dimensionIndex
    || a.subcategoryIndex - b.subcategoryIndex;
}

function keywordFor(card) {
  return card.subcategory.title.replace(/^\d\.\d\s*/, "");
}

function itemKey(subcategoryId, index) {
  return `${subcategoryId}:${index}`;
}

function normalizedObservationInfo(info = {}) {
  return {
    date: info.date || "",
    place: info.place || "",
    name: info.name || "",
    group: info.group || ""
  };
}

function formatDate(value) {
  if (!value) {
    return "";
  }
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}.${month}.${year}` : value;
}

function formatTime(value) {
  if (!value) {
    return "";
  }
  return new Date(value).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
}

function quoteLabel(type) {
  return type === "s-lehrkraft" ? "Zitat LK" : "Zitat SuS";
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
