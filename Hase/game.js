const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startButton = document.getElementById("startButton");
const screenButton = document.getElementById("screenButton");
const helpButton = document.getElementById("helpButton");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const levelLabel = document.getElementById("levelLabel");
const coinLabel = document.getElementById("coinLabel");
const statusLabel = document.getElementById("statusLabel");
const timeLabel = document.getElementById("timeLabel");
const eggLabel = document.getElementById("eggLabel");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const FLOOR_Y = 456;
const LEVELS_PER_WORLD = 4;

const input = {
  left: false,
  right: false,
  jump: false,
};

const audioState = {
  context: null,
  enabled: false,
  unlocked: false,
};

const player = {
  x: 80,
  y: FLOOR_Y - 64,
  w: 40,
  h: 54,
  vx: 0,
  vy: 0,
  facing: 1,
  grounded: false,
  jumpBuffer: 0,
  coyoteTimer: 0,
  jumpHoldTimer: 0,
  jumpSoundPlayed: false,
  bubbleTrailTimer: 0,
};

const gameState = {
  running: false,
  cameraX: 0,
  currentLevelIndex: 0,
  worldIndex: 0,
  worldCoins: 0,
  totalCoins: 0,
  activeMode: "level",
  currentLevel: null,
  currentMessage: "Druecke Start",
  bossHits: 0,
  bossDefeated: false,
  runId: 0,
  currentLevelTime: 0,
  eggsCollected: 0,
  pendingAction: null,
  assistActive: false,
  assistTargetX: 0,
  assistTargetY: 0,
  bubbles: [],
};

const physics = {
  gravity: 1800,
  maxFall: 860,
  accelGround: 1800,
  accelAir: 1100,
  frictionGround: 1500,
  frictionAir: 360,
  maxRunSpeed: 250,
  jumpSpeed: 640,
  extraJumpBoost: 900,
  jumpHoldTime: 0.13,
  coyoteTime: 0.12,
  jumpBufferTime: 0.14,
};

const worldThemes = [
  {
    skyTop: "#76bff5",
    skyBottom: "#dff8ff",
    hill: "#a2db7f",
    hillDark: "#6fb356",
    name: "Wolkenwiese",
  },
  {
    skyTop: "#ffa96f",
    skyBottom: "#fff1c6",
    hill: "#f7c66f",
    hillDark: "#db9246",
    name: "Sonnenpfad",
  },
];

function enemySpec(x, y, left, right) {
  return { x, y, w: 34, h: 28, left, right, speed: 62, direction: -1, dead: false };
}

function ensureAudio() {
  if (audioState.context) {
    return audioState.context;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }

  audioState.context = new AudioContextClass();
  return audioState.context;
}

async function unlockAudio() {
  const context = ensureAudio();
  if (!context) {
    return;
  }

  try {
    if (context.state === "suspended") {
      await context.resume();
    }
    audioState.enabled = true;
    audioState.unlocked = true;
  } catch (error) {
    audioState.enabled = false;
  }
}

function makeEnvelope(context, destination, { type, frequency, frequencyEnd, duration, volume, q, delay = 0 }) {
  const now = context.currentTime + delay;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  if (frequencyEnd !== undefined) {
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, frequencyEnd), now + duration);
  }
  if (q) {
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(q, now);
    oscillator.connect(filter);
    filter.connect(gainNode);
  } else {
    oscillator.connect(gainNode);
  }
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  gainNode.connect(destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.05);
}

function playToneStack(tones) {
  const context = ensureAudio();
  if (!context || !audioState.enabled) {
    return;
  }

  const master = context.createGain();
  master.gain.value = 0.2;
  master.connect(context.destination);

  for (const tone of tones) {
    const delayNode = context.createGain();
    delayNode.gain.value = 1;
    delayNode.connect(master);
    makeEnvelope(context, delayNode, tone);
  }
}

function playSound(name) {
  switch (name) {
    case "jump":
      playToneStack([
        { type: "triangle", frequency: 420, frequencyEnd: 280, duration: 0.13, volume: 0.08, q: 2800 },
        { type: "sine", frequency: 620, frequencyEnd: 480, duration: 0.1, volume: 0.05, q: 3200 },
      ]);
      break;
    case "land":
      playToneStack([
        { type: "sine", frequency: 180, frequencyEnd: 120, duration: 0.09, volume: 0.035, q: 900 },
      ]);
      break;
    case "coin":
      playToneStack([
        { type: "triangle", frequency: 980, frequencyEnd: 1240, duration: 0.16, volume: 0.06, q: 3600 },
        { type: "sine", frequency: 1470, frequencyEnd: 1680, duration: 0.11, volume: 0.045, q: 4200 },
      ]);
      break;
    case "egg":
      playToneStack([
        { type: "sine", frequency: 520, frequencyEnd: 700, duration: 0.18, volume: 0.055, q: 2400 },
        { type: "triangle", frequency: 780, frequencyEnd: 980, duration: 0.14, volume: 0.04, q: 3000 },
      ]);
      break;
    case "enemy":
      playToneStack([
        { type: "triangle", frequency: 240, frequencyEnd: 170, duration: 0.12, volume: 0.05, q: 1500 },
        { type: "sine", frequency: 390, frequencyEnd: 280, duration: 0.09, volume: 0.03, q: 2200 },
      ]);
      break;
    case "hurt":
      playToneStack([
        { type: "square", frequency: 280, frequencyEnd: 180, duration: 0.14, volume: 0.035, q: 1200 },
      ]);
      break;
    case "levelClear":
      playToneStack([
        { type: "triangle", frequency: 660, frequencyEnd: 660, duration: 0.12, volume: 0.05, q: 3400, delay: 0 },
        { type: "triangle", frequency: 880, frequencyEnd: 880, duration: 0.18, volume: 0.05, q: 3600, delay: 0.09 },
        { type: "sine", frequency: 1320, frequencyEnd: 1320, duration: 0.24, volume: 0.04, q: 4200, delay: 0.18 },
      ]);
      break;
    case "bossHit":
      playToneStack([
        { type: "triangle", frequency: 360, frequencyEnd: 260, duration: 0.12, volume: 0.055, q: 2200 },
        { type: "triangle", frequency: 520, frequencyEnd: 420, duration: 0.14, volume: 0.035, q: 2600 },
      ]);
      break;
    case "victory":
      playToneStack([
        { type: "triangle", frequency: 660, frequencyEnd: 660, duration: 0.1, volume: 0.04, q: 3600, delay: 0 },
        { type: "triangle", frequency: 880, frequencyEnd: 880, duration: 0.16, volume: 0.05, q: 3600, delay: 0.1 },
        { type: "triangle", frequency: 1320, frequencyEnd: 1320, duration: 0.24, volume: 0.06, q: 3600, delay: 0.22 },
      ]);
      break;
    case "assist":
      playToneStack([
        { type: "sine", frequency: 540, frequencyEnd: 760, duration: 0.12, volume: 0.045, q: 3000 },
        { type: "triangle", frequency: 820, frequencyEnd: 980, duration: 0.14, volume: 0.035, q: 3400, delay: 0.05 },
      ]);
      break;
    default:
      break;
  }
}

