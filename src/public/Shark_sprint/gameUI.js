document.addEventListener("DOMContentLoaded", () => {
    // Create UI elements dynamically
    const startMenu = document.createElement('div');
    startMenu.id = 'startMenu';
    startMenu.innerHTML = `
        <div id="menuBox">
            <h1>SHARK SPRINT</h1>
            <input type="text" id="usernameInput" placeholder="Enter your username">
            <button id="startGameBtn">Start Game</button>
            <button id="leaderboardBtn">Leaderboard</button>
        </div>
    `;

    document.body.appendChild(startMenu);

    // Style the UI
    const style = document.createElement('style');
    style.innerHTML = `
        body {
            font-family: Arial, sans-serif;
        }
        #startMenu, #leaderboardMenu {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.8); display: flex;
            align-items: center; justify-content: center;
            flex-direction: column; color: white;
        }
        #menuBox, #leaderboardBox {
            background: #222; padding: 20px; border-radius: 10px;
            text-align: center; box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
        }
        #usernameInput {
            padding: 10px; width: 80%; margin-bottom: 10px; border-radius: 5px;
            border: none; text-align: center;
        }
        button {
            padding: 10px; margin: 5px; cursor: pointer; border: none;
            border-radius: 5px; background: #007bff; color: white;
            font-size: 16px;
        }
        button:hover {
            background: #0056b3;
        }
    `;
    document.head.appendChild(style);

    // Leaderboard UI
    const leaderboardMenu = document.createElement('div');
    leaderboardMenu.id = 'leaderboardMenu';
    leaderboardMenu.style.display = 'none';
    leaderboardMenu.innerHTML = `
        <div id="leaderboardBox">
            <h1>Leaderboard</h1>
            <div id="leaderboardContent"></div>
            <button id="backBtn">Back</button>
        </div>
    `;
    document.body.appendChild(leaderboardMenu);

    async function fetchAndShowLeaderboard() {
        const leaderboardContent = document.getElementById('leaderboardContent');
        leaderboardContent.innerHTML = '<p>Loading...</p>';
        
        try {
            const response = await fetch("/leaderboard");
            const leaderboard = await response.json();

            leaderboardContent.innerHTML = leaderboard.map((player, index) => `
                <p>${index + 1}. ${player.username} - ${player.highScore}</p>`
            ).join('') || '<p>No scores yet.</p>';
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            leaderboardContent.innerHTML = '<p>Failed to load leaderboard</p>';
        }
        
        startMenu.style.display = 'none';
        leaderboardMenu.style.display = 'flex';
    }

    document.getElementById('backBtn').addEventListener('click', () => {
        leaderboardMenu.style.display = 'none';
        startMenu.style.display = 'flex';
    });

    // Event Listeners
    document.getElementById('startGameBtn').addEventListener('click', () => {
        const username = document.getElementById('usernameInput').value.trim();
        
        if (username) {
            localStorage.setItem("username", username);
            startMenu.style.display = 'none';
            
            if (typeof updateGame === "function") {
                updateGame(); // Ensure updateGame is defined before calling it
            } else {
                console.error("updateGame function is not defined.");
            }
        } else {
            alert("Please enter a username to start the game.");
        }
    });

    document.getElementById('leaderboardBtn').addEventListener('click', fetchAndShowLeaderboard);
});
