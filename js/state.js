import { SaveManager as save } from "./save.js";

// Shared runtime state and static game configuration.
const number = (key, fallback) => Number.parseInt(save.get(key, fallback), 10) || fallback;
const array = (key, fallback) => {
  const value = save.get(key, fallback);
  return Array.isArray(value) ? value : fallback;
};
const difficulty = save.get("difficulty", "normal");

export const state = {
  score: 0, misses: 0, totalAttempts: 0, xp: 0, combo: 0, bestCombo: 0,
  runCoins: 0, runXP: 0, comboTimer: null, tauntCooldown: false,
  level: number("level", 1), highestLevel: number("highestLevel", 1),
  coins: number("coins", 0), highScore: number("highScore", 0),
  gamesPlayed: number("gamesPlayed", 0), lifetimeClicks: number("lifetimeClicks", 0),
  lifetimeCoins: number("lifetimeCoins", 0),
  ownedSkins: array("ownedSkins", ["default"]), selectedSkin: save.get("selectedSkin", "default"),
  ownedThemes: array("ownedThemes", ["default"]), selectedTheme: save.get("selectedTheme", "default"),
  achievements: array("achievements", []),
  currentDifficulty: ["easy", "normal", "hard", "nightmare"].includes(difficulty) ? difficulty : "normal",
  floatingTextEnabled: save.get("floatingTextEnabled", true) !== false,
  achievementEnabled: save.get("achievementEnabled", true) !== false,
  powerupEnabled: save.get("powerupEnabled", true) !== false,
  isTouchDevice: "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0,
  dangerDistance: 35, escapeDistance: 150, gameTime: 60, powerupSpawnRate: 20000, xpReward: 20, coinReward: 5,
  timeLeft: 60, timer: null, timerStarted: false, powerupSpawnerTimer: null, powerupStatusTimer: null, ignoreClickUntil: 0, gameOver: false, gamePaused: false,
  openedFromPause: false, doubleXP: false, doubleCoins: false, slowButton: false, freezeButton: false,
  doubleXPTime: 0, doubleCoinsTime: 0, slowButtonTime: 0, freezeButtonTime: 0,
};
state.dangerDistance = state.isTouchDevice ? 20 : 35;
export const config = {
  xpNeeded: 100, rewardTable: [50, 100, 150, 200, 250, 300, 500],
  achievements: ["First Catch", "Button Hunter", "Persistence Pays Off", "Professional Annoyer", "Combo Master", "Combo Legend", "Rich", "Millionaire", "Collector", "Theme Collector", "Survivor", "Veteran"],
  taunts: ["Too slow!", "Nice try!", "You'll never catch me!", "Skill issue.", "Almost!", "Keep trying!", "Was that your best?", "Not even close!", "😂", "Come on..."],
};
