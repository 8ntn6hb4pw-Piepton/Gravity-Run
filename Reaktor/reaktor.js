/* ═══════════════════════════════════════════════════════
   Springfield Reaktor — Expertenmodus erweitert
   Schüler-Modus bleibt unverändert
   ═══════════════════════════════════════════════════════ */

// ── UTILS ────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const rand = (a, b) => Math.random() * (b - a) + a;
const lerp = (a, b, t) => a + (b - a) * t;
const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
function fmt(s) {
  s = Math.max(0, Math.floor(s));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
function fmtPts(v) {
  return Math.round(v).toLocaleString('de-DE');
}
function chancePS(rate, dt) {
  return Math.random() < rate * dt;
}
function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + Math.max(0, item.w || 0), 0);
  if (!total) return null;
  let roll = Math.random() * total;
  for (const item of items) {
    roll -= Math.max(0, item.w || 0);
    if (roll <= 0) return item.type;
  }
  return items[items.length - 1]?.type || null;
}
function pill(cls, txt) {
  return `<span class="pill ${cls}"><span class="pd"></span>${txt}</span>`;
}

// ── MODUS ────────────────────────────────────────────────
let currentMode = null; // 'schueler' | 'experte'

// ── AUDIO ────────────────────────────────────────────────
let aC = null, sOn = true, lastTone = 0;
function initA() {
  if (aC) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (AC) aC = new AC();
}
function beep(f, dur, type = 'square', vol = .02) {
  if (!sOn || !aC) return;
  if (aC.state === 'suspended') aC.resume();
  const o = aC.createOscillator();
  const g = aC.createGain();
  const n = aC.currentTime;
  o.type = type;
  o.frequency.value = f;
  g.gain.setValueAtTime(.0001, n);
  g.gain.exponentialRampToValueAtTime(vol, n + .015);
  g.gain.exponentialRampToValueAtTime(.0001, n + dur);
  o.connect(g);
  g.connect(aC.destination);
  o.start(n);
  o.stop(n + dur + .03);
}
function sweep(f1, f2, dur, type = 'sawtooth', vol = .02) {
  if (!sOn || !aC) return;
  if (aC.state === 'suspended') aC.resume();
  const o = aC.createOscillator();
  const g = aC.createGain();
  const n = aC.currentTime;
  o.type = type;
  o.frequency.setValueAtTime(f1, n);
  o.frequency.exponentialRampToValueAtTime(f2, n + dur);
  g.gain.setValueAtTime(.0001, n);
  g.gain.exponentialRampToValueAtTime(vol, n + .02);
  g.gain.exponentialRampToValueAtTime(.0001, n + dur);
  o.connect(g);
  g.connect(aC.destination);
  o.start(n);
  o.stop(n + dur + .03);
}
const sndRodsIn = () => sweep(520, 300, .18, 'square', .015);
const sndRodsOut = () => sweep(300, 520, .18, 'square', .015);
const sndPumpUp = () => { sweep(180, 380, .22, 'sawtooth', .013); setTimeout(() => beep(440, .07, 'triangle', .01), 230); };
const sndPumpDown = () => sweep(380, 140, .22, 'sawtooth', .012);
const sndBorUp = () => { beep(280, .1, 'sine', .013); setTimeout(() => beep(300, .08, 'sine', .009), 120); };
const sndBorDown = () => { beep(300, .08, 'sine', .009); setTimeout(() => beep(260, .1, 'sine', .011), 100); };
const sndPhUp = () => beep(520, .08, 'triangle', .011);
const sndPhDown = () => beep(440, .1, 'triangle', .011);
const sndDieselOn = () => { sweep(60, 140, .4, 'sawtooth', .028); setTimeout(() => sweep(140, 180, .3, 'sawtooth', .022), 380); setTimeout(() => beep(220, .14, 'square', .018), 700); };
const sndDieselOff = () => sweep(180, 55, .5, 'sawtooth', .022);
function sndScram() {
  beep(880, .08, 'square', .04);
  setTimeout(() => beep(660, .08, 'square', .035), 100);
  setTimeout(() => beep(880, .08, 'square', .04), 200);
  setTimeout(() => beep(440, .25, 'sawtooth', .03), 310);
}
function sndStartup() {
  sweep(220, 440, .5, 'triangle', .02);
  setTimeout(() => { beep(440, .15, 'triangle', .018); beep(550, .15, 'triangle', .014); }, 520);
  setTimeout(() => beep(660, .2, 'triangle', .02), 870);
}
const sndMaint = () => { beep(440, .1, 'square', .018); setTimeout(() => beep(550, .1, 'square', .018), 150); setTimeout(() => beep(660, .2, 'square', .022), 300); };
function sndMeltdown() {
  sweep(60, 30, .8, 'sawtooth', .04);
  for (let i = 0; i < 6; i++) {
    setTimeout(() => beep(880, .09, 'sawtooth', .05), i * 160);
    setTimeout(() => beep(660, .09, 'sawtooth', .04), i * 160 + 80);
  }
}
function tickAudio(alarm) {
  if (!sOn || !aC) return;
  const now = Date.now();
  let iv = 0, f = 0, d = 0, t = 'square', v = 0;
  if (alarm === 'M')      { iv = 500;  f = 880; d = .1; t = 'sawtooth'; v = .035; }
  else if (alarm === 'C') { iv = 750;  f = 760; d = .1; t = 'sawtooth'; v = .028; }
  else if (alarm === 'W') { iv = 1600; f = 560; d = .08; t = 'square'; v = .018; }
  else if (alarm === 'S') { iv = 1200; f = 440; d = .07; t = 'triangle'; v = .018; }
  if (f && now - lastTone >= iv) { lastTone = now; beep(f, d, t, v); }
}

// ══════════════════════════════════════════════════════════
// EXPERTEN-MODUS ENGINE
// ══════════════════════════════════════════════════════════
const E_RECORD_KEY = 'springfield-reaktor-expert-records-v3';
const EDIFFS = {
  easy: {
    lbl: 'Leicht',
    scoreMult: .82,
    fuelDrain: .72,
    rodWear: .72,
    heatGain: .94,
    pumpWear: .08,
    valveWear: .08,
    xeRate: .85,
    eventMin: 62,
    eventMax: 86,
    prewarn: 14,
    maxActive: 2,
    diagReliability: .88,
    controlFail: .45,
    comboBias: .16,
    radiationGain: .78,
    loadAmp: 9,
    loadPeriod: 138,
    meltLimit: 19,
    startTemp: 445,
    startRods: 62,
    startPump: 60,
    startBor: 18,
    emergencyUses: 3
  },
  normal: {
    lbl: 'Normal',
    scoreMult: 1,
    fuelDrain: 1,
    rodWear: 1,
    heatGain: 1,
    pumpWear: .11,
    valveWear: .12,
    xeRate: 1,
    eventMin: 48,
    eventMax: 72,
    prewarn: 12,
    maxActive: 3,
    diagReliability: .76,
    controlFail: 1,
    comboBias: .42,
    radiationGain: 1,
    loadAmp: 12,
    loadPeriod: 122,
    meltLimit: 16,
    startTemp: 460,
    startRods: 60,
    startPump: 58,
    startBor: 20,
    emergencyUses: 2
  },
  hard: {
    lbl: 'Schwer',
    scoreMult: 1.42,
    fuelDrain: 1.12,
    rodWear: 1.18,
    heatGain: 1.03,
    pumpWear: .12,
    valveWear: .14,
    xeRate: 1.18,
    eventMin: 44,
    eventMax: 68,
    prewarn: 12,
    maxActive: 3,
    diagReliability: .68,
    controlFail: .92,
    comboBias: .58,
    radiationGain: .86,
    loadAmp: 16,
    loadPeriod: 108,
    meltLimit: 14,
    startTemp: 476,
    startRods: 58,
    startPump: 57,
    startBor: 22,
    emergencyUses: 2
  }
};

const E_MAINT_TASKS = {
  fuel: { label: 'Brennelementtausch', time: 10 },
  rods: { label: 'Steuerstabtausch', time: 11 },
  pump: { label: 'Pumpentausch', time: 8 },
  valve: { label: 'Ventiltausch', time: 7 },
  leak: { label: 'Leckabdichtung', time: 6 },
  sensor: { label: 'Sensorkalibrierung', time: 5 }
};

const EVENT_META = {
  coolant_leak: {
    title: 'Kühlmittelleck',
    hint: 'Vorwarnung: Kühlkreistrend kippt. Wärmeabfuhr sinkt trotz Pumpenvorgabe.',
    start: 'Kühlwirkung bricht schleichend ein. Reservepumpe, Leistungsreduktion und Notkühlung werden relevant.',
    resolved: 'Leck unter Kontrolle.'
  },
  sensor_fault: {
    title: 'Sensorfehler',
    hint: 'Vorwarnung: Ein Messkanal driftet. Trends und Folgesymptome passen bald nicht mehr zusammen.',
    start: 'Sensorik meldet unplausible Werte. Diagnose und Trendvergleich sind gefragt.',
    resolved: 'Sensorproblem lokalisiert und redundant umgangen.'
  },
  turbine_trip: {
    title: 'Turbinenabwurf',
    hint: 'Vorwarnung: Das Netz verhält sich sprunghaft. Druckstöße werden wahrscheinlicher.',
    start: 'Netzlast fällt abrupt weg. Druck und thermische Trägheit müssen abgefangen werden.',
    resolved: 'Turbinenabwurf sauber abgefangen.'
  },
  valve_stuck: {
    title: 'Ventil klemmt',
    hint: 'Vorwarnung: Die Druckregelung wirkt träge. Ein Ventilantrieb läuft rau.',
    start: 'Druckablass reagiert verzögert. Alternativmaßnahmen werden nötig.',
    resolved: 'Ventilführung stabilisiert.'
  },
  pump_degradation: {
    title: 'Pumpendegradation',
    hint: 'Vorwarnung: Förderstrom fällt leicht, obwohl die Stellgröße gleich bleibt.',
    start: 'Die Pumpe verliert schleichend Wirkung. Reservepfad und Diagnose werden wichtig.',
    resolved: 'Förderpfad wieder stabil.'
  },
  xenon_spike: {
    title: 'Xenon-Spitze',
    hint: 'Vorwarnung: Iod/Xenon-Kette verschiebt sich. Reaktivitätsreserve könnte wegbrechen.',
    start: 'Xenon frisst Neutronen. Der Reaktor wird träger und verlangt feinere Gegensteuerung.',
    resolved: 'Xenon-Spitze abgefahren.'
  },
  grid_swing: {
    title: 'Netzschwankung',
    hint: 'Vorwarnung: Externe Spannung flackert. Lastsprünge und kurze Einbrüche sind möglich.',
    start: 'Netz und Spannungsversorgung schwingen. Lastführung wird unruhig.',
    resolved: 'Netz wieder ruhig.'
  },
  combo_crisis: {
    title: 'Kombi-Krise',
    hint: 'Vorwarnung: Mehrere Leitsysteme melden gleichzeitig Unstimmigkeiten.',
    start: 'Externer Stromausfall, Sensorfehler und steigende Temperatur treffen gleichzeitig ein.',
    resolved: 'Kombi-Krise unter Kontrolle.'
  }
};

const EORD = ['easy', 'normal', 'hard'];
let E = null, eGameHandle = null, eCurDiff = 'normal';
let eParts = [], ePulses = [];
const eCanvas = $('ecv');
const eCtx = eCanvas.getContext('2d');

function blankDiffRec() {
  return { topScore: 0, bestStable: 0, mostCrises: 0 };
}
function blankRecordData() {
  return {
    overall: blankDiffRec(),
    byDiff: {
      easy: blankDiffRec(),
      normal: blankDiffRec(),
      hard: blankDiffRec()
    }
  };
}
function normaliseRecords(data) {
  const base = blankRecordData();
  if (!data || typeof data !== 'object') return base;
  for (const k of ['topScore', 'bestStable', 'mostCrises']) {
    base.overall[k] = Math.max(0, Number(data?.overall?.[k]) || 0);
  }
  for (const dk of EORD) {
    for (const k of ['topScore', 'bestStable', 'mostCrises']) {
      base.byDiff[dk][k] = Math.max(0, Number(data?.byDiff?.[dk]?.[k]) || 0);
    }
  }
  return base;
}
function loadExpertRecords() {
  try {
    return normaliseRecords(JSON.parse(localStorage.getItem(E_RECORD_KEY) || 'null'));
  } catch {
    return blankRecordData();
  }
}
function saveExpertRecords(data) {
  try {
    localStorage.setItem(E_RECORD_KEY, JSON.stringify(normaliseRecords(data)));
  } catch {}
}

function mkRods(init = 100) {
  return Array.from({ length: 6 }, () => init);
}

function mkE(dk) {
  const d = EDIFFS[dk];
  return {
    dk,
    d,
    run: true,
    time: 0,
    freeplay: true,
    scenarioTitle: `Expertenmodus · ${d.lbl}`,
    scenarioDesc: 'Freier Leitwartenbetrieb. Störungen kündigen sich mit Trends und Warnhinweisen an.',
    rods: d.startRods,
    rodActual: d.startRods,
    pump: d.startPump,
    pumpActual: d.startPump,
    bor: d.startBor,
    pressH: 50,
    extP: true,
    diesel: false,
    scram: false,
    melt: false,
    startupMode: false,
    startupProg: 0,
    neu: 58,
    fis: 50,
    pow: 34,
    temp: d.startTemp,
    pres: 136,
    cool: d.startPump,
    res: 100,
    dHeat: 18,
    kEff: 1.0,
    alarm: 'O',
    rState: 'kritisch',
    stab: 0,
    hStress: 0,
    xe: 12,
    netDemand: 55,
    netTime: 0,
    demandOffset: 0,
    loadSpike: 0,
    gridSwing: 0,
    pressShock: 0,
    gridOutLeft: 0,
    fuel: 100,
    rodWear: mkRods(),
    rodJam: 0,
    materialStress: 6,
    instability: 10,
    leak: 0,
    containment: 100,
    radiation: 0,
    radLeak: 0,
    pumpHealth: 100,
    valveHealth: 100,
    valveStuck: 0,
    turbineOk: true,
    reservePumpAvailable: true,
    reservePumpOn: false,
    emergencyCooling: { active: false, timeLeft: 0, cooldown: 0, uses: 0, maxUses: d.emergencyUses },
    venting: { active: false, timeLeft: 0, cooldown: 0, uses: 0 },
    diagnostics: { inProgress: false, timeLeft: 0, cooldown: 0, lastReport: 'Kein Scan gestartet.', certainty: 0, findings: [] },
    maintenance: { mode: false, task: null, timeLeft: 0, queue: [], note: 'Wartungsmodus nicht aktiv.', lastTask: '' },
    autopilot: { enabled: false, nextDecisionAt: 0, lastTrimLog: -99, lastActionLog: {} },
    sensorFaults: { temp: null, pres: null, pow: null },
    activeEvents: [],
    pendingEvent: null,
    eventClock: rand(d.eventMin, d.eventMax),
    eventPrewarned: false,
    resolvedCrises: 0,
    score: { points: 0, penalties: 0, earlyFinds: 0, stableBest: 0 },
    measured: { temp: d.startTemp, pres: 136, pow: 34 },
    tempHistory: [],
    _sparkTick: 0,
    _recordTick: 0,
    log: [],
    lcd: {},
    uiFx: { shake: 0, blackout: 0 },
    pendingControls: {},
    records: loadExpertRecords()
  };
}

function eLog(msg, level = 'info') {
  if (!E) return;
  E.log.unshift({ t: fmt(E.time), msg, level });
  E.log = E.log.slice(0, 24);
  eRenderLog();
}
function eRenderLog() {
  $('elw').innerHTML = E.log.map(e => `<div class="ll ${e.level}"><span class="lt">${e.t}</span>${e.msg}</div>`).join('');
  $('elcnt').textContent = E.log.length;
}
function eLcd(key, msg, cd, level) {
  if (!E) return;
  const last = E.lcd[key] ?? -999;
  if (E.time - last >= cd) {
    E.lcd[key] = E.time;
    eLog(msg, level);
  }
}

