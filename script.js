const button = document.getElementById("runawayBtn");
const scoreDisplay = document.getElementById("score");
const missesDisplay = document.getElementById("misses");
const accuracyDisplay = document.getElementById("accuracy");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const fakeContainer = document.getElementById("fakeContainer");
const mainMenu =
    document.getElementById(
        "mainMenu"
    );

const playBtn =
    document.getElementById(
        "playBtn"
    );

const menuStatsBtn =
    document.getElementById(
        "menuStatsBtn"
    );

const menuShopBtn =
    document.getElementById(
        "menuShopBtn"
    );

const layout =
    document.getElementById(
        "layout"
    );
const gameArena =
    document.getElementById(
        "gameArena"
    );
const difficultySelect =
    document.getElementById(
        "difficultySelect"
    );

const shopBtn =
    document.getElementById("shopBtn");

const shop =
    document.getElementById("shop");

const closeShop =
    document.getElementById("closeShop");

const statsBtn =
    document.getElementById("statsBtn");

const statsScreen =
    document.getElementById("statsScreen");

const closeStats =
    document.getElementById("closeStats");

const levelDisplay =
    document.getElementById("level");

const coinsDisplay =
    document.getElementById("coins");

const xpFill =
    document.getElementById("xpFill");

const powerupStatus =
    document.getElementById(
        "powerupStatus"
    );

let score = 0;
let misses = 0;
let totalAttempts = 0;
let xp = 0;
let level =
    parseInt(
        localStorage.getItem("level")
    ) || 1;

let coins =
    parseInt(
        localStorage.getItem("coins")
    ) || 0;

const xpNeeded = 100;
let combo = 0;
let comboTimer;
let fakeButtonsCreated = false;
const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

let dangerDistance =
    isTouchDevice ? 20 : 35;

let currentDifficulty =
    "normal";
let xpReward = 20;
let coinReward = 5;
let doubleXP = false;

let doubleCoins = false;

let slowButton = false;

let doubleXPTime = 0;

let doubleCoinsTime = 0;

let slowButtonTime = 0;

let gameOver = false;
let gamePaused = false;

let highScore =
    parseInt(localStorage.getItem("highScore")) || 0;

let gamesPlayed =
    parseInt(
        localStorage.getItem(
            "gamesPlayed"
        )
    ) || 0;

let lifetimeClicks =
    parseInt(
        localStorage.getItem(
            "lifetimeClicks"
        )
    ) || 0;

let lifetimeCoins =
    parseInt(
        localStorage.getItem(
            "lifetimeCoins"
        )
    ) || 0; 
let ownedSkins =
    JSON.parse(
        localStorage.getItem(
            "ownedSkins"
        )
    ) || ["default"];

let selectedSkin =
    localStorage.getItem(
        "selectedSkin"
    ) || "default";
const savedSkin =
    localStorage.getItem("skin");

highScoreDisplay.textContent = highScore;
levelDisplay.textContent = level;
coinsDisplay.textContent = coins;
if(savedSkin){

    if(savedSkin.includes("linear-gradient")){

        button.style.backgroundImage =
            savedSkin;

    } else {

        button.style.background =
            savedSkin;
    }
}

const achievements = [];

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
    "Come on..."
];

function randomTaunt() {

    const index =
        Math.floor(Math.random() * taunts.length);

    message.textContent = taunts[index];
}

function applyDifficulty() {

    currentDifficulty =
        difficultySelect.value;

    switch(currentDifficulty){

    case "easy":

        dangerDistance = 20;

        xpReward = 15;

        coinReward = 3;

        break;

    case "normal":

        dangerDistance = 35;

        xpReward = 20;

        coinReward = 5;

        break;

    case "hard":

        dangerDistance = 60;

        xpReward = 30;

        coinReward = 8;

        break;

    case "nightmare":

        dangerDistance = 100;

        xpReward = 50;

        coinReward = 15;

        break;
}

    message.textContent =
        `Difficulty: ${currentDifficulty}`;
}

