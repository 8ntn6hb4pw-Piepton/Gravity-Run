const STORAGE_KEY = "materialliste-klasse-5-checklist";
const LANGUAGE_KEY = "materialliste-klasse-5-checklist-language";

const checklistData = {
  de: [
    {
      category: "Federmappe",
      items: [
        "Einen Schulfüller o.ä. (kein: Kugelschreiber), einschließlich passender Ersatzpatronen",
        "zwei Bleistifte (Härte: HB)",
        "Buntstifte (min. 12 Farben)",
        "Radiergummi (blau/rot)",
        "Anspitzer",
        "2 Textmarker gelb, pink",
        "ein Geodreieck",
        "ein Klebestift",
        "kleine Bastelschere"
      ]
    },
    {
      category: "Hefte und Papier",
      items: [
        "8 Hefte DIN-A4, Lineatur Nr. 25 (liniert, breiter Rand)",
        "3 Hefte DIN-A4, Lineatur Nr. 26 (kariert, breiter Rand)",
        "7 Schnellhefter (rot, blau, grün, gelb, grau, schwarz, violett)",
        "ein Notizbuch, DIN A5, kariert",
        "1 transparente Sammelmappe DIN-A4 für Elterninformationen",
        "Collageblock DIN A 4, mit kariertem und liniertem Papier"
      ]
    },
    {
      category: "Kunst",
      items: [
        "Zeichenblock DIN A 3, reinweiß (an beiden Seiten fest) (Kunst)",
        "eine Plastikbox (z.B. bei Action oder Tedi günstig zu bekommen)",
        "Pelikan-Farbkasten 12 Farben",
        "Deckweiß",
        "ein Pinselset",
        "einen Lappen",
        "einen Becher",
        "eine Sammelmappe für A3 (Kunst)"
      ]
    },
    {
      category: "Sonstiges",
      items: ["eine wiederverwendbare Trinkflasche"]
    },
    {
      category: "Sport",
      items: [
        "ein Paar Turnschuhe, die echten Halt geben (keine Sneaker)",
        "T-Shirt oder Polo-Shirt",
        "einen Badmintonschläger",
        "Bälle (mind. 3)"
      ]
    },
    {
      category: "Ein Buch kann jedes Kind",
      items: ["Sachbuch, Comic, Zeitschrift, Roman o.ä."]
    }
  ],
  tr: [
    {
      category: "Kalem kutusu",
      items: [
        "Bir okul dolma kalemi veya benzeri (tükenmez kalem değil), uygun yedek kartuşlarla birlikte",
        "iki kurşun kalem (sertlik: HB)",
        "boya kalemleri (en az 12 renk)",
        "silgi (mavi/kırmızı)",
        "kalemtıraş",
        "2 fosforlu kalem sarı, pembe",
        "bir geometri üçgeni",
        "bir yapıştırıcı",
        "küçük el işi makası"
      ]
    },
    {
      category: "Defterler ve kağıt",
      items: [
        "8 defter DIN-A4, çizgi tipi No. 25 (çizgili, geniş kenar boşluklu)",
        "3 defter DIN-A4, çizgi tipi No. 26 (kareli, geniş kenar boşluklu)",
        "7 telli dosya (kırmızı, mavi, yeşil, sarı, gri, siyah, mor)",
        "bir not defteri, DIN A5, kareli",
        "Veliler için bilgilendirmeler için 1 şeffaf dosya DIN-A4",
        "Kolaj bloğu DIN A 4, kareli ve çizgili kağıtlı"
      ]
    },
    {
      category: "Sanat",
      items: [
        "Resim bloğu DIN A 3, saf beyaz (iki tarafı da sabit) (sanat)",
        "bir plastik kutu (ör. Action veya Tedi'de uygun fiyata bulunabilir)",
        "Pelikan boya kutusu 12 renk",
        "beyaz kapatıcı boya",
        "bir fırça seti",
        "bir bez",
        "bir bardak",
        "A3 için bir toplama dosyası (sanat)"
      ]
    },
    {
      category: "Diğer",
      items: ["yeniden kullanılabilir bir içme şişesi"]
    },
    {
      category: "Spor",
      items: [
        "gerçek destek sağlayan bir çift spor ayakkabı (sneaker değil)",
        "T-shirt veya polo tişört",
        "bir badminton raketi",
        "toplar (en az 3)"
      ]
    },
    {
      category: "Her çocuk bir kitap getirebilir",
      items: ["Bilgi kitabı, çizgi roman, dergi, roman vb."]
    }
  ],
  el: [
    {
      category: "Κασετίνα",
      items: [
        "Ένα σχολικό στυλό μελάνης ή παρόμοιο (όχι στυλό διαρκείας), μαζί με κατάλληλες ανταλλακτικές αμπούλες",
        "δύο μολύβια (σκληρότητα: HB)",
        "ξυλομπογιές (τουλάχιστον 12 χρώματα)",
        "γόμα (μπλε/κόκκινη)",
        "ξύστρα",
        "2 μαρκαδόροι υπογράμμισης κίτρινο, φούξια",
        "ένας γεωμετρικός τρίγωνος χάρακας",
        "μία κόλλα στικ",
        "μικρό ψαλίδι χειροτεχνίας"
      ]
    },
    {
      category: "Τετράδια και χαρτί",
      items: [
        "8 τετράδια DIN-A4, γραμμογράφηση αρ. 25 (ριγέ, φαρδύ περιθώριο)",
        "3 τετράδια DIN-A4, γραμμογράφηση αρ. 26 (καρό, φαρδύ περιθώριο)",
        "7 ντοσιέ με έλασμα (κόκκινο, μπλε, πράσινο, κίτρινο, γκρι, μαύρο, μοβ)",
        "ένα σημειωματάριο, DIN A5, καρό",
        "1 διαφανής φάκελος συλλογής DIN-A4 για ενημερώσεις γονέων",
        "Μπλοκ κολάζ DIN A 4, με καρό και ριγέ χαρτί"
      ]
    },
    {
      category: "Καλλιτεχνικά",
      items: [
        "Μπλοκ ζωγραφικής DIN A 3, κατάλευκο (σταθερό και στις δύο πλευρές) (καλλιτεχνικά)",
        "ένα πλαστικό κουτί (π.χ. σε Action ή Tedi μπορεί να βρεθεί οικονομικά)",
        "κουτί χρωμάτων Pelikan 12 χρώματα",
        "λευκό κάλυψης",
        "ένα σετ πινέλων",
        "ένα πανί",
        "ένα ποτήρι",
        "ένας φάκελος συλλογής για A3 (καλλιτεχνικά)"
      ]
    },
    {
      category: "Λοιπά",
      items: ["ένα επαναχρησιμοποιούμενο μπουκάλι νερού"]
    },
    {
      category: "Αθλητικά",
      items: [
        "ένα ζευγάρι αθλητικά παπούτσια που προσφέρουν πραγματική στήριξη (όχι sneakers)",
        "T-shirt ή πόλο",
        "μία ρακέτα μπάντμιντον",
        "μπάλες (τουλάχιστον 3)"
      ]
    },
    {
      category: "Κάθε παιδί μπορεί να έχει ένα βιβλίο",
      items: ["Βιβλίο γνώσεων, κόμικ, περιοδικό, μυθιστόρημα κ.ά."]
    }
  ],
  ar: [
    {
      category: "المقلمة",
      items: [
        "قلم حبر مدرسي أو ما شابه (ليس قلمًا جافًا)، مع خراطيش احتياطية مناسبة",
        "قلمان رصاص (درجة الصلابة: HB)",
        "أقلام تلوين (على الأقل 12 لونًا)",
        "ممحاة (أزرق/أحمر)",
        "مبراة",
        "قلمان لتحديد النص أصفر، وردي فاقع",
        "مثلث هندسي",
        "عصا غراء",
        "مقص صغير للأعمال اليدوية"
      ]
    },
    {
      category: "دفاتر وورق",
      items: [
        "8 دفاتر DIN-A4، نوع التسطير رقم 25 (مسطر، هامش عريض)",
        "3 دفاتر DIN-A4، نوع التسطير رقم 26 (مربعات، هامش عريض)",
        "7 ملفات سريعة (أحمر، أزرق، أخضر، أصفر، رمادي، أسود، بنفسجي)",
        "دفتر ملاحظات، DIN A5، مربعات",
        "حافظة شفافة واحدة DIN-A4 لمعلومات أولياء الأمور",
        "دفتر كولاج DIN A 4، مع ورق مربعات وورق مسطر"
      ]
    },
    {
      category: "الفن",
      items: [
        "دفتر رسم DIN A 3، أبيض نقي (مثبت من الجانبين) (الفن)",
        "صندوق بلاستيكي واحد (مثلًا يمكن الحصول عليه بسعر مناسب من Action أو Tedi)",
        "علبة ألوان Pelikan من 12 لونًا",
        "أبيض تغطية",
        "مجموعة فرش",
        "قطعة قماش",
        "كوب",
        "حافظة تجميع واحدة لمقاس A3 (الفن)"
      ]
    },
    {
      category: "أشياء أخرى",
      items: ["زجاجة شرب قابلة لإعادة الاستخدام"]
    },
    {
      category: "الرياضة",
      items: [
        "زوج من الأحذية الرياضية التي توفر دعمًا حقيقيًا (ليست أحذية Sneaker)",
        "قميص T-Shirt أو قميص Polo",
        "مضرب ريشة",
        "كرات (على الأقل 3)"
      ]
    },
    {
      category: "يمكن لكل طفل أن يكون لديه كتاب",
      items: ["كتاب معلوماتي، قصة مصورة، مجلة، رواية وما شابه"]
    }
  ],
  en: [
    {
      category: "Pencil case",
      items: [
        "One school fountain pen or similar (no ballpoint pen), including matching spare cartridges",
        "two pencils (hardness: HB)",
        "colored pencils (at least 12 colors)",
        "eraser (blue/red)",
        "sharpener",
        "2 highlighters yellow, pink",
        "one set square",
        "one glue stick",
        "small craft scissors"
      ]
    },
    {
      category: "Exercise books and paper",
      items: [
        "8 exercise books DIN-A4, ruling No. 25 (lined, wide margin)",
        "3 exercise books DIN-A4, ruling No. 26 (squared, wide margin)",
        "7 folders (red, blue, green, yellow, grey, black, violet)",
        "one notebook, DIN A5, squared",
        "1 transparent folder DIN-A4 for parent information",
        "Collage pad DIN A 4, with squared and lined paper"
      ]
    },
    {
      category: "Art",
      items: [
        "Drawing pad DIN A 3, pure white (fixed on both sides) (art)",
        "one plastic box (e.g. available cheaply at Action or Tedi)",
        "Pelikan paint box 12 colors",
        "opaque white",
        "one brush set",
        "one cloth",
        "one cup",
        "one folder for A3 (art)"
      ]
    },
    {
      category: "Other",
      items: ["one reusable drinking bottle"]
    },
    {
      category: "Sports",
      items: [
        "one pair of gym shoes that provide real support (no sneakers)",
        "T-shirt or polo shirt",
        "one badminton racket",
        "balls (at least 3)"
      ]
    },
    {
      category: "Every child can have a book",
      items: ["Non-fiction book, comic, magazine, novel, etc."]
    }
  ],
  it: [
    {
      category: "Astuccio",
      items: [
        "Una penna stilografica scolastica o simile (non una penna a sfera), comprese cartucce di ricambio adatte",
        "due matite (durezza: HB)",
        "matite colorate (almeno 12 colori)",
        "gomma (blu/rossa)",
        "temperamatite",
        "2 evidenziatori giallo, rosa acceso",
        "una squadretta geometrica",
        "una colla stick",
        "piccole forbici per lavori manuali"
      ]
    },
    {
      category: "Quaderni e carta",
      items: [
        "8 quaderni DIN-A4, rigatura n. 25 (a righe, margine largo)",
        "3 quaderni DIN-A4, rigatura n. 26 (a quadretti, margine largo)",
        "7 cartelline con fermaglio (rosso, blu, verde, giallo, grigio, nero, viola)",
        "un quaderno per appunti, DIN A5, a quadretti",
        "1 cartellina trasparente DIN-A4 per le informazioni ai genitori",
        "Blocco per collage DIN A 4, con carta a quadretti e a righe"
      ]
    },
    {
      category: "Arte",
      items: [
        "Blocco da disegno DIN A 3, bianco puro (fissato su entrambi i lati) (arte)",
        "una scatola di plastica (per esempio reperibile a buon prezzo da Action o Tedi)",
        "scatola di colori Pelikan 12 colori",
        "bianco coprente",
        "un set di pennelli",
        "uno straccio",
        "un bicchiere",
        "una cartellina per A3 (arte)"
      ]
    },
    {
      category: "Altro",
      items: ["una borraccia riutilizzabile"]
    },
    {
      category: "Sport",
      items: [
        "un paio di scarpe da ginnastica che diano un vero sostegno (non sneaker)",
        "T-shirt o polo",
        "una racchetta da badminton",
        "palline (almeno 3)"
      ]
    },
    {
      category: "Ogni bambino può avere un libro",
      items: ["Libro di divulgazione, fumetto, rivista, romanzo ecc."]
    }
  ]
};