function eIsMaintenanceSafe() {
  return !!(E && E.scram && !E.startupMode && !E.melt && E.temp < 360 && E.pres < 138 && E.pow < 18 && E.dHeat < 24);
}
function eHasSensorFault() {
  return Object.values(E.sensorFaults).some(Boolean);
}
function eSensorKeys() {
  return Object.entries(E.sensorFaults).filter(([, v]) => !!v).map(([k]) => k);
}
function eNeedsMaintenance() {
  return E.fuel < 35
    || avg(E.rodWear) < 55
    || E.leak > 8
    || E.pumpHealth < 90
    || E.valveStuck > 10
    || E.valveHealth < 92
    || E.containment < 88
    || E.radiation > 14
    || eHasSensorFault();
}
function eMaintenanceMeta(type) {
  return E_MAINT_TASKS[type] || null;
}
function eMaintenanceTaskQueued(type) {
  return !!(E && (E.maintenance.task === type || E.maintenance.queue.includes(type)));
}
function eMaintenanceQueueText() {
  if (!E) return '';
  const current = E.maintenance.task ? eMaintenanceMeta(E.maintenance.task)?.label || E.maintenance.task : '';
  const queued = E.maintenance.queue.map(type => eMaintenanceMeta(type)?.label || type);
  if (current && queued.length) return `${current} läuft · danach ${queued.join(', ')}`;
  if (current) return `${current} läuft`;
  if (queued.length) return `Vorgemerkt: ${queued.join(', ')}`;
  return '';
}
function eAutoLog(key, msg, level = 'info', cooldown = 6) {
  if (!E) return;
  const last = E.autopilot.lastActionLog[key] ?? -999;
  if (E.time - last < cooldown) return;
  E.autopilot.lastActionLog[key] = E.time;
  eLog(msg, level);
}
function eControlPending(key) {
  return !!(E && E.pendingControls[key]);
}
function eCalcControlFailure(key) {
  if (!E) return 0;
  let chance = .03 * E.d.controlFail;
  chance += E.instability / 520;
  chance += !E.extP && !E.diesel ? .1 : 0;
  chance += eHasSensorFault() ? .03 : 0;
  chance += E.materialStress > 70 ? .04 : 0;
  if (key === 'pump') chance += E.pumpHealth < 70 ? .1 : 0;
  if (key === 'vent') chance += E.valveStuck > 14 ? .16 : 0;
  if (key === 'maint') chance += E.containment < 75 ? .04 : 0;
  if (key === 'diesel') chance += !E.extP ? .04 : 0;
  return clamp(chance, 0, .36);
}
function eDispatchControl(key, label, action, opts = {}) {
  if (!E || !E.run) return false;
  if (eControlPending(key)) {
    eLog(`${label}: Befehl bereits unterwegs.`, 'info');
    return false;
  }
  const failChance = opts.noFail ? 0 : eCalcControlFailure(key);
  if (Math.random() >= failChance) {
    action(false);
    return true;
  }
  E.uiFx.shake = Math.max(E.uiFx.shake, .16);
  const ref = E;
  const delay = rand(.45, 1.6) + failChance * 2.2;
  E.pendingControls[key] = true;
  eLog(`${label}: Schalter prellt. Befehl ist angenommen und kommt verzögert (${delay.toFixed(1)} s).`, 'warning');
  setTimeout(() => {
    if (E !== ref) return;
    delete E.pendingControls[key];
    if (!E.run || E.melt) return;
    action(true);
    eLog(`${label}: Befehl greift verzögert.`, 'warning');
    eRenderUI();
  }, delay * 1000);
  eRenderUI();
  return true;
}
function eSpendPenalty(base, msg) {
  if (!E) return;
  const pts = Math.round(base * E.d.scoreMult);
  E.score.points = Math.max(0, E.score.points - pts);
  E.score.penalties += pts;
  if (msg) eLog(`${msg} (-${pts} P)`, 'warning');
}
function eGrantBonus(base, msg) {
  if (!E) return;
  const pts = Math.round(base * E.d.scoreMult);
  E.score.points += pts;
  if (msg) eLog(`${msg} (+${pts} P)`, 'safe');
}
function eSyncRecords(force = false) {
  if (!E) return;
  E._recordTick += force ? 10 : 0;
  if (!force && E._recordTick < 2) return;
  E._recordTick = 0;
  const rec = normaliseRecords(E.records);
  const score = Math.round(E.score.points);
  const stable = Math.round(E.score.stableBest);
  const crises = Math.round(E.resolvedCrises);
  const dr = rec.byDiff[E.dk];
  dr.topScore = Math.max(dr.topScore, score);
  dr.bestStable = Math.max(dr.bestStable, stable);
  dr.mostCrises = Math.max(dr.mostCrises, crises);
  rec.overall.topScore = Math.max(rec.overall.topScore, score);
  rec.overall.bestStable = Math.max(rec.overall.bestStable, stable);
  rec.overall.mostCrises = Math.max(rec.overall.mostCrises, crises);
  E.records = rec;
  saveExpertRecords(rec);
}
function eRecordsHtml(records = loadExpertRecords()) {
  const lines = [];
  lines.push(`<div><span style="color:var(--mut)">Gesamt:</span> Score ${fmtPts(records.overall.topScore)} · Stabil ${Math.round(records.overall.bestStable)} s · Krisen ${Math.round(records.overall.mostCrises)}</div>`);
  for (const dk of EORD) {
    const rec = records.byDiff[dk];
    const lbl = EDIFFS[dk].lbl;
    lines.push(`<div><span style="color:var(--mut)">${lbl}:</span> Score ${fmtPts(rec.topScore)} · Stabil ${Math.round(rec.bestStable)} s · Krisen ${Math.round(rec.mostCrises)}</div>`);
  }
  return lines.join('');
}

function eInstallSensorFault(kind, severity = 1) {
  const ranges = {
    temp: { bias: [55, 135], drift: [2, 12], jitter: [4, 18] },
    pres: { bias: [8, 24], drift: [1, 4], jitter: [1, 6] },
    pow:  { bias: [7, 20], drift: [1, 5], jitter: [1, 7] }
  }[kind];
  if (!ranges) return;
  const dir = Math.random() < .5 ? -1 : 1;
  E.sensorFaults[kind] = {
    bias: dir * rand(ranges.bias[0], ranges.bias[1]) * severity,
    drift: dir * rand(ranges.drift[0], ranges.drift[1]),
    jitter: rand(ranges.jitter[0], ranges.jitter[1]) * Math.max(.75, severity),
    freq: rand(.8, 2.8),
    phase: rand(0, Math.PI * 2),
    found: false
  };
}
function eClearSensorFaults() {
  E.sensorFaults = { temp: null, pres: null, pow: null };
}
function eMeasure(kind, actual) {
  const f = E.sensorFaults[kind];
  if (!f) return actual;
  const drift = f.bias + Math.sin(E.time * f.freq + f.phase) * f.jitter + Math.sin(E.time * .23 + f.phase) * f.drift;
  return actual + drift;
}
function eUpdateMeasurements() {
  E.measured.temp = clamp(eMeasure('temp', E.temp), 180, 1800);
  E.measured.pres = clamp(eMeasure('pres', E.pres), 50, 320);
  E.measured.pow = clamp(eMeasure('pow', E.pow), 0, 170);
}

function ePickDynamicEvent() {
  const active = new Set(E.activeEvents.map(ev => ev.type));
  const comboWeight = active.has('combo_crisis')
    ? 0
    : E.d.comboBias + E.activeEvents.length * (E.dk === 'hard' ? 1.15 : E.dk === 'normal' ? .48 : .18);
  return weightedPick([
    { type: 'coolant_leak',   w: active.has('coolant_leak')   ? 0 : 2.5 + (E.temp > 720 ? .8 : 0) },
    { type: 'sensor_fault',   w: active.has('sensor_fault')   ? 0 : 2.2 },
    { type: 'turbine_trip',   w: active.has('turbine_trip')   || !E.turbineOk ? 0 : 1.8 + (Math.abs(E.pow - E.netDemand) > 14 ? .6 : 0) },
    { type: 'valve_stuck',    w: active.has('valve_stuck')    ? 0 : 2 + (E.pres > 180 ? .8 : 0) },
    { type: 'pump_degradation', w: active.has('pump_degradation') ? 0 : 2.4 + (E.cool < 48 ? .5 : 0) },
    { type: 'xenon_spike',    w: active.has('xenon_spike')    ? 0 : 1.4 + (E.pow < 45 ? .5 : 0) },
    { type: 'grid_swing',     w: active.has('grid_swing')     ? 0 : 2.1 },
    { type: 'combo_crisis',   w: comboWeight }
  ]);
}
function eScheduleNextEvent() {
  E.eventClock = rand(E.d.eventMin, E.d.eventMax) / (1 + E.activeEvents.length * .22);
  E.eventPrewarned = false;
  E.pendingEvent = null;
}

function eMarkEventEarly(type) {
  const ev = E.activeEvents.find(item => item.type === type);
  if (!ev || ev.earlyAwarded) return;
  ev.earlyAwarded = true;
  if (ev.age <= 20) {
    E.score.earlyFinds += 1;
    eGrantBonus(75, `Problem früh erkannt: ${ev.title}`);
  }
}

function eResolveEvent(ev, reason) {
  const idx = E.activeEvents.findIndex(item => item.id === ev.id);
  if (idx === -1) return;
  E.activeEvents.splice(idx, 1);
  E.resolvedCrises += 1;
  if (ev.type === 'sensor_fault') eClearSensorFaults();
  if (ev.type === 'pump_degradation') E.pumpHealth = Math.max(E.pumpHealth, 92);
  if (ev.type === 'grid_swing') E.gridSwing = Math.min(E.gridSwing, 8);
  eGrantBonus(220 + ev.severity * 40, reason || `${ev.title} gelöst`);
}

function eActivateEvent(type, opts = {}) {
  if (!E || E.activeEvents.some(ev => ev.type === type)) return null;
  const meta = EVENT_META[type];
  if (!meta) return null;
  const sev = opts.severity || 1;
  const ev = {
    id: `${type}_${Math.round(Math.random() * 1e8)}`,
    type,
    title: meta.title,
    severity: sev,
    age: 0,
    stable: 0,
    scenario: !!opts.scenario,
    earlyAwarded: false
  };
  E.activeEvents.push(ev);

  if (type === 'coolant_leak') {
    E.leak = Math.max(E.leak, 16 + sev * 18);
    E.res = Math.max(20, E.res - 6 * sev);
  }
  if (type === 'sensor_fault') {
    const pool = ['temp', 'pres', 'pow'];
    const count = sev > 1.2 || E.dk === 'hard' ? 2 : 1;
    while (eSensorKeys().length < count) {
      const key = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      if (key) eInstallSensorFault(key, sev);
    }
  }
  if (type === 'turbine_trip') {
    E.turbineOk = false;
    E.pressShock += 28 + sev * 10;
    E.demandOffset -= 24 + sev * 6;
    E.uiFx.shake = .7;
  }
  if (type === 'valve_stuck') {
    E.valveStuck = Math.max(E.valveStuck, 34 + sev * 20);
    E.valveHealth = Math.max(34, E.valveHealth - 14 * sev);
  }
  if (type === 'pump_degradation') {
    E.pumpHealth = Math.min(E.pumpHealth, 78 - sev * 14);
  }
  if (type === 'xenon_spike') {
    E.xe = clamp(E.xe + 18 * sev, 0, 100);
  }
  if (type === 'grid_swing') {
    E.gridSwing = Math.max(E.gridSwing, 18 + sev * 10);
    if (sev > 1.15 && Math.random() < .42) {
      E.extP = false;
      E.gridOutLeft = Math.max(E.gridOutLeft, 8 + sev * 5);
      E.uiFx.blackout = .6;
    }
  }
  if (type === 'combo_crisis') {
    E.extP = false;
    E.gridOutLeft = Math.max(E.gridOutLeft, 22 + sev * 6);
    E.temp += 110;
    E.leak = Math.max(E.leak, 12 + sev * 9);
    E.pressShock += 20;
    eInstallSensorFault('temp', sev);
    if (sev > 1.05) eInstallSensorFault('pres', sev);
    E.uiFx.blackout = .7;
    E.uiFx.shake = .9;
  }

  eLog(`${meta.title}: ${meta.start}`, opts.scenario ? 'danger' : 'warning');
  return ev;
}

function eUpdateEventDirector(dt) {
  if (!E.freeplay || E.melt) return;
  E.eventClock -= dt;
  if (!E.eventPrewarned && E.eventClock <= E.d.prewarn) {
    const type = ePickDynamicEvent();
    if (type) {
      E.pendingEvent = {
        type,
        severity: rand(.95, 1.45) + (E.dk === 'hard' ? .18 : 0)
      };
      E.eventPrewarned = true;
      eLog(EVENT_META[type].hint, 'warning');
    }
  }
  if (E.eventClock > 0) return;
  if (E.activeEvents.length >= E.d.maxActive) {
    E.eventClock = rand(8, 14);
    return;
  }
  if (E.pendingEvent) {
    eActivateEvent(E.pendingEvent.type, { severity: E.pendingEvent.severity });
  }
  eScheduleNextEvent();
}

function eTickActiveEvents(dt) {
  for (const ev of [...E.activeEvents]) {
    ev.age += dt;

    if (ev.type === 'coolant_leak') {
      if (E.pres > 175) E.leak = clamp(E.leak + dt * .22 * ev.severity, 0, 80);
      if (E.leak < 6 && E.temp < 690 && E.pres < 170) ev.stable += dt;
      else ev.stable = 0;
      if (ev.stable > 8) eResolveEvent(ev, EVENT_META.coolant_leak.resolved);
    }

    if (ev.type === 'sensor_fault') {
      const found = eSensorKeys().length && eSensorKeys().every(k => E.sensorFaults[k]?.found);
      if (found && E.temp < 760 && E.pres < 185) ev.stable += dt;
      else ev.stable = 0;
      if (ev.stable > 10) eResolveEvent(ev, EVENT_META.sensor_fault.resolved);
    }

    if (ev.type === 'turbine_trip') {
      if (E.turbineOk && E.pres < 170 && Math.abs(E.pow - E.netDemand) < 15) ev.stable += dt;
      else ev.stable = 0;
      if (ev.stable > 6) eResolveEvent(ev, EVENT_META.turbine_trip.resolved);
    }

    if (ev.type === 'valve_stuck') {
      if (E.valveStuck < 6) ev.stable += dt;
      else ev.stable = 0;
      if (ev.stable > 3) eResolveEvent(ev, EVENT_META.valve_stuck.resolved);
    }

    if (ev.type === 'pump_degradation') {
      if (E.reservePumpOn && E.temp < 700 && E.pres < 180) ev.stable += dt;
      else if (E.pumpHealth > 92) ev.stable += dt * 2;
      else ev.stable = 0;
      if (ev.stable > 14) eResolveEvent(ev, EVENT_META.pump_degradation.resolved);
    }

    if (ev.type === 'xenon_spike') {
      if (E.xe < 32 && E.kEff > .95 && Math.abs(E.pow - E.netDemand) < 15) ev.stable += dt;
      else ev.stable = 0;
      if (ev.stable > 8) eResolveEvent(ev, EVENT_META.xenon_spike.resolved);
    }

    if (ev.type === 'grid_swing') {
      E.gridSwing = Math.max(0, E.gridSwing - dt * 2.6);
      if (ev.age > 20 && Math.abs(E.pow - E.netDemand) < 14 && E.pres < 175) ev.stable += dt;
      else ev.stable = 0;
      if (ev.stable > 8) eResolveEvent(ev, EVENT_META.grid_swing.resolved);
    }

    if (ev.type === 'combo_crisis') {
      if ((E.extP || E.diesel) && !eHasSensorFault() && E.temp < 680 && E.pres < 175) ev.stable += dt;
      else ev.stable = 0;
      if (ev.stable > 12) eResolveEvent(ev, EVENT_META.combo_crisis.resolved);
    }
  }
}

function eApplyRodMovementWear(delta) {
  if (!E || !delta) return;
  const heatFactor = Math.max(0, E.temp - 650) / 1200;
  const stressFactor = E.instability / 220;
  const penalty = delta * .03 * E.d.rodWear * (1 + heatFactor + stressFactor);
  E.rodWear = E.rodWear.map((w, i) => clamp(w - penalty * (.85 + i * .05), 0, 100));
}

function eTriggerScram(reason = 'SCRAM ausgelöst.', withPenalty = true) {
  if (!E || E.scram || E.melt || E.startupMode) return;
  E.scram = true;
  E.startupMode = false;
  E.startupProg = 0;
  E.rods = 100;
  E.rodActual = Math.max(E.rodActual, 82);
  E.pressH = Math.min(E.pressH, 42);
  E.materialStress = clamp(E.materialStress + 2.5, 0, 100);
  E.rodWear = E.rodWear.map(w => clamp(w - (2.5 + Math.max(0, E.temp - 700) / 250), 0, 100));
  sndScram();
  if (withPenalty) eSpendPenalty(120, 'SCRAM eingesetzt');
  eLog(reason, 'warning');
}

function eStartEmergencyCooling() {
  if (!E || E.melt || E.emergencyCooling.active || E.emergencyCooling.cooldown > 0 || E.emergencyCooling.uses >= E.emergencyCooling.maxUses) return;
  initA();
  E.emergencyCooling.active = true;
  E.emergencyCooling.timeLeft = 8;
  E.emergencyCooling.cooldown = 34;
  E.emergencyCooling.uses += 1;
  E.materialStress = clamp(E.materialStress + 4, 0, 100);
  E.uiFx.shake = .35;
  eSpendPenalty(90, 'Notkühlung aktiviert');
  eLog('❄ Notkühlung aktiv: Temperatur fällt stark, Materialstress steigt.', 'danger');
}

function eStartVenting() {
  if (!E || E.melt || E.venting.active || E.venting.cooldown > 0) return;
  initA();
  E.venting.active = true;
  E.venting.timeLeft = 5.5;
  E.venting.cooldown = 18;
  E.venting.uses += 1;
  E.instability = clamp(E.instability + 9, 0, 100);
  E.uiFx.shake = .55;
  eSpendPenalty(70, 'Druck abgelassen');
  eLog('⇲ Druckablass läuft: Druck sinkt schnell, kontaminierter Dampf kann freigesetzt werden.', 'warning');
}

function eFinishDiagnosis() {
  if (!E) return;
  const findings = [];
  const reliability = E.d.diagReliability;

  if (E.leak > 8 && Math.random() < reliability + .12) {
    findings.push(`Kühlkreisanalyse: Verdacht auf Kühlmittelleck (${Math.round(E.leak)}% Wirkverlust).`);
    eMarkEventEarly('coolant_leak');
  }
  if (E.pumpHealth < 88 && Math.random() < reliability) {
    findings.push(`Pumpenbild: Förderwirkung auf ${Math.round(E.pumpHealth)}% gesunken.`);
    eMarkEventEarly('pump_degradation');
  }
  if (E.valveStuck > 8 && Math.random() < reliability) {
    findings.push(`Ventildiagnose: Stellglied träge, Öffnung verzögert.`);
    eMarkEventEarly('valve_stuck');
  }
  if (E.xe > 34 && Math.random() < reliability - .05) {
    findings.push(`Reaktivitätsanalyse: Xenon-Anteil erhöht (${Math.round(E.xe)}%).`);
    eMarkEventEarly('xenon_spike');
  }
  for (const key of eSensorKeys()) {
    if (Math.random() < reliability + .1) {
      E.sensorFaults[key].found = true;
      findings.push(`Messkette ${key.toUpperCase()}: unstetiger Drift erkannt.`);
      eMarkEventEarly('sensor_fault');
      eMarkEventEarly('combo_crisis');
    }
  }
  if (!E.turbineOk && Math.random() < reliability) {
    findings.push('Leitwarte: Turbinenabwurf bestätigt, Netzlast fehlt abrupt.');
    eMarkEventEarly('turbine_trip');
  }
  if (!E.extP && Math.random() < reliability) {
    findings.push('Versorgungspfad: Externe Spannung ausgefallen oder instabil.');
    eMarkEventEarly('grid_swing');
    eMarkEventEarly('combo_crisis');
  }
  if (E.fuel < 35 && Math.random() < reliability + .08) {
    findings.push(`Brennstoffreserve niedrig (${Math.round(E.fuel)}%).`);
  }
  if ((E.radiation > 10 || E.containment < 86) && Math.random() < reliability + .08) {
    findings.push(`Strahlungsbild auffällig (${Math.round(E.radiation)}%) · Containment ${Math.round(E.containment)}%.`);
  }
  if (avg(E.rodWear) < 55 && Math.random() < reliability + .08) {
    findings.push(`Steuerstäbe gealtert (${Math.round(avg(E.rodWear))}% Wirksamkeit).`);
  }

  if (!findings.length) findings.push('Kein eindeutiger Befund. Trends weiter beobachten.');

  E.diagnostics.inProgress = false;
  E.diagnostics.cooldown = 18;
  E.diagnostics.findings = findings;
  E.diagnostics.certainty = Math.round(rand(56, 91));
  E.diagnostics.lastReport = findings.join(' ');
  eLog(`Diagnose abgeschlossen (${E.diagnostics.certainty}% Sicherheit).`, findings.length > 1 ? 'safe' : 'info');
  findings.forEach(line => eLog(line, 'info'));
}

