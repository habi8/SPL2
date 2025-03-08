const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

// Background images for different levels
const backgrounds = ['background.webp', 'twilight.jpg', 'midnight.png'];
let gameLevel = 1;
let score = 0;
let sharkInterval = 5000;
let octopusInterval = 8000;
let trashInterval = 8000;
let spawnOctopus = false;
let spawnSquid = false;
let isPaused = false;
let isGameRunning = false;


// Load images safely
let backgroundImage = new Image();
backgroundImage.src = backgrounds[0];
backgroundImage.onload = updateGame;  // Ensures game starts after background loads

const playerImage = new Image();
playerImage.src = 'player.png';

const sharkImage = new Image();
sharkImage.src = 'shark.png';

const octopusImage = new Image();
octopusImage.src = 'octopus.png';

const squidImage = new Image();
squidImage.src = 'squid.png';

const trashImage = new Image();
trashImage.src = 'plastic.png';


//let username = localStorage.getItem("shark_sprint_username") || null;

async function askForUsername() {
    
    let username = localStorage.getItem("username");

    while (!username) {
        username = prompt("Enter your username:");
        if (username) {
            localStorage.setItem("username", username);
            return username;  // Return the username after it's set
        } else {
            alert("Username is required to play!");
        }
    }

    return username;
}


//let username = askForUsername();

  // Declare globally

async function startGame() {
    
    username = await askForUsername();  // Wait for a valid username
    console.log("Username set:", username);  // Debugging


    updateGame(); // Now start the game
}

startGame(); // Call it when the script loads
 // Call it to start the game properly


async function saveScore(score) {
    try {
        const response = await fetch("/save-score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, score })
        });

        const data = await response.json();
        console.log("Save Score Response:", data.message);
    } catch (error) {
        console.error("Error saving score:", error);
    }
}

async function fetchLeaderboard() {
    try {
        const response = await fetch("/leaderboard");
        const leaderboard = await response.json();

        if (!Array.isArray(leaderboard)) {
            console.error("Invalid leaderboard response:", leaderboard);
            return;
        }

        let leaderboardText = "🏆 LEADERBOARD 🏆\n\n";
        leaderboard.forEach((player, index) => {
            leaderboardText += `${index + 1}. ${player.username} - ${player.highScore}\n`;
        });

        alert(leaderboardText); // Replace with in-game UI if needed
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        togglePause();
    } else if (isPaused && e.key === 'Enter') {
        quitGame(); // Call quitGame() when Enter is pressed
    }
    else if (isPaused && e.key === ' '){
        fetchLeaderboard();
    }
});

function togglePause() {
    isPaused = !isPaused;
    if (!isPaused) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateGame(); // Resume game properly
    } else {
        drawPauseMenu(); // Show pause menu
    }
}

function quitGame() {
   
    localStorage.removeItem("username"); // Clear stored username
    window.location.href='/' // Reload game to prompt for username again// Change this to your actual homepage URL
}



function drawPauseMenu() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Paused', canvas.width / 2, canvas.height / 2 - 40);
    ctx.fillText('Press ESC to Resume', canvas.width / 2, canvas.height / 2);
    ctx.fillText('Press ENTER to Quit', canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press SPACE for Leaderboard', canvas.width / 2, canvas.height / 2 + 80);
}

// Player Class
class Player {
    constructor() {
        this.x = 50;
        this.y = canvas.height / 2;
        this.width = 70;
        this.height = 50;
        this.dx = 0;
        this.dy = 0;
        this.gravity = 0.3;
    }
    draw() {
        ctx.drawImage(playerImage, this.x, this.y, this.width, this.height);
    }
    move(direction) {
        if (direction === 'up') this.dy = -5;
        if (direction === 'down') this.dy = 5;
        if (direction === 'forward') this.dx = 2;
        if (direction === 'backward') this.dx = -2;
    }
    update() {
        this.dy += this.gravity;
        this.y += this.dy;
        this.x += this.dx;

        // Keep player inside bounds
        if (this.y <= 0 || this.y >= canvas.height - this.height) {
            gameOver(); // Trigger game over
        }

        // Keep player inside left & right bounds
        if (this.x > canvas.width - this.width) this.x = canvas.width - this.width;
        if (this.x < 0) this.x = 0;
    }
}
function gameOver() {
    saveScore(score);  // Save the final score
    alert('Game Over! You hit the boundary. Your final score: ' + score);
    document.location.reload();  // Restart the game
}
// Enemy Class
class Enemy {
    constructor(image) {
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - 60);
        this.width = 80;
        this.height = 40;
        this.speed = Math.random() * 2 + 2;
        this.image = image;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    move() {
        this.x -= this.speed;
        if (this.x < -this.width) {
            this.x = canvas.width;
            this.y = Math.random() * (canvas.height - 60);
            this.speed = Math.random() * 2 + 2;
        }
    }
}

// Trash Class
class Trash {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.width = 30;
        this.height = 30;
    }
    draw() {
        ctx.drawImage(trashImage, this.x, this.y, this.width, this.height);
    }
}

let player = new Player();
let enemies = [new Enemy(sharkImage)];
let trashItems = [new Trash()];

function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 20, 30);
}

function checkCollisions() {
    // Trash collection
    trashItems = trashItems.filter(trash => {
        if (
            player.x < trash.x + trash.width &&
            player.x + player.width > trash.x &&
            player.y < trash.y + trash.height &&
            player.y + player.height > trash.y
        ) {
            score += 500;
            saveScore(score)
            return false;
        }
        return true;
    });

    // Enemy collision (Game Over)
    enemies.forEach(enemy => {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            saveScore(score); 
            alert('Game Over! Your final score: ' + score);
            document.location.reload();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') player.move('up');
    if (e.key === 'ArrowDown') player.move('down');
    if (e.key === 'ArrowRight') player.move('forward');
    if (e.key === 'ArrowLeft') player.move('backward');
});

// Spawn enemies at intervals
setInterval(() => {
    enemies.push(new Enemy(sharkImage));
}, sharkInterval);

setInterval(() => {
    if (spawnOctopus) enemies.push(new Enemy(octopusImage));
}, octopusInterval);

setInterval(() => {
    if (spawnSquid) enemies.push(new Enemy(squidImage));
}, sharkInterval);

// Spawn trash
setInterval(() => {
    trashItems.push(new Trash());
}, trashInterval);

function updateGameSettings() {
    if (score >= 2000 && score < 4000) {
        sharkInterval = 6000;
        octopusInterval = 6000;
        trashInterval = 10000;
        spawnOctopus = true;
    } else if (score >= 4000 && score < 8000) {
        sharkInterval = 8000;
        spawnOctopus = true;
        spawnSquid = true;
        trashInterval = 10000;
    } else if (score >= 8000) {
        alert('Congratulations! You have won the game!');
        document.location.reload();
    }
}

function updateGame() {
    if (isPaused || isGameRunning) return; // Prevent multiple loops
    isGameRunning = true;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground();
    updateGameSettings(); 
    player.update();
    player.draw();
    
    enemies.forEach(enemy => {
        enemy.move();
        enemy.draw();
    });

    trashItems.forEach(trash => trash.draw());
    checkCollisions();
    drawScore();

    requestAnimationFrame(() => {
        isGameRunning = false;
        updateGame();
    });

}