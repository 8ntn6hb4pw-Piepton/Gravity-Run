const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const gameStageEl = document.getElementById("gameStage");
const gameShellEl = document.querySelector(".game-shell");

const startScreenEl = document.getElementById("startScreen");
const startButtonEl = document.getElementById("startButton");
const touchControlsEl = document.getElementById("touchControls");
const driveFieldEl = document.getElementById("driveField");
const driveThumbEl = document.getElementById("driveThumb");
const suctionControlEl = document.getElementById("suctionControl");
const suctionCoreEl = document.getElementById("suctionCore");
const suctionPullEl = document.getElementById("suctionPull");

let audioContext = null;
let audioUnlocked = false;

const mobileTouchState = {
  drivePointerId: null,
  driveValue: 0,
  suctionPointerId: null,
  suctionStartY: 0,
  suctionPressTriggered: false,
  suctionPull: 0,
};

const world = {
  width: canvas.width,
  height: canvas.height,
  floorY: canvas.height - 110,
  gravity: 0.28,
  drag: 0.992,
  keys: Object.create(null),
  cubes: 0,
  cargoCapacity: 6,
  particles: [],
  trashHeaps: [],
  exhaustParticles: [],
  activeCubes: [],
  spaceCubes: [],
  pressQueue: [],
  cranes: [],
  frame: 0,
  level: 1,
  gameOver: false,
  started: false,
  maxLoadY: Math.round((canvas.height - 110) * 0.68),
  spawnTimer: 420,
  spawnPauseTimer: 0,
  spawnRollTimer: 120,
  flow: {
    phase: "steady",
    timer: 300,
  },
  controlLampRed: false,
  zeroGTimer: 0,
  zeroGCooldown: 480,
  fuel: 100,
  porthole: {
    x: canvas.width * 0.5 - 162,
    y: canvas.height * 0.2,
    w: 324,
    h: 180,
  },
  starfield: {
    stars: Array.from({ length: 34 }, (_, i) => ({
      x: ((i * 37) % 150) - 75,
      y: ((i * 19) % 112) - 56,
      size: i % 7 === 0 ? 2.2 : i % 3 === 0 ? 1.4 : 0.9,
      speed: i % 7 === 0 ? 0.05 : i % 3 === 0 ? 0.1 : 0.18,
      depth: i % 7 === 0 ? "far" : i % 3 === 0 ? "mid" : "near",
    })),
  },
  spaceTraffic: [],
  spaceTrafficTimer: 260,
  ship: {
    thrustTimer: 0,
    thrustCooldown: 240,
    accel: 0,
    tilt: 0,
    tiltVelocity: 0,
    shakeTimer: 0,
  },
  levelBurstTimer: 0,
  powerupSpawnTimer: 720,
  powerupSignalTimer: 0,
  combo: {
    count: 0,
    timer: 0,
  },
  upgradePoints: 0,
  upgradeDrops: [],
  upgradeButtons: [],
  upgrades: {
    tank: false,
    vacuum: false,
    drive: false,
    autoPress: false,
    helper: false,
    press: false,
  },
  upgradeTimers: {
    tank: 0,
    vacuum: 0,
    drive: 0,
    autoPress: 0,
    helper: 0,
    press: 0,
  },
  maintenance: {
    active: false,
    phase: "idle",
    timer: 0,
    blink: 0,
    partsNeeded: 0,
    missingParts: [],
    cooldown: 0,
  },
  refuel: {
    active: false,
    phase: "idle",
    y: -120,
    timer: 0,
  },
  firebot: {
    active: false,
    phase: "idle",
    x: 0,
    y: -120,
    targetId: null,
    timer: 0,
  },
  refillPipe: {
    active: false,
    phase: "idle",
    x: 172,
    y: -120,
    targetY: 54,
    timer: 0,
    spawned: false,
  },
  sound: {
    suctionFrame: 0,
  },
  repairParts: [],
  helperBot: {
    active: false,
    phase: "idle",
    x: canvas.width * 0.72,
    y: canvas.height - 152,
    vx: 0,
    targetX: canvas.width * 0.72,
    targetId: null,
    direction: -1,
    intakePulse: 0,
    craneX: canvas.width + 120,
    hookY: -120,
    breakTimer: 0,
    collected: 0,
  },
  helperBotWing: {
    active: false,
    phase: "idle",
    x: canvas.width * 0.62,
    y: canvas.height - 152,
    vx: 0,
    targetX: canvas.width * 0.62,
    targetId: null,
    direction: -1,
    intakePulse: 0,
    craneX: canvas.width + 200,
    hookY: -120,
    breakTimer: 0,
    collected: 0,
  },
  loadTop: canvas.height - 110,
  loadRatio: 0,
  overflowFrames: 0,
  loadHoldTimer: 0,
  intro: {
    active: false,
    phase: "idle",
    timer: 0,
    hookY: -150,
    frontX: 0,
    rearX: 0,
  },
  endSequence: {
    active: false,
    phase: "idle",
    timer: 0,
    pieces: [],
  },
  cubeVacuum: {
    active: false,
    x: canvas.width - 124,
    y: 82,
    sweepSpeed: 0,
    cooldown: 0,
  },
  powerupNotice: {
    text: "",
    timer: 0,
    color: "#9feaff",
  },
};

const robot = {
  x: 260,
  y: world.floorY - 54,
  width: 122,
  height: 74,
  velocityX: 0,
  direction: 1,
  facing: 1,
  cargo: [],
  intakeReach: 68,
  processState: "collecting",
  processTimer: 0,
  rearHatchOpen: false,
  intakePulse: 0,
  intakeExtension: 0,
  frontCompression: 0,
  blinkTimer: 0,
  blinkCooldown: 140,
  floatOffset: 0,
  floatVelocity: 0,
  floatRotation: 0,
  sway: 0,
  swayVelocity: 0,
};

const UPGRADE_DEFS = [
  {
    key: "tank",
    shortLabel: "TANK",
    name: "Tank-Boost",
    description: "Doppelte Ladung, 2 Wuerfel",
    cost: 12,
    accent: "#8fd9ff",
  },
  {
    key: "vacuum",
    shortLabel: "VAC",
    name: "Turbo-Vac",
    description: "Mehr Zug, rote Augen",
    cost: 26,
    accent: "#ff8f8f",
  },
  {
    key: "drive",
    shortLabel: "DRV",
    name: "Overdrive",
    description: "Mehr Tempo, Heckspoiler",
    cost: 44,
    accent: "#ffd47a",
  },
  {
    key: "autoPress",
    shortLabel: "AUTO",
    name: "Auto-Press",
    description: "Volle Tanks pressen selbst",
    cost: 54,
    accent: "#b7ff93",
  },
  {
    key: "helper",
    shortLabel: "BOT",
    name: "Buddy-Bot",
    description: "Kran liefert Helfer fuer 60s",
    cost: 64,
    accent: "#9de7ff",
  },
  {
    key: "press",
    shortLabel: "PRS",
    name: "Turbo Press",
    description: "0,05s Presszeit, tiefblau",
    cost: 66,
    accent: "#7fb9ff",
  },
];

const glitchCipher = {
  mask: 17,
  buffer: "",
  actions: [
    { code: [70, 93, 82, 95], type: "points" },
    { code: [85, 67, 94, 65], type: "drops" },
    { code: [80, 93, 93], type: "all" },
  ],
};

const POWERUP_TIER_THRESHOLDS = [1, 3, 5, 7, 9];
const POWERUP_MAX_TIERS = {
  tank: 4,
  vacuum: 4,
  drive: 4,
  autoPress: 4,
  helper: 5,
  press: 4,
};

const POWERUP_FLOW = {
  tank: {
    minLevel: 1,
    minLoad: 0.16,
    minTrash: 12,
    minCubes: 0,
    baseWeight: 4.4,
  },
  vacuum: {
    minLevel: 2,
    minLoad: 0.24,
    minTrash: 18,
    minCubes: 0,
    baseWeight: 4,
  },
  drive: {
    minLevel: 3,
    minLoad: 0.32,
    minTrash: 22,
    minCubes: 0,
    baseWeight: 3.5,
  },
  press: {
    minLevel: 4,
    minLoad: 0.38,
    minTrash: 26,
    minCubes: 1,
    baseWeight: 3.3,
  },
  autoPress: {
    minLevel: 5,
    minLoad: 0.46,
    minTrash: 30,
    minCubes: 2,
    baseWeight: 2.8,
  },
  helper: {
    minLevel: 6,
    minLoad: 0.56,
    minTrash: 40,
    minCubes: 4,
    baseWeight: 2.1,
  },
};

const trashTypes = [
  {
    type: "bottle",
    fill: "#6fc7cf",
    stroke: "#2e6f76",
    radius: [8, 12],
  },
  {
    type: "glassBottle",
    fill: "#a5d7b3",
    stroke: "#53745f",
    radius: [8, 12],
  },
  {
    type: "cup",
    fill: "#f2f0df",
    stroke: "#93896e",
    radius: [9, 13],
  },
  {
    type: "appleCore",
    fill: "#c7da7a",
    stroke: "#637126",
    radius: [8, 11],
  },
  {
    type: "barrel",
    fill: "#92d94f",
    stroke: "#446327",
    radius: [10, 14],
  },
  {
    type: "lamp",
    fill: "#f3cf6a",
    stroke: "#866a2a",
    radius: [9, 13],
  },
  {
    type: "tire",
    fill: "#4a5258",
    stroke: "#1f2529",
    radius: [11, 15],
  },
  {
    type: "bigTire",
    fill: "#5b6166",
    stroke: "#202629",
    radius: [14, 19],
  },
  {
    type: "box",
    fill: "#d58a61",
    stroke: "#784730",
    radius: [8, 12],
  },
  {
    type: "paper",
    fill: "#e9e0c8",
    stroke: "#9d8e6d",
    radius: [8, 12],
  },
  {
    type: "can",
    fill: "#c881d2",
    stroke: "#6e3f74",
    radius: [8, 11],
  },
  {
    type: "tinCan",
    fill: "#b2bcc4",
    stroke: "#5d6670",
    radius: [8, 11],
  },
  {
    type: "cap",
    fill: "#ff6760",
    stroke: "#8b2e28",
    radius: [4, 6],
  },
  {
    type: "lid",
    fill: "#ffd166",
    stroke: "#8b6820",
    radius: [5, 7],
  },
  {
    type: "shard",
    fill: "#b4eff7",
    stroke: "#5a8f96",
    radius: [4, 7],
  },
  {
    type: "crumb",
    fill: "#9f8f7a",
    stroke: "#5e5143",
    radius: [3, 5],
  },
  {
    type: "laptop",
    fill: "#8c98a7",
    stroke: "#3e4751",
    radius: [10, 14],
  },
  {
    type: "phone",
    fill: "#44515c",
    stroke: "#171d22",
    radius: [7, 10],
  },
  {
    type: "computer",
    fill: "#b8c7d6",
    stroke: "#4f5f6f",
    radius: [11, 15],
  },
  {
    type: "duck",
    fill: "#f3d84f",
    stroke: "#8b6c1c",
    radius: [8, 12],
  },
  {
    type: "pool",
    fill: "#64c8f2",
    stroke: "#2f6f8e",
    radius: [14, 19],
  },
  {
    type: "swimRing",
    fill: "#ff9d5b",
    stroke: "#8a4d20",
    radius: [10, 15],
  },
  {
    type: "microchip",
    fill: "#3d4f46",
    stroke: "#121816",
    radius: [6, 9],
  },
  {
    type: "tissue",
    fill: "#f1f1ec",
    stroke: "#b9b7ae",
    radius: [7, 11],
  },
  {
    type: "milkJug",
    fill: "#d9eef6",
    stroke: "#6f8793",
    radius: [10, 14],
  },
  {
    type: "detergent",
    fill: "#f06f63",
    stroke: "#81332d",
    radius: [9, 13],
  },
  {
    type: "magazine",
    fill: "#e45476",
    stroke: "#7a2640",
    radius: [8, 12],
  },
  {
    type: "newspaper",
    fill: "#d8ddd7",
    stroke: "#7d8780",
    radius: [8, 12],
  },
  {
    type: "envelope",
    fill: "#efe6d4",
    stroke: "#8b7d66",
    radius: [7, 10],
  },
  {
    type: "bag",
    fill: "#f4f4ee",
    stroke: "#a4a39b",
    radius: [8, 12],
  },
  {
    type: "tray",
    fill: "#c7d6dd",
    stroke: "#62727c",
    radius: [8, 12],
  },
  {
    type: "wrapper",
    fill: "#91b7ff",
    stroke: "#405e90",
    radius: [6, 9],
  },
  {
    type: "shoe",
    fill: "#7e95aa",
    stroke: "#3f5263",
    radius: [9, 13],
  },
  {
    type: "sock",
    fill: "#f1f3ef",
    stroke: "#a0a8a3",
    radius: [7, 11],
  },
  {
    type: "gear",
    fill: "#8f9aa3",
    stroke: "#4d5961",
    radius: [8, 12],
  },
  {
    type: "circuitBoard",
    fill: "#3b8b62",
    stroke: "#1f4f37",
    radius: [9, 13],
  },
  {
    type: "brakeDisc",
    fill: "#9ca5ad",
    stroke: "#50585f",
    radius: [10, 14],
  },
  {
    type: "piston",
    fill: "#aeb6be",
    stroke: "#5e6870",
    radius: [9, 13],
  },
  {
    type: "bearing",
    fill: "#b7c0c8",
    stroke: "#64707a",
    radius: [8, 12],
  },
  {
    type: "bolt",
    fill: "#9ea6ac",
    stroke: "#566067",
    radius: [7, 11],
  },
  {
    type: "bananaPeel",
    fill: "#f0d65d",
    stroke: "#8d6f1a",
    radius: [9, 13],
  },
  {
    type: "apple",
    fill: "#de5b4d",
    stroke: "#7f2a21",
    radius: [8, 12],
  },
  {
    type: "veggie",
    fill: "#72ba5b",
    stroke: "#3e6f2f",
    radius: [8, 12],
  },
  {
    type: "saladLeaf",
    fill: "#8fcd68",
    stroke: "#4f7d34",
    radius: [7, 11],
  },
  {
    type: "moldBread",
    fill: "#dbc39d",
    stroke: "#82674a",
    radius: [9, 13],
  },
  {
    type: "paperCup",
    fill: "#ede5d5",
    stroke: "#8f7d65",
    radius: [8, 12],
  },
  {
    type: "plasticCutlery",
    fill: "#eef2f2",
    stroke: "#98a4a6",
    radius: [7, 10],
  },
  {
    type: "plate",
    fill: "#f1f3ef",
    stroke: "#a7b0aa",
    radius: [10, 14],
  },
  {
    type: "glass",
    fill: "#b9eef3",
    stroke: "#5e8f97",
    radius: [8, 12],
  },
  {
    type: "pasta",
    fill: "#f0c45a",
    stroke: "#a46f1d",
    radius: [7, 11],
  },
  {
    type: "pot",
    fill: "#8e989f",
    stroke: "#50585f",
    radius: [10, 14],
  },
  {
    type: "pan",
    fill: "#6f7880",
    stroke: "#3b4247",
    radius: [10, 14],
  },
  {
    type: "toothbrush",
    fill: "#ff8ea1",
    stroke: "#944458",
    radius: [7, 10],
  },
];

const trashTypeLookup = Object.fromEntries(trashTypes.map((style) => [style.type, style]));
const scrapHeavyTypes = [
  "gear",
  "circuitBoard",
  "microchip",
  "computer",
  "laptop",
  "phone",
  "brakeDisc",
  "piston",
  "bearing",
  "bolt",
];

const trashWaveFamilies = [
  {
    key: "plastic",
    weight: 1,
    types: ["bottle", "cup", "barrel", "milkJug", "detergent", "duck", "pool", "swimRing", "bag", "tray", "wrapper", "cap", "lid", "toothbrush", "plasticCutlery"],
  },
  {
    key: "paper",
    weight: 0.8,
    types: ["box", "paper", "magazine", "newspaper", "envelope", "tissue", "paperCup"],
  },
  {
    key: "metal-tech",
    weight: 1.9,
    types: ["can", "tinCan", "lamp", "gear", "circuitBoard", "laptop", "phone", "computer", "microchip", "bearing", "bolt"],
  },
  {
    key: "auto-metal",
    weight: 1.7,
    types: ["tire", "bigTire", "brakeDisc", "piston", "bearing", "bolt", "gear", "lamp"],
  },
  {
    key: "glass",
    weight: 0.6,
    types: ["glassBottle", "shard"],
  },
  {
    key: "rubber-textile",
    weight: 0.9,
    types: ["tire", "bigTire", "shoe", "sock"],
  },
  {
    key: "bio",
    weight: 0.9,
    types: ["appleCore", "apple", "bananaPeel", "veggie", "saladLeaf", "moldBread", "crumb", "pasta"],
  },
  {
    key: "kitchen",
    weight: 1.15,
    types: ["paperCup", "plasticCutlery", "plate", "glass", "pasta", "pot", "pan", "cup"],
  },
]
  .map((family) => ({
    ...family,
    styles: family.types.map((type) => trashTypeLookup[type]).filter(Boolean),
  }))
  .filter((family) => family.styles.length > 0);

function pickRandomTrashStyle(excludedTypes = [], preferredTypes = null) {
  const excluded = new Set(excludedTypes);
  let candidates = preferredTypes
    ? preferredTypes
        .map((type) => trashTypeLookup[type])
        .filter((style) => style && !excluded.has(style.type))
    : [];
  if (candidates.length === 0) {
    candidates = trashTypes.filter((style) => !excluded.has(style.type));
  }
  return candidates[Math.floor(Math.random() * candidates.length)] || trashTypes[0];
}

function pickWeightedTrashFamily() {
  let totalWeight = 0;
  for (const family of trashWaveFamilies) {
    totalWeight += family.weight || 1;
  }
  let roll = Math.random() * totalWeight;
  for (const family of trashWaveFamilies) {
    roll -= family.weight || 1;
    if (roll <= 0) {
      return family;
    }
  }
  return trashWaveFamilies[0];
}

function createTrashWaveProfile(count = 12) {
  const roll = Math.random();
  if (count >= 14 && roll < 0.26) {
    const dominant = Math.random() < 0.62
      ? pickRandomTrashStyle([], scrapHeavyTypes)
      : pickRandomTrashStyle();
    const accents = [
      pickRandomTrashStyle([dominant.type]),
      pickRandomTrashStyle([dominant.type]),
    ];
    return { mode: "dominant-type", dominant, accents };
  }
  if (count >= 12 && roll < 0.74) {
    const family = pickWeightedTrashFamily();
    const accent = pickRandomTrashStyle(family ? family.types : []);
    return { mode: "family", family, accent };
  }
  if (count >= 10 && roll < 0.9) {
    const duoTypes = Math.random() < 0.58 ? scrapHeavyTypes : null;
    const primary = pickRandomTrashStyle([], duoTypes);
    const secondary = pickRandomTrashStyle([primary.type], duoTypes);
    return { mode: "duo", pair: [primary, secondary] };
  }
  return { mode: "mixed" };
}

function pickTrashStyleForWave(profile, index) {
  if (!profile || profile.mode === "mixed") {
    return pickRandomTrashStyle();
  }
  if (profile.mode === "dominant-type") {
    if (index % 7 === 6 && profile.accents[0]) {
      return profile.accents[0];
    }
    if (index % 11 === 8 && profile.accents[1]) {
      return profile.accents[1];
    }
    return Math.random() < 0.82 ? profile.dominant : (profile.accents[Math.floor(Math.random() * profile.accents.length)] || profile.dominant);
  }
  if (profile.mode === "family") {
    if (!profile.family || profile.family.styles.length === 0) {
      return pickRandomTrashStyle();
    }
    if (profile.accent && (index % 9 === 7 || index % 13 === 4)) {
      return profile.accent;
    }
    return profile.family.styles[Math.floor(Math.random() * profile.family.styles.length)];
  }
  if (profile.mode === "duo") {
    return profile.pair[index % profile.pair.length] || profile.pair[0] || pickRandomTrashStyle();
  }
  return pickRandomTrashStyle();
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildSpatialGrid(items, cellSize = 72) {
  const grid = new Map();
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    const cellX = Math.floor(item.x / cellSize);
    const cellY = Math.floor(item.y / cellSize);
    const key = `${cellX},${cellY}`;
    let bucket = grid.get(key);
    if (!bucket) {
      bucket = [];
      grid.set(key, bucket);
    }
    bucket.push(i);
  }
  return grid;
}

function forEachNearbyGridIndex(grid, x, y, cellSize, callback) {
  const cellX = Math.floor(x / cellSize);
  const cellY = Math.floor(y / cellSize);
  for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      const bucket = grid.get(`${cellX + offsetX},${cellY + offsetY}`);
      if (!bucket) {
        continue;
      }
      for (const index of bucket) {
        callback(index);
      }
    }
  }
}

function getRobotRenderTransform() {
  return {
    x: robot.x,
    y: robot.y + robot.floatOffset,
    rotation: robot.floatRotation,
    scaleX: robot.facing * (1 - robot.frontCompression * 0.028),
  };
}

function robotLocalToWorld(localX, localY) {
  const transform = getRobotRenderTransform();
  const scaledX = localX * transform.scaleX;
  const cos = Math.cos(transform.rotation);
  const sin = Math.sin(transform.rotation);

  return {
    x: transform.x + scaledX * cos - localY * sin,
    y: transform.y + scaledX * sin + localY * cos,
  };
}

function getRobotExhaustAnchor() {
  const missingStack = world.maintenance.missingParts.includes("stack");
  const localPoint = robotLocalToWorld(-29, missingStack ? -44 : -58);
  const rotation = robot.floatRotation;

  return {
    x: localPoint.x,
    y: localPoint.y,
    upX: Math.sin(rotation),
    upY: -Math.cos(rotation),
  };
}

function getFlowRelief(pressure = getCurrentPressure()) {
  const recoveryBonus = world.flow.phase === "recovery" ? 0.18 : 0;
  return clamp((pressure - 0.82) / 0.9 + recoveryBonus, 0, 1);
}

function getFlowProfile(phase = world.flow.phase) {
  if (phase === "push") {
    return {
      delayMul: 0.74,
      batchMul: 1.24,
      powerupDelayMul: 0.88,
      powerupBias: 0.08,
      pauseShift: -1,
    };
  }
  if (phase === "recovery") {
    return {
      delayMul: 1.18,
      batchMul: 0.9,
      powerupDelayMul: 0.96,
      powerupBias: 0.12,
      pauseShift: 1,
    };
  }
  return {
    delayMul: 1,
    batchMul: 1,
    powerupDelayMul: 1,
    powerupBias: 0,
    pauseShift: 0,
  };
}

function setFlowPhase(phase, duration = 0) {
  if (world.flow.phase === phase) {
    world.flow.timer = Math.max(world.flow.timer, duration);
    return;
  }

  world.flow.phase = phase;
  world.flow.timer = duration;

  if (phase === "push") {
    world.spawnTimer = Math.min(world.spawnTimer, Math.floor(random(26, 54)));
    showPowerupNotice("MUELLWELLE", "#ffd39b");
    return;
  }

  if (phase === "recovery") {
    world.spawnPauseTimer = Math.max(world.spawnPauseTimer, Math.floor(random(90, 150)));
    world.powerupSpawnTimer = Math.min(world.powerupSpawnTimer, 260);
    showPowerupNotice("LUFTFENSTER", "#9feaff");
  }
}

function updateFlowPhase(pressure = getCurrentPressure()) {
  world.flow.timer -= 1;

  if (world.flow.phase === "push") {
    if (pressure > 1.22 || world.loadRatio > 0.82) {
      setFlowPhase("recovery", Math.floor(random(180, 280)));
      return;
    }
    if (world.flow.timer <= 0) {
      setFlowPhase("steady", Math.floor(random(150, 240)));
    }
    return;
  }

  if (world.flow.phase === "recovery") {
    if (pressure > 1.26 && world.flow.timer < 90) {
      world.flow.timer = 130;
    }
    if (world.flow.timer <= 0) {
      setFlowPhase("steady", Math.floor(random(140, 220)));
    }
    return;
  }

  if (pressure > 1.2 && world.loadRatio > 0.76) {
    setFlowPhase("recovery", Math.floor(random(170, 250)));
    return;
  }

  if (world.flow.timer <= 0) {
    if (pressure < 0.72 && Math.random() < 0.72) {
      setFlowPhase("push", Math.floor(random(210, 360)));
    } else if (pressure >= 1.02 && world.loadRatio > 0.66 && Math.random() < 0.44) {
      setFlowPhase("recovery", Math.floor(random(150, 240)));
    } else if (Math.random() < 0.58) {
      setFlowPhase("push", Math.floor(random(170, 310)));
    } else {
      world.flow.timer = Math.floor(random(120, 210));
    }
  }
}

function randomSpawnDelay(level, pressure = 0) {
  const flow = getFlowProfile();
  const earlyCurve = 1 - Math.exp(-level / 5.8);
  const lateRamp = Math.max(0, level - 10);
  const relief = clamp(pressure, 0, 1);
  const minDelay = Math.round((92 - earlyCurve * 34 - lateRamp * 1.7 + relief * 44) * flow.delayMul);
  const maxDelay = Math.round((148 - earlyCurve * 48 - lateRamp * 2.15 + relief * 58) * flow.delayMul);
  const clampedMin = Math.max(22, minDelay);
  const clampedMax = Math.max(clampedMin + 14, maxDelay);
  return Math.floor(random(clampedMin, clampedMax));
}

function getTrashDropCount(level = world.level) {
  const flow = getFlowProfile();
  const earlyCurve = 1 - Math.exp(-level / 5.4);
  const lateRamp = Math.max(0, level - 6) * 0.52;
  return Math.max(11, Math.round((12 + earlyCurve * 7 + lateRamp) * flow.batchMul));
}

function getEffectiveTrashCount() {
  let heapCount = 0;
  for (const heap of world.trashHeaps) {
    heapCount += heap.members.length;
  }
  return world.particles.length + heapCount;
}

function createHeapMemberSnapshot(item) {
  return {
    trashType: item.trashType,
    color: {
      fill: item.color.fill,
      stroke: item.color.stroke,
    },
    radius: item.radius,
    squish: item.squish,
    rotation: item.rotation,
    spin: item.spin,
  };
}

function rebuildTrashHeap(heap) {
  const count = heap.members.length;
  let radiusSum = 0;
  for (const member of heap.members) {
    radiusSum += member.radius;
  }
  heap.mass = radiusSum;
  heap.width = clamp(26 + radiusSum * 1.18, 34, 112);
  heap.height = clamp(16 + count * 3.2 + radiusSum * 0.2, 18, 64);
  heap.y = world.floorY - heap.height * 0.52;
  heap.patches = heap.members.slice(0, 6).map((member, index) => ({
    fill: member.color.fill,
    stroke: member.color.stroke,
    offsetX: ((index % 3) - 1) * (heap.width * 0.18) + random(-2, 2),
    offsetY: Math.floor(index / 3) * (heap.height * 0.18) + random(-2, 2),
    scale: 0.72 + (index % 3) * 0.1,
    shape: member.trashType,
  }));
}

