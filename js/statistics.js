// Statistics rendering derived from the current game state.
import { state, config } from "./state.js";
import { el } from "./ui.js";

export function updateAccuracy() {
  el.accuracy.textContent = state.totalAttempts
    ? Math.round((state.score / state.totalAttempts) * 100)
    : 0;
}
export function renderStatistics() {
  el.statsBestCombo.textContent = state.bestCombo;
  el.statsAchievements.textContent = `${state.achievements.length}/${config.achievements.length}`;
  el.statsSkins.textContent = state.ownedSkins.length;
  el.statsThemes.textContent = state.ownedThemes.length;
}