function eStartDiagnosis() {
  if (!E || E.melt || E.diagnostics.inProgress || E.diagnostics.cooldown > 0) return;
  initA();
  E.diagnostics.inProgress = true;
  E.diagnostics.timeLeft = 4.4 + (E.dk === 'hard' ? 1.2 : E.dk === 'easy' ? -.5 : 0);
  E.diagnostics.findings = [];
  eLog('⌁ Diagnose startet. Leitwarte vergleicht Trends und Redundanzen ...', 'info');
}

function eToggleMaintenanceMode() {
  if (!E || E.melt) return;
  if (E.maintenance.task || E.maintenance.queue.length) return;
  if (E.maintenance.mode) {
    E.maintenance.mode = false;
    E.maintenance.note = 'Wartungsmodus beendet.';
    eLog('Wartungsmodus beendet.', 'info');
    return;
  }
  if (!eIsMaintenanceSafe()) {
    eLog('Wartung nur im sicheren Stillstand möglich.', 'warning');
    return;
  }
  E.maintenance.mode = true;
  E.maintenance.note = 'Wartungsmodus freigegeben. Maßnahmen können vorgemerkt werden.';
  eLog('Wartungsmodus aktiv. Mehrere Maßnahmen können in die Warteschlange gelegt werden.', 'safe');
}

function eKickMaintenanceQueue() {
  if (!E || !E.maintenance.mode || E.maintenance.task || !E.maintenance.queue.length || !eIsMaintenanceSafe()) return false;
  const type = E.maintenance.queue.shift();
  const task = eMaintenanceMeta(type);
  if (!task) return false;
  E.maintenance.task = type;
  E.maintenance.timeLeft = task.time;
  E.maintenance.note = `${task.label} läuft.${E.maintenance.queue.length ? ` ${E.maintenance.queue.length} weitere Maßnahme(n) warten.` : ''}`;
  initA();
  sndMaint();
  eLog(`🔧 ${task.label} gestartet (${task.time}s).`, 'safe');
  return true;
}

function eStartMaintenanceTask(type, source = 'manual') {
  if (!E || !E.maintenance.mode || !eIsMaintenanceSafe()) return false;
  const task = eMaintenanceMeta(type);
  if (!task || eMaintenanceTaskQueued(type)) return false;
  if (E.maintenance.task) {
    E.maintenance.queue.push(type);
    E.maintenance.note = `${task.label} vorgemerkt.${E.maintenance.queue.length ? ` ${E.maintenance.queue.length} weitere Maßnahme(n) in Warteschlange.` : ''}`;
    eLog(`🔧 ${task.label} in Warteschlange aufgenommen.`, source === 'auto' ? 'info' : 'safe');
    return true;
  }
  E.maintenance.queue.push(type);
  return eKickMaintenanceQueue();
}

function eFinishMaintenanceTask() {
  const type = E.maintenance.task;
  const finishedTask = eMaintenanceMeta(type);
  let msg = 'Wartungsarbeit abgeschlossen.';
  if (type === 'fuel') {
    E.fuel = 100;
    E.xe = Math.max(0, E.xe - 10);
    msg = 'Frische Brennelemente eingesetzt. Reaktivitätsreserve wiederhergestellt.';
  }
  if (type === 'rods') {
    E.rodWear = mkRods();
    E.rodJam = 0;
    msg = 'Steuerstäbe getauscht. Absorptionswirkung wieder voll verfügbar.';
  }
  if (type === 'pump') {
    E.pumpHealth = 100;
    E.reservePumpAvailable = true;
    E.reservePumpOn = false;
    msg = 'Pumpen getauscht. Förderwirkung wieder nominal.';
  }
  if (type === 'valve') {
    E.valveStuck = 0;
    E.valveHealth = 100;
    msg = 'Druckregelventil getauscht. Ablass und Regelung reagieren wieder sauber.';
  }
  if (type === 'leak') {
    E.leak = 0;
    E.res = Math.max(E.res, 70);
    E.containment = Math.min(100, E.containment + 16);
    E.radiation = Math.max(0, E.radiation - 10);
    msg = 'Leck abgedichtet und Abschirmung stabilisiert.';
  }
  if (type === 'sensor') {
    eClearSensorFaults();
    msg = 'Sensoren neu kalibriert und Messkanäle abgeglichen.';
  }
  E.maintenance.task = null;
  E.maintenance.timeLeft = 0;
  E.maintenance.note = msg;
  E.maintenance.lastTask = msg;
  eLog(msg, 'safe');
  if (E.maintenance.mode && E.maintenance.queue.length) {
    eLog(`Wartung setzt fort: ${eMaintenanceMeta(E.maintenance.queue[0])?.label || E.maintenance.queue[0]} folgt automatisch.`, 'info');
    eKickMaintenanceQueue();
  } else if (E.maintenance.mode && !eNeedsMaintenance()) {
    E.maintenance.note = `${msg} Wartungsfenster kann beendet werden.`;
  } else if (E.maintenance.mode && finishedTask) {
    E.maintenance.note = `${msg} Weitere Maßnahmen können sofort vorgemerkt werden.`;
  }
}

function eSetAutoField(field, target, step, min = 0, max = 100) {
  if (!E) return false;
  const prev = E[field];
  const next = clamp(Math.abs(target - prev) <= step ? target : prev + Math.sign(target - prev) * step, min, max);
  if (Math.abs(next - prev) < .4) return false;
  E[field] = next;
  if (field === 'rods') eApplyRodMovementWear(Math.abs(E.rods - prev));
  return true;
}
function eToggleAutopilot(force) {
  if (!E || !E.run || E.melt) return;
  E.autopilot.enabled = typeof force === 'boolean' ? force : !E.autopilot.enabled;
  E.autopilot.nextDecisionAt = 0;
  E.autopilot.lastTrimLog = -99;
  E.autopilot.lastActionLog = {};
  eLog(
    E.autopilot.enabled
      ? '🤖 Autopilot aktiviert. Leitwarte übernimmt Regelung, Notmaßnahmen und Wartungsplanung.'
      : '🤖 Autopilot deaktiviert. Manuelle Steuerung wieder vollständig beim Spieler.',
    E.autopilot.enabled ? 'safe' : 'info'
  );
}
function eAutopilotTick() {
  if (!E || !E.autopilot.enabled || !E.run || E.melt) return;
  if (E.time < E.autopilot.nextDecisionAt) return;
  E.autopilot.nextDecisionAt = E.time + .9;

  if (!E.extP && !E.diesel) {
    eAutoLog('diesel', 'Autopilot fordert Notstrom an.', 'warning', 4);
    eDispatchControl('diesel', 'Autopilot Notstrom', () => {
      E.diesel = true;
      sndDieselOn();
      eLog('Autopilot: Notstrom AN.', 'safe');
    });
  }
  if (!E.reservePumpOn && E.reservePumpAvailable && (E.leak > 14 || E.pumpHealth < 74 || E.cool < 42 || E.temp > 860)) {
    eAutoLog('reserve', 'Autopilot schaltet die Reservepumpe zu.', 'warning', 5);
    eDispatchControl('pump', 'Autopilot Reservepumpe', () => {
      E.reservePumpOn = true;
      sndPumpUp();
      eSpendPenalty(35, 'Reservepumpe zugeschaltet');
      eLog('Autopilot: Reservepumpe zugeschaltet.', 'safe');
    });
  }
  if (!E.scram && (E.temp > 1135 || E.pres > 238 || E.materialStress > 94 || E.radiation > 82)) {
    eAutoLog('scram', 'Autopilot löst SCRAM wegen kritischer Grenzwerte aus.', 'danger', 8);
    eTriggerScram('Autopilot-SCRAM! Anlage wird in sicheren Stillstand gedrückt.', true);
  }
  if (!E.emergencyCooling.active && E.temp > 980 && E.emergencyCooling.cooldown <= 0 && E.emergencyCooling.uses < E.emergencyCooling.maxUses) {
    eAutoLog('emerg', 'Autopilot fordert Notkühlung an.', 'warning', 6);
    eDispatchControl('pump', 'Autopilot Notkühlung', () => eStartEmergencyCooling());
  }
  if (!E.venting.active && E.pres > 224 && E.venting.cooldown <= 0) {
    eAutoLog('vent', 'Autopilot fordert Druckablass an.', 'warning', 6);
    eDispatchControl('vent', 'Autopilot Druckablass', () => eStartVenting());
  }
  if (!E.diagnostics.inProgress && E.diagnostics.cooldown <= 0 && (eHasSensorFault() || E.leak > 11 || E.pumpHealth < 80 || E.valveStuck > 10 || (!E.turbineOk && E.pres < 185))) {
    eAutoLog('diag', 'Autopilot startet einen Diagnosescan.', 'info', 8);
    eDispatchControl('maint', 'Autopilot Diagnose', () => eStartDiagnosis(), { noFail: E.instability < 24 });
  }
  if (!E.turbineOk && E.pres < 166 && !E.maintenance.task) {
    eAutoLog('turb', 'Autopilot koppelt die Turbine wieder ans Netz.', 'info', 8);
    eDispatchControl('maint', 'Autopilot Turbinenkopplung', () => {
      E.turbineOk = true;
      sndPumpUp();
      eLog('Autopilot: Turbine wieder ans Netz gekoppelt.', 'safe');
    }, { noFail: E.instability < 30 });
  }

  if (eIsMaintenanceSafe()) {
    if (!E.maintenance.mode && eNeedsMaintenance()) {
      eAutoLog('maintmode', 'Autopilot öffnet ein Wartungsfenster.', 'safe', 10);
      eDispatchControl('maint', 'Autopilot Wartungsmodus', () => eToggleMaintenanceMode(), { noFail: true });
      return;
    }
    if (E.maintenance.mode) {
      const queued = [];
      if ((E.leak > 4 || E.radiation > 24 || E.containment < 84) && !eMaintenanceTaskQueued('leak')) { eStartMaintenanceTask('leak', 'auto'); queued.push('Leckabdichtung'); }
      if ((E.pumpHealth < 82 || !E.reservePumpAvailable) && !eMaintenanceTaskQueued('pump')) { eStartMaintenanceTask('pump', 'auto'); queued.push('Pumpentausch'); }
      if ((E.valveStuck > 8 || E.valveHealth < 84) && !eMaintenanceTaskQueued('valve')) { eStartMaintenanceTask('valve', 'auto'); queued.push('Ventiltausch'); }
      if (eHasSensorFault() && !eMaintenanceTaskQueued('sensor')) { eStartMaintenanceTask('sensor', 'auto'); queued.push('Sensorkalibrierung'); }
      if (avg(E.rodWear) < 58 && !eMaintenanceTaskQueued('rods')) { eStartMaintenanceTask('rods', 'auto'); queued.push('Steuerstabtausch'); }
      if (E.fuel < 32 && !eMaintenanceTaskQueued('fuel')) { eStartMaintenanceTask('fuel', 'auto'); queued.push('Brennelementtausch'); }
      if (queued.length) {
        eAutoLog('maintqueue', `Autopilot plant Wartung: ${queued.join(', ')}.`, 'safe', 8);
        return;
      }
      if (!E.maintenance.task && !E.maintenance.queue.length && !eNeedsMaintenance()) {
        E.maintenance.mode = false;
        E.maintenance.note = 'Autopilot beendet den Wartungsmodus.';
        eAutoLog('maintdone', 'Autopilot beendet das Wartungsfenster.', 'safe', 8);
      }
    }
  }

  if (E.scram) {
    if (!E.startupMode && !E.maintenance.mode && E.temp < 360 && E.dHeat < 24 && E.radiation < 20 && E.pres < 138) {
      eAutoLog('restart', 'Autopilot startet den Reaktor kontrolliert neu.', 'safe', 10);
      E.startupMode = true;
      E.startupProg = 0;
      sndStartup();
      eLog('Autopilot: Hochfahren gestartet.', 'safe');
    }
    return;
  }
  if (E.startupMode || E.maintenance.mode) return;

  const trimmed = [];
  const rodTarget = clamp(
    E.rods
    + (E.pow - E.netDemand) * .34
    + Math.max(0, E.temp - 680) * .028
    + Math.max(0, E.pres - 180) * .08
    - Math.max(0, E.netDemand - E.pow) * .18
    + Math.max(0, E.xe - 35) * .05
    - Math.max(0, 35 - E.fuel) * .08,
    6, 94
  );
  const pumpTarget = clamp(44 + Math.max(0, E.temp - 520) / 7 + E.leak * .42 + Math.max(0, E.pres - 165) * .22, 24, 100);
  const borTarget = clamp(14 + Math.max(0, E.temp - 820) / 7 + Math.max(0, E.pres - 190) / 4 + Math.max(0, E.xe - 38) * .14 - Math.max(0, E.netDemand - E.pow) * .12, 0, 70);
  const phTarget = clamp(44 + (E.netDemand - E.pow) * .14 - Math.max(0, E.pres - 168) * .46 + (E.temp > 900 ? -6 : 0), 8, 76);

  if (eSetAutoField('rods', rodTarget, 4, 0, 100)) trimmed.push('Stäbe');
  if (eSetAutoField('pump', pumpTarget, 5, 5, 100)) trimmed.push('Pumpe');
  if (eSetAutoField('bor', borTarget, 4, 0, 100)) trimmed.push('Bor');
  if (eSetAutoField('pressH', phTarget, 4, 0, 100)) trimmed.push('Druckhalter');

  if (trimmed.length && E.time - E.autopilot.lastTrimLog > 5.5) {
    E.autopilot.lastTrimLog = E.time;
    eLog(`Autopilot trimmt ${trimmed.join(', ')} auf ${Math.round(E.netDemand)}% Netzlast.`, 'info');
  }
}

function eUpdateActions(dt) {
  if (E.emergencyCooling.active) {
    E.emergencyCooling.timeLeft -= dt;
    if (E.emergencyCooling.timeLeft <= 0) {
      E.emergencyCooling.active = false;
      eLog('Notkühlung beendet. Langfristige Materialschäden bleiben bestehen.', 'warning');
    }
  }
  E.emergencyCooling.cooldown = Math.max(0, E.emergencyCooling.cooldown - dt);

  if (E.venting.active) {
    E.venting.timeLeft -= dt;
    if (E.venting.timeLeft <= 0) {
      E.venting.active = false;
      eLog('Druckablass geschlossen.', 'info');
    }
  }
  E.venting.cooldown = Math.max(0, E.venting.cooldown - dt);

  if (E.diagnostics.inProgress) {
    E.diagnostics.timeLeft -= dt;
    if (E.diagnostics.timeLeft <= 0) eFinishDiagnosis();
  }
  E.diagnostics.cooldown = Math.max(0, E.diagnostics.cooldown - dt);

  if (E.maintenance.task) {
    E.maintenance.timeLeft -= dt;
    if (E.maintenance.timeLeft <= 0) eFinishMaintenanceTask();
  }
  if (!E.maintenance.task && E.maintenance.queue.length && E.maintenance.mode && eIsMaintenanceSafe()) eKickMaintenanceQueue();

  if (E.gridOutLeft > 0) {
    E.gridOutLeft -= dt;
    if (E.gridOutLeft <= 0) {
      E.extP = true;
      E.gridOutLeft = 0;
      eLog('Externe Versorgung wieder verfügbar.', 'safe');
    }
  }

  E.uiFx.shake = Math.max(0, E.uiFx.shake - dt);
  E.uiFx.blackout = Math.max(0, E.uiFx.blackout - dt);
}

