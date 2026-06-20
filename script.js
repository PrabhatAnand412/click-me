const button = document.getElementById("runawayBtn");
const scoreDisplay = document.getElementById("score");
const menuDifficultySelect = document.getElementById("menuDifficultySelect");
const missesDisplay = document.getElementById("misses");
const accuracyDisplay = document.getElementById("accuracy");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("tauntBox");
const mainMenu = document.getElementById("mainMenu");
const pauseMenu = document.getElementById("pauseMenu");
const resumeBtn = document.getElementById("resumeBtn");
const pauseStatsBtn = document.getElementById("pauseStatsBtn");
const pauseShopBtn = document.getElementById("pauseShopBtn");
const pauseSettingsBtn = document.getElementById("pauseSettingsBtn");
const pauseDifficultySelect = document.getElementById("pauseDifficultySelect");
const pauseMainMenuBtn = document.getElementById("pauseMainMenuBtn");
const playBtn = document.getElementById("playBtn");
const menuStatsBtn = document.getElementById("menuStatsBtn");
const menuShopBtn = document.getElementById("menuShopBtn");
const layout = document.getElementById("layout");
const gameArena = document.getElementById("gameArena");
const shop = document.getElementById("shop");
const closeShop = document.getElementById("closeShop");
const dailyRewardPopup = document.getElementById("dailyRewardPopup");
const dailyRewardText = document.getElementById("dailyRewardText");
const claimRewardBtn = document.getElementById("claimRewardBtn");
const statsScreen = document.getElementById("statsScreen");
const closeStats = document.getElementById("closeStats");
const levelDisplay = document.getElementById("level");
const coinsDisplay = document.getElementById("coins");
const xpFill = document.getElementById("xpFill");
const powerupStatus = document.getElementById("powerupStatus");
const menuSettingsBtn = document.getElementById("menuSettingsBtn");
const settingsScreen = document.getElementById("settingsScreen");
const closeSettings = document.getElementById("closeSettings");
const animationsToggle = document.getElementById("animationsToggle");
const floatingTextToggle = document.getElementById("floatingTextToggle");
const achievementToggle = document.getElementById("achievementToggle");
const powerupToggle = document.getElementById("powerupToggle");
const resetProgressBtn = document.getElementById("resetProgressBtn");
const statsBestCombo = document.getElementById("statsBestCombo");
const statsAchievements = document.getElementById("statsAchievements");
const achievementList = document.getElementById("achievementList");
const achievementRewardText = document.getElementById("achievementReward");
const statsSkins = document.getElementById("statsSkins");
const statsThemes = document.getElementById("statsThemes");

let tauntCooldown = false;
let score = 0;
let misses = 0;
let totalAttempts = 0;
let xp = 0;
let level = parseInt(localStorage.getItem("level")) || 1;

let highestLevel = parseInt(localStorage.getItem("highestLevel")) || 1;

let coins = parseInt(localStorage.getItem("coins")) || 0;

const rewardTable = [50, 100, 150, 200, 250, 300, 500];

const xpNeeded = 100;
let combo = 0;
let bestCombo = 0;
let runCoins = 0;
let runXP = 0;
let comboTimer;

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

let dangerDistance = isTouchDevice ? 20 : 35;
let escapeDistance = 150;
let gameTime = 60;
let powerupSpawnRate = 20000;
let currentDifficulty = localStorage.getItem("difficulty") || "normal";
let xpReward = 20;
let coinReward = 5;
let doubleXP = false;
let doubleCoins = false;
let slowButton = false;
let doubleXPTime = 0;
let doubleCoinsTime = 0;
let slowButtonTime = 0;
let freezeButton = false;
let freezeButtonTime = 0;
let gameOver = false;
let gamePaused = false;
let animationsEnabled = localStorage.getItem("animationsEnabled") !== "false";

let floatingTextEnabled =
  localStorage.getItem("floatingTextEnabled") !== "false";

let achievementEnabled = localStorage.getItem("achievementEnabled") !== "false";

let powerupEnabled = localStorage.getItem("powerupEnabled") !== "false";
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let gamesPlayed = parseInt(localStorage.getItem("gamesPlayed")) || 0;
let openedFromPause = false;
let lifetimeClicks = parseInt(localStorage.getItem("lifetimeClicks")) || 0;
let lifetimeCoins = parseInt(localStorage.getItem("lifetimeCoins")) || 0;
let ownedSkins = JSON.parse(localStorage.getItem("ownedSkins")) || ["default"];
let selectedSkin = localStorage.getItem("selectedSkin") || "default";