function spawnParticleFromHeapMember(member, x, y, extraVx = 0, extraVy = 0) {
  world.particles.push({
    id: `heap-trash-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    x: x + random(-10, 10),
    y: y + random(-8, 8),
    vx: random(-0.8, 0.8) + extraVx,
    vy: random(-1.4, -0.2) + extraVy,
    radius: member.radius,
    rotation: member.rotation + random(-0.25, 0.25),
    spin: member.spin + random(-0.02, 0.02),
    squish: member.squish,
    color: {
      fill: member.color.fill,
      stroke: member.color.stroke,
    },
    trashType: member.trashType,
    hazardous: false,
    burning: false,
    firePhase: random(0, Math.PI * 2),
    age: 0,
    settledFrames: 0,
    sleeping: false,
    clumpId: 0,
  });
}

function releaseTrashHeapMembers(heap, count, extraVx = 0, extraVy = 0) {
  const releaseCount = Math.min(count, heap.members.length);
  for (let i = 0; i < releaseCount; i += 1) {
    const member = heap.members.pop();
    spawnParticleFromHeapMember(member, heap.x, heap.y, extraVx, extraVy);
  }
  if (heap.members.length > 0) {
    rebuildTrashHeap(heap);
  }
}

function removeTrashHeapIfEmpty(heap, nextHeaps) {
  if (heap.members.length > 0) {
    nextHeaps.push(heap);
  }
}

function getCurrentPressure() {
  const trashBaseline = Math.max(12, getTrashDropCount() * 1.3);
  const trashRatio = clamp(getEffectiveTrashCount() / trashBaseline, 0, 2.4);
  const cubeRatio = clamp(world.activeCubes.length / 12, 0, 2);
  const cargoRatio = robot.cargo.length / Math.max(1, world.cargoCapacity);
  return world.loadRatio * 0.95 + trashRatio * 0.68 + cubeRatio * 0.42 + cargoRatio * 0.3;
}

function resetTrashRhythm() {
  world.spawnPauseTimer = 0;
  world.spawnRollTimer = 120;
  world.spawnTimer = randomSpawnDelay(world.level, getFlowRelief());
}

function scheduleTrashPause(pressure = getCurrentPressure()) {
  const flow = getFlowProfile();
  const relief = getFlowRelief(pressure);
  world.spawnPauseTimer = Math.floor(
    random(
      120 + relief * 45 + flow.pauseShift * 35,
      240 + relief * 90 + flow.pauseShift * 70
    )
  );
  world.spawnRollTimer = 120;
}

function countAirborneLoadObjects() {
  let airborne = 0;
  for (const item of world.particles) {
    if (
      item.y + item.radius < world.floorY - 18 ||
      Math.abs(item.vy) > 0.34
    ) {
      airborne += 1;
    }
  }
  for (const cube of world.activeCubes) {
    if (cube.attached || cube.ejectedToSpace) {
      continue;
    }
    if (
      cube.y + cube.size * 0.5 < world.floorY - 16 ||
      Math.abs(cube.vy) > 0.32
    ) {
      airborne += 1;
    }
  }
  return airborne;
}

function createRobotBreakPieces() {
  const localPieces = [
    { shape: "wheel", localX: -44, localY: 30, size: 18, side: -1 },
    { shape: "wheel", localX: 32, localY: 30, size: 18, side: 1 },
    { shape: "eye", localX: 28, localY: -48, size: 14, side: 1 },
    { shape: "panel", localX: -2, localY: 0, size: 22, side: -1 },
    { shape: "stack", localX: -30, localY: -50, size: 16, side: -1 },
    { shape: "hatch", localX: -66, localY: 18, size: 18, side: -1 },
    { shape: "lamp", localX: -14, localY: -8, size: 12, side: -1 },
  ];

  return localPieces.map((piece, index) => {
    const anchor = robotLocalToWorld(piece.localX, piece.localY);
    const side = piece.side || (index % 2 === 0 ? -1 : 1);
    return {
      id: `scrap-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 5)}`,
      shape: piece.shape,
      x: anchor.x,
      y: anchor.y,
      size: piece.size,
      rotation: random(-0.4, 0.4),
      spin: random(-0.06, 0.06),
      hookX: clamp(robot.x + side * random(54, 110), 80, world.width - 80),
      targetY: -40 - index * 16,
    };
  });
}

function startIntroSequence() {
  world.intro.active = true;
  world.intro.phase = "approach";
  world.intro.timer = 0;
  robot.x = 260;
  robot.y = -154;
  world.intro.hookY = -170;
  world.intro.frontX = world.width + 150;
  world.intro.rearX = -150;
  robot.velocityX = 0;
  robot.direction = 1;
  robot.facing = 1;
  robot.floatOffset = 0;
  robot.floatVelocity = 0;
  robot.floatRotation = 0;
  robot.sway = 0;
  robot.swayVelocity = 0;
  world.keys[" "] = false;
  world.keys.a = false;
  world.keys.A = false;
  world.keys.d = false;
  world.keys.D = false;
  world.keys.ArrowLeft = false;
  world.keys.ArrowRight = false;
}

function startGameOverSequence() {
  if (world.endSequence.active) {
    return;
  }

  world.gameOver = true;
  world.endSequence.active = true;
  world.endSequence.phase = "smoke";
  world.endSequence.timer = 240;
  world.endSequence.pieces = [];
  robot.processState = "collecting";
  robot.processTimer = 0;
  robot.rearHatchOpen = false;
  world.pressQueue = [];
  world.keys[" "] = false;
  world.keys.a = false;
  world.keys.A = false;
  world.keys.d = false;
  world.keys.D = false;
  world.keys.ArrowLeft = false;
  world.keys.ArrowRight = false;
  showPowerupNotice("BAY OVERLOADED", "#ff8a7f");
  playSound("alarm");
}

function startCubeVacuumSweep() {
  if (world.cubeVacuum.active) {
    return;
  }
  world.cubeVacuum.active = true;
  world.cubeVacuum.x = -180;
  world.cubeVacuum.y = 82;
  world.cubeVacuum.sweepSpeed = 11.5;
  world.cubeVacuum.cooldown = 0;
}

function sendCubeToSpace(cube) {
  world.spaceCubes.push({
    x: world.porthole.x + random(16, 52),
    y: world.porthole.y + random(28, world.porthole.h - 28),
    size: Math.max(9, cube.size * 0.62),
    vx: random(0.03, 0.08),
    vy: random(-0.01, 0.01),
    rotation: random(0, Math.PI * 2),
    spin: random(-0.002, 0.002),
    life: 1900,
    baseFill: "#d5b879",
    baseStroke: "#7a6030",
    mosaic: cube.mosaic && cube.mosaic.length ? cube.mosaic : [{ fill: "#d5b879", stroke: "#7a6030" }],
  });
}

function getLevelTuning(level) {
  return {
    maintenanceUnlocked: level >= 3,
    fireUnlocked: level >= 4,
    hazardUnlocked: level >= 5,
    zeroGUnlocked: level >= 6,
    thrustChance: 0.0022 + Math.min(0.0018, level * 0.00016),
  };
}

function updateLoadState() {
  if (world.zeroGTimer > 0) {
    world.loadHoldTimer = 150;
  } else if (world.loadHoldTimer > 0) {
    const airborne = countAirborneLoadObjects();
    if (airborne > 3) {
      world.loadHoldTimer = Math.min(180, world.loadHoldTimer + 2);
    } else {
      world.loadHoldTimer = Math.max(0, world.loadHoldTimer - 8);
    }
  }

  if (world.zeroGTimer > 0 || world.loadHoldTimer > 0) {
    world.loadTop = world.floorY;
    world.loadRatio = 0;
    world.overflowFrames = 0;
    return;
  }

  const grounded = world.particles.filter(
    (item) =>
      item.age > 14 &&
      (item.settledFrames > 4 || item.y + item.radius > world.floorY - 14) &&
      item.y + item.radius > world.maxLoadY - 26
  );
  let top = world.floorY;
  let pileMass = 0;

  for (const item of grounded) {
    top = Math.min(top, item.y - item.radius);
    pileMass += item.radius * 2;
  }

  for (const heap of world.trashHeaps) {
    top = Math.min(top, heap.y - heap.height * 0.5);
    pileMass += heap.mass * 1.35;
  }

  world.loadTop = grounded.length > 0 || world.trashHeaps.length > 0 ? top : world.floorY;
  world.loadRatio = clamp(
    (world.floorY - world.loadTop) / Math.max(1, world.floorY - world.maxLoadY),
    0,
    1.3
  );

  if ((grounded.length + world.trashHeaps.length >= 5 || pileMass > 42) && world.loadTop < world.maxLoadY) {
    world.overflowFrames += 1;
  } else {
    world.overflowFrames = Math.max(0, world.overflowFrames - 2);
  }
}

function wakeTrashItem(item, extraVx = 0, extraVy = 0) {
  if (!item) {
    return;
  }
  item.sleeping = false;
  item.clumpId = 0;
  item.settledFrames = Math.min(item.settledFrames || 0, 8);
  item.vx += extraVx;
  item.vy += extraVy;
}

function updateSleepingTrashState() {
  if (world.zeroGTimer > 0 || world.ship.shakeTimer > 0) {
    for (const item of world.particles) {
      item.sleeping = false;
      item.clumpId = 0;
    }
    return;
  }

  const candidates = [];
  for (const item of world.particles) {
    item.sleeping = false;
    item.clumpId = 0;
    if (item.attached || item.burning || item.hazardous) {
      continue;
    }
    if (item.settledFrames < 22) {
      continue;
    }
    if (Math.abs(item.vx) > 0.08 || Math.abs(item.vy) > 0.08) {
      continue;
    }
    if (item.y + item.radius < world.floorY - 8) {
      continue;
    }
    candidates.push(item);
  }

  candidates.sort((a, b) => a.x - b.x);
  let clumpId = 0;
  let previous = null;
  for (const item of candidates) {
    if (
      !previous ||
      Math.abs(item.x - previous.x) > previous.radius + item.radius + 18 ||
      Math.abs(item.y - previous.y) > 18
    ) {
      clumpId += 1;
    }
    item.sleeping = true;
    item.clumpId = clumpId;
    item.vx = 0;
    item.vy = 0;
    item.y = Math.min(item.y, world.floorY - item.radius);
    previous = item;
  }
}

function packSleepingTrashIntoHeaps() {
  if (world.zeroGTimer > 0 || world.ship.shakeTimer > 0) {
    return;
  }
  if (world.particles.length < 70 && world.trashHeaps.length > 0) {
    return;
  }
  if (world.frame % 18 !== 0) {
    return;
  }

  const groups = new Map();
  for (const item of world.particles) {
    if (
      !item.sleeping ||
      item.attached ||
      item.burning ||
      item.hazardous ||
      !item.clumpId
    ) {
      continue;
    }
    if (!groups.has(item.clumpId)) {
      groups.set(item.clumpId, []);
    }
    groups.get(item.clumpId).push(item);
  }

  if (groups.size === 0) {
    return;
  }

  const packedIds = new Set();
  for (const [, items] of groups) {
    if (items.length < 5) {
      continue;
    }
    let sumX = 0;
    for (const item of items) {
      sumX += item.x;
    }
    const averageX = sumX / items.length;
    const tooCloseToRobot =
      Math.abs(averageX - robot.x) < 160 ||
      Math.abs(averageX - (robot.x + robot.direction * 84)) < 140;
    if (tooCloseToRobot) {
      continue;
    }

    const heap = {
      id: `heap-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      x: clamp(averageX, 64, world.width - 64),
      y: world.floorY - 18,
      width: 40,
      height: 24,
      mass: 0,
      members: items.map(createHeapMemberSnapshot),
      patches: [],
      pulse: random(0, Math.PI * 2),
    };
    rebuildTrashHeap(heap);
    world.trashHeaps.push(heap);
    for (const item of items) {
      packedIds.add(item.id);
    }
  }

  if (packedIds.size > 0) {
    world.particles = world.particles.filter((item) => !packedIds.has(item.id));
  }
}

function updateTrashHeaps() {
  if (world.trashHeaps.length === 0) {
    return;
  }

  const suctionActive =
    !!world.keys[" "] &&
    robot.cargo.length < world.cargoCapacity &&
    world.fuel > 0.01 &&
    !world.maintenance.active;
  const vacStats = getVacuumStats();
  const scoopX = robot.x + robot.direction * (robot.intakeReach + robot.intakeExtension * 18);
  const scoopY = world.floorY - 18;
  const nextHeaps = [];

  if (world.zeroGTimer > 0 || world.ship.shakeTimer > 0) {
    for (const heap of world.trashHeaps) {
      releaseTrashHeapMembers(heap, heap.members.length, random(-0.5, 0.5), -0.3);
    }
    world.trashHeaps = [];
    return;
  }

  for (const heap of world.trashHeaps) {
    heap.pulse += 0.05;
    const frontX = robot.x + robot.direction * 88;
    const nearFront =
      Math.abs(heap.x - frontX) < heap.width * 0.5 + 42 &&
      Math.abs(heap.y - (world.floorY - 18)) < heap.height;
    const scoopDistance = Math.hypot(heap.x - scoopX, heap.y - scoopY);
    const nearSuction = suctionActive && scoopDistance < vacStats.range + heap.width * 0.45 + 26;

    if (nearFront && Math.abs(robot.velocityX) > 2.1) {
      releaseTrashHeapMembers(
        heap,
        Math.min(3, heap.members.length),
        robot.direction * (0.9 + Math.abs(robot.velocityX) * 0.12),
        -0.24
      );
    }

    if (nearSuction && heap.members.length > 0) {
      if (scoopDistance < vacStats.collectRadius + heap.width * 0.34 && world.frame % 4 === 0) {
        const member = heap.members.pop();
        robot.cargo.push({
          color: member.color,
          trashType: member.trashType,
        });
        playSound("suction-hit");
        if (heap.members.length > 0) {
          rebuildTrashHeap(heap);
        }
      } else if (world.frame % 6 === 0) {
        releaseTrashHeapMembers(
          heap,
          1,
          robot.direction * 0.42,
          -0.18
        );
      }
    }

    removeTrashHeapIfEmpty(heap, nextHeaps);
  }

  world.trashHeaps = nextHeaps;
}

function breakUpTrashCongestion() {
  const driveStats = getDriveStats();
  const dozerBoost = driveStats.dozerBoost;
  const frontX = robot.x + robot.direction * 86;
  const laneItems = world.particles.filter(
    (item) =>
      item.y + item.radius > world.floorY - 34 &&
      Math.abs(item.x - frontX) < 130
  );

  if (laneItems.length < 5) {
    for (const heap of world.trashHeaps) {
      if (
        Math.abs(heap.x - frontX) < heap.width * 0.6 + 40 &&
        heap.y + heap.height * 0.5 > world.floorY - 44
      ) {
        releaseTrashHeapMembers(
          heap,
          Math.min(4, heap.members.length),
          robot.direction * 0.8 * dozerBoost,
          -0.2 * dozerBoost
        );
      }
    }
    world.trashHeaps = world.trashHeaps.filter((heap) => heap.members.length > 0);
    return;
  }

  for (const item of laneItems) {
    wakeTrashItem(item);
    const side = Math.sign(item.x - frontX) || (Math.random() < 0.5 ? -1 : 1);
    item.vx += side * 0.14 * dozerBoost + robot.velocityX * 0.12 * dozerBoost + robot.direction * 0.08 * dozerBoost;
    item.vy -= 0.07 * dozerBoost;
    item.spin += side * 0.006 * dozerBoost;
  }
}

function ensureAudio() {
  if (audioUnlocked) {
    return;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }
  audioContext = new AudioCtx();
  audioUnlocked = true;
}

function playTone({ frequency = 220, duration = 0.08, type = "sine", gain = 0.04, slide = 1 }) {
  if (!audioUnlocked || !audioContext) {
    return;
  }
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequency * slide), now + duration);
  volume.gain.setValueAtTime(0.0001, now);
  volume.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(volume);
  volume.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}

function playNoise({ duration = 0.08, gain = 0.03 }) {
  if (!audioUnlocked || !audioContext) {
    return;
  }
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  }
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  const volume = audioContext.createGain();
  const now = audioContext.currentTime;
  volume.gain.setValueAtTime(gain, now);
  volume.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(volume);
  volume.connect(audioContext.destination);
  source.start(now);
}

function playSound(name) {
  if (name === "suction") {
    playTone({ frequency: 146, duration: 0.065, type: "sine", gain: 0.013, slide: 1.01 });
    playTone({ frequency: 196, duration: 0.05, type: "triangle", gain: 0.006, slide: 1 });
    return;
  }
  if (name === "suction-hit") {
    playTone({ frequency: 698, duration: 0.03, type: "triangle", gain: 0.01, slide: 1.04 });
    playTone({ frequency: 880, duration: 0.045, type: "sine", gain: 0.008, slide: 1.02 });
    return;
  }
  if (name === "alarm") {
    playTone({ frequency: 520, duration: 0.08, type: "square", gain: 0.035, slide: 0.9 });
    playTone({ frequency: 660, duration: 0.08, type: "square", gain: 0.03, slide: 0.9 });
    return;
  }
  if (name === "trash-drop") {
    playTone({ frequency: 130, duration: 0.04, type: "triangle", gain: 0.012, slide: 0.82 });
    playTone({ frequency: 98, duration: 0.06, type: "sine", gain: 0.008, slide: 0.9 });
    return;
  }
  if (name === "press") {
    playTone({ frequency: 165, duration: 0.05, type: "triangle", gain: 0.016, slide: 0.88 });
    playTone({ frequency: 123, duration: 0.1, type: "sine", gain: 0.018, slide: 0.92 });
    return;
  }
  if (name === "cube") {
    playTone({ frequency: 392, duration: 0.05, type: "triangle", gain: 0.018, slide: 1.05 });
    playTone({ frequency: 587, duration: 0.08, type: "sine", gain: 0.024, slide: 1.04 });
    return;
  }
  if (name === "levelup") {
    playTone({ frequency: 392, duration: 0.06, type: "triangle", gain: 0.024, slide: 1.01 });
    playTone({ frequency: 494, duration: 0.08, type: "triangle", gain: 0.026, slide: 1.02 });
    playTone({ frequency: 659, duration: 0.12, type: "sine", gain: 0.03, slide: 1.03 });
    return;
  }
  if (name === "upgrade") {
    playTone({ frequency: 330, duration: 0.05, type: "triangle", gain: 0.018, slide: 1.04 });
    playTone({ frequency: 440, duration: 0.06, type: "triangle", gain: 0.02, slide: 1.05 });
    playTone({ frequency: 554, duration: 0.1, type: "sine", gain: 0.022, slide: 1.06 });
    return;
  }
  if (name === "repair") {
    playTone({ frequency: 262, duration: 0.035, type: "square", gain: 0.016, slide: 1 });
    playTone({ frequency: 330, duration: 0.045, type: "square", gain: 0.016, slide: 1.01 });
    playTone({ frequency: 440, duration: 0.08, type: "triangle", gain: 0.02, slide: 1.04 });
  }
}

function createTrashItem(style, x, y, id) {
  const tuning = getLevelTuning(world.level);
  const roll = Math.random();
  const hazardous =
    tuning.hazardUnlocked &&
    roll < 0.045 + Math.min(0.02, Math.max(0, world.level - 5) * 0.006);
  const burning =
    tuning.fireUnlocked &&
    !hazardous &&
    roll > (tuning.hazardUnlocked ? 0.95 : 0.92);
  const radius = random(style.radius[0], style.radius[1]);

  return {
    id,
    x,
    y,
    vx: random(-1.2, 1.2),
    vy: random(-0.4, 0.5),
    radius,
    rotation: random(0, Math.PI * 2),
    spin: random(-0.03, 0.03),
    squish: random(0.75, 1.3),
    color: { fill: style.fill, stroke: style.stroke },
    trashType: style.type,
    hazardous,
    burning,
    firePhase: random(0, Math.PI * 2),
    age: 0,
    settledFrames: 0,
    sleeping: false,
    clumpId: 0,
  };
}

function spawnTrash(count = 22, source = "default", originX = null) {
  const lanes = [380, 560, 760, 940, 1110];
  const waveProfile = createTrashWaveProfile(count);
  for (let i = 0; i < count; i += 1) {
    const style = pickTrashStyleForWave(waveProfile, i);
    const laneX = lanes[Math.floor(Math.random() * lanes.length)];
    const x =
      source === "pipe" && originX !== null
        ? originX + random(-16, 16)
        : clamp(laneX + random(-70, 70), 320, world.width - 90);
    const y =
      source === "pipe"
        ? world.refillPipe.y + 28 + random(-2, 6)
        : random(-120, 36);
    const item = createTrashItem(style, x, y, `trash-${Date.now()}-${i}`);
    if (source === "pipe") {
      item.vx = random(-0.7, 0.7);
      item.vy = random(1.4, 3.2);
    } else {
      item.vx = random(-0.9, 0.9);
      item.vy = random(0.7, 2.1);
    }
    world.particles.push(item);
  }
}

function nextTrashBatchSize() {
  const base = getTrashDropCount();
  const relief = getFlowRelief();
  return Math.max(9, Math.round(base - relief * 6));
}

function upgradeActive(key) {
  return !!world.upgrades[key];
}

function getPowerupTier(key) {
  if (!upgradeActive(key)) {
    return 0;
  }
  const maxTier = POWERUP_MAX_TIERS[key] || 1;
  let tier = 1;
  for (let i = 1; i < POWERUP_TIER_THRESHOLDS.length; i += 1) {
    if (world.level >= POWERUP_TIER_THRESHOLDS[i]) {
      tier = i + 1;
    }
  }
  return Math.min(maxTier, tier);
}

function getVacuumStats() {
  const tier = getPowerupTier("vacuum");
  if (!tier) {
    return {
      range: 92,
      pull: 0.34,
      collectRadius: 30,
      instantRadius: 0,
      entangle: false,
    };
  }
  return {
    range: [128, 152, 172, 194][tier - 1],
    pull: [0.4, 0.48, 0.56, 0.62][tier - 1],
    collectRadius: [34, 38, 42, 46][tier - 1],
    instantRadius: tier >= 3 ? [0, 0, 50, 64][tier - 1] : 0,
    entangle: tier >= 4,
  };
}

function getDriveStats() {
  const tier = getPowerupTier("drive");
  if (!tier) {
    return {
      topSpeed: 4.9,
      acceleration: 0.18,
      dozerBoost: 1,
      halfWidth: 54,
      ramBurst: false,
    };
  }
  return {
    topSpeed: [5.9, 6.5, 7.1, 7.8][tier - 1],
    acceleration: [0.21, 0.24, 0.27, 0.31][tier - 1],
    dozerBoost: [1.35, 1.8, 2.25, 2.8][tier - 1],
    halfWidth: [58, 62, 74, 82][tier - 1],
    ramBurst: tier >= 4,
  };
}

function getTankModuleCount() {
  const tier = getPowerupTier("tank");
  if (!tier) {
    return 1;
  }
  return tier >= 3 ? 3 : 2;
}

function decodeGlitch(code) {
  return String.fromCharCode(...code.map((value) => value ^ glitchCipher.mask));
}

function applyUpgradeEffects() {
  const tankTier = getPowerupTier("tank");
  world.cargoCapacity = tankTier >= 3 ? 18 : tankTier >= 1 ? 12 : 6;
  if (robot.cargo.length > world.cargoCapacity) {
    robot.cargo.length = world.cargoCapacity;
  }
}

function getPressTimings() {
  const pressTier = getPowerupTier("press");
  const tankTier = getPowerupTier("tank");
  if (pressTier >= 2) {
    return { warning: 1, ejecting: 1 };
  }
  if (pressTier === 1) {
    return { warning: 2, ejecting: 1 };
  }
  return {
    warning: tankTier >= 2 ? 5 : 7,
    ejecting: 5,
  };
}

function startHelperBotDelivery() {
  const helperTier = getPowerupTier("helper");
  const bots = helperTier >= 5
    ? [world.helperBot, world.helperBotWing]
    : [world.helperBot];

  const initBot = (bot, index) => {
    bot.active = true;
    bot.phase = "incoming";
    bot.targetX = clamp(robot.x + robot.direction * (index === 0 ? 180 : 110), 150, world.width - 150);
    bot.x = world.width + 120 + index * 48;
    bot.y = -88 - index * 12;
    bot.vx = 0;
    bot.targetId = null;
    bot.direction = -1;
    bot.intakePulse = 0;
    bot.craneX = world.width + 160 + index * 42;
    bot.hookY = -120 - index * 10;
    bot.breakTimer = 0;
    bot.collected = 0;
  };

  for (let i = 0; i < bots.length; i += 1) {
    initBot(bots[i], i);
  }
  if (helperTier < 5) {
    world.helperBotWing.active = false;
    world.helperBotWing.phase = "idle";
  }
}

function helperBotBusy() {
  return world.helperBot.phase !== "idle" || world.helperBotWing.phase !== "idle";
}

function spawnHelperBotScrap(x, y) {
  const scrapBits = [
    { trashType: "botWheel", fill: "#5f707d", stroke: "#21272d", radius: 10 },
    { trashType: "botWheel", fill: "#5f707d", stroke: "#21272d", radius: 9 },
    { trashType: "botEye", fill: "#d8f5ff", stroke: "#49677b", radius: 9 },
    { trashType: "botPanel", fill: "#7fa0b7", stroke: "#486170", radius: 11 },
    { trashType: "botPanel", fill: "#8aaabd", stroke: "#52697a", radius: 10 },
    { trashType: "botStack", fill: "#9eb2c0", stroke: "#5b7080", radius: 10 },
    { trashType: "botLamp", fill: "#f3c767", stroke: "#866a2a", radius: 8 },
  ];

  for (let i = 0; i < scrapBits.length; i += 1) {
    const bit = scrapBits[i];
    world.particles.push({
      id: `helper-scrap-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 5)}`,
      x: x + random(-18, 18),
      y: y + random(-18, 10),
      vx: random(-1.8, 1.8),
      vy: random(-2.4, -0.6),
      radius: bit.radius,
      rotation: random(0, Math.PI * 2),
      spin: random(-0.06, 0.06),
      squish: random(0.82, 1.18),
      color: { fill: bit.fill, stroke: bit.stroke },
      trashType: bit.trashType,
      hazardous: false,
      burning: false,
      firePhase: random(0, Math.PI * 2),
      age: 0,
      settledFrames: 0,
    });
  }
}

function collapseHelperBot() {
  const bots = [world.helperBot, world.helperBotWing];
  let collapsedAny = false;
  for (const bot of bots) {
    if (!bot.active || bot.phase === "breaking" || bot.phase === "idle") {
      continue;
    }
    bot.phase = "breaking";
    bot.breakTimer = 24;
    bot.targetId = null;
    bot.vx *= 0.4;
    collapsedAny = true;
  }
  if (collapsedAny) {
    showPowerupNotice("Buddy-Bot zerfaellt", "#ffd9a6");
    playSound("alarm");
  }
}

function nextPowerupDelay() {
  const flow = getFlowProfile();
  const relief = getFlowRelief();
  return Math.max(
    210,
    (820 - world.level * 18 - relief * 120) * flow.powerupDelayMul + Math.floor(random(-40, 130))
  );
}

function canSpawnPowerup(key) {
  const logic = POWERUP_FLOW[key];
  const pressure = getCurrentPressure();
  const flow = getFlowProfile();
  const relief = Math.min(1, getFlowRelief(pressure) + flow.powerupBias);
  const trashCount = getEffectiveTrashCount();
  return !upgradeActive(key) &&
    !(key === "helper" && helperBotBusy()) &&
    !world.upgradeDrops.find((item) => item.key === key) &&
    !!logic &&
    world.level >= logic.minLevel &&
    trashCount >= logic.minTrash * (1 - relief * 0.18) &&
    world.activeCubes.length >= Math.max(0, logic.minCubes - Math.round(relief * 2)) &&
    (world.loadRatio >= logic.minLoad - relief * 0.1 || pressure >= logic.minLoad + 0.18 - relief * 0.16);
}

function spawnRandomPowerupDrop() {
  const eligible = UPGRADE_DEFS.filter((upgrade) => canSpawnPowerup(upgrade.key));
  if (eligible.length === 0) {
    return false;
  }

  const pressure = getCurrentPressure();
  const trashCount = getEffectiveTrashCount();
  let totalWeight = 0;
  const weighted = eligible.map((upgrade) => {
    const logic = POWERUP_FLOW[upgrade.key];
    const levelBoost = Math.max(0, world.level - logic.minLevel) * 0.18;
    const pressureBoost = Math.max(0.2, pressure - logic.minLoad + 0.42);
    const trashBoost = clamp(trashCount / Math.max(1, logic.minTrash), 0.6, 2.4);
    const cubeBoost = logic.minCubes > 0 ? clamp(world.activeCubes.length / (logic.minCubes + 1), 0.4, 2.2) : 1;
    const weight = logic.baseWeight * pressureBoost * trashBoost * cubeBoost + levelBoost;
    totalWeight += weight;
    return { upgrade, weight };
  });

  let roll = random(0, totalWeight);
  let chosen = weighted[0].upgrade;
  for (const entry of weighted) {
    roll -= entry.weight;
    if (roll <= 0) {
      chosen = entry.upgrade;
      break;
    }
  }

  world.upgradeDrops.push({
    key: chosen.key,
    label: chosen.shortLabel,
    cost: chosen.cost,
    x: clamp(robot.x + random(-180, 180), 180, world.width - 180),
    y: -34,
    vx: random(-0.45, 0.45),
    vy: random(1.1, 1.9),
    size:
      chosen.key === "tank" ? 28 :
      chosen.key === "vacuum" ? 29 :
      chosen.key === "drive" ? 28 :
      chosen.key === "autoPress" ? 24 :
      chosen.key === "helper" ? 26 :
      26,
    rotation: random(-0.28, 0.28),
    spin: random(-0.02, 0.02),
  });
  world.powerupSignalTimer = 240;
  showPowerupNotice("Power-Up faellt ein", chosen.accent);
  playSound("upgrade");
  return true;
}

function spawnUpgradeDrop(key) {
  const upgrade = UPGRADE_DEFS.find((item) => item.key === key);
  if (!upgrade) {
    return false;
  }
  if (
    upgradeActive(key) ||
    (key === "helper" && helperBotBusy()) ||
    world.upgradeDrops.find((item) => item.key === key) ||
    world.upgradePoints < upgrade.cost
  ) {
    return false;
  }

  world.upgradePoints -= upgrade.cost;
  world.upgradeDrops.push({
    key: upgrade.key,
    label: upgrade.shortLabel,
    cost: upgrade.cost,
    x: random(170, world.width - 170),
    y: -30,
    vx: random(-0.4, 0.4),
    vy: random(0.8, 1.6),
    size:
      key === "tank" ? 28 :
      key === "vacuum" ? 29 :
      key === "drive" ? 28 :
      key === "autoPress" ? 24 :
      key === "helper" ? 26 :
      26,
    rotation: random(-0.3, 0.3),
    spin: random(-0.02, 0.02),
  });
  playSound("upgrade");
  showPowerupNotice(`${upgrade.name} angefordert`, upgrade.accent);
  return true;
}

function spawnUpgradeDropForTest(key) {
  if (
    upgradeActive(key) ||
    (key === "helper" && helperBotBusy()) ||
    world.upgradeDrops.find((item) => item.key === key)
  ) {
    return false;
  }
  const upgrade = UPGRADE_DEFS.find((item) => item.key === key);
  if (!upgrade) {
    return false;
  }
  world.upgradeDrops.push({
    key: upgrade.key,
    label: upgrade.shortLabel,
    cost: upgrade.cost,
    x: random(170, world.width - 170),
    y: -30,
    vx: random(-0.4, 0.4),
    vy: random(0.8, 1.6),
    size:
      key === "tank" ? 28 :
      key === "vacuum" ? 29 :
      key === "drive" ? 28 :
      key === "autoPress" ? 24 :
      key === "helper" ? 26 :
      26,
    rotation: random(-0.3, 0.3),
    spin: random(-0.02, 0.02),
  });
  return true;
}

function activateUpgrade(key) {
  const upgrade = UPGRADE_DEFS.find((item) => item.key === key);
  world.upgrades[key] = true;
  world.upgradeTimers[key] = 60 * 60;
  applyUpgradeEffects();
  if (key === "helper") {
    startHelperBotDelivery();
  }
  playSound("upgrade");
  if (upgrade) {
    showPowerupNotice(`${upgrade.name} aktiv`, upgrade.accent);
  }
}