const uiText = {
  de: {
    documentTitle: "Materialliste Klasse 5",
    eyebrow: "Schulmaterial",
    pageTitle: "Materialliste Klasse 5",
    subtitle: "Schuljahr 2026/2027",
    notice: "Bitte wählen Sie eine Sprache. Die Übersetzungen wurden mithilfe von KI erstellt. Maßgeblich ist die deutsche Originalfassung.",
    parentLetter: "Elternbrief",
    checklistTitle: "Digitale Checkliste zum Einkaufen",
    reset: "Checkliste zurücksetzen",
    languageLabel: "Sprache der Checkliste ändern",
    checklistLabel: "Digitale Material-Checkliste",
    privacy: "Die Checkliste speichert nur lokal im Browser dieses Geräts. Es werden keine personenbezogenen Daten gespeichert.",
    progress: (done, total) => `${done} von ${total} erledigt`
  },
  tr: {
    documentTitle: "5. Sınıf Malzeme Listesi",
    eyebrow: "Okul malzemeleri",
    pageTitle: "5. Sınıf Malzeme Listesi",
    subtitle: "2026/2027 öğretim yılı",
    notice: "Lütfen bir dil seçiniz. Çeviriler yapay zeka yardımıyla oluşturulmuştur. Esas olan Almanca orijinal metindir.",
    parentLetter: "Veli mektubu",
    checklistTitle: "Alışveriş için dijital kontrol listesi",
    reset: "Kontrol listesini sıfırla",
    languageLabel: "Kontrol listesinin dilini değiştir",
    checklistLabel: "Dijital malzeme kontrol listesi",
    privacy: "Kontrol listesi yalnızca bu cihazın tarayıcısında yerel olarak kaydedilir. Kişisel veri kaydedilmez.",
    progress: (done, total) => `${done} / ${total} tamamlandı`
  },
  el: {
    documentTitle: "Λίστα υλικών τάξης 5",
    eyebrow: "Σχολικά υλικά",
    pageTitle: "Λίστα υλικών τάξης 5",
    subtitle: "Σχολικό έτος 2026/2027",
    notice: "Παρακαλώ επιλέξτε μια γλώσσα. Οι μεταφράσεις δημιουργήθηκαν με τη βοήθεια τεχνητής νοημοσύνης. Καθοριστική είναι η γερμανική πρωτότυπη έκδοση.",
    parentLetter: "Επιστολή προς τους γονείς",
    checklistTitle: "Ψηφιακή λίστα ελέγχου για αγορές",
    reset: "Επαναφορά λίστας ελέγχου",
    languageLabel: "Αλλαγή γλώσσας της λίστας ελέγχου",
    checklistLabel: "Ψηφιακή λίστα υλικών",
    privacy: "Η λίστα ελέγχου αποθηκεύεται μόνο τοπικά στο πρόγραμμα περιήγησης αυτής της συσκευής. Δεν αποθηκεύονται προσωπικά δεδομένα.",
    progress: (done, total) => `${done} από ${total} ολοκληρώθηκαν`
  },
  ar: {
    documentTitle: "قائمة مواد الصف الخامس",
    eyebrow: "مواد مدرسية",
    pageTitle: "قائمة مواد الصف الخامس",
    subtitle: "العام الدراسي 2026/2027",
    notice: "يرجى اختيار لغة. تم إنشاء الترجمات بمساعدة الذكاء الاصطناعي. النسخة الأصلية الألمانية هي المعتمدة.",
    parentLetter: "رسالة أولياء الأمور",
    checklistTitle: "قائمة تحقق رقمية للتسوق",
    reset: "إعادة ضبط قائمة التحقق",
    languageLabel: "تغيير لغة قائمة التحقق",
    checklistLabel: "قائمة مواد رقمية",
    privacy: "يتم حفظ قائمة التحقق محليًا فقط في متصفح هذا الجهاز. لا يتم حفظ أي بيانات شخصية.",
    progress: (done, total) => `${done} من ${total} تم إنجازها`
  },
  en: {
    documentTitle: "Grade 5 Material List",
    eyebrow: "School supplies",
    pageTitle: "Grade 5 Material List",
    subtitle: "School year 2026/2027",
    notice: "Please choose a language. The translations were created with the help of AI. The German original version is authoritative.",
    parentLetter: "Parent letter",
    checklistTitle: "Digital shopping checklist",
    reset: "Reset checklist",
    languageLabel: "Change checklist language",
    checklistLabel: "Digital material checklist",
    privacy: "The checklist is saved only locally in the browser on this device. No personal data is stored.",
    progress: (done, total) => `${done} of ${total} done`
  },
  it: {
    documentTitle: "Lista dei materiali classe 5",
    eyebrow: "Materiale scolastico",
    pageTitle: "Lista dei materiali classe 5",
    subtitle: "Anno scolastico 2026/2027",
    notice: "Scegliete una lingua. Le traduzioni sono state create con l'aiuto dell'IA. Fa fede la versione originale tedesca.",
    parentLetter: "Lettera per i genitori",
    checklistTitle: "Lista di controllo digitale per gli acquisti",
    reset: "Reimposta la lista",
    languageLabel: "Cambiare la lingua della lista",
    checklistLabel: "Lista digitale dei materiali",
    privacy: "La lista viene salvata solo localmente nel browser di questo dispositivo. Non vengono memorizzati dati personali.",
    progress: (done, total) => `${done} di ${total} fatti`
  }
};