function eggSpec(x, y) {
  return { x, y, w: 24, h: 30, collected: false };
}

function spawnJumpBubbles(count = 7, spread = 18) {
  for (let i = 0; i < count; i += 1) {
    gameState.bubbles.push({
      x: player.x + player.w * 0.5 - player.facing * 10 + (Math.random() - 0.5) * spread,
      y: player.y + player.h * 0.72 + (Math.random() - 0.5) * 12,
      vx: -player.facing * (10 + Math.random() * 20) + (Math.random() - 0.5) * 10,
      vy: -24 - Math.random() * 34,
      radius: 4 + Math.random() * 8,
      life: 0.62 + Math.random() * 0.28,
      maxLife: 0.62 + Math.random() * 0.28,
    });
  }
}

function levelSpec(world, stage, length, platforms, hazards, enemies, eggs) {
  return {
    kind: "level",
    world,
    stage,
    length,
    start: { x: 80, y: FLOOR_Y - 64 },
    coin: { x: length - 320, y: 220, r: 16, collected: false },
    goal: { x: length - 130, y: FLOOR_Y - 110, w: 48, h: 86 },
    platforms,
    hazards,
    enemies,
    eggs,
  };
}

const levels = [
  levelSpec(0, 1, 1700, [
    { x: 240, y: 385, w: 120, h: 22 },
    { x: 430, y: 330, w: 110, h: 22 },
    { x: 620, y: 290, w: 110, h: 22 },
    { x: 820, y: 355, w: 140, h: 22 },
    { x: 1050, y: 300, w: 160, h: 22 },
    { x: 1320, y: 245, w: 140, h: 22 },
  ], [
    { x: 520, y: FLOOR_Y + 14, w: 74, h: 28 },
    { x: 1190, y: FLOOR_Y + 14, w: 74, h: 28 },
  ], [
    enemySpec(300, FLOOR_Y - 28, 210, 360),
    enemySpec(850, FLOOR_Y - 28, 770, 960),
  ], [
    eggSpec(470, 280),
    eggSpec(1080, 250),
  ]),
  levelSpec(0, 2, 1900, [
    { x: 210, y: 370, w: 100, h: 22 },
    { x: 390, y: 315, w: 110, h: 22 },
    { x: 575, y: 260, w: 100, h: 22 },
    { x: 760, y: 320, w: 150, h: 22 },
    { x: 1010, y: 265, w: 140, h: 22 },
    { x: 1260, y: 210, w: 120, h: 22 },
    { x: 1480, y: 285, w: 160, h: 22 },
  ], [
    { x: 680, y: FLOOR_Y + 14, w: 88, h: 28 },
    { x: 1160, y: FLOOR_Y + 14, w: 80, h: 28 },
  ], [
    enemySpec(260, FLOOR_Y - 28, 160, 340),
    enemySpec(1030, 237, 990, 1120),
  ], [
    eggSpec(620, 225),
    eggSpec(1510, 250),
  ]),
  levelSpec(0, 3, 2100, [
    { x: 240, y: 345, w: 110, h: 22 },
    { x: 430, y: 292, w: 90, h: 22 },
    { x: 590, y: 245, w: 90, h: 22 },
    { x: 750, y: 198, w: 90, h: 22 },
    { x: 930, y: 260, w: 130, h: 22 },
    { x: 1130, y: 318, w: 110, h: 22 },
    { x: 1340, y: 278, w: 110, h: 22 },
    { x: 1540, y: 220, w: 110, h: 22 },
    { x: 1760, y: 275, w: 110, h: 22 },
  ], [
    { x: 520, y: FLOOR_Y + 14, w: 70, h: 28 },
    { x: 840, y: FLOOR_Y + 14, w: 70, h: 28 },
    { x: 1225, y: FLOOR_Y + 14, w: 70, h: 28 },
  ], [
    enemySpec(265, 317, 240, 315),
    enemySpec(955, 232, 930, 1035),
    enemySpec(1790, 247, 1760, 1840),
  ], [
    eggSpec(620, 205),
    eggSpec(1405, 240),
  ]),
  levelSpec(0, 4, 2300, [
    { x: 220, y: 390, w: 140, h: 22 },
    { x: 440, y: 345, w: 120, h: 22 },
    { x: 640, y: 300, w: 120, h: 22 },
    { x: 850, y: 255, w: 120, h: 22 },
    { x: 1050, y: 295, w: 140, h: 22 },
    { x: 1280, y: 248, w: 120, h: 22 },
    { x: 1480, y: 205, w: 120, h: 22 },
    { x: 1690, y: 260, w: 150, h: 22 },
    { x: 1940, y: 215, w: 140, h: 22 },
  ], [
    { x: 555, y: FLOOR_Y + 14, w: 72, h: 28 },
    { x: 1195, y: FLOOR_Y + 14, w: 72, h: 28 },
    { x: 1835, y: FLOOR_Y + 14, w: 72, h: 28 },
  ], [
    enemySpec(290, 362, 220, 330),
    enemySpec(1085, 267, 1040, 1170),
    enemySpec(1710, 232, 1690, 1810),
  ], [
    eggSpec(690, 265),
    eggSpec(1500, 170),
    eggSpec(1990, 180),
  ]),
  levelSpec(1, 1, 1750, [
    { x: 260, y: 380, w: 120, h: 22 },
    { x: 470, y: 330, w: 120, h: 22 },
    { x: 690, y: 275, w: 120, h: 22 },
    { x: 910, y: 325, w: 140, h: 22 },
    { x: 1160, y: 270, w: 120, h: 22 },
    { x: 1380, y: 225, w: 140, h: 22 },
  ], [
    { x: 580, y: FLOOR_Y + 14, w: 84, h: 28 },
    { x: 1080, y: FLOOR_Y + 14, w: 84, h: 28 },
  ], [
    enemySpec(310, 352, 260, 380),
    enemySpec(720, 247, 690, 800),
  ], [
    eggSpec(520, 300),
    eggSpec(1400, 185),
  ]),
  levelSpec(1, 2, 1950, [
    { x: 200, y: 360, w: 130, h: 22 },
    { x: 390, y: 310, w: 100, h: 22 },
    { x: 560, y: 260, w: 100, h: 22 },
    { x: 720, y: 215, w: 100, h: 22 },
    { x: 900, y: 275, w: 130, h: 22 },
    { x: 1110, y: 335, w: 130, h: 22 },
    { x: 1320, y: 290, w: 120, h: 22 },
    { x: 1540, y: 245, w: 150, h: 22 },
  ], [
    { x: 485, y: FLOOR_Y + 14, w: 68, h: 28 },
    { x: 840, y: FLOOR_Y + 14, w: 68, h: 28 },
    { x: 1450, y: FLOOR_Y + 14, w: 68, h: 28 },
  ], [
    enemySpec(250, 332, 200, 315),
    enemySpec(935, 247, 900, 1010),
    enemySpec(1570, 217, 1540, 1660),
  ], [
    eggSpec(765, 180),
    eggSpec(1370, 255),
  ]),
  levelSpec(1, 3, 2200, [
    { x: 230, y: 385, w: 110, h: 22 },
    { x: 410, y: 345, w: 100, h: 22 },
    { x: 570, y: 305, w: 100, h: 22 },
    { x: 740, y: 265, w: 100, h: 22 },
    { x: 910, y: 225, w: 100, h: 22 },
    { x: 1120, y: 275, w: 120, h: 22 },
    { x: 1330, y: 325, w: 120, h: 22 },
    { x: 1540, y: 285, w: 120, h: 22 },
    { x: 1760, y: 245, w: 120, h: 22 },
  ], [
    { x: 665, y: FLOOR_Y + 14, w: 70, h: 28 },
    { x: 1240, y: FLOOR_Y + 14, w: 70, h: 28 },
    { x: 1665, y: FLOOR_Y + 14, w: 70, h: 28 },
  ], [
    enemySpec(460, 317, 410, 475),
    enemySpec(1135, 247, 1120, 1210),
    enemySpec(1785, 217, 1760, 1850),
  ], [
    eggSpec(930, 185),
    eggSpec(1580, 245),
    eggSpec(1980, 200),
  ]),
  levelSpec(1, 4, 2450, [
    { x: 250, y: 370, w: 120, h: 22 },
    { x: 470, y: 320, w: 120, h: 22 },
    { x: 700, y: 270, w: 120, h: 22 },
    { x: 930, y: 220, w: 120, h: 22 },
    { x: 1180, y: 300, w: 150, h: 22 },
    { x: 1420, y: 250, w: 130, h: 22 },
    { x: 1650, y: 200, w: 130, h: 22 },
    { x: 1880, y: 255, w: 150, h: 22 },
    { x: 2130, y: 215, w: 140, h: 22 },
  ], [
    { x: 610, y: FLOOR_Y + 14, w: 76, h: 28 },
    { x: 1110, y: FLOOR_Y + 14, w: 76, h: 28 },
    { x: 1820, y: FLOOR_Y + 14, w: 76, h: 28 },
  ], [
    enemySpec(300, 342, 250, 360),
    enemySpec(960, 192, 930, 1030),
    enemySpec(1910, 227, 1880, 2010),
  ], [
    eggSpec(735, 235),
    eggSpec(1460, 215),
    eggSpec(2165, 180),
  ]),
];