const savedSkin = localStorage.getItem("skin");

let ownedThemes = JSON.parse(localStorage.getItem("ownedThemes")) || [
  "default",
];
let selectedTheme = localStorage.getItem("selectedTheme") || "default";

highScoreDisplay.textContent = highScore;
levelDisplay.textContent = level;
coinsDisplay.textContent = coins;
if (savedSkin) {
  if (savedSkin.includes("linear-gradient")) {
    button.style.backgroundImage = savedSkin;
  } else {
    button.style.background = savedSkin;
  }
}

let achievements = JSON.parse(localStorage.getItem("achievements")) || [];

const totalAchievements = 12;

const allAchievements = [
  "First Catch",
  "Button Hunter",
  "Persistence Pays Off",
  "Professional Annoyer",

  "Combo Master",
  "Combo Legend",

  "Rich",
  "Millionaire",

  "Collector",
  "Theme Collector",

  "Survivor",
  "Veteran",
];

const taunts = [
  "Too slow!",
  "Nice try!",
  "You'll never catch me!",
  "Skill issue.",
  "Almost!",
  "Keep trying!",
  "Was that your best?",
  "Not even close!",
  "😂",
  "Come on...",
];

function randomTaunt() {
  if (tauntCooldown) return;

  tauntCooldown = true;

  const index = Math.floor(Math.random() * taunts.length);

  const taunt = taunts[index];

  message.textContent = taunt;

  showTaunt(taunt);

  setTimeout(() => {
    tauntCooldown = false;
  }, 1500);
}
function applyDifficulty() {
  localStorage.setItem("difficulty", currentDifficulty);

  switch (currentDifficulty) {
    case "easy":
      escapeDistance = 100;
      gameTime = 70;

      xpReward = 25;
      coinReward = 6;

      break;

    case "hard":
      escapeDistance = 200;
      gameTime = 55;

      xpReward = 20;
      coinReward = 5;

      break;

    case "nightmare":
      escapeDistance = 250;
      gameTime = 45;

      xpReward = 30;
      coinReward = 8;

      break;

    default:
      escapeDistance = 150;
      gameTime = 60;

      xpReward = 20;
      coinReward = 5;
  }
}

const achievementRewards = {
  "First Catch": 25,
  "Button Hunter": 50,
  "Persistence Pays Off": 75,
  "Professional Annoyer": 100,

  "Combo Master": 100,
  "Combo Legend": 250,

  Rich: 200,
  Millionaire: 500,

  Collector: 200,
  "Theme Collector": 300,

  Survivor: 250,
  Veteran: 500,
};

function unlockAchievement(name) {
  if (achievements.includes(name)) return;

  achievements.push(name);

  const reward = achievementRewards[name] || 0;

  coins += reward;

  lifetimeCoins += reward;

  localStorage.setItem("lifetimeCoins", lifetimeCoins);

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("achievements", JSON.stringify(achievements));

  updateStatistics();

  if (!achievementEnabled) return;

  const popup = document.getElementById("achievementPopup");

  document.getElementById("achievementText").textContent = name;

  achievementRewardText.textContent = reward > 0 ? `+${reward} Coins` : "";

  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
  }, 3000);
}

function updateAccuracy() {
  const accuracy =
    totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

  accuracyDisplay.textContent = accuracy;
}

function updateStatistics() {
  statsBestCombo.textContent = bestCombo;

  statsAchievements.textContent = `${achievements.length}/${totalAchievements}`;

  statsSkins.textContent = ownedSkins.length;

  statsThemes.textContent = ownedThemes.length;

  renderAchievements();
}

function checkDailyReward() {
  const today = new Date().toDateString();

  const lastClaim = localStorage.getItem("lastRewardDate");

  let rewardDay = parseInt(localStorage.getItem("rewardDay")) || 0;

  if (today === lastClaim) return;

  const reward = rewardTable[rewardDay];

  dailyRewardText.textContent = `Day ${rewardDay + 1}: +${reward} Coins`;

  dailyRewardPopup.hidden = false;

  claimRewardBtn.onclick = () => {
    coins += reward;

    lifetimeCoins += reward;

    coinsDisplay.textContent = coins;

    localStorage.setItem("coins", coins);

    localStorage.setItem("lifetimeCoins", lifetimeCoins);

    rewardDay = (rewardDay + 1) % rewardTable.length;

    localStorage.setItem("rewardDay", rewardDay);

    localStorage.setItem("lastRewardDate", today);

    dailyRewardPopup.hidden = true;
  };
}