function unlockAchievement(name) {

    if (achievements.includes(name))
        return;

    achievements.push(name);

    const popup =
        document.getElementById(
            "achievementPopup"
        );

    document.getElementById(
        "achievementText"
    ).textContent = name;

    popup.classList.add("show");

    setTimeout(() => {

        popup.classList.remove("show");

    }, 3000);
}

function updateAccuracy() {

    const accuracy =
        totalAttempts > 0
            ? Math.round((score / totalAttempts) * 100)
            : 0;

    accuracyDisplay.textContent = accuracy;
}

function addXP(amount) {

    xp += amount;

    if (xp > xpNeeded)
        xp = xpNeeded;

    xpFill.style.width =
        (xp / xpNeeded) * 100 + "%";

    if (xp >= xpNeeded) {

        xp = 0;

        level++;

        levelDisplay.textContent =
    level;

localStorage.setItem(
    "level",
    level
);

coins += 50;

lifetimeCoins += 50;

coinsDisplay.textContent =
    coins;

localStorage.setItem(
    "coins",
    coins
);

localStorage.setItem(
    "lifetimeCoins",
    lifetimeCoins
);

        xpFill.style.width = "0%";

        unlockAchievement(
            `Level ${level} Reached`
        );

        message.textContent =
            `⭐ Level ${level}!`;
    }
}

function createFloatingText(
    text,
    offset = 0
) {

    const popup =
        document.createElement("div");

    popup.className =
        "floatingText";

    if(text.includes("Coins")){

    popup.style.color =
        "#facc15";
}

    popup.textContent = text;

    const rect =
        button.getBoundingClientRect();

    popup.style.left =
        rect.left + rect.width / 2 + "px";

    popup.style.top =
    rect.top + offset + "px";

    document.body.appendChild(
        popup
    );

    setTimeout(() => {

        popup.remove();

    }, 800);
}

function teleportButton() {

    const rect = button.getBoundingClientRect();

    const arenaRect =
    gameArena.getBoundingClientRect();

const maxX =
    arenaRect.width - rect.width;

const maxY =
    arenaRect.height - rect.height;

    button.style.left =
        Math.random() * maxX + "px";

    button.style.top =
        Math.random() * maxY + "px";

    randomTaunt();
}

function createFakeButtons() {

    if (fakeButtonsCreated) return;

    fakeButtonsCreated = true;

    for (let i = 0; i < 3; i++) {

        const fake =
            document.createElement("button");

        fake.innerText = "Click Me!";
        fake.className = "fakeButton";

        const arenaRect =
    gameArena.getBoundingClientRect();

fake.style.left =
    Math.random() *
    (arenaRect.width - 150) + "px";

fake.style.top =
    Math.random() *
    (arenaRect.height - 150) + "px";

        fake.addEventListener("click", () => {

            message.textContent =
                "Wrong button 😂";

        });

        fakeContainer.appendChild(fake);
    }
}

function showPowerup(type) {

    const powerup =
        document.createElement("div");

    powerup.className =
        "powerup";

    const arenaRect =
        gameArena.getBoundingClientRect();

    powerup.style.left =
        Math.random() *
        (arenaRect.width - 60) + "px";

    powerup.style.top =
        Math.random() *
        (arenaRect.height - 60) + "px";

    if(type === "xp")
        powerup.textContent = "⭐";

    if(type === "coins")
        powerup.textContent = "🪙";

    if(type === "slow")
        powerup.textContent = "⚡";

    powerup.addEventListener(
        "click",
        () => {

            activatePowerup(type);

            powerup.remove();
        }
    );

    gameArena.appendChild(powerup);

    setTimeout(() => {

        powerup.remove();

    }, 8000);
}

function activatePowerup(type){

    if(type === "xp"){

    doubleXP = true;
    doubleXPTime = 10;

    updatePowerupStatus();

    message.textContent =
        "⭐ Double XP";

    setTimeout(() => {

        doubleXP = false;

        updatePowerupStatus();

    }, 10000);
}

    if(type === "coins"){

    doubleCoins = true;
    doubleCoinsTime = 10;

    updatePowerupStatus();

    message.textContent =
        "🪙 Double Coins";

    setTimeout(() => {

        doubleCoins = false;

        updatePowerupStatus();

    }, 10000);
}

    if(type === "slow"){

    slowButton = true;
    slowButtonTime = 10;

    updatePowerupStatus();

    message.textContent =
        "⚡ Slow Button";

    setTimeout(() => {

        slowButton = false;

        updatePowerupStatus();

    }, 10000);
}
}

