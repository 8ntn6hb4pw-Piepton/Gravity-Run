"use strict";

const levels = [
  "Grafik: proportional oder linear?",
  "Tabelle: proportional oder linear?",
  "Term: proportional oder linear?",
  "Tabelle aus Diagramm ergänzen",
  "Tabelle mit Term ergänzen",
  "Proportionalen Term aus Diagramm",
  "Linearen Term aus Diagramm",
  "Term aus Tabelle aufstellen"
];

const TASKS_PER_LEVEL = 3;

const difficultyConfig = {
  noob: { max: 6, negatives: false, fractions: false, blanks: 2 },
  pro: { max: 9, negatives: true, fractions: false, blanks: 3 },
  hacker: { max: 12, negatives: true, fractions: true, blanks: 4 }
};

const state = {
  level: 1,
  taskInLevel: 1,
  difficulty: "noob",
  task: null,
  attempts: 1,
  score: 0,
  streak: 0,
  locked: false,
  inGame: false,
  history: new Set(JSON.parse(localStorage.getItem("zc_history") || "[]"))
};

let resizeTimer = null;

const els = {
  score: document.querySelector("#score"),
  startScreen: document.querySelector("#startScreen"),
  gameStatus: document.querySelector("#gameStatus"),
  progressPanel: document.querySelector("#progressPanel"),
  progressFill: document.querySelector("#progressFill"),
  levelDots: document.querySelector("#levelDots"),
  gameWorkspace: document.querySelector("#gameWorkspace"),
  gameActions: document.querySelector("#gameActions"),
  finishScreen: document.querySelector("#finishScreen"),
  finishText: document.querySelector("#finishText"),
  checkScreen: document.querySelector("#checkScreen"),
  checkResults: document.querySelector("#checkResults"),
  levelTitle: document.querySelector("#levelTitle"),
  attemptsText: document.querySelector("#attemptsText"),
  taskArea: document.querySelector("#taskArea"),
  answerForm: document.querySelector("#answerForm"),
  feedback: document.querySelector("#feedback"),
  hintDialog: document.querySelector("#hintDialog"),
  hintContent: document.querySelector("#hintContent")
};

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(items) {
  return items[randInt(0, items.length - 1)];
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function frac(n, d = 1) {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

function valueOf(f, x) {
  return (f.n * x) / f.d;
}

function fmtNumber(v) {
  return Number.isInteger(v) ? String(v) : String(Number(v.toFixed(2))).replace(".", ",");
}

function fmtFrac(f) {
  if (f.d === 1) return String(f.n);
  return `${f.n}/${f.d}`;
}

function fmtTerm(m, n) {
  const mText = m.n === 1 && m.d === 1 ? "x" : m.n === -1 && m.d === 1 ? "-x" : `${fmtFrac(m)}x`;
  if (n === 0) return `y = ${mText}`;
  return `y = ${mText} ${n > 0 ? "+" : "-"} ${Math.abs(n)}`;
}

function termKey(data) {
  return fmtTerm(data.m, data.n);
}

function parseNumber(input) {
  if (!input) return NaN;
  const text = input.trim().replace(",", ".");
  if (text.includes("/")) {
    const [a, b] = text.split("/").map(Number);
    return b ? a / b : NaN;
  }
  return Number(text);
}

function closeEnough(a, b) {
  return Math.abs(a - b) < 0.02;
}

function randomSlope(config, allowZero = false) {
  const sign = config.negatives && Math.random() < 0.35 ? -1 : 1;
  if (config.fractions && Math.random() < 0.45) {
    return frac(sign * randInt(1, config.max), randInt(2, 5));
  }
  const n = randInt(allowZero ? 0 : 1, config.max);
  return frac(sign * n, 1);
}

function randomLinear(config, proportionalMaybe = false) {
  const m = randomSlope(config);
  let n = proportionalMaybe && Math.random() < 0.5 ? 0 : randInt(1, config.max);
  if (config.negatives && Math.random() < 0.5) n *= -1;
  return { m, n };
}

function randomQuadraticTable(config) {
  const a = choice([1, 2]);
  let b = config.negatives ? choice([-2, -1, 0, 1, 2]) : choice([0, 1, 2]);
  let c = config.negatives ? choice([-3, -2, -1, 1, 2, 3]) : choice([1, 2, 3]);
  const xs = usefulXs(config, 5, true);
  const ys = xs.map((x) => a * x * x + b * x + c);
  return { xs, ys, kind: "quadratic" };
}

function randomAmbiguousTable(config) {
  const linear = randomLinear(config, true);
  const xs = usefulXs(config, 5, true, linear.m, linear.n);
  const ys = xs.map((x) => valueOf(linear.m, x) + linear.n);
  const duplicateIndex = randInt(1, xs.length - 2);
  const duplicateY = ys[duplicateIndex] + choice([1, 2, -1, -2]);
  return {
    xs: xs.map((x, index) => index === duplicateIndex + 1 ? xs[duplicateIndex] : x),
    ys: ys.map((y, index) => index === duplicateIndex + 1 ? duplicateY : y),
    kind: "ambiguous"
  };
}

function graphConfig(config) {
  return {
    ...config,
    max: Math.min(config.max, 5)
  };
}

function randomGraphLinear(config, proportionalMaybe = false) {
  const local = graphConfig(config);
  const m = randomSlope(local);
  let n = proportionalMaybe && Math.random() < 0.5 ? 0 : randInt(1, local.max);
  if (local.negatives && Math.random() < 0.5) n *= -1;
  return { m, n };
}

function randomReadableGraphLinear(config, proportionalMaybe = false) {
  for (let i = 0; i < 100; i++) {
    const data = randomGraphLinear({ ...config, fractions: false, max: 3 }, proportionalMaybe);
    const ys = [0, 1, 2, 3, 4].map((x) => valueOf(data.m, x) + data.n);
    if (ys.every((y) => y >= -10 && y <= 10)) return data;
  }
  return { m: frac(choice([1, 2, -1]), 1), n: proportionalMaybe && Math.random() < 0.5 ? 0 : choice([1, 2, -1, -2]) };
}

function termOptions(correctData, config, proportionalOnly = false) {
  const options = new Set([termKey(correctData)]);
  const slopeN = correctData.m.n;
  const slopeD = correctData.m.d;
  const candidates = [
    { m: frac(slopeN + slopeD, slopeD), n: 0 },
    { m: frac(Math.max(1, Math.abs(slopeN - slopeD)) * Math.sign(slopeN || 1), slopeD), n: 0 },
    { m: frac(-slopeN || 1, slopeD), n: 0 },
    { m: correctData.m, n: choice([1, -1, 2]) }
  ];
  for (const candidate of candidates) {
    if (proportionalOnly && candidate.n !== 0 && options.size >= 3) continue;
    options.add(termKey(candidate));
  }
  while (options.size < 4) {
    const m = randomSlope(graphConfig(config));
    options.add(termKey({ m, n: proportionalOnly ? 0 : choice([0, 1, -1]) }));
  }
  return [...options].sort(() => Math.random() - 0.5).slice(0, 4);
}

function usefulXs(config, count = 5, includeZero = false, slope = frac(1, 1), n = 0) {
  const xs = [];
  const maxX = includeZero ? Math.max(config.max, count - 1) : config.max;
  let step = Math.max(1, slope.d);
  if (step * (count - 1) > maxX) step = 1;
  for (let i = 0; i < count; i++) {
    xs.push(includeZero ? i * step : (i + 1) * step);
  }
  return xs;
}

function taskId(level, task) {
  return `${level}:${JSON.stringify(task.answer)}:${JSON.stringify(task.data)}`;
}

function rememberTask(id) {
  state.history.add(id);
  const recent = [...state.history].slice(-600);
  state.history = new Set(recent);
  localStorage.setItem("zc_history", JSON.stringify(recent));
}

function generateUnique() {
  for (let i = 0; i < 80; i++) {
    const task = generators[state.level](difficultyConfig[state.difficulty]);
    const id = taskId(state.level, task);
    if (!state.history.has(id)) {
      task.id = id;
      return task;
    }
  }
  const task = generators[state.level](difficultyConfig[state.difficulty]);
  task.id = taskId(state.level, task);
  return task;
}

const generators = {
  1(config) {
    const data = randomGraphLinear(config, true);
    return {
      type: "choice",
      prompt: "Entscheide anhand der Geraden.",
      data,
      answer: data.n === 0 ? "proportional" : "linear",
      hint: "Schau auf den Ursprung (0|0). Geht die Gerade genau durch diesen Punkt, ist sie proportional. Sonst ist sie linear, aber nicht proportional."
    };
  },
  2(config) {
    const variant = choice(["proportional", "linear", "quadratic", "ambiguous"]);
    if (variant === "quadratic") {
      const table = randomQuadraticTable(config);
      return {
        type: "choice",
        prompt: "Entscheide anhand der Wertetabelle.",
        data: table,
        answer: "none",
        hint: "Schau erst auf x = 0. Prüfe dann, ob y immer mit demselben Schritt wächst. Wenn die Schritte selbst größer werden, ist es nicht linear und nicht proportional."
      };
    }
    if (variant === "ambiguous") {
      const table = randomAmbiguousTable(config);
      return {
        type: "choice",
        prompt: "Entscheide anhand der Wertetabelle.",
        data: table,
        answer: "none",
        hint: "Eine Zuordnung darf zu einem x-Wert nur einen y-Wert haben. Wenn derselbe x-Wert zweimal verschiedene y-Werte bekommt, ist es keins von beiden."
      };
    }
    const data = randomLinear(config, variant === "proportional");
    if (variant === "proportional") data.n = 0;
    if (variant === "linear" && data.n === 0) data.n = 1;
    const xs = usefulXs(config, 5, true, data.m, data.n);
    return {
      type: "choice",
      prompt: "Entscheide anhand der Wertetabelle.",
      data: { ...data, xs },
      answer: data.n === 0 ? "proportional" : "linear",
      hint: "Schau zuerst in die Spalte x = 0. Bei proportionalen Zuordnungen steht dort y = 0. Danach kannst du prüfen, ob die Werte immer gleichmäßig wachsen."
    };
  },
  3(config) {
    const data = randomLinear(config, true);
    return {
      type: "choice",
      prompt: "Entscheide anhand des Terms.",
      data,
      answer: data.n === 0 ? "proportional" : "linear",
      hint: "Wenn im Term nur eine Zahl mal x steht, ist es proportional. Wenn noch etwas plus oder minus dazukommt, ist es linear, aber nicht proportional."
    };
  },
  4(config) {
    const data = randomReadableGraphLinear(config, true);
    const xs = usefulXs({ ...graphConfig(config), fractions: false }, 5, true, data.m, data.n);
    const blanks = choiceBlankIndexes(xs.length, config.blanks);
    return {
      type: "fillTableGraph",
      prompt: "Ergänze die fehlenden Tabellenwerte durch Ablesen aus dem Diagramm.",
      data: { ...data, xs, blanks },
      answer: blanks.map((i) => valueOf(data.m, xs[i]) + data.n),
      hint: "Suche den x-Wert unten an der Achse. Gehe hoch bis zur Geraden. Dann lies links den y-Wert ab und trage ihn in die Tabelle ein."
    };
  },
  5(config) {
    const data = randomLinear(config, true);
    const xs = usefulXs(config, 5, true, data.m, data.n);
    const blanks = choiceBlankIndexes(xs.length, config.blanks);
    return {
      type: "fillTableTerm",
      prompt: "Ergänze die fehlenden Tabellenwerte mit dem Term.",
      data: { ...data, xs, blanks },
      answer: blanks.map((i) => valueOf(data.m, xs[i]) + data.n),
      hint: "Nimm den x-Wert aus der Tabelle und setze ihn in den Term ein. Beispiel: Bei y = 3x + 2 und x = 4 rechnest du 3 · 4 + 2."
    };
  },
  6(config) {
    const data = { m: randomSlope(graphConfig(config)), n: 0 };
    return {
      type: "termChoiceGraph",
      prompt: "Wähle den Term, der zum Graphen passt.",
      data,
      options: termOptions(data, config, true),
      answer: termKey(data),
      hint: "Die Gerade geht durch den Ursprung. Suche einen gut erkennbaren Punkt. Wenn bei x = 1 der y-Wert 5 ist, passt der Term y = 5x."
    };
  },
  7(config) {
    const data = randomGraphLinear(config, false);
    return {
      type: "termInputGraph",
      prompt: "Stelle den Term der linearen Zuordnung auf.",
      data,
      answer: data,
      hint: "Lies zuerst ab, wo die Gerade die y-Achse schneidet. Das ist n. Danach schaust du, wie viele Kästchen y hoch oder runter geht, wenn x um 1 weitergeht."
    };
  },
  8(config) {
    const data = randomLinear(config, true);
    const xs = usefulXs(config, 5, true, data.m, data.n);
    return {
      type: "termInputTable",
      prompt: "Stelle den passenden Term zur Tabelle auf.",
      data: { ...data, xs },
      answer: data,
      hint: "Schau in die Tabelle: Bei x = 0 findest du n. Dann vergleiche zwei Nachbarspalten. So erkennst du, wie stark y pro Schritt wächst."
    };
  }
};

function choiceBlankIndexes(length, count) {
  const indexes = new Set();
  while (indexes.size < Math.min(length, count)) indexes.add(randInt(0, length - 1));
  return [...indexes].sort((a, b) => a - b);
}

function renderGraph(data) {
  const wrap = document.createElement("div");
  wrap.className = "graphWrap";
  const canvas = document.createElement("canvas");
  wrap.append(canvas);
  requestAnimationFrame(() => drawGraph(canvas, data));
  return wrap;
}

function redrawGraphs() {
  document.querySelectorAll("canvas[data-graph]").forEach((canvas) => {
    drawGraph(canvas, JSON.parse(canvas.dataset.graph));
  });
}

function drawGraph(canvas, { m, n }) {
  canvas.dataset.graph = JSON.stringify({ m, n });
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const w = rect.width;
  const h = rect.height;
  const pad = 46;
  const min = -10;
  const max = 10;
  const sx = (x) => pad + ((x - min) / (max - min)) * (w - 2 * pad);
  const sy = (y) => h - pad - ((y - min) / (max - min)) * (h - 2 * pad);
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#d9decd";
  ctx.fillStyle = "#566052";
  ctx.font = "11px system-ui";
  for (let i = min; i <= max; i++) {
    ctx.beginPath();
    ctx.moveTo(sx(i), sy(min));
    ctx.lineTo(sx(i), sy(max));
    ctx.moveTo(sx(min), sy(i));
    ctx.lineTo(sx(max), sy(i));
    ctx.stroke();
  }

  ctx.strokeStyle = "#9aa58e";
  ctx.fillStyle = "#3f493d";
  ctx.lineWidth = 1.5;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let i = min; i <= max; i += 2) {
    ctx.beginPath();
    ctx.moveTo(sx(i), sy(0) - 4);
    ctx.lineTo(sx(i), sy(0) + 4);
    ctx.stroke();
    if (i !== 0) ctx.fillText(String(i), sx(i), sy(0) + 7);
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  for (let i = min; i <= max; i += 2) {
    ctx.beginPath();
    ctx.moveTo(sx(0) - 4, sy(i));
    ctx.lineTo(sx(0) + 4, sy(i));
    ctx.stroke();
    if (i !== 0) ctx.fillText(String(i), sx(0) - 8, sy(i));
  }
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText("0", sx(0) - 8, sy(0) + 7);

  ctx.strokeStyle = "#1f241f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(sx(min), sy(0));
  ctx.lineTo(sx(max), sy(0));
  ctx.moveTo(sx(0), sy(min));
  ctx.lineTo(sx(0), sy(max));
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx(max), sy(0));
  ctx.lineTo(sx(max) - 9, sy(0) - 5);
  ctx.moveTo(sx(max), sy(0));
  ctx.lineTo(sx(max) - 9, sy(0) + 5);
  ctx.moveTo(sx(0), sy(max));
  ctx.lineTo(sx(0) - 5, sy(max) + 9);
  ctx.moveTo(sx(0), sy(max));
  ctx.lineTo(sx(0) + 5, sy(max) + 9);
  ctx.stroke();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillText("x", sx(max) - 10, sy(0) - 8);
  ctx.fillText("y", sx(0) + 8, sy(max) + 14);

  ctx.strokeStyle = "#235e9f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  let started = false;
  for (let px = min; px <= max; px += 0.2) {
    const py = valueOf(m, px) + n;
    if (py < min - 1 || py > max + 1) continue;
    if (!started) {
      ctx.moveTo(sx(px), sy(py));
      started = true;
    } else {
      ctx.lineTo(sx(px), sy(py));
    }
  }
  ctx.stroke();

  ctx.fillStyle = "#b7343a";
  for (const x of [-4, -2, 0, 2, 4, 6]) {
    const y = valueOf(m, x) + n;
    if (y >= min && y <= max) {
      ctx.beginPath();
      ctx.arc(sx(x), sy(y), 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function renderTable(data, blanks = [], editable = false) {
  const table = document.createElement("table");
  table.className = "valueTable";
  const yValues = data.ys || data.xs.map((x) => valueOf(data.m, x) + data.n);
  table.innerHTML = `
    <tr><th>x</th>${data.xs.map((x) => `<td>${fmtNumber(x)}</td>`).join("")}</tr>
    <tr><th>y</th>${yValues.map((y, i) => {
      if (blanks.includes(i)) return editable ? `<td><input name="blank-${i}" inputmode="decimal" aria-label="y-Wert zu x ${data.xs[i]}"></td>` : "<td>?</td>";
      return `<td>${fmtNumber(y)}</td>`;
    }).join("")}</tr>
  `;
  return table;
}

function renderTask() {
  state.attempts = 1;
  state.locked = false;
  state.task = generateUnique();
  delete els.answerForm.dataset.answer;
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
  els.levelTitle.textContent = `Level ${state.level} von 8 · Aufgabe ${state.taskInLevel} von ${TASKS_PER_LEVEL}: ${levels[state.level - 1]}`;
  updateHud();
  els.gameWorkspace.classList.remove("goodPulse", "badShake");
  els.taskArea.replaceChildren();
  els.answerForm.replaceChildren();
  const prompt = document.createElement("p");
  prompt.className = "prompt";
  prompt.textContent = state.task.prompt;
  els.taskArea.append(prompt);

  if (["choice", "fillTableGraph", "termInputGraph", "termChoiceGraph"].includes(state.task.type) && state.level !== 2 && state.level !== 3 && state.level !== 8) {
    els.taskArea.append(renderGraph(state.task.data));
  }
  if (state.task.type === "choice" && state.level === 2) {
    els.taskArea.append(renderTable(state.task.data));
  }
  if (state.task.type === "choice" && state.level === 3) {
    els.taskArea.append(termNode(state.task.data));
  }
  if (state.task.type === "fillTableGraph") {
    els.answerForm.append(renderTable(state.task.data, state.task.data.blanks, true));
  }
  if (state.task.type === "fillTableTerm") {
    els.taskArea.append(termNode(state.task.data));
    els.answerForm.append(renderTable(state.task.data, state.task.data.blanks, true));
  }
  if (state.task.type === "termInputTable") {
    els.taskArea.append(renderTable(state.task.data));
  }
  renderAnswerControls();
}

function termNode(data) {
  const node = document.createElement("div");
  node.className = "term";
  node.textContent = fmtTerm(data.m, data.n);
  return node;
}

function renderAnswerControls() {
  if (state.task.type === "choice" || state.task.type === "termChoiceGraph") {
    const grid = document.createElement("div");
    grid.className = "choiceGrid";
    const choices = state.task.type === "termChoiceGraph"
      ? state.task.options.map((option) => [option, option])
      : state.level === 2
        ? [["proportional", "Proportional"], ["linear", "Linear, nicht proportional"], ["none", "Keins von beiden"]]
        : [["proportional", "Proportional"], ["linear", "Linear, nicht proportional"]];
    for (const [value, label] of choices) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.dataset.value = value;
      button.addEventListener("click", () => {
        grid.querySelectorAll("button").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        els.answerForm.dataset.answer = value;
      });
      grid.append(button);
    }
    els.answerForm.append(grid);
    return;
  }

  if (state.task.type === "termInputGraph" || state.task.type === "termInputTable") {
    const grid = document.createElement("div");
    grid.className = "inputGrid";
    const nInput = state.level === 6 ? "" : `<label>n <input name="n" inputmode="decimal" placeholder="0"></label>`;
    grid.innerHTML = `<label>m <input name="m" inputmode="decimal" placeholder="z. B. 2 oder 3/4"></label>${nInput}`;
    els.answerForm.append(grid);
  }
}

function validateTableInputs() {
  let allCorrect = true;
  let correctCount = 0;
  state.task.data.blanks.forEach((index, pos) => {
    const input = els.answerForm.querySelector(`[name="blank-${index}"]`);
    const correct = input && closeEnough(parseNumber(input.value), state.task.answer[pos]);
    input.classList.toggle("isCorrect", Boolean(correct));
    input.classList.toggle("isWrong", !correct);
    if (correct) correctCount += 1;
    allCorrect = allCorrect && correct;
  });
  return { allCorrect, correctCount, total: state.task.data.blanks.length };
}

function checkAnswer(event) {
  event.preventDefault();
  if (state.locked) return;
  state.locked = true;
  let correct = false;
  if (state.task.type === "choice" || state.task.type === "termChoiceGraph") {
    correct = els.answerForm.dataset.answer === state.task.answer;
  } else if (state.task.type === "fillTableGraph" || state.task.type === "fillTableTerm") {
    const result = validateTableInputs();
    correct = result.allCorrect;
    if (!correct) {
      state.locked = false;
      state.streak = 0;
      els.feedback.textContent = result.correctCount > 0
        ? `${result.correctCount} von ${result.total} stimmen. Verbessere die roten Felder.`
        : "Noch kein Tabellenwert stimmt. Die Zuordnung bleibt gleich.";
      els.feedback.className = "feedback bad";
      els.gameWorkspace.classList.add("badShake");
      updateHud();
      window.setTimeout(() => els.gameWorkspace.classList.remove("badShake"), 380);
      return;
    }
  } else {
    const data = new FormData(els.answerForm);
    const mValue = parseNumber(data.get("m"));
    const nValue = parseNumber(data.get("n") || "0");
    correct = closeEnough(mValue, state.task.answer.m.n / state.task.answer.m.d) && closeEnough(nValue, state.task.answer.n);
  }

  if (correct) {
    state.streak += 1;
    const points = Math.max(3, 10 + Math.min(state.streak, 5) * 2 - (hintWasOpened() ? 2 : 0));
    state.score += points;
    rememberTask(state.task.id);
    els.score.textContent = state.score;
    els.feedback.textContent = `Richtig. +${points} Punkte`;
    els.feedback.className = "feedback good";
    els.gameWorkspace.classList.add("goodPulse");
    launchBurst();
    updateHud();
    window.setTimeout(nextTask, 900);
  } else {
    state.streak = 0;
    rememberTask(state.task.id);
    els.feedback.textContent = "Nicht richtig. Neue Aufgabe.";
    els.feedback.className = "feedback bad";
    els.gameWorkspace.classList.add("badShake");
    updateHud();
    window.setTimeout(renderTask, 850);
  }
}

function hintWasOpened() {
  return state.task.hintOpened === true;
}

function updateHud() {
  els.attemptsText.textContent = `Serie ${state.streak}`;
  const completed = (state.level - 1) * TASKS_PER_LEVEL + (state.taskInLevel - 1);
  const total = levels.length * TASKS_PER_LEVEL;
  els.progressFill.style.width = `${Math.round((completed / total) * 100)}%`;
  els.levelDots.innerHTML = levels.map((_, index) => {
    const levelNumber = index + 1;
    const cls = levelNumber < state.level ? "done" : levelNumber === state.level ? "active" : "";
    return `<span class="${cls}">${levelNumber}</span>`;
  }).join("");
}

function launchBurst() {
  const burst = document.createElement("div");
  burst.className = "burst";
  for (let i = 0; i < 10; i++) {
    const piece = document.createElement("i");
    piece.style.setProperty("--dx", `${randInt(-70, 70)}px`);
    piece.style.setProperty("--dy", `${randInt(-80, -25)}px`);
    piece.style.setProperty("--c", choice(["#137a52", "#235e9f", "#f1c84b", "#b7343a"]));
    burst.append(piece);
  }
  document.body.append(burst);
  window.setTimeout(() => burst.remove(), 700);
}

function showHint() {
  state.task.hintOpened = true;
  els.hintContent.innerHTML = `${hintVisual(state.task)}<p>${state.task.hint}</p><p><strong>Merke:</strong> Tabelle, Graph und Term zeigen dieselbe Zuordnung nur auf drei verschiedene Arten.</p>`;
  els.hintDialog.showModal();
}

function hintVisual(task) {
  const sampleM = task.data?.m || frac(2, 1);
  const sampleN = task.data?.n || 0;
  const xs = [0, 1, 2];
  const miniRows = xs.map((x) => `<tr><td>${x}</td><td>${fmtNumber(valueOf(sampleM, x) + sampleN)}</td></tr>`).join("");
  const points = miniGraphPoints(sampleM, sampleN);
  const pointDots = points.map((point) => `<circle cx="${point.x}" cy="${point.y}" r="3" />`).join("");
  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join("");
  return `
    <div class="hintVisual" aria-label="Darstellungswechsel">
      <div class="miniTable"><strong>Tabelle</strong><table><tr><th>x</th><th>y</th></tr>${miniRows}</table></div>
      <div class="miniGraph"><strong>Graph</strong><svg viewBox="0 0 90 70" role="img" aria-label="kleiner Graph"><path d="M12 58H82M22 64V8" /><path class="miniGrid" d="M22 46H82M22 34H82M22 22H82M34 58V8M46 58V8M58 58V8M70 58V8" /><path class="miniLine" d="${linePath}" />${pointDots}</svg></div>
      <div class="miniTerm"><strong>Term</strong><span>${fmtTerm(sampleM, sampleN)}</span></div>
    </div>
  `;
}

function miniGraphPoints(m, n) {
  const minX = 0;
  const maxX = 2;
  const values = [0, 1, 2].map((x) => valueOf(m, x) + n);
  const minY = Math.min(0, ...values);
  const maxY = Math.max(1, ...values);
  const ySpan = maxY - minY || 1;
  const sx = (x) => 22 + ((x - minX) / (maxX - minX || 1)) * 54;
  const sy = (y) => 58 - ((y - minY) / ySpan) * 44;
  return [0, 1, 2].map((x) => ({ x: Math.round(sx(x)), y: Math.round(sy(valueOf(m, x) + n)) }));
}

function showScreen(screen) {
  els.startScreen.classList.toggle("hidden", screen !== "start");
  els.gameStatus.classList.toggle("hidden", screen !== "game");
  els.progressPanel.classList.toggle("hidden", screen !== "game");
  els.gameWorkspace.classList.toggle("hidden", screen !== "game");
  els.gameActions.classList.toggle("hidden", screen !== "game");
  els.finishScreen.classList.toggle("hidden", screen !== "finish");
  els.checkScreen.classList.toggle("hidden", screen !== "check");
}

function startGame() {
  state.level = 1;
  state.taskInLevel = 1;
  state.score = 0;
  state.streak = 0;
  state.inGame = true;
  els.score.textContent = state.score;
  showScreen("game");
  renderTask();
}

function nextTask() {
  if (state.taskInLevel < TASKS_PER_LEVEL) {
    state.taskInLevel += 1;
    renderTask();
    return;
  }
  nextLevel();
}

function nextLevel() {
  if (state.level >= levels.length) {
    finishGame();
    return;
  }
  state.level += 1;
  state.taskInLevel = 1;
  updateHud();
  renderTask();
}

function finishGame() {
  state.inGame = false;
  els.feedback.textContent = "";
  els.finishText.textContent = `Du hast alle 8 Level mit insgesamt ${levels.length * TASKS_PER_LEVEL} Aufgaben abgeschlossen. Ergebnis: ${state.score} Punkte.`;
  showScreen("finish");
}

function returnToStart() {
  state.inGame = false;
  state.task = null;
  els.feedback.textContent = "";
  showScreen("start");
}

function init() {
  els.score.textContent = state.score;
  document.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-difficulty]").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      state.difficulty = button.dataset.difficulty;
    });
  });
  document.querySelector("#startButton").addEventListener("click", startGame);
  document.querySelector("#restartButton").addEventListener("click", returnToStart);
  document.querySelector("#hintButton").addEventListener("click", showHint);
  els.answerForm.addEventListener("submit", checkAnswer);
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(redrawGraphs, 120);
  });
  if (new URLSearchParams(window.location.search).has("check")) {
    showScreen("check");
    runSelfCheck();
  } else {
    showScreen("start");
  }
}