function createBoss(world) {
  return {
    kind: "boss",
    world,
    stage: "Boss",
    length: 1600,
    start: { x: 140, y: FLOOR_Y - 64 },
    platforms: [
      { x: 280, y: 340, w: 180, h: 22 },
      { x: 580, y: 250, w: 180, h: 22 },
      { x: 900, y: 340, w: 180, h: 22 },
      { x: 1180, y: 250, w: 180, h: 22 },
    ],
    hazards: [],
    boss: {
      x: 1190,
      y: FLOOR_Y - 84,
      w: 58,
      h: 72,
      vx: 70,
      direction: -1,
      cooldown: 0,
      stunned: 0,
      lives: 3,
    },
  };
}

const touchButtons = document.querySelectorAll(".touch-button");
touchButtons.forEach((button) => {
  const action = button.dataset.action;
  const down = () => {
    input[action] = true;
  };
  const up = () => {
    input[action] = false;
  };

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    down();
  });
  button.addEventListener("pointerup", up);
  button.addEventListener("pointerleave", up);
  button.addEventListener("pointercancel", up);
  button.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
});

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "a", "A"].includes(event.key)) {
    input.left = true;
  }
  if (["ArrowRight", "d", "D"].includes(event.key)) {
    input.right = true;
  }
  if (["ArrowUp", "w", "W", " "].includes(event.key)) {
    input.jump = true;
  }
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(event.key)) {
    event.preventDefault();
  }
  if (event.key === "Enter" && !gameState.running) {
    if (gameState.pendingAction) {
      const action = gameState.pendingAction;
      gameState.pendingAction = null;
      action();
    } else {
      startGame();
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (["ArrowLeft", "a", "A"].includes(event.key)) {
    input.left = false;
  }
  if (["ArrowRight", "d", "D"].includes(event.key)) {
    input.right = false;
  }
  if (["ArrowUp", "w", "W", " "].includes(event.key)) {
    input.jump = false;
  }
});

