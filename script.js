const button = document.getElementById("runawayBtn");
const scoreDisplay = document.getElementById("score");
const missesDisplay = document.getElementById("misses");
const accuracyDisplay = document.getElementById("accuracy");
const highScoreDisplay = document.getElementById("highScore");
const timerDisplay = document.getElementById("timer");
const message = document.getElementById("message");
const fakeContainer = document.getElementById("fakeContainer");

let score = 0;
let misses = 0;
let totalAttempts = 0;
let dangerDistance = 35;
let gameOver = false;
let gamePaused = false;
let fakeButtonsCreated = false;

let highScore =
    parseInt(localStorage.getItem("highScore")) || 0;

highScoreDisplay.textContent = highScore;

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

function teleportButton() {

    const rect = button.getBoundingClientRect();

    const maxX =
        window.innerWidth - rect.width;

    const maxY =
        window.innerHeight - rect.height;

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

        fake.style.left =
            Math.random() *
            (window.innerWidth - 150) + "px";

        fake.style.top =
            Math.random() *
            (window.innerHeight - 150) + "px";

        fake.addEventListener("click", () => {

            message.textContent =
                "Wrong button 😂";

        });

        fakeContainer.appendChild(fake);
    }
}

document.addEventListener("mousemove", (e) => {

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

        const escapeDistance = 150;

        let newX =
            button.offsetLeft -
            (dx / distance) *
            escapeDistance;

        let newY =
            button.offsetTop -
            (dy / distance) *
            escapeDistance;

        newX = Math.max(
            0,
            Math.min(
                newX,
                window.innerWidth - rect.width
            )
        );

        newY = Math.max(
            0,
            Math.min(
                newY,
                window.innerHeight - rect.height
            )
        );

        button.style.left = newX + "px";
        button.style.top = newY + "px";

        randomTaunt();
    }
});

button.addEventListener("touchstart", (e) => {

    e.preventDefault();

    if (!gameOver) {
        teleportButton();
    }
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

    score++;
    totalAttempts++;

    scoreDisplay.textContent = score;

    updateAccuracy();

    message.textContent =
        `You got me! Score: ${score}`;

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

        dangerDistance = 50;

        message.textContent =
            "Level 2 Unlocked!";
    }

    if (score === 6) {

        dangerDistance = 70;

        button.style.scale = "0.9";

        message.textContent =
            "Level 3!";
    }

    if (score === 10) {

        dangerDistance = 100;

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

    screen.removeAttribute("hidden");

    document.getElementById(
        "finalScore"
    ).textContent = score;

    document.getElementById(
        "finalMisses"
    ).textContent = misses;
}

let timeLeft = 60;

const timer = setInterval(() => {

    if (gameOver || gamePaused)
    return;

    timeLeft--;

    timerDisplay.textContent =
        timeLeft;

    if (timeLeft <= 0) {

        gameOver = true;

        clearInterval(timer);

        showGameOver();

        message.textContent =
            "Game Over!";
    }

}, 1000);

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