const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const startScreenEl = document.getElementById("startScreen");
const startButtonEl = document.getElementById("startButton");
const touchButtons = Array.from(document.querySelectorAll(".touch-btn"));

let audioContext = null;
let audioUnlocked = false;
const soundFiles = {
  suction: "assets/sounds/suction.mp3",
  "suction-hit": "assets/sounds/suction-hit.mp3",
  alarm: "assets/sounds/alarm.mp3",
  "trash-drop": "assets/sounds/trash-drop.mp3",
  press: "assets/sounds/press.mp3",
  cube: "assets/sounds/cube.mp3",
  levelup: "assets/sounds/levelup.mp3",
  upgrade: "assets/sounds/upgrade.mp3",
  repair: "assets/sounds/repair.mp3",
};
const soundBank = {};

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
  ship: {
    thrustTimer: 0,
    thrustCooldown: 240,
    accel: 0,
    tilt: 0,
    tiltVelocity: 0,
    shakeTimer: 0,
  },
  levelBurstTimer: 0,
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
    press: false,
  },
  upgradeTimers: {
    tank: 0,
    vacuum: 0,
    drive: 0,
    press: 0,
  },
  maintenance: {
    active: false,
    phase: "idle",
    timer: 0,
    blink: 0,
    partsNeeded: 0,
    missingParts: [],
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
    x: canvas.width * 0.58,
    y: -120,
    targetY: -8,
    timer: 0,
    spawned: false,
  },
  sound: {
    suctionFrame: 0,
  },
  repairParts: [],
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
  { key: "tank", label: "TANK", cost: 12 },
  { key: "vacuum", label: "VAC", cost: 26 },
  { key: "drive", label: "DRIVE", cost: 44 },
  { key: "press", label: "PRESS", cost: 66 },
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
];

function random(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function randomSpawnDelay(level) {
  const minDelay = Math.max(105, 430 - level * 26);
  const maxDelay = Math.max(190, 640 - level * 34);
  return Math.floor(random(minDelay, maxDelay));
}

function ensureAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!audioUnlocked) {
    if (AudioCtx) {
      audioContext = new AudioCtx();
    }
    for (const [name, src] of Object.entries(soundFiles)) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      soundBank[name] = audio;
    }
    audioUnlocked = true;
  }
  if (audioContext && audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
}

function tryPlayFile(name, volume = 0.55) {
  const base = soundBank[name];
  if (!base) {
    return false;
  }
  const player = base.cloneNode();
  player.volume = volume;
  player.play().catch(() => {});
  return true;
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
  if (
    name === "suction" &&
    tryPlayFile(name, 0.18)
  ) {
    return;
  }
  if (
    ["suction-hit", "alarm", "trash-drop", "press", "cube", "levelup", "upgrade", "repair"].includes(name) &&
    tryPlayFile(name, 0.52)
  ) {
    return;
  }
  if (name === "suction") {
    playTone({ frequency: 132, duration: 0.07, type: "sine", gain: 0.018, slide: 1.03 });
    playTone({ frequency: 208, duration: 0.045, type: "triangle", gain: 0.008, slide: 0.98 });
    playNoise({ duration: 0.028, gain: 0.006 });
    return;
  }
  if (name === "suction-hit") {
    playTone({ frequency: 820, duration: 0.03, type: "triangle", gain: 0.012, slide: 0.84 });
    playNoise({ duration: 0.024, gain: 0.012 });
    return;
  }
  if (name === "alarm") {
    playTone({ frequency: 520, duration: 0.08, type: "square", gain: 0.035, slide: 0.9 });
    playTone({ frequency: 660, duration: 0.08, type: "square", gain: 0.03, slide: 0.9 });
    return;
  }
  if (name === "trash-drop") {
    playNoise({ duration: 0.12, gain: 0.028 });
    return;
  }
  if (name === "press") {
    playTone({ frequency: 128, duration: 0.08, type: "square", gain: 0.028, slide: 0.84 });
    playTone({ frequency: 96, duration: 0.12, type: "triangle", gain: 0.025, slide: 0.9 });
    playNoise({ duration: 0.06, gain: 0.012 });
    return;
  }
  if (name === "cube") {
    playTone({ frequency: 392, duration: 0.05, type: "triangle", gain: 0.02, slide: 1.12 });
    playTone({ frequency: 523, duration: 0.09, type: "sine", gain: 0.024, slide: 1.06 });
    return;
  }
  if (name === "levelup") {
    playTone({ frequency: 392, duration: 0.08, type: "triangle", gain: 0.028, slide: 1.02 });
    playTone({ frequency: 523, duration: 0.1, type: "triangle", gain: 0.03, slide: 1.03 });
    playTone({ frequency: 659, duration: 0.13, type: "sine", gain: 0.032, slide: 1.04 });
    return;
  }
  if (name === "upgrade") {
    playTone({ frequency: 330, duration: 0.06, type: "triangle", gain: 0.02, slide: 1.05 });
    playTone({ frequency: 494, duration: 0.12, type: "sine", gain: 0.025, slide: 1.08 });
    return;
  }
  if (name === "repair") {
    playTone({ frequency: 262, duration: 0.04, type: "square", gain: 0.018, slide: 1 });
    playTone({ frequency: 330, duration: 0.05, type: "square", gain: 0.018, slide: 1 });
    playTone({ frequency: 392, duration: 0.08, type: "triangle", gain: 0.02, slide: 1.03 });
  }
}

function createTrashItem(style, x, y, id) {
  const roll = Math.random();
  const hazardous = roll < 0.08;
  const burning = !hazardous && roll > 0.9;
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
  };
}