function ePhysics(dt) {
  const rodAvg = avg(E.rodWear);
  const rodHealth = clamp(rodAvg / 100, .12, 1);
  const fuelReserve = clamp(E.fuel / 100, 0, 1);
  const highTemp = Math.max(0, E.temp - 700) / 520;

  E.netTime += dt;
  const baseDemand = 55
    + E.d.loadAmp * Math.sin(E.netTime * 2 * Math.PI / E.d.loadPeriod)
    + (E.d.loadAmp * .42) * Math.sin(E.netTime * 2 * Math.PI / (E.d.loadPeriod * 2.4));
  E.demandOffset = lerp(E.demandOffset, 0, dt * .18);
  E.loadSpike = lerp(E.loadSpike, 0, dt * .24);
  E.netDemand = clamp(baseDemand + E.demandOffset + E.loadSpike + Math.sin(E.time * 2.5) * E.gridSwing * .18, 18, 94);

  if (E.extP && chancePS(.015 * Math.max(0, E.gridSwing / 25), dt)) {
    E.extP = false;
    E.gridOutLeft = Math.max(E.gridOutLeft, 2 + E.gridSwing / 14);
    E.uiFx.blackout = .5;
  }

  const fuelDrain = dt * .018 * E.d.fuelDrain * (0.5 + E.pow / 80) * (1 + highTemp * .8 + E.instability / 180 + E.activeEvents.length * .14);
  if (!E.maintenance.task) E.fuel = clamp(E.fuel - fuelDrain, 0, 100);

  const passiveRodWear = dt * .11 * E.d.rodWear * (highTemp * .75 + E.instability / 220 + (E.scram ? .14 : 0));
  E.rodWear = E.rodWear.map((w, i) => clamp(w - passiveRodWear * (.92 + i * .03), 0, 100));

  if (rodAvg < 34 && E.rodJam <= 0 && chancePS(.045 * (1 + highTemp), dt)) {
    E.rodJam = rand(2.5, 5.5);
    eLog('⚠ Steuerstabgruppe reagiert träge.', 'warning');
  }
  if (E.rodJam > 0) E.rodJam -= dt;

  const rodSpeed = clamp(1.7 * rodHealth + fuelReserve * .2, .22, 1.8);
  const rodFollow = clamp(dt * (E.rodJam > 0 ? .35 : rodSpeed), 0, 1);
  E.rodActual = lerp(E.rodActual, E.rods, rodFollow);
  E.pumpActual = lerp(E.pumpActual, E.pump, clamp(dt * 2.1, 0, 1));

  const xeProd = E.fis * .0072 * E.d.xeRate;
  const xeBurn = E.xe * E.fis * .0006;
  const xeDecay = E.xe * .0018;
  E.xe = clamp(E.xe + (xeProd - xeBurn - xeDecay) * dt, 0, 100);

  const rodAbsorb = (E.scram ? 1 : E.rodActual / 100) * clamp(.22 + rodHealth * .56, .22, .78);
  const rOut = E.scram ? .02 : (E.startupMode ? E.startupProg * .82 : 1 - rodAbsorb);
  const borEff = E.bor / 100 * .30;
  const xeEff = E.xe / 100 * .24;
  const doppler = Math.max(0, E.temp - 650) / 2100;
  const fuelPenalty = (1 - fuelReserve) * .16;
  const instPenalty = E.instability / 100 * .06;
  const leakPenalty = E.leak / 500;
  E.kEff = clamp(
    E.scram
      ? .12
      : (0.78 + rOut * .56 + fuelReserve * .08 - borEff - xeEff - doppler - fuelPenalty - instPenalty - leakPenalty),
    0.05,
    1.28
  );

  E.neu = clamp(E.neu + E.neu * (E.kEff - 1) * .18 + (E.scram ? .02 : Math.max(0, .35 - E.neu * .05)), .2, 280);
  E.fis = clamp(E.neu * (.5 + rOut * .9), 0, 260);
  const activePower = E.fis * .68;
  E.pow = clamp(activePower, 0, 150);
  E.dHeat = clamp(E.dHeat * (E.scram ? .988 : .998) + activePower * .012, 3, 95);

  const pf = E.extP ? 1 : E.diesel ? .74 : .18;
  const pumpEff = clamp(E.pumpHealth / 100, .36, 1);
  const leakLoss = clamp(1 - E.leak / 120, .28, 1);
  const reserveBoost = E.reservePumpOn ? 18 : 0;
  const emergencyBoost = E.emergencyCooling.active ? 34 : 0;
  E.cool = clamp(E.pumpActual * pf * pumpEff * leakLoss + reserveBoost + emergencyBoost - E.valveStuck / 45, 0, 100);

  const heatIn = E.pow * 1.09 + E.dHeat * .9 + E.materialStress * .03;
  const naturalLoss = (E.temp - 300) * .0055;
  const emergencySink = E.emergencyCooling.active ? 14 : 0;
  E.temp = clamp(E.temp + ((heatIn * .092 * E.d.heatGain) - (E.cool * .145) - naturalLoss - emergencySink) * dt, 250, 1700);

  const ventEffect = E.venting.active ? 68 * clamp(1 - E.valveStuck / 100, .25, 1) : 0;
  const pressureLag = 1 + E.valveStuck / 120;
  const pressTarget = 104 + Math.max(0, E.temp - 300) * .138 + E.pow * .25 - E.cool * .11 + (E.pressH / 100) * 32 + E.pressShock + E.gridSwing * .15;
  E.pres = clamp(
    E.pres + (pressTarget - E.pres) * (.08 / pressureLag) * dt - ventEffect * dt * .18 + Math.sin(E.time * 3.2) * E.instability * .01,
    80,
    280
  );
  E.pressShock = Math.max(0, E.pressShock - 7 * dt);

  const reserveDrain = dt * ((E.cool / 100) * Math.max(0, E.temp - 520) / 880 * .7 + E.leak * .015 + (E.emergencyCooling.active ? 1.2 : 0));
  const reserveRefill = E.extP ? .18 : E.diesel ? .08 : 0;
  E.res = clamp(E.res - reserveDrain + reserveRefill * dt, 0, 100);

  const pumpWear = dt * E.d.pumpWear * (Math.max(0, E.temp - 680) / 420 + E.instability / 160 + (E.emergencyCooling.active ? .9 : 0));
  const valveWear = dt * E.d.valveWear * (Math.max(0, E.pres - 180) / 80 + (E.venting.active ? 1.15 : 0));
  E.pumpHealth = clamp(E.pumpHealth - pumpWear, 28, 100);
  E.valveHealth = clamp(E.valveHealth - valveWear, 24, 100);
  E.valveStuck = clamp(E.valveStuck + dt * Math.max(0, 80 - E.valveHealth) / 45 - dt * .22, 0, 95);

  const containmentWear = dt * (
    Math.max(0, E.temp - 900) / 520 +
    Math.max(0, E.leak - 12) / 260 +
    (E.venting.active && E.pres > 215 ? .06 : 0) +
    Math.max(0, E.materialStress - 82) / 280
  );
  E.containment = clamp(E.containment - containmentWear, 22, 100);
  const ventRad = E.venting.active && (E.temp > 780 || E.leak > 18 || E.containment < 76)
    ? dt * E.d.radiationGain * (
      Math.max(0, E.temp - 780) / 260 +
      Math.max(0, E.leak - 18) / 70 +
      Math.max(0, 76 - E.containment) / 38
    )
    : 0;
  const leakRad = E.leak > 18 && (E.temp > 860 || E.containment < 70)
    ? dt * E.d.radiationGain * (
      Math.max(0, E.leak - 18) / 55 +
      Math.max(0, E.temp - 860) / 420 +
      Math.max(0, 70 - E.containment) / 28
    )
    : 0;
  const stressRad = E.materialStress > 88 && E.temp > 1020
    ? dt * (Math.max(0, E.materialStress - 88) / 60 + Math.max(0, E.temp - 1020) / 620)
    : 0;
  E.radLeak = clamp((ventRad + leakRad + stressRad) * 5.4, 0, 100);
  E.radiation = clamp(E.radiation + E.radLeak - dt * (E.maintenance.task === 'leak' ? .9 : .22), 0, 100);

  const stressGain = dt * (
    Math.max(0, E.temp - 760) / 260 +
    Math.max(0, E.pres - 185) / 55 +
    (E.emergencyCooling.active ? 1.1 : 0) +
    (E.venting.active ? .8 : 0) +
    Math.max(0, 45 - rodAvg) / 110 +
    Math.max(0, 80 - E.containment) / 60 +
    Math.max(0, 35 - E.fuel) / 110
  );
  const stressRecovery = dt * (E.temp < 540 && E.pres < 155 && !E.activeEvents.length ? .45 : .12);
  E.materialStress = clamp(E.materialStress + stressGain - stressRecovery, 0, 100);

  const instTarget =
    6 +
    Math.abs(E.pow - E.netDemand) * .45 +
    Math.max(0, E.temp - 700) / 12 +
    Math.max(0, E.pres - 175) / 3 +
    E.activeEvents.length * 6 +
    (100 - rodAvg) * .12 +
    (100 - E.fuel) * .08 +
    E.leak * .18 +
    (E.emergencyCooling.active ? 10 : 0) +
    (E.venting.active ? 8 : 0);
  E.instability = clamp(lerp(E.instability, instTarget, .08), 0, 100);

  if (E.startupMode) {
    if (E.temp > 380) {
      E.startupProg = Math.max(0, E.startupProg - .04 * dt);
      eLcd('hotS', 'Neustart blockiert: Temperatur noch zu hoch.', 6, 'warning');
    } else {
      E.startupProg = clamp(E.startupProg + .06 * dt, 0, 1);
    }
    if (E.startupProg >= 1) {
      E.startupMode = false;
      E.scram = false;
      E.rods = 35;
      E.rodActual = 45;
      $('eRodSl').value = 35;
      eLog('Reaktor neugestartet.', 'safe');
    }
  }

  if (E.temp > 1380) E.hStress += dt * (3.8 + E.instability / 35);
  else if (E.temp > 1160) E.hStress += dt * (1.2 + (E.temp - 1160) / 120 + Math.max(0, 40 - E.cool) / 20 + E.materialStress / 70);
  else if (E.temp > 980 && (E.leak > 15 || (!E.extP && !E.diesel))) E.hStress += dt * (.8 + E.leak / 40);
  else E.hStress = Math.max(0, E.hStress - dt * .55);

  E._sparkTick += dt;
  if (E._sparkTick >= 1) {
    E._sparkTick -= 1;
    E.tempHistory.push(Math.round(E.temp));
    if (E.tempHistory.length > 60) E.tempHistory.shift();
  }
}

function eDerived(dt) {
  const prevState = E.rState;
  const prevAlarm = E.alarm;

  if (E.melt) E.rState = 'KERNSCHMELZE';
  else if (E.startupMode) E.rState = 'HOCHFAHREN';
  else if (E.scram) E.rState = 'SCRAM';
  else if (E.kEff < .97 || E.pow < 28) E.rState = 'unterkritisch';
  else if (E.kEff <= 1.03 && E.pow <= 82) E.rState = 'kritisch';
  else E.rState = 'überkritisch';

  if (E.melt) E.alarm = 'M';
  else if (E.scram || E.startupMode) E.alarm = 'S';
  else if (
    E.temp > 980
    || E.pres > 225
    || (!E.extP && !E.diesel)
    || E.res < 16
    || E.materialStress > 84
    || E.radiation > 58
  ) E.alarm = 'C';
  else if (
    E.temp > 760
    || E.pres > 185
    || !E.extP
    || E.res < 34
    || E.leak > 10
    || E.pumpHealth < 76
    || E.radiation > 22
  ) E.alarm = 'W';
  else E.alarm = 'O';

  const stable = E.rState === 'kritisch'
    && E.temp >= 420 && E.temp <= 720
    && E.pres <= 175
    && E.cool >= 46
    && Math.abs(E.pow - E.netDemand) < 14
    && E.instability < 42;
  E.stab = stable ? E.stab + dt : Math.max(0, E.stab - dt * .42);

  if (!E.scram && E.temp > 1140) eLcd('uT', '⚠ Kerntemperatur kritisch. Sofort Leistung senken und kühlen.', 5, 'danger');
  else if (E.temp > 820) eLcd('wT', 'Temperatur steigt. Kühlung erhöhen oder Leistung senken.', 7, 'warning');
  if (!E.scram && E.pres > 228) eLcd('uP', '⚠ Druck im roten Bereich. Venting oder Druckhalter senken.', 5, 'danger');
  if (!E.extP && !E.diesel) eLcd('nP', 'Kein Strom. Notstrom sofort aktivieren!', 4, 'danger');
  if (E.res < 25) eLcd('lr', 'Kühlwasserreserve sehr niedrig.', 10, 'warning');
  if (E.leak > 10) eLcd('leak', 'Kühlung bleibt trotz Pumpenvorgabe schwach. Leckverdacht!', 10, 'warning');
  if (E.pumpHealth < 78) eLcd('pump', 'Pumpe degradiert. Förderwirkung sinkt schleichend.', 12, 'warning');
  if (E.valveStuck > 14) eLcd('valve', 'Druckventil reagiert träge. Druckablass könnte schwach wirken.', 12, 'warning');
  if (E.xe > 55 && !E.scram) eLcd('xeH', 'Xe-Vergiftung: Reaktor wird spürbar träger.', 12, 'warning');
  if (E.fuel < 32) eLcd('fuel', 'Brennstoffreserve niedrig. Leistung wird schwerer zu halten.', 14, 'warning');
  if (E.radiation > 24) eLcd('rad1', 'Strahlungsfreisetzung erkannt. Venting und Lecks jetzt kritisch abwägen.', 14, 'warning');
  if (E.radiation > 58) eLcd('rad2', '⚠ Strahlungsleck kritisch. Containment oder Leck sofort adressieren.', 8, 'danger');
  if (E.containment < 68) eLcd('cont', 'Containment geschwächt. Weitere Druckstöße erhöhen das Freisetzungsrisiko.', 15, 'warning');
  if (avg(E.rodWear) < 45) eLcd('rod', 'Steuerstäbe altern. Gleiche Stellung bremst schwächer.', 14, 'warning');
  if (eHasSensorFault() && !eSensorKeys().every(k => E.sensorFaults[k]?.found)) eLcd('sens', 'Messwerte und Folgesymptome widersprechen sich. Diagnose empfohlen.', 14, 'warning');
  if (eIsMaintenanceSafe() && eNeedsMaintenance()) eLcd('maint', 'Sicheres Wartungsfenster erreicht. Jetzt Komponenten tauschen oder reparieren.', 16, 'safe');
  if (E.scram && !E.startupMode && E.temp < 380 && E.dHeat < 28) eLcd('rdy', '✓ Anlage bereit für kontrollierten Neustart.', 15, 'safe');

  if (E.hStress >= E.d.meltLimit || E.materialStress > 98) {
    E.melt = true;
    E.alarm = 'M';
    E.rState = 'KERNSCHMELZE';
    eLog('💥 KERNSCHMELZE!', 'danger');
    sndMeltdown();
  }

  if (prevState !== E.rState) {
    const map = {
      unterkritisch: 'Reaktion zu schwach.',
      kritisch: 'Kettenreaktion stabil.',
      'überkritisch': 'Reaktion überkritisch.',
      SCRAM: 'SCRAM aktiv.',
      HOCHFAHREN: 'Hochfahren ...',
      KERNSCHMELZE: 'KERNSCHMELZE!'
    };
    eLog(map[E.rState] || E.rState, E.rState === 'kritisch' ? 'safe' : 'warning');
  }
  if (prevAlarm !== E.alarm) {
    const map = { O: 'Normal.', W: 'Warnung.', C: 'Kritisch!', S: 'SCRAM.', M: 'KERNSCHMELZE!' };
    eLog(map[E.alarm] || '', E.alarm === 'O' ? 'safe' : E.alarm === 'W' ? 'warning' : 'danger');
  }
}

function eUpdateScore(dt) {
  const demandErr = Math.abs(E.pow - E.netDemand);
  const stableBonus = E.rState === 'kritisch' && E.temp > 420 && E.temp < 720 && E.pres < 175 && E.instability < 42 ? 2.3 : 0;
  const loadBonus = Math.max(0, 1.5 - demandErr / 12);
  const calmBonus = Math.max(0, 1.2 - E.instability / 50);
  E.score.points += (1.4 + stableBonus + loadBonus + calmBonus) * dt * E.d.scoreMult;

  const riskPenalty = (
    (E.alarm === 'W' ? .55 : 0) +
    (E.alarm === 'C' ? 1.6 : 0) +
    (E.temp > 980 ? 1.1 : 0) +
    (E.pres > 220 ? .8 : 0) +
    (E.radiation > 18 ? .75 : 0) +
    (E.radiation > 48 ? 1.35 : 0)
  ) * dt * E.d.scoreMult;
  if (riskPenalty > 0) {
    E.score.points = Math.max(0, E.score.points - riskPenalty);
    E.score.penalties += riskPenalty;
  }

  E.score.stableBest = Math.max(E.score.stableBest, E.stab);
  eSyncRecords();
}

// ── PARTIKEL / KERNRENDERING ─────────────────────────────
const ENUCL = [
  { x: 80, y: 55 }, { x: 168, y: 46 }, { x: 256, y: 53 }, { x: 344, y: 47 }, { x: 432, y: 54 }, { x: 520, y: 49 }, { x: 600, y: 57 },
  { x: 72, y: 124 }, { x: 160, y: 115 }, { x: 248, y: 121 }, { x: 336, y: 114 }, { x: 424, y: 120 }, { x: 512, y: 115 }, { x: 592, y: 123 },
  { x: 78, y: 193 }, { x: 170, y: 185 }, { x: 262, y: 191 }, { x: 354, y: 184 }, { x: 446, y: 191 }, { x: 534, y: 187 }
];

function eUpdParts(dt, S, partsArr, pulsesArr) {
  const w = Math.floor(clamp(S.neu / 3.5, 6, 65));
  while (partsArr.length < w) partsArr.push({ x: rand(64, 615), y: rand(36, 230), vx: rand(-1.5, 1.5), vy: rand(-1.4, 1.4), sz: rand(2.3, 4.2) });
  while (partsArr.length > w) partsArr.pop();
  partsArr.forEach(p => {
    p.x += p.vx * dt * 60;
    p.y += p.vy * dt * 60;
    if (p.x < 64 || p.x > 615) p.vx *= -1;
    if (p.y < 36 || p.y > 230) p.vy *= -1;
  });
  const act = clamp(S.fis / 160, 0, 1.8);
  if (Math.random() < act * .28) pulsesArr.push({ x: rand(72, 605), y: rand(42, 224), r: rand(4, 15), a: .7 });
  pulsesArr.forEach(p => { p.r += dt * 20; p.a -= dt * .85; });
  for (let i = pulsesArr.length - 1; i >= 0; i--) if (pulsesArr[i].a <= 0) pulsesArr.splice(i, 1);
}