window.addEventListener("blur", () => {
  input.left = false;
  input.right = false;
  input.jump = false;
});

startButton.addEventListener("click", () => {
  unlockAudio();
  if (gameState.pendingAction) {
    const action = gameState.pendingAction;
    gameState.pendingAction = null;
    action();
    return;
  }
  startGame();
});

screenButton.addEventListener("click", async () => {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  } catch (error) {
    gameState.currentMessage = "Vollbild wird auf diesem Geraet nicht unterstuetzt.";
    updateHud();
  }
});

document.addEventListener("fullscreenchange", () => {
  screenButton.textContent = document.fullscreenElement ? "Fenster" : "Vollbild";
});

helpButton.addEventListener("click", () => {
  activateJumpAssist();
});

document.addEventListener(
  "pointerdown",
  () => {
    if (!audioState.unlocked) {
      unlockAudio();
    }
  },
  { passive: true }
);

function deepCloneLevel(level) {
  return JSON.parse(JSON.stringify(level));
}

function startGame() {
  gameState.runId += 1;
  gameState.running = true;
  gameState.pendingAction = null;
  gameState.currentLevelIndex = 0;
  gameState.worldIndex = 0;
  gameState.worldCoins = 0;
  gameState.totalCoins = 0;
  gameState.bossHits = 0;
  gameState.bossDefeated = false;
  hideOverlay();
  loadLevel(levels[0]);
}

function loadLevel(level) {
  gameState.activeMode = level.kind;
  gameState.currentLevel = deepCloneLevel(level);
  gameState.worldIndex = level.world;
  gameState.currentLevelTime = 0;
  gameState.eggsCollected = 0;
  resetPlayer(level.start.x, level.start.y);
  gameState.cameraX = 0;
  gameState.currentMessage =
    level.kind === "boss"
      ? "Springe auf den Boesewicht, um ihn zu fangen."
      : "Hole die Muenze und renne dann zum Ziel.";
  updateHud();
}

function resetPlayer(x, y) {
  player.x = x;
  player.y = y;
  player.vx = 0;
  player.vy = 0;
  player.grounded = false;
  player.coyoteTimer = 0;
  player.jumpBuffer = 0;
  player.jumpHoldTimer = 0;
  player.jumpSoundPlayed = false;
  player.bubbleTrailTimer = 0;
  gameState.assistActive = false;
}

function updateHud() {
  if (!gameState.currentLevel) {
    timeLabel.textContent = formatTime(gameState.currentLevelTime);
    eggLabel.textContent = String(gameState.eggsCollected);
    return;
  }
  const level = gameState.currentLevel;
  const worldText = `${level.world + 1}-${level.stage}`;
  levelLabel.textContent = worldText;
  coinLabel.textContent = `${gameState.worldCoins} / ${LEVELS_PER_WORLD}`;
  statusLabel.textContent = gameState.currentMessage;
  timeLabel.textContent = formatTime(gameState.currentLevelTime);
  eggLabel.textContent = String(gameState.eggsCollected);
}

function showOverlay(title, text, buttonText = "Nochmal spielen") {
  overlayTitle.textContent = title;
  overlayText.innerHTML = text;
  startButton.textContent = buttonText;
  overlay.classList.add("visible");
  gameState.running = false;
  statusLabel.textContent = title;
}

function hideOverlay() {
  overlay.classList.remove("visible");
  startButton.textContent = "Neu starten";
  gameState.pendingAction = null;
}

function getSolids(level) {
  return [
    { x: -200, y: FLOOR_Y, w: level.length + 400, h: HEIGHT - FLOOR_Y },
    ...level.platforms,
  ];
}

