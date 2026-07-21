// Power-up spawning, activation, and lifecycle timers.
import { state } from "./state.js";
import { el, announcePowerup, setMessage } from "./ui.js";

export function updatePowerupStatus() {
  const active = [];
  if (state.doubleXP) active.push(`⭐ XP (${state.doubleXPTime}s)`);
  if (state.doubleCoins) active.push(`🪙 Coins (${state.doubleCoinsTime}s)`);
  if (state.slowButton) active.push(`⚡ Slow (${state.slowButtonTime}s)`);
  if (state.freezeButton) active.push(`🧊 Freeze (${state.freezeButtonTime}s)`);
  el.powerupStatus.textContent = active.length
    ? active.join(" | ")
    : "No Active Powerups";
}
export function activatePowerup(type) {
  const settings = {
    xp: ["doubleXP", "doubleXPTime", 10, "⭐ Double XP", "⭐ DOUBLE XP"],
    coins: [
      "doubleCoins",
      "doubleCoinsTime",
      10,
      "🪙 Double Coins",
      "🪙 DOUBLE COINS",
    ],
    slow: [
      "slowButton",
      "slowButtonTime",
      10,
      "⚡ Slow Button",
      "⚡ SLOW BUTTON",
    ],
    freeze: [
      "freezeButton",
      "freezeButtonTime",
      5,
      "🧊 Freeze Button",
      "🧊 FREEZE BUTTON",
    ],
  };
  const [activeKey, timeKey, seconds, message, announcement] = settings[type];
  state[activeKey] = true;
  state[timeKey] = seconds;
  updatePowerupStatus();
  setMessage(message);
  announcePowerup(announcement);
}
export function showPowerup(type) {
  const powerup = document.createElement("div");
  powerup.className = "powerup";
  const rect = el.gameArena.getBoundingClientRect();
  powerup.style.left = `${Math.random() * (rect.width - 60)}px`;
  powerup.style.top = `${Math.random() * (rect.height - 60)}px`;
  powerup.textContent = { xp: "⭐", coins: "🪙", slow: "⚡", freeze: "🧊" }[
    type
  ];
  powerup.addEventListener("click", () => {
    if (!state.gamePaused && !state.gameOver) activatePowerup(type);
    powerup.remove();
  });
  el.gameArena.appendChild(powerup);
  setTimeout(() => powerup.remove(), 8000);
}
export function startPowerupTimers() {
  if (state.powerupSpawnerTimer) return;
  state.powerupSpawnerTimer = setInterval(() => {
    if (state.gameOver || state.gamePaused) return;
    const roll = Math.random();
    showPowerup(
      roll < 0.25
        ? "xp"
        : roll < 0.5
          ? "coins"
          : roll < 0.75
            ? "slow"
            : "freeze",
    );
  }, state.powerupSpawnRate);
  state.powerupStatusTimer = setInterval(() => {
    if (state.gameOver || state.gamePaused) return;
    ["doubleXP", "doubleCoins", "slowButton", "freezeButton"].forEach((key) => {
      const timeKey = `${key}Time`;
      if (!state[key]) return;
      state[timeKey] -= 1;
      if (state[timeKey] <= 0) state[key] = false;
    });
    updatePowerupStatus();
  }, 1000);
}

export function stopPowerupTimers() {
  clearInterval(state.powerupSpawnerTimer);
  clearInterval(state.powerupStatusTimer);
  state.powerupSpawnerTimer = null;
  state.powerupStatusTimer = null;
}