function eDrawCore(S, canvas, ctx, parts, pulses) {
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const heat = clamp((S.temp - 360) / 850, 0, 1);
  const criticalHeat = clamp((S.temp - 900) / 360, 0, 1);
  const instability = clamp((S.instability || 0) / 100, 0, 1);
  const jitterX = instability > .3 ? Math.sin(S.time * 16) * instability * 2.1 : 0;
  const jitterY = instability > .45 ? Math.cos(S.time * 13) * instability * .8 : 0;

  ctx.save();
  ctx.translate(jitterX, jitterY);

  const bg = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * .58);
  bg.addColorStop(0, `rgba(255,165,45,${.04 + heat * .18})`);
  bg.addColorStop(.5, `rgba(0,38,55,${.04 + instability * .06})`);
  bg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = `rgba(0,175,215,${.2 + heat * .12})`;
  ctx.lineWidth = 7;
  ctx.strokeRect(52, 16, W - 104, H - 24);
  ctx.strokeStyle = 'rgba(255,255,255,.04)';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 7, W - 84, H - 8);

  if ((S.xe || 0) > 10) {
    ctx.fillStyle = `rgba(0,120,255,${S.xe / 100 * .07})`;
    ctx.fillRect(52, 16, W - 104, H - 24);
  }
  if (S.bor > 8) {
    ctx.fillStyle = `rgba(0,175,255,${S.bor / 100 * .06})`;
    ctx.fillRect(52, 16, W - 104, H - 24);
  }
  if (heat > .08) {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,125,45,${.05 + heat * .12})`;
      ctx.lineWidth = 1.5;
      const by = 48 + i * 30 + Math.sin(S.time * 3 + i) * 3;
      for (let x = 58; x <= W - 58; x += 18) {
        const wy = by + Math.sin(x * .03 + S.time * 5 + i) * (2.5 + heat * 5);
        x === 58 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }
  }

  ENUCL.forEach((n, i) => {
    const p = .28 + Math.sin(S.time * 4 + i) * .1 + clamp(S.fis / 240, 0, .45);
    ctx.beginPath();
    ctx.fillStyle = `rgba(0,188,255,${.12 + p * .12})`;
    ctx.arc(n.x, n.y, 12 + p * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = 'rgba(196,236,255,.95)';
    ctx.arc(n.x, n.y, 7, 0, Math.PI * 2);
    ctx.fill();
  });

  pulses.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,198,85,${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  });
  parts.forEach(p => {
    ctx.beginPath();
    ctx.fillStyle = heat > .5 ? 'rgba(255,190,85,.95)' : 'rgba(255,222,108,.92)';
    ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
    ctx.fill();
  });

  const ins = S.startupMode ? lerp(H - 35, 12, S.startupProg || 0) : lerp(12, H - 35, (S.rodActual ?? S.rods) / 100);
  const rodXs = [124, 208, 292, 376, 460, 544];
  rodXs.forEach((x, i) => {
    const eff = S.rodWear ? S.rodWear[i] / 100 : 1;
    const r = Math.round(lerp(255, 65, eff));
    const g2 = Math.round(lerp(60, 165, eff));
    const b = Math.round(lerp(60, 255, eff));
    ctx.fillStyle = `rgba(${r},${g2},${b},.68)`;
    ctx.fillRect(x - 8, 10, 16, ins);
    ctx.strokeStyle = `rgba(${Math.min(255, r + 40)},${Math.min(255, g2 + 40)},${Math.min(255, b + 40)},.5)`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - 8, 10, 16, ins);
  });

  if (S.emergencyCooling?.active) {
    for (let i = 0; i < 14; i++) {
      const x = 70 + i * 38 + Math.sin(S.time * 7 + i) * 8;
      ctx.strokeStyle = `rgba(80,220,255,${.18 + Math.sin(S.time * 12 + i) * .05})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 24);
      ctx.lineTo(x + Math.sin(S.time * 9 + i) * 5, 224);
      ctx.stroke();
    }
  }

  ctx.fillStyle = `rgba(255,65,25,${clamp((S.temp - 400) / 950, 0, 1) * .22})`;
  ctx.fillRect(52, 16, W - 104, H - 24);
  if (criticalHeat > .08) {
    ctx.fillStyle = `rgba(255,45,15,${criticalHeat * .18 * (0.7 + Math.sin(S.time * 12) * .3)})`;
    ctx.fillRect(52, 16, W - 104, H - 24);
  }
  if (S.scram) {
    ctx.fillStyle = `rgba(0,212,255,${.05 + Math.sin(S.time * 6) * .03})`;
    ctx.fillRect(52, 16, W - 104, H - 24);
  }

  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = '10.5px Share Tech Mono';
  const rodTxt = S.rodWear ? Math.round(avg(S.rodWear)) : 100;
  const fuelTxt = typeof S.fuel === 'number' ? ` Brennstoff:${Math.round(S.fuel)}%` : '';
  ctx.fillText(`REAKTORKERN  Spalt:${Math.round(S.fis)}  Xe:${Math.round(S.xe || 0)}%  Temp:${Math.round(S.temp)}°C  Druck:${Math.round(S.pres)}bar  Stäbe:${rodTxt}%${fuelTxt}`, 60, 30);

  if (S.temp > 880) {
    ctx.fillStyle = `rgba(255,208,75,${.58 + Math.sin(S.time * 10) * .3})`;
    ctx.font = 'bold 15px Share Tech Mono';
    ctx.fillText('⚠ ÜBERHITZUNG', W - 185, H - 14);
  }
  if (S.startupMode) {
    ctx.fillStyle = `rgba(57,255,138,${.7 + Math.sin(S.time * 6) * .2})`;
    ctx.font = 'bold 13px Share Tech Mono';
    ctx.fillText(`HOCHFAHREN ${Math.round((S.startupProg || 0) * 100)}%`, 60, H - 14);
  }
  if (S.emergencyCooling?.active) {
    ctx.fillStyle = `rgba(0,212,255,${.65 + Math.sin(S.time * 10) * .15})`;
    ctx.font = 'bold 12px Share Tech Mono';
    ctx.fillText('NOTKÜHLUNG AKTIV', W - 190, 28);
  }

  ctx.restore();
}