init();

function checkAssert(condition, label, details = "") {
  return { ok: Boolean(condition), label, details };
}

function runSelfCheck() {
  const results = [];
  const generated = [];
  for (const [difficulty, config] of Object.entries(difficultyConfig)) {
    for (let level = 1; level <= levels.length; level++) {
      for (let i = 0; i < 20; i++) {
        const task = generators[level](config);
        generated.push({ difficulty, level, task });
        results.push(checkTask(level, difficulty, task));
      }
    }
  }
  results.push(checkAssert(generated.length === 480, "480 Aufgabenvarianten wurden erzeugt"));
  const shiftedHint = hintVisual({ data: { m: frac(1, 1), n: 2 }, hint: "" });
  results.push(checkAssert(shiftedHint.includes("y = x + 2"), "Screenshot-Fall: Hilfe zeigt Term y = x + 2"));
  results.push(checkAssert(!shiftedHint.includes('class="miniLine" d="M22 58'), "Screenshot-Fall: Mini-Graph startet bei y = 2, nicht im Ursprung"));
  const level2Tasks = generated.filter((item) => item.level === 2).map((item) => item.task);
  results.push(checkAssert(level2Tasks.some((task) => task.answer === "none" && task.data.kind === "quadratic"), "L2 erzeugt quadratische Tabellen"));
  results.push(checkAssert(level2Tasks.some((task) => task.answer === "none" && task.data.kind === "ambiguous"), "L2 erzeugt nicht eindeutige Tabellen"));
  renderSelfCheck(results.flat());
}