function spawnTrash(count = 22, source = "default", originX = null) {
  for (let i = 0; i < count; i += 1) {
    const style = trashTypes[Math.floor(Math.random() * trashTypes.length)];
    const x =
      source === "pipe" && originX !== null
        ? originX + random(-28, 28)
        : random(320, world.width - 90);
    const y =
      source === "pipe"
        ? random(-20, 36)
        : random(80, world.floorY - 220);
    const item = createTrashItem(style, x, y, `trash-${Date.now()}-${i}`);
    if (source === "pipe") {
      item.vx = random(-1.8, 1.8);
      item.vy = random(0.8, 2.8);
    }
    world.particles.push(item);
  }
}

function nextTrashBatchSize() {
  const minBatch = 10 + Math.min(8, Math.floor((world.level - 1) * 0.9));
  const maxBatch = minBatch + 7 + Math.floor(world.level * 1.8);
  return minBatch + Math.floor(Math.random() * Math.max(1, maxBatch - minBatch + 1));
}

function upgradeActive(key) {
  return !!world.upgrades[key];
}

function decodeGlitch(code) {
  return String.fromCharCode(...code.map((value) => value ^ glitchCipher.mask));
}

function applyUpgradeEffects() {
  world.cargoCapacity = upgradeActive("tank") ? 12 : 6;
  if (robot.cargo.length > world.cargoCapacity) {
    robot.cargo.length = world.cargoCapacity;
  }
}

function spawnUpgradeDrop(key) {
  const upgrade = UPGRADE_DEFS.find((item) => item.key === key);
  if (!upgrade) {
    return false;
  }
  if (
    upgradeActive(key) ||
    world.upgradeDrops.find((item) => item.key === key) ||
    world.upgradePoints < upgrade.cost
  ) {
    return false;
  }

  world.upgradePoints -= upgrade.cost;
  world.upgradeDrops.push({
    key: upgrade.key,
    label: upgrade.label,
    cost: upgrade.cost,
    x: random(170, world.width - 170),
    y: -30,
    vx: random(-0.4, 0.4),
    vy: random(0.8, 1.6),
    size: 22,
    rotation: random(-0.3, 0.3),
    spin: random(-0.02, 0.02),
  });
  playSound("upgrade");
  return true;
}

function spawnUpgradeDropForTest(key) {
  if (upgradeActive(key) || world.upgradeDrops.find((item) => item.key === key)) {
    return false;
  }
  const upgrade = UPGRADE_DEFS.find((item) => item.key === key);
  if (!upgrade) {
    return false;
  }
  world.upgradeDrops.push({
    key: upgrade.key,
    label: upgrade.label,
    cost: upgrade.cost,
    x: random(170, world.width - 170),
    y: -30,
    vx: random(-0.4, 0.4),
    vy: random(0.8, 1.6),
    size: 22,
    rotation: random(-0.3, 0.3),
    spin: random(-0.02, 0.02),
  });
  return true;
}

function activateUpgrade(key) {
  world.upgrades[key] = true;
  world.upgradeTimers[key] = 60 * 60;
  applyUpgradeEffects();
  playSound("upgrade");
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
    world.upgradeTimers[upgrade.key] = Math.max(0, world.upgradeTimers[upgrade.key] - 1);
    if (world.upgradeTimers[upgrade.key] === 0) {
      world.upgrades[upgrade.key] = false;
      applyUpgradeEffects();
    }
  }
}

function resetYard() {
  robot.x = 260;
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
  world.spawnTimer = randomSpawnDelay(1);
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
  world.combo.count = 0;
  world.combo.timer = 0;
  world.upgradePoints = 0;
  world.upgradeDrops = [];
  world.upgrades.tank = false;
  world.upgrades.vacuum = false;
  world.upgrades.drive = false;
  world.upgrades.press = false;
  world.upgradeTimers.tank = 0;
  world.upgradeTimers.vacuum = 0;
  world.upgradeTimers.drive = 0;
  world.upgradeTimers.press = 0;
  world.upgradeButtons = [];
  world.exhaustParticles = [];
  world.repairParts = [];
  world.activeCubes = [];
  world.spaceCubes = [];
  world.pressQueue = [];
  world.cranes = [];
  world.zeroGCooldown = 480;
  world.maintenance.active = false;
  world.maintenance.phase = "idle";
  world.maintenance.timer = 0;
  world.maintenance.blink = 0;
  world.maintenance.partsNeeded = 0;
  world.maintenance.missingParts = [];
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
  world.refillPipe.y = -120;
  world.refillPipe.timer = 0;
  world.refillPipe.spawned = false;
  world.sound.suctionFrame = 0;
  world.particles = [];
  applyUpgradeEffects();
  spawnTrash(18);
  syncHud();
}

function triggerRefillPipe() {
  world.spawnTimer = randomSpawnDelay(world.level);
  spawnTrash(nextTrashBatchSize(), "pipe");
  playSound("trash-drop");
}

function syncHud() {
  return;
}

function triggerPressAction() {
  const queued = queuePressCycle();
  if (queued) {
    playSound("press");
    robot.processState = "warning";
    robot.processTimer = upgradeActive("press") ? 34 : 52;
  }
}

function pressVirtualKey(key) {
  world.keys[key] = true;
}

function releaseVirtualKey(key) {
  world.keys[key] = false;
}