function renderAchievements() {
  achievementList.innerHTML = "";

  allAchievements.forEach((achievement) => {
    const unlocked = achievements.includes(achievement);

    const item = document.createElement("div");

    item.className = "achievementItem";

    item.textContent = `${unlocked ? "✅" : "❌"} ${achievement}`;

    achievementList.appendChild(item);
  });
}

function addXP(amount) {
  runXP += amount;
  xp += amount;

  xpFill.style.width = (xp / xpNeeded) * 100 + "%";

  if (xp >= xpNeeded) {
    xp = 0;

    level++;

    levelDisplay.textContent = level;

    localStorage.setItem("level", level);

    if (level >= 10) {
      unlockAchievement("Survivor");
    }

    if (level > highestLevel) {
      highestLevel = level;

      localStorage.setItem("highestLevel", highestLevel);
    }

    coins += 50;

    lifetimeCoins += 50;

    coinsDisplay.textContent = coins;

    localStorage.setItem("coins", coins);

    localStorage.setItem("lifetimeCoins", lifetimeCoins);

    xpFill.style.width = "0%";

    message.textContent = `⭐ Level ${level}!`;
  }
}

function createFloatingText(text, offset = 0) {
  if (!floatingTextEnabled) return;

  const popup = document.createElement("div");

  popup.className = "floatingText";

  if (text.includes("Coins")) {
    popup.style.color = "#facc15";
  }

  if (text.includes("Combo")) {
    popup.style.color = "#f97316";

    popup.style.fontSize = "1.2rem";
  }

  popup.textContent = text;

  const rect = button.getBoundingClientRect();

  popup.style.left = rect.left + rect.width / 2 + "px";

  popup.style.top = rect.top + offset + "px";

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 800);
}

function announcePowerup(text) {
  if (!powerupEnabled) return;

  const popup = document.getElementById("powerupAnnouncement");

  popup.textContent = text;

  popup.classList.remove("show");

  void popup.offsetWidth;

  popup.classList.add("show");
}

function showHighScoreCelebration() {
  const popup = document.getElementById("highScorePopup");

  popup.classList.remove("show");

  void popup.offsetWidth;

  popup.classList.add("show");
}

function showTaunt(text) {
  const popup = document.getElementById("powerupAnnouncement");

  popup.textContent = text;

  popup.style.color = "#f97316";

  popup.classList.remove("show");

  void popup.offsetWidth;

  popup.classList.add("show");

  setTimeout(() => {
    popup.style.color = "white";
  }, 1000);
}

function teleportButton() {
  const rect = button.getBoundingClientRect();

  const arenaRect = gameArena.getBoundingClientRect();

  const maxX = arenaRect.width - rect.width;

  const maxY = arenaRect.height - rect.height;

  button.style.left = Math.random() * maxX + "px";

  button.style.top = Math.random() * maxY + "px";

  randomTaunt();
}

function showPowerup(type) {
  const powerup = document.createElement("div");

  powerup.className = "powerup";

  const arenaRect = gameArena.getBoundingClientRect();

  powerup.style.left = Math.random() * (arenaRect.width - 60) + "px";

  powerup.style.top = Math.random() * (arenaRect.height - 60) + "px";

  if (type === "xp") powerup.textContent = "⭐";

  if (type === "coins") powerup.textContent = "🪙";

  if (type === "slow") powerup.textContent = "⚡";

  if (type === "freeze") powerup.textContent = "🧊";

  powerup.addEventListener("click", () => {
    activatePowerup(type);

    powerup.remove();
  });

  gameArena.appendChild(powerup);

  setTimeout(() => {
    powerup.remove();
  }, 8000);
}

