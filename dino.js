import {
  incrementCustomProperty,
  getCustomProperty,
  setCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_RUN_FRAME_COUNT = 10;
const DINO_JUMP_FRAME_COUNT = 10;
const FRAME_TIME = 100;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;

export function setupDino() {
  isJumping = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  setCustomProperty(dinoElem, "--bottom", 0);
  document.removeEventListener("keydown", onJump);
  document.addEventListener("keydown", onJump);
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  let i = 0;

  function myLoop() {
    setTimeout(function () {
      dinoElem.src = `Images/death/Dead__00${i}.png`;
      i++;
      if (i < 10) {
        myLoop();
      }
    }, 100);
  }
  myLoop();
}

function handleJump(delta) {
  if (!isJumping) return;
  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;
  }
  yVelocity -= GRAVITY * delta;
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `Images/jump/Jump__002.png`;
    return;
  }
  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_RUN_FRAME_COUNT;
    4;
    dinoElem.src = `Images/run/Run__00${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function onJump(e) {
  if (e.code !== "Space" || isJumping) return;

  yVelocity = JUMP_SPEED;
  isJumping = true;
}
