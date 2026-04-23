const schools = [
  { city: "Haan", type: "Gesamtschule", number: "100011", name: "GE Walder Straße", index: 4 },
  { city: "Haan", type: "Gymnasium", number: "165530", name: "Gym Adlerstr.", index: 2 },
  { city: "Remscheid", type: "Gesamtschule", number: "189285", name: "GE Albert-Einstein-Schule", index: 8 },
  { city: "Remscheid", type: "Gesamtschule", number: "191012", name: "GE Sophie-Scholl", index: 3 },
  { city: "Remscheid", type: "Gymnasium", number: "165256", name: "Gym Leibniz-Gymnasium", index: 2 },
  { city: "Remscheid", type: "Gymnasium", number: "165268", name: "Gym Gertrud-Bäumer", index: 2 },
  { city: "Remscheid", type: "Gymnasium", number: "165270", name: "Gym Emma-Herwegh", index: 4 },
  { city: "Remscheid", type: "Gymnasium", number: "165281", name: "Gym Röntgen", index: 2 },
  { city: "Solingen", type: "Gesamtschule", number: "100203", name: "GE Vogelsang", index: 6 },
  { city: "Solingen", type: "Gesamtschule", number: "188300", name: "GE Alexander-Coppel", index: 6 },
  { city: "Solingen", type: "Gesamtschule", number: "188890", name: "GE Geschwister-Scholl-Schule", index: 5 },
  { city: "Solingen", type: "Gesamtschule", number: "190913", name: "GE Friedrich-Albert-Lange", index: 2 },
  { city: "Solingen", type: "Gesamtschule", number: "198717", name: "GE Höhscheid", index: 7 },
  { city: "Solingen", type: "Gymnasium", number: "165335", name: "Gym Humboldt", index: 2 },
  { city: "Solingen", type: "Gymnasium", number: "165347", name: "Gym Schwertstraße", index: 3 },
  { city: "Solingen", type: "Gymnasium", number: "165359", name: "Gym August-Dicke", index: 3 },
  { city: "Solingen", type: "Gymnasium", number: "165360", name: "Gym Vogelsang", index: 3 },
  { city: "Wülfrath", type: "Gymnasium", number: "165645", name: "Gym Kastanienallee", index: 2 },
  { city: "Wuppertal", type: "Gesamtschule", number: "185772", name: "GE Erich-Fried-Gesamtschule", index: 3 },
  { city: "Wuppertal", type: "Gesamtschule", number: "188669", name: "GE Else Lasker-Schüler", index: 8 },
  { city: "Wuppertal", type: "Gesamtschule", number: "189066", name: "GE Pina-Bausch", index: 4 },
  { city: "Wuppertal", type: "Gesamtschule", number: "189856", name: "GE Langerfeld", index: 7 },
  { city: "Wuppertal", type: "Gesamtschule", number: "192806", name: "GE Barmen", index: 6 },
  { city: "Wuppertal", type: "Gesamtschule", number: "197397", name: "GE Uellendahl-Katernberg", index: 6 },
  { city: "Wuppertal", type: "Gymnasium", number: "165372", name: "Gym Bayreuther Str.", index: 4 },
  { city: "Wuppertal", type: "Gymnasium", number: "165384", name: "Gym Carl-Fuhlrott", index: 2 },
  { city: "Wuppertal", type: "Gymnasium", number: "165402", name: "Gym Carl-Duisberg", index: 5 },
  { city: "Wuppertal", type: "Gymnasium", number: "165414", name: "Gym Vohwinkel", index: 4 },
  { city: "Wuppertal", type: "Gymnasium", number: "165438", name: "Gym Wilhelm-Dörpfeld-Gym", index: 4 },
  { city: "Wuppertal", type: "Gymnasium", number: "165451", name: "Gym Am Kothen", index: 4 },
  { city: "Wuppertal", type: "Gymnasium", number: "165463", name: "Gym Johannes Rau", index: 8 },
  { city: "Wuppertal", type: "Gymnasium", number: "165475", name: "Gym Sedanstr.", index: 6 },
];

const gameShell = document.querySelector(".game-shell");
const setupScreen = document.querySelector("#setupScreen");
const schoolPicker = document.querySelector("#schoolPicker");
const setupCount = document.querySelector("#setupCount");
const startButton = document.querySelector("#startButton");
const sliderStage = document.querySelector("#sliderStage");
const sliderThumb = document.querySelector("#sliderThumb");
const sliderValue = document.querySelector("#sliderValue");
const submitButton = document.querySelector("#submitButton");
const schoolCity = document.querySelector("#schoolCity");
const schoolName = document.querySelector("#schoolName");
const schoolNumber = document.querySelector("#schoolNumber");
const roundCounter = document.querySelector("#roundCounter");
const scoreCounter = document.querySelector("#scoreCounter");
const progressFill = document.querySelector("#progressFill");
const progressText = document.querySelector("#progressText");
const progressScore = document.querySelector("#progressScore");
const feedback = document.querySelector("#feedback");
const historyList = document.querySelector("#historyList");
const accuracyRing = document.querySelector("#accuracyRing");
const accuracyText = document.querySelector("#accuracyText");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const restartButton = document.querySelector("#restartButton");