function activatePowerup(type) {
  if (type === "xp") {
    doubleXP = true;
    doubleXPTime = 10;

    updatePowerupStatus();

    message.textContent = "⭐ Double XP";

    announcePowerup("⭐ DOUBLE XP");

    setTimeout(() => {
      doubleXP = false;

      updatePowerupStatus();
    }, 10000);
  }

  if (type === "coins") {
    doubleCoins = true;
    doubleCoinsTime = 10;

    updatePowerupStatus();

    message.textContent = "🪙 Double Coins";

    announcePowerup("🪙 DOUBLE COINS");

    setTimeout(() => {
      doubleCoins = false;

      updatePowerupStatus();
    }, 10000);
  }

  if (type === "slow") {
    slowButton = true;
    slowButtonTime = 10;

    updatePowerupStatus();

    message.textContent = "⚡ Slow Button";

    announcePowerup("⚡ SLOW BUTTON");

    setTimeout(() => {
      slowButton = false;

      updatePowerupStatus();
    }, 10000);
  }

  if (type === "freeze") {
    freezeButton = true;

    freezeButtonTime = 5;

    updatePowerupStatus();

    message.textContent = "🧊 Freeze Button";

    announcePowerup("🧊 FREEZE BUTTON");

    setTimeout(() => {
      freezeButton = false;

      updatePowerupStatus();
    }, 5000);
  }
}

function updatePowerupStatus() {
  const active = [];

  if (doubleXP) active.push(`⭐ XP (${doubleXPTime}s)`);

  if (doubleCoins) active.push(`🪙 Coins (${doubleCoinsTime}s)`);

  if (slowButton) active.push(`⚡ Slow (${slowButtonTime}s)`);

  if (freezeButton) active.push(`🧊 Freeze (${freezeButtonTime}s)`);

  powerupStatus.textContent = active.length
    ? active.join(" | ")
    : "No Active Powerups";
}

document.addEventListener("mousemove", (e) => {
  if (isTouchDevice) return;

  if (gameOver) return;

  if (freezeButton) return;

  const rect = button.getBoundingClientRect();

  const buttonX = rect.left + rect.width / 2;

  const buttonY = rect.top + rect.height / 2;

  const dx = e.clientX - buttonX;

  const dy = e.clientY - buttonY;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < dangerDistance) {
    const moveDistance = slowButton ? escapeDistance / 2 : escapeDistance;

    let newX = button.offsetLeft - (dx / distance) * moveDistance;

    let newY = button.offsetTop - (dy / distance) * moveDistance;

    const arenaRect = gameArena.getBoundingClientRect();

    newX = Math.max(0, Math.min(newX, arenaRect.width - rect.width));

    newY = Math.max(0, Math.min(newY, arenaRect.height - rect.height));

    button.style.left = newX + "px";
    button.style.top = newY + "px";

    randomTaunt();
  }
});

button.addEventListener("touchstart", (e) => {
  e.preventDefault();

  if (gameOver) return;

  score++;
  lifetimeClicks++;

  localStorage.setItem("lifetimeClicks", lifetimeClicks);
  totalAttempts++;

  scoreDisplay.textContent = score;

  addXP(doubleXP ? xpReward * 2 : xpReward);

  coins += doubleCoins ? coinReward * 2 : coinReward;

  runCoins += doubleCoins ? coinReward * 2 : coinReward;

  lifetimeCoins += doubleCoins ? coinReward * 2 : coinReward;

  if (coins >= 1000) {
    unlockAchievement("Rich");
  }

  if (coins >= 5000) {
    unlockAchievement("Millionaire");
  }

  localStorage.setItem("lifetimeCoins", lifetimeCoins);

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  createFloatingText(
    `+${doubleXP ? xpReward * 2 : xpReward} XP | +${
      doubleCoins ? coinReward * 2 : coinReward
    } Coins`,
  );

  updateAccuracy();

  message.textContent = `You got me! Score: ${score}`;

  if (score > highScore) {
    const newRecord = score === highScore + 1;

    highScore = score;

    localStorage.setItem("highScore", highScore);

    highScoreDisplay.textContent = highScore;

    if (newRecord) {
      showHighScoreCelebration();
    }
  }

  setTimeout(
    () => {
      if (!gameOver && !freezeButton) {
        teleportButton();
      }
    },
    slowButton ? 300 : 120,
  );
});

document.addEventListener("click", (e) => {
  if (gameOver) return;

  if (e.target !== button) {
    misses++;
    totalAttempts++;

    missesDisplay.textContent = misses;

    updateAccuracy();
  }
});

