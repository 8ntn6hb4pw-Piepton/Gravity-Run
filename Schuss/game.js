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
const targetRings = document.querySelector("#targetRings");
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

const colors = ["#eef6ff", "#d9ebff", "#c2ddfb", "#a9cdf2", "#8fbbe8", "#73a7dc", "#568fc8", "#3c73ad", "#244e85"];
const circumference = 2 * Math.PI * 66;
const roundSize = 10;
const selectedOwnSchools = new Set();
let deck = [];
let current = 0;
let score = 0;
let history = [];
let locked = false;

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

function buildTarget() {
  targetRings.innerHTML = "";
  for (let index = 9; index >= 1; index -= 1) {
    const radius = 30 + index * 25;
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "280");
    circle.setAttribute("cy", "280");
    circle.setAttribute("r", radius);
    circle.setAttribute("fill", colors[index - 1]);
    circle.setAttribute("stroke", "#fffdf8");
    circle.setAttribute("stroke-width", "3");
    circle.classList.add("ring");
    circle.dataset.index = String(index);
    circle.setAttribute("tabindex", "0");
    circle.setAttribute("role", "button");
    circle.setAttribute("aria-label", `Sozialindex ${index}`);
    targetRings.append(circle);
  }

  for (let index = 1; index <= 9; index += 1) {
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.classList.add("ring-label");
    label.setAttribute("x", "280");
    label.setAttribute("y", String(280 - (42 + (index - 1) * 25)));
    label.textContent = String(index);
    targetRings.append(label);
  }
}

function startGame() {
  const availableSchools = schools.filter((school) => !selectedOwnSchools.has(school.number));
  deck = shuffle(availableSchools).slice(0, Math.min(roundSize, availableSchools.length));
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
  resultText.textContent = "Wähle den Ring mit dem vermuteten Sozialindex.";
}

function renderCurrent() {
  const school = deck[current];
  schoolCity.textContent = `${school.city} · ${school.type}`;
  schoolName.textContent = school.name;
  schoolNumber.textContent = `Schulnr. ${school.number}`;
  roundCounter.textContent = `${current + 1} / ${deck.length}`;
  feedback.textContent = "";
  feedback.className = "feedback";
}

function submitGuess(guess) {
  if (locked || current >= deck.length) return;
  locked = true;

  const school = deck[current];
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
    resultText.textContent = `Du hast ${score} von ${maxScore} Punkten geholt. Die Zielscheibe wird schon vertrauter.`;
  } else {
    resultTitle.textContent = "Noch Luft nach oben";
    resultText.textContent = `Du hast ${score} von ${maxScore} Punkten geholt. Eine neue Runde mischt wieder 10 Schulen.`;
  }
}

function handleRingEvent(event) {
  const ring = event.target.closest(".ring");
  if (!ring) return;
  submitGuess(Number(ring.dataset.index));
}

targetRings.addEventListener("click", handleRingEvent);
targetRings.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  event.preventDefault();
  handleRingEvent(event);
});

schoolPicker.addEventListener("click", (event) => {
  const button = event.target.closest(".school-pick");
  if (!button) return;
  toggleOwnSchool(button.dataset.number);
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

buildSchoolPicker();
buildTarget();
updateSetupCount();