function getAssistTarget(level) {
  const currentFootY = player.y + player.h;
  const currentCenterX = player.x + player.w / 2;
  const candidates = getSolids(level)
    .filter((solid) => solid.y <= currentFootY + 12)
    .filter((solid) => solid.x + 24 > currentCenterX + 40)
    .map((solid) => ({
      x: Math.max(solid.x + 24, Math.min(solid.x + solid.w - 24, currentCenterX + 120)),
      y: solid.y - player.h,
      gap: solid.x - currentCenterX,
    }))
    .sort((a, b) => {
      if (Math.abs(a.y - player.y) !== Math.abs(b.y - player.y)) {
        return Math.abs(a.y - player.y) - Math.abs(b.y - player.y);
      }
      return a.gap - b.gap;
    });

  if (candidates.length > 0) {
    return candidates[0];
  }

  const fallbackX = Math.min(level.length - player.w, player.x + 180);
  return { x: fallbackX, y: FLOOR_Y - player.h };
}

function activateJumpAssist() {
  const level = gameState.currentLevel;
  if (!level || !gameState.running || level.kind !== "level") {
    return;
  }

  const target = getAssistTarget(level);
  if (!target) {
    return;
  }

  gameState.assistActive = true;
  gameState.assistTargetX = target.x;
  gameState.assistTargetY = target.y;
  player.vy = -720;
  player.grounded = false;
  player.jumpHoldTimer = 0;
  player.jumpBuffer = 0;
  player.jumpSoundPlayed = true;
  spawnJumpBubbles(10);
  playSound("assist");
  gameState.currentMessage = "Sprunghilfe aktiv.";
  updateHud();
}

function updateBubbles(dt) {
  gameState.bubbles = gameState.bubbles
    .map((bubble) => ({
      ...bubble,
      x: bubble.x + bubble.vx * dt,
      y: bubble.y + bubble.vy * dt,
      vy: bubble.vy - 14 * dt,
      life: bubble.life - dt,
    }))
    .filter((bubble) => bubble.life > 0);
}