button.addEventListener("click", () => {
  if (gameOver) return;

  combo++;

  if (combo > 1) {
    createFloatingText(`🔥 Combo x${combo}`, -30);
  }

  if (combo > bestCombo) {
    bestCombo = combo;
  }

  if (bestCombo >= 10) {
    unlockAchievement("Combo Master");
  }

  if (bestCombo >= 25) {
    unlockAchievement("Combo Legend");
  }

  clearTimeout(comboTimer);

  comboTimer = setTimeout(() => {
    combo = 0;
  }, 3000);

  score += combo;

  lifetimeClicks++;

  localStorage.setItem("lifetimeClicks", lifetimeClicks);

  totalAttempts++;

  scoreDisplay.textContent = score;

  addXP(doubleXP ? xpReward * 2 : xpReward);

  coins += doubleCoins ? coinReward * 2 : coinReward;

  runCoins += doubleCoins ? coinReward * 2 : coinReward;

  lifetimeCoins += doubleCoins ? coinReward * 2 : coinReward;

  if (coins >= 1000) {
    unlockAchievement("Rich");
  }

  if (coins >= 5000) {
    unlockAchievement("Millionaire");
  }

  localStorage.setItem("lifetimeCoins", lifetimeCoins);

  createFloatingText(
    `+${doubleXP ? xpReward * 2 : xpReward} XP | +${
      doubleCoins ? coinReward * 2 : coinReward
    } Coins`,
  );

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  updateAccuracy();

  message.textContent = `🔥 Combo x${combo} | Score: ${score}`;

  if (score > highScore) {
    highScore = score;

    localStorage.setItem("highScore", highScore);

    highScoreDisplay.textContent = highScore;
  }

  if (score === 1) unlockAchievement("First Catch");

  if (score === 5) unlockAchievement("Button Hunter");

  if (score === 10) unlockAchievement("Persistence Pays Off");

  if (score === 25) unlockAchievement("Professional Annoyer");

  if (score === 3) {
    message.textContent = "Level 2 Unlocked!";
  }

  if (score === 6) {
    button.style.scale = "0.9";

    message.textContent = "Level 3!";
  }

  if (score >= 20) {
    button.style.animation = "spin 1s linear infinite";

    button.style.scale = "0.8";
  }

  setTimeout(() => {
    if (!gameOver) teleportButton();
  }, 200);
});

menuDifficultySelect.addEventListener("change", () => {
  currentDifficulty = menuDifficultySelect.value;

  pauseDifficultySelect.value = currentDifficulty;

  applyDifficulty();
});

function showGameOver() {
  const screen = document.getElementById("gameOverScreen");

  gamesPlayed++;

  localStorage.setItem("gamesPlayed", gamesPlayed);

  if (gamesPlayed >= 25) {
    unlockAchievement("Veteran");
  }

  screen.removeAttribute("hidden");

  document.getElementById("finalScore").textContent = score;

  document.getElementById("finalMisses").textContent = misses;

  document.getElementById("finalCombo").textContent = bestCombo;

  document.getElementById("finalCoins").textContent = runCoins;

  document.getElementById("finalXP").textContent = runXP;

  document.getElementById("finalLevel").textContent = level;

  document.getElementById("finalHighScore").textContent = highScore;
}

let timeLeft = gameTime;

let timerStarted = false;

let timer;

function startTimer() {
  if (timerStarted) return;

  timerStarted = true;

  timer = setInterval(() => {
    if (gameOver || gamePaused) return;

    timeLeft--;

    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      gameOver = true;

      clearInterval(timer);

      showGameOver();

      message.textContent = "Game Over!";
    }
  }, 1000);
}

window.addEventListener("load", () => {
  applyDifficulty();
  updatePowerupStatus();
  updateShopUI();
  applyTheme(selectedTheme);
  updateThemeUI();
  updateStatistics();
  renderAchievements();
  checkDailyReward();

  timerDisplay.textContent = timeLeft;

  const rect = button.getBoundingClientRect();

  const arenaRect = gameArena.getBoundingClientRect();

  button.style.left = (arenaRect.width - rect.width) / 2 + "px";

  button.style.top = (arenaRect.height - rect.height) / 2 + "px";
  animationsToggle.checked = animationsEnabled;

  floatingTextToggle.checked = floatingTextEnabled;

  achievementToggle.checked = achievementEnabled;

  powerupToggle.checked = powerupEnabled;

  pauseDifficultySelect.value = currentDifficulty;

  menuDifficultySelect.value = currentDifficulty;
});

