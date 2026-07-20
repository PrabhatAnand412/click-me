// Theme catalog, purchases, and visual application.
import { state } from "./state.js";
import { SaveManager as save } from "./save.js";
import { el, renderHUD } from "./ui.js";
import { unlockAchievement } from "./achievements.js";
import { renderStatistics } from "./statistics.js";

const themeCosts = { space: 500, ocean: 750, lava: 1000, forest: 1250 };
const styles = { space: ["linear-gradient(135deg,#020617,#312e81)", "0 0 25px rgba(99,102,241,.5)", "0 0 40px rgba(99,102,241,.4)", "rgba(15,23,42,.35)"], ocean: ["linear-gradient(135deg,#0c4a6e,#06b6d4)", "0 0 25px rgba(6,182,212,.5)", "0 0 40px rgba(6,182,212,.4)", "rgba(8,145,178,.2)"], lava: ["linear-gradient(135deg,#7f1d1d,#f97316)", "0 0 25px rgba(249,115,22,.6)", "0 0 40px rgba(249,115,22,.5)", "rgba(127,29,29,.25)"], forest: ["linear-gradient(135deg,#14532d,#22c55e)", "0 0 25px rgba(34,197,94,.5)", "0 0 40px rgba(34,197,94,.4)", "rgba(20,83,45,.25)"], default: ["linear-gradient(135deg,#0f172a,#1e293b)", "none", "inset 0 0 30px rgba(0,255,255,.08)", "linear-gradient(135deg,rgba(255,255,255,.02),rgba(0,255,255,.03))"] };
export function applyTheme(name) { const [background, sidebarShadow, arenaShadow, arenaBackground] = styles[name] || styles.default; document.body.style.background = background; el.sidebar.style.boxShadow = sidebarShadow; el.gameArena.style.boxShadow = arenaShadow; el.gameArena.style.background = arenaBackground; }
export function updateThemeUI() { [...Object.keys(themeCosts), "default"].forEach((name) => { el[name + "Theme"].textContent = state.selectedTheme === name ? "Selected" : state.ownedThemes.includes(name) ? "Owned" : "Buy"; }); if (state.ownedThemes.length >= 3) unlockAchievement("Theme Collector"); }
function selectTheme(name) { const cost = themeCosts[name]; if (cost && !state.ownedThemes.includes(name)) { if (state.coins < cost) return; state.coins -= cost; state.ownedThemes.push(name); } state.selectedTheme = name; save.set("coins", state.coins); save.set("selectedTheme", name); save.set("ownedThemes", state.ownedThemes); applyTheme(name); renderHUD(); updateThemeUI(); renderStatistics(); }
export function initialiseThemes() { Object.keys(themeCosts).forEach((name) => el[name + "Theme"].addEventListener("click", () => selectTheme(name))); el.defaultTheme.addEventListener("click", () => selectTheme("default")); }
