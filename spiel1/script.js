const angleTasks = {
  a1a: {
    values: { alpha: 70, beta: 110, gamma: 110 },
    rules: { alpha: "Nebenwinkel", beta: "Scheitelwinkel", gamma: "Stufenwinkel" },
    hints: [
      "Starte immer beim gegebenen 110-Grad-Winkel.",
      "Suche zuerst einen Nebenwinkel direkt am selben Schnittpunkt.",
      "Nutze danach Scheitelwinkel oder Stufenwinkel, statt etwas abzulesen."
    ]
  },
  a1b: {
    values: { alpha: 100, beta: 80, gamma: 100 },
    rules: { alpha: "Nebenwinkel", beta: "Stufenwinkel", gamma: "Stufenwinkel" },
    hints: [
      "Der 80-Grad-Winkel ist dein Startwinkel.",
      "alpha liegt direkt daneben, also hilft zuerst der Nebenwinkel.",
      "Gehe dann mit Stufenwinkeln zur rechten Parallelen."
    ]
  },
  a1c: {
    values: { alpha: 30, beta: 150, gamma: 30 },
    rules: { alpha: "Scheitelwinkel", beta: "Nebenwinkel", gamma: "Stufenwinkel" },
    hints: [
      "Der gegebene 30-Grad-Winkel ist der Schluessel.",
      "Suche zuerst den gegenueberliegenden Winkel am selben Schnittpunkt.",
      "An der oberen Geraden brauchst du dann Stufenwinkel und Nebenwinkel."
    ]
  }
};

const simpleInterestAnswers = [22, 15, 12.5];
const constructionSteps = {
  sss: [
    "Zeichne eine Strecke AB mit 10 cm.",
    "Stelle den Zirkel auf 10 cm ein.",
    "Schlage um A einen Kreisbogen.",
    "Schlage um B mit derselben Oeffnung einen zweiten Kreisbogen.",
    "Markiere einen Schnittpunkt der Boegen als C.",
    "Verbinde A mit C und B mit C.",
    "Beschrifte sauber: a, b, c sowie A, B, C."
  ],
  sws: [
    "Zeichne zuerst die Seite c mit 7 cm.",
    "Beschrifte die Endpunkte passend mit A und B, wenn c die Strecke AB ist.",
    "Trage an dem Punkt an, an dem der vorgegebene Winkel liegen soll, genau diesen Winkel mit dem Geodreieck ab.",
    "Zeichne den Winkelschenkel als Strahl.",
    "Stelle den Zirkel auf 10 cm ein, denn b ist 10 cm lang.",
    "Trage auf dem passenden Strahl die Laenge b = 10 cm ab und markiere den Punkt C.",
    "Verbinde den noch offenen Punkt mit C.",
    "Kontrolliere: Wurde wirklich der gegebene Winkel benutzt und sind alle Beschriftungen dran?"
  ],
  umkreis: [
    "Verbinde die Punkte A, B und C zu einem Dreieck.",
    "Suche die Mitte von Seite AB.",
    "Zeichne durch diese Mitte die Mittelsenkrechte von AB.",
    "Wiederhole das Gleiche fuer eine zweite Seite, zum Beispiel BC.",
    "Der Schnittpunkt der beiden Mittelsenkrechten ist der Umkreismittelpunkt.",
    "Markiere diesen Punkt als Spielplatz.",
    "Pruefe gedanklich: Von A, B und C ist die Entfernung jetzt gleich gross."
  ]
};

const hintState = new Map();

function normalizeNumber(value) {
  if (!value) return NaN;
  return Number.parseFloat(String(value).replace(",", ".").replace("°", "").replace("%", "").trim());
}

function setFeedback(node, message, tone = "neutral") {
  node.textContent = message;
  node.className = `feedback ${tone}`;
}

function approxEqual(a, b, tolerance = 0.02) {
  return Math.abs(a - b) <= tolerance;
}