function spawnUpgradeExpiryTrash(key, tier = 0) {
  const spawnPiece = (trashType, localX, localY, radius, fill, stroke, extra = {}) => {
    const anchor = robotLocalToWorld(localX, localY);
    world.particles.push({
      id: `upgrade-scrap-${key}-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      x: anchor.x,
      y: anchor.y,
      vx: random(-1.4, 1.4) + robot.velocityX * 0.1,
      vy: random(-2.4, -0.8),
      radius,
      rotation: random(0, Math.PI * 2),
      spin: random(-0.05, 0.05),
      squish: random(0.82, 1.18),
      color: { fill, stroke },
      trashType,
      hazardous: false,
      burning: false,
      firePhase: random(0, Math.PI * 2),
      age: 0,
      settledFrames: 0,
      ...extra,
    });
  };

  if (key === "tank") {
    const modules = tier >= 3 ? 2 : 1;
    for (let i = 0; i < modules; i += 1) {
      spawnPiece("tankModule", -96 - i * 38, 6, 14, "#8db0c7", "#51687a");
    }
    return;
  }
  if (key === "vacuum") {
    spawnPiece("vacNozzle", 84, 24, 16, "#5f7f99", "#3f5667");
    return;
  }
  if (key === "drive") {
    spawnPiece("driveSpoiler", 74, 18, 16, "#9fb5c4", "#5b6e7a");
    return;
  }
  if (key === "autoPress") {
    spawnPiece("autoCore", -8, -24, 14, "#9dd093", "#4f7650");
  }
}

function runGlitch(type) {
  if (type === "points") {
    world.upgradePoints += 200;
    playSound("alarm");
    return;
  }
  if (type === "drops") {
    for (const upgrade of UPGRADE_DEFS) {
      spawnUpgradeDropForTest(upgrade.key);
    }
    playSound("trash-drop");
    return;
  }
  if (type === "all") {
    for (const upgrade of UPGRADE_DEFS) {
      activateUpgrade(upgrade.key);
    }
    world.upgradeDrops = [];
    playSound("alarm");
  }
}

function handleGlitches(key) {
  if (!/^[a-z]$/i.test(key)) {
    return;
  }
  glitchCipher.buffer = (glitchCipher.buffer + key.toUpperCase()).slice(-12);
  for (const action of glitchCipher.actions) {
    const phrase = decodeGlitch(action.code);
    if (glitchCipher.buffer.endsWith(phrase)) {
      runGlitch(action.type);
      glitchCipher.buffer = "";
      break;
    }
  }
}

function updateUpgradeTimers() {
  for (const upgrade of UPGRADE_DEFS) {
    if (!world.upgrades[upgrade.key]) {
      continue;
    }
    const tierBefore = getPowerupTier(upgrade.key);
    world.upgradeTimers[upgrade.key] = Math.max(0, world.upgradeTimers[upgrade.key] - 1);
    if (world.upgradeTimers[upgrade.key] === 0) {
      world.upgrades[upgrade.key] = false;
      applyUpgradeEffects();
      if (upgrade.key === "helper") {
        collapseHelperBot();
        continue;
      }
      if (upgrade.key !== "press") {
        spawnUpgradeExpiryTrash(upgrade.key, tierBefore);
      }
      showPowerupNotice(`${upgrade.name} aus`, "#ffd4b0");
    }
  }
}

function showPowerupNotice(text, color = "#9feaff") {
  world.powerupNotice.text = text;
  world.powerupNotice.timer = 180;
  world.powerupNotice.color = color;
}

function resetYard() {
  resetTouchDrive();
  mobileTouchState.suctionPointerId = null;
  mobileTouchState.suctionPressTriggered = false;
  releaseVirtualKey(" ");
  setSuctionPull(0);
  robot.x = 260;
  robot.y = world.floorY - 54;
  robot.velocityX = 0;
  robot.direction = 1;
  robot.facing = 1;
  robot.cargo = [];
  robot.processState = "collecting";
  robot.processTimer = 0;
  robot.rearHatchOpen = false;
  robot.intakePulse = 0;
  robot.intakeExtension = 0;
  robot.frontCompression = 0;
  robot.blinkTimer = 0;
  robot.blinkCooldown = 100 + Math.floor(Math.random() * 160);
  robot.floatOffset = 0;
  robot.floatVelocity = 0;
  robot.floatRotation = 0;
  robot.sway = 0;
  robot.swayVelocity = 0;
  world.cubes = 0;
  world.level = 1;
  world.cargoCapacity = 6;
  world.frame = 0;
  world.gameOver = false;
  world.spawnTimer = randomSpawnDelay(1, 0);
  world.spawnPauseTimer = 0;
  world.spawnRollTimer = 120;
  world.flow.phase = "steady";
  world.flow.timer = 260;
  world.controlLampRed = false;
  world.zeroGTimer = 0;
  world.fuel = 100;
  world.ship.thrustTimer = 0;
  world.ship.thrustCooldown = 240;
  world.ship.accel = 0;
  world.ship.tilt = 0;
  world.ship.tiltVelocity = 0;
  world.ship.shakeTimer = 0;
  world.levelBurstTimer = 0;
  world.powerupSpawnTimer = 720;
  world.powerupSignalTimer = 0;
  world.combo.count = 0;
  world.combo.timer = 0;
  world.upgradePoints = 0;
  world.upgradeDrops = [];
  world.upgrades.tank = false;
  world.upgrades.vacuum = false;
  world.upgrades.drive = false;
  world.upgrades.autoPress = false;
  world.upgrades.helper = false;
  world.upgrades.press = false;
  world.upgradeTimers.tank = 0;
  world.upgradeTimers.vacuum = 0;
  world.upgradeTimers.drive = 0;
  world.upgradeTimers.autoPress = 0;
  world.upgradeTimers.helper = 0;
  world.upgradeTimers.press = 0;
  world.upgradeButtons = [];
  world.exhaustParticles = [];
  world.repairParts = [];
  world.activeCubes = [];
  world.trashHeaps = [];
  world.spaceCubes = [];
  world.spaceTraffic = [];
  world.spaceTrafficTimer = 260;
  world.pressQueue = [];
  world.cranes = [];
  world.zeroGCooldown = 480;
  world.maintenance.active = false;
  world.maintenance.phase = "idle";
  world.maintenance.timer = 0;
  world.maintenance.blink = 0;
  world.maintenance.partsNeeded = 0;
  world.maintenance.missingParts = [];
  world.maintenance.cooldown = 0;
  world.refuel.active = false;
  world.refuel.phase = "idle";
  world.refuel.y = -120;
  world.refuel.timer = 0;
  world.firebot.active = false;
  world.firebot.phase = "idle";
  world.firebot.targetId = null;
  world.firebot.y = -120;
  world.refillPipe.active = false;
  world.refillPipe.phase = "idle";
  world.refillPipe.x = 172;
  world.refillPipe.y = -120;
  world.refillPipe.targetY = 54;
  world.refillPipe.timer = 0;
  world.refillPipe.spawned = false;
  world.sound.suctionFrame = 0;
  world.helperBot.active = false;
  world.helperBot.phase = "idle";
  world.helperBot.x = world.width * 0.72;
  world.helperBot.y = world.floorY - 42;
  world.helperBot.vx = 0;
  world.helperBot.targetX = world.width * 0.72;
  world.helperBot.targetId = null;
  world.helperBot.direction = -1;
  world.helperBot.intakePulse = 0;
  world.helperBot.craneX = world.width + 160;
  world.helperBot.hookY = -120;
  world.helperBot.breakTimer = 0;
  world.helperBot.collected = 0;
  world.helperBotWing.active = false;
  world.helperBotWing.phase = "idle";
  world.helperBotWing.x = world.width * 0.62;
  world.helperBotWing.y = world.floorY - 42;
  world.helperBotWing.vx = 0;
  world.helperBotWing.targetX = world.width * 0.62;
  world.helperBotWing.targetId = null;
  world.helperBotWing.direction = -1;
  world.helperBotWing.intakePulse = 0;
  world.helperBotWing.craneX = world.width + 200;
  world.helperBotWing.hookY = -120;
  world.helperBotWing.breakTimer = 0;
  world.helperBotWing.collected = 0;
  world.loadTop = world.floorY;
  world.loadRatio = 0;
  world.overflowFrames = 0;
  world.loadHoldTimer = 0;
  world.intro.active = false;
  world.intro.phase = "idle";
  world.intro.timer = 0;
  world.intro.hookY = -150;
  world.intro.frontX = robot.x + 44;
  world.intro.rearX = robot.x - 56;
  world.endSequence.active = false;
  world.endSequence.phase = "idle";
  world.endSequence.timer = 0;
  world.endSequence.pieces = [];
  world.cubeVacuum.active = false;
  world.cubeVacuum.x = -180;
  world.cubeVacuum.y = 82;
  world.cubeVacuum.sweepSpeed = 11.5;
  world.cubeVacuum.cooldown = 150;
  world.powerupNotice.text = "";
  world.powerupNotice.timer = 0;
  world.powerupNotice.color = "#9feaff";
  world.particles = [];
  applyUpgradeEffects();
  world.spawnPauseTimer = 0;
  world.spawnRollTimer = 120;
  world.spawnTimer = 1;
  syncHud();
}

function triggerRefillPipe() {
  if (world.refillPipe.active) {
    return;
  }
  const pipeLanes = [172, Math.round(world.width * 0.5), world.width - 172];
  let laneX = pipeLanes[Math.floor(Math.random() * pipeLanes.length)];
  if (pipeLanes.length > 1 && Math.abs(laneX - world.refillPipe.x) < 40) {
    laneX = pipeLanes[(pipeLanes.indexOf(laneX) + 1 + Math.floor(Math.random() * 2)) % pipeLanes.length];
  }
  world.refillPipe.active = true;
  world.refillPipe.phase = "descending";
  world.refillPipe.x = laneX;
  world.refillPipe.y = -120;
  world.refillPipe.timer = 0;
  world.refillPipe.spawned = false;
}

function syncHud() {
  return;
}

function resizeGameStage() {
  const viewportWidth = gameShellEl ? gameShellEl.clientWidth : window.innerWidth;
  const viewportHeight = gameShellEl ? gameShellEl.clientHeight : window.innerHeight;
  const scale = Math.min(viewportWidth / 1280, viewportHeight / 720);
  gameStageEl.style.setProperty("--game-scale", String(scale));

  if (!gameShellEl || !touchControlsEl || !driveFieldEl || !suctionControlEl) {
    return;
  }

  const stageWidth = 1280 * scale;
  const stageHeight = 720 * scale;
  const shellStyles = gameShellEl ? window.getComputedStyle(gameShellEl) : null;
  const safeLeft = shellStyles ? parseFloat(shellStyles.getPropertyValue("--safe-left")) || 0 : 0;
  const safeRight = shellStyles ? parseFloat(shellStyles.getPropertyValue("--safe-right")) || 0 : 0;
  const safeTop = shellStyles ? parseFloat(shellStyles.getPropertyValue("--safe-top")) || 0 : 0;
  const safeBottom = shellStyles ? parseFloat(shellStyles.getPropertyValue("--safe-bottom")) || 0 : 0;
  const stageLeft = (viewportWidth - stageWidth) * 0.5;
  const stageTop = (viewportHeight - stageHeight) * 0.5;
  const rightGutter = viewportWidth - stageLeft - stageWidth - safeRight;
  const leftGutter = stageLeft - safeLeft;
  const sideWidth = clamp(Math.min(leftGutter, rightGutter) - 22, 98, 170);
  const driveWidth = sideWidth;
  const driveHeight = clamp(stageHeight * 0.24, 110, 146);
  const suctionWidth = clamp(sideWidth + 12, 110, 182);
  const suctionHeight = clamp(stageHeight * 0.42, 206, 286);
  const edgeGap = 14;
  const driveLeft = Math.max(12 + safeLeft, stageLeft - driveWidth - edgeGap);
  const suctionLeft = Math.min(
    viewportWidth - suctionWidth - 12 - safeRight,
    stageLeft + stageWidth + edgeGap
  );
  const driveTop = clamp(
    stageTop + stageHeight - driveHeight - 10,
    stageTop + 18 + safeTop * 0.2,
    viewportHeight - driveHeight - 12 - safeBottom
  );
  const suctionTop = clamp(
    stageTop + stageHeight - suctionHeight - 8,
    stageTop + 12 + safeTop * 0.2,
    viewportHeight - suctionHeight - 12 - safeBottom
  );

  driveFieldEl.style.left = `${driveLeft}px`;
  driveFieldEl.style.top = `${driveTop}px`;
  driveFieldEl.style.width = `${driveWidth}px`;
  driveFieldEl.style.height = `${driveHeight}px`;

  suctionControlEl.style.left = `${suctionLeft}px`;
  suctionControlEl.style.top = `${suctionTop}px`;
  suctionControlEl.style.width = `${suctionWidth}px`;
  suctionControlEl.style.height = `${suctionHeight}px`;
}

function triggerPressAction() {
  if (world.gameOver || world.intro.active || world.maintenance.active) {
    return;
  }
  const queued = queuePressCycle({ mode: "manual" });
  if (queued) {
    const timings = getPressTimings();
    playSound("press");
    robot.processState = "warning";
    robot.processTimer = timings.warning;
  }
}

function pressVirtualKey(key) {
  world.keys[key] = true;
}

function releaseVirtualKey(key) {
  world.keys[key] = false;
}

function updateDriveTouchUi() {
  if (!driveFieldEl) {
    return;
  }
  const percent = 50 + mobileTouchState.driveValue * 40;
  driveFieldEl.style.setProperty("--drive-thumb-x", `${percent}%`);
  driveFieldEl.classList.toggle("is-active", Math.abs(mobileTouchState.driveValue) > 0.05);
}

function setTouchDriveFromValue(value) {
  mobileTouchState.driveValue = clamp(value, -1, 1);
  releaseVirtualKey("ArrowLeft");
  releaseVirtualKey("ArrowRight");

  if (mobileTouchState.driveValue <= -0.16) {
    pressVirtualKey("ArrowLeft");
  } else if (mobileTouchState.driveValue >= 0.16) {
    pressVirtualKey("ArrowRight");
  }

  updateDriveTouchUi();
}

function resetTouchDrive() {
  mobileTouchState.drivePointerId = null;
  setTouchDriveFromValue(0);
}

function setSuctionPull(value) {
  mobileTouchState.suctionPull = clamp(value, 0, 1);
  if (suctionControlEl) {
    suctionControlEl.style.setProperty("--suction-pull", mobileTouchState.suctionPull.toFixed(3));
    suctionControlEl.classList.toggle("is-active", mobileTouchState.suctionPull > 0 || !!world.keys[" "]);
    suctionControlEl.classList.toggle("is-triggered", mobileTouchState.suctionPressTriggered);
  }
}

function updateRobot() {
  if (world.gameOver || world.intro.active) {
    robot.velocityX *= 0.86;
    robot.intakeExtension += (0 - robot.intakeExtension) * 0.24;
    return;
  }

  const suctionActive = !!world.keys[" "];
  const outOfFuel = world.fuel <= 0.01;
  const engineActive = !outOfFuel || world.refuel.active;
  const engineFactor = world.refuel.active ? 0.62 : 1;
  const broken = world.maintenance.active;
  const driveStats = getDriveStats();

  const moveLeft = world.keys.ArrowLeft || world.keys.a || world.keys.A;
  const moveRight = world.keys.ArrowRight || world.keys.d || world.keys.D;
  const acceleration = driveStats.acceleration;
  const topSpeed = driveStats.topSpeed;
  const zeroGControl = world.zeroGTimer > 0 ? 0.09 : 0;

  if (moveLeft && engineActive) {
    robot.velocityX -= (acceleration + zeroGControl) * engineFactor;
    robot.swayVelocity -= 0.01;
    robot.direction = -1;
  }

  if (moveRight && engineActive) {
    robot.velocityX += (acceleration + zeroGControl) * engineFactor;
    robot.swayVelocity += 0.01;
    robot.direction = 1;
  }

  robot.velocityX *= 0.94;
  if (world.ship.accel > 0 && world.zeroGTimer === 0) {
    robot.velocityX -= world.ship.accel * 0.035;
  }
  if (world.ship.shakeTimer > 0 && world.zeroGTimer === 0) {
    robot.velocityX += Math.sin(world.frame * 1.8) * 0.06;
  }
  robot.velocityX = clamp(robot.velocityX, -topSpeed * engineFactor, topSpeed * engineFactor);
  robot.x = clamp(robot.x + robot.velocityX, 70, world.width - 110);
  const targetExtension =
    suctionActive && robot.cargo.length < world.cargoCapacity && engineActive && !broken ? 1 : 0;
  robot.intakeExtension += (targetExtension - robot.intakeExtension) * 0.24;
  robot.intakePulse += 0.1 + robot.intakeExtension * 0.32 + Math.abs(robot.velocityX) * 0.03;
  robot.swayVelocity += (-robot.velocityX * 0.012 - robot.sway) * 0.04;
  robot.swayVelocity *= 0.82;
  robot.sway += robot.swayVelocity;
  robot.sway = clamp(robot.sway, -6, 6);
  robot.facing += (robot.direction - robot.facing) * 0.16;
  if (Math.abs(robot.facing - robot.direction) < 0.01) {
    robot.facing = robot.direction;
  }
  const targetCompression =
    robot.processState === "warning" || robot.processState === "ejecting"
      ? 1
      : 0;
  robot.frontCompression += (targetCompression - robot.frontCompression) * (targetCompression > 0 ? 0.2 : 0.12);

  if (world.zeroGTimer > 0) {
    if (world.zeroGTimer > 170) {
      robot.floatVelocity -= 0.045;
    } else if (world.zeroGTimer < 65) {
      robot.floatVelocity += 0.08;
    } else {
      robot.floatVelocity *= 0.98;
      robot.floatVelocity += Math.sin(world.frame * 0.09) * 0.01;
    }
    robot.floatOffset += robot.floatVelocity;
    robot.floatOffset = clamp(robot.floatOffset, -58, 0);
    robot.floatRotation = Math.sin(world.frame * 0.05) * 0.08 + robot.velocityX * 0.01;
    if (robot.floatOffset === 0 && world.zeroGTimer < 65) {
      robot.floatVelocity = 0;
    }
  } else {
    robot.floatVelocity += (0 - robot.floatOffset) * 0.08;
    robot.floatVelocity *= 0.72;
    robot.floatOffset += robot.floatVelocity;
    if (Math.abs(robot.floatOffset) < 0.2 && Math.abs(robot.floatVelocity) < 0.2) {
      robot.floatOffset = 0;
      robot.floatVelocity = 0;
    }
    robot.floatRotation += world.ship.tilt * 0.08 + robot.sway * 0.0025;
    if (world.ship.shakeTimer > 0) {
      robot.floatRotation += Math.sin(world.frame * 1.3) * 0.01;
    }
    robot.floatRotation *= 0.82;
    if (Math.abs(robot.floatRotation) < 0.002) {
      robot.floatRotation = 0;
    }
  }

  if (robot.blinkTimer > 0) {
    robot.blinkTimer -= 1;
  } else {
    robot.blinkCooldown -= 1;
    if (robot.blinkCooldown <= 0) {
      robot.blinkTimer = 10;
      robot.blinkCooldown = 130 + Math.floor(Math.random() * 180);
    }
  }
}

function updateTrash() {
  const currentGravity = world.zeroGTimer > 0 ? 0 : world.gravity;
  const driveStats = getDriveStats();
  const dozerBoost = driveStats.dozerBoost;
  const particleCellSize = 72;
  const suctionActive =
    !!world.keys[" "] &&
    robot.cargo.length < world.cargoCapacity &&
    world.fuel > 0.01 &&
    !world.maintenance.active;
  const vacStats = getVacuumStats();
  const scoopX = robot.x + robot.direction * (robot.intakeReach + robot.intakeExtension * 18);
  const scoopY = world.floorY - 18;
  const wakeRange = vacStats.range + robot.intakeExtension * (upgradeActive("vacuum") ? 82 : 56);

  for (const item of world.particles) {
    if (item.sleeping) {
      const nearRobot =
        Math.abs(item.x - robot.x) < driveStats.halfWidth + 34 &&
        item.y + item.radius > world.floorY - 52;
      const scoopDistance = suctionActive ? Math.hypot(item.x - scoopX, item.y - scoopY) : Infinity;
      if (!nearRobot && scoopDistance >= wakeRange) {
        item.age += 1;
        item.firePhase += 0.04;
        item.vx = 0;
        item.vy = 0;
        item.spin *= 0.6;
        item.rotation *= 0.92;
        item.y = Math.min(item.y, world.floorY - item.radius);
        item.settledFrames = Math.min(item.settledFrames + 1, 120);
        continue;
      }
      if (scoopDistance < wakeRange) {
        const angle = Math.atan2(scoopY - item.y, scoopX - item.x);
        wakeTrashItem(item, Math.cos(angle) * 0.12, Math.sin(angle) * 0.12);
      } else {
        wakeTrashItem(item);
      }
    }

    item.firePhase += 0.15;
    item.age += 1;
    item.vy += currentGravity;
    if (world.ship.accel > 0 && world.zeroGTimer === 0) {
      item.vx -= world.ship.accel * 0.03;
    }
    if (world.ship.shakeTimer > 0 && world.zeroGTimer === 0) {
      item.vx += Math.sin(world.frame * 1.7 + item.firePhase) * 0.025;
      item.vy -= 0.01;
    }
    item.vx *= world.drag;
    item.vy *= 0.998;
    if (world.zeroGTimer > 0) {
      if (world.zeroGTimer > 250) {
        item.vy -= 0.055;
      } else if (world.zeroGTimer < 75) {
        item.vy += 0.09;
      } else {
        item.vy += Math.sin(item.firePhase) * 0.012;
      }
      item.vx += Math.cos(item.firePhase * 0.7) * 0.008;
    }
    item.x += item.vx;
    item.y += item.vy;
    item.rotation += item.spin;

    if (world.zeroGTimer === 0 && item.y + item.radius > world.floorY) {
      item.y = world.floorY - item.radius;
      item.vy *= -0.42;
      item.vx *= 0.95;
    }

    if (world.zeroGTimer > 0 && item.y - item.radius < 28) {
      item.y = 28 + item.radius;
      item.vy *= -0.2;
    }

    if (world.zeroGTimer > 0 && item.y + item.radius > world.floorY - 10) {
      item.y = world.floorY - 10 - item.radius;
      item.vy = Math.min(item.vy, 0.12) * -0.18;
    }

    if (item.x - item.radius < 24) {
      item.x = 24 + item.radius;
      item.vx *= -0.7;
    } else if (item.x + item.radius > world.width - 24) {
      item.x = world.width - 24 - item.radius;
      item.vx *= -0.7;
    }

    const dxRobot = item.x - robot.x;
    const dyRobot = item.y - (robot.y + 6);
    const halfWidth = driveStats.halfWidth;
    const halfHeight = 34;
    const nearX = clamp(dxRobot, -halfWidth, halfWidth);
    const nearY = clamp(dyRobot, -halfHeight, halfHeight);
    const diffX = dxRobot - nearX;
    const diffY = dyRobot - nearY;
    const distanceRobot = Math.hypot(diffX, diffY);

    if (distanceRobot < item.radius + 2) {
      wakeTrashItem(item);
      const safeDistance = distanceRobot || 0.001;
      const push = item.radius + 2 - safeDistance;
      const nx = diffX / safeDistance;
      const ny = diffY / safeDistance;
      item.x += nx * push;
      item.y += ny * push;
      item.vx += nx * (0.45 + Math.abs(robot.velocityX) * 0.2) * dozerBoost + robot.velocityX * 0.08 * dozerBoost;
      item.vy += ny * 0.18 * dozerBoost;
    }

    if (
      driveStats.ramBurst &&
      Math.abs(robot.velocityX) > 4.2 &&
      robot.direction * (item.x - robot.x) > 0 &&
      Math.abs(item.x - robot.x) < 120 &&
      item.y + item.radius > world.floorY - 48
    ) {
      wakeTrashItem(item);
      item.vx += robot.direction * 0.4;
      item.vy -= 0.14;
      item.spin += robot.direction * 0.03;
    }

    if (
      item.y + item.radius > world.floorY - 10 ||
      (item.age > 24 && Math.abs(item.vx) < 0.22 && Math.abs(item.vy) < 0.22)
    ) {
      item.settledFrames = Math.min(item.settledFrames + 1, 120);
    } else {
      item.settledFrames = Math.max(0, item.settledFrames - 2);
    }
  }

  const particleGrid = buildSpatialGrid(world.particles, particleCellSize);
  for (let i = 0; i < world.particles.length; i += 1) {
    const a = world.particles[i];
    forEachNearbyGridIndex(particleGrid, a.x, a.y, particleCellSize, (j) => {
      if (j <= i) {
        return;
      }
      const b = world.particles[j];
      if (a.sleeping && b.sleeping && a.clumpId !== 0 && a.clumpId === b.clumpId) {
        return;
      }
      if (
        world.zeroGTimer === 0 &&
        a.settledFrames > 18 &&
        b.settledFrames > 18 &&
        (world.frame + i + j) % 3 !== 0
      ) {
        return;
      }
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const minDistance = a.radius + b.radius;

      if (Math.abs(dx) >= minDistance || Math.abs(dy) >= minDistance) {
        return;
      }

      const distance = Math.hypot(dx, dy);

      if (!distance || distance >= minDistance) {
        return;
      }

      const overlap = (minDistance - distance) * 0.5;
      const nx = dx / distance;
      const ny = dy / distance;
      if (a.sleeping || b.sleeping) {
        wakeTrashItem(a);
        wakeTrashItem(b);
      }

      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;

      a.vx -= nx * 0.08;
      a.vy -= ny * 0.08;
      b.vx += nx * 0.08;
      b.vy += ny * 0.08;
    });
  }

  breakUpTrashCongestion();
  updateSleepingTrashState();
  updateTrashHeaps();
  packSleepingTrashIntoHeaps();
}

function tryCollectTrash() {
  if (
    world.gameOver ||
    world.intro.active ||
    !world.keys[" "] ||
    robot.cargo.length >= world.cargoCapacity ||
    world.fuel <= 0.01 ||
    world.maintenance.active
  ) {
    return;
  }

  const vacStats = getVacuumStats();
  const scoopX = robot.x + robot.direction * (robot.intakeReach + robot.intakeExtension * 18);
  const scoopY = world.floorY - 18;
  const suctionRange = vacStats.range + robot.intakeExtension * (upgradeActive("vacuum") ? 68 : 44);
  let collectedId = null;
  let nearestDistance = Infinity;

  for (const item of world.particles) {
    const distance = Math.hypot(item.x - scoopX, item.y - scoopY);

    if (!item.burning && distance < item.radius + vacStats.collectRadius && distance < nearestDistance) {
      nearestDistance = distance;
      collectedId = item.id;
    }

    if (
      vacStats.instantRadius > 0 &&
      !item.burning &&
      item.radius <= 6 &&
      distance < vacStats.instantRadius &&
      distance < nearestDistance
    ) {
      nearestDistance = distance;
      collectedId = item.id;
    }

    if (distance < suctionRange) {
      const pull = (suctionRange - distance) / suctionRange;
      const angle = Math.atan2(scoopY - item.y, scoopX - item.x);
      item.vx += Math.cos(angle) * vacStats.pull * pull;
      item.vy += Math.sin(angle) * vacStats.pull * pull;
      if (vacStats.entangle) {
        item.vx += Math.sin(world.frame * 0.12 + item.y * 0.03) * 0.05;
        item.vy -= 0.03;
      }
    }
  }

  if (!collectedId) {
    let heapTarget = null;
    let heapDistance = Infinity;
    for (const heap of world.trashHeaps) {
      const distance = Math.hypot(heap.x - scoopX, heap.y - scoopY);
      if (
        heap.members.length > 0 &&
        distance < vacStats.collectRadius + heap.width * 0.34 &&
        distance < heapDistance
      ) {
        heapDistance = distance;
        heapTarget = heap;
      }
    }
    if (heapTarget) {
      const member = heapTarget.members.pop();
      robot.cargo.push({
        color: member.color,
        trashType: member.trashType,
      });
      if (heapTarget.members.length > 0) {
        rebuildTrashHeap(heapTarget);
      } else {
        world.trashHeaps = world.trashHeaps.filter((heap) => heap.id !== heapTarget.id);
      }
      playSound("suction-hit");
    }
    return;
  }

  const remaining = [];
  for (const item of world.particles) {
    if (item.id === collectedId) {
      if (item.hazardous) {
        triggerMaintenance();
      }
      robot.cargo.push(item);
      playSound("suction-hit");
      continue;
    }
    remaining.push(item);
  }

  world.particles = remaining;
}

function spawnExhaust() {
  if (world.intro.active && world.intro.phase !== "wake") {
    return;
  }

  const shouldSpawn =
    robot.processState === "collecting" ||
    robot.processState === "warning" ||
    robot.processState === "ejecting";

  if (!shouldSpawn) {
    return;
  }

  const suctionBoost =
    world.keys[" "] &&
    robot.processState === "collecting" &&
    world.fuel > 0.01 &&
    !world.maintenance.active;
  const vacActive = upgradeActive("vacuum");
  const vacTier = getPowerupTier("vacuum");
  const autoPressActive = upgradeActive("autoPress");
  const upgradeCount = UPGRADE_DEFS.filter((upgrade) => upgradeActive(upgrade.key)).length;
  const hotUpgradeStack = upgradeCount >= 3;
  if (suctionBoost) {
    world.sound.suctionFrame += 1;
    if (world.sound.suctionFrame % 12 === 0) {
      playSound("suction");
    }
  } else {
    world.sound.suctionFrame = 0;
  }
  const baseChance = suctionBoost ? (vacActive ? 0.18 + vacTier * 0.03 : 0.26) : 0.55;
  const spawnChance = clamp(
    baseChance + (autoPressActive ? 0.2 : 0) + (hotUpgradeStack ? 0.1 : 0),
    0.1,
    0.95
  );

  if (Math.random() > spawnChance) {
    return;
  }

  const hotCompression =
    robot.processState === "warning" ||
    robot.processState === "ejecting";
  const anchor = getRobotExhaustAnchor();
  const sideX = -anchor.upY;
  const sideY = anchor.upX;
  const particleCount = autoPressActive ? 2 + (Math.random() < 0.38 ? 1 : 0) : hotUpgradeStack ? 2 : 1;
  for (let i = 0; i < particleCount; i += 1) {
    const lift = random(
      suctionBoost || autoPressActive ? (vacActive ? 1.9 : 1.45) : 0.8,
      suctionBoost || autoPressActive ? (vacActive ? 3.7 : 2.9) : 1.7
    );
    const spread = random(-0.7, 0.7) * (vacActive ? 1.35 : 1);
    world.exhaustParticles.push({
      x: anchor.x + sideX * random(-3.2, 3.2),
      y: anchor.y + sideY * random(-3.2, 3.2),
      vx: anchor.upX * lift + sideX * spread + robot.velocityX * 0.05,
      vy: anchor.upY * lift + sideY * spread,
      life: random(suctionBoost || autoPressActive ? (vacActive ? 66 : 54) : 28, suctionBoost || autoPressActive ? (vacActive ? 98 : 82) : 42),
      maxLife: suctionBoost || autoPressActive ? (vacActive ? 98 : 82) : 42,
      size: random(suctionBoost || autoPressActive ? (vacActive ? 7 : 5.5) : 4, suctionBoost || autoPressActive ? (vacActive ? 14 : 11) : 8),
      color: world.maintenance.active ? "#2f2f2f" : hotCompression ? "#ff6a57" : vacActive ? "#ff7777" : "#8fdfff",
      type: "smoke",
    });
  }

  if (!world.maintenance.active && (autoPressActive || hotUpgradeStack) && Math.random() < (autoPressActive ? 0.11 : 0.05)) {
    const flameLift = random(2.8, 4.4);
    const flameSpread = random(-0.38, 0.38);
    world.exhaustParticles.push({
      x: anchor.x + sideX * random(-2, 2),
      y: anchor.y + sideY * random(-2, 2),
      vx: anchor.upX * flameLift + sideX * flameSpread + robot.velocityX * 0.04,
      vy: anchor.upY * flameLift + sideY * flameSpread,
      life: random(16, 24),
      maxLife: 24,
      size: random(8, 13),
      color: hotCompression ? "#ffd06a" : "#ff9a5a",
      type: "flame",
    });
  }
}

function updateExhaust() {
  spawnExhaust();

  const next = [];
  for (const particle of world.exhaustParticles) {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.98;
    particle.vy -= 0.01;
    particle.life -= 1;

    if (particle.life > 0) {
      next.push(particle);
    }
  }

  world.exhaustParticles = next;
}

function triggerMaintenance(force = false) {
  if (world.maintenance.active || (!force && world.maintenance.cooldown > 0)) {
    return;
  }
  playSound("alarm");
  robot.processState = "collecting";
  robot.processTimer = 0;
  robot.rearHatchOpen = false;
  world.pressQueue = [];
  const pool = ["wheel", "stack", "sidePanel", "eye", "rearHatch", "lamp"];
  const count = 2 + Math.floor(Math.random() * 2);
  const missingParts = [];
  while (missingParts.length < count) {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (!missingParts.includes(pick)) {
      missingParts.push(pick);
    }
  }
  world.maintenance.active = true;
  world.maintenance.phase = "collect";
  world.maintenance.timer = 0;
  world.maintenance.blink = 0;
  world.maintenance.partsNeeded = missingParts.length;
  world.maintenance.missingParts = missingParts;
  world.maintenance.cooldown = 60 * 24;
  for (let i = 0; i < missingParts.length; i += 1) {
    const kind = missingParts[i];
    const side = Math.random() < 0.5 ? -1 : 1;
    const targetX = clamp(robot.x + side * random(130, 260), 70, world.width - 70);
    const targetY = random(world.floorY - 210, world.floorY - 120);
    world.repairParts.push({
      id: `repair-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 5)}`,
      kind,
      x: targetX + random(-18, 18),
      y: -100 - i * 48,
      targetX,
      targetY,
      vx: random(-0.18, 0.18),
      vy: random(0.3, 0.7),
      size:
        kind === "wheel" ? 18 :
        kind === "sidePanel" ? 20 :
        kind === "eye" ? 12 :
        kind === "stack" ? 14 :
        kind === "rearHatch" ? 16 : 12,
      rotation: random(-0.4, 0.4),
      spin: random(-0.04, 0.04),
      glowPhase: random(0, Math.PI * 2),
      blinkOffset: random(0, Math.PI * 2),
      arrival: 0,
      tireCount: kind === "wheel" ? 1 + Math.floor(Math.random() * 3) : 1,
      shape:
        kind === "wheel" ? "wheel" :
        kind === "eye" ? "eye" :
        kind === "stack" ? "stack" :
        kind === "lamp" ? "gauge" :
        kind === "rearHatch" ? "hatch" : "panel",
      repulse: kind === "sidePanel" ? 52 : kind === "wheel" ? 46 : 40,
    });
  }
}

function triggerRefuel() {
  if (world.refuel.active) {
    return;
  }
  world.refuel.active = true;
  world.refuel.phase = "descending";
  world.refuel.y = -120;
  world.refuel.timer = 240;
  showPowerupNotice("TANKT NACH", "#9feaff");
}

function triggerZeroG() {
  world.zeroGTimer = 240;
  world.zeroGCooldown = 980;
  world.loadHoldTimer = 180;
  world.controlLampRed = true;
  playSound("alarm");
}

function startFirebot(target) {
  if (!target || world.firebot.active) {
    return;
  }
  world.firebot.active = true;
  world.firebot.phase = "descending";
  world.firebot.x = target.x;
  world.firebot.y = -120;
  world.firebot.targetId = target.id;
  world.firebot.timer = 300;
}

function updateSystems() {
  if (world.gameOver) {
    return;
  }

  world.frame += 1;
  world.level = 1 + Math.floor(world.cubes / 10);
  const tuning = getLevelTuning(world.level);
  if (world.combo.timer > 0) {
    world.combo.timer -= 1;
    if (world.combo.timer === 0) {
      world.combo.count = 0;
    }
  }
  if (world.powerupNotice.timer > 0) {
    world.powerupNotice.timer -= 1;
  }
  if (world.powerupSignalTimer > 0) {
    world.powerupSignalTimer -= 1;
  }
  if (world.maintenance.cooldown > 0) {
    world.maintenance.cooldown -= 1;
  }
  updateUpgradeTimers();

  if (world.ship.thrustTimer > 0) {
    world.ship.thrustTimer -= 1;
    world.ship.accel += (1 - world.ship.accel) * 0.12;
    world.ship.thrustCooldown = 140;
    world.ship.tiltVelocity += (Math.random() - 0.5) * 0.0018;
    if (Math.random() < 0.08) {
      world.ship.shakeTimer = 6 + Math.floor(Math.random() * 8);
    }
  } else {
    world.ship.accel *= 0.9;
    if (world.ship.thrustCooldown > 0) {
      world.ship.thrustCooldown -= 1;
    } else if (Math.random() < tuning.thrustChance) {
      world.ship.thrustTimer = 40 + Math.floor(Math.random() * 90);
    }
  }

  world.ship.tiltVelocity += (0 - world.ship.tilt) * 0.014;
  world.ship.tiltVelocity *= 0.88;
  world.ship.tilt += world.ship.tiltVelocity;
  world.ship.tilt = clamp(world.ship.tilt, -0.05, 0.05);
  if (world.ship.shakeTimer > 0) {
    world.ship.shakeTimer -= 1;
  }

  if (world.zeroGTimer > 0) {
    world.zeroGTimer -= 1;
    world.controlLampRed = true;
  } else {
    world.controlLampRed = world.ship.thrustTimer > 0 && Math.sin(world.frame * 0.24) > 0.82;
    if (!tuning.zeroGUnlocked) {
      world.zeroGCooldown = Math.max(world.zeroGCooldown - 4, 240);
    } else if (world.zeroGCooldown > 0) {
      world.zeroGCooldown -= 1;
    } else if (Math.random() < 0.00032) {
      triggerZeroG();
    }
  }

  const fuelDrain =
    0.004 +
    Math.abs(robot.velocityX) * 0.003 +
    (world.keys[" "] ? 0.015 : 0);
  if (!world.refuel.active) {
    world.fuel = clamp(world.fuel - fuelDrain, 0, 100);
  }
  if (world.fuel <= 0.01 && !world.refuel.active) {
    triggerRefuel();
  }

  updateLoadState();
  const currentPressure = getCurrentPressure();
  updateFlowPhase(currentPressure);

  world.powerupSpawnTimer -= 1;
  if (world.powerupSpawnTimer <= 0) {
    const spawned = spawnRandomPowerupDrop();
    world.powerupSpawnTimer = spawned ? nextPowerupDelay() : Math.max(90, nextPowerupDelay() * 0.45);
  }

  const maintenanceChance =
    !tuning.maintenanceUnlocked ||
    world.maintenance.cooldown > 0 ||
    currentPressure < 0.72
      ? 0
      : 0.000004 +
        Math.max(0, world.level - 3) * 0.0000022 +
        Math.max(0, currentPressure - 0.72) * 0.000018 +
        (world.keys[" "] ? 0.000003 : 0) +
        Math.min(0.0000045, Math.abs(robot.velocityX) * 0.0000016);
  if (!world.maintenance.active && maintenanceChance > 0 && Math.random() < maintenanceChance) {
    triggerMaintenance();
  }

  const burningTarget = tuning.fireUnlocked
    ? world.particles.find((item) => item.burning)
    : null;
  if (tuning.fireUnlocked && !burningTarget && Math.random() < 0.00038 && world.particles.length > 0) {
    const target = world.particles[Math.floor(Math.random() * world.particles.length)];
    if (target && !target.hazardous) {
      target.burning = true;
    }
  }

  const needsFirebot = tuning.fireUnlocked ? world.particles.find((item) => item.burning) : null;
  if (needsFirebot && !world.firebot.active) {
    startFirebot(needsFirebot);
  }

  const autoPressTier = getPowerupTier("autoPress");
  if (!world.maintenance.active && autoPressTier > 0 && Math.floor(robot.cargo.length / 6) >= 1) {
    if (robot.processState === "collecting" && world.pressQueue.length === 0) {
      const queued = queuePressCycle({ mode: "auto" });
      if (queued) {
        const timings = getPressTimings();
        playSound("press");
        robot.processState = "warning";
        robot.processTimer = timings.warning;
      }
    } else if (
      autoPressTier >= 2 &&
      world.pressQueue.length === 0 &&
      robot.processState !== "collecting"
    ) {
      const tankUnit = 6;
      const readyCubes = Math.floor(robot.cargo.length / tankUnit);
      const tankTier = getPowerupTier("tank");
      const maxChunks = tankTier >= 3 ? 3 : tankTier >= 1 ? 2 : 1;
      const chunkCount = Math.min(autoPressTier >= 3 ? maxChunks : 1, readyCubes);
      if (chunkCount >= 1) {
        const pressedItems = robot.cargo.splice(0, chunkCount * tankUnit);
        for (let i = 0; i < chunkCount; i += 1) {
          const chunk = pressedItems.slice(i * tankUnit, (i + 1) * tankUnit);
          world.pressQueue.push({
            amount: chunk.length,
            source: "auto",
            autoBonus: autoPressTier >= 4,
            mosaic: chunk.map((item) => ({
              fill: item.color.fill,
              stroke: item.color.stroke,
            })),
          });
        }
      }
    }
  }
  if (world.overflowFrames > 18) {
    startGameOverSequence();
  }
}

function updateIntroSequence() {
  world.frame += 1;
  if (!world.intro.active) {
    return;
  }

  const targetY = world.floorY - 54;
  const targetFrontX = robot.x + 44;
  const targetRearX = robot.x - 56;
  if (world.intro.phase === "approach") {
    world.intro.frontX += (targetFrontX - world.intro.frontX) * 0.12;
    world.intro.rearX += (targetRearX - world.intro.rearX) * 0.12;
    if (
      Math.abs(world.intro.frontX - targetFrontX) < 3 &&
      Math.abs(world.intro.rearX - targetRearX) < 3
    ) {
      world.intro.phase = "descending";
    }
    return;
  }

  if (world.intro.phase === "descending") {
    world.intro.frontX += (targetFrontX - world.intro.frontX) * 0.08;
    world.intro.rearX += (targetRearX - world.intro.rearX) * 0.08;
    robot.y += (targetY - robot.y) * 0.1;
    world.intro.hookY = robot.y - 38;
    if (Math.abs(robot.y - targetY) < 2) {
      robot.y = targetY;
      world.intro.phase = "settled";
      world.intro.timer = 60;
      world.intro.hookY = robot.y - 38;
      robot.floatOffset = -6;
    }
    return;
  }

  if (world.intro.phase === "settled") {
    robot.floatOffset += (0 - robot.floatOffset) * 0.12;
    world.intro.hookY = robot.y - 38 + Math.sin(world.frame * 0.15) * 1.5;
    world.intro.timer -= 1;
    if (world.intro.timer <= 0) {
      world.intro.phase = "wake";
      world.intro.timer = 48;
    }
    return;
  }

  if (world.intro.phase === "wake") {
    robot.floatOffset += (0 - robot.floatOffset) * 0.14;
    world.intro.hookY += (-170 - world.intro.hookY) * 0.1;
    world.intro.timer -= 1;
    if (world.intro.timer === 46) {
      showPowerupNotice("Schicht startet", "#9feaff");
    }
    if (world.intro.timer <= 0) {
      world.intro.active = false;
      world.intro.phase = "idle";
    }
  }
}

function updateEndSequence() {
  if (!world.endSequence.active) {
    return;
  }

  world.frame += 1;
  if (world.powerupNotice.timer > 0) {
    world.powerupNotice.timer -= 1;
  }

  if (world.endSequence.phase === "smoke") {
    world.endSequence.timer -= 1;
    const anchors = [
      robotLocalToWorld(-30, -56),
      robotLocalToWorld(28, -48),
      robotLocalToWorld(86, 26),
      robotLocalToWorld(-66, 18),
      robotLocalToWorld(0, 4),
    ];
    for (const anchor of anchors) {
      if (Math.random() < 0.78) {
        world.exhaustParticles.push({
          x: anchor.x + random(-5, 5),
          y: anchor.y + random(-4, 4),
          vx: random(-0.5, 0.5),
          vy: random(-2.2, -0.8),
          life: random(30, 52),
          maxLife: 52,
          size: random(7, 15),
          color: "#1f1f1f",
          type: "smoke",
        });
      }
    }
    if (world.endSequence.timer <= 0) {
      world.endSequence.phase = "salvage";
      world.endSequence.timer = 140;
      world.endSequence.pieces = createRobotBreakPieces();
      playSound("alarm");
    }
    return;
  }

  if (world.endSequence.phase === "salvage") {
    world.endSequence.timer -= 1;
    for (const piece of world.endSequence.pieces) {
      piece.x += (piece.hookX - piece.x) * 0.18;
      piece.y += (piece.targetY - piece.y) * 0.16;
      piece.rotation += piece.spin;
    }
    if (world.endSequence.timer <= 0) {
      world.endSequence.phase = "done";
      world.endSequence.active = false;
    }
  }
}

function updateCubeVacuum() {
  const looseCubes = world.activeCubes.filter((cube) => !cube.attached && !cube.ejectedToSpace).length;
  if (!world.cubeVacuum.active) {
    if (!world.gameOver && looseCubes >= 10) {
      startCubeVacuumSweep();
    } else if (!world.gameOver && looseCubes > 0) {
      if (world.cubeVacuum.cooldown <= 0) {
        startCubeVacuumSweep();
      } else {
        world.cubeVacuum.cooldown -= 1;
      }
    } else if (world.cubeVacuum.cooldown > 0) {
      world.cubeVacuum.cooldown -= 1;
    } else {
      world.cubeVacuum.cooldown = 180 + Math.floor(random(0, 60));
    }
    return;
  }

  world.cubeVacuum.x += world.cubeVacuum.sweepSpeed;
  world.cubeVacuum.y = 82 + Math.sin(world.frame * 0.06) * 4;
  const nextCubes = [];
  for (const cube of world.activeCubes) {
    const oldEnough = world.frame - cube.spawnFrame > 12;
    const withinBeam =
      !cube.attached &&
      !cube.ejectedToSpace &&
      oldEnough &&
      Math.abs(cube.x - world.cubeVacuum.x) < 94 &&
      cube.y < world.floorY + 20;
    if (cube.vacuuming || withinBeam) {
      cube.vacuuming = true;
      const targetX = world.cubeVacuum.x;
      const targetY = world.cubeVacuum.y + 17;
      const dx = targetX - cube.x;
      const dy = targetY - cube.y;
      const distance = Math.hypot(dx, dy);
      const funnel = clamp(1 - distance / 180, 0, 1);
      cube.vx = cube.vx * 0.42 + dx * (0.07 + funnel * 0.12);
      cube.vy = cube.vy * 0.38 + dy * (0.065 + funnel * 0.14) - 0.1;
      cube.vacuumScale = clamp(distance / 180, 0.12, 1);
      cube.x += cube.vx;
      cube.y += cube.vy;
      if (distance < 42) {
        cube.x += (targetX - cube.x) * 0.38;
        cube.y += (targetY - cube.y) * 0.42;
      }
      cube.spin += dx * 0.0009 + cube.vx * 0.003;
      if (Math.abs(dx) < 8 && Math.abs(dy) < 10) {
        sendCubeToSpace(cube);
        continue;
      }
    }
    nextCubes.push(cube);
  }
  world.activeCubes = nextCubes;

  if (world.cubeVacuum.x > world.width + 180) {
    world.cubeVacuum.active = false;
    world.cubeVacuum.x = -180;
    world.cubeVacuum.cooldown = 180 + Math.floor(random(0, 60));
  }
}

function updateMaintenanceBot() {
  const bot = world.maintenance;
  if (!bot.active) {
    return;
  }
  bot.blink += 1;
  bot.timer += 1;
  if (world.repairParts.length === 0) {
    playSound("repair");
    bot.active = false;
    bot.phase = "idle";
    bot.timer = 0;
    bot.partsNeeded = 0;
    bot.missingParts = [];
    bot.cooldown = Math.max(bot.cooldown, 60 * 18);
  }
}

function updateRefuelBot() {
  const hose = world.refuel;
  if (!hose.active) {
    return;
  }

  if (hose.phase === "descending") {
    hose.y += (48 - hose.y) * 0.15;
    if (Math.abs(hose.y - 48) < 2) {
      hose.phase = "refueling";
    }
    return;
  }

  if (hose.phase === "refueling") {
    hose.timer -= 1;
    world.fuel = clamp(world.fuel + 0.55, 0, 100);
    if (hose.timer <= 0 || world.fuel >= 99.5) {
      hose.phase = "ascending";
    }
    return;
  }

  if (hose.phase === "ascending") {
    hose.y += (-120 - hose.y) * 0.15;
    if (hose.y < -110) {
      hose.active = false;
      hose.phase = "idle";
      showPowerupNotice("TANK VOLL", "#b7ff93");
    }
  }
}

function updateRepairParts() {
  if (world.repairParts.length === 0) {
    return;
  }

  const scoopX = robot.x + robot.direction * (robot.intakeReach + robot.intakeExtension * 18);
  const scoopY = world.floorY - 18;
  const nextParts = [];

  for (const part of world.repairParts) {
    part.glowPhase += 0.08;
    const bob = Math.sin(world.frame * 0.08 + part.glowPhase) * 1.2;
    if (part.arrival < 1) {
      part.arrival = Math.min(1, part.arrival + 0.018);
      part.x += (part.targetX - part.x) * 0.045;
      part.y += (part.targetY - part.y) * 0.032 + 0.18;
      part.vx *= 0.96;
      part.vy *= 0.92;
      part.rotation += part.spin * 0.7;
    } else {
      part.vy += world.gravity * 0.82;
      part.vx *= 0.992;
      part.x += part.vx;
      part.y += part.vy;
      part.rotation += part.spin;
      part.y += bob;
    }

    if (part.arrival >= 1 && part.y + part.size > world.floorY) {
      part.y = world.floorY - part.size;
      part.vy *= -0.22;
      part.vx *= 0.9;
    }

    if (part.x - part.size < 24) {
      part.x = 24 + part.size;
      part.vx *= -0.5;
    } else if (part.x + part.size > world.width - 24) {
      part.x = world.width - 24 - part.size;
      part.vx *= -0.5;
    }

    const distance = Math.hypot(part.x - scoopX, part.y - scoopY);
    if (part.arrival >= 1 && distance < 34) {
      continue;
    }

    for (const item of world.particles) {
      const dx = item.x - part.x;
      const dy = item.y - part.y;
      const partRadius = part.repulse || part.size;
      const minDistance = item.radius + partRadius;
      const gap = Math.hypot(dx, dy);
      if (!gap || gap >= minDistance) {
        continue;
      }
      const overlap = minDistance - gap;
      const nx = dx / gap;
      const ny = dy / gap;
      item.x += nx * overlap;
      item.y += ny * overlap;
      item.vx += nx * 0.18;
      item.vy += ny * 0.1;
    }

    for (const other of nextParts) {
      const dx = part.x - other.x;
      const dy = part.y - other.y;
      const gap = Math.hypot(dx, dy);
      const minDistance = (part.repulse || part.size) + (other.repulse || other.size);
      if (!gap || gap >= minDistance) {
        continue;
      }
      const overlap = (minDistance - gap) * 0.5;
      const nx = dx / gap;
      const ny = dy / gap;
      part.x += nx * overlap;
      part.y += ny * overlap;
      other.x -= nx * overlap;
      other.y -= ny * overlap;
    }

    nextParts.push(part);
  }

  world.repairParts = nextParts;
}

function updateHelperBot() {
  const helperTier = getPowerupTier("helper");
  const bots = [world.helperBot, world.helperBotWing];
  let collapseBonusGranted = false;

  for (let index = 0; index < bots.length; index += 1) {
    const bot = bots[index];
    if (!bot.active) {
      continue;
    }

    const floorY = world.floorY - 40;
    const hookOffset = 28;

    if (bot.phase === "incoming") {
      bot.craneX += (bot.targetX - bot.craneX) * 0.16;
      bot.x = bot.craneX;
      bot.y = bot.hookY + hookOffset;
      if (Math.abs(bot.craneX - bot.targetX) < 4) {
        bot.phase = "lowering";
      }
      continue;
    }

    if (bot.phase === "lowering") {
      bot.craneX += (bot.targetX - bot.craneX) * 0.14;
      bot.hookY += (floorY - hookOffset - bot.hookY) * 0.16;
      bot.x = bot.craneX;
      bot.y = bot.hookY + hookOffset;
      if (Math.abs(bot.y - floorY) < 3) {
        bot.phase = "working";
        bot.y = floorY;
        bot.hookY = bot.y - hookOffset;
      }
      continue;
    }

    if (bot.phase === "breaking") {
      bot.breakTimer -= 1;
      bot.intakePulse += 0.28;
      bot.vx *= 0.82;
      bot.x = clamp(bot.x + bot.vx, 96, world.width - 96);
      bot.y = floorY + Math.sin(world.frame * 0.9 + index) * 1.8;
      if (Math.random() < 0.45) {
        world.exhaustParticles.push({
          x: bot.x + bot.direction * -15,
          y: bot.y - 34,
          vx: random(-0.18, 0.18),
          vy: random(-1.4, -0.7),
          life: random(22, 34),
          maxLife: 34,
          size: random(3, 5),
          color: "#464646",
          type: "smoke",
        });
      }
      if (bot.breakTimer <= 0) {
        spawnHelperBotScrap(bot.x, bot.y - 8);
        bot.active = false;
        bot.phase = "idle";
        bot.targetId = null;
        if (helperTier >= 4 && !collapseBonusGranted) {
          world.upgradePoints += 5;
          showPowerupNotice("Buddy-Bot hinterlaesst Bonus-Schrott", "#9de7ff");
          collapseBonusGranted = true;
        }
      }
      continue;
    }

    const eligibleParticles = world.particles.filter(
      (item) => !item.burning && !item.hazardous && !item.attached
    );
    const eligibleHeaps = world.trashHeaps
      .filter((heap) => heap.members.length > 0)
      .map((heap) => ({
        id: heap.id,
        x: heap.x,
        y: heap.y,
        radius: Math.max(heap.width * 0.28, heap.height * 0.5),
        heap: true,
      }));
    const allTargets = eligibleParticles.concat(eligibleHeaps);
    let target =
      bot.targetId
        ? allTargets.find((item) => item.id === bot.targetId)
        : null;

    if (!target || world.frame % Math.max(8, 20 - helperTier * 3) === 0) {
      let bestScore = Infinity;
      for (const item of allTargets) {
        const dx = item.x - bot.x;
        const dy = item.y - bot.y;
        const distanceScore = Math.hypot(dx, dy);
        const crowdPenalty =
          item.heap
            ? -18
            : helperTier >= 3 ? 0 : (world.floorY - item.y) * 0.35;
        const score = distanceScore + crowdPenalty + Math.abs(index * 60 - dx) * 0.08;
        if (score < bestScore) {
          bestScore = score;
          target = item;
        }
      }
      bot.targetId = target ? target.id : null;
    }

    const idleTargetX = clamp(robot.x + (index === 0 ? 180 : 110), 140, world.width - 140);
    const moveTargetX = target ? clamp(target.x, 84, world.width - 84) : idleTargetX;
    const moveDelta = moveTargetX - bot.x;
    const speedCap = [2.7, 3.3, 4, 4.6, 5.2][Math.max(0, helperTier - 1)] || 2.7;
    bot.vx += clamp(moveDelta * (0.012 + helperTier * 0.002), -0.22 - helperTier * 0.05, 0.22 + helperTier * 0.05);
    bot.vx *= 0.86;
    bot.vx = clamp(bot.vx, -speedCap, speedCap);
    bot.x = clamp(bot.x + bot.vx, 84, world.width - 84);
    bot.direction = Math.abs(bot.vx) > 0.05 ? Math.sign(bot.vx) : bot.direction;

    const targetY =
      world.zeroGTimer > 0
        ? clamp(target ? target.y - 20 : floorY - 56, 86, floorY)
        : floorY;
    bot.y += (targetY - bot.y) * (world.zeroGTimer > 0 ? 0.08 : 0.22);
    bot.intakePulse += target ? 0.24 + Math.abs(bot.vx) * 0.08 : 0.08;
    if (Math.random() < 0.24 + helperTier * 0.03) {
      world.exhaustParticles.push({
        x: bot.x + bot.direction * -15,
        y: bot.y - 34,
        vx: random(-0.18, 0.18) + bot.vx * 0.04,
        vy: random(-1.25, -0.55),
        life: random(18, 28),
        maxLife: 28,
        size: random(2.6, 4.6),
        color: "#8fdfff",
        type: "smoke",
      });
    }

    const scoopX = bot.x + bot.direction * 44;
    const scoopY = bot.y + 2;
    const helperRange = 118 + Math.max(0, helperTier - 1) * 12;
    if (target) {
      const distance = Math.hypot(target.x - scoopX, target.y - scoopY);
      if (!target.heap && distance < helperRange) {
        const pull = (helperRange - distance) / helperRange;
        const angle = Math.atan2(scoopY - target.y, scoopX - target.x);
        target.vx += Math.cos(angle) * (0.3 + helperTier * 0.04) * pull;
        target.vy += Math.sin(angle) * (0.3 + helperTier * 0.04) * pull;
      }
      if (distance < target.radius + 22 + helperTier * 2) {
        bot.targetId = null;
        bot.collected += 1;
        if (target.heap) {
          const heap = world.trashHeaps.find((item) => item.id === target.id);
          if (!heap || heap.members.length === 0) {
            continue;
          }
          const member = heap.members.pop();
          if (helperTier >= 3 && heap.members.length > 0 && world.frame % 2 === 0) {
            releaseTrashHeapMembers(heap, Math.min(2, heap.members.length), bot.direction * 0.36, -0.14);
          }
          if (robot.cargo.length < world.cargoCapacity) {
            robot.cargo.push({
              color: member.color,
              trashType: member.trashType,
            });
          } else {
            world.upgradePoints += 1;
          }
          if (heap.members.length > 0) {
            rebuildTrashHeap(heap);
          } else {
            world.trashHeaps = world.trashHeaps.filter((item) => item.id !== heap.id);
          }
        } else {
          world.particles = world.particles.filter((item) => item.id !== target.id);
          if (robot.cargo.length < world.cargoCapacity) {
            robot.cargo.push({
              color: target.color,
              trashType: target.trashType,
            });
          } else {
            world.upgradePoints += 1;
          }
        }
        playSound("suction-hit");
      }
    }

    for (const item of world.particles) {
      const dx = item.x - bot.x;
      const dy = item.y - bot.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = item.radius + 28;
      if (!distance || distance >= minDistance) {
        continue;
      }
      const overlap = minDistance - distance;
      const nx = dx / distance;
      const ny = dy / distance;
      item.x += nx * overlap * 0.45;
      item.y += ny * overlap * 0.45;
      item.vx += nx * 0.18 + bot.vx * 0.08;
      item.vy += ny * 0.08;
    }

    if (helperTier >= 3) {
      for (const item of world.particles) {
        if (Math.abs(item.x - bot.x) < 120 && item.y + item.radius > world.floorY - 44) {
          item.vx += bot.direction * 0.06 * helperTier;
          item.vy -= 0.03 * helperTier;
        }
      }
    }
  }
}

function updateFirebot() {
  const bot = world.firebot;
  if (!bot.active) {
    return;
  }

  const target = world.particles.find((item) => item.id === bot.targetId);
  if (!target) {
    bot.phase = "ascending";
  }

  if (bot.phase === "descending" && target) {
    bot.x += (target.x - bot.x) * 0.12;
    bot.y += (88 - bot.y) * 0.14;
    if (Math.abs(bot.y - 88) < 2) {
      bot.phase = "extinguishing";
    }
    return;
  }

  if (bot.phase === "extinguishing" && target) {
    bot.timer -= 1;
    bot.x += (target.x - bot.x) * 0.08;
    if (bot.timer % 16 === 0) {
      target.burning = false;
    }
    if (bot.timer <= 0) {
      target.burning = false;
      bot.phase = "ascending";
    }
    return;
  }

  if (bot.phase === "ascending") {
    bot.y += (-120 - bot.y) * 0.14;
    if (bot.y < -110) {
      bot.active = false;
      bot.phase = "idle";
      bot.targetId = null;
    }
  }
}

function queuePressCycle(options = {}) {
  const tankUnit = 6;
  const readyCubes = Math.floor(robot.cargo.length / tankUnit);
  const mode = options.mode || "manual";
  const autoTier = mode === "auto" ? getPowerupTier("autoPress") : 0;
  const tankTier = getPowerupTier("tank");
  if (
    readyCubes < 1 ||
    robot.processState !== "collecting" ||
    world.pressQueue.length > 0
  ) {
    return false;
  }

  const maxChunks =
    tankTier >= 3 ? 3 :
    tankTier >= 1 ? 2 :
    1;
  const chunkCount = Math.min(
    readyCubes,
    mode === "auto" && autoTier < 3 ? 1 : maxChunks
  );
  const pressedItems = robot.cargo.splice(0, chunkCount * tankUnit);
  const chunks = [];

  for (let i = 0; i < chunkCount; i += 1) {
    chunks.push(pressedItems.slice(i * tankUnit, (i + 1) * tankUnit));
  }

  for (const chunk of chunks) {
    world.pressQueue.push({
      amount: chunk.length,
      source: mode,
      autoBonus: mode === "auto" && autoTier >= 4,
      mosaic: chunk.map((item) => ({
        fill: item.color.fill,
        stroke: item.color.stroke,
      })),
    });
  }
  return true;
}

function releaseCube() {
  if (world.pressQueue.length === 0) {
    return;
  }

  const batch = world.pressQueue.shift();
  const rearOffset = -robot.direction * 66;
  const pressTier = getPowerupTier("press");
  const tankTier = getPowerupTier("tank");
  const cubeSize = clamp(12 + batch.amount * 2.2, 14, 26);

  world.cubes += 1;
  playSound("cube");
  if (world.combo.timer > 0) {
    world.combo.count += 1;
  } else {
    world.combo.count = 1;
  }
  world.combo.timer = batch.autoBonus ? 320 : 240;
  world.upgradePoints += world.combo.count + (batch.autoBonus ? 1 : 0);
  if (world.cubes % 10 === 0) {
    world.levelBurstTimer = 40;
    playSound("levelup");
    for (let i = 0; i < 10; i += 1) {
      world.spaceCubes.push({
        x: world.porthole.x + random(18, 48),
        y: world.porthole.y + random(24, world.porthole.h - 24),
        size: random(7, 11),
        vx: random(0.08, 0.18),
        vy: random(-0.03, 0.03),
        rotation: random(0, Math.PI * 2),
        spin: random(-0.004, 0.004),
        life: 1600,
        baseFill: "#d5b879",
        baseStroke: "#7a6030",
        mosaic: batch.mosaic.length ? batch.mosaic : [{ fill: "#d5b879", stroke: "#7a6030" }],
      });
    }
  }
  const cube = {
    id: `cube-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    x: robot.x + rearOffset,
    y: world.floorY - cubeSize * 0.5,
    size: cubeSize,
    vx: -robot.direction * (1.7 + batch.amount * 0.16 + (pressTier >= 2 ? 0.8 : 0) + (pressTier >= 3 ? 0.8 : 0) + (tankTier >= 4 ? 0.9 : 0)),
    vy: -0.2,
    attached: false,
    picked: false,
    mosaic: batch.mosaic,
    rotation: 0,
    spin: -robot.direction * (0.012 + batch.amount * 0.002),
    spawnFrame: world.frame,
    ejectedToSpace: false,
    vacuuming: false,
    vacuumScale: 1,
  };
  world.activeCubes.push(cube);
}

