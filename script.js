const button = document.getElementById("runawayBtn");
const scoreDisplay = document.getElementById("score");

// Create message display
const message = document.getElementById("message");

let score = 0;
let dangerDistance = 35;

const taunts = [
    "Too slow!",
    "Nice try!",
    "You'll never catch me!",
    "Skill issue.",
    "Almost!",
    "Keep trying!",
    "Was that your best?",
    "Not even close!"
];

function randomTaunt() {
    const index = Math.floor(Math.random() * taunts.length);
    message.textContent = taunts[index];
}

function teleportButton() {

    const rect = button.getBoundingClientRect();

    const maxX = window.innerWidth - rect.width;
    const maxY = window.innerHeight - rect.height;

    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    button.style.left = newX + "px";
    button.style.top = newY + "px";

    randomTaunt();
}

// Mouse avoidance
document.addEventListener("mousemove", (e) => {

    const rect = button.getBoundingClientRect();

    const buttonX = rect.left + rect.width / 2;
    const buttonY = rect.top + rect.height / 2;

    const dx = e.clientX - buttonX;
    const dy = e.clientY - buttonY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < dangerDistance) {
        teleportButton();
    }
});

// Touchscreen support
button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    teleportButton();
});

// Successful click
button.addEventListener("click", () => {

    score++;
    scoreDisplay.textContent = score;

    message.textContent = `You got me! Score: ${score}`;

    // Level system
    if (score === 3) {
        dangerDistance = 50;
        message.textContent = "Level 2 Unlocked!";
    }

    if (score === 6) {
        dangerDistance = 70;
        button.style.transform = "scale(0.9)";
        message.textContent = "Level 3: Faster escapes!";
    }

    if (score === 10) {
        dangerDistance = 100;
        button.style.transform = "scale(0.8)";
        message.textContent = "Level 4: Good luck.";
    }

    // Move after click
    setTimeout(() => {
        teleportButton();
    }, 200);
});

// Welcome message
message.textContent = "Catch the button if you can!";