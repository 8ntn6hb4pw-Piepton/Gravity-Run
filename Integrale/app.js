const GROUP_ORDER = ["A", "B", "C", "D", "E", "F"];

const GROUPS = {
  A: {
    id: "A",
    title: "Gruppe A",
    subtitle: "Flächen zwischen einem Funktionsgraphen und der x-Achse",
    teaser: "Drei Nullstellen, zwei Teilflächen und ein wichtiger Vorzeichenwechsel.",
    kind: "Graph und x-Achse",
    task:
      "Finde den Flächeninhalt aller Teilflächen, die der Graph von f mit der x-Achse einschließt.",
    givenLatex: ["f(x)=x^3-x^2-2x+1"],
    tips: [
      "Schau zuerst, wo der Graph die x-Achse schneidet. Genau diese Stellen brauchst du später als Grenzen für die Integrale.",
      "Hier gibt es drei Nullstellen: \\(x_1\\approx-1{,}24698\\), \\(x_2\\approx0{,}44504\\), \\(x_3\\approx1{,}80194\\). Das ist wichtig, weil dadurch nicht nur eine Fläche entsteht, sondern zwei.",
      "Zwischen \\(x_1\\) und \\(x_2\\) liegt der Graph über der x-Achse, zwischen \\(x_2\\) und \\(x_3\\) darunter. Wenn du nur ein einziges Integral rechnest, würden sich Plus- und Minusflächen teilweise wegheben.",
      "Deshalb rechnest du zwei Teilflächen getrennt und addierst am Ende beide positiv: \\(A=\\left|\\int_{x_1}^{x_2} f(x)\\,dx\\right|+\\left|\\int_{x_2}^{x_3} f(x)\\,dx\\right|\\)."
    ],
    answer: {
      target: 2.765547639838901,
      tolerance: 0.03,
      placeholder: "z. B. 2,766",
      errorHint:
        "Noch nicht richtig. Hier entstehen zwei Teilflächen. Beide müssen am Ende positiv addiert werden."
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
      "Die Grafik zeigt die beiden Teilflächen getrennt, weil der Graph die x-Achse mehrfach schneidet.",
    casSteps: [
      {
        title: "Funktion eingeben",
        lines: ["f(x):=x^3-x^2-2*x+1"],
        note: "So legst du die Funktion im TI-Nspire CX II-T CAS an."
      },
      {
        title: "Nullstellen holen",
        lines: ["polyroots(x^3-x^2-2*x+1,x)"],
        note: "Das passt zu eurem Handout: Menü > Algebra > Polynomwerkzeuge > Reelle Polynomwurzel."
      },
      {
        title: "Grenzen speichern",
        lines: ["x1:=-1.24698", "x2:=0.44504", "x3:=1.80194"],
        note: "Die drei Werte aus der Ausgabe speicherst du ab, damit du sie gleich bequem einsetzen kannst."
      },
      {
        title: "Erste Teilfläche",
        lines: ["A1:=abs(∫(f(x),x,x1,x2))"],
        note: "Die erste Fläche rechnest du extra aus. Der Betrag ist wichtig, damit aus einer Fläche keine negative Zahl wird."
      },
      {
        title: "Zweite Teilfläche",
        lines: ["A2:=abs(∫(f(x),x,x2,x3))"],
        note: "Dasselbe machst du noch einmal für die zweite Fläche."
      },
      {
        title: "Alles zusammen",
        lines: ["A:=A1+A2"],
        note: "Erst jetzt addierst du beide Teilflächen zur gesamten Fläche."
      }
    ],
    casNote:
      "Die Schritte orientieren sich am TI-Nspire-Handout: Funktion speichern, Nullstellen holen, Grenzen übernehmen und die Teilintegrale getrennt rechnen."
  },
  B: {
    id: "B",
    title: "Gruppe B",
    subtitle: "Flächen zwischen sich schneidenden Funktionsgraphen",
    teaser: "Die obere Funktion wechselt im Intervall, deshalb musst du aufteilen.",
    kind: "Zwei Graphen",
    task:
      "Finde den Flächeninhalt im Intervall zwischen den Graphen von f und g.",
    givenLatex: ["f(x)=x^4+4", "g(x)=5x^2", "I=[-1;3]"],
    tips: [
      "Zuerst musst du wissen, wo sich die beiden Graphen schneiden. Genau dort ändert sich nämlich, welcher Graph oben liegt.",
      "Setzt du \\(f(x)=g(x)\\), bekommst du \\(x^4-5x^2+4=0\\). Die wichtigen Schnittstellen im Intervall sind \\(x=-1\\), \\(x=1\\) und \\(x=2\\).",
      "Auf \\([-1,1]\\) liegt \\(f\\) oben, auf \\([1,2]\\) liegt \\(g\\) oben und auf \\([2,3]\\) wieder \\(f\\). Darum darfst du nicht einfach stumpf von \\(-1\\) bis \\(3\\) integrieren.",
      "Rechne also Abschnitt für Abschnitt: \\(A=\\int_{-1}^{1}(f-g)\\,dx+\\int_{1}^{2}(g-f)\\,dx+\\int_{2}^{3}(f-g)\\,dx\\)."
    ],
    answer: {
      target: 316 / 15,
      tolerance: 0.03,
      placeholder: "z. B. 316/15 oder 21,067",
      errorHint:
        "Noch nicht richtig. Prüfe noch einmal, ob du an den Schnittpunkten \\(x=1\\) und \\(x=2\\) getrennt hast."
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
      "Die Fläche ist in drei Abschnitte zerlegt, damit der Wechsel der oberen Funktion sichtbar bleibt.",
    casSteps: [
      {
        title: "Funktionen eingeben",
        lines: ["f(x):=x^4+4", "g(x):=5*x^2"],
        note: "Zuerst legst du beide Funktionen an."
      },
      {
        title: "Schnittstellen finden",
        lines: ["polyroots(x^4-5*x^2+4,x)"],
        note: "Du formst gedanklich zu \\(f(x)-g(x)=0\\) um und nutzt dann wie im Handout die Polynomwurzel-Funktion."
      },
      {
        title: "Relevante Grenzen speichern",
        lines: ["x1:=-1", "x2:=1", "x3:=2"],
        note: "Für das gegebene Intervall brauchst du genau diese drei Schnittstellen."
      },
      {
        title: "Erster Abschnitt",
        lines: ["A1:=∫(f(x)-g(x),x,-1,1)"],
        note: "Hier liegt \\(f\\) oben, deshalb rechnest du \\(f-g\\)."
      },
      {
        title: "Zweiter Abschnitt",
        lines: ["A2:=∫(g(x)-f(x),x,1,2)"],
        note: "Zwischen 1 und 2 liegt \\(g\\) oben. Deshalb wechselst du jetzt zu \\(g-f\\)."
      },
      {
        title: "Dritter Abschnitt",
        lines: ["A3:=∫(f(x)-g(x),x,2,3)"],
        note: "Ab \\(x=2\\) liegt wieder \\(f\\) oben."
      },
      {
        title: "Alles zusammen",
        lines: ["A:=A1+A2+A3"],
        note: "Jetzt addierst du die drei Teilflächen."
      }
    ],
    casNote:
      "Hier ist die wichtigste Idee nicht das Tippen, sondern das saubere Zerlegen an den Schnittstellen."
  },
  C: {
    id: "C",
    title: "Gruppe C",
    subtitle: "Flächen zwischen einem Funktionsgraphen und der x-Achse",
    teaser: "Eine doppelte Nullstelle sorgt dafür, dass der Graph die x-Achse nur berührt.",
    kind: "Graph und x-Achse",
    task:
      "Finde den Flächeninhalt der Fläche, die der Graph von f mit der x-Achse einschließt.",
    givenLatex: ["f(x)=(x^2-1)^2-1"],
    tips: [
      "Multipliziere zuerst aus. Dann sieht die Funktion viel übersichtlicher aus: \\(f(x)=x^4-2x^2=x^2(x^2-2)\\).",
      "Jetzt kannst du die Nullstellen leichter erkennen: \\(x=-\\sqrt{2}\\), \\(x=0\\) und \\(x=\\sqrt{2}\\).",
      "Der Punkt \\(x=0\\) ist besonders: Dort schneidet der Graph die x-Achse nicht, sondern berührt sie nur. Deshalb entsteht keine zweite getrennte Fläche.",
      "Darum reicht hier ein einziges Integral über das ganze eingeschlossene Stück: \\(A=\\left|\\int_{-\\sqrt{2}}^{\\sqrt{2}} f(x)\\,dx\\right|\\)."
    ],
    answer: {
      target: (16 * Math.sqrt(2)) / 15,
      tolerance: 0.02,
      placeholder: "z. B. 16*sqrt(2)/15",
      errorHint:
        "Noch nicht richtig. Denk daran: Bei \\(x=0\\) wird keine neue Fläche abgetrennt, weil der Graph die x-Achse dort nur berührt."
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
      "Trotz der drei Nullstellen entsteht hier nur eine zusammenhängende Fläche.",
    casSteps: [
      {
        title: "Funktion eingeben",
        lines: ["f(x):=(x^2-1)^2-1"],
        note: "So legst du die Funktion an."
      },
      {
        title: "Umformen prüfen",
        lines: ["expand(f(x))", "factor(expand(f(x)))"],
        note: "So siehst du direkt, warum die Nullstellen leicht zu finden sind und warum \\(x=0\\) eine besondere Stelle ist."
      },
      {
        title: "Nullstellen holen",
        lines: ["polyroots(x^4-2*x^2,x)"],
        note: "Im Handout ist dafür die Funktion \\(polyroots\\) vorgesehen."
      },
      {
        title: "Fläche berechnen",
        lines: ["A:=abs(∫(f(x),x,-sqrt(2),sqrt(2)))"],
        note: "Hier reicht ein einziges Betragsintegral, weil nur eine zusammenhängende Fläche vorliegt."
      }
    ],
    casNote:
      "Bei dieser Aufgabe hilft das Umformen mehr als langes Rechnen."
  },
  D: {
    id: "D",
    title: "Gruppe D",
    subtitle: "Flächen zwischen sich schneidenden Funktionsgraphen",
    teaser: "Im Intervall [0;2] gibt es genau einen Schnittpunkt.",
    kind: "Zwei Graphen",
    task:
      "Finde den Flächeninhalt im Intervall zwischen den Graphen von f und g.",
    givenLatex: ["f(x)=x^3+x", "g(x)=x^2+1", "I=[0;2]"],
    tips: [
      "Du musst zuerst den Schnittpunkt finden, weil dort der obere Graph wechseln kann.",
      "Aus \\(f(x)=g(x)\\) wird \\(x^3-x^2+x-1=0\\). Durch Faktorisieren bekommst du \\((x-1)(x^2+1)\\).",
      "Der einzige reelle Schnittpunkt ist also \\(x=1\\). Genau dort musst du das Intervall teilen.",
      "Auf \\([0,1]\\) liegt \\(g\\) über \\(f\\), auf \\([1,2]\\) liegt \\(f\\) über \\(g\\). Deshalb rechnest du erst \\(g-f\\) und danach \\(f-g\\)."
    ],
    answer: {
      target: 2.5,
      tolerance: 0.02,
      placeholder: "z. B. 5/2",
      errorHint:
        "Noch nicht richtig. Trenne bei \\(x=1\\) und achte darauf, welcher Graph links und rechts oben liegt."
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
      "Die Grafik ist in zwei Teile zerlegt, damit der Wechsel bei \\(x=1\\) sofort sichtbar wird.",
    casSteps: [
      {
        title: "Funktionen eingeben",
        lines: ["f(x):=x^3+x", "g(x):=x^2+1"],
        note: "Lege zuerst beide Funktionen an."
      },
      {
        title: "Schnittpunkt finden",
        lines: ["factor(x^3-x^2+x-1)", "polyroots(x^3-x^2+x-1,x)"],
        note: "So siehst du erst die Struktur und bekommst dann die reelle Schnittstelle."
      },
      {
        title: "Ersten Teil rechnen",
        lines: ["A1:=∫(g(x)-f(x),x,0,1)"],
        note: "Auf \\([0,1]\\) liegt \\(g\\) oben, also musst du \\(g-f\\) rechnen."
      },
      {
        title: "Zweiten Teil rechnen",
        lines: ["A2:=∫(f(x)-g(x),x,1,2)"],
        note: "Auf \\([1,2]\\) liegt \\(f\\) oben, deshalb jetzt \\(f-g\\)."
      },
      {
        title: "Alles zusammen",
        lines: ["A:=A1+A2"],
        note: "Zum Schluss addierst du beide Teilflächen."
      }
    ],
    casNote:
      "Diese Aufgabe ist ein gutes Beispiel dafür, warum der Schnittpunkt zuerst kommen muss."
  },
  E: {
    id: "E",
    title: "Gruppe E",
    subtitle: "Flächen zwischen einem Funktionsgraphen und der x-Achse",
    teaser: "Im ganzen Intervall liegt die Funktion unterhalb der x-Achse.",
    kind: "Graph und x-Achse",
    task:
      "Finde den Flächeninhalt zwischen dem Graphen von f und der x-Achse im gegebenen Intervall.",
    givenLatex: ["f(x)=0{,}25x^3-2", "I=[-4;1]"],
    tips: [
      "Prüfe zuerst, ob die Funktion im Intervall überhaupt die x-Achse schneidet. Wenn nicht, musst du nicht aufteilen.",
      "Mit \\(0{,}25x^3-2=0\\) bekommst du \\(x=2\\). Diese Nullstelle liegt aber gar nicht im Intervall \\([-4,1]\\).",
      "Damit weißt du: Im ganzen vorgegebenen Bereich liegt der Graph unter der x-Achse.",
      "Deshalb genügt ein einziges Integral mit Betrag: \\(A=\\left|\\int_{-4}^{1} f(x)\\,dx\\right|\\)."
    ],
    answer: {
      target: 415 / 16,
      tolerance: 0.03,
      placeholder: "z. B. 415/16",
      errorHint:
        "Noch nicht richtig. Du brauchst hier kein Aufteilen, aber du musst aus dem negativen Integral einen positiven Flächeninhalt machen."
    },
    geogebra: {
      window: { xMin: -4.7, xMax: 1.5, yMin: -20.5, yMax: 5 },
      commands: [
        "f(x)=0.25*x^3-2",
        "I1=Integral(f,-4,1)"
      ]
    },
    geoCommandsNote:
      "Die markierte Fläche besteht hier nur aus einem einzigen Abschnitt.",
    casSteps: [
      {
        title: "Funktion eingeben",
        lines: ["f(x):=0.25*x^3-2"],
        note: "Lege zuerst die Funktion an."
      },
      {
        title: "Nullstelle prüfen",
        lines: ["polyroots(0.25*x^3-2,x)"],
        note: "Damit siehst du sofort: Die Nullstelle liegt bei \\(x=2\\) und damit außerhalb des Intervalls."
      },
      {
        title: "Fläche berechnen",
        lines: ["A:=abs(∫(f(x),x,-4,1))"],
        note: "Weil die Funktion im ganzen Intervall unter der x-Achse liegt, reicht ein einziges Betragsintegral."
      }
    ],
    casNote:
      "Hier spart dir die Vorzeichenkontrolle am Anfang viel Arbeit."
  },
  F: {
    id: "F",
    title: "Gruppe F",
    subtitle: "Flächen zwischen sich schneidenden Funktionsgraphen",
    teaser: "Drei Schnittpunkte, zwei Teilflächen und numerische Grenzen.",
    kind: "Zwei Graphen",
    task:
      "Finde den Flächeninhalt aller Flächen, die von den Graphen von f und g eingeschlossen werden.",
    givenLatex: ["f(x)=x^3-4x+3", "g(x)=4-0{,}5x^2"],
    tips: [
      "Hier musst du zuerst die Schnittpunkte finden, weil genau zwischen ihnen die eingeschlossenen Flächen liegen.",
      "Aus \\(f(x)=g(x)\\) wird \\(x^3+0{,}5x^2-4x-1=0\\). Diese Gleichung hat drei reelle Lösungen.",
      "Numerisch bekommst du ungefähr \\(x_1\\approx-2{,}14648\\), \\(x_2\\approx-0{,}24615\\) und \\(x_3\\approx1{,}89263\\). Dadurch entstehen genau zwei eingeschlossene Teilflächen.",
      "Rechne deshalb nicht alles auf einmal, sondern erst die linke und dann die rechte Teilfläche: \\(A=\\left|\\int_{x_1}^{x_2}(f-g)\\,dx\\right|+\\left|\\int_{x_2}^{x_3}(f-g)\\,dx\\right|\\)."
    ],
    answer: {
      target: 8.375415651009177,
      tolerance: 0.03,
      placeholder: "z. B. 8,375",
      errorHint:
        "Noch nicht richtig. Bestimme zuerst alle drei Schnittpunkte und rechne dann die beiden Teilflächen getrennt."
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
        title: "Funktionen eingeben",
        lines: ["f(x):=x^3-4*x+3", "g(x):=4-0.5*x^2"],
        note: "Lege zuerst beide Funktionen an."
      },
      {
        title: "Schnittpunkte holen",
        lines: ["polyroots(x^3+0.5*x^2-4*x-1,x)"],
        note: "Du gehst wie im Handout vor: erst zu \\(f(x)-g(x)=0\\) umformen, dann \\(polyroots\\) benutzen."
      },
      {
        title: "Grenzen speichern",
        lines: ["x1:=-2.14648", "x2:=-0.24615", "x3:=1.89263"],
        note: "Die drei Näherungswerte aus der Ausgabe speicherst du ab."
      },
      {
        title: "Linke Teilfläche",
        lines: ["A1:=abs(∫(f(x)-g(x),x,x1,x2))"],
        note: "Erst berechnest du die linke eingeschlossene Fläche."
      },
      {
        title: "Rechte Teilfläche",
        lines: ["A2:=abs(∫(f(x)-g(x),x,x2,x3))"],
        note: "Dann rechnest du die rechte Fläche."
      },
      {
        title: "Alles zusammen",
        lines: ["A:=A1+A2"],
        note: "Jetzt addierst du beide Teilflächen zur Gesamtfläche."
      }
    ],
    casNote:
      "Bei dieser Aufgabe ist die Nullstellensuche der eigentliche Startpunkt. Danach läuft der Rest wie bei den einfacheren Aufgaben."
  }
};

const EXAMPLES = {
  xaxis: {
    id: "xaxis",
    title: "Beispiel 1: Fläche zwischen Graph und x-Achse",
    teaser: "Ein sehr anschauliches Beispiel mit einer Parabel und genau einer eingeschlossenen Fläche.",
    givenLatex: ["f(x)=-x^2+4"],
    steps: [
      {
        title: "Nullstellen finden",
        body:
          "Zuerst schaust du, wo der Graph die x-Achse schneidet. Aus \\(-x^2+4=0\\) folgt \\(x=-2\\) und \\(x=2\\). Genau diese beiden Stellen begrenzen die Fläche."
      },
      {
        title: "Überlegen, ob man aufteilen muss",
        body:
          "Zwischen \\(-2\\) und \\(2\\) liegt der Graph komplett über der x-Achse. Deshalb musst du hier nicht in Teilflächen zerlegen."
      },
      {
        title: "Integral aufschreiben",
        body:
          "Jetzt kannst du die Fläche direkt mit einem Integral berechnen: \\(A=\\int_{-2}^{2}(-x^2+4)\\,dx\\)."
      },
      {
        title: "Ergebnis deuten",
        body:
          "Wenn du das Integral ausrechnest, bekommst du \\(A=\\frac{32}{3}\\approx10{,}67\\). Das ist der Flächeninhalt in Flächeneinheiten."
      }
    ],
    geogebra: {
      window: { xMin: -3.5, xMax: 3.5, yMin: -1.5, yMax: 5.5 },
      commands: [
        "f(x)=-x^2+4",
        "P1=(-2,0)",
        "P2=(2,0)",
        "I1=Integral(f,-2,2)"
      ]
    },
    geoNote:
      "Hier sieht man gut: Die Fläche liegt komplett oberhalb der x-Achse, deshalb reicht ein einziges Integral."
  },
  between: {
    id: "between",
    title: "Beispiel 2: Fläche zwischen zwei Graphen",
    teaser: "Eine Gerade und eine Parabel liefern eine einfache, geschlossene Fläche.",
    givenLatex: ["f(x)=x+3", "g(x)=x^2+1"],
    steps: [
      {
        title: "Schnittpunkte finden",
        body:
          "Du setzt zuerst die beiden Funktionen gleich: \\(x+3=x^2+1\\). Daraus folgt \\(x^2-x-2=0\\), also \\(x=-1\\) und \\(x=2\\)."
      },
      {
        title: "Oberen Graphen bestimmen",
        body:
          "Zwischen \\(-1\\) und \\(2\\) liegt die Gerade \\(f(x)=x+3\\) über der Parabel \\(g(x)=x^2+1\\). Das ist wichtig, weil du für die Fläche immer \\(\\text{oben}-\\text{unten}\\) rechnest."
      },
      {
        title: "Integral aufschreiben",
        body:
          "Damit lautet der Ansatz \\(A=\\int_{-1}^{2}(f(x)-g(x))\\,dx=\\int_{-1}^{2}(x+3-(x^2+1))\\,dx\\)."
      },
      {
        title: "Ergebnis deuten",
        body:
          "Nach dem Rechnen bekommst du \\(A=\\frac{9}{2}=4{,}5\\). Das ist die gesamte eingeschlossene Fläche zwischen den beiden Graphen."
      }
    ],
    geogebra: {
      window: { xMin: -2.2, xMax: 3, yMin: -0.5, yMax: 6.5 },
      commands: [
        "f(x)=x+3",
        "g(x)=x^2+1",
        "P1=(-1,2)",
        "P2=(2,5)",
        "I1=IntegralBetween(f,g,-1,2)"
      ]
    },
    geoNote:
      "Auch hier sieht man schön, warum zuerst die Schnittpunkte bestimmt werden: Sie begrenzen die Fläche."
  }
};

document.addEventListener("DOMContentLoaded", () => {
  renderIndexPage();
  renderDetailPage();
  renderExamplesPage();
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
          <a class="button-link" href="gruppe.html?group=${group.id}">Gruppe öffnen</a>
        </div>
      </article>
    `;
  }).join("");

  renderMath(grid);

  const exampleGrid = document.querySelector("#example-grid");
  if (exampleGrid) {
    exampleGrid.innerHTML = Object.values(EXAMPLES).map((example, index) => {
      return `
        <article class="card">
          <div class="card-head">
            <div>
              <h2>${example.title}</h2>
              <p class="group-kind">${example.teaser}</p>
            </div>
            <div class="group-badge" aria-hidden="true">${index + 1}</div>
          </div>
          <p>${example.givenLatex.map((line) => escapeHtml(line)).join("<br>")}</p>
          <div class="card-actions">
            <a class="button-link" href="beispiele.html#example-${example.id}">Beispiel öffnen</a>
          </div>
        </article>
      `;
    }).join("");

    renderMath(exampleGrid);
  }
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
        <p>Bitte kehre zur Startseite zurück und wähle eine Gruppe von A bis F.</p>
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
            <span class="fold-summary-note">schrittweise öffnen</span>
          </summary>
          <div class="fold-content">
            <p class="eyebrow">Tipps</p>
            <h2>Schritt für Schritt</h2>
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
            <span class="fold-summary-label">Lösung prüfen</span>
            <span class="fold-summary-note">Antwort eingeben</span>
          </summary>
          <div class="fold-content">
            <p class="eyebrow">Antwort prüfen</p>
            <h2>Flächeninhalt eingeben</h2>
            <p class="note">
              Dezimalzahlen und Ausdrücke wie <code>316/15</code> oder <code>16*sqrt(2)/15</code> werden akzeptiert.
            </p>
            <label class="answer-label" for="answer-input">Deine Lösung</label>
            <div class="answer-form">
              <input
                id="answer-input"
                class="answer-input"
                type="text"
                inputmode="text"
                autocomplete="off"
                placeholder="${group.answer.placeholder}"
              >
              <button class="button-link" type="button" data-check-answer>Prüfen</button>
              <button class="nav-link is-secondary" type="button" data-reset-answer>Eingabe löschen</button>
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
                  Grafik wird erst beim Öffnen dieses Bereichs geladen.
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
                <button class="nav-link is-secondary" type="button" data-cas-prev>Zurück</button>
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
      <a class="nav-link" href="gruppe.html?group=${neighbors.next}">Nächste Gruppe: ${neighbors.next}</a>
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
    feedback.innerHTML = message;
    renderMath(feedback);
  };

  const validate = () => {
    const value = evaluateMathExpression(input.value);
    if (value === null) {
      showFeedback(
        "bad",
        "Die Eingabe konnte nicht gelesen werden. Erlaubt sind Dezimalzahlen, Brüche, sqrt(...), abs(...) und pi."
      );
      return;
    }

    const delta = Math.abs(value - group.answer.target);
    const negativeDelta = Math.abs(value + group.answer.target);

    if (negativeDelta <= group.answer.tolerance) {
      showFeedback("close", "Fast richtig. Beim Flächeninhalt muss das Ergebnis positiv sein.");
      return;
    }

    if (delta <= group.answer.tolerance) {
      showFeedback("good", getPraiseMessage());
      return;
    }

    if (delta <= group.answer.tolerance * 4) {
      showFeedback("close", "Fast richtig. Prüfe noch einmal Rundung, Betrag oder die letzte Summe.");
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
    button.textContent = "Kopieren nicht möglich";
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
            <p>Bitte prüfe die Internetverbindung oder lade die Seite neu.</p>
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
  expression = expression.replace(/flächeneinheiten|flaecheneinheiten|flacheneinheiten|fe/g, "");
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
    "Stark gelöst. Dein Flächeninhalt ist richtig.",
    "Sehr gut gerechnet. Das Ergebnis passt.",
    "Klasse. Genau so soll der Flächeninhalt herauskommen.",
    "Sauber gearbeitet. Deine Lösung stimmt."
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

function renderExamplesPage() {
  const root = document.querySelector("#examples-root");
  if (!root) {
    return;
  }

  root.innerHTML = Object.values(EXAMPLES).map((example) => {
    return `
      <section id="example-${example.id}" class="example-section">
        <div class="detail-grid">
          <div>
            <article class="task-panel">
              <p class="eyebrow">Beispiel</p>
              <h2>${example.title}</h2>
              <p class="task-text">${example.teaser}</p>
              <ul class="math-list">
                ${example.givenLatex.map((line) => `<li>\\(${line}\\)</li>`).join("")}
              </ul>
            </article>

            <article class="tips-panel">
              <p class="eyebrow">Erklärung</p>
              <h2>Schritt für Schritt</h2>
              <div class="cas-step-tabs" role="tablist" aria-label="Beispielschritte">
                ${example.steps.map((step, index) => {
                  return `
                    <button
                      class="cas-step-tab${index === 0 ? " is-active" : ""}"
                      type="button"
                      data-example-step="${example.id}:${index}"
                    >
                      ${index + 1}
                    </button>
                  `;
                }).join("")}
              </div>
              <div class="example-screen">
                <div class="cas-screen-header">
                  <span id="example-counter-${example.id}">Schritt 1 / ${example.steps.length}</span>
                  <span id="example-title-${example.id}">${example.steps[0].title}</span>
                </div>
                <div id="example-body-${example.id}" class="example-body">${example.steps[0].body}</div>
              </div>
              <div class="cas-nav">
                <button class="nav-link is-secondary" type="button" data-example-prev="${example.id}">Zurück</button>
                <button class="nav-link" type="button" data-example-next="${example.id}">Weiter</button>
              </div>
            </article>
          </div>

          <div>
            <details class="geo-panel fold-panel" data-example-geo-panel="${example.id}" open>
              <summary class="fold-summary">
                <span class="fold-summary-label">Grafik zum Beispiel</span>
                <span class="fold-summary-note">mit Fläche und Punkten</span>
              </summary>
              <div class="fold-content">
                <div class="geo-header">
                  <p class="eyebrow">GeoGebra</p>
                  <button class="reload-button" type="button" data-example-reload="${example.id}">Grafik neu laden</button>
                </div>
                <div class="geo-stage">
                  <div id="example-ggb-${example.id}" class="ggb-frame" aria-label="GeoGebra-Ansicht zum Beispiel"></div>
                  <p class="geo-note">${example.geoNote}</p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>
    `;
  }).join("");

  renderMath(root);
  Object.values(EXAMPLES).forEach((example) => {
    setupExampleStepper(example);
    setupExampleGeo(example);
  });
}

function setupExampleStepper(example) {
  const tabs = Array.from(document.querySelectorAll(`[data-example-step^="${example.id}:"]`));
  const prevButton = document.querySelector(`[data-example-prev="${example.id}"]`);
  const nextButton = document.querySelector(`[data-example-next="${example.id}"]`);
  const title = document.querySelector(`#example-title-${example.id}`);
  const counter = document.querySelector(`#example-counter-${example.id}`);
  const body = document.querySelector(`#example-body-${example.id}`);

  if (!tabs.length || !prevButton || !nextButton || !title || !counter || !body) {
    return;
  }

  let activeIndex = 0;

  const renderStep = () => {
    const step = example.steps[activeIndex];
    title.textContent = step.title;
    counter.textContent = `Schritt ${activeIndex + 1} / ${example.steps.length}`;
    body.innerHTML = step.body;
    tabs.forEach((tab, index) => {
      tab.classList.toggle("is-active", index === activeIndex);
    });
    prevButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === example.steps.length - 1;
    renderMath(body);
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
    activeIndex = Math.min(example.steps.length - 1, activeIndex + 1);
    renderStep();
  });

  renderStep();
}

function setupExampleGeo(example) {
  const panel = document.querySelector(`[data-example-geo-panel="${example.id}"]`);
  const container = document.querySelector(`#example-ggb-${example.id}`);
  const reloadButton = document.querySelector(`[data-example-reload="${example.id}"]`);

  if (!panel || !container) {
    return;
  }

  let hasLoaded = false;

  const injectApplet = () => {
    if (typeof window.GGBApplet !== "function") {
      container.innerHTML = `
        <div class="ggb-placeholder">
          GeoGebra konnte gerade nicht geladen werden.
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
          example.geogebra.window.xMin,
          example.geogebra.window.xMax,
          example.geogebra.window.yMin,
          example.geogebra.window.yMax
        );
        example.geogebra.commands.forEach((command) => api.evalCommand(command));
        styleGeoObjects(api);
      }
    };

    const applet = new window.GGBApplet(params, true);
    applet.inject(container.id, "preferhtml5");
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