function spawnHazardCrane() {
  if (world.cranes.length >= 15) {
    return false;
  }

  const hazard = world.particles.find((item) => item.hazardous && !item.burning && !item.picked);
  if (hazard) {
    hazard.picked = true;
    world.cranes.push({
      id: `crane-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "hazard",
      targetId: hazard.id,
      y: 50,
      x: hazard.x,
      targetX: hazard.x,
      targetY: hazard.y - 28,
      carrying: false,
      phase: "descending",
      homeX: world.width + 100,
    });
    return true;
  }
  return false;
}

function spawnCubeCrane(cube) {
  if (!cube || cube.ejectedToSpace || cube.picked || world.cranes.length >= 15) {
    return false;
  }
  cube.picked = true;
  world.cranes.push({
    id: `crane-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: "cube",
    cubeId: cube.id,
    y: 48,
    x: cube.x,
    targetX: cube.x,
    targetY: cube.y - 28,
    carrying: false,
    phase: "descending",
    homeX: world.width + 56,
  });
  return true;
}

function updateProcess() {
  if (robot.processState === "collecting") {
    robot.rearHatchOpen = false;
    if (world.pressQueue.length > 0) {
      const timings = getPressTimings();
      robot.processState = "warning";
      robot.processTimer = timings.warning;
    }
    return;
  }

  if (robot.processState === "warning") {
    robot.processTimer -= 1;
    if (robot.processTimer <= 0) {
      const timings = getPressTimings();
      robot.processState = "ejecting";
      robot.rearHatchOpen = true;
      robot.processTimer = timings.ejecting;
      releaseCube();
    }
    return;
  }

  if (robot.processState === "ejecting") {
    robot.processTimer -= 1;
    robot.rearHatchOpen = true;
    if (robot.processTimer <= 0) {
      if (getPowerupTier("press") >= 4 && world.pressQueue.length > 0) {
        robot.processState = "warning";
        robot.processTimer = 1;
      } else {
        robot.processState = "collecting";
        robot.rearHatchOpen = false;
      }
    }
  }
}

function findWaitingCube() {
  let oldestCube = null;
  for (const cube of world.activeCubes) {
    if (cube.attached || cube.picked || cube.ejectedToSpace) {
      continue;
    }
    if (!oldestCube || cube.spawnFrame < oldestCube.spawnFrame) {
      oldestCube = cube;
    }
  }
  return oldestCube;
}

function findLooseHazard() {
  for (const item of world.particles) {
    if (item.hazardous && !item.burning && !item.picked) {
      return item;
    }
  }
  return null;
}

function updateCubeAndCrane() {
  const currentGravity = world.zeroGTimer > 0 ? 0 : world.gravity * 0.8;
  const driveStats = getDriveStats();
  const cubeCellSize = 76;

  for (const cube of world.activeCubes) {
    if (cube.attached || cube.vacuuming) {
      cube.spin *= 0.88;
      cube.rotation += cube.spin;
      continue;
    }

    const cubeRadius = cube.size * 0.5;
    cube.vy += currentGravity;
    if (world.ship.accel > 0 && world.zeroGTimer === 0) {
      cube.vx -= world.ship.accel * 0.024;
    }
    if (world.ship.shakeTimer > 0 && world.zeroGTimer === 0) {
      cube.vx += Math.sin(world.frame * 1.6 + cube.rotation) * 0.02;
      cube.spin += Math.sin(world.frame * 1.1 + cube.x * 0.02) * 0.002;
    }
    cube.vx *= 0.994;
    cube.vy *= 0.998;
    cube.spin *= world.zeroGTimer > 0 ? 0.996 : 0.985;
    if (world.zeroGTimer > 0) {
      if (world.zeroGTimer > 250) {
        cube.vy -= 0.05;
      } else if (world.zeroGTimer < 75) {
        cube.vy += 0.08;
      } else {
        cube.vy += Math.sin(world.frame * 0.08 + cube.rotation) * 0.01;
      }
      cube.vx += Math.cos(world.frame * 0.05 + cube.rotation) * 0.006;
    }
    cube.x += cube.vx;
    cube.y += cube.vy;
    cube.rotation += cube.spin;

    if (world.zeroGTimer === 0 && cube.y + cube.size > world.floorY) {
      cube.y = world.floorY - cube.size;
      cube.vy *= -0.25;
      cube.vx *= 0.88;
      cube.spin += cube.vx * 0.012;
      if (Math.abs(cube.vy) < 0.45) {
        cube.spin *= 0.82;
        const snapped = Math.round(cube.rotation / (Math.PI * 0.5)) * (Math.PI * 0.5);
        cube.rotation += (snapped - cube.rotation) * 0.16;
      }
    }

    if (world.zeroGTimer > 0 && cube.y - cube.size * 0.5 < 26) {
      cube.y = 26 + cube.size * 0.5;
      cube.vy *= -0.18;
    }

    if (cube.x - cubeRadius < 24) {
      cube.x = 24 + cubeRadius;
      cube.vx *= -0.6;
      cube.spin += cube.vx * 0.02;
    } else if (cube.x + cubeRadius > world.width - 24) {
      cube.x = world.width - 24 - cubeRadius;
      cube.vx *= -0.6;
      cube.spin += cube.vx * 0.02;
    }

    const dxRobot = cube.x - robot.x;
    const dyRobot = cube.y - (robot.y + robot.floatOffset + 6);
    const halfWidth = driveStats.halfWidth;
    const halfHeight = 34;
    const nearX = clamp(dxRobot, -halfWidth, halfWidth);
    const nearY = clamp(dyRobot, -halfHeight, halfHeight);
    const diffX = dxRobot - nearX;
    const diffY = dyRobot - nearY;
    const distanceRobot = Math.hypot(diffX, diffY);

    if (distanceRobot < cubeRadius + 2) {
      const safeDistance = distanceRobot || 0.001;
      const push = cubeRadius + 2 - safeDistance;
      const nx = diffX / safeDistance;
      const ny = diffY / safeDistance;
      cube.x += nx * push;
      cube.y += ny * push;
      cube.vx += nx * (0.4 + Math.abs(robot.velocityX) * 0.16) + robot.velocityX * 0.06;
      cube.vy += ny * 0.16;
      cube.spin += (nx * 0.02 + cube.vx * 0.006) * Math.sign(ny || 1);
    }
  }

  const cubeGrid = buildSpatialGrid(world.activeCubes, cubeCellSize);
  for (let i = 0; i < world.activeCubes.length; i += 1) {
    const a = world.activeCubes[i];
    forEachNearbyGridIndex(cubeGrid, a.x, a.y, cubeCellSize, (j) => {
      if (j <= i) {
        return;
      }
      const b = world.activeCubes[j];
      if (a.attached || b.attached || a.vacuuming || b.vacuuming) {
        return;
      }

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const minDistance = a.size * 0.5 + b.size * 0.5;

      if (Math.abs(dx) >= minDistance || Math.abs(dy) >= minDistance) {
        return;
      }

      const distance = Math.hypot(dx, dy);

      if (!distance || distance >= minDistance) {
        return;
      }

      const overlap = (minDistance - distance) * 0.5;
      const nx = dx / distance;
      const ny = dy / distance;

      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;

      a.vx -= nx * 0.12;
      a.vy -= ny * 0.12;
      b.vx += nx * 0.12;
      b.vy += ny * 0.12;
      a.spin -= (ny * 0.012 + a.vx * 0.004);
      b.spin += (ny * 0.012 + b.vx * 0.004);
    });
  }

  const particleGrid = buildSpatialGrid(world.particles, cubeCellSize);
  for (const cube of world.activeCubes) {
    if (cube.attached || cube.vacuuming) {
      continue;
    }

    const cubeRadius = cube.size * 0.5;
    forEachNearbyGridIndex(particleGrid, cube.x, cube.y, cubeCellSize, (itemIndex) => {
      const item = world.particles[itemIndex];
      if (item.attached) {
        return;
      }

      const dx = item.x - cube.x;
      const dy = item.y - cube.y;
      const minDistance = cubeRadius + item.radius;

      if (Math.abs(dx) >= minDistance || Math.abs(dy) >= minDistance) {
        return;
      }

      const distance = Math.hypot(dx, dy);

      if (!distance || distance >= minDistance) {
        return;
      }

      const overlap = minDistance - distance;
      const nx = dx / distance;
      const ny = dy / distance;
      const cubeShare = item.radius / (cubeRadius + item.radius);
      const itemShare = cubeRadius / (cubeRadius + item.radius);
      if (item.sleeping) {
        wakeTrashItem(item);
      }

      cube.x -= nx * overlap * cubeShare;
      cube.y -= ny * overlap * cubeShare;
      item.x += nx * overlap * itemShare;
      item.y += ny * overlap * itemShare;

      cube.vx -= nx * 0.14;
      cube.vy -= ny * 0.12;
      item.vx += nx * 0.18;
      item.vy += ny * 0.14;
      cube.spin -= ny * 0.014 + cube.vx * 0.004;
      item.spin += nx * 0.01;
    });
  }

  const remainingCubes = [];
  for (const cube of world.activeCubes) {
    if (cube.x > world.width + 70 || cube.y > world.height + 50) {
      sendCubeToSpace(cube);
    } else {
      remainingCubes.push(cube);
    }
  }
  world.activeCubes = remainingCubes;
  world.cranes = [];
}

function updateSpaceCubes() {
  if (world.levelBurstTimer > 0) {
    world.levelBurstTimer -= 1;
  }

  world.spaceTrafficTimer -= 1;
  if (world.spaceTrafficTimer <= 0) {
    const kinds = [
      { type: "freighter", y: random(44, world.porthole.h - 44), size: random(54, 80), vx: random(-1.3, -0.72), color: "#9faab4" },
      { type: "debrisTrain", y: random(36, world.porthole.h - 36), size: random(34, 56), vx: random(-0.9, -0.46), color: "#cbb88d" },
      { type: "antenna", y: random(30, world.porthole.h - 30), size: random(44, 68), vx: random(-1.1, -0.58), color: "#b4c7d8" },
      { type: "station", y: random(40, world.porthole.h - 40), size: random(64, 92), vx: random(-0.65, -0.32), color: "#c6d2dc" },
      { type: "shuttle", y: random(34, world.porthole.h - 34), size: random(40, 60), vx: random(-1.4, -0.82), color: "#f0e0c6" },
      { type: "planet", y: random(58, world.porthole.h - 58), size: random(70, 110), vx: random(-0.28, -0.14), color: "#7697c7" },
      { type: "moon", y: random(44, world.porthole.h - 44), size: random(42, 66), vx: random(-0.4, -0.18), color: "#cfd6d9" },
      { type: "scrapCloud", y: random(34, world.porthole.h - 34), size: random(36, 56), vx: random(-1.1, -0.54), color: "#9d8c6b" },
      { type: "alien", y: random(40, world.porthole.h - 40), size: random(28, 42), vx: random(-1.2, -0.64), color: "#9df7a0" },
    ];
    const pick = kinds[Math.floor(Math.random() * kinds.length)];
    world.spaceTraffic.push({
      ...pick,
      x: world.porthole.w + pick.size * 1.6,
      rotation: random(-0.18, 0.18),
      spin: random(-0.003, 0.003),
    });
    world.spaceTrafficTimer = 360 + Math.floor(random(180, 520));
  }

  for (const star of world.starfield.stars) {
    star.x -= star.speed;
    if (star.x < -86) {
      star.x = 86;
      star.y = random(-56, 56);
    }
  }

  const nextTraffic = [];
  for (const traffic of world.spaceTraffic) {
    traffic.x += traffic.vx;
    traffic.rotation += traffic.spin;
    if (traffic.x > -traffic.size * 1.8) {
      nextTraffic.push(traffic);
    }
  }
  world.spaceTraffic = nextTraffic;

  const next = [];
  for (const cube of world.spaceCubes) {
    cube.x += cube.vx;
    cube.y += cube.vy;
    cube.rotation += cube.spin;
    cube.life -= 1;

    if (
      cube.x > world.porthole.x - 24 &&
      cube.x < world.porthole.x + world.porthole.w + 24 &&
      cube.y > world.porthole.y - 24 &&
      cube.y < world.porthole.y + world.porthole.h + 24 &&
      cube.life > 0
    ) {
      next.push(cube);
    }
  }
  world.spaceCubes = next.length > 90 ? next.slice(next.length - 90) : next;
}

function updateUpgradeDrops() {
  const scoopX = robot.x + robot.direction * (robot.intakeReach + robot.intakeExtension * 18);
  const scoopY = world.floorY - 18;
  const suctionRange = 92 + robot.intakeExtension * 44;
  const nextDrops = [];

  for (const drop of world.upgradeDrops) {
    drop.vy += world.gravity * 0.85;
    drop.vx *= 0.992;
    drop.x += drop.vx;
    drop.y += drop.vy;
    drop.rotation += drop.spin;

    if (drop.y + drop.size > world.floorY) {
      drop.y = world.floorY - drop.size;
      drop.vy *= -0.2;
      drop.vx *= 0.92;
    }

    const distance = Math.hypot(drop.x - scoopX, drop.y - scoopY);
    if (world.keys[" "] && distance < suctionRange) {
      const pull = (suctionRange - distance) / suctionRange;
      const angle = Math.atan2(scoopY - drop.y, scoopX - drop.x);
      drop.vx += Math.cos(angle) * 0.26 * pull;
      drop.vy += Math.sin(angle) * 0.26 * pull;
    }

    if (distance < drop.size + 24) {
      activateUpgrade(drop.key);
      continue;
    }

    nextDrops.push(drop);
  }

  world.upgradeDrops = nextDrops;
}

function updateRefillPipe() {
  if (world.gameOver || world.intro.active) {
    return;
  }

  const pipe = world.refillPipe;
  if (pipe.active) {
    if (pipe.phase === "descending") {
      pipe.y += (pipe.targetY - pipe.y) * 0.2;
      if (Math.abs(pipe.y - pipe.targetY) < 2) {
        pipe.y = pipe.targetY;
        pipe.phase = "dumping";
        pipe.timer = 18;
      }
      return;
    }

    if (pipe.phase === "dumping") {
      pipe.timer -= 1;
      if (!pipe.spawned && pipe.timer <= 12) {
        spawnTrash(nextTrashBatchSize(), "pipe", pipe.x);
        playSound("trash-drop");
        pipe.spawned = true;
      }
      if (pipe.timer <= 0) {
        pipe.phase = "ascending";
      }
      return;
    }

    if (pipe.phase === "ascending") {
      pipe.y += (-120 - pipe.y) * 0.18;
      if (pipe.y < -110) {
        pipe.active = false;
        pipe.phase = "idle";
        pipe.timer = 0;
        pipe.spawned = false;
        world.spawnTimer = randomSpawnDelay(world.level, getFlowRelief());
      }
      return;
    }
  }

  if (world.spawnPauseTimer > 0) {
    world.spawnPauseTimer -= 1;
    if (world.spawnPauseTimer === 0) {
      world.spawnTimer = randomSpawnDelay(world.level, getFlowRelief());
      world.spawnRollTimer = 120;
    }
    return;
  }

  world.spawnRollTimer -= 1;
  if (world.spawnRollTimer <= 0) {
    const pressure = getCurrentPressure();
    const relief = getFlowRelief(pressure);
    const flow = getFlowProfile();
    const diceRoll = 1 + Math.floor(Math.random() * 6);
    world.spawnRollTimer = 120;
    const pauseThreshold =
      flow.pauseShift > 0
        ? relief > 0.38 ? 4 : 5
        : flow.pauseShift < 0
          ? 6
          : relief > 0.72 ? 4 : relief > 0.38 ? 5 : 6;
    if (diceRoll >= pauseThreshold) {
      scheduleTrashPause(pressure);
      return;
    }
  }

  world.spawnTimer -= 1;
  if (world.spawnTimer <= 0) {
    triggerRefillPipe();
  }
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, world.height);
  sky.addColorStop(0, "#617d89");
  sky.addColorStop(0.35, "#49636a");
  sky.addColorStop(1, "#24312d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, world.width, world.height);

  const ceilingGlow = ctx.createRadialGradient(world.width * 0.5, 84, 24, world.width * 0.5, 84, 360);
  ceilingGlow.addColorStop(0, "rgba(176, 225, 255, 0.16)");
  ceilingGlow.addColorStop(1, "rgba(176, 225, 255, 0)");
  ctx.fillStyle = ceilingGlow;
  ctx.fillRect(0, 0, world.width, 260);

  ctx.fillStyle = "#31443a";
  ctx.fillRect(0, world.floorY - 90, world.width, 90);
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(0, world.floorY - 30, world.width, 30);

  ctx.fillStyle = "rgba(180, 230, 255, 0.05)";
  ctx.beginPath();
  ctx.moveTo(210, 98);
  ctx.lineTo(320, world.floorY - 40);
  ctx.lineTo(430, world.floorY - 40);
  ctx.lineTo(336, 98);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(860, 104);
  ctx.lineTo(954, world.floorY - 30);
  ctx.lineTo(1064, world.floorY - 30);
  ctx.lineTo(984, 104);
  ctx.closePath();
  ctx.fill();

  if (world.levelBurstTimer > 0) {
    const flashAlpha = world.levelBurstTimer / 40;
    ctx.fillStyle = `rgba(255, 219, 120, ${0.08 * flashAlpha})`;
    ctx.fillRect(0, 0, world.width, world.height);
  }

  ctx.fillStyle = "#6b737b";
  ctx.fillRect(0, world.floorY, world.width, world.height - world.floorY);
  const floorSheen = ctx.createLinearGradient(0, world.floorY, 0, world.height);
  floorSheen.addColorStop(0, "rgba(255,255,255,0.1)");
  floorSheen.addColorStop(0.16, "rgba(255,255,255,0)");
  floorSheen.addColorStop(1, "rgba(0,0,0,0.14)");
  ctx.fillStyle = floorSheen;
  ctx.fillRect(0, world.floorY, world.width, world.height - world.floorY);
  for (let i = 0; i < 7; i += 1) {
    const plateX = i * 188 - 28;
    ctx.fillStyle = i % 2 === 0 ? "#767f87" : "#636c74";
    ctx.fillRect(plateX, world.floorY + 2, 180, 108);
    ctx.strokeStyle = "rgba(22, 28, 32, 0.42)";
    ctx.lineWidth = 2;
    ctx.strokeRect(plateX, world.floorY + 2, 180, 108);
    for (let j = 0; j < 4; j += 1) {
      const rivetX = plateX + 18 + j * 46;
      ctx.fillStyle = "#c6ccd2";
      ctx.beginPath();
      ctx.arc(rivetX, world.floorY + 16, 3, 0, Math.PI * 2);
      ctx.arc(rivetX, world.floorY + 92, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(140, 77, 39, 0.22)";
    ctx.fillRect(plateX + 10, world.floorY + 72, 38, 14);
    ctx.fillRect(plateX + 126, world.floorY + 24, 24, 10);
    ctx.fillStyle = "rgba(89, 45, 22, 0.18)";
    ctx.fillRect(plateX + 22, world.floorY + 84, 22, 6);
  }

  for (let i = 0; i < 8; i += 1) {
    const rustX = 56 + i * 112;
    ctx.fillStyle = "rgba(134, 72, 36, 0.16)";
    ctx.beginPath();
    ctx.arc(rustX, 206 + (i % 3) * 44, 10 + (i % 2) * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(88, 42, 20, 0.12)";
    ctx.beginPath();
    ctx.arc(rustX + 8, 210 + (i % 3) * 44, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  drawShipStructure();
  drawPorthole(world.porthole);

  for (let i = 0; i < 8; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.014)" : "rgba(0,0,0,0.02)";
    ctx.fillRect(i * 180 - 20, world.floorY + 16, 120, 54);
  }

  const levelPanelX = world.width - 96;
  const levelPanelY = 24;
  const progress = world.cubes % 10;
  ctx.fillStyle = "rgba(255,255,255,0.06)";
  ctx.fillRect(levelPanelX, levelPanelY, 82, 238);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(levelPanelX, levelPanelY, 82, 238);
  ctx.fillStyle = "#e8ede2";
  ctx.font = "700 16px Trebuchet MS";
  ctx.fillText(`L ${world.level}`, levelPanelX + 16, levelPanelY + 22);
  ctx.fillStyle = "#b7c7c4";
  ctx.font = "700 12px Trebuchet MS";
  ctx.fillText("NEXT", levelPanelX + 16, levelPanelY + 40);
  for (let i = 0; i < 10; i += 1) {
    ctx.fillStyle = i < progress ? "#66d8ff" : "#1f3340";
    ctx.fillRect(levelPanelX + 30, levelPanelY + 214 - i * 17, 20, 11);
    ctx.strokeStyle = i < progress ? "#9feaff" : "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.strokeRect(levelPanelX + 30, levelPanelY + 214 - i * 17, 20, 11);
  }

  const loadDanger = world.loadRatio > 0.78;
  const loadCritical = world.loadRatio > 0.94;
  ctx.setLineDash([14, 10]);
  ctx.strokeStyle = loadCritical
    ? (Math.sin(world.frame * 0.25) > 0 ? "rgba(255, 72, 72, 1)" : "rgba(255, 188, 120, 0.95)")
    : loadDanger
      ? "rgba(255, 152, 92, 0.98)"
      : "rgba(255, 120, 88, 0.95)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(34, world.maxLoadY);
  ctx.lineTo(world.width - 34, world.maxLoadY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = loadCritical
    ? "rgba(255, 232, 220, 1)"
    : "rgba(255, 244, 224, 0.98)";
  ctx.font = "700 24px Trebuchet MS";
  ctx.fillText("MAX. LOAD", 48, world.maxLoadY - 14);
  ctx.strokeStyle = "rgba(30, 14, 12, 0.6)";
  ctx.lineWidth = 2;
  ctx.strokeText("MAX. LOAD", 48, world.maxLoadY - 14);
  ctx.fillStyle = loadCritical ? "#ffd0c9" : loadDanger ? "#ffd9aa" : "#d9e6df";
  ctx.font = "700 14px Trebuchet MS";
  ctx.fillText(`LOAD ${Math.round(world.loadRatio * 100)}%`, 52, world.maxLoadY + 20);

  drawGravityMonitor();
  drawPowerupBeacon();
  drawPowerupNotice();

  if (world.levelBurstTimer > 0) {
    const announceAlpha = world.levelBurstTimer / 40;
    const bannerW = 240;
    const bannerH = 42;
    const bannerX = world.width * 0.5 - bannerW * 0.5;
    const bannerY = 74;
    ctx.fillStyle = `rgba(34, 41, 36, ${0.68 * announceAlpha})`;
    ctx.fillRect(bannerX, bannerY, bannerW, bannerH);
    ctx.strokeStyle = `rgba(245, 207, 102, ${0.9 * announceAlpha})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);
    ctx.fillStyle = `rgba(255, 236, 184, ${announceAlpha})`;
    ctx.font = "700 18px Trebuchet MS";
    ctx.fillText(`LEVEL ${world.level}`, bannerX + 78, bannerY + 26);
  }

  ctx.fillStyle = world.controlLampRed ? "#ff5f57" : "#63d978";
  ctx.beginPath();
  ctx.arc(world.width - 42, 144, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(8, 10, 12, 0.55)";
  ctx.lineWidth = 3;
  ctx.stroke();

  if (world.spawnPauseTimer > 0 && !world.gameOver) {
    ctx.fillStyle = "rgba(18, 26, 30, 0.74)";
    ctx.fillRect(world.width * 0.5 - 104, 86, 208, 28);
    ctx.strokeStyle = "rgba(245, 214, 129, 0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(world.width * 0.5 - 104, 86, 208, 28);
    ctx.fillStyle = "#ffe3a6";
    ctx.font = "700 12px Trebuchet MS";
    ctx.fillText("kurze Muellpause", world.width * 0.5 - 48, 105);
  }

  if ((world.zeroGTimer > 0 || world.loadHoldTimer > 0) && !world.gameOver) {
    ctx.fillStyle = "rgba(18, 26, 30, 0.76)";
    ctx.fillRect(world.width * 0.5 - 132, world.maxLoadY - 44, 264, 24);
    ctx.strokeStyle = "rgba(255, 134, 108, 0.48)";
    ctx.lineWidth = 2;
    ctx.strokeRect(world.width * 0.5 - 132, world.maxLoadY - 44, 264, 24);
    ctx.fillStyle = "#ffd7c6";
    ctx.font = "700 11px Trebuchet MS";
    ctx.fillText("LOAD-SCAN OFFLINE BIS DER MUELL WIEDER LIEGT", world.width * 0.5 - 118, world.maxLoadY - 28);
  }

  if (world.gameOver && (!world.endSequence.active || world.endSequence.phase === "done")) {
    ctx.fillStyle = "rgba(10, 14, 18, 0.58)";
    ctx.fillRect(0, 0, world.width, world.height);
    ctx.fillStyle = "rgba(95, 18, 18, 0.78)";
    ctx.fillRect(world.width * 0.5 - 180, world.height * 0.5 - 42, 360, 84);
    ctx.strokeStyle = "#ff8a7f";
    ctx.lineWidth = 3;
    ctx.strokeRect(world.width * 0.5 - 180, world.height * 0.5 - 42, 360, 84);
    ctx.fillStyle = "#ffe5de";
    ctx.font = "700 26px Trebuchet MS";
    ctx.fillText("BAY OVERLOADED", world.width * 0.5 - 112, world.height * 0.5 - 6);
    ctx.font = "700 14px Trebuchet MS";
    ctx.fillText("R fuer Neustart", world.width * 0.5 - 54, world.height * 0.5 + 22);
  }
}

function drawShipStructure() {
  ctx.strokeStyle = "rgba(164, 189, 203, 0.18)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i += 1) {
    const ribX = 84 + i * 180;
    ctx.beginPath();
    ctx.moveTo(ribX, 0);
    ctx.lineTo(ribX, world.floorY - 96);
    ctx.stroke();
  }

  ctx.fillStyle = "#58656d";
  ctx.fillRect(0, 54, world.width, 18);
  ctx.fillRect(0, 88, world.width, 10);
  ctx.strokeStyle = "rgba(28, 34, 38, 0.42)";
  ctx.strokeRect(0, 54, world.width, 18);
  ctx.strokeRect(0, 88, world.width, 10);

  ctx.fillStyle = "#7c7c76";
  ctx.fillRect(32, 112, 240, 68);
  ctx.strokeStyle = "#4c4e4b";
  ctx.lineWidth = 2;
  ctx.strokeRect(32, 112, 240, 68);

  const rustSpots = [
    { x: 46, y: 122, r: 7 },
    { x: 82, y: 168, r: 5 },
    { x: 214, y: 120, r: 6 },
    { x: 248, y: 160, r: 8 },
    { x: 150, y: 148, r: 4 },
  ];
  for (const spot of rustSpots) {
    ctx.fillStyle = "rgba(149, 84, 42, 0.34)";
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(88, 44, 20, 0.28)";
    ctx.beginPath();
    ctx.arc(spot.x + 2, spot.y + 1, Math.max(2, spot.r * 0.45), 0, Math.PI * 2);
    ctx.fill();
  }

  const bolts = [
    [42, 122],
    [262, 122],
    [42, 170],
    [262, 170],
  ];
  for (const [bx, by] of bolts) {
    ctx.fillStyle = "#c8cbc8";
    ctx.beginPath();
    ctx.arc(bx, by, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5b605d";
    ctx.beginPath();
    ctx.moveTo(bx - 2, by - 2);
    ctx.lineTo(bx + 2, by + 2);
    ctx.moveTo(bx + 2, by - 2);
    ctx.lineTo(bx - 2, by + 2);
    ctx.stroke();
  }

  ctx.fillStyle = "#d7d6cc";
  ctx.font = "700 20px Trebuchet MS";
  ctx.fillText("WASTE HANDLING BAY", 48, 140);
  ctx.fillStyle = "#9fa9a5";
  ctx.font = "700 13px Trebuchet MS";
  ctx.fillText("DECK C / STARBOARD SERVICE", 48, 160);

  ctx.fillStyle = "#5f6766";
  ctx.fillRect(292, 118, 64, 64);
  ctx.strokeStyle = "#353c3b";
  ctx.strokeRect(292, 118, 64, 64);
  ctx.fillStyle = "#cf4339";
  ctx.beginPath();
  ctx.arc(324, 144, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#6e1914";
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = "#b12821";
  ctx.fillRect(318, 144, 12, 16);
  ctx.fillStyle = "#d7dbd9";
  ctx.font = "700 11px Trebuchet MS";
  ctx.fillText("EMERGENCY", 297, 172);

  for (let i = 0; i < 5; i += 1) {
    const stainX = 364 + i * 70;
    ctx.fillStyle = "rgba(142, 80, 41, 0.2)";
    ctx.fillRect(stainX, 62 + (i % 2) * 18, 18, 28);
    ctx.fillStyle = "rgba(91, 44, 20, 0.14)";
    ctx.fillRect(stainX + 4, 84 + (i % 2) * 18, 8, 20);
  }

  const statusX = world.porthole.x - 118;
  const statusY = world.porthole.y + 18;
  const broken = world.maintenance.active;
  const showWrench = broken && Math.sin(world.maintenance.blink * 0.35) > -0.1;
  ctx.fillStyle = "rgba(24, 31, 35, 0.72)";
  ctx.fillRect(statusX, statusY, 78, 78);
  ctx.strokeStyle = "rgba(170, 196, 202, 0.24)";
  ctx.lineWidth = 2;
  ctx.strokeRect(statusX, statusY, 78, 78);
  if (showWrench) {
    ctx.strokeStyle = "#ffbc84";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(statusX + 28, statusY + 54);
    ctx.lineTo(statusX + 48, statusY + 34);
    ctx.moveTo(statusX + 45, statusY + 26);
    ctx.lineTo(statusX + 55, statusY + 36);
    ctx.moveTo(statusX + 41, statusY + 30);
    ctx.lineTo(statusX + 50, statusY + 21);
    ctx.stroke();
  } else {
    ctx.strokeStyle = "#8bf59f";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(statusX + 22, statusY + 41);
    ctx.lineTo(statusX + 33, statusY + 52);
    ctx.lineTo(statusX + 56, statusY + 28);
    ctx.stroke();
  }
}

function drawPorthole(porthole) {
  const driftX = world.ship.accel > 0.02 ? -18 * world.ship.accel : robot.velocityX * -0.35;
  const driftY = world.zeroGTimer > 0 ? Math.sin(world.frame * 0.05) * 3 : Math.sin(world.frame * 0.01) * 0.6;

  ctx.save();
  ctx.beginPath();
  ctx.rect(porthole.x, porthole.y, porthole.w, porthole.h);
  ctx.clip();

  const spaceGrad = ctx.createRadialGradient(
    porthole.x + porthole.w * 0.58,
    porthole.y + porthole.h * 0.46,
    24,
    porthole.x + porthole.w * 0.58,
    porthole.y + porthole.h * 0.46,
    porthole.w * 0.78
  );
  spaceGrad.addColorStop(0, "#0c1018");
  spaceGrad.addColorStop(0.55, "#05080e");
  spaceGrad.addColorStop(1, "#010204");
  ctx.fillStyle = spaceGrad;
  ctx.fillRect(porthole.x, porthole.y, porthole.w, porthole.h);

  ctx.fillStyle = "rgba(140, 180, 255, 0.05)";
  ctx.beginPath();
  ctx.ellipse(
    porthole.x + porthole.w * 0.78,
    porthole.y + porthole.h * 0.26,
    porthole.w * 0.28,
    porthole.h * 0.2,
    -0.35,
    0,
    Math.PI * 2
  );
  ctx.fill();

  for (const star of world.starfield.stars) {
    const depthScale = star.depth === "far" ? 0.7 : star.depth === "mid" ? 1.15 : 1.7;
    const sx = porthole.x + porthole.w * 0.5 + star.x * depthScale + driftX * (star.depth === "near" ? 1 : star.depth === "mid" ? 0.55 : 0.22);
    const sy = porthole.y + porthole.h * 0.5 + star.y * (depthScale * 0.78) + driftY * (star.depth === "near" ? 0.45 : star.depth === "mid" ? 0.28 : 0.15);
    ctx.fillStyle =
      star.depth === "far"
        ? "rgba(180, 205, 240, 0.55)"
        : star.depth === "mid"
          ? "#d7e7ff"
          : "#fff1bf";
    ctx.beginPath();
    ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const traffic of world.spaceTraffic) {
    const tx = porthole.x + traffic.x;
    const ty = porthole.y + traffic.y;
    ctx.save();
    ctx.translate(tx, ty);
    ctx.rotate(traffic.rotation);
    if (traffic.type === "freighter") {
      ctx.fillStyle = traffic.color;
      ctx.strokeStyle = "#3f4c56";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-traffic.size * 0.8, -traffic.size * 0.18, traffic.size * 1.6, traffic.size * 0.36, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#718795";
      ctx.fillRect(-traffic.size * 0.2, -traffic.size * 0.34, traffic.size * 0.56, traffic.size * 0.16);
      ctx.fillRect(-traffic.size * 0.62, -traffic.size * 0.08, traffic.size * 0.22, traffic.size * 0.16);
      ctx.fillStyle = "rgba(160, 214, 255, 0.46)";
      ctx.fillRect(traffic.size * 0.36, -traffic.size * 0.06, traffic.size * 0.18, traffic.size * 0.12);
    } else if (traffic.type === "debrisTrain") {
      ctx.fillStyle = traffic.color;
      for (let i = -2; i <= 2; i += 1) {
        ctx.fillRect(i * traffic.size * 0.28, -traffic.size * 0.12, traffic.size * 0.18, traffic.size * 0.18);
      }
      ctx.strokeStyle = "#6e5b39";
      ctx.beginPath();
      ctx.moveTo(-traffic.size * 0.64, 0);
      ctx.lineTo(traffic.size * 0.62, 0);
      ctx.stroke();
    } else if (traffic.type === "station") {
      ctx.strokeStyle = traffic.color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-traffic.size * 0.7, 0);
      ctx.lineTo(traffic.size * 0.7, 0);
      ctx.moveTo(0, -traffic.size * 0.62);
      ctx.lineTo(0, traffic.size * 0.62);
      ctx.stroke();
      ctx.fillStyle = "#6fa6d6";
      ctx.beginPath();
      ctx.arc(0, 0, traffic.size * 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#5c6a75";
      ctx.strokeRect(-traffic.size * 0.3, -traffic.size * 0.1, traffic.size * 0.6, traffic.size * 0.2);
      ctx.strokeRect(-traffic.size * 0.14, -traffic.size * 0.56, traffic.size * 0.28, traffic.size * 0.22);
      ctx.strokeRect(-traffic.size * 0.14, traffic.size * 0.34, traffic.size * 0.28, traffic.size * 0.22);
    } else if (traffic.type === "shuttle") {
      ctx.fillStyle = traffic.color;
      ctx.strokeStyle = "#6f6254";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-traffic.size * 0.7, 0);
      ctx.lineTo(-traffic.size * 0.16, -traffic.size * 0.28);
      ctx.lineTo(traffic.size * 0.5, -traffic.size * 0.18);
      ctx.lineTo(traffic.size * 0.72, 0);
      ctx.lineTo(traffic.size * 0.5, traffic.size * 0.18);
      ctx.lineTo(-traffic.size * 0.16, traffic.size * 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#89d0ff";
      ctx.fillRect(traffic.size * 0.06, -traffic.size * 0.09, traffic.size * 0.2, traffic.size * 0.18);
      ctx.fillStyle = "#ffb870";
      ctx.fillRect(-traffic.size * 0.68, -traffic.size * 0.08, traffic.size * 0.12, traffic.size * 0.16);
    } else if (traffic.type === "planet") {
      const planetGrad = ctx.createRadialGradient(
        -traffic.size * 0.16,
        -traffic.size * 0.2,
        traffic.size * 0.1,
        0,
        0,
        traffic.size
      );
      planetGrad.addColorStop(0, "#b7d9ff");
      planetGrad.addColorStop(0.45, traffic.color);
      planetGrad.addColorStop(1, "#35527c");
      ctx.fillStyle = planetGrad;
      ctx.beginPath();
      ctx.arc(0, 0, traffic.size * 0.86, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.beginPath();
      ctx.arc(0, 0, traffic.size * 0.86, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(233, 246, 255, 0.24)";
      ctx.beginPath();
      ctx.ellipse(0, 0, traffic.size * 1.12, traffic.size * 0.26, -0.22, 0, Math.PI * 2);
      ctx.stroke();
    } else if (traffic.type === "moon") {
      const moonGrad = ctx.createRadialGradient(
        -traffic.size * 0.18,
        -traffic.size * 0.16,
        traffic.size * 0.08,
        0,
        0,
        traffic.size * 0.86
      );
      moonGrad.addColorStop(0, "#f3f5f2");
      moonGrad.addColorStop(1, "#8f979d");
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(0, 0, traffic.size * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(120,130,138,0.3)";
      ctx.beginPath();
      ctx.arc(-traffic.size * 0.18, -traffic.size * 0.08, traffic.size * 0.12, 0, Math.PI * 2);
      ctx.arc(traffic.size * 0.12, traffic.size * 0.18, traffic.size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (traffic.type === "scrapCloud") {
      ctx.fillStyle = traffic.color;
      for (let i = 0; i < 6; i += 1) {
        const px = Math.cos(i * 1.1) * traffic.size * 0.28;
        const py = Math.sin(i * 0.9) * traffic.size * 0.2;
        ctx.fillRect(px, py, traffic.size * 0.14, traffic.size * 0.1);
      }
      ctx.strokeStyle = "#6e624c";
      ctx.beginPath();
      ctx.moveTo(-traffic.size * 0.42, -traffic.size * 0.14);
      ctx.lineTo(traffic.size * 0.46, traffic.size * 0.1);
      ctx.stroke();
    } else if (traffic.type === "alien") {
      ctx.fillStyle = "#76ff9d";
      ctx.beginPath();
      ctx.ellipse(0, 0, traffic.size * 0.42, traffic.size * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#56d87d";
      ctx.beginPath();
      ctx.arc(0, -traffic.size * 0.12, traffic.size * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#152718";
      ctx.beginPath();
      ctx.arc(-traffic.size * 0.06, -traffic.size * 0.14, traffic.size * 0.04, 0, Math.PI * 2);
      ctx.arc(traffic.size * 0.06, -traffic.size * 0.14, traffic.size * 0.04, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.strokeStyle = traffic.color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-traffic.size * 0.7, 0);
      ctx.lineTo(traffic.size * 0.7, 0);
      ctx.moveTo(0, -traffic.size * 0.58);
      ctx.lineTo(0, traffic.size * 0.58);
      ctx.moveTo(-traffic.size * 0.22, -traffic.size * 0.34);
      ctx.lineTo(traffic.size * 0.22, -traffic.size * 0.34);
      ctx.moveTo(-traffic.size * 0.22, traffic.size * 0.34);
      ctx.lineTo(traffic.size * 0.22, traffic.size * 0.34);
      ctx.stroke();
    }
    ctx.restore();
  }

  for (const cube of world.spaceCubes) {
    if (
      cube.x < porthole.x - cube.size ||
      cube.x > porthole.x + porthole.w + cube.size ||
      cube.y < porthole.y - cube.size ||
      cube.y > porthole.y + porthole.h + cube.size
    ) {
      continue;
    }
    ctx.save();
    ctx.translate(cube.x, cube.y);
    ctx.rotate(cube.rotation);
    const size = cube.size;
    const left = -size * 0.5;
    const top = -size * 0.5;
    const alpha = Math.max(0.34, cube.life / 1700);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = cube.baseFill || "#d5b879";
    ctx.strokeStyle = cube.baseStroke || "#7a6030";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.roundRect(left, top, size, size, 3);
    ctx.fill();
    ctx.stroke();

    const cells = [
      { x: left + 2, y: top + 2, w: size * 0.28, h: size * 0.28 },
      { x: left + size * 0.36, y: top + 2, w: size * 0.3, h: size * 0.18 },
      { x: left + size * 0.36, y: top + size * 0.26, w: size * 0.3, h: size * 0.42 },
      { x: left + 2, y: top + size * 0.42, w: size * 0.28, h: size * 0.28 },
    ];
    for (let i = 0; i < cells.length; i += 1) {
      const patch = cube.mosaic[i % cube.mosaic.length];
      const cell = cells[i];
      ctx.fillStyle = patch.fill;
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
    }
    ctx.restore();
  }

  const vignette = ctx.createLinearGradient(porthole.x, porthole.y, porthole.x, porthole.y + porthole.h);
  vignette.addColorStop(0, "rgba(255,255,255,0.03)");
  vignette.addColorStop(0.18, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = vignette;
  ctx.fillRect(porthole.x, porthole.y, porthole.w, porthole.h);

  ctx.restore();
  const stripe = 16;
  for (let i = 0; i < Math.ceil(porthole.w / stripe); i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "#f3d14b" : "#111418";
    ctx.fillRect(porthole.x + i * stripe, porthole.y - 18, stripe, 18);
    ctx.fillRect(porthole.x + i * stripe, porthole.y + porthole.h, stripe, 18);
  }
  for (let i = 0; i < Math.ceil(porthole.h / stripe); i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "#f3d14b" : "#111418";
    ctx.fillRect(porthole.x - 18, porthole.y + i * stripe, 18, stripe);
    ctx.fillRect(porthole.x + porthole.w, porthole.y + i * stripe, 18, stripe);
  }

  ctx.strokeStyle = "#8d7b2c";
  ctx.lineWidth = 6;
  ctx.strokeRect(porthole.x - 18, porthole.y - 18, porthole.w + 36, porthole.h + 36);
  ctx.strokeStyle = "#20262a";
  ctx.lineWidth = 2;
  ctx.strokeRect(porthole.x - 2, porthole.y - 2, porthole.w + 4, porthole.h + 4);
  ctx.fillStyle = "rgba(149, 82, 40, 0.28)";
  ctx.fillRect(porthole.x - 18, porthole.y + porthole.h + 8, 42, 8);
  ctx.fillRect(porthole.x + porthole.w - 30, porthole.y - 12, 30, 7);
  ctx.fillStyle = "rgba(92, 44, 21, 0.18)";
  ctx.fillRect(porthole.x - 12, porthole.y + porthole.h + 14, 26, 5);
}

function drawGravityMonitor() {
  const panelX = world.width - 230;
  const panelY = 130;
  const panelW = 112;
  const panelH = 88;
  const zeroG = world.zeroGTimer > 0;
  const markerX = zeroG ? Math.sin(world.frame * 0.18) * 0.08 : clamp(world.ship.accel * -0.9, -1, 1);
  const markerY = zeroG ? Math.sin(world.frame * 0.18) * 0.08 : 0.72 - world.ship.accel * 0.16;

  ctx.fillStyle = "rgba(18, 26, 30, 0.72)";
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = "rgba(170, 196, 202, 0.28)";
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  ctx.fillStyle = "#d7ebe7";
  ctx.font = "700 14px Trebuchet MS";
  ctx.fillText("G-VECTOR", panelX + 12, panelY + 18);

  const cx = panelX + panelW * 0.5;
  const cy = panelY + 52;
  ctx.strokeStyle = zeroG ? "#ff7970" : "#79f0b1";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy);
  ctx.lineTo(cx + 28, cy);
  ctx.moveTo(cx, cy - 22);
  ctx.lineTo(cx, cy + 22);
  ctx.stroke();

  ctx.strokeStyle = "rgba(121, 240, 177, 0.22)";
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.stroke();

  const dotX = cx + markerX * 18;
  const dotY = cy + markerY * 16;
  ctx.fillStyle = zeroG ? "#ff655c" : "#8bfff1";
  ctx.beginPath();
  ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = zeroG ? "#ffb5aa" : "#a8d9c2";
  ctx.font = "700 12px Trebuchet MS";
  ctx.fillText(zeroG ? "0G" : world.ship.accel > 0.12 ? "THRUST" : "NOMINAL", panelX + 14, panelY + 76);
}

function drawPowerupBeacon() {
  world.upgradeButtons = [];
  const activeDrop = world.upgradeDrops.length > 0;
  const panelX = world.porthole.x + world.porthole.w + 24;
  const panelY = world.porthole.y + 8;
  const blink = activeDrop || world.powerupSignalTimer > 0;
  const blinkOn = blink && Math.sin(world.frame * 0.28) > -0.2;

  ctx.fillStyle = "rgba(17, 24, 29, 0.76)";
  ctx.fillRect(panelX, panelY, 130, 56);
  ctx.strokeStyle = "rgba(180, 196, 204, 0.24)";
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, 130, 56);

  ctx.fillStyle = blinkOn ? "#ff5b49" : "#5a1f1b";
  ctx.beginPath();
  ctx.arc(panelX + 22, panelY + 28, 11, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = blinkOn ? "#ffd1c7" : "#8d504a";
  ctx.stroke();

  ctx.fillStyle = "#e9f0eb";
  ctx.font = "700 14px Trebuchet MS";
  ctx.fillText("POWER-UP", panelX + 40, panelY + 24);
  ctx.fillStyle = activeDrop ? "#ffd7aa" : "#97a9af";
  ctx.font = "700 10px Trebuchet MS";
  ctx.fillText(activeDrop ? "DROP IM RAUM" : "WARTET AUF DROP", panelX + 40, panelY + 40);
}

function drawUpgradeDisplay() {
  const panelW = 238;
  const panelH = 252;
  const panelX = world.porthole.x + world.porthole.w + 24;
  const panelY = world.porthole.y + 4;

  world.upgradeButtons = [];

  ctx.fillStyle = "rgba(17, 24, 29, 0.78)";
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = "rgba(180, 196, 204, 0.24)";
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  ctx.fillStyle = "#d7ebe7";
  ctx.font = "700 15px Trebuchet MS";
  ctx.fillText("POWER-UPS", panelX + 14, panelY + 20);
  ctx.fillStyle = "#9feaff";
  ctx.font = "700 12px Trebuchet MS";
  ctx.fillText(`${world.upgradePoints} P`, panelX + 158, panelY + 20);
  ctx.fillStyle = "#9fb7bd";
  ctx.font = "700 10px Trebuchet MS";
  ctx.fillText(world.combo.count > 1 ? `Combo x${world.combo.count}` : "Wuerfel bauen fuer Punkte", panelX + 14, panelY + 36);

  for (let i = 0; i < UPGRADE_DEFS.length; i += 1) {
    const upgrade = UPGRADE_DEFS[i];
    const rowX = panelX + 10;
    const rowY = panelY + 54 + i * 38;
    const active = upgradeActive(upgrade.key);
    const queued = world.upgradeDrops.some((item) => item.key === upgrade.key);
    const canBuy = world.upgradePoints >= upgrade.cost && !active && !queued;
    const seconds = Math.ceil(world.upgradeTimers[upgrade.key] / 60);
    const button = {
      x: rowX + 166,
      y: rowY - 11,
      w: 50,
      h: 20,
      key: upgrade.key,
      enabled: canBuy,
    };
    world.upgradeButtons.push(button);
    const blinkOn = Math.sin(world.frame * 0.18 + i * 0.9) > -0.05;

    ctx.fillStyle = active ? "rgba(76, 148, 255, 0.2)" : "rgba(255,255,255,0.06)";
    ctx.fillRect(rowX, rowY - 14, 218, 30);
    ctx.strokeStyle = active ? "rgba(92, 176, 255, 0.56)" : "rgba(255,255,255,0.08)";
    ctx.strokeRect(rowX, rowY - 14, 218, 30);

    ctx.fillStyle = upgrade.accent;
    ctx.fillRect(rowX + 4, rowY - 10, 6, 22);

    ctx.fillStyle = active ? "#cce6ff" : "#e9f0eb";
    ctx.font = "700 11px Trebuchet MS";
    ctx.fillText(upgrade.name, rowX + 16, rowY - 1);
    ctx.fillStyle = "#9fb2b8";
    ctx.font = "700 9px Trebuchet MS";
    ctx.fillText(upgrade.description, rowX + 16, rowY + 11);

    ctx.fillStyle = active ? "#b8dfff" : queued ? "#ffd7aa" : canBuy ? "#ffbfb8" : "#8fa2a8";
    ctx.font = "700 9px Trebuchet MS";
    ctx.fillText(
      active ? `AKTIV ${seconds}s` : queued ? "IM ANFLUG" : canBuy ? `BEREIT ${upgrade.cost}P` : `${upgrade.cost} P`,
      rowX + 106,
      rowY - 1
    );

    ctx.fillStyle = canBuy ? (blinkOn ? "#ff3b30" : "#8f1812") : active ? "#2f6fc3" : "#5b2d2a";
    ctx.fillRect(button.x, button.y, button.w, button.h);
    ctx.strokeStyle = canBuy ? (blinkOn ? "#ffd3ce" : "#b74d47") : active ? "#b6d6ff" : "#8f5b57";
    ctx.strokeRect(button.x, button.y, button.w, button.h);
    ctx.fillStyle = "#fff2ee";
    ctx.font = "700 9px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(active ? "AN" : queued ? "WAIT" : canBuy ? "START" : "LOCK", button.x + button.w * 0.5, button.y + 13);
    ctx.textAlign = "start";
  }

  ctx.fillStyle = "rgba(255,255,255,0.58)";
  ctx.font = "700 9px Trebuchet MS";
  ctx.fillText("Blinkt rot = antippen", panelX + 14, panelY + panelH - 12);
}

function drawUpgradeShape(key, size) {
  if (key === "tank") {
    ctx.fillStyle = "#7f9bb0";
    ctx.strokeStyle = "#425766";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-size * 0.8, -size * 0.46, size * 1.4, size * 0.92, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1a1f21";
    ctx.beginPath();
    ctx.roundRect(size * 0.2, -size * 0.56, size * 0.3, size * 1.12, 4);
    ctx.fill();
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i < 2 ? "#86e57a" : "#334238";
      ctx.fillRect(size * 0.25, size * 0.32 - i * size * 0.22, size * 0.2, size * 0.12);
    }
    return;
  }

  if (key === "vacuum") {
    ctx.strokeStyle = "#5b757b";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, -size * 0.12);
    ctx.lineTo(-size * 0.18, -size * 0.12);
    ctx.quadraticCurveTo(size * 0.14, -size * 0.12, size * 0.14, size * 0.2);
    ctx.lineTo(size * 0.14, size * 0.34);
    ctx.quadraticCurveTo(size * 0.14, size * 0.58, size * 0.38, size * 0.58);
    ctx.lineTo(size * 0.7, size * 0.58);
    ctx.stroke();
    ctx.fillStyle = "#263036";
    ctx.beginPath();
    ctx.roundRect(size * 0.52, size * 0.42, size * 0.56, size * 0.28, 6);
    ctx.fill();
    ctx.strokeStyle = "#ff8686";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(-size * 0.44, -size * 0.14, size * 0.14, 0, Math.PI * 2);
    ctx.fillStyle = "#ff5757";
    ctx.fill();
    ctx.stroke();
    return;
  }

  if (key === "drive") {
    ctx.fillStyle = "#a9b7c1";
    ctx.strokeStyle = "#5f707a";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-size * 0.84, size * 0.2);
    ctx.lineTo(-size * 0.12, -size * 0.34);
    ctx.lineTo(size * 0.88, -size * 0.16);
    ctx.lineTo(size * 0.98, size * 0.24);
    ctx.lineTo(-size * 0.78, size * 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#50626d";
    ctx.fillRect(-size * 0.2, size * 0.18, size * 0.72, size * 0.14);
    return;
  }

  if (key === "autoPress") {
    ctx.fillStyle = "#88c37d";
    ctx.strokeStyle = "#4c6b48";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-size * 0.32, -size * 0.72, size * 0.64, size * 0.38, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#b5dca8";
    ctx.fillRect(-size * 0.08, -size * 0.34, size * 0.16, size * 0.4);
    ctx.fillStyle = "#567b52";
    ctx.beginPath();
    ctx.roundRect(-size * 0.52, size * 0.02, size * 1.04, size * 0.34, 6);
    ctx.fill();
    ctx.stroke();
    return;
  }

  if (key === "helper") {
    ctx.fillStyle = "#14181b";
    ctx.beginPath();
    ctx.roundRect(-size * 0.86, size * 0.16, size * 1.32, size * 0.36, 8);
    ctx.fill();
    for (const offset of [-0.42, 0, 0.42]) {
      ctx.fillStyle = "#0d1113";
      ctx.beginPath();
      ctx.arc(size * offset, size * 0.42, size * 0.16, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#dbe8f0";
    ctx.strokeStyle = "#4a6473";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-size * 0.06, -size * 0.72, size * 0.86, size * 0.44, 8);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#182124";
    ctx.beginPath();
    ctx.roundRect(size * 0.06, -size * 0.62, size * 0.5, size * 0.24, 5);
    ctx.fill();
    ctx.fillStyle = "#d7f2ff";
    ctx.beginPath();
    ctx.ellipse(size * 0.22, -size * 0.5, size * 0.08, size * 0.12, 0, 0, Math.PI * 2);
    ctx.ellipse(size * 0.42, -size * 0.5, size * 0.08, size * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.fillStyle = "#2d66a5";
  ctx.strokeStyle = "#214f88";
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.roundRect(-size * 0.64, -size * 0.54, size * 1.28, size * 1.08, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#89c2ff";
  ctx.fillRect(-size * 0.5, -size * 0.06, size, size * 0.18);
  ctx.fillStyle = "#d6ecff";
  ctx.fillRect(-size * 0.46, -size * 0.4, size * 0.22, size * 0.7);
  ctx.fillRect(size * 0.16, -size * 0.4, size * 0.18, size * 0.7);
}

function drawUpgradeDrops() {
  for (const drop of world.upgradeDrops) {
    const pulse = 0.72 + Math.sin(world.frame * 0.14 + drop.x * 0.02) * 0.18;
    ctx.save();
    ctx.translate(drop.x, drop.y);
    ctx.rotate(drop.rotation);
    ctx.fillStyle = `rgba(159, 234, 255, ${0.14 + pulse * 0.12})`;
    ctx.beginPath();
    ctx.arc(0, 0, drop.size * 1.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 226, 135, ${0.34 + pulse * 0.22})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, drop.size * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    drawUpgradeShape(drop.key, drop.size);
    ctx.fillStyle = "rgba(24, 32, 36, 0.76)";
    ctx.fillRect(-drop.size * 0.84, drop.size * 0.74, drop.size * 1.68, 12);
    for (let i = 0; i < 6; i += 1) {
      ctx.fillStyle = i % 2 === 0 ? "#f3d14b" : "#111418";
      ctx.fillRect(-drop.size * 0.84 + i * (drop.size * 0.28), drop.size * 0.74, drop.size * 0.14, 4);
    }
    ctx.fillStyle = "#d8faff";
    ctx.font = "700 10px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(drop.label, 0, drop.size * 0.74 + 9);
    ctx.restore();
  }
}

function drawPowerupNotice() {
  if (world.powerupNotice.timer <= 0 || !world.powerupNotice.text) {
    return;
  }

  const alpha = Math.min(1, world.powerupNotice.timer / 30);
  const width = 250;
  const height = 28;
  const x = world.width * 0.5 - width * 0.5;
  const y = 18;

  ctx.fillStyle = `rgba(18, 25, 30, ${0.78 * alpha})`;
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = world.powerupNotice.color;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  ctx.fillStyle = world.powerupNotice.color;
  ctx.font = "700 12px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText(world.powerupNotice.text, x + width * 0.5, y + 18);
  ctx.textAlign = "start";
}

function drawHelperBot() {
  const bots = [world.helperBot, world.helperBotWing];
  for (let index = 0; index < bots.length; index += 1) {
    const bot = bots[index];
    if (!bot.active) {
      continue;
    }

    if (bot.phase === "incoming" || bot.phase === "lowering") {
      ctx.fillStyle = "#6f7479";
      ctx.fillRect(0, 46 + index * 3, world.width, 8);
      ctx.fillStyle = "#f1d36b";
      ctx.fillRect(bot.craneX - 22, 36 + index * 3, 44, 20);
      ctx.strokeStyle = "#826b1e";
      ctx.lineWidth = 2;
      ctx.strokeRect(bot.craneX - 22, 36 + index * 3, 44, 20);
      ctx.strokeStyle = "#dfe6ea";
      ctx.beginPath();
      ctx.moveTo(bot.craneX, 56 + index * 3);
      ctx.lineTo(bot.craneX, bot.hookY + 8);
      ctx.stroke();
      ctx.fillStyle = "#d9e4eb";
      ctx.beginPath();
      ctx.arc(bot.craneX, bot.hookY + 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(bot.x, bot.y);
    const wobble = bot.phase === "breaking" ? Math.sin(world.frame * 0.8 + index) * 0.14 : bot.vx * 0.02;
    ctx.rotate(wobble);
    ctx.scale(bot.direction || 1, 1);

  ctx.fillStyle = "#14181b";
  ctx.beginPath();
  ctx.roundRect(-34, 8, 68, 18, 10);
  ctx.fill();
  ctx.fillStyle = "#1d2327";
  ctx.beginPath();
  ctx.roundRect(-30, 10, 60, 10, 6);
  ctx.fill();
  for (const offset of [-18, 0, 18]) {
    ctx.fillStyle = "#0d1113";
    ctx.beginPath();
    ctx.arc(offset, 21, 7.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#697882";
    ctx.beginPath();
    ctx.arc(offset, 21, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }

  const bodyGrad = ctx.createLinearGradient(-28, -22, 28, 20);
  bodyGrad.addColorStop(0, "#5f7f99");
  bodyGrad.addColorStop(0.56, "#86a9c2");
  bodyGrad.addColorStop(1, "#cfdae3");
  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = "#466171";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-22, -10, 42, 24, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#587693";
  ctx.fillRect(-22, -1, 42, 6);
  ctx.fillStyle = "#d9e4eb";
  ctx.fillRect(-16, -8, 7, 19);
  ctx.fillRect(4, -8, 7, 19);

  ctx.fillStyle = "#647782";
  ctx.fillRect(-18, -26, 7, 12);
  ctx.fillStyle = "#9eb2c0";
  ctx.fillRect(-20, -36, 11, 12);
  ctx.fillStyle = bot.phase === "breaking" ? "#ff7b64" : "rgba(143, 223, 255, 0.7)";
  ctx.fillRect(-18, -34, 7, 4);

  ctx.fillStyle = "#dbe8f0";
  ctx.strokeStyle = "#4a6473";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(4, -36, 28, 18, 8);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#182124";
  ctx.beginPath();
  ctx.roundRect(8, -33, 20, 12, 5);
  ctx.fill();
  ctx.fillStyle = bot.phase === "breaking" ? "#ff7970" : "#d7f2ff";
  ctx.beginPath();
  ctx.ellipse(14, -27, 3.1, bot.phase === "breaking" ? 2 : 4.2, 0, 0, Math.PI * 2);
  ctx.ellipse(22, -27, 3.1, bot.phase === "breaking" ? 2 : 4.2, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#5b757b";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(19, 0);
  ctx.lineTo(28, 0);
  ctx.quadraticCurveTo(37, 0, 37, 11);
  ctx.lineTo(37, 14);
  ctx.quadraticCurveTo(37, 19, 42, 19);
  ctx.lineTo(53, 19);
  ctx.stroke();
  ctx.fillStyle = "#273136";
  ctx.beginPath();
  ctx.roundRect(49, 12, 19, 12, 6);
  ctx.fill();
  ctx.strokeStyle = "#5b757b";
  ctx.lineWidth = 2;
  ctx.stroke();

  const suctionOn = bot.phase === "working" && bot.targetId;
  if (suctionOn || bot.phase === "breaking") {
    ctx.strokeStyle = bot.phase === "breaking" ? "#ff7d64" : "#8ce9ff";
    ctx.lineWidth = 1.8;
    for (let i = 0; i < 4; i += 1) {
      const offset = (bot.intakePulse * 7 + i * 10) % 34;
      ctx.beginPath();
      ctx.arc(54 + offset * 0.26, 21 - offset * 0.08, 3 + i * 0.7, -0.5, 2.4);
      ctx.stroke();
    }
  }

    ctx.restore();
  }
}

function drawRepairParts() {
  for (const part of world.repairParts) {
    const blinkOn = Math.sin(world.frame * 0.16 + part.blinkOffset) > -0.15;
    ctx.save();
    ctx.translate(part.x, part.y);
    ctx.rotate(part.rotation);
    ctx.globalAlpha = blinkOn ? 1 : 0.45;
    ctx.fillStyle = "#d7edf6";
    ctx.strokeStyle = "#25424f";
    ctx.lineWidth = 2.5;

    ctx.fillStyle = blinkOn ? "rgba(255, 208, 56, 0.24)" : "rgba(126, 240, 255, 0.16)";
    ctx.beginPath();
    ctx.arc(0, 0, part.repulse * 0.58, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = blinkOn ? "#ffd54a" : "#7ce8ff";
    ctx.beginPath();
    ctx.arc(0, 0, part.repulse * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#b7bfc7";
    ctx.strokeStyle = "#59616a";
    if (part.shape === "wheel") {
      const tireCount = part.tireCount || 1;
      const spacing = tireCount === 1 ? [0] : tireCount === 2 ? [-part.size * 0.75, part.size * 0.75] : [-part.size, 0, part.size];
      for (const offset of spacing) {
        ctx.fillStyle = "#0f1214";
        ctx.beginPath();
        ctx.arc(offset, 0, part.size * 0.72, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#556067";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(offset, 0, part.size * 0.42, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (part.shape === "eye") {
      ctx.fillStyle = "#1f2628";
      ctx.strokeStyle = "#576d7e";
      ctx.beginPath();
      ctx.roundRect(-part.size * 1.26, -part.size * 0.72, part.size * 2.52, part.size * 1.44, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#d7f2ff";
      ctx.fillRect(-part.size * 0.78, -part.size * 0.4, part.size * 0.56, part.size * 0.68);
      ctx.fillRect(part.size * 0.22, -part.size * 0.4, part.size * 0.56, part.size * 0.68);
      ctx.fillStyle = "#2d4d63";
      ctx.fillRect(-part.size * 0.58, -part.size * 0.18, part.size * 0.16, part.size * 0.22);
      ctx.fillRect(part.size * 0.42, -part.size * 0.18, part.size * 0.16, part.size * 0.22);
    } else if (part.shape === "stack") {
      ctx.fillStyle = "#728392";
      ctx.fillRect(-part.size * 0.72, -part.size * 0.34, part.size * 1.44, part.size * 0.76);
      ctx.fillStyle = "#9eb2c0";
      ctx.fillRect(-part.size * 1.02, -part.size * 1.5, part.size * 0.72, part.size * 1.22);
      ctx.fillRect(-part.size * 0.38, -part.size * 1.88, part.size * 0.9, part.size * 0.78);
      ctx.strokeStyle = "#5b7080";
      ctx.strokeRect(-part.size * 1.02, -part.size * 1.5, part.size * 0.72, part.size * 1.22);
      ctx.strokeRect(-part.size * 0.38, -part.size * 1.88, part.size * 0.9, part.size * 0.78);
      ctx.fillStyle = "rgba(146, 78, 38, 0.22)";
      ctx.fillRect(-part.size * 0.78, -part.size * 1.06, part.size * 0.3, part.size * 0.38);
    } else if (part.shape === "gauge") {
      ctx.fillStyle = "#1a1f21";
      ctx.strokeStyle = "#576d7e";
      ctx.beginPath();
      ctx.roundRect(-part.size * 0.72, -part.size * 1.36, part.size * 1.44, part.size * 2.72, 4);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 5; i += 1) {
        ctx.fillStyle = i < 3 ? "#86e57a" : "#334238";
        ctx.fillRect(-part.size * 0.44, part.size * 0.96 - i * part.size * 0.46, part.size * 0.88, part.size * 0.28);
      }
    } else if (part.shape === "gear") {
      ctx.beginPath();
      for (let i = 0; i < 8; i += 1) {
        const angle = (Math.PI * 2 * i) / 8;
        const radius = i % 2 === 0 ? part.size : part.size * 0.66;
        const px = Math.cos(angle) * radius;
        const py = Math.sin(angle) * radius;
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#6e7780";
      ctx.beginPath();
      ctx.arc(0, 0, part.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (part.shape === "hatch") {
      ctx.fillStyle = "#9baebb";
      ctx.strokeStyle = "#5b7080";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-part.size * 1.1, -part.size * 0.66, part.size * 2.2, part.size * 1.32, 8);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#dfe8ef";
      ctx.fillRect(-part.size * 0.76, -part.size * 0.18, part.size * 1.52, part.size * 0.36);
    } else {
      ctx.fillStyle = "#89a9bf";
      ctx.strokeStyle = "#4e6678";
      ctx.beginPath();
      ctx.roundRect(-part.size * 1.18, -part.size * 0.82, part.size * 2.36, part.size * 1.64, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#5a7690";
      ctx.fillRect(-part.size * 1.18, -part.size * 0.12, part.size * 2.36, part.size * 0.36);
      ctx.fillStyle = "#d7e1ea";
      ctx.fillRect(-part.size * 0.92, -part.size * 0.68, part.size * 0.46, part.size * 1.36);
      ctx.fillRect(part.size * 0.2, -part.size * 0.68, part.size * 0.34, part.size * 1.36);
    }

    ctx.fillStyle = blinkOn ? "#ffd54a" : "#8cf3ff";
    ctx.strokeStyle = "#23323d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(part.size * 0.9, -part.size * 0.9, part.size * 0.36, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1f2628";
    ctx.font = "700 10px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText("FIX", part.size * 0.9, -part.size * 0.9 + 3);
    ctx.restore();
  }
}

function drawRefillPipe() {
  if (!world.refillPipe.active) {
    return;
  }

  const pipe = world.refillPipe;
  ctx.save();
  ctx.translate(pipe.x, pipe.y);

  ctx.fillStyle = "#7b8d95";
  ctx.strokeStyle = "#42545d";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-18, -140, 36, 150, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#596a72";
  ctx.beginPath();
  ctx.roundRect(-34, 0, 68, 30, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#252c31";
  ctx.beginPath();
  ctx.roundRect(-26, 10, 52, 16, 8);
  ctx.fill();

  for (let i = 0; i < 4; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? "#f5d04a" : "#141414";
    ctx.fillRect(-34 + i * 17, 0, 17, 8);
  }

  ctx.fillStyle = "rgba(148, 79, 40, 0.26)";
  ctx.beginPath();
  ctx.arc(-12, -58, 8, 0, Math.PI * 2);
  ctx.arc(14, -92, 10, 0, Math.PI * 2);
  ctx.fill();

  if (pipe.phase === "dumping") {
    ctx.fillStyle = "rgba(147, 233, 255, 0.18)";
    ctx.beginPath();
    ctx.moveTo(-18, 26);
    ctx.lineTo(-36, 94);
    ctx.lineTo(36, 94);
    ctx.lineTo(18, 26);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawTrashHeaps() {
  for (const heap of world.trashHeaps) {
    ctx.save();
    ctx.translate(heap.x, heap.y);

    ctx.fillStyle = "#5b6368";
    ctx.strokeStyle = "#2a3135";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, heap.width * 0.5, heap.height * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.ellipse(-heap.width * 0.08, -heap.height * 0.1, heap.width * 0.24, heap.height * 0.16, -0.12, 0, Math.PI * 2);
    ctx.fill();

    for (const patch of heap.patches) {
      const w = 8 * patch.scale;
      const h = 6 * patch.scale;
      ctx.fillStyle = patch.fill;
      ctx.strokeStyle = patch.stroke;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.roundRect(
        patch.offsetX - w * 0.5,
        patch.offsetY - h * 0.5,
        w,
        h,
        2
      );
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }
}

function drawTrash(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.rotation);
  ctx.lineWidth = 3;
  ctx.fillStyle = item.color.fill;
  ctx.strokeStyle = item.color.stroke;

  if (item.trashType === "bottle") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.4, -item.radius * 1.25, item.radius * 0.8, item.radius * 2.2, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-item.radius * 0.18, -item.radius * 1.6, item.radius * 0.36, item.radius * 0.4);
    ctx.strokeRect(-item.radius * 0.18, -item.radius * 1.6, item.radius * 0.36, item.radius * 0.4);
  } else if (item.trashType === "glassBottle") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.34, -item.radius * 1.3, item.radius * 0.68, item.radius * 2.25, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-item.radius * 0.12, -item.radius * 1.58, item.radius * 0.24, item.radius * 0.34);
    ctx.strokeRect(-item.radius * 0.12, -item.radius * 1.58, item.radius * 0.24, item.radius * 0.34);
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.12, -item.radius * 1.04);
    ctx.lineTo(-item.radius * 0.12, item.radius * 0.7);
    ctx.stroke();
  } else if (item.trashType === "cup") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.85, -item.radius * 0.85);
    ctx.lineTo(item.radius * 0.85, -item.radius * 0.85);
    ctx.lineTo(item.radius * 0.48, item.radius * 0.95);
    ctx.lineTo(-item.radius * 0.48, item.radius * 0.95);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#d96c59";
    ctx.beginPath();
    ctx.arc(0, -item.radius * 0.18, item.radius * 0.26, 0, Math.PI * 2);
    ctx.stroke();
  } else if (item.trashType === "appleCore") {
    ctx.fillStyle = "#d2e27e";
    ctx.beginPath();
    ctx.ellipse(-item.radius * 0.24, 0, item.radius * 0.42, item.radius * 0.8, 0.25, 0, Math.PI * 2);
    ctx.ellipse(item.radius * 0.24, 0, item.radius * 0.42, item.radius * 0.8, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = item.color.stroke;
    ctx.stroke();
    ctx.strokeStyle = "#5f4827";
    ctx.beginPath();
    ctx.moveTo(0, -item.radius * 0.95);
    ctx.lineTo(0, -item.radius * 1.25);
    ctx.moveTo(0, item.radius * 0.9);
    ctx.lineTo(0, item.radius * 1.18);
    ctx.stroke();
  } else if (item.trashType === "barrel") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.78, -item.radius, item.radius * 1.56, item.radius * 2, 4);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#d8ff8f";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.48, -item.radius * 0.2);
    ctx.lineTo(item.radius * 0.48, -item.radius * 0.2);
    ctx.moveTo(0, -item.radius * 0.66);
    ctx.lineTo(0, item.radius * 0.26);
    ctx.stroke();
  } else if (item.trashType === "lamp") {
    ctx.beginPath();
    ctx.arc(0, -item.radius * 0.2, item.radius * 0.62, Math.PI, Math.PI * 2);
    ctx.lineTo(item.radius * 0.38, item.radius * 0.56);
    ctx.lineTo(-item.radius * 0.38, item.radius * 0.56);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, item.radius * 0.56);
    ctx.lineTo(0, item.radius * 1.05);
    ctx.stroke();
  } else if (item.trashType === "tire") {
    ctx.fillStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#778189";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#98a2aa";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.72, 0, Math.PI * 2);
    ctx.stroke();
  } else if (item.trashType === "bigTire") {
    ctx.fillStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#6f7b85";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.38, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#95a3ad";
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * item.radius * 0.38, Math.sin(angle) * item.radius * 0.38);
      ctx.lineTo(Math.cos(angle) * item.radius * 0.78, Math.sin(angle) * item.radius * 0.78);
      ctx.stroke();
    }
  } else if (item.trashType === "box") {
    ctx.beginPath();
    ctx.roundRect(-item.radius, -item.radius * 0.72, item.radius * 2, item.radius * 1.44, 3);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#f0cfb4";
    ctx.beginPath();
    ctx.moveTo(0, -item.radius * 0.72);
    ctx.lineTo(0, item.radius * 0.72);
    ctx.moveTo(-item.radius * 0.7, 0);
    ctx.lineTo(item.radius * 0.7, 0);
    ctx.stroke();
  } else if (item.trashType === "paper") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.84, -item.radius * 0.94);
    ctx.lineTo(item.radius * 0.62, -item.radius * 0.94);
    ctx.lineTo(item.radius * 0.9, -item.radius * 0.62);
    ctx.lineTo(item.radius * 0.9, item.radius * 0.9);
    ctx.lineTo(-item.radius * 0.84, item.radius * 0.9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(item.radius * 0.62, -item.radius * 0.94);
    ctx.lineTo(item.radius * 0.62, -item.radius * 0.62);
    ctx.lineTo(item.radius * 0.9, -item.radius * 0.62);
    ctx.stroke();
    ctx.strokeStyle = "rgba(120,110,84,0.45)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.5, -item.radius * 0.3);
    ctx.lineTo(item.radius * 0.45, -item.radius * 0.3);
    ctx.moveTo(-item.radius * 0.5, 0.05 * item.radius);
    ctx.lineTo(item.radius * 0.45, 0.05 * item.radius);
    ctx.stroke();
  } else if (item.trashType === "duck") {
    ctx.beginPath();
    ctx.ellipse(-item.radius * 0.12, item.radius * 0.12, item.radius * 0.88, item.radius * 0.64, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(item.radius * 0.44, -item.radius * 0.34, item.radius * 0.44, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f88d3f";
    ctx.beginPath();
    ctx.moveTo(item.radius * 0.72, -item.radius * 0.28);
    ctx.lineTo(item.radius * 1.12, -item.radius * 0.14);
    ctx.lineTo(item.radius * 0.72, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#93491c";
    ctx.stroke();
    ctx.fillStyle = "#2e2b28";
    ctx.beginPath();
    ctx.arc(item.radius * 0.54, -item.radius * 0.42, item.radius * 0.07, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.trashType === "pool") {
    ctx.beginPath();
    ctx.ellipse(0, 0, item.radius * 1.2, item.radius * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#c3efff";
    ctx.beginPath();
    ctx.ellipse(0, 0, item.radius * 0.8, item.radius * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.98, 0.2, 2.8);
    ctx.stroke();
  } else if (item.trashType === "swimRing") {
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,248,230,0.9)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.72, -item.radius * 0.18);
    ctx.lineTo(-item.radius * 0.26, -item.radius * 0.06);
    ctx.moveTo(item.radius * 0.2, item.radius * 0.2);
    ctx.lineTo(item.radius * 0.74, item.radius * 0.34);
    ctx.stroke();
  } else if (item.trashType === "microchip") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.82, -item.radius * 0.82, item.radius * 1.64, item.radius * 1.64, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#6dd7a6";
    ctx.fillRect(-item.radius * 0.34, -item.radius * 0.34, item.radius * 0.68, item.radius * 0.68);
    ctx.strokeStyle = "#8fd7b4";
    ctx.lineWidth = 2;
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(-item.radius * 1.08, i * item.radius * 0.26);
      ctx.lineTo(-item.radius * 0.82, i * item.radius * 0.26);
      ctx.moveTo(item.radius * 0.82, i * item.radius * 0.26);
      ctx.lineTo(item.radius * 1.08, i * item.radius * 0.26);
      ctx.moveTo(i * item.radius * 0.26, -item.radius * 1.08);
      ctx.lineTo(i * item.radius * 0.26, -item.radius * 0.82);
      ctx.moveTo(i * item.radius * 0.26, item.radius * 0.82);
      ctx.lineTo(i * item.radius * 0.26, item.radius * 1.08);
      ctx.stroke();
    }
    ctx.lineWidth = 3;
  } else if (item.trashType === "circuitBoard") {
    ctx.beginPath();
    ctx.roundRect(-item.radius, -item.radius * 0.78, item.radius * 2, item.radius * 1.56, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#86d9a9";
    ctx.fillRect(-item.radius * 0.62, -item.radius * 0.32, item.radius * 0.44, item.radius * 0.3);
    ctx.fillRect(item.radius * 0.12, -item.radius * 0.18, item.radius * 0.34, item.radius * 0.22);
    ctx.fillStyle = "#263137";
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.08, -item.radius * 0.46, item.radius * 0.46, item.radius * 0.62, 3);
    ctx.fill();
    ctx.strokeStyle = "#94d7b2";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.78, item.radius * 0.2);
    ctx.lineTo(-item.radius * 0.12, item.radius * 0.2);
    ctx.lineTo(0, item.radius * 0.04);
    ctx.lineTo(item.radius * 0.54, item.radius * 0.04);
    ctx.moveTo(-item.radius * 0.52, -item.radius * 0.08);
    ctx.lineTo(-item.radius * 0.18, -item.radius * 0.08);
    ctx.lineTo(item.radius * 0.02, -item.radius * 0.28);
    ctx.lineTo(item.radius * 0.34, -item.radius * 0.28);
    ctx.stroke();
    ctx.lineWidth = 3;
  } else if (item.trashType === "tissue") {
    ctx.beginPath();
    ctx.moveTo(-item.radius, item.radius * 0.24);
    ctx.bezierCurveTo(-item.radius * 0.56, -item.radius * 1.02, item.radius * 0.16, -item.radius * 0.86, item.radius * 0.96, item.radius * 0.12);
    ctx.bezierCurveTo(item.radius * 0.34, item.radius * 1, -item.radius * 0.54, item.radius * 0.94, -item.radius, item.radius * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(175,175,170,0.45)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.44, 0);
    ctx.lineTo(item.radius * 0.38, item.radius * 0.22);
    ctx.stroke();
  } else if (item.trashType === "milkJug") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.72, -item.radius, item.radius * 1.22, item.radius * 1.88, 5);
    ctx.fill();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(item.radius * 0.34, -item.radius * 0.08, item.radius * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(item.radius * 0.34, -item.radius * 0.08, item.radius * 0.24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ff785d";
    ctx.fillRect(-item.radius * 0.08, -item.radius * 1.24, item.radius * 0.32, item.radius * 0.28);
    ctx.strokeRect(-item.radius * 0.08, -item.radius * 1.24, item.radius * 0.32, item.radius * 0.28);
  } else if (item.trashType === "detergent") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.72, item.radius * 0.84);
    ctx.lineTo(-item.radius * 0.88, -item.radius * 0.22);
    ctx.lineTo(-item.radius * 0.42, -item.radius);
    ctx.lineTo(item.radius * 0.34, -item.radius);
    ctx.lineTo(item.radius * 0.76, -item.radius * 0.36);
    ctx.lineTo(item.radius * 0.76, item.radius * 0.84);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(item.radius * 0.14, -item.radius * 0.08, item.radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(item.radius * 0.14, -item.radius * 0.08, item.radius * 0.22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff3c1";
    ctx.fillRect(-item.radius * 0.34, -item.radius * 0.22, item.radius * 0.56, item.radius * 0.52);
    ctx.strokeRect(-item.radius * 0.34, -item.radius * 0.22, item.radius * 0.56, item.radius * 0.52);
  } else if (item.trashType === "magazine") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.84, -item.radius, item.radius * 1.68, item.radius * 2, 3);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#ffd6a8";
    ctx.fillRect(-item.radius * 0.54, -item.radius * 0.72, item.radius * 1.08, item.radius * 0.56);
    ctx.strokeStyle = "#8c3046";
    ctx.strokeRect(-item.radius * 0.54, -item.radius * 0.72, item.radius * 1.08, item.radius * 0.56);
    ctx.strokeStyle = "rgba(255,241,215,0.7)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.3, item.radius * 0.08);
    ctx.lineTo(item.radius * 0.44, item.radius * 0.08);
    ctx.moveTo(-item.radius * 0.3, item.radius * 0.34);
    ctx.lineTo(item.radius * 0.44, item.radius * 0.34);
    ctx.stroke();
  } else if (item.trashType === "newspaper") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.92, -item.radius * 0.84, item.radius * 1.84, item.radius * 1.68, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f2f3f0";
    ctx.fillRect(-item.radius * 0.72, -item.radius * 0.62, item.radius * 1.44, item.radius * 1.24);
    ctx.strokeRect(-item.radius * 0.72, -item.radius * 0.62, item.radius * 1.44, item.radius * 1.24);
    ctx.strokeStyle = "#8b938c";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.56, -item.radius * 0.26);
    ctx.lineTo(item.radius * 0.56, -item.radius * 0.26);
    ctx.moveTo(-item.radius * 0.56, 0);
    ctx.lineTo(item.radius * 0.56, 0);
    ctx.moveTo(-item.radius * 0.56, item.radius * 0.26);
    ctx.lineTo(item.radius * 0.22, item.radius * 0.26);
    ctx.stroke();
  } else if (item.trashType === "envelope") {
    ctx.beginPath();
    ctx.roundRect(-item.radius, -item.radius * 0.68, item.radius * 2, item.radius * 1.36, 3);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#b39d74";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.84, -item.radius * 0.48);
    ctx.lineTo(0, 0.04 * item.radius);
    ctx.lineTo(item.radius * 0.84, -item.radius * 0.48);
    ctx.moveTo(-item.radius * 0.84, item.radius * 0.48);
    ctx.lineTo(0, 0.04 * item.radius);
    ctx.lineTo(item.radius * 0.84, item.radius * 0.48);
    ctx.stroke();
  } else if (item.trashType === "bag") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.76, item.radius * 0.92);
    ctx.lineTo(-item.radius * 0.96, -item.radius * 0.12);
    ctx.quadraticCurveTo(-item.radius * 0.44, -item.radius * 0.94, 0, -item.radius * 0.38);
    ctx.quadraticCurveTo(item.radius * 0.44, -item.radius * 0.94, item.radius * 0.96, -item.radius * 0.12);
    ctx.lineTo(item.radius * 0.76, item.radius * 0.92);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(0, -item.radius * 0.18, item.radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(0, -item.radius * 0.18, item.radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  } else if (item.trashType === "tray") {
    ctx.beginPath();
    ctx.roundRect(-item.radius, -item.radius * 0.66, item.radius * 2, item.radius * 1.32, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.24)";
    ctx.fillRect(-item.radius * 0.62, -item.radius * 0.26, item.radius * 1.24, item.radius * 0.52);
    ctx.strokeStyle = "#7d8b94";
    ctx.strokeRect(-item.radius * 0.62, -item.radius * 0.26, item.radius * 1.24, item.radius * 0.52);
  } else if (item.trashType === "wrapper") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 1.02, 0);
    ctx.lineTo(-item.radius * 0.62, -item.radius * 0.38);
    ctx.lineTo(-item.radius * 0.34, -item.radius * 0.16);
    ctx.lineTo(item.radius * 0.34, -item.radius * 0.16);
    ctx.lineTo(item.radius * 0.62, -item.radius * 0.38);
    ctx.lineTo(item.radius * 1.02, 0);
    ctx.lineTo(item.radius * 0.62, item.radius * 0.38);
    ctx.lineTo(item.radius * 0.34, item.radius * 0.16);
    ctx.lineTo(-item.radius * 0.34, item.radius * 0.16);
    ctx.lineTo(-item.radius * 0.62, item.radius * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.12, -item.radius * 0.08);
    ctx.lineTo(item.radius * 0.42, -item.radius * 0.08);
    ctx.stroke();
  } else if (item.trashType === "shoe") {
    ctx.beginPath();
    ctx.moveTo(-item.radius, item.radius * 0.26);
    ctx.lineTo(-item.radius * 0.84, -item.radius * 0.32);
    ctx.lineTo(-item.radius * 0.12, -item.radius * 0.82);
    ctx.lineTo(item.radius * 0.62, -item.radius * 0.44);
    ctx.lineTo(item.radius * 0.96, 0);
    ctx.lineTo(item.radius * 0.84, item.radius * 0.34);
    ctx.lineTo(-item.radius * 0.44, item.radius * 0.34);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e8edf0";
    ctx.fillRect(-item.radius * 0.72, item.radius * 0.16, item.radius * 1.34, item.radius * 0.18);
    ctx.strokeStyle = "#d6dde2";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.32, -item.radius * 0.28);
    ctx.lineTo(item.radius * 0.1, -item.radius * 0.28);
    ctx.moveTo(-item.radius * 0.24, -item.radius * 0.06);
    ctx.lineTo(item.radius * 0.22, -item.radius * 0.06);
    ctx.stroke();
  } else if (item.trashType === "sock") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.32, -item.radius);
    ctx.lineTo(item.radius * 0.42, -item.radius);
    ctx.lineTo(item.radius * 0.32, item.radius * 0.08);
    ctx.lineTo(item.radius * 0.84, item.radius * 0.18);
    ctx.lineTo(item.radius * 0.68, item.radius * 0.88);
    ctx.lineTo(-item.radius * 0.54, item.radius * 0.72);
    ctx.lineTo(-item.radius * 0.48, -item.radius * 0.16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(172, 172, 165, 0.45)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.12, -item.radius * 0.82);
    ctx.lineTo(item.radius * 0.24, -item.radius * 0.82);
    ctx.stroke();
  } else if (item.trashType === "gear") {
    ctx.beginPath();
    for (let i = 0; i < 10; i += 1) {
      const angle = (Math.PI * 2 * i) / 10;
      const radius = i % 2 === 0 ? item.radius : item.radius * 0.66;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#606a72";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.34, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.trashType === "brakeDisc") {
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.42, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 4; i += 1) {
      const angle = (Math.PI * 2 * i) / 4 + 0.4;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * item.radius * 0.54, Math.sin(angle) * item.radius * 0.54, item.radius * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  } else if (item.trashType === "bearing") {
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.54, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = item.color.stroke;
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#707a83";
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * item.radius * 0.72, Math.sin(angle) * item.radius * 0.72, item.radius * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (item.trashType === "piston") {
    ctx.save();
    ctx.rotate(0.35);
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.48, -item.radius * 0.9, item.radius * 0.96, item.radius * 0.84, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-item.radius * 0.14, -item.radius * 0.08, item.radius * 0.28, item.radius * 0.98);
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.58, item.radius * 0.72, item.radius * 1.16, item.radius * 0.28, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#d6dce1";
    ctx.fillRect(-item.radius * 0.28, -item.radius * 0.66, item.radius * 0.56, item.radius * 0.14);
    ctx.restore();
  } else if (item.trashType === "bolt") {
    ctx.save();
    ctx.rotate(0.5);
    ctx.beginPath();
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6;
      const px = Math.cos(angle) * item.radius * 0.46;
      const py = Math.sin(angle) * item.radius * 0.46 - item.radius * 0.54;
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-item.radius * 0.18, -item.radius * 0.16, item.radius * 0.36, item.radius * 1.2);
    ctx.strokeRect(-item.radius * 0.18, -item.radius * 0.16, item.radius * 0.36, item.radius * 1.2);
    ctx.strokeStyle = "rgba(236, 241, 245, 0.4)";
    ctx.beginPath();
    for (let i = 0; i < 4; i += 1) {
      const y = item.radius * (0.08 + i * 0.22);
      ctx.moveTo(-item.radius * 0.18, y);
      ctx.lineTo(item.radius * 0.18, y + item.radius * 0.08);
    }
    ctx.stroke();
    ctx.restore();
  } else if (item.trashType === "bananaPeel") {
    for (const dir of [-1, 0, 1]) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(dir * item.radius * 0.28, -item.radius * 0.3, dir * item.radius * 0.76, dir === 0 ? item.radius * 0.92 : item.radius * 0.72);
      ctx.lineTo(dir * item.radius * 0.36, item.radius * 0.34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = "#7fa34a";
    ctx.fillRect(-item.radius * 0.08, -item.radius * 0.38, item.radius * 0.16, item.radius * 0.42);
  } else if (item.trashType === "apple") {
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.86, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#8bc36b";
    ctx.beginPath();
    ctx.ellipse(item.radius * 0.26, -item.radius * 0.88, item.radius * 0.3, item.radius * 0.18, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#5a7a37";
    ctx.beginPath();
    ctx.moveTo(0, -item.radius * 0.44);
    ctx.lineTo(item.radius * 0.08, -item.radius * 0.86);
    ctx.stroke();
  } else if (item.trashType === "veggie") {
    ctx.beginPath();
    ctx.arc(0, item.radius * 0.12, item.radius * 0.58, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (const offset of [-0.46, 0, 0.46]) {
      ctx.beginPath();
      ctx.arc(offset * item.radius, -item.radius * 0.34, item.radius * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = "#5e8a42";
    ctx.fillRect(-item.radius * 0.12, item.radius * 0.18, item.radius * 0.24, item.radius * 0.34);
  } else if (item.trashType === "saladLeaf") {
    ctx.beginPath();
    ctx.moveTo(0, -item.radius);
    ctx.bezierCurveTo(item.radius * 0.98, -item.radius * 0.52, item.radius * 0.88, item.radius * 0.82, 0, item.radius);
    ctx.bezierCurveTo(-item.radius * 0.88, item.radius * 0.82, -item.radius * 0.98, -item.radius * 0.52, 0, -item.radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#5c8437";
    ctx.beginPath();
    ctx.moveTo(0, -item.radius * 0.82);
    ctx.lineTo(0, item.radius * 0.82);
    ctx.moveTo(0, -item.radius * 0.08);
    ctx.lineTo(item.radius * 0.44, item.radius * 0.28);
    ctx.moveTo(0, item.radius * 0.08);
    ctx.lineTo(-item.radius * 0.4, item.radius * 0.42);
    ctx.stroke();
  } else if (item.trashType === "moldBread") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.82, -item.radius * 0.72, item.radius * 1.64, item.radius * 1.44, 7);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#7cad78";
    for (const spot of [[-0.24, -0.12, 0.22], [0.22, 0.1, 0.18], [-0.06, 0.26, 0.16]]) {
      ctx.beginPath();
      ctx.arc(spot[0] * item.radius, spot[1] * item.radius, spot[2] * item.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (item.trashType === "paperCup") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.62, -item.radius);
    ctx.lineTo(item.radius * 0.62, -item.radius);
    ctx.lineTo(item.radius * 0.4, item.radius);
    ctx.lineTo(-item.radius * 0.4, item.radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#bf7b56";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.32, -item.radius * 0.16);
    ctx.lineTo(item.radius * 0.32, -item.radius * 0.16);
    ctx.moveTo(-item.radius * 0.22, item.radius * 0.18);
    ctx.lineTo(item.radius * 0.22, item.radius * 0.18);
    ctx.stroke();
  } else if (item.trashType === "plasticCutlery") {
    ctx.save();
    ctx.rotate(-0.45);
    ctx.fillRect(-item.radius * 0.12, -item.radius, item.radius * 0.24, item.radius * 1.56);
    ctx.strokeRect(-item.radius * 0.12, -item.radius, item.radius * 0.24, item.radius * 1.56);
    for (let i = -1; i <= 1; i += 1) {
      ctx.fillRect(i * item.radius * 0.1 - item.radius * 0.03, -item.radius * 1.24, item.radius * 0.06, item.radius * 0.28);
    }
    ctx.restore();
  } else if (item.trashType === "plate") {
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#c5cdca";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.62, 0, Math.PI * 2);
    ctx.stroke();
  } else if (item.trashType === "glass") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.52, -item.radius);
    ctx.lineTo(item.radius * 0.52, -item.radius);
    ctx.lineTo(item.radius * 0.34, item.radius);
    ctx.lineTo(-item.radius * 0.34, item.radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.42)";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.18, -item.radius * 0.72);
    ctx.lineTo(-item.radius * 0.08, item.radius * 0.7);
    ctx.stroke();
  } else if (item.trashType === "pasta") {
    ctx.strokeStyle = item.color.stroke;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.92, -item.radius * 0.12);
    ctx.bezierCurveTo(-item.radius * 0.54, -item.radius * 0.72, -item.radius * 0.14, item.radius * 0.76, item.radius * 0.18, 0);
    ctx.bezierCurveTo(item.radius * 0.42, -item.radius * 0.54, item.radius * 0.72, item.radius * 0.54, item.radius * 0.94, -item.radius * 0.08);
    ctx.stroke();
    ctx.lineWidth = 3;
  } else if (item.trashType === "pot") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.84, -item.radius * 0.42, item.radius * 1.68, item.radius * 1.08, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-item.radius * 1.06, -item.radius * 0.12, item.radius * 0.22, item.radius * 0.26);
    ctx.fillRect(item.radius * 0.84, -item.radius * 0.12, item.radius * 0.22, item.radius * 0.26);
    ctx.beginPath();
    ctx.arc(0, -item.radius * 0.7, item.radius * 0.28, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#d7dce0";
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.42, -item.radius * 0.44);
    ctx.lineTo(item.radius * 0.42, -item.radius * 0.44);
    ctx.stroke();
  } else if (item.trashType === "pan") {
    ctx.beginPath();
    ctx.arc(-item.radius * 0.12, 0, item.radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(item.radius * 0.28, -item.radius * 0.12, item.radius * 0.98, item.radius * 0.24);
    ctx.strokeRect(item.radius * 0.28, -item.radius * 0.12, item.radius * 0.98, item.radius * 0.24);
  } else if (item.trashType === "toothbrush") {
    ctx.save();
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.96, -item.radius * 0.18, item.radius * 1.56, item.radius * 0.36, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#dff7ff";
    ctx.fillRect(item.radius * 0.42, -item.radius * 0.28, item.radius * 0.5, item.radius * 0.18);
    ctx.fillStyle = "#9be6ff";
    for (let i = 0; i < 4; i += 1) {
      ctx.fillRect(item.radius * 0.48 + i * item.radius * 0.1, -item.radius * 0.42, item.radius * 0.05, item.radius * 0.14);
    }
    ctx.restore();
  } else if (item.trashType === "tankModule") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.9, -item.radius * 0.56, item.radius * 1.44, item.radius * 1.12, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#1a1f21";
    ctx.beginPath();
    ctx.roundRect(item.radius * 0.18, -item.radius * 0.66, item.radius * 0.34, item.radius * 1.32, 4);
    ctx.fill();
    for (let i = 0; i < 4; i += 1) {
      ctx.fillStyle = i < 2 ? "#86e57a" : "#334238";
      ctx.fillRect(item.radius * 0.26, item.radius * 0.36 - i * item.radius * 0.26, item.radius * 0.18, item.radius * 0.14);
    }
  } else if (item.trashType === "vacNozzle") {
    ctx.strokeStyle = "#5b757b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-item.radius * 0.86, -item.radius * 0.14);
    ctx.lineTo(-item.radius * 0.16, -item.radius * 0.14);
    ctx.quadraticCurveTo(item.radius * 0.16, -item.radius * 0.14, item.radius * 0.16, item.radius * 0.22);
    ctx.lineTo(item.radius * 0.16, item.radius * 0.42);
    ctx.quadraticCurveTo(item.radius * 0.16, item.radius * 0.62, item.radius * 0.42, item.radius * 0.62);
    ctx.lineTo(item.radius * 0.82, item.radius * 0.62);
    ctx.stroke();
    ctx.fillStyle = "#273136";
    ctx.beginPath();
    ctx.roundRect(item.radius * 0.58, item.radius * 0.48, item.radius * 0.54, item.radius * 0.26, 6);
    ctx.fill();
  } else if (item.trashType === "driveSpoiler") {
    ctx.beginPath();
    ctx.moveTo(-item.radius * 1.04, item.radius * 0.22);
    ctx.lineTo(-item.radius * 0.2, -item.radius * 0.4);
    ctx.lineTo(item.radius * 0.98, -item.radius * 0.12);
    ctx.lineTo(item.radius * 1.08, item.radius * 0.26);
    ctx.lineTo(-item.radius * 0.92, item.radius * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (item.trashType === "autoCore") {
    ctx.fillStyle = "#88c37d";
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.36, -item.radius * 0.88, item.radius * 0.72, item.radius * 0.42, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillRect(-item.radius * 0.08, -item.radius * 0.46, item.radius * 0.16, item.radius * 0.46);
    ctx.fillStyle = "#567b52";
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.62, 0, item.radius * 1.24, item.radius * 0.36, 6);
    ctx.fill();
    ctx.stroke();
  } else if (item.trashType === "botWheel") {
    ctx.fillStyle = "#161b1e";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#6e7f89";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.48, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#8e9faa";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.trashType === "botEye") {
    ctx.beginPath();
    ctx.roundRect(-item.radius * 0.98, -item.radius * 0.66, item.radius * 1.96, item.radius * 1.32, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#e7fbff";
    ctx.fillRect(-item.radius * 0.56, -item.radius * 0.26, item.radius * 1.12, item.radius * 0.52);
    ctx.fillStyle = "#355063";
    ctx.beginPath();
    ctx.arc(0, 0, item.radius * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else if (item.trashType === "botPanel") {
    ctx.beginPath();
    ctx.roundRect(-item.radius, -item.radius * 0.72, item.radius * 2, item.radius * 1.44, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#d7e3eb";
    ctx.fillRect(-item.radius * 0.68, -item.radius * 0.48, item.radius * 0.42, item.radius * 0.96);
    ctx.fillRect(item.radius * 0.12, -item.radius * 0.48, item.radius * 0.26, item.radius * 0.96);
  } else if (item.trashType === "botStack") {
    ctx.fillRect(-item.radius * 0.52, -item.radius * 0.12, item.radius * 1.04, item.radius * 0.76);
    ctx.fillStyle = "#b5c3cd";
    ctx.fillRect(-item.radius * 0.66, -item.radius * 1.16, item.radius * 0.48, item.radius * 1.08);
    ctx.fillRect(-item.radius * 0.12, -item.radius * 1.48, item.radius * 0.64, item.radius * 0.56);
    ctx.strokeRect(-item.radius * 0.66, -item.radius * 1.16, item.radius * 0.48, item.radius * 1.08);
    ctx.strokeRect(-item.radius * 0.12, -item.radius * 1.48, item.radius * 0.64, item.radius * 0.56);
  } else if (item.trashType === "botLamp") {
    ctx.beginPath();
    ctx.arc(0, -item.radius * 0.12, item.radius * 0.62, Math.PI, Math.PI * 2);
    ctx.lineTo(item.radius * 0.3, item.radius * 0.42);
    ctx.lineTo(-item.radius * 0.3, item.radius * 0.42);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, item.radius * 0.42);
    ctx.lineTo(0, item.radius * 0.92);
    ctx.stroke();
  } else {
    if (item.trashType === "tinCan" || item.trashType === "can") {
      ctx.beginPath();
      ctx.roundRect(-item.radius * 0.72, -item.radius, item.radius * 1.44, item.radius * 2, 4);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.24)";
      ctx.beginPath();
      ctx.moveTo(-item.radius * 0.42, -item.radius * 0.56);
      ctx.lineTo(item.radius * 0.42, -item.radius * 0.56);
      ctx.moveTo(-item.radius * 0.42, 0);
      ctx.lineTo(item.radius * 0.42, 0);
      ctx.stroke();
    } else if (item.trashType === "cap" || item.trashType === "lid") {
      ctx.beginPath();
      ctx.arc(0, 0, item.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.beginPath();
      ctx.arc(0, 0, item.radius * 0.56, 0, Math.PI * 2);
      ctx.stroke();
    } else if (item.trashType === "shard") {
      ctx.beginPath();
      ctx.moveTo(-item.radius * 0.7, item.radius * 0.55);
      ctx.lineTo(-item.radius * 0.18, -item.radius);
      ctx.lineTo(item.radius * 0.92, -item.radius * 0.2);
      ctx.lineTo(item.radius * 0.18, item.radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.4)";
      ctx.beginPath();
      ctx.moveTo(-item.radius * 0.05, -item.radius * 0.68);
      ctx.lineTo(item.radius * 0.35, item.radius * 0.35);
      ctx.stroke();
    } else if (item.trashType === "crumb") {
      ctx.beginPath();
      ctx.ellipse(0, 0, item.radius * 1.15, item.radius * 0.76, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (item.trashType === "laptop") {
      ctx.fillStyle = "#566575";
      ctx.beginPath();
      ctx.roundRect(-item.radius, -item.radius * 0.54, item.radius * 2, item.radius * 1.08, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#b7d5f2";
      ctx.fillRect(-item.radius * 0.72, -item.radius * 0.32, item.radius * 1.44, item.radius * 0.62);
      ctx.strokeStyle = "#313c46";
      ctx.strokeRect(-item.radius * 0.72, -item.radius * 0.32, item.radius * 1.44, item.radius * 0.62);
      ctx.fillStyle = "#8e98a1";
      ctx.fillRect(-item.radius * 1.1, item.radius * 0.44, item.radius * 2.2, item.radius * 0.24);
      ctx.strokeRect(-item.radius * 1.1, item.radius * 0.44, item.radius * 2.2, item.radius * 0.24);
    } else if (item.trashType === "phone") {
      ctx.beginPath();
      ctx.roundRect(-item.radius * 0.56, -item.radius, item.radius * 1.12, item.radius * 2, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#a8d7ff";
      ctx.fillRect(-item.radius * 0.36, -item.radius * 0.72, item.radius * 0.72, item.radius * 1.3);
      ctx.strokeStyle = "#232c33";
      ctx.strokeRect(-item.radius * 0.36, -item.radius * 0.72, item.radius * 0.72, item.radius * 1.3);
      ctx.fillStyle = "#232c33";
      ctx.beginPath();
      ctx.arc(0, item.radius * 0.7, item.radius * 0.08, 0, Math.PI * 2);
      ctx.fill();
    } else if (item.trashType === "computer") {
      ctx.beginPath();
      ctx.roundRect(-item.radius * 1.05, -item.radius * 0.72, item.radius * 2.1, item.radius * 1.44, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#b8ecff";
      ctx.fillRect(-item.radius * 0.82, -item.radius * 0.5, item.radius * 1.64, item.radius * 0.92);
      ctx.strokeStyle = "#40505c";
      ctx.strokeRect(-item.radius * 0.82, -item.radius * 0.5, item.radius * 1.64, item.radius * 0.92);
      ctx.fillStyle = "#7d8c99";
      ctx.fillRect(-item.radius * 0.16, item.radius * 0.72, item.radius * 0.32, item.radius * 0.38);
      ctx.fillRect(-item.radius * 0.56, item.radius * 1.02, item.radius * 1.12, item.radius * 0.16);
    } else {
      ctx.beginPath();
      ctx.roundRect(-item.radius * 0.72, -item.radius, item.radius * 1.44, item.radius * 2, 4);
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawRobot() {
  if (world.endSequence.phase === "salvage") {
    return;
  }

  const intakePulse = Math.sin(robot.intakePulse) * (1 + robot.intakeExtension * 1.5);
  const rearHatchAngle = robot.rearHatchOpen ? 1.05 : 0.08;
  const frontCompression = robot.frontCompression * 10;
  const thrustersVisible = world.zeroGTimer > 0;
  const tankTier = getPowerupTier("tank");
  const tankActive = tankTier > 0;
  const tankModules = getTankModuleCount();
  const vacActive = upgradeActive("vacuum");
  const driveActive = upgradeActive("drive");
  const autoPressActive = upgradeActive("autoPress");
  const pressActive = upgradeActive("press");
  const pressWear = pressActive ? 1 - world.upgradeTimers.press / (60 * 60) : 0;
  const introClosed = world.intro.active && world.intro.phase !== "wake";
  const introWakeAmount =
    world.intro.active && world.intro.phase === "wake"
      ? 1 - world.intro.timer / 48
      : 1;
  const isStraining =
    robot.processState === "warning" || robot.processState === "ejecting";
  let blinkAmount = 1;
  if (isStraining) {
    blinkAmount = 0.08;
  } else if (introClosed) {
    blinkAmount = 0.05;
  } else if (world.intro.active && world.intro.phase === "wake") {
    blinkAmount = clamp(introWakeAmount, 0.05, 1);
  } else if (robot.blinkTimer > 0) {
    blinkAmount = Math.abs(Math.sin((robot.blinkTimer / 10) * Math.PI));
  }
  const lampOn =
    robot.processState === "warning" &&
    Math.floor(robot.processTimer / 8) % 2 === 0;
  const missing = world.maintenance.missingParts;
  const missingWheel = missing.includes("wheel");
  const missingStack = missing.includes("stack");
  const missingPanel = missing.includes("sidePanel");
  const missingEye = missing.includes("eye");
  const missingHatch = missing.includes("rearHatch");
  const missingLamp = missing.includes("lamp");

  ctx.save();
  ctx.translate(robot.x, robot.y + robot.floatOffset);
  ctx.rotate(robot.floatRotation);
  ctx.scale(robot.facing * (1 - robot.frontCompression * 0.028), 1);

  const bodyGrad = ctx.createLinearGradient(-78, -44, 62, 52);
  if (pressActive) {
    bodyGrad.addColorStop(0, "#214f88");
    bodyGrad.addColorStop(0.55, "#4b97da");
    bodyGrad.addColorStop(1, "#88c5ff");
  } else {
    bodyGrad.addColorStop(0, "#6b88a0");
    bodyGrad.addColorStop(0.55, "#89a9bf");
    bodyGrad.addColorStop(1, "#bfd0db");
  }

  const headGrad = ctx.createLinearGradient(2, -70, 56, -18);
  headGrad.addColorStop(0, "#d8e6f0");
  headGrad.addColorStop(1, "#69859b");

  if (driveActive) {
    ctx.fillStyle = "#5d6874";
    ctx.strokeStyle = "#2c343a";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-62, -14);
    ctx.lineTo(-84, -30);
    ctx.lineTo(-22, -30);
    ctx.lineTo(-10, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#a9b7c1";
    ctx.strokeStyle = "#5f707a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(62, 18);
    ctx.lineTo(84, 14);
    ctx.lineTo(88, 28);
    ctx.lineTo(64, 32);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#14181b";
  ctx.beginPath();
  ctx.roundRect(-78, 12, 156, 32, 16);
  ctx.fill();
  ctx.fillStyle = "#1d2327";
  ctx.beginPath();
  ctx.roundRect(-72, 16, 144, 18, 10);
  ctx.fill();
  ctx.strokeStyle = "#48535b";
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 11; i += 1) {
    ctx.beginPath();
    ctx.moveTo(-62 + i * 12, 18);
    ctx.lineTo(-62 + i * 12, 32);
    ctx.stroke();
  }

  const wheelOffsets = [-40, -12, 12, 40];
  for (const offset of wheelOffsets) {
    if (missingWheel && offset === -40) {
      continue;
    }
    ctx.fillStyle = "#0d1113";
    ctx.beginPath();
    ctx.arc(offset, 31, 13, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#697882";
    ctx.beginPath();
    ctx.arc(offset, 31, 5.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#556067";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(offset, 31, 9, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (tankActive) {
    for (let moduleIndex = 1; moduleIndex < tankModules; moduleIndex += 1) {
      const left = -92 - (moduleIndex - 1) * 38;
      const tankGrad = ctx.createLinearGradient(left - 4, -24, left + 58, 34);
      tankGrad.addColorStop(0, pressActive ? "#2b6fb0" : "#6e8799");
      tankGrad.addColorStop(1, pressActive ? "#77b7f4" : "#a9bbc7");
      ctx.fillStyle = tankGrad;
      ctx.strokeStyle = pressActive ? "#1d4f7e" : "#506674";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(left, -16, 42, 48, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(0,0,0,0.16)";
      ctx.fillRect(left + 4, 6, 34, 8);
    }
  }

  ctx.fillStyle = bodyGrad;
  ctx.strokeStyle = pressActive ? "#245b8d" : "#496172";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-54, -18, 104, 50, 14);
  ctx.fill();
  ctx.stroke();

  const rustAlpha = pressActive ? 0.22 + pressWear * 0.14 : 0.3;
  const rustSpots = [
    { x: -42, y: -6, r: 7 },
    { x: -26, y: 16, r: 9 },
    { x: -2, y: -10, r: 6 },
    { x: 18, y: 12, r: 8 },
    { x: 36, y: -2, r: 5 },
  ];
  ctx.fillStyle = `rgba(145, 82, 40, ${rustAlpha})`;
  for (const spot of rustSpots) {
    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(94, 50, 23, ${rustAlpha * 0.82})`;
    ctx.beginPath();
    ctx.arc(spot.x + 1.5, spot.y + 1, Math.max(2, spot.r * 0.42), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `rgba(145, 82, 40, ${rustAlpha})`;
  }

  ctx.strokeStyle = `rgba(73, 56, 42, ${pressActive ? 0.18 : 0.28})`;
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(-46, -10);
  ctx.lineTo(-38, 22);
  ctx.moveTo(-14, -14);
  ctx.lineTo(-6, 18);
  ctx.moveTo(12, -12);
  ctx.lineTo(18, 20);
  ctx.moveTo(34, -8);
  ctx.lineTo(40, 16);
  ctx.stroke();

  ctx.fillStyle = "rgba(42, 50, 54, 0.18)";
  ctx.fillRect(-48, 14, 26, 10);
  ctx.fillRect(-10, -14, 20, 7);
  ctx.fillRect(18, 8, 16, 8);

  if (pressActive) {
    ctx.fillStyle = `rgba(150, 82, 40, ${0.08 + pressWear * 0.28})`;
    ctx.beginPath();
    ctx.arc(-34, 14, 10, 0, Math.PI * 2);
    ctx.arc(10, -8, 8, 0, Math.PI * 2);
    ctx.arc(30, 12, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = `rgba(215, 225, 236, ${0.14 + pressWear * 0.34})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-18, -6);
    ctx.lineTo(2, 8);
    ctx.moveTo(8, -12);
    ctx.lineTo(26, -2);
    ctx.moveTo(-28, 10);
    ctx.lineTo(-10, 16);
    ctx.stroke();
  }

  if (missingPanel) {
    ctx.fillStyle = "#1c2224";
    ctx.fillRect(-4, 2, 22, 18);
  }

  ctx.fillStyle = pressActive ? "#2d79bd" : "#5d7790";
  ctx.fillRect(-54, 0, 104, 10);
  ctx.fillStyle = "#d9e4eb";
  ctx.fillRect(-42, -14, 16, 38);
  ctx.fillRect(20, -14, 14, 38);
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(-36, -10, 6, 30);
  ctx.fillRect(24, -10, 5, 30);
  ctx.fillStyle = "rgba(146, 78, 38, 0.22)";
  ctx.fillRect(-46, 12, 24, 8);
  ctx.fillRect(6, -12, 16, 7);

  ctx.save();
  ctx.scale(robot.facing, 1);
  ctx.fillStyle = "rgba(221, 235, 242, 0.86)";
  ctx.font = "700 12px Trebuchet MS";
  ctx.textAlign = "center";
  ctx.fillText("AMQ-4", -2 * robot.facing, 4);
  ctx.strokeStyle = "rgba(38, 49, 58, 0.55)";
  ctx.lineWidth = 1.8;
  ctx.strokeText("AMQ-4", -2 * robot.facing, 4);
  ctx.textAlign = "start";
  ctx.restore();

  ctx.fillStyle = "#566a78";
  ctx.fillRect(4, -28, 8, 16);
  ctx.strokeStyle = "#3f525f";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(8, -24);
  ctx.lineTo(18, -34);
  ctx.lineTo(18, -44);
  ctx.stroke();

  ctx.fillStyle = headGrad;
  ctx.strokeStyle = "#415866";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.roundRect(4, -62, 48, 28, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#182124";
  ctx.beginPath();
  ctx.roundRect(10, -57, 36, 18, 7);
  ctx.fill();

  if (!missingEye) {
    ctx.fillStyle = vacActive ? "#ff5757" : "#d7f2ff";
    ctx.beginPath();
    ctx.ellipse(22, -48, 5, 6 * blinkAmount, 0, 0, Math.PI * 2);
    ctx.ellipse(35, -48, 5, 6 * blinkAmount, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (isStraining && !missingEye) {
    ctx.strokeStyle = vacActive ? "#ff9f9f" : "#d7f2ff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(17, -46);
    ctx.lineTo(27, -50);
    ctx.moveTo(30, -50);
    ctx.lineTo(40, -46);
    ctx.stroke();
  } else if (blinkAmount > 0.2 && !missingEye) {
    ctx.fillStyle = vacActive ? "#6d0f0f" : "#2d4d63";
    ctx.beginPath();
    ctx.arc(22, -48, 2.1, 0, Math.PI * 2);
    ctx.arc(35, -48, 2.1, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#61727d";
  ctx.fillRect(-38, -24, 16, 10);
  if (!missingStack) {
    ctx.fillStyle = "#647782";
    ctx.fillRect(-34, -42, 10, 18);
    ctx.fillStyle = "#9eb2c0";
    ctx.fillRect(-37, -56, 16, 16);
  }
  ctx.fillStyle = "rgba(149, 80, 39, 0.24)";
  ctx.fillRect(-34, -38, 8, 8);

  const showWrench = world.maintenance.active && Math.sin(world.maintenance.blink * 0.35) > -0.1;
  if (showWrench) {
    ctx.strokeStyle = "#ffb784";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-8, 2);
    ctx.lineTo(8, 18);
    ctx.moveTo(8, 18);
    ctx.lineTo(14, 12);
    ctx.moveTo(4, 14);
    ctx.lineTo(10, 8);
    ctx.stroke();
  }

  if (thrustersVisible) {
    const thrustFlicker = 1 + Math.sin(world.frame * 0.55) * 0.18;
    ctx.fillStyle = "#6f7e88";
    ctx.fillRect(-70, 0, 10, 24);
    ctx.fillRect(58, 0, 10, 24);
    ctx.fillRect(-18, 32, 14, 10);
    ctx.fillRect(4, 32, 14, 10);
    ctx.fillStyle = "rgba(112, 232, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(-65, 22);
    ctx.lineTo(-71 - thrustFlicker * 8, 30);
    ctx.lineTo(-59, 30);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(63, 22);
    ctx.lineTo(69 + thrustFlicker * 8, 30);
    ctx.lineTo(57, 30);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-11, 42);
    ctx.lineTo(-7, 42 + thrustFlicker * 12);
    ctx.lineTo(-3, 42);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(11, 42);
    ctx.lineTo(15, 42 + thrustFlicker * 12);
    ctx.lineTo(19, 42);
    ctx.closePath();
    ctx.fill();
  }

  ctx.strokeStyle = "#5b757b";
  ctx.lineWidth = vacActive ? 8 : 7;
  const nozzleX = 50 - frontCompression + robot.intakeExtension * 18;
  const nozzleWidth = (vacActive ? 46 : 38) + robot.intakeExtension * (vacActive ? 18 : 12);
  ctx.beginPath();
  ctx.moveTo(28, 4);
  ctx.lineTo(48 - frontCompression * 0.4, 4);
  ctx.quadraticCurveTo(62 - frontCompression, 4, 62 - frontCompression, 18);
  ctx.lineTo(62 - frontCompression, 24);
  ctx.quadraticCurveTo(62 - frontCompression, 32, 70 - frontCompression, 32);
  ctx.lineTo(nozzleX - 8, 32);
  ctx.stroke();

  ctx.fillStyle = "#273136";
  ctx.beginPath();
  ctx.roundRect(nozzleX - 4, 22, nozzleWidth, vacActive ? 24 : 20, 10);
  ctx.fill();
  ctx.strokeStyle = "#5b757b";
  ctx.lineWidth = 3;
  ctx.stroke();
  if (robot.intakeExtension > 0.08) {
    ctx.strokeStyle = vacActive ? "#ff7a7a" : "#7edfff";
    ctx.lineWidth = vacActive ? 2.6 : 2;
    for (let i = 0; i < (vacActive ? 7 : 4); i += 1) {
      const offset = (robot.intakePulse * (vacActive ? 11 : 8) + i * (vacActive ? 12 : 16)) % (68 + robot.intakeExtension * 22);
      ctx.beginPath();
      ctx.arc(nozzleX + 4 + offset * 0.34, 34 - offset * 0.1, (vacActive ? 5.5 : 4) + i * 0.8, -0.5, 2.4);
      ctx.stroke();
    }
    ctx.fillStyle = vacActive ? "rgba(255, 102, 102, 0.24)" : "rgba(143, 233, 255, 0.18)";
    ctx.beginPath();
    ctx.moveTo(nozzleX + nozzleWidth - 2, 44);
    ctx.lineTo(nozzleX + nozzleWidth + (vacActive ? 64 : 42), 18 + intakePulse * (vacActive ? 3.2 : 2));
    ctx.lineTo(nozzleX + nozzleWidth + (vacActive ? 64 : 42), 52 - intakePulse * (vacActive ? 3.2 : 2));
    ctx.closePath();
    ctx.fill();
  }

  if (!missingLamp) {
    ctx.fillStyle = lampOn ? "#ff6553" : "#612923";
    ctx.beginPath();
    ctx.arc(-14, -8, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#1a1f21";
  ctx.beginPath();
  ctx.roundRect(-68, -6, 12, 38, 4);
  ctx.fill();
  for (let i = 0; i < world.cargoCapacity; i += 1) {
    ctx.fillStyle = i < robot.cargo.length ? "#86e57a" : "#334238";
    ctx.fillRect(-66, 26 - i * 5, 8, 3);
  }
  if (tankActive) {
    for (let moduleIndex = 1; moduleIndex < tankModules; moduleIndex += 1) {
      const gaugeX = -88 - (moduleIndex - 1) * 20;
      const cargoOffset = moduleIndex * 6;
      ctx.fillStyle = "#1a1f21";
      ctx.beginPath();
      ctx.roundRect(gaugeX, -4, 12, 36, 4);
      ctx.fill();
      for (let i = 0; i < 6; i += 1) {
        const filled = robot.cargo.length > cargoOffset + i;
        ctx.fillStyle = filled ? "#86e57a" : "#334238";
        ctx.fillRect(gaugeX + 2, 24 - i * 5, 8, 3);
      }
    }
  }

  if (autoPressActive) {
    ctx.fillStyle = "#1d3320";
    ctx.strokeStyle = "#88e07f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-18, -30, 22, 14, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#baf7b2";
    ctx.font = "700 9px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText("AUTO", -7, -20);
    ctx.textAlign = "start";
  }

  ctx.save();
  ctx.translate(-66, 22);
  ctx.rotate(rearHatchAngle);
  if (!missingHatch) {
    ctx.fillStyle = "#aab8c4";
    ctx.strokeStyle = "#5b7080";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(-10, -8, 26, 14, 6);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();

  ctx.restore();

  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.beginPath();
  ctx.ellipse(robot.x, world.floorY + 10, 90, Math.max(6, 16 + robot.floatOffset * 0.12), 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawCargoBar() {
  return;
}

function drawIntroCranes() {
  if (!world.intro.active) {
    return;
  }

  ctx.fillStyle = "#6f7479";
  ctx.fillRect(0, 46, world.width, 8);
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(0, 36, world.width, 10);
  for (const craneX of [world.intro.rearX, world.intro.frontX]) {
    ctx.fillStyle = "#e0bc43";
    ctx.fillRect(craneX - 22, 36, 44, 20);
    ctx.strokeStyle = "#7f6317";
    ctx.lineWidth = 2;
    ctx.strokeRect(craneX - 22, 36, 44, 20);
    ctx.fillStyle = "rgba(147, 80, 38, 0.3)";
    ctx.fillRect(craneX - 14, 39, 12, 6);
    ctx.fillRect(craneX + 4, 45, 10, 5);
    ctx.strokeStyle = "#dfe6ea";
    ctx.beginPath();
    ctx.moveTo(craneX, 56);
    ctx.lineTo(craneX, world.intro.hookY + 8);
    ctx.stroke();
    ctx.strokeStyle = "#f1d36b";
    ctx.beginPath();
    ctx.moveTo(craneX - 10, world.intro.hookY + 4);
    ctx.lineTo(craneX - 5, world.intro.hookY + 18);
    ctx.moveTo(craneX + 10, world.intro.hookY + 4);
    ctx.lineTo(craneX + 5, world.intro.hookY + 18);
    ctx.stroke();
    ctx.fillStyle = "#d9e4eb";
    ctx.beginPath();
    ctx.arc(craneX, world.intro.hookY + 10, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCubeAndCrane() {
  for (const cube of world.activeCubes) {
    const cubeScale = cube.vacuuming ? Math.max(0.14, cube.vacuumScale || 1) : 1;
    ctx.save();
    ctx.translate(cube.x, cube.y);
    ctx.rotate(cube.rotation);
    ctx.scale(cubeScale, cubeScale);
    const left = -cube.size * 0.5;
    const top = -cube.size * 0.5;
    const mosaic = cube.mosaic.length ? cube.mosaic : [{ fill: "#d5b879", stroke: "#7a6030" }];

    ctx.fillStyle = "#d5b879";
    ctx.strokeStyle = "#7a6030";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(left, top, cube.size, cube.size, 4);
    ctx.fill();
    ctx.stroke();

    const cells = [
      { x: left + 3, y: top + 3, w: 8, h: 8 },
      { x: left + 12, y: top + 3, w: 9, h: 5 },
      { x: left + 12, y: top + 9, w: 9, h: 12 },
      { x: left + 3, y: top + 12, w: 8, h: 9 },
    ];

    for (let i = 0; i < cells.length; i += 1) {
      const patch = mosaic[i % mosaic.length];
      const cell = cells[i];
      ctx.fillStyle = patch.fill;
      ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
      ctx.strokeStyle = patch.stroke;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cell.x, cell.y, cell.w, cell.h);
    }
    ctx.restore();
  }
}

function drawCubeVacuum() {
  if (!world.cubeVacuum.active) {
    return;
  }

  const x = world.cubeVacuum.x;
  const y = world.cubeVacuum.y;
  ctx.strokeStyle = "#93aab7";
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, y - 28);
  ctx.stroke();

  ctx.fillStyle = "#667883";
  ctx.strokeStyle = "#2f3b42";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(x - 54, y - 28, 108, 34, 12);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#30393f";
  ctx.beginPath();
  ctx.roundRect(x - 72, y + 2, 144, 30, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#0f1417";
  ctx.beginPath();
  ctx.roundRect(x - 42, y + 10, 84, 14, 7);
  ctx.fill();
  ctx.fillStyle = "rgba(164, 243, 255, 0.18)";
  ctx.beginPath();
  ctx.roundRect(x - 34, y + 12, 68, 10, 5);
  ctx.fill();
  ctx.fillStyle = "rgba(150, 240, 255, 0.18)";
  ctx.beginPath();
  ctx.moveTo(x - 62, y + 26);
  ctx.lineTo(x - 92, world.floorY + 14);
  ctx.lineTo(x + 92, world.floorY + 14);
  ctx.lineTo(x + 62, y + 26);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(168, 242, 255, 0.36)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    const swirl = Math.sin(world.frame * 0.2 + i) * 8;
    ctx.beginPath();
    ctx.moveTo(x - 56 + i * 36, y + 26);
    ctx.quadraticCurveTo(x - 26 + i * 14 + swirl, world.floorY - 18, x - 12 + i * 22, world.floorY + 10);
    ctx.stroke();
  }
}

function drawGameOverSalvage() {
  if (world.endSequence.phase !== "salvage") {
    return;
  }

  for (const piece of world.endSequence.pieces) {
    ctx.strokeStyle = "#dfe6ea";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(piece.hookX, 0);
    ctx.lineTo(piece.hookX, piece.y - piece.size * 0.8);
    ctx.stroke();

    ctx.fillStyle = "#e0bc43";
    ctx.fillRect(piece.hookX - 18, 0, 36, 12);
    ctx.strokeStyle = "#7f6317";
    ctx.strokeRect(piece.hookX - 18, 0, 36, 12);

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation);
    ctx.fillStyle = "#9fb2c0";
    ctx.strokeStyle = "#506674";
    ctx.lineWidth = 3;
    if (piece.shape === "wheel") {
      ctx.fillStyle = "#0d1113";
      ctx.beginPath();
      ctx.arc(0, 0, piece.size * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#697882";
      ctx.beginPath();
      ctx.arc(0, 0, piece.size * 0.34, 0, Math.PI * 2);
      ctx.stroke();
    } else if (piece.shape === "eye") {
      ctx.fillStyle = "#dbe8f0";
      ctx.beginPath();
      ctx.roundRect(-piece.size, -piece.size * 0.56, piece.size * 1.8, piece.size * 1.1, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#182124";
      ctx.fillRect(-piece.size * 0.68, -piece.size * 0.3, piece.size * 1.22, piece.size * 0.6);
      ctx.fillStyle = "#d7f2ff";
      ctx.beginPath();
      ctx.arc(-piece.size * 0.24, 0, piece.size * 0.14, 0, Math.PI * 2);
      ctx.arc(piece.size * 0.18, 0, piece.size * 0.14, 0, Math.PI * 2);
      ctx.fill();
    } else if (piece.shape === "stack") {
      ctx.fillRect(-piece.size * 0.4, -piece.size * 0.18, piece.size * 0.8, piece.size * 0.42);
      ctx.fillStyle = "#c6d3dd";
      ctx.fillRect(-piece.size * 0.5, -piece.size * 1.08, piece.size * 0.34, piece.size * 0.9);
      ctx.fillRect(-piece.size * 0.08, -piece.size * 1.34, piece.size * 0.48, piece.size * 0.48);
    } else if (piece.shape === "hatch") {
      ctx.beginPath();
      ctx.roundRect(-piece.size, -piece.size * 0.52, piece.size * 1.9, piece.size * 0.92, 5);
      ctx.fill();
      ctx.stroke();
    } else if (piece.shape === "lamp") {
      ctx.beginPath();
      ctx.arc(0, 0, piece.size * 0.46, 0, Math.PI * 2);
      ctx.fillStyle = "#ff705b";
      ctx.fill();
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.roundRect(-piece.size, -piece.size * 0.62, piece.size * 1.86, piece.size * 1.2, 6);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawExhaust() {
  for (const particle of world.exhaustParticles) {
    const alpha = particle.life / particle.maxLife;
    if (particle.type === "flame") {
      const angle = Math.atan2(particle.vy, particle.vx);
      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(angle + Math.PI * 0.5);
      ctx.fillStyle = `${particle.color}${Math.round(alpha * 210)
        .toString(16)
        .padStart(2, "0")}`;
      ctx.beginPath();
      ctx.ellipse(0, 0, particle.size * 0.46, particle.size * 0.98 * alpha, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(255, 244, 200, ${0.55 * alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, -particle.size * 0.12, particle.size * 0.2, particle.size * 0.42 * alpha, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      continue;
    }
    ctx.fillStyle = `${particle.color}${Math.round(alpha * 180)
      .toString(16)
      .padStart(2, "0")}`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  }
}

function render() {
  ctx.clearRect(0, 0, world.width, world.height);
  const shakeX =
    world.ship.shakeTimer > 0 && world.zeroGTimer === 0
      ? Math.sin(world.frame * 2.2) * 2.5
      : 0;
  const shakeY =
    world.ship.shakeTimer > 0 && world.zeroGTimer === 0
      ? Math.cos(world.frame * 2.7) * 1.5
      : 0;
  ctx.save();
  ctx.translate(world.width * 0.5 + shakeX, world.height * 0.5 + shakeY);
  ctx.rotate(world.ship.tilt);
  ctx.translate(-world.width * 0.5, -world.height * 0.5);
  drawBackground();
  drawCargoBar();
  drawRefillPipe();
  drawTrashHeaps();

  for (const item of world.particles) {
    drawTrash(item);
  }

  drawRepairParts();
  drawUpgradeDrops();
  drawHelperBot();
  drawIntroCranes();
  drawRobot();
  drawGameOverSalvage();
  drawExhaust();
  drawCubeAndCrane();
  drawCubeVacuum();
  ctx.restore();
}

function beginRun() {
  ensureAudio();
  world.started = true;
  startScreenEl.classList.add("hidden");
  if (touchControlsEl) {
    touchControlsEl.classList.remove("is-hidden");
  }
  resetYard();
  startIntroSequence();
}

function tick() {
  if (!world.started) {
    render();
    window.requestAnimationFrame(tick);
    return;
  }

  if (world.intro.active) {
    updateIntroSequence();
    updateExhaust();
    updateSpaceCubes();
    render();
    window.requestAnimationFrame(tick);
    return;
  }

  if (world.gameOver) {
    updateEndSequence();
    updateExhaust();
    updateCubeAndCrane();
    updateSpaceCubes();
    render();
    window.requestAnimationFrame(tick);
    return;
  }

  updateRobot();
  updateSystems();
  if (world.gameOver) {
    updateEndSequence();
    updateExhaust();
    updateCubeAndCrane();
    updateSpaceCubes();
    render();
    window.requestAnimationFrame(tick);
    return;
  }
  updateTrash();
  updateHelperBot();
  tryCollectTrash();
  updateExhaust();
  updateProcess();
  updateCubeAndCrane();
  updateCubeVacuum();
  updateSpaceCubes();
  updateRefillPipe();
  updateRepairParts();
  updateUpgradeDrops();
  updateMaintenanceBot();
  updateRefuelBot();
  updateFirebot();
  syncHud();
  render();
  window.requestAnimationFrame(tick);
}

window.addEventListener("keydown", (event) => {
  if (!world.started && (event.key === "Enter" || event.key === " ")) {
    beginRun();
  }

  handleGlitches(event.key);
  world.keys[event.key] = true;

  if (event.key === "w" || event.key === "W") {
    triggerPressAction();
  }

  if (event.key === "r" || event.key === "R") {
    resetYard();
    if (world.started) {
      startIntroSequence();
    }
  }

  if (event.key === "t" || event.key === "T") {
    triggerMaintenance(true);
  }
});

window.addEventListener("keyup", (event) => {
  world.keys[event.key] = false;
});

startButtonEl.addEventListener("click", () => {
  beginRun();
});

canvas.addEventListener("click", (event) => {
  if (!world.started) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;

  for (const button of world.upgradeButtons) {
    if (
      x >= button.x &&
      x <= button.x + button.w &&
      y >= button.y &&
      y <= button.y + button.h &&
      button.enabled
    ) {
      spawnUpgradeDrop(button.key);
      break;
    }
  }
});

window.addEventListener("resize", resizeGameStage);
window.addEventListener("orientationchange", resizeGameStage);

if (driveFieldEl) {
  const updateDriveFromPointer = (event) => {
    const rect = driveFieldEl.getBoundingClientRect();
    const ratio = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    setTouchDriveFromValue(ratio);
  };

  const endDrivePointer = (event) => {
    if (mobileTouchState.drivePointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    try {
      driveFieldEl.releasePointerCapture(event.pointerId);
    } catch {}
    resetTouchDrive();
  };

  driveFieldEl.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (!world.started) {
      beginRun();
    }
    mobileTouchState.drivePointerId = event.pointerId;
    driveFieldEl.setPointerCapture(event.pointerId);
    updateDriveFromPointer(event);
  });

  driveFieldEl.addEventListener("pointermove", (event) => {
    if (mobileTouchState.drivePointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    updateDriveFromPointer(event);
  });

  driveFieldEl.addEventListener("pointerup", endDrivePointer);
  driveFieldEl.addEventListener("pointercancel", endDrivePointer);
  driveFieldEl.addEventListener("lostpointercapture", resetTouchDrive);
  driveFieldEl.addEventListener("touchstart", (event) => event.preventDefault(), { passive: false });
  driveFieldEl.addEventListener("contextmenu", (event) => event.preventDefault());
}

if (suctionControlEl) {
  const endSuctionPointer = (event) => {
    if (mobileTouchState.suctionPointerId !== null && event.pointerId !== mobileTouchState.suctionPointerId) {
      return;
    }
    event.preventDefault();
    if (mobileTouchState.suctionPointerId !== null) {
      try {
        suctionControlEl.releasePointerCapture(mobileTouchState.suctionPointerId);
      } catch {}
    }
    mobileTouchState.suctionPointerId = null;
    mobileTouchState.suctionPressTriggered = false;
    releaseVirtualKey(" ");
    setSuctionPull(0);
  };

  suctionControlEl.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    if (!world.started) {
      beginRun();
    }
    mobileTouchState.suctionPointerId = event.pointerId;
    mobileTouchState.suctionStartY = event.clientY;
    mobileTouchState.suctionPressTriggered = false;
    suctionControlEl.setPointerCapture(event.pointerId);
    pressVirtualKey(" ");
    setSuctionPull(0.06);
  });

  suctionControlEl.addEventListener("pointermove", (event) => {
    if (mobileTouchState.suctionPointerId !== event.pointerId) {
      return;
    }
    event.preventDefault();
    const pull = clamp((event.clientY - mobileTouchState.suctionStartY) / 92, 0, 1);
    if (pull >= 0.62 && !mobileTouchState.suctionPressTriggered) {
      mobileTouchState.suctionPressTriggered = true;
      triggerPressAction();
    }
    setSuctionPull(pull);
  });

  suctionControlEl.addEventListener("pointerup", endSuctionPointer);
  suctionControlEl.addEventListener("pointercancel", endSuctionPointer);
  suctionControlEl.addEventListener("lostpointercapture", () => {
    mobileTouchState.suctionPointerId = null;
    mobileTouchState.suctionPressTriggered = false;
    releaseVirtualKey(" ");
    setSuctionPull(0);
  });
  suctionControlEl.addEventListener("touchstart", (event) => event.preventDefault(), { passive: false });
  suctionControlEl.addEventListener("contextmenu", (event) => event.preventDefault());
}

resizeGameStage();
resetYard();
updateDriveTouchUi();
setSuctionPull(0);
render();
tick();