function updateRobot() {
  if (world.gameOver) {
    robot.velocityX *= 0.86;
    robot.intakeExtension += (0 - robot.intakeExtension) * 0.24;
    return;
  }

  const suctionActive = !!world.keys[" "];
  const outOfFuel = world.fuel <= 0.01 || world.refuel.active;
  const engineActive = !outOfFuel;
  const broken = world.maintenance.active;

  const moveLeft = world.keys.ArrowLeft || world.keys.a || world.keys.A;
  const moveRight = world.keys.ArrowRight || world.keys.d || world.keys.D;
  const acceleration = 0.18;
  const topSpeed = upgradeActive("drive") ? 5.9 : 4.9;
  const zeroGControl = world.zeroGTimer > 0 ? 0.09 : 0;

  if (moveLeft && engineActive) {
    robot.velocityX -= acceleration + zeroGControl;
    robot.swayVelocity -= 0.01;
    robot.direction = -1;
  }

  if (moveRight && engineActive) {
    robot.velocityX += acceleration + zeroGControl;
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
  robot.velocityX = clamp(robot.velocityX, -topSpeed, topSpeed);
  robot.x = clamp(robot.x + robot.velocityX, 70, world.width - 110);
  const targetExtension =
    suctionActive && robot.cargo.length < world.cargoCapacity && !outOfFuel && !broken ? 1 : 0;
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

  for (const item of world.particles) {
    item.firePhase += 0.15;
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
    const halfWidth = 54;
    const halfHeight = 34;
    const nearX = clamp(dxRobot, -halfWidth, halfWidth);
    const nearY = clamp(dyRobot, -halfHeight, halfHeight);
    const diffX = dxRobot - nearX;
    const diffY = dyRobot - nearY;
    const distanceRobot = Math.hypot(diffX, diffY);

    if (distanceRobot < item.radius + 2) {
      const safeDistance = distanceRobot || 0.001;
      const push = item.radius + 2 - safeDistance;
      const nx = diffX / safeDistance;
      const ny = diffY / safeDistance;
      item.x += nx * push;
      item.y += ny * push;
      item.vx += nx * (0.45 + Math.abs(robot.velocityX) * 0.2) + robot.velocityX * 0.08;
      item.vy += ny * 0.18;
    }
  }

  for (let i = 0; i < world.particles.length; i += 1) {
    for (let j = i + 1; j < world.particles.length; j += 1) {
      const a = world.particles[i];
      const b = world.particles[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = a.radius + b.radius;

      if (!distance || distance >= minDistance) {
        continue;
      }

      const overlap = (minDistance - distance) * 0.5;
      const nx = dx / distance;
      const ny = dy / distance;

      a.x -= nx * overlap;
      a.y -= ny * overlap;
      b.x += nx * overlap;
      b.y += ny * overlap;

      a.vx -= nx * 0.08;
      a.vy -= ny * 0.08;
      b.vx += nx * 0.08;
      b.vy += ny * 0.08;
    }
  }
}

function tryCollectTrash() {
  if (
    world.gameOver ||
    !world.keys[" "] ||
    robot.cargo.length >= world.cargoCapacity ||
    world.fuel <= 0.01 ||
    world.maintenance.active
  ) {
    return;
  }

  const scoopX = robot.x + robot.direction * (robot.intakeReach + robot.intakeExtension * 18);
  const scoopY = world.floorY - 18;
  const suctionRange = (upgradeActive("vacuum") ? 128 : 92) + robot.intakeExtension * (upgradeActive("vacuum") ? 68 : 44);
  let collectedId = null;
  let nearestDistance = Infinity;

  for (const item of world.particles) {
    const distance = Math.hypot(item.x - scoopX, item.y - scoopY);

    if (!item.burning && distance < item.radius + 30 && distance < nearestDistance) {
      nearestDistance = distance;
      collectedId = item.id;
    }

    if (distance < suctionRange) {
      const pull = (suctionRange - distance) / suctionRange;
      const angle = Math.atan2(scoopY - item.y, scoopX - item.x);
      item.vx += Math.cos(angle) * 0.34 * pull;
      item.vy += Math.sin(angle) * 0.34 * pull;
    }
  }

  if (!collectedId) {
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
  if (suctionBoost) {
    world.sound.suctionFrame += 1;
    if (world.sound.suctionFrame % 12 === 0) {
      playSound("suction");
    }
  } else {
    world.sound.suctionFrame = 0;
  }
  const spawnChance = suctionBoost ? (vacActive ? 0.08 : 0.18) : 0.55;

  if (Math.random() > spawnChance) {
    return;
  }

  const hotCompression =
    robot.processState === "warning" ||
    robot.processState === "ejecting";

  const exhaustBaseX = robot.x + robot.facing * -14;
  const exhaustBaseY = robot.y + robot.floatOffset;
  world.exhaustParticles.push({
    x: exhaustBaseX,
    y: exhaustBaseY - 62,
    vx: random(-0.55, 0.45) * (vacActive ? 1.25 : 1),
    vy: random(suctionBoost ? (vacActive ? -3.4 : -2.7) : -1.8, suctionBoost ? (vacActive ? -1.7 : -1.4) : -0.9),
    life: random(suctionBoost ? (vacActive ? 58 : 48) : 28, suctionBoost ? (vacActive ? 84 : 68) : 42),
    maxLife: suctionBoost ? (vacActive ? 84 : 68) : 42,
    size: random(suctionBoost ? (vacActive ? 6 : 5) : 4, suctionBoost ? (vacActive ? 12 : 10) : 8),
    color: world.maintenance.active ? "#2f2f2f" : hotCompression ? "#ff6a57" : vacActive ? "#ff7777" : "#8fdfff",
  });
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

function triggerMaintenance() {
  if (world.maintenance.active) {
    return;
  }
  playSound("alarm");
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
  for (let i = 0; i < missingParts.length; i += 1) {
    const kind = missingParts[i];
    const targetX = clamp(robot.x + random(-180, 180), 70, world.width - 70);
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
}

function triggerZeroG() {
  world.zeroGTimer = 240;
  world.zeroGCooldown = 980;
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
  if (world.combo.timer > 0) {
    world.combo.timer -= 1;
    if (world.combo.timer === 0) {
      world.combo.count = 0;
    }
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
    } else if (Math.random() < 0.0042) {
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
    if (world.zeroGCooldown > 0) {
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

  const maintenanceChance =
    0.00005 +
    world.level * 0.00001 +
    (robot.cargo.length >= world.cargoCapacity ? 0.00008 : 0) +
    Math.min(0.00012, world.combo.count * 0.00002);
  if (!world.maintenance.active && Math.random() < maintenanceChance) {
    triggerMaintenance();
  }

  const burningTarget = world.particles.find((item) => item.burning);
  if (!burningTarget && Math.random() < 0.00055 && world.particles.length > 0) {
    const target = world.particles[Math.floor(Math.random() * world.particles.length)];
    if (target && !target.hazardous) {
      target.burning = true;
    }
  }

  const needsFirebot = world.particles.find((item) => item.burning);
  if (needsFirebot && !world.firebot.active) {
    startFirebot(needsFirebot);
  }

  if (
    world.particles.some(
      (item) => item.y + item.radius >= world.floorY - 2 && item.y - item.radius < world.maxLoadY
    )
  ) {
    world.gameOver = true;
    robot.processState = "collecting";
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
    if (distance < 34) {
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

function queuePressCycle() {
  if (
    robot.cargo.length < world.cargoCapacity ||
    robot.processState !== "collecting" ||
    world.pressQueue.length > 0
  ) {
    return false;
  }

  const chunks = upgradeActive("tank")
    ? [robot.cargo.slice(0, robot.cargo.length / 2), robot.cargo.slice(robot.cargo.length / 2)]
    : [robot.cargo.slice()];

  for (const chunk of chunks) {
    world.pressQueue.push({
      amount: chunk.length,
      mosaic: chunk.map((item) => ({
        fill: item.color.fill,
        stroke: item.color.stroke,
      })),
    });
  }
  robot.cargo = [];
  return true;
}

function releaseCube() {
  if (world.pressQueue.length === 0) {
    return;
  }

  const batch = world.pressQueue.shift();
  const rearOffset = -robot.direction * 66;
  const cubeSize = clamp(12 + batch.amount * 2.2, 14, 26);

  world.cubes += 1;
  playSound("cube");
  if (world.combo.timer > 0) {
    world.combo.count += 1;
  } else {
    world.combo.count = 1;
  }
  world.combo.timer = 240;
  world.upgradePoints += world.combo.count;
  if (world.cubes % 10 === 0) {
    world.levelBurstTimer = 40;
    playSound("levelup");
    for (let i = 0; i < 10; i += 1) {
      world.spaceCubes.push({
        x: world.porthole.x + random(18, 44),
        y: world.porthole.y + random(18, world.porthole.h - 18),
        size: random(3, 5.2),
        vx: random(0.26, 0.52),
        vy: random(-0.1, 0.1),
        rotation: random(0, Math.PI * 2),
        spin: random(-0.01, 0.01),
        life: 1100,
        baseFill: "#d5b879",
        baseStroke: "#7a6030",
        mosaic: batch.mosaic.length ? batch.mosaic : [{ fill: "#d5b879", stroke: "#7a6030" }],
      });
    }
  }
  world.activeCubes.push({
    id: `cube-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    x: robot.x + rearOffset,
    y: world.floorY - cubeSize * 0.5,
    size: cubeSize,
    vx: -robot.direction * (1.7 + batch.amount * 0.16),
    vy: -0.2,
    attached: false,
    picked: false,
    mosaic: batch.mosaic,
    rotation: 0,
    spin: -robot.direction * (0.012 + batch.amount * 0.002),
  });
}

function startCranePickup() {
  if (world.cranes.length >= 3) {
    return;
  }

  const hazard = world.particles.find((item) => item.hazardous && !item.burning);
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
    return;
  }

  const cube = world.activeCubes.find((item) => !item.attached && !item.picked);
  if (!cube) {
    return;
  }
  cube.picked = true;
  world.cranes.push({
    id: `crane-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: "cube",
    cubeId: cube.id,
    y: 50,
    x: cube.x,
    targetX: cube.x,
    targetY: cube.y - 28,
    carrying: false,
    phase: "descending",
    homeX: world.width + 100,
  });
}

function updateProcess() {
  if (robot.processState === "collecting") {
    robot.rearHatchOpen = false;
    if (world.pressQueue.length > 0) {
      robot.processState = "warning";
      robot.processTimer = upgradeActive("press") ? 34 : 52;
    }
    return;
  }

  if (robot.processState === "warning") {
    robot.processTimer -= 1;
    if (robot.processTimer <= 0) {
      robot.processState = "ejecting";
      robot.rearHatchOpen = true;
      robot.processTimer = upgradeActive("press") ? 14 : 24;
      releaseCube();
    }
    return;
  }

  if (robot.processState === "ejecting") {
    robot.processTimer -= 1;
    robot.rearHatchOpen = true;
    if (robot.processTimer <= 0) {
      robot.processState = "collecting";
      robot.rearHatchOpen = false;
    }
  }
}

function updateCubeAndCrane() {
  const currentGravity = world.zeroGTimer > 0 ? 0 : world.gravity * 0.8;

  for (const cube of world.activeCubes) {
    if (cube.attached) {
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
    const halfWidth = 54;
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

  for (let i = 0; i < world.activeCubes.length; i += 1) {
    for (let j = i + 1; j < world.activeCubes.length; j += 1) {
      const a = world.activeCubes[i];
      const b = world.activeCubes[j];
      if (a.attached || b.attached) {
        continue;
      }

      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = a.size * 0.5 + b.size * 0.5;

      if (!distance || distance >= minDistance) {
        continue;
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
    }
  }

  for (const cube of world.activeCubes) {
    if (cube.attached) {
      continue;
    }

    const cubeRadius = cube.size * 0.5;
    for (const item of world.particles) {
      if (item.attached) {
        continue;
      }

      const dx = item.x - cube.x;
      const dy = item.y - cube.y;
      const distance = Math.hypot(dx, dy);
      const minDistance = cubeRadius + item.radius;

      if (!distance || distance >= minDistance) {
        continue;
      }

      const overlap = minDistance - distance;
      const nx = dx / distance;
      const ny = dy / distance;
      const cubeShare = item.radius / (cubeRadius + item.radius);
      const itemShare = cubeRadius / (cubeRadius + item.radius);

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
    }
  }

  const remainingCubes = [];
  for (const cube of world.activeCubes) {
    if (cube.x > world.width + 70 || cube.y > world.height + 50) {
      world.spaceCubes.push({
        x: world.porthole.x + random(12, 38),
        y: world.porthole.y + random(22, world.porthole.h - 22),
        size: Math.max(3.5, cube.size * 0.24),
        vx: random(0.08, 0.16),
        vy: random(-0.02, 0.02),
        rotation: random(0, Math.PI * 2),
        spin: random(-0.003, 0.003),
        life: 1200,
        baseFill: "#d5b879",
        baseStroke: "#7a6030",
        mosaic: cube.mosaic,
      });
    } else {
      remainingCubes.push(cube);
    }
  }
  world.activeCubes = remainingCubes;

  while (world.cranes.length < 3) {
    const before = world.cranes.length;
    startCranePickup();
    if (world.cranes.length === before) {
      break;
    }
  }
  const remainingCranes = [];
  for (const crane of world.cranes) {
    const cube =
      crane.type === "cube"
        ? world.activeCubes.find((item) => item.id === crane.cubeId)
        : world.particles.find((item) => item.id === crane.targetId);
    if (!cube) {
      continue;
    }

    if (crane.phase === "descending") {
      crane.x += (crane.targetX - crane.x) * 0.18;
      crane.y += (crane.targetY - crane.y) * 0.12;
      if (Math.abs(crane.y - crane.targetY) < 3) {
        crane.phase = "lifting";
        crane.carrying = true;
        cube.attached = true;
      }
      remainingCranes.push(crane);
      continue;
    }

    if (crane.phase === "lifting") {
      crane.targetY = 76;
      crane.y += (crane.targetY - crane.y) * 0.16;
      cube.x = crane.x;
      cube.y = crane.y + 40;
      if (Math.abs(crane.y - crane.targetY) < 3) {
        crane.phase = "moving";
        crane.targetX = crane.homeX;
      }
      remainingCranes.push(crane);
      continue;
    }

    if (crane.phase === "moving") {
      crane.x += (crane.targetX - crane.x) * 0.08;
      cube.x = crane.x;
      cube.y = crane.y + 40;
      if (Math.abs(crane.x - crane.targetX) < 4) {
        if (crane.type === "hazard") {
          world.particles = world.particles.filter((item) => item.id !== crane.targetId);
          world.spaceCubes.push({
            x: world.porthole.x + random(12, 38),
            y: world.porthole.y + random(22, world.porthole.h - 22),
            size: Math.max(3, cube.radius * 0.34),
            vx: random(0.08, 0.16),
            vy: random(-0.02, 0.02),
            rotation: random(0, Math.PI * 2),
            spin: random(-0.004, 0.004),
            life: 1200,
            baseFill: cube.color.fill,
            baseStroke: cube.color.stroke,
            mosaic: [{ fill: cube.color.fill, stroke: cube.color.stroke }],
          });
        } else {
          cube.attached = false;
          cube.vx = 2.8;
          cube.vy = -0.15;
        }
      } else {
        remainingCranes.push(crane);
      }
    }
  }
  world.cranes = remainingCranes;
}

function updateSpaceCubes() {
  if (world.levelBurstTimer > 0) {
    world.levelBurstTimer -= 1;
  }

  for (const star of world.starfield.stars) {
    star.x -= star.speed;
    if (star.x < -86) {
      star.x = 86;
      star.y = random(-56, 56);
    }
  }

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
  world.spaceCubes = next;
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
  if (world.gameOver) {
    return;
  }

  world.spawnTimer -= 1;
  if (world.spawnTimer <= 0) {
    triggerRefillPipe();
  }
}

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, world.height);
  sky.addColorStop(0, "#5f7f6d");
  sky.addColorStop(0.5, "#4e6858");
  sky.addColorStop(1, "#28352d");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, world.width, world.height);

  ctx.fillStyle = "#31443a";
  ctx.fillRect(0, world.floorY - 90, world.width, 90);

  if (world.levelBurstTimer > 0) {
    const flashAlpha = world.levelBurstTimer / 40;
    ctx.fillStyle = `rgba(255, 219, 120, ${0.08 * flashAlpha})`;
    ctx.fillRect(0, 0, world.width, world.height);
  }

  ctx.fillStyle = "#6b737b";
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

  ctx.setLineDash([14, 10]);
  ctx.strokeStyle = "rgba(255, 120, 88, 0.95)";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(34, world.maxLoadY);
  ctx.lineTo(world.width - 34, world.maxLoadY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255, 244, 224, 0.98)";
  ctx.font = "700 24px Trebuchet MS";
  ctx.fillText("MAX. LOAD", 48, world.maxLoadY - 14);
  ctx.strokeStyle = "rgba(30, 14, 12, 0.6)";
  ctx.lineWidth = 2;
  ctx.strokeText("MAX. LOAD", 48, world.maxLoadY - 14);

  drawGravityMonitor();
  drawUpgradeDisplay();

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
  const driftX = world.ship.accel > 0.02 ? -10 * world.ship.accel : robot.velocityX * -0.8;
  const driftY = world.zeroGTimer > 0 ? Math.sin(world.frame * 0.05) * 3 : 0;

  ctx.save();
  ctx.beginPath();
  ctx.rect(porthole.x, porthole.y, porthole.w, porthole.h);
  ctx.clip();

  ctx.fillStyle = "#03060b";
  ctx.fillRect(porthole.x, porthole.y, porthole.w, porthole.h);

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
    const alpha = Math.max(0.24, cube.life / 1200);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = cube.baseFill || "#d5b879";
    ctx.strokeStyle = cube.baseStroke || "#7a6030";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(left, top, size, size, 2);
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

function drawUpgradeDisplay() {
  const panelW = 154;
  const panelH = 174;
  const panelX = world.porthole.x + world.porthole.w + 42;
  const panelY = world.porthole.y + 4;

  world.upgradeButtons = [];

  ctx.fillStyle = "rgba(17, 24, 29, 0.78)";
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = "rgba(180, 196, 204, 0.24)";
  ctx.lineWidth = 2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  ctx.fillStyle = "#d7ebe7";
  ctx.font = "700 14px Trebuchet MS";
  ctx.fillText("BOOSTS", panelX + 14, panelY + 20);
  ctx.fillStyle = "#9feaff";
  ctx.font = "700 12px Trebuchet MS";
  ctx.fillText(`${world.upgradePoints} PTS`, panelX + 86, panelY + 20);
  ctx.fillStyle = "#9fb7bd";
  ctx.font = "700 10px Trebuchet MS";
  ctx.fillText(world.combo.count > 1 ? `COMBO x${world.combo.count}` : "COMBO READY", panelX + 14, panelY + 36);

  for (let i = 0; i < UPGRADE_DEFS.length; i += 1) {
    const upgrade = UPGRADE_DEFS[i];
    const rowX = panelX + 10;
    const rowY = panelY + 58 + i * 28;
    const active = upgradeActive(upgrade.key);
    const queued = world.upgradeDrops.some((item) => item.key === upgrade.key);
    const canBuy = world.upgradePoints >= upgrade.cost && !active && !queued;
    const seconds = Math.ceil(world.upgradeTimers[upgrade.key] / 60);
    const button = { x: rowX + 96, y: rowY - 12, w: 42, h: 18, key: upgrade.key, enabled: canBuy };
    world.upgradeButtons.push(button);
    const blinkOn = Math.sin(world.frame * 0.18 + i * 0.9) > -0.05;

    ctx.fillStyle = active ? "rgba(76, 148, 255, 0.2)" : "rgba(255,255,255,0.06)";
    ctx.fillRect(rowX, rowY - 14, 134, 22);
    ctx.strokeStyle = active ? "rgba(92, 176, 255, 0.56)" : "rgba(255,255,255,0.08)";
    ctx.strokeRect(rowX, rowY - 14, 134, 22);

    ctx.fillStyle = active ? "#9fd1ff" : "#e3ece7";
    ctx.font = "700 11px Trebuchet MS";
    ctx.fillText(`${upgrade.label} ${upgrade.cost}`, rowX + 10, rowY + 2);
    ctx.fillStyle = active ? "#b5e0ff" : "#99aeb4";
    ctx.font = "700 9px Trebuchet MS";
    ctx.fillText(active ? `${seconds}s` : queued ? "DROP" : "BEREIT", rowX + 56, rowY + 2);

    ctx.fillStyle = canBuy ? (blinkOn ? "#ff3b30" : "#8f1812") : active ? "#2f6fc3" : "#5b2d2a";
    ctx.fillRect(button.x, button.y, button.w, button.h);
    ctx.strokeStyle = canBuy ? (blinkOn ? "#ffd3ce" : "#b74d47") : active ? "#b6d6ff" : "#8f5b57";
    ctx.strokeRect(button.x, button.y, button.w, button.h);
    ctx.fillStyle = "#fff2ee";
    ctx.font = "700 9px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(active ? "AN" : queued ? "DROP" : canBuy ? "KNOPF" : "LOCK", button.x + button.w * 0.5, button.y + 12);
    ctx.textAlign = "start";
  }
}

function drawUpgradeDrops() {
  for (const drop of world.upgradeDrops) {
    ctx.save();
    ctx.translate(drop.x, drop.y);
    ctx.rotate(drop.rotation);
    ctx.fillStyle = "#2d363f";
    ctx.strokeStyle = "#a5dfff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-drop.size * 0.7, -drop.size * 0.55, drop.size * 1.4, drop.size * 1.1, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#7fe8ff";
    ctx.fillRect(-drop.size * 0.4, -drop.size * 0.16, drop.size * 0.8, drop.size * 0.32);
    ctx.fillStyle = "#d8faff";
    ctx.font = "700 10px Trebuchet MS";
    ctx.textAlign = "center";
    ctx.fillText(drop.label, 0, 4);
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
  return;
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
  const intakePulse = Math.sin(robot.intakePulse) * (1 + robot.intakeExtension * 1.5);
  const rearHatchAngle = robot.rearHatchOpen ? 1.05 : 0.08;
  const frontCompression = robot.frontCompression * 10;
  const thrustersVisible = world.zeroGTimer > 0;
  const tankActive = upgradeActive("tank");
  const vacActive = upgradeActive("vacuum");
  const driveActive = upgradeActive("drive");
  const pressActive = upgradeActive("press");
  const isStraining =
    robot.processState === "warning" || robot.processState === "ejecting";
  const blinkAmount = isStraining
    ? 0.08
    : robot.blinkTimer > 0
      ? Math.abs(Math.sin((robot.blinkTimer / 10) * Math.PI))
      : 1;
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

  if (driveActive) {
    ctx.fillStyle = "#5a6980";
    ctx.strokeStyle = "#28323a";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-48, -30);
    ctx.lineTo(-66, -42);
    ctx.lineTo(-12, -42);
    ctx.lineTo(-6, -30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = "#1d2426";
  ctx.fillRect(-62, 24, tankActive ? 152 : 124, 14);

  const wheelOffsets = [-40, -12, 12, 40];
  for (const offset of wheelOffsets) {
    if (missingWheel && offset === -40) {
      continue;
    }
    ctx.fillStyle = "#0f1214";
    ctx.beginPath();
    ctx.arc(offset, 30, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#556067";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(offset, 30, 8, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = pressActive ? "#4f95d2" : "#89a9bf";
  ctx.strokeStyle = pressActive ? "#245b8d" : "#4e6678";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-58, -26, 92, 56, 12);
  ctx.fill();
  ctx.stroke();
  if (tankActive) {
    ctx.beginPath();
    ctx.roundRect(-4, -22, 48, 48, 10);
    ctx.fill();
    ctx.stroke();
  }
  if (missingPanel) {
    ctx.fillStyle = "#1d2426";
    ctx.fillRect(12, -4, 20, 20);
  }
  ctx.fillStyle = "rgba(146, 78, 38, 0.28)";
  ctx.fillRect(-48, 10, 24, 8);
  ctx.fillRect(10, -18, 14, 7);
  ctx.fillStyle = "rgba(86, 43, 19, 0.18)";
  ctx.fillRect(-44, 16, 12, 4);

  ctx.fillStyle = pressActive ? "#2b77bc" : "#5a7690";
  ctx.fillRect(-58, -4, 92, 10);
  if (tankActive) {
    ctx.fillRect(0, -4, 44, 10);
  }
  ctx.fillStyle = "#d7e1ea";
  ctx.fillRect(-48, -24, 16, 52);
  ctx.fillRect(8, -24, 12, 52);
  if (tankActive) {
    ctx.fillRect(26, -20, 10, 44);
  }

  ctx.fillStyle = "#1f2628";
  ctx.beginPath();
  ctx.roundRect(-18, -16, 34, 20, 6);
  ctx.fill();

  if (!missingEye) {
    ctx.fillStyle = vacActive ? "#ff5757" : "#d7f2ff";
    ctx.fillRect(-11, -11, 9, 9 * blinkAmount);
    ctx.fillRect(2, -11, 9, 9 * blinkAmount);
  }
  if (isStraining && !missingEye) {
    ctx.strokeStyle = vacActive ? "#ff9f9f" : "#d7f2ff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.lineTo(-2, -9);
    ctx.moveTo(1, -9);
    ctx.lineTo(11, -6);
    ctx.stroke();
  } else if (blinkAmount > 0.2 && !missingEye) {
    ctx.fillStyle = vacActive ? "#6d0f0f" : "#2d4d63";
    ctx.fillRect(-8, -8, 3, 3 * blinkAmount);
    ctx.fillRect(5, -8, 3, 3 * blinkAmount);
  }

  ctx.fillStyle = "#728392";
  ctx.fillRect(-10, -36, 20, 14);
  if (!missingStack) {
    ctx.fillRect(-18, -52, 8, 18);
    ctx.fillStyle = "#9eb2c0";
    ctx.fillRect(-21, -66, 14, 16);
  }
  ctx.fillStyle = "rgba(149, 80, 39, 0.24)";
  ctx.fillRect(-18, -47, 6, 8);

  const showWrench = world.maintenance.active && Math.sin(world.maintenance.blink * 0.35) > -0.1;
  if (showWrench) {
    ctx.strokeStyle = "#ffb784";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(-44, -2);
    ctx.lineTo(-30, 12);
    ctx.moveTo(-31, 3);
    ctx.lineTo(-24, -4);
    ctx.moveTo(-27, 7);
    ctx.lineTo(-20, 0);
    ctx.stroke();
  }

  if (thrustersVisible) {
    const thrustFlicker = 1 + Math.sin(world.frame * 0.55) * 0.18;
    ctx.fillStyle = "#6f7e88";
    ctx.fillRect(-66, -4, 10, 24);
    ctx.fillRect(56, -4, 10, 24);
    ctx.fillRect(-18, 32, 14, 10);
    ctx.fillRect(4, 32, 14, 10);
    ctx.fillStyle = "rgba(112, 232, 255, 0.5)";
    ctx.beginPath();
    ctx.moveTo(-61, 20);
    ctx.lineTo(-67 - thrustFlicker * 8, 28);
    ctx.lineTo(-55, 28);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(61, 20);
    ctx.lineTo(67 + thrustFlicker * 8, 28);
    ctx.lineTo(55, 28);
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
  ctx.lineWidth = 4;
  const nozzleX = 34 - frontCompression + robot.intakeExtension * 18;
  const nozzleWidth = (vacActive ? 42 : 34) + robot.intakeExtension * (vacActive ? 18 : 12);
  ctx.beginPath();
  ctx.moveTo(18, -22);
  ctx.lineTo(42 - frontCompression * 0.5, -22);
  ctx.quadraticCurveTo(60 - frontCompression, -22, 60 - frontCompression, -4);
  ctx.lineTo(60 - frontCompression, 12);
  ctx.quadraticCurveTo(60 - frontCompression, 22, 50 - frontCompression * 0.7, 22);
  ctx.lineTo(34 - frontCompression * 0.5, 22);
  ctx.stroke();

  ctx.fillStyle = "#243033";
  ctx.beginPath();
  ctx.roundRect(nozzleX - 2, vacActive ? 8 : 10, nozzleWidth, vacActive ? 24 : 20, 8);
  ctx.fill();
  ctx.strokeStyle = "#5b757b";
  ctx.stroke();
  if (robot.intakeExtension > 0.08) {
    ctx.strokeStyle = vacActive ? "#ff7a7a" : "#7edfff";
    ctx.lineWidth = vacActive ? 2.6 : 2;
    for (let i = 0; i < (vacActive ? 7 : 4); i += 1) {
      const offset = (robot.intakePulse * (vacActive ? 11 : 8) + i * (vacActive ? 12 : 16)) % (68 + robot.intakeExtension * 22);
      ctx.beginPath();
      ctx.arc(nozzleX + 6 + offset * 0.34, 21 - offset * 0.1, (vacActive ? 5.5 : 4) + i * 0.8, -0.5, 2.4);
      ctx.stroke();
    }
    ctx.fillStyle = vacActive ? "rgba(255, 102, 102, 0.24)" : "rgba(143, 233, 255, 0.18)";
    ctx.beginPath();
    ctx.moveTo(nozzleX + nozzleWidth - 2, 30);
    ctx.lineTo(nozzleX + nozzleWidth + (vacActive ? 64 : 42), 8 + intakePulse * (vacActive ? 3.2 : 2));
    ctx.lineTo(nozzleX + nozzleWidth + (vacActive ? 64 : 42), 38 - intakePulse * (vacActive ? 3.2 : 2));
    ctx.closePath();
    ctx.fill();
  }

  if (!missingLamp) {
    ctx.fillStyle = lampOn ? "#ff6553" : "#612923";
    ctx.beginPath();
    ctx.arc(-30, -18, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#1a1f21";
  ctx.fillRect(-54, -22, 12, 48);
  for (let i = 0; i < world.cargoCapacity; i += 1) {
    ctx.fillStyle = i < robot.cargo.length ? "#86e57a" : "#334238";
    ctx.fillRect(-52, 20 - i * 7, 8, 5);
  }
  if (tankActive) {
    ctx.fillStyle = "#1a1f21";
    ctx.fillRect(38, -18, 12, 40);
    for (let i = 0; i < 6; i += 1) {
      const filled = robot.cargo.length > 6 + i;
      ctx.fillStyle = filled ? "#86e57a" : "#334238";
      ctx.fillRect(40, 16 - i * 6, 8, 4);
    }
  }

  ctx.save();
  ctx.translate(-42, 0);
  ctx.rotate(rearHatchAngle);
  if (!missingHatch) {
    ctx.fillStyle = "#9baebb";
    ctx.strokeStyle = "#5b7080";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-8, -10, 28, 16, 6);
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
  const x = 26;
  const y = 28;
  const width = 196;
  const height = 58;

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  ctx.fillStyle = "#e9efe4";
  ctx.font = "700 20px Trebuchet MS";
  ctx.fillText("Ladung", x + 14, y + 24);

  for (let i = 0; i < world.cargoCapacity; i += 1) {
    ctx.fillStyle = i < robot.cargo.length ? "#f1b24a" : "rgba(255,255,255,0.12)";
    ctx.fillRect(x + 14 + i * 28, y + 34, 18, 12);
  }
}

function drawCubeAndCrane() {
  for (const cube of world.activeCubes) {
    ctx.save();
    ctx.translate(cube.x, cube.y);
    ctx.rotate(cube.rotation);
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

  for (const crane of world.cranes) {
    ctx.strokeStyle = "#b18d28";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(crane.x, 0);
    ctx.lineTo(crane.x, crane.y);
    ctx.stroke();

    ctx.fillStyle = "#e0bc43";
    ctx.fillRect(crane.x - 18, crane.y - 10, 36, 12);
    ctx.strokeStyle = "#7f6317";
    ctx.strokeRect(crane.x - 18, crane.y - 10, 36, 12);
    ctx.fillStyle = "rgba(147, 80, 38, 0.3)";
    ctx.fillRect(crane.x - 12, crane.y - 8, 10, 5);
    ctx.fillRect(crane.x + 4, crane.y - 2, 8, 4);

    ctx.strokeStyle = "#f1d36b";
    ctx.beginPath();
    ctx.moveTo(crane.x - 12, crane.y + 2);
    ctx.lineTo(crane.x - 6, crane.y + 16);
    ctx.moveTo(crane.x + 12, crane.y + 2);
    ctx.lineTo(crane.x + 6, crane.y + 16);
    ctx.stroke();
  }
}

function drawExhaust() {
  for (const particle of world.exhaustParticles) {
    const alpha = particle.life / particle.maxLife;
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

  for (const item of world.particles) {
    drawTrash(item);
  }

  drawRepairParts();
  drawUpgradeDrops();
  drawRobot();
  drawExhaust();
  drawCubeAndCrane();
  ctx.restore();
}

function tick() {
  if (!world.started) {
    render();
    window.requestAnimationFrame(tick);
    return;
  }

  updateRobot();
  updateSystems();
  updateTrash();
  tryCollectTrash();
  updateExhaust();
  updateProcess();
  updateCubeAndCrane();
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
    ensureAudio();
    world.started = true;
    startScreenEl.classList.add("hidden");
  }

  handleGlitches(event.key);
  world.keys[event.key] = true;

  if (event.key === "w" || event.key === "W") {
    triggerPressAction();
  }

  if (event.key === "r" || event.key === "R") {
    resetYard();
  }

  if (event.key === "t" || event.key === "T") {
    triggerMaintenance();
  }
});

window.addEventListener("keyup", (event) => {
  world.keys[event.key] = false;
});

startButtonEl.addEventListener("click", () => {
  ensureAudio();
  world.started = true;
  startScreenEl.classList.add("hidden");
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

for (const button of touchButtons) {
  const key = button.dataset.key;
  const hold = button.dataset.hold === "true";
  const action = button.dataset.action;

  const start = (event) => {
    event.preventDefault();
    ensureAudio();
    if (!world.started) {
      world.started = true;
      startScreenEl.classList.add("hidden");
    }
    button.classList.add("is-active");

    if (key) {
      pressVirtualKey(key);
    }
    if (action === "press") {
      triggerPressAction();
    } else if (action === "reset") {
      resetYard();
    }
    if (!hold && key) {
      setTimeout(() => {
        releaseVirtualKey(key);
        button.classList.remove("is-active");
      }, 80);
    }
  };

  const end = (event) => {
    event.preventDefault();
    button.classList.remove("is-active");
    if (key) {
      releaseVirtualKey(key);
    }
  };

  button.addEventListener("pointerdown", start);
  button.addEventListener("pointerup", end);
  button.addEventListener("pointercancel", end);
  button.addEventListener("pointerleave", end);
  button.addEventListener("touchstart", (event) => event.preventDefault(), { passive: false });
  button.addEventListener("contextmenu", (event) => event.preventDefault());
}

resetYard();
render();
tick();