const sliderColors = ["#d9ebff", "#cde4fb", "#c2ddfb", "#a9cdf2", "#8fbbe8", "#73a7dc", "#568fc8", "#3c73ad", "#244e85"];
const circumference = 2 * Math.PI * 66;
const roundSize = 10;
const typeQuota = 5;
const selectedOwnSchools = new Set();
let deck = [];
let current = 0;
let score = 0;
let history = [];
let locked = false;
let selectedIndex = 1;
let sliderDragging = false;

const praise = [
  "Stark getroffen!",
  "Sehr gut eingeschätzt!",
  "Genau richtig!",
  "Treffer, sauber!",
  "Klasse Zuordnung!",
];

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function schoolLabel(school) {
  return school.name;
}

function buildSchoolPicker() {
  const cities = [...new Set(schools.map((school) => school.city))].sort((a, b) => a.localeCompare(b, "de"));
  schoolPicker.innerHTML = cities.map((city) => {
    const citySchools = schools
      .filter((school) => school.city === city)
      .sort((a, b) => schoolLabel(a).localeCompare(schoolLabel(b), "de"));

    return `
      <section class="city-column" aria-label="${city}">
        <h2>${city}</h2>
        <div class="city-list">
          ${citySchools.map((school) => `
            <button class="school-pick" type="button" data-number="${school.number}">
              ${schoolLabel(school)}
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");
}

function updateSetupCount() {
  const count = selectedOwnSchools.size;
  setupCount.textContent = count === 0
    ? "Keine Schule ausgewählt"
    : `${count} Schule${count === 1 ? "" : "n"} ausgewählt`;
}

function toggleOwnSchool(number) {
  const button = schoolPicker.querySelector(`[data-number="${number}"]`);
  if (!button) return;
  selectedOwnSchools.add(number);
  button.remove();
  updateSetupCount();
}

function startGame() {
  const availableSchools = schools.filter((school) => !selectedOwnSchools.has(school.number));
  deck = buildRoundDeck(availableSchools);
  current = 0;
  score = 0;
  history = [];
  locked = false;
  historyList.innerHTML = "";
  feedback.className = "feedback";
  if (deck.length === 0) {
    gameShell.classList.add("is-playing");
    setupScreen.classList.add("is-hidden");
    schoolCity.textContent = "Keine Auswahl";
    schoolName.textContent = "Keine Schulen gefunden";
    schoolNumber.textContent = "";
    roundCounter.textContent = "0 / 0";
    resultTitle.textContent = "Leere Auswahl";
    resultText.textContent = "Alle Schulen wurden ausgeschlossen.";
    updateStats();
    return;
  }
  gameShell.classList.add("is-playing");
  setupScreen.classList.add("is-hidden");
  renderCurrent();
  updateStats();
  resultTitle.textContent = "Spiel läuft";
  resultText.textContent = "Schiebe den Kreis auf den vermuteten Sozialindex.";
}

function buildRoundDeck(availableSchools) {
  const comprehensiveSchools = shuffle(availableSchools.filter((school) => school.type === "Gesamtschule")).slice(0, typeQuota);
  const grammarSchools = shuffle(availableSchools.filter((school) => school.type === "Gymnasium")).slice(0, typeQuota);
  return shuffle([...comprehensiveSchools, ...grammarSchools]).slice(0, roundSize);
}

function renderCurrent() {
  const school = deck[current];
  schoolCity.textContent = `${school.city} · ${school.type}`;
  schoolName.textContent = school.name;
  schoolNumber.textContent = `Schulnr. ${school.number}`;
  roundCounter.textContent = `${current + 1} / ${deck.length}`;
  feedback.textContent = "";
  feedback.className = "feedback";
  updateSlider(1);
}

function submitGuess() {
  if (locked || current >= deck.length) return;
  locked = true;

  const school = deck[current];
  const guess = selectedIndex;
  const exact = guess === school.index;
  const distance = Math.abs(guess - school.index);
  const roundPoints = pointsForDistance(distance);
  score += roundPoints;

  const entry = { ...school, guess, exact, distance, points: roundPoints };
  history.unshift(entry);
  renderHistory();

  feedback.className = `feedback ${exact ? "good" : "miss"}`;
  feedback.textContent = exact
    ? `${randomPraise()} ${school.name} hat Sozialindex ${school.index}. Dafür gibt es 10 Punkte.`
    : `${school.name} hat Sozialindex ${school.index}, gewählt war ${guess}. Dafür gibt es ${roundPoints} Punkt${roundPoints === 1 ? "" : "e"}.`;

  current += 1;
  updateStats();

  window.setTimeout(() => {
    locked = false;
    if (current >= deck.length) {
      finishGame();
    } else {
      renderCurrent();
    }
  }, 1300);
}

function pointsForDistance(distance) {
  if (distance === 0) return 10;
  if (distance === 1) return 5;
  return 1;
}

function randomPraise() {
  return praise[Math.floor(Math.random() * praise.length)];
}

function updateStats() {
  scoreCounter.textContent = String(score);
  const answered = history.length;
  const exactHits = history.filter((entry) => entry.exact).length;
  const accuracy = answered === 0 ? 0 : Math.round((exactHits / answered) * 100);
  const progress = deck.length === 0 ? 0 : Math.round((answered / deck.length) * 100);
  accuracyText.textContent = `${accuracy}%`;
  accuracyRing.style.strokeDashoffset = String(circumference * (1 - accuracy / 100));
  progressFill.style.width = `${progress}%`;
  progressText.textContent = `${answered} von ${deck.length || roundSize} beantwortet`;
  progressScore.textContent = `${score} / ${deck.length * 10 || roundSize * 10} Punkte`;
}

function renderHistory() {
  historyList.innerHTML = history.map((entry) => {
    const icon = entry.exact ? "✓" : "×";
    const className = entry.exact ? "ok" : "bad";
    return `
      <li class="${className}">
        <span class="mark">${icon}</span>
        <span>
          <strong>${entry.city}: ${entry.name}</strong>
          <span>gewählt ${entry.guess}, richtig ${entry.index}, ${entry.points} Punkt${entry.points === 1 ? "" : "e"}</span>
        </span>
        <em>${entry.index}</em>
      </li>
    `;
  }).join("");
}

function finishGame() {
  const exactHits = history.filter((entry) => entry.exact).length;
  const maxScore = history.length * 10;
  schoolCity.textContent = "Fertig";
  schoolName.textContent = "Auswertung";
  schoolNumber.textContent = `${score} von ${maxScore} Punkten`;
  roundCounter.textContent = `${deck.length} / ${deck.length}`;

  if (score >= maxScore * 0.8) {
    resultTitle.textContent = "Sehr stark";
    resultText.textContent = `Du hast ${exactHits} von ${history.length} Schulen exakt getroffen und ${score} von ${maxScore} Punkten geholt.`;
  } else if (score >= maxScore * 0.5) {
    resultTitle.textContent = "Solide Runde";
    resultText.textContent = `Du hast ${score} von ${maxScore} Punkten geholt. Der Sozialindex-Regler wird schon vertrauter.`;
  } else {
    resultTitle.textContent = "Noch Luft nach oben";
    resultText.textContent = `Du hast ${score} von ${maxScore} Punkten geholt. Eine neue Runde mischt wieder 10 Schulen.`;
  }
}

function updateSlider(value) {
  selectedIndex = Math.min(9, Math.max(1, value));
  const progress = (selectedIndex - 1) / 8;
  const size = 76 + (selectedIndex - 1) * 8;
  const stageHeight = sliderStage.clientHeight || 420;
  const top = (1 - progress) * (stageHeight - size);
  sliderValue.textContent = String(selectedIndex);
  sliderThumb.setAttribute("aria-valuenow", String(selectedIndex));
  sliderThumb.style.width = `${size}px`;
  sliderThumb.style.height = `${size}px`;
  sliderThumb.style.top = `${top}px`;
  sliderThumb.style.background = sliderColors[selectedIndex - 1];
  sliderThumb.style.color = selectedIndex <= 3 ? "#1b2533" : "white";
}

function valueFromPointer(clientY) {
  const rect = sliderStage.getBoundingClientRect();
  const ratio = 1 - Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
  return Math.round(ratio * 8) + 1;
}

sliderStage.addEventListener("pointerdown", (event) => {
  if (locked) return;
  sliderDragging = true;
  sliderStage.setPointerCapture(event.pointerId);
  updateSlider(valueFromPointer(event.clientY));
});

sliderStage.addEventListener("pointermove", (event) => {
  if (!sliderDragging || locked) return;
  updateSlider(valueFromPointer(event.clientY));
});

sliderStage.addEventListener("pointerup", (event) => {
  sliderDragging = false;
  if (sliderStage.hasPointerCapture(event.pointerId)) {
    sliderStage.releasePointerCapture(event.pointerId);
  }
});

sliderThumb.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "ArrowRight") {
    event.preventDefault();
    updateSlider(selectedIndex + 1);
  }
  if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
    event.preventDefault();
    updateSlider(selectedIndex - 1);
  }
});

schoolPicker.addEventListener("click", (event) => {
  const button = event.target.closest(".school-pick");
  if (!button) return;
  toggleOwnSchool(button.dataset.number);
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
submitButton.addEventListener("click", submitGuess);
window.addEventListener("resize", () => updateSlider(selectedIndex));

buildSchoolPicker();
updateSlider(1);
updateSetupCount();