document.querySelectorAll("[data-action='check-angle']").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".angle-task");
    const task = angleTasks[card.dataset.task];
    const feedback = card.querySelector(".feedback");
    const issues = [];

    for (const field of ["alpha", "beta", "gamma"]) {
      const value = normalizeNumber(card.querySelector(`[data-role='value'][data-field='${field}']`).value);
      const rule = card.querySelector(`[data-role='rule'][data-field='${field}']`).value;
      if (Number.isNaN(value) || !rule) {
        issues.push(`${field}: Regel und Zahl fehlen noch.`);
        continue;
      }
      if (!approxEqual(value, task.values[field])) {
        issues.push(`${field}: Zahl passt noch nicht.`);
      }
      if (rule !== task.rules[field]) {
        issues.push(`${field}: Begruendung mit Winkelsatz passt noch nicht.`);
      }
    }

    if (issues.length === 0) {
      setFeedback(feedback, "Stark. Alles passt und wurde mit Winkelsaetzen begruendet.", "ok");
      return;
    }

    setFeedback(feedback, issues.join(" "), "bad");
  });
});

document.querySelectorAll("[data-action='hint']").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".angle-task");
    const task = angleTasks[card.dataset.task];
    const feedback = card.querySelector(".feedback");
    const current = hintState.get(card.dataset.task) ?? 0;
    const hint = task.hints[Math.min(current, task.hints.length - 1)];
    hintState.set(card.dataset.task, current + 1);
    setFeedback(feedback, hint, "neutral");
  });
});

document.getElementById("triangle-check").addEventListener("click", () => {
  const a = normalizeNumber(document.getElementById("triangle-a").value);
  const b = normalizeNumber(document.getElementById("triangle-b").value);
  const c = normalizeNumber(document.getElementById("triangle-c").value);
  const feedback = document.getElementById("triangle-feedback");

  if ([a, b, c].some(Number.isNaN)) {
    setFeedback(feedback, "Bitte drei Winkelwerte eingeben.", "bad");
    return;
  }

  if (a <= 0 || b <= 0 || c <= 0) {
    setFeedback(feedback, "Alle Winkel muessen groesser als 0 sein.", "bad");
    return;
  }

  setFeedback(
    feedback,
    approxEqual(c, 180 - a - b)
      ? "Richtig berechnet."
      : "Noch nicht richtig. Nutze die Innenwinkelsumme im Dreieck.",
    approxEqual(c, 180 - a - b) ? "ok" : "bad"
  );
});

document.getElementById("triangle-hint").addEventListener("click", () => {
  setFeedback(
    document.getElementById("triangle-feedback"),
    "In jedem Dreieck gilt: Winkel 1 + Winkel 2 + Winkel 3 = 180 Grad.",
    "neutral"
  );
});

document.getElementById("percent-check").addEventListener("click", () => {
  const percent = normalizeNumber(document.getElementById("percent-value").value);
  const decimal = normalizeNumber(document.getElementById("decimal-value").value);
  const fractionRaw = document.getElementById("fraction-value").value.trim().replace(/\s+/g, "");
  const feedback = document.getElementById("percent-feedback");

  if (Number.isNaN(percent) || Number.isNaN(decimal) || !fractionRaw.includes("/")) {
    setFeedback(feedback, "Bitte Prozent, Bruch und Dezimalzahl vollstaendig angeben.", "bad");
    return;
  }

  const [numRaw, denRaw] = fractionRaw.split("/");
  const numerator = normalizeNumber(numRaw);
  const denominator = normalizeNumber(denRaw);

  if (Number.isNaN(numerator) || Number.isNaN(denominator) || denominator === 0) {
    setFeedback(feedback, "Der Bruch ist noch nicht gueltig.", "bad");
    return;
  }

  const fractionValue = numerator / denominator;
  const percentValue = percent / 100;
  const matches = approxEqual(percentValue, decimal) && approxEqual(percentValue, fractionValue);

  setFeedback(
    feedback,
    matches
      ? "Passt zusammen."
      : "Noch nicht stimmig. Prozent, Bruch und Dezimalzahl muessen denselben Wert darstellen.",
    matches ? "ok" : "bad"
  );
});

document.getElementById("percent-hint").addEventListener("click", () => {
  setFeedback(
    document.getElementById("percent-feedback"),
    "Prozent bedeutet Hundertstel. Teile also zuerst durch 100 und pruefe dann, ob Bruch und Dezimalzahl denselben Wert haben.",
    "neutral"
  );
});