window.addEventListener("resize", () => {
  const rect = button.getBoundingClientRect();

  const arenaRect = gameArena.getBoundingClientRect();

  button.style.left =
    Math.min(button.offsetLeft, arenaRect.width - rect.width) + "px";

  button.style.top =
    Math.min(button.offsetTop, arenaRect.height - rect.height) + "px";
});

document.addEventListener("visibilitychange", () => {
  gamePaused = document.hidden;

  if (gamePaused) {
    message.textContent = "⏸ Game Paused";
  }
});

const blueSkinBtn = document.getElementById("blueSkin");

const goldSkinBtn = document.getElementById("goldSkin");

const rainbowSkinBtn = document.getElementById("rainbowSkin");

const spaceThemeBtn = document.getElementById("spaceTheme");

const oceanThemeBtn = document.getElementById("oceanTheme");

const lavaThemeBtn = document.getElementById("lavaTheme");

const forestThemeBtn = document.getElementById("forestTheme");

const defaultThemeBtn = document.getElementById("defaultTheme");

function updateShopUI() {
  blueSkinBtn.textContent = ownedSkins.includes("blue")
    ? selectedSkin === "blue"
      ? "Selected"
      : "Owned"
    : "Buy";

  goldSkinBtn.textContent = ownedSkins.includes("gold")
    ? selectedSkin === "gold"
      ? "Selected"
      : "Owned"
    : "Buy";

  rainbowSkinBtn.textContent = ownedSkins.includes("rainbow")
    ? selectedSkin === "rainbow"
      ? "Selected"
      : "Owned"
    : "Buy";

  if (ownedSkins.length >= 3) {
    unlockAchievement("Collector");
  }
}

function updateThemeUI() {
  spaceThemeBtn.textContent = ownedThemes.includes("space")
    ? selectedTheme === "space"
      ? "Selected"
      : "Owned"
    : "Buy";

  oceanThemeBtn.textContent = ownedThemes.includes("ocean")
    ? selectedTheme === "ocean"
      ? "Selected"
      : "Owned"
    : "Buy";

  lavaThemeBtn.textContent = ownedThemes.includes("lava")
    ? selectedTheme === "lava"
      ? "Selected"
      : "Owned"
    : "Buy";

  forestThemeBtn.textContent = ownedThemes.includes("forest")
    ? selectedTheme === "forest"
      ? "Selected"
      : "Owned"
    : "Buy";

  defaultThemeBtn.textContent =
    selectedTheme === "default" ? "Selected" : "Owned";

  if (ownedThemes.length >= 3) {
    unlockAchievement("Theme Collector");
  }
}

closeShop.addEventListener("click", () => {
  shop.hidden = true;

  if (openedFromPause) {
    pauseMenu.hidden = false;

    openedFromPause = false;

    return;
  }

  if (layout.hidden) {
    mainMenu.hidden = false;
  }
});

blueSkinBtn.addEventListener("click", () => {
  if (ownedSkins.includes("blue")) {
    selectedSkin = "blue";

    button.style.background = "#3b82f6";
  } else {
    if (coins < 50) return;

    coins -= 50;

    ownedSkins.push("blue");

    selectedSkin = "blue";

    button.style.background = "#3b82f6";
  }

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("selectedSkin", selectedSkin);

  localStorage.setItem("ownedSkins", JSON.stringify(ownedSkins));

  localStorage.setItem("skin", "#3b82f6");

  updateShopUI();
  updateStatistics();
});