function updatePowerupStatus() {

    const active = [];

    if(doubleXP)
        active.push(
            `⭐ XP (${doubleXPTime}s)`
        );

    if(doubleCoins)
        active.push(
            `🪙 Coins (${doubleCoinsTime}s)`
        );

    if(slowButton)
        active.push(
            `⚡ Slow (${slowButtonTime}s)`
        );

    powerupStatus.textContent =
        active.length
            ? active.join(" | ")
            : "No Active Powerups";
}

document.addEventListener("mousemove", (e) => {

    if(isTouchDevice) return;

    if (gameOver) return;

    const rect =
        button.getBoundingClientRect();

    const buttonX =
        rect.left + rect.width / 2;

    const buttonY =
        rect.top + rect.height / 2;

    const dx =
        e.clientX - buttonX;

    const dy =
        e.clientY - buttonY;

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    if (distance < dangerDistance) {

        const escapeDistance =
    slowButton
        ? 75
        : 150;

        let newX =
            button.offsetLeft -
            (dx / distance) *
            escapeDistance;

        let newY =
            button.offsetTop -
            (dy / distance) *
            escapeDistance;

        const arenaRect =
    gameArena.getBoundingClientRect();

newX = Math.max(
    0,
    Math.min(
        newX,
        arenaRect.width - rect.width
    )
);

newY = Math.max(
    0,
    Math.min(
        newY,
        arenaRect.height - rect.height
    )
);

        button.style.left = newX + "px";
        button.style.top = newY + "px";

        randomTaunt();
    }
});

button.addEventListener("touchstart", (e) => {

    e.preventDefault();

    if(gameOver)
        return;

    score++;
    lifetimeClicks++;

localStorage.setItem(
    "lifetimeClicks",
    lifetimeClicks
);
    totalAttempts++;

    scoreDisplay.textContent = score;

    addXP(
    doubleXP
        ? xpReward * 2
        : xpReward
);

coins +=
    doubleCoins
        ? coinReward * 2
        : coinReward;

lifetimeCoins +=
    doubleCoins
        ? coinReward * 2
        : coinReward;

localStorage.setItem(
    "lifetimeCoins",
    lifetimeCoins
);

coinsDisplay.textContent =
    coins;

localStorage.setItem(
    "coins",
    coins
);

createFloatingText(
    `+${
        doubleXP
            ? xpReward * 2
            : xpReward
    } XP | +${
        doubleCoins
            ? coinReward * 2
            : coinReward
    } Coins`
);

    updateAccuracy();

    message.textContent =
        `You got me! Score: ${score}`;

    if(score > highScore){

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );

        highScoreDisplay.textContent =
            highScore;
    }

    setTimeout(() => {

    if(!gameOver)
        teleportButton();

}, slowButton ? 300 : 120);
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

clearTimeout(comboTimer);

comboTimer = setTimeout(() => {

    combo = 0;

}, 3000);

score += combo;

lifetimeClicks++;

localStorage.setItem(
    "lifetimeClicks",
    lifetimeClicks
);

    totalAttempts++;

    scoreDisplay.textContent = score;

addXP(
    doubleXP
        ? xpReward * 2
        : xpReward
);

coins +=
    doubleCoins
        ? coinReward * 2
        : coinReward;

lifetimeCoins +=
    doubleCoins
        ? coinReward * 2
        : coinReward;

localStorage.setItem(
    "lifetimeCoins",
    lifetimeCoins
);

createFloatingText(
    `+${
        doubleXP
            ? xpReward * 2
            : xpReward
    } XP | +${
        doubleCoins
            ? coinReward * 2
            : coinReward
    } Coins`
);

coinsDisplay.textContent =
    coins;

    localStorage.setItem(
    "coins",
    coins
);

    updateAccuracy();

    message.textContent =
    `🔥 Combo x${combo} | Score: ${score}`;

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "highScore",
            highScore
        );

        highScoreDisplay.textContent =
            highScore;
    }

    if (score === 1)
        unlockAchievement("First Catch");

    if (score === 5)
        unlockAchievement("Button Hunter");

    if (score === 10)
        unlockAchievement("Persistence Pays Off");

    if (score === 25)
        unlockAchievement("Professional Annoyer");

    if (score === 3) {

    message.textContent =
        "Level 2 Unlocked!";
}