document.querySelectorAll(".interest-task").forEach((card, index) => {
  card.querySelector("[data-action='check-interest']").addEventListener("click", () => {
    const input = normalizeNumber(card.querySelector("[data-role='interest-answer']").value);
    const feedback = card.querySelector(".feedback");
    if (Number.isNaN(input)) {
      setFeedback(feedback, "Bitte erst einen Euro-Betrag eingeben.", "bad");
      return;
    }
    const ok = approxEqual(input, simpleInterestAnswers[index]);
    setFeedback(
      feedback,
      ok ? "Richtig." : "Noch nicht richtig. Rechne Kapital mal Zinssatz geteilt durch 100.",
      ok ? "ok" : "bad"
    );
  });

  card.querySelector("[data-action='interest-hint']").addEventListener("click", () => {
    setFeedback(
      card.querySelector(".feedback"),
      "Tipp: Zinsen = Kapital mal Zinssatz geteilt durch 100.",
      "neutral"
    );
  });
});

document.getElementById("sevte-check").addEventListener("click", () => {
  const interest = normalizeNumber(document.getElementById("sevte-interest").value);
  const decision = document.getElementById("sevte-decision").value;
  const ok = approxEqual(interest, 17) && decision === "nein";
  setFeedback(
    document.getElementById("sevte-feedback"),
    ok
      ? "Passt."
      : "Noch nicht. Erst die Zinsen fuer ein Jahr berechnen und dann mit 79 Euro vergleichen.",
    ok ? "ok" : "bad"
  );
});

document.getElementById("sevte-hint").addEventListener("click", () => {
  setFeedback(
    document.getElementById("sevte-feedback"),
    "Zuerst nur die Jahreszinsen von 850 Euro bei 2 Prozent berechnen. Erst danach mit dem Spielpreis vergleichen.",
    "neutral"
  );
});

document.getElementById("thore-check").addEventListener("click", () => {
  const rate = normalizeNumber(document.getElementById("thore-rate").value);
  const ball = document.getElementById("thore-ball").value;
  const ok = approxEqual(rate, 8) && ball === "2";
  setFeedback(
    document.getElementById("thore-feedback"),
    ok
      ? "Richtig erkannt."
      : "Noch nicht. Vergleiche erst, wie gross die Zinsen von 550 Euro auf 594 Euro sind, und pruefe dann die vier Prozentsaetze.",
    ok ? "ok" : "bad"
  );
});

document.getElementById("thore-hint").addEventListener("click", () => {
  setFeedback(
    document.getElementById("thore-feedback"),
    "Der Zinsbetrag ist Endkapital minus Anfangskapital. Danach pruefst du, wie viel Prozent das von 550 Euro sind.",
    "neutral"
  );
});

function compoundValues() {
  const result = [];
  let current = 550;
  for (let year = 1; year <= 10; year += 1) {
    current = Math.round(current * 1.08 * 100) / 100;
    result[year] = current;
  }
  return result;
}

document.getElementById("compound-check").addEventListener("click", () => {
  const values = compoundValues();
  const checks = [
    ["year2", values[2]],
    ["year3", values[3]],
    ["year4", values[4]],
    ["year10", values[10]]
  ];
  const allOk = checks.every(([id, expected]) => approxEqual(normalizeNumber(document.getElementById(id).value), expected));
  setFeedback(
    document.getElementById("compound-feedback"),
    allOk
      ? "Alles richtig weiterverzinst."
      : "Mindestens ein Jahr passt noch nicht. Rechne immer mit dem neuen Kapital des Vorjahres weiter.",
    allOk ? "ok" : "bad"
  );
});

document.getElementById("compound-hint").addEventListener("click", () => {
  setFeedback(
    document.getElementById("compound-feedback"),
    "Nicht immer wieder von 550 Euro ausgehen. Jedes neue Jahr startet mit dem Kapital vom Vorjahr.",
    "neutral"
  );
});

document.querySelectorAll("[data-action='next-step']").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".construction-card");
    const key = card.dataset.construction;
    const steps = constructionSteps[key];
    const list = card.querySelector(".steps");
    const current = list.children.length;
    if (current >= steps.length) {
      return;
    }
    const li = document.createElement("li");
    li.textContent = steps[current];
    list.appendChild(li);
  });
});