function checkTask(level, difficulty, task) {
  const checks = [];
  checks.push(checkAssert(Boolean(task.prompt), `L${level} ${difficulty}: Aufgabenstellung vorhanden`));
  checks.push(checkAssert(Boolean(task.hint), `L${level} ${difficulty}: Hilfe vorhanden`));
  if ([2, 4, 5, 8].includes(level)) {
    checks.push(checkAssert(task.data.xs[0] === 0, `L${level} ${difficulty}: Tabelle startet bei x = 0`, JSON.stringify(task.data.xs)));
  }
  if (level === 2) {
    checks.push(checkAssert(["proportional", "linear", "none"].includes(task.answer), `L2 ${difficulty}: Antworttyp ist gültig`, task.answer));
    if (task.answer === "none") {
      checks.push(checkAssert(task.data.kind === "quadratic" || task.data.kind === "ambiguous", `L2 ${difficulty}: Keins-von-beiden hat Begründung`, task.data.kind || ""));
    }
  }
  if ([1, 4, 6, 7].includes(level)) {
    checks.push(checkAssert(task.data?.m && Number.isFinite(task.data.n), `L${level} ${difficulty}: Graphdaten vorhanden`));
  }
  if (level === 6) {
    checks.push(checkAssert(task.type === "termChoiceGraph", `L6 ${difficulty}: Multiple Choice statt Eingabe`));
    checks.push(checkAssert(task.options.length === 4, `L6 ${difficulty}: vier Antwortoptionen`));
    checks.push(checkAssert(task.options.includes(task.answer), `L6 ${difficulty}: richtige Termoption enthalten`, `${task.answer} in ${task.options.join(", ")}`));
  }
  if ([4, 5].includes(level)) {
    checks.push(checkAssert(task.data.blanks.length >= 2, `L${level} ${difficulty}: Tabellenlücken vorhanden`));
    checks.push(checkAssert(task.answer.every(Number.isFinite), `L${level} ${difficulty}: Tabellenlösungen sind Zahlen`, JSON.stringify(task.answer)));
  }
  if (task.data?.m) {
    const visual = hintVisual(task);
    const expected = fmtTerm(task.data.m, task.data.n);
    checks.push(checkAssert(visual.includes(expected), `L${level} ${difficulty}: Hilfe-Term passt zur Aufgabe`, expected));
  }
  return checks;
}

function renderSelfCheck(results) {
  const failed = results.filter((result) => !result.ok);
  const passed = results.length - failed.length;
  els.checkResults.innerHTML = `
    <div class="checkSummary ${failed.length ? "bad" : "good"}">
      <strong>${failed.length ? "Fehler gefunden" : "Alles grün"}</strong>
      <span>${passed} bestanden · ${failed.length} fehlgeschlagen</span>
    </div>
    <ol>
      ${results.map((result) => `<li class="${result.ok ? "ok" : "fail"}"><span>${result.ok ? "OK" : "FEHLER"}</span>${result.label}${result.details ? `<small>${result.details}</small>` : ""}</li>`).join("")}
    </ol>
  `;
}
