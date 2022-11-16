import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreElem = document.querySelector("[data-score]");
const audioElem = document.querySelector("[data-audio]");
const startScreenElem = document.querySelector("[data-start-screen]");
const deathScreenElem = document.querySelector("[data-death-screen]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("click", handleStart, { once: true });

let lastTime;
let speedScale;
let score;
function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;

  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateCactus(delta, speedScale);
  updateSpeedScale(delta);
  updateScore(delta);
  if (checkLose()) return handleLose();

  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some((rect) => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  );
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = `Score: ${Math.floor(score)}`;
}

function handleStart() {
  startScreenElem.classList.remove("hide");
  lastTime = null;
  speedScale = 1;
  scoreElem.style.color = "#000000";
  score = 0;
  audioElem.pause();
  audioElem.currentTime = 0;
  setupGround();
  setupDino();
  setupCactus();
  audioElem.src = "Audio/naruto_theme.mp3";
  audioElem.play();
  deathScreenElem.classList.add("hide");
  startScreenElem.classList.add("hide");
  window.requestAnimationFrame(update);
}

function handleLose() {
  setDinoLose();
  audioElem.pause();
  setTimeout(() => {
    document.addEventListener("click", handleStart, { once: true });
    reset(deathScreenElem);
    deathScreenElem.classList.remove("hide");
    audioElem.src = "Audio/ds_death_sound.mp3";
    audioElem.play();
    scoreElem.style.color = "#ffffff";
  }, 1000);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

function reset(el) {
  el.style.animation = "none";
  el.offsetHeight;
  el.style.animation = null;
}