function drawSparkline() {
  const canvas = $('sparkCanvas');
  if (!canvas || !E) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const hist = E.tempHistory;
  if (hist.length < 2) return;
  const mn = 250, mx = 1300;
  const dy = H - ((980 - mn) / (mx - mn)) * H;
  ctx.fillStyle = 'rgba(255,68,68,.07)';
  ctx.fillRect(0, 0, W, dy);
  const wy = H - ((740 - mn) / (mx - mn)) * H;
  ctx.fillStyle = 'rgba(255,228,77,.05)';
  ctx.fillRect(0, dy, W, wy - dy);
  const col = E.temp > 980 ? 'rgba(255,68,68,.9)' : E.temp > 740 ? 'rgba(255,228,77,.9)' : 'rgba(0,212,255,.8)';
  ctx.strokeStyle = col;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  hist.forEach((v, i) => {
    const x = (i / (hist.length - 1)) * (W - 4) + 2;
    const y = H - ((v - mn) / (mx - mn)) * (H - 4) - 2;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.fillStyle = col;
  ctx.font = '9px Share Tech Mono,monospace';
  ctx.fillText(`${hist[hist.length - 1]}°C`, W - 52, 12);
  ctx.strokeStyle = 'rgba(255,228,77,.2)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 4]);
  ctx.beginPath(); ctx.moveTo(0, wy); ctx.lineTo(W, wy); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,68,68,.2)';
  ctx.beginPath(); ctx.moveTo(0, dy); ctx.lineTo(W, dy); ctx.stroke();
  ctx.setLineDash([]);
}

// ── GAUGES ───────────────────────────────────────────────
const GA = 120, GS = 300;
const GDEFS = [
  { id: 'temp', lbl: 'Kerntemp.', unit: '°C', min: 250, max: 1300, zones: [[0, .308, '#39ff8a'], [.308, .7, '#ffe44d'], [.7, 1, '#ff4444']] },
  { id: 'pres', lbl: 'Druck', unit: 'bar', min: 80, max: 260, zones: [[0, .528, '#39ff8a'], [.528, .778, '#ffe44d'], [.778, 1, '#ff4444']] },
  { id: 'pow', lbl: 'Leistung', unit: '%', min: 0, max: 150, zones: [[0, .187, '#3a5a68'], [.187, .52, '#39ff8a'], [.52, .733, '#ffe44d'], [.733, 1, '#ff4444']] },
  { id: 'cool', lbl: 'Kühlung', unit: '%', min: 0, max: 100, zones: [[0, .35, '#ff4444'], [.35, .65, '#ffe44d'], [.65, 1, '#39ff8a']] },
  { id: 'res', lbl: 'Kühlwasser', unit: '%', min: 0, max: 100, zones: [[0, .25, '#ff4444'], [.25, .55, '#ffe44d'], [.55, 1, '#39ff8a']] },
  { id: 'keff', lbl: 'kEff', unit: '', min: .5, max: 1.4, zones: [[0, .5, '#00d4ff'], [.5, .611, '#39ff8a'], [.611, 1, '#ff4444']] }
];
function gXY(cx, cy, r, deg) {
  const a = deg * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
function gBand(cx, cy, rO, rI, f1, f2) {
  const a1 = GA + f1 * GS, a2 = GA + f2 * GS;
  const [x1o, y1o] = gXY(cx, cy, rO, a1), [x2o, y2o] = gXY(cx, cy, rO, a2);
  const [x1i, y1i] = gXY(cx, cy, rI, a1), [x2i, y2i] = gXY(cx, cy, rI, a2);
  const lg = (f2 - f1) * GS > 180 ? 1 : 0;
  return `M${x1o.toFixed(1)},${y1o.toFixed(1)}A${rO},${rO} 0 ${lg} 1 ${x2o.toFixed(1)},${y2o.toFixed(1)}L${x2i.toFixed(1)},${y2i.toFixed(1)}A${rI},${rI} 0 ${lg} 0 ${x1i.toFixed(1)},${y1i.toFixed(1)}Z`;
}
function gNRot(val, mn, mx) {
  return clamp((val - mn) / (mx - mn), 0, 1) * GS + GA - 270;
}
function buildGauge(d) {
  const W = 86, H = 88, cx = 43, cy = 47, rO = 33, rI = 24;
  const [bx1, by1] = gXY(cx, cy, rO, GA), [bx2, by2] = gXY(cx, cy, rO, GA + GS);
  const [bi1, bi1y] = gXY(cx, cy, rI, GA), [bi2, bi2y] = gXY(cx, cy, rI, GA + GS);
  const bgP = `M${bx1.toFixed(1)},${by1.toFixed(1)}A${rO},${rO} 0 1 1 ${bx2.toFixed(1)},${by2.toFixed(1)}L${bi2.toFixed(1)},${bi2y.toFixed(1)}A${rI},${rI} 0 1 0 ${bi1.toFixed(1)},${bi1y.toFixed(1)}Z`;
  const zones = d.zones.map(([f1, f2, c]) => `<path d="${gBand(cx, cy, rO, rI, f1, f2)}" fill="${c}" opacity=".72"/>`).join('');
  let ticks = '';
  for (let i = 0; i <= 10; i++) {
    const f = i / 10, ang = GA + f * GS;
    const [x1, y1] = gXY(cx, cy, rO + 2, ang), [x2, y2] = gXY(cx, cy, rO + (i % 5 === 0 ? 7 : 4), ang);
    ticks += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="rgba(255,255,255,${i % 5 === 0 ? .35 : .15})" stroke-width="${i % 5 === 0 ? 1.2 : .8}"/>`;
  }
  const [lx, ly] = gXY(cx, cy, rO + 10, GA), [rx, ry] = gXY(cx, cy, rO + 10, GA + GS);
  const endL = `<text x="${lx.toFixed(1)}" y="${(ly + 3).toFixed(1)}" text-anchor="middle" font-family="Share Tech Mono,monospace" font-size="5" fill="rgba(255,255,255,.25)">${d.min}</text><text x="${rx.toFixed(1)}" y="${(ry + 3).toFixed(1)}" text-anchor="middle" font-family="Share Tech Mono,monospace" font-size="5" fill="rgba(255,255,255,.25)">${d.max}</text>`;
  const ndl = `<g id="ng_${d.id}" style="transform-origin:${cx}px ${cy}px;transform:rotate(-150deg)" class="gneedle"><polygon points="${cx - 1.5},${cy} ${cx},${cy - 30} ${cx + 1.5},${cy} ${cx},${cy + 8}" fill="#ff6840"/></g>`;
  const cap = `<circle cx="${cx}" cy="${cy}" r="4" fill="#0d1c25" stroke="#263d50" stroke-width="1"/><circle cx="${cx}" cy="${cy}" r="1.7" fill="#ff8860"/>`;
  const vT = `<text id="gv_${d.id}" x="${cx}" y="${cy + 15}" text-anchor="middle" font-family="Share Tech Mono,monospace" font-size="6.5" fill="#d0e8f0">—</text>`;
  const lT = `<text x="${cx}" y="${H - 2}" text-anchor="middle" font-family="Rajdhani,sans-serif" font-size="5.5" font-weight="600" fill="#3d6070" letter-spacing="0.4">${d.lbl.toUpperCase()}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="display:block"><defs><radialGradient id="rg_${d.id}" cx="50%" cy="26%" r="55%"><stop offset="0%" stop-color="rgba(255,255,255,.04)"/><stop offset="100%" stop-color="rgba(0,0,0,0)"/></radialGradient></defs><rect width="${W}" height="${H}" rx="6" fill="#030a0f" stroke="#112030" stroke-width="1"/><rect width="${W}" height="${H}" rx="6" fill="url(#rg_${d.id})"/><path d="${bgP}" fill="rgba(255,255,255,.04)"/>${zones}${ticks}${endL}${ndl}${cap}${vT}${lT}</svg>`;
}
function initGauges() {
  const g = $('ggrid');
  g.innerHTML = '';
  GDEFS.forEach(d => {
    const w = document.createElement('div');
    w.className = 'inst';
    w.innerHTML = `<div class="ilbl">${d.lbl}</div><div>${buildGauge(d)}</div><div id="lp_${d.id}" class="ilamp"></div>`;
    g.appendChild(w);
  });
}
function updG(d, val) {
  const ng = document.getElementById(`ng_${d.id}`);
  const gv = document.getElementById(`gv_${d.id}`);
  if (ng) ng.style.transform = `rotate(${gNRot(val, d.min, d.max).toFixed(1)}deg)`;
  if (gv) gv.textContent = d.id === 'keff' ? val.toFixed(3) : `${Math.round(val)}${d.unit}`;
}
function updL(id, lvl) {
  const l = document.getElementById(`lp_${id}`);
  if (l) l.className = 'ilamp' + (lvl === 'c' ? ' c' : lvl === 'w' ? ' w' : '');
}

// ── STAB-ALTERUNG ANZEIGE ─────────────────────────────────
function initRodGrid() {
  const g = $('rodGrid');
  g.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const d = document.createElement('div');
    d.className = 'rod-cell';
    d.innerHTML = `<div class="rod-label">Stab ${i + 1}</div><div style="font-family:var(--mono);font-size:.65rem;color:var(--txt)" id="rw${i}">100%</div><div class="rod-wear" id="rwb${i}" style="width:100%;background:var(--g)"></div>`;
    g.appendChild(d);
  }
}
function updRodGrid() {
  E.rodWear.forEach((w, i) => {
    const el = document.getElementById(`rw${i}`);
    const bar = document.getElementById(`rwb${i}`);
    if (!el || !bar) return;
    const pct = Math.round(w);
    el.textContent = `${pct}%`;
    el.style.color = pct < 30 ? 'var(--r)' : pct < 55 ? 'var(--y)' : 'var(--g)';
    bar.style.width = pct + '%';
    bar.style.background = pct < 30 ? 'var(--r)' : pct < 55 ? 'var(--y)' : 'var(--g)';
  });
  const avgWear = Math.round(avg(E.rodWear));
  $('rodWearNote').textContent = avgWear < 30
    ? `⚠ Mittlere Wirksamkeit: ${avgWear}% — Tausch dringend nötig.`
    : avgWear < 55
      ? `Mittlere Wirksamkeit: ${avgWear}% — Trägheit und schwächere Bremswirkung spürbar.`
      : `Stäbe OK: ${avgWear}% Wirksamkeit.`;
  $('rodWearNote').style.color = avgWear < 30 ? 'var(--r)' : avgWear < 55 ? 'var(--y)' : 'var(--mut)';
}

function eActionStateText() {
  if (E.autopilot.enabled && !E.emergencyCooling.active && !E.venting.active && !E.diagnostics.inProgress && !E.maintenance.task) return 'Autopilot aktiv. Leitwarte regelt, reagiert auf Krisen und protokolliert Eingriffe.';
  if (E.emergencyCooling.active) return `Notkühlung aktiv (${E.emergencyCooling.timeLeft.toFixed(1)} s). Materialstress und Verschleiß steigen.`;
  if (E.venting.active) return `Druckablass aktiv (${E.venting.timeLeft.toFixed(1)} s). Druck fällt, aber kontaminierter Dampf kann Strahlung freisetzen.`;
  if (E.diagnostics.inProgress) return `Diagnose läuft (${E.diagnostics.timeLeft.toFixed(1)} s). Leitwarte wertet Trends und Redundanzen aus.`;
  if (E.maintenance.task) return `${E.maintenance.note} Rest: ${Math.ceil(E.maintenance.timeLeft)} s.${E.maintenance.queue.length ? ` Warteschlange: ${E.maintenance.queue.length}.` : ''}`;
  if (E.maintenance.mode) return E.maintenance.queue.length ? `Wartungsmodus aktiv. ${eMaintenanceQueueText()}.` : 'Wartungsmodus aktiv. Mehrere Maßnahmen können direkt vorgemerkt werden.';
  return 'Leitwarte bereit. Keine Sondermaßnahme aktiv.';
}
function eCurrentEventHtml() {
  if (E.melt) return '<span style="color:var(--r)">KERNSCHMELZE</span>';
  if (E.maintenance.task) return `<span style="color:var(--y)">${(eMaintenanceMeta(E.maintenance.task)?.label || E.maintenance.task).toUpperCase()} ${Math.ceil(E.maintenance.timeLeft)}s</span>`;
  if (E.diagnostics.inProgress) return `<span style="color:var(--c)">SCAN ${Math.ceil(E.diagnostics.timeLeft)}s</span>`;
  if (E.emergencyCooling.active) return '<span style="color:var(--c)">NOTKÜHLUNG</span>';
  if (E.venting.active) return '<span style="color:var(--r)">VENTING</span>';
  if (E.radiation > 30) return '<span style="color:var(--r)">STRAHLUNGSLECK</span>';
  if (E.activeEvents.length) return `<span style="color:${E.alarm === 'C' ? 'var(--r)' : 'var(--y)'}">${E.activeEvents[0].title.toUpperCase()}</span>`;
  return '—';
}
function eBuildAlerts() {
  const alerts = [];
  if (E.activeEvents.length) {
    E.activeEvents.forEach(ev => {
      alerts.push({
        cls: E.alarm === 'C' || ev.type === 'combo_crisis' ? 'crit' : 'warn',
        txt: `${ev.title}: ${EVENT_META[ev.type].start}`
      });
    });
  }
  if (E.leak > 10) alerts.push({ cls: 'warn', txt: `Kühlverlust ${Math.round(E.leak)}%: Pumpenvorgabe und realer Effekt driften auseinander.` });
  if (E.pumpHealth < 80) alerts.push({ cls: 'warn', txt: `Pumpenwirkungsgrad nur ${Math.round(E.pumpHealth)}%. Reservepfad oder Wartung erwägen.` });
  if (E.valveStuck > 12) alerts.push({ cls: 'warn', txt: 'Ventil träge: Druckabbau verzögert sich oder bleibt unvollständig.' });
  if (eHasSensorFault()) alerts.push({ cls: 'info', txt: `Sensorik gestört: ${eSensorKeys().map(k => k.toUpperCase()).join(', ')} liefert unsichere Werte.` });
  if (E.fuel < 32) alerts.push({ cls: 'warn', txt: 'Brennstoffreserve niedrig: gleiche Stellgröße liefert weniger Leistung.' });
  if (E.radiation > 24) alerts.push({ cls: E.radiation > 54 ? 'crit' : 'warn', txt: `Strahlungsniveau ${Math.round(E.radiation)}%: Es gibt eine reale Freisetzung aus Venting oder Leck.` });
  if (E.containment < 72) alerts.push({ cls: 'warn', txt: `Containment nur ${Math.round(E.containment)}%: weitere Druckstöße oder große Lecks verschärfen Freisetzungen.` });
  if (avg(E.rodWear) < 45) alerts.push({ cls: 'warn', txt: 'Stabverschleiß hoch: Reaktion wird träger und ungenauer.' });
  if (!alerts.length) alerts.push({ cls: 'info', txt: 'Leitwarte meldet ruhigen Betrieb. Achte auf Trends und Netzlast.' });
  return alerts.slice(0, 3);
}
function ePrimarySummary() {
  if (E.melt) return 'Containment verloren. Kern und Leitwarte sind nicht mehr beherrschbar.';
  if (E.autopilot.enabled && !E.activeEvents.length && !E.maintenance.task && !E.diagnostics.inProgress) return 'Autopilot hält die Anlage auf Kurs und reagiert selbstständig auf erkennbare Risiken.';
  if (E.diagnostics.inProgress) return 'Diagnosescan läuft. Trends und Redundanzen werden abgeglichen.';
  if (E.maintenance.task) return `${E.maintenance.note} Rest: ${Math.ceil(E.maintenance.timeLeft)} s.${E.maintenance.queue.length ? ` Danach folgen ${E.maintenance.queue.length} weitere Maßnahme(n).` : ''}`;
  if (E.maintenance.mode && E.maintenance.queue.length) return `Wartung vorbereitet: ${eMaintenanceQueueText()}.`;
  if (E.radiation > 54) return 'Strahlungsfreisetzung kritisch. Venting stoppen und Leck/Containment priorisieren.';
  if (E.activeEvents.length) return EVENT_META[E.activeEvents[0].type].start;
  if (E.temp > 900) return 'Hohe Kerntemperatur. Leistung senken und Wärmeabfuhr stabilisieren.';
  if (E.pres > 205) return 'Drucklage angespannt. Druckhalter und Lastführung fein ausbalancieren.';
  if (E.fuel < 32) return 'Brennstoffreserve niedrig. Leistung wird träger, Wartungsfenster vorbereiten.';
  return 'Leitwarte meldet ruhigen Betrieb.';
}
function eUpdateBodyFx() {
  document.body.classList.toggle('exp-grid-loss', currentMode === 'experte' && E && !E.extP);
  document.body.classList.toggle('exp-coolant-stress', currentMode === 'experte' && E && (E.leak > 10 || E.pumpHealth < 78 || E.reservePumpOn));
  document.body.classList.toggle('exp-critical', currentMode === 'experte' && E && (E.alarm === 'C' || E.alarm === 'M' || E.radiation > 46));
  document.body.classList.toggle('exp-pressure-hit', currentMode === 'experte' && E && E.uiFx.shake > 0);
  document.body.classList.toggle('exp-blackout', currentMode === 'experte' && E && E.uiFx.blackout > 0);
}

function eRenderScorePanel() {
  $('eScoreBreakdown').innerHTML = [
    ['Punkte', fmtPts(E.score.points)],
    ['Multiplikator', `${E.d.scoreMult.toFixed(2)}x`],
    ['Krisen gelöst', `${E.resolvedCrises}`],
    ['Früh erkannt', `${E.score.earlyFinds}`],
    ['Maßnahmen-Mali', `${fmtPts(E.score.penalties)}`],
    ['Stabilste Phase', `${Math.round(E.score.stableBest)} s`],
    ['Strahlungsniveau', `${Math.round(E.radiation)}%`]
  ].map(([l, v]) => `<div class="score-row"><strong>${l}</strong><span>${v}</span></div>`).join('');
  $('eRecordList').innerHTML = eRecordsHtml(E.records);
}

function eRenderUI() {
  if (!E) return;
  eUpdateMeasurements();
  eUpdParts(.2, E, eParts, ePulses);
  eDrawCore(E, eCanvas, eCtx, eParts, ePulses);
  drawSparkline();

  GDEFS.forEach(d => {
    const v = {
      temp: E.measured.temp,
      pres: E.measured.pres,
      pow: E.measured.pow,
      cool: E.cool,
      res: E.res,
      keff: E.kEff
    }[d.id];
    updG(d, v);
  });

  updL('temp', E.temp > 980 ? 'c' : E.temp > 650 ? 'w' : '');
  updL('pres', E.pres > 220 ? 'c' : E.pres > 175 ? 'w' : '');
  updL('pow', E.pow < 28 ? 'w' : E.pow > 110 ? 'c' : '');
  updL('cool', E.cool < 35 ? 'c' : E.cool < 50 ? 'w' : '');
  updL('res', E.res < 18 ? 'c' : E.res < 35 ? 'w' : '');
  updL('keff', E.kEff > 1.05 ? 'c' : E.kEff < .95 ? 'w' : '');
  updRodGrid();

  $('hTime').textContent = fmt(E.time);
  const tC = E.measured.temp < 650 ? 'g' : E.measured.temp < 980 ? 'y' : 'r';
  const pC = E.measured.pres < 175 ? 'g' : E.measured.pres < 220 ? 'y' : 'r';
  const hT = $('hTemp');
  hT.textContent = `${Math.round(E.measured.temp)}°C`;
  hT.className = `hv ${tC}`;
  const hP = $('hPres');
  hP.textContent = `${Math.round(E.measured.pres)}bar`;
  hP.className = `hv ${pC}`;
  $('hPow').textContent = `${Math.round(clamp(E.measured.pow, 0, 100))}%`;
  $('hXeWrap').style.display = '';
  $('hXe').textContent = `${Math.round(E.xe)}%`;
  $('hXe').className = `hv ${E.xe > 55 ? 'r' : E.xe > 30 ? 'y' : 'c'}`;

  const aD = { O: ['ao', '◆ NORMAL'], W: ['aw', '⚠ WARNUNG'], C: ['ac', '⚠ KRITISCH'], S: ['as', '◉ SCRAM'], M: ['am', '🔴 KERNSCHMELZE'] }[E.alarm];
  $('abanner').className = aD[0];
  $('abanner').textContent = aD[1];

  const sl = $('eStateLabel');
  sl.textContent = E.rState.toUpperCase();
  sl.style.color = { kritisch: 'var(--g)', unterkritisch: 'var(--y)', 'überkritisch': 'var(--r)', SCRAM: 'var(--c)', HOCHFAHREN: 'var(--g)', KERNSCHMELZE: 'var(--o)' }[E.rState] || 'var(--g)';

  const powPct = clamp(E.pow / 100, 0, 1);
  const demPct = clamp(E.netDemand / 100, 0, 1);
  const band = .1;
  const bl = Math.max(0, demPct - band) * 100;
  const bw = Math.min(1, demPct + band) * 100 - bl;
  $('enbd').style.left = bl + '%';
  $('enbd').style.width = bw + '%';
  $('enba').style.width = (powPct * 100) + '%';
  $('enbm').style.left = (demPct * 100) + '%';
  const dev = E.pow - E.netDemand;
  $('enbv').textContent = `${Math.round(E.pow)}% vs ${Math.round(E.netDemand)}% (${dev >= 0 ? '+' : ''}${Math.round(dev)})`;
  $('enbv').style.color = Math.abs(dev) < 12 ? 'var(--g)' : Math.abs(dev) < 22 ? 'var(--y)' : 'var(--r)';

  $('evkeff').textContent = E.kEff.toFixed(3);
  $('evkeff').className = `scv ${E.kEff < .87 ? 'r' : E.kEff < .97 ? 'y' : E.kEff > 1.03 ? 'r' : 'g'}`;
  $('evxe').textContent = `${Math.round(E.xe)}%`;
  $('evxe').className = `scv ${E.xe > 55 ? 'r' : E.xe > 30 ? 'y' : 'c'}`;
  $('exefill').style.width = E.xe + '%';
  $('evneu').textContent = Math.round(E.neu);
  $('evdec').textContent = Math.round(E.dHeat);
  $('evdec').className = `scv ${E.dHeat > 50 ? 'r' : E.dHeat > 25 ? 'y' : 'g'}`;
  $('evgrid').innerHTML = E.extP ? pill('on', 'AN') : pill('off', 'AUS');
  $('evdiesel').innerHTML = E.diesel ? pill('on', 'AN') : pill(E.extP ? 'off' : 'warn', E.extP ? 'AUS' : 'BEREIT');
  $('evpump').textContent = `${Math.round(E.pumpHealth)}%${E.reservePumpOn ? ' + Reserve' : ''}`;
  $('evpump').className = `scv ${E.pumpHealth < 65 ? 'r' : E.pumpHealth < 82 ? 'y' : 'g'}`;
  $('evvalve').textContent = E.valveStuck > 12 ? `träge (${Math.round(E.valveHealth)}%)` : `ok (${Math.round(E.valveHealth)}%)`;
  $('evvalve').className = `scv ${E.valveStuck > 18 ? 'r' : E.valveStuck > 8 ? 'y' : 'g'}`;
  $('evturb').innerHTML = E.turbineOk ? pill('on', 'GEKOPP.') : pill('off', 'TRIP');
  $('evburn').textContent = `${Math.round(E.fuel)}%`;
  $('evburn').className = `scv ${E.fuel < 22 ? 'r' : E.fuel < 40 ? 'y' : 'g'}`;
  $('eburnfill').style.width = `${Math.round(E.fuel)}%`;
  $('evstress').textContent = `${Math.round(E.materialStress)}%`;
  $('evstress').className = `scv ${E.materialStress > 75 ? 'r' : E.materialStress > 48 ? 'y' : 'g'}`;
  $('evrad').textContent = `${Math.round(E.radiation)}%`;
  $('evrad').className = `scv ${E.radiation > 58 ? 'r' : E.radiation > 24 ? 'y' : 'g'}`;
  $('eradfill').style.width = `${Math.round(E.radiation)}%`;
  $('evdiag').textContent = E.diagnostics.inProgress ? `SCAN ${Math.ceil(E.diagnostics.timeLeft)}s` : `${E.diagnostics.certainty || 0}%`;
  $('evdiag').className = `scv ${E.diagnostics.inProgress ? 'c' : E.diagnostics.certainty > 75 ? 'g' : E.diagnostics.certainty > 0 ? 'y' : 'c'}`;
  $('evauto').textContent = E.autopilot.enabled ? 'AKTIV' : 'AUS';
  $('evauto').className = `scv ${E.autopilot.enabled ? 'c' : 'y'}`;
  $('evscore').textContent = fmtPts(E.score.points);
  $('evstable').textContent = `${Math.round(E.stab)} s · Rekord: ${Math.round(E.records.byDiff[E.dk].bestStable)} s`;
  $('edlbl').textContent = E.d.lbl.toUpperCase();
  $('evevt').innerHTML = eCurrentEventHtml();

  $('eScenarioTag').textContent = E.scenarioTitle;
  $('eScenarioDesc').textContent = ePrimarySummary();
  $('eAlertList').innerHTML = eBuildAlerts().map(a => `<div class="alert-chip ${a.cls}">${a.txt}</div>`).join('');
  $('eActionState').textContent = eActionStateText();

  $('eMaintStatus').textContent = E.maintenance.task
    ? `${E.maintenance.note} Rest: ${Math.ceil(E.maintenance.timeLeft)} s.${E.maintenance.queue.length ? ` Warteschlange: ${E.maintenance.queue.length}.` : ''}`
    : (E.maintenance.queue.length
      ? `Warteschlange bereit: ${eMaintenanceQueueText()}.`
      : (E.maintenance.note || (eIsMaintenanceSafe() ? 'Leitwarte im Wartungsfenster.' : 'Sicherer Stillstand erforderlich.')));
  $('eMaintBadge').textContent = E.maintenance.task ? `aktiv ${Math.ceil(E.maintenance.timeLeft)}s` : E.maintenance.queue.length ? `queue ${E.maintenance.queue.length}` : E.maintenance.mode ? 'bereit' : 'inaktiv';
  $('eMaintBadge').style.color = E.maintenance.task ? 'var(--y)' : E.maintenance.mode ? 'var(--g)' : 'var(--mut)';

  $('eRodV').textContent = `${Math.round(E.rods)}%`;
  $('ePumpV').textContent = `${Math.round(E.pump)}%`;
  $('eBorV').textContent = `${Math.round(E.bor)}%`;
  $('ePhV').textContent = `${Math.round(E.pressH)}%`;
  $('eRodSl').value = E.rods;
  $('ePumpSl').value = E.pump;
  $('eBorSl').value = E.bor;
  $('ePhSl').value = E.pressH;
  eUpdFx();
  eRenderScorePanel();

  $('hTemp').dataset.sensorFault = !!E.sensorFaults.temp;
  $('hPres').dataset.sensorFault = !!E.sensorFaults.pres;
  $('hPow').dataset.sensorFault = !!E.sensorFaults.pow;

  const canScram = !E.scram && !E.melt && !E.startupMode && !E.maintenance.task;
  $('eScramBtn').disabled = !canScram;
  $('eScramBtn').classList.toggle('urg', canScram && (E.temp > 1050 || E.pres > 225));

  const canStart = E.scram && !E.startupMode && !E.melt && E.temp < 380 && E.dHeat < 28 && !E.maintenance.task;
  $('eStartupBtn').style.display = E.scram && !E.melt ? 'block' : 'none';
  $('eStartupBtn').disabled = !canStart;

  $('eDieselBtn').textContent = E.diesel ? 'Notstrom AUS' : 'Notstrom AN';
  $('eDieselBtn').disabled = eControlPending('diesel');
  $('eDieselBtn').classList.toggle('urg', !E.extP && !E.diesel);

  $('ePumpFixBtn').disabled = E.reservePumpOn || !E.reservePumpAvailable || eControlPending('pump');
  $('ePumpFixBtn').classList.toggle('relevant', !E.reservePumpOn && (E.pumpHealth < 82 || E.leak > 14 || (!E.extP && !E.diesel)));

  $('eEmergencyBtn').disabled = E.emergencyCooling.active || E.emergencyCooling.cooldown > 0 || E.emergencyCooling.uses >= E.emergencyCooling.maxUses || eControlPending('pump');
  $('eEmergencyBtn').textContent = E.emergencyCooling.active
    ? `❄ Notkühlung ${Math.ceil(E.emergencyCooling.timeLeft)}s`
    : E.emergencyCooling.cooldown > 0
      ? `❄ Cooldown ${Math.ceil(E.emergencyCooling.cooldown)}s`
      : '❄ Notkühlung';
  $('eEmergencyBtn').classList.toggle('relevant', !E.emergencyCooling.active && E.temp > 900);
  $('eEmergencyBtn').classList.toggle('active-action', E.emergencyCooling.active);

  $('eVentBtn').disabled = E.venting.active || E.venting.cooldown > 0 || eControlPending('vent');
  $('eVentBtn').textContent = E.venting.active
    ? `⇲ Venting ${Math.ceil(E.venting.timeLeft)}s`
    : E.venting.cooldown > 0
      ? `⇲ Cooldown ${Math.ceil(E.venting.cooldown)}s`
      : '⇲ Druck ablassen';
  $('eVentBtn').classList.toggle('relevant', !E.venting.active && E.pres > 205);
  $('eVentBtn').classList.toggle('active-action', E.venting.active);

  $('eDiagBtn').disabled = E.diagnostics.inProgress || E.diagnostics.cooldown > 0 || E.melt || eControlPending('maint');
  $('eDiagBtn').textContent = E.diagnostics.inProgress
    ? `⌁ Scan ${Math.ceil(E.diagnostics.timeLeft)}s`
    : E.diagnostics.cooldown > 0
      ? `⌁ Cooldown ${Math.ceil(E.diagnostics.cooldown)}s`
      : '⌁ Diagnose / Scan';
  $('eDiagBtn').classList.toggle('relevant', eHasSensorFault() || E.leak > 10 || E.pumpHealth < 82 || E.valveStuck > 10);

  $('eMaintModeBtn').disabled = !!E.maintenance.task || !!E.maintenance.queue.length || eControlPending('maint') || (!E.maintenance.mode && !eIsMaintenanceSafe());
  $('eMaintModeBtn').textContent = E.maintenance.mode ? '🔧 Wartung AUS' : '🔧 Wartungsmodus';
  $('eMaintModeBtn').classList.toggle('relevant', eIsMaintenanceSafe() && eNeedsMaintenance());

  $('eFuelSwapBtn').disabled = !E.maintenance.mode || eMaintenanceTaskQueued('fuel') || E.fuel > 80;
  $('eRodReplBtn').disabled = !E.maintenance.mode || eMaintenanceTaskQueued('rods') || avg(E.rodWear) > 80;
  $('ePumpSwapBtn').disabled = !E.maintenance.mode || eMaintenanceTaskQueued('pump') || E.pumpHealth > 94;
  $('eValveSwapBtn').disabled = !E.maintenance.mode || eMaintenanceTaskQueued('valve') || (E.valveStuck < 5 && E.valveHealth > 94);
  $('eLeakSealBtn').disabled = !E.maintenance.mode || eMaintenanceTaskQueued('leak') || E.leak < 4;
  $('eSensorCalBtn').disabled = !E.maintenance.mode || eMaintenanceTaskQueued('sensor') || !eHasSensorFault();
  $('eTurbineBtn').disabled = E.turbineOk || E.pres > 168 || E.maintenance.task || eControlPending('maint');
  $('eTurbineBtn').classList.toggle('relevant', !E.turbineOk && E.pres < 168);

  $('eAutopilotBtn').textContent = E.autopilot.enabled ? '🤖 Autopilot AN' : '🤖 Autopilot AUS';
  $('eAutopilotBtn').classList.toggle('relevant', E.autopilot.enabled);

  $('eRodSl').disabled = E.scram || E.melt || !E.run || E.startupMode || E.maintenance.mode || E.maintenance.task;
  $('ePumpSl').disabled = E.melt || !E.run || !!E.maintenance.task;
  $('eBorSl').disabled = E.melt || !E.run || E.maintenance.mode || !!E.maintenance.task;
  $('ePhSl').disabled = E.melt || !E.run || E.maintenance.mode || !!E.maintenance.task;

  $('mflash').classList.toggle('on', E.alarm === 'M' || E.alarm === 'C');
  eUpdateBodyFx();
  tickAudio(E.alarm);
}

function eUpdFx() {
  const avgWear = Math.round(avg(E.rodWear));
  const actual = Math.round(E.rodActual);
  const rodMsg = E.scram
    ? 'SCRAM aktiv – Stäbe fahren maximal ein, Restwärme bleibt.'
    : E.startupMode
      ? `Hochfahren ${Math.round(E.startupProg * 100)}% – Stäbe lösen sich kontrolliert aus dem SCRAM.`
      : `Soll ${Math.round(E.rods)}% · Ist ${actual}% · Wirksamkeit ${avgWear}%${E.rodJam > 0 ? ' · Stabgruppe träge!' : ''}`;
  $('eRodFx').textContent = rodMsg;
  $('eRodFx').className = `fx ${avgWear < 35 || E.rodJam > 0 ? 'warn' : E.scram ? 'ok' : ''}`;

  const pfx = [];
  if (!E.extP && !E.diesel) pfx.push('Kein Strom');
  if (E.leak > 10) pfx.push(`Leck ${Math.round(E.leak)}%`);
  if (E.reservePumpOn) pfx.push('Reservepfad aktiv');
  if (E.radiation > 24) pfx.push(`Strahlung ${Math.round(E.radiation)}%`);
  pfx.push(`Wirkung ${Math.round(E.pumpHealth)}%`);
  $('ePumpFx').textContent = pfx.join(' · ');
  $('ePumpFx').className = `fx ${E.pumpHealth < 70 || (!E.extP && !E.diesel) ? 'crit' : E.leak > 10 ? 'warn' : 'ok'}`;

  $('eBorFx').textContent = E.fuel < 35
    ? `Bor ${Math.round(E.bor)}% – niedriger Brennstoff macht die Reaktion träger.`
    : `Bor ${Math.round(E.bor)}% – chemische Absorption unabhängig von den Stäben.`;
  $('eBorFx').className = `fx ${E.bor > 70 ? 'ok' : ''}`;

  $('ePhFx').textContent = E.valveStuck > 10
    ? `Ventil träge (${Math.round(E.valveHealth)}%) – Druckänderungen kommen verzögert an.`
    : `Druckhalter ${Math.round(E.pressH)}% – aktueller Druck ${Math.round(E.pres)} bar · Containment ${Math.round(E.containment)}%.`;
  $('ePhFx').className = `fx ${E.pres > 220 || E.valveStuck > 18 ? 'crit' : E.pres > 180 || E.valveStuck > 8 ? 'warn' : 'ok'}`;
}

function eRunLoop() {
  if (eGameHandle) clearInterval(eGameHandle);
  eGameHandle = setInterval(() => {
    if (!E || !E.run || E.melt) {
      clearInterval(eGameHandle);
      return;
    }
    E.time += .2;
    eUpdateActions(.2);
    eUpdateEventDirector(.2);
    eTickActiveEvents(.2);
    ePhysics(.2);
    eDerived(.2);
    eAutopilotTick();
    eUpdateScore(.2);
    eRenderUI();
    if (E.melt) {
      eEnd();
      clearInterval(eGameHandle);
    }
  }, 200);
}

function ePrepareUi() {
  eParts = [];
  ePulses = [];
  initA();
  lastTone = 0;
  initGauges();
  initRodGrid();
  $('eRodSl').value = E.rods;
  $('ePumpSl').value = E.pump;
  $('eBorSl').value = E.bor;
  $('ePhSl').value = E.pressH;
  $('eStartOvl').hidden = true;
  $('eEndOvl').hidden = true;
  eRenderUI();
  eRunLoop();
}

function eStartGame(dk) {
  eCurDiff = dk;
  E = mkE(dk);
  E.records = loadExpertRecords();
  ePrepareUi();
  eLog(`Reaktor gestartet (${E.d.lbl}). Expertenmodus aktiv.`, 'safe');
  eLog('Krisen kündigen sich über Trends, Loghinweise und sinkende Wirksamkeit an.', 'info');
}

function eUpdateStartOverlay() {
  $('eStartRecords').innerHTML = eRecordsHtml(loadExpertRecords());
}

function eEnd() {
  if (!E || !E.run) return;
  E.run = false;
  eSyncRecords(true);
  let cause = 'Überhitzung durch unzureichende Wärmeabfuhr';
  if (!E.extP && !E.diesel) cause = 'Kein Strom – Pumpen verloren fast vollständig ihre Wirkung';
  else if (E.leak > 20) cause = 'Kühlmittelleck blieb zu lange ungebremst';
  else if (E.pumpHealth < 55) cause = 'Pumpendegradation wurde zu spät kompensiert';
  else if (E.valveStuck > 25 && E.pres > 235) cause = 'Druckregelung versagte durch klemmendes Ventil';
  else if (E.fuel < 10) cause = 'Brennstoff fast erschöpft – Reaktivitätsreserve brach weg';
  else if (avg(E.rodWear) < 20) cause = 'Steuerstäbe waren zu stark verschlissen und reagierten zu träge';
  else if (eHasSensorFault()) cause = 'Sensorfehler kaschierten die Eskalation zu lange';
  else if (E.materialStress > 98) cause = 'Materialstress überstieg die Strukturreserve';

  $('eEndTitle').textContent = '💥 Kernschmelze';
  $('eEndItems').innerHTML = [
    `<strong>Ursache:</strong> ${cause}`,
    `Score: ${fmtPts(E.score.points)} · Krisen gelöst: ${E.resolvedCrises} · Frühdiagnosen: ${E.score.earlyFinds}`,
    `Temperatur: ${Math.round(E.temp)}°C · Druck: ${Math.round(E.pres)} bar · Materialstress: ${Math.round(E.materialStress)}%`,
    `Betriebszeit: ${fmt(E.time)} · Stabilste Phase: ${Math.round(E.score.stableBest)} s`,
    `Brennstoff: ${Math.round(E.fuel)}% · Stabwirksamkeit: ${Math.round(avg(E.rodWear))}% · Rekord (${EDIFFS[E.dk].lbl}): ${fmtPts(E.records.byDiff[E.dk].topScore)}`
  ].map(d => `<div class="mitem">${d}</div>`).join('');
  $('eEndOvl').hidden = false;
}

// ── EXPERTE EVENTS ───────────────────────────────────────
let lrS = 0, lpS = 0, lbS = 0, lphS = 0;
$('eRodSl').addEventListener('input', e => {
  if (!E || !E.run || E.scram || E.startupMode || E.maintenance.mode || E.maintenance.task) return;
  const prev = E.rods;
  E.rods = +e.target.value;
  $('eRodV').textContent = `${Math.round(E.rods)}%`;
  eApplyRodMovementWear(Math.abs(E.rods - prev));
  const n = Date.now();
  if (n - lrS > 110) { lrS = n; initA(); E.rods > prev ? sndRodsIn() : sndRodsOut(); }
});
$('ePumpSl').addEventListener('input', e => {
  if (!E || !E.run || E.melt || E.maintenance.task) return;
  const prev = E.pump;
  E.pump = +e.target.value;
  $('ePumpV').textContent = `${Math.round(E.pump)}%`;
  const n = Date.now();
  if (n - lpS > 140) { lpS = n; initA(); E.pump > prev ? sndPumpUp() : sndPumpDown(); }
});
$('eBorSl').addEventListener('input', e => {
  if (!E || !E.run || E.melt || E.maintenance.mode || E.maintenance.task) return;
  const prev = E.bor;
  E.bor = +e.target.value;
  $('eBorV').textContent = `${Math.round(E.bor)}%`;
  const n = Date.now();
  if (n - lbS > 140) { lbS = n; initA(); E.bor > prev ? sndBorUp() : sndBorDown(); }
});
$('ePhSl').addEventListener('input', e => {
  if (!E || !E.run || E.melt || E.maintenance.mode || E.maintenance.task) return;
  const prev = E.pressH;
  E.pressH = +e.target.value;
  $('ePhV').textContent = `${Math.round(E.pressH)}%`;
  const n = Date.now();
  if (n - lphS > 140) { lphS = n; initA(); E.pressH > prev ? sndPhUp() : sndPhDown(); }
});
$('eScramBtn').addEventListener('click', () => {
  initA();
  eTriggerScram('SCRAM! Restwärme bleibt – Kühlung und Druckführung weiter beachten.', true);
});
$('eStartupBtn').addEventListener('click', () => {
  initA();
  if (!E || !E.scram || E.melt || E.startupMode || E.temp > 380 || E.dHeat > 28) return;
  E.startupMode = true;
  E.startupProg = 0;
  sndStartup();
  eLog('Hochfahren gestartet.', 'safe');
});
$('eDieselBtn').addEventListener('click', () => {
  initA();
  if (!E || !E.run) return;
  eDispatchControl('diesel', 'Notstrom', () => {
    E.diesel = !E.diesel;
    E.diesel ? sndDieselOn() : sndDieselOff();
    eLog(E.diesel ? 'Notstrom AN.' : 'Notstrom AUS.', E.diesel ? 'safe' : 'info');
  });
});
$('ePumpFixBtn').addEventListener('click', () => {
  initA();
  if (!E || E.reservePumpOn || !E.reservePumpAvailable) return;
  eDispatchControl('pump', 'Reservepumpe', () => {
    E.reservePumpOn = true;
    sndPumpUp();
    setTimeout(sndPumpUp, 220);
    eSpendPenalty(35, 'Reservepumpe zugeschaltet');
    eLog('Reservepumpe zugeschaltet. Kurzfristig mehr Kühlung, langfristig kein Ersatz für Pumpentausch.', 'safe');
  });
});
$('eEmergencyBtn').addEventListener('click', () => {
  eDispatchControl('pump', 'Notkühlung', () => eStartEmergencyCooling());
});
$('eVentBtn').addEventListener('click', () => {
  eDispatchControl('vent', 'Druckablass', () => eStartVenting());
});
$('eDiagBtn').addEventListener('click', () => {
  eDispatchControl('maint', 'Diagnose', () => eStartDiagnosis(), { noFail: E.dk === 'easy' && E.instability < 30 });
});
$('eMaintModeBtn').addEventListener('click', () => {
  initA();
  eDispatchControl('maint', 'Wartungsmodus', () => eToggleMaintenanceMode());
});
$('eAutopilotBtn').addEventListener('click', () => {
  initA();
  eToggleAutopilot();
});
$('eFuelSwapBtn').addEventListener('click', () => {
  initA();
  eDispatchControl('maint', 'BE-Tausch', () => eStartMaintenanceTask('fuel'));
});
$('eRodReplBtn').addEventListener('click', () => {
  initA();
  eDispatchControl('maint', 'Stab-Tausch', () => eStartMaintenanceTask('rods'));
});
$('ePumpSwapBtn').addEventListener('click', () => {
  initA();
  eDispatchControl('maint', 'Pumpentausch', () => eStartMaintenanceTask('pump'));
});
$('eValveSwapBtn').addEventListener('click', () => {
  initA();
  eDispatchControl('maint', 'Ventiltausch', () => eStartMaintenanceTask('valve'));
});
$('eLeakSealBtn').addEventListener('click', () => {
  initA();
  eDispatchControl('maint', 'Leckabdichtung', () => eStartMaintenanceTask('leak'));
});
$('eSensorCalBtn').addEventListener('click', () => {
  initA();
  eDispatchControl('maint', 'Sensorkalibrierung', () => eStartMaintenanceTask('sensor'));
});
$('eTurbineBtn').addEventListener('click', () => {
  initA();
  if (!E || E.turbineOk || E.pres > 168 || E.maintenance.task) return;
  eDispatchControl('maint', 'Turbinenkopplung', () => {
    E.turbineOk = true;
    sndPumpUp();
    eLog('Turbine wieder sauber ans Netz gekoppelt.', 'safe');
  });
});
$('eRestartBtn').addEventListener('click', () => eStartGame(eCurDiff));
$('eDiffBtn').addEventListener('click', () => {
  eUpdateStartOverlay();
  $('eStartOvl').hidden = false;
});
$('eSoundBtn').addEventListener('click', () => {
  initA();
  sOn = !sOn;
  $('eSoundBtn').textContent = `${sOn ? '🔊' : '🔇'} Alarmton: ${sOn ? 'AN' : 'AUS'}`;
});
$('ehbtn').addEventListener('click', () => {
  const h = $('ehb');
  const open = h.style.display === 'none';
  h.style.display = open ? 'block' : 'none';
  $('ehbtn').textContent = open ? 'HILFE ▲' : 'HILFE';
});
$('eFreeEasy').addEventListener('click', () => eStartGame('easy'));
$('eFreeNormal').addEventListener('click', () => eStartGame('normal'));
$('eFreeHard').addEventListener('click', () => eStartGame('hard'));
$('eStartBack').addEventListener('click', () => {
  $('eStartOvl').hidden = true;
  $('modeOvl').hidden = false;
});
$('eEndRestart').addEventListener('click', () => eStartGame(eCurDiff));
$('eEndChange').addEventListener('click', () => {
  eUpdateStartOverlay();
  $('eEndOvl').hidden = true;
  $('eStartOvl').hidden = false;
});

// ══════════════════════════════════════════════════════════
// SCHÜLER-MODUS ENGINE
// ══════════════════════════════════════════════════════════
const sCanvas = $('scv'), sCtx = sCanvas.getContext('2d');
let sParts = [], sPulses = [];
let S2 = null, sTick = null;
let sCurrentScenario = 0, sScenarioDone = [false, false, false, false, false];

const SCENARIOS = [
  {
    id: 'stabil', title: '1 · Stabiler Betrieb',
    desc: 'Halte den Reaktor im grünen Bereich. Lerne wie Steuerstäbe und Kühlung zusammenwirken.',
    goal: 'Temperatur 30 Sek. zwischen 400–700°C halten.',
    check: (S) => S.stab >= 30,
    hint: 'Stäbe 55–65%, Pumpe 50–70%.',
    learn: 'Steuerstäbe bremsen die Kettenreaktion mechanisch. Die Kühlung führt die Wärme ab. Beide Wege sind nötig – keiner allein reicht.',
    showScram: false, showDiesel: false, showStartup: false,
    setup: (S) => { S.rods = 62; S.pump = 58; S.temp = 460; S.scram = false; }
  },
  {
    id: 'restwärme', title: '2 · Restwärme nach SCRAM',
    desc: 'SCRAM schaltet die Kettenreaktion ab – aber die Wärme bleibt. Zerfallsprodukte heizen den Kern weiter auf.',
    goal: 'SCRAM auslösen, dann Temperatur unter 350°C bringen.',
    check: (S) => S.scram && S.temp < 350,
    hint: 'SCRAM drücken, dann Pumpe auf 75–90% stellen. Es dauert! Die Wärme kommt nicht von der Reaktion, sondern von den Spaltprodukten.',
    learn: 'Das ist der wichtigste Unterschied zu einem Kohlekraftwerk: Ein Reaktor kann man nicht einfach ausschalten. Die Restwärme kann noch Stunden nach dem SCRAM zur Kernschmelze führen – wie in Fukushima 2011.',
    showScram: true, showDiesel: false, showStartup: false,
    setup: (S) => { S.rods = 45; S.pump = 65; S.temp = 680; S.scram = false; S.dHeat = 45; }
  },
  {
    id: 'stromausfall', title: '3 · Stromausfall + Notstrom',
    desc: 'Das externe Netz fällt aus. Ohne Strom laufen Kühlpumpen auf 18% – die Temperatur steigt gefährlich an.',
    goal: 'Notstrom aktivieren bevor Temperatur 900°C erreicht.',
    check: (S) => S._dieselActivatedInTime === true,
    hint: 'Notstrom-Button sofort drücken! Mit Notstrom laufen Pumpen auf 74% – genug um den Kern zu kühlen.',
    learn: 'Fukushima: Der Diesel-Generator lief erst 1 Stunde nach dem Erdbeben an – dann kam der Tsunami. Moderne Anlagen haben passive Kühlsysteme die ohne Strom funktionieren.',
    showScram: false, showDiesel: true, showStartup: false,
    setup: (S) => { S.rods = 60; S.pump = 60; S.temp = 520; S.extP = true; S.diesel = false; S._outageFired = false; S._dieselActivatedInTime = false; }
  },
  {
    id: 'neustart', title: '4 · Neustart nach SCRAM',
    desc: 'Der Reaktor wurde abgeschaltet. Restwärme ist abgeführt. Jetzt den Reaktor kontrolliert wieder hochfahren.',
    goal: 'Reaktor von SCRAM auf stabilen Betrieb bringen.',
    check: (S) => !S.scram && S.stab >= 20,
    hint: 'Erst kühlen bis unter 380°C, dann ▶ Neustart drücken. Stäbe fahren automatisch aus. Beobachte kEff!',
    learn: 'Beim Neustart steigt kEff langsam über 1. Der Operator beobachtet genau wie schnell – zu schnell wäre gefährlich. Kontrolliertes Hochfahren dauert Stunden.',
    showScram: true, showDiesel: false, showStartup: true,
    setup: (S) => { S.rods = 100; S.pump = 70; S.temp = 420; S.scram = true; S.dHeat = 28; S.kEff = 0.12; }
  },
  {
    id: 'xenon', title: '5 · Xenon-Vergiftung (Tschernobyl)',
    desc: 'Nach langer Volllast hat sich Xenon-135 aufgebaut. Das Gift frisst Neutronen – kEff sinkt automatisch. Du musst gegensteuern ohne den Reaktor zu destabilisieren.',
    goal: 'Reaktor 25 Sek. stabil halten trotz steigendem Xenon-Spiegel.',
    check: (S) => S.stab >= 25 && S._xenoStable,
    hint: 'Stäbe vorsichtig ausfahren (40–50%) um kEff zu halten. Zu weit → überkritisch! Pumpe hoch halten.',
    learn: 'In Tschernobyl 1986 versuchte das Team, trotz Xenon-Vergiftung den Reaktor in Betrieb zu halten. Sie fuhren fast alle Stäbe aus – zu wenig Reserven für eine Notabschaltung. Als die Leistung plötzlich anstieg, versagte der SCRAM.',
    showScram: true, showDiesel: false, showStartup: false,
    setup: (S) => { S.rods = 68; S.pump = 65; S.temp = 520; S.scram = false; S._xenon = 35; S._xenoStable = false; }
  }
];

function mkS2(scenIdx) {
  const sc = SCENARIOS[scenIdx || 0];
  const S = {
    time: 0, rods: 62, pump: 58, extP: true, diesel: false, scram: false, melt: false,
    startupMode: false, startupProg: 0,
    neu: 58, fis: 50, pow: 34, temp: 445, pres: 136, cool: 58, res: 100, dHeat: 18, kEff: 1.0,
    alarm: 'O', rState: 'kritisch', stab: 0, hStress: 0,
    oLeft: 0, nOut: 999, _outageFired: false, _dieselActivatedInTime: false,
    _xenon: 0, _xenoStable: false, _lastRods: 62, _lastTemp: 445,
    log: [], lcd: {}, rodWear: null
  };
  if (sc && sc.setup) sc.setup(S);
  return S;
}

function sLoadScenario(idx) {
  sCurrentScenario = idx;
  S2 = mkS2(idx);
  $('sRodSl').value = S2.rods; $('sPumpSl').value = S2.pump;
  $('sRodSl').disabled = S2.scram;
  const sc = SCENARIOS[idx];
  $('sScramBtn').style.display = sc.showScram ? '' : 'none';
  $('sDieselBtn').style.display = sc.showDiesel ? '' : 'none';
  $('sStartupWrap').style.display = S2.scram ? 'block' : 'none';
  S2.log = []; $('slw').innerHTML = ''; $('slcnt').textContent = '0';
  sLog(`${sc.title}: ${sc.goal}`, 'safe');
  if (sc.id === 'stromausfall') setTimeout(() => {
    if (S2 && sCurrentScenario === idx && !S2._outageFired) {
      S2.extP = false; S2._outageFired = true;
      sLog('⚡ STROMAUSFALL! Notstrom aktivieren!', 'danger'); sndScram();
    }
  }, 6000);
  sRenderScenarios();
}

function sPhysics(dt) {
  const S = S2;
  if (sCurrentScenario === 2 && S.diesel && !S._dieselActivatedInTime && S.temp < 900) {
    S._dieselActivatedInTime = true;
  }
  if (sCurrentScenario === 4) {
    if (!S._xenon) S._xenon = 35;
    S._xenon = Math.min(75, S._xenon + 0.04 * dt);
    if (S.stab >= 10) S._xenoStable = true;
  }

  const rOut = S.scram || S.startupMode ? (S.startupMode ? S.startupProg * .85 : 0.02) : 1 - S.rods / 100;
  const doppler = Math.max(0, S.temp - 650) / 2200;
  const xenoEff = sCurrentScenario === 4 ? (S._xenon / 100) * .22 : 0;
  S.kEff = clamp(S.scram ? .12 : (S.startupMode ? .12 + rOut * .88 : 0.77 + rOut * .58 - doppler - xenoEff), 0.05, 1.28);

  S.neu = clamp(S.neu + S.neu * (S.kEff - 1) * .18 + (S.scram ? .02 : Math.max(0, .35 - S.neu * .05)), .2, 280);
  S.fis = clamp(S.neu * (.5 + rOut * .9), 0, 260);
  const aP = S.fis * .68; S.pow = clamp(aP, 0, 150);
  S.dHeat = clamp(S.dHeat * (S.scram ? .988 : .998) + aP * .012, 3, 95);
  const pf = S.extP ? 1 : S.diesel ? .74 : .18;
  S.cool = clamp(S.pump * pf, 0, 100);
  const hIn = aP * 1.08 + S.dHeat * .88, nL = (S.temp - 300) * .005;
  S._lastTemp = S.temp;
  S.temp = clamp(S.temp + ((hIn * .09) - (S.cool * .14) - nL) * dt, 250, 1700);
  S.pres = clamp(104 + Math.max(0, S.temp - 300) * .135 + S.pow * .28 - S.cool * .12, 80, 260);
  const stb = S.rState === 'kritisch' && S.temp >= 380 && S.temp <= 730 && S.cool >= 42;
  S.stab = stb ? S.stab + dt : Math.max(0, S.stab - dt * .35);
  if (S.temp > 1350) S.hStress += dt * 4;
  else if (S.temp > 1180) { const ex = (S.temp - 1180) / 70, cd = Math.max(0, 60 - S.cool) / 25; S.hStress += dt * (2 + ex + cd); }
  else S.hStress = Math.max(0, S.hStress - dt);
  if (S.melt) S.rState = 'KERNSCHMELZE';
  else if (S.startupMode) S.rState = 'HOCHFAHREN';
  else if (S.scram) S.rState = 'SCRAM';
  else if (S.kEff < .97 || S.pow < 28) S.rState = 'unterkritisch';
  else if (S.kEff <= 1.03 && S.pow <= 78) S.rState = 'kritisch';
  else S.rState = 'überkritisch';
  if (S.temp > 980 || (!S.extP && !S.diesel)) S.alarm = 'C';
  else if (S.temp > 740 || !S.extP) S.alarm = 'W';
  else if (S.scram || S.startupMode) S.alarm = 'S';
  else S.alarm = 'O';
  if (S.hStress >= 5 && !S.melt) { S.melt = true; S.alarm = 'M'; sLog('💥 Kernschmelze! Kühlung war zu schwach.', 'danger'); sndMeltdown(); }
  if (S.startupMode) {
    if (S.temp > 380) S.startupProg = Math.max(0, S.startupProg - .04 * dt);
    else S.startupProg = clamp(S.startupProg + .06 * dt, 0, 1);
    if (S.startupProg >= 1) { S.startupMode = false; S.scram = false; S.rods = 35; $('sRodSl').value = 35; $('sRodSl').disabled = false; sLog('Reaktor neugestartet.', 'safe'); }
  }
}

function sRenderUI() {
  const S = S2; if (!S) return;
  eUpdParts(.2, { ...S, rodWear: [100, 100, 100, 100, 100, 100], xe: 0, bor: 0, fis: S.fis, neu: S.neu, time: S.time, temp: S.temp, pres: S.pres, pow: S.pow }, sParts, sPulses);
  eDrawCore({ ...S, rodWear: [100, 100, 100, 100, 100, 100], xe: 0, bor: 0, startupProg: S.startupProg || 0 }, sCanvas, sCtx, sParts, sPulses);
  $('hTime').textContent = fmt(S.time);
  const tC = S.temp < 650 ? 'g' : S.temp < 980 ? 'y' : 'r';
  const hT = $('hTemp'); hT.textContent = `${Math.round(S.temp)}°C`; hT.className = `hv ${tC}`;
  $('hPres').textContent = `${Math.round(S.pres)}bar`; $('hPow').textContent = `${Math.round(clamp(S.pow, 0, 100))}%`;
  $('hXeWrap').style.display = 'none';
  const aD = { O: ['ao', '◆ NORMAL'], W: ['aw', '⚠ WARNUNG'], C: ['ac', '⚠ KRITISCH'], S: ['as', '◉ SCRAM'], M: ['am', '🔴 KERNSCHMELZE'] }[S.alarm];
  $('abanner').className = aD[0]; $('abanner').textContent = aD[1];
  $('sStateLabel').textContent = S.rState.toUpperCase();
  $('sStateLabel').style.color = { kritisch: 'var(--g)', unterkritisch: 'var(--y)', 'überkritisch': 'var(--r)', SCRAM: 'var(--c)', HOCHFAHREN: 'var(--g)', KERNSCHMELZE: 'var(--o)' }[S.rState] || 'var(--g)';
  $('sTempBig').textContent = `${Math.round(S.temp)}°C`; $('sTempBig').style.color = `var(--${tC})`;
  $('sKeffBig').textContent = S.kEff.toFixed(2); $('sKeffBig').style.color = S.kEff < .97 ? 'var(--y)' : S.kEff > 1.03 ? 'var(--r)' : 'var(--g)';
  $('sCoolBig').textContent = `${Math.round(S.cool)}%`; $('sCoolBig').style.color = S.cool < 35 ? 'var(--r)' : S.cool < 55 ? 'var(--y)' : 'var(--c)';
  $('sRodVal').textContent = `${Math.round(S.rods)}%`; $('sPumpVal').textContent = `${Math.round(S.pump)}%`;
  const er = $('sRodFx');
  if (S.scram) { er.textContent = 'SCRAM – Stäbe voll eingefahren. Kettenreaktion gestoppt.'; er.className = 'fx ok'; }
  else if (S.rods > 70) { er.textContent = `Tief eingefahren (${Math.round(S.rods)}%) → viel Absorption → Leistung sinkt`; er.className = 'fx ok'; }
  else if (S.rods < 40) { er.textContent = `Weit ausgefahren (${Math.round(S.rods)}%) → wenig Absorption → Leistung steigt!`; er.className = 'fx warn'; }
  else { er.textContent = `Mittel (${Math.round(S.rods)}%) → Reaktion ausgeglichen`; er.className = 'fx'; }
  const ep = $('sPumpFx');
  if (!S.extP && !S.diesel) { ep.textContent = 'Kein Strom! Pumpe fast wirkungslos – Notstrom aktivieren!'; ep.className = 'fx crit'; }
  else if (S.pump > 70) { ep.textContent = `Starke Kühlung (${Math.round(S.pump)}%) → Temperatur sinkt`; ep.className = 'fx ok'; }
  else if (S.pump < 35) { ep.textContent = `Schwache Kühlung (${Math.round(S.pump)}%) → Temperatur steigt`; ep.className = 'fx warn'; }
  else { ep.textContent = `Kühlung (${Math.round(S.pump)}%) → ausgewogen`; ep.className = 'fx'; }
  const sc = SCENARIOS[sCurrentScenario];
  $('sScramBtn').style.display = sc && sc.showScram ? '' : 'none';
  $('sDieselBtn').style.display = sc && sc.showDiesel ? '' : 'none';
  $('sStartupWrap').style.display = (S.scram && sc && sc.showStartup) ? 'block' : 'none';
  $('sStartupBtn').disabled = S.temp > 380 || S.dHeat > 28;
  sCausalChain(S);
  sCheckScenario(S);
  $('mflash').classList.toggle('on', S.alarm === 'M' || S.alarm === 'C');
  tickAudio(S.alarm);
}

function sCausalChain(S) {
  const goingIn = S.rods > (S._lastRods || 60) + 2;
  const goingOut = S.rods < (S._lastRods || 60) - 2;
  const tempHigh = S.temp > 700;
  const tempRising = S.temp > (S._lastTemp || 445) + 0.5;
  const tempFalling = S.temp < (S._lastTemp || 445) - 0.5;

  const lit = goingIn || (S.rods > 65 && tempFalling && !S.scram);
  const hot = tempHigh && !S.scram;
  ['cn_rods', 'ca1', 'cn_abs', 'ca2', 'cn_neu', 'ca3', 'cn_keff', 'ca4', 'cn_pow', 'ca5', 'cn_temp'].forEach(id => {
    const el = $(id); if (!el) return;
    el.classList.toggle('lit', lit && !hot); el.classList.toggle('hot', hot);
  });
  const txt = $('causalText');
  if (S.melt) { txt.textContent = '⛔ Kernschmelze: Kühlung war zu lange unzureichend.'; return; }
  if (S.scram) { txt.textContent = '◉ SCRAM: Alle Stäbe voll eingefahren → Kettenreaktion gestoppt. Aber: Restwärme der Spaltprodukte bleibt bestehen!'; return; }
  if (!S.extP && !S.diesel) { txt.textContent = '⚡ Stromausfall: Kühlpumpen laufen fast nicht mehr. Ohne Kühlung steigt die Temperatur auch ohne aktive Kettenreaktion!'; return; }
  if (S.temp > 850) { txt.textContent = '🔴 Kritische Überhitzung! Steuerstäbe einfahren UND Pumpenleistung erhöhen. Beide Maßnahmen zusammen senken die Temperatur am schnellsten.'; return; }
  if (S.rState === 'überkritisch') { txt.textContent = '↑ Reaktion überkritisch: kEff > 1 → Kettenreaktion verstärkt sich → Stäbe einfahren!'; return; }
  if (S.rState === 'unterkritisch') { txt.textContent = '↓ Reaktion unterkritisch: kEff < 1 → Leistung sinkt → Stäbe vorsichtig ausfahren wenn mehr Leistung nötig.'; return; }
  if (goingIn) { txt.textContent = 'Steuerstäbe einfahren ↑ → Absorption↑ → kEff↓ → Spaltrate↓ → Wärme↓ → Temp↓'; return; }
  if (goingOut) { txt.textContent = 'Steuerstäbe ausfahren ↓ → Absorption↓ → kEff↑ → Kettenreaktion stärker → Temp↑'; return; }
  if (tempRising && !S.scram) { txt.textContent = '📈 Temperatur steigt – mehr Kühlung oder Stäbe einfahren.'; return; }
  if (tempFalling && !S.scram) { txt.textContent = '📉 Temperatur sinkt – Reaktion wird langsamer. Kühlung und Stäbe im Gleichgewicht.'; return; }
  txt.textContent = S.stab > 5 ? '✓ Reaktor stabil. Kleiner Eingriff: beobachte die Kettenreaktion.' : 'Beobachte: Welche Werte ändern sich zuerst?';
}

function sCheckScenario(S) {
  if (sCurrentScenario >= SCENARIOS.length || sScenarioDone[sCurrentScenario]) return;
  const sc = SCENARIOS[sCurrentScenario];
  if (sc.check(S)) {
    sScenarioDone[sCurrentScenario] = true;
    sLog('✓ Szenario abgeschlossen!', 'safe');
    sLog(`💡 ${sc.learn}`, 'info');
    sRenderScenarios();
    if (sCurrentScenario < SCENARIOS.length - 1) {
      const next = sCurrentScenario + 1;
      setTimeout(() => {
        if (!sScenarioDone[next]) { sCurrentScenario = next; sLog(`▶ Nächstes Szenario: ${SCENARIOS[next].title}`, 'safe'); sLoadScenario(next); }
      }, 4000);
    }
  }
}

function sRenderScenarios() {
  const list = $('scenList'); list.innerHTML = '';
  SCENARIOS.forEach((sc, i) => {
    const active = i === sCurrentScenario, done = sScenarioDone[i];
    const locked = !done && i > sCurrentScenario && !sScenarioDone[i - 1] && i > 0;
    const d = document.createElement('div');
    d.className = 'scen' + (active ? ' active' : '');
    if (locked) d.style.opacity = '.45';
    const badge = done ? '<span class="scen-badge done">✓ Geschafft</span>' : active ? '<span class="scen-badge active">▶ Läuft</span>' : '<span class="scen-badge locked">○ Ausstehend</span>';
    const goal = active ? `<div class="scen-desc" style="color:var(--y);margin-top:3px">Ziel: ${sc.goal}</div>` : '';
    const hint = active ? `<div class="scen-desc" style="color:rgba(0,212,255,.7);margin-top:3px">${sc.hint}</div>` : '';
    const learnText = done ? `<div class="scen-desc" style="color:rgba(57,255,138,.75);margin-top:3px;font-style:italic">${sc.learn}</div>` : '';
    d.innerHTML = `<div class="scen-title">${sc.title}</div><div class="scen-desc">${sc.desc}</div>${goal}${hint}${learnText}${badge}`;
    if (!locked) { d.style.cursor = 'pointer'; d.onclick = () => { if (done || i <= sCurrentScenario) { sCurrentScenario = i; sLoadScenario(i); } }; }
    list.appendChild(d);
  });
  const sc = SCENARIOS[sCurrentScenario];
  $('sStartupWrap').style.display = (S2 && S2.scram && sc && sc.showStartup) ? 'block' : 'none';
}

function sLog(msg, level = 'info') {
  if (!S2) return;
  S2.log.unshift({ t: fmt(S2.time), msg, level }); S2.log = S2.log.slice(0, 14);
  $('slw').innerHTML = S2.log.map(e => `<div class="ll ${e.level}"><span class="lt">${e.t}</span>${e.msg}</div>`).join('');
  $('slcnt').textContent = S2.log.length;
}

function sStartGame() {
  sScenarioDone = [false, false, false, false, false];
  initA(); lastTone = 0;
  if (sTick) clearInterval(sTick);
  sTick = setInterval(() => { if (!S2) return; S2.time += .2; sPhysics(.2); sRenderUI(); }, 200);
  sLoadScenario(0);
}

// ── SCHÜLER EVENTS ────────────────────────────────────────
let slrS = 0, slpS = 0;
$('sRodSl').addEventListener('input', e => {
  if (!S2) return; S2._lastRods = S2.rods; S2.rods = +e.target.value; $('sRodVal').textContent = `${Math.round(S2.rods)}%`;
  const n = Date.now(); if (n - slrS > 110) { slrS = n; initA(); S2.rods > S2._lastRods ? sndRodsIn() : sndRodsOut(); }
});
$('sPumpSl').addEventListener('input', e => {
  if (!S2) return; const pv = S2.pump; S2.pump = +e.target.value; $('sPumpVal').textContent = `${Math.round(S2.pump)}%`;
  const n = Date.now(); if (n - slpS > 140) { slpS = n; initA(); S2.pump > pv ? sndPumpUp() : sndPumpDown(); }
});
$('sScramBtn').addEventListener('click', () => {
  initA(); if (!S2 || S2.scram || S2.melt) return;
  S2.scram = true; S2.rods = 100; $('sRodSl').value = 100; $('sRodSl').disabled = true;
  sndScram(); sLog('SCRAM! Stäbe voll eingefahren. Restwärme bleibt!', 'warning');
});
$('sStartupBtn').addEventListener('click', () => {
  initA(); if (!S2 || !S2.scram || S2.startupMode || S2.melt) return;
  if (S2.temp > 380) { sLog('Temp noch zu hoch – kühlen bis <380°C.', 'warning'); return; }
  S2.startupMode = true; S2.startupProg = 0; sndStartup();
  $('sRodSl').disabled = true; sLog('Hochfahren gestartet.', 'safe');
});
$('sDieselBtn').addEventListener('click', () => {
  initA(); if (!S2) return; S2.diesel = !S2.diesel;
  S2.diesel ? sndDieselOn() : sndDieselOff();
  sLog(S2.diesel ? 'Notstrom aktiviert.' : 'Notstrom deaktiviert.', S2.diesel ? 'safe' : 'info');
});
$('sRestartBtn').addEventListener('click', sStartGame);
$('sSoundBtn').addEventListener('click', () => { initA(); sOn = !sOn; $('sSoundBtn').textContent = `${sOn ? '🔊' : '🔇'} Ton: ${sOn ? 'AN' : 'AUS'}`; });

// ── MODUS-WECHSEL ─────────────────────────────────────────
function showSchueler() {
  currentMode = 'schueler';
  $('schuelerApp').style.display = 'flex'; $('experteApp').style.display = 'none';
  $('modeSwitchBtn').textContent = '→ Expertenmodus'; $('modeSwitchBtn').className = 'modebadge bc';
  $('modeOvl').hidden = true;
  document.body.classList.remove('exp-grid-loss', 'exp-coolant-stress', 'exp-critical', 'exp-pressure-hit', 'exp-blackout');
  if (!S2) sStartGame();
}
function showExperte() {
  currentMode = 'experte';
  $('schuelerApp').style.display = 'none'; $('experteApp').style.display = 'flex';
  $('modeSwitchBtn').textContent = '→ Schülermodus'; $('modeSwitchBtn').className = 'modebadge bg';
  $('modeOvl').hidden = true;
  eUpdateStartOverlay();
  $('eStartOvl').hidden = false;
}
$('chooseSchueler').addEventListener('click', showSchueler);
$('chooseExperte').addEventListener('click', showExperte);
$('modeSwitchBtn').addEventListener('click', () => {
  initA();
  if (currentMode === 'schueler') showExperte();
  else { $('modeOvl').hidden = true; showSchueler(); }
});

// ── TASTATURKÜRZEL ────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.target.tagName === 'INPUT') return;
  if (currentMode === 'experte' && E && E.run && !E.melt) {
    if (e.code === 'Space') { e.preventDefault(); $('eScramBtn').click(); }
    if (e.key === 'd' || e.key === 'D') $('eDieselBtn').click();
    if (e.key === 'r' || e.key === 'R') $('eRestartBtn').click();
  }
  if (currentMode === 'schueler' && S2) {
    if (e.code === 'Space') { e.preventDefault(); if ($('sScramBtn').style.display !== 'none') $('sScramBtn').click(); }
    if (e.key === 'd' || e.key === 'D') { if ($('sDieselBtn').style.display !== 'none') $('sDieselBtn').click(); }
  }
});