goldSkinBtn.addEventListener("click", () => {
  if (ownedSkins.includes("gold")) {
    selectedSkin = "gold";

    button.style.background = "gold";
  } else {
    if (coins < 100) return;

    coins -= 100;

    ownedSkins.push("gold");

    selectedSkin = "gold";

    button.style.background = "gold";
  }

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("selectedSkin", selectedSkin);

  localStorage.setItem("ownedSkins", JSON.stringify(ownedSkins));

  localStorage.setItem("skin", "gold");

  updateShopUI();
  updateStatistics();
});
rainbowSkinBtn.addEventListener("click", () => {
  if (ownedSkins.includes("rainbow")) {
    selectedSkin = "rainbow";

    button.style.backgroundImage =
      "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
  } else {
    if (coins < 250) return;

    coins -= 250;

    ownedSkins.push("rainbow");

    selectedSkin = "rainbow";

    button.style.backgroundImage =
      "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
  }

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("selectedSkin", selectedSkin);

  localStorage.setItem("ownedSkins", JSON.stringify(ownedSkins));

  localStorage.setItem(
    "skin",
    "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)",
  );

  updateShopUI();
  updateStatistics();
});

closeStats.addEventListener("click", () => {
  statsScreen.hidden = true;

  if (openedFromPause) {
    pauseMenu.hidden = false;

    openedFromPause = false;

    return;
  }

  if (layout.hidden) {
    mainMenu.hidden = false;
  }
});

setInterval(() => {
  if (gameOver || gamePaused) return;

  const roll = Math.random();

  if (roll < 0.25) {
    showPowerup("xp");
  } else if (roll < 0.5) {
    showPowerup("coins");
  } else if (roll < 0.75) {
    showPowerup("slow");
  } else {
    showPowerup("freeze");
  }
}, 20000);

setInterval(() => {
  if (doubleXP && doubleXPTime > 0) doubleXPTime--;

  if (doubleCoins && doubleCoinsTime > 0) doubleCoinsTime--;

  if (slowButton && slowButtonTime > 0) slowButtonTime--;

  if (freezeButton && freezeButtonTime > 0) freezeButtonTime--;

  updatePowerupStatus();
}, 1000);

playBtn.addEventListener("click", () => {
  timeLeft = gameTime;

  timerDisplay.textContent = timeLeft;

  mainMenu.hidden = true;

  layout.hidden = false;

  startTimer();
});

menuStatsBtn.addEventListener("click", () => {
  mainMenu.hidden = true;

  statsScreen.hidden = false;
});

menuShopBtn.addEventListener("click", () => {
  mainMenu.hidden = true;

  shop.hidden = false;
});

function applyTheme(theme) {
  const body = document.body;

  const sidebar = document.getElementById("sidebar");

  const arena = document.getElementById("gameArena");

  switch (theme) {
    case "space":
      body.style.background = "linear-gradient(135deg,#020617,#312e81)";

      sidebar.style.boxShadow = "0 0 25px rgba(99,102,241,.5)";

      arena.style.boxShadow = "0 0 40px rgba(99,102,241,.4)";

      arena.style.background = "rgba(15,23,42,.35)";

      break;

    case "ocean":
      body.style.background = "linear-gradient(135deg,#0c4a6e,#06b6d4)";

      sidebar.style.boxShadow = "0 0 25px rgba(6,182,212,.5)";

      arena.style.boxShadow = "0 0 40px rgba(6,182,212,.4)";

      arena.style.background = "rgba(8,145,178,.2)";

      break;

    case "lava":
      body.style.background = "linear-gradient(135deg,#7f1d1d,#f97316)";

      sidebar.style.boxShadow = "0 0 25px rgba(249,115,22,.6)";

      arena.style.boxShadow = "0 0 40px rgba(249,115,22,.5)";

      arena.style.background = "rgba(127,29,29,.25)";

      break;

    case "forest":
      body.style.background = "linear-gradient(135deg,#14532d,#22c55e)";

      sidebar.style.boxShadow = "0 0 25px rgba(34,197,94,.5)";

      arena.style.boxShadow = "0 0 40px rgba(34,197,94,.4)";

      arena.style.background = "rgba(20,83,45,.25)";

      break;

    default:
      body.style.background = "linear-gradient(135deg,#0f172a,#1e293b)";

      sidebar.style.boxShadow = "none";

      arena.style.boxShadow = "inset 0 0 30px rgba(0,255,255,.08)";

      arena.style.background =
        "linear-gradient(135deg,rgba(255,255,255,.02),rgba(0,255,255,.03))";

      break;
  }
}

spaceThemeBtn.addEventListener("click", () => {
  if (ownedThemes.includes("space")) {
    selectedTheme = "space";

    applyTheme("space");
  } else {
    if (coins < 500) return;

    coins -= 500;

    ownedThemes.push("space");

    selectedTheme = "space";

    applyTheme("space");
  }

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("selectedTheme", selectedTheme);

  localStorage.setItem("ownedThemes", JSON.stringify(ownedThemes));

  updateThemeUI();
  updateStatistics();
});

