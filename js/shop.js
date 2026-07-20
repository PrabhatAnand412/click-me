// Skin catalog, purchases, and shop navigation.
import { state } from "./state.js";
import { SaveManager as save } from "./save.js";
import { el, renderHUD } from "./ui.js";
import { unlockAchievement } from "./achievements.js";
import { renderStatistics } from "./statistics.js";

const skins = { blue: [50, "#3b82f6"], gold: [100, "gold"], rainbow: [250, "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)"] };
export function updateShopUI() { Object.keys(skins).forEach((skin) => { el[skin].textContent = state.ownedSkins.includes(skin) ? state.selectedSkin === skin ? "Selected" : "Owned" : "Buy"; }); if (state.ownedSkins.length >= 3) unlockAchievement("Collector"); }
function selectSkin(name) { const [cost, style] = skins[name]; if (!state.ownedSkins.includes(name)) { if (state.coins < cost) return; state.coins -= cost; state.ownedSkins.push(name); } state.selectedSkin = name; if (name === "rainbow") el.runawayBtn.style.backgroundImage = style; else el.runawayBtn.style.background = style; save.set("coins", state.coins); save.set("selectedSkin", name); save.set("ownedSkins", state.ownedSkins); save.set("skin", style); renderHUD(); updateShopUI(); renderStatistics(); }
export function initialiseShop() { Object.keys(skins).forEach((skin) => el[skin].addEventListener("click", () => selectSkin(skin))); el.closeShop.addEventListener("click", () => { el.shop.hidden = true; if (state.openedFromPause) { el.pauseMenu.hidden = false; state.openedFromPause = false; } else if (el.layout.hidden) el.mainMenu.hidden = false; }); el.menuShopBtn.addEventListener("click", () => { el.mainMenu.hidden = true; el.shop.hidden = false; }); }
