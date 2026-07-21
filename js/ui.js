import { state, config } from "./state.js";

// Cached DOM elements and presentation-only helpers.
export const el = Object.fromEntries(
  "runawayBtn score menuDifficultySelect misses accuracy highScore timer tauntBox mainMenu pauseMenu resumeBtn pauseStatsBtn pauseShopBtn pauseSettingsBtn pauseDifficultySelect pauseMainMenuBtn playBtn menuStatsBtn menuShopBtn layout gameArena shop closeShop dailyRewardPopup dailyRewardText claimRewardBtn statsScreen closeStats level coins xpFill powerupStatus menuSettingsBtn settingsScreen closeSettings floatingTextToggle achievementToggle powerupToggle resetProgressBtn statsBestCombo statsAchievements statsSkins statsThemes achievementList achievementReward blueSkin goldSkin rainbowSkin spaceTheme oceanTheme lavaTheme forestTheme defaultTheme sidebar gameOverScreen finalScore finalMisses finalCombo finalCoins finalXP finalLevel finalHighScore achievementPopup achievementText powerupAnnouncement highScorePopup confettiCanvas"
    .split(" ")
    .map((id) => [id, document.getElementById(id)]),
);

export function renderHUD() {
  el.score.textContent = state.score;
  el.coins.textContent = state.coins;
  el.level.textContent = state.level;
  el.highScore.textContent = state.highScore;
  el.misses.textContent = state.misses;
  el.timer.textContent = state.timeLeft;
  el.xpFill.style.width = `${(state.xp / config.xpNeeded) * 100}%`;
}
export function setMessage(text) {
  el.tauntBox.textContent = text;
}
export function randomTaunt() {
  if (state.tauntCooldown) return;
  state.tauntCooldown = true;
  const text = config.taunts[Math.floor(Math.random() * config.taunts.length)];
  setMessage(text);
  showTaunt(text);
  setTimeout(() => {
    state.tauntCooldown = false;
  }, 1500);
}
export function createFloatingText(text, offset = 0) {
  if (!state.floatingTextEnabled) return;
  const popup = document.createElement("div");
  popup.className = "floatingText";
  if (text.includes("Coins")) popup.style.color = "#facc15";
  if (text.includes("Combo")) {
    popup.style.color = "#f97316";
    popup.style.fontSize = "1.2rem";
  }
  popup.textContent = text;
  const rect = el.runawayBtn.getBoundingClientRect();
  popup.style.left = `${rect.left + rect.width / 2}px`;
  popup.style.top = `${rect.top + offset}px`;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 800);
}
export function announcePowerup(text) {
  if (!state.powerupEnabled) return;
  el.powerupAnnouncement.textContent = text;
  el.powerupAnnouncement.classList.remove("show");
  void el.powerupAnnouncement.offsetWidth;
  el.powerupAnnouncement.classList.add("show");
}
export function showTaunt(text) {
  el.powerupAnnouncement.textContent = text;
  el.powerupAnnouncement.style.color = "#f97316";
  el.powerupAnnouncement.classList.remove("show");
  void el.powerupAnnouncement.offsetWidth;
  el.powerupAnnouncement.classList.add("show");
  setTimeout(() => {
    el.powerupAnnouncement.style.color = "white";
  }, 1000);
}
export function showHighScoreCelebration() {
  const popup = el.highScorePopup;

  popup.classList.remove("show");

  // Restart animation
  void popup.offsetWidth;

  popup.classList.add("show");

  launchConfetti();

  // Mobile vibration (optional)
  navigator.vibrate?.(120);

  // Hide after 2.5 seconds
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2500);
}
function launchConfetti() {
  const canvas = el.confettiCanvas;
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = [
    "#FFD700",
    "#FF4D6D",
    "#06B6D4",
    "#22C55E",
    "#A855F7",
    "#F97316",
  ];

  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.35,
      vx: (Math.random() - 0.5) * 12,
      vy: -Math.random() * 10 - 4,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 120,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      p.vy += 0.18;
      p.life--;

      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    if (particles.length) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}
export function teleportButton() {
  const rect = el.runawayBtn.getBoundingClientRect();
  const arena = el.gameArena.getBoundingClientRect();
  el.runawayBtn.style.left = `${Math.random() * (arena.width - rect.width)}px`;
  el.runawayBtn.style.top = `${Math.random() * (arena.height - rect.height)}px`;
  randomTaunt();
}
export function centerButton() {
  const rect = el.runawayBtn.getBoundingClientRect();
  const arena = el.gameArena.getBoundingClientRect();
  el.runawayBtn.style.left = `${(arena.width - rect.width) / 2}px`;
  el.runawayBtn.style.top = `${(arena.height - rect.height) / 2}px`;
}
