// Achievement rewards, progression, and daily reward flow.
import { state, config } from "./state.js";
import { SaveManager as save } from "./save.js";
import { el, renderHUD } from "./ui.js";
import { renderStatistics } from "./statistics.js";

const rewards = {
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
export function renderAchievements() {
  el.achievementList.innerHTML = "";
  config.achievements.forEach((name) => {
    const item = document.createElement("div");
    item.className = "achievementItem";
    item.textContent = `${state.achievements.includes(name) ? "✅" : "❌"} ${name}`;
    el.achievementList.appendChild(item);
  });
}
export function refreshAchievementUI() {
  renderStatistics();
  renderAchievements();
}
export function unlockAchievement(name) {
  if (state.achievements.includes(name)) return false;
  state.achievements.push(name);
  const reward = rewards[name] || 0;
  state.coins += reward;
  state.lifetimeCoins += reward;
  save.set("coins", state.coins);
  save.set("lifetimeCoins", state.lifetimeCoins);
  save.set("achievements", state.achievements);
  renderHUD();
  refreshAchievementUI();
  if (!state.achievementEnabled) return true;
  el.achievementText.textContent = name;
  el.achievementReward.textContent = reward ? `+${reward} Coins` : "";
  el.achievementPopup.classList.add("show");
  setTimeout(() => el.achievementPopup.classList.remove("show"), 3000);
  return true;
}
export function initialiseDailyReward() {
  const today = new Date().toDateString();
  if (save.get("lastRewardDate") === today) return;
  let day = Number.parseInt(save.get("rewardDay", 0), 10) || 0;
  const reward = config.rewardTable[day];
  el.dailyRewardText.textContent = `Day ${day + 1}: +${reward} Coins`;
  el.dailyRewardPopup.hidden = false;
  el.claimRewardBtn.onclick = () => {
    state.coins += reward;
    state.lifetimeCoins += reward;
    save.set("coins", state.coins);
    save.set("lifetimeCoins", state.lifetimeCoins);
    day = (day + 1) % config.rewardTable.length;
    save.set("rewardDay", day);
    save.set("lastRewardDate", today);
    el.dailyRewardPopup.hidden = true;
    renderHUD();
  };
}