oceanThemeBtn.addEventListener("click", () => {
  if (ownedThemes.includes("ocean")) {
    selectedTheme = "ocean";

    applyTheme("ocean");
  } else {
    if (coins < 750) return;

    coins -= 750;

    ownedThemes.push("ocean");

    selectedTheme = "ocean";

    applyTheme("ocean");
  }

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("selectedTheme", selectedTheme);

  localStorage.setItem("ownedThemes", JSON.stringify(ownedThemes));

  updateThemeUI();
  updateStatistics();
});

lavaThemeBtn.addEventListener("click", () => {
  if (ownedThemes.includes("lava")) {
    selectedTheme = "lava";

    applyTheme("lava");
  } else {
    if (coins < 1000) return;

    coins -= 1000;

    ownedThemes.push("lava");

    selectedTheme = "lava";

    applyTheme("lava");
  }

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("selectedTheme", selectedTheme);

  localStorage.setItem("ownedThemes", JSON.stringify(ownedThemes));

  updateThemeUI();
  updateStatistics();
});

forestThemeBtn.addEventListener("click", () => {
  if (ownedThemes.includes("forest")) {
    selectedTheme = "forest";

    applyTheme("forest");
  } else {
    if (coins < 1250) return;

    coins -= 1250;

    ownedThemes.push("forest");

    selectedTheme = "forest";

    applyTheme("forest");
  }

  coinsDisplay.textContent = coins;

  localStorage.setItem("coins", coins);

  localStorage.setItem("selectedTheme", selectedTheme);

  localStorage.setItem("ownedThemes", JSON.stringify(ownedThemes));

  updateThemeUI();
  updateStatistics();
});

defaultThemeBtn.addEventListener("click", () => {
  selectedTheme = "default";

  applyTheme("default");

  localStorage.setItem("selectedTheme", selectedTheme);

  updateThemeUI();
  updateStatistics();
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  if (gameOver) return;

  gamePaused = !gamePaused;

  pauseMenu.hidden = !gamePaused;
});

resumeBtn.addEventListener("click", () => {
  gamePaused = false;

  pauseMenu.hidden = true;
});
pauseShopBtn.addEventListener("click", () => {
  openedFromPause = true;

  pauseMenu.hidden = true;

  shop.hidden = false;
});
pauseStatsBtn.addEventListener("click", () => {
  openedFromPause = true;

  pauseMenu.hidden = true;

  statsScreen.hidden = false;
});
pauseMainMenuBtn.addEventListener("click", () => {
  location.reload();
});
menuSettingsBtn.addEventListener("click", () => {
  mainMenu.hidden = true;

  settingsScreen.hidden = false;
});

closeSettings.addEventListener("click", () => {
  settingsScreen.hidden = true;

  if (openedFromPause) {
    pauseMenu.hidden = false;

    openedFromPause = false;

    return;
  }

  mainMenu.hidden = false;
});
animationsToggle.addEventListener("change", () => {
  animationsEnabled = animationsToggle.checked;

  localStorage.setItem("animationsEnabled", animationsEnabled);
});

floatingTextToggle.addEventListener("change", () => {
  floatingTextEnabled = floatingTextToggle.checked;

  localStorage.setItem("floatingTextEnabled", floatingTextEnabled);
});

achievementToggle.addEventListener("change", () => {
  achievementEnabled = achievementToggle.checked;

  localStorage.setItem("achievementEnabled", achievementEnabled);
});

powerupToggle.addEventListener("change", () => {
  powerupEnabled = powerupToggle.checked;

  localStorage.setItem("powerupEnabled", powerupEnabled);
});
resetProgressBtn.addEventListener("click", () => {
  if (!confirm("Reset all progress?")) return;

  localStorage.clear();

  location.reload();
});
pauseSettingsBtn.addEventListener("click", () => {
  openedFromPause = true;

  pauseMenu.hidden = true;

  settingsScreen.hidden = false;
});
pauseDifficultySelect.addEventListener("change", () => {
  currentDifficulty = pauseDifficultySelect.value;

  menuDifficultySelect.value = currentDifficulty;

  applyDifficulty();
});