if (score === 6) {

    button.style.scale = "0.9";

    message.textContent =
        "Level 3!";
}

if (score === 10) {

    createFakeButtons();

    message.textContent =
        "Fake buttons unlocked!";
}

    if (score >= 20) {

        button.style.animation =
            "spin 1s linear infinite";

        button.style.scale = "0.8";
    }

    setTimeout(() => {

        if (!gameOver)
            teleportButton();

    }, 200);
});

function showGameOver() {

    const screen =
        document.getElementById(
            "gameOverScreen"
        );

    gamesPlayed++;

localStorage.setItem(
    "gamesPlayed",
    gamesPlayed
);

    screen.removeAttribute("hidden");

    document.getElementById(
        "finalScore"
    ).textContent = score;

    document.getElementById(
        "finalMisses"
    ).textContent = misses;
}

let timeLeft = 60;

let timerStarted = false;

let timer;

function startTimer() {

    if(timerStarted)
        return;

    timerStarted = true;

    timer = setInterval(() => {

        if(gameOver || gamePaused)
            return;

        timeLeft--;

        timerDisplay.textContent =
            timeLeft;

        if(timeLeft <= 0){

            gameOver = true;

            clearInterval(timer);

            showGameOver();

            message.textContent =
                "Game Over!";
        }

    }, 1000);
}

window.addEventListener("load", () => {

applyDifficulty();
updatePowerupStatus();
updateShopUI();

timerDisplay.textContent =
    timeLeft;

    const rect =
        button.getBoundingClientRect();

    const arenaRect =
    gameArena.getBoundingClientRect();

button.style.left =
    (arenaRect.width - rect.width) / 2 + "px";

button.style.top =
    (arenaRect.height - rect.height) / 2 + "px";
});

window.addEventListener("resize", () => {

    const rect =
        button.getBoundingClientRect();

    const arenaRect =
        gameArena.getBoundingClientRect();

    button.style.left =
        Math.min(
            button.offsetLeft,
            arenaRect.width - rect.width
        ) + "px";

    button.style.top =
        Math.min(
            button.offsetTop,
            arenaRect.height - rect.height
        ) + "px";
});

document.addEventListener(
    "visibilitychange",
    () => {

        gamePaused = document.hidden;

        if(gamePaused){

            message.textContent =
                "⏸ Game Paused";
        }
    }
);

const blueSkinBtn =
    document.getElementById(
        "blueSkin"
    );

const goldSkinBtn =
    document.getElementById(
        "goldSkin"
    );

const rainbowSkinBtn =
    document.getElementById(
        "rainbowSkin"
    );

function updateShopUI() {

    blueSkinBtn.textContent =
        ownedSkins.includes("blue")
        ? (
            selectedSkin === "blue"
            ? "Selected"
            : "Owned"
        )
        : "Buy";

    goldSkinBtn.textContent =
        ownedSkins.includes("gold")
        ? (
            selectedSkin === "gold"
            ? "Selected"
            : "Owned"
        )
        : "Buy";

    rainbowSkinBtn.textContent =
        ownedSkins.includes("rainbow")
        ? (
            selectedSkin === "rainbow"
            ? "Selected"
            : "Owned"
        )
        : "Buy";
}

shopBtn.addEventListener("click", () => {

    shop.hidden = false;
});

closeShop.addEventListener("click", () => {

    shop.hidden = true;
});

