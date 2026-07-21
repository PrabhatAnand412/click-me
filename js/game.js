// Core input handling, difficulty, game timer, and end-of-run flow.
import { state } from "./state.js";
import { SaveManager as save } from "./save.js";
import {
  el,
  randomTaunt,
  teleportButton,
  setMessage,
  renderHUD,
} from "./ui.js";
import { recordCatch, recordMiss } from "./player.js";
import { unlockAchievement } from "./achievements.js";
import { stopPowerupTimers } from "./powerups.js";

export function applyDifficulty() {
  save.set("difficulty", state.currentDifficulty);
  const settings = {
    easy: [100, 70, 25, 6],
    hard: [200, 55, 20, 5],
    nightmare: [250, 45, 30, 8],
    normal: [150, 60, 20, 5],
  }[state.currentDifficulty] || [150, 60, 20, 5];
  [state.escapeDistance, state.gameTime, state.xpReward, state.coinReward] =
    settings;
}
export function startTimer() {
  if (state.timerStarted) return;
  state.timerStarted = true;
  state.timer = setInterval(() => {
    if (state.gameOver || state.gamePaused) return;
    state.timeLeft -= 1;
    renderHUD();
    if (state.timeLeft <= 0) {
      state.gameOver = true;
      clearInterval(state.timer);
      showGameOver();
      setMessage("Game Over!");
    }
  }, 1000);
}
export function showGameOver() {
  state.gamesPlayed += 1;
  save.set("gamesPlayed", state.gamesPlayed);
  stopPowerupTimers();
  if (state.gamesPlayed >= 25) unlockAchievement("Veteran");
  el.gameOverScreen.hidden = false;
  [
    ["finalScore", state.score],
    ["finalMisses", state.misses],
    ["finalCombo", state.bestCombo],
    ["finalCoins", state.runCoins],
    ["finalXP", state.runXP],
    ["finalLevel", state.level],
    ["finalHighScore", state.highScore],
  ].forEach(([key, value]) => {
    el[key].textContent = value;
  });
}
export function initialiseGame() {
  document.addEventListener("mousemove", (event) => {
    if (
      state.isTouchDevice ||
      state.gameOver ||
      state.gamePaused ||
      state.freezeButton
    )
      return;
    const rect = el.runawayBtn.getBoundingClientRect();
    const dx = event.clientX - rect.left - rect.width / 2;
    const dy = event.clientY - rect.top - rect.height / 2;
    const distance = Math.hypot(dx, dy);
    if (distance === 0 || distance >= state.dangerDistance) return;
    const arena = el.gameArena.getBoundingClientRect();
    const move = state.slowButton
      ? state.escapeDistance / 2
      : state.escapeDistance;
    const x = Math.max(
      0,
      Math.min(
        el.runawayBtn.offsetLeft - (dx / distance) * move,
        arena.width - rect.width,
      ),
    );
    const y = Math.max(
      0,
      Math.min(
        el.runawayBtn.offsetTop - (dy / distance) * move,
        arena.height - rect.height,
      ),
    );
    el.runawayBtn.style.left = `${x}px`;
    el.runawayBtn.style.top = `${y}px`;
    randomTaunt();
  });
  el.runawayBtn.addEventListener("touchstart", (event) => {
    event.preventDefault();
    if (state.gameOver || state.gamePaused) return;
    state.ignoreClickUntil = Date.now() + 500;
    recordCatch({ touch: true });
    setTimeout(
      () => {
        if (!state.gameOver && !state.gamePaused && !state.freezeButton)
          teleportButton();
      },
      state.slowButton ? 300 : 120,
    );
  });
  document.addEventListener("click", (event) => {
    if (!state.gameOver && !state.gamePaused && event.target !== el.runawayBtn)
      recordMiss();
  });
  el.runawayBtn.addEventListener("click", () => {
    if (
      Date.now() < state.ignoreClickUntil ||
      state.gameOver ||
      state.gamePaused
    )
      return;
    recordCatch();
    setTimeout(() => {
      if (!state.gameOver && !state.gamePaused) teleportButton();
    }, 200);
  });
}