function aabbOverlap(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function circleBoxOverlap(circle, box) {
  const closestX = Math.max(box.x, Math.min(circle.x, box.x + box.w));
  const closestY = Math.max(box.y, Math.min(circle.y, box.y + box.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return dx * dx + dy * dy < circle.r * circle.r;
}

function formatTime(seconds) {
  const total = Math.max(0, Math.round(seconds * 10) / 10);
  return `${total.toFixed(1)} s`;
}

function levelKey(level) {
  return `hoppel-helden-${level.world + 1}-${level.stage}`;
}

function getStoredScore(level) {
  try {
    const raw = window.localStorage.getItem(levelKey(level));
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

function saveStoredScore(level, score) {
  try {
    window.localStorage.setItem(levelKey(level), JSON.stringify(score));
  } catch (error) {
    // Ignore storage issues and keep the current run playable.
  }
}

function updateEnemies(level, dt) {
  for (const enemy of level.enemies) {
    if (enemy.dead) {
      continue;
    }
    enemy.x += enemy.speed * enemy.direction * dt;
    if (enemy.x <= enemy.left) {
      enemy.x = enemy.left;
      enemy.direction = 1;
    }
    if (enemy.x + enemy.w >= enemy.right) {
      enemy.x = enemy.right - enemy.w;
      enemy.direction = -1;
    }

    if (!aabbOverlap(player, enemy)) {
      continue;
    }

    const stomped =
      player.vy > 120 && player.y + player.h - 8 < enemy.y + enemy.h * 0.5;

    if (stomped) {
      enemy.dead = true;
      player.vy = -430;
      playSound("enemy");
      gameState.currentMessage = "Boing! Gegner besiegt.";
      updateHud();
    } else {
      loseTry("Oh nein! Spring dem Gegner auf den Kopf.");
      return true;
    }
  }

  return false;
}

function updateEggs(level) {
  for (const egg of level.eggs) {
    if (egg.collected || !aabbOverlap(player, egg)) {
      continue;
    }
    egg.collected = true;
    gameState.eggsCollected += 1;
    playSound("egg");
    gameState.currentMessage = "Ein Osterei gefunden!";
    updateHud();
  }
}

function finishLevelSummary() {
  const level = gameState.currentLevel;
  const currentScore = {
    time: gameState.currentLevelTime,
    eggs: gameState.eggsCollected,
  };
  const previousBest = getStoredScore(level);

  const isBetterTime = !previousBest || currentScore.time < previousBest.time;
  const isBetterEggs = !previousBest || currentScore.eggs > previousBest.eggs;
  const nextBest = {
    time: previousBest ? Math.min(previousBest.time, currentScore.time) : currentScore.time,
    eggs: previousBest ? Math.max(previousBest.eggs, currentScore.eggs) : currentScore.eggs,
  };
  saveStoredScore(level, nextBest);

  const bestText = previousBest
    ? `Bestzeit: ${formatTime(nextBest.time)}<br>Beste Ostereier: ${nextBest.eggs}`
    : `Neuer erster Bestwert!<br>Bestzeit: ${formatTime(nextBest.time)}<br>Beste Ostereier: ${nextBest.eggs}`;
  const resultText = [
    `Level ${level.world + 1}-${level.stage} geschafft!`,
    `Deine Zeit: ${formatTime(currentScore.time)}`,
    `Deine Ostereier: ${currentScore.eggs}`,
    bestText,
    isBetterTime || isBetterEggs ? "Heute war das ein neuer Highscore." : "Stark gespielt!",
  ].join("<br>");

  const finishedIndex = gameState.currentLevelIndex;
  const inWorldStage = (finishedIndex % LEVELS_PER_WORLD) + 1;
  const nextAction = () => {
    hideOverlay();
    if (inWorldStage < LEVELS_PER_WORLD) {
      gameState.running = true;
      gameState.currentLevelIndex += 1;
      loadLevel(levels[gameState.currentLevelIndex]);
      return;
    }

    if (gameState.worldCoins === LEVELS_PER_WORLD) {
      gameState.running = true;
      loadLevel(createBoss(gameState.worldIndex));
    }
  };

  gameState.pendingAction = nextAction;
  playSound("levelClear");
  showOverlay("Level geschafft!", resultText, "Weiter");
}

function updatePlayer(dt) {
  const level = gameState.currentLevel;
  const solids = getSolids(level);
  gameState.currentLevelTime += dt;
  updateHud();
  const wasGrounded = player.grounded;

  if (gameState.assistActive) {
    const targetCenterX = gameState.assistTargetX + player.w / 2;
    const playerCenterX = player.x + player.w / 2;
    const distanceX = targetCenterX - playerCenterX;
    if (Math.abs(distanceX) < 8) {
      player.vx = distanceX * 6;
    } else {
      player.vx = Math.sign(distanceX) * 285;
      player.facing = Math.sign(distanceX) || player.facing;
    }
  }

  const dir = Number(input.right) - Number(input.left);
  if (!gameState.assistActive) {
    const accel = player.grounded ? physics.accelGround : physics.accelAir;
    const friction = player.grounded ? physics.frictionGround : physics.frictionAir;

    if (dir !== 0) {
      player.vx += dir * accel * dt;
      player.facing = dir;
    } else {
      const drag = friction * dt;
      if (Math.abs(player.vx) <= drag) {
        player.vx = 0;
      } else {
        player.vx -= Math.sign(player.vx) * drag;
      }
    }
  }

  player.vx = Math.max(-physics.maxRunSpeed, Math.min(physics.maxRunSpeed, player.vx));

  if (!player.grounded && player.vy < 90) {
    player.bubbleTrailTimer -= dt;
    if (player.bubbleTrailTimer <= 0) {
      spawnJumpBubbles(2, 10);
      player.bubbleTrailTimer = 0.05;
    }
  } else {
    player.bubbleTrailTimer = 0;
  }

  if (input.jump) {
    player.jumpBuffer = physics.jumpBufferTime;
  } else {
    player.jumpHoldTimer = 0;
  }

  player.jumpBuffer = Math.max(0, player.jumpBuffer - dt);
  player.coyoteTimer = player.grounded
    ? physics.coyoteTime
    : Math.max(0, player.coyoteTimer - dt);

  if (player.jumpBuffer > 0 && player.coyoteTimer > 0) {
    player.vy = -physics.jumpSpeed;
    player.grounded = false;
    player.coyoteTimer = 0;
    player.jumpBuffer = 0;
    player.jumpHoldTimer = physics.jumpHoldTime;
    if (!player.jumpSoundPlayed) {
      spawnJumpBubbles(7, 18);
      playSound("jump");
      player.jumpSoundPlayed = true;
    }
  }

  if (input.jump && player.jumpHoldTimer > 0 && player.vy < 0) {
    player.vy -= physics.extraJumpBoost * dt;
    player.jumpHoldTimer -= dt;
  }

  player.vy = Math.min(player.vy + physics.gravity * dt, physics.maxFall);

  player.x += player.vx * dt;
  for (const solid of solids) {
    if (!aabbOverlap(player, solid)) {
      continue;
    }
    if (player.vx > 0) {
      player.x = solid.x - player.w;
    } else if (player.vx < 0) {
      player.x = solid.x + solid.w;
    }
    player.vx = 0;
  }

  player.y += player.vy * dt;
  player.grounded = false;
  for (const solid of solids) {
    if (!aabbOverlap(player, solid)) {
      continue;
    }
    if (player.vy > 0) {
      player.y = solid.y - player.h;
      player.vy = 0;
      player.grounded = true;
      player.jumpHoldTimer = 0;
      if (!wasGrounded) {
        playSound("land");
      }
      player.jumpSoundPlayed = false;
      gameState.assistActive = false;
    } else if (player.vy < 0) {
      player.y = solid.y + solid.h;
      player.vy = 0;
    }
  }

  player.x = Math.max(0, Math.min(level.length - player.w, player.x));

  if (player.y > HEIGHT + 120) {
    gameState.assistActive = false;
    loseTry("Ups, noch mal! Der Hase versucht es erneut.");
    return;
  }

  for (const hazard of level.hazards) {
    if (aabbOverlap(player, hazard)) {
      loseTry("Autsch! Wir probieren das Level noch einmal.");
      return;
    }
  }

  if (level.kind === "level") {
    if (updateEnemies(level, dt)) {
      return;
    }

    updateEggs(level);

    if (!level.coin.collected && circleBoxOverlap(level.coin, player)) {
      level.coin.collected = true;
      playSound("coin");
      gameState.currentMessage = "Super! Jetzt schnell zum Ziel.";
      updateHud();
    }

    if (aabbOverlap(player, level.goal)) {
      if (level.coin.collected) {
        advanceAfterLevel();
      } else {
        gameState.currentMessage = "Die Muenze fehlt noch.";
        updateHud();
      }
    }
  } else {
    updateBoss(dt);
  }

  const targetCamera = player.x - WIDTH * 0.34;
  gameState.cameraX = Math.max(0, Math.min(level.length - WIDTH, targetCamera));
}

function updateBoss(dt) {
  const level = gameState.currentLevel;
  const boss = level.boss;

  if (boss.stunned > 0) {
    boss.stunned -= dt;
  } else {
    boss.x += boss.vx * boss.direction * dt;
    if (boss.x < 940) {
      boss.direction = 1;
    }
    if (boss.x + boss.w > level.length - 120) {
      boss.direction = -1;
    }
  }

  const bossBox = { x: boss.x, y: boss.y, w: boss.w, h: boss.h };
  if (!aabbOverlap(player, bossBox)) {
    return;
  }

  const stomped =
    player.vy > 120 && player.y + player.h - 10 < boss.y + boss.h * 0.5;

  if (stomped && boss.stunned <= 0) {
    boss.lives -= 1;
    gameState.bossHits += 1;
    boss.stunned = 0.7;
    player.vy = -480;
    playSound("bossHit");
    gameState.currentMessage = `Treffer ${gameState.bossHits} von 3!`;
    updateHud();

    if (boss.lives <= 0) {
      winBossFight();
    }
  } else if (boss.stunned <= 0) {
    loseTry("Der Boesewicht war schneller. Auf geht's noch einmal.");
  }
}

function loseTry(message) {
  playSound("hurt");
  gameState.currentMessage = message;
  updateHud();
  const current = gameState.currentLevel;
  const snapshot = current.kind === "boss" ? createBoss(current.world) : levels[gameState.currentLevelIndex];
  const attemptRunId = gameState.runId;
  setTimeout(() => {
    if (!gameState.running || attemptRunId !== gameState.runId) {
      return;
    }
    loadLevel(snapshot);
  }, 450);
}

function advanceAfterLevel() {
  const finishedIndex = gameState.currentLevelIndex;
  const inWorldStage = (finishedIndex % LEVELS_PER_WORLD) + 1;
  gameState.worldCoins += 1;
  gameState.totalCoins += 1;
  finishLevelSummary(inWorldStage, finishedIndex);
}

function winBossFight() {
  const finishedWorld = gameState.worldIndex;

  if (finishedWorld === 0) {
    gameState.worldCoins = 0;
    gameState.currentLevelIndex = 4;
    loadLevel(levels[4]);
    gameState.currentMessage = "Boesewicht erwischt! Jetzt kommen vier neue Level.";
    updateHud();
    return;
  }

  showOverlay(
    "Geschafft!",
    "Der Hase hat alle acht Muenzen gesammelt und den Boesewicht gefangen. Du bist ein echter Hoppel-Held!",
    "Noch eine Runde"
  );
  playSound("victory");
}

function drawSky(theme) {
  const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, theme.skyTop);
  gradient.addColorStop(1, theme.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  for (let i = 0; i < 6; i += 1) {
    const x = ((i * 180) - gameState.cameraX * 0.2) % (WIDTH + 200);
    drawCloud(x - 100, 80 + (i % 3) * 42, 0.9 + (i % 2) * 0.2);
  }

  ctx.fillStyle = theme.hill;
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT);
  ctx.quadraticCurveTo(170, 290, 350, HEIGHT);
  ctx.quadraticCurveTo(530, 280, 710, HEIGHT);
  ctx.quadraticCurveTo(860, 330, WIDTH, HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = theme.hillDark;
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT);
  ctx.quadraticCurveTo(120, 350, 260, HEIGHT);
  ctx.quadraticCurveTo(420, 320, 590, HEIGHT);
  ctx.quadraticCurveTo(790, 260, WIDTH, HEIGHT);
  ctx.closePath();
  ctx.fill();
}

function drawCloud(x, y, scale) {
  ctx.beginPath();
  ctx.arc(x, y, 18 * scale, 0, Math.PI * 2);
  ctx.arc(x + 22 * scale, y - 10 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.arc(x + 46 * scale, y, 18 * scale, 0, Math.PI * 2);
  ctx.fill();
}

function drawGround(level) {
  const startX = -gameState.cameraX;
  ctx.fillStyle = "#5ead4c";
  ctx.fillRect(startX, FLOOR_Y, level.length, HEIGHT - FLOOR_Y);

  ctx.fillStyle = "#2d7f32";
  ctx.fillRect(startX, FLOOR_Y, level.length, 16);

  ctx.fillStyle = "#965d37";
  for (let x = 0; x < level.length; x += 48) {
    ctx.fillRect(startX + x, FLOOR_Y + 28, 34, 14);
  }
}

function drawPlatforms(level) {
  for (const platform of level.platforms) {
    const x = platform.x - gameState.cameraX;
    ctx.fillStyle = "#7a4a29";
    ctx.fillRect(x, platform.y, platform.w, platform.h);
    ctx.fillStyle = "#62b34c";
    ctx.fillRect(x, platform.y, platform.w, 8);
  }
}

function drawHazards(level) {
  for (const hazard of level.hazards) {
    const x = hazard.x - gameState.cameraX;
    ctx.fillStyle = "#d54f4f";
    for (let i = 0; i < hazard.w; i += 18) {
      ctx.beginPath();
      ctx.moveTo(x + i, hazard.y + hazard.h);
      ctx.lineTo(x + i + 9, hazard.y);
      ctx.lineTo(x + i + 18, hazard.y + hazard.h);
      ctx.closePath();
      ctx.fill();
    }
  }
}

function drawCoin(coin) {
  const x = coin.x - gameState.cameraX;
  ctx.fillStyle = "#ffd447";
  ctx.beginPath();
  ctx.arc(x, coin.y, coin.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff4b0";
  ctx.beginPath();
  ctx.arc(x - 4, coin.y - 4, coin.r * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawBubbles() {
  for (const bubble of gameState.bubbles) {
    const alpha = Math.max(0, bubble.life / bubble.maxLife);
    const x = bubble.x - gameState.cameraX;
    const y = bubble.y;
    ctx.fillStyle = `rgba(210, 244, 255, ${0.18 * alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, bubble.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 * alpha})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(x, y, bubble.radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, ${0.55 * alpha})`;
    ctx.beginPath();
    ctx.arc(x - bubble.radius * 0.28, y - bubble.radius * 0.28, Math.max(1.5, bubble.radius * 0.18), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGoal(goal, active) {
  const x = goal.x - gameState.cameraX;
  ctx.fillStyle = "#7d5131";
  ctx.fillRect(x + 18, goal.y - 40, 10, goal.h + 40);
  ctx.fillStyle = active ? "#ffca3a" : "#c7c7c7";
  ctx.beginPath();
  ctx.moveTo(x + 28, goal.y - 40);
  ctx.lineTo(x + 68, goal.y - 22);
  ctx.lineTo(x + 28, goal.y - 4);
  ctx.closePath();
  ctx.fill();
}

function drawEgg(egg) {
  const x = egg.x - gameState.cameraX;
  const y = egg.y;
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 15, 12, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(x + 8, y + 12, 3, 0, Math.PI * 2);
  ctx.arc(x + 16, y + 18, 3, 0, Math.PI * 2);
  ctx.arc(x + 12, y + 22, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnemy(enemy) {
  const x = enemy.x - gameState.cameraX;
  const y = enemy.y;
  ctx.fillStyle = "#9b5f2d";
  ctx.fillRect(x + 4, y + 8, 26, 18);
  ctx.beginPath();
  ctx.arc(x + 17, y + 12, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f5ddc5";
  ctx.fillRect(x + 10, y + 16, 14, 7);
  ctx.fillStyle = "#2f2f2f";
  ctx.fillRect(x + 10, y + 8, 4, 5);
  ctx.fillRect(x + 20, y + 8, 4, 5);
}

function drawRabbit() {
  const x = player.x - gameState.cameraX;
  const y = player.y;

  ctx.save();
  if (player.facing < 0) {
    ctx.translate(x + player.w / 2, 0);
    ctx.scale(-1, 1);
    ctx.translate(-(x + player.w / 2), 0);
  }

  ctx.fillStyle = "#f5f0e8";
  ctx.fillRect(x + 10, y + 16, 22, 28);
  ctx.fillRect(x + 6, y + 2, 8, 26);
  ctx.fillRect(x + 20, y, 8, 28);
  ctx.beginPath();
  ctx.arc(x + 21, y + 16, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f4b2c0";
  ctx.fillRect(x + 8, y + 6, 4, 18);
  ctx.fillRect(x + 22, y + 4, 4, 20);

  ctx.fillStyle = "#2f2f2f";
  ctx.beginPath();
  ctx.arc(x + 25, y + 16, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(x + 29, y + 20, 4, 3);

  ctx.restore();
}

function drawBoss(boss) {
  const x = boss.x - gameState.cameraX;
  const y = boss.y;

  ctx.fillStyle = boss.stunned > 0 ? "#9ca3af" : "#7b2cbf";
  ctx.fillRect(x + 8, y + 18, 42, 44);
  ctx.beginPath();
  ctx.arc(x + 29, y + 20, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#2d1b45";
  ctx.fillRect(x + 12, y - 6, 8, 28);
  ctx.fillRect(x + 36, y - 6, 8, 28);

  ctx.fillStyle = "#fce7f3";
  ctx.fillRect(x + 14, y, 4, 18);
  ctx.fillRect(x + 38, y, 4, 18);

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x + 15, y + 16, 11, 5);
  ctx.fillRect(x + 31, y + 16, 11, 5);
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(x + 20, y + 16, 4, 5);
  ctx.fillRect(x + 34, y + 16, 4, 5);

  ctx.fillStyle = "#ffd447";
  for (let i = 0; i < boss.lives; i += 1) {
    ctx.beginPath();
    ctx.arc(x + 6 + i * 16, y - 18, 6, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLevelLabel(level) {
  const theme = worldThemes[level.world];
  ctx.fillStyle = "rgba(255, 251, 240, 0.9)";
  ctx.fillRect(18, 16, 230, 42);
  ctx.fillStyle = "#23303a";
  ctx.font = "bold 20px Trebuchet MS";
  ctx.fillText(`${theme.name}  ${level.world + 1}-${level.stage}`, 30, 43);
}

function draw() {
  const level = gameState.currentLevel;
  const theme = worldThemes[level.world];

  drawSky(theme);
  drawGround(level);
  drawPlatforms(level);
  drawHazards(level);

  if (level.kind === "level" && !level.coin.collected) {
    drawCoin(level.coin);
  }

  if (level.kind === "level") {
    for (const egg of level.eggs) {
      if (!egg.collected) {
        drawEgg(egg);
      }
    }
    for (const enemy of level.enemies) {
      if (!enemy.dead) {
        drawEnemy(enemy);
      }
    }
    drawGoal(level.goal, level.coin.collected);
  } else {
    drawBoss(level.boss);
  }

  drawBubbles();
  drawRabbit();
  drawLevelLabel(level);
}

let lastTime = 0;
function loop(timestamp) {
  const dt = Math.min(1 / 30, (timestamp - lastTime) / 1000 || 0);
  lastTime = timestamp;

  if (gameState.running && gameState.currentLevel) {
    updatePlayer(dt);
  }

  updateBubbles(dt);

  if (gameState.currentLevel) {
    draw();
  }

  requestAnimationFrame(loop);
}

showOverlay(
  "Hoppel-Helden",
  "Vier Level, vier Muenzen, dann wartet der Boesewicht.<br>Springe Gegnern auf den Kopf und sammle unterwegs optionale Ostereier."
);
requestAnimationFrame(loop);