blueSkinBtn.addEventListener(
    "click",
    () => {

        if(
            ownedSkins.includes(
                "blue"
            )
        ){

            selectedSkin =
                "blue";

            button.style.background =
                "#3b82f6";

        } else {

            if(coins < 50)
                return;

            coins -= 50;

            ownedSkins.push(
                "blue"
            );

            selectedSkin =
                "blue";

            button.style.background =
                "#3b82f6";
        }

        coinsDisplay.textContent =
            coins;

        localStorage.setItem(
            "coins",
            coins
        );

        localStorage.setItem(
            "selectedSkin",
            selectedSkin
        );

        localStorage.setItem(
            "ownedSkins",
            JSON.stringify(
                ownedSkins
            )
        );

        localStorage.setItem(
    "skin",
    "#3b82f6"
);

        updateShopUI();
    }
);

goldSkinBtn.addEventListener(
    "click",
    () => {

        if(
            ownedSkins.includes(
                "gold"
            )
        ){

            selectedSkin =
                "gold";

            button.style.background =
                "gold";

        } else {

            if(coins < 100)
                return;

            coins -= 100;

            ownedSkins.push(
                "gold"
            );

            selectedSkin =
                "gold";

            button.style.background =
                "gold";
        }

        coinsDisplay.textContent =
            coins;

        localStorage.setItem(
            "coins",
            coins
        );

        localStorage.setItem(
            "selectedSkin",
            selectedSkin
        );

        localStorage.setItem(
            "ownedSkins",
            JSON.stringify(
                ownedSkins
            )
        );

        localStorage.setItem(
            "skin",
            "gold"
        );

        updateShopUI();
    }
);
rainbowSkinBtn.addEventListener(
    "click",
    () => {

        if(
            ownedSkins.includes(
                "rainbow"
            )
        ){

            selectedSkin =
                "rainbow";

            button.style.backgroundImage =
                "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";

        } else {

            if(coins < 250)
                return;

            coins -= 250;

            ownedSkins.push(
                "rainbow"
            );

            selectedSkin =
                "rainbow";

            button.style.backgroundImage =
                "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)";
        }

        coinsDisplay.textContent =
            coins;

        localStorage.setItem(
            "coins",
            coins
        );

        localStorage.setItem(
            "selectedSkin",
            selectedSkin
        );

        localStorage.setItem(
            "ownedSkins",
            JSON.stringify(
                ownedSkins
            )
        );

        localStorage.setItem(
            "skin",
            "linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)"
        );

        updateShopUI();
    }
);

statsBtn.addEventListener("click", () => {

    document.getElementById(
        "gamesPlayedStat"
    ).textContent = gamesPlayed;

    document.getElementById(
        "lifetimeClicksStat"
    ).textContent = lifetimeClicks;

    document.getElementById(
        "lifetimeCoinsStat"
    ).textContent = lifetimeCoins;

    document.getElementById(
    "highestLevelStat"
).textContent = level;

document.getElementById(
    "highScore"
).textContent = highScore;

document.getElementById(
    "accuracy"
).textContent =
    accuracyDisplay.textContent;

document.getElementById(
    "misses"
).textContent = misses;

statsScreen.hidden = false;
});

closeStats.addEventListener("click", () => {

    statsScreen.hidden = true;
});

difficultySelect.addEventListener(
    "change",
    applyDifficulty
);

setInterval(() => {

    if(gameOver || gamePaused)
        return;

    const roll =
        Math.random();

    if(roll < 0.33){

        showPowerup("xp");
    }

    else if(roll < 0.66){

        showPowerup("coins");
    }

    else{

        showPowerup("slow");
    }

}, 20000);

setInterval(() => {

    if(doubleXP && doubleXPTime > 0)
        doubleXPTime--;

    if(doubleCoins && doubleCoinsTime > 0)
        doubleCoinsTime--;

    if(slowButton && slowButtonTime > 0)
        slowButtonTime--;

    updatePowerupStatus();

}, 1000);

playBtn.addEventListener(
    "click",
    () => {

        mainMenu.hidden = true;

        layout.hidden = false;

        startTimer();
    }
);

menuStatsBtn.addEventListener(
    "click",
    () => {

        statsScreen.hidden = false;
    }
);

menuShopBtn.addEventListener(
    "click",
    () => {

        shop.hidden = false;
    }
);
