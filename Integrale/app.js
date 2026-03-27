const GROUP_ORDER = ["A", "B", "C", "D", "E", "F"];

const GROUPS = {
  A: {
    id: "A",
    title: "Gruppe A",
    subtitle: "Flaechen zwischen einem Funktionsgraphen und der x-Achse",
    teaser: "Drei Nullstellen, zwei Teilflaechen und ein wichtiger Vorzeichenwechsel.",
    kind: "Graph und x-Achse",
    task:
      "Ermittle den Flaecheninhalt aller von dem Graphen von f mit der x-Achse eingeschlossenen Teilflaechen.",
    givenLatex: ["f(x)=x^3-x^2-2x+1"],
    tips: [
      "Bestimme zuerst die Nullstellen von \\(f\\). Hier gibt es drei reelle Schnittpunkte mit der x-Achse: \\(x_1\\approx-1{,}24698\\), \\(x_2\\approx0{,}44504\\), \\(x_3\\approx1{,}80194\\).",
      "Zwischen \\(x_1\\) und \\(x_2\\) liegt der Graph oberhalb der x-Achse, zwischen \\(x_2\\) und \\(x_3\\) unterhalb der x-Achse.",
      "Du brauchst deshalb zwei Teilintegrale und addierst ihre Betraege: \\(A=\\left|\\int_{x_1}^{x_2} f(x)\\,dx\\right|+\\left|\\int_{x_2}^{x_3} f(x)\\,dx\\right|\\)."
    ],
    answer: {
      target: 2.765547639838901,
      tolerance: 0.03,
      placeholder: "z. B. 2.766",
      errorHint:
        "Noch nicht richtig. Achte darauf, dass hier zwei Teilflaechen entstehen und beide positiv addiert werden."
    },
    geogebra: {
      window: { xMin: -2.3, xMax: 2.5, yMin: -3.6, yMax: 3.8 },
      commands: [
        "f(x)=x^3-x^2-2*x+1",
        "r1=-1.2469796037",
        "r2=0.4450418679",
        "r3=1.8019377358",
        "P1=(r1,0)",
        "P2=(r2,0)",
        "P3=(r3,0)",
        "I1=Integral(f,r1,r2)",
        "I2=Integral(f,r2,r3)"
      ]
    },
    geoCommandsNote:
      "Die Grafik zeigt die beiden Teilflaechen getrennt, weil der Graph die x-Achse mehrfach schneidet.",
    casSteps: [
      {
        title: "Funktion anlegen",
        lines: ["f(x):=x^3-x^2-2*x+1"],
        note: "Lege die Funktion zuerst an."
      },
      {
        title: "Linke Nullstelle",
        lines: ["x1:=nSolve(f(x)=0,x,-2)"],
        note: "Mit einem Startwert links von der y-Achse findet der CAS die erste Nullstelle."
      },
      {
        title: "Mittlere Nullstelle",
        lines: ["x2:=nSolve(f(x)=0,x,0)"],
        note: "Ein Startwert nahe 0 liefert die mittlere Nullstelle."
      },
      {
        title: "Rechte Nullstelle",
        lines: ["x3:=nSolve(f(x)=0,x,2)"],
        note: "Ein Startwert rechts liefert die dritte Nullstelle."
      },
      {
        title: "Erste Teilflaeche",
        lines: ["A1:=abs(int(f(x),x,x1,x2))"],
        note: "Die erste Teilflaeche wird einzeln als Betrag berechnet."
      },
      {
        title: "Zweite Teilflaeche",
        lines: ["A2:=abs(int(f(x),x,x2,x3))"],
        note: "Auch die zweite Teilflaeche wird separat berechnet."
      },
      {
        title: "Gesamtflaeche",
        lines: ["A:=A1+A2"],
        note: "Zum Schluss addierst du beide positiven Teilflaechen."
      }
    ],
    casNote:
      "Die Eingaben sind an TI-Nspire-CAS angelehnt und lassen sich Schritt fuer Schritt durchklicken."
  },
  B: {
    id: "B",
    title: "Gruppe B",
    subtitle: "Flaechen zwischen sich schneidenden Funktionsgraphen",
    teaser: "Die obere Funktion wechselt im Intervall, deshalb musst du aufteilen.",
    kind: "Zwei Graphen",
    task:
      "Ermittle den Flaecheninhalt im Intervall zwischen den Graphen von f und g.",
    givenLatex: ["f(x)=x^4+4", "g(x)=5x^2", "I=[-1;3]"],
    tips: [
      "Setze \\(f(x)=g(x)\\). Dann entsteht \\(x^4-5x^2+4=0\\).",
      "Die relevanten Schnittpunkte im Intervall sind \\(x=-1\\), \\(x=1\\) und \\(x=2\\).",
      "Auf \\([-1,1]\\) liegt \\(f\\) ueber \\(g\\), auf \\([1,2]\\) liegt \\(g\\) ueber \\(f\\), auf \\([2,3]\\) wieder \\(f\\) ueber \\(g\\).",
      "Deshalb gilt \\(A=\\int_{-1}^{1}(f-g)\\,dx+\\int_{1}^{2}(g-f)\\,dx+\\int_{2}^{3}(f-g)\\,dx\\)."
    ],
    answer: {
      target: 316 / 15,
      tolerance: 0.03,
      placeholder: "z. B. 316/15 oder 21.067",
      errorHint:
        "Noch nicht richtig. Pruefe, ob du das Intervall an den Schnittpunkten x=1 und x=2 getrennt hast."
    },
    geogebra: {
      window: { xMin: -2.5, xMax: 3.5, yMin: -3, yMax: 90 },
      commands: [
        "f(x)=x^4+4",
        "g(x)=5*x^2",
        "P1=(-1,5)",
        "P2=(1,5)",
        "P3=(2,20)",
        "I1=IntegralBetween(f,g,-1,1)",
        "I2=IntegralBetween(f,g,1,2)",
        "I3=IntegralBetween(f,g,2,3)"
      ]
    },
    geoCommandsNote:
      "Die Flaeche ist in drei Abschnitte zerlegt, damit der Wechsel der oberen Funktion sichtbar bleibt.",
    casSteps: [
      {
        title: "Funktionen anlegen",
        lines: ["f(x):=x^4+4", "g(x):=5*x^2"],
        note: "Lege beide Funktionen an."
      },
      {
        title: "Schnittpunkte bestimmen",
        lines: ["solve(f(x)=g(x),x)"],
        note: "Hier siehst du, wo die Aufteilung des Intervalls noetig ist."
      },
      {
        title: "Erster Abschnitt",
        lines: ["A1:=int(f(x)-g(x),x,-1,1)"],
        note: "Auf dem ersten Abschnitt liegt f ueber g."
      },
      {
        title: "Zweiter Abschnitt",
        lines: ["A2:=int(g(x)-f(x),x,1,2)"],
        note: "Zwischen 1 und 2 musst du die Reihenfolge umdrehen."
      },
      {
        title: "Dritter Abschnitt",
        lines: ["A3:=int(f(x)-g(x),x,2,3)"],
        note: "Ab x=2 liegt wieder f ueber g."
      },
      {
        title: "Gesamtflaeche",
        lines: ["A:=A1+A2+A3"],
        note: "Addiere die drei positiven Teilflaechen."
      }
    ],
    casNote:
      "Hier ist die Zerlegung wichtiger als die eigentliche Integration."
  },
  C: {
    id: "C",
    title: "Gruppe C",
    subtitle: "Flaechen zwischen einem Funktionsgraphen und der x-Achse",
    teaser: "Eine doppelte Nullstelle sorgt dafuer, dass der Graph die x-Achse nur beruehrt.",
    kind: "Graph und x-Achse",
    task:
      "Ermittle den Flaecheninhalt der von dem Graphen von f und der x-Achse eingeschlossenen Flaeche.",
    givenLatex: ["f(x)=(x^2-1)^2-1"],
    tips: [
      "Multipliziere zuerst aus: \\(f(x)=x^4-2x^2=x^2(x^2-2)\\).",
      "Die Nullstellen sind \\(x=-\\sqrt{2}\\), \\(x=0\\) und \\(x=\\sqrt{2}\\). Bei \\(x=0\\) liegt eine doppelte Nullstelle vor.",
      "Im Intervall \\([-\\sqrt{2},\\sqrt{2}]\\) liegt der Graph unterhalb der x-Achse.",
      "Deshalb reicht ein einziges Betragsintegral: \\(A=\\left|\\int_{-\\sqrt{2}}^{\\sqrt{2}} f(x)\\,dx\\right|\\)."
    ],
    answer: {
      target: (16 * Math.sqrt(2)) / 15,
      tolerance: 0.02,
      placeholder: "z. B. 16*sqrt(2)/15",
      errorHint:
        "Noch nicht richtig. Achte darauf, dass x=0 nur ein Beruehrpunkt ist und keine neue Flaeche abtrennt."
    },
    geogebra: {
      window: { xMin: -2.3, xMax: 2.3, yMin: -1.5, yMax: 2.6 },
      commands: [
        "f(x)=(x^2-1)^2-1",
        "P1=(-sqrt(2),0)",
        "P2=(0,0)",
        "P3=(sqrt(2),0)",
        "I1=Integral(f,-sqrt(2),sqrt(2))"
      ]
    },
    geoCommandsNote:
      "Trotz der drei Nullstellen entsteht hier nur eine zusammenhaengende Flaeche.",
    casSteps: [
      {
        title: "Funktion anlegen",
        lines: ["f(x):=(x^2-1)^2-1"],
        note: "Lege die Funktion an."
      },
      {
        title: "Funktion faktorisieren",
        lines: ["factor(f(x))"],
        note: "So wird die Struktur mit der doppelten Nullstelle sichtbar."
      },
      {
        title: "Nullstellen bestimmen",
        lines: ["solve(f(x)=0,x)"],
        note: "Jetzt kannst du die Integrationsgrenzen direkt ablesen."
      },
      {
        title: "Flaeche berechnen",
        lines: ["A:=abs(int(f(x),x,-sqrt(2),sqrt(2)))"],
        note: "Ein einziges Betragsintegral reicht hier aus."
      }
    ],
    casNote:
      "Wenn du zuerst faktorisierst, wird die Aufgabe deutlich transparenter."
  },
  D: {
    id: "D",
    title: "Gruppe D",
    subtitle: "Flaechen zwischen sich schneidenden Funktionsgraphen",
    teaser: "Im Intervall [0;2] gibt es genau einen Schnittpunkt.",
    kind: "Zwei Graphen",
    task:
      "Ermittle den Flaecheninhalt im Intervall zwischen den Graphen von f und g.",
    givenLatex: ["f(x)=x^3+x", "g(x)=x^2+1", "I=[0;2]"],
    tips: [
      "Setze \\(f(x)=g(x)\\). Dann erhaeltst du \\(x^3-x^2+x-1=(x-1)(x^2+1)\\).",
      "Der einzige reelle Schnittpunkt liegt bei \\(x=1\\).",
      "Auf \\([0,1]\\) liegt \\(g\\) ueber \\(f\\), auf \\([1,2]\\) liegt \\(f\\) ueber \\(g\\).",
      "Deshalb gilt \\(A=\\int_0^1(g-f)\\,dx+\\int_1^2(f-g)\\,dx\\)."
    ],
    answer: {
      target: 2.5,
      tolerance: 0.02,
      placeholder: "z. B. 5/2",
      errorHint:
        "Noch nicht richtig. Trenne unbedingt am Schnittpunkt x=1 und beachte den Wechsel der oberen Funktion."
    },
    geogebra: {
      window: { xMin: -0.5, xMax: 2.4, yMin: -0.4, yMax: 11 },
      commands: [
        "f(x)=x^3+x",
        "g(x)=x^2+1",
        "P1=(1,2)",
        "I1=IntegralBetween(f,g,0,1)",
        "I2=IntegralBetween(f,g,1,2)"
      ]
    },
    geoCommandsNote:
      "Die Grafik ist in zwei Teile zerlegt, damit der Wechsel bei x=1 sofort sichtbar wird.",
    casSteps: [
      {
        title: "Funktionen anlegen",
        lines: ["f(x):=x^3+x", "g(x):=x^2+1"],
        note: "Lege zuerst beide Funktionen an."
      },
      {
        title: "Schnittpunkt bestimmen",
        lines: ["factor(f(x)-g(x))", "solve(f(x)=g(x),x)"],
        note: "Hier siehst du direkt, dass es nur einen reellen Schnittpunkt gibt."
      },
      {
        title: "Erster Abschnitt",
        lines: ["A1:=int(g(x)-f(x),x,0,1)"],
        note: "Auf [0,1] liegt g oberhalb."
      },
      {
        title: "Zweiter Abschnitt",
        lines: ["A2:=int(f(x)-g(x),x,1,2)"],
        note: "Auf [1,2] liegt f oberhalb."
      },
      {
        title: "Gesamtflaeche",
        lines: ["A:=A1+A2"],
        note: "Am Ende addierst du beide Teilflaechen."
      }
    ],
    casNote:
      "Diese Gruppe ist ein gutes Beispiel fuer das saubere Wechseln zwischen f-g und g-f."
  },
  E: {
    id: "E",
    title: "Gruppe E",
    subtitle: "Flaechen zwischen einem Funktionsgraphen und der x-Achse",
    teaser: "Im ganzen Intervall liegt die Funktion unterhalb der x-Achse.",
    kind: "Graph und x-Achse",
    task:
      "Ermittle den Flaecheninhalt zwischen dem Graphen von f und der x-Achse im gegebenen Intervall.",
    givenLatex: ["f(x)=0{,}25x^3-2", "I=[-4;1]"],
    tips: [
      "Bestimme zuerst die Nullstelle: \\(0{,}25x^3-2=0\\Rightarrow x=2\\).",
      "Die Nullstelle liegt ausserhalb des Intervalls \\([-4,1]\\).",
      "Damit ist \\(f(x)\\) im gesamten Intervall negativ.",
      "Deshalb reicht \\(A=\\left|\\int_{-4}^{1} f(x)\\,dx\\right|\\)."
    ],
    answer: {
      target: 415 / 16,
      tolerance: 0.03,
      placeholder: "z. B. 415/16",
      errorHint:
        "Noch nicht richtig. Hier brauchst du kein Aufteilen, aber du musst den Betrag der negativen Flaeche beachten."
    },
    geogebra: {
      window: { xMin: -4.7, xMax: 1.5, yMin: -20.5, yMax: 5 },
      commands: [
        "f(x)=0.25*x^3-2",
        "I1=Integral(f,-4,1)"
      ]
    },
    geoCommandsNote:
      "Die markierte Flaeche besteht hier nur aus einem einzigen Abschnitt.",
    casSteps: [
      {
        title: "Funktion anlegen",
        lines: ["f(x):=0.25*x^3-2"],
        note: "Lege die Funktion an."
      },
      {
        title: "Nullstelle pruefen",
        lines: ["solve(f(x)=0,x)"],
        note: "So siehst du sofort, dass die Nullstelle bei x=2 ausserhalb des Intervalls liegt."
      },
      {
        title: "Flaeche berechnen",
        lines: ["A:=abs(int(f(x),x,-4,1))"],
        note: "Da der Graph im ganzen Intervall unter der x-Achse liegt, brauchst du nur ein Betragsintegral."
      }
    ],
    casNote:
      "Die eigentliche Idee hier ist die Vorzeichenkontrolle vor dem Rechnen."
  },
  F: {
    id: "F",
    title: "Gruppe F",
    subtitle: "Flaechen zwischen sich schneidenden Funktionsgraphen",
    teaser: "Drei Schnittpunkte, zwei Teilflaechen und numerische Grenzen.",
    kind: "Zwei Graphen",
    task:
      "Ermittle den Flaecheninhalt aller von den Graphen von f und g eingeschlossenen Flaechen.",
    givenLatex: ["f(x)=x^3-4x+3", "g(x)=4-0{,}5x^2"],
    tips: [
      "Setze \\(f(x)=g(x)\\). Daraus entsteht \\(x^3+0{,}5x^2-4x-1=0\\).",
      "Die drei Schnittpunkte sind numerisch \\(x_1\\approx-2{,}14648\\), \\(x_2\\approx-0{,}24615\\) und \\(x_3\\approx1{,}89263\\).",
      "Zwischen diesen drei Schnittpunkten liegen genau zwei eingeschlossene Teilflaechen.",
      "Deshalb gilt \\(A=\\left|\\int_{x_1}^{x_2}(f-g)\\,dx\\right|+\\left|\\int_{x_2}^{x_3}(f-g)\\,dx\\right|\\)."
    ],
    answer: {
      target: 8.375415651009177,
      tolerance: 0.03,
      placeholder: "z. B. 8.375",
      errorHint:
        "Noch nicht richtig. Bestimme zuerst alle drei Schnittpunkte numerisch und rechne danach die zwei Teilflaechen getrennt."
    },
    geogebra: {
      window: { xMin: -3.1, xMax: 2.8, yMin: -6.5, yMax: 8.2 },
      commands: [
        "f(x)=x^3-4*x+3",
        "g(x)=4-0.5*x^2",
        "r1=-2.1464756903",
        "r2=-0.2461547421",
        "r3=1.8926304324",
        "P1=(r1,4-0.5*r1^2)",
        "P2=(r2,4-0.5*r2^2)",
        "P3=(r3,4-0.5*r3^2)",
        "I1=IntegralBetween(f,g,r1,r2)",
        "I2=IntegralBetween(f,g,r2,r3)"
      ]
    },
    geoCommandsNote:
      "Die Grafik markiert genau die beiden eingeschlossenen Bereiche zwischen den drei Schnittpunkten.",
    casSteps: [
      {
        title: "Funktionen anlegen",
        lines: ["f(x):=x^3-4*x+3", "g(x):=4-0.5*x^2"],
        note: "Lege beide Funktionen an."
      },
      {
        title: "Linker Schnittpunkt",
        lines: ["x1:=nSolve(f(x)=g(x),x,-3)"],
        note: "Ein Startwert links liefert den ersten Schnittpunkt."
      },
      {
        title: "Mittlerer Schnittpunkt",
        lines: ["x2:=nSolve(f(x)=g(x),x,0)"],
        note: "Mit einem Startwert nahe 0 findest du den mittleren Schnittpunkt."
      },
      {
        title: "Rechter Schnittpunkt",
        lines: ["x3:=nSolve(f(x)=g(x),x,2)"],
        note: "Ein Startwert rechts liefert den dritten Schnittpunkt."
      },
      {
        title: "Erste Teilflaeche",
        lines: ["A1:=abs(int(f(x)-g(x),x,x1,x2))"],
        note: "Berechne zuerst die linke Teilflaeche."
      },
      {
        title: "Zweite Teilflaeche",
        lines: ["A2:=abs(int(f(x)-g(x),x,x2,x3))"],
        note: "Danach folgt die rechte Teilflaeche."
      },
      {
        title: "Gesamtflaeche",
        lines: ["A:=A1+A2"],
        note: "Addiere die beiden positiven Teilflaechen."
      }
    ],
    casNote:
      "Bei dieser Gruppe ist die numerische Nullstellensuche der Schluessel zum Rest."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderIndexPage();
  renderDetailPage();
});