const htmlElement = document.documentElement;
const bodyElement = document.body;
const eyebrowElement = document.querySelector("#eyebrow");
const pageTitleElement = document.querySelector("#page-title");
const subtitleElement = document.querySelector("#subtitle");
const landingNoticeElement = document.querySelector("#landing-notice");
const languageTitleElement = document.querySelector("#language-title");
const checklistTitleElement = document.querySelector("#checklist-title");
const checklistElement = document.querySelector("#checklist");
const progressElement = document.querySelector("#progress");
const resetButton = document.querySelector("#resetChecklist");
const privacyNoteElement = document.querySelector("#privacy-note");
const checklistLanguageElement = document.querySelector("#checklist-language");
const languageButtons = [...document.querySelectorAll("[data-language]")];

function loadCheckedItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function saveCheckedItems(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function currentLanguage() {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
  return checklistData[savedLanguage] ? savedLanguage : "de";
}

function itemId(categoryIndex, itemIndex) {
  return `item-${categoryIndex}-${itemIndex}`;
}

function updateProgress(language = currentLanguage()) {
  const checkboxes = [...document.querySelectorAll(".check-item input")];
  const done = checkboxes.filter((checkbox) => checkbox.checked).length;
  progressElement.textContent = uiText[language].progress(done, checkboxes.length);
}

function updateLanguageButtons(language) {
  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function updateInterface(language) {
  const text = uiText[language] ?? uiText.de;
  const direction = language === "ar" ? "rtl" : "ltr";

  document.title = text.documentTitle;
  htmlElement.lang = language;
  bodyElement.dir = direction;
  eyebrowElement.textContent = text.eyebrow;
  pageTitleElement.textContent = text.pageTitle;
  subtitleElement.textContent = text.subtitle;
  landingNoticeElement.textContent = text.notice;
  languageTitleElement.textContent = text.parentLetter;
  checklistTitleElement.textContent = text.checklistTitle;
  resetButton.textContent = text.reset;
  privacyNoteElement.textContent = text.privacy;
  checklistLanguageElement.setAttribute("aria-label", text.languageLabel);
  checklistElement.setAttribute("aria-label", text.checklistLabel);
}

function renderChecklist(language = currentLanguage()) {
  const savedState = loadCheckedItems();
  const fragment = document.createDocumentFragment();
  const groups = checklistData[language] ?? checklistData.de;

  updateInterface(language);
  checklistElement.textContent = "";
  checklistElement.lang = language;
  checklistElement.dir = language === "ar" ? "rtl" : "ltr";
  updateLanguageButtons(language);

  groups.forEach((group, categoryIndex) => {
    const section = document.createElement("section");
    section.className = "checklist-category";

    const heading = document.createElement("h3");
    heading.textContent = `${group.category}:`;
    section.append(heading);

    const items = document.createElement("div");
    items.className = "checklist-items";

    group.items.forEach((item, itemIndex) => {
      const id = itemId(categoryIndex, itemIndex);
      const label = document.createElement("label");
      label.className = "check-item";
      label.setAttribute("for", id);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = id;
      checkbox.checked = Boolean(savedState[id]);
      checkbox.addEventListener("change", () => {
        const nextState = loadCheckedItems();
        nextState[id] = checkbox.checked;
        saveCheckedItems(nextState);
        updateProgress(language);
      });

      const text = document.createElement("span");
      text.textContent = item;

      label.append(checkbox, text);
      items.append(label);
    });

    section.append(items);
    fragment.append(section);
  });

  checklistElement.append(fragment);
  updateProgress(language);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.language;
    localStorage.setItem(LANGUAGE_KEY, language);
    renderChecklist(language);
  });
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  document.querySelectorAll(".check-item input").forEach((checkbox) => {
    checkbox.checked = false;
  });
  updateProgress();
});

renderChecklist();