function renderIndexPage() {
  const grid = document.querySelector("#group-grid");
  if (!grid) {
    return;
  }

  grid.innerHTML = GROUP_ORDER.map((id) => {
    const group = GROUPS[id];
    const chipClass = group.kind === "Graph und x-Achse" ? "chip-blue" : "chip-sand";

    return `
      <article class="card">
        <div class="card-head">
          <div>
            <h2>${group.title}</h2>
            <p class="group-kind">${group.subtitle}</p>
          </div>
          <div class="group-badge" aria-hidden="true">${group.id}</div>
        </div>
        <div class="legend">
          <span class="chip ${chipClass}">${group.kind}</span>
        </div>
        <p>${group.teaser}</p>
        <div class="card-actions">
          <a class="button-link" href="gruppe.html?group=${group.id}">Gruppe oeffnen</a>
        </div>
      </article>
    `;
  }).join("");

  renderMath(grid);
}

function renderDetailPage() {
  const root = document.querySelector("#group-detail");
  if (!root) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedId = (params.get("group") || "A").toUpperCase();
  const group = GROUPS[requestedId];

  if (!group) {
    root.innerHTML = `
      <section class="empty-state">
        <h2>Diese Gruppe gibt es nicht.</h2>
        <p>Bitte kehre zur Startseite zurueck und waehle eine Gruppe von A bis F.</p>
        <div class="card-actions">
          <a class="button-link" href="index.html">Zur Startseite</a>
        </div>
      </section>
    `;
    return;
  }

  document.title = `Integraltrainer - ${group.title}`;

  const kicker = document.querySelector("#group-kicker");
  const title = document.querySelector("#group-title");
  const subtitle = document.querySelector("#group-subtitle");
  if (kicker) kicker.textContent = group.title;
  if (title) title.textContent = `${group.title}: ${group.subtitle}`;
  if (subtitle) subtitle.textContent = group.teaser;

  const neighbors = getNeighbors(group.id);

  root.innerHTML = `
    <section class="detail-grid">
      <div>
        <details class="task-panel fold-panel" open>
          <summary class="fold-summary">
            <span class="fold-summary-label">Aufgabe</span>
            <span class="fold-summary-note">ein- und ausklappen</span>
          </summary>
          <div class="fold-content">
            <p class="eyebrow">Aufgabe</p>
            <h2>${group.subtitle}</h2>
            <p class="task-text">${group.task}</p>
            <div class="task-meta">
              <div>
                <h3>Gegeben</h3>
                <ul class="math-list">
                  ${group.givenLatex.map((line) => `<li>\\(${line}\\)</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        </details>

        <details class="tips-panel fold-panel" open>
          <summary class="fold-summary">
            <span class="fold-summary-label">Tipps</span>
            <span class="fold-summary-note">schrittweise oeffnen</span>
          </summary>
          <div class="fold-content">
            <p class="eyebrow">Tipps</p>
            <h2>Schritt fuer Schritt</h2>
            <div class="tips-list">
              ${group.tips.map((tip, index) => {
                return `
                  <details class="tip">
                    <summary>Tipp ${index + 1} anzeigen</summary>
                    <div class="tip-body">${tip}</div>
                  </details>
                `;
              }).join("")}
            </div>
          </div>
        </details>

        <details class="solution-panel fold-panel" open>
          <summary class="fold-summary">
            <span class="fold-summary-label">Loesung pruefen</span>
            <span class="fold-summary-note">Antwort eingeben</span>
          </summary>
          <div class="fold-content">
            <p class="eyebrow">Antwort pruefen</p>
            <h2>Flaecheninhalt eingeben</h2>
            <p class="note">
              Dezimalzahlen und Ausdruecke wie <code>316/15</code> oder <code>16*sqrt(2)/15</code> werden akzeptiert.
            </p>
            <label class="answer-label" for="answer-input">Deine Loesung</label>
            <div class="answer-form">
              <input
                id="answer-input"
                class="answer-input"
                type="text"
                inputmode="text"
                autocomplete="off"
                placeholder="${group.answer.placeholder}"
              >
              <button class="button-link" type="button" data-check-answer>Pruefen</button>
              <button class="nav-link is-secondary" type="button" data-reset-answer>Eingabe loeschen</button>
            </div>
            <div id="answer-feedback" class="answer-feedback" hidden></div>
          </div>
        </details>
      </div>

      <div>
        <details class="geo-panel fold-panel" data-geo-panel>
          <summary class="fold-summary">
            <span class="fold-summary-label">GeoGebra-Grafik</span>
            <span class="fold-summary-note">bei Bedarf anzeigen</span>
          </summary>
          <div class="fold-content">
            <div class="geo-header">
              <p class="eyebrow">GeoGebra</p>
              <button class="reload-button" type="button" data-reload-ggb>Grafik neu laden</button>
            </div>
            <div class="geo-stage">
              <div id="ggb-container" class="ggb-frame" aria-label="GeoGebra-Ansicht">
                <div class="ggb-placeholder">
                  Grafik wird erst beim Oeffnen dieses Bereichs geladen.
                </div>
              </div>
              <p class="geo-note">${group.geoCommandsNote}</p>
              <details class="tip" style="margin-top: 16px;">
                <summary>GeoGebra-Befehle anzeigen</summary>
                <div class="tip-body">
                  <pre class="code-block">${group.geogebra.commands.map((line) => escapeHtml(line)).join("\n")}</pre>
                </div>
              </details>
            </div>
          </div>
        </details>

        <details class="cas-panel fold-panel">
          <summary class="fold-summary">
            <span class="fold-summary-label">TI-Nspire CX II-T CAS</span>
            <span class="fold-summary-note">Schritte durchklicken</span>
          </summary>
          <div class="fold-content">
            <div class="cas-header">
              <p class="eyebrow">TI-Nspire CX II-T CAS</p>
            </div>
            <div class="cas-body">
              <div class="cas-step-tabs" role="tablist" aria-label="CAS-Schritte">
                ${group.casSteps.map((step, index) => {
                  return `
                    <button
                      class="cas-step-tab${index === 0 ? " is-active" : ""}"
                      type="button"
                      data-cas-step="${index}"
                      aria-label="Schritt ${index + 1}: ${escapeHtml(step.title)}"
                    >
                      ${index + 1}
                    </button>
                  `;
                }).join("")}
              </div>
              <div class="cas-screen">
                <div class="cas-screen-header">
                  <span id="cas-step-counter">Schritt 1 / ${group.casSteps.length}</span>
                  <span id="cas-step-title">${group.casSteps[0].title}</span>
                </div>
                <pre id="cas-screen-lines">${group.casSteps[0].lines.map((line) => `> ${line}`).join("\n")}</pre>
              </div>
              <p id="cas-step-note" class="cas-note">${group.casSteps[0].note}</p>
              <div class="cas-actions">
                <button class="copy-button" type="button" data-copy-cas-step>Aktuellen Schritt kopieren</button>
                <button class="nav-link is-secondary" type="button" data-copy-cas-all>Alle Schritte kopieren</button>
              </div>
              <div class="cas-nav">
                <button class="nav-link is-secondary" type="button" data-cas-prev>Zurueck</button>
                <button class="nav-link" type="button" data-cas-next>Weiter</button>
              </div>
              <p class="cas-note">${group.casNote}</p>
            </div>
          </div>
        </details>
      </div>
    </section>

    <nav class="nav-bar" aria-label="Gruppennavigation">
      <a class="nav-link is-secondary" href="gruppe.html?group=${neighbors.previous}">Vorherige Gruppe: ${neighbors.previous}</a>
      <a class="nav-link" href="gruppe.html?group=${neighbors.next}">Naechste Gruppe: ${neighbors.next}</a>
    </nav>
  `;

  renderMath(root);
  setupAnswerChecker(group);
  setupCasStepper(group);
  setupGeoGebra(group);
}

function setupAnswerChecker(group) {
  const input = document.querySelector("#answer-input");
  const checkButton = document.querySelector("[data-check-answer]");
  const resetButton = document.querySelector("[data-reset-answer]");
  const feedback = document.querySelector("#answer-feedback");

  if (!input || !checkButton || !resetButton || !feedback) {
    return;
  }

  const showFeedback = (kind, message) => {
    feedback.hidden = false;
    feedback.className = `answer-feedback feedback-${kind}`;
    feedback.textContent = message;
  };

  const validate = () => {
    const value = evaluateMathExpression(input.value);
    if (value === null) {
      showFeedback(
        "bad",
        "Die Eingabe konnte nicht gelesen werden. Erlaubt sind Dezimalzahlen, Brueche, sqrt(...), abs(...) und pi."
      );
      return;
    }

    const delta = Math.abs(value - group.answer.target);
    const negativeDelta = Math.abs(value + group.answer.target);

    if (negativeDelta <= group.answer.tolerance) {
      showFeedback("close", "Fast richtig. Beim Flaecheninhalt muss das Ergebnis positiv sein.");
      return;
    }

    if (delta <= group.answer.tolerance) {
      showFeedback("good", getPraiseMessage());
      return;
    }

    if (delta <= group.answer.tolerance * 4) {
      showFeedback("close", "Fast richtig. Pruefe noch einmal Rundung, Betrag oder die letzte Summe.");
      return;
    }

    showFeedback("bad", group.answer.errorHint);
  };

  checkButton.addEventListener("click", validate);
  resetButton.addEventListener("click", () => {
    input.value = "";
    feedback.hidden = true;
    feedback.className = "answer-feedback";
    input.focus();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      validate();
    }
  });
}

function setupCasStepper(group) {
  const tabs = Array.from(document.querySelectorAll("[data-cas-step]"));
  const title = document.querySelector("#cas-step-title");
  const counter = document.querySelector("#cas-step-counter");
  const lines = document.querySelector("#cas-screen-lines");
  const note = document.querySelector("#cas-step-note");
  const prevButton = document.querySelector("[data-cas-prev]");
  const nextButton = document.querySelector("[data-cas-next]");
  const copyStepButton = document.querySelector("[data-copy-cas-step]");
  const copyAllButton = document.querySelector("[data-copy-cas-all]");

  if (!tabs.length || !title || !counter || !lines || !note || !prevButton || !nextButton) {
    return;
  }

  let activeIndex = 0;

  const renderStep = () => {
    const step = group.casSteps[activeIndex];
    title.textContent = step.title;
    counter.textContent = `Schritt ${activeIndex + 1} / ${group.casSteps.length}`;
    lines.textContent = step.lines.map((line) => `> ${line}`).join("\n");
    note.textContent = step.note;

    tabs.forEach((tab, index) => {
      tab.classList.toggle("is-active", index === activeIndex);
    });

    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === group.casSteps.length - 1;
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activeIndex = index;
      renderStep();
    });
  });

  prevButton.addEventListener("click", () => {
    activeIndex = Math.max(0, activeIndex - 1);
    renderStep();
  });

  nextButton.addEventListener("click", () => {
    activeIndex = Math.min(group.casSteps.length - 1, activeIndex + 1);
    renderStep();
  });

  if (copyStepButton) {
    copyStepButton.addEventListener("click", async () => {
      const text = group.casSteps[activeIndex].lines.join("\n");
      await copyText(copyStepButton, text, "Schritt kopiert");
    });
  }

  if (copyAllButton) {
    copyAllButton.addEventListener("click", async () => {
      const text = group.casSteps
        .map((step, index) => `Schritt ${index + 1}: ${step.title}\n${step.lines.join("\n")}`)
        .join("\n\n");
      await copyText(copyAllButton, text, "Alle Schritte kopiert");
    });
  }

  renderStep();
}

async function copyText(button, text, successLabel) {
  const originalLabel = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = successLabel;
  } catch (_error) {
    button.textContent = "Kopieren nicht moeglich";
  }

  window.setTimeout(() => {
    button.textContent = originalLabel;
  }, 1800);
}

function setupGeoGebra(group) {
  const container = document.querySelector("#ggb-container");
  const reloadButton = document.querySelector("[data-reload-ggb]");
  const panel = document.querySelector("[data-geo-panel]");
  if (!container || !panel) {
    return;
  }

  let hasLoaded = false;

  const injectApplet = () => {
    if (typeof window.GGBApplet !== "function") {
      container.innerHTML = `
        <div class="empty-state" style="margin: 0; height: 100%; display: grid; place-items: center;">
          <div>
            <h3>GeoGebra konnte nicht geladen werden.</h3>
            <p>Bitte pruefe die Internetverbindung oder lade die Seite neu.</p>
          </div>
        </div>
      `;
      return;
    }

    container.innerHTML = "";
    const width = Math.max(Math.min(container.clientWidth || 900, 960), 320);
    const height = Math.max(Math.round(width * 0.66), 360);

    const params = {
      appName: "classic",
      perspective: "G",
      width,
      height,
      showToolBar: false,
      showAlgebraInput: false,
      showMenuBar: false,
      showResetIcon: true,
      showFullscreenButton: false,
      showSuggestionButtons: false,
      allowStyleBar: false,
      enableShiftDragZoom: true,
      enableRightClick: false,
      preventFocus: false,
      useBrowserForJS: true,
      borderColor: "#d9e5ff",
      appletOnLoad(api) {
        api.evalCommand('SetPerspective("G")');
        api.evalCommand("ShowGrid(false)");
        api.evalCommand("ShowAxes(true)");
        api.setCoordSystem(
          group.geogebra.window.xMin,
          group.geogebra.window.xMax,
          group.geogebra.window.yMin,
          group.geogebra.window.yMax
        );

        group.geogebra.commands.forEach((command) => api.evalCommand(command));
        styleGeoObjects(api);
      }
    };

    const applet = new window.GGBApplet(params, true);
    applet.inject("ggb-container", "preferhtml5");
  };

  const ensureApplet = () => {
    if (hasLoaded) {
      return;
    }
    hasLoaded = true;
    injectApplet();
  };

  if (panel.open) {
    ensureApplet();
  }

  panel.addEventListener("toggle", () => {
    if (panel.open) {
      ensureApplet();
    }
  });

  if (reloadButton) {
    reloadButton.addEventListener("click", () => {
      hasLoaded = true;
      injectApplet();
    });
  }
}

function styleGeoObjects(api) {
  ["f", "g"].forEach((name, index) => {
    if (!api.exists(name)) {
      return;
    }

    if (index === 0) {
      api.setColor(name, 31, 95, 191);
    } else {
      api.setColor(name, 197, 81, 77);
    }

    api.setLineThickness(name, 6);
    api.setLabelVisible(name, false);
  });

  ["I1", "I2", "I3"].forEach((name, index) => {
    if (!api.exists(name)) {
      return;
    }

    const palette = [
      [232, 187, 103],
      [116, 170, 255],
      [92, 184, 139]
    ][index];

    api.setColor(name, palette[0], palette[1], palette[2]);
    api.setFilling(name, 0.4);
    api.setLabelVisible(name, false);
  });

  ["P1", "P2", "P3"].forEach((name) => {
    if (!api.exists(name)) {
      return;
    }

    api.setColor(name, 27, 43, 56);
    api.setPointSize(name, 4);
    api.setLabelVisible(name, false);
    api.setFixed(name, true, false);
  });
}

function renderMath(root = document.body) {
  if (typeof window.renderMathInElement !== "function" || !root) {
    return;
  }

  window.renderMathInElement(root, {
    delimiters: [
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true }
    ],
    throwOnError: false
  });
}

function evaluateMathExpression(rawValue) {
  if (!rawValue) {
    return null;
  }

  let expression = String(rawValue).trim().toLowerCase();
  if (!expression) {
    return null;
  }

  expression = expression
    .replaceAll("−", "-")
    .replaceAll("×", "*")
    .replaceAll("·", "*")
    .replaceAll("÷", "/")
    .replaceAll("π", "pi")
    .replaceAll(",", ".");

  expression = expression.split("=").pop();
  expression = expression.replace(/\s+/g, "");
  expression = expression.replace(/flaecheneinheiten|flacheneinheiten|fe/g, "");
  expression = expression.replace(/sqrt/g, "S");
  expression = expression.replace(/pi/g, "P");
  expression = expression.replace(/abs/g, "A");

  if (!expression || /[^0-9+\-*/^().SPA]/.test(expression)) {
    return null;
  }

  expression = expression.replace(/(\d|\)|P)(?=(S|P|A|\())/g, "$1*");
  expression = expression.replace(/(\))(?=\d)/g, "$1*");

  const jsExpression = expression
    .replace(/\^/g, "**")
    .replace(/S/g, "Math.sqrt")
    .replace(/P/g, "Math.PI")
    .replace(/A/g, "Math.abs");

  try {
    const value = Function(`"use strict"; return (${jsExpression});`)();
    if (!Number.isFinite(value)) {
      return null;
    }
    return value;
  } catch (_error) {
    return null;
  }
}

function getNeighbors(id) {
  const index = GROUP_ORDER.indexOf(id);
  const previous = GROUP_ORDER[(index - 1 + GROUP_ORDER.length) % GROUP_ORDER.length];
  const next = GROUP_ORDER[(index + 1) % GROUP_ORDER.length];
  return { previous, next };
}

function getPraiseMessage() {
  const messages = [
    "Stark geloest. Dein Flaecheninhalt ist richtig.",
    "Sehr gut gerechnet. Das Ergebnis passt.",
    "Klasse. Genau so soll der Flaecheninhalt herauskommen.",
    "Sauber gearbeitet. Deine Loesung stimmt."
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
